
// Montagem explícita do Turnstile no container #ts-container
window.tsOnload = function tsOnload() {
  var container = document.getElementById('ts-container');
  var statusEl = document.getElementById('form-status');
  if (!container || typeof turnstile === 'undefined') {
    if (statusEl) statusEl.textContent = 'Segurança indisponível.';
    return;
  }
  var sitekey = container.getAttribute('data-sitekey') || 'REPLACE_WITH_TURNSTILE_SITE_KEY';
  if (!sitekey || sitekey === 'REPLACE_WITH_TURNSTILE_SITE_KEY') {
    if (statusEl) statusEl.textContent = 'Defina a site key do Turnstile.';
    return;
  }
  try {
    turnstile.render('#ts-container', {
      sitekey: sitekey,
      theme: 'auto',
      callback: function(){ if (statusEl) statusEl.textContent = 'Pronto para enviar.'; },
      'expired-callback': function(){
        if (statusEl) statusEl.textContent = 'Validação expirada. Aguarde recarregar.';
        try { turnstile.reset(container); } catch(e){}
      },
      'error-callback': function(){
        if (statusEl) statusEl.textContent = 'Erro ao validar segurança. Recarregue a página.';
      }
    });
  } catch (e) {
    if (statusEl) statusEl.textContent = 'Falha ao inicializar Turnstile.';
  }
};
