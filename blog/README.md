# PAVIE | Blog (Astro + Decap CMS )

Estrutura pronta para deploy no subdomínio **blog.pavieadvocacia.com.br** com:
- Astro + Content Collections
- Sitemap integrado
- Decap CMS (admin) com GitHub OAuth (para Cloudflare Pages Functions)
- Headers de segurança (CSP/HSTS — ajustar CSP conforme seus scripts)
- Script de pós-build com Pagefind

## Comandos
```bash
npm install
npm run dev
npm run build && npm run preview
```

## Próximos passos
1. Ajuste `astro.config.mjs` (`site`) e, se preciso, `base`.
2. Configure o Decap em `public/admin/config.yml` (repo/branch).
3. Crie o OAuth App no GitHub e defina as variáveis no Cloudflare Pages.
4. Aponte o subdomínio `blog.pavieadvocacia.com.br` para o projeto no Pages.