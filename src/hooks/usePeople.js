import { useQuery } from '@tanstack/react-query';
import * as api from '../api/people';

export function usePeople() {
  return useQuery({ queryKey: ['people'], queryFn: () => api.listPeople() });
}

export function usePerson(id) {
  return useQuery({
    queryKey: ['people', 'one', id],
    queryFn: () => api.getPerson(id),
    enabled: Boolean(id),
  });
}

export function useOverduePeople() {
  return useQuery({ queryKey: ['people', 'overdue'], queryFn: () => api.listOverdue() });
}
