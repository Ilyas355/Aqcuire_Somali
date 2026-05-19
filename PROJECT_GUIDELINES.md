# Aquire Somali — Project Guidelines for Claude

> Read this file at the start of every session before touching any code.
> This is the single source of truth for architecture, conventions, and decisions already made.

---

## What This App Is

A Somali language learning app (Duolingo-style) for the Somali diaspora.
Target: ~1000 users within 18 months of launch.

**Stack:**

- Frontend: Expo (React Native) with TypeScript — managed workflow
- Backend: Django + Django REST Framework
- Auth: JWT via `djangorestframework-simplejwt`
- API consumption: TanStack Query (React Query) on the frontend
- Token storage: `expo-secure-store` (never AsyncStorage)

---

## Project Structure

```
Aquire_Somali/
├── CLAUDE.md                          ← you are here
├── PROGRESS.md                        ← track what's done / in progress / next
├── README.md
├── .gitignore
│
├── designs/                           ← screen design references, read before building any screen
│   ├── home.png
│   ├── learn.png
│   ├── lesson-flow.png
│   ├── listen.png
│   ├── community.png
│   └── profile.png
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                           ← never commit this
│   ├── venv/
│   │
│   ├── Aquire_Somali/                 ← Django project config folder
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py                    ← root URL file
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── apps/                          ← all Django apps live here
│       ├── __init__.py
│       ├── users/
│       │   ├── migrations/
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   └── tests.py
│       ├── curriculum/
│       │   ├── migrations/
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   └── tests.py
│       ├── progress/
│       │   ├── migrations/
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   └── tests.py
│       ├── content/
│       │   ├── migrations/
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   └── tests.py
│       └── community/
│           ├── migrations/
│           ├── __init__.py
│           ├── admin.py
│           ├── apps.py
│           ├── models.py
│           ├── serializers.py
│           ├── views.py
│           ├── urls.py
│           └── tests.py
│
└── frontend/
    └── app/
        ├── app.json
        ├── package.json
        ├── tsconfig.json
        ├── eslint.config.js
        ├── expo-env.d.ts
        │
        ├── app/                       ← Expo Router screens
        │   ├── _layout.tsx            ← root layout, auth gate lives here
        │   ├── (auth)/                ← unauthenticated screens
        │   │   ├── _layout.tsx
        │   │   ├── login.tsx
        │   │   └── register.tsx
        │   └── (tabs)/                ← authenticated tab screens
        │       ├── _layout.tsx
        │       ├── index.tsx          ← Home
        │       ├── learn.tsx          ← Learn
        │       ├── listen.tsx         ← Listen
        │       ├── community.tsx      ← Community
        │       └── profile.tsx        ← Profile
        │
        ├── components/                ← reusable UI components only
        │   ├── ui/                    ← base primitives (Button, Card, etc.)
        │   ├── home/                  ← components scoped to Home screen
        │   ├── learn/                 ← components scoped to Learn screen
        │   ├── listen/                ← components scoped to Listen screen
        │   ├── community/             ← components scoped to Community screen
        │   └── profile/               ← components scoped to Profile screen
        │
        ├── api/
        │   └── api.ts                 ← SINGLE file for all typed API functions
        │
        ├── hooks/                     ← custom hooks including TanStack Query hooks
        │   ├── useHomeScreen.ts
        │   ├── useCurriculum.ts
        │   ├── useProgress.ts
        │   ├── useStories.ts
        │   ├── useCommunity.ts
        │   └── useProfile.ts
        │
        ├── context/
        │   └── AuthContext.tsx        ← global auth state via React Context
        │
        ├── constants/
        │   └── theme.ts               ← design tokens: colours, spacing, typography
        │
        ├── types/
        │   └── api.ts                 ← TypeScript interfaces for every API response
        │
        └── assets/
            └── images/
```

---

## Backend Rules

### Django apps

- All apps live in `apps/` — imports must reflect this
  ```python
  # correct
  from apps.users.models import UserProfile
  # wrong
  from users.models import UserProfile
  ```
