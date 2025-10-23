          # PAVIE | Advocacia — Kit pronto (Turnstile inline + Apps Script) 

## Preencha estes **placeholders no HTML** (substituir no arquivo `index.final.html` → renomeie para `index.html`)
- `0xSITE_KEY_TURNSTILE_AQUI` → cole aqui a **Chave do site** do Turnstile (pública).

## Variáveis de ambiente (Cloudflare Pages → Preview e Production)
```
TURNSTILE_SECRET=<COLE A "Chave secreta" do Turnstile>
SCRIPT_URL=https://script.google.com/macros/s/AKfycbw0thrDSzI3CmfJGNFvgJvXyFX3PNpSFyJ2aeyFcMaM/exec
MAIL_FROM=no-reply@pavieadvocacia.com.br
MAIL_FROM_NAME=PAVIE | Advocacia – Fabio Pavie
MAIL_TO=fabiopavie@pavieadvogado.com,contato@pavieadvocacia.com.br
SITE_BASE=https://pavieadvocacia.com.br
# (opcional) autenticação extra no Apps Script
APPSCRIPT_SECRET=<OPCIONAL_SEU_SEGREDO_PRIVADO>
# (opcional Preview) bypass de captcha
DEV_BYPASS_TURNSTILE=true
```

## Estrutura
```
/
├─ index.html                   (use o arquivo gerado `index.final.html` renomeado)
├─ _headers
├─ robots.txt
├─ sitemap.xml
├─ form.turnstile.js
├─ assets/
│  └─ js/
│     └─ form.submit.js
└─ functions/
   └─ api/
      └─ contato.js
```

## Testes
```bash
curl -i https://pavieadvocacia.com.br/api/contato   -H "Content-Type: application/json"   -d '{
    "nome":"Teste",
    "email":"teste@example.com",
    "telefone_full":"+55 21 96438-2263",
    "mensagem":"Validação E2E.",
    "turnstileToken":"<TOKEN_TURNSTILE_DO_WIDGET>"
  }'
```