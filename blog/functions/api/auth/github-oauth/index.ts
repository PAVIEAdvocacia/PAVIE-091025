export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const clientId = env.GITHUB_CLIENT_ID as string;
  const redirectUri = new URL("/api/auth/github-oauth/callback", new URL(request.url).origin).toString();
  const scope = "repo user:email";

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);

  return Response.redirect(authorize.toString(), 302);
};
