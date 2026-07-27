import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Lenis drives the scroll position; GSAP's ticker drives Lenis; ScrollTrigger
 * listens to Lenis instead of the native scroll event. That three-way wiring is
 * what makes scroll-linked animation stay glued to the content instead of
 * lagging a frame behind it.
 *
 * Returns a ref-held Lenis instance so anchor links can hand off to it.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native scrolling on touch stays snappier than a JS-driven one.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

/** Scrolls to an in-page anchor through Lenis when it's active. */
export function scrollToAnchor(lenis: Lenis | null, hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target as HTMLElement, { offset: 0 });
  else target.scrollIntoView({ behavior: 'smooth' });
}
