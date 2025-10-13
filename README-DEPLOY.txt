PAVIE | Advocacia — Patch de formulário Turnstile + Pages Functions
Data: 2025-10-12

Arquivos incluídos neste pacote:
- index.patched.html       → Substitui seu index.html (Turnstile em modo implícito)
- _headers.patched         → Substitui seu _headers (CSP/HSTS/Policy atualizados)
- functions/api/contato.js → Move sua função para a rota correta /api/contato

Passos:
1) No repositório do site, substitua:
   - index.html pelo index.patched.html
   - _headers pelo _headers.patched
   - e adicione a pasta functions/api/ com o contato.js (se não existir, crie as pastas).
2) Commit e push na branch principal (main). O Cloudflare Pages fará o deploy automaticamente.
3) No painel do Cloudflare → seu projeto Pages → Settings → Environment variables:
   - Secrets: TURNSTILE_SECRET
   - Plain:   MAIL_FROM  (ex.: contato@pavieadvocacia.com.br)
              MAIL_TO    (ex.: fabiopavie@pavieadvogado.com)
4) Em Turnstile (Dashboard):
   - Confirme que a SITE KEY 0x4AAAAAAB6FBS0cTG_7KOYv está ativa e que os domínios pavieadvocacia.com.br e www.pavieadvocacia.com.br estão em Allowed domains.
5) DNS do domínio de envio (MAIL_FROM):
   - Adicione TXT SPF: v=spf1 include:relay.mailchannels.net ~all
6) SSL/TLS (no domínio do site):
   - Ative Always Use HTTPS, TLS 1.3 e defina Minimum TLS = 1.2. (HSTS já está nos headers.)
7) Teste:
   - GET https://SEU_DOMINIO/api/contato → deve retornar ok:true e flags de variáveis.
   - Submit do formulário na home → verifique recebimento do e-mail. Se falhar, veja os Logs do deployment.
