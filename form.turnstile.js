
// form.turnstile.js — execução sob demanda + envio AJAX (evita timeout/duplicate e navegação)
(function(){
  var WIDGET_ID=null, ready=false, busy=false;
  var form=document.querySelector('form[action="/api/contato"]');
  var container=document.getElementById('ts-container');
  var statusEl=document.getElementById('ts-status');

  function s(t){ if(statusEl) statusEl.textContent=t; }
  function resetToken(){ if(WIDGET_ID && window.turnstile){ try{ turnstile.reset(WIDGET_ID); }catch(_){} } }

  // Submit efetivo via fetch
  async function doSubmit(){
    try{
      s("Enviando…"); busy=true;
      var fd=new FormData(form);
      var res=await fetch("/api/contato",{method:"POST",body:fd});
      var data={}; try{ data=await res.json(); }catch(_){}
      if(res.ok && data && (data.success===true || data.delivered)){
        s("Mensagem enviada com sucesso.");
        form.reset(); resetToken();
      }else{
        s("Falha no envio: "+(data&&data.error?data.error:"indefinida"));
        resetToken();
      }
    }catch(e){
      s("Falha de conexão. Tente novamente.");
      resetToken();
    }finally{ busy=false; }
  }

  window.tsOnload=function(){
    if(!container || !form) return;
    if(typeof turnstile==="undefined"){ s("Erro ao iniciar segurança"); return; }
    turnstile.ready(function(){
      try{
        WIDGET_ID = turnstile.render("#ts-container", {
          sitekey: "0x4AAAAAAB6FBS0cTG_7KOYv",
          execution: "execute",
          callback: function(token){
            var hidden=form.querySelector('input[name="cf-turnstile-response"]');
            if(!hidden){ hidden=document.createElement("input"); hidden.type="hidden"; hidden.name="cf-turnstile-response"; form.appendChild(hidden); }
            hidden.value=token;
            doSubmit();
          },
          "error-callback": function(){ s("Falha na verificação. Clique novamente."); resetToken(); },
          "expired-callback": function(){ s("Sessão atualizada. Clique novamente."); resetToken(); }
        });
        ready=true; s("Pronto para enviar.");
      }catch(e){ s("Erro ao iniciar segurança"); }
    });
  };

  if(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      if(busy) return;
      var hidden=form.querySelector('input[name="cf-turnstile-response"]');
      if(ready && WIDGET_ID){
        // Executa para gerar token fresco; doSubmit é chamado no callback
        s("Validando…");
        try{ turnstile.execute(WIDGET_ID); }catch(_){ s("Erro ao validar."); }
      }else if(hidden && hidden.value){
        // Token ainda válido (cenário raro), envia direto
        doSubmit();
      }else{
        s("Inicializando segurança…");
      }
    });
  }
})();
