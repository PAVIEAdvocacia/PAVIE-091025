export const onRequestGet: PagesFunction = async ({ request }) => {
  return new Response(JSON.stringify({
    ok: true,
    url: request.url,
    hint: "Se você está vendo este JSON, as Pages Functions estão ativas em /api/*"
  }), { headers: { 'Content-Type': 'application/json' }});
};
