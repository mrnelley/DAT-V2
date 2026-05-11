import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as calendarApi from '../api/calendar';
import useAuth from './useAuth';

const KEYS = {
  org: (range) => ['calendar', 'org', range ?? null],
  pending: (range) => ['calendar', 'pending', range ?? null],
  personal: (userId, range) => ['calendar', 'personal', userId, range ?? null],
};

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: ['calendar'] });
};

export function useOrgCalendarItems(range) {
  return useQuery({
    queryKey: KEYS.org(range),
    queryFn: () => calendarApi.listOrgItems(range),
  });
}

export function usePendingOrgItems(range) {
  return useQuery({
    queryKey: KEYS.pending(range),
    queryFn: () => calendarApi.listPendingOrgItems(range),
  });
}

export function usePersonalCalendarItems(range) {
  const { user } = useAuth();
  return useQuery({
    queryKey: KEYS.personal(user?.id, range),
    queryFn: () => calendarApi.listPersonalItems(user?.id, range),
    enabled: Boolean(user?.id),
  });
}

export function useCreateCalendarItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => calendarApi.createItem(input),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateCalendarItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => calendarApi.updateItem(id, patch),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useDeleteCalendarItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => calendarApi.deleteItem(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useSubmitItemToOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => calendarApi.submitToOrg(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useApproveItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (id) => calendarApi.approveItem(id, user?.id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRejectItem() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ id, reason }) =>
      calendarApi.rejectItem(id, { reason, rejecterId: user?.id }),
    onSuccess: () => invalidateAll(qc),
  });
}
