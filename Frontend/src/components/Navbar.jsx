import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { NAV_LINKS, RESUME_URL } from '../utils/constants';
import useScrollSpy from '../hooks/useScrollSpy';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

// Fixed top navigation. Transparent over the hero, gains a solid
// background once the page scrolls, highlights the current section
// (via useScrollSpy), and collapses into a slide-in drawer on mobile.
// Kept intentionally plain/minimal — text links only, no pill/box
// backgrounds — to match the reference's clean magazine-style nav.
// Also hosts the light/dark ThemeToggle and a Resume shortcut.
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionIds = NAV_LINKS.map((link) => link.href.replace('#', ''));
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pauses Lenis smooth-scroll while the mobile drawer is open so the page
  // underneath doesn't scroll behind the menu.
  useEffect(() => {
    if (isMenuOpen) window.lenis?.stop();
    else window.lenis?.start();
    return () => window.lenis?.start();
  }, [isMenuOpen]);

  // Closes the mobile drawer after a link is clicked, so the page doesn't
  // stay locked/covered once navigation happens.
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'glass shadow-soft' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8 md:px-12">
          <a href="#home" aria-label="Maitri Patel — back to top" className="group flex items-center gap-3">
            <Logo className="h-7 sm:h-8" />
            {/* Name is hidden only on tablet widths (md → lg), where the nav
                links + Resume + theme toggle need all the room. */}
            <span className="font-display text-lg font-bold text-cream transition-colors duration-200 group-hover:text-rose md:hidden lg:inline">
              Maitri Patel
            </span>
          </a>

          <div className="flex items-center gap-3 md:gap-5 lg:gap-8">
            {/* Desktop links — plain text, thin underline on the active link */}
            <ul className="hidden items-center gap-5 text-sm uppercase tracking-[0.12em] md:flex lg:gap-8">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeId === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`group relative pb-1 transition-colors duration-200 hover:text-rose ${
                        isActive ? 'text-rose' : 'text-cream'
                      }`}
                    >
                      {link.label}
                      {/* Underline draws outward from center on hover, and stays
                          fully drawn for the active section — reads as a more
                          deliberate "reveal" than a flat left-to-right wipe. */}
                      <span
                        className={`absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-rose transition-all duration-300 ease-out ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Resume shortcut (desktop) — opens the PDF in a new tab. */}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-pill border border-rose px-4 py-1.5 text-sm font-medium text-cream transition-colors duration-200 hover:bg-rose hover:text-maroon-dark md:inline-flex"
            >
              Resume
            </a>

            <ThemeToggle />

            {/* Mobile hamburger toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: -6 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-cream md:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in drawer. Rendered as a sibling of <header> (not inside
          it) on purpose: the header gets `backdrop-blur` once scrolled, and a
          backdrop-filter turns the header into the containing block for any
          `fixed` child — which would shrink this full-screen drawer down to
          the header's height. */}
      <div
        inert={!isMenuOpen}
        aria-hidden={!isMenuOpen}
        className={`glass fixed inset-0 z-[60] overflow-y-auto !border-0 bg-maroon-dark/95 backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6">
          <ThemeToggle />
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-cream"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </motion.button>
        </div>
        <ul className="flex flex-col items-center gap-8 pb-10 pt-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleLinkClick}
                className="font-display text-2xl text-cream transition-colors hover:text-rose"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              onClick={handleLinkClick}
              className="inline-flex items-center gap-2 rounded-pill border border-rose px-6 py-2.5 font-semibold text-cream transition-colors hover:bg-rose hover:text-maroon-dark"
            >
              <Download size={18} /> Resume
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
