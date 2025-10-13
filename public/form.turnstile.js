
// Turnstile explicit render helper for the main contact form
// Read public sitekey from #ts-container[data-sitekey] (public key, safe to expose)
window.tsOnload = function tsOnload() {
  try {
    var container = document.getElementById('ts-container');
    var statusEl = document.getElementById('form-status');
    if (!container) return;
    var sitekey = container.getAttribute('data-sitekey') || 'REPLACE_WITH_TURNSTILE_SITE_KEY';
    if (!sitekey || sitekey === 'REPLACE_WITH_TURNSTILE_SITE_KEY') {
      if (statusEl) statusEl.textContent = 'Defina o sitekey do Turnstile.';
      return;
    }
    if (statusEl) statusEl.textContent = 'Segurança ativa.';
    // Render
    turnstile.render('#ts-container', {
      sitekey: sitekey,
      theme: 'auto',
      callback: function(token){
        if (statusEl) statusEl.textContent = 'Pronto para enviar.';
      },
      'expired-callback': function(){
        if (statusEl) statusEl.textContent = 'Validação expirada. Aguarde recarregar.';
        try { turnstile.reset(container); } catch(e){}
      },
      'error-callback': function(){
        if (statusEl) statusEl.textContent = 'Erro ao validar segurança. Recarregue a página.';
      }
    });
  } catch (err) {
    var statusEl = document.getElementById('form-status');
    if (statusEl) statusEl.textContent = 'Falha ao inicializar Turnstile.';
  }
};
