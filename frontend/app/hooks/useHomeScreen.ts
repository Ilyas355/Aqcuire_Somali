import { useQuery } from '@tanstack/react-query';

import { getHomeScreen } from '@/api/api';

export function useHomeScreen() {
  return useQuery({
    queryKey: ['homeScreen'],
    queryFn: getHomeScreen,
  });
}
