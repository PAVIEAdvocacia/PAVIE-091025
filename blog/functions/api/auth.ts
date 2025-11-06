export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });

  const state = crypto.randomUUID();
  const redirectUri = origin + '/blog/api/callback';

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo user');
  authorizeUrl.searchParams.set('state', state);

  const headers = new Headers({
    'Set-Cookie': \oauth_state=\; Path=/; HttpOnly; Secure; SameSite=Lax\
  });

  return Response.redirect(authorizeUrl.toString(), 302, { headers });
}
