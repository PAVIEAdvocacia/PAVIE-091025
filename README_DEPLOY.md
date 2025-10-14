# Formulário – Deploy rápido (Cloudflare Pages + Functions + MailChannels)

## 1) Estrutura de arquivos
Coloque este arquivo de função no seu repositório:
```
functions/
└── api/
    └── contato.js    # responde POST /api/contato
```
Faça commit/push para disparar o deploy do Cloudflare Pages.

## 2) Variáveis de ambiente (Pages -> Settings -> Environment variables)
- `TURNSTILE_SECRET` = (chave secreta do Turnstile)
- `CONTACT_TO_EMAIL` = e-mail que vai receber as mensagens (ex.: fabiopavie@pavieadvogado.com)
- `CONTACT_FROM_EMAIL` = remetente do e-mail (ex.: contato@pavieadvocacia.com.br)
- `DOMAIN` = pavieadvocacia.com.br
- `DKIM_SELECTOR` = mailchannels
- `DKIM_PRIVATE_KEY` = chave privada DKIM correspondente ao seletor acima

## 3) DNS (no Cloudflare -> DNS)
- **Domain Lockdown (MailChannels)**: TXT em `_mailchannels` com conteúdo, por exemplo:
  `v=mc1 cfid=SEUPROJETO.pages.dev cfid=pavieadvocacia.com.br`
- **SPF**: garanta um único registro TXT SPF, incluindo MailChannels e Google (se usar Workspace), por ex.:
  `v=spf1 include:_spf.google.com include:relay.mailchannels.net ~all`
- **DKIM (MailChannels)**: publique a **chave pública** no TXT `mailchannels._domainkey` (selector=mailchannels).
  A privada vai na variável `DKIM_PRIVATE_KEY`.
  (Você pode manter também o DKIM do Google; múltiplos seletores coexistem.)

## 4) HTML do formulário
O formulário deve usar `action="/api/contato"` e `method="POST"` e incluir o widget Turnstile.
O front-end deve preencher `cf-turnstile-response` (feito pelo script do Turnstile).

## 5) Teste
Após o deploy, teste via navegador. Se falhar:
- 405 Method Not Allowed => a função não foi encontrada: confirme o caminho **functions/api/contato.js**
- 403 Falha no captcha => verifique `TURNSTILE_SECRET` e se o token está chegando no backend
- 502 Erro ao enviar e-mail => confira TXT `_mailchannels`, SPF e DKIM

## 6) Observações
- Se existir `_worker.js` no projeto (modo avançado), ele **sobrepõe** o diretório `functions/`.
  Nesse caso, remova `_worker.js` ou implemente o handler `/api/contato` dentro dele.
