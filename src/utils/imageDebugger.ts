/**
 * Image Diagnostic & Debugger System
 * Intercepts image errors, analyzes CORS / HTTP statuses, and validates Firebase Storage URLs.
 */

export interface ImageErrorEvent {
  id: string;
  articleId?: string;
  articleTitle?: string;
  src: string;
  timestamp: number;
  status?: number; // HTTP Status code (200, 403, 404, etc.)
  statusText?: string;
  isCorsError?: boolean;
  isFirebaseStorage?: boolean;
  isBase64?: boolean;
  isCapacitorWebView?: boolean;
  suggestedCause?: string;
}

export interface ImageValidationResult {
  articleId: string;
  articleTitle: string;
  url: string;
  status: 'valid' | 'broken' | 'forbidden' | 'cors_issue' | 'invalid_url';
  httpCode?: number;
  details: string;
  isFirebaseStorage: boolean;
}

type ImageErrorListener = (event: ImageErrorEvent) => void;
const listeners: Set<ImageErrorListener> = new Set();
const recentImageErrors: ImageErrorEvent[] = [];

/**
 * Register a listener for image load errors
 */
export const subscribeToImageErrors = (listener: ImageErrorListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getRecentImageErrors = (): ImageErrorEvent[] => [...recentImageErrors];

export const clearImageErrors = (): void => {
  recentImageErrors.length = 0;
};

/**
 * Detects if app is executing in a Capacitor or webview environment
 */
export const isCapacitorEnv = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    !!(window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost'
  );
};

/**
 * Perform a deep network diagnostic on an image URL
 */
export const analyzeImageUrl = async (
  src: string,
  articleInfo?: { id?: string; title?: string }
): Promise<ImageErrorEvent> => {
  const isBase64 = src.startsWith('data:');
  const isFirebaseStorage = src.includes('firebasestorage.googleapis.com');
  const inCapacitor = isCapacitorEnv();

  const errorEvent: ImageErrorEvent = {
    id: `img_err_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    articleId: articleInfo?.id,
    articleTitle: articleInfo?.title,
    src,
    timestamp: Date.now(),
    isBase64,
    isFirebaseStorage,
    isCapacitorWebView: inCapacitor,
  };

  if (!src || src.trim() === '') {
    errorEvent.suggestedCause = 'URL de la vignette vide ou indéfinie.';
    errorEvent.status = 0;
    return errorEvent;
  }

  if (isBase64) {
    errorEvent.suggestedCause = 'Chaîne Base64 corrompue ou tronquée lors de la sauvegarde.';
    errorEvent.status = 400;
    return errorEvent;
  }

  // Attempt HEAD or GET fetch to inspect HTTP status and CORS headers
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(src, {
      method: 'HEAD',
      mode: 'cors',
      signal: controller.signal,
    }).catch(async () => {
      // Retry with GET if HEAD is method-not-allowed
      return await fetch(src, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    errorEvent.status = response.status;
    errorEvent.statusText = response.statusText;

    if (response.status === 200) {
      errorEvent.suggestedCause = 'L\'image a répondu HTTP 200 mais l\'élément <img> n\'a pas pu la décoder.';
    } else if (response.status === 403) {
      errorEvent.isCorsError = true;
      errorEvent.suggestedCause = isFirebaseStorage
        ? 'Accès refusé Firebase Storage (403) : Le jeton de sécurité de l\'URL a expiré ou les règles d\'accès refusent la lecture.'
        : 'Accès refusé (403) : Le serveur hébergeant l\'image bloque les requêtes externes.';
    } else if (response.status === 404) {
      errorEvent.suggestedCause = 'Image introuvable (404) : Le fichier a été supprimé ou l\'URL est incorrecte.';
    } else {
      errorEvent.suggestedCause = `Erreur HTTP ${response.status} : ${response.statusText || 'Erreur serveur'}`;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      errorEvent.suggestedCause = 'Délai d\'attente dépassé (Timeout > 6s) lors du chargement de l\'image.';
      errorEvent.status = 408;
    } else {
      errorEvent.isCorsError = true;
      errorEvent.suggestedCause = inCapacitor
        ? 'Blocage CORS / WebView : L\'origine de l\'application (Capacitor/Localhost) est rejetée par les headers CORS du serveur d\'image.'
        : 'Erreur Réseau / CORS : Impossible d\'accéder à l\'URL d\'image (Cross-Origin bloque ou pas de connexion).';
      errorEvent.status = 0;
    }
  }

  return errorEvent;
};

/**
 * Report an image load failure across the application
 */
export const reportImageError = async (
  src: string,
  articleInfo?: { id?: string; title?: string }
): Promise<ImageErrorEvent> => {
  // Avoid duplicate error logging for identical URL within 5 seconds
  const existing = recentImageErrors.find(
    (e) => e.src === src && Date.now() - e.timestamp < 5000
  );
  if (existing) return existing;

  console.warn(`[ImageDebugger] Intercepted image error for: ${src}`);

  const analyzed = await analyzeImageUrl(src, articleInfo);

  recentImageErrors.unshift(analyzed);
  if (recentImageErrors.length > 50) {
    recentImageErrors.pop();
  }

  // Notify active UI subscribers
  listeners.forEach((listener) => {
    try {
      listener(analyzed);
    } catch (e) {
      console.error('[ImageDebugger] Error in error listener:', e);
    }
  });

  return analyzed;
};

/**
 * Network diagnostic utility specifically checking Firebase Storage CORS and headers
 */
export const runImageCorsDiagnostic = async (testUrl?: string) => {
  const urlToTest =
    testUrl ||
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop';

  const inCapacitor = isCapacitorEnv();
  const startTime = performance.now();

  try {
    const res = await fetch(urlToTest, { method: 'GET', mode: 'cors' });
    const durationMs = Math.round(performance.now() - startTime);

    const corsHeader = res.headers.get('access-control-allow-origin');
    const contentType = res.headers.get('content-type');

    return {
      success: res.ok,
      status: res.status,
      statusText: res.statusText,
      durationMs,
      contentType,
      corsHeader,
      isCapacitorEnv: inCapacitor,
      hasCorsHeader: !!corsHeader,
      recommendation: res.ok
        ? 'Les en-têtes CORS et l\'accès à l\'image fonctionnent correctement.'
        : 'Avertissement : La réponse HTTP signale un problème de permission ou de ressource.',
    };
  } catch (err: any) {
    return {
      success: false,
      status: 0,
      statusText: err.message || 'CORS or Network Error',
      durationMs: Math.round(performance.now() - startTime),
      isCapacitorEnv: inCapacitor,
      hasCorsHeader: false,
      recommendation:
        'Erreur CORS ou Réseau détectée. Si vous utilisez Firebase Storage, vous devez configurer la politique CORS via `gsutil cors set cors.json gs://votre-bucket`.',
    };
  }
};

