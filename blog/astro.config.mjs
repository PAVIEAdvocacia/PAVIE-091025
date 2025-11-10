// blog/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Não use base:'/blog' em subdomínio.
  output: 'static',
  site: 'https://blog.pavieadvocacia.com.br',
});
