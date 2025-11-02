// functions/api/auth.ts
export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Esta rota é o callback do GitHub.
  // Se não veio "code", não é para responder nada especial – o Decap
  // é quem inicia o authorize no GitHub e manda redirecionar para cá.
  if (!code) {
    return new Response(
      JSON.stringify({ error: "No code provided (JS)" }),
      { headers: { "content-type": "application/json" }, status: 400 }
    );
  }

  // Troca o "code" por access_token
  const r = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await r.json();
  const token = data?.access_token ?? "";

  // O Decap espera um HTML que faça postMessage para a janela de origem
  // Formato de mensagem aceito: 'authorization:github:success:<token>'
  // (ou 'authorization:github:error:<msg>').
  const html = `
<!doctype html>
<meta charset="utf-8" />
<title>Auth</title>
<script>
(function () {
  function send(msg) {
    try { window.opener && window.opener.postMessage(msg, "*"); } catch(e) {}
    window.close();
  }
  var token = ${JSON.stringify(token)};
  if (token) {
    send('authorization:github:success:' + token);
  } else {
    var err = ${JSON.stringify(data)};
    send('authorization:github:error:' + JSON.stringify(err));
  }
})();
</script>`;

  return new Response(html, { headers: { "content-type": "text/html" } });
}
