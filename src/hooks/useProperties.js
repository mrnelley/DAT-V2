import { useQuery } from '@tanstack/react-query';
import * as api from '../api/properties';

const KEY = 'properties';

export function useProperties(filter) {
  return useQuery({
    queryKey: [KEY, filter ?? null],
    queryFn: () => api.listProperties(filter ?? {}),
  });
}

export function useProperty(id) {
  return useQuery({
    queryKey: [KEY, 'one', id],
    queryFn: () => api.getProperty(id),
    enabled: Boolean(id),
  });
}
