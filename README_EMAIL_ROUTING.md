# Publicação e E-mail (pavieadvocacia.com.br → pavieadvogado.com)

## 1) DNS no Cloudflare (pavieadvocacia.com.br)
- CNAME @ → pavie-091025.pages.dev (Proxy ON)
- CNAME www → pavie-091025.pages.dev (Proxy ON)

## 2) HSTS e cabeçalhos
- Arquivo `_headers` já contém HSTS (1 ano), nosniff, referrer-policy e cache.
- `_redirects` força canônica para https://www.pavieadvocacia.com.br/

## 3) Formulário (Turnstile + Pages Function → Apps Script)
- Suba `functions/api/contato.js` e configure variáveis no Pages:
  - TURNSTILE_SECRET: sua chave secreta
  - SCRIPT_URL: URL do Apps Script Web App (doPost JSON)

## 4) Redundância do formulário
- `contact-widget.html` inclui fallback automático:
  - Mailto: contato@pavieadvocacia.com.br
  - WhatsApp: ajuste o número oficial

## 5) E-mail divulgado e entrega segura
- **E-mail público**: contato@pavieadvocacia.com.br
- **Entrega**: inbox final em fabiopavie@pavieadvogado.com

### Opção A — Cloudflare Email Routing (recomendada)
1. Cloudflare → pavieadvocacia.com.br → **Email** → Enable Email Routing.
2. Destination address: **fabiopavie@pavieadvogado.com**.
3. Create rule: **contato@pavieadvocacia.com.br → fabiopavie@pavieadvogado.com**.
4. Não é necessário MX do Google nesse domínio; o Mail Routing usa MX próprios.

### Opção B — Workspace (se quiser enviar *e* receber nativamente pelo Google)
1. No Admin Console, adicione **pavieadvocacia.com.br** como domínio secundário (já verificado).
2. Em DNS, aponte MX para o Google (substitui o Mail Routing).
3. Crie alias de usuário **contato@pavieadvocacia.com.br** para o usuário `fabiopavie`.
4. Ative DKIM para `pavieadvocacia.com.br` no Admin Console (gerar TXT `google._domainkey`).

> Para **enviar como** contato@pavieadvocacia.com.br a partir do Gmail:
> - Gmail → ⚙️ → Ver todas as configurações → **Contas** → **Enviar e-mail como** → Adicionar outro e-mail.
> - Use “Tratar como um alias”. Como o domínio secundário está verificado, o Gmail assinará com DKIM e SPF do Google ficará alinhado.