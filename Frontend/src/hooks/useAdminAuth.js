import { useCallback, useState } from 'react';
import api from '../lib/axios';

const TOKEN_KEY = 'admin_token';

// Manages the admin session: a JWT issued by POST /api/auth/login, kept in
// localStorage so a page refresh doesn't force a re-login. There's only one
// admin (a shared password, not per-user accounts), so this is a single
// token rather than a full user/session system.
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

  return { token, isAuthenticated: Boolean(token), login, logout };
};

export default useAdminAuth;
