import { motion } from 'framer-motion';
import { Download, FileText, Github, Linkedin, Mail } from 'lucide-react';
import Button from '../components/Button';
import { RESUME_URL, SOCIAL_LINKS } from '../utils/constants';

const ICONS = { Github, Linkedin, Mail };

// The landing section, modeled on the poster-style reference: small meta
// labels top-left/top-right, one huge full-bleed wordmark with the cursive
// signature above it, and a centered social icon row underneath.
// `id="home"` makes it a target for the Navbar's scroll-spy and anchor
// links. Kept centered per prior direction — no bordered "card" wrapper.
const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-vignette px-4 pb-16 pt-28 sm:px-8 md:px-12"
    >
      {/* Off-center decorative blobs — the one deliberately asymmetric touch
          in an otherwise centered hero. Purely background (aria-hidden,
          pointer-events-none), so they add depth/editorial confidence
          without disturbing the centered content or mobile layout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blob-rose blur-3xl md:-left-10 md:top-0 md:h-96 md:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blob-maroon blur-3xl md:-right-6 md:h-80 md:w-80"
      />

      {/* Top meta row — uses the shared `meta` type token instead of an
          arbitrary per-component text size, so it matches every other
          eyebrow label on the site. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between text-meta uppercase text-body/70"
      >
        <span>MERN Stack Developer</span>
        <span className="text-right">Full-Stack Portfolio</span>
      </motion.div>

      {/* Focal block: signature line sitting above the massive wordmark,
          both sized from the shared display scale so the ratio between
          them stays consistent at every viewport instead of drifting per
          breakpoint like separate vw values would. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-1 py-stack">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-script text-signature text-rose"
        >
          Maitri Patel
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="select-none text-center font-display text-display-1 font-black uppercase text-cream"
        >
          Portfolio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-4 max-w-xl px-4 text-center text-base text-body md:text-lg"
        >
          I build fast, elegant, full-stack web experiences — from database
          schema to pixel-perfect UI.
        </motion.p>

        {/* Available for work pill — frosted glass instead of a flat filled
            surface, so it visually "floats" above the vignette/blobs rather
            than sitting as another opaque block. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6"
        >
          <span className="glass inline-flex items-center gap-2 rounded-pill px-4 py-1.5 text-sm text-rose">
            <span className="h-2 w-2 animate-pulse-slow rounded-full bg-rose" />
            Available for work
          </span>
        </motion.div>

        {/* Resume actions: view it in a new tab, or save the PDF. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href={RESUME_URL} target="_blank" rel="noreferrer">
            <FileText size={18} /> View Resume
          </Button>
          <Button href={RESUME_URL} download="Maitri_Patel_Resume.pdf" variant="outline">
            <Download size={18} /> Download
          </Button>
        </motion.div>
      </div>

      {/* Centered social row, mirroring the reference's icon row under the title */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
      >
        {SOCIAL_LINKS.map((social) => {
          const Icon = ICONS[social.icon];
          return (
            <li key={social.label}>
              <motion.a
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="flex items-center gap-2 text-sm text-body transition-colors hover:text-rose"
              >
                <motion.span
                  whileHover={{ scale: 1.15, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Icon size={18} />
                </motion.span>
                <span>{social.label}</span>
              </motion.a>
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
};

export default Hero;
