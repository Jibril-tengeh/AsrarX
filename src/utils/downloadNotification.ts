/**
 * Global Download Notification Event System
 * Emits custom events when file, canvas, audio or PDF downloads start or complete.
 */

export interface DownloadEventData {
  id: string;
  type: 'start' | 'success' | 'error';
  fileName?: string;
  customMessage?: string;
  timestamp: number;
}

type DownloadListener = (event: DownloadEventData) => void;

const listeners = new Set<DownloadListener>();

export function subscribeDownloadNotification(listener: DownloadListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitDownloadEvent(type: 'start' | 'success' | 'error', fileName?: string, customMessage?: string) {
  const eventData: DownloadEventData = {
    id: `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    fileName,
    customMessage,
    timestamp: Date.now(),
  };

  listeners.forEach((listener) => {
    try {
      listener(eventData);
    } catch (err) {
      console.error('[DownloadNotification] Error in listener:', err);
    }
  });

  // Also dispatch a window CustomEvent for external listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('asrarhub:download', { detail: eventData }));
  }
}

export function notifyDownloadStart(fileName?: string, customMessage?: string) {
  emitDownloadEvent('start', fileName, customMessage);
}

export function notifyDownloadSuccess(fileName?: string, customMessage?: string) {
  emitDownloadEvent('success', fileName, customMessage);
}

export function notifyDownloadError(fileName?: string, customMessage?: string) {
  emitDownloadEvent('error', fileName, customMessage);
}
