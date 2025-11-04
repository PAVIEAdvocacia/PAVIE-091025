
PAVIE | Advocacia — Ajustes SEO/Search Console (2025-10-29)
-----------------------------------------------------------
Este pacote inclui:
- _redirects: regras para forçar não-www → domínio raiz (use também uma Redirect Rule no painel da Cloudflare).
- sitemap-blog.xml (placeholder): mantenha no repositório até o blog Astro entrar no ar.

Passos:
1) Deploy via Git → Cloudflare Pages.
2) No Search Console, inspecione e solicite indexação de:
   - https://pavieadvocacia.com.br/
   - https://pavieadvocacia.com.br/privacidade/privacidade.html
3) Quando o blog estiver ativo:
   - Remover "Disallow: /blog/" do robots.txt.
   - Preencher sitemap-blog.xml com as URLs dos posts.
   - Opcional: transformar sitemap.xml em um índice que referencia sitemaps específicos.
4) FAQ Rich Result: mantido um único bloco FAQPage JSON-LD na homepage.
