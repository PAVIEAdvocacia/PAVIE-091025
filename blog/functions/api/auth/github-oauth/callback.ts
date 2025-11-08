// blog/functions/api/auth/github-oauth.js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1) Start
  if (url.pathname.endsWith('/api/auth/github-oauth') && !url.pathname.endsWith('/callback')) {
    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authorize.searchParams.set('redirect_uri', `${url.origin}/api/auth/github-oauth/callback`);
    authorize.searchParams.set('scope', 'repo user:email');
    return Response.redirect(authorize.toString(), 302);
  }

  // 2) Callback
  if (url.pathname.endsWith('/api/auth/github-oauth/callback')) {
    const code = url.searchParams.get('code');
    if (!code) return new Response('Missing code', { status: 400 });

    // Troca code → access_token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/auth/github-oauth/callback`,
      })
    });
    const tokenJson = await tokenRes.json();
    const token = tokenJson.access_token;

    // 3) Entrega o token ao Admin (popup → parent)
    const html = `
<!doctype html><meta charset="utf-8">
<script>
  (function () {
    var payload = { token: ${JSON.stringify(token)} };
    window.opener && window.opener.postMessage('authorization:github:' + JSON.stringify(payload), '*');
    window.close();
  })();
</script>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new Response('Not found', { status: 404 });
}
