// /functions/api/contato.js
// Cloudflare Pages Function — contato (formulário)
// Aceita GET (diagnóstico) e POST (envio via MailChannels)
// Requer variáveis em "Settings > Environment variables":
/*
  TURNSTILE_SECRET_KEY = <chave secreta>
  MAIL_TO              = fabiopavie@pavieadvogado.com
  MAIL_FROM            = contato@pavieadvocacia.com.br
  MAIL_FROM_NAME       = "PAVIE Advocacia — Site"
*/
export async function onRequest(context) {
  const { request, env, cf } = context;
  const url = new URL(request.url);
  if (request.method === "GET") {
    const ok = true;
    const diag = {
      ok,
      method: "GET",
      host: url.hostname,
      hasSecret: !!env.TURNSTILE_SECRET_KEY,
      hasMailTo: !!env.MAIL_TO,
      hasMailFrom: !!env.MAIL_FROM,
    };
    return json(diag);
  }

  if (request.method !== "POST") {
    return jsonErr(405, "method_not_allowed", "Use POST em /api/contato.");
  }

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return jsonErr(400, "bad_request", "FormData inválido.");
  }

  // Honeypot
  if ((form.get("company") || "").trim() !== "") {
    return json({ ok: true, honeypot: true, ignored: true });
  }

  // Campos obrigatórios
  const nome     = (form.get("nome") || "").toString().trim();
  const email    = (form.get("email") || "").toString().trim();
  const telefone = (form.get("telefone") || "").toString().trim();
  const servico  = (form.get("servico") || "").toString().trim() || "Não informado";
  const mensagem = (form.get("mensagem") || "").toString().trim();
  const consent  = (form.get("consent") || "").toString().trim().toLowerCase() === "on";
  const token    = (form.get("cf-turnstile-response") || form.get("turnstile") || "").toString().trim();

  // Validações
  if (!nome || !email || !telefone || !mensagem) {
    return jsonErr(400, "validation_error", "Preencha todos os campos obrigatórios.");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return jsonErr(400, "validation_error", "E-mail inválido.");
  }
  if (!consent) {
    return jsonErr(400, "validation_error", "É necessário aceitar a Política de Privacidade.");
  }

  // Verifica Turnstile
  const turnstileSecret = env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return jsonErr(500, "config_error", "TURNSTILE_SECRET_KEY ausente.");
  }
  const ip = request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "";
  const tsOk = await verifyTurnstile(turnstileSecret, token, ip, url.hostname);
  if (!tsOk.ok) {
    return jsonErr(400, "turnstile_failed", tsOk.error || "Falha na verificação do Turnstile.");
  }

  // Monta e envia via MailChannels
  const to   = env.MAIL_TO   || "fabiopavie@pavieadvogado.com";
  const from = env.MAIL_FROM || `no-reply@${url.hostname}`;
  const fromName = env.MAIL_FROM_NAME || "PAVIE Advocacia — Site";

  const subject = `📩 Novo contato — ${nome}`;

  const text = [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Telefone/WhatsApp: ${telefone}`,
    `Serviço: ${servico}`,
    ``,
    `Mensagem:`,
    mensagem
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;line-height:1.5">
      <h2>Nova solicitação de contato</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0"><b>Nome:</b> ${escapeHtml(nome)}</td></tr>
        <tr><td style="padding:6px 0"><b>E-mail:</b> ${escapeHtml(email)}</td></tr>
        <tr><td style="padding:6px 0"><b>Telefone/WhatsApp:</b> ${escapeHtml(telefone)}</td></tr>
        <tr><td style="padding:6px 0"><b>Serviço:</b> ${escapeHtml(servico)}</td></tr>
      </table>
      <p style="margin-top:16px;white-space:pre-wrap">${escapeHtml(mensagem)}</p>
    </div>`;

  const payload = {
    personalizations: [ { to: [ { email: to } ] } ],
    from: { email: from, name: fromName },
    reply_to: { email, name: nome },
    subject,
    content: [
      { type: "text/plain", value: text },
      { type: "text/html",  value: html }
    ],
    headers: { "X-Entity-Ref-ID": request.headers.get("cf-ray") || "" }
  };

  let mcResp, mcText = "";
  try {
    mcResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    mcText = await mcResp.text();
  } catch (err) {
    return jsonErr(502, "mail_error", `Falha ao contatar MailChannels: ${err.message}`);
  }

  if (mcResp.status !== 202) {
    return jsonErr(502, "mail_error", `MailChannels respondeu ${mcResp.status}`, {
      providerBody: mcText.slice(0, 1000)
    });
  }

  return json({ ok: true, sent: true });
}

async function verifyTurnstile(secret, response, remoteip, expectedHost) {
  if (!response) return { ok: false, error: "token_vazio" };
  const body = new URLSearchParams({
    secret, response, remoteip
  });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!data.success) {
    return { ok: false, error: (data['error-codes']||[]).join(',') || 'falha_desconhecida' };
  }
  if (expectedHost && data.hostname && data.hostname !== expectedHost) {
    return { ok: false, error: "hostname_invalido" };
  }
  return { ok: true };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function jsonErr(status, code, message, extra = undefined) {
  return json({ ok: false, error: code, message, ... (extra || {}) }, status);
}

function escapeHtml(s = "") {
  return s.replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", """: "&quot;", "'": "&#039;"
  })[ch]);
}
