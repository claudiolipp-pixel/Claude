/**
 * ROUTING FOR THE SINGLE-FILE PREVIEW ONLY. Never bundled into the real site.
 *
 * vite.single.config.ts aliases '@/lib/route' to this file. The preview is one
 * HTML file opened from disk or served at a fixed artifact URL, so
 * location.pathname is never '/shop' and following a link would leave the page
 * altogether. The path moves into the hash instead, which no server has to
 * know about.
 */

/** '#/shop/premium' -> '/shop/premium'. Anything else is the home page. */
export function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
}

/*
 * Turn absolute links into hash changes. Only paths starting with a slash:
 * the home page uses '#game' and friends as ordinary anchors, and those have
 * to keep scrolling rather than navigating.
 */
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
  const link = (event.target as Element | null)?.closest?.('a');
  const href = link?.getAttribute('href');
  if (!href || !href.startsWith('/')) return;
  event.preventDefault();
  window.location.hash = href;
});

/*
 * The app reads the path once per render, so a hash change has to remount.
 * Reloading is the blunt way to do that and the right one here: everything is
 * already inlined in this document, so there is nothing to fetch again.
 *
 * Guarded on the path actually changing, or clicking an anchor on the home
 * page would reload the page instead of scrolling to the section.
 */
let last = currentPath();
window.addEventListener('hashchange', () => {
  if (currentPath() === last) return;
  last = currentPath();
  window.location.reload();
});
