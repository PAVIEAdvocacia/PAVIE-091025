// /functions/api/contato.js — HOTFIX (Apps Script only)
// Aceita: SCRIPT_URL, APP_SCRIPT_WEBAPP_URL, APP_SCRIPT_URL, GAS_WEBAPP_URL
// Valida Turnstile no servidor e aceita JSON ou x-www-form-urlencoded.

const ALLOWED_ORIGINS = [
  "https://pavieadvocacia.com.br",
  "https://www.pavieadvocacia.com.br",
  "https://pavie-091025.pages.dev"
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function pickScriptUrl(env) {
  return (
    env.SCRIPT_URL ||
    env.APP_SCRIPT_WEBAPP_URL ||
    env.APP_SCRIPT_URL ||
    env.GAS_WEBAPP_URL ||
    ""
  );
}

export const onRequestOptions = async ({ request }) =>
  new Response(null, { status: 204, headers: corsHeaders(request.headers.get("Origin") || "") });

export const onRequestPost = async ({ request, env }) => {
  const origin = request.headers.get("Origin") || "";
  const headers = { "Content-Type": "application/json", ...corsHeaders(origin) };

  try {
    let payload = null;
    const ctype = (request.headers.get("Content-Type") || "").toLowerCase();
    if (ctype.includes("application/json")) {
      payload = await request.json();
    } else if (ctype.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    } else {
      return new Response(JSON.stringify({ ok: false, error: "Unsupported Content-Type" }), { status: 415, headers });
    }

    const clean = (s) => typeof s === "string" ? s.trim() : s;
    const data = Object.fromEntries(Object.entries(payload || {}).map(([k,v]) => [k, clean(v)]));
    const { nome, email, telefone = "", mensagem, turnstileToken } = data;

    if (!nome || !email || !mensagem) {
      return new Response(JSON.stringify({ ok: false, error: "Campos obrigatórios ausentes" }), { status: 400, headers });
    }
    if (!turnstileToken) {
      return new Response(JSON.stringify({ ok: false, error: "Token Turnstile ausente" }), { status: 400, headers });
    }

    // Turnstile verification
    const ts = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET || "", response: turnstileToken })
    }).then(r=>r.json());
    if (!ts.success) {
      const code = (ts["error-codes"] || []).join(",");
      return new Response(JSON.stringify({ ok: false, error: `Falha na verificação Turnstile: ${code||"unknown"}` }), { status: 400, headers });
    }

    // Apps Script endpoint
    const scriptUrl = pickScriptUrl(env);
    if (!scriptUrl) {
      return new Response(JSON.stringify({ ok: false, error: "SCRIPT_URL/APP_SCRIPT_WEBAPP_URL ausente" }), { status: 500, headers });
    }

    const auth = env.APPSCRIPT_SECRET || env.SEGREDO_DA_CATRACA || "";
    const gasRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, auth })
    });

    if (gasRes.ok) {
      return new Response(JSON.stringify({ ok: true, via: "apps-script" }), { status: 200, headers });
    }
    const t = await gasRes.text().catch(()=> "");
    return new Response(JSON.stringify({ ok: false, error: `Apps Script falhou: ${t}` }), { status: 502, headers });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message || String(err) }), { status: 500, headers });
  }
};
