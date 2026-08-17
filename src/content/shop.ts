/**
 * SHOP CONTENT AND CATALOGUE.
 *
 * The shop follows the "our pages, Shopify's checkout" split. Everything a
 * visitor reads while deciding is here, in both languages. Everything that
 * involves money, stock, tax and delivery stays in Shopify, and the buy button
 * hands over to it.
 *
 * Prices and variant ids below were read from the connected Shopify store.
 * They are duplicated here on purpose for now: it keeps the shop fully static,
 * so it is as fast as the rest of the site and needs no API key in the bundle.
 * The cost is that a price change in Shopify has to be mirrored here. With six
 * products that is a fair trade; if the catalogue grows, replace this with a
 * build-time fetch from the Storefront API and keep the same shape.
 *
 * WHAT MUST STAY IN SYNC WITH SHOPIFY
 *  - `variantId`  wrong id means the wrong item lands in the cart
 *  - `price`      a mismatch means the cart shows a different number
 *  - `image`      lives on Shopify's CDN, so a photo swapped there follows
 *                 automatically without a deploy
 */

import type { Lang } from '@/content/site';

/**
 * The shop is off until this is true.
 *
 * It is not a feature flag for convenience, it is a legal stop. The imprint is
 * still a placeholder, and terms and the right of withdrawal do not exist yet.
 * A reachable buy button before those are in place is a real liability, so
 * while this is false `/shop` does not resolve at all and the navigation keeps
 * pointing at the waitlist.
 */
export const SHOP_LIVE = false;

/** Where the checkout lives. Also the host that serves the product images. */
export const SHOPIFY_DOMAIN = 'airball-8655.myshopify.com';

export interface ShopProduct {
  /** Our URL segment: /shop/<slug>. Independent of Shopify's handle. */
  slug: string;
  /** Shopify variant id. This is what the cart link carries. */
  variantId: string;
  /** Euro, gross. Must match Shopify or the cart contradicts the page. */
  price: number;
  /** Sum of the parts bought separately, where that comparison is honest. */
  partsPrice?: number;
  kind: 'bundle' | 'single';
  image: string;
  /** Marks one bundle as the suggested one. Never a sales claim. */
  suggested?: boolean;
  /**
   * Slug of a product offered alongside this one. Basic is the only bundle
   * without the backpack, so it is the only place the offer makes sense.
   */
  crossSell?: string;
}

export interface ShopProductCopy {
  name: string;
  /** One sentence under the name. Never ends with a period in a heading. */
  lede: string;
  /** What is in the box. Empty for single items. */
  includes: string[];
  specs: [string, string][];
}

export interface ShopStrings {
  navShop: string;
  eyebrow: string;
  title: string;
  intro: string;
  bundlesTitle: string;
  bundlesNote: string;
  singlesTitle: string;
  singlesNote: string;
  buy: string;
  suggested: string;
  saves: string;
  separately: string;
  inStock: string;
  vat: string;
  shipping: string;
  includesLabel: string;
  addOnTitle: string;
  addOnNote: string;
  back: string;
  backToShop: string;
  soonTitle: string;
  soonBody: string;
  trust: { title: string; body: string }[];
}

/**
 * Photography lives on Shopify's CDN, so replacing a product photo there
 * updates the site without a deploy. That is the right owner for it: the photo
 * belongs to the product, and the product lives in Shopify.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0953/7323/0461/files';
const PHOTO = {
  airballer: `${CDN}/hf_20260815_162336_ade2755e-b35a-4094-9efe-1ee3c0af5e70_1.png?v=1786813717`,
  rucksack: `${CDN}/hf_20260815_160501_91286c88-3d89-44e6-9bec-19886873b0be.png?v=1786813911`,
  handpumpe: `${CDN}/hf_20260815_160501_d938763f-5fef-48f7-bb50-83e738f7def5.png?v=1786813966`,
} as const;

/**
 * TODO(shop): the three bundles still point at the Airballer's own photo,
 * because that is what Shopify holds for them today. Three identical tiles is
 * exactly the row where a customer has to choose, so this needs one photo per
 * bundle before the shop goes live.
 */
export const PRODUCTS: ShopProduct[] = [
  {
    slug: 'basic',
    variantId: '58544190652797',
    price: 214.0,
    kind: 'bundle',
    image: PHOTO.airballer,
    crossSell: 'rucksack',
  },
  {
    slug: 'pro',
    variantId: '58544190783869',
    price: 249.99,
    // 199 + 15 + 50. Basic has no comparison because 199 + 15 is exactly 214.
    partsPrice: 264.0,
    kind: 'bundle',
    image: PHOTO.airballer,
    suggested: true,
  },
  {
    slug: 'premium',
    variantId: '58544190914941',
    price: 299.99,
    kind: 'bundle',
    image: PHOTO.airballer,
  },
  {
    slug: 'airballer',
    variantId: '58516276248957',
    price: 199.0,
    kind: 'single',
    image: PHOTO.airballer,
  },
  {
    slug: 'rucksack',
    variantId: '58542242791805',
    price: 50.0,
    kind: 'single',
    image: PHOTO.rucksack,
  },
  {
    slug: 'handpumpe',
    variantId: '58542244397437',
    price: 15.0,
    kind: 'single',
    image: PHOTO.handpumpe,
  },
];

