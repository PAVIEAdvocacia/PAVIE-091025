export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}
const OAUTH_AUTHORIZE = "https://github.com/login/oauth/authorize";
const OAUTH_TOKEN = "https://github.com/login/oauth/access_token";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const redirectUri = new URL("/blog/api/callback", url.origin).toString();

  // Etapa 1: redirecionar ao GitHub
  const state = crypto.randomUUID();
  const authorize = new URL(OAUTH_AUTHORIZE);
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "repo,user:email");
  authorize.searchParams.set("state", state);

  return Response.redirect(authorize.toString(), 302);
};