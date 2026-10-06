import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkle } from 'lucide-react';
import { PROCESS_STEPS } from '../utils/constants';

const RING_RADIUS = 92;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// A single step stays fully invisible until scroll progress reaches its
// slice of the track, then fades/slides in and stays visible — so the list
// visibly "builds up" one item at a time as you scroll, rather than
// everything being present from the start (or only one item ever showing).
// Pulled into its own component (rather than called inside the
// PROCESS_STEPS.map() below) because useTransform is a hook, and hooks
// can't be called inside a loop.
// True from the `md` breakpoint up. The scroll-pinned effect only makes sense
// on desktop-sized screens: on a phone the stacked content is taller than the
// screen, so pinning it would cut off the bottom steps.
const useIsDesktop = () => {
  const query = '(min-width: 768px)';
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
};

const ProcessStep = ({ step, index, total, scrollYProgress, isDesktop }) => {
  const revealPoint = index / total;
  const fadeWidth = 1 / total / 2; // half a slice's worth of scroll to fade in over

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(revealPoint - fadeWidth, 0), revealPoint],
    [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [Math.max(revealPoint - fadeWidth, 0), revealPoint],
    [24, 0]
  );

  // Mobile: no pinning, so each step simply fades in as it scrolls into view.
  const motionProps = isDesktop
    ? { style: { opacity, y } }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.4 },
        transition: { duration: 0.5 },
      };

  return (
    <motion.li
      {...motionProps}
      className="flex gap-5 border-b border-maroon-light/60 pb-gap last:border-b-0 last:pb-0"
    >
      <span className="font-display text-2xl text-rose/60">{step.number}</span>
      <div>
        <h3 className="text-xl text-cream">{step.title}</h3>
        <p className="mt-1 text-body">{step.description}</p>
      </div>
    </motion.li>
  );
};

// "My Process" section, scroll-pinned: the section is given extra height
// (each step gets its own "page" of scroll distance), and its content is
// `sticky`-positioned so it stays fixed on screen while the user scrolls
// through that extra height. `useScroll` tracks how far through that
// scroll range the user is (0 → 1), which drives two things in sync: the
// progress ring drawing itself in, and each step revealing into the list
// one at a time as its scroll slice is reached.
const Process = () => {
  const trackRef = useRef(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // The ring draws from ~18% (its resting state before this section is
  // reached) up to fully drawn as the user scrolls through all the steps.
  const ringDashoffset = useTransform(scrollYProgress, [0, 1], [
    RING_CIRCUMFERENCE * 0.82,
    0,
  ]);

  return (
    <section
      id="process"
      ref={trackRef}
      className="relative"
      style={isDesktop ? { height: '300vh' } : undefined}
    >
      <div className="section-padding flex items-center overflow-hidden md:sticky md:top-0 md:min-h-screen md:py-14">
        <div className="container-narrow grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12">
          <div>
            <div className="section-heading flex flex-col gap-3">
              <span className="eyebrow">How I Work</span>
              <h2 className="font-display text-display-3 text-cream">My Process</h2>
            </div>

            <ol className="flex flex-col gap-gap">
              {PROCESS_STEPS.map((step, index) => (
                <ProcessStep
                  key={step.number}
                  step={step}
                  index={index}
                  total={PROCESS_STEPS.length}
                  scrollYProgress={scrollYProgress}
                  isDesktop={isDesktop}
                />
              ))}
            </ol>
          </div>

          {/* Decorative visual: a progress ring that draws itself in as the
              user scrolls through the pinned section — a soft glow, a
              gradient conic ring (SVG, since Tailwind can't do a true conic
              gradient stroke cross-browser), a glass inner disc, and a
              refined glyph at the center. */}
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
              <div className="absolute inset-6 rounded-full bg-rose/20 blur-3xl" />

              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
                <defs>
                  {/* Stops use the theme variables (via style, since SVG
                      attributes can't read CSS variables) so the ring re-colors
                      with light/dark mode. */}
                  <linearGradient id="processRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(var(--c-rose))', stopOpacity: 0.15 }} />
                    <stop offset="75%" style={{ stopColor: 'rgb(var(--c-rose))', stopOpacity: 0.9 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(var(--c-rose-light))' }} />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r={RING_RADIUS}
                  fill="none"
                  style={{ stroke: 'rgb(var(--c-maroon-light))' }}
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#processRingGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  style={{ strokeDashoffset: ringDashoffset }}
                />
              </svg>

              <div className="relative flex h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] items-center justify-center rounded-full border border-cream/10 bg-maroon-light/60 shadow-lift backdrop-blur-sm">
                <Sparkle className="text-rose" size={40} strokeWidth={1.5} fill="currentColor" />
              </div>
            </div>
            <p className="max-w-xs text-center text-body">
              A thoughtful process for meaningful results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
