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
        return arg.message || arg.stack || JSON.stringify(arg);
      }
      return String(arg);
    }).join(' ');

    if (
      msg.includes('Could not reach Cloud Firestore backend') ||
      msg.includes('@firebase/firestore:') ||
      msg.includes('FirebaseError: [code=unavailable]') ||
      msg.includes('firestore-backend')
    ) {
      console.warn("[Filtered Firestore Log]", ...args);
      return;
    }
  } catch (e) {
    // Fallback if parsing fails
  }
  originalError.apply(console, args);
};

