/**
 * SINGLE SOURCE OF TRUTH FOR ALL COPY AND MEDIA.
 *
 * Everything you'd want to change without touching components lives here:
 * texts (EN + DE), image/video paths, links, section meta.
 *
 * Brand guide rules that the copy must keep obeying:
 *  - Headlines never end with a period.
 *  - AIRBALL / AIRBALLER / AIRBALLERS used precisely
 *    (brand / product / people).
 *  - Sign-off is always "AIRBALL — Play. Compete. Connect."
 */

export type Lang = 'en' | 'de';

export interface WorkSpec {
  label: string;
  value: string;
}

/** The panel that opens when a card is clicked. */
export interface WorkDetail {
  /** Display headline inside the panel. Never ends with a period. */
  title: string;
  lead: string;
  body: string[];
  specs?: WorkSpec[];
}

export interface Work {
  id: string;
  num: string;
  /** Media lives in /public — swap the file, keep the path. */
  media: { type: 'video' | 'image'; src: string; poster?: string; alt: string };
  /** Cursor label over the media, and the verb on the open control. */
  tag: string;
  title: string;
  meta: [string, string];
  detail: WorkDetail;
}

export interface SiteContent {
  nav: { waitlist: string; instagram: string; menuLabel: string };
  /**
   * The load sequence cycles these places, then settles on the master line.
   * "Anywhere Is An Arena" made literal — each one is somewhere a court has
   * actually been set up, so the claim is evidence rather than a slogan.
   */
  loader: { places: string[]; resolve: string };
  /** UI strings for the detail panel that opens from a card. */
  detail: { open: string; close: string; specsLabel: string };
  works: Work[];
  ticker: string[];
  waitlist: {
    eyebrow: string;
    title: string;
    body: string;
    firstName: string;
    lastName: string;
    placeholder: string;
    cta: string;
    errorName: string;
    note: string;
    successTitle: string;
    successBody: string;
    errorInvalid: string;
    errorGeneric: string;
  };
  footer: { location: string; rights: string; imprint: string; privacy: string };
  cursor: { watch: string; view: string };
}

/** Media paths are shared across languages — only the alt text differs. */
const MEDIA = {
  airballer: '/media/airballer.mp4',
  rally: '/media/rally.jpg',
  movement: '/media/movement.jpg',
} as const;

export const SOCIAL = {
  instagram: 'https://instagram.com/airball.at',
  handle: '@airball.at',
} as const;

const en: SiteContent = {
  nav: { waitlist: 'Waitlist', instagram: 'Instagram', menuLabel: 'Menu' },
  loader: {
    places: ['A park', 'A rooftop', 'A beach', 'A courtyard', 'A car park', 'A gym floor'],
    resolve: 'Anywhere',
  },
  detail: { open: 'Details', close: 'Close', specsLabel: 'Specs' },
  works: [
    {
      id: 'airballer',
      num: '01',
      media: { type: 'video', src: MEDIA.airballer, alt: 'The AIRBALLER court in play' },
      tag: 'Watch',
      title: 'The Airballer',
      meta: ['Product', '2026'],
      detail: {
        title: 'One court, one backpack',
        lead: 'The portable rebound sport. Real sport that still fits in a backpack. Born in Graz, for the world.',
        body: [
          'An inflatable rebound court that packs into a backpack. Inflate it in minutes and almost any place becomes your arena — grass, sand or indoor.',
          'The AIRBALLER is the product. The game, the league and the people are built around it.',
        ],
        specs: [
          { label: 'Court', value: 'Ø 100 cm, inflatable' },
          { label: 'Carry', value: 'Fits in a backpack' },
          { label: 'Setup', value: 'Minutes, not hours' },
        ],
      },
    },
    {
      id: 'game',
      num: '02',
      media: { type: 'image', src: MEDIA.rally, alt: 'An AIRBALL rally in a Graz park' },
      tag: 'The rules',
      title: 'The Game',
      meta: ['Three Contacts', '1v1 / 2v2'],
      detail: {
        title: 'Three contacts to answer',
        lead: '1v1 or 2v2. Feet only, or full body.',
        body: [
          'Strike the ball onto the AIRBALLER — the other team has up to three contacts to play it back. Ball hits the ground, point over.',
          'Easy to learn. Hard to put down.',
        ],
        specs: [
          { label: 'Format', value: '1v1 or 2v2' },
          { label: 'Contacts', value: 'Up to three' },
          { label: 'Touch', value: 'Feet or full body' },
        ],
      },
    },
    {
      id: 'movement',
      num: '03',
      media: { type: 'image', src: MEDIA.movement, alt: 'An AIRBALLER after a point' },
      tag: 'Join us',
      title: 'From Ballers For Ballers',
      meta: ['The Team', 'Graz, AT'],
      detail: {
        title: 'We are the first Airballers',
        lead: 'Built by footballers from Graz who wanted real competition without a stadium.',
        body: [
          'AIRBALL is the brand and the movement. AIRBALLERS are the people — the community, and the league that carries their name.',
          'We build the product around its people, never an audience around the product.',
        ],
        specs: [
          { label: 'Home', value: 'Graz, Austria' },
          { label: 'Started', value: '2026' },
          { label: 'Next', value: 'You' },
        ],
      },
    },
  ],
  ticker: ['Play. Compete. Connect.', 'Anywhere Is An Arena'],
  waitlist: {
    eyebrow: 'Limited first run · Summer 2026',
    title: 'Join the waitlist',
    body: 'The first AIRBALLERS ship this summer. Get on the list and be first on the court.',
    firstName: 'First name',
    lastName: 'Last name',
    placeholder: 'your@email.com',
    cta: 'Join',
    errorName: 'Enter your first and last name',
    note: "No spam. One mail when it's your turn.",
    successTitle: "You're on the list",
    successBody: "Welcome, Airballer. We'll be in touch before the first units drop.",
    errorInvalid: 'Enter a valid email address',
    errorGeneric: 'Something went wrong. Try again.',
  },
  footer: {
    location: 'Graz, Austria',
    rights: '© 2026 AIRBALL',
    imprint: 'Imprint',
    privacy: 'Privacy',
  },
  cursor: { watch: 'Watch', view: 'View' },
};

