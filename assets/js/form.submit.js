\
// assets/js/form.submit.js
(function(){
  var FORM_SELECTOR = 'form[action="/api/contato"]';
  var form = document.querySelector(FORM_SELECTOR) || document.querySelector('form');
  if(!form) return;
  if(form.dataset.enhanced === "1") return;
  form.dataset.enhanced = "1";

  // Turnstile callback global
  window.onTsSuccess = function(token){
    try { window.__cfToken = token; } catch(_e) {}
    try {
      var hidden = document.getElementById('cf-turnstile-response');
      if (hidden) hidden.value = token;
      var st = document.getElementById('form-status') || document.getElementById('formStatus');
      if (st) st.textContent = 'Proteção verificada.';
    } catch(_e) {}
  };

  function getTurnstileToken(){
    var i = form.querySelector('input[name="cf-turnstile-response"]');
    return i && i.value ? i.value.trim() : '';
  }

  function buildPayload(){
    var fd = new FormData(form);
    return {
      nome: (fd.get('nome') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      telefone: (fd.get('telefone') || '').toString().trim(),
      servico: (fd.get('servico') || '').toString().trim(),
      mensagem: (fd.get('mensagem') || '').toString().trim(),
      company: (fd.get('company') || '').toString().trim(), // honeypot
      turnstileToken: getTurnstileToken()
    };
  }

  function ensureStatusEl(){
    var el = document.getElementById('form-status') || document.getElementById('formStatus');
    if(!el){
      el = document.createElement('div');
      el.id = 'form-status';
      el.setAttribute('role','status');
      el.setAttribute('aria-live','polite');
      el.style.marginTop = '0.75rem';
      form.appendChild(el);
    }
    return el;
  }

  function setStatus(el, html, isError){
    el.innerHTML = html;
    el.style.color = isError ? 'crimson' : 'inherit';
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>\"']/g, function(m){return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m];});
  }

  form.addEventListener('submit', async function(ev){
    ev.preventDefault();
    var statusEl = ensureStatusEl();
    var btn = form.querySelector('[type="submit"]');
    var originalText = btn ? btn.textContent : '';
    if(btn){ btn.disabled = true; btn.textContent = 'Enviando...'; }
    setStatus(statusEl, 'Processando seu envio...');

    var payload = buildPayload();

    try{
      var res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });

      var raw = await res.text();
      var json = {};
      try { json = JSON.parse(raw); } catch(_e) {}

      var primaryMsg = json.error || json.msg || json.message || ('HTTP ' + res.status);
      var details = json.details;

      if(!res.ok || json.ok === false){
        var detailsBlock = '';
        if(details){
          var pretty = (typeof details === 'string') ? details : JSON.stringify(details, null, 2);
          detailsBlock = '<details style="margin-top:.5rem"><summary>Detalhes técnicos</summary><pre style="white-space:pre-wrap;overflow:auto;margin:.5rem 0 0">'+escapeHtml(pretty)+'</pre></details>';
        }
        throw new Error(primaryMsg + (details ? '\n' + (typeof details === 'string' ? details : JSON.stringify(details)) : ''));
      }

      var okMsg = json.msg || 'Enviado com sucesso.';
      setStatus(statusEl, '<strong>'+escapeHtml(okMsg)+'</strong>');
      form.reset();
      var tsHidden = form.querySelector('#cf-turnstile-response');
      if (tsHidden) tsHidden.value = '';
      if (window.turnstile && typeof window.turnstile.reset === 'function') {
        window.turnstile.reset();
      }
    } catch(err){
      var safe = (err && err.message) ? err.message : 'Falha ao enviar.';
      var detailsMatch = safe.split('\n').slice(1).join('\n').trim();
      var detailsBlock = detailsMatch ? '<details style="margin-top:.5rem"><summary>Detalhes técnicos</summary><pre style="white-space:pre-wrap;overflow:auto;margin:.5rem 0 0">'+escapeHtml(detailsMatch)+'</pre></details>' : '';
      setStatus(statusEl, '<strong>Não foi possível enviar.</strong><br>'+escapeHtml(safe.split('\n')[0]) + detailsBlock, true);
    } finally {
      if(btn){ btn.disabled = false; btn.textContent = originalText; }
    }
  });
})();
