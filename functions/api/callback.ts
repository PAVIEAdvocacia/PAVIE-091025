function htmlBody(status: string, content: unknown) {
  const payload = JSON.stringify(content).replace(/</g, "\\u003c");
  return `<!doctype html><meta charset="utf-8" />
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage('authorization:github:${status}:${payload}', e.origin);
    window.removeEventListener('message', receiveMessage, false);
    window.close();
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Pode fechar esta janela.</p>`;
}

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie") || "";
  const stateCookie = (cookie.match(/gh_oauth_state=([^;]+)/) || [])[1];

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return new Response(htmlBody("error", { message: "Invalid state/code" }), { headers: { "Content-Type": "text/html" }});
  }

  const redirectUri = `${url.origin}/api/callback`;
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      "user-agent": "decap-cms-cloudflare-pages"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code, redirect_uri: redirectUri
    })
  });
  const data = await resp.json();

  if (!data.access_token) {
    return new Response(htmlBody("error", data), { headers: { "Content-Type": "text/html" }});
  }

  return new Response(htmlBody("success", { token: data.access_token }), {
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": "gh_oauth_state=; Path=/; Max-Age=0"
    }
  });
};
