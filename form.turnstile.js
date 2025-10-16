let token = null;
window.onTurnstileSuccess = (t) => {
  token = t;
  document.dispatchEvent(new CustomEvent("cf-token", { detail: token }));
};
export const getCfToken = () => token;
