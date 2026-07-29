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
4. Copy the deployment URL (it ends in `/exec`) into `.env` as
   `VITE_WAITLIST_ENDPOINT`, and set the same variable in your host's build
   settings.
5. Open that URL in a browser. `{"ok":true,"service":"airball-waitlist"}`
   confirms it is live.

Re-deploy after editing the script — **Deploy → Manage deployments → Edit →
Version: New version**. Saving alone does not update the live web app.

With the variable unset, submissions are logged to the console and discarded,
so the form stays demonstrable locally without writing to the live Sheet.

Columns are written on first use: timestamp, first name, last name, email,
language. The form also carries a honeypot field, hidden off-screen and out of
the tab order; anything that fills it is accepted and silently dropped.

## Before launch

- [ ] Deploy the waitlist script and set `VITE_WAITLIST_ENDPOINT` — until then
      the form collects nothing.
- [ ] Replace the placeholder video in `public/media/airballer.mp4`, and add a
      `poster` frame to the video entry in `site.ts` so there is a still image
      before playback starts.
- [ ] Swap `public/brand/mark-a.jpg` for the SVG A-mark — it is a raster
      placeholder pulled out of the mockup and will look soft on retina.
- [ ] Add real `/imprint` and `/privacy` pages. Both are legally required in
      Austria; the footer links point at routes that do not exist yet.
- [ ] Compress the photos (they ship at full resolution today).
