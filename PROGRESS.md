# Progress

## Done

- Initial Django project scaffolded (`backend/Aquire_Somali/` config, `manage.py`, `requirements.txt`)
- All 5 Django apps created with base files: `models.py`, `views.py`, `admin.py`, `apps.py`, `tests.py`, `migrations/`
- `users/urls.py` created
- Expo frontend scaffolded (`app.json`, `package.json`, `tsconfig.json`, `eslint.config.js`, `expo-env.d.ts`)
- `constants/theme.ts` created
- `components/ui/` created
- All missing files and folders scaffolded (empty): `serializers.py`, `urls.py`, screens, hooks, `api/api.ts`, `types/api.ts`, `context/AuthContext.tsx`, component folders
- `users/models.py` — UserProfile, Level, UserLevel, Achievement, UserAchievement ✓
- `curriculum/models.py` — Section, Subtopic, Phrase, GrammarNote, KeyPattern, CommonMistake, SurvivalLine, QuizQuestion ✓
- `content/models.py` — StoryCategory, Story, StoryLine, StoryTip, UserStoryProgress ✓
- `progress/models.py` — UserSectionProgress, UserSubtopicProgress, QuizAttempt, VocabReview ✓
- `community/models.py` — PartnerRequest, Partner, PartnerProfile, WeeklyChallenge, UserPresence ✓
- `users/serializers.py` — RegisterSerializer, LevelSerializer, UserLevelSerializer, ProfileSerializer ✓
- `users/views.py` — RegisterView, ProfileView, PasswordChangeView ✓
- `users/urls.py` — register, login, token/refresh, profile, password/change ✓
- `Aquire_Somali/urls.py` — root URL config updated to api/auth/ prefix ✓
- `Aquire_Somali/settings.py` — REST_FRAMEWORK JWT config added ✓
- `curriculum/serializers.py` — GrammarNoteSerializer, QuizQuestionSerializer, KeyPatternSerializer, CommonMistakeSerializer, SurvivalLineSerializer, PhraseSerializer, SubtopicSummarySerializer, SubtopicDetailSerializer, SectionSerializer ✓
- `curriculum/views.py` — SectionListView, SubtopicDetailView ✓
- `curriculum/urls.py` — sections/, subtopics/<int:pk>/ ✓
- `progress/serializers.py` — PhraseMinimalSerializer, VocabDueSerializer, SubtopicProgressUpdateSerializer, QuizSubmitSerializer ✓
- `progress/views.py` — HomeScreenView, SubtopicProgressUpdateView, QuizSubmitView, VocabDueView ✓
- `progress/urls.py` — home/, subtopic/<int:pk>/update/, quiz/submit/, vocab/due/ ✓
- `content/serializers.py` — StoryTipSerializer, StoryLineSerializer, StoryCategorySerializer, StoryListSerializer, StoryDetailSerializer ✓
- `content/views.py` — StoryListView, StoryDetailView, StoryProgressUpdateView, StoryCompleteView ✓
- `content/urls.py` — stories/, stories/<int:pk>/, stories/<int:pk>/progress/, stories/<int:pk>/complete/ ✓
- `community/serializers.py` — PartnerProfileSerializer, SuggestedPartnerSerializer, LeaderboardEntrySerializer, WeeklyChallengeSerializer ✓
- `community/views.py` — SuggestedPartnersView, PartnerRequestView, LeaderboardView ✓
- `community/urls.py` — partners/suggested/, partners/request/<int:pk>/, leaderboard/ ✓
- All 5 `admin.py` files registered — UserProfile, Level, UserLevel, Achievement, UserAchievement, all curriculum models, all progress models, all content models, all community models ✓

### Phase 2 — Frontend Foundation ✓

- `types/api.ts` — TypeScript interfaces for every API response ✓
- `api/api.ts` — typed async function per endpoint ✓
- `context/AuthContext.tsx` — global auth state + token logic ✓

### Phase 3 — Auth Flow ✓

