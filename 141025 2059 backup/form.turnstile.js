// turnstile: render explícito e status de carregamento
window.__tsReady = false;
window.__tsWidgetId = null;

window.tsOnload = function () {
  const el = document.getElementById("ts-container");
  if (!el) return;
  const sitekey = el.getAttribute("data-sitekey");
  window.__tsWidgetId = turnstile.render("#ts-container", {
    sitekey,
    callback: () => { window.__tsReady = true; },
    "error-callback": () => { window.__tsReady = false; },
    "timeout-callback": () => { window.__tsReady = false; }
  });
};
