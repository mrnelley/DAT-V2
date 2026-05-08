import usePermissions from '../../hooks/usePermissions';

export default function PermissionGate({ roles = [], children, fallback = null }) {
  const { can } = usePermissions();
  if (roles.length === 0) return children;
  return can(roles) ? children : fallback;
}
