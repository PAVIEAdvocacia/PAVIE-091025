// Cloudflare Pages Function: /api/contato
export const onRequestOptions = () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.pavieadvogado.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

export const onRequestPost = async ({ request, env }) => {
  const allowOrigin = "https://www.pavieadvogado.com";

  try {
    const data = await request.json().catch(() => null);
    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: "JSON inválido" }), {
        status: 400,
        headers: cors(allowOrigin),
      });
    }

    const { nome, email, telefone, mensagem, cfToken } = data;

    if (!nome || !email || !mensagem || !cfToken) {
      return new Response(JSON.stringify({ ok: false, error: "Campos obrigatórios ausentes." }), {
        status: 422,
        headers: cors(allowOrigin),
      });
    }

    // 1) Verifica Turnstile
    const secret = env.TURNSTILE_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ ok: false, error: "TURNSTILE_SECRET ausente." }), {
        status: 500,
        headers: cors(allowOrigin),
      });
    }

    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: cfToken }),
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return new Response(JSON.stringify({ ok: false, error: "Falha na verificação do Turnstile.", details: verifyJson }), {
        status: 403,
        headers: cors(allowOrigin),
      });
    }

    // 2) Encaminha ao Google Apps Script (deployment público que aceita POST JSON)
    const scriptUrl = env.SCRIPT_URL;
    if (!scriptUrl) {
      return new Response(JSON.stringify({ ok: false, error: "SCRIPT_URL ausente." }), {
        status: 500,
        headers: cors(allowOrigin),
      });
    }

    const payload = { nome, email, telefone, mensagem, ts: new Date().toISOString() };
    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await gsRes.text();
    if (!gsRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: "Apps Script retornou erro.", status: gsRes.status, body: text }), {
        status: 502,
        headers: cors(allowOrigin),
      });
    }

    // Tenta parsear JSON, mas aceita texto
    let result;
    try { result = JSON.parse(text); } catch { result = { result: text }; }

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: cors(allowOrigin),
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
      status: 500,
      headers: cors(allowOrigin),
    });
  }
};

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8"
  };
}
