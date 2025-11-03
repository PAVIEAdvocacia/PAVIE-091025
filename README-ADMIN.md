# Admin do Blog (Astro + Decap CMS + GitHub OAuth via Cloudflare Pages)

## Acesso
- Painel: `/blog/admin`
- O Decap lê a configuração via `<link rel="cms-config-url">` e carrega `/blog/admin/config.yml`.

## Autenticação (GitHub OAuth)
- Rotas de OAuth expostas por **Cloudflare Pages Functions**:
  - `GET /api/auth` → redireciona para `https://github.com/login/oauth/authorize`
  - `GET /api/callback` → troca `code` por `access_token` e envia ao Decap via `window.postMessage`
- As Functions usam **file-based routing** sob `/functions/api/*.ts`. :contentReference[oaicite:5]{index=5}

### Variáveis de ambiente (Cloudflare Pages → Project → Settings → Environment variables)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### OAuth App no GitHub
- **Authorization callback URL**: `https://pavieadvocacia.com.br/api/callback`  
  (o host/porta devem **coincidir exatamente**; o `redirect_uri` deve ser subcaminho do callback configurado). :contentReference[oaicite:6]{index=6}

## Uploads de mídia
- `media_folder: public/uploads` (versionado no Git)
- `public_folder: /uploads` (URL pública) — padrão suportado pelo Decap. :contentReference[oaicite:7]{index=7}

## Coleções ("templates" por tipo)
- 5 coleções apontando para `src/content/posts`, cada uma com `filter` por `type` e campo `type` **oculto** (widget `hidden`), o que permite **criar** já no template certo. :contentReference[oaicite:8]{index=8}

## Pré-visualização no Admin
- `public/blog/admin/preview.js` com `CMS.registerPreviewTemplate(...)`. :contentReference[oaicite:9]{index=9}

## Fluxo editorial
1. Abrir `/blog/admin`, logar via GitHub.
2. Escolher o “template” desejado (Autoridade / Guia / Jurisprudência / Caso / FAQ).
3. Preencher campos e salvar — cria PR (workflow editorial) ou commit direto.
4. Cloudflare Pages faz build automático a cada push (ou merge).

## Troubleshooting
- Popup “autorizado” que não fecha → ver console do `/api/callback` (o handler envia `authorization:github:<status>:<payload>` por `postMessage`). :contentReference[oaicite:10]{index=10}
- Erro `redirect_uri`/`callback mismatch` → confira **exatamente** `https://pavieadvocacia.com.br/api/callback` no GitHub OAuth App. :contentReference[oaicite:11]{index=11}
- Entradas não filtradas por tipo → ver `filter: { field: "type", value: ... }` no `config.yml`. :contentReference[oaicite:12]{index=12}
