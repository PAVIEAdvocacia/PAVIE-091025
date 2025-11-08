diff --git a/functions/api/auth/github-oauth/index.ts b/functions/api/auth/github-oauth/index.ts
new file mode 100644
index 0000000000000000000000000000000000000000..97899adfcba7de3b8138d943c1e7efb7d19a0583
--- /dev/null
+++ b/functions/api/auth/github-oauth/index.ts
@@ -0,0 +1,19 @@
+export const onRequest = async ({ request, env }) => {
+  const url = new URL(request.url);
+  const state = crypto.randomUUID();
+  const redirectUri = `${url.origin}/api/auth/github-oauth/callback`;
+
+  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
+  authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
+  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
+  authorizeUrl.searchParams.set("scope", "repo user:email");
+  authorizeUrl.searchParams.set("state", state);
+
+  const response = Response.redirect(authorizeUrl.toString(), 302);
+  response.headers.append(
+    "Set-Cookie",
+    `github_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
+  );
+
+  return response;
+};
