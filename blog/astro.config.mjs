import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build
export default defineConfig({
  site: 'https://pavieadvocacia.com.br',
  base: '/blog',
  output: 'static',
  integrations: [sitemap()],
});