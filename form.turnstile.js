// form.turnstile.js — render explícito com execução no submit (evita timeout/duplicate)
(function(){ 
  var WIDGET_ID = null;
  var ready = false;
  var form = document.querySelector('form[action="/api/contato"]');
  var container = document.getElementById('ts-container');
  var statusEl = document.getElementById('ts-status');

  function setStatus(msg){ if(statusEl) statusEl.textContent = msg; }

  // onload do loader (definido na query string)
  window.tsOnload = function(){ 
    if (!container) return;
    if (typeof turnstile === "undefined") { setStatus('Erro ao iniciar segurança'); return; }
    turnstile.ready(function(){ 
      try {
        // Render com execução sob demanda (token só é gerado quando pedirmos)
        WIDGET_ID = turnstile.render('#ts-container', {
          sitekey: '0x4AAAAAAB6FBS0cTG_7KOYv',
          execution: 'execute',
          callback: function(token){ 
            // Garantir campo oculto no form
            var hidden = form && form.querySelector('input[name="cf-turnstile-response"]');
            if(!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.name='cf-turnstile-response'; form.appendChild(hidden);}
            hidden.value = token;
            setStatus('Verificado. Enviando…');
            // Após gerar token fresco, submetemos de verdade
            if (form && form._deferred_submit) { 
              var submit = form._deferred_submit; 
              form._deferred_submit = null; 
              submit(); 
            } else if(form) { form.submit(); }
          },
          'error-callback': function(code){ 
            setStatus('Falha na verificação ('+code+'). Tente novamente.');
            if (WIDGET_ID) turnstile.reset(WIDGET_ID);
            enableButton();
          },
          'expired-callback': function(){ 
            setStatus('Sessão de segurança atualizada. Clique em Enviar novamente.');
            if (WIDGET_ID) turnstile.reset(WIDGET_ID);
            enableButton();
          }
        });
        ready = true;
        setStatus('Pronto para enviar.');
      } catch(e){ setStatus('Erro ao iniciar segurança'); }
    });
  };

  function disableButton(){ 
    var btn = form && form.querySelector('button[type="submit"]');
    if(btn) { btn.disabled = true; btn.style.opacity = .7; }
  }
  function enableButton(){ 
    var btn = form && form.querySelector('button[type="submit"]');
    if(btn) { btn.disabled = false; btn.style.opacity = 1; }
  }

  if (form) {
    form.addEventListener('submit', function(ev){ 
      // Se já temos um token recente, deixa seguir
      var hidden = form.querySelector('input[name="cf-turnstile-response"]');
      if (hidden && hidden.value) return; 

      // Gera token fresco no ato do submit
      if (ready && WIDGET_ID) { 
        ev.preventDefault();
        disableButton();
        setStatus('Validando…');
        // Defer real submit até o callback
        form._deferred_submit = form.submit.bind(form);
        try { turnstile.execute(WIDGET_ID); } catch(e){ enableButton(); }
      }
    });
  }
})();