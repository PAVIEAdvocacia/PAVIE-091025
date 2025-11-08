export async function onRequestGet(ctx: RequestContext) {
  const url = new URL(ctx.request.url);
  // Subrotas: /api/auth/github-oauth  e  /api/auth/github-oauth/callback
  if (url.pathname.endsWith("/callback")) return callback(ctx, url);
  return authorize(ctx, url);
}

async function authorize(ctx: RequestContext, url: URL) {
  const clientId = ctx.env.GITHUB_CLIENT_ID;
  const redirect = new URL("/api/auth/github-oauth/callback", url.origin).toString();
  const gh = new URL("https://github.com/login/oauth/authorize");
  gh.searchParams.set("client_id", clientId);
  gh.searchParams.set("redirect_uri", redirect);
  gh.searchParams.set("scope", "repo user:email");
  return Response.redirect(gh.toString(), 302);
}

async function callback(ctx: RequestContext, url: URL) {
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      client_id: ctx.env.GITHUB_CLIENT_ID,
      client_secret: ctx.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: new URL("/api/auth/github-oauth/callback", url.origin).toString(),
    }),
  });
  if (!tokenResp.ok) return new Response("Token exchange failed", { status: 502 });
  const data = await tokenResp.json();
  const token = data.access_token;

  // HTML mínimo para entregar o token ao Admin (popup) e fechar
  const html = `<!doctype html><meta charset="utf-8">
<script>
  (function(){
    try {
      const msg = 'authorization:github:' + JSON.stringify({token: ${JSON.stringify("${token}")}});
      (window.opener || window.parent).postMessage(msg, '*');
    } catch (e) {}
    window.close();
  })();
</script>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
}
