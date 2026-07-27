/**
 * Bundles the site into ONE self-contained HTML file for sharing previews.
 *
 *   npm run preview:single   ->  airball-preview.html
 *
 * Everything is embedded as data URIs — fonts, photos, video, JS, CSS — so the
 * file opens anywhere, including offline, with zero external requests. Handy
 * for sending a build to someone without deploying it.
 *
 * Not part of the deployed app; the real build is `npm run build`.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist-single');
const OUT = join(ROOT, 'airball-preview.html');

const MIME = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

const dataUri = (absPath) => {
  const ext = absPath.split('.').pop().toLowerCase();
  const b64 = readFileSync(absPath).toString('base64');
  return `data:${MIME[ext] ?? 'application/octet-stream'};base64,${b64}`;
};

if (!existsSync(DIST)) {
  console.error('dist-single/ missing — run this through `npm run preview:single`.');
  process.exit(1);
}

// Map every file under public/ to its data URI, keyed by its served path.
const publicMap = new Map();
for (const dir of ['media', 'brand']) {
  const abs = join(ROOT, 'public', dir);
  if (!existsSync(abs)) continue;
  for (const file of readdirSync(abs)) {
    publicMap.set(`/${dir}/${file}`, dataUri(join(abs, file)));
  }
}

const assetsDir = join(DIST, 'assets');
const files = readdirSync(assetsDir);
const jsName = files.find((f) => f.endsWith('.js'));
const cssName = files.find((f) => f.endsWith('.css'));

let js = readFileSync(join(assetsDir, jsName), 'utf8');
const css = readFileSync(join(assetsDir, cssName), 'utf8');
let html = readFileSync(join(DIST, 'index.html'), 'utf8');

// Longest path first so no prefix collides.
const paths = [...publicMap.keys()].sort((a, b) => b.length - a.length);

/*
 * In the bundle each asset is a quoted string literal, and the same file is
 * often referenced from several places. Substituting the data URI at every
 * occurrence duplicates megabytes of base64, so each asset is hoisted into one
 * const and the literals become references to it.
 */
const decls = [];
paths.forEach((p, i) => {
  const ident = `__ASSET_${i}`;
  const before = js.length;
  for (const quote of ['"', "'", '`']) {
    js = js.split(`${quote}${p}${quote}`).join(ident);
  }
  if (js.length !== before) decls.push(`const ${ident}=${JSON.stringify(publicMap.get(p))};`);
});
js = `${decls.join('\n')}\n${js}`;

// Any literal the quoting pass missed still has to resolve.
for (const p of paths) js = js.split(p).join(publicMap.get(p));

// The HTML shell references assets in attributes, which need the URI inline.
for (const p of paths) html = html.split(p).join(publicMap.get(p));

// Drop the built <script>/<link> tags; their contents get re-emitted inline.
html = html
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '')
  .replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '')
  .replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '');

// Replacement FUNCTIONS, not strings: a string replacement would interpret
// `$&`, `$'` and `` $` `` inside the minified bundle and splice chunks of the
// surrounding HTML into the script, which breaks it at parse time.
html = html
  .replace('</head>', () => `<style>\n${css}\n</style>\n</head>`)
  .replace('</body>', () => `<script type="module">\n${js}\n</script>\n</body>`);

writeFileSync(OUT, html);

const leftover = paths.filter((p) => html.includes(`"${p}"`));
const external = /(?:src|href)="(?:https?:)?\/\/[^"]+"/.exec(html)?.[0];

console.log(`wrote ${OUT}`);
console.log(`size  ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`);
console.log(`un-inlined public refs: ${leftover.length ? leftover.join(', ') : 'none'}`);
console.log(`external references:    ${external ?? 'none'}`);

if (leftover.length || external) {
  console.error('\nFile is not self-contained — fix the references above.');
  process.exit(1);
}
