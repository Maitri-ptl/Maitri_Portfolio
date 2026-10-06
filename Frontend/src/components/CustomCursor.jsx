import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// A two-part custom cursor replacing the default arrow: a small solid dot
// that tracks the exact pointer position (no lag, so aiming still feels
// precise), and a larger outline ring that trails behind it with a spring
// for a soft, premium feel. The ring grows on hover over anything clickable
// to signal interactivity. Hidden entirely on touch devices, since there's
// no cursor to replace there.
const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    // Touch/coarse-pointer devices don't have a real cursor to replace.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMove = (e) => {
      setIsVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleOver = (e) => {
      setIsHovering(Boolean(e.target.closest('a, button, input, textarea, [role="button"]')));
    };

    const handleLeaveWindow = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow);
    };
  }, [x, y]);

  return (
    <>
      {/* Center dot — tracks the raw cursor position 1:1, no spring lag,
          so it always sits exactly where the pointer is. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-rose md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Outline ring — spring-trails the dot and grows on hover, giving
          the cursor weight without filling it in. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border border-rose md:block"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHovering ? 52 : 32,
          height: isHovering ? 52 : 32,
          opacity: isVisible ? (isHovering ? 1 : 0.6) : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </>
  );
};

export default CustomCursor;
