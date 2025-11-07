#!/usr/bin/env bash
set -euo pipefail

# ---------- Parâmetros ----------
REPO_SLUG="${1:-PAVIEAdvocacia/pavie-blog}"      # org/repo do GitHub usado pelo Decap
REPO_BRANCH="${2:-main}"
BLOG_DOMAIN="${3:-blog.pavieadvocacia.com.br}"   # subdomínio final do blog
ROOT_DIR="$(pwd)"

echo "==> Configurando Decap para ${BLOG_DOMAIN} usando ${REPO_SLUG}@${REPO_BRANCH}"

# ---------- 1) Garantias de estrutura ----------
mkdir -p "${ROOT_DIR}/public/admin"
mkdir -p "${ROOT_DIR}/public/uploads"
mkdir -p "${ROOT_DIR}/functions/api"
mkdir -p "${ROOT_DIR}/scripts"

# ---------- 2) astro.config.mjs ----------
ASTRO_CFG="${ROOT_DIR}/astro.config.mjs"
cat > "${ASTRO_CFG}" <<'EOF'
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.BLOG_SITE ?? 'https://blog.pavieadvocacia.com.br',
  base: '/',            // subdomínio não precisa de prefixo
  output: 'static',
  outDir: 'dist',
  // publicDir: 'public' (padrão)
});
EOF
echo "✓ astro.config.mjs escrito (base '/' e outDir 'dist')."

# ---------- 3) Admin UI (index.html) ----------
ADMIN_INDEX="${ROOT_DIR}/public/admin/index.html"
cat > "${ADMIN_INDEX}" <<'EOF'
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Área administrativa — Blog PAVIE</title>
    <style>
      :root { color-scheme: light dark; }
      body { margin:0; font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; display:grid; place-items:center; min-height:100vh; }
      .wrap { text-align:center; max-width:760px; padding:2rem; }
      h1 { font-weight:700; letter-spacing:.2px; margin:.5rem 0 1rem; }
      p { opacity:.8; }
    </style>
    <!-- Forma canônica: o Decap lê /admin/config.yml automaticamente -->
    <link rel="cms-config-url" type="text/yaml" href="/admin/config.yml" />
  </head>
  <body>
    <div class="wrap">
      <h1>Carregando CMS do Blog PAVIE...</h1>
      <p>Se esta mensagem persistir, verifique o console do navegador (F12).</p>
    </div>
    <!-- Decap CMS (build oficial via CDN) -->
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
EOF
echo "✓ /public/admin/index.html criado."

# ---------- 4) Config do Decap (config.yml) ----------
ADMIN_CFG="${ROOT_DIR}/public/admin/config.yml"
cat > "${ADMIN_CFG}" <<EOF
backend:
  name: github
  repo: ${REPO_SLUG}
  branch: ${REPO_BRANCH}
  auth_endpoint: /api/auth/github-oauth

site_url: "https://${BLOG_DOMAIN}"

media_folder: "public/uploads"   # pasta no repositório
public_folder: "/uploads"        # como é servido no site

collections:
  - name: "blog"
    label: "Blog"
    folder: "src/content/blog"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Data", name: "date", widget: "datetime" }
      - { label: "Resumo", name: "description", widget: "text", required: false }
      - { label: "Rascunho", name: "draft", widget: "boolean", default: false }
      - { label: "Tags", name: "tags", widget: "list", required: false }
      - { label: "Conteúdo", name: "body", widget: "markdown" }
EOF
echo "✓ /public/admin/config.yml criado (coleção 'blog' e auth_endpoint correto)."

# ---------- 5) Cloudflare Pages Function (GitHub OAuth) ----------
# Implementação mínima para o fluxo do Decap (OAuth App do GitHub)
OAUTH_FN="${ROOT_DIR}/functions/api/auth/github-oauth.ts"
cat > "${OAUTH_FN}" <<'EOF'
/**
 * Cloudflare Pages Function — Endpoint OAuth para Decap CMS (GitHub)
 * Rotas:
 *   GET  /api/auth/github-oauth            → redireciona para GitHub (authorize)
 *   GET  /api/auth/github-oauth/callback   → troca o "code" por token e devolve JSON {token}
 *
 * Variáveis de ambiente (definir no projeto do Cloudflare Pages):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */
