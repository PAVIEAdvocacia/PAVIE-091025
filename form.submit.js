
/* form.submit.js (updated)
 * - Envia FormData para /api/contato (POST)
 * - Garante que os campos 'turnstile' e 'cf-turnstile-response' existam
 * - Preenche consent_timestamp
 * - Exibe mensagens de sucesso/erro amigáveis
 * - Traz logs úteis se o servidor retornar 400/401/405/5xx
 */

(function () {
  const form = document.getElementById('contato-form');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById('envio-status');
  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

  async function submitForm(ev) {
    ev.preventDefault();

    // monta o payload
    const fd = new FormData(form);

    // timestamp LGPD
    if (!fd.get('consent_timestamp')) {
      fd.set('consent_timestamp', new Date().toISOString());
    }

    // Turnstile: garanta os dois nomes, para compatibilidade com o worker
    const t1 = fd.get('cf-turnstile-response');
    const t2 = fd.get('turnstile');
    const token = t1 || t2 || (window.__turnstileToken || '');
    if (token) {
      fd.set('cf-turnstile-response', token);
      fd.set('turnstile', token);
    }

    // empresa oculta (anti-spam)
    if (!fd.get('company')) fd.set('company', 'pavieadvocacia.com.br');

    // UI
    btn && (btn.disabled = true);
    setStatus('Enviando...');

    let resp, bodyText;
    try {
      resp = await fetch(form.action || '/api/contato', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin'
      });

      bodyText = await resp.text();
      let data;
      try { data = JSON.parse(bodyText); } catch { data = { ok: false, raw: bodyText }; }

      if (!resp.ok) {
        // mensagens específicas
        if (resp.status === 400) throw new Error((data && (data.message || data.error)) || 'validation_error');
        if (resp.status === 401) throw new Error('mailchannels_unauthorized');
        if (resp.status === 405) throw new Error('method_not_allowed');
        if (resp.status === 429) throw new Error('rate_limited');
        throw new Error((data && (data.message || data.error)) || `http_${resp.status}`);
      }

      // sucesso!
      alert('Solicitação enviada com sucesso! Já recebemos seus dados e entraremos em contato.');
      setStatus('Enviado com sucesso.');
      form.reset();
      // reseta turnstile se existir
      if (window.turnstile && typeof window.turnstile.reset === 'function') {
        try { window.turnstile.reset(); } catch {}
      }
    } catch (err) {
      console.error('[contato.submit] falha:', err, bodyText);
      let msg = 'Erro ao enviar.';
      switch (String(err.message || '')) {
        case 'validation_error':
          msg = 'Erro ao enviar: validation_error — confira os campos e o captcha.'; break;
        case 'mailchannels_unauthorized':
          msg = 'Erro ao enviar: 401 na API de e-mail. Verifique SPF (include:spf.mailchannels.net) e o domínio do remetente.'; break;
        case 'method_not_allowed':
          msg = 'Erro ao enviar: HTTP 405. O endpoint /api/contato não está aceitando POST — certifique-se de que a Function está publicada.'; break;
        case 'rate_limited':
          msg = 'Muitas tentativas. Tente novamente em instantes.'; break;
        default:
          if ((err.message || '').startsWith('http_')) {
            msg = `Erro ao enviar: ${err.message.replace('http_', 'HTTP ')}`;
          }
      }
      alert(msg);
      setStatus(msg);
    } finally {
      btn && (btn.disabled = false);
    }
  }

  form.addEventListener('submit', submitForm);
})();
