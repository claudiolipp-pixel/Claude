import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface CursorValue {
  setLabel: (label: string | null) => void;
}

const CursorContext = createContext<CursorValue>({ setLabel: () => undefined });

/**
 * A single label chip that follows the pointer and only appears over media.
 * quickTo keeps the follow interpolated rather than snapped, which is what
 * makes it read as a deliberate object instead of a second cursor.
 *
 * Pointer-only: hidden entirely on touch and under reduced motion.
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabelState] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  const setLabel = useCallback((next: string | null) => setLabelState(next), []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = dotRef.current;
    if (!enabled || !el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  useEffect(() => {
    const el = dotRef.current;
    if (!enabled || !el) return;
    gsap.to(el, {
      scale: label ? 1 : 0,
      autoAlpha: label ? 1 : 0,
      duration: 0.35,
      ease: 'power3.out',
    });
  }, [label, enabled]);

  return (
    <CursorContext.Provider value={{ setLabel }}>
      {children}
      {enabled && (
        <div
          ref={dotRef}
          aria-hidden="true"
          className="label pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 scale-0 bg-butter px-3 py-2 text-court opacity-0"
        >
          {label}
        </div>
      )}
    </CursorContext.Provider>
  );
}

/** Spread the returned props onto any element that should summon the label. */
export function useCursorTarget(label: string) {
  const { setLabel } = useContext(CursorContext);
  return {
    onMouseEnter: () => setLabel(label),
    onMouseLeave: () => setLabel(null),
  };
}
