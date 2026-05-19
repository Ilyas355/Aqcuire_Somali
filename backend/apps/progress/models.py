from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from apps.curriculum.models import Phrase, QuizQuestion, Section, Subtopic


class UserSectionProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='section_progress',
        db_index=True,
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name='user_progress',
    )
    is_unlocked = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    subtopics_completed = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ['user', 'section']

    def __str__(self):
        return f"{self.user.username} — {self.section.title}"

    @classmethod
    def current_title_for(cls, user) -> str | None:
        progress = (
            cls.objects
            .filter(user=user)
            .select_related('section')
            .order_by('-section__order')
            .first()
        )
        return progress.section.title if progress else None


class UserSubtopicProgress(models.Model):
    class Step(models.TextChoices):
        TEMPLATE = 'template', 'Template'
        PRACTICE = 'practice', 'Practice'
        QUIZ = 'quiz', 'Quiz'
        REVIEW = 'review', 'Review'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subtopic_progress',
        db_index=True,
    )
    subtopic = models.ForeignKey(
        Subtopic,
        on_delete=models.PROTECT,
        related_name='user_progress',
    )
    phrases_completed = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    current_step = models.CharField(max_length=20, choices=Step.choices, default=Step.TEMPLATE)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'subtopic']

    def __str__(self):
        return f"{self.user.username} — {self.subtopic.title}"


class QuizAttempt(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_attempts',
        db_index=True,
    )
    question = models.ForeignKey(
        QuizQuestion,
        on_delete=models.PROTECT,
        related_name='attempts',
    )
    answer_given = models.CharField(max_length=500)
    is_correct = models.BooleanField()
    xp_awarded = models.PositiveIntegerField(default=0)
    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        result = 'correct' if self.is_correct else 'wrong'
        return f"{self.user.username} — {result} — {self.question}"


class VocabReview(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='vocab_reviews',
        db_index=True,
    )
    phrase = models.ForeignKey(
        Phrase,
        on_delete=models.PROTECT,
        related_name='vocab_reviews',
    )
    next_review = models.DateTimeField(db_index=True)
    interval = models.PositiveIntegerField(default=1)
    ease_factor = models.FloatField(default=2.5)
    repetitions = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ['user', 'phrase']

    def __str__(self):
        return f"{self.user.username} — {self.phrase.somali}"

    def schedule(self, quality: int) -> None:
        if quality >= 3:
            if self.repetitions == 0:
                self.interval = 1
            elif self.repetitions == 1:
                self.interval = 6
            else:
                self.interval = round(self.interval * self.ease_factor)
            ef = self.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
            self.ease_factor = max(1.3, ef)
            self.repetitions += 1
        else:
            self.interval = 1
            self.repetitions = 0
        self.next_review = timezone.now() + timedelta(days=self.interval)
        self.save(update_fields=['interval', 'ease_factor', 'repetitions', 'next_review'])

    @classmethod
    def queue_phrases(cls, user, subtopic) -> None:
        now = timezone.now()
        for phrase in subtopic.phrases.all():
            cls.objects.get_or_create(
                user=user,
                phrase=phrase,
                defaults={'next_review': now, 'interval': 1, 'ease_factor': 2.5, 'repetitions': 0},
            )
