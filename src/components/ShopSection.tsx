import { useLanguage } from '@/i18n/LanguageProvider';
import { useMaskReveal, useFadeUp } from '@/hooks/useReveal';
import { SHOP_OPEN, SHOP_URL } from '@/content/shop';
import Waitlist from '@/components/Waitlist';

/**
 * The last thing on the page: buy one.
 *
 * This slot used to be the waitlist, which was the right ask while there was
 * nothing to buy. Now there is, and asking someone to wait for a thing they
 * could order in the next minute is worse than not asking at all. So the shop
 * takes the headline and the button, and the list shrinks to one field
 * underneath for the people who are interested but not today.
 *
 * The shop is a Shopify storefront on its own subdomain wearing the same
 * theme, so this is a link out and not a route. Same tab on purpose: it is the
 * same brand and the same visit, and a new tab for your own shop is a habit
 * from linking to other people's.
 *
 * Tied to SHOP_OPEN rather than swapped by hand, like the button in the nav.
 * With the shop shut this falls back to the full waitlist, and the two can
 * never contradict each other.
 */
export default function ShopSection() {
  const { content } = useLanguage();
  const headRef = useMaskReveal<HTMLDivElement>();
  const bodyRef = useFadeUp<HTMLDivElement>(0.08);

  if (!SHOP_OPEN) return <Waitlist />;

  const t = content.shopCta;

  return (
    <section
      id="shop"
      data-surface="light"
      className="relative z-10 bg-butter px-5 pb-24 pt-20 text-court md:px-10 md:pb-32 md:pt-28"
    >
      <div ref={headRef}>
        <span className="label block text-court/55">
          <span className="reveal-mask">
            <span className="reveal-line" data-reveal-line>
              04 · {t.eyebrow}
            </span>
          </span>
        </span>
        <h2 className="display mt-2 text-[clamp(40px,min(12vw,18svh),140px)]">
          <span className="reveal-mask">
            <span className="reveal-line" data-reveal-line>
              {t.title}
            </span>
          </span>
        </h2>
      </div>

      <div ref={bodyRef}>
        <p className="mt-4 max-w-[520px]" data-reveal-item>
          {t.body}
        </p>

        <a
          href={SHOP_URL}
          data-reveal-item
          className="label mt-8 inline-block border border-court bg-court px-8 py-5 font-medium text-butter transition-colors hover:bg-cream hover:text-court"
        >
          {t.cta}
        </a>

        {/*
          The list, after the shop and visibly smaller. It keeps the hairline
          above it so it reads as a second, quieter offer rather than a
          competing one.
        */}
        <div
          className="mt-14 max-w-[440px] border-t border-court/25 pt-8"
          data-reveal-item
        >
          <p className="label text-court/55">{t.waitlistLabel}</p>
          <p className="mt-2 max-w-[420px] text-[14px]">{t.waitlistBody}</p>
          <div className="mt-4">
            <Waitlist compact />
          </div>
        </div>
      </div>
    </section>
  );
}
