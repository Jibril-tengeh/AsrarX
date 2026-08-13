import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { SupportedLanguage } from './planetaryNotifications';

export type NotificationType =
  | 'planetaryHour'
  | 'dhikrDaily'
  | 'dhikrRecurring'
  | 'prayerTime'
  | 'customReminder'
  | 'widgetNotice'
  | 'meditationReminder';

export interface NotificationPayloadParams {
  planetName?: string;
  planetArabic?: string;
  favorability?: string;
  isPropitious?: boolean;
  label?: string;
  prayerName?: string;
  time?: string;
  [key: string]: any;
}

export function getLocalizedNotificationText(
  type: NotificationType,
  lang: SupportedLanguage = 'fr',
  params: NotificationPayloadParams = {}
): { title: string; body: string } {
  const currentLang: SupportedLanguage = ['fr', 'en', 'ha'].includes(lang) ? lang : 'fr';

  switch (type) {
    case 'planetaryHour': {
      const { planetName = '', planetArabic = '', favorability = '', isPropitious = false } = params;
      if (currentLang === 'en') {
        return {
          title: `Planetary Hour: ${planetName} (${planetArabic})`,
          body: `Influence: ${favorability}.\nA ${isPropitious ? 'highly beneficial' : 'special'} period has just begun.`,
        };
      }
      if (currentLang === 'ha') {
        return {
          title: `Sa'ar Tauraro: ${planetName} (${planetArabic})`,
          body: `Tasiri: ${favorability}.\nLokaci mai ${isPropitious ? 'albarka mai yawa' : 'muhimmanci'} ya soma.`,
        };
      }
      return {
        title: `Heure Planétaire : ${planetName} (${planetArabic})`,
        body: `Prospérité : ${favorability}.\nUne période ${isPropitious ? 'hautement bénéfique' : 'particulière'} vient de débuter.`,
      };
    }

    case 'dhikrDaily': {
      const { label = 'Zikr' } = params;
      if (currentLang === 'en') {
        return {
          title: 'Daily Dhikr Reminder 📿',
          body: `It is time for your Dhikr: ${label}`,
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Tunasatar Dhikri 📿',
          body: `Lokaci ya yi na Dhikri: ${label}`,
        };
      }
      return {
        title: 'Rappel de Zikr Quotidien 📿',
        body: `Il est temps pour votre Zikr : ${label}`,
      };
    }

    case 'dhikrRecurring': {
      if (currentLang === 'en') {
        return {
          title: 'Recurring Dhikr Reminder 📿',
          body: 'It is time to remember Allah. Take a minute to do your Dhikr and purify your heart.',
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Tunasatar Dhikri Mai Maimaitawa 📿',
          body: 'Lokacin ambaton Allah ya yi. Samu minti daya don yin Dhikri da tsarkake zuciya.',
        };
      }
      return {
        title: 'Rappel de Dhikr Récurrent 📿',
        body: 'C\'est l\'heure d\'évoquer Allah. Prenez une minute pour faire votre Zikr et purifier votre esprit.',
      };
    }

    case 'prayerTime': {
      const { prayerName = 'Prière', time = '' } = params;
      if (currentLang === 'en') {
        return {
          title: 'Prayer Time 🕌',
          body: `It is time for ${prayerName} prayer (${time}). Take a sacred moment to pray.`,
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Lokacin Salati 🕌',
          body: `Lokacin salati ya yi na ${prayerName} (${time}). Samu lokaci mai albarka don rokon Allah.`,
        };
      }
      return {
        title: 'Heure de la Prière 🕌',
        body: `C'est l'heure de la prière de ${prayerName} (${time}). Prenez un moment sacré pour invoquer Dieu.`,
      };
    }

    case 'customReminder': {
      const { label = '' } = params;
      if (currentLang === 'en') {
        return {
          title: 'AsrarHub Alert',
          body: `Time for: ${label}`,
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Sadarwar AsrarHub',
          body: `Lokaci ya yi na: ${label}`,
        };
      }
      return {
        title: 'Rappel AsrarHub',
        body: `Il est temps pour : ${label}`,
      };
    }

    case 'widgetNotice': {
      const { label = '' } = params;
      if (currentLang === 'en') {
        return {
          title: 'Spiritual Widget Alert',
          body: label || 'Current planetary energy update available.',
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Sadarwar Widget',
          body: label || 'Sabuwar sanarwar karfin taurari ta fito.',
        };
      }
      return {
        title: 'Alerte Widget Spirituel',
        body: label || 'Mise à jour de l\'énergie planétaire disponible.',
      };
    }

    case 'meditationReminder': {
      if (currentLang === 'en') {
        return {
          title: 'Meditation & Spiritual Pause 🧘‍♂️',
          body: 'Take a calm breath and connect with divine presence.',
        };
      }
      if (currentLang === 'ha') {
        return {
          title: 'Hutu na Ruhaniyya 🧘‍♂️',
          body: 'Yi numfashi cikin lumana sannan ka kasance da tunanin Allah.',
        };
      }
      return {
        title: 'Pause Méditative & Spirituelle 🧘‍♂️',
        body: 'Prenez une respiration paisible et connectez-vous à la présence divine.',
      };
    }

    default:
      return {
        title: 'AsrarHub',
        body: params.label || 'Notification AsrarHub',
      };
  }
}

/**
 * Universal cross-platform notification dispatch function
 */
export async function dispatchSystemNotification(title: string, body: string) {
  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 10000) + 1,
            schedule: { at: new Date(Date.now() + 100) },
            channelId: 'asrarhub_alerts',
          },
        ],
      });
      return;
    }

    if ('Notification' in window && window.Notification && window.Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'asrarhub-alert',
          } as any);
          return;
        } catch (swErr) {
          try { new window.Notification(title, { body, icon: '/icon-192.png' }); } catch {}
          return;
        }
      }
      try { new window.Notification(title, { body, icon: '/icon-192.png' }); } catch {}
    }
  } catch (err) {
    console.error('[NotificationLocalization] Dispatch error:', err);
  }
}

/**
 * High-level helper to build localized message and dispatch notification
 */
export async function dispatchLocalizedNotification(
  type: NotificationType,
  lang: SupportedLanguage = 'fr',
  params: NotificationPayloadParams = {}
) {
  const { title, body } = getLocalizedNotificationText(type, lang, params);
  await dispatchSystemNotification(title, body);
}
