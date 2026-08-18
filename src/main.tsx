import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { CartProvider } from '@/state/CartProvider';
import { SHOP_LIVE } from '@/content/shop';
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
      {/*
        Above App, because the basket has to survive moving between the home
        page, the shop index and a product page.

        Only while the shop is live, and that is not tidiness. The provider
        writes to localStorage on mount, and writing storage for a shop that
        cannot be reached is exactly the kind of thing the cookieless promise
        is about. With SHOP_LIVE false this branch folds away and neither the
        provider nor the key ships at all.
      */}
      {SHOP_LIVE ? (
        <CartProvider>
          <App />
        </CartProvider>
      ) : (
        <App />
      )}
    </LanguageProvider>
  </StrictMode>,
);
