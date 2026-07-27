import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, EASE_LONG } from '@/lib/gsap';

type RevealOptions = {
  /** Delay before the reveal, in seconds. */
  delay?: number;
  /** Play immediately on mount instead of waiting for scroll. */
  immediate?: boolean;
};

/**
 * Mask reveal: each `[data-reveal-line]` child slides up from inside its own
 * clipped box. The clip is what sells it — text emerges from an edge rather
 * than fading in place.
 */
export function useMaskReveal<T extends HTMLElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const { delay = 0, immediate = false } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lines = el.querySelectorAll('[data-reveal-line]');
        if (!lines.length) return;

        gsap.set(lines, { yPercent: 115 });

        const tween = gsap.to(lines, {
          yPercent: 0,
          duration: 1.1,
          ease: EASE_LONG,
          stagger: 0.08,
          delay,
          paused: !immediate,
        });

        if (immediate) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => tween.play(),
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, immediate]);

  return ref;
}

/**
 * Quieter sibling of the mask reveal, for meta rows and body copy: a short
 * rise plus fade, staggered across `[data-reveal-item]` children.
 */
export function useFadeUp<T extends HTMLElement>(stagger = 0.06) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = el.querySelectorAll('[data-reveal-item]');
        if (!items.length) return;

        gsap.from(items, {
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          ease: EASE,
          stagger,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger]);

  return ref;
}

/**
 * Scroll-linked parallax for media. The inner element is deliberately taller
 * than its frame so it can travel without ever exposing an edge.
 */
export function useParallax<T extends HTMLElement>(strength = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const inner = el.querySelector('[data-parallax-inner]');
        if (!inner) return;

        gsap.fromTo(
          inner,
          { yPercent: -strength / 2 },
          {
            yPercent: strength / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    }, ref);

    return () => ctx.revert();
  }, [strength]);

  return ref;
}
