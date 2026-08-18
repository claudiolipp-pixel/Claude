/**
 * Turns the studio masters into the web-sized product photography.
 *
 *   node scripts/product-photos.mjs <dir-with-masters>
 *
 * The masters are 2MB-6MB PNGs at up to 2048px. They are not in the repo:
 * they live with the rest of the photography, and only the derived WebP goes
 * into public/media/shop. Re-run this when a master is re-shot.
 *
 * WHY THE SITE SERVES THESE AND NOT SHOPIFY
 * The other product shots come from Shopify's CDN, which resizes on request.
 * These four do not exist there, and the group shot is the one image the shop
 * needs most, so they are served from our own origin instead. `img-src 'self'`
 * already covers that, and it means the shop is not waiting on an upload.
 *
 * EVERY FRAME IN THE SHOP IS 4:5
 * Both the grid tile and the gallery are aspect-[4/5] with object-cover, so an
 * image at another ratio gets cropped by the browser, centred, sight unseen.
 * Cropping here instead means the crop is a decision rather than an accident.
 * Two ways to reach 4:5, chosen per photo by whether the subject fits:
 *
 *  - crop    when the subject leaves room at the sides
 *  - extend  when it does not. The studio backdrop is near-uniform across any
 *            given row (measured: under 13/255 spread on the top and bottom
 *            rows of every master here), so the edge row is stretched into the
 *            new space. That continues the backdrop instead of butting a flat
 *            colour against a gradient.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/media/shop');

/** The rungs `sized()` in src/content/shop.ts can ask for. */
const WIDTHS = [200, 400, 700, 1000, 1400];
const RATIO = 4 / 5;

/*
 * Subject bounds were measured off the masters (dark pixels against the light
 * backdrop) rather than guessed, and the crops below are derived from them.
 */
const PHOTOS = [
  {
    // Court, hand pump, backpack and battery pump together: everything in the
    // Premium bundle in one frame. The subject spans 1628 of 1920px, so a 4:5
    // crop would cut the hand pump off at the right. Extend instead.
    name: 'group-premium',
    file: 'IMG_2353.webp',
    fit: 'extend',
  },
  {
    // The battery pump alone. Subject sits centre, so the sides can go.
    name: 'battery-pump',
    file: 'IMG_2354.webp',
    fit: 'crop',
  },
  {
    // The court itself, photographed rather than rendered: face on, logo up.
    // 752x1344 is far taller than 4:5. The court sits low in the frame with
    // deliberate space above it, so the crop is anchored to the bottom, which
    // keeps the floor and most of the headroom.
    name: 'court-front',
    file: 'Black_1.png',
    fit: 'crop',
    anchor: 'bottom',
  },
  {
    // The same court edge on, which is how it packs. Same crop as court-front
    // on purpose: the two are shown next to each other and a matching frame
    // makes them read as one product from two sides.
    name: 'court-side',
    file: 'Black_3.png',
    fit: 'crop',
    anchor: 'bottom',
  },
  {
    // Hand pump, hose laid out. Subject spans 657-1562 of 2048, well inside a
    // 4:5 column.
    name: 'hand-pump',
    file: 'hand-pump.png',
    fit: 'crop',
  },
  {
    // Backpack lying down, three-quarter. The widest subject in the set at
    // 176-1873 of 2048: a 4:5 crop cuts a strap off each end, so extend.
    name: 'pack-side',
    file: 'pack-side.png',
    fit: 'extend',
  },
  {
    // The same backpack standing, so the depth is readable. Narrow subject.
    name: 'pack-upright',
    file: 'pack-upright.png',
    fit: 'crop',
  },
  {
    // Close-up of the logo on the fabric. Edge-to-edge texture with no
    // subject, so this one is cropped even though the measurement calls it
    // full-width: stretching an edge row of woven fabric would smear.
    name: 'pack-logo',
    file: 'pack-logo.png',
    fit: 'crop',
  },
];

/** Tiles the top and bottom rows outward until the frame is 4:5. */
async function extendToRatio(img, width, height) {
  const target = Math.round(width / RATIO);
  const pad = target - height;
  if (pad <= 0) return img;
  const top = Math.floor(pad / 2);
  const bottom = pad - top;

  const strip = async (y, h) =>
    sharp(await img.clone().extract({ left: 0, top: y, width, height: 1 }).png().toBuffer())
      .resize(width, h, { fit: 'fill' })
      .png()
      .toBuffer();

  return sharp(await img.clone().png().toBuffer())
    .extend({ top, bottom, left: 0, right: 0, background: '#ffffff' })
    .composite([
      { input: await strip(0, top), top: 0, left: 0 },
      { input: await strip(height - 1, bottom), top: top + height, left: 0 },
    ]);
}

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/product-photos.mjs <dir-with-masters>');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

for (const photo of PHOTOS) {
  const master = sharp(join(src, photo.file)).removeAlpha();
  const { width, height } = await master.metadata();

  let framed;
  if (photo.fit === 'extend') {
    framed = await extendToRatio(master, width, height);
  } else if (width / height > RATIO) {
    // Too wide: take a centred column.
    const w = Math.round(height * RATIO);
    framed = master.clone().extract({ left: Math.round((width - w) / 2), top: 0, width: w, height });
  } else {
    // Too tall: take a row, from the bottom or the middle.
    const h = Math.round(width / RATIO);
    const top = photo.anchor === 'bottom' ? height - h : Math.round((height - h) / 2);
    framed = master.clone().extract({ left: 0, top, width, height: h });
  }

  const base = await framed.png().toBuffer();
  for (const w of WIDTHS) {
    const out = join(OUT, `${photo.name}-${w}.webp`);
    const info = await sharp(base)
      .resize(w, Math.round(w / RATIO), { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(out);
    if (w === WIDTHS.at(-1)) {
      console.log(`${photo.name.padEnd(14)} ${width}x${height} -> ${info.width}x${info.height}`);
    }
  }
}
