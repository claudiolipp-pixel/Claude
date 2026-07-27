import { useEffect, useRef, useState } from 'react';
import type Lenis from 'lenis';
import { gsap, Observer, EASE } from '@/lib/gsap';
import { useLanguage } from '@/i18n/LanguageProvider';
import { SOCIAL } from '@/content/site';
import { scrollToAnchor } from '@/hooks/useSmoothScroll';

interface NavProps {
  lenis: React.MutableRefObject<Lenis | null>;
}

export default function Nav({ lenis }: NavProps) {
  const { content, lang, toggle } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const [onLight, setOnLight] = useState(false);

  /**
   * Scrolling down hides the bar, scrolling up brings it back, so the
   * full-bleed cards are never permanently obstructed.
   */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      let hidden = false;

      const show = () => {
        if (!hidden) return;
        hidden = false;
        gsap.to(el, { yPercent: 0, duration: 0.5, ease: EASE });
      };
      const hide = () => {
        if (hidden || window.scrollY < 200) return;
        hidden = true;
        gsap.to(el, { yPercent: -100, duration: 0.45, ease: EASE });
      };

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const observer = Observer.create({
          type: 'wheel,touch,scroll',
          onDown: show,
          onUp: hide,
          tolerance: 12,
        });
        return () => observer.kill();
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  /**
   * The bar rides over dark cards and light sections alike, so it takes its
   * ink from whichever surface is currently behind it. Sections opt in by
   * carrying `data-surface="light"`.
   */
  useEffect(() => {
    const lights = document.querySelectorAll('[data-surface="light"]');
    if (!lights.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // The bar's own band across the top of the viewport.
          if (entry.isIntersecting) setOnLight(true);
          else if ([...lights].every((l) => !isUnderNav(l))) setOnLight(false);
        }
      },
      { rootMargin: '0px 0px -92% 0px', threshold: 0 },
    );

    const isUnderNav = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top <= 72 && r.bottom >= 0;
    };

    lights.forEach((l) => io.observe(l));
    return () => io.disconnect();
  }, [lang]);

  /*
   * Over the dark cards a gradient scrim is enough. Over a light section the
   * bar needs its own surface, or headlines scroll straight through it.
   */
  const surface = onLight
    ? 'text-court bg-cream/95 backdrop-blur-sm border-court/10'
    : 'text-chalk bg-gradient-to-b from-court/70 to-transparent border-transparent';

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-5 py-4 transition-colors duration-500 md:px-10 md:py-5 ${surface}`}
    >
      <a
        href="#top"
        aria-label="AIRBALL — home"
        className="flex items-center gap-2.5"
        onClick={(e) => {
          e.preventDefault();
          lenis.current ? lenis.current.scrollTo(0) : window.scrollTo({ top: 0 });
        }}
      >
        {/*
          The mark carries its own alpha, so it needs no plate behind it. It
          ships white; over a light surface it is inverted to ink rather than
          swapped for a second file.
        */}
        <img
          src="/brand/mark-a.png"
          alt=""
          className={`h-7 w-7 object-contain transition-[filter] duration-500 ${
            onLight ? 'invert' : ''
          }`}
        />
        <span className="font-display text-xl font-black uppercase tracking-wordmark">
          Airball
        </span>
      </a>

      <div className="flex items-center gap-4 md:gap-5">
        <button
          type="button"
          onClick={toggle}
          className="label border-b-2 border-transparent pb-0.5 transition-colors hover:border-butter"
          aria-label={lang === 'en' ? 'Switch to German' : 'Auf Englisch umschalten'}
        >
          {lang === 'en' ? 'DE' : 'EN'}
        </button>

        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="label hidden border-b-2 border-transparent pb-0.5 transition-colors hover:border-butter sm:block"
        >
          {content.nav.instagram}
        </a>

        <a
          href="#waitlist"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor(lenis.current, '#waitlist');
          }}
          className="label bg-butter px-3.5 py-2.5 text-court transition-colors hover:bg-chalk"
        >
          {content.nav.waitlist}
        </a>
      </div>
    </nav>
  );
}
