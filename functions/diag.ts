export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify({ ok: true, where: "Pages Functions" }), {
    headers: { "content-type": "application/json" },
  });
};
