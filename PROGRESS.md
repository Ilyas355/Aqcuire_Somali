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

- Nothing

---

## Next

### Phase 5 — Lesson Flow ✓ (partial)

- [x] Lesson screen — template → practice → quiz → review steps (`lesson-flow.png`)
- [x] Wire Continue button on Home and Learn screens to lesson route
- [ ] Story player screen — audio playback, transcript, tips
- [ ] Wire LevelUpModal trigger on section/level completion

### Phase 6 — Polish

- [ ] My Partners tab — add `/api/community/partners/` list endpoint
- [ ] Vocab review (SRS) flow
- [ ] Pull-to-refresh on all screens
- [ ] Haptic feedback on interactions
- [ ] Skeleton loading states
- [ ] Edit profile screen
