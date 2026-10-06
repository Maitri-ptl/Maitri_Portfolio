import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';
import AdminGate from './pages/admin/AdminGate';

// The admin route lives at a secret slug from VITE_ADMIN_URL (not a fixed
// "/admin" path) so it isn't guessable — see .env.example. It's mounted
// outside MainLayout since the admin dashboard has its own chrome, not the
// public Navbar/Footer.
const ADMIN_PATH = import.meta.env.VITE_ADMIN_URL || '/admin';

// Route definitions. Every public route renders inside MainLayout (Navbar +
// Footer stay mounted), except the catch-all which still uses it so 404s
// keep the same site chrome.
const App = () => {
  return (
    <Routes>
      <Route path={ADMIN_PATH} element={<AdminGate />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
