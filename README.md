# AIRBALL — airball.at

Index-style one-pager built to AIRBALL Brand Guide V1.0. Court Cream surface,
numbered sections, oversized Big Shoulders titles, mono meta, yellow reserved
for the waitlist block, the ticker and hover highlights.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run typecheck
```

## Changing content — start here

**`src/content/site.ts` holds every piece of copy, in English and German.**
Change a string there and it changes on the site. No component edits needed for:

- headlines, body copy, section numbers and meta labels
- the ticker phrases
- waitlist heading, button, notes and success message
- footer links and location

Media works the same way: drop a new file into `public/media/` and point the
`src` in `site.ts` at it. Keep the paths, swap the files.

| What | Where |
| --- | --- |
| All text (EN + DE) | `src/content/site.ts` |
| Photos and video | `public/media/` |
| Logo mark | `public/brand/` |
| Colors and type scale | `tailwind.config.ts` |
| Waitlist backend hookup | `src/lib/waitlist.ts` |

### Brand rules the copy has to keep

- Headlines never end with a period.
- AIRBALL = the brand, AIRBALLER = the product, AIRBALLERS = the people.
- Yellow stays rare: roughly 70% cream or black surface, 20% type, 10% yellow.
  It is only allowed to fill a surface on the waitlist block and the ticker.

## Language

English is the brand language; German is a deliberate switch in the nav, not an
override. A visitor whose browser prefers German lands on German once, then
their choice is remembered in `localStorage`.

## Motion

`gsap` + `ScrollTrigger` + `Observer` drive the animation, `lenis` drives the
scroll. The two are wired together in `src/hooks/useSmoothScroll.ts` — Lenis
runs off the GSAP ticker and feeds `ScrollTrigger.update`, which is what keeps
scroll-linked motion glued to the content.

What moves:

| Element | Behaviour |
| --- | --- |
| Nav | Gains its surface past 40px; hides scrolling down, returns scrolling up |
| Intro line | Mask reveal on load |
| Section titles, numbers, meta | Mask reveal on scroll enter, staggered |
| Body copy and spec rows | Short rise + fade, staggered |
| Media frames | Scroll-linked parallax inside a 16:10 frame, scale on hover |
| Cursor | Yellow label chip follows the pointer over media (pointer devices only) |
| Ticker | Infinite marquee; speed and skew react to scroll velocity, direction follows scroll |

Every animation is registered inside a `gsap.matchMedia` block keyed to
`prefers-reduced-motion: no-preference`, so switching reduced motion on leaves
all content in its resting, visible state rather than mid-animation.

## Waitlist

Sign-ups are appended to a Google Sheet by an Apps Script web app. Nothing but
a URL lives in the front end, so there are no credentials in the bundle.

**One-time setup**

1. Open the Sheet → **Extensions → Apps Script**.
2. Replace the placeholder file with the contents of
   `scripts/waitlist-sheet.gs` and save.
3. **Deploy → New deployment → Web app**, then set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**

   "Anyone" is what lets a visitor's browser reach it. The script only ever
   appends a row — it cannot read the Sheet back out.
4. Copy the deployment URL (it ends in `/exec`) into `.env.production` as
   `VITE_WAITLIST_ENDPOINT`.
5. Open that URL in a browser. `{"ok":true,"service":"airball-waitlist"}`
   confirms it is live.

Re-deploy after editing the script — **Deploy → Manage deployments → Edit →
Version: New version**. Saving alone does not update the live web app.

`.env.production` is tracked, so `npm run build` picks the endpoint up
everywhere — including Cloudflare's CI. No dashboard build variable needed.
It holds nothing secret: Vite bakes the value into the shipped bundle, so it
is public the moment the site loads, and the script can only append rows, never
read the Sheet back out. Genuine secrets belong in `.env`, which stays ignored.

`npm run dev` deliberately leaves the variable unset, so submitting the form
locally logs to the console instead of writing junk rows into the live Sheet.

Columns are written on first use: timestamp, first name, last name, email,
language. The form also carries a honeypot field, hidden off-screen and out of
the tab order; anything that fills it is accepted and silently dropped.

## Card video

Card 01 plays `public/media/airballer.mp4`, with `airballer.webm` offered first
and `airballer-poster.jpg` as the still before playback. All three are the same
24-second cut in 9:16 portrait.

To replace it, encode the master and drop all three files in:

```bash
ffmpeg -i master.mov -t 24 -c:v libx264 -profile:v high -crf 19 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an public/media/airballer.mp4
ffmpeg -i public/media/airballer.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -row-mt 1 -speed 2 -an public/media/airballer.webm
ffmpeg -i public/media/airballer.mp4 -frames:v 1 -q:v 3 \
  public/media/airballer-poster.jpg
