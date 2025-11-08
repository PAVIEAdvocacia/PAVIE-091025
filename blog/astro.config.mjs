import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Política: subdomínio dedicado ao blog
// Canônicos, sitemap e assets partem deste host.
export default defineConfig({
  site: "https://blog.pavieadvocacia.com.br",

  // Em subdomínio, mantenha "/" (ou remova esta linha — o padrão é "/").
  base: "/",

  // Defina UMA política de barra final nas URLs.
// trailingSlash: "always",   // use UMA: "always" OU "never"
  trailingSlash: "never",     // escolha e padronize no CDN/reverse-proxy

  // (Opcional, mas recomendado) Formato de build explícito.
  // Em sites estáticos, "directory" mantém /post/ como pasta com index.html.
// build: { format: "directory" },

  integrations: [
    sitemap({
      // "page" é a URL completa; retorne false para excluí-la do sitemap.
      // Garanta que áreas privadas (ex.: /admin) não sejam indexadas.
      filter: (page) => {
        const url = page.toString();
        // Bloqueie admin e outras rotas internas:
        if (
          url.includes("/admin") ||
          url.includes("/api/") ||
          url.endsWith("/404") ||
          url.includes("/drafts")
        ) return false;
        return true;
      },
      // Ex.: personalize frequência/prioridade conforme sua política editorial:
      // changefreq: "weekly",
      // priority: 0.7,
    }),
  ],
});
