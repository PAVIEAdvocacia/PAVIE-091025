@echo off
cd /d "C:\Users\Fabio ESTUDO\Desktop\Obsidian\3. Recursos (Materiais de suporte e interesse geral)\70 - 79 IA\71 - PAVIE Advocacia\Site\PAVIE-091025\blog"

echo Corrigindo estrutura das functions...
mkdir functions\api\auth\github-oauth 2>nul

echo Movendo callback para a pasta correta...
if exist "functions\api\auth\github-oauth\callback.ts" del "functions\api\auth\github-oauth\callback.ts"
if exist "functions\api\callback.ts" move "functions\api\callback.ts" "functions\api\auth\github-oauth\"

echo Corrigindo github-oauth.ts...
echo export const onRequestGet: PagesFunction = async (context) => { > functions\api\auth\github-oauth.ts
echo   const { request, env } = context; >> functions\api\auth\github-oauth.ts
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

echo Corrigindo callback.ts...
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

echo.
echo ✅ ESTRUTURA CORRIGIDA!
echo.
echo Agora faça:
echo 1. Atualize a URL de callback no GitHub OAuth App para: https://blog.pavieadvocacia.com.br/api/auth/github-oauth/callback
echo 2. git add .
echo 3. git commit -m "fix: correct functions structure and callback URL"
echo 4. git push
pause