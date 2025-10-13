# Deploy — Fluxo recomendado (Cloudflare Pages)

1. Crie um branch `dev` para alterações.
2. Commit e **Push** → o Pages cria uma **prévia** (Preview).
3. Revise logs em *Workers & Pages → Deployments*.
4. Abra **Pull Request** para `main` → merge.
5. Produção publica automaticamente (domínio principal).

## Pastas/arquivos chave
- `index.html` (landing)
- `functions/api/contato.js` (API do formulário)
- `sitemap.xml`, `robots.txt` (SEO)
- `_headers` (segurança)
- `README.md` e docs (operações)

