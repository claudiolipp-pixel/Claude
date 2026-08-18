import type { Config } from 'tailwindcss';

/**
 * Palette and type scale come straight from AIRBALL Brand Guide V1.0,
 * sections 03 (Color) and 04 (Typography). Ratio target on any surface:
 * ~70% black or cream, 20% ink/white type, 10% yellow.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      /**
       * Enough room in BOTH directions. A phone held sideways is wider than
       * `md` but only ~390px tall, so width-only breakpoints hand it the
       * desktop treatment and everything overflows.
       */
      roomy: { raw: '(min-width: 768px) and (min-height: 600px)' },
    },
    extend: {
      colors: {
        court: '#0A0A0A',   // Court Black — the stage
        butter: '#FFFF81',  // Butter Yellow — accent only
        chalk: '#FAFAFA',   // Chalk White — body text on dark
        cream: '#F2EFE7',   // Court Cream — matte light surface
        dim: '#7D7A72',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', '"Arial Narrow"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.2em',
        wordmark: '0.14em',
      },
      transitionTimingFunction: {
        // Long, low-drama easing — the milledollars-style feel
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      /*
       * The cart drawer. GSAP animates everything else on the site, but the
       * drawer mounts and unmounts on a state change and has no timeline to
       * join, so CSS is the smaller answer. The global prefers-reduced-motion
       * rule in index.css collapses both of these to nothing.
       */
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 240ms ease-out',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
