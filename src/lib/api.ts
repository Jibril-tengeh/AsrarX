export function getApiUrl(path: string): string {
  // If absolute, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Clean path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // In normal web environment, use window.location.origin if it's not localhost/capacitor
  const origin = window.location.origin;
  const isCapacitorOrLocal = origin.startsWith('capacitor:') || origin.includes('localhost') || origin.includes('127.0.5.') || origin.includes('127.0.0.1');
  
  if (!isCapacitorOrLocal) {
    return `${origin}${cleanPath}`;
  }
  
  // On mobile/Capacitor, look up the stored backend_url from FeatureToggles/localStorage
  const storedUrl = localStorage.getItem('asrarhub_backend_url');
  if (storedUrl) {
    // Remove trailing slash if present
    const base = storedUrl.endsWith('/') ? storedUrl.slice(0, -1) : storedUrl;
    return `${base}${cleanPath}`;
  }
  
  // Final fallback (e.g. if we don't have storedUrl yet)
  return `https://ais-dev-zhlvo3fs5z5wltpspv6eub-789730332353.europe-west2.run.app${cleanPath}`;
}
