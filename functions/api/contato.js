\
/**
 * Cloudflare Pages Function: /api/contato
 *
 * Requisitos:
 * - Content-Type: application/json
 * - Campos obrigatórios: nome, email, mensagem
 * - Honeypot: company (deve permanecer vazio)
 * - Turnstile: token em payload.turnstileToken; segredo em env.TURNSTILE_SECRET
 * - Envio via MailChannels (env.MAILCHANNELS_FROM, env.MAILCHANNELS_TO[, MAILCHANNELS_CC/BCC])
 */
export const onRequestPost = async ({ request, env, cf }) => {
  const json = (obj, status = 200, headers = {}) => {
    return new Response(JSON.stringify(obj, null, 2), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", ...headers },
    });
  };

  const text = (txt, status = 200, headers = {}) => {
    return new Response(txt, { status, headers: { "content-type": "text/plain; charset=utf-8", ...headers } });
  };

  // 1) Content-Type guard (evita 415)
  const ct = request.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Unsupported Media Type", details: "Use Content-Type: application/json" }, 415);
  }

  // 2) Parse JSON
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, error: "Invalid JSON", details: String(e) }, 400);
  }

  const nome = (body.nome || "").toString().trim();
  const email = (body.email || "").toString().trim();
  const telefone = (body.telefone || "").toString().trim();
  const servico = (body.servico || "").toString().trim();
  const mensagem = (body.mensagem || "").toString().trim();
  const honeypot = (body.company || "").toString().trim();
  const turnstileToken = (body.turnstileToken || "").toString().trim();

  // 3) Honeypot
  if (honeypot) {
    return json({ ok: false, error: "Bot detected" }, 400);
  }

  // 4) Requisitos mínimos
  const missing = [];
  if (!nome) missing.push("nome");
  if (!email) missing.push("email");
  if (!mensagem) missing.push("mensagem");
  if (missing.length) {
    return json({ ok: false, error: "Campos obrigatórios ausentes", details: { missing } }, 422);
  }

  // 5) Email básico
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return json({ ok: false, error: "E-mail inválido", details: { email } }, 422);
  }

  // 6) Turnstile
  if (!turnstileToken) {
    return json({ ok: false, error: "Turnstile token ausente" }, 403);
  }
  const secret = env.TURNSTILE_SECRET;
  if (!secret) {
    return json({ ok: false, error: "TURNSTILE_SECRET não configurado no ambiente" }, 500);
  }

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", turnstileToken);
  try {
    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const tsJson = await tsRes.json();
    if (!tsJson.success) {
      return json({ ok: false, error: "Falha na verificação do Turnstile", details: { "error-codes": tsJson["error-codes"] || null } }, 403);
    }
  } catch (e) {
    return json({ ok: false, error: "Erro ao verificar Turnstile", details: String(e) }, 502);
  }

  // 7) MailChannels payload
  const MC_FROM = env.MAILCHANNELS_FROM || "no-reply@pavieadvocacia.com.br"; // TODO: ajuste no Cloudflare
  const MC_TO = (env.MAILCHANNELS_TO || "").split(",").map(s => s.trim()).filter(Boolean);
  const MC_CC = (env.MAILCHANNELS_CC || "").split(",").map(s => s.trim()).filter(Boolean);
  const MC_BCC = (env.MAILCHANNELS_BCC || "").split(",").map(s => s.trim()).filter(Boolean);

  if (!MC_TO.length) {
    return json({ ok: false, error: "MAILCHANNELS_TO ausente", details: "Defina um ou mais destinatários no ambiente" }, 500);
  }

  const allTo = MC_TO.map(e => ({ email: e }));
  const ccArr = MC_CC.map(e => ({ email: e }));
  const bccArr = MC_BCC.map(e => ({ email: e }));

  const subject = `Novo contato via site — ${nome}`;
  const dateISO = new Date().toISOString();

  const plain =
`Data: ${dateISO}
Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Serviço: ${servico}

Mensagem:
${mensagem}
`;

  const html =
`<h2>Novo contato via site</h2>
<ul>
  <li><strong>Data:</strong> ${dateISO}</li>
  <li><strong>Nome:</strong> ${sanitize(nome)}</li>
  <li><strong>E-mail:</strong> ${sanitize(email)}</li>
  <li><strong>Telefone:</strong> ${sanitize(telefone)}</li>
  <li><strong>Serviço:</strong> ${sanitize(servico)}</li>
</ul>
<pre style="white-space:pre-wrap">${sanitize(mensagem)}</pre>`;

  const payload = {
    personalizations: [
      {
        to: allTo,
        ...(ccArr.length ? { cc: ccArr } : {}),
        ...(bccArr.length ? { bcc: bccArr } : {}),
      },
    ],
    from: { email: MC_FROM, name: "PAVIE | Formulário do Site" },
    subject,
    content: [
      { type: "text/plain", value: plain },
      { type: "text/html", value: html },
    ],
    headers: { "Reply-To": email },
    envelope: {
      from: MC_FROM,
      to: [...MC_TO, ...MC_CC, ...MC_BCC].filter(Boolean),
    },
  };

  try {
    const r = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const ok = r.ok;
    const txt = await r.text();
    if (!ok) {
      return json({ ok: false, error: "Falha ao enviar e-mail via MailChannels", details: txt }, 502);
    }
  } catch (e) {
    return json({ ok: false, error: "Erro ao conectar ao MailChannels", details: String(e) }, 502);
  }

  return json({ ok: true, msg: "Enviado com sucesso" }, 200);
};

function sanitize(s) {
  return String(s).replace(/[&<>"]/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[m]));
}
