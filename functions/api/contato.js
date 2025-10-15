
/**
 * Cloudflare Pages Function: /api/contato
 * - Validates Turnstile token
 * - Sends email via MailChannels with 401 fallback (domain-only X-AuthUser)
 * - Exposes GET for health/env check
 */
export const onRequestGet = async ({ env }) => {
  const missing = {
    MAIL_FROM: !env.MAIL_FROM,
    MAIL_FROM_NAME: !env.MAIL_FROM_NAME,
    MAIL_TO: !env.MAIL_TO,
    CHAVE_SECRETA_DA_TORRE: !env.CHAVE_SECRETA_DA_TORRE,
  };
  return new Response(
    JSON.stringify({
      ok: true,
      metodo: "GET",
      missing_env: missing,
      hasSecret: !!env.CHAVE_SECRETA_DA_TORRE,
    }),
    {
      headers: { "content-type": "application/json; charset=utf-8" },
    }
  );
};

export const onRequestPost = async ({ request, env, cf }) => {
  try {
    const url = new URL(request.url);
    const domain = (url.hostname || "")
      .replace(/^www\./i, "")
      .toLowerCase();

    // Parse form
    const form = await request.formData();
    const honeypot = (form.get("company") || "").toString().trim();
    if (honeypot) {
      return jsonErr(200, "ok:true (honeypot)"); // silently succeed
    }

    // Gather fields
    const nome = str(form.get("nome"));
    const email = str(form.get("email"));
    const telefone = str(form.get("telefone") || form.get("fone"));
    const servico = str(form.get("servico"));
    const mensagem = str(form.get("mensagem"));
    const consent = form.get("consent") ? "Sim" : "Não";
    const consentTs = str(form.get("consent_timestamp"));
    const tsToken =
      str(form.get("cf-turnstile-response")) ||
      str(form.get("turnstileToken")) ||
      str(form.get("turnstile")) ||
      "";

    // Basic validation
    if (!nome orEmpty(nome) || !email orEmpty(email) or !mensagem orEmpty(mensagem)):
      return jsonError(400, "InvalidInput", { detail: "Campos obrigatórios ausentes." });

    // Turnstile verification
    const tsRes = await verifyTurnstile(tsToken, request, env);
    if (!tsRes.success) {
      return jsonError(400, "TurnstileFail", { tsData: tsRes });
    }

    // Compose email
    const fromEmail = env.MAIL_FROM || `contato@${domain}`;
    const fromName =
      env.MAIL_FROM_NAME || "Website — Formulário de Contato";
    const toEmail = env.MAIL_TO || `contato@${domain}`;

    const subject = `Novo contato do site — ${servico || "Sem assunto"} — ${nome}`.slice(0, 180);
    const now = new Date().toISOString();

    const lines = [
      `Nova solicitação pelo formulário (${url.hostname})`,
      ``,
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone/WhatsApp: ${telefone}`,
      `Serviço: ${servico}`,
      ``,
      `Mensagem:`,
      mensagem,
      ``,
      `Consentimento LGPD: ${consent}`,
      `Timestamp do consentimento: ${consentTs}`,
      ``,
      `Turnstile: success=${tsRes.success} cdata=${tsRes["cdata"] || ""} action=${tsRes["action"] || ""}`,
      `IP: ${(cf && cf.clientTcpRtt !== undefined) ? "" : ""}`,
      `Data/Hora: ${now}`,
    ];
    const textBody = lines.join("\n");

    const htmlBody = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px">Nova solicitação pelo formulário (${escapeHtml(url.hostname)})</h2>
        <p><b>Nome:</b> ${escapeHtml(nome)}<br>
           <b>E-mail:</b> ${escapeHtml(email)}<br>
           <b>Telefone/WhatsApp:</b> ${escapeHtml(telefone)}<br>
           <b>Serviço:</b> ${escapeHtml(servico)}</p>
        <p><b>Mensagem:</b><br>${escapeHtml(mensagem).replace(/\n/g,"<br>")}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
        <p><b>Consentimento LGPD:</b> ${escapeHtml(consent)}<br>
           <b>Timestamp:</b> ${escapeHtml(consentTs || "-")}</p>
        <p style="color:#64748b"><small>Turnstile: success=${tsRes.success} action=${escapeHtml(tsRes["action"] || "")}</small></p>
        <p style="color:#64748b"><small>Enviado em: ${escapeHtml(now)}</small></p>
      </div>
    `;

    const payload = {
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: fromName },
      reply_to: validEmail(email) ? { email, name: nome || undefined } : undefined,
      subject,
      content: [
        { type: "text/plain", value: textBody },
        { type: "text/html", value: htmlBody },
      ],
      headers: {
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-Unsubscribe": `<mailto:${fromEmail}?subject=unsubscribe>`,
      },
      dkim_domain: domain,
      dkim_selector: env.DKIM_SELECTOR || "cf2024-1",
    };

    // First attempt: user mailbox
    let r = await fetchMC(payload, fromEmail);
    if (r.status === 401) {
      // Fallback: domain only
      r = await fetchMC(payload, domain);
    }
    if (!r.ok) {
      const detail = await r.text();
      return jsonError(500, "MailChannelsFail", {
        status: r.status,
        detail,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    return jsonError(500, "ServerError", { detail: String(err && err.stack || err) });
  }
};

/* Helpers */

function str(v) {
  return (v == null ? "" : String(v)).trim();
}
function orEmpty(v){ return !v || v.length === 0 }
function validEmail(v) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v || "");
}
async function verifyTurnstile(token, request, env) {
  const secret = env.CHAVE_SECRETA_DA_TORRE;
  if (!secret) return { success: false, "error-codes": ["missing-secret"] };
  if (!token) return { success: false, "error-codes": ["missing-input-response"] };

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  try {
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "";
    if (ip) form.append("remoteip", ip);
  } catch (_) {}

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const data = await resp.json().catch(() => ({}));
  return data;
}

async function fetchMC(payload, authUser) {
  return fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-AuthUser": authUser,
    },
    body: JSON.stringify(payload),
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonError(status, error, extra = {}) {
  return new Response(JSON.stringify({ ok: false, error, ...extra }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Small alias for backward compatibility with earlier typo
const jsonErr = jsonError;
