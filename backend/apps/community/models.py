from django.contrib.auth.models import User
from django.db import models

from apps.users.models import Achievement


class PartnerRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_requests',
        db_index=True,
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_requests',
        db_index=True,
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['sender', 'receiver']

    def __str__(self):
        return f"{self.sender.username} → {self.receiver.username} [{self.status}]"


class Partner(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='partners',
        db_index=True,
    )
    partner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='partnered_with',
    )
    sessions_count = models.PositiveIntegerField(default=0)
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'partner']

    def __str__(self):
        return f"{self.user.username} ↔ {self.partner.username}"


class PartnerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='partner_profile',
    )
    bio = models.TextField(blank=True, default='')
    rating = models.FloatField(default=0)
    total_partners = models.PositiveIntegerField(default=0)
    is_heritage_speaker = models.BooleanField(default=False)
    availability = models.CharField(max_length=100, blank=True, default='')
    preferred_format = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"PartnerProfile — {self.user.username}"


class WeeklyChallenge(models.Model):
    title = models.CharField(max_length=200)
    reward_badge = models.ForeignKey(
        Achievement,
        on_delete=models.PROTECT,
        related_name='weekly_challenges',
    )
    starts_at = models.DateTimeField(db_index=True)
    ends_at = models.DateTimeField(db_index=True)

    def __str__(self):
        return self.title


class UserPresence(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='presence',
    )
    is_online = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = 'online' if self.is_online else 'offline'
        return f"{self.user.username} — {status}"
