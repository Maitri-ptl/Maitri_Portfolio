import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import useLenis from '../hooks/useLenis';

// Shared shell for every route: Navbar and Footer persist across page
// changes, while <Outlet /> renders whichever route matched (Home,
// ProjectDetail, or NotFound). Also owns the Lenis smooth-scroll instance
// since it's mounted once for the whole app, regardless of route.
const MainLayout = () => {
  useLenis();

  return (
    <div className="flex min-h-screen flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Toast notifications styled to match the active theme */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Uses the theme CSS variables so toasts follow light/dark mode.
          style: {
            background: 'rgb(var(--c-maroon-dark))',
            color: 'rgb(var(--c-cream))',
            border: '1px solid rgb(var(--c-maroon-light))',
          },
        }}
      />
    </div>
  );
};

export default MainLayout;