- `app/(auth)/_layout.tsx` — Stack layout, dark background, slide animation ✓
- `app/(auth)/login.tsx` — login form, error handling, focus chain ✓
- `app/(auth)/register.tsx` — register form, field-level errors, focus chain ✓
- `app/_layout.tsx` — AuthProvider wrapper, auth gate (useSegments + router.replace) ✓
- `app/(tabs)/_layout.tsx` — 5-tab layout with Ionicons, AppColors, HapticTab ✓
- `.env` — EXPO_PUBLIC_API_URL set, Django ALLOWED_HOSTS updated ✓
- End-to-end auth flow tested on iOS device ✓

### Phase 4 — Screens ✓

#### Home ✓
- `hooks/useHomeScreen.ts` — useQuery wrapping getHomeScreen ✓
- `components/home/GreetingHeader.tsx` — title, subtitle, streak badge (hidden at 0) ✓
- `components/home/OverallProgressCard.tsx` — SVG circular progress ring ✓
- `components/home/ContinueLearningCard.tsx` — current subtopic card with Continue button ✓
- `components/home/ShortcutTiles.tsx` — Listening and Vocab Quiz shortcut tiles ✓
- `components/home/LevelCard.tsx` — book emoji icon, level name, description, progress bar ✓
- `app/(tabs)/index.tsx` — wired with useHomeScreen, loading/error states ✓
- `backend/apps/progress/views.py` — HomeScreenView returns level_description, next_level_name ✓
- `backend/apps/curriculum/serializers.py` — Section 1 always unlocked regardless of progress record ✓

#### Learn ✓
- `hooks/useCurriculum.ts` — useQuery wrapping getSections ✓
- `components/learn/LearnHeader.tsx` — title, subtitle, streak badge, overall progress bar ✓
- `components/learn/SectionCard.tsx` — category badge (cycles primary/purple/gold by order), XP badge, unlocked/locked/completed states, subtopic tags, Continue button ✓
- `app/(tabs)/learn.tsx` — wired with useCurriculum + cached useHomeScreen, loading/error states, "HOW IT WORKS" alert ✓

#### Listen ✓
- `hooks/useStories.ts` — useQuery wrapping getStories ✓
- `components/listen/ListenHeader.tsx` — title, subtitle, streak badge ✓
- `components/listen/CategoryTabs.tsx` — horizontal scrollable filter pills, active = green filled, categories extracted from stories ✓
- `components/listen/FeaturedStoryCard.tsx` — trending story card with decorative waveform bars, "Play Now" button ✓
- `components/listen/StoryRow.tsx` — difficulty badge (BEG/INT/ADV colored), title, description, duration/XP, completed ✓ indicator ✓
- `app/(tabs)/listen.tsx` — client-side category filtering, featured card on "All Stories" tab only, empty state ✓

#### Community ✓
- `hooks/useCommunity.ts` — useSuggestedPartners, useLeaderboard(tab), useSendPartnerRequest (invalidates cache on success) ✓
- `components/community/CommunityHeader.tsx` — label, streak badge, "Ready to level up?" promo card ✓
- `components/community/CommunityTabs.tsx` — underline-style tab switcher (Suggested / My Partners / Leaderboard) ✓
- `components/community/PartnerCard.tsx` — letter avatar, name/handle, heritage speaker badge, bio, availability/format chips, match % badge, Connect/Pending/Accept button ✓
- `components/community/LeaderboardView.tsx` — weekly challenge card, segment control sub-tabs (This week/All time/Partners), ranked learner list with gold #1 ✓
- `app/(tabs)/community.tsx` — tab state, connect mutation with per-card loading state, My Partners placeholder ✓

