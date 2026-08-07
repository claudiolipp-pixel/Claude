/**
 * Where a signup came from.
 *
 * Read once when the page loads and held in memory only. Nothing is written to
 * the device: no cookie, no localStorage, no sessionStorage. That is what keeps
 * the site free of a consent banner, and it is why the privacy notice can still
 * say the site stores nothing but the language choice.
 *
 * The trade-off is deliberate. Attribution lives for one page load, so a
 * visitor who detours to /privacy and comes back counts as `direct` from then
 * on. Almost every signup happens on the page the visitor landed on, so this
 * costs very little and buys a lot: it travels with the form the visitor
 * submits rather than through a tracking script, which means it works inside
 * the Instagram in-app browser and survives every ad blocker.
 */

export interface Attribution {
  /** utm_source, else derived from the referrer, else `direct`. */
  source: string;
  medium: string;
  campaign: string;
  /** Referring page without its query string. Empty when opened directly. */
  referrer: string;
}

/**
 * Hosts worth naming. Instagram and LinkedIn matter most: links from a bio or
 * a post usually arrive with no UTM tags at all, so without this they would all
 * collapse into `direct` and tell you nothing.
 */
const KNOWN_HOSTS: [RegExp, string][] = [
  [/(^|\.)(l\.)?instagram\.com$/, 'instagram'],
  [/(^|\.)(lnkd\.in|linkedin\.com)$/, 'linkedin'],
  [/(^|\.)(facebook\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'twitter'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)youtube\.com$/, 'youtube'],
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
  [/(^|\.)duckduckgo\.com$/, 'duckduckgo'],
];

/**
 * Drops control characters and caps the length, so a hand-edited link cannot
 * push something unreadable into the Sheet. Written as a codepoint test rather
 * than a regex because a control-character class is easy to mistype into a
 * range that eats ordinary punctuation.
 */
function clean(value: string): string {
  let out = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x20 && code !== 0x7f) out += char;
  }
  return out.trim().slice(0, 80);
}

function sourceFromReferrer(referrer: string): { source: string; referrer: string } {
  if (!referrer) return { source: 'direct', referrer: '' };

  try {
    const url = new URL(referrer);

    // Our own pages are not a source. Coming back from /privacy is a detour,
    // not a channel.
    if (url.host === window.location.host) return { source: 'direct', referrer: '' };

    const known = KNOWN_HOSTS.find(([pattern]) => pattern.test(url.host));
    return {
      source: known ? known[1] : clean(url.host.replace(/^www\./, '')),
      // Query strings on the referring page belong to that site, not to us.
      referrer: clean(url.origin + url.pathname),
    };
  } catch {
    return { source: 'direct', referrer: '' };
  }
}

/**
 * Short entry points, so a link can be tagged without looking tagged.
 *
 * `airball.at/ig` fits in an Instagram bio where a 70-character utm string
 * does not, and it is the only way to attribute a poster, a QR code or a
 * business card at all: print carries no referrer, so without this every
 * scanned code arrives indistinguishable from someone typing the domain.
 *
 * They also separate placements the referrer cannot tell apart. A bio link, a
 * story sticker and a post all report themselves as instagram.com; only the
 * link itself knows which one it was.
 *
 * Any path not listed here falls through to the normal page, so adding one is
 * safe and removing one only costs the distinction.
 */
const SHORT_LINKS: Record<string, { source: string; medium: string }> = {
  '/ig': { source: 'instagram', medium: 'bio' },
  '/igs': { source: 'instagram', medium: 'story' },
  '/igp': { source: 'instagram', medium: 'post' },
  '/li': { source: 'linkedin', medium: 'profile' },
  '/lip': { source: 'linkedin', medium: 'post' },
  '/qr': { source: 'print', medium: 'qr' },
  '/card': { source: 'print', medium: 'card' },
  '/mail': { source: 'email', medium: 'signature' },
};

/** Matches how legalKeyForPath reads the path, so a trailing slash is fine. */
export function shortLinkForPath(pathname: string) {
  return SHORT_LINKS[pathname.replace(/\/+$/, '').toLowerCase() || '/'] ?? null;
}

function capture(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const utm = (key: string) => clean(params.get(key) ?? '');

  const short = shortLinkForPath(window.location.pathname);
  const fromReferrer = sourceFromReferrer(document.referrer);

  return {
    /*
     * Most explicit wins. A hand-written utm tag beats the short link it was
     * put on, and both beat whatever the browser happens to report, which is
     * the least reliable of the three.
     */
    source: utm('utm_source') || short?.source || fromReferrer.source,
    medium: utm('utm_medium') || short?.medium || '',
    campaign: utm('utm_campaign'),
    referrer: fromReferrer.referrer,
  };
}

/**
 * Captured at import time, because the parameters have to be read before any
 * later navigation can drop them from the address bar.
 */
export const ATTRIBUTION: Attribution = capture();
