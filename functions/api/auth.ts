export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(JSON.stringify({ error: "No code provided (JS)" }), {
      headers: { "content-type": "application/json" }
    });
  }
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });
  const data = await r.json();
  return new Response(JSON.stringify({ token: data.access_token || null }), {
    headers: { "content-type": "application/json" }
  });
}
