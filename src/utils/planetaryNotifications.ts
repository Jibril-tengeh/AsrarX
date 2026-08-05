import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

/**
 * Utility for Planetary Hours Browser & Capacitor Push Notifications with Audio Sound Alerts
 * Notifies the user in real-time when favorable planetary hours (e.g. Jupiter, Venus, Sun) begin.
 */

export type SupportedLanguage = 'fr' | 'en' | 'ha';

export interface MultilingualPlanet {
  name: Record<SupportedLanguage, string>;
  arabic: string;
  symbol: string;
  favorability: Record<SupportedLanguage, string>;
  isPropitious: boolean;
}

export const multilingualPlanets: MultilingualPlanet[] = [
  {
    name: { fr: 'Soleil', en: 'Sun', ha: 'Rana' },
    arabic: 'الشمس',
    symbol: '☉',
    favorability: {
      fr: 'Excellente (Gloire & Réussite)',
      en: 'Excellent (Glory & Success)',
      ha: 'Madalla (Daukaka & Nasara)',
    },
    isPropitious: true,
  },
  {
    name: { fr: 'Vénus', en: 'Venus', ha: 'Zuhura' },
    arabic: 'الزهرة',
    symbol: '♀',
    favorability: {
      fr: 'Très Favorable (Harmonie & Amour)',
      en: 'Very Favorable (Harmony & Love)',
      ha: 'Mai Kyau Kwarai (Zaman Lafiya & Soyayya)',
    },
    isPropitious: true,
  },
  {
    name: { fr: 'Mercure', en: 'Mercury', ha: 'Utaridu' },
    arabic: 'عطارد',
    symbol: '☿',
    favorability: {
      fr: 'Neutre/Avisé (Étude & Écrit)',
      en: 'Neutral/Wise (Study & Writing)',
      ha: 'Na Tsakiya (Karatu & Rubutu)',
    },
    isPropitious: false,
  },
  {
    name: { fr: 'Lune', en: 'Moon', ha: 'Wata' },
    arabic: 'القمر',
    symbol: '☽',
    favorability: {
      fr: 'Favorable (Intuition & Rêve)',
      en: 'Favorable (Intuition & Dream)',
      ha: 'Mai Kyau (Hankali & Mafarki)',
    },
    isPropitious: false,
  },
  {
    name: { fr: 'Saturne', en: 'Saturn', ha: 'Zuhalu' },
    arabic: 'زحل',
    symbol: '♄',
    favorability: {
      fr: 'Prudence/Bannissement (Discipline)',
      en: 'Caution/Banishing (Discipline)',
      ha: 'Kiyayewa (Hukunci & Horammaku)',
    },
    isPropitious: false,
  },
  {
    name: { fr: 'Jupiter', en: 'Jupiter', ha: 'Mushtari' },
    arabic: 'المشتري',
    symbol: '♃',
    favorability: {
      fr: 'Excellente (Abondance & Richesse)',
      en: 'Excellent (Abundance & Wealth)',
      ha: 'Madalla (Arziki & Wadada)',
    },
    isPropitious: true,
  },
  {
    name: { fr: 'Mars', en: 'Mars', ha: 'Mirriku' },
    arabic: 'المريخ',
    symbol: '♂',
    favorability: {
      fr: 'Énergique/Raid (Force & Courage)',
      en: 'Energetic/Action (Strength & Courage)',
      ha: 'Karfin Aiki (Karfi & Jarumtaka)',
    },
    isPropitious: false,
  },
];

const planets = multilingualPlanets.map(p => ({
  name: p.name.fr,
  arabic: p.arabic,
  symbol: p.symbol,
  favorability: p.favorability.fr
}));

const chaldeanSequence = [4, 5, 6, 0, 1, 2, 3];
const dayRulerMap = [0, 3, 6, 2, 5, 1, 4];

/**
 * Play a resonant sacred bell/chime sound for notification ring alerts
 */
export function playNotificationTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // 528 Hz (Miracle/Solfeggio frequency chime)
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (err) {
    console.warn('Audio tone play error:', err);
  }
}

