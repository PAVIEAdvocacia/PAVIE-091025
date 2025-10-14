(function () {
  // Robust selector: prefer ID, fallback to the action
  const form = document.getElementById("contatoForm") || document.querySelector('form[action="/api/contato"]');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("formStatus");

  function setStatus(msg, type="info") {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "text-sm mt-2 " + (type === "error" ? "text-red-600" : type === "success" ? "text-green-600" : "text-gray-600");
  }

  function lock(v) {
    if (btn) {
      btn.disabled = !!v;
      btn.style.opacity = v ? "0.6" : "1";
    }
  }

  form.addEventListener("submit", async (e) => {
    // Block if token not ready
    const hasTokenField = !!document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
    if (!window.__tsReady || !hasTokenField) {
      e.preventDefault();
      alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
      return;
    }

    e.preventDefault();
    setStatus("Enviando...");
    lock(true);

    try {
      const data = new FormData(form);

      // Garantia extra: copie o token para um alias aceito pela API se necessário
      const tsInput = document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
      if (tsInput) {
        const token = tsInput.value || tsInput.textContent || "";
        if (!data.get("cf-turnstile-response")) data.set("cf-turnstile-response", token);
        if (!data.get("turnstileToken")) data.set("turnstileToken", token);
      }

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