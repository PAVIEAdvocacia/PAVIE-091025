// functions/api/contato.js
// PAVIE — Pages Function: valida Turnstile (com idempotency) e envia via MailChannels.
export const onRequestGet = async ({ env }) => {
  return j({ ok: true, method: "GET",
    hasSecret: !!env.TURNSTILE_SECRET, hasMailTo: !!env.MAIL_TO, hasMailFrom: !!env.MAIL_FROM });
};

export const onRequestPost = async ({ request, env }) => {
  const bad = (obj, status=400) => j(obj, status);
  try {
    if (!env.TURNSTILE_SECRET || !env.MAIL_FROM || !env.MAIL_TO) {
      return bad({ success:false, error:"VarsMissing",
        hasSecret: !!env.TURNSTILE_SECRET, hasMailTo: !!env.MAIL_TO, hasMailFrom: !!env.MAIL_FROM }, 500);
    }

    const ct = request.headers.get("content-type") || "";
    if (!/multipart\/form-data|application\/x-www-form-urlencoded/i.test(ct)) {
      return bad({ success:false, error:"UnsupportedContentType" }, 415);
    }

    const form = await request.formData();
    const token = form.get("cf-turnstile-response");
    if (!token) return bad({ success:false, error:"TurnstileMissing" });

    // Dados do formulário
    const nome = trunc(form.get("nome") || form.get("name") || "", 120);
    const email = trunc(form.get("email") || "", 160);
    const telefone = trunc(form.get("telefone") || "", 40);
    const assunto = trunc(form.get("assunto") || form.get("servico") || "Contato", 140);
    const mensagem = trunc(form.get("mensagem") || form.get("message") || "", 5000);

    // Turnstile siteverify com idempotency_key e remoteip para evitar 'timeout-or-duplicate' em retries
    const remoteip = request.headers.get("CF-Connecting-IP")
      || request.headers.get("X-Forwarded-For")
      || request.headers.get("x-real-ip")
      || undefined;

    const idempotency = cryptoRandom();

    const body = new URLSearchParams();
    body.set("secret", env.TURNSTILE_SECRET);
    body.set("response", token);
    if (remoteip) body.set("remoteip", remoteip);
    body.set("idempotency_key", idempotency);

    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body
    });
    const tsData = await tsRes.json();

    if (!tsData.success) {
      return bad({ success:false, error:"TurnstileFail", tsData }, 403);
    }

    // Monta o e-mail
    const subject = `[Site] ${assunto} — ${nome || "Contato"}`;
    const html = `<div style="font:14px/1.45 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <h2>Nova mensagem pelo site</h2>
      <p><b>Nome:</b> ${esc(nome)}<br/>
         <b>E-mail:</b> ${esc(email)}<br/>
         <b>Telefone:</b> ${esc(telefone)}<br/>
         <b>Assunto:</b> ${esc(assunto)}</p>
      <hr/>
      <pre style="white-space:pre-wrap">${esc(mensagem)}</pre>
    </div>`;

    const mc = {
      personalizations: [{ to: [{ email: env.MAIL_TO }] }],
      from: { email: env.MAIL_FROM, name: nome || "Formulário do Site" },
      reply_to: email ? [{ email, name: nome || "" }] : undefined,
      subject, content: [{ type: "text/html", value: html }]
    };

    const send = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify(mc)
    });

    if (!send.ok) {
      const detail = await send.text();
      return bad({ success:false, error:"MailChannelsFail", status: send.status, detail }, 502);
    }

    return j({ success:true, delivered:true });
  } catch (err) {
    return j({ success:false, error:"ServerError", detail: String(err) }, 500);
  }
};

function j(obj, status=200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
    }
  });
}
function trunc(v, n){ const s=(v||"").toString().trim(); return s.length>n?s.slice(0,n):s; }
function esc(s){ return (s||"").replace(/[&<>\"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }
function cryptoRandom() {
  // UUID v4 simples
  const bytes = new Uint8Array(16);
  (globalThis.crypto||require('crypto').webcrypto).getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
  const hex = [...bytes].map(b=>b.toString(16).padStart(2,"0"));
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}
