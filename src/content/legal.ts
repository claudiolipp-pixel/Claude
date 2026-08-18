/**
 * IMPRINT AND PRIVACY COPY.
 *
 * Both are provisional and say so on the page. They are written against what
 * the site actually does today, so they are accurate rather than generic:
 *
 *  - the waitlist form posts first name, last name, email and language to a
 *    Google Apps Script that appends a row to a Google Sheet, together with the
 *    campaign tags and referrer captured in attribution.ts,
 *  - Cloudflare serves the site and keeps request logs,
 *  - Cloudflare Web Analytics counts visits without a cookie or a fingerprint,
 *  - `airball.lang` in localStorage remembers the language choice,
 *  - `airball.cart` in localStorage holds the basket, but only once the shop is
 *    live, which is why that paragraph is conditional,
 *  - fonts are bundled, so no request ever leaves for a third-party CDN,
 *  - there is no advertising and no cookie of any kind.
 *
 * If any of that changes, this file has to change with it. The line that
 * decides whether a consent banner is needed is whether something is written to
 * or read from the visitor's device. Everything here stays on the right side of
 * it; a pixel, an embedded map or a video would not.
 *
 * Anything a lawyer still has to fill in is marked TODO below and shown on the
 * page as a visible gap rather than quietly omitted.
 */

import type { Lang } from '@/content/site';
import { SHOP_LIVE } from '@/content/shop';

/*
 * The cart paragraph, which only tells the truth once the shop exists.
 *
 * With the shop off, nothing writes airball.cart and describing it would be a
 * privacy notice for something that never happens: wrong in the direction that
 * matters, because it invites a reader to look for storage they will not find
 * and makes the rest of the page less believable. Tied to SHOP_LIVE so the two
 * cannot drift.
 */
const storage: Record<Lang, string[]> = {
  en: SHOP_LIVE
    ? [
        'The only things stored on your device are two entries in your browser’s local storage. airball.lang remembers whether you chose German or English. airball.cart holds what you put in the shopping cart, as product names and quantities, so it is still there if you close the tab and come back. Neither contains anything about who you are, neither leaves your browser until you choose to go to the checkout, and clearing your browser data removes both.',
        'Storing the cart needs no consent because it is strictly necessary to provide something you explicitly asked for, namely a shop that remembers what you selected. That is the same exemption a login session falls under.',
      ]
    : [
        'The only thing stored on your device is an entry called airball.lang in your browser’s local storage, which remembers whether you chose German or English. It contains nothing else and never leaves your browser. Clearing your browser data removes it.',
      ],
  de: SHOP_LIVE
    ? [
        'Das Einzige, was auf deinem Gerät gespeichert wird, sind zwei Einträge im lokalen Speicher deines Browsers. airball.lang merkt sich, ob du Deutsch oder Englisch gewählt hast. airball.cart enthält, was du in den Warenkorb gelegt hast, als Produktnamen und Mengen, damit es noch da ist, wenn du den Tab schließt und wiederkommst. Keiner der beiden enthält etwas darüber, wer du bist, keiner verlässt deinen Browser, bis du selbst zur Kasse gehst, und wenn du deine Browserdaten löschst, sind beide weg.',
        'Für das Speichern des Warenkorbs ist keine Einwilligung nötig, weil es unbedingt erforderlich ist, um etwas bereitzustellen, das du ausdrücklich verlangt hast, nämlich einen Shop, der sich deine Auswahl merkt. Das ist dieselbe Ausnahme, unter die auch eine Login-Sitzung fällt.',
      ]
    : [
        'Das Einzige, was auf deinem Gerät gespeichert wird, ist ein Eintrag namens airball.lang im lokalen Speicher deines Browsers, der sich merkt, ob du Deutsch oder Englisch gewählt hast. Er enthält sonst nichts und verlässt deinen Browser nie. Wenn du deine Browserdaten löschst, ist er weg.',
      ],
};

export interface LegalSection {
  heading: string;
  /** Paragraphs. */
  body?: string[];
  /** Rendered as a list under the paragraphs. */
  items?: string[];
}

export interface LegalDocument {
  title: string;
  /** Shown in a marked band at the top, so nobody mistakes this for final. */
  notice: string;
  updated: string;
  sections: LegalSection[];
}

