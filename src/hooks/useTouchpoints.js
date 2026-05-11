import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/touchpoints';

const KEY = 'touchpoints';

export function useTouchpoints(filter) {
  return useQuery({
    queryKey: [KEY, filter ?? null],
    queryFn: () => api.listTouchpoints(filter ?? {}),
  });
}

export function useCreateTouchpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createTouchpoint(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ['people'] });
      qc.invalidateQueries({ queryKey: ['circles'] });
    },
  });
}

export function useUpdateTouchpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => api.updateTouchpoint(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteTouchpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteTouchpoint(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
