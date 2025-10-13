const JSON_HEADERS = { "content-type": "application/json; charset=UTF-8", "Access-Control-Allow-Origin": "*" };
const jsonResponse = (obj, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });

async function verifyTurnstile(token, secret, remoteip = "") {
  const start = Date.now();
  try {
    if (!token) return { success: false, "error-codes": ["missing-input-response"] };
    if (!secret) return { success: false, "error-codes": ["missing-input-secret"] };
    const formData = new FormData();
    formData.append("secret", secret);
    formData.append("response", token);
    if (remoteip) formData.append("remoteip", remoteip);
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: formData });
    const json = await resp.json().catch(async ()=>({ parseError:true, raw: await resp.text() }));
    console.log("[turnstile.verify] status:", resp.status, "elapsed(ms):", Date.now()-start, "resp:", json);
    return json;
  } catch (e) {
    console.error("[turnstile.verify] exception:", e);
    return { success:false, "error-codes":["exception"], detail: String(e && e.stack || e) };
  }
}

export const onRequestOptions = async () =>
  new Response(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type"
  }});

export const onRequestGet = async ({ env, request }) => {
  const url = new URL(request.url);
  return jsonResponse({
    ok: true,
    method: "GET",
    host: url.hostname,
    hasSecret: !!env.TURNSTILE_SECRET,
    hasMailTo: !!env.MAIL_TO,
    hasMailFrom: !!env.MAIL_FROM
  });
};

export const onRequestPost = async ({ request, env }) => {
  const ray = request.headers.get("CF-RAY") || "";
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const ua = request.headers.get("User-Agent") || "";
  const url = new URL(request.url);

  try {
    let fields = {};
    const ctype = request.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      fields = await request.json();
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) fields[k] = v;
    }

    console.log("[contato] CF-RAY:", ray, "IP:", ip, "UA:", ua);
    console.log("[contato] Fields:", Object.keys(fields));
    const name = (fields.name || fields.nome || "").toString().trim();
    const email = (fields.email || "").toString().trim();
    const phone = (fields.phone || fields.telefone || "").toString().trim();
    const subject = (fields.subject || fields.assunto || "Contato via site").toString().trim();
    const message = (fields.message || fields.mensagem || "").toString().trim();
    const tsToken = (fields["cf-turnstile-response"] || fields["turnstile"] || "").toString().trim();
    const honeypot = (fields.company || "").toString().trim();

    if (honeypot) {
      console.warn("[contato] Honeypot acionado, descartando.");
      return jsonResponse({ success: true, detail: "Ok (honeypot)" }, 200);
    }

    if (!name || !email || !message) {
      console.warn("[contato] Campos obrigatórios faltando:", { name:!!name, email:!!email, message:!!message });
      return jsonResponse({ success: false, error: "ValidationError", detail: "Campos obrigatórios ausentes (nome, email, mensagem)." }, 400);
    }

    const ts = await verifyTurnstile(tsToken, env.TURNSTILE_SECRET, ip);
    if (!ts?.success) {
      console.warn("[contato] Turnstile falhou:", ts);
      return jsonResponse({ success: false, error: "TurnstileFail", tsData: ts || {}, detail: "Falha na verificação anti-bot." }, 403);
    }

    const textContent = [
      `Novo contato pelo site (${url.hostname})`,
      ``,
      `Nome: ${name}`,
      `Email: ${email}`,
      phone ? `Telefone: ${phone}` : null,
      ``,
      `Mensagem:`,
      message,
      ``,
      `IP: ${ip}`
    ].filter(Boolean).join("\\n");

    const htmlContent = `\
      <div style="font-family:system-ui, Arial, sans-serif; line-height:1.5; font-size:16px;">
        <p><strong>Novo contato pelo site (${url.hostname})</strong></p>
        <p><strong>Nome:</strong> ${escapeHtml(name)}<br/>
           <strong>Email:</strong> ${escapeHtml(email)}<br/>
           ${phone ? `<strong>Telefone:</strong> ${escapeHtml(phone)}<br/>` : ""}
        </p>
        <p><strong>Mensagem:</strong><br/>${escapeHtml(message).replace(/\\n/g, "<br/>")}</p>
        <p style="color:#666;font-size:12px;margin-top:16px;">IP: ${escapeHtml(ip)}</p>
      </div>`;

    const mcEndpoint = "https://api.mailchannels.net/tx/v1/send";
    const fromEmail = (env.MAIL_FROM && env.MAIL_FROM.trim()) ? env.MAIL_FROM.trim() : `no-reply@${url.hostname}`;

    const payload = {
      personalizations: [{ to: [{ email: env.MAIL_TO }]}],
      from: { email: fromEmail, name: env.MAIL_FROM_NAME || "Formulário do Site" },
      reply_to: { email, name },
      subject: subject || "Contato via site",
      content: [
        { type: "text/plain", value: textContent },
        { type: "text/html", value: htmlContent }
      ],
      headers: { "X-Entity-Ref-ID": cryptoRandomId() }
    };

    console.log("[contato] Enviando via MailChannels. From:", fromEmail, "To:", env.MAIL_TO);
    const mcResp = await fetch(mcEndpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const mcText = await mcResp.text();
    console.log("[mailchannels] status:", mcResp.status, "body:", mcText.slice(0, 300));

    if (!mcResp.ok) {
      return jsonResponse({ success: false, error: "MailChannelsFail", status: mcResp.status, detail: mcText.slice(0, 2000), cfRay: ray }, 502);
    }
    return jsonResponse({ success: true, detail: "Mensagem enviada com sucesso.", cfRay: ray }, 200);
  } catch (err) {
    console.error("[contato] EXCEPTION:", err && err.stack || err);
    return jsonResponse({ success: false, error: "ServerError", detail: String(err && err.stack || err) }, 500);
  }
};

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function cryptoRandomId() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}