import { useQuery } from '@tanstack/react-query';

import { getSections, getSubtopic } from '@/api/api';

export function useCurriculum() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });
}

export function useSubtopicDetail(id: number) {
  return useQuery({
    queryKey: ['subtopic', id],
    queryFn: () => getSubtopic(id),
    enabled: id > 0,
    staleTime: Infinity,
  });
}
