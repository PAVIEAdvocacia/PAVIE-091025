'use strict';
// PAVIE | Advocacia — Envio de formulário com Turnstile (Cloudflare Pages)
(function(){
  function ready(fn){ if(document.readyState!=='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }

  ready(function(){
    var form = document.getElementById('contatoForm');
    if(!form) return;
    if(form.dataset.enhanced === "1") return;
    form.dataset.enhanced = "1";

    var statusEl = document.getElementById('formStatus');
    function ensureStatus(){
      if(!statusEl){
        statusEl = document.createElement('p');
        statusEl.id = 'formStatus';
        statusEl.className = 'text-sm mt-3 text-slate-600';
        form.insertBefore(statusEl, form.querySelector('button[type="submit"]'));
      }
      return statusEl;
    }
    function setStatus(msg, isError){
      var el = ensureStatus();
      el.textContent = msg;
      el.style.color = isError ? 'crimson' : '';
    }
    function getToken(){
      var h = document.getElementById('turnstileToken');
      if(h && h.value) return h.value.trim();
      var h2 = form.querySelector('input[name="cf-turnstile-response"]');
      return (h2 && h2.value) ? h2.value.trim() : '';
    }

    // Callbacks do widget
    window.onTsDone = function(token){
      try {
        var h = document.getElementById('turnstileToken');
        if(h) h.value = token || '';
        setStatus('Segurança validada.');
      } catch(_e) {}
    };
    window.onTsExpired = function(){
      setStatus('Validação expirada. Aguarde recarregar o desafio.', true);
    };
    window.onTsError = function(){
      setStatus('Falha ao carregar o desafio de segurança.', true);
    };

    form.addEventListener('submit', async function(ev){
      ev.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var original = btn ? btn.textContent : '';

      var token = getToken();
      if(!token){
        setStatus('Não foi possível validar o Turnstile. Aguarde carregar e tente novamente.', true);
        return;
      }

      if(btn){ btn.disabled = true; btn.textContent = 'Enviando...'; }
      setStatus('Processando seu envio...');

      var fd = new FormData(form);
      var payload = {};
      fd.forEach((v,k)=>{ payload[k]=v; });
      payload.turnstileToken = token;

      try{
        var res = await fetch('/api/contato', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'same-origin'
        });
        var data = await res.json().catch(()=>({}));
        if(!res.ok || data.ok === false){
          throw new Error(data.error || ('HTTP ' + res.status));
        }
        setStatus(data.msg || 'Enviado com sucesso.');
        form.reset();
        var h = document.getElementById('turnstileToken'); if(h) h.value='';
        if(window.turnstile && typeof window.turnstile.reset === 'function'){ try{ window.turnstile.reset(); }catch(_e){} }
      } catch(err){
        setStatus('Não foi possível enviar: ' + (err && err.message ? err.message : 'erro inesperado'), true);
      } finally{
        if(btn){ btn.disabled = false; btn.textContent = original; }
      }
    });
  });
})();