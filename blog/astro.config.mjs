// @ts-check

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

const sitemapExcludedPaths = [
  '/blog/areas/familia/',
  '/blog/areas/sucessoes/',
  '/blog/areas/internacional/',
  '/blog/areas/contratos/',
  '/blog/areas/cobranca/',
  '/blog/areas/imobiliario/',
  '/blog/areas/consumidor/',
  '/blog/areas/compliance/',
  '/blog/areas/empresarial/',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://pavieadvocacia.com.br',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !sitemapExcludedPaths.some((path) => page.endsWith(path)),
    }),
  ],
});