- `sys.path` in `settings.py` includes `apps/` so installed app names stay short:
  ```python
  INSTALLED_APPS = ['users', 'curriculum', 'progress', 'content', 'community']
  ```

### Views

- **Class based views everywhere** — including `users/` app
- Standard CRUD → DRF generic CBVs (`generics.ListAPIView`, `generics.RetrieveUpdateAPIView` etc.)
- Custom logic or multiple models → `APIView`
- Never use function based views unless there is a specific reason that CBVs cannot handle
- Use `select_related` and `prefetch_related` on every queryset that touches relations — never let a view trigger N+1 queries

```python
# correct — register
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# correct — custom multi-model response
class HomeScreenView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): ...

# wrong
@api_view(['GET'])
def my_view(request): ...
```

### Models

- Every model must have a `__str__` method
- Use `PositiveIntegerField` for XP, counts, and order fields
- `unique_together` on every user + object relationship
- `db_index=True` on any field that gets filtered frequently
- Never use raw SQL unless absolutely necessary
- Always set `related_name` on every ForeignKey and OneToOneField
- `on_delete` rules:
  - `CASCADE` — user-owned data (profiles, progress, achievements, quiz attempts)
  - `PROTECT` — reference/lookup data users depend on (Level, Achievement, Section)
  - `SET_NULL` — only when a child record should survive the parent being deleted
- Optional fields need both `null=True` and `blank=True` — never one without the other
- Never use `null=True` on CharField or TextField — use `blank=True` with `default=''`
- Any model with an `order` field must define `class Meta: ordering = ['order']`

```python
# correct
class UserSubtopicProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subtopic = models.ForeignKey(Subtopic, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'subtopic']

    def __str__(self):
        return f"{self.user.username} — {self.subtopic.title}"
```

---

## Canonical Data Models

These are the finalised fields for every model. Do not deviate from these
when building models.py files. Do not add fields that aren't listed here
without flagging it first.

### users app

**UserProfile** (OneToOne → User)

- handle: CharField(50, unique)
- avatar: URLField(blank)
- location: CharField(100, blank)
- is_diaspora: BooleanField(default=False)
- joined_date: DateTimeField(auto_now_add)
- total_xp: PositiveIntegerField(default=0)
- current_streak: PositiveIntegerField(default=0)
- last_active_date: DateField(null)
- daily_reminder_time: TimeField(null, blank)
- audio_autoplay: BooleanField(default=True)
- dark_mode: BooleanField(default=True)
- transliteration: BooleanField(default=False)

**Level** (standalone)

- name: CharField(100) # Arday / Xirfadlaha / Bilow
- subtitle: CharField(100) # The Skilled One
- description: TextField # You can introduce yourself...
- xp_required: PositiveIntegerField
- order: PositiveIntegerField

**UserLevel** (OneToOne → User)

- current_level: ForeignKey → Level
- xp_into_level: PositiveIntegerField(default=0)

**Achievement** (standalone)

- key: CharField(100, unique) # first_step / 3_day_streak
- title: CharField(100)
- icon: URLField
- description: TextField

**UserAchievement** (FK → User + Achievement)

- user: ForeignKey → User
- achievement: ForeignKey → Achievement
- earned_at: DateTimeField(auto_now_add)
- Meta: unique_together = ['user', 'achievement']

---

### curriculum app

**Section** (standalone)

- title: CharField(200)
- category_tag: CharField(100) # Core Communication
- description: TextField
- xp_reward: PositiveIntegerField
- order: PositiveIntegerField
- unlock_requires: ForeignKey → self (null, blank)

**Subtopic** (FK → Section)

- section: ForeignKey → Section (related_name='subtopics')
- title: CharField(200)
- description: TextField
- order: PositiveIntegerField

**Phrase** (FK → Subtopic)

- subtopic: ForeignKey → Subtopic (related_name='phrases')
- somali: CharField(500)
- english: CharField(500)
- audio_url: URLField(blank)
- order: PositiveIntegerField

