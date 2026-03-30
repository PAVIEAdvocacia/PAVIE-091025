export interface Env {
  GITHUB_CLIENT_ID?: string;
}

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const CALLBACK_PATH = "/api/callback";
const STATE_COOKIE_NAME = "decap_oauth_state";
const STATE_MAX_AGE_SECONDS = 600;

function buildStateCookie(value: string) {
  return [
    `${STATE_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${STATE_MAX_AGE_SECONDS}`,
  ].join("; ");
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const clientId = env.GITHUB_CLIENT_ID?.trim() || "";

  if (!clientId) {
    return new Response("Missing GITHUB_CLIENT_ID", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const requestUrl = new URL(request.url);
  const state = crypto.randomUUID();
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", new URL(CALLBACK_PATH, requestUrl.origin).toString());
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      "Cache-Control": "no-store",
      "Set-Cookie": buildStateCookie(state),
    },
  });
};
