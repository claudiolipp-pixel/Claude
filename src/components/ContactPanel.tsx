import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { useLanguage } from '@/i18n/LanguageProvider';
import { SOCIAL } from '@/content/site';

/**
 * Contact, opened from the nav. Court Cream like the detail pages, so the
 * switch from watching to reading stays consistent: image on the left, the
 * invitation on the right, and the three columns of detail beneath it.
 */
export default function ContactPanel({ onClose }: { onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { content } = useLanguage();
  const t = content.contact;

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
        .from(
          '[data-contact-item]',
          { y: 24, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 },
          '-=0.35',
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const columns: { label: string; items: { text: string; href?: string }[] }[] = [
    {
      label: t.socialsLabel,
      items: [
        { text: 'Instagram', href: SOCIAL.instagram },
        { text: 'LinkedIn', href: SOCIAL.linkedin },
      ],
    },
    {
      label: t.contactLabel,
      items: [{ text: SOCIAL.email, href: `mailto:${SOCIAL.email}` }],
    },
    { label: t.locationLabel, items: [{ text: t.location }] },
  ];

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      /* Lenis preventDefaults wheel events on the window even while stopped;
         this is its opt-out for nested scroll containers. */
      data-lenis-prevent
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-cream text-court"
    >
      <div className="flex items-start justify-end px-5 pt-5 md:px-10 md:pt-8">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="label shrink-0 border border-court px-4 py-2.5 transition-colors hover:bg-butter hover:text-court focus-visible:bg-butter"
        >
          {content.detail.close}
        </button>
      </div>

      <div className="grid gap-10 px-5 pb-20 pt-6 md:grid-cols-2 md:gap-14 md:px-10 md:pb-28">
        <figure
          className="overflow-hidden rounded-xl bg-court md:rounded-2xl"
          data-contact-item
        >
          <img
            src={t.image.src}
            alt={t.image.alt}
            className="aspect-[2/3] w-full object-cover"
          />
        </figure>

        <div className="flex flex-col">
          <h2
            id="contact-title"
            className="display text-[clamp(40px,6vw,80px)]"
            data-contact-item
          >
            {t.title}
          </h2>

          <p className="label mt-8 text-court/55" data-contact-item>
            {t.eyebrow}
          </p>
          <p className="mt-3 max-w-[460px] text-court/80" data-contact-item>
            {t.body}
          </p>

          {/* Pushed to the foot of the column so the three lists sit level
              with the bottom of the photo on wide screens. */}
          <div
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:mt-auto md:pt-16"
            data-contact-item
          >
            {columns.map((column) => (
              <div key={column.label}>
                <h3 className="label border-b border-court/20 pb-2 text-court/55">
                  {column.label}
                </h3>
                <ul className="mt-3 list-none space-y-1.5">
                  {column.items.map((item) => (
                    <li key={item.text}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          className="transition-colors hover:bg-butter"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