#### Profile ✓
- `backend/apps/users/serializers.py` — LevelSerializer extended (description, order); UserLevelSerializer extended (level_percentage, next_level_name); new AchievementSerializer + UserAchievementSerializer; ProfileSerializer extended (achievements, partners_count) ✓
- `types/api.ts` — Level, UserLevel, Profile updated; new Achievement, UserAchievement interfaces ✓
- `hooks/useProfile.ts` — useProfile query + useUpdateProfile mutation with optimistic updates ✓
- `components/profile/ProfileHeader.tsx` — initials avatar, username, handle/location, streak badge, level subtitle badge, join date ✓
- `components/profile/StatsRow.tsx` — 4-tile card: total XP, overall % complete, day streak, partners ✓
- `components/profile/SectionProgressList.tsx` — section items with progress bar or locked badge ✓
- `components/profile/AchievementsGrid.tsx` — earned achievements in 4-column grid, empty state ✓
- `components/profile/SettingsSection.tsx` — Switch toggles with optimistic updates, action rows with chevron, destructive logout ✓
- `components/profile/LevelUpModal.tsx` — full-screen celebration modal (trophy, level name, stats, share, keep going) — trigger wired in Phase 5 ✓
- `app/(tabs)/profile.tsx` — wired with useProfile, useCurriculum, useUpdateProfile, useAuth ✓

---

## In Progress

### Phase 9 — App Restructure (Listen-first)

The core learning model is shifting to comprehensible input. Stories are the primary learning surface; flashcard drill replaces the structured lesson flow.

#### 9a — Rename Learn → Practice ✓
- [x] Rename tab title from "Learn" to "Practice" in `app/(tabs)/_layout.tsx`
- [x] Remove the 4-step lesson flow (template → practice → quiz → review) — `app/lesson/[id].tsx`, `components/lesson/`, `hooks/useLesson.ts`
- [x] Remove "Continue" button wiring on Home and Learn screens (no lesson route) — Home now navigates to Practice tab
- [x] Redesign `app/(tabs)/learn.tsx` as phrase flashcard + quiz screen with subtopic picker → flashcard → quiz → done flow
- [x] Flashcards draw from `Phrase` model — Somali front, English back, tap to flip
- [x] Quizzes use existing `QuizQuestion` model — multiple choice per phrase, XP awarded via `quiz/submit/`
- [x] Remove `SectionCard`, `LearnHeader`, and all `components/lesson/` — no longer needed
- [x] `useSubtopicDetail` moved to `useCurriculum.ts`; `useSubmitPracticeQuiz` in `hooks/usePractice.ts`

#### 9b — Listen as the main tab ✓
- [x] Listen tab already in position 2 (after Home) — no change needed
- [x] Backend: `StoryQuizQuestion` model added to `content/models.py`, migration applied
- [x] Backend: `GET /api/content/stories/<id>/quiz/` — `StoryQuizView` returns questions for a story
- [x] Backend: `StoryCompleteView` refactored — XP/completion logic moved to `UserStoryProgress.complete(story)` model method; `apply_xp` wired in view
- [x] Backend: `is_locked` added to `StoryListSerializer` — Intermediate locked until ≥1 Beginner complete, Advanced locked until ≥1 Intermediate complete; `completed_difficulties` set passed via context from `StoryListView`
- [x] Backend: `seed_stories` management command — 9 new stories (4 Beginner, 3 Intermediate, 3 Advanced) each with lines + 3 quiz questions; Conversation 1 quiz questions added inline
- [x] Frontend: `StoryQuizQuestion` interface + `is_locked` on `StorySummary` in `types/api.ts`
- [x] Frontend: `getStoryQuiz(id)` in `api/api.ts`; `useStoryQuiz(id)` in `hooks/useStories.ts`
- [x] Frontend: story player — removed auto-complete on audio finish; "Complete Story" button shown when audio ends or story has no audio; navigates to `/story-quiz/<id>`
- [x] Frontend: `components/story/StoryQuizCard.tsx` — comprehension quiz card with local correct/wrong feedback, haptics
- [x] Frontend: `app/story-quiz/[id].tsx` — full quiz flow: question dots → quiz → results (score + emoji) → collect XP → done; registered in root `_layout.tsx`

