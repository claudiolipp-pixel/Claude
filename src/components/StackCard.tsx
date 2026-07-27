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
interface StackCardProps {
  work: Work;
  index: number;
  onOpen: (work: Work) => void;
  openLabel: string;
}

export default function StackCard({ work, index, onOpen, openLabel }: StackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
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
         * A slow push in across the whole runway. Two of the three cards are
         * stills, so without this the card is motionless for its entire hold
         * and reads as stuck rather than held. Scaling up only — scaling down
         * would pull the media inside the frame and expose its edges.
         */
        gsap.fromTo(
          media,
          { scale: 1 },
          {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top top', end: 'bottom top', scrub: true },
          },
        );

        // Dim while the next card covers this one.
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
    /*
     * The runway is taller than the card, so each card holds at the top for
     * roughly 1.4 screens of scrolling before the next covers it. Scroll
     * distance per card is the runway height, not the card height. Longer than
     * this and the hold stops reading as a pause and starts reading as a stall.
     */
    <div ref={cardRef} className="relative h-[140svh]">
    <section
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

      {/*
        The whole card is the control. A button can't legally contain the
        heading, so it sits over the media as an overlay with its own
        accessible name, leaving the visible type as real headings underneath.
      */}
      <button
        type="button"
        onClick={() => onOpen(work)}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-butter"
      >
        <span className="sr-only">
          {work.title} — {openLabel}
        </span>
      </button>

      {/*
        Headline first, flush to the page margin; number and labels sit on the
        line beneath it sharing that same left edge.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-10 text-chalk md:px-10 md:pb-14">
        <h2 className="display text-[clamp(38px,8.5vw,96px)]">
          <span className="block overflow-hidden py-[0.14em] [margin-block:-0.14em]">
            <span className="block" data-card-line>
              {work.title}
            </span>
          </span>
        </h2>

        <div className="label mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-chalk/70">
          <span className="block overflow-hidden tabular-nums text-chalk/60">
            <span className="block" data-card-line>
              {work.num}
            </span>
          </span>
          {work.meta.map((m) => (
            <span key={m} className="block overflow-hidden">
              <span className="block" data-card-line>
                {m}
              </span>
            </span>
          ))}
          {/* Touch devices never see the cursor label, so the card states
              what it does. */}
          <span className="block overflow-hidden">
            <span className="block bg-butter px-2 py-1 text-court" data-card-line>
              {openLabel}
            </span>
          </span>
        </div>
      </div>
    </section>
    </div>
  );
}
