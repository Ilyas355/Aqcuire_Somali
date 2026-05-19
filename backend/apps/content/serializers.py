from rest_framework import serializers

from .models import Story, StoryCategory, StoryLine, StoryQuizQuestion, StoryTip


class StoryTipSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryTip
        fields = ['id', 'tip_text', 'explanation']


class StoryLineSerializer(serializers.ModelSerializer):
    tips = StoryTipSerializer(many=True, read_only=True)

    class Meta:
        model = StoryLine
        fields = ['id', 'somali', 'english', 'speaker_name', 'audio_url', 'timestamp_seconds', 'order', 'tips']


class StoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryCategory
        fields = ['id', 'name']


class StoryQuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryQuizQuestion
        fields = ['id', 'question_text', 'correct_answer', 'distractor_1', 'distractor_2', 'distractor_3', 'order']


class StoryListSerializer(serializers.ModelSerializer):
    category = StoryCategorySerializer(read_only=True)
    is_completed = serializers.SerializerMethodField()
    last_line_position = serializers.SerializerMethodField()
    is_locked = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'description', 'category', 'difficulty',
            'duration_seconds', 'xp_reward', 'is_trending', 'order',
            'audio_url', 'is_completed', 'last_line_position', 'is_locked',
        ]

    def _get_progress(self, obj):
        return self.context.get('progress_map', {}).get(obj.id)

    def get_is_completed(self, obj):
        progress = self._get_progress(obj)
        return progress.is_completed if progress else False

    def get_last_line_position(self, obj):
        progress = self._get_progress(obj)
        return progress.last_line_position if progress else 0

    def get_is_locked(self, obj):
        difficulty = obj.difficulty.lower()
        completed = self.context.get('completed_difficulties', set())
        if difficulty == 'beginner':
            return False
        if difficulty == 'intermediate':
            return 'beginner' not in completed
        if difficulty == 'advanced':
            return 'intermediate' not in completed
        return False


class StoryDetailSerializer(serializers.ModelSerializer):
    category = StoryCategorySerializer(read_only=True)
    lines = StoryLineSerializer(many=True, read_only=True)
    last_line_position = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'description', 'category', 'difficulty',
            'duration_seconds', 'xp_reward', 'is_trending', 'order',
            'audio_url', 'last_line_position', 'lines',
        ]

    def get_last_line_position(self, obj):
        progress = self.context.get('progress_map', {}).get(obj.id)
        return progress.last_line_position if progress else 0
