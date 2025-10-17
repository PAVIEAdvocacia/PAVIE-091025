// form.turnstile.js
// Render explícito do Cloudflare Turnstile + ponte do token (sem exports ES).
(function () {
  // token compartilhado em window (lido por form.submit.js)
  window.__cfToken = window.__cfToken || "";
  window.getCfToken = window.getCfToken || function () { return window.__cfToken || ""; };

  function onSuccess(token) {
    try { window.__cfToken = token; } catch (_e) {}
    // Opcional: disparar evento para outros scripts ouvirem
    try { document.dispatchEvent(new CustomEvent("cf-token", { detail: token })); } catch (_e) {}
  }

  window.tsOnload = function () {
    try {
      if (!window.turnstile) return;
      var container = document.getElementById("ts-container") || document.querySelector(".cf-turnstile");
      if (!container) return;

      if (!container.__rendered) {
        // ATENÇÃO: o sitekey está fixo aqui para seu domínio (já preenchido).
        window.turnstile.render(container, {
          sitekey: "0x4AAAAAAB6FBS0cTG_7KOYv",
          callback: onSuccess,
        });
        container.__rendered = true;
      }
    } catch (_e) {}
  };

  // Fallback se o onload do script não disparar
  if (document.readyState === "complete" || document.readyState === "interactive") {
    try { window.tsOnload && window.tsOnload(); } catch (_e) {}
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      try { window.tsOnload && window.tsOnload(); } catch (_e) {}
    });
  }
})();
