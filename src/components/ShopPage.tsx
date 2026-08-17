import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { SOCIAL } from '@/content/site';
import { CursorProvider, useCursorTarget } from '@/components/Cursor';
import Wordmark from '@/components/Wordmark';
import ProductGallery from '@/components/ProductGallery';
import {
  PRODUCTS,
  SHOP,
  cartUrl,
  productBySlug,
  sized,
  srcSet,
  type ShopProduct,
  type ShopPanel,
} from '@/content/shop';

/**
 * The shop, on the same origin and in the same design as the rest of the site.
 *
 * The split is deliberate: everything a visitor reads while deciding is ours,
 * and the moment money is involved Shopify takes over. The buy button is a
 * plain link to a Shopify cart permalink, so there is no cart state, no API key
 * in the bundle and nothing of ours between the click and the checkout.
 *
 * No loader here. It is a first impression, not a ritual, and nobody wants nine
 * seconds of animation between them and a product they came to buy.
 */

/** Austrian format in German, the usual leading symbol in English. */
function usePrice() {
  const { lang } = useLanguage();
  return (value: number) =>
    new Intl.NumberFormat(lang === 'de' ? 'de-AT' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
}

/**
 * Where you are, and the way back up. A product reached from an Instagram link
 * is often the first page someone sees, and without this there is nothing on
 * screen saying the shop has anything else in it.
 */
function Breadcrumb({ product }: { product?: ShopProduct }) {
  const { lang } = useLanguage();
  const t = SHOP[lang].strings;
  const name = product ? SHOP[lang].copy[product.slug].name : null;
  return (
    <nav aria-label="Breadcrumb" className="label px-5 pb-1 pt-2 text-court/45 md:px-10">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li><a href="/" className="transition-colors hover:text-court">{t.home}</a></li>
        <li aria-hidden="true">&middot;</li>
        <li>
          {name ? (
            <a href="/shop" className="transition-colors hover:text-court">{t.eyebrow}</a>
          ) : (
            <span aria-current="page" className="text-court">{t.eyebrow}</span>
          )}
        </li>
        {name && (
          <>
            <li aria-hidden="true">&middot;</li>
            <li><span aria-current="page" className="text-court">{name}</span></li>
          </>
        )}
      </ol>
    </nav>
  );
}

function ShopHeader({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-7">
      {/* The mark ships white, so over Court Cream it has to be inverted. */}
      <a href="/" className="transition-opacity hover:opacity-70" aria-label="AIRBALL, home">
        <Wordmark className="text-2xl" invert />
      </a>
      <div className="label flex items-center gap-3">
        <button
          type="button"
          onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
          className="border border-court px-3 py-2 transition-colors hover:bg-butter"
        >
          {lang === 'de' ? 'EN' : 'DE'}
        </button>
        <a href={backHref} className="border border-court px-4 py-2 transition-colors hover:bg-butter">
          {backLabel}
        </a>
      </div>
    </header>
  );
}

function BuyButton({ product, label }: { product: ShopProduct; label: string }) {
  return (
    <a
      href={cartUrl(product)}
      className="label mt-4 block bg-butter px-6 py-4 text-center font-medium text-court transition-colors hover:bg-court hover:text-butter"
    >
      {label}
    </a>
  );
}

function ProductCard({ product }: { product: ShopProduct }) {
  const { lang, content } = useLanguage();
  const t = SHOP[lang].strings;
  const copy = SHOP[lang].copy[product.slug];
  const price = usePrice();
  const cursor = useCursorTarget(content.detail.open);
  const saving = product.partsPrice ? product.partsPrice - product.price : 0;

  return (
    <article className="flex flex-col">
      <a href={`/shop/${product.slug}`} className="group block" {...cursor}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-court md:rounded-2xl">
          <img
            src={sized(product.image, 700)}
            srcSet={srcSet(product.image, [400, 700, 1000])}
            sizes="(min-width: 768px) 31vw, 100vw"
            alt={copy.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {product.suggested && (
            <span className="label absolute left-3 top-3 bg-butter px-2.5 py-1.5 font-medium text-court">
              {t.suggested}
            </span>
          )}
        </div>
        <h3 className="display mt-4 text-[clamp(24px,3vw,34px)]">{copy.name}</h3>
      </a>

      <p className="mt-2 max-w-[34ch] text-court/70">{copy.lede}</p>

      {copy.includes.length > 0 && (
        <ul className="mt-4 list-none space-y-1 text-[13px] text-court/70">
          {copy.includes.map((item) => (
            <li key={item} className="flex items-baseline gap-2.5">
              <span aria-hidden="true" className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-butter" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* mt-auto pins the price row to the same line across a row of cards, so
          bundles with different contents still compare cleanly. */}
      <div className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-5">
        <span className="text-[22px] font-medium tabular-nums">{price(product.price)}</span>
        {saving > 0 && (
          <>
            <span className="text-[13px] text-court/45 line-through tabular-nums">
              {price(product.partsPrice!)}
            </span>
            <span className="bg-butter px-1.5 text-[11px] tabular-nums">
              {price(saving)} {t.saves}
            </span>
          </>
        )}
      </div>

      <BuyButton product={product} label={t.buy} />
    </article>
  );
}

function ShopIndex() {
  const { lang } = useLanguage();
  const t = SHOP[lang].strings;
  const bundles = PRODUCTS.filter((p) => p.kind === 'bundle');
  const singles = PRODUCTS.filter((p) => p.kind === 'single');

  return (
    <>
      <div className="px-5 pt-10 md:px-10 md:pt-16">
        <span className="label block text-court/45">{t.eyebrow}</span>
        <h1 className="display mt-3 text-[clamp(46px,11vw,124px)]">{t.title}</h1>
        <p className="mt-5 max-w-[52ch] text-court/70">{t.intro}</p>
      </div>

      <section className="px-5 pt-14 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-court pt-3">
          <h2 className="display text-[clamp(26px,4.4vw,44px)]">{t.bundlesTitle}</h2>
          <span className="label text-court/45">{t.bundlesNote}</span>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3 md:gap-6">
          {bundles.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="px-5 pt-16 md:px-10 md:pt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-court pt-3">
          <h2 className="display text-[clamp(26px,4.4vw,44px)]">{t.singlesTitle}</h2>
          <span className="label text-court/45">{t.singlesNote}</span>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3 md:gap-6">
          {singles.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-20 grid border-y border-court/15 px-5 md:grid-cols-3 md:px-10">
        {t.trust.map((item, i) => (
          <div
            key={item.title}
            className={`py-5 md:px-6 md:py-6 ${i === 0 ? 'md:pl-0' : ''} ${
              i < t.trust.length - 1 ? 'border-b border-court/10 md:border-b-0 md:border-r' : ''
            }`}
          >
            <b className="block font-medium">{item.title}</b>
            <span className="text-[13px] text-court/70">{item.body}</span>
          </div>
        ))}
      </section>
    </>
  );
}

function ProductDetail({ product }: { product: ShopProduct }) {
  const [qty, setQty] = useState(1);
  const { lang } = useLanguage();
  const t = SHOP[lang].strings;
  const copy = SHOP[lang].copy[product.slug];
  const price = usePrice();
  const addOn = product.crossSell ? productBySlug(product.crossSell) : undefined;
  const addOnCopy = addOn ? SHOP[lang].copy[addOn.slug] : undefined;

  return (
    <div className="grid gap-8 px-5 pb-24 pt-6 md:grid-cols-2 md:gap-14 md:px-10 md:pb-32 md:pt-10">
      <div>
        <ProductGallery
          images={product.gallery}
          name={copy.name}
          labels={{ counter: t.galleryLabel, previous: t.galleryPrev, next: t.galleryNext }}
        />
      </div>

      <div className="md:sticky md:top-8 md:self-start">
        <span className="label block text-court/45">
          {product.kind === 'bundle' ? t.bundlesTitle : t.singlesTitle}
        </span>
        <h1 className="display mt-2 text-[clamp(38px,6vw,72px)]">{copy.name}</h1>
        <p className="mt-4 max-w-[46ch] text-court/70">{copy.lede}</p>

        {copy.includes.length > 0 && (
          <>
            <h2 className="label mt-8 text-court/45">{t.includesLabel}</h2>
            <ul className="mt-3 list-none space-y-1.5 text-court/80">
              {copy.includes.map((item) => (
                <li key={item} className="flex items-baseline gap-2.5">
                  <span aria-hidden="true" className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-butter" />
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[30px] font-medium tabular-nums">{price(product.price)}</span>
          {product.partsPrice && (
            <span className="text-[14px] text-court/45 line-through tabular-nums">
              {price(product.partsPrice)} {t.separately}
            </span>
          )}
        </div>
        <p className="label mt-1 text-court/45">{t.vat}</p>

        {/* The quantity travels in the cart link itself, so Shopify receives it
            without us holding any cart state. */}
        <div className="mt-5 flex flex-wrap items-stretch gap-3">
          <div className="flex items-center border border-court">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label={t.quantityLess}
              className="px-4 py-3 transition-colors hover:bg-butter disabled:opacity-40"
              disabled={qty <= 1}
            >
              <span aria-hidden="true">&minus;</span>
            </button>
            <span className="label w-9 text-center tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label={t.quantityMore}
              className="px-4 py-3 transition-colors hover:bg-butter disabled:opacity-40"
              disabled={qty >= 10}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <a
            href={cartUrl(product, qty)}
            className="label flex-1 bg-butter px-6 py-4 text-center font-medium text-court transition-colors hover:bg-court hover:text-butter"
          >
            {t.buy}
          </a>
        </div>
        <p className="label mt-3 text-court/45">{t.shipping}</p>

        <ShopPanels panels={t.panels} />

        {/* Basic is the only bundle without the backpack, so it is the only
            place this offer is useful rather than noise. */}
        {addOn && addOnCopy && (
          <aside className="mt-12 border border-court/20 p-5">
            <h2 className="label text-court/45">{t.addOnTitle}</h2>
            <p className="mt-2 text-[13px] text-court/70">{t.addOnNote}</p>
            <div className="mt-4 flex items-center gap-4">
              <img
                src={sized(addOn.image, 200)}
                alt={addOnCopy.name}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-lg bg-court object-cover"
              />
              <div className="min-w-0">
                <a href={`/shop/${addOn.slug}`} className="display text-[22px] hover:bg-butter">
                  {addOnCopy.name}
                </a>
                <p className="tabular-nums text-court/70">{price(addOn.price)}</p>
              </div>
            </div>
            <a
              href={cartUrl(addOn)}
              className="label mt-4 block border border-court px-5 py-3 text-center font-medium transition-colors hover:bg-butter"
            >
              {t.buy}
            </a>
          </aside>
        )}
      </div>

      {/* The long read sits under both columns, because it is for the visitor
          who is still deciding rather than the one already reaching for the
          button. */}
      <div className="md:col-span-2">
        {copy.story && (
          <section className="mt-6 border-t-2 border-court pt-8 md:mt-10">
            <h2 className="display text-[clamp(26px,4vw,40px)]">{t.storyTitle}</h2>
            <div className="mt-5 max-w-[62ch] space-y-4 text-court/80">
              {copy.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            {copy.features && (
              <section>
                <h2 className="display text-[clamp(22px,3vw,32px)]">{t.featuresTitle}</h2>
                <ul className="mt-4 list-none border-t border-court/15">
                  {copy.features.map((item) => (
                    <li key={item} className="border-b border-court/10 py-3.5 text-court/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {copy.materials && copy.materials.length > 0 && (
              <section className="mt-12">
                <h2 className="display text-[clamp(22px,3vw,32px)]">{t.materialsTitle}</h2>
                <ul className="mt-4 list-none border-t border-court/15">
                  {copy.materials.map((item) => (
                    <li key={item} className="border-b border-court/10 py-3.5 text-court/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div>
            <h2 className="display text-[clamp(22px,3vw,32px)]">{t.detailsTitle}</h2>
            {copy.details.map((group) => (
              <section key={group.group} className="mt-6 first:mt-4">
                <h3 className="label text-court/45">{group.group}</h3>
                <ul className="mt-2 list-none border-t border-court/15">
                  {group.rows.map(([label, value]) => (
                    <li
                      key={label}
                      className="flex items-baseline justify-between gap-6 border-b border-court/10 py-3 text-[13px]"
                    >
                      <span className="text-court/60">{label}</span>
                      <span className="text-right font-medium">{value}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* Clubs, schools and events do not buy one court through a cart, so
            the page says so instead of pretending the button covers it. */}
        <aside className="mt-16 border-2 border-court p-6 md:p-8">
          <h2 className="display text-[clamp(22px,3vw,32px)]">{t.clubTitle}</h2>
          <p className="mt-3 max-w-[52ch] text-court/75">{t.clubBody}</p>
          <a
            href={`mailto:${SOCIAL.email}?subject=${encodeURIComponent(copy.name)}`}
            className="label mt-5 inline-block bg-butter px-6 py-3.5 font-medium text-court transition-colors hover:bg-court hover:text-butter"
          >
            {t.clubCta}
          </a>
        </aside>
      </div>
    </div>
  );
}


/**
 * Three line icons, inline rather than from a set. At 18px with a 1.5 stroke
 * they sit on the mono baseline without pulling attention from the yellow
 * button, which is the only thing on the page allowed to shout.
 */
const PANEL_ICONS: Record<number, JSX.Element> = {
  0: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
    </svg>
  ),
  1: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
      <circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 113.5 2.3c-.7.3-1 .9-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  ),
};

/**
 * Delivery, returns and how to ask a question. Open one at a time, because
 * these are answers a visitor looks up rather than reads through, and three
 * open blocks would push the rest of the page away.
 */
function ShopPanels({ panels }: { panels: ShopPanel[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mt-10 border-t border-court/15">
      {panels.map((panel, i) => {
        const isOpen = open === panel.title;
        return (
          <div key={panel.title} className="border-b border-court/15">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : panel.title)}
              aria-expanded={isOpen}
              className="label flex w-full items-center justify-between gap-4 py-4 text-left font-medium transition-colors hover:text-court/60"
            >
              <span className="flex items-center gap-3">
                {PANEL_ICONS[i]}
                {panel.title}
              </span>
              <span aria-hidden="true" className="text-lg leading-none">
                {isOpen ? '\u2212' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="max-w-[52ch] space-y-3 pb-5 text-[13px] text-court/75">
                {panel.body.map((line) => (
                  <p key={line.slice(0, 30)}>{line}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ShopPage({ slug }: { slug: string | null }) {
  const { lang } = useLanguage();
  const t = SHOP[lang].strings;
  const product = slug ? productBySlug(slug) : undefined;
  const copy = product ? SHOP[lang].copy[product.slug] : undefined;

  useEffect(() => {
    document.title = copy ? `${copy.name} — AIRBALL` : `${t.title} — AIRBALL`;

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previous = canonical?.href;
    if (canonical) {
      canonical.href = `https://airball.at/shop${product ? `/${product.slug}` : ''}`;
    }
    return () => {
      if (canonical && previous) canonical.href = previous;
    };
  }, [copy, t.title, product]);

  return (
    <CursorProvider>
      <div className="min-h-svh bg-cream text-court">
        <ShopHeader
          backHref={product ? '/shop' : '/'}
          backLabel={product ? t.backToShop : t.back}
        />
        <Breadcrumb product={product} />

        {product ? <ProductDetail product={product} /> : <ShopIndex />}

        <footer className="flex flex-wrap items-center justify-between gap-4 bg-court px-5 py-10 text-chalk md:px-10 md:py-12">
          <Wordmark className="text-xl" />
          <div className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-chalk/55">
            <a href="/imprint" className="transition-colors hover:bg-butter hover:text-court">
              Impressum
            </a>
            <span aria-hidden="true">·</span>
            <a href="/privacy" className="transition-colors hover:bg-butter hover:text-court">
              Datenschutz
            </a>
            <span aria-hidden="true">·</span>
            <span>Graz, Austria</span>
          </div>
        </footer>
      </div>
    </CursorProvider>
  );
}
