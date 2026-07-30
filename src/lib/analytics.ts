/**
 * Cloudflare Web Analytics.
 *
 * Chosen because it sets no cookie, writes nothing to the device and builds no
 * fingerprint, which is what lets the site run without a consent banner. The
 * practical upside of that is not just less paperwork: nobody has to opt in, so
 * the numbers cover every visitor rather than the fraction who accept a banner.
 *
 * What it gives: visits, page views, referrers, countries, browsers, devices
 * and Core Web Vitals. What it does not: custom events. There is no way to tell
 * it "this visitor signed up", so conversion is measured by comparing signups
 * in the Sheet against visits here. Attribution per signup is handled entirely
 * separately, in attribution.ts.
 *
 * The token is not a secret; it identifies the site to Cloudflare and is
 * visible in the page source of every site using this product.
 */

const TOKEN = import.meta.env.VITE_CF_BEACON_TOKEN as string | undefined;

const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

/**
 * Injects the beacon, if a token is configured.
 *
 * Injecting from script rather than hardcoding a tag in index.html keeps the
 * markup free of a half-configured beacon: with no token, nothing loads and
 * nothing is requested. Local development therefore reports nothing, so real
 * numbers are not polluted while working on the site.
 *
 * Cloudflare can also inject this at the edge, configured purely in the
 * dashboard. Both routes need the same Content-Security-Policy entries in
 * public/_headers, which is the part that is easy to miss: without them the
 * browser blocks the beacon and the dashboard silently stays empty.
 */
export function startAnalytics(): void {
  if (!TOKEN) return;
  if (document.querySelector(`script[src="${BEACON_SRC}"]`)) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = BEACON_SRC;
  script.dataset.cfBeacon = JSON.stringify({ token: TOKEN });
  document.head.appendChild(script);
}
