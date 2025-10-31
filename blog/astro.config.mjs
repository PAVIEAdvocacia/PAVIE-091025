import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.pavieadvocacia.com.br',
  base: '/blog/',
  trailingSlash: 'always',
  output: 'static',
});
