# PAVIE | Advocacia — Deploy Cloudflare Pages

Estrutura correta:
- `index.html` (raiz)
- `form.turnstile.js` (raiz)
- `form.submit.js` (raiz)
- `_headers` (raiz — CSP/segurança)
- `functions/api/contato.js` (Pages Function)

Após subir:
1. Em Pages → Settings → Environment variables (Production), defina:
   - `MAIL_FROM`
   - `MAIL_FROM_NAME`
   - `MAIL_TO`
   - `CHAVE_SECRETA_DA_TORRE` (Turnstile Secret)
2. Turnstile Widget: inclua `pavieadvocacia.com.br`, `www.pavieadvocacia.com.br` e o seu `*.pages.dev` nos domínios.
3. Faça um novo deploy.