**GrammarNote** (FK → Phrase)

- phrase: ForeignKey → Phrase (related_name='grammar_notes')
- note: TextField

**KeyPattern** (FK → Subtopic)

- subtopic: ForeignKey → Subtopic (related_name='key_patterns')
- somali_pattern: CharField(200)
- english_pattern: CharField(200)
- breakdown: CharField(200)
- order: PositiveIntegerField

**CommonMistake** (FK → Subtopic)

- subtopic: ForeignKey → Subtopic (related_name='common_mistakes')
- wrong: CharField(300)
- correct: CharField(300)
- explanation: TextField

**SurvivalLine** (FK → Subtopic)

- subtopic: ForeignKey → Subtopic (related_name='survival_lines')
- somali: CharField(300)
- order: PositiveIntegerField

**QuizQuestion** (FK → Phrase)

- phrase: ForeignKey → Phrase (related_name='quiz_questions')
- layer: CharField choices [recognition, recall, production]
- question_text: TextField
- correct_answer: CharField(500)
- distractor_1: CharField(500)
- distractor_2: CharField(500)
- distractor_3: CharField(500)

---

### progress app

**UserSectionProgress** (FK → User + Section)

- user: ForeignKey → User
- section: ForeignKey → Section
- is_unlocked: BooleanField(default=False)
- is_completed: BooleanField(default=False)
- subtopics_completed: PositiveIntegerField(default=0)
- Meta: unique_together = ['user', 'section']

**UserSubtopicProgress** (FK → User + Subtopic)

- user: ForeignKey → User
- subtopic: ForeignKey → Subtopic
- phrases_completed: PositiveIntegerField(default=0)
- is_completed: BooleanField(default=False)
- current_step: CharField choices [flashcard, quiz, done]
- last_accessed: DateTimeField(auto_now)
- Meta: unique_together = ['user', 'subtopic']

**QuizAttempt** (FK → User + QuizQuestion)

- user: ForeignKey → User
- question: ForeignKey → QuizQuestion
- answer_given: CharField(500)
- is_correct: BooleanField
- xp_awarded: PositiveIntegerField(default=0)
- attempted_at: DateTimeField(auto_now_add)

**VocabReview** (FK → User + Phrase)

- user: ForeignKey → User (db_index=True)
- phrase: ForeignKey → Phrase
- next_review: DateTimeField (db_index=True)
- interval: PositiveIntegerField(default=1)
- ease_factor: FloatField(default=2.5)
- repetitions: PositiveIntegerField(default=0)
- Meta: unique_together = ['user', 'phrase']

---

### content app

**StoryCategory** (standalone)

- name: CharField(100) # Beginner / Daily Life / Travel
- order: PositiveIntegerField

**Story** (FK → StoryCategory)

- title: CharField(200)
- description: TextField
- category: ForeignKey → StoryCategory
- difficulty: CharField(50)
- duration_seconds: PositiveIntegerField
- xp_reward: PositiveIntegerField
- is_trending: BooleanField(default=False)
- order: PositiveIntegerField

**StoryLine** (FK → Story)

- story: ForeignKey → Story (related_name='lines')
- somali: CharField(500)
- english: CharField(500)
- speaker_name: CharField(100)
- audio_url: URLField(blank)
- order: PositiveIntegerField

**StoryTip** (FK → StoryLine)

- story_line: ForeignKey → StoryLine (related_name='tips')
- tip_text: TextField
- explanation: TextField

**UserStoryProgress** (FK → User + Story)

- user: ForeignKey → User
- story: ForeignKey → Story
- is_completed: BooleanField(default=False)
- last_line_position: PositiveIntegerField(default=0)
- Meta: unique_together = ['user', 'story']

---

### community app

**PartnerRequest** (FK → User × 2)

