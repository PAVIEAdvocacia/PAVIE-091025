(function () {
  const form = document.getElementById("contatoForm") || document.querySelector('form[action="/api/contato"]');
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.getElementById("formStatus");

  function setStatus(msg, type="info") {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "text-sm mt-2 " + (type === "error" ? "text-red-600" : type === "success" ? "text-green-600" : "text-gray-600");
  }
  function lock(v) { if (btn) { btn.disabled = !!v; btn.style.opacity = v ? "0.6" : "1"; } }

  function getTurnstileToken() {
    // 1) Preferir o input DENTRO do form
    let input = form.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
    if (input && (input.value || input.textContent)) return (input.value || input.textContent || "").trim();

    // 2) Se houver múltiplos widgets na página, usar o ÚLTIMO token visível
    const all = Array.from(document.querySelectorAll('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]'));
    if (all.length) {
      const last = all[all.length - 1];
      return (last.value || last.textContent || "").trim();
    }
    return "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const hasTokenField = !!document.querySelector('input[name="cf-turnstile-response"], textarea[name="cf-turnstile-response"]');
    if (!window.__tsReady || !hasTokenField) {
      alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
      return;
    }

    setStatus("Enviando..."); lock(true);
    try {
      const data = new FormData(form);
      const token = getTurnstileToken();
      if (token) {
        if (!data.get("cf-turnstile-response")) data.set("cf-turnstile-response", token);
        if (!data.get("turnstileToken")) data.set("turnstileToken", token);
        if (!data.get("turnstile")) data.set("turnstile", token);
      }

      // Usar a action do form caso mude de rota
      const url = form.getAttribute("action") || "/api/contato";

      const resp = await fetch(url, { method: "POST", body: data });
      const isJson = (resp.headers.get("content-type") || "").includes("application/json");
      const body = isJson ? await resp.json() : { ok: resp.ok };

      if (!resp.ok || !body.ok) {
        console.error("Falha ao enviar:", body);
        // Mostrar mensagem técnica no status para depurar sem alterar layout
        setStatus((body && (body.error || body.detail || JSON.stringify(body))) || "Falha no envio.", "error");
        throw new Error((body && (body.error || body.detail)) || "Erro desconhecido");
      }

      alert("Solicitação enviada com sucesso! Já recebemos seus dados e entraremos em contato.");
      form.reset();
      if (window.__tsWidgetId && window.turnstile) turnstile.reset(window.__tsWidgetId);
      setStatus("Enviado com sucesso.", "success");
    } catch (err) {
      console.error("Erro no envio:", err);
      if (!statusEl.textContent) setStatus("Não foi possível enviar. Tente novamente em instantes.", "error");
      alert("Erro ao enviar. Tente novamente em instantes.");
    } finally { lock(false); }
  });
})();