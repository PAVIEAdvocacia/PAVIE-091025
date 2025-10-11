// Cloudflare Pages Functions — /api/contato
// GET -> 405; POST -> valida Turnstile, envia via MailChannels e redireciona.

export async function onRequestGet() {
  return new Response(
    '405 — Use POST via o formulário do site (esta URL não deve ser acessada diretamente).',
    { status: 405, headers: { 'content-type': 'text/plain; charset=utf-8' } }
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1) Ler dados do formulário
  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return new Response('Requisição inválida (form não enviado).', { status: 400 });
  }

  // 1.1) Honeypot anti-spam
  const trap = (form.get('company') || '').toString().trim();
  if (trap) {
    return new Response('Spam detectado', { status: 400 });
  }

  // 2) Validar Turnstile (server-side)
  const token = form.get('cf-turnstile-response');
  if (!token) {
    return new Response('Turnstile ausente (o widget precisa estar dentro do <form>).', { status: 400 });
  }
  const ip = request.headers.get('CF-Connecting-IP') || '';

  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET || '',
    response: token,
    remoteip: ip
  });
  const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: verifyBody
  });
  const ts = await tsRes.json();
  if (!ts.success) {
    return new Response('Falha na verificação do Turnstile', { status: 403 });
  }

  // 3) Coletar e validar campos
  const required = (v) => (v || '').toString().trim();
  const nome = required(form.get('nome'));
  const email = required(form.get('email'));
  const telefone = required(form.get('telefone'));
  const servico = required(form.get('servico')) || 'Não informado';
  const mensagem = required(form.get('mensagem'));
  const consent = form.get('consent') ? 'Sim' : 'Não';
  const consentTimestamp = required(form.get('consent_timestamp'));

  if (!nome || !email || !telefone || !mensagem) {
    return new Response('Campos obrigatórios ausentes', { status: 400 });
  }

  // 4) Enviar e-mail via MailChannels
  const to = (env.MAIL_TO || '').toString() || 'contato@pavieadvocacia.com.br';
  const from = (env.MAIL_FROM || '').toString() || 'site@pavieadvocacia.com.br';

  const contentText = [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Telefone: ${telefone}`,
    `Serviço: ${servico}`,
    `Consentimento LGPD: ${consent}`,
    consentTimestamp ? `Data/hora do consentimento: ${consentTimestamp}` : null,
    `IP: ${ip}`,
    ``,
    `Mensagem:`,
    mensagem
  ].filter(Boolean).join('\n');

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: from, name: 'Formulário — PAVIE | Advocacia' },
    subject: `Novo contato pelo site — ${nome}`,
    content: [{ type: 'text/plain', value: contentText }],
    headers: { 'Reply-To': `${nome} <${email}>` }
  };

  const headers = { 'content-type': 'application/json' };
  if (env.MAILCHANNELS_API_KEY) {
    headers['X-Api-Key'] = env.MAILCHANNELS_API_KEY;
  }

  const mail = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (mail.status >= 400) {
    return new Response('Não foi possível enviar o e-mail', { status: 502 });
  }

  // 5) Responder conforme o "Accept" do cliente
  const accept = request.headers.get('accept') || '';
  if (accept.includes('application/json')) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json' }
    });
  }

  // 6) Redirecionar para a página com sucesso
  const here = new URL(request.url);
  here.hash = 'agendar?ok=1';
  return Response.redirect(here.toString(), 303);
}
