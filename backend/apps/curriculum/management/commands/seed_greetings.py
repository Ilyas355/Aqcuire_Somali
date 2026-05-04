from django.core.management.base import BaseCommand
from apps.curriculum.models import Section, Subtopic, Phrase, QuizQuestion


class Command(BaseCommand):
    help = 'Seed Section 1 — Greetings & Introducing Yourself'

    def handle(self, *args, **options):
        if Section.objects.filter(order=1).exists():
            self.stdout.write(self.style.WARNING('Section 1 already exists — skipping.'))
            return

        section = Section.objects.create(
            title='Greetings & Introducing Yourself',
            category_tag='Greetings',
            description='Learn how to greet people, say goodbye, and introduce yourself in Somali.',
            xp_reward=100,
            order=1,
        )
        self.stdout.write(f'Created section: {section}')

        subtopic = Subtopic.objects.create(
            section=section,
            title='Greetings and Introducing Yourself',
            description='Learn how to greet people, say goodbye, and introduce yourself in Somali.',
            order=1,
        )
        self.stdout.write(f'Created subtopic: {subtopic}')

        phrases_data = [
            # General greetings
            ('Sidee tahay', 'How are you', 1),
            ('Iska warran', "What's up (informal)", 2),
            ('Ma fiicantahay', 'Are you okay?', 3),
            ('Ma nabad baa', 'Is it peace on your end?', 4),
            ('Reerka sidee yihiin', "How's the family?", 5),
            ('Carruurta sidee yihiin', "How's the kids?", 6),
            ('Xaalada ka warran', "What's up (formal)", 7),
            ('Bal ka warran / iga warran', 'Tell me about…', 8),
            ('Soo dhawoow', 'Welcome', 9),
            # Time-related
            ('Maalin wanaagsan', 'Have a good day', 10),
            ('Subax wanaagsan', 'Good morning', 11),
            ('Galab wanaagsan', 'Good afternoon', 12),
            ('Aroor wanaagsan', 'Good morning (alternative)', 13),
            ('Fiid wanaagsan', 'Good evening', 14),
            ('Habeen wanaagsan', 'Goodnight', 15),
            # Goodbye
            ('Mac salaama', 'Peace be upon you', 16),
            ('Waan is aragno', "We'll see each other", 17),
            ('Waankala baxaa', "That's a wrap / that's it for now", 18),
            ('Waan is maqli doonaa', 'We will hear from each other', 19),
            ('Nabad baan kuu rajaynayaa', 'I wish you peace', 20),
            ('Nabad gelyo', 'Goodbye', 21),
            ('Kulanki wanaagsan', 'Nice to meet you', 22),
            ('Safar wanaagsan', 'Have a safe trip', 23),
            # Identity
            ('Magacay waa…', 'My name is…', 24),
            ('Asal ahaan Somali baan ahay', 'I am of Somali origin', 25),
            (
                'Saddex luqadood baan aqaan; Ingiriis, Somali iyo Carabi; laakiin Ingiriis bis baan si fiican ku hadli karaa',
                'I know 3 languages; English, Somali, and Arabic, but I am only fluent in English',
                26,
            ),
            # Age
            ('[Da] jir baan ahay', 'I am … years old', 27),
            ("Da'daydu waa [da] jir", 'My age is … years old', 28),
            # Where I live
            ('Waxaan ku noolahay [magaalo]', 'I live in… [city]', 29),
            # Family
            ('Walaalo ma lihi', "I don't have siblings", 30),
            (
                'Waxaan leeyahay saddex walaal oo aan isku hooyo nahay iyo afar walaal oo aan isku aabo nahay',
                'I have 3 siblings with whom we share the same mother and 4 siblings with whom we share the same father',
                31,
            ),
            (
                'Waxaan leeyahay saddex walaal oo aan isku hooyo nahay (laba wiil iyo hal gabar) iyo afar walaal oo aan isku aabo nahay (hal wiil iyo saddex gabar)',
                'I have 3 siblings with whom we share the same mother (2 boys and 1 girl) and 4 siblings with whom we share the same father (1 boy and 3 girls)',
                32,
            ),
            (
                'Sidoo kale, waxaan leeyahay toban abti iyo habaryar ah, iyo shan adeer iyo eedo ah',
                'Also I have ten maternal aunties and uncles and 5 paternal aunties and uncles',
                33,
            ),
            # Things I like
            (
                'Waxyaabaha aan jeclahay inaan sameeyo waxaa ka mid ah: inaan ciyaaro kubadda cagta, inaan gymka aado, inaan saaxiibaday la sheekeysto, inaan buugaag akhriyo, inaan masaajidka aado, inaan safro, inaan filimaan daawado',
                'Things I like to do include: playing football, going to the gym, chatting with friends, reading books, going to the mosque, travelling, watching films',
                34,
            ),
        ]

        phrases = {}
        for somali, english, order in phrases_data:
            p = Phrase.objects.create(
                subtopic=subtopic,
                somali=somali,
                english=english,
                order=order,
            )
            phrases[order] = p

        self.stdout.write(f'Created {len(phrases)} phrases')

        # Quiz questions for simple one-liner phrases only
        quiz_data = [
            # (phrase_order, layer, question_text, correct_answer, d1, d2, d3)

            # Sidee tahay
            (1, 'recognition', "What does 'Sidee tahay' mean?",
             'How are you', 'Goodbye', 'Good morning', 'Welcome'),
            (1, 'recall', "How do you say 'How are you?' in Somali?",
             'Sidee tahay', 'Iska warran', 'Ma nabad baa', 'Soo dhawoow'),
            (1, 'production', "Translate: 'How are you?' into Somali.",
             'Sidee tahay', '', '', ''),

            # Soo dhawoow
            (9, 'recognition', "What does 'Soo dhawoow' mean?",
             'Welcome', 'Goodbye', 'Good evening', 'How are you'),
            (9, 'recall', "How do you say 'Welcome' in Somali?",
             'Soo dhawoow', 'Nabad gelyo', 'Sidee tahay', 'Mac salaama'),
            (9, 'production', "Translate: 'Welcome' into Somali.",
             'Soo dhawoow', '', '', ''),

            # Subax wanaagsan
            (11, 'recognition', "What does 'Subax wanaagsan' mean?",
             'Good morning', 'Good evening', 'Goodnight', 'Good afternoon'),
            (11, 'recall', "How do you say 'Good morning' in Somali?",
             'Subax wanaagsan', 'Galab wanaagsan', 'Fiid wanaagsan', 'Habeen wanaagsan'),
            (11, 'production', "Translate: 'Good morning' into Somali.",
             'Subax wanaagsan', '', '', ''),

            # Habeen wanaagsan
            (15, 'recognition', "What does 'Habeen wanaagsan' mean?",
             'Goodnight', 'Good morning', 'Good afternoon', 'Have a good day'),
            (15, 'recall', "How do you say 'Goodnight' in Somali?",
             'Habeen wanaagsan', 'Subax wanaagsan', 'Galab wanaagsan', 'Maalin wanaagsan'),
            (15, 'production', "Translate: 'Goodnight' into Somali.",
             'Habeen wanaagsan', '', '', ''),

            # Nabad gelyo
            (21, 'recognition', "What does 'Nabad gelyo' mean?",
             'Goodbye', 'Welcome', 'Have a safe trip', 'Nice to meet you'),
            (21, 'recall', "How do you say 'Goodbye' in Somali?",
             'Nabad gelyo', 'Soo dhawoow', 'Mac salaama', 'Waan is aragno'),
            (21, 'production', "Translate: 'Goodbye' into Somali.",
             'Nabad gelyo', '', '', ''),

            # Kulanki wanaagsan
            (22, 'recognition', "What does 'Kulanki wanaagsan' mean?",
             'Nice to meet you', 'Have a safe trip', 'Goodbye', 'Welcome'),
            (22, 'recall', "How do you say 'Nice to meet you' in Somali?",
             'Kulanki wanaagsan', 'Safar wanaagsan', 'Nabad gelyo', 'Soo dhawoow'),
            (22, 'production', "Translate: 'Nice to meet you' into Somali.",
             'Kulanki wanaagsan', '', '', ''),

            # Magacay waa
            (24, 'recognition', "What does 'Magacay waa…' mean?",
             'My name is…', 'I am of Somali origin', 'I live in…', 'My age is…'),
            (24, 'recall', "How do you say 'My name is…' in Somali?",
             'Magacay waa…', "Da'daydu waa [da] jir", 'Asal ahaan Somali baan ahay', 'Waxaan ku noolahay [magaalo]'),
            (24, 'production', "Translate: 'My name is…' into Somali.",
             'Magacay waa…', '', '', ''),

            # Walaalo ma lihi
            (30, 'recognition', "What does 'Walaalo ma lihi' mean?",
             "I don't have siblings", 'How is the family?', 'I am of Somali origin', 'I live alone'),
            (30, 'recall', "How do you say 'I don't have siblings' in Somali?",
             'Walaalo ma lihi', 'Reerka sidee yihiin', 'Carruurta sidee yihiin', 'Magacay waa…'),
            (30, 'production', "Translate: 'I don't have siblings' into Somali.",
             'Walaalo ma lihi', '', '', ''),
        ]

        count = 0
        for phrase_order, layer, question_text, correct, d1, d2, d3 in quiz_data:
            QuizQuestion.objects.create(
                phrase=phrases[phrase_order],
                layer=layer,
                question_text=question_text,
                correct_answer=correct,
                distractor_1=d1,
                distractor_2=d2,
                distractor_3=d3,
            )
            count += 1

        self.stdout.write(f'Created {count} quiz questions')
        self.stdout.write(self.style.SUCCESS('Seeding complete.'))
