export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirectUri = `${url.origin}/api/auth`;

  // 1) Primeira etapa: redirecionar para o GitHub
  if (!code) {
    const scope = url.searchParams.get("scope") || "repo";
    const state = crypto.randomUUID();

    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authorize.searchParams.set("redirect_uri", redirectUri);
    authorize.searchParams.set("scope", scope);
    authorize.searchParams.set("state", state);

    return Response.redirect(authorize.toString(), 302);
  }

  // 2) Segunda etapa: trocar code por token
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();
  const token = data?.access_token || null;

  // 3) Retornar HTML com postMessage → Decap CMS
  const html = `<!doctype html>
<html lang="pt-br">
<meta charset="utf-8" />
<title>Autenticando...</title>
<script>
(function () {
  var token = ${JSON.stringify(token)};
  if (token) {
    // envia para a janela mãe
    window.opener?.postMessage('authorization:github:success:' + JSON.stringify({ token: token }), '*');
  } else {
    window.opener?.postMessage('authorization:github:error:' + JSON.stringify(${JSON.stringify(data)}), '*');
  }
  window.close();
})();
</script>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;">
  <p>Autenticando no GitHub...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
