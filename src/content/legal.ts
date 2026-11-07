/**
 * IMPRINT AND PRIVACY COPY.
 *
 * The imprint follows the shop's legal notice in Shopify, which is the master
 * for the company's details. The privacy notice does not: it describes this
 * site, which does different things from the shop, and it is written against
 * what the site actually does today:
 *
 *  - the sign-up form posts an email address and language (first and last
 *    name too, from the older long form) to a Google Apps Script that appends
 *    a row to a Google Sheet, together with the campaign tags and referrer
 *    captured in attribution.ts,
 *  - those addresses are added to the shop's customer list in Shopify, which
 *    sends the emails,
 *  - Cloudflare serves the site and keeps request logs,
 *  - Cloudflare Web Analytics counts visits without a cookie or a fingerprint,
 *  - `airball.lang` in localStorage remembers the language choice,
 *  - `airball.cart` in localStorage holds the basket, but only once the shop is
 *    live, which is why that paragraph is conditional,
 *  - fonts and videos are bundled, so no request leaves for a third party,
 *  - links to the Shopify shop and to Instagram and LinkedIn load nothing
 *    until clicked,
 *  - there is no advertising and no cookie of any kind.
 *
 * If any of that changes, this file has to change with it. The line that
 * decides whether a consent banner is needed is whether something is written to
 * or read from the visitor's device. Everything here stays on the right side of
 * it; a pixel, an embedded map or a video from a third party would not.
 *
 * Anything still missing is marked TODO below and shown on the page as a
 * visible gap rather than quietly omitted.
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
  /**
   * Shown in a marked band at the top, for anything still missing. Left out
   * once a document is complete: a standing "provisional" band on a finished
   * page teaches readers to ignore the band.
   */
  notice?: string;
  updated: string;
  sections: LegalSection[];
}

export interface LegalContent {
  back: string;
  imprint: LegalDocument;
  privacy: LegalDocument;
}

/*
 * The company, as registered. Copied from the shop's legal notice in Shopify,
 * which is the master, with two corrections made there by hand: the street is
 * Lange Gasse, as on the shop's own address, and the address to write to is
 * sales@, the one the shop, its footer and every order mail use.
 */
const COMPANY = 'AIRBALL GmbH';
const ADDRESS_DE = 'Lange Gasse 47/2, 8010 Graz, Österreich';
const ADDRESS_EN = 'Lange Gasse 47/2, 8010 Graz, Austria';
const CONTACT_EMAIL = 'sales@airball.at';
const PHONE = '+43 664 9555 190';
const REGISTER_NUMBER = 'FN 688642i';
const SHOP_PRIVACY = 'shop.airball.at/policies/privacy-policy';

