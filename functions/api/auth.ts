// functions/api/auth.ts
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";

  // URL pública para callback (tem que bater com o OAuth App do GitHub)
  const redirectUri = `https://${env.SITE_DOMAIN || "pavieadvocacia.com.br"}/api/auth`;

  // 1) Sem "code": manda para o authorize do GitHub
  if (!code) {
    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authorize.searchParams.set("redirect_uri", redirectUri);
    // Escopo "repo" para editar conteúdos via Git numa org privada/pública
    authorize.searchParams.set("scope", "repo");
    if (state) authorize.searchParams.set("state", state);

    return Response.redirect(authorize.toString(), 302);
  }

  // 2) Com "code": troca por access_token
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await r.json();
  const token = data.access_token || "";

  // Página que avisa o Decap e fecha o popup
  const html = `<!doctype html>
<html>
  <meta charset="utf-8" />
  <title>Autenticado</title>
  <style>
    body{font:14px system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:grid;place-items:center;height:100vh;color:#222}
    .box{max-width:580px;padding:24px;border:1px solid #ddd;border-radius:10px}
  </style>
  <body>
    <div class="box">
      <p>Autenticação realizada. Você pode fechar esta janela.</p>
    </div>
    <script>
      (function () {
        function notify() {
          try {
            var payload = { token: ${JSON.stringify(token)} };
            if (window.opener) {
              window.opener.postMessage('authorization:github:success:' + JSON.stringify(payload), '*');
              window.close();
            } else {
              // fallback: nada, já mostramos a mensagem na tela
            }
          } catch (e) {
            console.error(e);
          }
        }
        notify();
      })();
    </script>
  </body>
</html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
