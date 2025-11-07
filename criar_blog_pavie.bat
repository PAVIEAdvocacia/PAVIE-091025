@echo off
echo Criando estrutura completa do Blog PAVIE...
mkdir blog
cd blog

:: Criar estrutura de pastas
mkdir public
mkdir public\admin
mkdir public\uploads
mkdir admin
mkdir src
mkdir src\components
mkdir src\layouts
mkdir src\content
mkdir src\content\posts
mkdir src\content\pages
mkdir src\content\tags
mkdir src\content\schemas
mkdir functions
mkdir functions\api
mkdir functions\api\auth
mkdir docs
mkdir docs\blog
mkdir docs\blog\adrs

echo Estrutura de pastas criada!
echo Criando arquivos...

:: 1. package.json
echo {
echo   "name": "pavie-blog",
echo   "version": "1.0.0",
echo   "private": true,
echo   "type": "module",
echo   "scripts": {
echo     "dev": "astro dev",
echo     "build": "astro build",
echo     "preview": "astro preview",
echo     "postbuild": "pagefind --site dist || echo 'Pagefind skipped'"
echo   },
echo   "dependencies": {
echo     "astro": "^4.10.0",
echo     "@astrojs/rss": "^4.0.0",
echo     "@astrojs/sitemap": "^3.1.0",
echo     "pagefind": "^1.2.0",
echo     "zod": "^3.23.8",
echo     "decap-cms-app": "^3.0.0"
echo   },
echo   "devDependencies": {
echo     "typescript": "^5.3.3"
echo   }
echo } > package.json

:: 2. astro.config.mjs
echo import { defineConfig } from 'astro/config'; > astro.config.mjs
echo import sitemap from '@astrojs/sitemap'; >> astro.config.mjs
echo. >> astro.config.mjs
echo export default defineConfig({ >> astro.config.mjs
echo   site: 'https://blog.pavieadvocacia.com.br', >> astro.config.mjs
echo   base: '/', >> astro.config.mjs
echo   build: { >> astro.config.mjs
echo     outDir: 'dist', >> astro.config.mjs
echo   }, >> astro.config.mjs
echo   integrations: [ >> astro.config.mjs
echo     sitemap(), >> astro.config.mjs
echo   ], >> astro.config.mjs
echo   trailingSlash: 'always', >> astro.config.mjs
echo }); >> astro.config.mjs

:: 3. tsconfig.json
echo {
echo   "compilerOptions": {
echo     "target": "ESNext",
echo     "useDefineForClassFields": true,
echo     "lib": ["DOM", "DOM.Iterable", "ESNext"],
echo     "module": "ESNext",
echo     "moduleResolution": "Node",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "noEmit": true,
echo     "jsx": "react-jsx",
echo     "jsxImportSource": "solid-js",
echo     "types": ["astro/client"],
echo     "baseUrl": ".",
echo     "paths": {
echo       "~/*": ["src/*"]
echo     }
echo   },
echo   "include": ["src"],
echo   "exclude": ["node_modules"]
echo } > tsconfig.json

:: 4. public/admin/index.html
echo ^<!doctype html^> > public\admin\index.html
echo ^<html lang='pt-br'^> >> public\admin\index.html
echo ^<head^> >> public\admin\index.html
echo   ^<meta charset='utf-8'^> >> public\admin\index.html
echo   ^<meta name='viewport' content='width=device-width, initial-scale=1'^> >> public\admin\index.html
echo   ^<title^>Admin — PAVIE ^| Advocacia^</title^> >> public\admin\index.html
echo ^</head^> >> public\admin\index.html
echo ^<body^> >> public\admin\index.html
echo   ^<script^>window.CMS_MANUAL_INIT = true;^</script^> >> public\admin\index.html
echo   ^<script src='https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js'^>^</script^> >> public\admin\index.html
echo   ^<script^> >> public\admin\index.html
echo     CMS.init({ >> public\admin\index.html
echo       config: { >> public\admin\index.html
echo         backend: { >> public\admin\index.html
echo           name: 'github', >> public\admin\index.html
echo           repo: 'PAVIEAdvocacia/PAVIE-091025', >> public\admin\index.html
echo           branch: 'main', >> public\admin\index.html
echo           base_url: 'https://blog.pavieadvocacia.com.br', >> public\admin\index.html
echo           auth_endpoint: '/api/auth/github-oauth' >> public\admin\index.html
echo         }, >> public\admin\index.html
echo         site_url: 'https://blog.pavieadvocacia.com.br', >> public\admin\index.html
echo         media_folder: 'blog/public/uploads', >> public\admin\index.html
echo         public_folder: '/blog/uploads' >> public\admin\index.html
echo       } >> public\admin\index.html
echo     }); >> public\admin\index.html
echo   ^</script^> >> public\admin\index.html
echo ^</body^> >> public\admin\index.html
echo ^</html^> >> public\admin\index.html

