import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MAX_QTY, PRODUCTS, isForSale, productBySlug, type ShopProduct } from '@/content/shop';

/**
 * THE CART.
 *
 * It lives here and nowhere else until the moment of payment, when the whole
 * basket is spent as one Shopify permalink. That keeps the split the rest of
 * the shop is built on: our pages hold everything a visitor reads and decides,
 * Shopify holds everything involving money. No API key in the bundle, no cart
 * API to be down, nothing of ours between the click and the checkout.
 *
 * WHAT IS STORED, AND WHY IT NEEDS NO CONSENT
 * Slugs and quantities, in localStorage. This is the textbook case of storage
 * that is strictly necessary for a service the visitor explicitly asked for,
 * so it falls outside the consent requirement in the same way a session for a
 * logged-in user does. It holds nothing about who the visitor is, it is not
 * read by anyone else, and it never leaves the browser until they choose to
 * check out. The cookieless promise the rest of the site keeps is about
 * tracking, and a basket is not tracking.
 */

const KEY = 'airball.cart';

export interface CartLine {
  product: ShopProduct;
  quantity: number;
}

interface CartValue {
  lines: CartLine[];
  /** Total number of items, which is what the badge shows. */
  count: number;
  subtotal: number;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartValue | null>(null);

/** Slug and quantity are all that is worth persisting; the rest is derived. */
type Stored = { slug: string; quantity: number }[];

/**
 * Reads the basket back.
 *
 * Everything here is hostile input, because localStorage survives deploys:
 * a slug can have been renamed, a product withdrawn from sale, a quantity
 * edited by hand in devtools. Anything that does not resolve to a product on
 * sale is dropped rather than repaired, so a stale basket can never put an
 * item into the checkout that the shop does not sell.
 */
function load(): Stored {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry): Stored => {
      if (typeof entry !== 'object' || entry === null) return [];
      const { slug, quantity } = entry as Record<string, unknown>;
      if (typeof slug !== 'string' || typeof quantity !== 'number') return [];
      const product = productBySlug(slug);
      if (!product || !isForSale(product)) return [];
      const q = Math.min(Math.max(Math.round(quantity), 1), MAX_QTY);
      return [{ slug, quantity: q }];
    });
  } catch {
    // Private mode can refuse localStorage outright. A cart that forgets is
    // far better than a shop that throws on load.
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(stored));
    } catch {
      // Full or refused. The cart still works for this visit.
    }
  }, [stored]);

  /*
   * A second tab is the same basket. Without this, adding something in one tab
   * and checking out in the other silently drops it.
   */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setStored(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((slug: string, quantity = 1) => {
    const product = productBySlug(slug);
    if (!product || !isForSale(product)) return;
    setStored((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (!existing) return [...prev, { slug, quantity: Math.min(quantity, MAX_QTY) }];
      return prev.map((l) =>
        l.slug === slug ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_QTY) } : l,
      );
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    // Stepping below one removes the line, which is what the minus button at
    // quantity one should obviously do.
    if (quantity < 1) {
      setStored((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    setStored((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(quantity, MAX_QTY) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setStored((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const value = useMemo<CartValue>(() => {
    // Kept in catalogue order rather than the order things were added, so the
    // basket reads the same way the shop does.
    const lines = PRODUCTS.flatMap((product) => {
      const line = stored.find((l) => l.slug === product.slug);
      return line ? [{ product, quantity: line.quantity }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
      add,
      setQuantity,
      remove,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [stored, isOpen, add, setQuantity, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart outside CartProvider');
  return value;
}
