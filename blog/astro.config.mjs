// blog/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // base: '/', // Omitido (padrão). NUNCA use '/blog' em subdomínio.
  output: 'static',
  site: 'https://blog.pavieadvocacia.com.br',
});
