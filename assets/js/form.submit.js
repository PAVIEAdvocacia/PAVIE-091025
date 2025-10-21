// assets/js/form.submit.js — envio opcional via fetch quando data-submit="fetch"
(function(){
  var form = document.querySelector('form[action="/api/contato"], form#contato, form#contact');
  var statusEl = document.getElementById('formStatus');
  function setStatus(msg){ if(statusEl) statusEl.textContent = msg; }

  if(!form) return;

  // Só intercepta quando explicitamente indicado
  if(form.getAttribute('data-submit') === 'fetch'){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      setStatus('Enviando…');
      var fd = new FormData(form);
      var payload = {};
      fd.forEach(function(v,k){ payload[k]=v; });
      fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(r){ return r.text().then(function(t){ return {ok:r.ok, text:t};}); })
      .then(function(res){
        var j; try{ j=JSON.parse(res.text);}catch(_){}
        if(res.ok && j && j.ok){
          setStatus('Mensagem enviada com sucesso.');
          form.reset();
          if(window.turnstile && typeof window.turnstile.reset === 'function'){ window.turnstile.reset(); }
        }else{
          setStatus('Erro: ' + (j && (j.error||j.message) || res.text || 'Falha no envio.'));
        }
      })
      .catch(function(){ setStatus('Erro inesperado.'); });
    });
  }
})();