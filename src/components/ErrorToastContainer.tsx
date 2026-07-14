import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ChevronDown, ChevronUp, RefreshCw, Wifi, WifiOff, Globe, Database, HelpCircle } from 'lucide-react';
import { getApiUrl } from '../lib/api';
import { triggerBackgroundReconnect, addNetworkLog } from '../utils/networkLogger';

interface LoggedError {
  id: string;
  message: string;
  type: 'error' | 'rejection' | 'console' | 'firebase-conn' | 'firebase-perm' | 'ssl-error';
  timestamp: Date;
  details?: string;
}

export const ErrorToastContainer: React.FC = () => {
  const [errors, setErrors] = useState<LoggedError[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagStatus, setDiagStatus] = useState<'idle' | 'testing' | 'success' | 'cors_ssl_error' | 'offline'>('idle');
  const [diagLogs, setDiagLogs] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Helper to identify specific Firebase/Firestore connection, permission, or SSL issues
    const checkFirebaseError = (msg: string): 'firebase-conn' | 'firebase-perm' | 'ssl-error' | null => {
      if (!msg) return null;
      const lowercaseMsg = msg.toLowerCase();
      if (
        lowercaseMsg.includes('sslhandshake') ||
        lowercaseMsg.includes('ssl handshake') ||
        lowercaseMsg.includes('cert_has_expired') ||
        lowercaseMsg.includes('certificate') ||
        lowercaseMsg.includes('sslhandshakeexception') ||
        lowercaseMsg.includes('connection closed') && lowercaseMsg.includes('ssl')
      ) {
        return 'ssl-error';
      }
      if (
        lowercaseMsg.includes('could not reach cloud firestore backend') ||
        lowercaseMsg.includes('code=unavailable') ||
        lowercaseMsg.includes('firestore-backend') ||
        lowercaseMsg.includes('unavailable')
      ) {
        return 'firebase-conn';
      }
      if (
        lowercaseMsg.includes('permission-denied') ||
        lowercaseMsg.includes('missing or insufficient permissions') ||
        lowercaseMsg.includes('permission_denied')
      ) {
        return 'firebase-perm';
      }
      return null;
    };

    // Intercept standard errors
    const handleErrorEvent = (event: ErrorEvent) => {
      // Avoid spamming benign/internal vite websocket or extension errors
      const lowerMsg = (event.message || '').toLowerCase();
      if (
        lowerMsg.includes('websocket') || 
        lowerMsg.includes('extension') ||
        lowerMsg.includes('hmr') ||
        lowerMsg.includes('vite')
      ) return;

      const fbType = checkFirebaseError(event.message || '');
      
      if (fbType === 'firebase-conn') {
        triggerBackgroundReconnect();
        addNetworkLog('error', 'firestore', 'Connexion Firestore perdue ou impossible (Détecté par l\'intercepteur). Déclenchement de la reconnexion automatique...', event.message || '');
      } else if (fbType === 'ssl-error') {
        addNetworkLog('error', 'ssl_cors', 'Erreur de connexion sécurisée (SSL) interceptée.', event.message || '');
      }
      
      const newErr: LoggedError = {
        id: fbType ? `fb-${fbType}-${Date.now()}` : `err-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message: fbType === 'firebase-conn' 
          ? "Connexion Firestore impossible. L'application utilise les données locales persistées de manière fluide." 
          : fbType === 'firebase-perm' 
            ? "Accès refusé par le serveur de sécurité. Vos droits d'accès ou votre session ont expiré."
            : fbType === 'ssl-error'
              ? "Erreur de connexion sécurisée (SSL). Veuillez vérifier que la date/heure de votre téléphone est correcte, ou utilisez une autre connexion réseau."
              : event.message || "Erreur d'exécution inattendue",
        type: fbType || 'error',
        timestamp: new Date(),
        details: event.error ? String(event.error.stack || event.error) : `Fichier: ${event.filename}:${event.lineno}:${event.colno}`,
      };
      setErrors(prev => {
        // Prevent duplicate firebase connection warning blocks to keep UI clean
        if (fbType && prev.some(e => e.type === fbType)) return prev;
        return [newErr, ...prev].slice(0, 5);
      });
    };

    // Intercept unhandled promise rejections (very common in failed fetches)
    const handleRejectionEvent = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      let msg = "Une promesse a été rejetée sans gestionnaire d'erreur";
      let details = "";

      if (reason) {
        if (typeof reason === 'string') {
          msg = reason;
        } else if (reason.message) {
          msg = reason.message;
          details = reason.stack || String(reason);
        } else {
          msg = JSON.stringify(reason);
        }
      }

      // Avoid noise
      const lowerMsg = msg.toLowerCase();
      if (
        lowerMsg.includes('websocket') || 
        lowerMsg.includes('hmr') ||
        lowerMsg.includes('vite')
      ) return;

      const fbType = checkFirebaseError(msg);

      if (fbType === 'firebase-conn') {
        triggerBackgroundReconnect();
        addNetworkLog('error', 'firestore', 'Connexion Firestore perdue ou impossible (Détecté par rejet de promesse). Déclenchement de la reconnexion automatique...', msg);
      } else if (fbType === 'ssl-error') {
        addNetworkLog('error', 'ssl_cors', 'Erreur de connexion sécurisée (SSL) interceptée par rejet de promesse.', msg);
      }

      const newErr: LoggedError = {
        id: fbType ? `fb-${fbType}-${Date.now()}` : `rej-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message: fbType === 'firebase-conn' 
          ? "Connexion Firestore impossible. L'application utilise les données locales persistées de manière fluide." 
          : fbType === 'firebase-perm' 
            ? "Accès refusé par le serveur de sécurité. Vos droits d'accès ou votre session ont expiré."
            : fbType === 'ssl-error'
              ? "Erreur de connexion sécurisée (SSL). Veuillez vérifier que la date/heure de votre téléphone est correcte, ou utilisez une autre connexion réseau."
              : msg,
        type: fbType || 'rejection',
        timestamp: new Date(),
        details: details || "Rejet de promesse asynchrone (ex: fetch échoué)",
      };
      setErrors(prev => {
        if (fbType && prev.some(e => e.type === fbType)) return prev;
        return [newErr, ...prev].slice(0, 5);
      });
    };

    // Override console.error
    const originalConsoleError = console.error;
    console.error = function (...args: any[]) {
      // Call original so it still shows in dev tools
      originalConsoleError.apply(console, args);

      const message = args
        .map(arg => {
          if (arg instanceof Error) return arg.message;
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      const lowerMessage = message.toLowerCase();
      // Suppress noisy third party or development warnings
      if (
        lowerMessage.includes('mismatched anonymous define') || 
        lowerMessage.includes('websocket') || 
        lowerMessage.includes('hmr') || 
        lowerMessage.includes('lucide') ||
        lowerMessage.includes('google maps') ||
        lowerMessage.includes('vite')
      ) {
        return;
      }

      const fbType = checkFirebaseError(message);

      if (fbType === 'firebase-conn') {
        triggerBackgroundReconnect();
        addNetworkLog('error', 'firestore', 'Connexion Firestore perdue ou impossible (Détecté via console.error). Déclenchement de la reconnexion automatique...', message);
      } else if (fbType === 'ssl-error') {
        addNetworkLog('error', 'ssl_cors', 'Erreur de connexion sécurisée (SSL) interceptée via console.error.', message);
      }

      const newErr: LoggedError = {
        id: fbType ? `fb-${fbType}-${Date.now()}` : `console-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message: fbType === 'firebase-conn'
          ? "Connexion Firestore impossible. L'application utilise les données locales persistées de manière fluide."
          : fbType === 'firebase-perm'
            ? "Accès refusé par le serveur de sécurité. Vos droits d'accès ou votre session ont expiré."
            : fbType === 'ssl-error'
              ? "Erreur de connexion sécurisée (SSL). Veuillez vérifier que la date/heure de votre téléphone est correcte, ou utilisez une autre connexion réseau."
              : (message.length > 150 ? message.substring(0, 150) + "..." : message),
        type: fbType || 'console',
        timestamp: new Date(),
        details: args.map(a => (a instanceof Error ? a.stack : String(a))).join('\n'),
      };
      
      setErrors(prev => {
        if (fbType && prev.some(e => e.type === fbType)) return prev;
        return [newErr, ...prev].slice(0, 5);
      });
    };

    window.addEventListener('error', handleErrorEvent);
    window.addEventListener('unhandledrejection', handleRejectionEvent);

    return () => {
      window.removeEventListener('error', handleErrorEvent);
      window.removeEventListener('unhandledrejection', handleRejectionEvent);
      console.error = originalConsoleError;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(e => e.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const runDiagnostics = async () => {
    setDiagStatus('testing');
    const logs: string[] = [];
    const addLog = (text: string) => logs.push(`[${new Date().toLocaleTimeString()}] ${text}`);

    addLog("Démarrage du test de diagnostic...");
    addLog(`Statut navigateur en ligne : ${navigator.onLine ? "OUI" : "NON"}`);
    
    if (!navigator.onLine) {
      addLog("Erreur: Votre appareil se déclare déconnecté d'Internet.");
      setDiagLogs(logs);
      setDiagStatus('offline');
      return;
    }

    const testEndpoint = getApiUrl('/api/health');
    addLog(`Résolution de l'URL cible de l'API : "${testEndpoint}"`);

    // Extract hostname to check secure origin
    try {
      const urlObj = new URL(testEndpoint);
      addLog(`Hôte cible : ${urlObj.hostname}`);
      addLog(`Protocole : ${urlObj.protocol}`);
      
      if (urlObj.protocol !== 'https:' && !urlObj.hostname.includes('localhost') && !urlObj.hostname.includes('127.0.0.1')) {
        addLog("Avertissement: Vous utilisez une connexion non sécurisée HTTP. Les WebViews mobiles bloquent souvent le trafic non-HTTPS par défaut (Cleartext HTTP restriction).");
      }
    } catch {
      addLog("Erreur: Impossible de parser l'URL de l'API.");
    }

    try {
      addLog("Lancement de la requête fetch vers /api/health...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(testEndpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });

      clearTimeout(timeoutId);
      addLog(`Réponse du serveur reçue. Code statut : ${res.status} ${res.statusText}`);

      if (res.ok) {
        const json = await res.json();
        addLog(`Contenu de la réponse : ${JSON.stringify(json)}`);
        addLog("Succès : Le backend est accessible et répond parfaitement !");
        setDiagStatus('success');
      } else {
        addLog(`Erreur du serveur : Le serveur a répondu avec un code d'erreur.`);
        setDiagStatus('cors_ssl_error');
      }
    } catch (err: any) {
      addLog(`Échec de la requête : ${err?.message || err}`);
      
      // Diagnosing specific common mobile WebView failures
      if (err?.name === 'AbortError') {
        addLog("Diagnostic: La requête a expiré (Timeout). Le serveur est peut-être éteint, ou son adresse est incorrecte.");
      } else {
        addLog("Diagnostic: Une erreur réseau s'est produite. Cela est généralement causé par :");
        addLog("  1. Un blocage CORS : L'en-tête 'Access-Control-Allow-Origin' du serveur n'inclut pas l'origine de votre application mobile (ex: capacitor://localhost ou http://localhost).");
        addLog("  2. Une erreur de certificat SSL : Le serveur utilise un certificat auto-signé, expiré ou invalide que le WebView du téléphone rejette par sécurité.");
        addLog("  3. Le serveur est injoignable ou l'adresse IP/Nom de domaine est incorrect.");
      }
      setDiagStatus('cors_ssl_error');
    }

    setDiagLogs(logs);
  };

  // Hide the floating error/warning toasts completely to ensure a clean, peaceful user experience.
  if (!showDiagnosticModal) return null;

  return (
    <>
      {/* Diagnostics Modal */}
      <AnimatePresence>
        {showDiagnosticModal && (
          <div className="fixed inset-0 bg-black/65 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 text-gray-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="text-emerald-500 animate-pulse" size={20} />
                  <h3 className="font-bold text-base text-white">Diagnostic Connexion Capacitor</h3>
                </div>
                <button
                  onClick={() => setShowDiagnosticModal(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Header */}
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-950 border border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Statut réseau local :</span>
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isOnline ? (
                      <>
                        <Wifi className="text-emerald-500" size={16} />
                        <span className="text-emerald-400">En ligne</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="text-red-500" size={16} />
                        <span className="text-red-400">Hors ligne</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Serveur d'API ciblé :</span>
                  <span className="font-mono text-xs text-gray-300 break-all select-all">
                    {getApiUrl('')}
                  </span>
                </div>
              </div>

              {/* Action and Test Outcomes */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">État du test d'accessibilité API :</span>
                  {diagStatus === 'testing' && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <RefreshCw size={12} className="animate-spin" /> En cours...
                    </span>
                  )}
                  {diagStatus === 'success' && (
                    <span className="text-xs text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800 font-medium">
                      Connecté avec succès
                    </span>
                  )}
                  {diagStatus === 'cors_ssl_error' && (
                    <span className="text-xs text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800 font-medium">
                      Erreur CORS ou SSL
                    </span>
                  )}
                  {diagStatus === 'offline' && (
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700 font-medium">
                      Appareil hors ligne
                    </span>
                  )}
                </div>

                {/* Console Output logs */}
                <div className="bg-black/90 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-gray-300 max-h-48 overflow-y-auto border border-gray-850 flex flex-col gap-1">
                  {diagLogs.length === 0 ? (
                    <span className="text-gray-500 italic">Aucun test en cours. Cliquez sur "Relancer" ci-dessous.</span>
                  ) : (
                    diagLogs.map((log, index) => (
                      <div key={index} className={log.includes('Échec') || log.includes('Erreur') ? 'text-red-400' : log.includes('Succès') ? 'text-emerald-400' : log.includes('Avertissement') ? 'text-amber-400' : ''}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {diagStatus === 'cors_ssl_error' && (
                <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 text-xs text-red-300">
                  <span className="font-bold block mb-1">💡 Solutions recommandées :</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>📅 <strong>Date & Heure du téléphone :</strong> Vérifiez que l'heure de votre téléphone est réglée en <strong>mode automatique</strong>. Si l'heure est décalée même de quelques minutes, Android bloque immédiatement toutes les connexions sécurisées (SSL) et Firestore !</li>
                    <li>🌐 <strong>Réseau Wi-Fi / VPN :</strong> Si vous utilisez un réseau Wi-Fi public, un proxy scolaire/d'entreprise, ou un VPN, ils peuvent intercepter le trafic SSL. Essayez de passer sur vos données mobiles (4G/5G) pour tester.</li>
                    <li>⚙️ <strong>Configuration de l'URL d'API :</strong> Allez dans l'onglet <strong>Admin → Paramètres</strong> et assurez-vous d'avoir enregistré l'URL publique correcte de votre backend.</li>
                    <li>🔒 <strong>Certificat de serveur :</strong> Utilisez un certificat SSL valide (ex: Let's Encrypt). Les téléphones bloquent les certificats auto-signés par défaut.</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-2.5 mt-2 border-t border-gray-800 pt-4">
                <button
                  onClick={runDiagnostics}
                  disabled={diagStatus === 'testing'}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={14} className={diagStatus === 'testing' ? 'animate-spin' : ''} />
                  Relancer le test
                </button>
                <button
                  onClick={() => setShowDiagnosticModal(false)}
                  className="bg-gray-850 hover:bg-gray-800 text-gray-300 font-medium py-2 px-5 rounded-xl text-sm transition-all border border-gray-700 cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
