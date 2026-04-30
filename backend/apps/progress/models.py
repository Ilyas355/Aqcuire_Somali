from django.contrib.auth.models import User
from django.db import models

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
