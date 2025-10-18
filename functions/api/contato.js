// functions/api/contato.js — Cloudflare Pages Functions (Edge)

// CORS p/ chamadas do mesmo domínio (seguro por padrão)
function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
export function onRequestOptions({ request }) {
  const origin = new URL(request.url).origin;
  return new Response(null, { headers: cors(origin) });
}
const esc = s => String(s || "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));

export async function onRequestPost({ request, env }) {
  try {
    const origin = new URL(request.url).origin;

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ ok:false, error:"InvalidContentType" }, { status:415, headers:cors(origin) });
    }

    const data = await request.json();
    const { nome, email, telefone, servico, mensagem, turnstileToken } = data || {};

    // Campos básicos
    if (!nome || !email || !telefone || !mensagem) {
      return Response.json({ ok:false, error:"MissingFields" }, { status:400, headers:cors(origin) });
    }

    // Turnstile (se estiver usando o widget)
    if (!turnstileToken) {
      return Response.json({ ok:false, error:"TurnstileTokenMissing" }, { status:400, headers:cors(origin) });
    }
    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: request.headers.get("cf-connecting-ip") || ""
      })
    });
    const ts = await tsRes.json();
    if (!ts.success) {
      return Response.json({ ok:false, error:"TurnstileFail", details: ts["error-codes"] }, { status:403, headers:cors(origin) });
    }

    // Assunto e corpo
    const subject  = `Nova solicitação – ${servico || "Geral"} – ${nome}`;
    const textBody = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      `Telefone: ${telefone}`,
      `Serviço: ${servico || "-"}`,
      "",
      "Mensagem:",
      mensagem
    ].join("\n");
    const htmlBody = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
        <h2>Novo contato pelo site</h2>
        <p><b>Nome:</b> ${esc(nome)}</p>
        <p><b>E-mail:</b> ${esc(email)}</p>
        <p><b>Telefone:</b> ${esc(telefone)}</p>
        <p><b>Serviço:</b> ${esc(servico || "-")}</p>
        <hr />
        <p>${esc(mensagem).replace(/\n/g,"<br>")}</p>
      </div>
    `;

    // === ENV de Produção/Preview (Pages → Settings → Environment variables) ===
    const TO_EMAIL   = env.TO_EMAIL;   // ex.: "fabiopavie@pavieadvogado.com"
    const FROM_EMAIL = env.FROM_EMAIL; // ex.: "contato@pavieadvocacia.com.br"
    const FROM_NAME  = env.FROM_NAME || "PAVIE | Advocacia – Formulário";

    // Payload do MailChannels (com Reply-To e cabeçalhos úteis)
    const mailPayload = {
      personalizations: [{ to: [{ email: TO_EMAIL }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      reply_to: { email, name: nome },           // responder vai para o usuário
      subject,
      content: [
        { type: "text/plain", value: textBody },
        { type: "text/html",  value: htmlBody }
      ],
      headers: {
        "X-Form-Name": "Contato Site PAVIE",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-Unsubscribe": `<mailto:${TO_EMAIL}?subject=unsubscribe>`
      }
    };

    // Envio
    const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mailPayload)
    });

    if (!mcRes.ok) {
      const errText = await mcRes.text().catch(() => "");
      return Response.json({ ok:false, error:"MailChannelsFail", details: errText }, { status:502, headers:cors(origin) });
    }

    return Response.json({ ok:true }, { headers:cors(origin) });
  } catch (e) {
    return Response.json({ ok:false, error:"ServerError", details:String(e) }, { status:500 });
  }
}
