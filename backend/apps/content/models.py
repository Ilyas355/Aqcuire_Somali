from django.contrib.auth.models import User
from django.db import models


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
    audio_url = models.URLField(blank=True)
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