/**
 * Request Push & Local Notifications Permission (Web & Capacitor Native)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      try {
        await LocalNotifications.createChannel({
          id: 'asrarhub_alerts',
          name: 'AsrarHub Alerts',
          description: 'Notifications des heures planétaires et rappels de méditation',
          importance: 5,
          visibility: 1,
          vibration: true,
        });
      } catch (e) {
        console.warn('Channel creation error:', e);
      }

      const localPerm = await LocalNotifications.requestPermissions();
      const pushPerm = await PushNotifications.requestPermissions();

      if (localPerm.display === 'granted' || pushPerm.receive === 'granted') {
        return true;
      }
    } catch (e) {
      console.warn('Capacitor Notifications permission request error:', e);
    }
  }

  // Web Notifications API
  if (!('Notification' in window)) {
    console.warn('Browser does not support Web notifications.');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Request Microphone Permission (For Voice Zikr / Speech recognition / Audio analysis)
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop stream immediately after permission granted
      stream.getTracks().forEach((track) => track.stop());
      return true;
    }
  } catch (err) {
    console.warn('Microphone permission error/denied:', err);
  }
  return false;
}

/**
 * Request Storage Permission (For offline cache, file exports, parchment downloads)
 */
export async function requestStoragePermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage === 'granted') return true;
    } catch (e) {
      console.warn('Capacitor Filesystem permission error:', e);
    }
  }

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch (e) {
      console.warn('Storage persistence request notice:', e);
    }
  }

  return true;
}

/**
 * Request Geolocation Permission (For Qibla, exact sunrise/sunset & prayer calculations)
 */
export async function requestGeolocationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await Geolocation.requestPermissions();
      if (perm.location === 'granted' || perm.coarseLocation === 'granted') return true;
    } catch (e) {
      console.warn('Capacitor Geolocation permission error:', e);
    }
  }

  return new Promise<boolean>((resolve) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          (err) => {
            console.warn('Geolocation permission notice:', err.message);
            resolve(false);
          },
          { timeout: 8000, maximumAge: 60000 }
        );
      } else {
        resolve(false);
      }
    } catch (err) {
      console.warn('Geolocation permission error:', err);
      resolve(false);
    }
  });
}

/**
 * Request Camera Permission
 */
export async function requestCameraPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await Camera.requestPermissions();
      if (perm.camera === 'granted') return true;
    } catch (e) {
      console.warn('Capacitor Camera permission error:', e);
    }
  }
  return false;
}

/**
 * Force authorization of all essential permissions (Notifications + Microphone + Storage + Geolocation + Camera)
 */
export async function requestAllPermissions() {
  const notifGranted = await requestNotificationPermission();
  const micGranted = await requestMicrophonePermission();
  const storageGranted = await requestStoragePermission();
  const geoGranted = await requestGeolocationPermission();
  const cameraGranted = await requestCameraPermission();
  console.log('[AsrarHub] Permissions granted:', {
    notifications: notifGranted,
    microphone: micGranted,
    storage: storageGranted,
    geolocation: geoGranted,
    camera: cameraGranted
  });
  return { notifications: notifGranted, microphone: micGranted, storage: storageGranted, geolocation: geoGranted, camera: cameraGranted };
}

export function getCurrentPlanetaryHour() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayOfWeek = now.getDay();

  // Standard sunrise at 06:00 and sunset at 18:00 if not configured
  const sr = 6 * 60;
  const ss = 18 * 60;
  const isDaytime = currentMinutes >= sr && currentMinutes < ss;

  const dayLength = ss - sr;
  const nightLength = 24 * 60 - dayLength;
  const hourLength = isDaytime ? dayLength / 12 : nightLength / 12;

  let elapsed = isDaytime ? currentMinutes - sr : (currentMinutes < sr ? currentMinutes + (24 * 60 - ss) : currentMinutes - ss);
  let hourIndex = Math.floor(elapsed / hourLength);
  if (hourIndex < 0) hourIndex = 0;
  if (hourIndex > 11) hourIndex = 11;

  const rulerPlanetIndex = dayRulerMap[dayOfWeek];
  const chaldeanStartIndex = chaldeanSequence.indexOf(rulerPlanetIndex);

  let planetIndexInSequence: number;
  if (isDaytime) {
    planetIndexInSequence = (chaldeanStartIndex + hourIndex) % 7;
  } else {
    planetIndexInSequence = (chaldeanStartIndex + 12 + hourIndex) % 7;
  }

  const planetIndex = chaldeanSequence[planetIndexInSequence];
  return {
    hourNumber: hourIndex + 1,
    isDaytime,
    planet: planets[planetIndex],
    planetIndex,
  };
}

