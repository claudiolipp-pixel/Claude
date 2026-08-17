import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The product slideshow.
 *
 * A court that packs into a backpack is not a thing anyone has seen before, so
 * the gallery is the sales argument: what you get as a whole, then each part on
 * its own so it can be counted, then the thing in a real game. Someone about to
 * spend three hundred euro wants to check that the pump is really included.
 *
 * Everything is a real control. Arrows, thumbnails, arrow keys and a swipe all
 * reach the same state, because on a phone people swipe without looking for a
 * button, and on a desktop they use the keyboard once they know they can.
 */
interface ProductGalleryProps {
  images: string[];
  /** Product name, used to build a caption for each frame. */
  name: string;
  labels: { counter: string; previous: string; next: string };
}

export default function ProductGallery({ images, name, labels }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  // Arrow keys, but only while the gallery has focus, so they still scroll the
  // page everywhere else.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || total < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go, index, total]);

  /*
   * Swipe. Tracked on the element rather than through a library: one pointer,
   * one threshold. The 40px floor keeps a tap from counting as a swipe, and a
   * mostly-vertical drag is left alone so the page can still scroll.
   */
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start || total < 2) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(index + (dx < 0 ? 1 : -1));
  };

  const caption = (i: number) =>
    `${name}, ${labels.counter.replace('{n}', String(i + 1)).replace('{total}', String(total))}`;

  return (
    <div>
      <div
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={name}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative touch-pan-y overflow-hidden rounded-xl bg-court focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-court md:rounded-2xl"
      >
        {/*
          All frames stay mounted and stacked, and only opacity changes. Swapping
          the src would show a flash of empty frame on a slow connection, which
          is exactly when a buyer is least patient.
        */}
        <div className="relative aspect-[4/5]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={caption(i)}
              // The first frame is the one the page is judged on, so it is not
              // deferred; the rest can wait.
              loading={i === 0 ? 'eager' : 'lazy'}
              aria-hidden={i !== index}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={labels.previous}
              className="label absolute left-3 top-1/2 -translate-y-1/2 bg-cream/90 px-3 py-4 text-court transition-colors hover:bg-butter focus-visible:bg-butter"
            >
              <span aria-hidden="true">&#8592;</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
              className="label absolute right-3 top-1/2 -translate-y-1/2 bg-cream/90 px-3 py-4 text-court transition-colors hover:bg-butter focus-visible:bg-butter"
            >
              <span aria-hidden="true">&#8594;</span>
            </button>

            <span className="label absolute bottom-3 right-3 bg-court/75 px-2.5 py-1.5 tabular-nums text-chalk">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails, so the number of parts is visible without clicking through
          the whole strip. */}
      {total > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => go(i)}
              aria-label={caption(i)}
              aria-current={i === index}
              className={`h-16 w-16 overflow-hidden rounded-lg bg-court transition-opacity md:h-[70px] md:w-[70px] ${
                i === index ? 'opacity-100 ring-2 ring-court ring-offset-2 ring-offset-cream' : 'opacity-55 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Announced to screen readers when the frame changes, since the visual
          counter tells them nothing. */}
      <p className="sr-only" aria-live="polite">
        {caption(index)}
      </p>
    </div>
  );
}
