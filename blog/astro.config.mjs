import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // URL de produção — fundamental para canônicos, sitemap, etc.
  site: "https://blog.pavieadvocacia.com.br",

  // Base path — como o blog está em subdomínio, "/" é adequado.
  base: "/",

  // Definir preferência de barrinha final nas URLs, se necessário:
  // trailingSlash: "always",  // ou "never" de acordo com sua política.

  integrations: [
    sitemap({
      // Sugestão: filtrar drafts ou páginas que não devem constar
      filter: (page) => !page.includes("/admin"),
      // Possíveis customizações (commentários abaixo)
      // changefreq: 'weekly',
      // priority: 0.7,
    }),
    // Outras integrações podem ser incluídas aqui
  ],
});
