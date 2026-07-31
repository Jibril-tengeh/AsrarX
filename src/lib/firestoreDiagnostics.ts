import { db } from './firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export interface DiagnosticResult {
  timestamp: string;
  isOnline: boolean;
  platform: string;
  origin: string;
  restApiStatus: 'SUCCESS' | 'CORS_OR_NETWORK_ERROR' | 'HTTP_ERROR' | 'PENDING';
  restApiErrorDetails?: string;
  sdkStatus: 'SUCCESS' | 'FIRESTORE_SDK_ERROR' | 'PENDING';
  sdkLatencyMs?: number;
  sdkErrorDetails?: string;
}

/**
 * Diagnostic tool that tests network reachability, CORS/REST accessibility,
 * and Firebase Firestore SDK connectivity in Capacitor, mobile, and web environments.
 */
export const runFirestoreDiagnostics = async (): Promise<DiagnosticResult> => {
  const isCapacitor = typeof window !== 'undefined' && (
    !!(window as any).Capacitor ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'file:' ||
    navigator.userAgent.includes('Capacitor')
  );

  const platform = isCapacitor ? 'Capacitor/Mobile' : (typeof window !== 'undefined' ? window.location.protocol : 'Unknown');
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'N/A';

  console.group('%c[Firestore Diagnostic Tool]', 'color: #10b981; font-weight: bold; font-size: 13px;');
  console.log(`[Diagnostic Info] Timestamp: ${new Date().toISOString()}`);
  console.log(`[Diagnostic Info] Platform: ${platform}`);
  console.log(`[Diagnostic Info] Online State: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
  console.log(`[Diagnostic Info] Origin: ${origin}`);
  console.log(`[Diagnostic Info] Firebase Project ID: ${firebaseConfig.projectId}`);

  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    isOnline,
    platform,
    origin,
    restApiStatus: 'PENDING',
    sdkStatus: 'PENDING',
  };

  // 1. Test direct REST API endpoint to isolate CORS or raw network blockage
  const restUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/articles?key=${firebaseConfig.apiKey}&pageSize=1`;
  const restStartTime = performance.now();

  try {
    console.log(`[REST/CORS Test] Attempting direct fetch to: ${restUrl}`);
    const response = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    const restDuration = Math.round(performance.now() - restStartTime);

    if (response.ok) {
      result.restApiStatus = 'SUCCESS';
      console.log(`%c[REST/CORS Test] SUCCESS in ${restDuration}ms - HTTP Status: ${response.status}`, 'color: #10b981;');
    } else {
      result.restApiStatus = 'HTTP_ERROR';
      result.restApiErrorDetails = `HTTP ${response.status}: ${response.statusText}`;
      console.warn(`%c[REST/CORS Test] HTTP Error ${response.status}: ${response.statusText}`, 'color: #f59e0b;');
    }
  } catch (err: any) {
    result.restApiStatus = 'CORS_OR_NETWORK_ERROR';
    result.restApiErrorDetails = err?.message || String(err);
    console.warn(
      `[REST/CORS Test] Note: Direct fetch unavailable or restricted in current environment:`,
      err?.message || err
    );
  }

  // 2. Test Firestore JS SDK query attempt
  const sdkStartTime = performance.now();
  try {
    console.log(`[Firestore SDK Test] Attempting getDocs query on 'articles' collection...`);
    const q = query(collection(db, 'articles'), limit(1));
    const snap = await getDocs(q);
    const sdkDuration = Math.round(performance.now() - sdkStartTime);

    result.sdkStatus = 'SUCCESS';
    result.sdkLatencyMs = sdkDuration;
    console.log(
      `%c[Firestore SDK Test] SUCCESS in ${sdkDuration}ms - Retrieved ${snap.size} document(s). Empty: ${snap.empty}`,
      'color: #10b981;'
    );
  } catch (err: any) {
    const sdkDuration = Math.round(performance.now() - sdkStartTime);
    result.sdkStatus = 'FIRESTORE_SDK_ERROR';
    result.sdkLatencyMs = sdkDuration;
    result.sdkErrorDetails = `${err?.code || 'UNKNOWN_CODE'}: ${err?.message || String(err)}`;
    console.warn(
      `[Firestore SDK Test] Note: SDK connectivity test encountered an issue (${err?.code || 'NONE'}):`,
      err?.message || err
    );
  }

  console.groupEnd();

  return result;
};

// Auto-attach diagnostic tool to window for quick console execution in WebView/Capacitor
if (typeof window !== 'undefined') {
  (window as any).runFirestoreDiagnostics = runFirestoreDiagnostics;
}
