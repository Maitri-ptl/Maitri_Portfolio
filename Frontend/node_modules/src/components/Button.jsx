import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Shared button styles so every CTA in the site looks and behaves the same.
// Renders a <Link> when `to` is given (in-app navigation), an <a> when
// `href` is given (anchor scroll or external link), otherwise a <button>.
const VARIANT_CLASSES = {
  primary: 'bg-rose text-maroon-dark hover:bg-rose-light',
  outline: 'border border-rose text-cream hover:bg-rose hover:text-maroon-dark',
};

// Motion-wrapped variants declared once at module scope (not inside the
// component) — creating a component via `motion(...)` during render resets
// its internal state on every re-render, which is exactly what the
// react-hooks/static-components rule flags.
const MotionLink = motion(Link);

// How far the button is allowed to drift toward the cursor — kept small so
// it reads as "magnetic weight" rather than the button chasing the pointer
// around the screen.
const MAGNETIC_RANGE = 14;

const Button = ({
  children,
  to,
  href,
  target,
  rel,
  download,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring-smoothed so the follow feels magnetic/elastic instead of 1:1
  // snapping to the cursor position.
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * MAGNETIC_RANGE);
    y.set((relY / (rect.height / 2)) * MAGNETIC_RANGE);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = `inline-flex items-center gap-2 rounded-pill px-6 py-3 font-sans font-semibold
    shadow-soft transition-colors duration-300 ease-out focus-visible:outline-none hover:shadow-glow ${VARIANT_CLASSES[variant]} ${className}`;

  const Component = to ? MotionLink : href ? motion.a : motion.button;
  const componentProps = to
    ? { to }
    : href
      ? { href, target, rel, download }
      : { type, onClick };

  return (
    <Component
      ref={ref}
      {...componentProps}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
    >
      {children}
    </Component>
  );
};

export default Button;