const de: { strings: ShopStrings; copy: Record<string, ShopProductCopy> } = {
  strings: {
    navShop: 'Shop',
    eyebrow: 'Shop',
    title: 'Wähl dein Setup',
    intro:
      'Drei Wege auf den Court. Alle drei enthalten den Airballer. Der Unterschied ist, wie schnell er steht und wie du ihn trägst.',
    bundlesTitle: 'Bundles',
    bundlesNote: 'Preise inkl. USt.',
    singlesTitle: 'Einzeln',
    singlesNote: 'Nachkaufen und ergänzen',
    buy: 'In den Warenkorb',
    suggested: 'Empfohlen',
    saves: 'gespart',
    separately: 'einzeln',
    inStock: 'Auf Lager',
    vat: 'Inkl. 20% USt., zzgl. Versand',
    shipping: 'Versand nach Österreich, Deutschland, Schweiz und in die EU',
    includesLabel: 'Enthalten',
    addOnTitle: 'Passt dazu',
    addOnNote: 'Ohne Rucksack lassen sich Court und Pumpe schlecht tragen.',
    back: 'Zurück',
    backToShop: 'Zurück zum Shop',
    soonTitle: 'Bald zu haben',
    soonBody:
      'Der Shop öffnet zum Launch. Trag dich in die Warteliste ein, dann bekommst du eine Nachricht, sobald es losgeht.',
    trust: [
      { title: 'Versand aus Graz', body: 'In den DACH-Raum und in die EU.' },
      { title: '14 Tage Rückgabe', body: 'Ohne Begründung, unbenutzt zurück.' },
      { title: 'Erste Produktion', body: 'Begrenzte Stückzahl, danach Nachschub.' },
    ],
  },
  copy: {
    basic: {
      name: 'Airball Basic',
      lede: 'Der Einstieg. Court und Pumpe, mehr braucht ein Spiel nicht.',
      includes: ['The Airballer', 'Handpumpe'],
      specs: [
        ['Aufbau', 'unter 5 Minuten'],
        ['Format', '1v1 oder 2v2'],
        ['Packmaß', '70 x 20 x 20 cm'],
        ['Gewicht', 'ca. 6 kg'],
      ],
    },
    pro: {
      name: 'Airball Pro',
      lede: 'Alles aus Basic, dazu der Rucksack, damit der Court in einem Stück mitkommt.',
      includes: ['The Airballer', 'Handpumpe', 'Rucksack'],
      specs: [
        ['Aufbau', 'unter 5 Minuten'],
        ['Format', '1v1 oder 2v2'],
        ['Packmaß', '70 x 20 x 20 cm'],
        ['Gewicht', 'ca. 7 kg'],
      ],
    },
    premium: {
      name: 'Airball Premium',
      lede: 'Das komplette Paket. Mit Akkupumpe steht der Court in etwa einer Minute, ohne dass jemand pumpt.',
      includes: ['The Airballer', 'Handpumpe', 'Akkupumpe', 'Rucksack'],
      specs: [
        ['Aufbau', 'ca. 1 Minute'],
        ['Format', '1v1 oder 2v2'],
        ['Packmaß', '70 x 20 x 20 cm'],
        ['Gewicht', 'ca. 7 kg'],
      ],
    },
    airballer: {
      name: 'The Airballer',
      lede: 'Der tragbare Rebound-Court. Eine plane, druckstabile Fläche, aufgeblasen in Minuten, verstaut in einem Rucksack.',
      includes: [],
      specs: [
        ['Packmaß', '70 x 20 x 20 cm'],
        ['Gewicht', 'ca. 6 kg'],
        ['Format', '1v1 oder 2v2'],
      ],
    },
    rucksack: {
      name: 'Rucksack',
      lede: 'Court, Pumpe und dein Zeug in einem Stück tragbar, mit gepolsterten Trägern.',
      includes: [],
      specs: [
        ['Trägt', 'Court und Pumpe'],
        ['Träger', 'gepolstert'],
      ],
    },
    handpumpe: {
      name: 'Handpumpe',
      lede: 'Doppelhub, Schlauch und Ventiladapter. Der Court steht in Minuten, ohne Steckdose und ohne Werkzeug.',
      includes: [],
      specs: [
        ['Prinzip', 'Doppelhub'],
        ['Adapter', 'für alle Ventile'],
      ],
    },
  },
};

