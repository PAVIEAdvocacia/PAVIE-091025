'use strict';

// PAVIE | Advocacia - envio institucional com Turnstile.
(function () {
	function ready(callback) {
		if (document.readyState !== 'loading') {
			callback();
			return;
		}
		document.addEventListener('DOMContentLoaded', callback);
	}

	ready(function () {
		var form = document.getElementById('contatoForm');
		if (!form || form.dataset.enhanced === '1') return;

		form.dataset.enhanced = '1';

		var statusEl = document.getElementById('formStatus');

		function ensureStatus() {
			if (!statusEl) {
				statusEl = document.createElement('p');
				statusEl.id = 'formStatus';
				statusEl.className = 'form-status';
				form.insertBefore(statusEl, form.querySelector('button[type="submit"]'));
			}
			return statusEl;
		}

		function setStatus(message, isError) {
			var status = ensureStatus();
			status.textContent = message;
			status.style.color = isError ? 'crimson' : '';
		}

		function getToken() {
			var hiddenToken = document.getElementById('turnstileToken');
			if (hiddenToken && hiddenToken.value) return hiddenToken.value.trim();

			var turnstileResponse = form.querySelector('input[name="cf-turnstile-response"]');
			if (turnstileResponse && turnstileResponse.value) return turnstileResponse.value.trim();

			return '';
		}

		window.onTsDone = function (token) {
			try {
				var hiddenToken = document.getElementById('turnstileToken');
				if (hiddenToken) hiddenToken.value = token || '';
				setStatus('Validacao de seguranca concluida.', false);
			} catch (_error) {}
		};

		window.onTsExpired = function () {
			setStatus('Validacao expirada. Aguarde o recarregamento do desafio e tente novamente.', true);
		};

		window.onTsError = function () {
			setStatus('Nao foi possivel carregar a validacao de seguranca.', true);
		};

		form.addEventListener('submit', async function (event) {
			event.preventDefault();

			var submitButton = form.querySelector('[type="submit"]');
			var originalLabel = submitButton ? submitButton.textContent : '';
			var token = getToken();

			if (!token) {
				setStatus('A validacao de seguranca ainda nao foi concluida. Aguarde e tente novamente.', true);
				return;
			}

			if (submitButton) {
				submitButton.disabled = true;
				submitButton.textContent = 'Enviando...';
			}

			setStatus('Enviando informacoes iniciais...', false);

			var formData = new FormData(form);
			var payload = {};
			formData.forEach(function (value, key) {
				payload[key] = value;
			});
			payload.turnstileToken = token;

			try {
				var response = await fetch('/api/contato', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify(payload),
					credentials: 'same-origin',
				});

				var data = await response.json().catch(function () {
					return {};
				});

				if (!response.ok || data.ok === false) {
					throw new Error(data.error || 'Falha no envio.');
				}

				setStatus(data.msg || 'Solicitacao enviada. A PAVIE fara a triagem inicial do contato.', false);
				form.reset();

				var hiddenToken = document.getElementById('turnstileToken');
				if (hiddenToken) hiddenToken.value = '';

				if (window.turnstile && typeof window.turnstile.reset === 'function') {
					try {
						window.turnstile.reset();
					} catch (_error) {}
				}
			} catch (error) {
				setStatus(
					'Nao foi possivel enviar: ' + (error && error.message ? error.message : 'erro inesperado'),
					true,
				);
			} finally {
				if (submitButton) {
					submitButton.disabled = false;
					submitButton.textContent = originalLabel;
				}
			}
		});
	});
})();
