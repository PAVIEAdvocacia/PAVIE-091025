// functions/api/contato.js (versão final corrigida)
// Cloudflare Pages Function - Envio de formulário com validação Turnstile e MailChannels

export const onRequestGet = async ({ env }) => {
  const required = ["MAIL_FROM", "MAIL_FROM_NAME", "MAIL_TO", "CHAVE_SECRETA_DA_TORRE"];
  const aliases = {
    MAIL_FROM: "CORREIO_DE",
    MAIL_FROM_NAME: "CORREIO_DE_NOME",
    MAIL_TO: "ENVIAR_PARA",
    CHAVE_SECRETA_DA_TORRE: "SEGREDO_DA_CATRACA"
  };
  const missing = {};
  for (const key of required) missing[key] = !(env[key] || env[aliases[key]]);
  const hasSecret = !!(env.CHAVE_SECRETA_DA_TORRE || env.SEGREDO_DA_CATRACA);

  return new Response(
    JSON.stringify({ ok: Object.values(missing).every(v => !v), metodo: "GET", missing_env: missing, hasSecret }, null, 2),
    { headers: { "content-type": "application/json; charset=utf-8" } }
  );
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const MAIL_FROM = env.MAIL_FROM || env.CORREIO_DE;
    const MAIL_FROM_NAME = env.MAIL_FROM_NAME || env.CORREIO_DE_NOME;
    const MAIL_TO = env.MAIL_TO || env.ENVIAR_PARA;
    const TURNSTILE_SECRET = env.CHAVE_SECRETA_DA_TORRE || env.SEGREDO_DA_CATRACA;

    if (!MAIL_FROM || !MAIL_FROM_NAME || !MAIL_TO || !TURNSTILE_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: "missing_env" }), { status: 500 });
    }

    // Lê os dados do formulário
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const nome = (data.nome || "").trim();
    const email = (data.email || "").trim();
    const telefone = (data.telefone || "").trim();
    const assunto = (data.assunto || "Contato via site").trim();
    const mensagem = (data.mensagem || "").trim();
    const ip = request.headers.get("cf-connecting-ip") || "";
    const origem = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";

    // Valida Turnstile
    const token = data["cf-turnstile-response"] || data["turnstileToken"] || data["turnstile"];
    const verifyResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
      headers: { "content-type": "application/x-www-form-urlencoded" }
    });
    const verify = await verifyResp.json();
    if (!verify.success) {
      return new Response(JSON.stringify({ ok: false, error: "TurnstileFail", tsData: verify }), { status: 400 });
    }

    // Monta e envia e-mail via MailChannels
    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5">
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(assunto)}</p>
        <p><strong>Mensagem:</strong><br>${nl2br(escapeHtml(mensagem))}</p>
        <hr>
        <p style="color:#666;font-size:0.9em">IP: ${escapeHtml(ip)} · Origem: ${escapeHtml(origem)} · UA: ${escapeHtml(userAgent)}</p>
      </div>
    `;

    const payload = {
      from: { email: MAIL_FROM, name: MAIL_FROM_NAME },
      personalizations: [{ to: [{ email: MAIL_TO }] }],
      subject: `[Site] ${assunto}`,
      content: [
        { type: "text/plain", value: stripHtml(html) },
        { type: "text/html", value: html }
      ],
      ...(email ? { reply_to: { email, name: nome || undefined } } : {})
    };

    const mailResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const mailText = await mailResp.text();
    if (!mailResp.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: "MailChannelsFail", status: mailResp.status, detail: mailText }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: true, message: "Mensagem enviada com sucesso." }), {
      headers: { "content-type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "ServerError", detail: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
function nl2br(str = "") { return str.replace(/\n/g, "<br>"); }
function stripHtml(str = "") { return str.replace(/<[^>]+>/g, ""); }
