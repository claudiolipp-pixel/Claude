import { useCallback, useEffect, useRef } from 'react';

/**
 * Makes Back close an overlay instead of leaving the site.
 *
 * The detail and contact panels cover the whole screen, so they read as pages.
 * People treat them as pages too: the browser's Back button and the Android
 * back gesture are the first thing they reach for, and without this they land
 * on whatever came before airball.at instead of back on the card they came
 * from.
 *
 * The trick is one history entry per overlay. Opening pushes it, so Back has
 * something to pop that costs nothing. Closing has to *step back through* that
 * entry rather than just hiding the overlay, otherwise the entry outlives the
 * panel and swallows the next Back press, which looks like a broken button.
 *
 * Returns the close function every dismiss path should call: the Close button,
 * Escape, anything else.
 */
export function useOverlayHistory(isOpen: boolean, close: () => void) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isOpen || pushed.current) return;
    // No URL change: the cards already own `#game`, `#airballer` and
    // `#movement` as anchors, so writing a hash here would make the browser
    // jump the page underneath the overlay.
    window.history.pushState({ airballOverlay: true }, '');
    pushed.current = true;
  }, [isOpen]);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      close();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [close]);

  return useCallback(() => {
    // popstate does the actual closing, so both routes end up identical.
    if (pushed.current) window.history.back();
    else close();
  }, [close]);
}
