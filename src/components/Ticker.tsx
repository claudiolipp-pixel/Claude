import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useLanguage } from '@/i18n/LanguageProvider';

/**
 * Infinite marquee whose speed and skew react to scroll velocity, and whose
 * direction flips with scroll direction. Scrolling therefore feels like it's
 * driving the band rather than passing it — the one moving element the brand
 * guide explicitly allows yellow to fill (07, Applications).
 */
export default function Ticker() {
  const { content } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Half the track is a duplicate, so -50% lands on a seamless loop point.
        const loop = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 22,
          ease: 'none',
        });

        const trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            // Direction of travel follows the direction of scroll.
            loop.timeScale(self.direction === 1 ? 1 : -1);
            gsap.to(loop, {
              timeScale: (self.direction === 1 ? 1 : -1) * gsap.utils.clamp(1, 5, Math.abs(velocity) / 260),
              duration: 0.3,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2 });
              },
            });
            gsap.to(track, {
              skewX: gsap.utils.clamp(-6, 6, velocity / -400),
              duration: 0.4,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },
        });

        return () => {
          trigger.kill();
          loop.kill();
        };
      });
    }, trackRef);

    return () => ctx.revert();
  }, [content.ticker]);

  // Duplicated so the loop point is invisible.
  const phrases = [...content.ticker, ...content.ticker, ...content.ticker, ...content.ticker];

  return (
    <div
      aria-hidden="true"
      className="mt-13 overflow-hidden border-y border-court bg-butter py-2.5 text-court"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[...phrases, ...phrases].map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="whitespace-nowrap pr-12 font-display text-2xl font-black uppercase tracking-[0.06em]"
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
