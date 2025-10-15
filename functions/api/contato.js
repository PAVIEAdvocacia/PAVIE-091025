// functions/api/contato.js (corrigido)
/**
 * Cloudflare Pages Function — /api/contato
 * - POST: processa formulário, valida Turnstile e envia e‑mail via MailChannels
 * - GET : diagnóstico rápido das variáveis e do ambiente
 *
 * Variáveis de ambiente esperadas (Settings > Environment variables):
 *  MAIL_FROM              -> ex.: "contato@pavieadvocacia.com.br"
 *  MAIL_FROM_NAME         -> ex.: "PAVIE | Advocacia — Formulário"
 *  MAIL_TO                -> ex.: "fabiopavie@pavieadvocacia.com.br"
 *  CHAVE_SECRETA_DA_TORRE -> (Turnstile secret key)
 *
 * Aliases PT mantidos para retrocompatibilidade:
 *  CORREIO_DE, CORREIO_DE_NOME, ENVIAR_PARA, SEGREDO_DA_CATRACA
 */

export const onRequestGet = async ({ env }) => {
  const required = [
    "MAIL_FROM",
    "MAIL_FROM_NAME",
    "MAIL_TO",
    "CHAVE_SECRETA_DA_TORRE",
  ];

  const aliases = {
    MAIL_FROM: "CORREIO_DE",
    MAIL_FROM_NAME: "CORREIO_DE_NOME",
    MAIL_TO: "ENVIAR_PARA",
    CHAVE_SECRETA_DA_TORRE: "SEGREDO_DA_CATRACA",
  };

  const missing = {};
  for (const key of required) {
    const value = env[key] ?? env[aliases[key]];
    missing[key] = !value;
  }

  const hasSecret = !!(env.CHAVE_SECRETA_DA_TORRE ?? env.SEGREDO_DA_CATRACA);

  return new Response(
    JSON.stringify(
      {
        ok: Object.values(missing).every((v) => v === false),
        metodo: "GET",
        missing_env: missing,
        hasSecret,
      },
      null,
      2
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } }
  );
};

export const onRequestPost = async ({ request, env }) => {
  try {
    // 1) Variáveis de ambiente (com aliases PT)
    const MAIL_FROM = env.MAIL_FROM ?? env.CORREIO_DE;
    const MAIL_FROM_NAME = env.MAIL_FROM_NAME ?? env.CORREIO_DE_NOME;
    const MAIL_TO = env.MAIL_TO ?? env.ENVIAR_PARA;
    const TURNSTILE_SECRET =
      env.CHAVE_SECRETA_DA_TORRE ?? env.SEGREDO_DA_CATRACA;

    const missing = {
      MAIL_FROM: !MAIL_FROM,
      MAIL_FROM_NAME: !MAIL_FROM_NAME,
      MAIL_TO: !MAIL_TO,
      CHAVE_SECRETA_DA_TORRE: !TURNSTILE_SECRET,
    };
    if (Object.values(missing).some(Boolean)) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing_env", missing }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // 2) Coleta do corpo
    const contentType = request.headers.get("content-type") || "";
    let data = {};
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      data = Object.fromEntries(form.entries());
    } else if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const form = await request.formData().catch(() => null);
      data = form ? Object.fromEntries(form.entries()) : {};
    }

    // Campos esperados
    const nome = (data.nome || data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const telefone = (data.telefone || data.phone || "").toString().trim();
    const assunto = (data.assunto || data.subject || "Contato via site")
      .toString()
      .trim();
    const mensagem = (data.mensagem || data.message || "").toString().trim();
    const ip = request.headers.get("cf-connecting-ip") || "";
    const origem = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";

    // Token Turnstile
    const turnstileToken =
      data["cf-turnstile-response"] ||
      data["turnstileToken"] ||
      data["turnstile"] ||
      "";

    // 3) Validação Turnstile
    const verifyResp = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: ip,
        }),
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );
    const verify = await verifyResp.json().catch(() => ({}));

    if (!verify.success) {
      return new Response(
        JSON.stringify({ ok: false, error: "TurnstileFail", tsData: verify }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // 4) Email via MailChannels
    const subject = `[Site] ${assunto}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans',sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px 0">Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome) || "(não informado)"}</p>
        <p><strong>E‑mail:</strong> ${escapeHtml(email) || "(não informado)"} </p>
        <p><strong>Telefone:</strong> ${escapeHtml(telefone) || "(não informado)"} </p>
        <p><strong>Assunto:</strong> ${escapeHtml(assunto)}</p>
        <p><strong>Mensagem:</strong><br>${nl2br(escapeHtml(mensagem))}</p>
        <hr>
        <p style="color:#666"><small>IP: ${escapeHtml(ip)} · Origem: ${escapeHtml(origem)} · UA: ${escapeHtml(userAgent)}</small></p>
      </div>
    `;

    const mcPayload = {
      from: { email: MAIL_FROM, name: MAIL_FROM_NAME },
      personalizations: [{ to: [{ email: MAIL_TO }] }],
      subject,
      content: [
        { type: "text/plain", value: stripHtml(html) },
        { type: "text/html", value: html },
      ],
      // CORREÇÃO: reply_to deve ser um OBJETO, não um array
      ...(email ? { reply_to: { email, name: nome || undefined } } : {}),
    };

    const mcResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mcPayload),
    });

    const mcText = await mcResp.text();
    if (!mcResp.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "MailChannelsFail",
          status: mcResp.status,
          detail: mcText,
          // útil para troubleshooting
          diag: { hasFrom: !!MAIL_FROM, hasTo: !!MAIL_TO, hasReplyTo: !!email },
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Mensagem enviada com sucesso." }),
      { headers: { "content-type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "ServerError", detail: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function nl2br(str = "") {
  return String(str).replace(/\n/g, "<br>");
}
function stripHtml(str = "") {
  return String(str).replace(/<[^>]+>/g, "");
}
