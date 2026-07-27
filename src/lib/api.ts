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

// Global request interceptor to inspect mobile/Capacitor WebView HTTP status codes
if (typeof window !== 'undefined' && !(window as any).__FETCH_INTERCEPTOR_MOUNTED__) {
  (window as any).__FETCH_INTERCEPTOR_MOUNTED__ = true;
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const response = await originalFetch(...args);
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      
      // Log non-2xx codes for diagnostic logs (especially 401, 403, 503)
      if (response.status >= 400) {
        console.warn(
          `[HTTP INTERCEPTOR] Status ${response.status} on URL: ${url}\n` +
          `Diagnostic: ${
            response.status === 401 ? "401 Non autorisé (Utilisateur non connecté ou session expirée)" :
            response.status === 403 ? "403 Accès interdit (Vérifiez les autorisations CORS ou restrictions réseau IP)" :
            response.status === 503 ? "503 Service indisponible (Le backend est en cours de maintenance ou surchargé)" :
            `Code HTTP d'erreur ${response.status}`
          }`
        );
      }
      return response;
    } catch (err: any) {
      console.warn(`[HTTP INTERCEPTOR] Network Failure fetching: ${args[0] || 'Unknown'}\nDetails: ${err?.message || err}`);
      throw err;
    }
  };
}
