# Operacional — Cloudflare Pages & Turnstile

## Status do projeto
- **Workers & Pages** ativo com domínio customizado `pavieadvocacia.com.br` e `*.pages.dev` funcionando.
- **Implantações automáticas** via branch `main` habilitadas (cada commit gera um deploy).

## Painéis relevantes
1. **Workers & Pages → Deployments**: lista de implantações, com link “Exibir detalhes” para logs.
2. **Settings → Environment Variables**: defina/edite `TURNSTILE_SECRET` (Secret), `MAIL_TO` e `MAIL_FROM` (Plain).
3. **Turnstile**: painel do Turnstile com sua **Site Key** (pública) e **Secret Key** (privada).

## Checklist de configuração (formulário)
- [ ] `index.html` contém o widget Turnstile (site key correta).
- [ ] Form envia `POST` para `/api/contato`.
- [ ] `functions/api/contato.js` valida Turnstile, aceita `assunto` **ou** `servico` e tenta envio via MailChannels.
- [ ] Variáveis de ambiente presentes (`GET /api/contato` → `hasSecret/hasMailTo/hasMailFrom: true`).
- [ ] Headers de segurança `_headers` adicionados na raiz do projeto.

## Logs e diagnóstico rápido
- **Verificação do Turnstile**: códigos de erro aparecem nos logs quando `verifyJson.success=false`.
- **E-mail**: se faltar `MAIL_TO`/`MAIL_FROM`, a API responde `mail-vars-missing` (200). Falhas do MailChannels retornam `502` com `mailchannels-failed`.

## Boas práticas
- Branch `dev` para testes; abra Pull Request para `main`.
- Habilite 2FA na conta Cloudflare. Conceda acessos por **Members/roles** (mínimo necessário).
- Centralize os segredos no **Secrets** e **não** em arquivos versionados.

