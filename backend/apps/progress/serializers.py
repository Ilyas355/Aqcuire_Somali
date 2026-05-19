from rest_framework import serializers

from apps.curriculum.models import Phrase

from .models import UserSubtopicProgress, VocabReview


class PhraseMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phrase
        fields = ['id', 'somali', 'english', 'audio_url']


class VocabDueSerializer(serializers.ModelSerializer):
    phrase = PhraseMinimalSerializer(read_only=True)

    class Meta:
        model = VocabReview
        fields = ['id', 'phrase', 'next_review', 'interval', 'ease_factor', 'repetitions']


class SubtopicProgressUpdateSerializer(serializers.Serializer):
    current_step = serializers.ChoiceField(choices=UserSubtopicProgress.Step.choices)
    phrases_completed = serializers.IntegerField(min_value=0)
    is_completed = serializers.BooleanField(default=False)


class QuizSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer_given = serializers.CharField(max_length=500)


class VocabReviewSerializer(serializers.Serializer):
    quality = serializers.IntegerField(min_value=0, max_value=5)
