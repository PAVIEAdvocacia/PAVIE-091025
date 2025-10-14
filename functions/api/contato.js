/**
 * Cloudflare Pages Function: /api/contato
 * - Accepts POST only (multipart/form-data or JSON)
 * - Verifies Turnstile
 * - Sends email via MailChannels (no API key needed when running on Cloudflare)
 *
 * Required ENV (Pages → Settings → Environment variables):
 *   MAIL_FROM           e.g. "contato@pavieadvocacia.com.br"
 *   MAIL_TO             e.g. "fabiopavie@pavieadvogado.com"
 *   TURNSTILE_SECRET    Turnstile Secret Key (server side)
 * Optional:
 *   MAIL_BCC            e.g. "no-reply@pavieadvogado.com"
 *   CONTACT_SECRET      if set, enables GET /api/contato?secret=... for quick diagnostics
 */

const BAD_REQUEST = (obj) => new Response(JSON.stringify({ ok:false, ...obj }), { status: 400, headers: { "content-type": "application/json; charset=utf-8" }});
const OK = (obj) => new Response(JSON.stringify({ ok:true, ...obj }), { status: 200, headers: { "content-type": "application/json; charset=utf-8" }});

export async function onRequestGet({ request, env }) {
  // Optional diagnostics if you append ?secret=CONTACT_SECRET
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (env.CONTACT_SECRET && secret && secret === env.CONTACT_SECRET) {
    const has = (k) => Boolean(env[k] && String(env[k]).trim().length > 0);
    return OK({
      method: "GET",
      host: url.host,
      hasSecret: true,
      hasMailTo: has("MAIL_TO"),
      hasMailFrom: has("MAIL_FROM"),
    });
  }
  return new Response("Método não permitido", { status: 405, headers: { "Allow": "POST" } });
}

export async function onRequestOptions() {
  // CORS preflight (same-origin by default, but this keeps it future-proof)
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://pavieadvocacia.com.br",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Max-Age": "600",
    },
  });
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const ip = request.headers.get("CF-Connecting-IP") || "";

  // Basic env validation
  if (!env.MAIL_TO || !env.MAIL_FROM || !env.TURNSTILE_SECRET) {
    console.error("[contato] Config faltando.", { hasMAIL_TO: !!env.MAIL_TO, hasMAIL_FROM: !!env.MAIL_FROM, hasTURNSTILE_SECRET: !!env.TURNSTILE_SECRET });
    return BAD_REQUEST({ code: "config_error", message: "Configuração do servidor ausente. Avise o administrador." });
  }

  // Parse body (FormData or JSON)
  let formData;
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      formData = await request.formData();
    } else if (ct.includes("application/json")) {
      const json = await request.json();
      formData = new FormData();
      for (const [k, v] of Object.entries(json)) formData.set(k, String(v));
    } else {
      return BAD_REQUEST({ code: "unsupported_media_type", message: "Envie os dados como 'multipart/form-data'." });
    }
  } catch (e) {
    console.error("[contato] Erro ao ler body", e);
    return BAD_REQUEST({ code: "body_parse_error", message: "Não foi possível ler os dados enviados." });
  }

  // Honeypot (spam)
  if ((formData.get("company") || "").toString().trim() !== "") {
    return OK({ ignored: true, reason: "honeypot" });
  }

  const nome = (formData.get("nome") || "").toString().trim().slice(0, 160);
  const email = (formData.get("email") || "").toString().trim().slice(0, 254);
  const telefone = (formData.get("telefone") || "").toString().trim().slice(0, 40);
  const servico = (formData.get("servico") || "").toString().trim().slice(0, 120);
  const mensagem = (formData.get("mensagem") || "").toString().trim().slice(0, 5000);

  // Accept both 'turnstile' and 'cf-turnstile-response'
  const tsToken = (formData.get("turnstile") || formData.get("cf-turnstile-response") || "").toString();

  // Basic validation
  if (!nome || !email || !telefone || !mensagem || !servico) {
    return BAD_REQUEST({ code: "validation_error", message: "Preencha todos os campos obrigatórios." });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) return BAD_REQUEST({ code: "validation_error", message: "E-mail inválido." });
  if (!tsToken) return BAD_REQUEST({ code: "validation_error", message: "Validação de segurança ausente. Recarregue a página e tente novamente." });

  // Verify Turnstile
  try {
    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET);
    body.set("response", tsToken);
    if (ip) body.set("remoteip", ip);

    const tsResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const tsData = await tsResp.json();
    if (!tsData.success) {
      console.warn("[turnstile.verify] falhou", tsData);
      return BAD_REQUEST({ code: "validation_error", message: "Não foi possível validar o reCAPTCHA/Turnstile. Tente novamente." });
    }
  } catch (err) {
    console.error("[turnstile.verify] erro", err);
    return BAD_REQUEST({ code: "turnstile_error", message: "Falha ao validar segurança. Tente novamente." });
  }

  // Compose MailChannels payload
  const when = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const subject = `Novo contato do site — ${nome} (${servico})`;

  const textLines = [
    `Novo contato recebido em ${when}`,
    ``,
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Telefone/WhatsApp: ${telefone}`,
    `Serviço de interesse: ${servico}`,
    ``,
    `Mensagem:`,
    mensagem,
    ``,
    `IP do visitante: ${ip}`,
  ];
  const text = textLines.join("\n");

  const html = `
    <div style="font:14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;color:#111">
      <p>Novo contato recebido em <b>${when}</b>.</p>
      <ul>
        <li><b>Nome:</b> ${escapeHtml(nome)}</li>
        <li><b>E-mail:</b> ${escapeHtml(email)}</li>
        <li><b>Telefone/WhatsApp:</b> ${escapeHtml(telefone)}</li>
        <li><b>Serviço de interesse:</b> ${escapeHtml(servico)}</li>
      </ul>
      <p style="margin-top:12px"><b>Mensagem:</b></p>
      <pre style="white-space:pre-wrap;font:inherit">${escapeHtml(mensagem)}</pre>
      <hr style="margin:16px 0;border:0;border-top:1px solid #eee"/>
      <small>IP do visitante: ${escapeHtml(ip)}</small>
    </div>
  `;

  const mcPayload = {
    personalizations: [{
      to: [{ email: env.MAIL_TO }],
      ...(env.MAIL_BCC ? { bcc: [{ email: env.MAIL_BCC }] } : {}),
    }],
    from: { email: env.MAIL_FROM, name: "PAVIE | Site" },
    reply_to: { email, name: nome },
    subject,
    content: [
      { type: "text/plain; charset=utf-8", value: text },
      { type: "text/html; charset=utf-8", value: html },
    ],
    headers: {
      "X-Entity-Ref-ID": cryptoRandomId(),
      "X-Originating-IP": ip,
    },
  };

  let mailRes, mailText;
  try {
    mailRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mcPayload),
    });
    mailText = await mailRes.text();
  } catch (e) {
    console.error("[mailchannels] network error", e);
    return BAD_REQUEST({ code: "mail_error", message: "Erro de rede ao enviar e-mail." });
  }

  if (!mailRes.ok) {
    console.error("[mailchannels] status:", mailRes.status, "body:", mailText);
    // 401 here usually means wrong endpoint (must be api.mailchannels.net) or not running from Cloudflare.
    return BAD_REQUEST({ code: "mail_error", message: `Falha ao enviar (código ${mailRes.status}).` });
  }

  return OK({ message: "Enviado com sucesso." });
}

function escapeHtml(s="") {
  return s.replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
}
function cryptoRandomId() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a).map(b => b.toString(16).padStart(2,"0")).join("");
}