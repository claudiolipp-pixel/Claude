/**
 * The AIRBALL wordmark: the A-mark standing in for the first letter, followed
 * by the rest set in Big Shoulders 900 and letterspaced (Brand Guide 02).
 *
 * Sizing follows the inherited font-size — set `text-2xl` (or any size) on the
 * element that renders this and the mark scales with the type. The mark is
 * held at cap height so it sits on the same line as the letters beside it.
 *
 * NOTE: this is a reconstruction of the lockup from its written spec, not the
 * supplied artwork. Swap in the real wordmark file when it arrives; the brand
 * guide says the wordmark is never to be re-set.
 */
export default function Wordmark({
  className = '',
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label="AIRBALL"
      /* items-baseline puts the mark's bottom edge on the type's baseline,
         which is what a cap-height mark standing in for a letter needs. */
      className={`inline-flex items-baseline leading-none ${className}`}
    >
      <img
        src="/brand/mark-a.png"
        alt=""
        aria-hidden="true"
        className={`w-auto transition-[filter] duration-500 ${invert ? 'invert' : ''}`}
        style={{ height: '0.72em', marginRight: '0.12em' }}
      />
      <span aria-hidden="true" className="font-display font-black uppercase tracking-wordmark">
        irball
      </span>
    </span>
  );
}
