from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

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

    @classmethod
    def request_status_map_for(cls, user) -> dict:
        outgoing = set(cls.objects.filter(
            sender=user, status=cls.Status.PENDING,
        ).values_list('receiver_id', flat=True))
        incoming = set(cls.objects.filter(
            receiver=user, status=cls.Status.PENDING,
        ).values_list('sender_id', flat=True))
        return {
            **{uid: 'pending' for uid in outgoing},
            **{uid: 'received' for uid in incoming},
        }

    def reject(self, receiver) -> None:
        if self.receiver != receiver:
            raise ValueError("Only the receiver can reject a request.")
        self.status = self.Status.REJECTED
        self.save(update_fields=['status'])

    @classmethod
    def send_or_accept(cls, sender, receiver) -> str:
        with transaction.atomic():
            mutual = cls.objects.filter(
                sender=receiver,
                receiver=sender,
                status=cls.Status.PENDING,
            ).first()
            if mutual:
                mutual.status = cls.Status.ACCEPTED
                mutual.save(update_fields=['status'])
                Partner.objects.get_or_create(user=sender, partner=receiver)
                Partner.objects.get_or_create(user=receiver, partner=sender)
                return cls.Status.ACCEPTED
            partner_request = cls.objects.create(
                sender=sender,
                receiver=receiver,
                status=cls.Status.PENDING,
            )
            return partner_request.status


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

    @classmethod
    def remove(cls, user, partner_user) -> None:
        with transaction.atomic():
            cls.objects.filter(user=user, partner=partner_user).delete()
            cls.objects.filter(user=partner_user, partner=user).delete()

    @classmethod
    def effective_request_status(cls, user, candidate) -> str:
        if cls.objects.filter(user=user, partner=candidate).exists():
            return 'partner'
        status_map = PartnerRequest.request_status_map_for(user)
        return status_map.get(candidate.id, 'none')

    @classmethod
    def suggested_candidates_for(cls, user):
        existing_partner_ids = cls.objects.filter(
            user=user,
        ).values_list('partner_id', flat=True)
        rejected_by_me = PartnerRequest.objects.filter(
            sender=user, status=PartnerRequest.Status.REJECTED,
        ).values_list('receiver_id', flat=True)
        rejected_me = PartnerRequest.objects.filter(
            receiver=user, status=PartnerRequest.Status.REJECTED,
        ).values_list('sender_id', flat=True)
        return (
            User.objects
            .filter(partner_profile__is_discoverable=True)
            .exclude(pk=user.pk)
            .exclude(pk__in=existing_partner_ids)
            .exclude(pk__in=rejected_by_me)
            .exclude(pk__in=rejected_me)
            .select_related('profile', 'partner_profile', 'level__current_level', 'presence')
        )


class PartnerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='partner_profile',
    )
    bio = models.TextField(blank=True, default='')
    total_partners = models.PositiveIntegerField(default=0)
    is_heritage_speaker = models.BooleanField(default=False)
    availability = models.CharField(max_length=100, blank=True, default='')
    preferred_format = models.CharField(max_length=100, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    is_discoverable = models.BooleanField(default=False)

    def match_score_with(self, other: 'PartnerProfile') -> int:
        score = 0
        if self.is_heritage_speaker != other.is_heritage_speaker:
            score += 40
        if self.preferred_format and self.preferred_format == other.preferred_format:
            score += 30
        if self.availability and self.availability == other.availability:
            score += 30
        return score

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

    @classmethod
    def get_current(cls):
        now = timezone.now()
        return (
            cls.objects
            .filter(starts_at__lte=now, ends_at__gte=now)
            .select_related('reward_badge')
            .first()
        )


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

    @property
    def is_currently_online(self) -> bool:
        from datetime import timedelta
        from django.utils import timezone
        return self.last_active >= timezone.now() - timedelta(minutes=5)

    @classmethod
    def mark_online(cls, user) -> None:
        obj, _ = cls.objects.get_or_create(user=user)
        obj.is_online = True
        obj.save()

    @classmethod
    def online_count(cls) -> int:
        from datetime import timedelta
        from django.utils import timezone
        cutoff = timezone.now() - timedelta(minutes=5)
        return cls.objects.filter(last_active__gte=cutoff, is_online=True).count()


@receiver(post_save, sender=User)
def create_partner_profile(sender, instance, created, **kwargs):
    if created:
        PartnerProfile.objects.get_or_create(user=instance)
