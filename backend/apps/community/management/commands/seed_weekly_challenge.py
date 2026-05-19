from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.community.models import WeeklyChallenge
from apps.users.models import Achievement


class Command(BaseCommand):
    help = 'Seed an Achievement and a current-week WeeklyChallenge (idempotent)'

    def handle(self, *args, **options):
        badge, created = Achievement.objects.get_or_create(
            key='gold_partner_badge',
            defaults={
                'title': 'Gold Partner Badge',
                'icon': 'https://example.com/badges/gold_partner.png',
                'description': 'Awarded to the top XP earner in the weekly leaderboard challenge.',
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created Achievement: Gold Partner Badge'))
        else:
            self.stdout.write('Achievement already exists — skipped')

        now = timezone.now()
        week_start = (now - timedelta(days=now.weekday())).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        week_end = (week_start + timedelta(days=6)).replace(
            hour=23, minute=59, second=59, microsecond=0
        )

        challenge, created = WeeklyChallenge.objects.get_or_create(
            starts_at=week_start,
            defaults={
                'title': 'Top 3 earners get a Gold Partner Badge',
                'reward_badge': badge,
                'ends_at': week_end,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS(
                f'Created WeeklyChallenge: {challenge.title} '
                f'({week_start.date()} → {week_end.date()})'
            ))
        else:
            self.stdout.write('WeeklyChallenge for this week already exists — skipped')
