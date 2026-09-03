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
 *
 * Photography comes from two places, see PHOTO below.
 */

import type { Lang } from '@/content/site';
import { OUR_PHOTOS, OUR_WIDTHS, type OurPhoto } from '@/content/shop-photos';

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

/**
 * Where the shop actually is, and whether it can take money.
 *
 * The shop is a Shopify storefront on its own subdomain, running the AIRBALL
 * theme, so it looks like this site and behaves like a shop. This site links
 * out to it rather than rebuilding it.
 *
 * These are deliberately separate from SHOP_LIVE above, which asks a different
 * and by now older question: whether the React shop in this repo answers at
 * /shop. Shopify took that job, so that one stays false while this one is
 * true. Merging them would mean the nav could only point at the Shopify shop
 * by also switching a route back on that nothing maintains.
 */
export const SHOP_URL = 'https://shop.airball.at';
export const SHOP_OPEN = true;

/**
 * Whether the single items are for sale.
 *
 * At launch only the three bundles are. Everyone buying is buying their first
 * court, and a row of spare parts next to that decision is noise: nobody needs
 * a second pump before they own a first one. The parts stay in the catalogue
 * because they are real products with real prices and they will be sold later,
 * probably once there are customers who already have a court.
 *
 * Setting this to true brings back the singles section, their product pages
 * and the backpack offered alongside Basic, with nothing else to change.
 */
export const SELL_SINGLES = false;

/** Is this product buyable right now? */
export function isForSale(product: ShopProduct): boolean {
  return SELL_SINGLES || product.kind === 'bundle';
}

/** Where the checkout lives. Also the host that serves the renders and the
 * game photography, see PHOTO. */
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
   * The slideshow on the product page, in order. This list is the source of
   * truth for what a buyer sees first, not Shopify's media order: the two
   * storefronts sell to different people and want a different opening frame.
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
  /**
   * The longer read, further down the page. A rebound court that folds into a
   * backpack is not a category anyone knows, so the page has to explain the
   * thing before it can sell it.
   */
  story?: string[];
  /** One claim per line, scannable. */
  features?: string[];
  /**
   * What it is physically made of. Left empty until the supplier confirms it:
   * material claims on a physical product are a promise, not marketing.
   */
  materials?: string[];
  /** Grouped so measurements, play and contents do not run into one column. */
  details: { group: string; rows: [string, string][] }[];
}

/** The three questions that block a purchase, answered in place. */
export interface ShopPanel {
  title: string;
  body: string[];
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
  storyTitle: string;
  featuresTitle: string;
  materialsTitle: string;
  detailsTitle: string;
  quantity: string;
  quantityLess: string;
  quantityMore: string;
  panels: ShopPanel[];
  home: string;
  /** Clubs, schools and events buy differently from one person. */
  clubTitle: string;
  clubBody: string;
  clubCta: string;
  soonTitle: string;
  soonBody: string;
  trust: { title: string; body: string }[];
  cart: ShopCartStrings;
}

/** The drawer. Small surface, but every label is on the path to a payment. */
export interface ShopCartStrings {
  /** The icon's accessible name. Carries the count, since the badge is visual. */
  open: string;
  title: string;
  close: string;
  empty: string;
  emptyCta: string;
  /** Never "total": shipping is added at the checkout, so this is a subtotal. */
  subtotal: string;
  note: string;
  checkout: string;
  remove: string;
  less: string;
  more: string;
  added: string;
}

/**
 * Every photo in the shop, named once.
 *
 * Named rather than pasted inline, because the same shot appears in several
 * galleries: the backpack belongs to the backpack, to Pro and to Premium. One
 * name means one place to change it.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0953/7323/0461/files';

/**
 * Names one of our own photos. Not a URL: `sized()` resolves it against the
 * generated manifest, which holds one real path per width. The prefix is what
 * tells the two sources apart, and naming a photo that was never generated is
 * a compile error rather than a 404.
 *
 * Everything under /media/shop is already cropped to 4:5, the ratio every
 * frame in the shop uses.
 */
