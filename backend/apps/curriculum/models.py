from django.db import models


class Section(models.Model):
    title = models.CharField(max_length=200)
    category_tag = models.CharField(max_length=100)
    description = models.TextField()
    xp_reward = models.PositiveIntegerField()
    order = models.PositiveIntegerField()
    unlock_requires = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='required_by',
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.title}"


class Subtopic(models.Model):
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='subtopics',
        db_index=True,
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.section.title} — {self.title}"


class Phrase(models.Model):
    subtopic = models.ForeignKey(
        Subtopic,
        on_delete=models.CASCADE,
        related_name='phrases',
        db_index=True,
    )
    somali = models.CharField(max_length=500)
    english = models.CharField(max_length=500)
    audio_url = models.URLField(blank=True)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.somali} / {self.english}"


class GrammarNote(models.Model):
    phrase = models.ForeignKey(
        Phrase,
        on_delete=models.CASCADE,
        related_name='grammar_notes',
    )
    note = models.TextField()

    def __str__(self):
        return f"Note for: {self.phrase.somali}"


class KeyPattern(models.Model):
    subtopic = models.ForeignKey(
        Subtopic,
        on_delete=models.CASCADE,
        related_name='key_patterns',
    )
    somali_pattern = models.CharField(max_length=200)
    english_pattern = models.CharField(max_length=200)
    breakdown = models.CharField(max_length=200)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.somali_pattern} — {self.english_pattern}"


class CommonMistake(models.Model):
    subtopic = models.ForeignKey(
        Subtopic,
        on_delete=models.CASCADE,
        related_name='common_mistakes',
    )
    wrong = models.CharField(max_length=300)
    correct = models.CharField(max_length=300)
    explanation = models.TextField()

    def __str__(self):
        return f"✗ {self.wrong} → ✓ {self.correct}"


class SurvivalLine(models.Model):
    subtopic = models.ForeignKey(
        Subtopic,
        on_delete=models.CASCADE,
        related_name='survival_lines',
    )
    somali = models.CharField(max_length=300)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.somali


class QuizQuestion(models.Model):
    class Layer(models.TextChoices):
        RECOGNITION = 'recognition', 'Recognition'
        RECALL = 'recall', 'Recall'
        PRODUCTION = 'production', 'Production'

    phrase = models.ForeignKey(
        Phrase,
        on_delete=models.CASCADE,
        related_name='quiz_questions',
        db_index=True,
    )
    layer = models.CharField(max_length=20, choices=Layer.choices, db_index=True)
    question_text = models.TextField()
    correct_answer = models.CharField(max_length=500)
    distractor_1 = models.CharField(max_length=500)
    distractor_2 = models.CharField(max_length=500)
    distractor_3 = models.CharField(max_length=500)

    def __str__(self):
        return f"[{self.layer}] {self.question_text[:60]}"
