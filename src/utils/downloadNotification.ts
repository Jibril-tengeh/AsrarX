import { dispatchSystemNotification } from './notificationLocalization';
import { saveRecentDownload, DownloadRecord } from './downloadStorage';

/**
 * Global Download Notification Event System
 * Emits custom events when file, canvas, audio or PDF downloads start or complete.
 * Links directly with the Download Preview Modal.
 */

export interface DownloadEventData {
  id: string;
  type: 'start' | 'success' | 'error';
  fileName?: string;
  customMessage?: string;
  dataUrl?: string;
  previewUrl?: string;
  fileType?: 'image' | 'video' | 'audio' | 'pdf' | 'other';
  toolRoute?: string;
  toolName?: string;
  timestamp: number;
}

type DownloadListener = (event: DownloadEventData) => void;

const listeners = new Set<DownloadListener>();

export function subscribeDownloadNotification(listener: DownloadListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Trigger opening the Download Preview modal directly from any component
 */
export function openDownloadPreviewModal(downloadData?: Partial<DownloadRecord> | DownloadEventData) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('asrarhub:open_download_preview', {
        detail: downloadData || null,
      })
    );
  }
}

function emitDownloadEvent(
  type: 'start' | 'success' | 'error',
  fileName?: string,
  customMessage?: string,
  extraData?: Partial<DownloadEventData>
) {
  const eventData: DownloadEventData = {
    id: `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    fileName,
    customMessage,
    dataUrl: extraData?.dataUrl,
    previewUrl: extraData?.previewUrl,
    fileType: extraData?.fileType || (fileName?.match(/\.(png|jpe?g|webp|svg)$/i) ? 'image' : fileName?.endsWith('.pdf') ? 'pdf' : fileName?.endsWith('.webm') ? 'video' : 'other'),
    toolRoute: extraData?.toolRoute || (typeof window !== 'undefined' ? window.location.pathname : undefined),
    toolName: extraData?.toolName,
    timestamp: Date.now(),
  };

  // Save to IndexedDB / localStorage history if successful
  if (type === 'success' && fileName) {
    saveRecentDownload({
      id: eventData.id,
      fileName,
      dataUrl: eventData.dataUrl,
      fileType: eventData.fileType || 'image',
      timestamp: eventData.timestamp,
      toolName: eventData.toolName,
      toolRoute: eventData.toolRoute,
      customMessage: eventData.customMessage,
    }).catch((e) => console.warn('[DownloadNotification] saveRecentDownload error:', e));
  }

  listeners.forEach((listener) => {
    try {
      listener(eventData);
    } catch (err) {
      console.error('[DownloadNotification] Error in listener:', err);
    }
  });

  // Also dispatch a system background notification to the device notification tray with rich payload
  try {
    const lang = (localStorage.getItem('language') || 'fr') as 'fr' | 'en' | 'ha';
    let notifTitle = 'Téléchargement';
    let notifBody = customMessage || '';

    if (type === 'start') {
      notifTitle = lang === 'ha' ? 'An Fara Zazzagewa 📥' : lang === 'en' ? 'Download Started 📥' : 'Téléchargement Démarré 📥';
      notifBody = notifBody || (fileName ? `Enregistrement de "${fileName}" en cours...` : 'Génération du fichier en cours...');
    } else if (type === 'success') {
      notifTitle = lang === 'ha' ? 'An Kammala Zazzagewa ✅' : lang === 'en' ? 'Download Completed ✅' : 'Téléchargement Terminé ✅';
      notifBody = notifBody || (fileName ? `"${fileName}" a été enregistré avec succès.` : 'Votre fichier a été enregistré avec succès.');
    } else {
      notifTitle = lang === 'ha' ? 'Zazzagewa Ta Gaza ⚠️' : lang === 'en' ? 'Download Failed ⚠️' : 'Échec du Téléchargement ⚠️';
      notifBody = notifBody || 'Une erreur est survenue lors du téléchargement du fichier.';
    }

    dispatchSystemNotification(notifTitle, notifBody, {
      type: 'download',
      downloadId: eventData.id,
      fileName: eventData.fileName,
      fileType: eventData.fileType,
      toolRoute: eventData.toolRoute,
      targetUrl: eventData.toolRoute || '/tools',
    });
  } catch (err) {
    console.warn('[DownloadNotification] System notification dispatch error:', err);
  }

  // Also dispatch a window CustomEvent for external listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('asrarhub:download', { detail: eventData }));
  }
}

export function notifyDownloadStart(fileName?: string, customMessage?: string, extraData?: Partial<DownloadEventData>) {
  emitDownloadEvent('start', fileName, customMessage, extraData);
}

export function notifyDownloadSuccess(fileName?: string, customMessage?: string, extraData?: Partial<DownloadEventData>) {
  emitDownloadEvent('success', fileName, customMessage, extraData);
}

export function notifyDownloadError(fileName?: string, customMessage?: string, extraData?: Partial<DownloadEventData>) {
  emitDownloadEvent('error', fileName, customMessage, extraData);
}
