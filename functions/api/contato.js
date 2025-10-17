// /api/contato.js — Cloudflare Pages Function
// - Verifica Turnstile (env.TURNSTILE_SECRET)
// - Valida payload
// - Envia e-mail via MailChannels (sem necessidade de conta)
// Preencha as VARIÁVEIS A SEGUIR conforme seu domínio/e-mail remetente e destinatário.

export async function onRequestPost(context) {
  const { request, env, cf } = context;

  // --------- CONFIGURAÇÃO (já preenchido com os seus dados) ---------
  const TO_EMAIL = "fabiopavie@pavieadvogado.com";        // Destinatário
  const FROM_EMAIL = "contato@pavieadvocacia.com.br";     // Remetente do seu domínio
  const FROM_NAME  = "PAVIE | Advocacia — Formulário";    // Nome do remetente (aparece no e-mail)
  const TURNSTILE_SECRET = env.TURNSTILE_SECRET;          // Defina em Pages > Settings > Environment variables
  // ------------------------------------------------------------------

  // Segurança básica: somente JSON
  if ((request.headers.get("content-type") || "").indexOf("application/json") === -1) {
    return json({ ok: false, error: "Content-Type inválido. Use application/json." }, 415);
  }

  let body = {};
  try { body = await request.json(); } catch (_e) {
    return json({ ok: false, error: "JSON inválido." }, 400);
  }

  // Honeypot (no backend também)
  if (body.company) return json({ ok: true, msg: "Descartado (honeypot)" });

  const nome = (body.nome || "").trim();
  const email = (body.email || "").trim();
  const telefone = (body.telefone || "").trim();
  const mensagem = (body.mensagem || "").trim();
  const servico = (body.servico || "").trim();
  const turnstileToken = (body.turnstileToken || "").trim();

  // Campos obrigatórios
  if (!nome || !email || !mensagem) {
    return json({ ok: false, error: "Campos obrigatórios ausentes" }, 422);
  }

  // Verificar Turnstile
  try {
    if (!TURNSTILE_SECRET) throw new Error("TURNSTILE_SECRET ausente no ambiente");
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return json({ ok: false, error: "Falha na validação Turnstile", details: verifyJson["error-codes"] || null }, 403);
    }
  } catch (err) {
    return json({ ok: false, error: "Erro ao validar Turnstile: " + err.message }, 500);
  }

  // Montar e enviar via MailChannels
  const subject = `Novo contato — ${nome}${servico ? " (" + servico + ")" : ""}`;
  const textBody =
`Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone || "-"}
Serviço: ${servico || "-"}
IP: ${(request.headers.get("cf-connecting-ip") || "")}

Mensagem:
${mensagem}`;

  const htmlBody =
`<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;line-height:1.5">
  <h2>Novo contato recebido</h2>
  <p><strong>Nome:</strong> ${escapeHtml(nome)}<br/>
     <strong>E-mail:</strong> ${escapeHtml(email)}<br/>
     <strong>Telefone:</strong> ${escapeHtml(telefone || "-")}<br/>
     <strong>Serviço:</strong> ${escapeHtml(servico || "-")}</p>
  <pre style="white-space:pre-wrap;background:#f6f7f9;border-radius:8px;padding:12px">${escapeHtml(mensagem)}</pre>
  <p style="color:#666">IP: ${escapeHtml(request.headers.get("cf-connecting-ip") || "")}</p>
</div>`;

  const mailPayload = {
    personalizations: [{ to: [{ email: TO_EMAIL }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject,
    content: [
      { type: "text/plain", value: textBody },
      { type: "text/html", value: htmlBody }
    ]
  };

  try {
    const mailRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mailPayload),
    });

    if (!mailRes.ok) {
      const t = await mailRes.text();
      return json({ ok: false, error: "Falha ao enviar e-mail (MailChannels)", details: t }, 502);
    }

    // Confirmação para o visitante (opcional): NÃO enviamos e-mail de volta aqui para evitar SPF falhando.
    return json({ ok: true, msg: "Enviado com sucesso" });
  } catch (err) {
    return json({ ok: false, error: "Erro ao enviar e-mail: " + err.message }, 500);
  }
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

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (m) {
    return ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[m];
  });
}
