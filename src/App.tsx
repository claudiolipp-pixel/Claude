import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/LanguageProvider';
import { CursorProvider } from '@/components/Cursor';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import StackCard from '@/components/StackCard';
import Details from '@/components/Details';
import Ticker from '@/components/Ticker';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function App() {
  const lenis = useSmoothScroll();
  const { content, lang } = useLanguage();
  const [loaded, setLoaded] = useState(false);

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

  return (
    <CursorProvider>
      <Loader onDone={() => setLoaded(true)} />
      <Nav lenis={lenis} />

      <main id="top">
        {/*
          The card stack. Each card is sticky, so the next scrolls over the last;
          the wrapper just has to be tall enough to give them all room.
        */}
        <div className="relative">
          {content.works.map((work, i) => (
            <StackCard key={`${lang}-${work.id}`} work={work} index={i} />
          ))}
        </div>

        <Details />
        <Ticker />
        <Waitlist />
      </main>

      <Footer />
    </CursorProvider>
  );
}
