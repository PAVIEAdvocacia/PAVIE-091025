# scaffold-blog.ps1
# Cria a estrutura completa do projeto /blog (Astro + Decap + OAuth + Pagefind)
# Não grava segredos. Variáveis devem ser definidas no Cloudflare Pages (Projeto do BLOG).
# Requisitos: PowerShell 5+.

$ErrorActionPreference = "Stop"

function Write-FileUtf8($Path, $Content) {
  $dir = Split-Path -Parent $Path
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $Content | Out-File -FilePath $Path -Encoding UTF8
}

# --- Estrutura de diretórios ---
$dirs = @(
  "blog",
  "blog/admin",
  "blog/public",
  "blog/public/uploads",
  "blog/src/content/posts",
  "blog/src/content/pages",
  "blog/src/content/tags",
  "blog/src/content/schemas",
  "blog/src/components",
  "blog/src/layouts",
  "blog/functions/api",
  "blog/docs/blog/adrs"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

# --- .gitignore do subprojeto ---
$gitignore = @"
node_modules
dist
.astro
pagefind_temp
"@
Write-FileUtf8 "blog/.gitignore" $gitignore

# --- astro.config.mjs ---
$astro = @"
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://pavieadvocacia.com.br',
  base: '/blog',
  integrations: [sitemap()],
});
"@
Write-FileUtf8 "blog/astro.config.mjs" $astro

# --- package.json ---
$pkg = @"
{
  "name": "pavie-blog",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "postbuild": "pagefind --site dist",
    "preview": "astro preview"
  },
  "devDependencies": {
    "astro": "^4.14.0",
    "@astrojs/sitemap": "^3.1.0",
    "pagefind": "^1.1.0",
    "zod": "^3.23.8"
  }
}
"@
Write-FileUtf8 "blog/package.json" $pkg

# --- tsconfig.json (mínimo) ---
$tsconfig = @"
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "isolatedModules": true,
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "jsx": "preserve",
    "types": []
  }
}
"@
Write-FileUtf8 "blog/tsconfig.json" $tsconfig

# --- Content Collections: schema + config ---
$postSchema = @"
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string(),
  description: z.string().max(155),
  pubDate: z.string(), // ISO date
  author: z.string().default('PAVIE | Advocacia'),
  type: z.enum(['autoridade','guia','jurisprudencia','noticia','opiniao']).default('autoridade'),
  tags: z.array(z.string()).default(['Sucessões & Inventário']),
  cover: z.object({
    src: z.string(),
    alt: z.string()
  }),
  canonical: z.string().url().optional(),
  noindex: z.boolean().optional()
});
"@
Write-FileUtf8 "blog/src/content/schemas/post.ts" $postSchema

$contentConfig = @"
import { defineCollection } from 'astro:content';
import { postSchema } from './schemas/post';

const posts = defineCollection({
  type: 'content',
  schema: postSchema
});

export const collections = { posts };
"@
Write-FileUtf8 "blog/src/content/config.ts" $contentConfig

# --- Exemplos de posts (2) ---
$post1 = @"
---
title: 'Modelo de Post — Estrutura e Metadados'
description: 'Post de exemplo com front-matter validado pelo Zod.'
pubDate: '2025-10-26'
author: 'PAVIE | Advocacia'
type: 'guia'
tags: ['Sucessões & Inventário','Compliance OAB']
cover:
  src: '/blog/uploads/exemplo/exemplo-cover.jpg'
  alt: 'Balança estilizada'
canonical: 'https://pavieadvocacia.com.br/blog/modelo-de-post/'
noindex: false
---

Conteúdo **Markdown** de exemplo. Inclua interlinks internos e FAQ quando fizer sentido.
"@
Write-FileUtf8 "blog/src/content/posts/2025-10-26-modelo-de-post.md" $post1

$post2 = @"
---
title: 'Pagefind: busca estática integrada'
description: 'Demonstração da busca estática Pagefind no Astro.'
pubDate: '2025-10-27'
author: 'PAVIE | Advocacia'
type: 'autoridade'
tags: ['SEO','Pagefind']
cover:
  src: '/blog/uploads/pagefind/hero.jpg'
  alt: 'Lupa sobre documento'
---

Após o *build*, o Pagefind gera `/blog/_pagefind/*`. Certifique-se de que `_headers` permite cache **immutable**.
"@
Write-FileUtf8 "blog/src/content/posts/2025-10-27-pagefind-integrado.md" $post2

# --- Decap CMS: config.yml e index.html (manual init opcional) ---
$decapConfig = @"
backend:
  name: github
  repo: PAVIEAdvocacia/PAVIE-091025
  branch: main
  base_url: https://pavieadvocacia.com.br/blog
  auth_endpoint: /api/auth

site_url: https://pavieadvocacia.com.br/blog
logo_url: https://pavieadvocacia.com.br/assets/logo.png
locale: pt
publish_mode: editorial_workflow

media_folder: 'blog/public/uploads'
public_folder: '/blog/uploads'

