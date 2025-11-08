import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Ajuste 'site' para o seu domínio definitivo em produção.
export default defineConfig({
  site: "https://blog.pavieadvocacia.com.br",
  base: "/",
  integrations: [sitemap()],
});