```

`-movflags +faststart` is not optional: without it the browser has to download
the whole file before the first frame appears.

Two traps when exporting the master:

- **Keep it portrait.** The card crops to 9:16. Exporting portrait footage into
  a 16:9 timeline pillarboxes it, and the black bars then have to be cropped
  back off, which throws away most of the horizontal resolution.
- **Do not cap the long axis.** A "1080p" limit applied to portrait footage
  caps the *height*, so 1080×1920 comes out as 608×1080.

## Legal pages

`/imprint` and `/privacy` are real URLs. There is no router: the Worker serves
`index.html` for any unmatched path, `App.tsx` reads `location.pathname`, and
`legalKeyForPath` decides whether to render the site or a legal document. Links
between them are plain `<a>`, so the browser does an ordinary page load.

Both texts live in `src/content/legal.ts`, in German and English, and both are
**provisional and say so on the page**. The privacy notice describes what the
site actually does — waitlist to a Google Sheet, Cloudflare logs, one
localStorage key, no cookies, no analytics, self-hosted fonts. If any of that
changes, that file has to change with it. Adding analytics or an embedded map
or video would also mean needing a consent banner, which the site currently
does not have and does not need.

The imprint is missing the company registration details on purpose; they are
listed on the page as outstanding. Austrian law (ECG §5, MedienG §25) requires
them once the company exists.

## Security

`public/_headers` is read by Cloudflare at deploy time and sets HSTS, CSP,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and
`Permissions-Policy`. `public/.well-known/security.txt` is the RFC 9116 contact
file; its `Expires` date has to stay in the future.

Two notes on the CSP:

- `style-src` needs `'unsafe-inline'` and cannot drop it. GSAP animates by
  writing `element.style` every frame, and inline style attributes fall under
  `style-src`.
- `connect-src` lists both `script.google.com` and
  `script.googleusercontent.com`, because Apps Script answers the waitlist POST
  with a redirect to the second one. Removing either breaks signups silently.

After changing `_headers`, verify before deploying — a broken CSP fails in the
browser, not in the build:

```bash
npm run build
node scripts/serve-with-headers.mjs   # serves dist/ applying _headers
```

### Still to be set in the Cloudflare dashboard

These cannot be done from the repo, because they act on requests before the
assets are reached:

| Setting | Where |
| --- | --- |
| **Always Use HTTPS** | SSL/TLS → Edge Certificates |
| **HSTS** (optional, `_headers` already sends it) | SSL/TLS → Edge Certificates |
| **Bot Fight Mode** | Security → Bots |
| **AI Labyrinth** | Security → Bots |

Always Use HTTPS matters most: HSTS only binds a browser that has already been
served over HTTPS once, so without the redirect a first visit over plain HTTP
is still unprotected.

## Before launch

- [ ] Deploy the waitlist script and set `VITE_WAITLIST_ENDPOINT` — until then
      the form collects nothing.
- [ ] Re-export the card video at full resolution. The current files are a
      608×1080 crop, because the export they were cut from had the portrait
      footage pillarboxed inside a 1920×1080 frame. See *Card video* below.
- [ ] Swap `public/brand/mark-a.jpg` for the SVG A-mark — it is a raster
      placeholder pulled out of the mockup and will look soft on retina.
- [ ] Add real `/imprint` and `/privacy` pages. Both are legally required in
      Austria; the footer links point at routes that do not exist yet.
- [ ] Compress the photos (they ship at full resolution today).
