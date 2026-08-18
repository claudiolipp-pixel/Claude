/**
 * Where the app thinks it is.
 *
 * One line, but its own module for a reason: the shareable single-file preview
 * has no server and no real URLs, so it swaps this file for route.preview.ts
 * through an alias in vite.single.config.ts. Reading location.pathname inline
 * would leave nothing to swap, and the preview could only ever show the home
 * page.
 */
export function currentPath(): string {
  return window.location.pathname;
}
