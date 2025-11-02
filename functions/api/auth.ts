// functions/api/auth.ts
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const scope = url.searchParams.get("scope") || "repo"; // Decap costuma pedir "repo"
  const redirectUri = `${url.origin}/api/auth`;

  // 1) Sem "code": manda para o GitHub autorizar
  if (!code) {
    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("allow_signup", "false");
    // opcional: state
    const state = url.searchParams.get("state") || Math.random().toString(36).slice(2);
    authUrl.searchParams.set("state", state);

    return Response.redirect(authUrl.toString(), 302);
  }

  // 2) Com "code": troca por access_token
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });

  const data = await r.json();
  const token = data?.access_token;

  // Resposta no formato que o Decap espera (popup -> postMessage -> fecha)
  const ok = Boolean(token);
  const payload = ok ? { token } : { error: data || "no_token" };
  const channel = ok ? "authorization:github:success:" : "authorization:github:error:";

  const html = `<!doctype html><html><body>
<script>
  (function () {
    var msg = '${channel}' + JSON.stringify(${JSON.stringify(payload)});
    try { window.opener && window.opener.postMessage(msg, '*'); } catch(e) {}
    window.close();
    // fallback se não fechar
    document.body.innerText = ${JSON.stringify(ok ? "Login concluído. Pode fechar esta aba." : "Falha na autenticação. Veja o console.")};
  })();
</script>
</body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