collections:
  - name: posts
    label: Artigos
    folder: 'blog/src/content/posts'
    create: true
    slug: '{{year}}-{{month}}-{{day}}-{{slug}}'
    preview_path: 'blog/{{slug}}/'
    editor:
      preview: true
    fields:
      - { label: 'Título', name: 'title', widget: 'string' }
      - { label: 'Data', name: 'pubDate', widget: 'datetime', format: 'YYYY-MM-DD' }
      - { label: 'Resumo', name: 'description', widget: 'text', hint: '≤ 155 caracteres' }
      - { label: 'Autor', name: 'author', widget: 'string', default: 'PAVIE | Advocacia' }
      - { label: 'Tipo', name: 'type', widget: 'select', options: ['autoridade','guia','jurisprudencia','noticia','opiniao'] }
      - { label: 'Tags', name: 'tags', widget: 'list', default: ['Sucessões & Inventário'] }
      - label: 'Imagem de capa'
        name: 'cover'
        widget: 'object'
        fields:
          - { label: 'Arquivo', name: 'src', widget: 'image' }
          - { label: 'Alt (acessível)', name: 'alt', widget: 'string' }
      - { label: 'Canonical (opcional)', name: 'canonical', widget: 'string', required: false }
      - { label: 'Noindex', name: 'noindex', widget: 'boolean', default: false, required: false }
      - { label: 'Corpo', name: 'body', widget: 'markdown' }
"@
Write-FileUtf8 "blog/admin/config.yml" $decapConfig

$adminIndex = @"
<!doctype html>
<html lang='pt-br'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <title>Admin — PAVIE | Advocacia</title>
</head>
<body>
  <script>window.CMS_MANUAL_INIT = true;</script>
  <script src='https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js'></script>
  <script>
    CMS.init({
      config: {
        backend: {
          name: 'github',
          repo: 'PAVIEAdvocacia/PAVIE-091025',
          branch: 'main',
          base_url: 'https://pavieadvocacia.com.br/blog',
          auth_endpoint: '/api/auth'
        },
        site_url: 'https://pavieadvocacia.com.br/blog',
        media_folder: 'blog/public/uploads',
        public_folder: '/blog/uploads'
      }
    });
  </script>
</body>
</html>
"@
Write-FileUtf8 "blog/admin/index.html" $adminIndex

# --- _headers do BLOG ---
$headers = @"
/blog/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/blog/admin/*
  Cache-Control: no-store
  Content-Security-Policy: default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data: https:;
    connect-src 'self' https://api.github.com https://github.com https://raw.githubusercontent.com https://pavieadvocacia.com.br;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';

/blog/_pagefind/*
  Cache-Control: public, max-age=31536000, immutable
"@
Write-FileUtf8 "blog/public/_headers" $headers

# --- Functions OAuth GitHub ---
$authTs = @"
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });

  const state = crypto.randomUUID();
  const redirectUri = origin + '/blog/api/callback';

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo user');
  authorizeUrl.searchParams.set('state', state);

  const headers = new Headers({
    'Set-Cookie': \`oauth_state=\${state}; Path=/; HttpOnly; Secure; SameSite=Lax\`
  });

  return Response.redirect(authorizeUrl.toString(), 302, { headers });
}
"@
Write-FileUtf8 "blog/functions/api/auth.ts" $authTs

$callbackTs = @"
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookie = request.headers.get('Cookie') || '';
  const match = /oauth_state=([^;]+)/.exec(cookie || '');
  const cookieState = match ? match[1] : null;

  if (!code || !state || !cookieState || cookieState !== state) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  const body = {
    client_id: env.GITHUB_CLIENT_ID,
    client_secret: env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: origin + '/blog/api/callback'
  };

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!tokenRes.ok) {
    return new Response('OAuth exchange failed', { status: 502 });
  }

  const data = await tokenRes.json();
  const token = data.access_token;
  if (!token) return new Response('Missing access_token', { status: 500 });

  const html = \`<!doctype html><html><body>
  <script>
    (function() {
      var payload = 'authorization:github:success:' + JSON.stringify({ token: '${' + 'token' + '}', provider: 'github' }).replace('${' + 'token' + '}', \`${token}\`);
      try {
        window.opener && window.opener.postMessage(payload, '\${origin}');
      } catch(e) {
        window.opener && window.opener.postMessage(payload, '*');
      }
      window.close();
    })();
  </script>
  Sucesso. Você pode fechar esta janela.
  </body></html>\`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
"@
Write-FileUtf8 "blog/functions/api/callback.ts" $callbackTs

# --- Documentos (RFC e ADRs placeholders) ---
$rfc = @"
# RFC-000 - Plano Diretor do Blog (DMB)
Status: active
Escopo: /blog (Astro + Decap + Cloudflare Pages + Pagefind + GA4)
- Base: '/blog'
- Admin: /blog/admin/
- OAuth: /blog/api/auth & /blog/api/callback
- Pagefind: /blog/_pagefind/*
- Segurança: _headers dedicado ao blog
"@
Write-FileUtf8 "blog/docs/blog/RFC-000 - Plano Diretor do Blog (DMB).md" $rfc

for ($i=1; $i -le 12; $i++) {
  $adr = @"
# ADR-$(("{0:D3}" -f $i)) - Decisão $i
Status: accepted
Contexto: ver RFC-000
Decisão: definida
Consequências: documentadas
"@
  Write-FileUtf8 ("blog/docs/blog/adrs/ADR-{0:D3}.md" -f $i) $adr
}

Write-Host "`n✅ Estrutura do /blog criada."
Write-Host "Próximos passos:"
Write-Host "1) cd blog && npm install"
Write-Host "2) Configure as variáveis no Cloudflare Pages (Projeto do BLOG, Route pavieadvocacia.com.br/blog*):"
Write-Host "   - NODE_VERSION=20"
Write-Host "   - GITHUB_CLIENT_ID=<do print>"
Write-Host "   - GITHUB_CLIENT_SECRET=<do print>"
Write-Host "   - (opcional) ASTRO_TELEMETRY_DISABLED=1, TZ=America/Sao_Paulo"
Write-Host "3) Faça commit/push: git add . && git commit -m 'feat(blog): scaffolding astro/decap/oauth/pagefind' && git push"