:: 5. admin/config.yml
echo backend: > admin\config.yml
echo   name: github >> admin\config.yml
echo   repo: PAVIEAdvocacia/PAVIE-091025 >> admin\config.yml
echo   branch: main >> admin\config.yml
echo   base_url: https://blog.pavieadvocacia.com.br >> admin\config.yml
echo   auth_endpoint: /api/auth/github-oauth >> admin\config.yml
echo site_url: https://blog.pavieadvocacia.com.br >> admin\config.yml
echo logo_url: https://pavieadvocacia.com.br/assets/logo.png >> admin\config.yml
echo locale: pt >> admin\config.yml
echo publish_mode: editorial_workflow >> admin\config.yml
echo media_folder: "blog/public/uploads" >> admin\config.yml
echo public_folder: "/blog/uploads" >> admin\config.yml
echo collections: >> admin\config.yml
echo   - name: posts >> admin\config.yml
echo     label: Artigos >> admin\config.yml
echo     folder: "blog/src/content/posts" >> admin\config.yml
echo     create: true >> admin\config.yml
echo     slug: "{{year}}-{{month}}-{{day}}-{{slug}}" >> admin\config.yml
echo     preview_path: "blog/{{slug}}/" >> admin\config.yml
echo     editor: { preview: true } >> admin\config.yml
echo     fields: >> admin\config.yml
echo       - { label: "Título", name: "title", widget: "string" } >> admin\config.yml
echo       - { label: "Data", name: "pubDate", widget: "datetime", format: "YYYY-MM-DD" } >> admin\config.yml
echo       - { label: "Resumo", name: "description", widget: "text", hint: "≤ 155 caracteres" } >> admin\config.yml
echo       - { label: "Autor", name: "author", widget: "string", default: "PAVIE ^| Advocacia" } >> admin\config.yml
echo       - { label: "Tipo", name: "type", widget: "select", options: ["autoridade","guia","jurisprudencia","noticia","opiniao"] } >> admin\config.yml
echo       - { label: "Tags", name: "tags", widget: "list", default: ["Sucessões ^& Inventário"] } >> admin\config.yml
echo       - label: "Imagem de capa" >> admin\config.yml
echo         name: "cover" >> admin\config.yml
echo         widget: "object" >> admin\config.yml
echo         fields: >> admin\config.yml
echo           - { label: "Arquivo", name: "src", widget: "image" } >> admin\config.yml
echo           - { label: "Alt (acessível)", name: "alt", widget: "string" } >> admin\config.yml
echo       - { label: "Canonical (opcional)", name: "canonical", widget: "string", required: false } >> admin\config.yml
echo       - { label: "Noindex", name: "noindex", widget: "boolean", default: false, required: false } >> admin\config.yml
echo       - { label: "Corpo", name: "body", widget: "markdown" } >> admin\config.yml

