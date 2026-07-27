import { useLanguage } from '@/i18n/LanguageProvider';
import { useMaskReveal } from '@/hooks/useReveal';

/**
 * The opening statement. Plays on load rather than on scroll — it is already
 * in view, and waiting for a trigger that never fires would leave it hidden.
 */
export default function Intro() {
  const { content } = useLanguage();
  const ref = useMaskReveal<HTMLElement>({ immediate: true, delay: 0.25 });

  return (
    <section ref={ref} className="px-5 pb-6 pt-[120px] md:px-10 md:pb-8 md:pt-[150px]">
      <p className="max-w-[620px] text-sm">
        <span className="reveal-mask">
          <span className="reveal-line" data-reveal-line>
            <span className="bg-butter px-1 text-court">✻</span> {content.intro}
          </span>
        </span>
      </p>
    </section>
  );
}
