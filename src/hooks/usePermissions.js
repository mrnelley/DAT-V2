import useAuth from './useAuth';
import { hasRole } from '../utils/permissions';

export default function usePermissions() {
  const { user } = useAuth();
  const roles = user?.roles ?? [];
  return {
    roles,
    can: (allowed) => hasRole(roles, allowed),
  };
}
