// Callbacks compartilhados para o Turnstile.
(function () {
	window.onTsDone = function (token) {
		var field = document.getElementById('turnstileToken');
		if (field) field.value = token || '';
	};

	window.onTsExpired = function () {
		var field = document.getElementById('turnstileToken');
		if (field) field.value = '';
	};

	window.onTsError = function () {
		var field = document.getElementById('turnstileToken');
		if (field) field.value = '';
	};
})();