const en: { strings: ShopStrings; copy: Record<string, ShopProductCopy> } = {
  strings: {
    navShop: 'Shop',
    eyebrow: 'Shop',
    title: 'Pick your setup',
    intro:
      'Three ways onto the court. All three include the Airballer. What changes is how fast it stands up and how you carry it.',
    bundlesTitle: 'Bundles',
    bundlesNote: 'Prices include VAT',
    singlesTitle: 'Separately',
    singlesNote: 'Restock and add on',
    buy: 'Add to cart',
    suggested: 'Suggested',
    saves: 'saved',
    separately: 'separately',
    inStock: 'In stock',
    vat: 'Includes 20% VAT, plus shipping',
    shipping: 'Ships to Austria, Germany, Switzerland and the EU',
    includesLabel: 'In the box',
    addOnTitle: 'Goes with it',
    addOnNote: 'Without the backpack, the court and the pump are awkward to carry.',
    back: 'Back',
    backToShop: 'Back to the shop',
    soonTitle: 'Not open yet',
    soonBody:
      'The shop opens at launch. Join the waitlist and we will write the moment it does.',
    trust: [
      { title: 'Ships from Graz', body: 'Across Austria, Germany, Switzerland and the EU.' },
      { title: '14 day returns', body: 'No reason needed, unused.' },
      { title: 'First production run', body: 'Limited quantity, then a restock.' },
    ],
  },
  copy: {
    basic: {
      name: 'Airball Basic',
      lede: 'The way in. The court and the pump, which is all a game needs.',
      includes: ['The Airballer', 'Hand pump'],
      specs: [
        ['Setup', 'under 5 minutes'],
        ['Format', '1v1 or 2v2'],
        ['Packed size', '70 x 20 x 20 cm'],
        ['Weight', 'approx. 6 kg'],
      ],
    },
    pro: {
      name: 'Airball Pro',
      lede: 'Everything in Basic, plus the backpack, so the court travels in one piece.',
      includes: ['The Airballer', 'Hand pump', 'Backpack'],
      specs: [
        ['Setup', 'under 5 minutes'],
        ['Format', '1v1 or 2v2'],
        ['Packed size', '70 x 20 x 20 cm'],
        ['Weight', 'approx. 7 kg'],
      ],
    },
    premium: {
      name: 'Airball Premium',
      lede: 'The full kit. With the battery pump the court stands in about a minute, with nobody pumping.',
      includes: ['The Airballer', 'Hand pump', 'Battery pump', 'Backpack'],
      specs: [
        ['Setup', 'approx. 1 minute'],
        ['Format', '1v1 or 2v2'],
        ['Packed size', '70 x 20 x 20 cm'],
        ['Weight', 'approx. 7 kg'],
      ],
    },
    airballer: {
      name: 'The Airballer',
      lede: 'The portable rebound court. A flat, pressure-stable surface, inflated in minutes, packed into a backpack.',
      includes: [],
      specs: [
        ['Packed size', '70 x 20 x 20 cm'],
        ['Weight', 'approx. 6 kg'],
        ['Format', '1v1 or 2v2'],
      ],
    },
    rucksack: {
      name: 'Backpack',
      lede: 'Court, pump and your things in one carry, with padded straps.',
      includes: [],
      specs: [
        ['Carries', 'court and pump'],
        ['Straps', 'padded'],
      ],
    },
    handpumpe: {
      name: 'Hand pump',
      lede: 'Double action, hose and valve adapters. The court stands in minutes, with no socket and no tools.',
      includes: [],
      specs: [
        ['Action', 'double stroke'],
        ['Adapters', 'all valves'],
      ],
    },
  },
};

export const SHOP: Record<Lang, { strings: ShopStrings; copy: Record<string, ShopProductCopy> }> = {
  de,
  en,
};

export function productBySlug(slug: string): ShopProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/**
 * Hands the visitor to Shopify with the item already in the cart. This is the
 * whole integration: no cart state, no API key, nothing of ours to go wrong
 * between the click and the checkout.
 */
export function cartUrl(product: ShopProduct): string {
  return `https://${SHOPIFY_DOMAIN}/cart/${product.variantId}:1`;
}

/** `/shop` and `/shop/<slug>`, or null when the path is something else. */
export function shopRouteForPath(pathname: string): { slug: string | null } | null {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  if (clean === '/shop') return { slug: null };
  const match = clean.match(/^\/shop\/([a-z0-9-]+)$/);
  if (match && productBySlug(match[1])) return { slug: match[1] };
  return null;
}
