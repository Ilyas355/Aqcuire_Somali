import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getSubtopic, submitQuiz, updateSubtopicProgress } from '@/api/api';
import type { QuizSubmitRequest, SubtopicProgressUpdateRequest } from '@/types/api';

export function useSubtopicDetail(id: number) {
  return useQuery({
    queryKey: ['subtopic', id],
    queryFn: () => getSubtopic(id),
    enabled: id > 0,
  });
}

export function useUpdateSubtopicProgress(subtopicId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubtopicProgressUpdateRequest) =>
      updateSubtopicProgress(subtopicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['homeScreen'] });
    },
  });
}

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: (data: QuizSubmitRequest) => submitQuiz(data),
  });
}
