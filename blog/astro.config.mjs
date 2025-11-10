import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.pavieadvocacia.com.br',
  base: '/',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    server: { fs: { strict: false } },
  },
});
