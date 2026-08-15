import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { getDownloadById, getLatestDownload, DownloadRecord } from './downloadStorage';

export interface PlanetaryModalData {
  planetIndex?: number;
  planetName?: string;
  planetArabic?: string;
  planetSymbol?: string;
  favorability?: string;
  isPropitious?: boolean;
  hourNumber?: number;
  isDaytime?: boolean;
}

export type NotificationRouterAction =
  | { type: 'OPEN_DOWNLOAD'; payload: DownloadRecord }
  | { type: 'OPEN_PLANETARY'; payload: PlanetaryModalData }
  | { type: 'NAVIGATE'; path: string; state?: any };

type NotificationActionSubscriber = (action: NotificationRouterAction) => void;

const actionSubscribers = new Set<NotificationActionSubscriber>();
let isInitialized = false;

/**
 * Subscribe to notification router actions (used by the Global Notification Provider/Modal Container)
 */
export function subscribeNotificationRouter(callback: NotificationActionSubscriber): () => void {
  actionSubscribers.add(callback);
  return () => actionSubscribers.delete(callback);
}

export function emitNotificationRouterAction(action: NotificationRouterAction) {
  actionSubscribers.forEach((sub) => {
    try {
      sub(action);
    } catch (e) {
      console.error('[NotificationRouter] Subscriber error:', e);
    }
  });
}

/**
 * Handle notification click event data and route appropriately
 */
export async function handleNotificationClickPayload(extraData: any, rawNotification?: any) {
  console.log('[NotificationRouter] Handling notification payload:', extraData, rawNotification);

  const extra = extraData || {};
  const notifTitle = rawNotification?.title || '';
  const notifBody = rawNotification?.body || '';

  // 1. Download notification (Téléchargement Terminé / Image sauvegardée)
  if (
    extra.type === 'download' ||
    notifTitle.includes('Téléchargement') ||
    notifTitle.includes('Download') ||
    notifTitle.includes('Zazzagewa') ||
    notifBody.includes('.png') ||
    notifBody.includes('.jpg') ||
    notifBody.includes('.pdf')
  ) {
    let downloadRecord: DownloadRecord | null = null;
    if (extra.downloadId) {
      downloadRecord = await getDownloadById(extra.downloadId);
    }
    if (!downloadRecord && extra.fileName) {
      downloadRecord = await getDownloadById(extra.fileName);
    }
    if (!downloadRecord) {
      downloadRecord = await getLatestDownload();
    }

    if (downloadRecord) {
      emitNotificationRouterAction({
        type: 'OPEN_DOWNLOAD',
        payload: downloadRecord,
      });
      return;
    }

    // Fallback: create temporary record from extra info
    emitNotificationRouterAction({
      type: 'OPEN_DOWNLOAD',
      payload: {
        id: extra.downloadId || `dl_${Date.now()}`,
        fileName: extra.fileName || 'Fichier AsrarHub',
        dataUrl: extra.dataUrl,
        fileType: extra.fileType || 'image',
        timestamp: Date.now(),
        toolRoute: extra.toolRoute,
      },
    });
    return;
  }

  // 2. Planetary hour notification (Heure Planétaire)
  if (
    extra.type === 'planetaryHour' ||
    notifTitle.includes('Planétaire') ||
    notifTitle.includes('Planetary') ||
    notifTitle.includes('Rana') ||
    notifTitle.includes('Wata') ||
    notifTitle.includes('Zuhura') ||
    notifTitle.includes('Utaridu') ||
    notifTitle.includes('Mushtari') ||
    notifTitle.includes('Mirriku') ||
    notifTitle.includes('Zuhalu')
  ) {
    emitNotificationRouterAction({
      type: 'OPEN_PLANETARY',
      payload: {
        planetIndex: extra.planetIndex,
        planetName: extra.planetName,
        planetArabic: extra.planetArabic,
        planetSymbol: extra.planetSymbol,
        favorability: extra.favorability,
        isPropitious: extra.isPropitious,
        hourNumber: extra.hourNumber,
        isDaytime: extra.isDaytime,
      },
    });
    return;
  }

  // 3. New Article / Secret notification
  if (
    extra.type === 'article' ||
    notifTitle.includes('Article') ||
    notifTitle.includes('Makalu') ||
    notifBody.includes('article')
  ) {
    if (extra.articleId) {
      emitNotificationRouterAction({
        type: 'NAVIGATE',
        path: `/secret/${extra.articleId}`,
      });
      return;
    }
    emitNotificationRouterAction({
      type: 'NAVIGATE',
      path: '/user/dashboard',
    });
    return;
  }

  // 4. Prayer time notification
  if (extra.type === 'prayerTime' || notifTitle.includes('Prière') || notifTitle.includes('Sallah')) {
    emitNotificationRouterAction({
      type: 'NAVIGATE',
      path: '/explore/calendar',
    });
    return;
  }

  // 5. Dhikr notification
  if (
    extra.type === 'dhikrDaily' ||
    extra.type === 'dhikrRecurring' ||
    notifTitle.includes('Dhikr') ||
    notifTitle.includes('Tasbih')
  ) {
    emitNotificationRouterAction({
      type: 'NAVIGATE',
      path: extra.type === 'dhikrDaily' ? '/tools/daily-dhikr' : '/tools/tasbih',
    });
    return;
  }

  // 6. Direct target URL
  if (extra.targetUrl) {
    emitNotificationRouterAction({
      type: 'NAVIGATE',
      path: extra.targetUrl,
    });
    return;
  }

  // Default fallback if unknown: navigate to dashboard
  emitNotificationRouterAction({
    type: 'NAVIGATE',
    path: '/user/dashboard',
  });
}

/**
 * Initialize all native and web notification click listeners
 */
export function initNotificationRouter() {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Capacitor Native LocalNotifications click listener
  if (Capacitor.isNativePlatform()) {
    try {
      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        console.log('[NotificationRouter] Local Notification clicked:', notificationAction);
        const extra = notificationAction.notification?.extra || {};
        handleNotificationClickPayload(extra, notificationAction.notification);
      });
    } catch (err) {
      console.warn('[NotificationRouter] LocalNotifications listener warning:', err);
    }

    try {
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('[NotificationRouter] Push Notification clicked:', notification);
        const extra = notification.notification?.data || {};
        handleNotificationClickPayload(extra, notification.notification);
      });
    } catch (err) {
      console.warn('[NotificationRouter] PushNotifications listener warning:', err);
    }
  }

  // 2. Service Worker & Web Message listener
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_CLICKED' && event.data?.data) {
          handleNotificationClickPayload(event.data.data);
        }
      });
    } catch (err) {
      console.warn('[NotificationRouter] SW message listener warning:', err);
    }
  }

  // 3. Custom In-App Events
  if (typeof window !== 'undefined') {
    window.addEventListener('asrarhub:open_download_preview', async (e: any) => {
      const data = e.detail;
      if (data) {
        emitNotificationRouterAction({
          type: 'OPEN_DOWNLOAD',
          payload: data,
        });
      } else {
        const latest = await getLatestDownload();
        if (latest) {
          emitNotificationRouterAction({
            type: 'OPEN_DOWNLOAD',
            payload: latest,
          });
        }
      }
    });

    window.addEventListener('asrarhub:open_planetary_preview', (e: any) => {
      emitNotificationRouterAction({
        type: 'OPEN_PLANETARY',
        payload: e.detail || {},
      });
    });
  }
}
