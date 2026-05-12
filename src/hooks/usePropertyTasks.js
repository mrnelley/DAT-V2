import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/propertyTasks';

const KEY = 'propertyTasks';

export function usePropertyTasks(filter) {
  return useQuery({
    queryKey: [KEY, filter ?? null],
    queryFn: () => api.listTasks(filter ?? {}),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => api.updateTask(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.createTask(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