#### 9d — Practice tab content refactor + weak-spot drilling ✓
- [x] Backend: update `UserSubtopicProgress.current_step` choices from old 4-step values to `flashcard` / `quiz` / `done`; migration applied
- [x] Backend: `QuizAttempt.weak_questions_for(user)` classmethod — annotates questions with attempt stats, filters where correct rate < 60% or last attempt was wrong
- [x] Backend: `WeakQuestionsView` — `GET /api/progress/quiz/weak/` with `WeakQuestionSerializer`
- [x] Backend: `quiz/weak/` registered in `progress/urls.py`
- [x] Frontend: `PracticeStep` type replaces `LessonStep`; `WeakQuestion` interface added to `types/api.ts`
- [x] Frontend: `getWeakQuestions()` added to `api/api.ts`
- [x] Frontend: `useWeakQuestions()` hook added to `hooks/useProgress.ts`
- [x] Frontend: `'weak'` mode added to Practice screen — phrase context card + quiz drill, back link, weak count badge
- [x] Frontend: "Drill weak spots" banner on picker (hidden when 0 weak questions); secondary button on done screen

#### 9e — Daily character quote card ✓
- [x] Add `DailyQuoteCard` component to `components/home/` — speech bubble style card with character avatar, Somali quote, English translation, and character name
- [x] Local array of 50 quotes in `constants/quotes.ts` — motivational/funny Somali phrases with English translations, cycling daily via `dayOfYear % quotes.length`
- [x] Mount card at the bottom of the Home screen below `LevelCard`

#### 9c — Home screen adjustments ✓
- [x] Remove `ContinueLearningCard` — replaced with `ContinueListeningCard`
- [x] `ContinueListeningCard` — purple LinearGradient card, navigates directly to story player (resume or start)
- [x] Shortcut tiles changed to Practice (green) and Connect (purple)
- [x] Backend: `HomeScreenView` now returns `current_story` (in-progress first, else first story) instead of `current_subtopic`
- [x] Frontend: `CurrentStory` interface added to `types/api.ts`, `HomeScreenResponse` updated

---

### Phase 9f — Practice screen bug fixes

#### 9f-1 — Remove phrase context card from weak drill ✓
- [x] Remove the `weakContext` card rendered above the `PracticeQuizCard` in weak mode — it exposes the correct answer and shows a meaningless fraction

#### 9f-2 — Prevent XP farming on repeated quiz submissions ✓
- [x] Added `QuizAttempt.was_answered_correctly(user, question)` classmethod on model
- [x] `QuizSubmitView` checks this before awarding XP — `xp_awarded: 0` if already answered correctly; attempt still recorded

#### 9f-3 — Practice nav link resets session without affecting progress ✓
- [x] `useFocusEffect` in `learn.tsx` resets all session state to picker on every screen focus; already-recorded `QuizAttempt` rows and `UserSubtopicProgress` stay untouched
- [x] `tabPress` listener via `useNavigation<BottomTabNavigationProp>` handles the case where the user taps Practice while already on the Practice screen (useFocusEffect does not re-fire in this case)
- [x] Both hooks call the same `resetSession` callback; trigger conditions are mutually exclusive so no double-reset

#### 9f-4 — DailyQuoteCard padding fix ✓
- [x] Removed `paddingTop: 2` from `quoteLines` (was adding unwanted space above Somali text)
- [x] Moved `paddingBottom: 8` from `quoteLines` to `english` style — now sits explicitly below the translation, before the meaning divider

---

## Next

### Phase 5 — Lesson Flow ✓ (partial)

- [x] Lesson screen — template → practice → quiz → review steps (`lesson-flow.png`)
- [x] Wire Continue button on Home and Learn screens to lesson route
- [ ] Wire LevelUpModal trigger on section/level completion

### Phase 5b — Story Player

