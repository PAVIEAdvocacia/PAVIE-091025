export function onRequest() {
  return new Response(JSON.stringify({ ok: true, where: "Pages Functions (JS)" }), {
    headers: { "content-type": "application/json" }
  });
}
