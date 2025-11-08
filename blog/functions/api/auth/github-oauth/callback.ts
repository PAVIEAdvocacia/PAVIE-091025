export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  // Troca do code pelo access_token no GitHub
  const client_id = ctx.env.GITHUB_CLIENT_ID;
  const client_secret = ctx.env.GITHUB_CLIENT_SECRET;
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new URLSearchParams({ client_id, client_secret, code }),
  });
  const data = await tokenRes.json();
  const token = data.access_token;

  if (!token) {
    return new Response("OAuth exchange failed", { status: 500 });
  }

  // HTML que notifica o Admin e fecha o popup
  const html = `
<!doctype html>
<meta charset="utf-8">
<title>OAuth completo</title>
<script>
  (function () {
    try {
      var token = ${JSON.stringify(token)};
      if (window.opener) {
        window.opener.postMessage(
          'authorization:github:' + JSON.stringify({ token: token }),
          '*'
        );
      }
    } catch (e) {}
    window.close();
  })();
</script>
<p>Você pode fechar esta janela.</p>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};
