from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from .models import Achievement, Level, UserAchievement, UserLevel, UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    handle = serializers.CharField(max_length=50, write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'handle']

    def validate_handle(self, value):
        if UserProfile.objects.filter(handle=value).exists():
            raise serializers.ValidationError("This handle is already taken.")
        return value

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    @transaction.atomic
    def create(self, validated_data):
        handle = validated_data.pop('handle')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        UserProfile.objects.create(user=user, handle=handle)
        first_level = Level.objects.order_by('order').first()
        if first_level:
            UserLevel.objects.create(user=user, current_level=first_level)
        return user


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['name', 'subtitle', 'description', 'xp_required', 'order']


class UserLevelSerializer(serializers.ModelSerializer):
    current_level = LevelSerializer(read_only=True)
    level_percentage = serializers.SerializerMethodField()
    next_level_name = serializers.SerializerMethodField()

    class Meta:
        model = UserLevel
        fields = ['current_level', 'xp_into_level', 'level_percentage', 'next_level_name']

    def get_level_percentage(self, obj):
        return obj.level_percentage

    def get_next_level_name(self, obj):
        return obj.next_level_name


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['key', 'title', 'icon', 'description']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = UserAchievement
        fields = ['achievement', 'earned_at']


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', required=False)
    level = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()
    partners_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'username', 'email',
            'handle', 'avatar', 'location', 'is_diaspora',
            'joined_date', 'total_xp', 'current_streak', 'last_active_date',
            'daily_reminder_time', 'audio_autoplay', 'dark_mode', 'transliteration',
            'level', 'achievements', 'partners_count',
        ]
        read_only_fields = ['joined_date', 'total_xp', 'current_streak', 'last_active_date']

    def get_username(self, obj):
        return obj.user.username

    def get_level(self, obj):
        try:
            return UserLevelSerializer(obj.user.level).data
        except UserLevel.DoesNotExist:
            return None

    def get_achievements(self, obj):
        user_achievements = (
            obj.user.achievements
            .select_related('achievement')
            .order_by('earned_at')
        )
        return UserAchievementSerializer(user_achievements, many=True).data

    def get_partners_count(self, obj):
        from apps.community.models import Partner
        return Partner.objects.filter(user=obj.user).count()

    def update(self, instance, validated_data):
        user_fields = validated_data.pop('user', {})
        if 'email' in user_fields:
            instance.user.email = user_fields['email']
            instance.user.save(update_fields=['email'])
        return super().update(instance, validated_data)