export interface LegalContent {
  back: string;
  imprint: LegalDocument;
  privacy: LegalDocument;
}

const CONTACT_EMAIL = 'info@airball.at';

const en: LegalContent = {
  back: 'Back to airball.at',
  imprint: {
    title: 'Imprint',
    notice:
      'This imprint is still being completed. AIRBALL is in the process of being set up as a company, and the registration details below will be filled in as soon as they exist.',
    updated: 'Last updated: 30 July 2026',
    sections: [
      {
        heading: 'Media owner and publisher',
        body: ['AIRBALL', 'Graz, Austria'],
      },
      {
        heading: 'Contact',
        body: [`Email: ${CONTACT_EMAIL}`],
      },
      {
        heading: 'Purpose of the business',
        body: [
          'Development and sale of AIRBALLER, a portable rebound court, and the organisation of games and events around it.',
        ],
      },
      {
        heading: 'Still to be added',
        body: [
          'The following details are required under the Austrian E-Commerce Act and Media Act and will be published here once the company is registered.',
        ],
        // TODO(legal): replace this block with the real details once the
        // company exists. Do not ship to a wider audience without it.
        items: [
          'Full legal name and legal form',
          'Registered address',
          'Companies register number and register court',
          'VAT identification number',
          'Trade authority and applicable trade regulations',
          'Names of the managing directors',
        ],
      },
      {
        heading: 'Online dispute resolution',
        body: [
          'The European Commission provides a platform for online dispute resolution at ec.europa.eu/consumers/odr. We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    notice:
      'This is a provisional privacy notice. It describes accurately what the site does today, but it has not yet been reviewed by a lawyer and will be replaced.',
    updated: 'Last updated: 30 July 2026',
    sections: [
      {
        heading: 'Who is responsible',
        body: [
          `AIRBALL, Graz, Austria, is the controller for the processing described here. For any question about your data, write to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'The waitlist form',
        body: [
          'If you sign up for the waitlist we store the first name, last name and email address you enter, along with the language the site was set to and the time of the signup.',
          'We also record which link brought you here: the campaign tags in the address, if there were any, and the address of the page you followed a link from, without its query string. This tells us that a signup came from, say, Instagram. It says nothing about who you are, is read only at the moment you submit the form, and is never stored on your device.',
          'We use this only to tell you when the first AIRBALLERS are available. We do not send anything else, and we do not pass the list to anyone for advertising.',
          'The legal basis is your consent under Article 6(1)(a) GDPR. You can withdraw it at any time by writing to us, and we will delete your entry.',
        ],
      },
      {
        heading: 'Where the waitlist is stored',
        body: [
          'Signups are written into a Google Sheet using a Google Apps Script, operated by Google Ireland Limited. Google acts as a processor for us, and data may be transferred to servers in the United States on the basis of the EU Commission adequacy decision for the EU-US Data Privacy Framework.',
          'We keep an entry until the product launch has happened and you have been notified, or until you ask us to delete it, whichever comes first.',
        ],
      },
      {
        heading: 'Hosting and server logs',
        body: [
          'The site is hosted by Cloudflare, Inc. Serving a page necessarily involves your IP address, and Cloudflare records technical request data such as the time, the page requested and the browser used, in order to deliver the site and defend it against attacks.',
          'The legal basis is our legitimate interest in operating a secure website under Article 6(1)(f) GDPR.',
        ],
      },
      {
        heading: 'Visitor statistics',
        body: [
          'We use Cloudflare Web Analytics to see how many people visit and which pages they reach. It sets no cookie, stores nothing on your device and builds no fingerprint, so it cannot recognise you again or follow you to another site. What we see are totals: visits, referring sites, countries, browsers and loading times.',
          'The legal basis is our legitimate interest in understanding whether the site works under Article 6(1)(f) GDPR. Because nothing is stored on or read from your device, this needs no consent, which is why you are not being asked to accept anything.',
        ],
      },
      {
        heading: 'Cookies and tracking',
        body: [
          'This site sets no cookies. It runs no advertising, no tracking pixels and no cross-site profiling, and it embeds nothing from a third party.',
          ...storage.en,
          'Fonts are delivered from our own server, so loading the page sends no request to any external font service.',
        ],
      },
      {
        heading: 'Links to Instagram and LinkedIn',
        body: [
          'The footer and the contact panel link to our Instagram and LinkedIn profiles. These are ordinary links: nothing is loaded from those services until you click, and no data reaches them beforehand. Once you follow a link, the privacy policy of the respective provider applies.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Under the GDPR you have the right to access your data, to have it corrected or deleted, to have its processing restricted, to object to processing, and to receive it in a portable format. To exercise any of these, write to ' +
            CONTACT_EMAIL +
            '.',
          'You also have the right to complain to the Austrian Data Protection Authority, Barichgasse 40-42, 1030 Vienna, dsb.gv.at.',
        ],
      },
    ],
  },
};

const de: LegalContent = {
  back: 'Zurück zu airball.at',
  imprint: {
    title: 'Impressum',
    notice:
      'Dieses Impressum ist noch in Arbeit. AIRBALL befindet sich gerade in Gründung, die unten fehlenden Registerdaten werden ergänzt, sobald sie vorliegen.',
    updated: 'Stand: 30. Juli 2026',
    sections: [
      {
        heading: 'Medieninhaber und Herausgeber',
        body: ['AIRBALL', 'Graz, Österreich'],
      },
      {
        heading: 'Kontakt',
        body: [`E-Mail: ${CONTACT_EMAIL}`],
      },
      {
        heading: 'Unternehmensgegenstand',
        body: [
          'Entwicklung und Vertrieb des AIRBALLER, eines tragbaren Rebound-Courts, sowie die Organisation von Spielen und Events rundherum.',
        ],
      },
      {
        heading: 'Wird noch ergänzt',
        body: [
          'Die folgenden Angaben sind nach ECG und Mediengesetz verpflichtend und werden hier veröffentlicht, sobald das Unternehmen eingetragen ist.',
        ],
        items: [
          'Vollständiger Firmenwortlaut und Rechtsform',
          'Firmensitz und Adresse',
          'Firmenbuchnummer und Firmenbuchgericht',
          'UID-Nummer',
          'Gewerbebehörde und anwendbare Gewerbeordnung',
          'Namen der Geschäftsführung',
        ],
      },
      {
        heading: 'Online-Streitbeilegung',
        body: [
          'Die Europäische Kommission stellt unter ec.europa.eu/consumers/odr eine Plattform zur Online-Streitbeilegung bereit. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Datenschutz',
    notice:
      'Das ist eine vorläufige Datenschutzerklärung. Sie beschreibt zutreffend, was die Seite heute tut, ist aber noch nicht juristisch geprüft und wird ersetzt.',
    updated: 'Stand: 30. Juli 2026',
    sections: [
      {
        heading: 'Verantwortlich',
        body: [
          `Verantwortlich für die hier beschriebene Verarbeitung ist AIRBALL, Graz, Österreich. Bei Fragen zu deinen Daten schreib an ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'Das Warteliste-Formular',
        body: [
          'Wenn du dich für die Warteliste einträgst, speichern wir Vorname, Nachname und E-Mail-Adresse, dazu die eingestellte Sprache und den Zeitpunkt der Anmeldung.',
          'Außerdem halten wir fest, über welchen Link du gekommen bist: die Kampagnen-Parameter in der Adresse, falls vorhanden, und die Adresse der Seite, von der aus du den Link angeklickt hast, ohne deren Suchparameter. Damit sehen wir, dass eine Anmeldung zum Beispiel über Instagram kam. Über deine Person sagt das nichts aus, es wird erst im Moment des Absendens ausgelesen und niemals auf deinem Gerät gespeichert.',
          'Wir verwenden das ausschließlich, um dir Bescheid zu geben, sobald die ersten AIRBALLER verfügbar sind. Wir schicken nichts anderes und geben die Liste nicht für Werbung weiter.',
          'Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Du kannst sie jederzeit widerrufen, dann löschen wir deinen Eintrag.',
        ],
      },
      {
        heading: 'Wo die Warteliste liegt',
        body: [
          'Die Anmeldungen werden über ein Google Apps Script in ein Google Sheet geschrieben, betrieben von Google Ireland Limited. Google ist dabei unser Auftragsverarbeiter. Eine Übermittlung auf Server in den USA ist möglich, gestützt auf den Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework.',
          'Wir behalten einen Eintrag, bis der Launch stattgefunden hat und du benachrichtigt wurdest, oder bis du die Löschung verlangst, je nachdem was früher eintritt.',
        ],
      },
      {
        heading: 'Hosting und Server-Logs',
        body: [
          'Die Seite wird von Cloudflare, Inc. gehostet. Beim Ausliefern einer Seite wird zwangsläufig deine IP-Adresse verarbeitet, und Cloudflare protokolliert technische Daten wie Zeitpunkt, aufgerufene Seite und verwendeten Browser, um die Seite auszuliefern und vor Angriffen zu schützen.',
          'Rechtsgrundlage ist unser berechtigtes Interesse am sicheren Betrieb der Website nach Art. 6 Abs. 1 lit. f DSGVO.',
        ],
      },
      {
        heading: 'Besucherstatistik',
        body: [
          'Wir nutzen Cloudflare Web Analytics, um zu sehen, wie viele Menschen die Seite besuchen und welche Bereiche sie erreichen. Es setzt kein Cookie, speichert nichts auf deinem Gerät und bildet keinen Fingerabdruck. Es kann dich also weder wiedererkennen noch auf andere Seiten verfolgen. Wir sehen Summen: Besuche, verweisende Seiten, Länder, Browser und Ladezeiten.',
          'Rechtsgrundlage ist unser berechtigtes Interesse daran zu verstehen, ob die Seite funktioniert, nach Art. 6 Abs. 1 lit. f DSGVO. Da nichts auf deinem Gerät gespeichert oder ausgelesen wird, ist dafür keine Einwilligung nötig. Deshalb wirst du auch nicht gefragt, irgendetwas zu akzeptieren.',
        ],
      },
      {
        heading: 'Cookies und Tracking',
        body: [
          'Diese Seite setzt keine Cookies. Es läuft keine Werbung, kein Tracking-Pixel, keine seitenübergreifende Profilbildung, und es ist nichts von Dritten eingebettet.',
          ...storage.de,
          'Die Schriften liegen auf unserem eigenen Server. Beim Laden der Seite geht also keine Anfrage an einen externen Schriftdienst.',
        ],
      },
      {
        heading: 'Links zu Instagram und LinkedIn',
        body: [
          'Im Footer und im Kontaktbereich verlinken wir unsere Profile auf Instagram und LinkedIn. Das sind gewöhnliche Links: Vor dem Klick wird nichts von diesen Diensten geladen und es gehen keine Daten an sie. Sobald du einem Link folgst, gilt die Datenschutzerklärung des jeweiligen Anbieters.',
        ],
      },
      {
        heading: 'Deine Rechte',
        body: [
          'Nach der DSGVO hast du das Recht auf Auskunft über deine Daten, auf Berichtigung, auf Löschung, auf Einschränkung der Verarbeitung, auf Widerspruch gegen die Verarbeitung und auf Datenübertragbarkeit. Für all das genügt eine Nachricht an ' +
            CONTACT_EMAIL +
            '.',
          'Außerdem hast du das Recht, dich bei der Österreichischen Datenschutzbehörde zu beschweren, Barichgasse 40-42, 1030 Wien, dsb.gv.at.',
        ],
      },
    ],
  },
};

export const LEGAL: Record<Lang, LegalContent> = { en, de };

/** The two paths the footer links to, and which document each one shows. */
export const LEGAL_ROUTES = {
  '/imprint': 'imprint',
  '/privacy': 'privacy',
} as const;

export type LegalKey = (typeof LEGAL_ROUTES)[keyof typeof LEGAL_ROUTES];

/** Returns which legal document a path asks for, if any. */
export function legalKeyForPath(pathname: string): LegalKey | null {
  // Tolerate a trailing slash, since a hand-typed URL often has one.
  const clean = pathname.replace(/\/+$/, '') || '/';
  return LEGAL_ROUTES[clean as keyof typeof LEGAL_ROUTES] ?? null;
}
