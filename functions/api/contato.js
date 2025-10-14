// Cloudflare Pages Function: /api/contato
// Recebe POST do formulário, valida Turnstile e envia e-mail via MailChannels.
export async function onRequest(context) {
  const { request, env } = context;

  // Aceita apenas POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();

    // Extrai campos do formulário (ajuste os nomes se necessário)
    const get = (k) => {
      const v = formData.get(k);
      return (v === null || v === undefined) ? "" : String(v).trim();
    };

    const nome = get("nome") || get("name");
    const email = get("email");
    const telefone = get("telefone") || get("phone") || get("fone");
    const servico = get("servico") || get("service");
    const mensagem = get("mensagem") || get("message");
    const honeypot = get("company"); // deve ficar vazio para humanos

    // Bloqueia bots simples (honeypot preenchido)
    if (honeypot) {
      // finge sucesso para não treinar o bot
      return new Response("OK", { status: 200 });
    }

    // Validação mínima
        if (!nome || !email || !mensagem) {
      return new Response("Campos obrigatórios ausentes.", { status: 400 });
    }

    // === Turnstile (server-side) ===
    const token = get("cf-turnstile-response") || get("turnstile");
    if (!token) {
      return new Response("Captcha ausente.", { status: 400 });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "";
    const turnstileResp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip
      })
    });
    const turnstileData = await turnstileResp.json();
    if (!turnstileData.success) {
      return new Response("Falha na verificação do captcha.", { status: 403 });
    }

    // === Monta o e-mail (MailChannels) ===
    const toEmail = env.CONTACT_TO_EMAIL;
    const fromEmail = env.CONTACT_FROM_EMAIL;

    if (!toEmail || !fromEmail) {
      return new Response("Configuração de e-mail ausente.", { status: 500 });
    }

    const linhas = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      telefone ? `Telefone: ${telefone}` : null,
      servico ? `Serviço: ${servico}` : null,
      "",
      "Mensagem:",
      mensagem,
      "",
      `Origem: ${request.headers.get("Host") || env.DOMAIN || ""}`,
      `Consentimento: ${get("consent_timestamp")}`
    ].filter(Boolean);

    const textBody = linhas.join("\n");

    const mailBody = {
      personalizations: [
        {
          to: [{ email: toEmail }],
          // DKIM (recomendado): valores vindos do ambiente
          dkim_domain: env.DOMAIN,
          dkim_selector: env.DKIM_SELECTOR,
          dkim_private_key: env.DKIM_PRIVATE_KEY
        }
      ],
      from: {
        email: fromEmail,
        name: "Formulário do Site"
      },
      reply_to: { email: email, name: nome },
      subject: "Novo contato via site",
      content: [
        { type: "text/plain", value: textBody }
      ]
    };

    const emailResp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailBody)
    });

    if (!emailResp.ok) {
      const errTxt = await emailResp.text().catch(() => "");
      return new Response("Erro ao enviar e-mail. " + errTxt, { status: 502 });
    }

    return new Response("Mensagem enviada com sucesso!", { status: 200 });
  } catch (err) {
    return new Response("Erro interno: " + (err && err.message ? err.message : String(err)), { status: 500 });
  }
}
