import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';
import ThemeToggle from '../../components/ThemeToggle';

// Simple password gate for the admin dashboard — no username/signup, just
// the one shared ADMIN_PASS checked server-side. Rendered at the secret
// slug route from VITE_ADMIN_URL (see App.jsx), so the URL itself is the
// first layer of obscurity and this password is the real gate.
const AdminLogin = ({ login }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await login(password);
      // No callback needed: AdminGate re-renders into the dashboard as soon
      // as the shared auth state has a token.
    } catch (error) {
      toast.error(error.message || 'Incorrect password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4">
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-body transition-colors hover:text-rose">
          <ArrowLeft size={16} /> Back to site
        </Link>
        <ThemeToggle />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="glass-panel w-full max-w-sm rounded-card p-8"
      >
        <Logo className="h-8" />
        <h1 className="mt-6 flex items-center gap-2 font-display text-display-3 text-cream">
          <Lock size={22} className="text-rose" /> Admin Access
        </h1>
        <p className="mt-2 text-sm text-body">Enter the admin password to continue.</p>

        <label htmlFor="admin-password" className="mt-6 block text-sm text-body">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-maroon-light bg-maroon-light/30 py-3 pl-4 pr-11 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-body transition-colors hover:text-rose"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

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
