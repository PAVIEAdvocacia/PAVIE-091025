// functions/api/auth.ts

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // 1) PRIMEIRA ETAPA: iniciar OAuth (sem "code")
  if (!code) {
    // callback = este mesmo endpoint, sem querystring
    const callback = `${url.origin}/api/auth`;

    // opcional: gerar um state para CSRF; pode guardar em cookie se quiser validar depois
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: callback,
      scope: "repo",
      state,
      // esse parâmetro melhora a UX quando a conta correta já está logada
      // skip_account_picker: "true"  // (GitHub aceita; comente se não quiser)
    });

    const authorizeUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    return Response.redirect(authorizeUrl, 302);
  }

  // 2) SEGUNDA ETAPA: voltou do GitHub com "code" → trocar por access_token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();
  const token = data?.access_token ?? "";

  // HTML que devolve o token ao Decap via postMessage e fecha o popup
  const html = `<!doctype html>
<meta charset="utf-8">
<title>Auth</title>
<script>
(function () {
  function send(msg) {
    try { window.opener && window.opener.postMessage(msg, "*"); } catch(e) {}
    window.close();
  }
  var token = ${JSON.stringify(token)};
  if (token) {
    send("authorization:github:success:" + token);
  } else {
    send("authorization:github:error:" + ${JSON.stringify(JSON.stringify(data))});
  }
})();
</script>`;

  return new Response(html, { headers: { "content-type": "text/html" } });
}
