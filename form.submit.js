/**
 * Envio do formulário via Fetch para não redirecionar a página.
 * Mantém layout/texto; apenas intercepta o submit.
 * Requisitos no HTML:
 *   - <form id="contato-form" method="post" action="/api/contato">
 *   - <div id="ts-container" data-sitekey="0x4AAAAAAB6FBS0cTG_7KOYv"></div>
 *   - <div id="form-feedback"></div> (opcional)
 */
(function(){
  const form = document.getElementById('contato-form');
  if (!form) return;

  const feedback = document.getElementById('form-feedback');
  const btn = form.querySelector('button[type="submit"], [data-submit]');

  function setBusy(b){
    if (btn) {
      btn.disabled = b;
      btn.setAttribute('aria-busy', String(b));
    }
    if (feedback) {
      feedback.textContent = b ? 'Enviando…' : '';
    }
  }

  form.addEventListener('submit', async (ev) => {
    // impede a navegação para /api/contato
    ev.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(form);
      const res = await fetch(form.getAttribute('action') || '/api/contato', {
        method: 'POST',
        body: fd
      });

      let data;
      try { data = await res.json(); }
      catch(e){ data = { ok:false, raw: await res.text() }; }

      if (res.ok && data && (data.success || data.ok)) {
        if (feedback) feedback.textContent = 'Mensagem enviada com sucesso.';
        form.reset();
        // reseta o token do Turnstile, se presente
        try { if (window.turnstile) turnstile.reset(); } catch(e){}
      } else {
        const msg = (data && (data.detail || data.error)) || 'Falha ao enviar. Tente novamente.';
        if (feedback) feedback.textContent = 'Erro: ' + msg;
        else alert('Erro: ' + msg);
      }
    } catch (err) {
      if (feedback) feedback.textContent = 'Erro de rede ou servidor. Tente novamente.';
      else alert('Erro de rede ou servidor.');
    } finally {
      setBusy(false);
    }
  });
})();