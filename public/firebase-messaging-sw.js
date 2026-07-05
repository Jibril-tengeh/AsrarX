importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Fetch the config dynamically and initialize
fetch('/firebase-applet-config.json')
  .then(response => response.json())
  .then(firebaseConfig => {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message: ', payload);
      const notificationTitle = payload.notification?.title || 'Rappel AsrarHub';
      const notificationOptions = {
        body: payload.notification?.body || "C'est l'heure de votre Zikr !",
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: payload.data
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  })
  .catch(err => {
    console.error('Failed to initialize Firebase Messaging Service Worker:', err);
  });
