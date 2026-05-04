import { useQuery } from '@tanstack/react-query';

import { getStories } from '@/api/api';

export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: () => getStories(),
  });
}
