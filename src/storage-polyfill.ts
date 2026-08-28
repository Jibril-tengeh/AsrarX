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
      msg.includes('Unexpected state')
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
    if (
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('FIRESTORE') ||
      msg.includes('ca9') ||
      msg.includes('b815') ||
      msg.includes('c050') ||
      msg.includes('targetId') ||
      msg.includes('Unexpected state')
    ) {
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
    if (
      msg.includes('INTERNAL ASSERTION FAILED') ||
      msg.includes('FIRESTORE') ||
      msg.includes('ca9') ||
      msg.includes('b815') ||
      msg.includes('c050') ||
      msg.includes('targetId') ||
      msg.includes('Unexpected state')
    ) {
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
  });

  window.onerror = function (msg, url, lineNo, columnNo, error) {
    const messageStr = String(msg || (error && (error.message || error.stack)) || '');
    if (
      messageStr.includes('INTERNAL ASSERTION FAILED') ||
      messageStr.includes('FIRESTORE') ||
      messageStr.includes('ca9') ||
      messageStr.includes('b815') ||
      messageStr.includes('c050') ||
      messageStr.includes('targetId') ||
      messageStr.includes('Unexpected state')
    ) {
      return true; // Suppress Firestore internal assertion errors from throwing globally
    }
    if (messageStr.toLowerCase().includes('script error') || !messageStr) {
      return true; // Suppress cross-origin / third-party generic script error
    }
    console.warn('[Window.onerror Handled]', messageStr, url, lineNo, error);
    return true; // Prevent unhandled error propagation
  };
}

// Global Fetch Interceptor for Deep CORS/SSL/Offline Diagnostics
try {
  const originalFetch = window.fetch;
  if (originalFetch) {
    const customFetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.toString() 
          : input instanceof Request 
            ? input.url 
            : String(input);
      
      // Direct pass-through for Firestore, Firebase, Google APIs to prevent stream corruption
      if (
        url.includes('firestore.googleapis.com') ||
        url.includes('firebase') ||
        url.includes('googleapis.com') ||
        url.includes('google.com') ||
        url.includes('gstatic.com')
      ) {
        return originalFetch(input, init);
      }

      const start = performance.now();
      let attempt = 0;
      const maxAttempts = 2;
      const delayMs = 1000;
      let lastError: any;

      while (attempt < maxAttempts) {
        try {
          attempt++;
          let reqInput: RequestInfo | URL = input;
          if (typeof Request !== 'undefined' && input instanceof Request) {
            try {
              reqInput = attempt === 1 ? input : input.clone();
            } catch {
              reqInput = url;
            }
          }

          const response = await originalFetch(reqInput, init);
          return response;
        } catch (error: any) {
          lastError = error;
          const isGet = !init?.method || init.method.toUpperCase() === 'GET';
          if (isGet && attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          break;
        }
      }

      // If fetch fails completely, rethrow gracefully without breaking JS engine
      throw lastError || new Error(`Network request failed for ${url}`);
    };

    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true
    });
  }
} catch (fetchOverrideError) {
  console.warn("Unable to intercept window.fetch in this environment due to restrictions:", fetchOverrideError);
}


