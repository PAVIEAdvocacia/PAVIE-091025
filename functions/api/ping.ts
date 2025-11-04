export const onRequestGet: PagesFunction = async ({ request }) => {
  return new Response(JSON.stringify({
    ok: true,
    url: request.url,
    note: "Se você está vendo este JSON, /api/* está chegando às Functions."
  }), { headers: { 'Content-Type': 'application/json' }});
};
