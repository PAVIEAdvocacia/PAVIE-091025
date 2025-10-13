
/**
 * Cloudflare Pages Function: /api/contato
 * - GET  → diagnóstico (sem dados sensíveis)
 * - POST → valida Turnstile e envia via MailChannels
 *          sempre responde com 303 redirect para evitar tela 502 ao enviar via <form>
 * - OPTIONS → CORS
 */
const JSON_HEADERS = { "content-type": "application/json; charset=UTF-8" };

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { ...JSON_HEADERS, ...extra } });

const seeOther = (location) =>
  new Response(null, { status: 303, headers: { Location: location } });

async function verifyTurnstile(token, secret, remoteip = "") {
  if (!token) return { success: false, "error-codes": ["missing-input-response"] };
  if (!secret) return { success: false, "error-codes": ["missing-input-secret"] };
  const fd = new FormData();
  fd.append("secret", secret);
  fd.append("response", token);
  if (remoteip) fd.append("remoteip", remoteip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: fd });
  try { return await r.json(); } catch { return { success:false, "error-codes":["invalid-json"] }; }
}

function esc(s=""){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");}
function cryptoId(){const a=new Uint8Array(16); crypto.getRandomValues(a); return Array.from(a).map(b=>b.toString(16).padStart(2,"0")).join("");}

export const onRequest = async ({ request, env }) => {
  const method = request.method.toUpperCase();

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // GET: diagnóstico simples
  if (method === "GET") {
    return json({
      ok: true,
      metodo: "GET",
      hasSecret: Boolean(env.TURNSTILE_SECRET_KEY),
      hasMailTo: Boolean(env.MAIL_TO),
      hasMailFrom: Boolean(env.MAIL_FROM),
    });
  }

  if (method !== "POST") return json({ ok:false, error:"MethodNotAllowed" }, 405);

  // POST
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const host = new URL(request.url).hostname;
    const accept = (request.headers.get("accept") || "").toLowerCase();
    const returnTo = `https://${host}/#agendar`;

    let fields = {};
    const ctype = (request.headers.get("content-type") || "");
    if (ctype.includes("application/json")) fields = await request.json();
    else {
      const form = await request.formData();
      for (const [k,v] of form.entries()) fields[k] = v;
    }

    const name = (fields.name || fields.nome || "").toString().trim();
    const email = (fields.email || "").toString().trim();
    const phone = (fields.phone || fields.telefone || "").toString().trim();
    const subject = (fields.subject || fields.assunto || "Contato via site").toString().trim();
    const message = (fields.message || fields.mensagem || "").toString().trim();
    const tsToken = (fields["cf-turnstile-response"] || fields["turnstile"] || "").toString().trim();

    // Anti‑spam (honeypot)
    if (fields.company) {
      return seeOther(`${returnTo}?sent=0&spam=1`);
    }

    if (!name || !email || !message) {
      return seeOther(`${returnTo}?sent=0&code=validation`);
    }

    const ts = await verifyTurnstile(tsToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!ts?.success) {
      return seeOther(`${returnTo}?sent=0&code=bot`);
    }

    const text = [
      `Novo contato pelo site (${host})`,
      `Nome: ${name}`,
      `Email: ${email}`,
      phone ? `Telefone: ${phone}` : null,
      "",
      "Mensagem:",
      message,
      "",
      `IP: ${ip}`
    ].filter(Boolean).join("\n");

    const html = `\
      <div style="font-family:system-ui, Arial, sans-serif; line-height:1.5; font-size:16px;">
        <p><strong>Novo contato pelo site (${host})</strong></p>
        <p><strong>Nome:</strong> ${esc(name)}<br/>
           <strong>Email:</strong> ${esc(email)}<br/>
           ${phone ? `<strong>Telefone:</strong> ${esc(phone)}<br/>` : ""}
        </p>
        <p><strong>Mensagem:</strong><br/>${esc(message).replace(/\\n/g,"<br/>")}</p>
        <p style="color:#666;font-size:12px;margin-top:16px;">IP: ${esc(ip)}</p>
      </div>`;

    const fromEmail = (env.MAIL_FROM && env.MAIL_FROM.trim()) ? env.MAIL_FROM.trim() : `no-reply@${host}`;

    const payload = {
      personalizations: [{
        to: [{ email: env.MAIL_TO }],
        dkim_domain: host,
        dkim_selector: "mailchannels",
      }],
      from: { email: fromEmail, name: env.MAIL_FROM_NAME || "Formulário do Site" },
      reply_to: { email, name },
      subject: subject || "Contato via site",
      content: [{ type:"text/plain", value:text }, { type:"text/html", value:html }],
      headers: { "X-Entity-Ref-ID": cryptoId() }
    };

    const send = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify(payload)
    });

    // Mesmo se o MailChannels falhar, evitamos 5xx para não exibir a página 502
    if (!send.ok) {
      // Redireciona com erro amigável
      return seeOther(`${returnTo}?sent=0&code=mail`);
    }

    return seeOther(`${returnTo}?sent=1`);
  } catch (e) {
    return seeOther(`/#agendar?sent=0&code=server`);
  }
};
