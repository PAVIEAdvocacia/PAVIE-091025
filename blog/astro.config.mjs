// astro.config.mjs
import { defineConfig } from 'astro/config';

// Integrações oficiais do Astro
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Configuração do blog PAVIE | Advocacia
// Deploy: Cloudflare Pages, em blog.pavieadvocacia.com.br
export default defineConfig({
  // URL canônica do projeto em produção
  site: 'https://blog.pavieadvocacia.com.br',

  // Geração estática de páginas (adequada para Cloudflare Pages)
  // Mesmo sendo o padrão do Astro, deixamos explícito para documentação.
  output: 'static',

  // URLs sem barra final: /blog, /sobre, /post-exemplo
  // Garante consistência de SEO e facilita espelhamento com o site raiz.
  trailingSlash: 'never',

  // Integrações do projeto
  integrations: [
    // Gera sitemap.xml automaticamente para o subdomínio do blog
    sitemap(),

    // Suporte a MDX (útil para posts com componentes/trechos interativos)
    mdx(),
  ],
});
