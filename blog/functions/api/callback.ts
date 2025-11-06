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

  const html = \<!doctype html><html><body>
  <script>
    (function() {
      var payload = 'authorization:github:success:' + JSON.stringify({ token: '', provider: 'github' }).replace('', \${token}\);
      try {
        window.opener && window.opener.postMessage(payload, '\');
      } catch(e) {
        window.opener && window.opener.postMessage(payload, '*');
      }
      window.close();
    })();
  </script>
  Sucesso. VocÃª pode fechar esta janela.
  </body></html>\;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
