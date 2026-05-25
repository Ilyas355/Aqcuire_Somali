from django.contrib.auth.models import User
from django.db import models
from django.db.models import F


class StoryCategory(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Story(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(
        StoryCategory,
        on_delete=models.CASCADE,
        related_name='stories',
        db_index=True,
    )
    difficulty = models.CharField(max_length=50)
    duration_seconds = models.PositiveIntegerField()
    xp_reward = models.PositiveIntegerField()
    is_trending = models.BooleanField(default=False)
    order = models.PositiveIntegerField()
    audio_url = models.URLField(blank=True, default='')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class StoryLine(models.Model):
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='lines',
        db_index=True,
    )
    somali = models.CharField(max_length=500)
    english = models.CharField(max_length=500)
    speaker_name = models.CharField(max_length=100)
    audio_url = models.URLField(blank=True, default='')
    timestamp_seconds = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.speaker_name}: {self.somali[:60]}"


class StoryTip(models.Model):
    story_line = models.ForeignKey(
        StoryLine,
        on_delete=models.CASCADE,
        related_name='tips',
    )
    tip_text = models.TextField()
    explanation = models.TextField()

    def __str__(self):
        return f"Tip for: {self.story_line.somali[:60]}"


class StoryQuizQuestion(models.Model):
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='quiz_questions',
        db_index=True,
    )
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=500)
    distractor_1 = models.CharField(max_length=500)
    distractor_2 = models.CharField(max_length=500)
    distractor_3 = models.CharField(max_length=500)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"[{self.story.title}] {self.question_text[:60]}"


class UserStoryProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='story_progress',
        db_index=True,
    )
    story = models.ForeignKey(
        Story,
        on_delete=models.PROTECT,
        related_name='user_progress',
    )
    is_completed = models.BooleanField(default=False)
    last_line_position = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ['user', 'story']

    def __str__(self):
        return f"{self.user.username} — {self.story.title}"

    @classmethod
    def get_current_for_user(cls, user) -> dict | None:
        in_progress = (
            cls.objects
            .filter(user=user, is_completed=False, last_line_position__gt=0)
            .select_related('story__category')
            .order_by('-story__order')
            .first()
        )
        if in_progress:
            s = in_progress.story
            return {
                'id': s.id, 'title': s.title, 'difficulty': s.difficulty,
                'duration_seconds': s.duration_seconds, 'xp_reward': s.xp_reward,
                'last_line_position': in_progress.last_line_position,
                'is_completed': False, 'category': s.category.name,
            }
        first_story = Story.objects.select_related('category').order_by('order').first()
        if first_story:
            return {
                'id': first_story.id, 'title': first_story.title,
                'difficulty': first_story.difficulty,
                'duration_seconds': first_story.duration_seconds,
                'xp_reward': first_story.xp_reward,
                'last_line_position': 0, 'is_completed': False,
                'category': first_story.category.name,
            }
        return None

    def complete(self, story) -> int:
        if self.is_completed:
            return 0
        from django.db import transaction
        from apps.users.models import UserLevel, UserProfile
        self.is_completed = True
        self.last_line_position = story.lines.count()
        self.save(update_fields=['is_completed', 'last_line_position'])
        xp_awarded = story.xp_reward
        with transaction.atomic():
            UserProfile.objects.filter(user=self.user).update(total_xp=F('total_xp') + xp_awarded)
            try:
                user_level = UserLevel.objects.select_related('current_level').get(user=self.user)
                user_level.apply_xp(xp_awarded)
            except UserLevel.DoesNotExist:
                pass
        return xp_awarded
