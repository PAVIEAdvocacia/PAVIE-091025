import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pavieadvocacia.com.br',
  base: '/blog',
  integrations: [sitemap()]
});
