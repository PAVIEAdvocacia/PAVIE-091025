// /functions/api/contato.js (pavieadvocacia.com.br)
export const onRequestOptions = async ({ request, env }) => {
  return new Response(null, { status: 204, headers: cors(env) });
};

export const onRequestPost = async ({ request, env }) => {
  try {
    const headers = cors(env);
    if (!/application\/json/i.test(request.headers.get('content-type') || '')) {
      return new Response(JSON.stringify({ ok:false, error:'Use application/json' }), { status:415, headers });
    }
    const body = await request.json().catch(() => null);
    if (!body) return new Response(JSON.stringify({ ok:false, error:'JSON inválido' }), { status:400, headers });

    const { nome, email, telefone, mensagem, turnstileToken } = body;
    if (!nome || !email || !mensagem || !turnstileToken) {
      return new Response(JSON.stringify({ ok:false, error:'Campos obrigatórios ausentes' }), { status:422, headers });
    }

    // Verify Turnstile
    const ts = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: turnstileToken }),
    }).then(r => r.json());

    if (!ts?.success) {
      return new Response(JSON.stringify({ ok:false, error:'Falha Turnstile', details: ts?.['error-codes'] || [] }), { status:403, headers });
    }

    // Forward to Apps Script
    const payload = { nome, email, telefone, mensagem, site: 'pavieadvocacia.com.br', score: ts?.score };
    const resp = await fetch(env.SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await resp.text();
    if (!resp.ok) {
      return new Response(JSON.stringify({ ok:false, error:'Apps Script erro', status: resp.status, body: text }), { status:502, headers });
    }
    let result; try { result = JSON.parse(text) } catch { result = { text } }

    return new Response(JSON.stringify({ ok:true, result }), { status:200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status:500, headers: cors(env) });
  }
};

function cors(env) {
  const allow = env.ALLOWED_ORIGIN || 'https://www.pavieadvocacia.com.br';
  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff'
  };
}
