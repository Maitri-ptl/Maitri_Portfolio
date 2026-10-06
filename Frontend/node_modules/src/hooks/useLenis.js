import { useEffect } from 'react';
import Lenis from 'lenis';

// Initializes Lenis for buttery, speed-controlled smooth scrolling —
// replaces the native `scroll-behavior: smooth` (index.css), which snaps
// to its target almost instantly and can't be slowed down. Lenis intercepts
// wheel/touch input and eases the scroll position itself, so both mouse-wheel
// scrolling AND anchor-link jumps (Navbar, "Back to top") share the same
// unified, tunable feel instead of two different scroll behaviors.
const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // seconds to settle — higher = slower/heavier feel
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      smoothWheel: true,
      wheelMultiplier: 0.9, // slightly damps raw wheel delta for a calmer feel
      touchMultiplier: 1.2,
    });

    // Exposed on window so imperative "scroll to" calls (Footer's
    // back-to-top button) can route through Lenis instead of the browser's
    // native jump.
    window.lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Delegated click handler for every in-page anchor link (Navbar,
    // Hero CTAs, "View All Projects", etc.) so they all scroll through
    // Lenis's eased animation instead of the browser jumping instantly —
    // one listener here means no component has to know Lenis exists.
    const handleAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 }); // clears the fixed navbar height
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);
};

export default useLenis;
