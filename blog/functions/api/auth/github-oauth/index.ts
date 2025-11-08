// Autoriza no GitHub e redireciona para o callback do seu domínio.
export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const origin = `${url.protocol}//${url.host}`;
  const clientId = ctx.env.GITHUB_CLIENT_ID as string;
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID ausente", { status: 500 });
  }

  const redirectUri = `${origin}/api/auth/github-oauth/callback`;
  const scope = "repo,user:email"; // para repositório privado use 'repo'; público: 'public_repo' também funciona

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);

  return Response.redirect(authorize.toString(), 302);
};
