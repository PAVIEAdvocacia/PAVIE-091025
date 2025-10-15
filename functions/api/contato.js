/**
 * Cloudflare Pages Function: /api/contato (POST)
 * - Verifica Turnstile
 * - Envia e-mail via MailChannels
 * 
 * Variáveis esperadas em Settings > Environment variables:
 * - MAIL_FROM          (ex.: "PAVIE | Advocacia <contato@pavieadvocacia.com.br>")
 * - MAIL_FROM_NAME     (opcional, se MAIL_FROM for só endereço)
 * - MAIL_TO            (destino principal)
 * - TURNSTILE_SECRET   (ou CHAVE_SECRETA_DA_TORRE) — chave secreta do Turnstile
 */

export const onRequestPost = async ({ request, env, cf }) => {
  try {
    // ----- Lê dados do formulário -----
    const contentType = request.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      return json({ ok: false, error: 'Unsupported content-type' }, 415);
    }

    const { nome = '', email = '', assunto = '', mensagem = '', **rest } = data;
    const tsResponse = data['cf-turnstile-response'];
    if (!tsResponse) {
      return json({ ok: false, error: 'Turnstile token ausente.' }, 400);
    }

    // ----- Verificação Turnstile -----
    const turnstileSecret = env.TURNSTILE_SECRET || env.CHAVE_SECRETA_DA_TORRE;
    if (!turnstileSecret) {
      return json({ ok: false, error: 'TURNSTILE_SECRET ausente na configuração.' }, 500);
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: tsResponse,
        remoteip: request.headers.get('CF-Connecting-IP') || ''
      })
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return json({ ok: false, error: 'Falha na verificação Turnstile', tsData: verifyData }, 400);
    }

    // ----- Sanitização simples -----
    const safe = (s) => String(s || '').trim().replace(/[\r\n]+/g, ' ').slice(0, 1000);
    const Nome = safe(nome);
    const Email = safe(email);
    const Assunto = safe(assunto || 'Contato do site');
    const Mensagem = String(mensagem || '').slice(0, 5000);

    // ----- Monta corpo do e-mail -----
    const MAIL_FROM = env.MAIL_FROM || 'contato@pavieadvocacia.com.br';
    const MAIL_TO = env.MAIL_TO || 'fabiopavie@pavieadvocacia.com.br';
    const FROM_NAME = env.MAIL_FROM_NAME || 'PAVIE | Advocacia';
    const subject = `📩 [Site] ${Assunto}`;

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
        <h2>Nova mensagem pelo site</h2>
        <p><strong>Nome:</strong> ${escapeHtml(Nome)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(Email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(Assunto)}</p>
        <p style="white-space:pre-wrap"><strong>Mensagem:</strong>\n${escapeHtml(Mensagem)}</p>
        <hr>
        <p style="color:#666">IP: ${request.headers.get('CF-Connecting-IP') || '-'} · País: ${(cf && cf.country) || '-'}</p>
      </div>
    `;

    const mailPayload = {
      personalizations: [{ to: [{ email: MAIL_TO }] }],
      from: { email: extractAddress(MAIL_FROM), name: FROM_NAME },
      subject,
      content: [{ type: "text/html; charset=utf-8", value: html }]
    };

    // ----- Envio via MailChannels -----
    const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(mailPayload),
    });

    if (!mailRes.ok) {
      const errText = await mailRes.text();
      return json({ ok: false, error: 'MailChannelsFail', status: mailRes.status, detail: errText }, 502);
    }

    return json({ ok: true, message: 'Email enviado.' });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) }, 500);
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function extractAddress(from) {
  // Aceita "Nome <email@dominio>" ou apenas "email@dominio"
  const m = String(from).match(/<([^>]+)>/);
  return m ? m[1] : String(from);
}
