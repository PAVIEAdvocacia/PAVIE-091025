function closeWithMessage(status: "success" | "error", payload: any, extraHeaders?: HeadersInit) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html><meta charset="utf-8">
  <script>
    (function(){
      window.opener && window.opener.postMessage(${JSON.stringify(message)}, "*");
      window.close();
    })();
  </script>`;
  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", ...(extraHeaders || {}) }
  });
}

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookies = request.headers.get("Cookie") || "";
  const savedState = cookies.match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1] || null;

  if (!code || !state || !savedState || savedState !== state) {
    return closeWithMessage("error", { message: "Invalid OAuth state" });
  }

  const redirect_uri = `${url.origin}/api/callback`;
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri,
      state
    })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error || !data.access_token) {
    return closeWithMessage("error", { message: data.error_description || "OAuth exchange failed" }, {
      "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    });
  }

  return closeWithMessage("success", { token: data.access_token }, {
    "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
  });
};
