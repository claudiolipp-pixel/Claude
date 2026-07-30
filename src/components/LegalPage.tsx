import { useEffect } from 'react';
import { LEGAL, type LegalKey } from '@/content/legal';
import { useLanguage } from '@/i18n/LanguageProvider';
import Wordmark from '@/components/Wordmark';

interface LegalPageProps {
  which: LegalKey;
}

/**
 * Imprint and privacy, on their own URLs.
 *
 * These are the two pages that have to be reachable and readable rather than
 * atmospheric, so they skip the loader, the smooth scroll and the cursor
 * entirely and are a plain document on the Court Cream reading surface.
 */
export default function LegalPage({ which }: LegalPageProps) {
  const { content, lang, setLang } = useLanguage();
  const t = LEGAL[lang];
  const doc = t[which];

  useEffect(() => {
    document.title = `${doc.title} — AIRBALL`;
  }, [doc.title]);

  return (
    <div className="min-h-svh bg-cream text-court">
      <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-7">
        {/* The mark ships white, so over Court Cream it has to be inverted. */}
        <a href="/" className="transition-opacity hover:opacity-70" aria-label="AIRBALL, home">
          <Wordmark className="text-2xl" invert />
        </a>
        <div className="label flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="border border-court px-3 py-2 transition-colors hover:bg-butter"
          >
            {lang === 'de' ? 'EN' : 'DE'}
          </button>
          <a
            href="/"
            className="border border-court px-4 py-2 transition-colors hover:bg-butter"
          >
            {t.back}
          </a>
        </div>
      </header>

      <main className="px-5 pb-24 pt-8 md:px-10 md:pb-32 md:pt-12">
        <h1 className="display max-w-[900px] text-[clamp(40px,7vw,84px)]">{doc.title}</h1>

        {/* The provisional status is the first thing on the page rather than a
            footnote, because a placeholder that reads as final is worse than
            no page at all. */}
        <p className="mt-6 max-w-[640px] border-l-4 border-butter bg-butter/25 px-4 py-3">
          {doc.notice}
        </p>

        <p className="label mt-4 text-court/55">{doc.updated}</p>

        <div className="mt-12 max-w-[640px] space-y-10">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <span aria-hidden="true" className="block h-1 w-9 bg-butter" />
              <h2 className="display mt-3 text-[clamp(22px,2.6vw,32px)]">{section.heading}</h2>

              {section.body?.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-court/80">
                  {paragraph}
                </p>
              ))}

              {section.items && (
                <ul className="mt-4 list-none border-t border-court/15">
                  {section.items.map((item) => (
                    <li key={item} className="border-b border-court/15 py-3 text-court/75">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 bg-court px-5 py-10 text-chalk md:px-10 md:py-12">
        <Wordmark className="text-xl" />
        <div className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-chalk/55">
          <a href="/imprint" className="transition-colors hover:bg-butter hover:text-court">
            {content.footer.imprint}
          </a>
          <span aria-hidden="true">·</span>
          <a href="/privacy" className="transition-colors hover:bg-butter hover:text-court">
            {content.footer.privacy}
          </a>
          <span aria-hidden="true">·</span>
          <span>{content.footer.location}</span>
          <span aria-hidden="true">·</span>
          <span>{content.footer.rights}</span>
        </div>
      </footer>
    </div>
  );
}
