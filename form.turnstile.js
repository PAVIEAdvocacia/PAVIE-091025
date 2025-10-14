
// Turnstile robusto: não depende de onload=tsOnload
(function () {
  var tries = 0, MAX = 80; // ~40s em 500ms
  window.__tsReady = false;
  window.__tsWidgetId = null;

  function setStatus(msg) {
    var s = document.getElementById("formStatus") || document.getElementById("form-status");
    if (s) { s.textContent = msg; s.className = "text-sm mt-2 text-gray-600"; }
  }

  function render() {
    try {
      var el = document.getElementById("ts-container");
      if (!el) return false;
      if (!window.turnstile || typeof window.turnstile.render !== "function") return false;
      var sitekey = el.getAttribute("data-sitekey");
      window.__tsWidgetId = window.turnstile.render("#ts-container", {
        sitekey: sitekey,
        callback: function() { window.__tsReady = true; setStatus("Segurança carregada."); },
        "error-callback": function() { window.__tsReady = false; },
        "timeout-callback": function() { window.__tsReady = false; }
      });
      return true;
    } catch (e) {
      console.error("Turnstile render error:", e);
      return false;
    }
  }

  function loop() {
    if (render()) return;
    if (++tries < MAX) setTimeout(loop, 500);
    else console.warn("Turnstile não pôde ser renderizado (timeout).");
  }

  // Inicia o polling assim que este script carrega
  loop();

  // E também ao DOM pronto
  document.addEventListener("DOMContentLoaded", loop);
})();
