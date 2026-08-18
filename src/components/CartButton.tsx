import { SHOP } from '@/content/shop';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useCart } from '@/state/CartProvider';

/**
 * The cart icon, in both headers.
 *
 * The count is the whole point of it being visible at all: a basket someone
 * cannot see is a basket they forget they filled. It renders even when empty,
 * because an icon that appears out of nowhere on the first add is harder to
 * find than one that was always there.
 */
export default function CartButton({ className = '' }: { className?: string }) {
  const { lang } = useLanguage();
  const c = SHOP[lang].strings.cart;
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={cart.open}
      aria-label={c.open.replace('{n}', String(cart.count))}
      className={`relative transition-colors ${className}`}
    >
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {/* A tote, not a trolley: nobody wheels a court around a supermarket. */}
        <path
          d="M3.4 6.5h13.2l-1.1 10.2a1 1 0 0 1-1 .9H5.5a1 1 0 0 1-1-.9L3.4 6.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M7.2 8.6V5.4a2.8 2.8 0 0 1 5.6 0v3.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {cart.count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-1.5 min-w-[16px] rounded-full bg-butter px-1 text-center font-mono text-[10px] font-medium leading-[16px] text-court"
        >
          {cart.count}
        </span>
      )}
    </button>
  );
}