#### Backend ✓
- [x] Add `timestamp_seconds: PositiveIntegerField(default=0)` to `StoryLine` model
- [x] Add `audio_url: URLField(blank=True)` to `Story` model
- [x] Run and apply migration
- [x] Add `timestamp_seconds` to `StoryLineSerializer` fields
- [x] Add `audio_url` to `StoryDetailSerializer` and `StoryListSerializer` fields
- [x] Configure `MEDIA_ROOT` and `MEDIA_URL` in `settings.py`
- [x] Add media file serving to `urls.py` (dev only)
- [x] Seed Conversation 1 story + lines with timestamps via management command

#### Frontend ✓
- [x] Install `expo-av` for audio playback
- [x] Add `timestamp_seconds` to `StoryLine` interface in `types/api.ts`
- [x] Add `audio_url` to `StoryDetail` and `StorySummary` interfaces in `types/api.ts`
- [x] Add `useStoryDetail(id)`, `useUpdateStoryProgress`, `useCompleteStory` to `hooks/useStories.ts`
- [x] Build `components/story/StoryPlayerHeader.tsx` — title, back, XP badge
- [x] Build `components/story/TranscriptToggle.tsx` — Somali / English toggle
- [x] Build `components/story/TranscriptLine.tsx` — speaker, text, active highlight, tip dot, tap-to-seek
- [x] Build `components/story/StoryPlayer.tsx` — play/pause, scrub bar, position/duration labels
- [x] Build `app/story/[id].tsx` — full player screen: expo-av audio, active line tracking, tip modal, complete on finish
- [x] Register `story/[id]` in root `_layout.tsx`
- [x] Wire story row tap on Listen screen to navigate to `app/story/[id].tsx`

### Phase 6 — Community System

The models, URLs, and basic views exist but the feature is non-functional. Zero PartnerProfile,
PartnerRequest, Partner, WeeklyChallenge, or UserPresence rows in the database.
Build in this order:

#### 6a — Make suggestions work ✓
- [x] Auto-create `PartnerProfile` on registration — `post_save` signal on `User` in `community/models.py`, connected in `CommunityConfig.ready()`
- [x] Seeded PartnerProfiles for all 7 existing test users via `python manage.py seed_partner_profiles`
- [x] Verified: `SuggestedPartnersView` now returns 6 suggestions for test accounts

#### 6b — My Partners tab ✓
- [x] Backend: `GET /api/community/partners/` — `PartnersListView` with `MyPartnerSerializer`, ordered by `-connected_at`
- [x] Added `partners/` URL to `community/urls.py`
- [x] Added `MyPartner` interface to `types/api.ts`, extended `PartnerDisplayStatus` with `'partner'`
- [x] Added `getPartners()` to `api/api.ts`
- [x] Added `usePartners()` hook to `hooks/useCommunity.ts`
- [x] `useSendPartnerRequest.onSuccess` invalidates both `['suggestedPartners']` and `['partners']`
- [x] Partners tab replaced with real list — uses `PartnerCard` with `request_status: 'partner'` (shows green "Partners ✓" badge)
- [x] Tested: empty → connect → 1 partner with correct shape

#### 6c — Reject & remove ✓
- [x] Backend: `PartnerRequest.reject(receiver)` model method — sets REJECTED, validates receiver
- [x] Backend: `Partner.remove(user, partner_user)` model method — atomically deletes both rows
- [x] Backend: `DELETE /api/community/partners/request/<id>/` — receiver rejects incoming pending request
- [x] Backend: `DELETE /api/community/partners/<id>/` — removes existing partner (both rows)
- [x] `PartnerDetailView` wired to `partners/<int:pk>/` URL
- [x] `rejectPartnerRequest()` + `removePartner()` added to `api/api.ts` (DELETE helper extended for 204)
- [x] `useRejectPartnerRequest()` + `useRemovePartner()` hooks added to `hooks/useCommunity.ts`
- [x] Reject button shown on `PartnerCard` when `request_status === 'received'`
- [x] Remove button shown on `PartnerCard` when in My Partners tab

