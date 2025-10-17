// form.submit.js
// Place at site root and include after form.turnstile.js and turnstile client script.
// It expects a form with id="contatoForm", a status element id="formStatus" and a div#ts-container for Turnstile.
//
// Reads Turnstile token via window.getCfToken()
// Sends JSON to /api/contato (Cloudflare Pages Function)
//
// No module syntax (no export); safe for browsers.

(function(){
  var form = document.querySelector('#contatoForm');
  var status = document.querySelector('#formStatus');
  if (!form) { console.error('Formulário #contatoForm não encontrado.'); return; }

  form.addEventListener('submit', async function(ev){
    ev.preventDefault();
    if (status) status.textContent = 'Enviando...';

    var fd = new FormData(form);
    var body = Object.fromEntries(fd.entries());

    // honeypot
    if (body.company) {
      if (status) status.textContent = 'Bloqueado por proteção anti-spam.'; 
      return;
    }

    var cfToken = (window.getCfToken && window.getCfToken()) || null;
    if (!cfToken) {
      if (status) status.textContent = 'Valide a segurança antes de enviar (captcha).';
      return;
    }

    var payload = {
      nome: body.nome || '',
      email: body.email || '',
      telefone: body.telefone || body.fone || '',
      mensagem: body.mensagem || '',
      servico: body.servico || '',
      consent: !!body.consent,
      consent_timestamp: body.consent_timestamp || null,
      turnstileToken: cfToken
    };

    try {
      var res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok) {
        var msg = (json && (json.error || json.details)) || ('HTTP ' + res.status);
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
      }
      if (status) status.textContent = 'Mensagem enviada. Obrigado!';
      form.reset();
      // clear internal token
      try { if (window.__cfToken) window.__cfToken = ''; } catch(e){}
    } catch (err) {
      if (status) status.textContent = 'Erro no envio: ' + (err && err.message ? err.message : String(err));
      console.error('form submit error', err);
    }
  });
})();