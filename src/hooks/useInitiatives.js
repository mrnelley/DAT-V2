import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/initiatives';

const KEY = 'initiatives';

export function useInitiatives(filter) {
  return useQuery({
    queryKey: [KEY, filter ?? null],
    queryFn: () => api.listInitiatives(filter ?? {}),
  });
}

export function useInitiative(id) {
  return useQuery({
    queryKey: [KEY, 'one', id],
    queryFn: () => api.getInitiative(id),
    enabled: Boolean(id),
  });
}

export function useCreateInitiative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createInitiative(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateInitiative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => api.updateInitiative(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteInitiative() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteInitiative(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
