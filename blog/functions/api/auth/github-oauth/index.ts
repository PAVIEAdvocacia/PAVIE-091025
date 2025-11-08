export interface Env { GITHUB_CLIENT_ID: string }

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const redirectUri = `${url.origin}/api/auth/github-oauth/callback`;

  const qs = new URLSearchParams({
    client_id: ctx.env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'repo user:email',
  });

  return Response.redirect(`https://github.com/login/oauth/authorize?${qs.toString()}`, 302);
};
