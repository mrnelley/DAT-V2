import { createContext, useContext, useMemo } from 'react';
import { ROLES } from '../utils/permissions';

// Stub auth context. Replace with MSAL / Microsoft Entra ID integration.
const AuthContext = createContext(null);

const STUB_USER = {
  id: 'stub-user',
  name: 'Parnell Kelley',
  email: 'parnell@hdc.local',
  initials: 'PK',
  photoUrl: null,
  organization: 'HDC',
  roles: [ROLES.ELT, ROLES.LEADER, ROLES.MEMBER],
};

export function AuthProvider({ children }) {
  const value = useMemo(
    () => ({ user: STUB_USER, isAuthenticated: true }),
    [],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
