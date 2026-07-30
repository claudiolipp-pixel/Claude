/**
 * Serves dist/ with the response headers from public/_headers applied.
 *
 * `vite preview` ignores _headers, so a broken CSP would only show up once the
 * site is live. This is the local stand-in for the Cloudflare edge: build,
 * run this, and load http://localhost:4190 with the console open.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolved from this file, so the script works from any cwd.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// Parse the real _headers file, so the test exercises what ships.
function parseHeaders(file) {
  const rules = [];
  let current = null;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      current = { pattern: raw.trim(), headers: [] };
      rules.push(current);
    } else if (current) {
      const i = raw.indexOf(':');
      current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    }
  }
  return rules;
}
const RULES = parseHeaders(path.join(ROOT, '_headers'));
console.log('rules:', RULES.map((r) => `${r.pattern} (${r.headers.length})`).join(', '));

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg',
  '.png':'image/png', '.mp4':'video/mp4', '.webm':'video/webm', '.woff2':'font/woff2', '.woff':'font/woff', '.txt':'text/plain' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  for (const rule of RULES) {
    const re = new RegExp('^' + rule.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
    if (re.test(url.pathname)) for (const [k, v] of rule.headers) res.setHeader(k, v);
  }
  res.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
  res.end(fs.readFileSync(file));
}).listen(4190, () => console.log('serving dist with _headers on 4190'));