#### 6d — PartnerProfile setup ✓
- [x] Backend: `PartnerProfileUpdateSerializer` — writable fields: bio, is_heritage_speaker, availability, preferred_format
- [x] Backend: `PartnerProfileView` (`RetrieveUpdateAPIView`) — `GET /api/community/partner-profile/` + `PATCH /api/community/partner-profile/`
- [x] `OwnPartnerProfile` + `UpdatePartnerProfileRequest` interfaces added to `types/api.ts`
- [x] `getMyPartnerProfile()` + `updatePartnerProfile()` added to `api/api.ts`
- [x] `useMyPartnerProfile()` + `useUpdatePartnerProfile()` hooks added to `hooks/useCommunity.ts`
- [x] `PartnerProfileModal` — sheet modal with bio, availability, format, heritage speaker toggle
- [x] "Partner profile" action row added to `SettingsSection`
- [x] Modal mounted in `profile.tsx`, closes on successful save

#### 6e — Weekly Challenges ✓
- [x] `seed_weekly_challenge` management command — creates `Achievement` (key: `gold_partner_badge`) and a current-week `WeeklyChallenge`, idempotent
- [x] `WeeklyChallenge.get_current()` verified returning the seeded row with correct serialized shape
- [x] No frontend changes needed — `LeaderboardView` already conditionally renders the challenge banner

#### 6f — Error feedback ✓
- [x] Added `onError` handler to `useSendPartnerRequest` — maps `already_partners`, `rejected`, and generic network errors to specific `Alert.alert` messages

#### Refactors completed (views now guideline-compliant) ✓
- [x] `Partner.suggested_candidates_for(user)` — candidate exclusion queryset moved from `SuggestedPartnersView`
- [x] `PartnerRequest.request_status_map_for(user)` — outgoing/incoming status dict moved from `SuggestedPartnersView`
- [x] `PartnerRequest.send_or_accept(sender, receiver)` — mutual detection + Partner creation moved from `PartnerRequestView`
- [x] `WeeklyChallenge.get_current()` — active challenge query moved from `LeaderboardView`
- [x] `UserProfile.leaderboard_all_time/this_week/partners()` — all three leaderboard queries moved from `LeaderboardView`
- [x] All changes tested end-to-end with `APIRequestFactory` — every status code and data shape confirmed correct

### Phase 7 — Polish ✓

#### Pull-to-refresh ✓
- [x] `ScreenWrapper` extended with `onRefresh`/`isRefreshing` props → `RefreshControl` on ScrollView
- [x] All 5 tab screens wired: Home, Learn, Listen (single query refetch), Community (combined refetch for suggested + partners), Profile

#### Haptic feedback ✓
- [x] `QuizStep` — correct answer: `NotificationFeedbackType.Success`, wrong: `NotificationFeedbackType.Error`
- [x] `ContinueLearningCard` — Continue button: `ImpactFeedbackStyle.Medium`
- [x] `PartnerCard` — Connect + Accept buttons: `ImpactFeedbackStyle.Medium`
- [x] `VocabReviewScreen` — Got it: `NotificationFeedbackType.Success`, flip: `ImpactFeedbackStyle.Light`

#### Vocab review (SRS) flow ✓
- [x] Backend: `VocabReview.schedule(quality)` — SM-2 algorithm implementation
- [x] Backend: `VocabReview.queue_phrases(user, subtopic)` — queues all phrases when subtopic first completed
- [x] Backend: `PATCH /api/progress/vocab/<id>/review/` — `VocabReviewView` + `VocabReviewSerializer`
- [x] `VocabReviewRequest` type added to `types/api.ts`
- [x] `reviewVocab()` added to `api/api.ts`
- [x] `useVocabDue()` + `useReviewVocab()` hooks in `hooks/useProgress.ts`
- [x] `app/vocab-review.tsx` — flashcard screen: Somali → tap to reveal English, Got it/Again, progress dots, done state
- [x] Registered in `_layout.tsx`, Vocab Quiz tile on Home now navigates to `/vocab-review`

