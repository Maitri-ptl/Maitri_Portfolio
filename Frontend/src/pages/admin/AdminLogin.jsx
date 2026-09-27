import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAdminAuth from '../../hooks/useAdminAuth';

// Simple password gate for the admin dashboard — no username/signup, just
// the one shared ADMIN_PASS checked server-side. Rendered at the secret
// slug route from VITE_ADMIN_URL (see App.jsx), so the URL itself is the
// first layer of obscurity and this password is the real gate.
const AdminLogin = ({ onSuccess }) => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(password);
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="glass-panel w-full max-w-sm rounded-card p-8"
      >
        <h1 className="font-display text-display-3 text-cream">Admin Access</h1>
        <p className="mt-2 text-sm text-body">Enter the admin password to continue.</p>

        <label htmlFor="admin-password" className="mt-6 block text-sm text-body">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-maroon-light bg-maroon-light/30 px-4 py-3 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow"
        />

        <button
          type="submit"
          disabled={isSubmitting || !password}
          className="mt-6 w-full rounded-pill bg-rose px-6 py-3 font-semibold text-maroon-dark shadow-soft transition-all hover:shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? 'Checking...' : 'Log In'}
        </button>
      </motion.form>
    </div>
  );
};

export default AdminLogin;
