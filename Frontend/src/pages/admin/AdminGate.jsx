import { useEffect } from 'react';
import useAdminAuth from '../../hooks/useAdminAuth';
import api from '../../lib/axios';
import ThemedToaster from '../../components/ThemedToaster';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

// Mounted at the secret VITE_ADMIN_URL route (see App.jsx). Shows the
// password gate until a valid session token exists, then the dashboard.
// It owns the single useAdminAuth instance and hands login/logout down.
//
// It also sets up the admin "environment": native cursor (the public site's
// custom cursor isn't mounted here), a noindex hint for search engines, and
// its own toast container (the public layout's one isn't mounted either).
const AdminGate = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Admin | Maitri Patel';
    document.documentElement.classList.add('admin-mode');

    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove('admin-mode');
      robots.remove();
    };
  }, []);

  // Validate a stored token on load: if it has expired, the request 401s, the
  // axios interceptor clears it, and we fall back to the login screen.
  useEffect(() => {
    if (isAuthenticated) api.get('/auth/verify').catch(() => {});
    // Only needs to run when auth state flips (login / logout).
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated ? <AdminDashboard onLogout={logout} /> : <AdminLogin login={login} />}
      <ThemedToaster />
    </>
  );
};

export default AdminGate;