export const onRequestGet: PagesFunction<{
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}> = async ({ request, env }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response('OAuth mal configurado: defina GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET', { status: 500 });
  }

  const githubAuth = new URL('https://github.com/login/oauth/authorize');
  const githubToken = 'https://github.com/login/oauth/access_token';

  // Estado opcional (evitar CSRF). Simples para demo.
  const state = crypto.randomUUID();

  // 1) /api/auth/github-oauth  → envia para autorização
  if (!pathname.endsWith('/callback')) {
    githubAuth.searchParams.set('client_id', clientId);
    githubAuth.searchParams.set('redirect_uri', new URL('./callback', url).toString());
    githubAuth.searchParams.set('scope', 'repo,read:user');
    githubAuth.searchParams.set('state', state);
    return Response.redirect(githubAuth.toString(), 302);
  }

  // 2) /callback → troca o "code" por token e devolve JSON para o Decap
  const code = url.searchParams.get('code');
  if (!code) return new Response('Faltou "code" no callback.', { status: 400 });

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  const tokenResp = await fetch(githubToken, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body,
  });

  if (!tokenResp.ok) {
    return new Response('Falha ao obter token no GitHub.', { status: 502 });
  }

  const data = await tokenResp.json() as { access_token?: string; error?: string; };
  if (!data.access_token) {
    return new Response('Token não retornado pelo GitHub.', { status: 500 });
  }

  // Retorno no formato esperado pelo Decap
  return new Response(JSON.stringify({ token: data.access_token }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
EOF
echo "✓ Function OAuth criada em /functions/api/auth/github-oauth.ts"

# ---------- 6) _headers opcional (sem CSP bloqueadora) ----------
HEADERS_FILE="${ROOT_DIR}/_headers"
if [ ! -f "${HEADERS_FILE}" ]; then
  cat > "${HEADERS_FILE}" <<'EOF'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer-when-downgrade
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 0

/admin/*
  Cache-Control: no-store
EOF
  echo "✓ _headers básico criado (sem CSP restritiva)."
else
  echo "• _headers já existe — não alterado."
fi

# ---------- 7) package.json (scripts padrão) ----------
PKG_JSON="${ROOT_DIR}/package.json"
if [ ! -f "${PKG_JSON}" ]; then
  cat > "${PKG_JSON}" <<'EOF'
{
  "name": "pavie-blog",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check:admin": "node -e \"const fs=require('fs');['public/admin/index.html','public/admin/config.yml'].forEach(p=>{if(!fs.existsSync(p)) {console.error('Faltando',p); process.exit(1);} }); console.log('Admin OK');\""
  },
  "devDependencies": {
    "astro": "^4.0.0"
  }
}
EOF
  echo "✓ package.json criado (scripts dev/build/preview)."
else
  echo "• package.json já existe — confira os scripts de build."
fi

# ---------- 8) Mensagens finais ----------
cat <<EOF

========================================================
PASSOS SEGUINTES (obrigatórios para o login funcionar):

1) No GitHub (Developer Settings → OAuth Apps):
   - Authorization callback URL:
     https://${BLOG_DOMAIN}/api/auth/github-oauth/callback
   - Homepage URL:
     https://${BLOG_DOMAIN}/

2) No Cloudflare Pages (projeto do SUBDOMÍNIO):
   - Defina variáveis de ambiente:
     GITHUB_CLIENT_ID = <do OAuth App>
     GITHUB_CLIENT_SECRET = <do OAuth App>

3) Build e teste local:
   npm ci
   npm run build
   npx http-server dist -p 4321
   → abra http://localhost:4321/admin/ e http://localhost:4321/admin/config.yml

4) Deploy no Cloudflare Pages:
   - Diretório de saída: dist
   - Sem redirects que empurrem para o domínio principal.

Se ao abrir /admin a tela ficar em "Carregando...", verifique:
   [ ] /admin/config.yml responde 200?
   [ ] Console do navegador: 404/CORS?
   [ ] Callback do GitHub aponta para o SUBDOMÍNIO?
   [ ] Function está neste projeto (subdomínio) e não no da raiz?
========================================================
EOF
