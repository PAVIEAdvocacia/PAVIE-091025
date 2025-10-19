// /form.submit.js
(function () {
  var form = document.querySelector('form[data-form="contato"]') || document.querySelector('form#contato');
  if (!form) return;

  function getTurnstileToken() {
    try {
      var i = form.querySelector('input[name="cf-turnstile-response"]');
      var v = i && i.value ? i.value.trim() : "";
      return v || (window.__cfToken || "");
    } catch (_) { return window.__cfToken || ""; }
  }

  function setStatus(msg, ok) {
    var box = document.getElementById("form-status");
    if (!box) return;
    box.textContent = msg;
    box.className = ok ? "ok" : "err";
    box.style.display = "block";
  }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var payload = {
      nome: (form.querySelector('[name="nome"]')||{}).value || "",
      email: (form.querySelector('[name="email"]')||{}).value || "",
      telefone: (form.querySelector('[name="telefone"]')||{}).value || "",
      servico: (form.querySelector('[name="servico"]')||{}).value || "",
      mensagem: (form.querySelector('[name="mensagem"]')||{}).value || "",
      turnstileToken: getTurnstileToken()
    };

    if (!payload.turnstileToken) {
      setStatus("Falha na proteção: token Turnstile ausente. Recarregue a página e tente novamente.", false);
      return;
    }

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin"
      });

      const raw = await res.text();
      let json = {};
      try { json = JSON.parse(raw); } catch(_) {}

      if (!res.ok || json.ok === false) {
        throw new Error(json.error || json.details || ("HTTP " + res.status));
      }

      setStatus("Solicitação enviada com sucesso. Em breve entraremos em contato.", true);
      form.reset();
      try { window.__cfToken = ""; document.getElementById("cf-turnstile-response").value = ""; } catch(_) {}
    } catch (err) {
      console.error("Erro no envio do formulário:", err);
      setStatus("Erro no envio: " + (err && err.message ? err.message : String(err)), false);
    }
  });
})();