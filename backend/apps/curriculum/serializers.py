from rest_framework import serializers

from .models import (
    CommonMistake,
    GrammarNote,
    KeyPattern,
    Phrase,
    QuizQuestion,
    Section,
    SurvivalLine,
    Subtopic,
)


class GrammarNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrammarNote
        fields = ['id', 'note']


class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = [
            'id', 'layer', 'question_text', 'correct_answer',
            'distractor_1', 'distractor_2', 'distractor_3',
        ]


class KeyPatternSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyPattern
        fields = ['id', 'somali_pattern', 'english_pattern', 'breakdown', 'order']


class CommonMistakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonMistake
        fields = ['id', 'wrong', 'correct', 'explanation']


class SurvivalLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurvivalLine
        fields = ['id', 'somali', 'order']


class PhraseSerializer(serializers.ModelSerializer):
    grammar_notes = GrammarNoteSerializer(many=True, read_only=True)
    quiz_questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Phrase
        fields = ['id', 'somali', 'english', 'audio_url', 'order', 'grammar_notes', 'quiz_questions']


class SubtopicSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtopic
        fields = ['id', 'title', 'description', 'order']


class SubtopicDetailSerializer(serializers.ModelSerializer):
    phrases = PhraseSerializer(many=True, read_only=True)
    key_patterns = KeyPatternSerializer(many=True, read_only=True)
    common_mistakes = CommonMistakeSerializer(many=True, read_only=True)
    survival_lines = SurvivalLineSerializer(many=True, read_only=True)

    class Meta:
        model = Subtopic
        fields = [
            'id', 'title', 'description', 'order',
            'phrases', 'key_patterns', 'common_mistakes', 'survival_lines',
        ]


class SectionSerializer(serializers.ModelSerializer):
    subtopics = SubtopicSummarySerializer(many=True, read_only=True)
    is_unlocked = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    subtopics_completed = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = [
            'id', 'title', 'category_tag', 'description', 'xp_reward', 'order',
            'subtopics', 'is_unlocked', 'is_completed', 'subtopics_completed',
        ]

    def _get_progress(self, obj):
        return self.context.get('progress_map', {}).get(obj.id)

    def get_is_unlocked(self, obj):
        if obj.order == 1:
            return True
        progress = self._get_progress(obj)
        return progress.is_unlocked if progress else False

    def get_is_completed(self, obj):
        progress = self._get_progress(obj)
        return progress.is_completed if progress else False

    def get_subtopics_completed(self, obj):
        progress = self._get_progress(obj)
        return progress.subtopics_completed if progress else 0
