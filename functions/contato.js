export const onRequestPost = async (context) => {
  const { request, env } = context;
  const formData = await request.formData();

  // Extract Turnstile token (auto field)
  const token = formData.get('cf-turnstile-response');
  if (!token) {
    return new Response(JSON.stringify({ success: false, error: 'Validação Turnstile ausente.' }), { status: 400 });
  }

  // Verify with Cloudflare Turnstile (server-side)
  const secret = env.TURNSTILE_SECRET; // configure in Pages > Settings > Environment variables
  const ip = request.headers.get('CF-Connecting-IP') || '';

  const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: ip
    })
  });
  const outcome = await verifyResp.json();
  if (!outcome.success) {
    return new Response(JSON.stringify({ success: false, error: 'Falha na verificação Turnstile.' }), { status: 403 });
  }

  // Extract form fields (adjust names to match your HTML)
  const nome = formData.get('nome') || formData.get('name') || '';
  const email = formData.get('email') || '';
  const telefone = formData.get('telefone') || '';
  const assunto = formData.get('assunto') || 'Contato via site';
  const mensagem = formData.get('mensagem') || formData.get('message') || '';

  // Example: Send email using MailChannels (native on Workers)
  const to = env.MAIL_TO || 'contato@pavieadvocacia.com.br';
  const from = env.MAIL_FROM || 'no-reply@pavieadvocacia.com.br';

  const mailResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: 'Formulário do Site' },
      subject: `[Site] ${assunto}`,
      content: [{
        type: 'text/plain',
        value: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nAssunto: ${assunto}\n\nMensagem:\n${mensagem}\n`
      }]
    })
  });

  if (!mailResp.ok) {
    const txt = await mailResp.text();
    return new Response(JSON.stringify({ success: false, error: 'Não foi possível enviar o e-mail.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'content-type': 'application/json' }
  });
};
