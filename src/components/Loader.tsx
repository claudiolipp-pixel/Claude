import { useEffect, useRef, useState } from 'react';
import { gsap, EASE_LONG, prefersReducedMotion } from '@/lib/gsap';
import { useLanguage } from '@/i18n/LanguageProvider';

const SEEN_KEY = 'airball.loaderSeen';

/**
 * The load sequence. A word slot cycles through places a court has actually
 * been set up in, then settles on "Anywhere" and completes the master line —
 * the brand's central claim argued rather than asserted.
 *
 * Shows once per browser session. Skipped entirely under reduced motion,
 * where the page simply starts.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const { content } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const [word, setWord] = useState(content.loader.places[0]);

  useEffect(() => {
    const root = rootRef.current;
    const slot = slotRef.current;
    if (!root || !slot) {
      onDone();
      return;
    }

    if (prefersReducedMotion() || sessionStorage.getItem(SEEN_KEY)) {
      gsap.set(root, { autoAlpha: 0, display: 'none' });
      onDone();
      return;
    }

    const { places, resolve } = content.loader;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SEEN_KEY, '1');
          onDone();
        },
      });

      // Each place flicks through the slot; the last hold is longer so the
      // resolve reads as an answer rather than one more item in the list.
      places.forEach((place, i) => {
        tl.call(() => setWord(place), [], i * 0.13)
          .fromTo(
            slot,
            { yPercent: 60, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.13, ease: 'none' },
            i * 0.13,
          );
      });

      tl.call(() => setWord(resolve), [], places.length * 0.13)
        .fromTo(
          slot,
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: EASE_LONG },
          places.length * 0.13,
        )
        .to('[data-loader-rest]', { autoAlpha: 1, duration: 0.5, ease: EASE_LONG }, '<0.15')
        .to({}, { duration: 0.45 })
        // Lift away to reveal the first card already in place beneath.
        .to(root, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
        .set(root, { display: 'none' });
    }, rootRef);

    return () => ctx.revert();
    // Intentionally runs once: re-running mid-sequence would restart the timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-court px-6 text-chalk"
    >
      <p className="display text-center text-[clamp(40px,11vw,110px)]">
        <span className="block overflow-hidden">
          <span ref={slotRef} className="block will-change-transform">
            {word}
          </span>
        </span>
        <span data-loader-rest className="block opacity-0">
          Is An Arena
        </span>
      </p>
    </div>
  );
}
