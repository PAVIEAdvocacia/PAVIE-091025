// functions/api/contato.js
// Cloudflare Pages Functions (Node runtime).
// Envia e-mail via MailChannels com validação Turnstile e retorna JSON padronizado.
//
// Variáveis de ambiente (Pages → Settings → Environment variables):
//  - TURNSTILE_SECRET  (Secret)
//  - MAIL_FROM         (Plain)  ex.: contato@pavieadvocacia.com.br
//  - MAIL_TO           (Plain)  ex.: fabiopavie@pavieadvogado.com
//
// Teste de diagnóstico: GET /api/contato  → { ok:true, hasSecret, hasMailTo, hasMailFrom }
//
// Segurança/Entrega:
//  - "From" usa seu domínio (evita spoofing e melhora SPF/DMARC).
//  - "Reply-To" é o e-mail do visitante.
//  - Limites de tamanho para campos e normalização básica.
//  - Campos aceitos: nome, email, telefone, assunto OU servico, mensagem.

export const onRequestGet = async ({ env }) => {
  const hasSecret = Boolean(env.TURNSTILE_SECRET);
  const hasMailTo = Boolean(env.MAIL_TO);
  const hasMailFrom = Boolean(env.MAIL_FROM);
  return new Response(JSON.stringify({
    ok: true, method: "GET", hasSecret, hasMailTo, hasMailFrom
  }), { headers: { "content-type": "application/json; charset=utf-8", "Cache-Control":"no-store" } });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    // 1) Verificar variáveis essenciais
    if (!env.TURNSTILE_SECRET || !env.MAIL_FROM || !env.MAIL_TO) {
      return json({ success: false, error: "VarsMissing", detail: {
        hasSecret: Boolean(env.TURNSTILE_SECRET),
        hasMailTo: Boolean(env.MAIL_TO),
        hasMailFrom: Boolean(env.MAIL_FROM),
      }}, 500);
    }

    // 2) Ler o FormData
    const ct = request.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data") && !ct.includes("application/x-www-form-urlencoded")) {
      return json({ success: false, error: "UnsupportedContentType" }, 400);
    }

    const formData = await readFormData(request);
    const nome = clip(formData.get("nome") || formData.get("name") || "", 120);
    const email = clip(formData.get("email") || "", 160);
    const telefone = clip(formData.get("telefone") || "", 40);
    const assunto = clip((formData.get("assunto") || formData.get("servico") || "Contato"), 140);
    const mensagem = clip(formData.get("mensagem") || formData.get("message") || "", 5000);
    const privacy = (formData.get("privacidade") || formData.get("aceite") || "on") ? "Aceito" : "Não informado";

    // 3) Validar Turnstile
    const tsToken = formData.get("cf-turnstile-response");
    if (!tsToken) {
      return json({ success: false, error: "TurnstileMissing" }, 400);
    }
    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: tsToken,
      }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const tsData = await tsRes.json();
    if (!tsData.success) {
      return json({ success: false, error: "TurnstileFail", tsData }, 403);
    }

    // 4) Montar e enviar via MailChannels
    const now = new Date().toISOString();
    const subject = `[Site] ${assunto} — ${nome || "Contato"}`;
    const html = `
      <div style="font:14px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <h2 style="margin:0 0 8px 0">Nova mensagem pelo site</h2>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
          <tr><td><b>Data</b></td><td>${now}</td></tr>
          <tr><td><b>Nome</b></td><td>${escapeHtml(nome)}</td></tr>
          <tr><td><b>E-mail</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Telefone</b></td><td>${escapeHtml(telefone)}</td></tr>
          <tr><td><b>Assunto</b></td><td>${escapeHtml(assunto)}</td></tr>
          <tr><td><b>Privacidade</b></td><td>${escapeHtml(privacy)}</td></tr>
        </table>
        <hr/>
        <pre style="white-space:pre-wrap">${escapeHtml(mensagem)}</pre>
      </div>`;

    const payload = {
      personalizations: [{ to: [{ email: env.MAIL_TO }] }],
      from: { email: env.MAIL_FROM, name: nome || "Formulário do Site" },
      reply_to: [{ email: email || env.MAIL_FROM, name: nome || "" }],
      subject,
      content: [{ type: "text/html", value: html }]
    };

    const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (mcRes.ok) {
      const info = await mcRes.json().catch(() => ({}));
      return json({ success: true, delivered: true, info });
    } else {
      const errText = await mcRes.text();
      return json({ success: false, error: "MailChannelsFail", status: mcRes.status, detail: errText }, 502);
    }

  } catch (err) {
    return json({ success: false, error: "ServerError", detail: String(err) }, 500);
  }
};

// Helpers
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function readFormData(request) {
  // Cloudflare Pages Functions fornece request.formData()
  if (typeof request.formData === "function") {
    return await request.formData();
  }
  // fallback (não deve ocorrer aqui)
  const text = await request.text();
  return new URLSearchParams(text);
}

function clip(v, max) {
  const s = (v || "").toString().trim();
  return s.length > max ? s.slice(0, max) : s;
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}
