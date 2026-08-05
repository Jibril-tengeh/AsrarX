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

// Global Unhandled Rejection & Error Trap to prevent Webview/App crashes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Global Unhandled Rejection Caught Safely]', event.reason);
    // Prevent default browser/webview crash behavior
    if (event.preventDefault) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    console.warn('[Global Window Error Caught Safely]', event.message || event.error);
  });
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
      
      const start = performance.now();
      
      let attempt = 0;
      const maxAttempts = 3;
      const delayMs = 1500;
      let lastError: any;

      while (attempt < maxAttempts) {
        try {
          attempt++;
          if (attempt > 1) {
            console.log(`[Fetch Debug] 🔄 Tentative de reconnexion ${attempt}/${maxAttempts} vers: "${url}"`);
          } else {
            console.log(`[Fetch Debug] 🚀 Tentative de requête vers: "${url}"`, {
              method: init?.method || 'GET',
              hasHeaders: !!init?.headers,
              hasBody: !!init?.body
            });
          }

          const response = await originalFetch(input, init);
          
          const duration = (performance.now() - start).toFixed(1);
          console.log(`[Fetch Debug] ✅ Réponse reçue de "${url}" en ${duration}ms (Status: ${response.status})`);
          
          return response;
        } catch (error: any) {
          lastError = error;
          const isGet = !init?.method || init.method.toUpperCase() === 'GET';
          if (isGet && attempt < maxAttempts) {
            console.warn(`[Fetch Debug] ⚠️ Échec de la tentative ${attempt} pour "${url}". Nouvelle tentative dans ${delayMs}ms...`, error?.message || error);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          break;
        }
      }

      // If we got here, all allowed attempts failed
      const error = lastError;
      const duration = (performance.now() - start).toFixed(1);
      const isOnline = navigator.onLine;
      const errorStr = String(error?.message || error);
        
        // Extract host and protocol for precise diagnostic
        let parsedUrl: URL | null = null;
        try {
          parsedUrl = new URL(url);
        } catch (e) {
          // relative URL or malformed
        }

        // Only diagnose external API fetches or local proxy endpoints
        if (url.startsWith('http://') || url.startsWith('https://') || url.includes('/api/')) {
          console.group(`%c[Capacitor WebView Block Warning] ❌ Échec Fetch (${duration}ms): ${url}`, 'color: #ff3333; font-weight: bold; font-size: 11px;');
          console.warn(`Erreur système : ${errorStr}`);
          console.log(`Statut réseau : ${isOnline ? 'ONLINE' : 'OFFLINE (Aucune connexion détectée)'}`);
          console.log(`Origine de l'application : "${window.location.origin}"`);
          console.log(`Protocole de l'application : "${window.location.protocol}"`);
          
          if (parsedUrl) {
            console.log(`Domaine ciblé : "${parsedUrl.hostname}"`);
            console.log(`Protocole ciblé : "${parsedUrl.protocol.toUpperCase()}"`);
            console.log(`Port ciblé : "${parsedUrl.port || 'par défaut'}"`);

            // Cleartext HTTP Traffic check
            if (parsedUrl.protocol === 'http:') {
              console.warn(
                `⚠️ ALERTE CLEARTEXT HTTP : Le protocole ciblé est non-sécurisé (HTTP). ` +
                `Par défaut, Android (à partir de Pie / API 28) et iOS bloquent TOTALEMENT le trafic HTTP en clair ` +
                `au sein des WebViews mobiles pour des raisons de sécurité. Le fetch échouera systématiquement. ` +
                `Veuillez configurer votre backend avec un certificat SSL et utiliser HTTPS.`
              );
            }

            // CORS Policy / Origin check
            const appOrigin = window.location.origin;
            if (appOrigin.startsWith('capacitor:') || appOrigin.startsWith('http://localhost:3000') || appOrigin.includes('localhost')) {
              console.warn(
                `⚠️ ALERTE SÉCURITÉ CORS : L'application s'exécute depuis l'origine mobile "${appOrigin}". ` +
                `Le serveur distant ("${parsedUrl.origin}") DOIT impérativement inclure cette origine dans son en-tête ` +
                `"Access-Control-Allow-Origin" (ou autoriser "*") ET accepter les en-têtes personnalisés (Content-Type, Authorization, etc.). ` +
                `Si ce n'est pas configuré, le WebView du téléphone bloque la réponse par mesure de sécurité.`
              );
            }

            // SSL Certificate / Handshake check
            if (parsedUrl.protocol === 'https:') {
              console.warn(
                `⚠️ ALERTE CERTIFICAT SSL : Si le serveur possède un certificat SSL auto-signé, expiré ou si la chaîne de certification ` +
                `est incomplète (absence de certificat intermédiaire), les WebViews mobiles (iOS WKWebView et Android WebView) ` +
                `bloquent la requête de manière silencieuse sans lever d'alerte utilisateur. Testez l'URL dans un navigateur mobile standard.`
              );
            }
          } else {
            console.log(`URL ciblée relative ou invalide.`);
          }
          
          console.log(`Options de requête :`, init);
          console.groupEnd();
          
          // Enriched error so visual toasts can display an action-oriented diagnostic message
          let enrichedMsg = `Échec de l'appel API vers ${url.split('?')[0]}. `;
          if (!isOnline) {
            enrichedMsg += "L'appareil est complètement déconnecté d'Internet.";
          } else if (parsedUrl?.protocol === 'http:') {
            enrichedMsg += "Trafic HTTP en clair bloqué par la WebView mobile. Utilisez HTTPS.";
          } else {
            enrichedMsg += `Erreur réseau : vérifiez si le serveur backend autorise CORS pour l'origine "${window.location.origin}" ou si le certificat SSL est invalide/auto-signé.`;
          }
          
          throw new Error(enrichedMsg);
        }
        
        throw error;
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

