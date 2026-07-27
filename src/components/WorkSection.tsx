import { useRef } from 'react';
import type { Work } from '@/content/site';
import { useMaskReveal, useFadeUp, useParallax } from '@/hooks/useReveal';
import { useCursorTarget } from '@/components/Cursor';

/**
 * A numbered index section: rule, number, oversized title, mono meta, then a
 * full-bleed media frame with body copy and optional specs beneath.
 */
export default function WorkSection({ work }: { work: Work }) {
  const headRef = useMaskReveal<HTMLDivElement>();
  const bodyRef = useFadeUp<HTMLDivElement>();
  const mediaRef = useParallax<HTMLDivElement>(10);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cursorLabel = work.tag;
  const cursorProps = useCursorTarget(cursorLabel);

  return (
    <section id={work.id} className="px-5 pb-2 pt-11 md:px-10 md:pt-16">
      <div ref={headRef}>
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-3.5 border-t border-court/15 pt-4 md:grid-cols-[70px_1fr_auto]">
          <span className="label col-start-1 text-dim">
            <span className="reveal-mask">
              <span className="reveal-line" data-reveal-line>
                {work.num}
              </span>
            </span>
          </span>

          <h2 className="display col-start-2 text-[clamp(44px,10vw,110px)]">
            <span className="reveal-mask">
              <span className="reveal-line" data-reveal-line>
                <span className="highlight-sweep">{work.title}</span>
              </span>
            </span>
          </h2>

          <div className="label col-start-2 mt-2 flex gap-5 text-dim md:col-start-3 md:mt-0 md:self-baseline">
            {work.meta.map((m) => (
              <span key={m} className="reveal-mask">
                <span className="reveal-line" data-reveal-line>
                  {m}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={mediaRef}
        {...cursorProps}
        className="group relative mt-6 aspect-[16/10] overflow-hidden bg-court"
        onMouseEnter={() => videoRef.current?.play().catch(() => undefined)}
      >
        {/*
          The inner layer is taller than the frame and sits slightly above it,
          so parallax travel never exposes an edge.
        */}
        <div data-parallax-inner className="absolute inset-x-0 -top-[6%] h-[112%]">
          {work.media.type === 'video' ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
              poster={work.media.poster}
              aria-label={work.media.alt}
            >
              <source src={work.media.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={work.media.src}
              alt={work.media.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]"
            />
          )}
        </div>
        <span className="label absolute bottom-3.5 left-3.5 bg-butter px-2.5 py-1.5 text-court">
          {work.tag}
        </span>
      </div>

      <div ref={bodyRef}>
        <p className="mt-4.5 max-w-[560px] text-court/80" data-reveal-item>
          {work.body}
        </p>

        {work.specs && (
          <ul className="mt-4 max-w-[560px] list-none border-t border-court/15">
            {work.specs.map((spec) => (
              <li
                key={spec.label}
                data-reveal-item
                className="flex items-baseline justify-between gap-4 border-b border-court/15 py-2.5 text-xs uppercase tracking-[0.1em]"
              >
                <span>{spec.label}</span>
                <b className="bg-butter px-1.5 text-right font-medium">{spec.value}</b>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