- sender: ForeignKey → User (related_name='sent_requests')
- receiver: ForeignKey → User (related_name='received_requests')
- status: CharField choices [pending, accepted, rejected]
- created_at: DateTimeField(auto_now_add)
- Meta: unique_together = ['sender', 'receiver']

**Partner** (FK → User × 2)

- user: ForeignKey → User (related_name='partners')
- partner: ForeignKey → User (related_name='partnered_with')
- sessions_count: PositiveIntegerField(default=0)
- connected_at: DateTimeField(auto_now_add)
- Meta: unique_together = ['user', 'partner']

**PartnerProfile** (OneToOne → User)

- user: OneToOneField → User
- bio: TextField(blank)
- rating: FloatField(default=0)
- total_partners: PositiveIntegerField(default=0)
- is_heritage_speaker: BooleanField(default=False)
- availability: CharField(100, blank)
- preferred_format: CharField(100, blank)

**WeeklyChallenge** (standalone)

- title: CharField(200)
- reward_badge: ForeignKey → Achievement
- starts_at: DateTimeField
- ends_at: DateTimeField

**UserPresence** (OneToOne → User)

- user: OneToOneField → User
- is_online: BooleanField(default=False)
- last_active: DateTimeField(auto_now)

### Serializers

- Serializers handle data transformation only — no business logic
- Use `SerializerMethodField` for computed values (percentages, counts)
- Use nested serializers for related data, not multiple API calls

### URL structure

- All endpoints prefixed with `/api/`
- Pattern: `/api/<app>/<resource>/`
- All endpoints require `IsAuthenticated` unless explicitly marked otherwise

```
/api/auth/register/
/api/auth/login/
/api/auth/token/refresh/
/api/auth/profile/
/api/auth/password/change/
/api/curriculum/sections/
/api/curriculum/subtopics/<id>/
/api/progress/home/
/api/progress/subtopic/<id>/update/
/api/progress/quiz/submit/
/api/progress/vocab/due/
/api/content/stories/
/api/content/stories/<id>/
/api/content/stories/<id>/complete/
/api/community/partners/suggested/
/api/community/partners/request/<id>/
/api/community/leaderboard/
```

### Settings

- Single `settings.py` — use `python-decouple` for environment differences
- All secrets in `.env` — never hardcoded
- `DEBUG = False` in production is non-negotiable

---

## Frontend Rules

### API layer — `api/api.ts`

- **Components never contain raw fetch calls**
- One central `api.ts` exports a typed async function for every endpoint
- Every function is typed with interfaces from `types/api.ts`

```typescript
// types/api.ts
export interface HomeScreenResponse {
  greeting_level: string;
  current_subtopic: SubtopicProgress;
  overall_progress: {
    percentage: number;
    section: number;
  };
  vocab_due_count: number;
  user_xp: number;
  user_streak: number;
  user_level_percentage: number;
}

// api/api.ts
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getHomeScreen(): Promise<HomeScreenResponse> {
  const res = await fetch(`${BASE_URL}/api/progress/home/`, {
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch home screen");
  return res.json();
}
```

### TanStack Query — data fetching

- All server state managed by TanStack Query — no manual loading/error useState for API calls
- Custom hooks in `hooks/` wrap `useQuery` and `useMutation`
- Components just call the hook

```typescript
// hooks/useHomeScreen.ts
export function useHomeScreen() {
  return useQuery({
    queryKey: ['homeScreen'],
    queryFn: getHomeScreen,
  });
}

// components/home/OverallProgress.tsx
export function OverallProgress() {
  const { data, isLoading, error } = useHomeScreen();
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  return <ProgressBar percentage={data.overall_progress.percentage} />;
}
```

### Auth — React Context + SecureStore

- Global auth state (user, token, isAuthenticated) lives in `context/AuthContext.tsx`
- JWT tokens stored with `expo-secure-store` — never `AsyncStorage`
- Token refresh logic lives in `api.ts`, not in components

```typescript
// storing tokens
await SecureStore.setItemAsync("access_token", token);
await SecureStore.setItemAsync("refresh_token", refreshToken);
```

