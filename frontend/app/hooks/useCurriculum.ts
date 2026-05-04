import { useQuery } from '@tanstack/react-query';

import { getSections } from '@/api/api';

export function useCurriculum() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });
}
