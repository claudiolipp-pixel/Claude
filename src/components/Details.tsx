import { useLanguage } from '@/i18n/LanguageProvider';
import { useMaskReveal, useFadeUp } from '@/hooks/useReveal';

/**
 * The breather between the dark card stack and the waitlist. Court Cream, the
 * brand's light surface — body copy and the hard numbers, set as a credits-style
 * list where the label sits opposite its value.
 */
export default function Details() {
  const { content } = useLanguage();
  const headRef = useMaskReveal<HTMLDivElement>();
  const listRef = useFadeUp<HTMLDivElement>(0.07);

  const withSpecs = content.works.find((w) => w.specs?.length);

  return (
    <section
      data-surface="light"
      className="relative z-10 bg-cream px-5 py-20 text-court md:px-10 md:py-28"
    >
      <div ref={headRef} className="max-w-[720px]">
        <h2 className="display text-[clamp(40px,7vw,84px)]">
          <span className="reveal-mask">
            <span className="reveal-line" data-reveal-line>
              {content.detailsTitle}
            </span>
          </span>
        </h2>
        <p className="mt-5 max-w-[560px] text-court/70">{content.intro}</p>
      </div>

      <div ref={listRef} className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
        <div className="max-w-[560px] space-y-5">
          {content.works.map((work) => (
            <p key={work.id} data-reveal-item className="text-court/80">
              {work.body}
            </p>
          ))}
        </div>

        {withSpecs?.specs && (
          <ul className="h-fit list-none border-t border-court/15">
            {withSpecs.specs.map((spec) => (
              <li
                key={spec.label}
                data-reveal-item
                className="flex items-baseline justify-between gap-6 border-b border-court/15 py-3.5 text-xs uppercase tracking-[0.1em]"
              >
                <span className="text-court/60">( {spec.label} )</span>
                <span className="text-right font-medium">{spec.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