#### Skeleton loading states ✓
- [x] `components/ui/Skeleton.tsx` — pulsing `Animated.Value` opacity, `Skeleton` + `SkeletonCard` primitives
- [x] Home, Learn, Listen, Profile screens: `ActivityIndicator` loading replaced with contextual skeleton layouts

#### Edit profile modal ✓
- [x] `components/profile/EditProfileModal.tsx` — handle, location, is_diaspora fields in a page sheet
- [x] `SettingsSection` "Edit profile" row wired to `onEditProfile` callback
- [x] Modal mounted in `profile.tsx`, closes on successful save

### Phase 8 — Community Polish (design gaps)

Design audit against `community-screen.png` revealed four missing pieces.

#### Bug fix — Partners not appearing after accept ✓
- [x] Root cause: `MyPartnerSerializer.partner_profile` was a nested `ModelSerializer(read_only=True)` — when `PartnerProfile` was missing DRF raised `SkipField`, omitting the field, and `PartnerCard` crashed on `undefined.is_heritage_speaker`
- [x] Backend: changed `partner_profile` to `SerializerMethodField` with `try/except AttributeError` fallback returning empty defaults — pure data transformation, no side effects
- [x] Frontend: added `?? { defaults }` null-coalescing fallback in `PartnerCard` for the case where stale cached data arrives before backend fix takes effect
- [x] Types: `SuggestedPartner.partner_profile` and `MyPartner.partner_profile` updated to `PartnerProfile | null`

#### 8d — "Your rank" in leaderboard ✓
- [x] Backend: `UserProfile.my_rank_all_time(user)` classmethod — counts profiles with higher `total_xp` + 1
- [x] Backend: `UserProfile.my_rank_this_week(user)` classmethod — computes user's weekly XP via aggregation, counts profiles with higher weekly XP + 1
- [x] Backend: `LeaderboardView.get` extended — dispatches to the right classmethod per tab, adds `my_rank` to response (`null` for Partners tab)
- [x] `LeaderboardResponse.my_rank: { rank: number; xp: number } | null` added to `types/api.ts`
- [x] `LeaderboardView.tsx` — pinned green "You" row rendered below the list when `data.my_rank` is present, styled with `primaryMuted` background + primary border + `useAuth` for username

#### 8c — Online presence ("Learners online right now") ✓
- [x] Backend: `UserPresence.mark_online(user)` classmethod — `get_or_create` + `save()` to trigger `auto_now` on `last_active`
- [x] Backend: `UserPresence.online_count()` classmethod — counts rows with `last_active >= now - 5min` and `is_online=True`
- [x] Backend: `PresenceView(APIView)` PATCH at `/api/community/presence/` — calls `mark_online`, returns 204
- [x] Backend: `PresenceCountView(APIView)` GET at `/api/community/presence/count/` — returns `{ online_count: N }`
- [x] `patchPresence()` + `getOnlineCount()` added to `api/api.ts`
- [x] `useOnlineCount()` (60s `refetchInterval`) + `usePingPresence()` added to `hooks/useCommunity.ts`
- [x] `community.tsx` — `useFocusEffect` calls `pingPresence()` on every community tab focus; online count banner renders above "SUGGESTED FOR YOU" when count > 0

#### 8b — Richer partner cards ✓
- [x] Backend: `SuggestedPartnerSerializer` extended — `level_name`, `current_section`, `total_xp`, `is_online` added; `UserSectionProgress.current_title_for(user)` classmethod added; `UserPresence.is_currently_online` property added; `suggested_candidates_for` queryset extended with `select_related('level__current_level', 'presence')`
- [x] `SuggestedPartner` interface updated in `types/api.ts` with the four new fields
- [x] `PartnerCard` updated — online dot in name row, level badge + heritage badge row, `current_section` and XP meta chips

