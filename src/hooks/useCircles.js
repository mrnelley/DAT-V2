import { useQuery } from '@tanstack/react-query';
import * as api from '../api/circles';

export function useCircles() {
  return useQuery({ queryKey: ['circles'], queryFn: () => api.listCircles() });
}

export function useCircle(id) {
  return useQuery({
    queryKey: ['circles', 'one', id],
    queryFn: () => api.getCircle(id),
    enabled: Boolean(id),
  });
}
