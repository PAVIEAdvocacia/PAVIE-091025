// form.submit.js — coleta token, envia aliases e dá feedback
(function () { "use strict";
  var form = document.getElementById("contatoForm") || document.querySelector('form[action="/api/contato"]');
  if (!form) return;
  var btn = form.querySelector('button[type="submit"]');
  var statusEl = document.getElementById("formStatus");
  function setStatus(msg, type){ if(statusEl){ statusEl.textContent=msg||""; statusEl.className = "text-sm mt-2 " + (type==="error"?"text-red-600":type==="success"?"text-green-600":"text-gray-600"); } }
  function lock(v){ if(btn){ btn.disabled=!!v; btn.style.opacity = v? "0.6":"1"; } }
  form.addEventListener("submit", async function(e){
    var tokenInput = document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
    if (!window.__tsReady || !tokenInput || !tokenInput.value) {
      e.preventDefault();
      alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
      return;
    }
    e.preventDefault();
    setStatus("Enviando...");
    lock(true);
    try{
      var data = new FormData(form);
      var token = tokenInput.value || tokenInput.textContent || "";
      if (!data.get("cf-turnstile-response")) data.set("cf-turnstile-response", token);
      if (!data.get("turnstileToken")) data.set("turnstileToken", token);
      if (!data.get("turnstile")) data.set("turnstile", token);
      var resp = await fetch("/api/contato", { method:"POST", body:data });
      var ct = resp.headers.get("content-type") || "";
      var body = ct.includes("application/json") ? await resp.json() : { ok: resp.ok };
      if (!resp.ok || !body.ok) {
        var msg = "Não foi possível enviar. ";
        if (body && body.error === "TurnstileFail") {
          var errs = (body.tsData && body.tsData["error-codes"]) || body["error-codes"] || [];
          msg += "Falha na validação de segurança" + (errs.length ? " ("+errs.join(", ")+")" : "") + ".";
        } else if (body && body.error === "MailChannelsFail") {
          msg += "Falha ao enviar e-mail (MailChannels).";
        } else if (body && body.error === "missing_env") {
          msg += "Variáveis de ambiente faltando no servidor.";
        } else {
          msg += "Tente novamente em instantes.";
        }
        setStatus(msg, "error");
        alert(msg);
        throw body;
      }
      alert("Solicitação enviada com sucesso! Já recebemos seus dados e entraremos em contato.");
      setStatus("Enviado com sucesso.", "success");
      form.reset();
      if (window.__tsWidgetId && window.turnstile) turnstile.reset(window.__tsWidgetId);
    } catch(err){ console.error("Erro no envio do formulário:", err); }
    finally { lock(false); }
  });
})();