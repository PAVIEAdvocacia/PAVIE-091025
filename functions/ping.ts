export function onRequest() {
  return new Response("pong-js", { headers: { "content-type": "text/plain" } });
}
