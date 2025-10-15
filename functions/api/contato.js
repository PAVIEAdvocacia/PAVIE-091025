// functions/api/contato.js — MailChannels com DKIM + autenticação resiliente
export const onRequestGet = async ({ env }) => {
  const required = ["MAIL_FROM","MAIL_FROM_NAME","MAIL_TO","CHAVE_SECRETA_DA_TORRE"];
  const aliases = { MAIL_FROM:"CORREIO_DE", MAIL_FROM_NAME:"CORREIO_DE_NOME", MAIL_TO:"ENVIAR_PARA", CHAVE_SECRETA_DA_TORRE:"SEGREDO_DA_CATRACA" };
  const missing = {}; for (const k of required) missing[k] = !(env[k] ?? env[aliases[k]]);
  const hasSecret = !!(env.CHAVE_SECRETA_DA_TORRE ?? env.SEGREDO_DA_CATRACA);
  return new Response(JSON.stringify({ ok: Object.values(missing).every(v=>v===false), metodo:"GET", missing_env: missing, hasSecret }), { headers: { "content-type": "application/json; charset=utf-8" } });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const MAIL_FROM = env.MAIL_FROM ?? env.CORREIO_DE;
    const MAIL_FROM_NAME = env.MAIL_FROM_NAME ?? env.CORREIO_DE_NOME;
    const MAIL_TO = env.MAIL_TO ?? env.ENVIAR_PARA;
    const TURNSTILE_SECRET = env.CHAVE_SECRETA_DA_TORRE ?? env.SEGREDO_DA_CATRACA;
    const DKIM_SELECTOR = env.DKIM_SELECTOR ?? env.SELETOR_DKIM ?? "cf2024-1";

    const missing = { MAIL_FROM:!MAIL_FROM, MAIL_FROM_NAME:!MAIL_FROM_NAME, MAIL_TO:!MAIL_TO, CHAVE_SECRETA_DA_TORRE:!TURNSTILE_SECRET };
    if (Object.values(missing).some(Boolean)) return json({ ok:false, error:"missing_env", missing }, 500);

    const ct = request.headers.get("content-type") || "";
    let data = {};
    if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const form = await request.formData(); data = Object.fromEntries(form.entries());
    } else if (ct.includes("application/json")) {
      data = await request.json();
    } else {
      const form = await request.formData().catch(()=>null); data = form ? Object.fromEntries(form.entries()) : {};
    }

    const nome = (data.nome || data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const telefone = (data.telefone || data.phone || "").toString().trim();
    const assunto = (data.assunto || data.subject || "Contato via site").toString().trim();
    const mensagem = (data.mensagem || data.message || "").toString().trim();
    const ip = request.headers.get("cf-connecting-ip") || "";
    const origem = request.headers.get("referer") || "";
    const userAgent = request.headers.get("user-agent") || "";

    const turnstileToken = data["cf-turnstile-response"] || data["turnstileToken"] || data["turnstile"] || "";
    const verifyResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: turnstileToken, remoteip: ip }),
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const verify = await verifyResp.json().catch(() => ({}));
    if (!verify.success) return json({ ok:false, error:"TurnstileFail", tsData: verify }, 400);

    const dkim_domain = (MAIL_FROM.split("@")[1] || "").toLowerCase();
    const subject = `[Site] ${assunto || "Contato"}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans',sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px 0">Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${nome || "(não informado)"} </p>
        <p><strong>E‑mail:</strong> ${email || "(não informado)"} </p>
        <p><strong>Telefone:</strong> ${telefone || "(não informado)"} </p>
        <p><strong>Assunto:</strong> ${assunto || "Contato"} </p>
        <p><strong>Mensagem:</strong><br>${(mensagem || "").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>")}</p>
        <hr><p style="color:#666"><small>IP: ${ip} · Origem: ${origem} · UA: ${userAgent}</small></p>
      </div>`;

    const payload = {
      from: { email: MAIL_FROM, name: MAIL_FROM_NAME },
      personalizations: [{
        to: [{ email: MAIL_TO }],
        dkim_domain,
        dkim_selector: DKIM_SELECTOR
      }],
      subject,
      content: [
        { type: "text/plain", value: html.replace(/<[^>]+>/g, "") },
        { type: "text/html", value: html }
      ],
      reply_to: email ? [{ email, name: nome || undefined }] : undefined,
    };

    async function sendWith(authUser) {
      const headers = {
        "content-type": "application/json",
        "X-AuthUser": authUser,
        "X-Use-My-Own-DKIM": "true"
      };
      const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST", headers, body: JSON.stringify(payload)
      });
      const text = await resp.text();
      return { resp, text };
    }

    // T1: X-AuthUser = e-mail completo
    let { resp, text } = await sendWith(MAIL_FROM);
    // T2: se 401, X-AuthUser = domínio
    if (resp.status === 401) ({ resp, text } = await sendWith(dkim_domain));

    if (!resp.ok) return json({ ok:false, error:"MailChannelsFail", status: resp.status, detail: text }, 500);

    return json({ ok:true, message:"Mensagem enviada com sucesso." }, 200);
  } catch (err) {
    return json({ ok:false, error:"ServerError", detail:String(err) }, 500);
  }
};

function json(obj, status=200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type":"application/json; charset=utf-8" } });
}
