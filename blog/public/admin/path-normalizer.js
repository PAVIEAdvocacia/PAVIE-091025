(function () {
  const repoPublicPattern = /^(?:\.\/)?(?:blog\/)?public\/(uploads\/.+)$/i;
  const relativeUploadsPattern = /^(?:\.\/)?(uploads\/.+)$/i;

  function normalizeAdminImagePath(rawValue) {
    if (typeof rawValue !== 'string') return null;

    const value = rawValue.trim().replace(/\\/g, '/');
    if (!value) return null;
    if (value.startsWith('/uploads/')) return value;

    const repoMatch = value.match(repoPublicPattern);
    if (repoMatch) {
      return `/${repoMatch[1]}`;
    }

    const relativeMatch = value.match(relativeUploadsPattern);
    if (relativeMatch) {
      return `/${relativeMatch[1]}`;
    }

    return null;
  }

  function setElementValue(element, nextValue) {
    const prototype =
      element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');

    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(element, nextValue);
      return;
    }

    element.value = nextValue;
  }

  function normalizeFieldValue(element) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;

    const currentValue = element.value;
    const normalizedValue = normalizeAdminImagePath(currentValue);
    if (!normalizedValue || normalizedValue === currentValue) return;

    setElementValue(element, normalizedValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function scanForImagePaths(root) {
    if (!(root instanceof ParentNode)) return;

    root.querySelectorAll('input, textarea').forEach((element) => {
      normalizeFieldValue(element);
    });
  }

  document.addEventListener(
    'input',
    (event) => {
      normalizeFieldValue(event.target);
    },
    true,
  );

  document.addEventListener(
    'change',
    (event) => {
      normalizeFieldValue(event.target);
    },
    true,
  );

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches('input, textarea')) {
          normalizeFieldValue(node);
        }

        scanForImagePaths(node);
      }
    }
  });

  if (document.body) {
    scanForImagePaths(document.body);
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        scanForImagePaths(document.body);
        observer.observe(document.body, { childList: true, subtree: true });
      },
      { once: true },
    );
  }
})();
