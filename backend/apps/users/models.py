import random
import string

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    handle = models.CharField(max_length=50, unique=True)
    avatar = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    is_diaspora = models.BooleanField(default=False)
    joined_date = models.DateTimeField(auto_now_add=True)
    total_xp = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True, db_index=True)
    daily_reminder_time = models.TimeField(null=True, blank=True)
    audio_autoplay = models.BooleanField(default=True)
    dark_mode = models.BooleanField(default=True)
    transliteration = models.BooleanField(default=False)

    def __str__(self):
        return f"@{self.handle} ({self.user.username})"

    @classmethod
    def leaderboard_all_time(cls):
        return cls.objects.select_related('user').order_by('-total_xp')[:50]

    @classmethod
    def leaderboard_this_week(cls):
        from datetime import timedelta
        from django.db.models import Q, Sum
        from django.db.models.functions import Coalesce
        from django.utils import timezone
        now = timezone.now()
        week_start = (now - timedelta(days=now.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        return (
            cls.objects
            .select_related('user')
            .annotate(
                weekly_xp=Coalesce(
                    Sum(
                        'user__quiz_attempts__xp_awarded',
                        filter=Q(user__quiz_attempts__attempted_at__gte=week_start),
                    ),
                    0,
                )
            )
            .order_by('-weekly_xp')[:50]
        )

    @classmethod
    def leaderboard_partners(cls, user):
        from apps.community.models import Partner
        partner_ids = Partner.objects.filter(
            user=user,
        ).values_list('partner_id', flat=True)
        return cls.objects.filter(
            user_id__in=partner_ids,
        ).select_related('user').order_by('-total_xp')[:50]

    @classmethod
    def my_rank_all_time(cls, user):
        try:
            profile = user.profile
        except Exception:
            return None
        rank = cls.objects.filter(total_xp__gt=profile.total_xp).count() + 1
        return {'rank': rank, 'xp': profile.total_xp}

    @classmethod
    def my_rank_this_week(cls, user):
        from datetime import timedelta
        from django.db.models import Q, Sum
        from django.db.models.functions import Coalesce
        from django.utils import timezone
        now = timezone.now()
        week_start = (now - timedelta(days=now.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        try:
            profile = user.profile
        except Exception:
            return None
        my_weekly_xp = (
            user.quiz_attempts
            .filter(attempted_at__gte=week_start)
            .aggregate(total=Coalesce(Sum('xp_awarded'), 0))
        )['total']
        rank = (
            cls.objects
            .annotate(
                weekly_xp=Coalesce(
                    Sum(
                        'user__quiz_attempts__xp_awarded',
                        filter=Q(user__quiz_attempts__attempted_at__gte=week_start),
                    ),
                    0,
                )
            )
            .filter(weekly_xp__gt=my_weekly_xp)
            .count()
        ) + 1
        return {'rank': rank, 'xp': my_weekly_xp}


class Level(models.Model):
    name = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=100)
    description = models.TextField()
    xp_required = models.PositiveIntegerField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.name} — {self.subtitle}"


class UserLevel(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='level')
    current_level = models.ForeignKey(
        Level, on_delete=models.PROTECT, related_name='user_levels')
    xp_into_level = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} — {self.current_level.name}"

    def apply_xp(self, amount: int) -> None:
        self.xp_into_level += amount
        while self.current_level.xp_required > 0 and self.xp_into_level >= self.current_level.xp_required:
            next_level = Level.objects.filter(
                order__gt=self.current_level.order
            ).order_by('order').first()
            if next_level is None:
                self.xp_into_level = self.current_level.xp_required
                break
            self.xp_into_level -= self.current_level.xp_required
            self.current_level = next_level
        self.save(update_fields=['xp_into_level', 'current_level'])


class Achievement(models.Model):
    key = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    icon = models.URLField()
    description = models.TextField()

    def __str__(self):
        return self.title


class UserAchievement(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(
        Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'achievement']

    def __str__(self):
        return f"{self.user.username} — {self.achievement.title}"


class PasswordResetToken(models.Model):
    EXPIRY_MINUTES = 15

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_tokens')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    @classmethod
    def generate_for(cls, user: User) -> 'PasswordResetToken':
        cls.objects.filter(user=user).delete()
        code = ''.join(random.choices(string.digits, k=6))
        return cls.objects.create(user=user, code=code)

    def is_valid(self) -> bool:
        if self.used:
            return False
        return timezone.now() <= self.created_at + timezone.timedelta(minutes=self.EXPIRY_MINUTES)

    def consume(self) -> None:
        self.used = True
        self.save(update_fields=['used'])
