import { useState, type FormEvent } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useMaskReveal, useFadeUp } from '@/hooks/useReveal';
import { submitWaitlist } from '@/lib/waitlist';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * The conversion block — the one place the brand guide allows yellow to fill a
 * full surface (03, Usage logic).
 */
export default function Waitlist() {
  const { content } = useLanguage();
  const headRef = useMaskReveal<HTMLDivElement>();
  const formRef = useFadeUp<HTMLDivElement>(0.08);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const t = content.waitlist;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.errorInvalid);
      return;
    }

    setStatus('submitting');
    const result = await submitWaitlist(email);

    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setError(t.errorGeneric);
    }
  }

  return (
    <section id="waitlist" className="bg-butter px-5 pb-24 pt-20 text-court md:px-10 md:pb-32 md:pt-28">
      <div ref={headRef}>
        <span className="label block text-court/55">
          <span className="reveal-mask">
            <span className="reveal-line" data-reveal-line>
              04 — {t.eyebrow}
            </span>
          </span>
        </span>
        <h2 className="display mt-2 text-[clamp(54px,12vw,140px)]">
          <span className="reveal-mask">
            <span className="reveal-line" data-reveal-line>
              {t.title}
            </span>
          </span>
        </h2>
      </div>

      <div ref={formRef}>
        <p className="mt-4 max-w-[520px]" data-reveal-item>
          {t.body}
        </p>

        {status === 'success' ? (
          <div className="mt-8 max-w-[560px] border border-court p-5" role="status">
            <b className="label font-medium">{t.successTitle}</b>
            <p className="mt-2 text-[13px]">{t.successBody}</p>
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="mt-8 flex max-w-[560px] flex-wrap" data-reveal-item noValidate>
              <label htmlFor="wl-email" className="sr-only">
                {t.placeholder}
              </label>
              <input
                id="wl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'wl-error' : undefined}
                className="flex-[1_1_250px] border border-court bg-cream px-4 py-4 font-mono text-[13px] tracking-[0.05em] outline-none focus:shadow-[inset_0_0_0_1px_theme(colors.court)]"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="label border border-court bg-court px-6 py-4 font-medium text-butter transition-colors hover:bg-cream hover:text-court disabled:opacity-60"
              >
                {t.cta}
              </button>
            </form>

            {error && (
              <p id="wl-error" role="alert" className="label mt-3 text-court">
                {error}
              </p>
            )}

            <p className="label mt-3 text-court/55">{t.note}</p>
          </>
        )}
      </div>
    </section>
  );
}