:: 6. public/_headers
echo /blog/* > public\_headers
echo   X-Content-Type-Options: nosniff >> public\_headers
echo   Referrer-Policy: strict-origin-when-cross-origin >> public\_headers
echo   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload >> public\_headers
echo. >> public\_headers
echo /blog/admin/* >> public\_headers
echo   Cache-Control: no-store >> public\_headers
echo   Content-Security-Policy: default-src 'self'; >> public\_headers
echo     script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net; >> public\_headers
echo     style-src 'self' 'unsafe-inline'; >> public\_headers
echo     img-src 'self' data: blob: https:; >> public\_headers
echo     font-src 'self' data: https:; >> public\_headers
echo     connect-src 'self' https://api.github.com https://github.com https://raw.githubusercontent.com https://blog.pavieadvocacia.com.br; >> public\_headers
echo     frame-ancestors 'none'; >> public\_headers
echo     base-uri 'self'; >> public\_headers
echo     form-action 'self'; >> public\_headers
echo. >> public\_headers
echo /blog/_pagefind/* >> public\_headers
echo   Cache-Control: public, max-age=31536000, immutable >> public\_headers

:: 7. functions/api/auth/github-oauth.ts
echo export const onRequestGet: PagesFunction = async ({ request, env }) => { > functions\api\auth\github-oauth.ts
echo   const url = new URL(request.url); >> functions\api\auth\github-oauth.ts
echo   const origin = url.origin; >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo   const clientId = env.GITHUB_CLIENT_ID; >> functions\api\auth\github-oauth.ts
echo   if (!clientId) { >> functions\api\auth\github-oauth.ts
echo     return new Response("Missing GITHUB_CLIENT_ID", { status: 500 }); >> functions\api\auth\github-oauth.ts
echo   } >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo   const redirectUri = ^`${origin}/api/auth/github-oauth/callback^`; >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo   const code = url.searchParams.get('code'); >> functions\api\auth\github-oauth.ts
echo   if (code) { >> functions\api\auth\github-oauth.ts
echo     const tokenResponse = await fetch('https://github.com/login/oauth/access_token', { >> functions\api\auth\github-oauth.ts
echo       method: 'POST', >> functions\api\auth\github-oauth.ts
echo       headers: { >> functions\api\auth\github-oauth.ts
echo         'Content-Type': 'application/json', >> functions\api\auth\github-oauth.ts
echo         'Accept': 'application/json' >> functions\api\auth\github-oauth.ts
echo       }, >> functions\api\auth\github-oauth.ts
echo       body: JSON.stringify({ >> functions\api\auth\github-oauth.ts
echo         client_id: clientId, >> functions\api\auth\github-oauth.ts
echo         client_secret: env.GITHUB_CLIENT_SECRET, >> functions\api\auth\github-oauth.ts
echo         code, >> functions\api\auth\github-oauth.ts
echo         redirect_uri: redirectUri >> functions\api\auth\github-oauth.ts
echo       }) >> functions\api\auth\github-oauth.ts
echo     }); >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo     const data = await tokenResponse.json(); >> functions\api\auth\github-oauth.ts
echo     if (data.access_token) { >> functions\api\auth\github-oauth.ts
echo       return new Response(JSON.stringify({ token: data.access_token }), { >> functions\api\auth\github-oauth.ts
echo         headers: { 'Content-Type': 'application/json' } >> functions\api\auth\github-oauth.ts
echo       }); >> functions\api\auth\github-oauth.ts
echo     } >> functions\api\auth\github-oauth.ts
echo     return new Response(JSON.stringify({ error: data.error }), { >> functions\api\auth\github-oauth.ts
echo       status: 400, >> functions\api\auth\github-oauth.ts
echo       headers: { 'Content-Type': 'application/json' } >> functions\api\auth\github-oauth.ts
echo     }); >> functions\api\auth\github-oauth.ts
echo   } >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo   const state = crypto.randomUUID(); >> functions\api\auth\github-oauth.ts
echo   const githubAuthUrl = new URL('https://github.com/login/oauth/authorize'); >> functions\api\auth\github-oauth.ts
echo   githubAuthUrl.searchParams.set('client_id', clientId); >> functions\api\auth\github-oauth.ts
echo   githubAuthUrl.searchParams.set('redirect_uri', redirectUri); >> functions\api\auth\github-oauth.ts
echo   githubAuthUrl.searchParams.set('scope', 'repo user'); >> functions\api\auth\github-oauth.ts
echo   githubAuthUrl.searchParams.set('state', state); >> functions\api\auth\github-oauth.ts
echo. >> functions\api\auth\github-oauth.ts
echo   return new Response(null, { >> functions\api\auth\github-oauth.ts
echo     status: 302, >> functions\api\auth\github-oauth.ts
echo     headers: { >> functions\api\auth\github-oauth.ts
echo       'Location': githubAuthUrl.toString(), >> functions\api\auth\github-oauth.ts
echo       'Set-Cookie': ^`oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600^` >> functions\api\auth\github-oauth.ts
echo     } >> functions\api\auth\github-oauth.ts
echo   }); >> functions\api\auth\github-oauth.ts
echo }; >> functions\api\auth\github-oauth.ts

:: 8. functions/api/auth/github-oauth/callback.ts
echo function closeWithMessage(status: "success" ^| "error", payload: any, extraHeaders?: HeadersInit) { > functions\api\auth\github-oauth\callback.ts
echo   const message = ^`authorization:github:${status}:${JSON.stringify(payload)}^`; >> functions\api\auth\github-oauth\callback.ts
echo   const html = ^`^<!doctype html^>^<meta charset="utf-8"^> >> functions\api\auth\github-oauth\callback.ts
echo   ^<script^> >> functions\api\auth\github-oauth\callback.ts
echo     (function(){ >> functions\api\auth\github-oauth\callback.ts
echo       window.opener ^&^& window.opener.postMessage(${JSON.stringify(message)}, "*"); >> functions\api\auth\github-oauth\callback.ts
echo       window.close(); >> functions\api\auth\github-oauth\callback.ts
echo     })(); >> functions\api\auth\github-oauth\callback.ts
echo   ^</script^>^`; >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo   return new Response(html, { >> functions\api\auth\github-oauth\callback.ts
echo     status: 200, >> functions\api\auth\github-oauth\callback.ts
echo     headers: { >> functions\api\auth\github-oauth\callback.ts
echo       "Content-Type": "text/html; charset=utf-8", >> functions\api\auth\github-oauth\callback.ts
echo       ...(extraHeaders ^|^| {}) >> functions\api\auth\github-oauth\callback.ts
echo     } >> functions\api\auth\github-oauth\callback.ts
echo   }); >> functions\api\auth\github-oauth\callback.ts
echo } >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo export const onRequestGet: PagesFunction = async ({ request, env }) => { >> functions\api\auth\github-oauth\callback.ts
echo   const url = new URL(request.url); >> functions\api\auth\github-oauth\callback.ts
echo   const code = url.searchParams.get("code"); >> functions\api\auth\github-oauth\callback.ts
echo   const state = url.searchParams.get("state"); >> functions\api\auth\github-oauth\callback.ts
echo   const cookies = request.headers.get("Cookie") ^|^| ""; >> functions\api\auth\github-oauth\callback.ts
echo   const savedState = cookies.match(/(?:^^|;\s*)oauth_state=([^;]+)/)?.[1] ^|^| null; >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo   if (!code ^|^| !state ^|^| !savedState ^|^| savedState !== state) { >> functions\api\auth\github-oauth\callback.ts
echo     return closeWithMessage("error", { message: "Invalid OAuth state" }); >> functions\api\auth\github-oauth\callback.ts
echo   } >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo   const redirect_uri = ^`${url.origin}/api/auth/github-oauth/callback^`; >> functions\api\auth\github-oauth\callback.ts
echo   const res = await fetch("https://github.com/login/oauth/access_token", { >> functions\api\auth\github-oauth\callback.ts
echo     method: "POST", >> functions\api\auth\github-oauth\callback.ts
echo     headers: { >> functions\api\auth\github-oauth\callback.ts
echo       "Accept": "application/json", >> functions\api\auth\github-oauth\callback.ts
echo       "Content-Type": "application/json" >> functions\api\auth\github-oauth\callback.ts
echo     }, >> functions\api\auth\github-oauth\callback.ts
echo     body: JSON.stringify({ >> functions\api\auth\github-oauth\callback.ts
echo       client_id: env.GITHUB_CLIENT_ID, >> functions\api\auth\github-oauth\callback.ts
echo       client_secret: env.GITHUB_CLIENT_SECRET, >> functions\api\auth\github-oauth\callback.ts
echo       code, >> functions\api\auth\github-oauth\callback.ts
echo       redirect_uri, >> functions\api\auth\github-oauth\callback.ts
echo       state >> functions\api\auth\github-oauth\callback.ts
echo     }) >> functions\api\auth\github-oauth\callback.ts
echo   }); >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo   const data = await res.json().catch(() => ({})); >> functions\api\auth\github-oauth\callback.ts
echo   if (!res.ok ^|^| data.error ^|^| !data.access_token) { >> functions\api\auth\github-oauth\callback.ts
echo     return closeWithMessage("error", { >> functions\api\auth\github-oauth\callback.ts
echo       message: data.error_description ^|^| "OAuth exchange failed" >> functions\api\auth\github-oauth\callback.ts
echo     }, { >> functions\api\auth\github-oauth\callback.ts
echo       "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" >> functions\api\auth\github-oauth\callback.ts
echo     }); >> functions\api\auth\github-oauth\callback.ts
echo   } >> functions\api\auth\github-oauth\callback.ts
echo. >> functions\api\auth\github-oauth\callback.ts
echo   return closeWithMessage("success", { token: data.access_token }, { >> functions\api\auth\github-oauth\callback.ts
echo     "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" >> functions\api\auth\github-oauth\callback.ts
echo   }); >> functions\api\auth\github-oauth\callback.ts
echo }; >> functions\api\auth\github-oauth\callback.ts

:: 9. src/content/schemas/post.ts
echo import { z } from 'zod'; > src\content\schemas\post.ts
echo. >> src\content\schemas\post.ts
echo export const postSchema = z.object({ >> src\content\schemas\post.ts
echo   title: z.string(), >> src\content\schemas\post.ts
echo   description: z.string().max(155), >> src\content\schemas\post.ts
echo   pubDate: z.string(), >> src\content\schemas\post.ts
echo   author: z.string().default('PAVIE ^| Advocacia'), >> src\content\schemas\post.ts
echo   type: z.enum(['autoridade','guia','jurisprudencia','noticia','opiniao']).default('autoridade'), >> src\content\schemas\post.ts
echo   tags: z.array(z.string()).default(['Sucessões ^& Inventário']), >> src\content\schemas\post.ts
echo   cover: z.object({ >> src\content\schemas\post.ts
echo     src: z.string(), >> src\content\schemas\post.ts
echo     alt: z.string() >> src\content\schemas\post.ts
echo   }).optional(), >> src\content\schemas\post.ts
echo   canonical: z.string().url().optional(), >> src\content\schemas\post.ts
echo   noindex: z.boolean().optional() >> src\content\schemas\post.ts
echo }); >> src\content\schemas\post.ts

:: 10. Documentação
echo # RFC-000 - Plano Diretor do Blog (DMB) > docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo Status: active >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo Escopo: /blog (Astro + Decap + Cloudflare Pages + Pagefind + GA4) >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo - Base: '/' >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo - Admin: /admin/ >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo - OAuth: /api/github-oauth e /api/callback >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo - Pagefind: /_pagefind/* >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md
echo - Segurança: _headers dedicado ao blog >> docs\blog\RFC-000 - Plano Diretor do Blog (DMB).md

echo # ADR-001 - Arquitetura do Blog > docs\blog\adrs\ADR-001.md
echo Status: accepted >> docs\blog\adrs\ADR-001.md
echo Contexto: ver RFC-000 >> docs\blog\adrs\ADR-001.md
echo Decisão: definida >> docs\blog\adrs\ADR-001.md
echo Consequências: documentadas >> docs\blog\adrs\ADR-001.md

echo. 
echo ✅ ESTRUTURA COMPLETA DO BLOG CRIADA!
echo.
echo PRÓXIMOS PASSOS:
echo 1. Execute: cd blog && npm install
echo 2. Configure as variaveis de ambiente no Cloudflare Pages
echo 3. Deploy automático no Cloudflare
echo.
echo 📍 URLs importantes:
echo - Blog: https://blog.pavieadvocacia.com.br
echo - Admin: https://blog.pavieadvocacia.com.br/admin
echo - OAuth: https://blog.pavieadvocacia.com.br/api/auth/github-oauth
pause