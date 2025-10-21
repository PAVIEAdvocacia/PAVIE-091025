# PAVIE | Advocacia — Kit de Publicação (Cloudflare Pages + Functions + Turnstile + Apps Script)

## Estrutura
```
/
├─ index.final.html
├─ _headers
├─ robots.txt
├─ sitemap.xml
└─ functions/
   └─ api/
      └─ contato.js
```

## Variáveis de Ambiente (Pages → Settings → Environment Variables)
```
TURNSTILE_SITE_KEY=<site_key_do_turnstile>
TURNSTILE_SECRET=<secret_do_turnstile>
APP_SCRIPT_WEBAPP_URL=<URL_exec_do_Apps_Script>
CONTACT_TO="fabiopavie@pavieadvogado.com,contato@pavieadvocacia.com.br"
MAIL_FROM=no-reply@pavieadvocacia.com.br
REPLY_TO=
SITE_BASE=https://pavieadvocacia.com.br
DEV_BYPASS_TURNSTILE=true   # (opcional, somente em PREVIEW)
```

## Teste de API
Produção:
```bash
curl -i https://pavieadvocacia.com.br/api/contato   -H "Content-Type: application/json"   -d '{
    "nome":"Teste Integração",
    "email":"teste@example.com",
    "telefone_full":"+55 21 96438-2263",
    "mensagem":"Validação do fluxo.",
    "turnstileToken":"<TOKEN_TURNSTILE>"
  }'
```

Preview (com bypass opcional):
```bash
curl -i https://<seu-preview>.pages.dev/api/contato   -H "Content-Type: application/json"   -d '{
    "nome":"Teste Preview",
    "email":"teste@example.com",
    "telefone_full":"+55 21 96438-2263",
    "mensagem":"Fluxo sem Turnstile (preview)"
  }'
```