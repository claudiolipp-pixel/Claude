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
  const [solid, setSolid] = useState(false);

  /**
   * Two behaviours share one Observer: past ~40px the bar gains its surface,
   * and scrolling down hides it while scrolling up brings it back. Hiding on
   * the way down is what keeps oversized headlines unobstructed.
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

    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={[
        'fixed inset-x-0 top-0 z-50 flex items-center justify-between',
        'px-5 py-4 md:px-10 md:py-5',
        'border-b transition-[background-color,border-color] duration-300',
        solid
          ? 'border-court/15 bg-cream/[0.97] backdrop-blur-sm'
          : 'border-transparent bg-gradient-to-b from-cream/95 to-transparent',
      ].join(' ')}
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
        <span className="grid h-7 w-7 place-items-center bg-court">
          <img src="/brand/mark-a.jpg" alt="" className="h-full w-full object-cover" />
        </span>
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
          className="label bg-butter px-3.5 py-2.5 transition-colors hover:bg-court hover:text-cream"
        >
          {content.nav.waitlist}
        </a>
      </div>
    </nav>
  );
}
