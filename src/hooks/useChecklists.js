import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/curbAppealChecklists';

const KEY = 'checklists';

export function useChecklists(filter) {
  return useQuery({
    queryKey: [KEY, 'list', filter ?? null],
    queryFn: () => api.listChecklists(filter ?? {}),
  });
}

export function useChecklistsForAllProperties(filter) {
  return useQuery({
    queryKey: [KEY, 'all', filter ?? null],
    queryFn: () => api.listChecklistsForAllProperties(filter ?? {}),
  });
}

export function useChecklist({ propertyId, quarter, year }) {
  return useQuery({
    queryKey: [KEY, 'one', propertyId, quarter, year],
    queryFn: () => api.getChecklist({ propertyId, quarter, year }),
    enabled: Boolean(propertyId),
  });
}

export function useChecklistStats(filter) {
  return useQuery({
    queryKey: [KEY, 'stats', filter ?? null],
    queryFn: () => api.checklistStats(filter ?? {}),
  });
}

export function useSaveDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.saveDraft(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useSubmitChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.submitChecklist(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useApproveChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.approveChecklist(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useReturnChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => api.returnChecklist(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
