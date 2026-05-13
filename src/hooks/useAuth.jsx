import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_USER_ID, USERS, getUser } from '../api/users';

const AuthContext = createContext(null);

// Demo mode: the app always boots into Dana's dashboard. Switching personas
// from the TopBar still works during a session, but a refresh / new tab / new
// browser brings the viewer back to Dana — predictable starting state for
// executive walk-throughs. Any old persona selection from a prior session is
// cleared on mount so stale localStorage values don't leak in.
const STORAGE_KEY = 'hdc_compass.activeUserId';

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(DEFAULT_USER_ID);

  // Clear any persisted persona selection from prior sessions so refresh
  // always returns to Dana.
  useEffect(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* no-op */
    }
  }, []);

  const switchUser = useCallback((nextId) => {
    setUserId(nextId);
  }, []);

  const value = useMemo(() => {
    const user = getUser(userId);
    return {
      user,
      isAuthenticated: true,
      allUsers: USERS,
      switchUser,
    };
  }, [userId, switchUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
