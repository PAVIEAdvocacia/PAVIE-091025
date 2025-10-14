// /form.submit.js
// Lida com o submit do formulário de contato e mostra feedback ao usuário.
(() => {
  const form = document.getElementById("contato-form") || document.querySelector('form[action="/api/contato"]');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const originalBtnText = btn ? btn.textContent : "Enviar";

  function setBusy(busy) {
    if (!btn) return;
    btn.disabled = !!busy;
    btn.textContent = busy ? "Enviando..." : originalBtnText;
  }

  async function submitHandler(ev) {
    ev.preventDefault();
    setBusy(true);

    try {
      const fd = new FormData(form);

      // NÃO toque no honeypot "company" — deixe vazio.
      // Turnstile: token deve estar em "cf-turnstile-response" ou "turnstile".
      const token = fd.get("cf-turnstile-response") || fd.get("turnstile");
      if (!token) {
        alert("Por favor, confirme o desafio de verificação antes de enviar.");
        return;
      }

      const resp = await fetch("/api/contato", {
        method: "POST",
        body: fd
      });

      const data = await resp.json().catch(() => ({}));

      if (resp.ok && (data.ok || data.sent)) {
        alert("Solicitação enviada com sucesso! Em breve entraremos em contato.");
        form.reset();
        // limpa token do Turnstile, se houver
        try { window.turnstile && turnstile.reset && turnstile.reset(); } catch {}
      } else {
        const msg = (data && (data.message || data.error)) || `Falha HTTP ${resp.status}`;
        alert("Erro ao enviar: " + msg);
      }
    } catch (err) {
      alert("Erro ao enviar: " + (err && err.message ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  form.addEventListener("submit", submitHandler);
})();
