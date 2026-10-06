import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const TOKEN_KEY = 'admin_token';

// Manages the admin session: a JWT issued by POST /api/auth/login, kept in
// localStorage so a page refresh doesn't force a re-login. There's only one
// admin (a shared password, not per-user accounts), so this is a single
// token rather than a full user/session system.
//
// Call this ONCE (AdminGate does) and pass login/logout down — each call
// creates its own state, so separate instances wouldn't see each other's
// changes.
const useAdminAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (password) => {
    const { data } = await api.post('/auth/login', { password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  // The axios interceptor fires this when an admin request gets a 401
  // (expired session) — drop back to the login screen with a clear message.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      toast.error('Session expired — please log in again.');
    };
    window.addEventListener('admin-unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin-unauthorized', onUnauthorized);
  }, []);

  return { token, isAuthenticated: Boolean(token), login, logout };
};

export default useAdminAuth;
