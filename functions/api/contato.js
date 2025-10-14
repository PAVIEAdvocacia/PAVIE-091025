/* contato.js - envia formulário de contato para /api/contato
 * Corrige o nome do token do Turnstile -> 'cf-turnstile-response'
 * e adiciona consent_timestamp/host. Exibe mensagens de status.
 */
(function () {
  const form =
    document.getElementById("contato-form") ||
    document.querySelector('form[action="/api/contato"]') ||
    document.querySelector('[data-form="contato"]') ||
    document.querySelector("form");

  if (!form) return;

  const statusEl =
    document.getElementById("form-status") ||
    form.querySelector('[data-role="form-status"]');

  const setStatus = (msg, cls) => {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    if (cls) statusEl.className = cls;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    if (btn) btn.setAttribute("disabled", "disabled");
    setStatus("Enviando...");
    
    // Validação simples do consentimento
    const consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      setStatus("Marque o aceite da Política de Privacidade.", "error");
      if (btn) btn.removeAttribute("disabled");
      return;
    }

    const fd = new FormData(form);

    // === Turnstile ===
    // O Worker espera o campo 'cf-turnstile-response'. Garanta que vamos enviar nesse nome.
    let token = "";
    try {
      if (window.turnstile && typeof window.turnstile.getResponse === "function") {
        token = window.turnstile.getResponse();
      }
    } catch (_) {}
    if (!token) {
      // fallback: algum input hidden já preenchido pelo widget/callback
      const h = form.querySelector('input[name="cf-turnstile-response"]');
      if (h && h.value) token = h.value;
    }
    // remova nome errado se existir
    fd.delete("turnstile");
    // define no nome correto
    if (token) fd.set("cf-turnstile-response", token);

    // Metadados úteis ao backend
    fd.set("consent_timestamp", new Date().toISOString());
    fd.set("company", location.hostname);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      // Tenta decodificar JSON, mas não quebra se vier outro tipo
      let data = null;
      try {
        if ((res.headers.get("content-type") || "").includes("application/json")) {
          data = await res.json();
        }
      } catch (_) {}

      if (res.ok && data && data.ok) {
        setStatus("Solicitação enviada com sucesso. Você receberá uma confirmação por e‑mail.", "success");
        try { form.reset(); } catch (_) {}
        try { window.turnstile && window.turnstile.reset && window.turnstile.reset(); } catch (_) {}
      } else {
        const msg = (data && (data.error || data.message)) || `Erro ao enviar: ${res.status} ${res.statusText || ""}`.trim();
        alert(`Erro ao enviar: ${msg}`);
        setStatus(msg, "error");
      }
    } catch (err) {
      alert("Falha de rede ao enviar o formulário.");
      setStatus("Falha de rede ao enviar o formulário.", "error");
    } finally {
      if (btn) btn.removeAttribute("disabled");
    }
  });
})();