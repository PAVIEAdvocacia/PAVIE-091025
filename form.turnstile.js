
/* form.turnstile.js (updated)
 * Renderiza o Turnstile e guarda o token nas entradas hidden
 */
window.onload = function () {
  const container = document.getElementById('cf-turnstile');
  if (!container || !window.turnstile) return;

  // cria/garante inputs hidden
  const ensureHidden = (name) => {
    let el = document.querySelector(`input[name="${name}"]`);
    if (!el) {
      el = document.createElement('input');
      el.type = 'hidden';
      el.name = name;
      document.getElementById('contato-form').appendChild(el);
    }
    return el;
  };

  const input1 = ensureHidden('cf-turnstile-response');
  const input2 = ensureHidden('turnstile');

  window.turnstile.render('#cf-turnstile', {
    sitekey: container.dataset.sitekey,
    callback: function (token) {
      window.__turnstileToken = token;
      input1.value = token;
      input2.value = token;
      const badge = document.getElementById('turnstile-status');
      if (badge) badge.textContent = 'Sucesso!';
    },
    'error-callback': function () {
      const badge = document.getElementById('turnstile-status');
      if (badge) badge.textContent = 'Falha no captcha';
    },
    'expired-callback': function () {
      const badge = document.getElementById('turnstile-status');
      if (badge) badge.textContent = 'Captcha expirado';
    },
    theme: 'auto'
  });
};
