// /functions/api/contato.js  — v4
export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    ok: true,
    build: "v4",
    hasSecret: !!env.TURNSTILE_SECRET,
    hasMailTo: !!env.MAIL_TO,
    hasMailFrom: !!env.MAIL_FROM
  }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

export const onRequestPost = async (context) => {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    return json({ success:false, error:"invalid-form" }, 400);
  }

  if (formData.get("company")) {
    return new Response(null, { status: 204 });
  }

  const token = (formData.get("cf-turnstile-response") || "").toString().trim();
  if (!token) {
    console.log("[Turnstile] token ausente no formulário");
    return json({ success:false, error:"missing-token" }, 400);
  }

  const secret = env.TURNSTILE_SECRET || "";
  if (!secret) {
    console.log("[Turnstile] TURNSTILE_SECRET ausente no ambiente");
    return json({ success:false, error:"missing-secret" }, 500);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verifyResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip })
  });
  let verifyJson = {};
  try { verifyJson = await verifyResp.json(); } catch {}

  console.log("[Turnstile] verify:", {
    success: verifyJson.success,
    "error-codes": verifyJson["error-codes"],
    action: verifyJson.action,
    cdata: verifyJson.cdata,
  });

  if (!verifyJson.success) {
    return json({ success:false, error:"turnstile-verify-failed", codes: verifyJson["error-codes"] || [] }, 403);
  }

  const nome     = (formData.get("nome")     || "").toString().trim();
  const email    = (formData.get("email")    || "").toString().trim();
  const telefone = (formData.get("telefone") || "").toString().trim();
  const assunto  = (formData.get("assunto")  || "Contato").toString().trim();
  const mensagem = (formData.get("mensagem") || "").toString().trim();

  const to = env.MAIL_TO;
  const from = env.MAIL_FROM || `site@${new URL(request.url).hostname}`;
  if (!to || !from) {
    console.log("[Mail] MAIL_TO ou MAIL_FROM ausente — pulando envio.");
    return json({ success:true, delivered:false, info:"mail-vars-missing" });
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: "Formulário do Site" },
    subject: `Novo contato — ${assunto}`,
    content: [{
      type: "text/plain; charset=utf-8",
      value: `Nome: ${nome}
E-mail: ${email}
Telefone: ${telefone}
Assunto: ${assunto}

Mensagem:
${mensagem}

`
    }]
  };

  const mc = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!mc.ok) {
    const txt = await mc.text();
    console.log("[Mail] falha:", mc.status, txt.slice(0, 400));
    return json({ success:true, delivered:false, error:"mailchannels-failed", status: mc.status }, 502);
  }

  return json({ success:true, delivered:true });
};

function json(obj, status=200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
  });
}
