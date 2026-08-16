import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { app, db } from './firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

/**
 * Safely get the Firebase Messaging instance if supported and available.
 */
export const getMessagingInstance = async (): Promise<Messaging | null> => {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }
    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return null;
    }
    const messaging = getMessaging(app);
    return messaging;
  } catch (err: any) {
    console.warn("FCM messaging is not available in this environment:", err?.message || err);
    return null;
  }
};

// Request permission and retrieve FCM token
export const getFCMToken = async (userId: string): Promise<string | null> => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("FCM is not supported or available in this browser environment.");
      return null;
    }

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
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('FCM Service Worker registered successfully:', registration);
      } catch (swErr) {
        console.warn('FCM Service Worker registration failed (skipped):', swErr);
      }
    }

    // Retrieve FCM token
    // We use the public VAPID key if configured, or default to Firebase auto-config if supported
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;
    const token = await getToken(messaging, { 
      vapidKey 
    }).catch((tokenErr) => {
      console.warn("FCM getToken failed:", tokenErr?.message || tokenErr);
      return null;
    });

    if (token) {
      console.log("FCM Token generated successfully:", token);
      
      // Save FCM token in user's document in Firestore
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          fcmTokens: arrayUnion(token),
          lastFCMToken: token,
          pushNotificationsEnabled: true
        });
      } catch (dbErr) {
        console.warn("Could not sync FCM token to Firestore:", dbErr);
      }

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
    console.warn("Handled getFCMToken notice:", error?.message || error);
    return null;
  }
};

// Check if notifications are active and supported
export const checkNotificationSupport = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    const supported = await isSupported().catch(() => false);
    return !!supported;
  } catch {
    return false;
  }
};

// Listen to foreground FCM messages
export const onMessageListener = async (onMessageReceived: (payload: any) => void) => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
      console.log("FCM Foreground Message received:", payload);
      onMessageReceived(payload);
    });
  } catch (error: any) {
    console.warn("FCM foreground listener note (handled gracefully):", error?.message || error);
  }
};

