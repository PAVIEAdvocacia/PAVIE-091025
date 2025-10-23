# PAVIE | Advocacia — Site Institucional (HTML estático)

Este pacote contém ajustes **não intrusivos** para SEO, Schema, Acessibilidade, Performance, Segurança e Métricas, **sem alterar layout/copy**. O formulário com Turnstile permanece intacto.

## O que foi aprimorado
- Canonical/hreflang, OG/Twitter, preconnect/preload de fontes (já existentes foram mantidos).
- **Cloudflare Web Analytics** (cookieless): inserir token em `data-cf-beacon`.
- Marcação **Schema.org** (já existia: `LegalService`, `Person`, `WebSite`, `FAQPage`). Mantida e validável.
- Atributos `data-track` em CTAs, WhatsApp e telefone (para eventos opcionais via `/api/event`).
- `_headers` com CSP compatível (Turnstile, Google Fonts, Insights) e políticas modernas.
- `robots.txt` e `sitemap.xml` coerentes com domínio apex `https://pavieadvocacia.com.br`.

## Variáveis/ajustes necessários
- **Analytics:** edite `index.html` e substitua `{CF_WEB_ANALYTICS_TOKEN}` pelo token do Cloudflare Web Analytics.
- **Turnstile:** já funcional via `<div class="cf-turnstile"...>` e `form.turnstile.js`.
- **/api/contato:** mantenha `APP_SCRIPT_WEBAPP_URL` (ou `SCRIPT_URL`) no ambiente do Pages. Opcional: `APPSCRIPT_SECRET`, `MAIL_TO`, `MAIL_FROM`, `MAIL_FROM_NAME`.
- **/api/event (opcional):** se desejar coletar eventos customizados, crie uma função Pages `functions/api/event.js` que aceite POST JSON e retorne `{ ok: true }`.

## Publicação (Cloudflare Pages)
1. Suba estes arquivos ao repositório conectado ao Pages.
2. Garanta os headers via arquivo `/_headers` (raiz).
3. Configure as variáveis de ambiente no projeto (Settings → Environment variables).
4. Valide:
   - `/robots.txt` e `/sitemap.xml`
   - Formulário: envio 200/`{"ok":true}`
   - CSP no console (sem bloqueios indevidos)
   - Schema (Rich Results) e PageSpeed (CWV).

## Observações
- Não foram feitas mudanças em textos/estilos/estrutura visual.
- Mantivemos o Turnstile e submissão via `fetch` (sem MailChannels).

