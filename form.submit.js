// assets/js/form.submit.js
(() => {
  const FORM_SELECTOR = 'form[action="/api/contato"]';
  const form = document.querySelector(FORM_SELECTOR);
  if (!form) return;

  // Reutiliza #form-status se existir, senão #formStatus, senão cria um novo
  let statusEl = document.getElementById('form-status') || document.getElementById('formStatus');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'form-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.marginTop = '0.75rem';
    form.appendChild(statusEl);
  }

  function getTurnstileToken() {
    const i = form.querySelector('input[name="cf-turnstile-response"]');
    return i && i.value ? i.value.trim() : '';
  }

  function buildPayload() {
    const fd = new FormData(form);
    const payload = {
      nome: (fd.get('nome') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      telefone: (fd.get('telefone') || '').toString().trim(),
      servico: (fd.get('servico') || '').toString().trim(),
      mensagem: (fd.get('mensagem') || '').toString().trim(),
      company: (fd.get('company') || '').toString().trim(), // honeypot
      turnstileToken: getTurnstileToken(),
    };
    return payload;
  }

  function setStatus(html, isError = false) {
    statusEl.innerHTML = html;
    statusEl.style.color = isError ? 'crimson' : 'inherit';
  }

  async function submitHandler(ev) {
    ev.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
    setStatus('Processando seu envio...');

    const payload = buildPayload();

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        credentials: "same-origin"
      });

      const raw = await res.text();
      let json = {};
      try { json = JSON.parse(raw); } catch (_e) {}

      const primaryMsg = json.error || json.msg || json.message || `HTTP ${res.status}`;
      const details = json.details;

      if (!res.ok || json.ok === false) {
        let detailsBlock = '';
        if (details) {
          const pretty = typeof details === 'string' ? details : JSON.stringify(details, null, 2);
          detailsBlock = `
            <details style="margin-top:.5rem">
              <summary>Detalhes técnicos</summary>
              <pre style="white-space:pre-wrap;overflow:auto;margin:.5rem 0 0">${escapeHtml(pretty)}</pre>
            </details>`;
        }
        throw new Error(primaryMsg + (details ? '\n' + (typeof details === 'string' ? details : JSON.stringify(details)) : ''));
      }

      const okMsg = json.msg || 'Enviado com sucesso.';
      setStatus(`<strong>${escapeHtml(okMsg)}</strong>`);
      form.reset();

      const tsHidden = form.querySelector('#cf-turnstile-response');
      if (tsHidden) tsHidden.value = '';
      if (window.turnstile && typeof window.turnstile.reset === 'function') {
        window.turnstile.reset();
      }
    } catch (err) {
      const safe = (err && err.message) ? err.message : 'Falha ao enviar.';
      const detailsMatch = safe.split('\n').slice(1).join('\n').trim();
      const detailsBlock = detailsMatch
        ? `<details style="margin-top:.5rem"><summary>Detalhes técnicos</summary><pre style="white-space:pre-wrap;overflow:auto;margin:.5rem 0 0">${escapeHtml(detailsMatch)}</pre></details>`
        : '';
      setStatus(`<strong>Não foi possível enviar.</strong><br>${escapeHtml(safe.split('\n')[0])}${detailsBlock}`, true);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  }

  form.addEventListener('submit', submitHandler);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }
})();
