// form.turnstile.js — render explícito com response-field e feedback
(function(){"use strict";
  function setStatus(msg, type){ try{ var el = document.getElementById("formStatus"); if(!el) return; el.textContent = msg||""; el.className = "text-sm mt-2 " + (type==="error"?"text-red-600":type==="success"?"text-green-600":"text-gray-600"); }catch(_e){} }
  window.tsOnload = function tsOnload(){ try{
      var el = document.querySelector("#ts-container");
      if(!el || !window.turnstile) return;
      if (window.__tsWidgetId) try{ turnstile.remove(window.__tsWidgetId); }catch(_e){}
      window.__tsWidgetId = turnstile.render("#ts-container", {
        sitekey: "0x4AAAAAAB6FBS0cTG_7KOYv",
        theme: "auto",
        appearance: "always",
        size: "normal",
        'response-field': true,
        'response-field-name': 'cf-turnstile-response',
        'refresh-interval': 'auto',
        'retry': 'auto',
        callback: function(token){ window.__tsReady = true; setStatus("Segurança carregada.", "success"); },
        'error-callback': function(){ setStatus("Erro ao carregar segurança. Recarregue a página.", "error"); },
        'timeout-callback': function(){ setStatus("Tempo esgotado na verificação. Tente novamente.", "error"); }
      });
    }catch(e){ console.error("Turnstile render error", e); }
  };
})();
