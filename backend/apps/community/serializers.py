from django.contrib.auth.models import User
from rest_framework import serializers

from apps.users.models import UserProfile

from .models import Partner, PartnerProfile, WeeklyChallenge


class PublicPartnerProfileSerializer(serializers.ModelSerializer):
    """Visible to non-partners — discord handle excluded."""
    total_partners = serializers.SerializerMethodField()

    class Meta:
        model = PartnerProfile
        fields = ['bio', 'total_partners', 'is_heritage_speaker', 'availability', 'city']

    def get_total_partners(self, obj):
        return obj.user.partners.count()


class PartnerProfileSerializer(serializers.ModelSerializer):
    """Full profile including discord handle — only exposed to actual partners."""
    total_partners = serializers.SerializerMethodField()

    class Meta:
        model = PartnerProfile
        fields = ['bio', 'total_partners', 'is_heritage_speaker', 'availability', 'preferred_format', 'city']

    def get_total_partners(self, obj):
        return obj.user.partners.count()


class PartnerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerProfile
        fields = ['bio', 'is_heritage_speaker', 'availability', 'preferred_format', 'city']

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if not instance.is_discoverable:
            instance.is_discoverable = True
            instance.save(update_fields=['is_discoverable'])
        return instance


class SuggestedPartnerSerializer(serializers.ModelSerializer):
    handle = serializers.CharField(source='profile.handle')
    avatar = serializers.URLField(source='profile.avatar')
    total_xp = serializers.IntegerField(source='profile.total_xp')
    partner_profile = PublicPartnerProfileSerializer(read_only=True)
    request_status = serializers.SerializerMethodField()
    match_percentage = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()
    current_section = serializers.SerializerMethodField()
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'handle', 'avatar', 'total_xp',
            'partner_profile', 'request_status', 'match_percentage',
            'level_name', 'current_section', 'is_online',
        ]

    def get_request_status(self, obj):
        return self.context.get('request_status_map', {}).get(obj.id, 'none')

    def get_match_percentage(self, obj):
        requester_pp = self.context.get('requester_partner_profile')
        candidate_pp = getattr(obj, 'partner_profile', None)
        if not candidate_pp or not requester_pp:
            return 0
        return candidate_pp.match_score_with(requester_pp)

    def get_level_name(self, obj):
        try:
            return obj.level.current_level.name
        except AttributeError:
            return None

    def get_current_section(self, obj):
        from apps.progress.models import UserSectionProgress
        return UserSectionProgress.current_title_for(obj)

    def get_is_online(self, obj):
        try:
            return obj.presence.is_currently_online
        except AttributeError:
            return False


class MyPartnerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='partner.id')
    username = serializers.CharField(source='partner.username')
    handle = serializers.CharField(source='partner.profile.handle')
    avatar = serializers.URLField(source='partner.profile.avatar')
    partner_profile = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ['id', 'username', 'handle', 'avatar', 'partner_profile', 'connected_at']

    def get_partner_profile(self, obj):
        try:
            return PartnerProfileSerializer(obj.partner.partner_profile).data
        except AttributeError:
            return {'bio': '', 'total_partners': 0,
                    'is_heritage_speaker': False, 'availability': '', 'preferred_format': '', 'city': ''}


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    xp = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'handle', 'avatar', 'xp', 'city']

    def get_xp(self, obj):
        if hasattr(obj, 'weekly_xp'):
            return obj.weekly_xp
        return obj.total_xp

    def get_city(self, obj):
        try:
            return obj.user.partner_profile.city
        except AttributeError:
            return ''


class SuggestedPartnerDetailSerializer(SuggestedPartnerSerializer):
    current_streak = serializers.IntegerField(source='profile.current_streak')
    is_diaspora = serializers.BooleanField(source='profile.is_diaspora')
    partner_profile = serializers.SerializerMethodField()

    class Meta(SuggestedPartnerSerializer.Meta):
        fields = SuggestedPartnerSerializer.Meta.fields + ['current_streak', 'is_diaspora']

    def get_partner_profile(self, obj):
        pp = getattr(obj, 'partner_profile', None)
        if not pp:
            return None
        if self.context.get('viewer_is_partner'):
            return PartnerProfileSerializer(pp).data
        return PublicPartnerProfileSerializer(pp).data


class WeeklyChallengeSerializer(serializers.ModelSerializer):
    reward_badge = serializers.CharField(source='reward_badge.title')

    class Meta:
        model = WeeklyChallenge
        fields = ['id', 'title', 'reward_badge', 'starts_at', 'ends_at']
