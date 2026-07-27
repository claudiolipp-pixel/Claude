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
          className="label shrink-0 border border-court px-4 py-2.5 transition-colors hover:bg-court hover:text-cream"
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

        <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          <div className="max-w-[560px] space-y-5">
            {work.detail.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-court/80" data-panel-item>
                {paragraph}
              </p>
            ))}
          </div>

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
                    <span className="text-right font-medium">{spec.value}</span>
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
