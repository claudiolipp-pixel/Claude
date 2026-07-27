/**
 * The AIRBALL wordmark, as supplied — the A-mark standing in for the first
 * letter, the rest letterspaced. Never re-set or restretched (Brand Guide 02):
 * this renders the artwork itself, sized by height so the lockup's proportions
 * are fixed.
 *
 * Sizing follows the inherited font-size, so `text-xl` on the parent scales the
 * mark with everything around it. It ships white; over a light surface it is
 * inverted to ink rather than swapped for a second file.
 */
const ASPECT = 1725 / 139;

export default function Wordmark({
  className = '',
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <img
      src="/brand/wordmark.png"
      alt="AIRBALL"
      style={{ height: '0.78em', width: `${(0.78 * ASPECT).toFixed(2)}em` }}
      className={`inline-block max-w-full object-contain transition-[filter] duration-500 ${
        invert ? 'invert' : ''
      } ${className}`}
    />
  );
}
