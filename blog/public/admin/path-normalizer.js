(function () {
  const absolutePublicUrlPattern = /^https?:\/\/[^/]+\/(?:blog\/)?(uploads\/.+)$/i;
  const repoPublicPattern = /^(?:\.\/)?(?:blog\/)?public\/(uploads\/.+)$/i;
  const relativeUploadsPattern = /^(?:\.\/)?(uploads\/.+)$/i;
  const legacyBlogPublicUrlPattern = /^\/?(?:blog\/)(uploads\/.+)$/i;
  const nativeInputValueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  const nativeTextareaValueDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  const normalizedDispatchGuard = new WeakSet();
  const reactFiberKeyPrefix = '__reactFiber';
  const chooseSelectedLabelPattern = /escolher selecionado/i;

  function canQueryDescendants(root) {
    return !!root && typeof root.querySelectorAll === 'function';
  }

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

  function collectSelectedFileStateNodes(root) {
    const stateNodes = new Set();
    if (!canQueryDescendants(root)) return stateNodes;

    root.querySelectorAll('*').forEach((element) => {
      for (const key of Object.keys(element)) {
        if (!key.startsWith(reactFiberKeyPrefix)) continue;

        let fiber = element[key];

        while (fiber) {
          const stateNode = fiber.stateNode;
          if (stateNode && stateNode.state && typeof stateNode.state === 'object' && stateNode.state.selectedFile) {
            stateNodes.add(stateNode);
          }

          fiber = fiber.return;
        }
      }
    });

    return stateNodes;
  }

  function normalizeSelectedFileState(root) {
    let didNormalize = false;

    collectSelectedFileStateNodes(root).forEach((stateNode) => {
      const selectedFile = stateNode.state && stateNode.state.selectedFile;
      const normalizedPath = normalizeAdminImagePath(selectedFile && selectedFile.path);

      if (!selectedFile || !normalizedPath || normalizedPath === selectedFile.path) {
        return;
      }

      selectedFile.path = normalizedPath;
      didNormalize = true;
    });

    return didNormalize;
  }

  function isChooseSelectedButton(node) {
    const button = node instanceof Element ? node.closest('button') : null;
    if (!(button instanceof HTMLButtonElement)) return null;
    if (!chooseSelectedLabelPattern.test(button.textContent || '')) return null;
    return button;
  }

  function scanForImagePaths(root) {
    if (!canQueryDescendants(root)) return;

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

  document.addEventListener(
    'click',
    (event) => {
      const chooseButton = isChooseSelectedButton(event.target);
      if (!chooseButton) return;

      const modalRoot = chooseButton.closest('.ReactModalPortal') || document;
      normalizeSelectedFileState(modalRoot);
    },
    true,
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const chooseButton = isChooseSelectedButton(event.target);
      if (!chooseButton) return;

      const modalRoot = chooseButton.closest('.ReactModalPortal') || document;
      normalizeSelectedFileState(modalRoot);
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
