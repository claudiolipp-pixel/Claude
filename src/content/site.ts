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

export interface Work {
  id: string;
  num: string;
  /** Media lives in /public — swap the file, keep the path. */
  media: { type: 'video' | 'image'; src: string; poster?: string; alt: string };
  tag: string;
  title: string;
  meta: [string, string];
  body: string;
  specs?: WorkSpec[];
}

export interface SiteContent {
  nav: { waitlist: string; instagram: string; menuLabel: string };
  intro: string;
  works: Work[];
  ticker: string[];
  waitlist: {
    eyebrow: string;
    title: string;
    body: string;
    placeholder: string;
    cta: string;
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
  intro:
    'The portable rebound sport. Real sport that still fits in a backpack. Born in Graz, for the world.',
  works: [
    {
      id: 'airballer',
      num: '01',
      media: { type: 'video', src: MEDIA.airballer, alt: 'The AIRBALLER court in play' },
      tag: 'Watch',
      title: 'The Airballer',
      meta: ['Product', '2026'],
      body: 'An inflatable rebound court that packs into a backpack. Inflate it in minutes and almost any place becomes your arena — grass, sand or indoor.',
      specs: [
        { label: 'Court', value: 'Ø 100 cm, inflatable' },
        { label: 'Carry', value: 'Fits in a backpack' },
        { label: 'Setup', value: 'Minutes, not hours' },
      ],
    },
    {
      id: 'game',
      num: '02',
      media: { type: 'image', src: MEDIA.rally, alt: 'An AIRBALL rally in a Graz park' },
      tag: 'The rules',
      title: 'Three Contacts',
      meta: ['The Game', '1v1 / 2v2'],
      body: 'Strike the ball onto the AIRBALLER — the other team has up to three contacts to play it back. Feet only, or full body. Ball hits the ground, point over. Easy to learn. Hard to put down.',
    },
    {
      id: 'movement',
      num: '03',
      media: { type: 'image', src: MEDIA.movement, alt: 'An AIRBALLER after a point' },
      tag: 'Join us',
      title: 'From Ballers For Ballers',
      meta: ['The Movement', 'Graz, AT'],
      body: 'Built by footballers from Graz who wanted real competition without a stadium. We are the first AIRBALLERS. You are next.',
    },
  ],
  ticker: ['Play. Compete. Connect.', 'Anywhere Is An Arena'],
  waitlist: {
    eyebrow: 'Limited first run · Summer 2026',
    title: 'Join the waitlist',
    body: 'The first AIRBALLERS ship this summer. Get on the list and be first on the court.',
    placeholder: 'your@email.com',
    cta: 'Join',
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
  intro:
    'Der tragbare Rebound-Sport. Echter Sport, der in einen Rucksack passt. Entstanden in Graz, gebaut für überall.',
  works: [
    {
      id: 'airballer',
      num: '01',
      media: { type: 'video', src: MEDIA.airballer, alt: 'Der AIRBALLER im Spiel' },
      tag: 'Ansehen',
      title: 'Der Airballer',
      meta: ['Produkt', '2026'],
      body: 'Ein aufblasbarer Rebound-Court, der in den Rucksack passt. In Minuten aufgepumpt — und fast jeder Ort wird zur Arena: Wiese, Sand oder Halle.',
      specs: [
        { label: 'Court', value: 'Ø 100 cm, aufblasbar' },
        { label: 'Transport', value: 'Passt in den Rucksack' },
        { label: 'Aufbau', value: 'Minuten, keine Stunden' },
      ],
    },
    {
      id: 'game',
      num: '02',
      media: { type: 'image', src: MEDIA.rally, alt: 'Ein AIRBALL-Ballwechsel in einem Grazer Park' },
      tag: 'Die Regeln',
      title: 'Drei Kontakte',
      meta: ['Das Spiel', '1v1 / 2v2'],
      body: 'Spiel den Ball auf den AIRBALLER — das andere Team hat bis zu drei Kontakte zum Zurückspielen. Nur Füße, oder ganzer Körper. Ball am Boden, Punkt vorbei. Schnell gelernt. Schwer wieder wegzulegen.',
    },
    {
      id: 'movement',
      num: '03',
      media: { type: 'image', src: MEDIA.movement, alt: 'Ein AIRBALLER nach dem Punkt' },
      tag: 'Mach mit',
      title: 'From Ballers For Ballers',
      meta: ['Die Bewegung', 'Graz, AT'],
      body: 'Gebaut von Fußballern aus Graz, die echten Wettkampf ohne Stadion wollten. Wir sind die ersten AIRBALLERS. Du bist der Nächste.',
    },
  ],
  ticker: ['Play. Compete. Connect.', 'Anywhere Is An Arena'],
  waitlist: {
    eyebrow: 'Limitierte erste Auflage · Sommer 2026',
    title: 'Auf die Warteliste',
    body: 'Die ersten AIRBALLERS kommen diesen Sommer. Trag dich ein und steh als Erster am Court.',
    placeholder: 'deine@email.com',
    cta: 'Eintragen',
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
