// form.turnstile.js
// Non-module script to render Cloudflare Turnstile explicitly and expose window.getCfToken()
// Place at site root and include via: <script defer src="/form.turnstile.js"></script>
// Requires the standard Turnstile client script loaded too:
// <script defer src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=tsOnload"></script>

(function(){
  // bridge token stored on window
  window.__cfToken = window.__cfToken || "";
  window.getCfToken = window.getCfToken || function(){ return window.__cfToken || ""; };

  function onTsSuccess(token){
    try { window.__cfToken = token; } catch(e){}
    // dispatch event in case other code listens
    try { document.dispatchEvent(new CustomEvent('cf-token', { detail: token })); } catch(e){}
  }

  // called by Turnstile's onload param
  window.tsOnload = function() {
    try {
      if (window.turnstile) {
        var container = document.getElementById('ts-container') || document.querySelector('.cf-turnstile');
        if (container && !container.__rendered) {
          window.turnstile.render(container, {
            sitekey: container.getAttribute('data-sitekey') || container.dataset.sitekey || "0x4AAAAAAB6FBS0cTG_7KOYv",
            callback: onTsSuccess,
            'expired-callback': function(){ window.__cfToken = ""; }
          });
          container.__rendered = true;
        }
      }
    } catch(e) {}
  };

  // Fallback: try to render after DOM ready if onload didn't run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      try { if (typeof window.tsOnload === 'function') window.tsOnload(); } catch(e){}
    });
  } else {
    try { if (typeof window.tsOnload === 'function') window.tsOnload(); } catch(e){}
  }
})();