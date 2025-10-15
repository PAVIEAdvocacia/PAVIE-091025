(function () {
  const form = document.getElementById('contato');
  const btn = document.getElementById('btnEnviar');
  const statusEl = document.getElementById('status');

  if (!form) return;

  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    statusEl.className = 'text-sm ' + (ok ? 'text-green-600' : 'text-red-600');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    setStatus('Enviando...', true);
    if (btn) btn.disabled = true;

    try {
      const fd = new FormData(form);
      // Fail-fast se o Turnstile ainda não populou o token
      if (!fd.get('cf-turnstile-response')) {
        setStatus('Validação de segurança pendente. Aguarde o carregamento do Turnstile.', false);
        if (btn) btn.disabled = false;
        return;
      }

      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' },
      });

      const ct = res.headers.get('content-type') || '';
      const isJSON = ct.includes('application/json');
      const data = isJSON ? await res.json() : { ok: res.ok };

      if (!res.ok || !data.ok) {
        const msg = (data && (data.error || data.message)) || ('Erro ' + res.status + ' ao enviar.');
        throw new Error(msg);
      }

      setStatus('Mensagem enviada com sucesso. Obrigado!', true);
      form.reset();
      // Turnstile deve reinserir novo token automaticamente após reset do form
    } catch (err) {
      console.error('Falha ao enviar o formulário:', err);
      setStatus('Falha ao enviar. ' + (err && err.message ? err.message : 'Tente novamente.'), false);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
})();
