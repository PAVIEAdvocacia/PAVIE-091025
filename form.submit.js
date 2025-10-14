(function () {
  const form = document.getElementById("contatoForm") || document.querySelector('form[action="/api/contato"]');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  const statusEl = document.getElementById("formStatus") || document.getElementById("form-status");

  function setStatus(msg, type="info") {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "text-sm mt-2 " + (type === "error" ? "text-red-600" : type === "success" ? "text-green-600" : "text-gray-600");
  }
  function lock(v) {
    if (!btn) return;
    btn.disabled = !!v;
    btn.style.opacity = v ? "0.6" : "1";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // exige token do Turnstile
    const tsInput = form.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
    if (!tsInput || !tsInput.value) {
      alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
      return;
    }

    setStatus("Enviando...");
    lock(true);

    try {
      const data = new FormData(form);
      // garante o nome do campo correto
      if (!data.get("cf-turnstile-response")) {
        data.set("cf-turnstile-response", tsInput.value || tsInput.textContent || "");
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
      // mensagens mais claras
      if (err && err.error === "TurnstileFail") {
        setStatus("Falha na validação de segurança. Recarregue a página e tente novamente.", "error");
      } else if (err && err.error === "missing_env") {
        setStatus("Configuração do servidor incompleta. Tente novamente mais tarde.", "error");
      } else if (err && err.error === "MailChannelsFail") {
        setStatus("Falha no envio do e-mail. Tente novamente em instantes.", "error");
      } else {
        setStatus("Não foi possível enviar. Tente novamente em instantes.", "error");
      }
      alert("Erro ao enviar. Tente novamente em instantes.");
    } finally {
      lock(false);
    }
  });
})();