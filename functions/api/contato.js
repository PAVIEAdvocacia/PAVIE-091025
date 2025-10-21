// functions/api/contato.js — Cloudflare Pages Function (POST/OPTIONS)
// Valida Turnstile no servidor e encaminha dados ao Google Apps Script (ou outro backend)
export const onRequestOptions = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

export const onRequestPost = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);

  // Helpers
  const json = async () => {
    try { return await request.json(); } catch { return null; }
  };
  const form = async () => {
    try { return Object.fromEntries(await request.formData()); } catch { return {}; }
  };

  // Parse body (JSON first, then form-encoded)
  let body = await json();
  if (!body) body = await form();

  // Basic validation
  const nome = (body?.nome || "").toString().trim();
  const email = (body?.email || "").toString().trim();
  const mensagem = (body?.mensagem || "").toString().trim();
  const telefone_full = (body?.telefone_full || body?.telefone || "").toString().trim();

  if (!nome || !email || !mensagem) {
    return jsonResp({ ok: false, error: "Campos obrigatórios ausentes." }, 400);
  }

  // Bypass opcional em PREVIEW/dev
  const bypass = (env.DEV_BYPASS_TURNSTILE || "").toString().toLowerCase() === "true";

  // Turnstile server-side verification
  if (!bypass) {
    const token = body?.turnstileToken || body?.["cf-turnstile-response"];
    if (!token) {
      return jsonResp({ ok: false, error: "Token Turnstile ausente." }, 400);
    }
    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET || "",
        response: token,
        remoteip: ctx.request.headers.get("CF-Connecting-IP") || ""
      })
    });
    const tsJSON = await tsRes.json().catch(() => null);
    if (!tsJSON?.success) {
      return jsonResp({ ok: false, error: "Falha na verificação do Turnstile." }, 403);
    }
  }

  // Montar payload para backend (Apps Script)
  const payload = {
    nome, email, telefone_full, mensagem,
    site: env.SITE_BASE || url.origin,
    ip: request.headers.get("CF-Connecting-IP") || "",
    ua: request.headers.get("User-Agent") || ""
  };

  // Encaminhar ao Apps Script (ou outro) via JSON
  try {
    const endpoint = env.APP_SCRIPT_WEBAPP_URL;
    if (!endpoint) return jsonResp({ ok: false, error: "APP_SCRIPT_WEBAPP_URL não configurado." }, 500);

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    let data = null; try { data = JSON.parse(text); } catch {}
    if (upstream.ok && data && data.ok) {
      return jsonResp({ ok: true });
    } else {
      return jsonResp({ ok: false, error: data?.error || text || "Falha no backend." }, 502);
    }
  } catch (e) {
    return jsonResp({ ok: false, error: e?.message || "Erro desconhecido." }, 502);
  }
};

function jsonResp(obj, status=200){
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}