#### 8a — Partner detail screen ✓
- [x] Backend: `SuggestedPartnerDetailSerializer` — extends `SuggestedPartnerSerializer` with `current_streak` and `is_diaspora`; match scoring moved to `PartnerProfile.match_score_with(other)` model method; effective status determination moved to `Partner.effective_request_status(user, candidate)` model classmethod
- [x] Backend: `SuggestedPartnerDetailView(APIView)` — `GET /api/community/partners/suggested/<int:pk>/`; fully delegates to model methods, no business logic in view
- [x] `SuggestedPartnerDetail` interface added to `types/api.ts`
- [x] `getSuggestedPartner(id)` added to `api/api.ts`
- [x] `useSuggestedPartner(id)` hook added to `hooks/useCommunity.ts`
- [x] `partner/[id]` registered in root `_layout.tsx`
- [x] `app/partner/[id].tsx` built — large letter avatar, online pill, level/heritage/diaspora badges, bio, stats row (XP · rating · partners · streak), compatibility score bar, detail tags (section/availability/format), sticky action bar with circular ✕/✓ buttons matching design
- [x] `PartnerCard` updated — accepts `onPress?: (id: number) => void`; wraps in `Pressable` when provided; shows "Respond →" chip (orange) for `received` status instead of inline Accept/Reject
- [x] `community.tsx` — suggested cards navigate to `partner/[id]` on tap; inline `onReject` removed; `rejectingId` state and `useRejectPartnerRequest` import removed

## Technical Debt — Business Logic in Views

Business logic still living in views instead of models/service layer (guideline violation).
Refactor these before scaling. Ordered by risk/impact.

### `progress/views.py`

- [ ] **Section completion + next section unlock** (`SubtopicProgressUpdateView`) — the subtopic count check, `is_completed=True` write, and next-section `get_or_create` should move to a `UserSectionProgress.record_subtopic_completed(subtopic)` model method with the `transaction.atomic()` block inside it
- [ ] **Level percentage calculation** (`HomeScreenView`) — `round(xp_into_level / xp_required * 100)` and the max-level cap logic should be a `UserLevel.level_percentage` property
- [ ] **"Current subtopic" resolution** (`HomeScreenView`) — the in-progress query + unstarted fallback should be a `UserSubtopicProgress.get_current_for_user(user)` classmethod
- [ ] **phrases_completed clamping** (`SubtopicProgressUpdateView`) — `min(data['phrases_completed'], phrase_count)` should be a `UserSubtopicProgress.clamp_phrases(count, subtopic)` or handled in the model's `save()`

### `users/views.py`

- [ ] **Token issuance on register** (`RegisterView`) — `RefreshToken.for_user(user)` + token string construction should move to the `RegisterSerializer.create()` return value or a `UserProfile.issue_tokens()` method
- [ ] **Password change logic** (`PasswordChangeView`) — `check_password()` + `validate_password()` + `set_password()` is a multi-step state change that belongs on a `User` service method, not inline in the view

### `community/views.py` ✓ fully refactored

- [x] `Partner.suggested_candidates_for(user)` — `SuggestedPartnersView`
- [x] `PartnerRequest.request_status_map_for(user)` — `SuggestedPartnersView`
- [x] `PartnerRequest.send_or_accept(sender, receiver)` — `PartnerRequestView`
- [x] `UserProfile.leaderboard_all_time/this_week/partners()` — `LeaderboardView`
- [x] `WeeklyChallenge.get_current()` — `LeaderboardView`

### `curriculum/views.py` ✓ fully refactored

- [x] `QuizQuestion.check_answer(answer)` — `QuizSubmitView`
- [x] `QuizQuestion.xp_for_correct()` / `QuizQuestion.XP_BY_LAYER` — `QuizSubmitView`

### `content/views.py`

- [ ] **Story completion + XP award** (`StoryCompleteView`) — the idempotency check (`not progress.is_completed`), last line position derivation (`story.lines.count()`), and XP award should move to a `UserStoryProgress.complete(story)` model method
