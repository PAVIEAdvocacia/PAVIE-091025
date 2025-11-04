export interface Env { GITHUB_CLIENT_ID: string; GITHUB_CLIENT_SECRET: string; }

const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const res = await fetch(GITHUB_TOKEN, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: new URL('/api/callback', url.origin).toString()
    })
  });
  const json = await res.json();
  const token = json.access_token;
  if (!token) return new Response('OAuth failed', { status: 401 });

  const html = `<!doctype html><html><body><script>
    (function(){
      var data = { token: ${JSON.stringify(token)}, provider: 'github' };
      var msg = 'authorization:github:'+JSON.stringify(data);
      if (window.opener) window.opener.postMessage(msg, '*');
      else if (window.parent) window.parent.postMessage(msg, '*');
      window.close();
    })();
  </script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
};
