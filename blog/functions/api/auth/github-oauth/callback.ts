// functions/api/auth/github-oauth/callback.ts
type TokenResponse = { access_token?: string; error?: string; error_description?: string };

export const onRequest: PagesFunction<{
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';
  const returnedState = url.searchParams.get('state') || '';

  if (!code) return new Response('Missing code', { status: 400 });

  // 1) Lê cookie de state e valida (CSRF)
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/);
  const storedState = match ? match[1] : '';
  if (!storedState || storedState !== returnedState) {
    return new Response('Invalid state', { status: 400 });
  }

  // 2) Troca "code" por "access_token" no GitHub
  const gh = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'user-agent': 'decap-cms-cloudflare-oauth'
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const json = (await gh.json()) as TokenResponse;

  // 3) Monta payload + status
  const ok = !!json.access_token && !json.error;
  const status = ok ? 'success' : 'error';
  const content = ok
    ? { token: json.access_token, provider: 'github' }
    : { error: json.error || 'oauth_error', description: json.error_description || 'OAuth exchange failed' };

  // 4) HTML que conversa com o Admin via postMessage e fecha o popup
  //    Implementa "origin allowlist" por segurança
  const allowedOrigins = ['https://blog.pavieadvocacia.com.br'];

  const html = `<!doctype html>
<meta charset="utf-8">
<title>OAuth • ${status}</title>
<style>
  body{font:14px system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:24px;color:#111}
  .card{max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;padding:24px}
  .ok{color:#065f46}.err{color:#991b1b}
</style>
<div class="card">
  <h1>${ok ? 'Autenticação concluída' : 'Falha de autenticação'}</h1>
  <p class="${ok ? 'ok' : 'err'}">${ok ? 'Você já pode fechar esta janela.' : 'Não foi possível concluir o login. Tente novamente.'}</p>
  <p><a href="/admin/">Voltar ao Admin</a></p>
</div>
<script>
  (function(){
    function send(msg){
      try {
        // Tenta notificar a janela de origem mais estrita possível
        for (const origin of ${JSON.stringify(allowedOrigins)}) {
          if (window.opener && origin) {
            window.opener.postMessage(msg, origin);
          }
        }
        // Fallback: notifica qualquer origem se nenhuma válida for encontrada (comentado por segurança)
        // if (window.opener) window.opener.postMessage(msg, '*');
      } catch(e) {}
    }

    // Padrão de handshake do Decap CMS:
    // 1) "authorizing:github"
    // 2) "authorization:github:<status>:<json>"
    send('authorizing:github');
    send('authorization:github:${status}:' + ${JSON.stringify(JSON.stringify(content))});
    setTimeout(function(){ window.close(); }, 400);
  })();
</script>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      // Invalida o cookie de state após uso
      'Set-Cookie': 'oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    }
  });
};
