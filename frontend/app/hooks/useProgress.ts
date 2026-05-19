import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getVocabDue, reviewVocab } from '@/api/api';
import type { ApiError, VocabDueItem } from '@/types/api';

export function useVocabDue() {
  return useQuery({
    queryKey: ['vocabDue'],
    queryFn: getVocabDue,
  });
}

export function useReviewVocab() {
  const queryClient = useQueryClient();
  return useMutation<VocabDueItem, ApiError, { id: number; quality: number }>({
    mutationFn: ({ id, quality }) => reviewVocab(id, { quality }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabDue'] });
      queryClient.invalidateQueries({ queryKey: ['homeScreen'] });
    },
  });
}
