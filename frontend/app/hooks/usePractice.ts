import { useMutation, useQueryClient } from '@tanstack/react-query';

import { submitQuiz } from '@/api/api';
import type { QuizSubmitRequest } from '@/types/api';

export function useSubmitPracticeQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizSubmitRequest) => submitQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeScreen'] });
    },
  });
}
