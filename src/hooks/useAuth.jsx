import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_USER_ID, USERS, getUser } from '../api/users';

const AuthContext = createContext(null);

const STORAGE_KEY = 'hdc_compass.activeUserId';

function readStoredUserId() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
}

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(readStoredUserId);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, userId);
    } catch {
      /* no-op */
    }
  }, [userId]);

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
