from decouple import config, Csv
from django.core.management.base import BaseCommand

from apps.content.models import Story, StoryCategory, StoryLine


ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())
HOST_IP = next((h for h in ALLOWED_HOSTS if h not in ('localhost', '127.0.0.1')), '192.168.0.226')
AUDIO_BASE_URL = f'http://{HOST_IP}:8000'

LINES = [
    ('John',   'Sidee tahay?',                          'How are you?',                                         0),
    ('Caasho', 'Waan fiicanahay.',                       "I'm fine.",                                            3),
    ('John',   'Magacaa?',                               "What's your name?",                                    6),
    ('Caasho', 'Magacay waa Caasho.',                    'My name is Caasho.',                                   9),
    ('John',   'Xagee ka timid?',                        'Where are you from?',                                  13),
    ('Caasho', 'Waxaan ka imid Somalia.',                'I am from Somalia.',                                   16),
    ('Caasho', 'Magacaa?',                               "What's your name?",                                    21),
    ('John',   'Magacaygu waa John.',                    'My name is John.',                                     25),
    ('John',   'Xagee ku nooshahay?',                    'Where do you live?',                                   30),
    ('Caasho', 'Waxaan ku noolahay New York.',           'I live in New York.',                                  34),
    ('John',   'Meeqo sanaa jirtaa?',                    'How old are you?',                                     39),
    ('Caasho', 'Waxaan jiraa labaatan iyo labo sano.',   'I am twenty two years old.',                           43),
    ('John',   'Ma shaqaysaa?',                          'Do you work?',                                         49),
    ('Caasho', 'Haa, waxaan ahay macalin.',              'Yes, I am a teacher.',                                 53),
    ('John',   'Yaad la nooshahay?',                     'Who do you live with?',                                59),
    ('Caasho', 'Waxaan la noolahay saaxibkay.',          'I live with my friend.',                               64),
    ('John',   'Barasho wanaagsan.',                     'Nice to meet you.',                                    69),
    ('Caasho', 'Maalin wanaagsan!',                      'Have a nice day!',                                     73),
]


class Command(BaseCommand):
    help = 'Seed Conversation 1 — Greetings dialogue (John & Caasho)'

    def handle(self, *args, **options):
        if Story.objects.filter(title='Conversation 1: Greetings').exists():
            self.stdout.write(self.style.WARNING('Conversation 1 already exists — skipping.'))
            return

        category, _ = StoryCategory.objects.get_or_create(
            name='Conversations',
            defaults={'order': 1},
        )

        story = Story.objects.create(
            title='Conversation 1: Greetings',
            description='A short conversation between John and Caasho covering greetings, introductions, and basic personal information.',
            category=category,
            difficulty='Beginner',
            duration_seconds=75,
            xp_reward=50,
            is_trending=True,
            order=1,
            audio_url=f'{AUDIO_BASE_URL}/media/audio/conversation_1.mp4',
        )
        self.stdout.write(f'Created story: {story}')

        for order, (speaker, somali, english, timestamp) in enumerate(LINES, start=1):
            StoryLine.objects.create(
                story=story,
                speaker_name=speaker,
                somali=somali,
                english=english,
                timestamp_seconds=timestamp,
                order=order,
            )

        self.stdout.write(f'Created {len(LINES)} story lines')
        self.stdout.write(self.style.SUCCESS('Seeding complete.'))