let lastNotifiedPlanet: string | null = null;

export function checkAndTriggerPlanetaryNotification(overrideLang?: SupportedLanguage) {
  const current = getCurrentPlanetaryHour();
  const rawPlanet = multilingualPlanets[current.planetIndex] || multilingualPlanets[0];

  const todayStr = new Date().toISOString().slice(0, 10);
  const notifKey = `asrar_planetary_notif_${current.planetIndex}_H${current.hourNumber}_${current.isDaytime ? 'D' : 'N'}_${todayStr}`;
  const lastSentStr = localStorage.getItem('asrar_planetary_notif_lastSent');
  const lastSentKey = localStorage.getItem('asrar_planetary_notif_lastKey');
  const now = Date.now();

  // Check if this exact alert key was already triggered today OR sent within the last 35 minutes to prevent flooding
  if (lastSentKey === notifKey) {
    return;
  }
  if (lastSentStr) {
    const lastSentTime = parseInt(lastSentStr, 10);
    if (!isNaN(lastSentTime) && (now - lastSentTime < 35 * 60 * 1000)) {
      return;
    }
  }

  if (rawPlanet.arabic !== lastNotifiedPlanet) {
    lastNotifiedPlanet = rawPlanet.arabic;

    // Record lastSent timestamp and key in localStorage before dispatching
    try {
      localStorage.setItem('asrar_planetary_notif_lastSent', now.toString());
      localStorage.setItem('asrar_planetary_notif_lastKey', notifKey);
    } catch (e) {
      console.warn('LocalStorage save error for planetary notification:', e);
    }

    const currentLang = (overrideLang || localStorage.getItem('language') || 'fr') as SupportedLanguage;
    const langKey: SupportedLanguage = ['fr', 'en', 'ha'].includes(currentLang) ? currentLang : 'fr';

    const planetName = rawPlanet.name[langKey] || rawPlanet.name.fr;
    const favorability = rawPlanet.favorability[langKey] || rawPlanet.favorability.fr;
    const isPropitious = rawPlanet.isPropitious;

    let title = '';
    let body = '';

    if (langKey === 'en') {
      title = `Planetary Hour: ${planetName} (${rawPlanet.arabic})`;
      body = `Influence: ${favorability}.\nA ${isPropitious ? 'highly beneficial' : 'special'} period has just begun.`;
    } else if (langKey === 'ha') {
      title = `Sa'ar Tauraro: ${planetName} (${rawPlanet.arabic})`;
      body = `Tasiri: ${favorability}.\nLokaci mai ${isPropitious ? 'albarka mai yawa' : 'muhimmanci'} ya soma.`;
    } else {
      title = `Heure Planétaire : ${planetName} (${rawPlanet.arabic})`;
      body = `Prospérité : ${favorability}.\nUne période ${isPropitious ? 'hautement bénéfique' : 'particulière'} vient de débuter.`;
    }

    // Ring audio alert
    playNotificationTone();

    // Check Capacitor LocalNotifications
    if (Capacitor.isNativePlatform()) {
      try {
        LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Math.floor(Math.random() * 10000) + 1,
              schedule: { at: new Date(Date.now() + 100) },
              actionTypeId: '',
              channelId: 'asrarhub_alerts',
              extra: null,
            },
          ],
        }).catch((err) => {
          console.warn('Capacitor LocalNotification schedule promise rejection:', err);
        });
        return;
      } catch (e) {
        console.warn('Capacitor LocalNotification trigger error:', e);
      }
    }

    // Service Worker Background Notification Dispatch
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'planetary-hour-alert',
          vibrate: [200, 100, 200, 100, 300],
          data: { url: '/' }
        } as any).catch(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/icon-192.png', tag: 'planetary-hour-alert' });
          }
        });
      }).catch(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/icon-192.png', tag: 'planetary-hour-alert' });
        }
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag: 'planetary-hour-alert',
      });
    }
  }
}

