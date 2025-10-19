// functions/api/contato.js
export async function onRequestPost({ request, env }) {
  try {
    const origin = new URL(request.url).origin;
    function corsHeaders() {
      return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      };
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return Response.json({ ok: false, error: "InvalidContentType" }, { status: 415, headers: corsHeaders() });
    }

    const data = await request.json();
    const { nome, email, telefone, servico, mensagem, turnstileToken } = data || {};

    if (!nome || !email || !telefone || !mensagem) {
      return Response.json({ ok: false, error: "MissingFields" }, { status: 400, headers: corsHeaders() });
    }

    if (!turnstileToken) {
      return Response.json({ ok: false, error: "TurnstileTokenMissing" }, { status: 400, headers: corsHeaders() });
    }

    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET || "",
        response: turnstileToken,
        remoteip: request.headers.get("cf-connecting-ip") || ""
      })
    });
    const ts = await tsRes.json();
    if (!ts.success) {
      return Response.json({ ok: false, error: "TurnstileFail", details: ts["error-codes"] || ts }, { status: 403, headers: corsHeaders() });
    }

    const esc = s => String(s || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

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
        <hr>
        <p>${esc(mensagem).replace(/\n/g, "<br>")}</p>
      </div>
    `;

    const TO_EMAIL   = env.TO_EMAIL;
    const FROM_EMAIL = env.FROM_EMAIL;
    const FROM_NAME  = env.FROM_NAME || "PAVIE | Advocacia – Formulário";

    if (!TO_EMAIL || !FROM_EMAIL) {
      return Response.json({ ok: false, error: "MissingEnv", details: "TO_EMAIL/FROM_EMAIL ausentes" }, { status: 500, headers: corsHeaders() });
    }

    const mailPayload = {
      personalizations: [{ to: TO_EMAIL.split(",").map(e => ({ email: e.trim() })).filter(x => x.email) }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      reply_to: { email, name: nome },
      subject,
      content: [
        { type: "text/plain", value: textBody },
        { type: "text/html",  value: htmlBody }
      ],
      headers: {
        "X-Form-Name": "Contato Site PAVIE",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-Unsubscribe": `<mailto:${TO_EMAIL.split(",")[0].trim()}?subject=unsubscribe>`
      }
    };

    const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mailPayload)
    });

    if (!mcRes.ok) {
      const errText = await mcRes.text().catch(() => "");
      return Response.json({ ok: false, error: "MailChannelsFail", details: errText }, { status: 502, headers: corsHeaders() });
    }

    return Response.json({ ok: true }, { headers: corsHeaders() });
  } catch (e) {
    return Response.json({ ok: false, error: "ServerError", details: String(e) }, { status: 500 });
  }
}

export function onRequestOptions({ request }) {
  const origin = new URL(request.url).origin;
  return new Response(null, { headers: {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }});
}