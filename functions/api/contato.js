// Cloudflare Pages Function: /api/contato
// Envia o formulário usando MailChannels e valida o Turnstile.

/**
 * Variáveis de ambiente (pode usar em PT ou EN — ambas funcionam):
 *  MAIL_FROM           | CORREIO_DE              -> De: e-mail do domínio (ex: contato@pavieadvocacia.com.br)
 *  MAIL_FROM_NAME      | CORREIO_DE_NOME         -> Nome exibido no remetente (ex: "PAVIE | Advocacia — Formulário")
 *  MAIL_TO             | ENVIAR_PARA             -> Para: e-mail(s) de destino, separados por vírgula
 *  TURNSTILE_SECRET_KEY| SEGREDO_DA_CATRACA      -> Chave secreta do Turnstile
 */
const JSON_OK = (obj, init={}) => new Response(JSON.stringify(obj, null, 2), {
  headers: { "content-type": "application/json; charset=utf-8", ...init.headers },
  ...init
});
const TXT = (text, init={}) => new Response(text, {
  headers: { "content-type": "text/plain; charset=utf-8", ...init.headers },
  ...init
});

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export async function onRequestOptions({ request }) {
  // CORS preflight
  return new Response(null, { headers: corsHeaders(new URL(request.url).origin) });
}

export async function onRequestGet({ request }) {
  // Opcional: endpoint de status para debug
  return JSON_OK({ ok: true, method: "GET", path: new URL(request.url).pathname }, { status: 405, headers: corsHeaders(new URL(request.url).origin) });
}

export async function onRequestPost(ctx) {
  const { request, env } = ctx;
  const origin = new URL(request.url).origin;

  const MAIL_FROM      = env.MAIL_FROM      || env.CORREIO_DE;
  const MAIL_FROM_NAME = env.MAIL_FROM_NAME || env.CORREIO_DE_NOME || "Formulário do Site";
  const MAIL_TO        = (env.MAIL_TO || env.ENVIAR_PARA || "").split(",").map(s => s.trim()).filter(Boolean);
  const TURNSTILE_SECRET_KEY = env.TURNSTILE_SECRET_KEY || env.SEGREDO_DA_CATRACA;

  if (!MAIL_FROM || !MAIL_TO.length || !TURNSTILE_SECRET_KEY) {
    return JSON_OK({ ok: false, error: "missing_env", missing: {
      MAIL_FROM: !!MAIL_FROM, MAIL_FROM_NAME: !!MAIL_FROM_NAME, MAIL_TO: !!MAIL_TO.length, TURNSTILE_SECRET_KEY: !!TURNSTILE_SECRET_KEY
    } }, { status: 500, headers: corsHeaders(origin) });
  }

  // Parse multipart/form-data
  const ct = request.headers.get("content-type") || "";
  if (!/multipart\/form-data/i.test(ct)) {
    return JSON_OK({ ok:false, error:"invalid_content_type" }, { status: 400, headers: corsHeaders(origin) });
  }
  const form = await request.formData();

  // Honeypot anti-bot
  if ((form.get("company") || "").toString().trim() !== "") {
    return JSON_OK({ ok: true, status: "ignored_bot" }, { status: 200, headers: corsHeaders(origin) });
  }

  // Campos
  const nome      = (form.get("nome") || "").toString().trim();
  const email     = (form.get("email") || "").toString().trim();
  const telefone  = (form.get("telefone") || "").toString().trim();
  const servico   = (form.get("servico") || "").toString().trim();
  const mensagem  = (form.get("mensagem") || "").toString().trim();
  const consent   = (form.get("consent") || "").toString().trim().toLowerCase() === "on";

  // Turnstile token
  const tsToken = (form.get("turnstile") || "").toString().trim();

  // Validações simples
  const servicesAllowed = [
    "Trabalhista","Tributário","Família Binacional","Cível","Empresarial","Previdenciário","Penal","Imobiliário"
  ];
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const telOk = telefone.replace(/[^\d]/g,"").length >= 10 && telefone.replace(/[^\d]/g,"").length <= 14;
  const servOk = servicesAllowed.includes(servico);
  if (!nome || !emailOk || !telOk || !servOk || !mensagem) {
    return JSON_OK({ ok:false, error:"validation_error", fields:{ nome:!!nome,email:emailOk,telefone:telOk,servico:servOk,mensagem:!!mensagem }}, { status:400, headers: corsHeaders(origin)});
  }

  // Verificação do Turnstile
  const ip = request.headers.get("cf-connecting-ip") || "";
  const verifyResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: tsToken, remoteip: ip })
  });
  const verifyJson = await verifyResp.json().catch(()=>({success:false}));
  if (!verifyJson.success) {
    return JSON_OK({ ok:false, error: "turnstile_failed", data: verifyJson }, { status: 400, headers: corsHeaders(origin) });
  }

  // Monta e envia via MailChannels
  const subject = `📨 Nova solicitação — ${servico}`;
  const html = `
    <h2>Nova solicitação pelo formulário</h2>
    <p><b>Nome:</b> ${nome}</p>
    <p><b>E-mail:</b> ${email}</p>
    <p><b>Telefone/WhatsApp:</b> ${telefone}</p>
    <p><b>Serviço de interesse:</b> ${servico}</p>
    <p><b>Consentimento:</b> ${consent ? "Sim" : "Não"}</p>
    <hr>
    <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${mensagem}</pre>
  `.trim();

  const to = MAIL_TO.map(addr => ({ email: addr }));

  const mailReq = {
    from: { email: MAIL_FROM, name: MAIL_FROM_NAME },
    personalizations: [{ to }],
    subject,
    content: [
      { type: "text/plain", value: `Nova solicitação:\n\nNome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\nServiço: ${servico}\nConsentimento: ${consent ? "Sim":"Não"}\n\n${mensagem}` },
      { type: "text/html", value: html }
    ]
  };

  const mcResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(mailReq),
  });

  if (!mcResp.ok) {
    const errTxt = await mcResp.text();
    return JSON_OK({ ok:false, error:"mailchannels_error", status: mcResp.status, body: errTxt.slice(0,2000) }, { status: 502, headers: corsHeaders(origin) });
  }

  return JSON_OK({ ok:true, message:"enviado" }, { headers: corsHeaders(origin) });
}
