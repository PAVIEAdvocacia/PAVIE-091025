(function(){
  const form = document.getElementById('contato-form');
  if (!form) { console.warn('[form.submit.js] Não encontrei #contato-form.'); return; }
  const feedback = document.getElementById('form-feedback');
  const btn = form.querySelector('button[type="submit"], [data-submit]');
  const setMsg = (m) => { if (feedback) feedback.textContent = m; console.log('[form-feedback]', m); };
  function setBusy(b){ if (btn){ btn.disabled=b; btn.setAttribute('aria-busy', String(b)); } setMsg(b?'Enviando…':''); }
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData(form);
      console.debug('[submit] Enviando', Array.from(fd.entries()));
      const res = await fetch(form.getAttribute('action') || '/api/contato', { method:'POST', body: fd });
      const text = await res.text();
      let data; try { data = JSON.parse(text); } catch(e){ data = { parseError:true, raw:text }; }
      console.debug('[submit] HTTP', res.status, data);
      if (res.ok && (data.success || data.ok)) {
        setMsg('Mensagem enviada com sucesso.');
        try { form.reset(); if (window.turnstile) turnstile.reset(); } catch(e){}
      } else {
        const msg = (data && (data.detail || data.error || data.raw)) || ('Falha HTTP '+res.status);
        setMsg('Erro: ' + msg);
        alert('Erro ao enviar: ' + msg);
      }
    } catch (err) {
      console.error('[submit] Falha:', err);
      setMsg('Erro de rede/servidor. Veja o console.');
      alert('Erro de rede/servidor. Veja o console.');
    } finally { setBusy(false); }
  });
})();