import { useEffect, useRef } from 'react';
import type { Work } from '@/content/site';
import { gsap } from '@/lib/gsap';
import { useCursorTarget } from '@/components/Cursor';

/**
 * One full-viewport card in the stack. Cards are `position: sticky`, so each
 * one is scrolled over by the next while staying put underneath — the covering
 * motion comes free from the browser rather than from a pinned ScrollTrigger,
 * which keeps mobile scrolling native.
 *
 * The card being covered dims and settles back a little, so the stack reads as
 * depth instead of a flat wipe.
 */
export default function StackCard({ work, index }: { work: Work; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorProps = useCursorTarget(work.tag);

  useEffect(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    if (!card || !media) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Meta rises as the card arrives.
        gsap.from(card.querySelectorAll('[data-card-line]'), {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: card, start: 'top 70%', once: true },
        });

        /*
         * Dim — but never scale — while the next card covers this one. A
         * scaled card stops filling the viewport and shows its own edges
         * through the gap, which reads as a broken layer rather than depth.
         */
        gsap.to(media, {
          filter: 'brightness(0.4)',
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // Only the first card's video is worth eagerly loading.
  const eager = index === 0;

  return (
    <section
      ref={cardRef}
      id={work.id}
      className="sticky top-0 h-[100svh] overflow-hidden bg-court"
      aria-label={work.title}
    >
      <div ref={mediaRef} {...cursorProps} className="absolute inset-0">
        {work.media.type === 'video' ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload={eager ? 'auto' : 'metadata'}
            poster={work.media.poster}
            aria-label={work.media.alt}
          >
            <source src={work.media.src} type="video/mp4" />
          </video>
        ) : (
          <img
            src={work.media.src}
            alt={work.media.alt}
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />
        )}
        {/* Keeps the meta legible over any frame of the footage. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-court/85 via-court/10 to-court/30"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-10 text-chalk md:px-10 md:pb-14">
        <span className="label shrink-0 pb-1 text-chalk/60 tabular-nums">
          <span className="block overflow-hidden">
            <span className="block" data-card-line>
              {work.num}
            </span>
          </span>
        </span>

        <div className="min-w-0">
          <h2 className="display text-[clamp(38px,8.5vw,96px)]">
            <span className="block overflow-hidden">
              <span className="block" data-card-line>
                {work.title}
              </span>
            </span>
          </h2>
          <div className="label mt-2 flex flex-wrap gap-x-5 gap-y-1 text-chalk/70">
            {work.meta.map((m) => (
              <span key={m} className="block overflow-hidden">
                <span className="block" data-card-line>
                  {m}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
