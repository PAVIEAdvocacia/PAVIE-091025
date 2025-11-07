// blog/astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://blog.pavieadvocacia.com.br',
  base: '/',                 // <- raiz do subdomínio
  trailingSlash: 'always',
  build: { outDir: 'dist' },
});
