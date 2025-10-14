/**
 * Turnstile wiring for the contact form.
 * Renders a managed widget and stores the token in a hidden input named "turnstile".
 */
(function () {
  const widget = document.getElementById("cf-turnstile");
  if (!widget) return;

  // Ensure hidden input exists
  let hidden = document.querySelector('input[name="turnstile"]');
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "turnstile";
    widget.appendChild(hidden);
  }

  window.TURNSTILE_READY = false;
  window.onTurnstileSuccess = function (token) {
    hidden.value = token || "";
    window.TURNSTILE_READY = !!token;
    document.dispatchEvent(new CustomEvent("turnstile-ready"));
  };
  window.onTurnstileExpire = function () {
    hidden.value = "";
    window.TURNSTILE_READY = false;
  };
})();