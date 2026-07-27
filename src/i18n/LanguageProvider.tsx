import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CONTENT, type Lang, type SiteContent } from '@/content/site';

const STORAGE_KEY = 'airball.lang';

interface LanguageValue {
  lang: Lang;
  content: SiteContent;
  setLang: (next: Lang) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

/**
 * English is the brand language (Brand Guide 05); German is offered as a
 * deliberate local switch, not as an auto-detected default. We only pick up
 * German automatically when the visitor's browser asks for it first.
 */
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'de') return stored;
  return window.navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === 'en' ? 'de' : 'en')),
    [],
  );

  const value = useMemo<LanguageValue>(
    () => ({ lang, content: CONTENT[lang], setLang, toggle }),
    [lang, setLang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
