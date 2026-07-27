import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Work } from '@/content/site';
import { CursorProvider } from '@/components/Cursor';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import StackCard from '@/components/StackCard';
import DetailPanel from '@/components/DetailPanel';
import Ticker from '@/components/Ticker';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function App() {
  const lenis = useSmoothScroll();
  const { content, lang } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [openWork, setOpenWork] = useState<Work | null>(null);

  /**
   * German copy is longer than English, so trigger positions shift when the
   * language flips. The same is true once the loader lifts and the page
   * becomes scrollable.
   */
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    return () => window.clearTimeout(id);
  }, [lang, loaded]);

  // Nothing should scroll underneath the loader while it runs.
  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loaded]);

  /** Lenis keeps running behind a modal and steals its wheel events. */
  useEffect(() => {
    if (!lenis.current) return;
    if (openWork) lenis.current.stop();
    else lenis.current.start();
  }, [openWork, lenis]);

  const closeDetail = useCallback(() => setOpenWork(null), []);

  return (
    <CursorProvider>
      <Loader onDone={() => setLoaded(true)} />
      <Nav lenis={lenis} />

      <main id="top">
        {/*
          The card stack. Each card is sticky, so the next scrolls over the last;
          the wrapper just has to be tall enough to give them all room.
        */}
        <div className="relative px-2 pt-2 md:px-3 md:pt-3">
          {content.works.map((work, i) => (
            <StackCard
              key={`${lang}-${work.id}`}
              work={work}
              index={i}
              onOpen={setOpenWork}
              openLabel={content.detail.open}
            />
          ))}
        </div>

        <Ticker />
        <Waitlist />
      </main>

      <Footer />

      {openWork && (
        <DetailPanel key={openWork.id} work={openWork} onClose={closeDetail} />
      )}
    </CursorProvider>
  );
}
