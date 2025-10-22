// functions/api/contato.js
export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    },
  });

export const onRequestPost = async (ctx) => {
  const { request, env } = ctx;
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Vary": "Origin",
  };

  // 1) payload
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "JSON inválido" }), { status: 400, headers });
  }

  const nome          = (body.nome || "").trim();
  const email         = (body.email || "").trim();
  const telefone_full = (body.telefone_full || "").trim();
  const mensagem      = (body.mensagem || "").trim();
  const token         = body.turnstileToken || body["cf-turnstile-response"] || "";

  if (!nome || !email || !mensagem) {
    return new Response(JSON.stringify({ ok: false, error: "Campos obrigatórios ausentes" }), { status: 400, headers });
  }

  // 2) valida Turnstile (bypass para previews)
  if (!env.DEV_BYPASS_TURNSTILE) {
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: "Token Turnstile ausente" }), { status: 400, headers });
    }
    try {
      const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET || "",
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP") || "",
        }),
      });
      const tsJson = await tsRes.json();
      if (!tsJson.success) {
        return new Response(JSON.stringify({ ok: false, error: "Falha na verificação Turnstile", details: tsJson }), { status: 403, headers });
      }
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: "Erro ao validar Turnstile", details: e?.message }), { status: 502, headers });
    }
  }

  // 3) encaminha ao Apps Script com metadados de e-mail
  const endpoint = env.APP_SCRIPT_WEBAPP_URL || env.SCRIPT_URL;
  if (!endpoint) {
    return new Response(JSON.stringify({ ok: false, error: "SCRIPT_URL não configurada" }), { status: 500, headers });
  }

  const payload = {
    nome, email, telefone_full, mensagem,
    site: env.SITE_BASE || new URL(request.url).origin,
    ua: request.headers.get("User-Agent") || "",
    ip: request.headers.get("CF-Connecting-IP") || "",
    auth: env.APPSCRIPT_SECRET || "",

    // >>> campos de e-mail que o Apps Script usará <<<
    to:        env.MAIL_TO || "fabiopavie@pavieadvogado.com",
    from:      env.MAIL_FROM || "",                  // se vazio, o Script usa o padrão da conta
    from_name: env.MAIL_FROM_NAME || "Site PAVIE",
    subject:   `Contato pelo site – ${nome}`,
    replyTo:   email,                                // resposta vai direto para quem preencheu
  };

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let j = null; try { j = JSON.parse(text); } catch {}
    if (upstream.ok && j && j.ok) {
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({
      ok: false,
      status: upstream.status,
      error: (j && (j.error || j.message)) || text || "Falha no Apps Script",
    }), { status: 502, headers });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Erro desconhecido" }), { status: 502, headers });
  }
};
