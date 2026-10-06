import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '../utils/constants';

// Maps the string icon names in constants.js to their actual lucide-react
// components, since constants.js can't import JSX directly.
const ICONS = { Github, Linkedin, Mail };

// Small, centered footer: social row + "back to top" smooth-scroll button.
const Footer = () => {
  // Routes through Lenis (see hooks/useLenis.js) when available, so this
  // button matches the same eased scroll speed as the rest of the site
  // instead of the browser's instant native smooth-scroll.
  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-maroon-light bg-maroon-dark px-6 py-stack text-center shadow-inner">
      <div className="container-narrow flex flex-col items-center gap-gap">
        <ul className="flex gap-6">
          {SOCIAL_LINKS.map((social) => {
            const Icon = ICONS[social.icon];
            return (
              <li key={social.label}>
                <motion.a
                  href={social.href}
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-body transition-colors duration-200 hover:bg-maroon-light hover:text-rose"
                >
                  <Icon size={20} />
                </motion.a>
              </li>
            );
          })}
        </ul>

        <motion.button
          type="button"
          onClick={scrollToTop}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2 text-sm text-body transition-colors hover:text-rose"
        >
          Back to top <ArrowUp size={16} />
        </motion.button>

        <p className="text-xs text-body/70">
          {/* TODO: swap the name if needed */}
          &copy; {new Date().getFullYear()} Maitri Patel. Built with the MERN stack.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
