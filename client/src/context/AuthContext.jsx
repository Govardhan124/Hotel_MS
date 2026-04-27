import { createContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { getProfile } from '../services/userService';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'hotel_auth';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncProfile = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile(auth.token);
        const next = { ...auth, user: response.data };
        setAuth(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, []);

  const login = async (payload) => {
    const response = await loginUser(payload);
    const authData = response.data;
    const next = {
      token: authData.token,
      user: {
        _id: authData._id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
      },
    };
    setAuth(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const authData = response.data;
    const next = {
      token: authData.token,
      user: {
        _id: authData._id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
      },
    };
    setAuth(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      auth,
      token: auth?.token,
      user: auth?.user,
      isAuthenticated: Boolean(auth?.token),
      loading,
      login,
      register,
      logout,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
