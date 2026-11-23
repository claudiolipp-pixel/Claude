/**
 * AIRBALL withdrawals → Google Sheet + acknowledgement email
 * ------------------------------------------------------------------
 * The shop's withdrawal function (sections/main-withdrawal.liquid in the
 * Shopify theme) posts here. This script:
 *
 *   1. writes the withdrawal into the sheet it is bound to,
 *   2. sends the customer the acknowledgement the law asks for: what they
 *      withdrew from and when it reached us, by email, straight away,
 *   3. tells sales@airball.at.
 *
 * Setup (once): create a Google Sheet, e.g. "AIRBALL Widerrufe", open
 * Extensions → Apps Script, paste this file, save, then
 * Deploy → New deployment → Web app, "Execute as: Me",
 * "Who has access: Anyone". Copy the web app URL into the theme editor:
 * page template "withdrawal" → section "Widerruf" → "Adresse des
 * Widerrufs-Skripts". Google asks once for permission to send email.
 *
 * After editing, redeploy: Deploy → Manage deployments → Edit →
 * Version: New version. Saving alone does not update the live web app.
 *
 * The email goes out from the Google account that owns the script, with
 * the sender name AIRBALL and replies going to sales@airball.at.
 */

var SHOP_INBOX = 'sales@airball.at';
var TIME_ZONE = 'Europe/Vienna';

var HEADERS = [
  'Eingang',
  'Referenz',
  'Name',
  'E-Mail',
  'Bestellnummer',
  'Umfang',
  'Artikel',
  'Sprache',
  'Bestätigung gesendet',
];

/** Text, not JSON, on purpose: see the waitlist script for why. */
function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);

    var email = String(p.email || '').trim();
    var name = clean(p.name);
    var order = clean(p.order);
    if (!name || !order || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid' });
    }

    var lang = p.lang === 'en' ? 'en' : 'de';
    var some = p.scope === 'some';
    var items = some ? clean(p.items) : '';
    var now = new Date();
    var when = Utilities.formatDate(now, TIME_ZONE, 'dd.MM.yyyy, HH:mm') + ' (' + TIME_ZONE + ')';
    var ref = 'W-' + Utilities.formatDate(now, TIME_ZONE, 'yyyyMMdd-HHmmss') + '-' +
      Math.floor(Math.random() * 9000 + 1000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeaders(sheet);
    sheet.appendRow([now, ref, cell(name), cell(email), cell(order),
      some ? 'Einzelne Artikel' : 'Ganze Bestellung', cell(items), lang, 'nein']);
    var row = sheet.getLastRow();

    var t = TEXT[lang];
    var lines = [
      t.name + ': ' + name,
      t.email + ': ' + email,
      t.order + ': ' + order,
      t.scope + ': ' + (some ? t.some : t.all),
    ];
    if (some) lines.push(t.items + ': ' + items);
    lines.push(t.received + ': ' + when);
    lines.push(t.ref + ': ' + ref);

    MailApp.sendEmail({
      to: email,
      replyTo: SHOP_INBOX,
      name: 'AIRBALL',
      subject: t.subject.replace('{order}', order),
      body: t.intro + '\n\n' + lines.join('\n') + '\n\n' + t.outro,
    });
    sheet.getRange(row, HEADERS.length).setValue('ja');

    MailApp.sendEmail({
      to: SHOP_INBOX,
      replyTo: email,
      name: 'AIRBALL Widerruf',
      subject: 'Widerruf eingegangen: ' + order + ' (' + name + ')',
      body: 'Über die Widerrufsfunktion im Shop eingegangen. Der Kunde hat die ' +
        'Eingangsbestätigung automatisch bekommen.\n\n' +
        TEXT.de.lines(name, email, order, some, items, when, ref) +
        '\n\nNächster Schritt: Rücksendung mit dem Kunden klären und die ' +
        'Erstattung spätestens 14 Tage nach heute veranlassen.',
    });

    return json({ ok: true, ref: ref });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server error' });
  }
}

var TEXT = {
  de: {
    subject: 'Bestätigung deines Widerrufs (Bestellung {order})',
    intro: 'Hallo,\n\nwir bestätigen dir den Eingang deines Widerrufs. ' +
      'Diese Angaben haben wir erhalten:',
    outro: 'Bitte schick die Ware innerhalb von 14 Tagen an:\n' +
      'AIRBALL GmbH, Lange Gasse 47/2, 8010 Graz, Österreich\n\n' +
      'Hast du die Ware noch nicht erhalten (Vorbestellung), musst du nichts ' +
      'zurückschicken. Wir melden uns in den nächsten Tagen mit allem Weiteren ' +
      'und erstatten deine Zahlung spätestens 14 Tage nach Eingang dieses Widerrufs ' +
      '(bei bereits gelieferter Ware, sobald sie bei uns ist oder du die Rücksendung nachweist).\n\n' +
      'Fragen? Antworte einfach auf diese E-Mail.\n\n' +
      'AIRBALL GmbH\nLange Gasse 47/2, 8010 Graz, Österreich\nsales@airball.at',
    name: 'Name', email: 'E-Mail', order: 'Bestellnummer', scope: 'Umfang',
    all: 'Ganze Bestellung', some: 'Einzelne Artikel', items: 'Artikel',
    received: 'Eingegangen am', ref: 'Referenz',
    lines: function (name, email, order, some, items, when, ref) {
      var l = ['Name: ' + name, 'E-Mail: ' + email, 'Bestellnummer: ' + order,
        'Umfang: ' + (some ? 'Einzelne Artikel' : 'Ganze Bestellung')];
      if (some) l.push('Artikel: ' + items);
      l.push('Eingegangen am: ' + when, 'Referenz: ' + ref);
      return l.join('\n');
    },
  },
  en: {
    subject: 'Confirmation of your withdrawal (order {order})',
    intro: 'Hello,\n\nthis confirms that we have received your withdrawal. ' +
      'These are the details we received:',
    outro: 'Please send the goods within 14 days to:\n' +
      'AIRBALL GmbH, Lange Gasse 47/2, 8010 Graz, Austria\n\n' +
      'If you have not received the goods yet (pre-order), there is nothing to ' +
      'send back. We will be in touch within the next few days and will refund ' +
      'your payment no later than 14 days after receiving this withdrawal ' +
      '(for goods already delivered, once they are back with us or you show ' +
      'that you have sent them).\n\n' +
      'Questions? Just reply to this email.\n\n' +
      'AIRBALL GmbH\nLange Gasse 47/2, 8010 Graz, Austria\nsales@airball.at',
    name: 'Name', email: 'Email', order: 'Order number', scope: 'Scope',
    all: 'Whole order', some: 'Some items', items: 'Items',
    received: 'Received on', ref: 'Reference',
  },
};

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function clean(value) {
  var text = String(value == null ? '' : value).trim();
  return text.length > 500 ? text.slice(0, 500) : text;
}

/** A leading =, +, - or @ would turn a cell into a live formula. */
function cell(value) {
  var text = clean(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function doGet() {
  return json({ ok: true, service: 'airball-withdrawal' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
