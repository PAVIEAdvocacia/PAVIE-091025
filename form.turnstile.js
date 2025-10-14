// form.turnstile.js — render explícito e status
window.__tsReady = false;
window.__tsWidgetId = null;

window.tsOnload = function () {
  const el = document.getElementById("ts-container");
  if (!el) return;
  const sitekey = el.getAttribute("data-sitekey");
  window.__tsWidgetId = turnstile.render("#ts-container", {
    sitekey,
    callback: () => {
      window.__tsReady = true;
      const s = document.getElementById("formStatus");
      if (s) { s.textContent = "Segurança carregada."; s.className = "text-sm mt-2 text-gray-600"; }
    },
    "error-callback": () => { window.__tsReady = false; },
    "timeout-callback": () => { window.__tsReady = false; }
  });
};
