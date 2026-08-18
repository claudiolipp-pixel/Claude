import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Config for producing a self-contained single-file preview.
// Not part of the deployed app — `npm run build` never loads this file.
export default defineConfig({
  plugins: [
    react(),
    {
      /*
       * Open the shop for the preview only.
       *
       * SHOP_LIVE stays hard-coded false in the source, because it is a legal
       * stop rather than a setting: the imprint is a placeholder and the terms
       * do not exist yet, so nothing that can take money may be reachable. A
       * preview file that is never served from airball.at cannot take money,
       * and being unable to look at the shop before launch is worse than
       * useless.
       *
       * Scoped to that one declaration in that one file, so it cannot silently
       * widen into anything else.
       */
      name: 'airball-preview-shop',
      transform(code, id) {
        if (!id.endsWith('src/content/shop.ts')) return null;
        const opened = code.replace(
          'export const SHOP_LIVE = false;',
          'export const SHOP_LIVE = true;',
        );
        if (opened === code) {
          this.error('shop.ts no longer declares SHOP_LIVE = false; the preview cannot open it.');
        }
        return { code: opened, map: null };
      },
    },
  ],
  resolve: {
    alias: [
      // Hash routing, because the preview has no server. See route.preview.ts.
      { find: /^@\/lib\/route$/, replacement: path.resolve(__dirname, './src/lib/route.preview.ts') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
});
