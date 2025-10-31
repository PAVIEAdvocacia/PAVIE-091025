// astro.config.mjs — PAVIE Blog
// Coloque este arquivo na pasta do projeto do blog (…/blog/)
import { defineConfig } from 'astro/config';
export default defineConfig({
  // Domínio principal do site (sem / no final)
  site: 'https://pavieadvocacia.com.br',
  // O blog deve viver em /blog/
  base: '/blog/',
  // Saída 100% estática p/ publicar dentro do site raiz
  output: 'static',
  // Recomendo manter URLs com barra final por consistência
  trailingSlash: 'always',
});
