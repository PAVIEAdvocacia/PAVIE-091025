// Troca o 'code' por access_token e devolve-o ao Decap CMS via postMessage.
export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const clientId = ctx.env.GITHUB_CLIENT_ID as string;
  const clientSecret = ctx.env.GITHUB_CLIENT_SECRET as string;
  if (!clientId || !clientSecret) {
    return new Response("Missing OAuth env vars", { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/auth/github-oauth/callback`,
    }),
  });
  const tokenData = await tokenRes.json<{ access_token?: string }>();
  const token = tokenData.access_token;

  if (!token) return new Response("OAuth exchange failed", { status: 500 });

  // IMPORTANTÍSSIMO: Decap espera mensagens STRING com este prefixo.
  // Handshake + sucesso, origem explícita do seu admin.
  const adminOrigin = `${url.origin}`;
  const html = `<!doctype html><html><body>
<script>
  (function() {
    window.opener && window.opener.postMessage("authorizing:github", "${adminOrigin}");
    setTimeout(function() {
      window.opener && window.opener.postMessage(
        'authorization:github:success:' + JSON.stringify({ token: '${token}', provider: 'github' }),
        '${adminOrigin}'
      );
      window.close();
    }, 100);
  })();
</script>
Autorizado, pode fechar esta janela.
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};
