import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/priorities';

const KEY = ['priorities'];

export function usePriorities() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.listPriorities(),
  });
}

export function useUpdatePriority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => api.updatePriority(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useCreatePriority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createPriority(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeletePriority() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deletePriority(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
