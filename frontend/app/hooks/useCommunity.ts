import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getLeaderboard, getSuggestedPartners, sendPartnerRequest } from '@/api/api';
import type { LeaderboardTab } from '@/types/api';

export function useSuggestedPartners() {
  return useQuery({
    queryKey: ['suggestedPartners'],
    queryFn: getSuggestedPartners,
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
  return useMutation({
    mutationFn: sendPartnerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedPartners'] });
    },
  });
}