### TypeScript

- TypeScript from day one — no `any` types
- Define an `interface` for every API response shape in `types/api.ts`
- Type all component props

### Components

- Every repeated UI element is its own component file immediately — no copy-pasting
- Components scoped to a screen live in `components/<screen>/`
- Base primitives (Button, Card, Input) live in `components/ui/`
- Components receive data as props — they do not fetch their own data unless they own a self-contained feature

### Expo managed tools — use these, don't reinvent them

- `expo-image` — use instead of React Native's default Image
- `expo-font` — font loading
- `expo-splash-screen` — splash screen control
- `expo-secure-store` — encrypted token storage
- `expo-router` — file-based routing, already scaffolded

---

## Design System

Dark theme throughout. Follow the designs exactly.

**Colours (from designs):**

- Background: `#0A0A0A`
- Card background: `#111111`
- Primary green: `#22C55E`
- Purple (Listen section): `#7C3AED`
- Gold/amber (XP, streaks): `#F59E0B`
- Text primary: `#FFFFFF`
- Text secondary: `#6B7280`
- Error/wrong: `#EF4444`

All design tokens live in `constants/theme.ts` — never hardcode colours in components.

**Design references — always read the relevant image before building any screen or component:**

| Screen                                     | File                      |
| ------------------------------------------ | ------------------------- |
| Home                                       | `designs/home.png`        |
| Learn (section overview)                   | `designs/learn.png`       |
| Lesson flow (Template / Quiz / Cheatsheet) | `designs/lesson-flow.png` |
| Listen (story list + visual player)        | `designs/listen.png`      |
| Community (partners + leaderboard)         | `designs/community.png`   |
| Profile + level-up celebration             | `designs/profile.png` 1&2 |

**Key design notes per screen:**

- Home — dark card layout, overall progress ring (23%), continue learning card with phrase previews, listening/vocab shortcut tiles, level progress card
- Learn — section list with lock states, subtopic chips, XP reward badges, continue button, "How it works" info link
- Lesson flow — 4 step progress indicator (Template → Practice → Quiz → Review), phrase cards with audio, grammar tip notes, quiz layers (1 Recognition → 2 Recall → 3 Production), cheatsheet with key patterns / common mistakes / survival lines
- Listen — story list with category filter chips, featured banner, visual story player with animated characters, transcript toggle (Somali / English), contextual tip overlays with Done button
- Community — suggested partners list with match % and connect/pending buttons, swipe-style partner match card (✗ skip / ✓ connect), leaderboard with This Week / All Time / Partners tabs, weekly challenge banner
- Profile — vertically scrollable with scroll pagination: avatar + handle + streak badge, level progress card, stats row (XP / complete % / streak / partners), section progress list with lock states, achievements grid, settings toggles, edit/privacy/feedback rows, log out. Level-up celebration is a full screen overlay with trophy, share card, and next section CTA.

- - across all screens, vertically scrollable where needed like on the community screen where users are listed on the page

---

## Django Apps — What Each Owns

| App          | Responsibility                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| `users`      | Auth, profiles, levels, XP, streaks, achievements, settings                                                |
| `curriculum` | Sections, subtopics, phrases, grammar notes, key patterns, common mistakes, survival lines, quiz questions |
| `progress`   | User progress per section/subtopic/phrase, lesson step tracking, quiz attempts, vocab review queue (SM-2)  |
| `content`    | Stories, story lines, story tips, story categories, user story progress                                    |
| `community`  | Partner requests, partners, leaderboard, weekly challenges, user presence                                  |

---

## What Not To Do

- No raw fetch calls in components — use `api.ts` functions
- No `AsyncStorage` for tokens — use `expo-secure-store`
- No `any` TypeScript types
- No business logic in serializers or views — models or service layer only
- No function based views
- No nested routes more than 2 levels deep
- No hardcoded colours — use `theme.ts`
- No copy-pasting UI — make it a component
- No secrets committed to git