/**
 * Validate thumbnail URLs for a collection of articles (e.g. stored in Firestore)
 */
export const verifyArticleImageUrls = async (
  articles: Array<{ id: string; title: string; thumbnail?: string; imageUrl?: string }>
): Promise<ImageValidationResult[]> => {
  const results: ImageValidationResult[] = [];

  for (const art of articles) {
    const rawUrl = art.imageUrl || art.thumbnail || '';
    const isFirebaseStorage = rawUrl.includes('firebasestorage.googleapis.com');

    if (!rawUrl || !rawUrl.trim()) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: '',
        status: 'invalid_url',
        details: 'Aucune URL de vignette spécifiée.',
        isFirebaseStorage,
      });
      continue;
    }

    if (rawUrl.startsWith('data:')) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: 'data:image/... (Base64)',
        status: 'valid',
        details: 'Image encodée localement en Base64.',
        isFirebaseStorage: false,
      });
      continue;
    }

    const analyzed = await analyzeImageUrl(rawUrl, { id: art.id, title: art.title });

    if (analyzed.status === 200) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: rawUrl,
        status: 'valid',
        httpCode: 200,
        details: 'L\'image est accessible et répond normalement (HTTP 200).',
        isFirebaseStorage,
      });
    } else if (analyzed.status === 403) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: rawUrl,
        status: 'forbidden',
        httpCode: 403,
        details: isFirebaseStorage
          ? 'Firebase Storage HTTP 403 (Token expiré ou règles Firestore/Storage trop restrictives).'
          : 'Serveur HTTP 403 Access Denied.',
        isFirebaseStorage,
      });
    } else if (analyzed.status === 404) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: rawUrl,
        status: 'broken',
        httpCode: 404,
        details: 'L\'image est introuvable (HTTP 404).',
        isFirebaseStorage,
      });
    } else if (analyzed.isCorsError) {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: rawUrl,
        status: 'cors_issue',
        httpCode: 0,
        details: 'Rejeté par les règles CORS du serveur hébergeur ou WebView Capacitor.',
        isFirebaseStorage,
      });
    } else {
      results.push({
        articleId: art.id,
        articleTitle: art.title || 'Sans titre',
        url: rawUrl,
        status: 'broken',
        httpCode: analyzed.status || 0,
        details: analyzed.suggestedCause || 'Erreur indéterminée lors du chargement.',
        isFirebaseStorage,
      });
    }
  }

  return results;
};
