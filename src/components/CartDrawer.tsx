import { useEffect, useRef } from 'react';
import { SHOP, cartUrl, sized } from '@/content/shop';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useCart } from '@/state/CartProvider';
import { useOverlayHistory } from '@/hooks/useOverlayHistory';
import { useScrollLock } from '@/hooks/useScrollLock';

/**
 * The cart, as a panel that slides in from the right.
 *
 * A drawer rather than a page because adding something should not cost the
 * visitor the product they were reading. It opens, shows what is in the
 * basket, and gets out of the way; the page underneath keeps its scroll
 * position and its place in the gallery.
 *
 * Everything below the list is one decision: how much, what is not included,
 * and the way out to the checkout. Shipping is deliberately not estimated
 * here. Shopify computes it from the address, and a number invented on this
 * side that the next screen contradicts is worse than no number.
 */
export default function CartDrawer() {
  const cart = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  const dismiss = useOverlayHistory(cart.isOpen, cart.close);

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cart.isOpen, dismiss]);

  // Move focus into the panel so the keyboard follows the eye, and so Escape
  // reaches the handler above without a click first.
  useEffect(() => {
    if (cart.isOpen) panelRef.current?.focus();
  }, [cart.isOpen]);

  if (!cart.isOpen) return null;
  return <Panel panelRef={panelRef} dismiss={dismiss} />;
}

/**
 * Split out so the scroll lock mounts and unmounts with the drawer. Calling
 * the hook in the component above would lock the page for the whole session.
 */
function Panel({
  panelRef,
  dismiss,
}: {
  panelRef: React.RefObject<HTMLDivElement>;
  dismiss: () => void;
}) {
  const { lang } = useLanguage();
  const t = SHOP[lang].strings;
  const c = t.cart;
  const cart = useCart();
  useScrollLock();

  const price = (value: number) =>
    new Intl.NumberFormat(lang === 'de' ? 'de-AT' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Clicking away is how most people close a drawer, so it is a real
          button rather than a decorative overlay. */}
      <button
        type="button"
        onClick={dismiss}
        aria-label={c.close}
        className="absolute inset-0 h-full w-full cursor-default bg-court/50 motion-safe:animate-fade-in"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col bg-cream shadow-2xl outline-none motion-safe:animate-slide-in-right"
      >
        <header className="flex items-center justify-between border-b border-court/12 px-5 py-5 md:px-6">
          <h2 className="display flex items-baseline gap-2 text-[26px]">
            {c.title}
            {cart.count > 0 && (
              <span className="label rounded-full bg-court px-2 py-1 text-[11px] tabular-nums text-cream">
                {cart.count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={dismiss}
            aria-label={c.close}
            className="label -mr-2 px-2 py-2 text-court/60 transition-colors hover:text-court"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-court/60">{c.empty}</p>
            <a
              href="/shop"
              onClick={dismiss}
              className="label border border-court px-5 py-3 transition-colors hover:bg-butter"
            >
              {c.emptyCta}
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
              {cart.lines.map(({ product, quantity }) => {
                const copy = SHOP[lang].copy[product.slug];
                return (
                  <li
                    key={product.slug}
                    className="flex gap-4 border-b border-court/10 py-4 first:pt-0 last:border-0"
                  >
                    <a href={`/shop/${product.slug}`} onClick={dismiss} className="shrink-0">
                      <img
                        src={sized(product.image, 200)}
                        alt=""
                        className="h-[86px] w-[70px] rounded-md bg-court object-cover"
                      />
                    </a>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <a
                          href={`/shop/${product.slug}`}
                          onClick={dismiss}
                          className="display text-[19px] leading-tight hover:bg-butter"
                        >
                          {copy.name}
                        </a>
                        <span className="tabular-nums text-[15px]">
                          {price(product.price * quantity)}
                        </span>
                      </div>
                      {/* The line total is what people check, so the unit price
                          is only worth showing once it differs from it. */}
                      {quantity > 1 && (
                        <p className="mt-0.5 text-[13px] tabular-nums text-court/50">
                          {price(product.price)}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="label flex items-center border border-court/25">
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(product.slug, quantity - 1)}
                            aria-label={c.less}
                            className="px-3 py-2 transition-colors hover:bg-butter"
                          >
                            &#8722;
                          </button>
                          <span className="min-w-[2ch] px-1 text-center tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(product.slug, quantity + 1)}
                            aria-label={c.more}
                            className="px-3 py-2 transition-colors hover:bg-butter"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(product.slug)}
                          className="label text-[11px] text-court/45 underline-offset-4 transition-colors hover:text-court hover:underline"
                        >
                          {c.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-court/12 px-5 pb-6 pt-5 md:px-6">
              <div className="flex items-baseline justify-between">
                <span className="label text-court/60">{c.subtotal}</span>
                <span className="display text-[26px] tabular-nums">{price(cart.subtotal)}</span>
              </div>
              <p className="mt-1.5 text-[12px] text-court/55">{c.note}</p>
              <a
                href={cartUrl(cart.lines)}
                className="label mt-4 block bg-butter px-6 py-4 text-center font-medium text-court transition-colors hover:bg-court hover:text-butter"
              >
                {c.checkout}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
