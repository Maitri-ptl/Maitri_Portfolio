// Every theme color is a CSS variable (defined per-theme in src/index.css) so the
// exact same class names — bg-maroon, text-cream, border-rose/40, etc. — render
// correctly in BOTH dark and light mode. `<alpha-value>` keeps Tailwind's
// opacity modifiers (e.g. bg-maroon-light/40) working with the variables.
const themeColor = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design system extracted from the reference moodboard. Token NAMES are
        // kept from the original dark design so no component had to change:
        //   maroon        → page background
        //   maroon-dark   → alternate section / footer background
        //   maroon-light  → raised surface, borders, subtle fills
        //   cream         → headings / high-contrast text
        //   rose          → accent (links, buttons, highlights)
        //   body          → soft body text
        // Dark mode = deep wine + cream (original). Light mode = warm ivory +
        // deep wine text, with a deeper rose so accents stay readable.
        maroon: {
          DEFAULT: themeColor('maroon'),
          dark: themeColor('maroon-dark'),
          light: themeColor('maroon-light'),
        },
        cream: themeColor('cream'),
        rose: {
          DEFAULT: themeColor('rose'),
          light: themeColor('rose-light'), // hover shade
          dark: themeColor('rose-dark'),
        },
        body: themeColor('body'),
      },
      fontFamily: {
        // Bold high-contrast serif for hero/section headings.
        display: ['"Playfair Display"', 'serif'],
        // Clean sans-serif for body copy.
        sans: ['Inter', 'sans-serif'],
        // Cursive signature accent (e.g. the name overlapping the hero
        // wordmark) — loaded locally via @font-face in index.css.
        script: ['"Elegant Script"', 'cursive'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        card: '0.75rem',
        pill: '999px',
      },
      spacing: {
        // Vertical rhythm scale. `section` = space between distinct sections;
        // `stack` = space between major blocks *within* one section (e.g.
        // heading -> content); `gap` = space between sibling items in a list
        // or grid. Everything else composes from these three so sections
        // stop feeling like they invented their own spacing ad hoc.
        section: '7rem',
        stack: '3.5rem',
        gap: '1.75rem',
      },
      fontSize: {
        // Named display tokens for hero-scale wordmarks, defined once with
        // clamp() so every consumer gets the same responsive curve instead
        // of per-component vw magic numbers. Values chosen so the largest
        // token never exceeds ~7rem even on huge viewports (stays legible,
        // never overflows) and never drops below a readable floor on 375px.
        'display-1': ['clamp(3rem, 13vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(2rem, 7vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-3': ['clamp(1.5rem, 4vw, 2.75rem)', { lineHeight: '1.05' }],
        // Signature/cursive accent scale — smaller than the wordmark itself
        // so it always reads as an accent line sitting above it, at every
        // breakpoint, rather than competing with it.
        signature: ['clamp(1.75rem, 5vw, 3.25rem)', { lineHeight: '1' }],
        // Small uppercase tracked-out meta/eyebrow labels used consistently
        // for section kickers and hero meta rows.
        meta: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.2em' }],
      },
      boxShadow: {
        // Warm-tinted "elevation" shadows. Values live in index.css as CSS
        // variables so light mode can use soft warm-brown shadows while dark
        // mode keeps the original deep maroon-tinted ones.
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        glow: 'var(--shadow-glow)',
        inner: 'var(--shadow-inner)',
        glass: 'var(--shadow-glass)',
      },
      backgroundImage: {
        // Gradient decorations (hero vignette, card sheen, blobs, glass mesh).
        // Defined per-theme in index.css so they stay on-palette in both modes.
        vignette: 'var(--bg-vignette)',
        'card-sheen': 'var(--bg-card-sheen)',
        'blob-rose': 'var(--bg-blob-rose)',
        'blob-maroon': 'var(--bg-blob-maroon)',
        mesh: 'var(--bg-mesh)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
