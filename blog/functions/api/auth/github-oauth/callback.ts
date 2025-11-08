diff --git a/functions/api/auth/github-oauth/callback.ts b/functions/api/auth/github-oauth/callback.ts
new file mode 100644
index 0000000000000000000000000000000000000000..b0cb6801c0add22a64baf161c597c43d9affc5f3
--- /dev/null
+++ b/functions/api/auth/github-oauth/callback.ts
@@ -0,0 +1,196 @@
+interface GithubAccessTokenResponse {
+  access_token?: string;
+  error?: string;
+  error_description?: string;
+  error_uri?: string;
+}
+
+const STATE_COOKIE = "github_oauth_state";
+
+function parseCookies(cookieHeader: string | null): Record<string, string> {
+  if (!cookieHeader) {
+    return {};
+  }
+
+  return Object.fromEntries(
+    cookieHeader
+      .split(/;\s*/)
+      .filter(Boolean)
+      .map((cookie) => {
+        const [name, ...valueParts] = cookie.split("=");
+        return [decodeURIComponent(name), decodeURIComponent(valueParts.join("="))];
+      })
+  );
+}
+
+function buildHtml({
+  status,
+  payload,
+  origin,
+  message,
+}: {
+  status: "success" | "error";
+  payload: Record<string, unknown>;
+  origin: string;
+  message: string;
+}): string {
+  const safePayload = JSON.stringify(payload).replace(/</g, "\\u003c");
+  const allowedOrigins = JSON.stringify([origin]);
+  const authorizationMessage = `authorization:github:${status}:${safePayload}`;
+  const humanMessage = message.replace(/</g, "&lt;");
+
+  return `<!DOCTYPE html>
+<html lang="pt-BR">
+  <head>
+    <meta charset="utf-8" />
+    <title>Login com GitHub · Pavie Advocacia</title>
+    <meta name="viewport" content="width=device-width, initial-scale=1" />
+    <style>
+      :root { color-scheme: light dark; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
+      body { margin: 0; padding: 2rem 1.5rem; display: grid; place-items: center; min-height: 100vh; background: #0b1d30; color: #fff; }
+      main { max-width: 28rem; text-align: center; background: rgba(7, 17, 29, 0.75); padding: 2rem; border-radius: 1rem; box-shadow: 0 1.5rem 3rem rgba(0,0,0,0.35); backdrop-filter: blur(12px); }
+      h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
+      p { margin: 0.5rem 0 0; line-height: 1.5; }
+      .hint { font-size: 0.85rem; opacity: 0.8; margin-top: 1.25rem; }
+      button { margin-top: 1.5rem; padding: 0.6rem 1.2rem; font-size: 0.95rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: inherit; cursor: pointer; }
+      button:focus-visible { outline: 2px solid #6ec1ff; outline-offset: 3px; }
+    </style>
+  </head>
+  <body>
+    <main>
+      <h1>Processando autenticação…</h1>
+      <p>${humanMessage}</p>
+      <p class="hint">Esta janela será fechada automaticamente assim que o processo terminar.</p>
+      <button type="button" onclick="window.close()">Fechar janela</button>
+    </main>
+    <script>
+      (function() {
+        const allowedOrigins = ${allowedOrigins};
+        const authorizationMessage = ${JSON.stringify(authorizationMessage)};
+        const status = ${JSON.stringify(status)};
+
+        function notifyParent(targetOrigin) {
+          if (!window.opener) {
+            return;
+          }
+          if (!allowedOrigins.includes(targetOrigin)) {
+            return;
+          }
+          window.opener.postMessage(authorizationMessage, targetOrigin);
+          if (status === 'success') {
+            window.close();
+          }
+        }
+
+        function receiveMessage(event) {
+          notifyParent(event.origin);
+          window.removeEventListener('message', receiveMessage, false);
+        }
+
+        window.addEventListener('message', receiveMessage, false);
+
+        const targetOrigin = allowedOrigins[0];
+        if (window.opener) {
+          window.opener.postMessage('authorizing:github', targetOrigin);
+          // Garante fechamento mesmo se o Admin não responder.
+          setTimeout(function () { notifyParent(targetOrigin); }, 1000);
+        }
+      })();
+    </script>
+  </body>
+</html>`;
+}
+
+export const onRequest = async ({ request, env }) => {
+  const url = new URL(request.url);
+  const code = url.searchParams.get("code");
+  const state = url.searchParams.get("state");
+
+  if (!code) {
+    return new Response("Missing code", { status: 400 });
+  }
+
+  const cookies = parseCookies(request.headers.get("cookie"));
+  const expectedState = cookies[STATE_COOKIE];
+
+  if (!state || !expectedState || state !== expectedState) {
+    const html = buildHtml({
+      status: "error",
+      payload: { error: "state_mismatch" },
+      origin: url.origin,
+      message: "Não foi possível validar a sua sessão. Por favor, tente novamente.",
+    });
+
+    return new Response(html, {
+      status: 400,
+      headers: {
+        "content-type": "text/html; charset=utf-8",
+        "cache-control": "no-store",
+        "set-cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
+      },
+    });
+  }
+
+  let data: GithubAccessTokenResponse;
+  try {
+    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
+      method: "POST",
+      headers: {
+        "content-type": "application/json",
+        accept: "application/json",
+        "user-agent": "decap-cms-cloudflare-oauth",
+      },
+      body: JSON.stringify({
+        client_id: env.GITHUB_CLIENT_ID,
+        client_secret: env.GITHUB_CLIENT_SECRET,
+        code,
+        redirect_uri: `${url.origin}/api/auth/github-oauth/callback`,
+        state,
+      }),
+    });
+
+    data = (await tokenResponse.json()) as GithubAccessTokenResponse;
+    if (!tokenResponse.ok) {
+      data.error = data.error || `unexpected_status_${tokenResponse.status}`;
+    }
+  } catch (error) {
+    const html = buildHtml({
+      status: "error",
+      payload: { error: "fetch_failed", detail: error instanceof Error ? error.message : String(error) },
+      origin: url.origin,
+      message: "Não foi possível contactar o GitHub. Verifique sua conexão e tente novamente.",
+    });
+
+    return new Response(html, {
+      status: 502,
+      headers: {
+        "content-type": "text/html; charset=utf-8",
+        "cache-control": "no-store",
+        "set-cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
+      },
+    });
+  }
+
+  const hasError = Boolean(data.error);
+  const payload = hasError
+    ? { error: data.error, error_description: data.error_description, provider: "github" }
+    : { token: data.access_token, provider: "github" };
+
+  const html = buildHtml({
+    status: hasError ? "error" : "success",
+    payload,
+    origin: url.origin,
+    message: hasError
+      ? "O GitHub retornou um erro. Você pode fechar esta janela e tentar novamente."
+      : "Autenticação concluída com sucesso."
+  });
+
+  return new Response(html, {
+    status: hasError ? 400 : 200,
+    headers: {
+      "content-type": "text/html; charset=utf-8",
+      "cache-control": "no-store",
+      "set-cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
+    },
+  });
+};
