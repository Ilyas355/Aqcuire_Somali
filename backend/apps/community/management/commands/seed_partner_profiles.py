from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.community.models import PartnerProfile


class Command(BaseCommand):
    help = 'Create a PartnerProfile for every user that does not already have one'

    def handle(self, *args, **options):
        users = User.objects.filter(partner_profile__isnull=True)
        count = 0
        for user in users:
            PartnerProfile.objects.create(user=user)
            count += 1
        self.stdout.write(self.style.SUCCESS(f'Created {count} PartnerProfile(s)'))
