import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useOverlayHistory } from '@/hooks/useOverlayHistory';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Work } from '@/content/site';
import { CursorProvider } from '@/components/Cursor';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import StackCard from '@/components/StackCard';
import DetailPanel from '@/components/DetailPanel';
import ContactPanel from '@/components/ContactPanel';
import CartDrawer from '@/components/CartDrawer';
import Ticker from '@/components/Ticker';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';
import LegalPage from '@/components/LegalPage';
import { legalKeyForPath } from '@/content/legal';
import ShopPage from '@/components/ShopPage';
import { SHOP_LIVE, shopRouteForPath } from '@/content/shop';
import { currentPath } from '@/lib/route';

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
  const path = currentPath();

  const legal = legalKeyForPath(path);
  if (legal) return <LegalPage which={legal} />;

  /*
   * The shop only exists once SHOP_LIVE is set. Until then /shop falls through
   * to the home page, because the imprint is still a placeholder and the terms
   * and right of withdrawal do not exist yet. A reachable buy button before
   * those are in place would be a liability, not a soft launch.
   */
  if (SHOP_LIVE) {
    const shop = shopRouteForPath(path);
    if (shop) return <ShopPage slug={shop.slug} />;
  }

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

  /*
   * Both overlays share one history entry, because only one can be open at a
   * time. Closing goes through `dismiss`, which steps back through that entry
   * so Back never ends up pointing at an overlay that is already gone.
   */
  const closeOverlays = useCallback(() => {
    setOpenWork(null);
    setContactOpen(false);
  }, []);
  const dismiss = useOverlayHistory(Boolean(openWork) || contactOpen, closeOverlays);

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
        <DetailPanel key={openWork.id} work={openWork} onClose={dismiss} />
      )}

      {contactOpen && <ContactPanel onClose={dismiss} />}

      {/* The cart icon is in the bar here too, so the drawer has to be
          reachable from the home page and not only inside the shop. */}
      {SHOP_LIVE && <CartDrawer />}
    </CursorProvider>
  );
}
