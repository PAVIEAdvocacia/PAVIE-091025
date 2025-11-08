// functions/api/auth/github-oauth/index.ts
export const onRequest: PagesFunction<{
  GITHUB_CLIENT_ID: string
}> = async ({ request, env }) => {
  const url = new URL(request.url);

  // 1) Gera state criptograficamente aleatório (CSRF)
  const stateBytes = new Uint8Array(16);
  crypto.getRandomValues(stateBytes);
  const state = [...stateBytes].map(b => b.toString(16).padStart(2, '0')).join('');

  // 2) Cookie de state (Lax: suficiente para retorno do próprio domínio)
  const cookie = [
    `oauth_state=${state}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=600' // 10 min
  ].join('; ');

  // 3) Monta URL de autorização
  const auth = new URL('https://github.com/login/oauth/authorize');
  auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  auth.searchParams.set('redirect_uri', `${url.origin}/api/auth/github-oauth/callback`);
  auth.searchParams.set('scope', 'repo user:email');
  auth.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': cookie,
      'Location': auth.toString(),
      'Cache-Control': 'no-store'
    }
  });
};
