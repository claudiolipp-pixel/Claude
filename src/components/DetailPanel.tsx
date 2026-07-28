import { useEffect, useRef } from 'react';
import type { Work } from '@/content/site';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useLanguage } from '@/i18n/LanguageProvider';

interface DetailPanelProps {
  work: Work;
  onClose: () => void;
}

/**
 * The information page for one card, opened by clicking its media. Court Cream
 * over the dark stack — the same light surface the rest of the site uses for
 * reading, so the switch from watching to reading is legible.
 *
 * Slides up over the card it came from, which keeps the spatial relationship
 * between the card and its detail.
 */
export default function DetailPanel({ work, onClose }: DetailPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { content } = useLanguage();
  const t = content.detail;

  // Escape closes, and focus moves in on open and back out on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'expo.out' })
        .from('[data-panel-item]', {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
        }, '-=0.35');
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      /*
       * Lenis listens for wheel events on the window and preventDefaults them
       * even while stopped, which leaves this panel unscrollable. The attribute
       * is Lenis's opt-out for nested scroll containers — inside it, the
       * browser scrolls natively.
       */
      data-lenis-prevent
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-cream text-court"
    >
      <div className="flex items-start justify-between gap-6 px-5 pt-5 md:px-10 md:pt-8">
        <span className="label pt-1 text-court/55 tabular-nums" data-panel-item>
          {work.num} — {work.title}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="label shrink-0 border border-court px-4 py-2.5 transition-colors hover:bg-butter hover:text-court focus-visible:bg-butter"
        >
          {t.close}
        </button>
      </div>

      <div className="px-5 pb-24 pt-10 md:px-10 md:pb-32 md:pt-14">
        <h2
          id="detail-title"
          className="display max-w-[900px] text-[clamp(40px,7vw,84px)]"
          data-panel-item
        >
          {work.detail.title}
        </h2>

        <p className="mt-5 max-w-[560px] text-court/70" data-panel-item>
          {work.detail.lead}
        </p>

        {work.detail.hero && (
          <figure className="mt-10 overflow-hidden rounded-xl bg-court md:rounded-2xl" data-panel-item>
            <img
              src={work.detail.hero.src}
              alt={work.detail.hero.alt}
              className="aspect-[3/2] w-full object-cover"
            />
          </figure>
        )}

        {/* Each block is one claim about the product, so they read as a list
            of properties rather than continuous prose. */}
        {work.detail.sections && (
          <div className="mt-12 grid gap-x-16 gap-y-9 md:grid-cols-2">
            {work.detail.sections.map((section) => (
              <section key={section.heading} data-panel-item>
                {/* Butter Yellow reads as a marker here, not as type: at this
                    lightness it has almost no contrast against Court Cream. */}
                <span aria-hidden="true" className="block h-1 w-9 bg-butter" />
                <h3 className="display mt-3 text-[clamp(22px,2.6vw,32px)]">{section.heading}</h3>
                <p className="mt-2.5 max-w-[460px] text-court/75">{section.body}</p>
              </section>
            ))}
          </div>
        )}

        {work.detail.gallery && (
          /* The column count follows the number of photos, so a pair fills the
             row instead of leaving a hole where a third would go. */
          <div
            className={`mt-12 grid grid-cols-2 gap-2 md:gap-3 ${
              work.detail.gallery.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
            }`}
            data-panel-item
          >
            {work.detail.gallery.map((image, i) => {
              // Three portraits into two columns leaves an orphan on small
              // screens; the first spans both so the row stays whole.
              const spansOnMobile = work.detail.gallery!.length % 2 === 1 && i === 0;
              return (
                <figure
                  key={image.src}
                  className={`overflow-hidden rounded-lg bg-court md:rounded-xl ${
                    spansOnMobile ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className={`w-full object-cover ${
                      spansOnMobile ? 'aspect-[4/3] md:aspect-[2/3]' : 'aspect-[2/3]'
                    }`}
                  />
                </figure>
              );
            })}
          </div>
        )}

        {/* The story runs first, the team next, and the locked lines close the
            page — a statement lands harder after the people it describes. */}
        {work.detail.body && (
          <div className="mt-12 max-w-[560px] space-y-5">
            {work.detail.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-court/80" data-panel-item>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {work.detail.people && (
          <div className="mt-16" data-panel-item>
            {work.detail.peopleTitle && (
              <h3 className="display text-[clamp(28px,4vw,48px)]">{work.detail.peopleTitle}</h3>
            )}
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
              {work.detail.people.map((person) => (
                <figure key={person.name}>
                  <div className="overflow-hidden rounded-lg bg-court md:rounded-xl">
                    <img
                      src={person.photo.src}
                      alt={person.photo.alt}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <h4 className="display text-[clamp(20px,2.2vw,26px)]">{person.name}</h4>
                    <p className="label mt-1 text-court/55">{person.role}</p>
                    <p className="mt-2.5 text-court/75">{person.bio}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {work.detail.values && (
            /* The locked lines, each on its own yellow field — the one place
               the guide lets the accent carry a whole surface outside a
               conversion block. */
            <ul className="flex max-w-[560px] list-none flex-col gap-1.5" data-panel-item>
              {work.detail.values.map((value) => (
                <li key={value} className="bg-butter px-4 py-3 text-court">
                  {value}
                </li>
              ))}
            </ul>
          )}

          {work.detail.specs && (
            <div data-panel-item>
              <h3 className="label mb-3 text-court/55">{t.specsLabel}</h3>
              <ul className="list-none border-t border-court/15">
                {work.detail.specs.map((spec) => (
                  <li
                    key={spec.label}
                    className="flex items-baseline justify-between gap-6 border-b border-court/15 py-3.5 text-xs uppercase tracking-[0.1em]"
                  >
                    <span className="text-court/60">( {spec.label} )</span>
                    <span className="bg-butter px-1.5 text-right font-medium">{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
