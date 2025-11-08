export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const redirectUri = `${url.origin}/api/auth/github-oauth/callback`;

  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({
      client_id: ctx.env.GITHUB_CLIENT_ID,
      client_secret: ctx.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    return new Response(
      `OAuth error: ${data.error_description || resp.statusText || 'no token'}`,
      { status: 401 }
    );
  }

  const payload = JSON.stringify({ token: data.access_token });

  // Handshake exigido pelo Decap: enviar o token ao Admin e fechar o popup
  const html = `<!doctype html>
<html><body>
<script>
(function () {
  try {
    var msg = 'authorization:github:' + ${JSON.stringify(payload)};
    if (window.opener && typeof window.opener.postMessage === 'function') {
      window.opener.postMessage(msg, '*');
      window.close();
      return;
    }
    // Fallback: exibe o JSON se não houver window.opener
    document.body.innerText = ${JSON.stringify(payload)};
  } catch (e) {
    document.body.innerText = 'Callback error: ' + (e && e.message ? e.message : e);
  }
})();
</script>
</body></html>`;

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
};
