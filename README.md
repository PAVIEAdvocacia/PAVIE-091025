# Projeto PAVIE – Cloudflare Pages d

Este repositório contém a estrutura do site estático hospedado no **Cloudflare Pages** com:
- redirecionamentos canônicos
- cabeçalhos de segurança e cache
- API serverless (`/api/contato`) que valida **Cloudflare Turnstile** e repassa ao **Google Apps Script**

## Estrutura
```
/
├─ _headers
├─ _redirects
├─ .well-known/security.txt
├─ robots.txt
├─ sitemap.xml
├─ index.html          # exemplo com formulário e Turnstile
├─ form.turnstile.js   # util para obter token
├─ form.submit.js      # submissão para /api/contato
└─ functions/
   └─ api/
      └─ contato.js    # CF Pages Function
```

## Variáveis de ambiente (Pages → Settings → Environment variables)
- `TURNSTILE_SECRET` – chave secreta do Turnstile
- `SCRIPT_URL` – URL do seu **Apps Script Web App** (deployment que aceita POST JSON)

## Turnstile
No `index.html`, troque `COLOQUE_SUA_SITE_KEY_AQUI` pela **Site Key** do seu widget.

## Deploy
- Suba/commit os arquivos para o branch monitorado pelo Pages.
- O Pages publicará automaticamente.
- Teste `https://pavieadvogado.com` → deve redirecionar para `https://www.pavieadvogado.com/`.
- Teste o endpoint: `POST https://www.pavieadvogado.com/api/contato` com JSON.
