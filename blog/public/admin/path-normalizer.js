(function () {
  const absolutePublicUrlPattern = /^https?:\/\/[^/]+\/(?:blog\/)?(uploads\/.+)$/i;
  const repoPublicPattern = /^(?:\.\/)?(?:blog\/)?public\/(uploads\/.+)$/i;
  const relativeUploadsPattern = /^(?:\.\/)?(uploads\/.+)$/i;
  const legacyBlogPublicUrlPattern = /^\/?(?:blog\/)(uploads\/.+)$/i;
  const nativeInputValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  const nativeTextareaValueDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  const normalizedDispatchGuard = new WeakSet();

  function normalizeAdminImagePath(rawValue) {
    if (typeof rawValue !== 'string') return null;

    const value = rawValue.trim().replace(/\\/g, '/');
    if (!value) return null;
    if (value.startsWith('/uploads/')) return value;

    const absoluteMatch = value.match(absolutePublicUrlPattern);
    if (absoluteMatch) {
      return `/${absoluteMatch[1]}`;
    }

    const legacyBlogUrlMatch = value.match(legacyBlogPublicUrlPattern);
    if (legacyBlogUrlMatch) {
      return `/${legacyBlogUrlMatch[1]}`;
    }

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
    const descriptor = element instanceof HTMLTextAreaElement ? nativeTextareaValueDescriptor : nativeInputValueDescriptor;

    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(element, nextValue);
      return;
    }

    element.value = nextValue;
  }

  function dispatchNormalizedEvents(element) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;
    if (normalizedDispatchGuard.has(element)) return;

    normalizedDispatchGuard.add(element);

    queueMicrotask(() => {
      try {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } finally {
        normalizedDispatchGuard.delete(element);
      }
    });
  }

  function normalizeFieldValue(element) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) return;

    const currentValue = element.value;
    const normalizedValue = normalizeAdminImagePath(currentValue);
    if (!normalizedValue || normalizedValue === currentValue) return;

    setElementValue(element, normalizedValue);
    dispatchNormalizedEvents(element);
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

  function patchValueSetter(ctor) {
    const prototype = ctor && ctor.prototype;
    if (!prototype) return;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    if (!descriptor || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') return;
    if (descriptor.set.__pavieImagePathPatched) return;

    const patchedSetter = function (nextValue) {
      const normalizedValue = normalizeAdminImagePath(nextValue);
      const finalValue = normalizedValue ?? nextValue;

      descriptor.set.call(this, finalValue);

      if (normalizedValue && normalizedValue !== nextValue) {
        dispatchNormalizedEvents(this);
      }
    };

    Object.defineProperty(patchedSetter, '__pavieImagePathPatched', {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    });

    Object.defineProperty(prototype, 'value', {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set: patchedSetter,
    });
  }

  patchValueSetter(HTMLInputElement);
  patchValueSetter(HTMLTextAreaElement);

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
