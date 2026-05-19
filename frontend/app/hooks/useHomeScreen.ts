import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';

import { getHomeScreen } from '@/api/api';

export function useHomeScreen() {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['homeScreen'] });
    }, [queryClient])
  );

  return useQuery({
    queryKey: ['homeScreen'],
    queryFn: getHomeScreen,
    staleTime: 0,
  });
}
