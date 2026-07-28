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

export interface DetailSection {
  /** Small display heading. Never ends with a period. */
  heading: string;
  body: string;
}

export interface DetailImage {
  src: string;
  alt: string;
}

export interface Person {
  name: string;
  role: string;
  bio: string;
  photo: DetailImage;
}

/** The panel that opens when a card is clicked. */
export interface WorkDetail {
  /** Display headline inside the panel. Never ends with a period. */
  title: string;
  lead: string;
  /** Wide image directly under the lead. */
  hero?: DetailImage;
  /** The substance of the page — one heading and paragraph per block. */
  sections?: DetailSection[];
  /** Portrait images shown as a row beneath the sections. */
  gallery?: DetailImage[];
  /** Short locked lines, set as a stack of yellow-marked statements. */
  values?: string[];
  /** Heading above the people grid. */
  peopleTitle?: string;
  people?: Person[];
  body?: string[];
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
  instagram: 'https://www.instagram.com/airball.at/',
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
        hero: { src: '/media/airballer/court-wide.jpg', alt: 'The AIRBALLER set up on grass in a Graz park' },
        sections: [
          {
            heading: 'The Court',
            body: 'An inflatable rebound court, Ø 100 cm. Drop it on the ground and the arena is set. No lines to paint, no net to hang, no goal to carry.',
          },
          {
            heading: 'Built To Take Hits',
            body: 'Made to be smashed, dived over and played on all day, then packed away in minutes.',
          },
          {
            heading: 'Setup In Minutes',
            body: 'Unroll, inflate, play. Minutes, not hours. The pump is part of the kit. No power outlet, no tools, no assembly manual.',
          },
          {
            heading: 'Any Surface',
            body: "Grass, sand, indoor floors, rooftops. If you can stand on it, you can play on it. The Airballer doesn't care where, as long as it's flat. That's the point.",
          },
        ],
        gallery: [
          { src: '/media/airballer/play-01.jpg', alt: 'A player waiting on the AIRBALLER' },
          { src: '/media/airballer/play-02.jpg', alt: 'A rally in progress' },
          { src: '/media/airballer/play-03.jpg', alt: 'Striking the ball onto the AIRBALLER' },
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
        title: 'This is how we play',
        lead: 'Easy to learn. Hard to put down. Pick a mode, pick a side, and run it back.',
        sections: [
          {
            heading: 'Pick Your Side',
            body: '1v1 or 2v2. Two players or two teams face off around the Airballer. Rock-paper-scissors decides who serves first. That is tradition.',
          },
          {
            heading: 'Strike The Ball Onto The Airballer',
            body: 'Serve or attack by playing the ball onto the rebound surface. The bounce sends it flying. Where it goes next is your opponent’s problem.',
          },
          {
            heading: 'Up To Three Contacts',
            body: 'The receiving team has up to three contacts to control the ball and play it back onto the Airballer. Use all three, or smash it back first-touch.',
          },
          {
            heading: 'The Game Mode',
            body: 'Choose your mode before the match. Football rules — feet, chest and head only. Padel rules — played 1v1, two touches after receiving. Or full-body mode, where every touch counts.',
          },
          {
            heading: 'Ball Hits The Ground, Point Over',
            body: 'If the ball touches the ground on your side of the rally, the point goes to the other team. First to 11, win by two. Then rematch. Always rematch.',
          },
        ],
        gallery: [
          { src: '/media/game/rally-01.jpg', alt: 'A rally around the AIRBALLER, ball in the air' },
          { src: '/media/game/watching.jpg', alt: 'Players waiting for the ball to come back' },
        ],
        specs: [
          { label: 'Format', value: '1v1 or 2v2' },
          { label: 'Contacts', value: 'Up to three' },
          { label: 'Modes', value: 'Football, padel, full body' },
          { label: 'Scoring', value: 'First to 11, win by two' },
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
        title: 'From Ballers. For Ballers.',
        lead: 'Airball is a sport. A very portable sport. One that turns any patch of ground into a court and any stranger into an opponent.',
        hero: { src: '/media/team/founders.jpg', alt: 'The three founders at an AIRBALL event in Graz' },
        body: [
          'Our roots are on the pitches of Graz, Austria. The three of us grew up playing football everywhere we were allowed to — and a few places we weren’t. Then we got older, the stadiums got further away and the excuses got easier. So we built the Airballer: real competition that fits in a backpack.',
          'We are the first Airballers. You’re next.',
        ],
        values: [
          'Anywhere is an arena',
          'Real sport, not a gadget',
          'Three contacts, no excuses',
          'Play. Compete. Connect.',
        ],
        peopleTitle: 'We are what we play',
        people: [
          {
            name: 'Alexander',
            role: 'Founder',
            bio: 'Airball is Alexander’s brainchild. He saw an arena in every park, beach and rooftop, and built the plan to prove it. Runs the vision, the product and the big picture, and still takes the first rally at every event.',
            photo: { src: '/media/team/alexander.jpg', alt: 'Alexander' },
          },
          {
            name: 'Claudio',
            role: 'Co-founder',
            bio: 'First to believe in the idea and first on the court when it counts. Runs the community, the marketing and the rematches — everything that turns a product into a crew.',
            photo: { src: '/media/team/claudio.jpg', alt: 'Claudio' },
          },
          {
            name: 'Luca',
            role: 'Co-founder',
            bio: 'The one who gets the Airballer from our backpacks into yours. Runs sales and partnerships, from the first pitch to the last handshake, and makes sure every ball actually drops.',
            photo: { src: '/media/team/luca.jpg', alt: 'Luca' },
          },
        ],
        specs: [
          { label: 'Home', value: 'Graz, Austria' },
          { label: 'Founders', value: 'Three' },
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
        hero: { src: '/media/airballer/court-wide.jpg', alt: 'Der AIRBALLER aufgebaut auf einer Wiese in Graz' },
        sections: [
          {
            heading: 'Der Court',
            body: 'Ein aufblasbarer Rebound-Court, Ø 100 cm. Hinlegen und die Arena steht. Keine Linien ziehen, kein Netz spannen, kein Tor schleppen.',
          },
          {
            heading: 'Hält Was Aus',
            body: 'Gebaut zum Draufhauen, Drüberhechten und Durchspielen — und in Minuten wieder verpackt.',
          },
          {
            heading: 'Aufbau In Minuten',
            body: 'Ausrollen, aufpumpen, spielen. Minuten, keine Stunden. Die Pumpe gehört dazu. Keine Steckdose, kein Werkzeug, keine Aufbauanleitung.',
          },
          {
            heading: 'Jeder Untergrund',
            body: 'Wiese, Sand, Hallenboden, Dachterrasse. Worauf du stehen kannst, darauf kannst du spielen. Dem Airballer ist egal wo, solange es eben ist. Genau das ist der Punkt.',
          },
        ],
        gallery: [
          { src: '/media/airballer/play-01.jpg', alt: 'Ein Spieler wartet am AIRBALLER' },
          { src: '/media/airballer/play-02.jpg', alt: 'Ein Ballwechsel läuft' },
          { src: '/media/airballer/play-03.jpg', alt: 'Der Ball wird auf den AIRBALLER gespielt' },
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
        title: 'So spielen wir',
        lead: 'Schnell gelernt. Schwer wieder wegzulegen. Modus wählen, Seite wählen, und noch eine Runde.',
        sections: [
          {
            heading: 'Wähl Deine Seite',
            body: '1v1 oder 2v2. Zwei Spieler oder zwei Teams stehen sich rund um den Airballer gegenüber. Schere, Stein, Papier entscheidet, wer aufschlägt. Das ist Tradition.',
          },
          {
            heading: 'Spiel Den Ball Auf Den Airballer',
            body: 'Aufschlag oder Angriff: den Ball auf die Rebound-Fläche spielen. Der Absprung schickt ihn los. Wo er landet, ist das Problem des Gegners.',
          },
          {
            heading: 'Bis Zu Drei Kontakte',
            body: 'Das annehmende Team hat bis zu drei Kontakte, um den Ball zu kontrollieren und zurück auf den Airballer zu spielen. Alle drei nutzen — oder direkt aus der Annahme zurückhämmern.',
          },
          {
            heading: 'Der Spielmodus',
            body: 'Modus vor dem Match festlegen. Fußball-Regeln — nur Fuß, Brust und Kopf. Padel-Regeln — im 1v1 zwei Berührungen nach der Annahme. Oder Ganzkörper, da zählt jede Berührung.',
          },
          {
            heading: 'Ball Am Boden, Punkt Vorbei',
            body: 'Berührt der Ball auf deiner Seite den Boden, geht der Punkt ans andere Team. Bis 11, mit zwei Punkten Vorsprung. Dann Revanche. Immer Revanche.',
          },
        ],
        gallery: [
          { src: '/media/game/rally-01.jpg', alt: 'Ein Ballwechsel am AIRBALLER, der Ball in der Luft' },
          { src: '/media/game/watching.jpg', alt: 'Spieler warten auf den Ball' },
        ],
        specs: [
          { label: 'Format', value: '1v1 oder 2v2' },
          { label: 'Kontakte', value: 'Bis zu drei' },
          { label: 'Modi', value: 'Fußball, Padel, Ganzkörper' },
          { label: 'Zählweise', value: 'Bis 11, zwei Punkte Vorsprung' },
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
        title: 'From Ballers. For Ballers.',
        lead: 'Airball ist ein Sport. Ein sehr tragbarer Sport. Einer, der jedes Stück Boden zum Court macht und jeden Fremden zum Gegner.',
        hero: { src: '/media/team/founders.jpg', alt: 'Die drei Gründer bei einem AIRBALL-Event in Graz' },
        body: [
          'Unsere Wurzeln liegen auf den Plätzen von Graz. Wir drei sind mit Fußball aufgewachsen und haben überall gespielt, wo man uns ließ — und an ein paar Orten, wo man es nicht tat. Dann wurden wir älter, die Stadien weiter weg und die Ausreden leichter. Also haben wir den Airballer gebaut: echter Wettkampf, der in einen Rucksack passt.',
          'Wir sind die ersten Airballers. Du bist der Nächste.',
        ],
        values: [
          'Anywhere is an arena',
          'Echter Sport, kein Gadget',
          'Drei Kontakte, keine Ausreden',
          'Play. Compete. Connect.',
        ],
        peopleTitle: 'Wir sind, was wir spielen',
        people: [
          {
            name: 'Alexander',
            role: 'Gründer',
            bio: 'Airball ist Alexanders Idee. Er hat in jedem Park, an jedem Strand und auf jedem Dach eine Arena gesehen — und den Plan gebaut, um es zu beweisen. Verantwortet Vision, Produkt und das große Ganze, und spielt bei jedem Event den ersten Ballwechsel.',
            photo: { src: '/media/team/alexander.jpg', alt: 'Alexander' },
          },
          {
            name: 'Claudio',
            role: 'Co-Gründer',
            bio: 'Der Erste, der an die Idee geglaubt hat, und der Erste am Court, wenn es zählt. Verantwortet Community, Marketing und die Revanchen — alles, was aus einem Produkt eine Crew macht.',
            photo: { src: '/media/team/claudio.jpg', alt: 'Claudio' },
          },
          {
            name: 'Luca',
            role: 'Co-Gründer',
            bio: 'Der, der den Airballer aus unseren Rucksäcken in eure bringt. Verantwortet Vertrieb und Partnerschaften, vom ersten Pitch bis zum letzten Handschlag, und sorgt dafür, dass jeder Ball auch wirklich fällt.',
            photo: { src: '/media/team/luca.jpg', alt: 'Luca' },
          },
        ],
        specs: [
          { label: 'Zuhause', value: 'Graz, Österreich' },
          { label: 'Gründer', value: 'Drei' },
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
