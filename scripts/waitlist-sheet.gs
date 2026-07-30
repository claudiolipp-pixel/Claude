/**
 * AIRBALL waitlist → Google Sheet
 * ------------------------------------------------------------------
 * Paste this into the Sheet's own Apps Script editor
 * (Extensions → Apps Script), then deploy it as a Web app.
 * Full instructions are in README.md under "Waitlist".
 *
 * It is bound to the spreadsheet it lives in, so there is no ID to keep
 * in sync — moving or renaming the Sheet does not break it.
 *
 * After editing, redeploy: Deploy → Manage deployments → Edit →
 * Version: New version. Saving alone does not update the live web app.
 */

/**
 * Written on first use, and extended in place when this list grows. The last
 * four say where the signup came from; see src/lib/attribution.ts.
 */
var HEADERS = [
  'Timestamp',
  'First name',
  'Last name',
  'Email',
  'Language',
  'Source',
  'Medium',
  'Campaign',
  'Referrer',
];

/**
 * The form posts JSON as text/plain on purpose. A JSON content type would
 * make the browser send a CORS preflight, which Apps Script web apps do not
 * answer — the request would fail before it ever reached this function.
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // Honeypot: a field hidden from people but filled in by scrapers. Accept
    // the request so the bot sees success, and write nothing.
    if (payload.company) {
      return json({ ok: true });
    }

    var email = String(payload.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid email' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeaders(sheet);

    sheet.appendRow([
      new Date(),
      cell(payload.firstName),
      cell(payload.lastName),
      cell(email),
      cell(payload.lang),
      cell(payload.source),
      cell(payload.medium),
      cell(payload.campaign),
      cell(payload.referrer),
    ]);

    return json({ ok: true });
  } catch (err) {
    // Logged to the Apps Script execution log, never shown to the visitor.
    console.error(err);
    return json({ ok: false, error: 'server error' });
  }
}

/**
 * Writes the header row on an empty sheet, and widens it if HEADERS has grown
 * since the sheet was created. Without the second half, columns added later
 * would start filling with data under blank headings on a sheet that already
 * has signups in it.
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }

  var width = sheet.getLastColumn();
  if (width >= HEADERS.length) return;

  var missing = HEADERS.slice(width);
  sheet.getRange(1, width + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
}

/**
 * Spreadsheets treat a leading =, +, - or @ as a formula, so a crafted signup
 * could otherwise write a working formula into the Sheet and run when opened.
 * Prefixing with an apostrophe forces the value to stay text; the apostrophe
 * itself is not part of the cell's contents.
 */
function cell(value) {
  var text = String(value == null ? '' : value).trim();
  if (text.length > 200) text = text.slice(0, 200);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** Lets you confirm the deployment is live by opening its URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'airball-waitlist' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
