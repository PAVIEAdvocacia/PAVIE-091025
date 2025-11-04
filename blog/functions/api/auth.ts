export interface Env { GITHUB_CLIENT_ID: string; }

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const REDIRECT_PATH = '/api/callback';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const auth = new URL(GITHUB_AUTHORIZE);
  auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  auth.searchParams.set('redirect_uri', new URL(REDIRECT_PATH, url.origin).toString());
  auth.searchParams.set('scope', 'repo,user:email');
  auth.searchParams.set('state', state);
  return Response.redirect(auth.toString(), 302);
};
