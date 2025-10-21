// form.turnstile.js — garante que o token esteja no <input hidden>
(function(){
  window.onTsDone = function(token){
    var el = document.getElementById('cf-turnstile-response');
    if(el) el.value = token || '';
  };
  window.onTsExpired = function(){
    var el = document.getElementById('cf-turnstile-response');
    if(el) el.value = '';
  };
  window.onTsError = function(){
    var el = document.getElementById('cf-turnstile-response');
    if(el) el.value = '';
  };

  // Render defensivo: se a página não renderizou automaticamente
  function tryRender(){
    try{
      var placeholder = document.querySelector('.cf-turnstile');
      if(placeholder && placeholder.getAttribute('data-sitekey') && window.turnstile && typeof window.turnstile.render === 'function'){
        window.turnstile.render(placeholder, {
          sitekey: placeholder.getAttribute('data-sitekey'),
          theme: placeholder.getAttribute('data-theme') || 'auto',
          callback: onTsDone,
          'expired-callback': onTsExpired,
          'error-callback': onTsError
        });
      }
    }catch(_){}
  }
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    tryRender();
  }else{
    document.addEventListener('DOMContentLoaded', tryRender);
  }
})();