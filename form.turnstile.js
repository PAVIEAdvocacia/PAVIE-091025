// turnstile: render explícito e status de carregamento (robusto)
window.__tsReady = false;
window.__tsWidgetId = null;

function __setStatusOk(){
  var s = document.getElementById("formStatus") || document.getElementById("form-status");
  if (s){ s.textContent = "Segurança carregada."; s.className = "text-sm mt-2 text-gray-600"; }
}

window.tsOnload = function () {
  var tries = 0;
  function tryRender(){
    var el = document.getElementById("ts-container");
    if (!el) return;
    var sitekey = el.getAttribute("data-sitekey");
    if (!window.turnstile || typeof window.turnstile.render !== "function"){
      if (tries++ < 20) return setTimeout(tryRender, 250);
      return;
    }
    window.__tsWidgetId = window.turnstile.render("#ts-container", {
      sitekey: sitekey,
      callback: function(){ window.__tsReady = true; __setStatusOk(); },
      "error-callback": function(){ window.__tsReady = false; },
      "timeout-callback": function(){ window.__tsReady = false; }
    });
  }
  tryRender();
};

// fallback caso o onload não dispare por ordem de scripts
document.addEventListener("DOMContentLoaded", function(){
  if (!window.__tsReady && typeof window.tsOnload === "function"){ window.tsOnload(); }
});