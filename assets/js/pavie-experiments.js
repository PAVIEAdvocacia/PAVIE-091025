'use strict';

(function () {
	var STORAGE_KEY = 'pavieExperiments';
	var VALID_EXPERIMENTS = [
		's1-hero-quiet',
		's3-form-reduced',
		'b3-cta-tonal-band',
		'b3-author-compact',
		'r1-footer-accent-soft',
	];

	function unique(list) {
		var seen = Object.create(null);
		return list.filter(function (item) {
			if (!item || seen[item]) return false;
			seen[item] = true;
			return true;
		});
	}

	function sanitize(list) {
		return unique(
			list.filter(function (item) {
				return VALID_EXPERIMENTS.indexOf(item) !== -1;
			}),
		);
	}

	function parseQuery(search) {
		var params = new URLSearchParams(search || '');
		if (!params.has('exp')) return null;

		var values = [];
		params.getAll('exp').forEach(function (chunk) {
			String(chunk || '')
				.split(',')
				.forEach(function (item) {
					var value = item.trim();
					if (value) values.push(value);
				});
		});

		if (
			values.some(function (item) {
				return item === 'off' || item === 'clear' || item === 'base';
			})
		) {
			return [];
		}

		return sanitize(values);
	}

	function readStored() {
		try {
			var raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			var parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) return [];
			return sanitize(
				parsed.map(function (item) {
					return String(item || '').trim();
				}),
			);
		} catch (_error) {
			return [];
		}
	}

	function writeStored(list) {
		try {
			if (!list.length) {
				window.localStorage.removeItem(STORAGE_KEY);
				return;
			}
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
		} catch (_error) {}
	}

	function applyExperiments(list) {
		var root = document.documentElement;
		var body = document.body;
		if (!root || !body) return;

		VALID_EXPERIMENTS.forEach(function (key) {
			root.classList.remove('exp-' + key);
			body.classList.remove('exp-' + key);
		});

		root.classList.toggle('has-pavie-experiments', list.length > 0);
		body.classList.toggle('has-pavie-experiments', list.length > 0);

		list.forEach(function (key) {
			root.classList.add('exp-' + key);
			body.classList.add('exp-' + key);
		});

		var label = list.length ? list.join(',') : 'base';
		root.setAttribute('data-pavie-experiments', label);
		body.setAttribute('data-pavie-experiments', label);

		document.querySelectorAll('[data-experiment-key]').forEach(function (node) {
			var key = node.getAttribute('data-experiment-key') || '';
			var baseVariant = node.getAttribute('data-base-variant') || 'standard';
			var active = key && list.indexOf(key) !== -1;
			node.setAttribute('data-experiment-state', active ? 'test' : 'base');
			node.setAttribute('data-experiment-variant', active ? key : baseVariant);
		});
	}

	function setExperiments(list) {
		var sanitized = sanitize(list);
		writeStored(sanitized);
		applyExperiments(sanitized);
		return sanitized;
	}

	function init() {
		var fromQuery = parseQuery(window.location.search);
		var active = fromQuery === null ? readStored() : fromQuery;
		if (fromQuery !== null) {
			writeStored(active);
		}
		applyExperiments(active);

		window.PAVIE_EXPERIMENTS = {
			active: active.slice(),
			allowed: VALID_EXPERIMENTS.slice(),
			set: function (list) {
				this.active = setExperiments(Array.isArray(list) ? list : []);
				return this.active.slice();
			},
			clear: function () {
				this.active = setExperiments([]);
				return [];
			},
		};
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
		return;
	}

	init();
})();
