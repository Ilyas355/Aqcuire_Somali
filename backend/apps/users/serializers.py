from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from .models import Level, UserLevel, UserProfile


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
        fields = ['name', 'subtitle', 'xp_required']


class UserLevelSerializer(serializers.ModelSerializer):
    current_level = LevelSerializer(read_only=True)

    class Meta:
        model = UserLevel
        fields = ['current_level', 'xp_into_level']


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', required=False)
    level = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'username', 'email',
            'handle', 'avatar', 'location', 'is_diaspora',
            'joined_date', 'total_xp', 'current_streak', 'last_active_date',
            'daily_reminder_time', 'audio_autoplay', 'dark_mode', 'transliteration',
            'level',
        ]
        read_only_fields = ['joined_date', 'total_xp', 'current_streak', 'last_active_date']

    def get_username(self, obj):
        return obj.user.username

    def get_level(self, obj):
        try:
            return UserLevelSerializer(obj.user.level).data
        except UserLevel.DoesNotExist:
            return None

    def update(self, instance, validated_data):
        user_fields = validated_data.pop('user', {})
        if 'email' in user_fields:
            instance.user.email = user_fields['email']
            instance.user.save(update_fields=['email'])
        return super().update(instance, validated_data)
