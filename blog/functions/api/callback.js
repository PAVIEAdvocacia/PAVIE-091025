// functions/api/callback.js
// Callback do OAuth do GitHub. Finalize o fluxo e entregue o token ao Decap.
export async function onRequest(context) {
  return new Response("Configure o OAuth do GitHub aqui (callback).", { status: 200 });
}