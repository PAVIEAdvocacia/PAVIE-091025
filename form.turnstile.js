let token = null;
window.onTurnstileSuccess = (t) => {
  token = t;
  document.dispatchEvent(new CustomEvent("cf-token", { detail: token }));
};
export const getCfToken = () => token;


// Exposição global opcional (bridge) para integração com form.submit.js
try {
  if (typeof window !== "undefined" && typeof window.getCfToken !== "function") {
    window.getCfToken = getCfToken;
  }
} catch (_e) {}
