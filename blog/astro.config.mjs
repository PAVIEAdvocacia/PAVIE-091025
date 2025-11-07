import { defineConfig } from 'astro/config'; 
import sitemap from '@astrojs/sitemap'; 
 
export default defineConfig({ 
  site: 'https://blog.pavieadvocacia.com.br', 
  base: '/', 
  build: { 
    outDir: 'dist', 
  }, 
  integrations: [ 
    sitemap(), 
  ], 
  trailingSlash: 'always', 
}); 
