// form.submit.js
// Submissão do formulário utilizando o token entregue por form.turnstile.js
(function () {
  var form = document.querySelector("#contatoForm");
  var statusEl = document.querySelector("#formStatus");
  if (!form) { console.error("Formulário #contatoForm não encontrado."); return; }

  function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    setStatus("Enviando…");

    var fd = new FormData(form);
    var data = Object.fromEntries(fd.entries());

    // Honeypot
    if (data.company) { setStatus("Bloqueado por proteção anti‑spam."); return; }

    // Token Turnstile
    var token = (window.getCfToken && window.getCfToken()) || "";
    if (!token) { setStatus("Valide a segurança antes de enviar."); return; }

    var payload = {
      nome: data.nome || "",
      email: data.email || "",
      telefone: data.telefone || data.fone || "",
      mensagem: data.mensagem || "",
      servico: data.servico || "",
      consent: !!data.consent,
      consent_timestamp: data.consent_timestamp || null,
      turnstileToken: token
    };

    try {
      var res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin"
      });

      var json = {};
      try { json = await res.json(); } catch (_e) {}

      if (!res.ok || !json.ok) {
        var msg = (json && (json.error || json.details)) || ("HTTP " + res.status);
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
      }

      setStatus("Mensagem enviada. Obrigado! Você receberá um e‑mail de confirmação.");
      form.reset();
      try { window.__cfToken = ""; } catch (_e) {}
      // Re-render Turnstile para novo envio
      try { window.turnstile && window.turnstile.reset(); } catch (_e) {}
    } catch (err) {
      setStatus("Erro no envio: " + (err && err.message ? err.message : String(err)));
    }
  });
})();
