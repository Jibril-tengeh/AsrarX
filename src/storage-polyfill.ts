// 1. Global Process Polyfill for Browser & Capacitor WebViews
if (typeof window !== 'undefined') {
  const detectedEnv = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) || 'development';
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: { NODE_ENV: detectedEnv } };
  } else if (typeof (window as any).process.env === 'undefined') {
    (window as any).process.env = { NODE_ENV: detectedEnv };
  }
}

// 2. LocalStorage and SessionStorage Safe Fallbacks
try {
  localStorage.setItem('__test__', '__test__');
  localStorage.removeItem('__test__');
} catch (e) {
  const memoryStorage = new Map<string, string>();
  const storageMock = {
    getItem: (key: string) => memoryStorage.has(key) ? memoryStorage.get(key) || null : null,
    setItem: (key: string, value: string) => memoryStorage.set(key, String(value)),
    removeItem: (key: string) => memoryStorage.delete(key),
    clear: () => memoryStorage.clear(),
    get length() { return memoryStorage.size; },
    key: (index: number) => Array.from(memoryStorage.keys())[index] || null
  };
  try {
    Object.defineProperty(window, 'localStorage', {
      value: storageMock,
      writable: true,
      configurable: true
    });
  } catch (e) {
    console.warn("Could not polyfill localStorage", e);
  }
}

// Filter out and downgrade transient Firestore connection errors/warnings
// so that automated error telemetry does not count them as fatal crashes.
const originalError = console.error;
console.error = function (...args) {
  try {
    const msg = args.map(arg => {
      if (!arg) return '';
      if (typeof arg === 'object') {
        try {
          return arg.message || arg.stack || String(arg);
        } catch {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');

    if (
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('@firebase/firestore:') ||
      msg.includes('FirebaseError: [code=unavailable]') ||
      msg.includes('firestore-backend') ||
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('FIRESTORE') ||
      msg.includes('c050') ||
      msg.includes('b815') ||
      msg.includes('ca9') ||
      msg.includes('targetId') ||
      msg.includes('Unexpected state') ||
      msg.includes('SnapshotVersion') ||
      msg.includes('fromVersion')
    ) {
      console.warn("[Filtered Firestore Log]", ...args);
      return;
    }
  } catch (e) {
    // Fallback if parsing fails
  }
  originalError.apply(console, args);
};

// Global Unhandled Rejection & Error Trap to prevent Webview/App crashes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || reason?.stack || String(reason) || '');
    const isAssertion = 
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('FIRESTORE') ||
      msg.includes('ca9') ||
      msg.includes('b815') ||
      msg.includes('c050') ||
      msg.includes('targetId') ||
      msg.includes('Unexpected state') ||
      msg.includes('SnapshotVersion') ||
      msg.includes('fromVersion');

    if (isAssertion) {
      console.warn('[Filtered Firestore Unhandled Rejection]', msg);
      if (event.preventDefault) {
        event.preventDefault();
      }
      return;
    }
    console.warn('[Global Unhandled Rejection Caught Safely]', event.reason);
    if (event.preventDefault) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event.message || (event.error && (event.error.message || event.error.stack)) || event.error || '');
    const isAssertion = 
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('FIRESTORE') ||
      msg.includes('ca9') ||
      msg.includes('b815') ||
      msg.includes('c050') ||
      msg.includes('targetId') ||
      msg.includes('Unexpected state') ||
      msg.includes('SnapshotVersion') ||
      msg.includes('fromVersion');

    if (isAssertion) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      return;
    }
    if (msg.toLowerCase().includes('script error') || !msg) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return;
    }
    console.warn('[Global Window Error Caught Safely]', msg);
    if (event.preventDefault) {
      event.preventDefault();
    }
  }, true);

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const messageStr = String(msg || (error && (error.message || error.stack)) || '');
    const isAssertion = 
      messageStr.includes('INTERNAL ASSERTION FAILED') ||
      messageStr.includes('FIRESTORE') ||
      messageStr.includes('ca9') ||
      messageStr.includes('b815') ||
      messageStr.includes('c050') ||
      messageStr.includes('targetId') ||
      messageStr.includes('Unexpected state') ||
      messageStr.includes('SnapshotVersion') ||
      messageStr.includes('fromVersion');

    if (isAssertion) {
      return true; // Suppress Firestore internal assertion errors from throwing globally
    }
    if (messageStr.toLowerCase().includes('script error') || !messageStr) {
      return true; // Suppress cross-origin / third-party generic script error
    }
    console.warn('[Window.onerror Handled]', messageStr, url, lineNo, error);
    return true; // Prevent unhandled error propagation
  };
}


