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
  /** Shown in the grid and as the link preview. */
  image: string;
  /**
   * The slideshow on the product page, in order. Mirrors the media order set
   * in Shopify, so rearranging there is the source of truth for what a buyer
   * sees first.
   */
  gallery: string[];
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
  galleryLabel: string;
  galleryPrev: string;
  galleryNext: string;
  soonTitle: string;
  soonBody: string;
  trust: { title: string; body: string }[];
}

/**
 * Photography lives on Shopify's CDN, so replacing a product photo there
 * updates the site without a deploy. That is the right owner for it: the photo
 * belongs to the product, and the product lives in Shopify.
 *
 * Named rather than pasted inline, because the same shot appears in several
 * galleries: the backpack render belongs to the backpack, to Pro and to
 * Premium. One name means one place to change it.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0953/7323/0461/files';
const PHOTO = {
  /** The court, three angles. */
  court1: `${CDN}/hf_20260815_162336_ade2755e-b35a-4094-9efe-1ee3c0af5e70_1.png?v=1786813717`,
  court2: `${CDN}/hf_20260815_170512_b2d0d18a-1bd2-49c3-b2cf-ff45dcf8fd42.png?v=1786813716`,
  court3: `${CDN}/hf_20260815_170703_361b528b-4143-4f2c-a777-8fbc2fe6b425.png?v=1786813741`,
  /** The backpack, three angles. */
  pack1: `${CDN}/hf_20260815_160501_91286c88-3d89-44e6-9bec-19886873b0be.png?v=1786813911`,
  pack2: `${CDN}/hf_20260815_160500_f13f15ad-a538-416b-93e8-8c231f6413dc.png?v=1786813910`,
  pack3: `${CDN}/hf_20260815_160501_5d76735f-ffb0-4e4d-ab1c-3d184bf9affc.png?v=1786813911`,
  pack4: `${CDN}/hf_20260815_160501_e3334243-4185-4fca-b25e-280747f785df.png?v=1786810065`,
  handPump: `${CDN}/hf_20260815_160501_d938763f-5fef-48f7-bb50-83e738f7def5.png?v=1786813966`,
  batteryPump: `${CDN}/hf_20260817_090844_2232aa45-657d-4d9b-9922-cd34691db486.png?v=1786957968`,
  /** Real games, so a buyer sees the thing in use and not only on white. */
  play1: `${CDN}/play-01.jpg?v=1786359791`,
  play2: `${CDN}/play-02.jpg?v=1786359791`,
  play3: `${CDN}/play-03.jpg?v=1786359791`,
} as const;

/*
 * Gallery order is the sales argument, so it is deliberate: what the buyer
 * gets as a whole, then each item on its own, then the thing in use. Someone
 * spending 300 euro on a court they have never seen wants to count the parts.
 *
 * TODO(shop): the group shot goes in front of every bundle gallery once it
 * exists, and each bundle needs its own featured image. Today all three share
 * the court render, so the grid shows three tiles that look identical in
 * exactly the row where a customer has to choose between them.
 */
export const PRODUCTS: ShopProduct[] = [
  {
    slug: 'basic',
    variantId: '58544190652797',
    price: 199.99,
    partsPrice: 214.0, // 199 court + 15 hand pump
    kind: 'bundle',
    image: PHOTO.court1,
    gallery: [PHOTO.court1, PHOTO.court2, PHOTO.court3, PHOTO.handPump, PHOTO.play2],
    crossSell: 'rucksack',
  },
  {
    slug: 'pro',
    variantId: '58544190783869',
    price: 249.99,
    partsPrice: 264.0, // 199 + 15 + 50 backpack
    kind: 'bundle',
    image: PHOTO.court1,
    gallery: [
      PHOTO.court1,
      PHOTO.court3,
      PHOTO.court2,
      PHOTO.pack2,
      PHOTO.pack1,
      PHOTO.pack4,
      PHOTO.handPump,
      PHOTO.play3,
    ],
    suggested: true,
  },
  {
    slug: 'premium',
    variantId: '58544190914941',
    price: 299.99,
    partsPrice: 313.99, // 199 + 15 + 50 + 49.99 battery pump
    kind: 'bundle',
    image: PHOTO.court1,
    gallery: [
      PHOTO.court1,
      PHOTO.court2,
      PHOTO.court3,
      PHOTO.pack1,
      PHOTO.pack2,
      PHOTO.pack3,
      PHOTO.handPump,
      PHOTO.batteryPump,
      PHOTO.play1,
    ],
  },
  {
    slug: 'airballer',
    variantId: '58516276248957',
    price: 199.0,
    kind: 'single',
    image: PHOTO.court1,
    gallery: [PHOTO.court1, PHOTO.court2, PHOTO.court3, PHOTO.play2, PHOTO.play3, PHOTO.play1],
  },
  {
    slug: 'rucksack',
    variantId: '58542242791805',
    price: 50.0,
    kind: 'single',
    image: PHOTO.pack1,
    gallery: [PHOTO.pack1, PHOTO.pack2, PHOTO.pack3],
  },
  {
    slug: 'handpumpe',
    variantId: '58542244397437',
    price: 15.0,
    kind: 'single',
    image: PHOTO.handPump,
    gallery: [PHOTO.handPump],
  },
  {
    slug: 'akkupumpe',
    variantId: '58546667356541',
    price: 49.99,
    kind: 'single',
    image: PHOTO.batteryPump,
    gallery: [PHOTO.batteryPump],
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
    galleryLabel: 'Bild {n} von {total}',
    galleryPrev: 'Vorheriges Bild',
    galleryNext: 'Nächstes Bild',
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
    akkupumpe: {
      name: 'Akkupumpe',
      lede: 'Aufladbar, mit Abschaltung beim eingestellten Druck. Der Court steht in etwa einer Minute, ohne dass jemand pumpt.',
      includes: [],
      specs: [
        ['Antrieb', 'Akku, aufladbar'],
        ['Aufbau', 'ca. 1 Minute'],
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
    galleryLabel: 'Image {n} of {total}',
    galleryPrev: 'Previous image',
    galleryNext: 'Next image',
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
    akkupumpe: {
      name: 'Battery pump',
      lede: 'Rechargeable, and it stops itself at the pressure you set. The court stands in about a minute, with nobody pumping.',
      includes: [],
      specs: [
        ['Power', 'rechargeable battery'],
        ['Setup', 'approx. 1 minute'],
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