const de: SiteContent = {
  nav: { waitlist: 'Warteliste', instagram: 'Instagram', menuLabel: 'Menü' },
  loader: {
    places: ['Ein Park', 'Ein Dach', 'Ein Strand', 'Ein Hof', 'Ein Parkdeck', 'Eine Halle'],
    resolve: 'Überall',
  },
  detail: { open: 'Details', close: 'Schließen', specsLabel: 'Daten' },
  works: [
    {
      id: 'airballer',
      num: '01',
      media: { type: 'video', src: MEDIA.airballer, alt: 'Der AIRBALLER im Spiel' },
      tag: 'Ansehen',
      title: 'Der Airballer',
      meta: ['Produkt', '2026'],
      detail: {
        title: 'Ein Court, ein Rucksack',
        lead: 'Der tragbare Rebound-Sport. Echter Sport, der in einen Rucksack passt. Entstanden in Graz, gebaut für überall.',
        body: [
          'Ein aufblasbarer Rebound-Court, der in den Rucksack passt. In Minuten aufgepumpt — und fast jeder Ort wird zur Arena: Wiese, Sand oder Halle.',
          'Der AIRBALLER ist das Produkt. Das Spiel, die Liga und die Leute bauen darauf auf.',
        ],
        specs: [
          { label: 'Court', value: 'Ø 100 cm, aufblasbar' },
          { label: 'Transport', value: 'Passt in den Rucksack' },
          { label: 'Aufbau', value: 'Minuten, keine Stunden' },
        ],
      },
    },
    {
      id: 'game',
      num: '02',
      media: { type: 'image', src: MEDIA.rally, alt: 'Ein AIRBALL-Ballwechsel in einem Grazer Park' },
      tag: 'Die Regeln',
      title: 'Das Spiel',
      meta: ['Drei Kontakte', '1v1 / 2v2'],
      detail: {
        title: 'Drei Kontakte zum Antworten',
        lead: '1v1 oder 2v2. Nur Füße, oder ganzer Körper.',
        body: [
          'Spiel den Ball auf den AIRBALLER — das andere Team hat bis zu drei Kontakte zum Zurückspielen. Ball am Boden, Punkt vorbei.',
          'Schnell gelernt. Schwer wieder wegzulegen.',
        ],
        specs: [
          { label: 'Format', value: '1v1 oder 2v2' },
          { label: 'Kontakte', value: 'Bis zu drei' },
          { label: 'Berührung', value: 'Füße oder ganzer Körper' },
        ],
      },
    },
    {
      id: 'movement',
      num: '03',
      media: { type: 'image', src: MEDIA.movement, alt: 'Ein AIRBALLER nach dem Punkt' },
      tag: 'Mach mit',
      title: 'From Ballers For Ballers',
      meta: ['Das Team', 'Graz, AT'],
      detail: {
        title: 'Wir sind die ersten Airballers',
        lead: 'Gebaut von Fußballern aus Graz, die echten Wettkampf ohne Stadion wollten.',
        body: [
          'AIRBALL ist die Marke und die Bewegung. AIRBALLERS sind die Leute — die Community und die Liga, die ihren Namen trägt.',
          'Wir bauen das Produkt um seine Leute herum, nie ein Publikum um das Produkt.',
        ],
        specs: [
          { label: 'Zuhause', value: 'Graz, Österreich' },
          { label: 'Gestartet', value: '2026' },
          { label: 'Als Nächstes', value: 'Du' },
        ],
      },
    },
  ],
  ticker: ['Play. Compete. Connect.', 'Anywhere Is An Arena'],
  waitlist: {
    eyebrow: 'Limitierte erste Auflage · Sommer 2026',
    title: 'Auf die Warteliste',
    body: 'Die ersten AIRBALLERS kommen diesen Sommer. Trag dich ein und steh als Erster am Court.',
    firstName: 'Vorname',
    lastName: 'Nachname',
    placeholder: 'deine@email.com',
    cta: 'Eintragen',
    errorName: 'Bitte Vor- und Nachname eingeben',
    note: 'Kein Spam. Eine Mail, wenn du dran bist.',
    successTitle: 'Du bist auf der Liste',
    successBody: 'Willkommen, Airballer. Wir melden uns, bevor die ersten Einheiten rausgehen.',
    errorInvalid: 'Bitte gültige E-Mail-Adresse eingeben',
    errorGeneric: 'Da ist etwas schiefgelaufen. Bitte nochmal.',
  },
  footer: {
    location: 'Graz, Österreich',
    rights: '© 2026 AIRBALL',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
  },
  cursor: { watch: 'Ansehen', view: 'Ansehen' },
};

export const CONTENT: Record<Lang, SiteContent> = { en, de };
