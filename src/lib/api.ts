declare const __APP_URL__: string;

export function getApiUrl(path: string): string {
  // If absolute, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Clean path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const origin = window.location.origin;

  // Detect if we are running in a real mobile/Capacitor container (native/emulator)
  const isNativeMobile = 
    origin.startsWith('capacitor:') || 
    origin.startsWith('file:') || 
    (!!(window as any).Capacitor && !!(window as any).Capacitor.isNativePlatform);

  if (!isNativeMobile) {
    // Standard web browser environment (dev server, preview, or production website)
    // Always use the relative/current origin to avoid cross-origin CORS/SSL issues
    const resolved = `${origin}${cleanPath}`;
    console.log(`[getApiUrl] Web environment detected. Resolving to relative path on current origin: "${resolved}"`);
    return resolved;
  }

  // Native Mobile/Capacitor environment:
  // Since the page is loaded from capacitor:// or file://, we must fetch from a remote backend server.
  const storedUrl = localStorage.getItem('asrarhub_backend_url');
  if (storedUrl) {
    const base = storedUrl.endsWith('/') ? storedUrl.slice(0, -1) : storedUrl;
    const resolved = `${base}${cleanPath}`;
    console.log(`[getApiUrl] Native Mobile: using stored backend URL: "${resolved}"`);
    return resolved;
  }

  try {
    if (typeof __APP_URL__ !== 'undefined' && __APP_URL__) {
      const base = __APP_URL__.endsWith('/') ? __APP_URL__.slice(0, -1) : __APP_URL__;
      const resolved = `${base}${cleanPath}`;
      console.log(`[getApiUrl] Native Mobile: using fallback __APP_URL__: "${resolved}"`);
      return resolved;
    }
  } catch (err) {
    // ignore
  }

  // Final fallback for mobile native if no URL is configured yet
  const fallbackBase = 'https://ais-pre-zhlvo3fs5z5wltpspv6eub-789730332353.europe-west2.run.app';
  const resolved = `${fallbackBase}${cleanPath}`;
  console.log(`[getApiUrl] Native Mobile: final fallback to: "${resolved}"`);
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
        console.error(
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
      console.error(`[HTTP INTERCEPTOR] Network Failure fetching: ${args[0] || 'Unknown'}\nDetails: ${err?.message || err}`);
      throw err;
    }
  };
}
