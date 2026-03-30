export interface Env {
  GITHUB_CLIENT_SECRET?: string;
}

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const CALLBACK_PATH = "/api/callback";
const STATE_COOKIE_NAME = "decap_oauth_state";
const DECAP_GITHUB_CLIENT_ID = "Ov23liQidMMKZXOSzq3e";

function parseStateCookie(cookieHeader: string | null) {
  if (!cookieHeader) return "";

  const prefix = `${STATE_COOKIE_NAME}=`;
  for (const rawPart of cookieHeader.split(";")) {
    const part = rawPart.trim();
    if (!part.startsWith(prefix)) continue;
    return decodeURIComponent(part.slice(prefix.length));
  }

  return "";
}

function clearStateCookie() {
  return [
    `${STATE_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

function renderCallbackPage(status: "success" | "error", payload: Record<string, unknown>) {
  const encodedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");

  return `<!doctype html>
<meta charset="utf-8" />
<title>${status === "success" ? "Autenticacao concluida" : "Falha na autenticacao"}</title>
<script>
(function () {
  function receiveMessage(event) {
    window.opener.postMessage('authorization:github:${status}:${encodedPayload}', event.origin);
    window.removeEventListener('message', receiveMessage, false);
    window.close();
  }
  window.addEventListener('message', receiveMessage, false);
  if (window.opener && typeof window.opener.postMessage === 'function') {
    window.opener.postMessage('authorizing:github', '*');
  }
})();
</script>
<p>${status === "success" ? "Autenticacao concluida. Voce pode fechar esta janela." : "Nao foi possivel autenticar. Voce pode fechar esta janela."}</p>`;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code") || "";
  const state = requestUrl.searchParams.get("state") || "";
  const expectedState = parseStateCookie(request.headers.get("Cookie"));

  if (!env.GITHUB_CLIENT_SECRET) {
    return new Response(
      renderCallbackPage("error", { message: "Missing GITHUB_CLIENT_SECRET" }),
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Set-Cookie": clearStateCookie(),
        },
      },
    );
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response(
      renderCallbackPage("error", { message: "Invalid state or missing code" }),
      {
        status: 400,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Set-Cookie": clearStateCookie(),
        },
      },
    );
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "decap-cms-cloudflare-pages",
    },
    body: JSON.stringify({
      client_id: DECAP_GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: new URL(CALLBACK_PATH, requestUrl.origin).toString(),
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    return new Response(
      renderCallbackPage("error", {
        message: tokenData.error || "OAuth token exchange failed",
        description: tokenData.error_description || "",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "Set-Cookie": clearStateCookie(),
        },
      },
    );
  }

  return new Response(
    renderCallbackPage("success", { token: tokenData.access_token }),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Set-Cookie": clearStateCookie(),
      },
    },
  );
};
