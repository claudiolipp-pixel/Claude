/**
 * AIRBALL waitlist → Google Sheet
 * ------------------------------------------------------------------
 * Paste this into the Sheet's own Apps Script editor
 * (Extensions → Apps Script), then deploy it as a Web app.
 * Full instructions are in README.md under "Waitlist".
 *
 * It is bound to the spreadsheet it lives in, so there is no ID to keep
 * in sync — moving or renaming the Sheet does not break it.
 */

/** Written once, if the sheet is still empty. */
var HEADERS = ['Timestamp', 'First name', 'Last name', 'Email', 'Language'];

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
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      String(payload.firstName || '').trim(),
      String(payload.lastName || '').trim(),
      email,
      String(payload.lang || '').trim(),
    ]);

    return json({ ok: true });
  } catch (err) {
    // Logged to the Apps Script execution log, never shown to the visitor.
    console.error(err);
    return json({ ok: false, error: 'server error' });
  }
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
