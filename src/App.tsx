import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/LanguageProvider';
import { CursorProvider } from '@/components/Cursor';
import Nav from '@/components/Nav';
import Intro from '@/components/Intro';
import WorkSection from '@/components/WorkSection';
import Ticker from '@/components/Ticker';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function App() {
  const lenis = useSmoothScroll();
  const { content, lang } = useLanguage();

  /**
   * German copy is longer than English, so every trigger position shifts when
   * the language flips. Recalculating after the swap keeps reveals aligned.
   */
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lang]);

  return (
    <CursorProvider>
      <Nav lenis={lenis} />

      <main id="top">
        <Intro />

        {content.works.map((work) => (
          <WorkSection key={`${lang}-${work.id}`} work={work} />
        ))}

        <Ticker />
        <Waitlist />
      </main>

      <Footer />
    </CursorProvider>
  );
}
