import { getCfToken } from '/form.turnstile.js';

const form = document.querySelector('#contato-form');
const status = document.querySelector('#status');

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  status.textContent = "Enviando...";

  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  const cfToken = getCfToken();
  if (!cfToken) {
    status.textContent = "Valide o captcha antes de enviar.";
    return;
  }
  body.cfToken = cfToken;

  try {
    const res = await fetch('/api/contato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      throw new Error(json?.error || 'Falha ao enviar');
    }
    status.textContent = "Mensagem enviada com sucesso!";
    form.reset();
  } catch (err) {
    status.textContent = "Erro: " + (err?.message || err);
  }
});