const OURS = 'ours:';
const ours = (name: OurPhoto) => `${OURS}${name}`;

const PHOTO = {
  /*
   * The product shot, ours. These are the studio masters, cropped and
   * compressed at build time rather than resized by Shopify. Two reasons: the
   * group shot does not exist in Shopify at all, and a photo we ship with the
   * site is one fewer host between a buyer and the picture that sells them the
   * thing. The cost is that swapping one needs a deploy.
   */
  group: ours('group-premium'),
  courtFront: ours('court-front'),
  courtSide: ours('court-side'),
  packSide: ours('pack-side'),
  packUpright: ours('pack-upright'),
  packLogo: ours('pack-logo'),
  handPump: ours('hand-pump'),
  batteryPump: ours('battery-pump'),

  /*
   * Renders and game photography, still on Shopify's CDN, which resizes on
   * request. The court renders are extra angles behind the real photographs;
   * the game shots are the only frames with people in them.
   */
  courtRender1: `${CDN}/hf_20260815_162336_ade2755e-b35a-4094-9efe-1ee3c0af5e70_1.png?v=1786813717`,
  courtRender2: `${CDN}/hf_20260815_170512_b2d0d18a-1bd2-49c3-b2cf-ff45dcf8fd42.png?v=1786813716`,
  courtRender3: `${CDN}/hf_20260815_170703_361b528b-4143-4f2c-a777-8fbc2fe6b425.png?v=1786813741`,
  play1: `${CDN}/play-01.jpg?v=1786359791`,
  play2: `${CDN}/play-02.jpg?v=1786359791`,
  play3: `${CDN}/play-03.jpg?v=1786359791`,
} as const;

/*
 * Gallery order is the sales argument, so it is deliberate: what the buyer
 * gets as a whole, then each item on its own, then the thing in use. Someone
 * spending 300 euro on a court they have never seen wants to count the parts.
 *
 * Photographs come before renders everywhere. A render of an inflatable court
 * reads as a concept drawing, which is the last thing a new category needs.
 *
 * TODO(shop): Basic and Pro have no group shot of their own, so their tiles
 * lead with the court instead of with everything in the box. Premium's exists
 * and does the job the other two are missing. What is needed is one frame per
 * bundle: Basic = court + hand pump, Pro = court + hand pump + backpack.
 */
