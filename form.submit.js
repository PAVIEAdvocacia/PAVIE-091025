// Submissão do formulário (no module; usa window.getCfToken definido em form.turnstile.js)
(function(){
  const form = document.querySelector('#contatoForm');
  const status = document.querySelector('#formStatus');
  if (!form) { console.error('Formulário #contatoForm não encontrado.'); return; }

  form.addEventListener('submit', async function(ev){
    ev.preventDefault();
    if (status) status.textContent = 'Enviando...';

    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());

    // Anti-spam honeypot (campo oculto "company" no HTML)
    if (body.company) { 
      if (status) status.textContent = 'Bloqueado por proteção anti-spam.';
      return;
    }

    // Token do Turnstile
    const cfToken = (window.getCfToken && window.getCfToken()) || null;
    if (!cfToken) { if (status) status.textContent = 'Valide a segurança antes de enviar.'; return; }

    const payload = {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || body.fone || '',
      mensagem: body.mensagem,
      servico: body.servico || '',
      consent: !!body.consent,
      consent_timestamp: body.consent_timestamp || null,
      turnstileToken: cfToken
    };

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        const msg = (json && (json.error || json.details)) || ('HTTP ' + res.status);
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
      }
      if (status) status.textContent = 'Mensagem enviada. Obrigado!';
      form.reset();
    } catch (err) {
      if (status) status.textContent = 'Erro no envio: ' + (err && err.message ? err.message : String(err));
    }
  });
})();