const en: LegalContent = {
  back: 'Back to airball.at',
  imprint: {
    title: 'Imprint',
    notice:
      'The VAT identification number and the trade licence details are still to be added and will appear here as soon as they are issued.',
    updated: 'Last updated: 7 November 2026',
    sections: [
      {
        heading: 'Provider and contact',
        body: [COMPANY, ADDRESS_EN, `Email: ${CONTACT_EMAIL}`, `Telephone: ${PHONE}`],
      },
      {
        heading: 'Company register',
        items: [
          'Legal form: Austrian limited liability company (GmbH)',
          'Registered office: Graz, Austria',
          `Company register number: ${REGISTER_NUMBER}`,
          'Register court: Landesgericht für Zivilrechtssachen Graz (Regional Court for Civil Matters Graz)',
          // TODO(legal): fill in once issued.
          'VAT identification number: to be added',
        ],
      },
      {
        heading: 'Managing directors',
        body: ['Alexander Kager and Claudio Lipp, each authorised to represent the company individually.'],
      },
      {
        heading: 'Trade licence and chamber membership',
        items: [
          'Member of the Wirtschaftskammer Steiermark (Styrian Chamber of Commerce)',
          'Applicable professional rules: Austrian Trade Regulation Act 1994 (GewO), available at ris.bka.gv.at',
          // TODO(legal): take these three from the GISA extract.
          'Trade licence, professional association and trade authority: to be added',
        ],
      },
      {
        heading: 'Corporate purpose',
        body: [
          'Development, marketing and distribution of sports and leisure equipment, trading in goods of all kinds, organisation and implementation of sports and leisure events, and the acquisition, administration, marketing and exploitation of trademarks, licences and other intellectual property rights.',
        ],
      },
      {
        heading: 'Disclosure under § 25 Austrian Media Act',
        body: [
          `Media owner: ${COMPANY}, ${ADDRESS_EN}`,
          'Managing directors: Alexander Kager and Claudio Lipp',
          'Shareholders: Alexander Kager 55%, Claudio Lipp 35%, Luca Puster 10%',
          'Editorial policy: information about AIRBALL, the AIRBALLER, the products and services offered, sports and leisure events, the AIRBALL community and product- and sports-related news. The website also presents and promotes the products and services of AIRBALL GmbH.',
        ],
      },
      {
        heading: 'Copyright and third-party rights',
        body: [
          'Content published on this website, including trademarks, logos, texts, photographs, videos, graphics and designs, may be protected by copyright, trademark, design or other intellectual property rights. Any use beyond statutory limitations requires the consent of the relevant rights holder. Unless stated otherwise, rights in content created by AIRBALL or validly transferred to AIRBALL are held by AIRBALL GmbH. Third-party rights remain unaffected.',
        ],
      },
      {
        heading: 'Consumer dispute resolution',
        body: [
          'We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board. If something goes wrong, write to us and we will sort it out with you directly.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    updated: 'Last updated: 7 November 2026',
    sections: [
      {
        heading: 'Who is responsible',
        body: [
          `${COMPANY}, ${ADDRESS_EN}, is the controller for the processing described here. For any question about your data, write to ${CONTACT_EMAIL}.`,
          'This notice covers airball.at. Our online shop at shop.airball.at has its own privacy policy, which is linked further down.',
        ],
      },
      {
        heading: 'Signing up for news',
        body: [
          'If you leave your email address on this site, we store it together with the language the site was set to and the time you signed up. If you signed up through the earlier, longer form, we also have the first and last name you entered there.',
          'We also record which link brought you here: the campaign tags in the address, if there were any, and the address of the page you followed a link from, without its query string. This tells us that a signup came from, say, Instagram. It says nothing about who you are, is read only at the moment you submit the form, and is never stored on your device.',
          'We use your address to send you news about AIRBALL by email, such as product launches, dates and offers for the community, and only when there is something worth an email. We do not pass the list to anyone for their own advertising.',
          `The legal basis is your consent under Article 6(1)(a) GDPR. You can withdraw it at any time, through the unsubscribe link in every email or by writing to ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'Where your signup is stored',
        body: [
          'Signups are written into a Google Sheet using a Google Apps Script, operated by Google Ireland Limited, Dublin, Ireland. Google acts as a processor for us, and data may be transferred to servers in the United States on the basis of the EU Commission adequacy decision for the EU-US Data Privacy Framework.',
          'To send our emails, we add the addresses to our customer list at Shopify International Limited, Dublin, Ireland, which is also where our shop runs. Shopify acts as a processor for us. Data may be transferred to Canada, for which an adequacy decision of the EU Commission exists, and to the United States on the basis of the EU-US Data Privacy Framework.',
          'We keep your signup until you unsubscribe or ask us to delete it.',
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
          'Fonts and videos are delivered from our own server, so loading the page sends no request to any external service.',
        ],
      },
      {
        heading: 'Our online shop',
        body: [
          `The links to the shop take you to shop.airball.at, which runs on Shopify. They are ordinary links: nothing is loaded from the shop until you click. Everything you do in the shop, from the basket to payment and delivery, is covered by the shop’s own privacy policy at ${SHOP_PRIVACY}.`,
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
          `Under the GDPR you have the right to access your data, to have it corrected or deleted, to have its processing restricted, to object to processing, and to receive it in a portable format. To exercise any of these, write to ${CONTACT_EMAIL}.`,
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
      'Die UID-Nummer und die Angaben zur Gewerbeberechtigung werden nachgetragen, sobald sie vorliegen.',
    updated: 'Stand: 7. November 2026',
    sections: [
      {
        heading: 'Anbieter und Kontakt',
        body: [COMPANY, ADDRESS_DE, `E-Mail: ${CONTACT_EMAIL}`, `Telefon: ${PHONE}`],
      },
      {
        heading: 'Firmenbuch',
        items: [
          'Rechtsform: Gesellschaft mit beschränkter Haftung',
          'Sitz: Graz, Österreich',
          `Firmenbuchnummer: ${REGISTER_NUMBER}`,
          'Firmenbuchgericht: Landesgericht für Zivilrechtssachen Graz',
          // TODO(legal): nachtragen, sobald vergeben.
          'UID-Nummer: wird nachgetragen',
        ],
      },
      {
        heading: 'Geschäftsführung',
        body: ['Alexander Kager und Claudio Lipp, jeweils einzelvertretungsbefugt.'],
      },
      {
        heading: 'Gewerbe und Kammerzugehörigkeit',
        items: [
          'Mitglied der Wirtschaftskammer Steiermark',
          'Berufsrecht: Gewerbeordnung 1994 (GewO), abrufbar unter ris.bka.gv.at',
          // TODO(legal): aus dem GISA-Auszug übernehmen.
          'Gewerbeberechtigung, Fachorganisation und Gewerbebehörde: werden nachgetragen',
        ],
      },
      {
        heading: 'Unternehmensgegenstand',
        body: [
          'Entwicklung, Vermarktung und Vertrieb von Sport- und Freizeitgeräten, Handel mit Waren aller Art, Organisation und Durchführung von Sport- und Freizeitveranstaltungen sowie Erwerb, Verwaltung, Vermarktung und Verwertung von Marken-, Lizenz- und sonstigen Immaterialgüterrechten.',
        ],
      },
      {
        heading: 'Offenlegung nach § 25 Mediengesetz',
        body: [
          `Medieninhaber: ${COMPANY}, ${ADDRESS_DE}`,
          'Geschäftsführer: Alexander Kager und Claudio Lipp',
          'Gesellschafter: Alexander Kager 55 %, Claudio Lipp 35 %, Luca Puster 10 %',
          'Grundlegende Richtung: Information über AIRBALL, den AIRBALLER, die angebotenen Produkte und Dienstleistungen, Sport- und Freizeitveranstaltungen, die AIRBALL Community sowie produkt- und sportbezogene Neuigkeiten. Die Website dient außerdem der Präsentation und Förderung der Produkte und Leistungen der AIRBALL GmbH.',
        ],
      },
      {
        heading: 'Urheberrecht und Rechte Dritter',
        body: [
          'Die auf dieser Website veröffentlichten Inhalte, insbesondere Marken, Logos, Texte, Fotografien, Videos, Grafiken und Designs, können urheberrechtlich, markenrechtlich, designrechtlich oder durch sonstige Immaterialgüterrechte geschützt sein. Eine Nutzung außerhalb der gesetzlichen Schranken bedarf der Zustimmung des jeweiligen Rechteinhabers. Soweit nicht anders angegeben, liegen die Rechte an von AIRBALL selbst erstellten oder wirksam auf AIRBALL übertragenen Inhalten bei der AIRBALL GmbH. Rechte Dritter bleiben unberührt.',
        ],
      },
      {
        heading: 'Verbraucherschlichtung',
        body: [
          'Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Wenn etwas schiefläuft, schreib uns, dann klären wir das direkt mit dir.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Datenschutz',
    updated: 'Stand: 7. November 2026',
    sections: [
      {
        heading: 'Verantwortlich',
        body: [
          `Verantwortlich für die hier beschriebene Verarbeitung ist die ${COMPANY}, ${ADDRESS_DE}. Bei Fragen zu deinen Daten schreib an ${CONTACT_EMAIL}.`,
          'Diese Erklärung gilt für airball.at. Für unseren Onlineshop unter shop.airball.at gilt dessen eigene Datenschutzerklärung, die weiter unten verlinkt ist.',
        ],
      },
      {
        heading: 'Die Anmeldung für Neuigkeiten',
        body: [
          'Wenn du auf dieser Seite deine E-Mail-Adresse einträgst, speichern wir sie zusammen mit der eingestellten Sprache und dem Zeitpunkt der Anmeldung. Hast du dich über das frühere, ausführlichere Formular eingetragen, haben wir außerdem den Vor- und Nachnamen, den du dort angegeben hast.',
          'Außerdem halten wir fest, über welchen Link du gekommen bist: die Kampagnen-Parameter in der Adresse, falls vorhanden, und die Adresse der Seite, von der aus du den Link angeklickt hast, ohne deren Suchparameter. Damit sehen wir, dass eine Anmeldung zum Beispiel über Instagram kam. Über deine Person sagt das nichts aus, es wird erst im Moment des Absendens ausgelesen und niemals auf deinem Gerät gespeichert.',
          'Wir verwenden deine Adresse, um dir Neuigkeiten zu AIRBALL per E-Mail zu schicken, etwa zum Verkaufsstart, zu Terminen und zu Angeboten für die Community, und nur dann, wenn es etwas gibt, das eine Mail wert ist. Wir geben die Liste nicht an andere für deren Werbung weiter.',
          `Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Du kannst sie jederzeit widerrufen, über den Abmeldelink in jeder Mail oder mit einer Nachricht an ${CONTACT_EMAIL}.`,
        ],
      },
      {
        heading: 'Wo deine Anmeldung gespeichert wird',
        body: [
          'Die Anmeldungen werden über ein Google Apps Script in ein Google Sheet geschrieben, betrieben von Google Ireland Limited, Dublin, Irland. Google ist dabei unser Auftragsverarbeiter. Eine Übermittlung auf Server in den USA ist möglich, gestützt auf den Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework.',
          'Für den Versand unserer Mails übernehmen wir die Adressen in unsere Kundenliste bei Shopify International Limited, Dublin, Irland, wo auch unser Shop läuft. Shopify ist dabei unser Auftragsverarbeiter. Eine Übermittlung nach Kanada ist möglich, wofür ein Angemessenheitsbeschluss der EU-Kommission besteht, sowie in die USA, gestützt auf das EU-US Data Privacy Framework.',
          'Wir speichern deine Anmeldung, bis du dich abmeldest oder die Löschung verlangst.',
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
          'Schriften und Videos liegen auf unserem eigenen Server. Beim Laden der Seite geht also keine Anfrage an einen externen Dienst.',
        ],
      },
      {
        heading: 'Unser Onlineshop',
        body: [
          `Die Links zum Shop führen zu shop.airball.at, der mit Shopify betrieben wird. Das sind gewöhnliche Links: Vor dem Klick wird nichts vom Shop geladen. Für alles, was du im Shop tust, vom Warenkorb über die Zahlung bis zur Lieferung, gilt die Datenschutzerklärung des Shops unter ${SHOP_PRIVACY}.`,
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
          `Nach der DSGVO hast du das Recht auf Auskunft über deine Daten, auf Berichtigung, auf Löschung, auf Einschränkung der Verarbeitung, auf Widerspruch gegen die Verarbeitung und auf Datenübertragbarkeit. Für all das genügt eine Nachricht an ${CONTACT_EMAIL}.`,
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