export const PRODUCTS: ShopProduct[] = [
  {
    slug: 'basic',
    variantId: '58544190652797',
    price: 199.99,
    partsPrice: 214.0, // 199 court + 15 hand pump
    kind: 'bundle',
    image: PHOTO.courtFront,
    gallery: [
      PHOTO.courtFront,
      PHOTO.courtSide,
      PHOTO.handPump,
      PHOTO.courtRender1,
      PHOTO.play2,
    ],
    crossSell: 'rucksack',
  },
  {
    slug: 'pro',
    variantId: '58544190783869',
    price: 249.99,
    partsPrice: 264.0, // 199 + 15 + 50 backpack
    kind: 'bundle',
    image: PHOTO.courtSide,
    gallery: [
      PHOTO.courtSide,
      PHOTO.courtFront,
      PHOTO.packSide,
      PHOTO.packUpright,
      PHOTO.handPump,
      PHOTO.packLogo,
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
    // The one bundle photographed as a whole: court, backpack and both pumps
    // in a single frame, which is exactly what is in the box.
    image: PHOTO.group,
    gallery: [
      PHOTO.group,
      PHOTO.courtFront,
      PHOTO.courtSide,
      PHOTO.packSide,
      PHOTO.packUpright,
      PHOTO.batteryPump,
      PHOTO.handPump,
      PHOTO.packLogo,
      PHOTO.play1,
    ],
  },
  {
    slug: 'airballer',
    variantId: '58516276248957',
    price: 199.0,
    kind: 'single',
    image: PHOTO.courtFront,
    // The court on its own is the one page where the extra render angles earn
    // their place: there is nothing else in the box to show.
    gallery: [
      PHOTO.courtFront,
      PHOTO.courtSide,
      PHOTO.courtRender1,
      PHOTO.courtRender2,
      PHOTO.courtRender3,
      PHOTO.play2,
      PHOTO.play3,
    ],
  },
  {
    slug: 'rucksack',
    variantId: '58542242791805',
    price: 50.0,
    kind: 'single',
    image: PHOTO.packSide,
    gallery: [PHOTO.packSide, PHOTO.packUpright, PHOTO.packLogo],
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
    storyTitle: 'Zum Produkt',
    featuresTitle: 'Was es kann',
    materialsTitle: 'Material',
    detailsTitle: 'Details',
    quantity: 'Menge',
    quantityLess: 'Menge verringern',
    quantityMore: 'Menge erhöhen',
    home: 'Start',
    clubTitle: 'Für Verein, Schule oder Event',
    clubBody:
      'Mehrere Courts, eigenes Branding oder ein Turnier: dafür gibt es keinen Knopf im Shop. Schreib uns, was du vorhast, und wir rechnen es dir.',
    clubCta: 'Anfrage schreiben',
    panels: [
      {
        title: 'Lieferung',
        body: [
          // TODO(shop): echte Laufzeiten und Versandkosten eintragen, sobald
          // die Zonen in Shopify stehen. Lieferzeit ist Pflichtangabe.
          'Versand aus Graz nach Österreich, Deutschland, die Schweiz und in die EU.',
          'Die Schweiz ist Drittland, dort kommen Zoll und Einfuhrumsatzsteuer dazu.',
        ],
      },
      {
        title: 'Rückgabe und Gewährleistung',
        body: [
          'Du kannst innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Die Ware muss unbenutzt und vollständig zurückkommen.',
          'Zusätzlich gilt die gesetzliche Gewährleistung von zwei Jahren.',
        ],
      },
      {
        title: 'Fragen zum Produkt',
        body: [
          'Schreib an info@airball.at. Wir antworten, auch auf die Fragen, die vor dem Kauf kommen.',
        ],
      },
    ],
    soonTitle: 'Bald zu haben',
    soonBody:
      'Der Shop öffnet zum Launch. Trag dich in die Warteliste ein, dann bekommst du eine Nachricht, sobald es losgeht.',
    trust: [
      { title: 'Versand aus Graz', body: 'In den DACH-Raum und in die EU.' },
      { title: '14 Tage Rückgabe', body: 'Ohne Begründung, unbenutzt zurück.' },
      { title: 'Erste Produktion', body: 'Begrenzte Stückzahl, danach Nachschub.' },
    ],
    cart: {
      open: 'Warenkorb, {n} Artikel',
      title: 'Warenkorb',
      close: 'Warenkorb schließen',
      empty: 'Noch nichts drin.',
      emptyCta: 'Setups ansehen',
      subtotal: 'Zwischensumme',
      note: 'Inkl. 20% MwSt. Versand wird an der Kasse berechnet.',
      checkout: 'Zur Kasse',
      remove: 'Entfernen',
      less: 'Weniger',
      more: 'Mehr',
      added: 'In den Warenkorb gelegt',
    },
  },
  copy: {
    basic: {
      name: 'Airball Basic',
      lede: 'Der Einstieg. Court und Pumpe, mehr braucht ein Spiel nicht.',
      includes: ['The Airballer', 'Handpumpe'],
      story: [
        'Ausrollen, aufpumpen, spielen. Der Airballer ist ein aufblasbarer Rebound-Court mit 100 cm Durchmesser: hinlegen, und die Arena steht. Keine Linien ziehen, kein Netz spannen, kein Tor schleppen.',
        'Basic ist die kleinste Zusammenstellung, mit der sich sofort spielen lässt. Court und Handpumpe, sonst nichts. Wer den Court oft mitnimmt, greift eher zu Pro, weil dort der Rucksack dabei ist.',
      ],
      features: [
        'Aufbau in Minuten, ohne Werkzeug und ohne Steckdose',
        'Auf jedem ebenen Untergrund: Wiese, Sand, Hallenboden, Dachterrasse',
        'Für 1v1 und 2v2',
        'Pumpe ist dabei',
      ],
      details: [
        { group: 'Maße', rows: [['Court', 'Ø 100 cm, aufblasbar'], ['Packmaß', '70 x 20 x 20 cm'], ['Gewicht', 'ca. 6 kg']] },
        { group: 'Spiel', rows: [['Format', '1v1 oder 2v2'], ['Aufbau', 'unter 5 Minuten']] },
        { group: 'Lieferumfang', rows: [['Enthalten', 'Court, Handpumpe']] },
      ],
    },
    pro: {
      name: 'Airball Pro',
      lede: 'Alles aus Basic, dazu der Rucksack, damit der Court in einem Stück mitkommt.',
      includes: ['The Airballer', 'Handpumpe', 'Rucksack'],
      story: [
        'Der Unterschied zu Basic ist nicht das Spiel, sondern der Weg dorthin. Court, Pumpe und dein Zeug wandern in einen gepolsterten Rucksack, und der Court fährt mit dem Rad, in der Bahn oder zu Fuß mit.',
        'Das ist die Zusammenstellung für alle, die nicht immer am selben Platz spielen.',
      ],
      features: [
        'Alles in einem Stück tragbar',
        'Aufbau in Minuten, ohne Werkzeug und ohne Steckdose',
        'Auf jedem ebenen Untergrund',
        'Für 1v1 und 2v2',
      ],
      details: [
        { group: 'Maße', rows: [['Court', 'Ø 100 cm, aufblasbar'], ['Packmaß', '70 x 20 x 20 cm'], ['Gewicht', 'ca. 7 kg']] },
        { group: 'Spiel', rows: [['Format', '1v1 oder 2v2'], ['Aufbau', 'unter 5 Minuten']] },
        { group: 'Lieferumfang', rows: [['Enthalten', 'Court, Handpumpe, Rucksack']] },
      ],
    },
    premium: {
      name: 'Airball Premium',
      lede: 'Das komplette Paket. Mit Akkupumpe steht der Court in etwa einer Minute, ohne dass jemand pumpt.',
      includes: ['The Airballer', 'Handpumpe', 'Akkupumpe', 'Rucksack'],
      story: [
        'Die Akkupumpe ist der eigentliche Grund für Premium. Sie schaltet beim eingestellten Druck selbst ab, der Court steht in etwa einer Minute, und niemand steht daneben und pumpt.',
        'Die Handpumpe bleibt trotzdem dabei. Ein Akku ist irgendwann leer, ein Court sollte deswegen nicht ausfallen.',
      ],
      features: [
        'Aufbau in etwa einer Minute',
        'Handpumpe als Rückfallebene dabei',
        'Alles in einem Stück tragbar',
        'Für 1v1 und 2v2',
      ],
      details: [
        { group: 'Maße', rows: [['Court', 'Ø 100 cm, aufblasbar'], ['Packmaß', '70 x 20 x 20 cm'], ['Gewicht', 'ca. 7 kg']] },
        { group: 'Spiel', rows: [['Format', '1v1 oder 2v2'], ['Aufbau', 'ca. 1 Minute']] },
        { group: 'Lieferumfang', rows: [['Enthalten', 'Court, Handpumpe, Akkupumpe, Rucksack']] },
      ],
    },
    airballer: {
      name: 'The Airballer',
      lede: 'Der tragbare Rebound-Court. Hinlegen, aufpumpen, und die Arena steht.',
      includes: [],
      story: [
        'Ein aufblasbarer Rebound-Court mit 100 cm Durchmesser. Der Ball wird darauf gespielt, springt ab, und der Gegner ist dran. Bis zu drei Kontakte, dann muss er zurück.',
        'Gebaut zum Draufhauen, Drüberhechten und Durchspielen. Wiese, Sand, Hallenboden, Dachterrasse: worauf du stehen kannst, darauf kannst du spielen, solange es eben ist.',
      ],
      features: [
        'Aufblasbar, Ø 100 cm',
        'Aufbau in Minuten, ohne Werkzeug',
        'Auf jedem ebenen Untergrund',
        'Passt in einen Rucksack',
      ],
      details: [
        { group: 'Maße', rows: [['Court', 'Ø 100 cm, aufblasbar'], ['Packmaß', '70 x 20 x 20 cm'], ['Gewicht', 'ca. 6 kg']] },
        { group: 'Spiel', rows: [['Format', '1v1 oder 2v2'], ['Kontakte', 'bis zu drei']] },
      ],
    },
    rucksack: {
      name: 'Rucksack',
      lede: 'Court, Pumpe und dein Zeug in einem Stück tragbar.',
      includes: [],
      features: ['Trägt Court und Pumpe', 'Gepolsterte Träger', 'Airball-Branding'],
      details: [{ group: 'Details', rows: [['Fasst', 'Court und Pumpe'], ['Träger', 'gepolstert']] }],
    },
    handpumpe: {
      name: 'Handpumpe',
      lede: 'Doppelhub, Schlauch und Ventiladapter. Ohne Steckdose, ohne Werkzeug.',
      includes: [],
      features: ['Doppelhub, also Luft in beide Richtungen', 'Adapter für alle Ventile', 'Braucht keinen Strom'],
      details: [{ group: 'Details', rows: [['Prinzip', 'Doppelhub'], ['Adapter', 'für alle Ventile']] }],
    },
    akkupumpe: {
      name: 'Akkupumpe',
      lede: 'Aufladbar, schaltet beim eingestellten Druck selbst ab.',
      includes: [],
      features: ['Aufbau in etwa einer Minute', 'Abschaltung beim eingestellten Druck', 'Aufladbar'],
      details: [{ group: 'Details', rows: [['Antrieb', 'Akku, aufladbar'], ['Aufbau', 'ca. 1 Minute']] }],
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
    storyTitle: 'About it',
    featuresTitle: 'What it does',
    materialsTitle: 'Materials',
    detailsTitle: 'Details',
    quantity: 'Quantity',
    quantityLess: 'Decrease quantity',
    quantityMore: 'Increase quantity',
    home: 'Home',
    clubTitle: 'For a club, a school or an event',
    clubBody:
      'Several courts, your own branding, or a tournament: there is no button in the shop for that. Tell us what you have in mind and we will price it.',
    clubCta: 'Send an enquiry',
    panels: [
      {
        title: 'Delivery',
        body: [
          'Ships from Graz to Austria, Germany, Switzerland and the EU.',
          'Switzerland is outside the EU customs area, so duty and import VAT apply there.',
        ],
      },
      {
        title: 'Returns and warranty',
        body: [
          'You can withdraw within 14 days without giving a reason. The item has to come back unused and complete.',
          'The statutory two year warranty applies on top of that.',
        ],
      },
      {
        title: 'Questions about the product',
        body: ['Write to info@airball.at. We answer, including the questions that come before a purchase.'],
      },
    ],
    soonTitle: 'Not open yet',
    soonBody:
      'The shop opens at launch. Join the waitlist and we will write the moment it does.',
    trust: [
      { title: 'Ships from Graz', body: 'Across Austria, Germany, Switzerland and the EU.' },
      { title: '14 day returns', body: 'No reason needed, unused.' },
      { title: 'First production run', body: 'Limited quantity, then a restock.' },
    ],
    cart: {
      open: 'Cart, {n} items',
      title: 'Cart',
      close: 'Close the cart',
      empty: 'Nothing in here yet.',
      emptyCta: 'See the setups',
      subtotal: 'Subtotal',
      note: 'Includes 20% VAT. Shipping is calculated at the checkout.',
      checkout: 'Check out',
      remove: 'Remove',
      less: 'Fewer',
      more: 'More',
      added: 'Added to the cart',
    },
  },
  copy: {
    basic: {
      name: 'Airball Basic',
      lede: 'The way in. The court and the pump, which is all a game needs.',
      includes: ['The Airballer', 'Hand pump'],
      story: [
        'Unroll it, pump it up, play. The Airballer is an inflatable rebound court, 100 cm across: put it down and the arena is there. No lines to mark, no net to string, no goal to carry.',
        'Basic is the smallest set you can play with straight away. Court and hand pump, nothing else. If you plan to take it places often, Pro is the one, because the backpack comes with it.',
      ],
      features: [
        'Set up in minutes, with no tools and no socket',
        'Any flat ground: grass, sand, a gym floor, a roof terrace',
        'For 1v1 and 2v2',
        'Pump included',
      ],
      details: [
        { group: 'Measurements', rows: [['Court', '100 cm across, inflatable'], ['Packed size', '70 x 20 x 20 cm'], ['Weight', 'approx. 6 kg']] },
        { group: 'Play', rows: [['Format', '1v1 or 2v2'], ['Setup', 'under 5 minutes']] },
        { group: 'In the box', rows: [['Included', 'Court, hand pump']] },
      ],
    },
    pro: {
      name: 'Airball Pro',
      lede: 'Everything in Basic, plus the backpack, so the court travels in one piece.',
      includes: ['The Airballer', 'Hand pump', 'Backpack'],
      story: [
        'What separates Pro from Basic is not the game, it is the journey to it. Court, pump and your things go into one padded backpack, and the court comes along by bike, on the train or on foot.',
        'This is the set for anyone who does not always play in the same place.',
      ],
      features: [
        'Carries in one piece',
        'Set up in minutes, with no tools and no socket',
        'Any flat ground',
        'For 1v1 and 2v2',
      ],
      details: [
        { group: 'Measurements', rows: [['Court', '100 cm across, inflatable'], ['Packed size', '70 x 20 x 20 cm'], ['Weight', 'approx. 7 kg']] },
        { group: 'Play', rows: [['Format', '1v1 or 2v2'], ['Setup', 'under 5 minutes']] },
        { group: 'In the box', rows: [['Included', 'Court, hand pump, backpack']] },
      ],
    },
    premium: {
      name: 'Airball Premium',
      lede: 'The full kit. With the battery pump the court stands in about a minute, with nobody pumping.',
      includes: ['The Airballer', 'Hand pump', 'Battery pump', 'Backpack'],
      story: [
        'The battery pump is the actual reason for Premium. It stops itself at the pressure you set, the court stands in about a minute, and nobody is standing there pumping.',
        'The hand pump still comes with it. A battery runs flat eventually, and a court should not be cancelled because of that.',
      ],
      features: [
        'Standing in about a minute',
        'Hand pump included as a fallback',
        'Carries in one piece',
        'For 1v1 and 2v2',
      ],
      details: [
        { group: 'Measurements', rows: [['Court', '100 cm across, inflatable'], ['Packed size', '70 x 20 x 20 cm'], ['Weight', 'approx. 7 kg']] },
        { group: 'Play', rows: [['Format', '1v1 or 2v2'], ['Setup', 'approx. 1 minute']] },
        { group: 'In the box', rows: [['Included', 'Court, hand pump, battery pump, backpack']] },
      ],
    },
    airballer: {
      name: 'The Airballer',
      lede: 'The portable rebound court. Put it down, pump it up, and the arena is there.',
      includes: [],
      story: [
        'An inflatable rebound court, 100 cm across. The ball is played onto it, bounces off, and it is the opponent\'s turn. Up to three touches, then it has to go back.',
        'Built to be hit, dived over and played through. Grass, sand, a gym floor, a roof terrace: if you can stand on it you can play on it, as long as it is flat.',
      ],
      features: [
        'Inflatable, 100 cm across',
        'Set up in minutes, with no tools',
        'Any flat ground',
        'Packs into a backpack',
      ],
      details: [
        { group: 'Measurements', rows: [['Court', '100 cm across, inflatable'], ['Packed size', '70 x 20 x 20 cm'], ['Weight', 'approx. 6 kg']] },
        { group: 'Play', rows: [['Format', '1v1 or 2v2'], ['Touches', 'up to three']] },
      ],
    },
    rucksack: {
      name: 'Backpack',
      lede: 'Court, pump and your things, carried in one piece.',
      includes: [],
      features: ['Carries the court and the pump', 'Padded straps', 'Airball branding'],
      details: [{ group: 'Details', rows: [['Fits', 'court and pump'], ['Straps', 'padded']] }],
    },
    handpumpe: {
      name: 'Hand pump',
      lede: 'Double action, hose and valve adapters. No socket, no tools.',
      includes: [],
      features: ['Double action, so air moves both ways', 'Adapters for every valve', 'Needs no power'],
      details: [{ group: 'Details', rows: [['Action', 'double stroke'], ['Adapters', 'all valves']] }],
    },
    akkupumpe: {
      name: 'Battery pump',
      lede: 'Rechargeable, and it stops itself at the pressure you set.',
      includes: [],
      features: ['Standing in about a minute', 'Stops at the set pressure', 'Rechargeable'],
      details: [{ group: 'Details', rows: [['Power', 'rechargeable battery'], ['Setup', 'approx. 1 minute']] }],
    },
  },
};

export const SHOP: Record<Lang, { strings: ShopStrings; copy: Record<string, ShopProductCopy> }> = {
  de,
  en,
};

/** Our own photos, or null for anything on Shopify's CDN. */
function ourFrames(url: string) {
  return url.startsWith(OURS) ? OUR_PHOTOS[url.slice(OURS.length) as OurPhoto] : null;
}

/**
 * The masters are up to 2048px square. Shown at roughly 600px that is several
 * megabytes for nothing, and a gallery holds up to nine of them, so every
 * `<img>` asks for the size it will actually be drawn at.
 *
 * Two sources, two spellings. Shopify takes a query parameter and resizes to
 * any width. Ours are one file per width, so the request is rounded up to the
 * nearest rung that exists: rounding down would upscale, which is visible on
 * the logo lettering.
 */
export function sized(url: string, width: number): string {
  const frames = ourFrames(url);
  if (!frames) return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
  return frames[OUR_WIDTHS.find((w) => w >= width) ?? OUR_WIDTHS[OUR_WIDTHS.length - 1]];
}

/**
 * Widths a browser can choose from, for the one large image on screen.
 *
 * For our own files the requested widths are ignored in favour of the rungs
 * that exist. The descriptor has to be the file's true width or the browser
 * chooses by a number that is not real, so an arbitrary list cannot be
 * honoured here. The 200px rung is left out: it is the thumbnail size and
 * would only ever be picked by mistake.
 */
export function srcSet(url: string, widths: number[] = [600, 900, 1200]): string {
  const frames = ourFrames(url);
  if (!frames) return widths.map((w) => `${sized(url, w)} ${w}w`).join(', ');
  return OUR_WIDTHS.filter((w) => w >= 400)
    .map((w) => `${frames[w]} ${w}w`)
    .join(', ');
}

export function productBySlug(slug: string): ShopProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** One line of a cart permalink: `<variantId>:<quantity>`. */
export const MAX_QTY = 10;
function line(product: ShopProduct, quantity: number): string {
  return `${product.variantId}:${Math.min(Math.max(Math.round(quantity), 1), MAX_QTY)}`;
}

/**
 * Hands the visitor to Shopify with the whole basket already in the cart.
 * This is the whole integration: no API key, no cart API, nothing of ours to
 * go wrong between the click and the checkout.
 *
 * The basket is assembled on our side and spent in one URL, which is why it
 * can be several lines. Shopify takes them comma separated.
 */
export function cartUrl(items: { product: ShopProduct; quantity: number }[]): string {
  const lines = items.map(({ product, quantity }) => line(product, quantity));
  return `https://${SHOPIFY_DOMAIN}/cart/${lines.join(',')}`;
}

/** `/shop` and `/shop/<slug>`, or null when the path is something else. */
export function shopRouteForPath(pathname: string): { slug: string | null } | null {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  if (clean === '/shop') return { slug: null };
  const match = clean.match(/^\/shop\/([a-z0-9-]+)$/);
  if (!match) return null;
  // A product that is not for sale has no page. Otherwise the singles stay
  // reachable by typing the URL, with a buy button and no way to have found
  // them, which is worse than not having them.
  const product = productBySlug(match[1]);
  if (product && isForSale(product)) return { slug: match[1] };
  return null;
}
