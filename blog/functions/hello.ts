export const onRequestGet: PagesFunction = async () => {
  return new Response("OK from Pages Functions /hello", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
