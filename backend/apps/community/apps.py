from django.apps import AppConfig


class CommunityConfig(AppConfig):
    name = 'apps.community'

    def ready(self):
        import apps.community.models  # noqa: F401 — registers post_save signal
