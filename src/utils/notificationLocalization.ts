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
  | 'meditationReminder'
  | 'articleNew';

export interface NotificationPayloadParams {
  planetName?: string;
  planetArabic?: string;
  favorability?: string;
  isPropitious?: boolean;
  label?: string;
  prayerName?: string;
  time?: string;
  articleTitle?: string;
  isPremium?: boolean;
  hook?: string;
  count?: number;
  articleId?: string;
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

    case 'articleNew': {
      const { articleTitle = 'Nouveau Secret', isPremium = false, hook = '', count = 1 } = params;
      const modeBadge = isPremium ? '⭐ [PREMIUM]' : '📖 [PUBLIC]';

      if (currentLang === 'en') {
        const title = `${modeBadge} ${articleTitle}`;
        let body = isPremium
          ? 'New spiritual secret available for Premium members.'
          : 'New spiritual secret available to everyone.';
        if (hook && hook.trim().length > 0) {
          const cleanHook = hook.replace(/<[^>]+>/g, '').trim();
          body = `${cleanHook.length > 90 ? cleanHook.substring(0, 90) + '...' : cleanHook} — Tap to read ➔`;
        } else if (count > 1) {
          body = `${articleTitle} (+${count - 1} other new secret(s)). Tap to open immediately ➔`;
        } else {
          body = `${body} Tap to open immediately ➔`;
        }
        return { title, body };
      }

      if (currentLang === 'ha') {
        const title = `${modeBadge} ${articleTitle}`;
        let body = isPremium
          ? 'Sabon sirri na musamman ga membobin Premium.'
          : 'Sabon sirri na ruhaniyya ga kowa da kowa.';
        if (hook && hook.trim().length > 0) {
          const cleanHook = hook.replace(/<[^>]+>/g, '').trim();
          body = `${cleanHook.length > 90 ? cleanHook.substring(0, 90) + '...' : cleanHook} — Danna nan don karantawa ➔`;
        } else if (count > 1) {
          body = `${articleTitle} (+${count - 1} sabbin sirruka). Danna nan don budewa ➔`;
        } else {
          body = `${body} Danna nan don budewa nan da nan ➔`;
        }
        return { title, body };
      }

      // Default: French (fr)
      const title = `${modeBadge} ${articleTitle}`;
      let body = isPremium
        ? 'Nouveau secret spirituel réservé aux membres Premium.'
        : 'Nouveau secret spirituel disponible pour tous les membres.';
      if (hook && hook.trim().length > 0) {
        const cleanHook = hook.replace(/<[^>]+>/g, '').trim();
        body = `${cleanHook.length > 90 ? cleanHook.substring(0, 90) + '...' : cleanHook} — Touchez pour lire ➔`;
      } else if (count > 1) {
        body = `${articleTitle} (+${count - 1} autre(s) nouveau(x) secret(s)). Touchez pour ouvrir immédiatement ➔`;
      } else {
        body = `${body} Touchez pour ouvrir immédiatement ➔`;
      }
      return { title, body };
    }

    default:
      return {
        title: 'AsrarHub',
        body: params.label || 'Notification AsrarHub',
      };
  }
}

/**
 * Universal cross-platform notification dispatch function with extra payload support
 */
export async function dispatchSystemNotification(
  title: string,
  body: string,
  extra: Record<string, any> = {}
) {
  try {
    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.createChannel({
          id: 'asrarhub_alerts',
          name: 'AsrarHub Alerts & Secrets',
          description: 'Notifications pour les nouveaux articles, secrets et rappels spirituels',
          importance: 5,
          visibility: 1,
          vibration: true,
        });
      } catch (channelErr) {
        // Channel may already exist
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 100000) + 1,
            schedule: { at: new Date(Date.now() + 100) },
            channelId: 'asrarhub_alerts',
            extra,
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
            tag: extra.articleId ? `article-${extra.articleId}` : 'asrarhub-alert',
            data: extra,
          } as any);
          return;
        } catch (swErr) {
          try {
            new window.Notification(title, { body, icon: '/icon-192.png', data: extra } as any);
          } catch {}
          return;
        }
      }
      try {
        new window.Notification(title, { body, icon: '/icon-192.png', data: extra } as any);
      } catch {}
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
  params: NotificationPayloadParams = {},
  extra: Record<string, any> = {}
) {
  const { title, body } = getLocalizedNotificationText(type, lang, params);
  await dispatchSystemNotification(title, body, { type, ...params, ...extra });
}
