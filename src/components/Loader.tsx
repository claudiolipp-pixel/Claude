import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { CONTENT } from '@/content/site';

/**
 * The load sequence, in three movements:
 *
 *   1. A word slot cycles through places a court has actually been set up in,
 *      then settles on "Anywhere" and completes the master line — the brand's
 *      central claim argued rather than asserted.
 *   2. A vertical strip of stills runs upward and decelerates, the way a reel
 *      slows into its resting frame.
 *   3. The frame it lands on grows to fill the viewport and hands off to the
 *      first card, which carries the same footage.
 *
 * Always English. English is the brand language (Brand Guide 05), and the
 * sequence is a brand moment rather than page copy, so it does not follow the
 * language switch.
 *
 * Skipped entirely under reduced motion.
 */

const EN = CONTENT.en;

/** Repeated so the strip is long enough to build real speed before settling. */
const STRIP = [
  '/media/rally.jpg',
  '/media/movement.jpg',
  '/media/rally.jpg',
  '/media/movement.jpg',
  '/media/rally.jpg',
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState(EN.loader.places[0]);

  useEffect(() => {
    const root = rootRef.current;
    const slot = slotRef.current;
    const strip = stripRef.current;
    const landing = landingRef.current;
    if (!root || !slot || !strip || !landing) {
      onDone();
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(root, { autoAlpha: 0, display: 'none' });
      onDone();
      return;
    }

    const { places, resolve } = EN.loader;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { display: 'none' });
          onDone();
        },
      });

      // 1 — the word slot. Slow enough to read each place.
      const STEP = 0.28;
      places.forEach((place, i) => {
        tl.call(() => setWord(place), [], 0.3 + i * STEP).fromTo(
          slot,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: STEP * 0.7, ease: 'power2.out' },
          0.3 + i * STEP,
        );
      });

      const resolveAt = 0.3 + places.length * STEP;
      tl.call(() => setWord(resolve), [], resolveAt)
        .fromTo(
          slot,
          { yPercent: 100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' },
          resolveAt,
        )
        .to('[data-loader-rest]', { autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, resolveAt + 0.15)
        // Hold the finished line before handing over to the reel.
        .to({}, { duration: 0.45 })
        .to('[data-loader-word]', { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' })

        // 2 — the reel. One long decelerating run, no visible steps.
        .fromTo(
          strip,
          { yPercent: 0 },
          { yPercent: -62, duration: 1.85, ease: 'power3.out' },
          '-=0.2',
        )
        .from(
          strip.children,
          { autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: 'power1.out' },
          '<',
        )

        /*
         * 3 — the resting frame grows to fill the viewport. The values are
         * functions so GSAP reads the tile's real position at the moment the
         * tween starts, after the reel has settled, rather than at build time.
         */
        .to('[data-strip-tile]:not([data-landing])', { autoAlpha: 0, duration: 0.4 }, '-=0.35')
        .to(landing, {
          scale: () => {
            const r = landing.getBoundingClientRect();
            return Math.max(window.innerWidth / r.width, window.innerHeight / r.height);
          },
          x: () => {
            const r = landing.getBoundingClientRect();
            return window.innerWidth / 2 - (r.left + r.width / 2);
          },
          y: () => {
            const r = landing.getBoundingClientRect();
            return window.innerHeight / 2 - (r.top + r.height / 2);
          },
          duration: 0.9,
          ease: 'expo.inOut',
        })
        .to(root, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }, rootRef);

    return () => ctx.revert();
    // Runs once: re-running mid-sequence would restart the timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-court text-chalk"
      aria-hidden="true"
    >
      {/*
        The reel sits behind the type and only becomes the subject once the
        line has finished. Centering lives on this wrapper, never on the strip
        itself — GSAP writes its own transform when animating the strip and
        would wipe out any translate utilities sharing that property.
      */}
      <div className="absolute inset-0 grid place-items-center">
      <div
        ref={stripRef}
        className="flex w-[62vw] max-w-[340px] flex-col gap-3 will-change-transform"
      >
        {STRIP.map((src, i) => (
          <div
            key={`${src}-${i}`}
            data-strip-tile
            className="aspect-[4/5] w-full shrink-0 overflow-hidden bg-court/60"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        {/* The frame the reel lands on — the same footage the first card runs. */}
        <div
          ref={landingRef}
          data-strip-tile
          data-landing
          className="aspect-[4/5] w-full shrink-0 overflow-hidden bg-court will-change-transform"
        >
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/media/airballer.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      </div>

      <p
        data-loader-word
        className="display relative z-10 text-center text-[clamp(40px,11vw,110px)] drop-shadow-[0_2px_40px_rgba(10,10,10,0.9)]"
      >
        <span className="block overflow-hidden py-[0.14em] [margin-block:-0.14em]">
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
