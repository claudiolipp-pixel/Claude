import { useLanguage } from '@/i18n/LanguageProvider';
import { SOCIAL } from '@/content/site';
import Wordmark from '@/components/Wordmark';

export default function Footer() {
  const { content } = useLanguage();
  const t = content.footer;

  return (
    <footer className="relative z-10 flex flex-wrap items-center justify-between gap-5 bg-court px-5 py-11 text-chalk md:px-10 md:py-14">
      <Wordmark className="text-2xl" />

      <div className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-chalk/55">
        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:bg-butter hover:text-court"
        >
          {SOCIAL.handle}
        </a>
        <span aria-hidden="true">·</span>
        <a href="/imprint" className="transition-colors hover:bg-butter hover:text-court">
          {t.imprint}
        </a>
        <span aria-hidden="true">·</span>
        <a href="/privacy" className="transition-colors hover:bg-butter hover:text-court">
          {t.privacy}
        </a>
        <span aria-hidden="true">·</span>
        <span>{t.location}</span>
        <span aria-hidden="true">·</span>
        <span>{t.rights}</span>
      </div>
    </footer>
  );
}
