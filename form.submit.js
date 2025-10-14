/**
 * Handles submit for #contatoForm.
 */
(function () {
  const form = document.getElementById("contatoForm");
  if (!form) return;

  const btn = form.querySelector("button[type=submit]");
  const statusEl = document.getElementById("formStatus");

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
  }
  function disable(v) {
    if (btn) btn.disabled = v;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.TURNSTILE_READY) {
      // Give Turnstile a little time to finish on very fast clicks
      setStatus("Carregando segurança...");
      await new Promise(r => setTimeout(r, 1200));
      if (!window.TURNSTILE_READY) {
        alert("Validação de segurança ainda não carregou. Aguarde 1–2 segundos e clique em Enviar novamente.");
        return;
      }
    }

    disable(true);
    setStatus("Enviando...");

    try {
      const fd = new FormData(form);
      // The hidden "turnstile" input is already in the form.
      const res = await fetch("/api/contato", { method: "POST", body: fd, headers: { "Accept": "application/json" } });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        const msg = (data && data.message) ? data.message : `Erro ao enviar. Código ${res.status}.`;
        alert(msg);
        setStatus("");
      } else {
        form.reset();
        setStatus("Obrigado! Sua solicitação foi enviada.");
        if (window.turnstile && document.getElementById("cf-turnstile")) {
          try { turnstile.reset("#cf-turnstile"); } catch {}
        }
      }
    } catch (err) {
      console.error("submit error", err);
      alert("Erro inesperado ao enviar. Tente novamente.");
      setStatus("");
    } finally {
      disable(false);
    }
  });
})();