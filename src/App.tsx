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
import ContactPanel from '@/components/ContactPanel';
import Ticker from '@/components/Ticker';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { legalKeyForPath } from '@/content/legal';

/**
 * The whole site is one page, apart from imprint and privacy, which need real
 * URLs so they can be linked to and found. The Worker serves index.html for
 * any unmatched path (`not_found_handling: single-page-application`), so the
 * path is read here and decides which of the two things renders.
 *
 * Navigation between them is plain <a>, so there is no history handling to get
 * wrong — the browser does a normal page load and this runs again.
 */
export default function App() {
  const legal = legalKeyForPath(window.location.pathname);
  if (legal) return <LegalPage which={legal} />;
  return <HomePage />;
}

function HomePage() {
  const lenis = useSmoothScroll();
  const { content, lang } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [openWork, setOpenWork] = useState<Work | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

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
    if (openWork || contactOpen) lenis.current.stop();
    else lenis.current.start();
  }, [openWork, contactOpen, lenis]);

  const closeDetail = useCallback(() => setOpenWork(null), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <CursorProvider>
      <Loader onDone={() => setLoaded(true)} />
      <Nav lenis={lenis} onOpenContact={() => setContactOpen(true)} />

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

      {contactOpen && <ContactPanel onClose={closeContact} />}
    </CursorProvider>
  );
}
