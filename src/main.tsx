import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { startAnalytics } from '@/lib/analytics';

// Self-hosted brand faces (Brand Guide 04). No external font requests.
import '@fontsource/big-shoulders-display/900';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import '@/index.css';

// Cookie-free, so it needs no consent and can start with the page.
startAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
