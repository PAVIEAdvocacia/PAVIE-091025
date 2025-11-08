export const onRequestGet: PagesFunction = async ({ env, request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  const body = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID as string,
    client_secret: env.GITHUB_CLIENT_SECRET as string,
    code,
  });

  // Troca code -> token no GitHub
  const gh = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body,
  });
  if (!gh.ok) return new Response("OAuth exchange failed", { status: 502 });

  const json = await gh.json<any>();
  if (!json.access_token) return new Response("No token", { status: 500 });

  // O backend GitHub do Decap aceita JSON { token: "<access_token>" }
  // (padrão de OAuth server para Decap/Netlify CMS).
  // Referências de backend e exemplos com Cloudflare Workers/Pages: :contentReference[oaicite:3]{index=3}
  return new Response(JSON.stringify({ token: json.access_token }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
