import { db } from '../lib/firebase';
import { doc, getDocFromServer, enableNetwork, disableNetwork } from 'firebase/firestore';

export interface NetworkLog {
  id: string;
  timestamp: string;
  type: 'info' | 'error' | 'success' | 'retry';
  category: 'general' | 'firestore' | 'network' | 'ssl_cors';
  message: string;
  details?: string;
}

const STORAGE_KEY = 'asrarhub_network_diagnostic_logs';
const MAX_LOGS = 50;

// Load initial logs from localStorage
const loadLogs = (): NetworkLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Save logs to localStorage
const saveLogs = (logs: NetworkLog[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('[NetworkLogger] Failed to save logs:', e);
  }
};

export const getNetworkLogs = (): NetworkLog[] => {
  return loadLogs();
};

export const clearNetworkLogs = (): void => {
  saveLogs([]);
  // Dispatch an event to notify UI listeners
  window.dispatchEvent(new Event('asrarhub_network_logs_updated'));
};

export const addNetworkLog = (
  type: NetworkLog['type'],
  category: NetworkLog['category'],
  message: string,
  details?: string
): NetworkLog => {
  const newLog: NetworkLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    type,
    category,
    message,
    details,
  };

  const currentLogs = loadLogs();
  const updatedLogs = [newLog, ...currentLogs].slice(0, MAX_LOGS);
  saveLogs(updatedLogs);

  // Print to console nicely
  const consolePrefix = `[NetworkDiag] [${category.toUpperCase()}]`;
  if (type === 'error') {
    console.error(consolePrefix, message, details || '');
  } else if (type === 'retry') {
    console.warn(consolePrefix, message, details || '');
  } else {
    console.log(consolePrefix, message, details || '');
  }

  // Dispatch event for components to re-render
  window.dispatchEvent(new Event('asrarhub_network_logs_updated'));

  return newLog;
};

// Listen to standard window online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    addNetworkLog('info', 'network', 'Le navigateur signale que l\'appareil est en ligne.');
  });
  window.addEventListener('offline', () => {
    addNetworkLog('info', 'network', 'Le navigateur signale que l\'appareil est hors ligne.');
  });
}

/**
 * Perform a lightweight ping to the Cloud Firestore server to measure latency
 * and verify absolute reachability.
 */
export interface PingResult {
  reachable: boolean;
  latencyMs: number;
  errorType: 'none' | 'offline' | 'ssl_cors' | 'auth' | 'other';
  errorMessage: string;
}

export const pingFirestore = async (): Promise<PingResult> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    try {
      // Double check if we are truly offline or if it is a false-negative
      await fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' });
    } catch (e) {
      return {
        reachable: false,
        latencyMs: 0,
        errorType: 'offline',
        errorMessage: 'L\'appareil est actuellement hors-ligne (signalé par le système et validé par ping).',
      };
    }
  }

  const start = performance.now();
  try {
    // Attempt a live fetch from the Firestore server for a specific connection test document
    // Using getDocFromServer bypasses local caches completely.
    const testDocRef = doc(db, '_connection_test_nonexistent_unique_id_', 'ping');
    await getDocFromServer(testDocRef);
    
    // Non-existent document is a successful reachability test!
    const latencyMs = Math.round(performance.now() - start);
    addNetworkLog('success', 'firestore', `Ping Firestore réussi. Latence: ${latencyMs}ms`);
    return {
      reachable: true,
      latencyMs,
      errorType: 'none',
      errorMessage: '',
    };
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - start);
    const msg = error?.message || String(error);
    const code = error?.code || '';

    let errorType: PingResult['errorType'] = 'other';
    let localMsg = msg;

    if (msg.toLowerCase().includes('unavailable') || code === 'unavailable') {
      errorType = 'offline';
      localMsg = 'Impossible d\'atteindre les serveurs Firebase (Service non disponible).';
    } else if (
      msg.toLowerCase().includes('network-error') || 
      msg.toLowerCase().includes('failed to fetch') || 
      code === 'network-error'
    ) {
      errorType = 'ssl_cors';
      localMsg = 'Erreur réseau Firestore (potentiellement un blocage SSL ou CORS dans l\'environnement Capacitor).';
    } else if (code === 'permission-denied') {
      errorType = 'auth';
      localMsg = 'Accès refusé par les règles de sécurité Firestore (le serveur est accessible !).';
    }

    addNetworkLog(
      'error',
      errorType === 'ssl_cors' ? 'ssl_cors' : 'firestore',
      `Échec du ping Firestore après ${latencyMs}ms. Type d'erreur: ${errorType}`,
      `Details: ${msg}`
    );

    return {
      reachable: errorType === 'auth', // If auth rules denied us, the server is still REACHABLE!
      latencyMs,
      errorType,
      errorMessage: localMsg,
    };
  }
};

/**
 * Exponential backoff reconnect manager for Firestore.
 * Automatically tries to force Firestore to connect to the backend
 * by cycling the network status when operations fail due to connection issues.
 */
let isReconnecting = false;
let retryDelay = 2000; // start at 2 seconds
const MAX_RETRY_DELAY = 60000; // max 60 seconds

export const triggerBackgroundReconnect = async () => {
  if (isReconnecting) return;
  isReconnecting = true;

  addNetworkLog(
    'retry',
    'firestore',
    `Lancement de la procédure de reconnexion en arrière-plan (Délai initial: ${retryDelay}ms)...`
  );

  const attemptReconnect = async () => {
    try {
      addNetworkLog('info', 'firestore', 'Forçage de la reconnexion réseau de Firestore...');
      // Cycle network to flush pending connections
      await disableNetwork(db);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await enableNetwork(db);

      // Verify if connected
      const check = await pingFirestore();
      if (check.reachable) {
        addNetworkLog('success', 'firestore', 'Reconnexion réseau Firestore réussie !');
        retryDelay = 2000; // Reset delay
        isReconnecting = false;
      } else {
        // Schedule next retry with exponential backoff
        retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
        addNetworkLog(
          'retry',
          'firestore',
          `Reconnexion échouée. Nouvelle tentative dans ${retryDelay}ms.`
        );
        setTimeout(attemptReconnect, retryDelay);
      }
    } catch (e: any) {
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
      addNetworkLog(
        'error',
        'firestore',
        `Erreur lors de la reconnexion: ${e?.message || e}. Nouvelle tentative dans ${retryDelay}ms.`
      );
      setTimeout(attemptReconnect, retryDelay);
    }
  };

  setTimeout(attemptReconnect, retryDelay);
};

// Register a global window function to intercept 'unavailable' errors and trigger retry
if (typeof window !== 'undefined') {
  (window as any).asrarhub_trigger_reconnect = triggerBackgroundReconnect;
}
