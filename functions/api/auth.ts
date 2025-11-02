export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const code = url.searchParams.get("code");
  const qOrigin = url.searchParams.get("origin") || ""; // Decap envia isso
  const rawState = url.searchParams.get("state") || "";

  // helpers p/ state
  const decodeState = (s: string) => {
    try {
      // pode vir base64url(JSON) ou texto cru
      const maybeJson = JSON.parse(Buffer.from(s, "base64url").toString());
      return maybeJson && typeof maybeJson === "object" ? maybeJson : {};
    } catch {
      return {};
    }
  };

  // início do fluxo
  if (!code) {
    const state = Buffer.from(JSON.stringify({ origin: url.origin })).toString("base64url");
    const gh = new URL("https://github.com/login/oauth/authorize");
    gh.searchParams.set("client_id", ctx.env.GITHUB_CLIENT_ID);
    gh.searchParams.set("scope", "repo");
    gh.searchParams.set("redirect_uri", `${url.origin}/api/auth`);
    // manter também ?origin= para compatibilidade com Decap
    gh.searchParams.set("state", state);
    gh.searchParams.set("origin", url.origin);
    return Response.redirect(gh.toString(), 302);
  }

  const st = decodeState(rawState);
  const openerOrigin =
    (typeof st.origin === "string" && st.origin) ||
    qOrigin ||                // se veio por query
    "";                       // fallback → usaremos '*'

  // troca code → token
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: ctx.env.GITHUB_CLIENT_ID,
      client_secret: ctx.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth`,
    }),
  });
  const json = await res.json();
  const token = json.access_token;

  const html = `<!doctype html><meta charset="utf-8">
<title>${token ? "Autenticação realizada" : "Falha na autenticação"}</title>
<body style="display:grid;place-items:center;height:100vh;font:16px system-ui;background:#fff">
  <div style="padding:16px 20px;border:1px solid #eee;border-radius:10px">
    ${token ? "Autenticação realizada. Você pode fechar esta janela." : "Não foi possível autenticar. Tente novamente."}
  </div>
  <script>
    (function(){
      try{
        var msg = ${token
          ? "`authorization:github:success:` + JSON.stringify({ token: " + JSON.stringify(token) + " })"
          : "`authorization:github:failure:` + JSON.stringify({ error: " + JSON.stringify(json.error || "unknown") + " })"
        };
        var target = ${JSON.stringify(openerOrigin || "*")};
        if (window.opener && typeof window.op
