declare const __APP_URL__: string;

export function getApiUrl(path: string): string {
  // If absolute, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Clean path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const origin = window.location.origin;

  // For static local assets (non-API endpoints like .json files),
  // always resolve them relative to the current local origin (webview or browser).
  // This keeps fetches local/offline-first and avoids CORS errors.
  if (!cleanPath.startsWith('/api/')) {
    return `${origin}${cleanPath}`;
  }

  // Detect if we are running in a real mobile/Capacitor container (native/emulator)
  // Note: Capacitor.isNativePlatform is a function: Capacitor.isNativePlatform()
  const isCapacitorNative = 
    typeof window !== 'undefined' &&
    !!(window as any).Capacitor &&
    typeof (window as any).Capacitor.isNativePlatform === 'function' &&
    (window as any).Capacitor.isNativePlatform();

  const isNativeScheme = origin.startsWith('capacitor:') || origin.startsWith('file:');

  if (isCapacitorNative || isNativeScheme) {
    // Native Mobile/Capacitor environment:
    // Since the page is loaded from capacitor:// or file:// or local webview, we fetch from remote backend.
    const storedUrl = localStorage.getItem('asrarhub_backend_url');
    if (storedUrl && (storedUrl.startsWith('http://') || storedUrl.startsWith('https://'))) {
      const base = storedUrl.endsWith('/') ? storedUrl.slice(0, -1) : storedUrl;
      const resolved = `${base}${cleanPath}`;
      console.log(`[getApiUrl] Native Mobile: using stored backend URL: "${resolved}"`);
      return resolved;
    }

    try {
      if (typeof __APP_URL__ !== 'undefined' && __APP_URL__ && (__APP_URL__.startsWith('http://') || __APP_URL__.startsWith('https://'))) {
        const base = __APP_URL__.endsWith('/') ? __APP_URL__.slice(0, -1) : __APP_URL__;
        const resolved = `${base}${cleanPath}`;
        console.log(`[getApiUrl] Native Mobile: using fallback __APP_URL__: "${resolved}"`);
        return resolved;
      }
    } catch (err) {
      // ignore
    }
  }

  // Standard web execution (development, preview, production web app):
  // Always use current origin for /api/ routes to avoid CORS / cross-origin errors.
  const resolved = `${origin}${cleanPath}`;
  return resolved;
}
