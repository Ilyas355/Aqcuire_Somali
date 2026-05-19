from django.core.management.base import BaseCommand

from apps.content.models import Story, StoryCategory, StoryLine, StoryQuizQuestion


STORIES = [
    {
        'title': 'At the Market',
        'description': 'Caasho buys vegetables and fruit at the local market.',
        'difficulty': 'Beginner',
        'duration_seconds': 60,
        'xp_reward': 50,
        'is_trending': False,
        'order': 2,
        'lines': [
            ('Caasho', 'Meeshan badeecadda laga iibsado xagee bay taal?', 'Where is the market?', 0),
            ('Vendor', 'Soo gal, waxaan heyaa khudrad iyo miro.', 'Come in, I have vegetables and fruit.', 4),
            ('Caasho', 'Banaanada qiimahooddu waa immisa?', 'How much are the bananas?', 8),
            ('Vendor', 'Toban baasto waa shan doolar.', 'Ten bananas are five dollars.', 12),
            ('Caasho', 'Waan iibsanayaa.', 'I will buy them.', 16),
            ('Vendor', 'Waa ku mahadsan tahay.', 'Thank you.', 19),
            ('Caasho', 'Nabadgelyo!', 'Goodbye!', 22),
        ],
        'quiz': [
            ('Maxay Caasho iibsatay suuqa?', 'Banaano', 'Hilib', 'Rooti', 'Biyo'),
            ('Meeqo baasto baa shan doolar ah?', 'Toban', 'Shan', 'Laba iyo toban', 'Afar'),
            ('Sidee ayuu xeeladaha u yidhi markay Caasho tagaysay?', 'Waa ku mahadsan tahay', 'Maalin wanaagsan', 'Soo gal', 'Immisa'),
        ],
    },
    {
        'title': 'Ordering Food',
        'description': 'John and Caasho order food at a Somali restaurant.',
        'difficulty': 'Beginner',
        'duration_seconds': 65,
        'xp_reward': 50,
        'is_trending': False,
        'order': 3,
        'lines': [
            ('Waiter', 'Ku soo dhawow. Maxaad dooneysaan?', 'Welcome. What would you like?', 0),
            ('John',   'Waxaan rabaa bariis iyo hilib.', 'I would like rice and meat.', 4),
            ('Caasho', 'Aniguna waxaan rabaa canjeero iyo suqaar.', 'I would also like canjeero and suqaar.', 8),
            ('Waiter', 'Waxaad cabban doontaan?', 'What will you drink?', 13),
            ('John',   'Biyo, fadlan.', 'Water, please.', 16),
            ('Caasho', 'Shaah, fadlan.', 'Tea, please.', 19),
            ('Waiter', 'Waa la keenayaa.', 'It will be brought.', 22),
            ('John',   'Mahadsanid.', 'Thank you.', 25),
        ],
        'quiz': [
            ('Maxay John doontay cuntada?', 'Bariis iyo hilib', 'Canjeero iyo suqaar', 'Rooti iyo shaah', 'Hilib kaliya'),
            ('Maxay Caasho cabban doontay?', 'Shaah', 'Biyo', 'Caano', 'Juice'),
            ('Maxay kelmadda "fadlan" macnaheedu tahay?', 'Please', 'Thank you', 'Welcome', 'Goodbye'),
        ],
    },
    {
        'title': 'Family Introductions',
        'description': 'Caasho introduces her family to a new neighbour.',
        'difficulty': 'Beginner',
        'duration_seconds': 70,
        'xp_reward': 50,
        'is_trending': False,
        'order': 4,
        'lines': [
            ('Caasho',    'Ku soo dhawow deriska. Kan waa aabahay.', 'Welcome to the neighbourhood. This is my father.', 0),
            ('Neighbour', 'Ku soo dhawaaday. Sidee tahay?', 'Nice to meet you. How are you?', 5),
            ('Father',    'Waan fiicanahay, mahadsanid.', 'I am fine, thank you.', 9),
            ('Caasho',    'Kanna waa hooyaday.', 'And this is my mother.', 13),
            ('Mother',    'Barasho wanaagsan.', 'Nice to meet you.', 16),
            ('Neighbour', 'Ma wiil iyo gabar baad leedahay?', 'Do you have a son and daughter?', 19),
            ('Caasho',    'Haa, waxaan leeyahay hal wiil iyo laba gabdhood.', 'Yes, I have one son and two daughters.', 23),
            ('Neighbour', 'Qoyska wanaagsan!', 'What a lovely family!', 28),
        ],
        'quiz': [
            ('Ninkee ayaa Caasho aabaheed la kulantay deriska?', 'Deriska cusub', 'Macallinka', 'Saaxiibkeed', 'Jaarkeeda'),
            ('Immisa carruur ah ayaa Caasho leedahay?', 'Sadex', 'Laba', 'Afar', 'Hal'),
            ('Maxay kelmadda "hooyo" macnaheedu tahay?', 'Mother', 'Father', 'Sister', 'Daughter'),
        ],
    },
    {
        'title': 'Taking a Taxi',
        'description': 'John takes a taxi across town and negotiates the fare.',
        'difficulty': 'Intermediate',
        'duration_seconds': 75,
        'xp_reward': 75,
        'is_trending': False,
        'order': 5,
        'lines': [
            ('John',   'Taksi! Xagee baad i geysan kartaa?', 'Taxi! Where can you take me?', 0),
            ('Driver', 'Meesha aad rabto waa meesheey?', 'Where do you want to go?', 4),
            ('John',   'Waxaan rabaa in aan tago xarunta magaalada.', 'I want to go to the city centre.', 8),
            ('Driver', 'Waa toban doolar.', 'That is ten dollars.', 13),
            ('John',   'Aad ayay u qaali tahay. Sideed doolar ma noqon kartaa?', 'That is too expensive. Can it be eight dollars?', 17),
            ('Driver', 'Sagaal doolar, heshiis.', 'Nine dollars, agreed.', 22),
            ('John',   'Hagaag, aan dhaqaaqno.', 'Okay, let us go.', 26),
            ('Driver', 'Gaariga fadhiiso.', 'Get in the car.', 29),
        ],
        'quiz': [
            ('Meeqa doolar ayuu John bilaabay inuu bixiyo?', 'Toban', 'Sideed', 'Sagaal', 'Shan'),
            ('Maxaa la heshiiyay inuu John bixiyo?', 'Sagaal doolar', 'Toban doolar', 'Sideed doolar', 'Lix doolar'),
            ('Maxay kelmadda "qaali" macnaheedu tahay?', 'Expensive', 'Cheap', 'Far', 'Fast'),
        ],
    },
    {
        'title': 'At the Doctor',
        'description': 'Caasho visits the doctor and describes her symptoms.',
        'difficulty': 'Intermediate',
        'duration_seconds': 80,
        'xp_reward': 75,
        'is_trending': False,
        'order': 6,
        'lines': [
            ('Doctor', 'Ku soo dhawow. Maxaa kuu dhacay?', 'Welcome. What happened to you?', 0),
            ('Caasho', 'Madaxay igu xanuunsanayaa oo jirro ayaan qabaa.', 'My head hurts and I have a fever.', 4),
            ('Doctor', 'Intee in le\'eg ayaad xanuunsaneysay?', 'How long have you been sick?', 9),
            ('Caasho', 'Laba maalmood.', 'Two days.', 13),
            ('Doctor', 'Ma cunto baad cunaysay?', 'Have you been eating?', 16),
            ('Caasho', 'Maya, cunno uma jecli.', 'No, I have no appetite.', 19),
            ('Doctor', 'Daawo ayaan kuu qorayaa. Nasasho u baahan tahay.', 'I will write you medicine. You need rest.', 23),
            ('Caasho', 'Mahadsanid, dhakhtarku.', 'Thank you, doctor.', 28),
        ],
        'quiz': [
            ('Maxay Caasho u sheegtay dhakhtarka?', 'Madax xanuun iyo jirro', 'Lugta xanuun', 'Indha xanuun', 'Calool xanuun'),
            ('Intee in le\'eg ayay Caasho xanuunsaneyd?', 'Laba maalmood', 'Hal maalmood', 'Saddex maalmood', 'Toddobaad'),
            ('Maxay kelmadda "daawo" macnaheedu tahay?', 'Medicine', 'Doctor', 'Rest', 'Food'),
        ],
    },
    {
        'title': 'Making Plans',
        'description': 'John and Caasho make plans to meet up at the weekend.',
        'difficulty': 'Intermediate',
        'duration_seconds': 70,
        'xp_reward': 75,
        'is_trending': False,
        'order': 7,
        'lines': [
            ('John',   'Caasho, sabtida maxaad sameyneysaa?', 'Caasho, what are you doing on Saturday?', 0),
            ('Caasho', 'Wax baan qaban. Maxaad qorsheynaysaa?', 'I am free. What are you planning?', 4),
            ('John',   'Waxaan doonayaa in aan aadno xeebta.', 'I want us to go to the beach.', 8),
            ('Caasho', 'Fikradda wanaagsan! Saacad kee?', 'Great idea! What time?', 12),
            ('John',   'Sagaal subax. Xaafadda waxaan kugu kulmi doonaa.', 'Nine in the morning. I will meet you in the neighbourhood.', 16),
            ('Caasho', 'Waan ku sugi doonaa.', 'I will be waiting for you.', 21),
            ('John',   'Hore u fiirso!', 'Look forward to it!', 24),
        ],
        'quiz': [
            ('Maalintee ayay John iyo Caasho qorsheynayeen?', 'Sabtida', 'Jimcaha', 'Axadda', 'Isniin'),
            ('Xagee ayay aadayeen?', 'Xeebta', 'Suuqa', 'Cafiska', 'Magaalada', ),
            ('Saacad kee ayay kulmi doonaan?', 'Sagaal subax', 'Toban subax', 'Sideed subax', 'Laba galabnimo'),
        ],
    },
    {
        'title': 'A Phone Call Home',
        'description': 'Caasho calls her mother back home in Somalia.',
        'difficulty': 'Advanced',
        'duration_seconds': 90,
        'xp_reward': 100,
        'is_trending': False,
        'order': 8,
        'lines': [
            ('Caasho', 'Hooyo, sidee tahay? Waan kugu xusuustay.', 'Mum, how are you? I have been thinking about you.', 0),
            ('Mother', 'Caasho, yaa ku yiri! Waan fiicanahay, aduna sidee?', 'Caasho, who told you! I am fine, how about you?', 5),
            ('Caasho', 'Waan fiicanahay lakiin shaqadu aad ayay u adagtahay.', 'I am fine but work is very hard.', 10),
            ('Mother', 'Haa, miyaad cuntaa? Qaadashada xaaladdu sidee tahay?', 'Yes, are you eating? How is the living situation?', 15),
            ('Caasho', 'Waan cunayaa, hooyo. Guri wanaagsan ayaan heyaa.', 'I am eating, mum. I have a good house.', 20),
            ('Mother', 'Markaa goormaad timaaddaa? Oo dhan waxaan ku sugnaa.', 'So when are you coming? We are all waiting for you.', 25),
            ('Caasho', 'Xagaaga, haddii Alle idmo. Qoyska ku soo dhaofiyo.', 'In the summer, God willing. Send greetings to the family.', 30),
            ('Mother', 'Allaha kaa ilaaliyo. Anagana waxaan ku soo diri doonaa jaceylka.', 'May God protect you. We will send you our love.', 36),
        ],
        'quiz': [
            ('Maxay Caasho ka sheegtay shaqadeeda?', 'Aad bay u adagtahay', 'Wanaagsan bay tahay', 'Lacag badan bay heshaa', 'Joojtay'),
            ('Goormaad Caasho ku laabaneysaa hooyadeed?', 'Xagaaga', 'Xilliga qaboobaha', 'Sanadka dambe', 'Doonaysaa laakiin ma garanayso'),
            ('Maxay kelmadda "haddii Alle idmo" macnaheedu tahay English?', 'God willing', 'In the summer', 'I miss you', 'Take care'),
        ],
    },
    {
        'title': 'Cultural Celebration',
        'description': 'John learns about Somali cultural traditions at a community gathering.',
        'difficulty': 'Advanced',
        'duration_seconds': 85,
        'xp_reward': 100,
        'is_trending': False,
        'order': 9,
        'lines': [
            ('Elder',  'Ku soo dhawow xafladda. Maanta waxaan xusaynnaa Eid.', 'Welcome to the celebration. Today we celebrate Eid.', 0),
            ('John',   'Waad mahadsantahay. Maxaad ila wadaagi kartaa caadooyinka?', 'Thank you. Can you share the traditions with me?', 5),
            ('Elder',  'Eid waa xilli farxad leh. Qoyska iyo asxaabta waxaad ugu diri doontaa salaan.', 'Eid is a joyful time. You send greetings to family and friends.', 10),
            ('John',   'Ma cunto gaar ah baad cunaysaan?', 'Do you eat special food?', 16),
            ('Elder',  'Haa, hilib ari iyo bariis ayaa caadi ah. Caruurta hadiyado ayaa la siinayaa.', 'Yes, goat meat and rice is common. Children are given gifts.', 20),
            ('John',   'Dhaqankan waa quruxboon. Waxaan jecel yahay inaan barto.', 'This culture is beautiful. I love learning about it.', 26),
            ('Elder',  'Runta weeye, dhaqanka Soomaaliyeed waa mid taariikh dheer leh.', 'That is true, Somali culture has a long history.', 31),
        ],
        'quiz': [
            ('Xafladda maxaa la xusayay?', 'Eid', 'Ciida', 'Arooska', 'Dhalashada'),
            ('Cuntada caadiga ah ee Eid ee la xusay waxay ahayd?', 'Hilib ari iyo bariis', 'Canjeero iyo suqaar', 'Banaano iyo caano', 'Rooti iyo shaah'),
            ('Maxaa caruurta la siinayaa Eid?', 'Hadiyado', 'Lacag kaliya', 'Cunto', 'Dhar'),
        ],
    },
    {
        'title': 'At the Office',
        'description': 'Caasho navigates a professional conversation with her colleague.',
        'difficulty': 'Advanced',
        'duration_seconds': 90,
        'xp_reward': 100,
        'is_trending': False,
        'order': 10,
        'lines': [
            ('Colleague', 'Caasho, wargeyska shirkadda ma diyaarsatay?', 'Caasho, have you prepared the company report?', 0),
            ('Caasho',    'Haa, waan dhammaystay. Waxaan u baahnahay marka hore aad eegto.', 'Yes, I finished it. I need you to review it first.', 5),
            ('Colleague', 'Hagaag, qaybta miisaaniyada ka waran?', 'Okay, what about the budget section?', 10),
            ('Caasho',    'Waxaan ku daray xogta cusub ee laga helay xaaladda suuqa.', 'I added the new data from the market situation.', 15),
            ('Colleague', 'Fiican. Shirka saacad kee ayuu bilaabmayaa?', 'Good. What time does the meeting start?', 20),
            ('Caasho',    'Laba galabnimo, qolka shirkada koowaad.', 'Two in the afternoon, conference room one.', 24),
            ('Colleague', 'Mahadsanid. Wax walba si fiican ayey u socdaan.', 'Thank you. Everything is going well.', 29),
            ('Caasho',    'Waan rajeyneynaa in shirkadu guul gaarto.', 'We hope the company succeeds.', 33),
        ],
        'quiz': [
            ('Maxay Caasho u diyaarsatay hawl-wadeenka?', 'Wargeyska shirkadda', 'Miisaaniyada', 'Xogta suuqa', 'Jadwalka shirka'),
            ('Goormaad shirku bilaabmayaa?', 'Laba galabnimo', 'Sagaal subax', 'Toban subax', 'Saddex galabnimo'),
            ('Maxay kelmadda "miisaaniyad" macnaheedu tahay English?', 'Budget', 'Meeting', 'Report', 'Office'),
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed 9 stories across Beginner / Intermediate / Advanced with quiz questions'

    def handle(self, *args, **options):
        conversations_cat, _ = StoryCategory.objects.get_or_create(
            name='Conversations', defaults={'order': 1}
        )

        created = 0
        for story_data in STORIES:
            if Story.objects.filter(title=story_data['title']).exists():
                self.stdout.write(self.style.WARNING(f'Already exists — skipping: {story_data["title"]}'))
                continue

            story = Story.objects.create(
                title=story_data['title'],
                description=story_data['description'],
                category=conversations_cat,
                difficulty=story_data['difficulty'],
                duration_seconds=story_data['duration_seconds'],
                xp_reward=story_data['xp_reward'],
                is_trending=story_data['is_trending'],
                order=story_data['order'],
                audio_url='',
            )

            for order, (speaker, somali, english, timestamp) in enumerate(story_data['lines'], start=1):
                StoryLine.objects.create(
                    story=story,
                    speaker_name=speaker,
                    somali=somali,
                    english=english,
                    timestamp_seconds=timestamp,
                    order=order,
                )

            for q_order, (question_text, correct, d1, d2, d3) in enumerate(story_data['quiz'], start=1):
                StoryQuizQuestion.objects.create(
                    story=story,
                    question_text=question_text,
                    correct_answer=correct,
                    distractor_1=d1,
                    distractor_2=d2,
                    distractor_3=d3,
                    order=q_order,
                )

            self.stdout.write(f'Created: {story.title} ({story.difficulty})')
            created += 1

        self.stdout.write(self.style.SUCCESS(f'Done — {created} stories created.'))
