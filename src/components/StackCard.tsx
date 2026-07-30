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

      mm.add(
        {
          motionOk: '(prefers-reduced-motion: no-preference)',
          // Mirrors the `roomy` screen: anything short counts as tight, even
          // when it is wide.
          isNarrow: 'not all and (min-width: 768px) and (min-height: 600px)',
        },
        (context) => {
        const { motionOk, isNarrow } = context.conditions as Record<string, boolean>;
        if (!motionOk) return;

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
         * and reads as stuck rather than held.
         *
         * The media fills the card on every size. On tight screens the drift
         * tops out lower, so the frame sits a touch wider than it otherwise
         * would — it cannot make a landscape clip readable in a portrait card,
         * but it stops the hold ending at maximum crop.
         */
        gsap.fromTo(
          media,
          { scale: 1 },
          {
            scale: isNarrow ? 1.02 : 1.06,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top top', end: 'bottom top', scrub: true },
          },
        );

        /*
         * Once the hold is over, the card slides away as the next one
         * arrives. Being scrubbed makes it bidirectional for free: scroll
         * back up and the card is pushed down again.
         *
         * Only transform and opacity are animated here. Dimming used to run
         * through filter: brightness() on the media itself, which repaints a
         * full-screen video every frame; the dim is now an overlay's opacity,
         * which the compositor handles without touching the image.
         *
         * The scrub lag is deliberately short. Lenis already smooths the
         * scroll, so a long lag on top of it smooths twice and the movement
         * turns rubbery rather than fluid.
         */
        gsap.to(media, {
          yPercent: -9,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 0.25,
          },
        });

        // The dim layer rides inside the media, so it only needs its opacity.
        gsap.to(card.querySelector('[data-card-dim]'), {
          opacity: 0.62,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 0.25,
          },
        });
        },
      );
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
    {/*
      The card floats inside a gutter rather than running edge to edge. The
      gutter is what makes the lift legible: without a fixed frame around it
      there is no reference edge to see the card move against, and full bleed
      sliding over full bleed reads as a cut instead of a movement.
      Sticky offset matches the gutter so the card keeps it on all four sides.
    */}
    <section
      id={work.id}
      className="sticky top-2 h-[calc(100svh-1rem)] overflow-hidden rounded-xl bg-court md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-2xl"
      aria-label={work.title}
    >
      {/* Taller than the card and offset upward, so the lift has room to
          travel without ever pulling an edge into view. At -9% travel the
          bottom edge still sits ~2.5% below the card. */}
      <div
        ref={mediaRef}
        {...cursorProps}
        className="absolute inset-x-0 -top-[14%] h-[128%] will-change-transform"
      >
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
            style={{ objectPosition: work.media.focal }}
            className="h-full w-full object-cover"
          />
        )}
        {/* Keeps the meta legible over any frame of the footage. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-court/85 via-court/10 to-court/30"
        />
        {/* Dims the card as the next one covers it. A separate layer rather
            than a filter on the media, so the compositor can fade it without
            repainting the footage. */}
        <div data-card-dim aria-hidden="true" className="absolute inset-0 bg-court opacity-0" />
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
          {work.title} · {openLabel}
        </span>
      </button>

      {/*
        Headline first, flush to the page margin; number and labels sit on the
        line beneath it sharing that same left edge.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-10 text-chalk md:px-10 md:pb-14">
        {/* Sized against the shorter axis too: on a sideways phone 8.5vw is
            71px inside a 366px card, which swallows the whole frame. */}
        <h2 className="display text-[clamp(36px,min(8.5vw,12svh),96px)]">
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
