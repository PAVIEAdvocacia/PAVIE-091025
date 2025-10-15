// MailChannels hardening: DKIM signing + AuthUser header
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

    const domain = (MAIL_FROM.split("@")[1] || "").toLowerCase();
    const subject = `[Site] ${assunto || "Contato"}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans',sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px 0">Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(nome) || "(não informado)"}</p>
        <p><strong>E‑mail:</strong> ${escapeHtml(email) || "(não informado)"} </p>
        <p><strong>Telefone:</strong> ${escapeHtml(telefone) || "(não informado)"} </p>
        <p><strong>Assunto:</strong> ${escapeHtml(assunto || "Contato")}</p>
        <p><strong>Mensagem:</strong><br>${nl2br(escapeHtml(mensagem))}</p>
        <hr>
        <p style="color:#666"><small>IP: ${escapeHtml(ip)} · Origem: ${escapeHtml(origem)} · UA: ${escapeHtml(userAgent)}</small></p>
      </div>`;

    const payload = {
      from: { email: MAIL_FROM, name: MAIL_FROM_NAME },
      personalizations: [{
        to: [{ email: MAIL_TO }],
        dkim_domain: domain,
        dkim_selector: DKIM_SELECTOR
      }],
      subject,
      content: [
        { type: "text/plain", value: stripHtml(html) },
        { type: "text/html", value: html }
      ]
    };
    if (email) payload.reply_to = [{ email, name: nome || undefined }];

    const headers = {
      "content-type": "application/json",
      "X-AuthUser": MAIL_FROM,
      "X-Use-My-Own-DKIM": "true"
    };

    const mcResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST", headers, body: JSON.stringify(payload)
    });

    const text = await mcResp.text();
    if (!mcResp.ok) {
      return json({ ok:false, error:"MailChannelsFail", status: mcResp.status, detail: text }, 500);
    }

    return json({ ok:true, message:"Mensagem enviada com sucesso." }, 200);
  } catch (err) {
    return json({ ok:false, error:"ServerError", detail:String(err) }, 500);
  }
};

export const onRequestGet = async ({ env }) => {
  const required = ["MAIL_FROM","MAIL_FROM_NAME","MAIL_TO","CHAVE_SECRETA_DA_TORRE"];
  const aliases = { MAIL_FROM:"CORREIO_DE", MAIL_FROM_NAME:"CORREIO_DE_NOME", MAIL_TO:"ENVIAR_PARA", CHAVE_SECRETA_DA_TORRE:"SEGREDO_DA_CATRACA" };
  const missing = {}; for (const k of required) missing[k] = !(env[k] ?? env[aliases[k]]);
  const hasSecret = !!(env.CHAVE_SECRETA_DA_TORRE ?? env.SEGREDO_DA_CATRACA);
  return json({ ok: Object.values(missing).every(v=>v===false), metodo:"GET", missing_env: missing, hasSecret });
};

function json(obj, status=200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type":"application/json; charset=utf-8" } });
}
function escapeHtml(str=""){return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
function nl2br(str=""){return String(str).replace(/
/g,"<br>");}
function stripHtml(str=""){return String(str).replace(/<[^>]+>/g,"");}
