import * as SecureStore from 'expo-secure-store';

import type {
  ForgotPasswordRequest,
  HomeScreenResponse,
  LeaderboardResponse,
  LeaderboardTab,
  LoginRequest,
  LoginResponse,
  MyPartner,
  OwnPartnerProfile,
  PartnerRequestResponse,
  PasswordChangeRequest,
  Profile,
  QuizSubmitRequest,
  QuizSubmitResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  Section,
  StoryCompleteResponse,
  StoryDetail,
  StoryProgressUpdateRequest,
  StoryProgressUpdateResponse,
  StoryQuizQuestion,
  StorySummary,
  SubtopicDetail,
  SubtopicProgressUpdateRequest,
  SubtopicProgressUpdateResponse,
  SuggestedPartner,
  SuggestedPartnerDetail,
  UpdatePartnerProfileRequest,
  UpdateProfileRequest,
  VocabDueItem,
  VocabReviewRequest,
  WeakQuestion,
} from '../types/api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── Token helpers ────────────────────────────────────────────────────────────

export async function storeTokens(access: string, refresh: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync('access_token', access),
    SecureStore.setItemAsync('refresh_token', refresh),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]);
}

async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync('access_token');
}

// Singleton promise — prevents multiple simultaneous 401s from each firing
// their own refresh request (which would burn the refresh token on the first
// use and cause a 401 on the second, logging the user out).
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refresh = await SecureStore.getItemAsync('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        await clearTokens();
        throw new Error('Session expired');
      }

      const data: RefreshResponse = await res.json();
      await SecureStore.setItemAsync('access_token', data.access);
      return data.access;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Request helpers ──────────────────────────────────────────────────────────

async function unauthPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Request failed' }));
  return res.json();
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options: RequestInit = {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    headers['Authorization'] = `Bearer ${newToken}`;
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  }

  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Request failed' }));
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return unauthPost('/api/auth/register/', data);
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return unauthPost('/api/auth/login/', data);
}

export async function getProfile(): Promise<Profile> {
  return request('GET', '/api/auth/profile/');
}

export async function updateProfile(data: UpdateProfileRequest): Promise<Profile> {
  return request('PATCH', '/api/auth/profile/', data);
}

export async function changePassword(data: PasswordChangeRequest): Promise<void> {
  return request('POST', '/api/auth/password/change/', data);
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ detail: string }> {
  return unauthPost('/api/auth/password/forgot/', data);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<{ detail: string }> {
  return unauthPost('/api/auth/password/reset/', data);
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

export async function getSections(): Promise<Section[]> {
  return request('GET', '/api/curriculum/sections/');
}

export async function getSubtopic(id: number): Promise<SubtopicDetail> {
  return request('GET', `/api/curriculum/subtopics/${id}/`);
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getHomeScreen(): Promise<HomeScreenResponse> {
  return request('GET', '/api/progress/home/');
}

export async function updateSubtopicProgress(
  id: number,
  data: SubtopicProgressUpdateRequest,
): Promise<SubtopicProgressUpdateResponse> {
  return request('POST', `/api/progress/subtopic/${id}/update/`, data);
}

export async function submitQuiz(data: QuizSubmitRequest): Promise<QuizSubmitResponse> {
  return request('POST', '/api/progress/quiz/submit/', data);
}

export async function getVocabDue(): Promise<VocabDueItem[]> {
  return request('GET', '/api/progress/vocab/due/');
}

export async function reviewVocab(id: number, data: VocabReviewRequest): Promise<VocabDueItem> {
  return request('PATCH', `/api/progress/vocab/${id}/review/`, data);
}

export async function getWeakQuestions(): Promise<WeakQuestion[]> {
  return request('GET', '/api/progress/quiz/weak/');
}

// ─── Content ──────────────────────────────────────────────────────────────────

export async function getStories(categoryId?: number): Promise<StorySummary[]> {
  const path = categoryId
    ? `/api/content/stories/?category=${categoryId}`
    : '/api/content/stories/';
  return request('GET', path);
}

export async function getStory(id: number): Promise<StoryDetail> {
  return request('GET', `/api/content/stories/${id}/`);
}

export async function updateStoryProgress(
  id: number,
  data: StoryProgressUpdateRequest,
): Promise<StoryProgressUpdateResponse> {
  return request('PATCH', `/api/content/stories/${id}/progress/`, data);
}

export async function completeStory(id: number): Promise<StoryCompleteResponse> {
  return request('POST', `/api/content/stories/${id}/complete/`);
}

export async function getStoryQuiz(id: number): Promise<StoryQuizQuestion[]> {
  return request('GET', `/api/content/stories/${id}/quiz/`);
}

// ─── Community ────────────────────────────────────────────────────────────────

export async function getMyPartnerProfile(): Promise<OwnPartnerProfile> {
  return request('GET', '/api/community/partner-profile/');
}

export async function updatePartnerProfile(data: UpdatePartnerProfileRequest): Promise<OwnPartnerProfile> {
  return request('PATCH', '/api/community/partner-profile/', data);
}

export async function getPartners(): Promise<MyPartner[]> {
  return request('GET', '/api/community/partners/');
}

export async function getSuggestedPartners(): Promise<SuggestedPartner[]> {
  return request('GET', '/api/community/partners/suggested/');
}

export async function getSuggestedPartner(id: number): Promise<SuggestedPartnerDetail> {
  return request('GET', `/api/community/partners/suggested/${id}/`);
}

export async function sendPartnerRequest(userId: number): Promise<PartnerRequestResponse> {
  return request('POST', `/api/community/partners/request/${userId}/`);
}

export async function rejectPartnerRequest(userId: number): Promise<void> {
  return request('DELETE', `/api/community/partners/request/${userId}/`);
}

export async function removePartner(userId: number): Promise<void> {
  return request('DELETE', `/api/community/partners/${userId}/`);
}

export async function patchPresence(): Promise<void> {
  return request('PATCH', '/api/community/presence/');
}

export async function getOnlineCount(): Promise<{ online_count: number }> {
  return request('GET', '/api/community/presence/count/');
}

export async function getLeaderboard(tab: LeaderboardTab = 'all_time'): Promise<LeaderboardResponse> {
  return request('GET', `/api/community/leaderboard/?tab=${tab}`);
}
