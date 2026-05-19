import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getLeaderboard, getMyPartnerProfile, getOnlineCount, getPartners, getSuggestedPartner, getSuggestedPartners, patchPresence, rejectPartnerRequest, removePartner, sendPartnerRequest, updatePartnerProfile } from '@/api/api';
import type { ApiError, LeaderboardTab, OwnPartnerProfile, PartnerRequestResponse, UpdatePartnerProfileRequest } from '@/types/api';

export function useMyPartnerProfile() {
  return useQuery({
    queryKey: ['myPartnerProfile'],
    queryFn: getMyPartnerProfile,
  });
}

export function useUpdatePartnerProfile() {
  const queryClient = useQueryClient();
  return useMutation<OwnPartnerProfile, ApiError, UpdatePartnerProfileRequest>({
    mutationFn: updatePartnerProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['myPartnerProfile'], updated);
      queryClient.invalidateQueries({ queryKey: ['suggestedPartners'] });
    },
    onError: () => {
      Alert.alert('Save failed', 'Could not update partner profile. Please try again.');
    },
  });
}

export function useSuggestedPartners() {
  return useQuery({
    queryKey: ['suggestedPartners'],
    queryFn: getSuggestedPartners,
  });
}

export function useSuggestedPartner(id: number) {
  return useQuery({
    queryKey: ['suggestedPartner', id],
    queryFn: () => getSuggestedPartner(id),
  });
}

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: getPartners,
  });
}

export function useRejectPartnerRequest() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: rejectPartnerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedPartners'] });
    },
    onError: () => {
      Alert.alert('Reject failed', 'Could not reject request. Please try again.');
    },
  });
}

export function useRemovePartner() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: removePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: () => {
      Alert.alert('Remove failed', 'Could not remove partner. Please try again.');
    },
  });
}

export function useOnlineCount() {
  return useQuery({
    queryKey: ['onlineCount'],
    queryFn: getOnlineCount,
    refetchInterval: 60_000,
  });
}

export function usePingPresence() {
  return useMutation<void, ApiError, void>({
    mutationFn: patchPresence,
  });
}

export function useLeaderboard(tab: LeaderboardTab) {
  return useQuery({
    queryKey: ['leaderboard', tab],
    queryFn: () => getLeaderboard(tab),
  });
}

export function useSendPartnerRequest() {
  const queryClient = useQueryClient();
  return useMutation<PartnerRequestResponse, ApiError, number>({
    mutationFn: sendPartnerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedPartners'] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (error: ApiError) => {
      const message =
        error?.status === 'already_partners' ? 'You are already partners.' :
        error?.status === 'rejected' ? 'This request was previously rejected.' :
        'Could not send request. Please try again.';
      Alert.alert('Connect failed', message);
    },
  });
}
