(function () {
  const form = document.getElementById("contatoForm") || document.querySelector('form[action="/api/contato"]');
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("formStatus") || document.getElementById("form-status");

  function setStatus(msg, type="info") {
    statusEl.textContent = msg || "";
    statusEl.className = "text-sm mt-2 " + (type === "error" ? "text-red-600" : type === "success" ? "text-green-600" : "text-gray-600");
  }
  function lock(v) {
    btn.disabled = !!v;
    btn.style.opacity = v ? "0.6" : "1";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.__tsReady) {
      alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
      return;
    }

    setStatus("Enviando...");
    lock(true);

    try {
      const data = new FormData(form);
      // adiciona token do Turnstile
      const tsInput = document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
      if (tsInput && !data.get("turnstile")) data.set("turnstile", tsInput.value || tsInput.textContent || "");

      const resp = await fetch("/api/contato", { method: "POST", body: data });
      const isJson = (resp.headers.get("content-type") || "").includes("application/json");
      const body = isJson ? await resp.json() : { ok: resp.ok };

      if (!resp.ok || !body.ok) throw body;

      alert("Solicitação enviada com sucesso! Já recebemos seus dados e entraremos em contato.");
      form.reset();
      if (window.__tsWidgetId && window.turnstile) turnstile.reset(window.__tsWidgetId);
      setStatus("Enviado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      setStatus("Não foi possível enviar. Tente novamente em instantes.", "error");
      alert("Erro ao enviar. Tente novamente em instantes.");
    } finally {
      lock(false);
    }
  });
})();
