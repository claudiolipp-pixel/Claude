import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

/**
 * One shared reduced-motion check. Every animation in the site is registered
 * inside a matchMedia context so that turning reduced motion on doesn't just
 * skip the tween — it reverts the element to its resting state.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The house easing: long tail, no bounce. */
export const EASE = 'power3.out';
export const EASE_LONG = 'expo.out';

export { gsap, ScrollTrigger, Observer };
