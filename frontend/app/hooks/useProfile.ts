import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProfile, updateProfile } from '@/api/api';
import type { Profile, UpdateProfileRequest } from '@/types/api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (newData: UpdateProfileRequest) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      const prev = queryClient.getQueryData<Profile>(['profile']);
      queryClient.setQueryData<Profile>(['profile'], (old) =>
        old ? { ...old, ...newData } : old,
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(['profile'], context.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
