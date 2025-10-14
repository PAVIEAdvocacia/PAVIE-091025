// /functions/api/contato.js  (Cloudflare Pages Function)
// Envia mensagens do formulário para MailChannels com validação Turnstile.

const MC_ENDPOINT = "https://api.mailchannels.net/tx/v1/send";

export async function onRequestGet({ request, env }) {
  const host = new URL(request.url).host;
  const body = {
    ok: true,
    method: "GET",
    host,
    hasSecret: Boolean(env.TURNSTILE_SECRET),
    hasMailTo: Boolean(env.MAIL_TO),
    hasMailFrom: Boolean(env.MAIL_FROM),
  };
  return json(body);
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const url = new URL(request.url);

  try {
    // 1) Lê o formulário (multipart/form-data)
    const form = await request.formData();

    const data = {
      company: (form.get("company") || "").toString().trim(),
      nome: (form.get("nome") || "").toString().trim(),
      email: (form.get("email") || "").toString().trim(),
      telefone: (form.get("telefone") || "").toString().trim(),
      servico: (form.get("servico") || "").toString().trim(),
      mensagem: (form.get("mensagem") || "").toString().trim(),
      consent: (form.get("consent") || "").toString().trim(),
      consent_timestamp: (form.get("consent_timestamp") || "").toString().trim(),
      turnstile: (form.get("cf-turnstile-response") || "").toString().trim(),
    };

    console.log(
      "[contato] CF-RAY:",
      request.headers.get("CF-Ray"),
      "IP:",
      getClientIP(request),
      "UA:",
      request.headers.get("User-Agent")
    );
    console.log("[contato] Fields:", Object.keys(data));

    // 2) Validações básicas
    const problems = validate(data);
    if (problems.length) {
      return json({ ok: false, error: "validation_error", details: problems }, 400);
    }

    // 3) Verifica Turnstile
    const t0 = Date.now();
    const tsResp = await verifyTurnstile(env.TURNSTILE_SECRET, data.turnstile, getClientIP(request));
    console.log("[turnstile.verify] status:", tsResp.status, "elapsed(ms):", Date.now() - t0, "resp:", tsResp.body);

    if (!(tsResp.ok && tsResp.body?.success)) {
      return json({ ok: false, error: "turnstile_failed", details: tsResp.body || null }, 429);
    }

    // 4) Monta e envia e-mail via MailChannels
    const toEmail = env.MAIL_TO || "fabiopavie@pavieadvogado.com";
    const fromEmail = env.MAIL_FROM || "contato@pavieadvocacia.com.br";
    const fromName = env.MAIL_FROM_NAME || "PAVIE | Site";

    const subject = `[PAVIE] Novo contato (${safe(data.servico) || "Formulário"}) – ${safe(
      data.nome
    )}`;

    const plain = buildText(data, url.hostname);
    const html = buildHTML(data, url.hostname);

    const payload = {
      personalizations: [
        {
          to: [{ email: toEmail }],
        },
      ],
      from: { email: fromEmail, name: fromName },
      subject,
      headers: {
        // maneira mais compatível de setar Reply-To no MailChannels
        "Reply-To": data.email,
      },
      content: [
        { type: "text/plain", value: plain },
        { type: "text/html", value: html },
      ],
    };

    // Cabeçalhos de IP — ESSENCIAIS p/ MailChannels (evita 401)
    const clientIP = getClientIP(request);

    console.log("[contato] Enviando via MailChannels. From:", fromEmail, "To:", toEmail);

    const mc = await fetch(MC_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Forwarded-For": clientIP,
        "CF-Connecting-IP": clientIP,
      },
      body: JSON.stringify(payload),
    });

    const mcBodyText = await mc.text();
    console.log("[mailchannels] status:", mc.status, "body:", mcBodyText.slice(0, 400));

    if (mc.status >= 200 && mc.status < 300) {
      return json({ ok: true, message: "Mensagem enviada com sucesso." });
    }

    // Falha no envio
    return json(
      { ok: false, error: "mailchannels_error", status: mc.status, details: mcBodyText || null },
      502
    );
  } catch (err) {
    console.error("[contato] exception:", err);
    return json({ ok: false, error: "server_error" }, 500);
  }
}

/* -------------------- helpers -------------------- */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function getClientIP(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-real-ip") ||
    // pega o primeiro IP da lista (caso múltiplos em XFF)
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "0.0.0.0"
  );
}

function validate(d) {
  const errs = [];

  if (!d.nome || d.nome.length < 2) errs.push({ field: "nome", message: "Informe seu nome." });

  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errs.push({ field: "email", message: "E-mail inválido." });

  if (!d.telefone || d.telefone.replace(/\D/g, "").length < 10)
    errs.push({ field: "telefone", message: "Telefone inválido." });

  if (!d.mensagem || d.mensagem.length < 5)
    errs.push({ field: "mensagem", message: "Mensagem muito curta." });

  if (!d.consent || !["on", "true", "1"].includes(d.consent.toLowerCase()))
    errs.push({ field: "consent", message: "É necessário aceitar a Política de Privacidade." });

  if (!d.turnstile) errs.push({ field: "cf-turnstile-response", message: "Validação de segurança ausente." });

  return errs;
}

async function verifyTurnstile(secret, response, remoteip) {
  try {
    const form = new URLSearchParams();
    form.set("secret", secret || "");
    form.set("response", response || "");
    if (remoteip) form.set("remoteip", remoteip);

    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });

    const body = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: { error: "network" } };
  }
}

function buildText(d, host) {
  const lines = [
    `Novo contato recebido em ${host}`,
    "",
    `Nome:      ${d.nome}`,
    `E-mail:    ${d.email}`,
    `Telefone:  ${d.telefone}`,
    `Serviço:   ${d.servico || "-"}`,
    `Empresa:   ${d.company || "-"}`,
    "",
    "Mensagem:",
    d.mensagem,
    "",
    `Consentimento: ${d.consent ? "sim" : "não"} (${d.consent_timestamp || "—"})`,
  ];
  return lines.join("\n");
}

function buildHTML(d, host) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 10px;color:#555">${label}</td><td style="padding:6px 10px"><strong>${safe(
      value || "-"
    )}</strong></td></tr>`;

  return `<!doctype html>
<html><body style="font-family:Arial,Helvetica,sans-serif">
  <h2>Novo contato – ${safe(host)}</h2>
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
    ${row("Nome", d.nome)}
    ${row("E-mail", d.email)}
    ${row("Telefone", d.telefone)}
    ${row("Serviço", d.servico)}
    ${row("Empresa", d.company)}
    ${row("Consentimento", d.consent ? "Sim" : "Não")}
    ${row("Timestamp", d.consent_timestamp || "—")}
  </table>
  <hr/>
  <p><strong>Mensagem:</strong></p>
  <pre style="white-space:pre-wrap;font:inherit">${safe(d.mensagem)}</pre>
</body></html>`;
}

function safe(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
