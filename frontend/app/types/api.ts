// ─── Shared ──────────────────────────────────────────────────────────────────

export type PracticeStep = 'flashcard' | 'quiz' | 'done';
export type QuizLayer = 'recognition' | 'recall' | 'production';
export type PartnerDisplayStatus = 'none' | 'pending' | 'received' | 'partner';
export type PartnerRequestOutcome = 'pending' | 'accepted';
export type LeaderboardTab = 'all_time' | 'this_week' | 'partners';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  handle: string;
}

export interface RegisterResponse extends AuthTokens {
  user: AuthUser;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = AuthTokens;

export interface RefreshResponse {
  access: string;
}

export interface Level {
  name: string;
  subtitle: string;
  description: string;
  xp_required: number;
  order: number;
}

export interface UserLevel {
  current_level: Level;
  xp_into_level: number;
  level_percentage: number;
  next_level_name: string | null;
}

export interface Achievement {
  key: string;
  title: string;
  icon: string;
  description: string;
}

export interface UserAchievement {
  achievement: Achievement;
  earned_at: string;
}

export interface Profile {
  username: string;
  email: string;
  handle: string;
  avatar: string;
  location: string;
  is_diaspora: boolean;
  joined_date: string;
  total_xp: number;
  current_streak: number;
  last_active_date: string | null;
  daily_reminder_time: string | null;
  audio_autoplay: boolean;
  dark_mode: boolean;
  transliteration: boolean;
  level: UserLevel | null;
  achievements: UserAchievement[];
  partners_count: number;
}

export interface UpdateProfileRequest {
  email?: string;
  handle?: string;
  avatar?: string;
  location?: string;
  is_diaspora?: boolean;
  daily_reminder_time?: string | null;
  audio_autoplay?: boolean;
  dark_mode?: boolean;
  transliteration?: boolean;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

export interface GrammarNote {
  id: number;
  note: string;
}

export interface QuizQuestion {
  id: number;
  layer: QuizLayer;
  question_text: string;
  correct_answer: string;
  distractor_1: string;
  distractor_2: string;
  distractor_3: string;
}

export interface Phrase {
  id: number;
  somali: string;
  english: string;
  audio_url: string;
  order: number;
  grammar_notes: GrammarNote[];
  quiz_questions: QuizQuestion[];
}

export interface KeyPattern {
  id: number;
  somali_pattern: string;
  english_pattern: string;
  breakdown: string;
  order: number;
}

export interface CommonMistake {
  id: number;
  wrong: string;
  correct: string;
  explanation: string;
}

export interface SurvivalLine {
  id: number;
  somali: string;
  order: number;
}

export interface SubtopicSummary {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface SubtopicDetail {
  id: number;
  title: string;
  description: string;
  order: number;
  section_title: string;
  section_xp_reward: number;
  phrases: Phrase[];
  key_patterns: KeyPattern[];
  common_mistakes: CommonMistake[];
  survival_lines: SurvivalLine[];
}

export interface Section {
  id: number;
  title: string;
  category_tag: string;
  description: string;
  xp_reward: number;
  order: number;
  subtopics: SubtopicSummary[];
  is_unlocked: boolean;
  is_completed: boolean;
  subtopics_completed: number;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface CurrentStory {
  id: number;
  title: string;
  difficulty: string;
  duration_seconds: number;
  xp_reward: number;
  last_line_position: number;
  is_completed: boolean;
  category: string;
  quiz_count: number;
}

export interface HomeScreenResponse {
  greeting_level: string | null;
  level_description: string | null;
  current_story: CurrentStory | null;
  overall_progress: {
    percentage: number;
    section: number;
    completed_sections: number;
    subtopics_remaining: number;
  };
  vocab_due_count: number;
  user_xp: number;
  user_streak: number;
  user_level_percentage: number;
  next_level_name: string | null;
  xp_into_level: number;
  level_xp_required: number;
  level_subtitle: string | null;
}

export interface SubtopicProgressUpdateRequest {
  current_step: PracticeStep;
  phrases_completed: number;
  is_completed: boolean;
}

export interface SubtopicProgressUpdateResponse {
  current_step: PracticeStep;
  phrases_completed: number;
  is_completed: boolean;
}

export interface WeakQuestion {
  id: number;
  layer: QuizLayer;
  question_text: string;
  correct_answer: string;
  distractor_1: string;
  distractor_2: string;
  distractor_3: string;
  phrase_id: number;
  phrase_somali: string;
  phrase_english: string;
  total_attempts: number;
  correct_attempts: number;
  last_correct: boolean;
}

export interface QuizSubmitRequest {
  question_id: number;
  answer_given: string;
}

export interface QuizSubmitResponse {
  is_correct: boolean;
  xp_awarded: number;
  correct_answer: string;
}

export interface PhraseMinimal {
  id: number;
  somali: string;
  english: string;
  audio_url: string;
}

export interface VocabDueItem {
  id: number;
  phrase: PhraseMinimal;
  next_review: string;
  interval: number;
  ease_factor: number;
  repetitions: number;
}

export interface VocabReviewRequest {
  quality: number;
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface StoryCategory {
  id: number;
  name: string;
}

export interface StoryTip {
  id: number;
  tip_text: string;
  explanation: string;
}

export interface StoryLine {
  id: number;
  somali: string;
  english: string;
  speaker_name: string;
  audio_url: string;
  timestamp_seconds: number;
  order: number;
  tips: StoryTip[];
}

export interface StoryQuizQuestion {
  id: number;
  question_text: string;
  correct_answer: string;
  distractor_1: string;
  distractor_2: string;
  distractor_3: string;
  order: number;
}

export interface StorySummary {
  id: number;
  title: string;
  description: string;
  category: StoryCategory;
  difficulty: string;
  duration_seconds: number;
  xp_reward: number;
  is_trending: boolean;
  order: number;
  audio_url: string;
  is_completed: boolean;
  last_line_position: number;
  is_locked: boolean;
  quiz_count: number;
}

export interface StoryDetail extends Omit<StorySummary, 'is_completed'> {
  lines: StoryLine[];
}

export interface StoryProgressUpdateRequest {
  last_line_position: number;
}

export interface StoryProgressUpdateResponse {
  last_line_position: number;
}

export interface StoryCompleteResponse {
  is_completed: boolean;
  xp_awarded: number;
}

// ─── Community ────────────────────────────────────────────────────────────────

export interface PartnerProfile {
  bio: string;
  total_partners: number;
  is_heritage_speaker: boolean;
  availability: string;
  city: string;
  preferred_format?: string; // only present when viewing as an actual partner
}

export interface SuggestedPartner {
  id: number;
  username: string;
  handle: string;
  avatar: string;
  partner_profile: PartnerProfile | null;
  request_status: PartnerDisplayStatus;
  match_percentage: number;
  total_xp: number;
  level_name: string | null;
  current_section: string | null;
  is_online: boolean;
}

export interface SuggestedPartnerDetail extends SuggestedPartner {
  current_streak: number;
  is_diaspora: boolean;
}

export interface MyPartner {
  id: number;
  username: string;
  handle: string;
  avatar: string;
  partner_profile: PartnerProfile | null;
  connected_at: string;
}

export interface ApiError {
  status?: string;
  detail?: string;
  error?: string;
}

export interface OwnPartnerProfile {
  bio: string;
  is_heritage_speaker: boolean;
  availability: string;
  preferred_format: string;
  city: string;
}

export interface UpdatePartnerProfileRequest {
  bio?: string;
  is_heritage_speaker?: boolean;
  availability?: string;
  preferred_format?: string;
  city?: string;
}

export interface PartnerRequestResponse {
  status: PartnerRequestOutcome;
}

export interface LeaderboardEntry {
  username: string;
  handle: string;
  avatar: string;
  xp: number;
  city: string;
}

export interface WeeklyChallenge {
  id: number;
  title: string;
  reward_badge: string;
  starts_at: string;
  ends_at: string;
}

export interface LeaderboardResponse {
  tab: LeaderboardTab;
  leaderboard: LeaderboardEntry[];
  current_challenge: WeeklyChallenge | null;
  my_rank: { rank: number; xp: number } | null;
}
