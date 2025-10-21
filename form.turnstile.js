// form.turnstile.js — callbacks e garantia de token no hidden
(function(){
  window.onTsDone = function(token){
    var el = document.getElementById('turnstileToken');
    if(el) el.value = token || '';
  };
  window.onTsExpired = function(){ var el = document.getElementById('turnstileToken'); if(el) el.value=''; };
  window.onTsError   = function(){ var el = document.getElementById('turnstileToken'); if(el) el.value=''; };
})();