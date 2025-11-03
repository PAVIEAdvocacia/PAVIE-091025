export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const code = url.searchParams.get("code");
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = ctx.env as any;

  // 1) Início -> GitHub
  if (!code) {
    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", GITHUB_CLIENT_ID);
    authorize.searchParams.set("scope", "repo");
    authorize.searchParams.set("redirect_uri", `${url.origin}/api/auth`);
    return Response.redirect(authorize.toString(), 302);
  }

  // 2) Volta -> troca code por token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth`,
    }),
  });

  const tokenJson = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string; };
  const token = tokenJson.access_token || "";

  // 3) HTML -> postMessage e fecha
  const ok = !!token;
  const html = `<!doctype html>
<meta charset="utf-8">
<title>${ok ? "Autenticação realizada" : "Falha na autenticação"}</title>
<body style="display:grid;place-items:center;height:100vh;font:16px system-ui;background:#fff">
  <div style="padding:16px 20px;border:1px solid #eee;border-radius:10px;color:#111">
    ${ok ? "Autenticação realizada. Você pode fechar esta janela." : "Não foi possível autenticar. Tente novamente."}
  </div>
  <script>
    (function () {
      try {
        var msg = ${ok
          ? "`authorization:github:success:` + JSON.stringify({ token: " + JSON.stringify(token) + " })"
          : "`authorization:github:failure:` + JSON.stringify({ error: " + JSON.stringify(tokenJson.error || "unknown") + ", description: " + JSON.stringify(tokenJson.error_description || "") + " })"
        };
        if (window.opener && typeof window.opener.postMessage === "function") {
          window.opener.postMessage(msg, "*");
        }
      } catch (e) { console.error(e); }
      setTimeout(function(){ window.close(); }, 120);
    })();
  </script>
</body>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
