// Shared framer-motion primitives so every section/component pulls from the
// same handful of spring/easing feels instead of each file inventing its own
// slightly-different transition config. Keeps hover/tap/scroll motion
// feeling like "one product."

// A snappy but soft spring for hover/tap feedback on interactive elements
// (buttons, cards, badges, icons). Tuned so it settles fast without
// overshooting/wobbling, which reads as "premium" rather than "bouncy".
export const springSnappy = { type: 'spring', stiffness: 400, damping: 28, mass: 0.6 };

// A gentler spring for larger surfaces (cards lifting on hover) where a
// heavier mass reads as more "physical" weight being lifted.
export const springSoft = { type: 'spring', stiffness: 260, damping: 24, mass: 0.8 };

// Standard scroll-reveal easing/duration for whileInView entrances.
export const revealTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] };

// Parent variants for staggered children (process steps, tool badges,
// testimonial cards, etc). Attach `staggerContainer` to the parent's
// `variants` + `initial`/`whileInView="visible"`, and `staggerItem` to each
// child, instead of hand-rolling `delay: index * 0.1` per section.
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const staggerItemLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: revealTransition },
};

// Shared hover/tap lift for card-like surfaces — pairs a slight rise with a
// slight scale so it feels like the whole card is lifting toward the
// viewer, not just sliding up.
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.015, transition: springSoft },
  tap: { scale: 0.985, transition: springSnappy },
};

// Shared button hover/tap feel.
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: springSnappy },
  tap: { scale: 0.96, transition: springSnappy },
};
