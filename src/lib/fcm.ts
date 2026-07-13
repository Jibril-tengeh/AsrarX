import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { app, db } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

// Request permission and retrieve FCM token
export const getFCMToken = async (userId: string): Promise<string | null> => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM is not supported in this browser environment.");
      return null;
    }

    const messaging = getMessaging(app);

    // Request permission from the browser with safety checks for sandbox/iframe environments
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        try {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.warn("FCM Notification permission not granted: " + permission);
            return null;
          }
        } catch (permError: any) {
          console.warn("FCM Notification permission request failed (likely blocked by browser/iframe policy):", permError?.message || permError);
          return null;
        }
      }
    } else {
      console.warn("Notifications are not supported or available in this environment.");
      return null;
    }

    // Try to register the service worker if not already registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('FCM Service Worker registered successfully:', registration);
    }

    // Retrieve FCM token
    // We use the public VAPID key if configured, or default to Firebase auto-config if supported
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;
    const token = await getToken(messaging, { 
      vapidKey 
    });

    if (token) {
      console.log("FCM Token generated successfully:", token);
      
      // Save FCM token in user's document in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        lastFCMToken: token,
        pushNotificationsEnabled: true
      });

      return token;
    } else {
      console.warn("No FCM token returned. Check Firebase configuration.");
      return null;
    }
  } catch (error: any) {
    const errorStr = String(error?.message || error);
    if (errorStr.includes("permission") || errorStr.includes("Permission") || errorStr.includes("denied") || errorStr.includes("refusée")) {
      console.warn("FCM Notification permission issue handled gracefully:", errorStr);
      return null;
    }
    console.error("Error in getFCMToken:", error);
    throw error;
  }
};

// Check if notifications are active and supported
export const checkNotificationSupport = async (): Promise<boolean> => {
  try {
    return await isSupported() && 'Notification' in window;
  } catch {
    return false;
  }
};

// Listen to foreground FCM messages
export const onMessageListener = async (onMessageReceived: (payload: any) => void) => {
  try {
    const supported = await isSupported();
    if (!supported) return;

    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      console.log("FCM Foreground Message received:", payload);
      onMessageReceived(payload);
    });
  } catch (error) {
    console.error("Error setting up FCM foreground listener:", error);
  }
};
