import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/workplans';

const KEY = 'workplans';

export function useWorkplans(filter) {
  return useQuery({
    queryKey: [KEY, filter ?? null],
    queryFn: () => api.listWorkplans(filter ?? {}),
  });
}

export function useWorkplan(id) {
  return useQuery({
    queryKey: [KEY, 'one', id],
    queryFn: () => api.getWorkplan(id),
    enabled: Boolean(id),
  });
}

export function useCreateWorkplan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createWorkplan(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateWorkplan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => api.updateWorkplan(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteWorkplan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteWorkplan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
