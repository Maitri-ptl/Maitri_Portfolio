import { useState } from 'react';
import useAdminAuth from '../../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

// Mounted at the secret VITE_ADMIN_URL route (see App.jsx). Shows the
// password gate until a valid session token exists, then the dashboard.
// A local `justLoggedIn` flag re-renders immediately after a successful
// login without waiting on a token-state round trip.
const AdminGate = () => {
  const { isAuthenticated } = useAdminAuth();
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  if (!isAuthenticated && !justLoggedIn) {
    return <AdminLogin onSuccess={() => setJustLoggedIn(true)} />;
  }

  return <AdminDashboard />;
};

export default AdminGate;
