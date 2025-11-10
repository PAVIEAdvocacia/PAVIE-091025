export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}
const OAUTH_TOKEN = "https://github.com/login/oauth/access_token";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const tokenRes = await fetch(OAUTH_TOKEN, {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: new URL("/blog/api/callback", url.origin).toString()
    })
  });
  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token;
  if (!token) return new Response("OAuth failed", { status: 401 });

  return new Response(`<!doctype html><meta charset="utf-8"><script>
    (function(){
      var data = { token: '${token}', provider: 'github' };
      if (window.opener) {
        window.opener.postMessage('authorization:github:'+JSON.stringify(data), '*');
      } else if (window.parent) {
        window.parent.postMessage('authorization:github:'+JSON.stringify(data), '*');
      }
      window.close();
    })();
  </script>`, { headers: { "Content-Type": "text/html; charset=utf-8" }});
};