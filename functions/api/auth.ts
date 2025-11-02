export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // URL para a qual o GitHub deve redirecionar de volta (este próprio endpoint)
  const redirectUri = `${url.origin}/api/auth`;

  // 1) Fase de INÍCIO: sem "code" → mande o usuário para o authorize do GitHub
  if (!code) {
    const scope = url.searchParams.get("scope") || "repo";
    const state = crypto.randomUUID(); // anti-CSRF (o Decap não checa, mas é boa prática)

    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authorize.searchParams.set("redirect_uri", redirectUri);
    authorize.searchParams.set("scope", scope);
    authorize.searchParams.set("state", state);

    return Response.redirect(authorize.toString(), 302);
  }

  // 2) Fase de RETORNO: com "code" → troque por access_token
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();

  if (!data?.access_token) {
    return new Response(JSON.stringify({ error: "bad_code", detail: data }), {
      status: 400,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  return new Response(JSON.stringify({ token: data.access_token }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
