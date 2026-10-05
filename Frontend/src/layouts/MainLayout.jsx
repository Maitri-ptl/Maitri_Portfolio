import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ThemedToaster from '../components/ThemedToaster';
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
      <ThemedToaster />
    </div>
  );
};

export default MainLayout;
