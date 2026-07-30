import { useEffect } from 'react';

/**
 * Stops the page behind a full-screen overlay from scrolling.
 *
 * Restoring the position afterwards deliberately does NOT happen here. By the
 * time this effect runs the browser has already clamped `window.scrollY`, so
 * anything read at this point is the collapsed value rather than where the
 * reader actually was. App captures the real offset at the moment the overlay
 * is opened and puts it back through Lenis once it closes.
 */
export function useScrollLock() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
}
