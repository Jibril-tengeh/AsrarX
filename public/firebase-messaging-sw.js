importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click to open or focus app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle messages sent directly from React app thread for background execution
self.addEventListener('message', (event) => {
  if (!event.data) return;
  const { type, title, body, icon, delayMs, url } = event.data;

  if (type === 'SCHEDULE_BACKGROUND_REMINDER' || type === 'SHOW_NOTIFICATION') {
    const show = () => {
      self.registration.showNotification(title || 'Rappel Spirituel AsrarHub', {
        body: body || "C'est l'heure de votre Zikr & Heure Planétaire !",
        icon: icon || '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'asrarhub-background-reminder',
        vibrate: [200, 100, 200, 100, 300],
        data: { url: url || '/' },
      });
    };

    if (delayMs && delayMs > 0) {
      setTimeout(show, delayMs);
    } else {
      show();
    }
  }
});

// Handle generic background web push events
self.addEventListener('push', (event) => {
  let data = { title: 'Notification AsrarHub', body: 'Nouveau message ou rappel spirituel' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const notificationTitle = data.title || data.notification?.title || 'Rappel AsrarHub';
  const notificationOptions = {
    body: data.body || data.notification?.body || "C'est l'heure de votre Zikr !",
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

// Default fallback Firebase config for FCM background messaging
const FALLBACK_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAfEoh3EawDtYAmxDreZ13OiNWCCR9ccow",
  authDomain: "asrartemple.firebaseapp.com",
  projectId: "asrartemple",
  storageBucket: "asrartemple.firebasestorage.app",
  messagingSenderId: "1072626978186",
  appId: "1:1072626978186:web:b3834ed5653d7214aa0c73"
};

function initializeFcmMessaging(firebaseConfig) {
  try {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);
      const notificationTitle = payload.notification?.title || payload.data?.title || 'Rappel AsrarHub';
      const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || "C'est l'heure de votre Zikr & Heure Planétaire !",
        icon: payload.notification?.icon || payload.data?.icon || '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        data: payload.data || { url: '/' }
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
    console.log('[firebase-messaging-sw.js] FCM Background Messaging initialized successfully.');
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Error initializing FCM messaging:', err);
  }
}

// Fetch Firebase config dynamically or use fallback
fetch('/firebase-applet-config.json')
  .then(response => response.json())
  .then(config => {
    if (config && config.apiKey) {
      initializeFcmMessaging(config);
    } else {
      initializeFcmMessaging(FALLBACK_FIREBASE_CONFIG);
    }
  })
  .catch(err => {
    console.warn('Firebase config fetch in SW fallback notice:', err?.message || err);
    initializeFcmMessaging(FALLBACK_FIREBASE_CONFIG);
  });

