/**
 * Callbacks para o Turnstile.
 * Mantém o botão desativado até o token ser emitido.
 */
window.turnstileReady = function () {
  const btn = document.getElementById('btnEnviar');
  if (btn) btn.disabled = false;
};

window.turnstileExpired = function () {
  const btn = document.getElementById('btnEnviar');
  if (btn) btn.disabled = true;
};
