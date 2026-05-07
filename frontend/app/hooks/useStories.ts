import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { completeStory, getStories, getStory, updateStoryProgress } from '@/api/api';
import type { StoryProgressUpdateRequest } from '@/types/api';

export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: () => getStories(),
  });
}

export function useStoryDetail(id: number) {
  return useQuery({
    queryKey: ['story', id],
    queryFn: () => getStory(id),
    enabled: id > 0,
  });
}

export function useUpdateStoryProgress(storyId: number) {
  return useMutation({
    mutationFn: (data: StoryProgressUpdateRequest) => updateStoryProgress(storyId, data),
  });
}

export function useCompleteStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => completeStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['homeScreen'] });
    },
  });
}
