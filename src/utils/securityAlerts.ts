import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, onSnapshot, deleteDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';

export interface SecurityAlert {
  id: string; // e.g. `${userId}_${toolId}`
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userPhotoURL?: string;
  toolId: string;
  toolName: string;
  restrictionType: 'blocked' | 'premium' | 'maintenance' | 'inactive' | 'phone_blocked' | string;
  attemptCount: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  status: 'active' | 'dismissed' | 'resolved';
  severity: 'low' | 'medium' | 'critical'; // critical if attemptCount >= 3
  ipOrDevice?: string;
  readByAdmin?: boolean;
}

const LOCAL_STORAGE_KEY = 'asrarhub_security_alerts';
const FEATURE_TOGGLE_KEY = 'alert_repeated_tool_access';

/**
 * Check if the admin security alert tracking feature is enabled
 */
export const isSecurityAlertTrackingEnabled = (featureToggles?: Record<string, any>): boolean => {
  if (featureToggles && featureToggles[FEATURE_TOGGLE_KEY] !== undefined) {
    return featureToggles[FEATURE_TOGGLE_KEY] !== false;
  }
  try {
    const localFontSaved = localStorage.getItem('asrar_font_toggles');
    if (localFontSaved) {
      const parsed = JSON.parse(localFontSaved);
      if (parsed[FEATURE_TOGGLE_KEY] !== undefined) {
        return parsed[FEATURE_TOGGLE_KEY] !== false;
      }
    }
  } catch (_) {}
  return true; // Default enabled
};

/**
 * Get all cached security alerts from localStorage
 */
export const getCachedSecurityAlerts = (): SecurityAlert[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse cached security alerts:', e);
    return [];
  }
};

/**
 * Save alerts to localStorage and notify listeners
 */
const saveCachedAlerts = (alerts: SecurityAlert[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(alerts));
    window.dispatchEvent(new CustomEvent('asrarhub_security_alerts_updated', { detail: alerts }));
  } catch (e) {
    console.warn('Failed to cache security alerts:', e);
  }
};

/**
 * Record an unauthorized attempt to access a blocked/restricted tool
 */
export const recordUnauthorizedToolAttempt = async (params: {
  user: any;
  toolId: string;
  toolName?: string;
  restrictionType: string;
  featureToggles?: Record<string, any>;
}): Promise<void> => {
  const { user, toolId, toolName, restrictionType, featureToggles } = params;

  // 1. Verify if tracking is enabled by admin
  if (!isSecurityAlertTrackingEnabled(featureToggles)) {
    return;
  }

  // 2. Ignore if user is admin
  if (!user) return;
  const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com', 'tenibawwal10@gmail.com', 'jibriltengeh57@gmail.com'];
  if (user.role === 'admin' || (user.email && adminEmails.includes(user.email.toLowerCase()))) {
    return;
  }

  const userId = user.uid || user.id || 'anonymous';
  const cleanToolId = (toolId || 'unknown').toLowerCase().trim();
  const alertId = `${userId}_${cleanToolId}`;
  const now = Date.now();

  // 3. Update in local cache first for instant feedback
  const existingAlerts = getCachedSecurityAlerts();
  const existingIndex = existingAlerts.findIndex(a => a.id === alertId);

  let updatedAlert: SecurityAlert;
  let newAttemptCount = 1;

  if (existingIndex >= 0) {
    const existing = existingAlerts[existingIndex];
    newAttemptCount = (existing.attemptCount || 1) + 1;
    updatedAlert = {
      ...existing,
      userName: user.name || existing.userName || user.email?.split('@')[0] || 'Utilisateur',
      userEmail: user.email || existing.userEmail || '',
      userPhone: user.phone || existing.userPhone,
      userPhotoURL: user.photoURL || existing.userPhotoURL,
      toolName: toolName || existing.toolName || cleanToolId,
      restrictionType: restrictionType || existing.restrictionType,
      attemptCount: newAttemptCount,
      lastAttemptAt: now,
      status: 'active',
      severity: newAttemptCount >= 3 ? 'critical' : newAttemptCount >= 2 ? 'medium' : 'low',
      readByAdmin: false
    };
    existingAlerts[existingIndex] = updatedAlert;
  } else {
    updatedAlert = {
      id: alertId,
      userId,
      userName: user.name || user.displayName || user.email?.split('@')[0] || 'Utilisateur',
      userEmail: user.email || '',
      userPhone: user.phone || '',
      userPhotoURL: user.photoURL || '',
      toolId: cleanToolId,
      toolName: toolName || cleanToolId,
      restrictionType,
      attemptCount: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
      status: 'active',
      severity: 'low',
      readByAdmin: false
    };
    existingAlerts.unshift(updatedAlert);
  }

  saveCachedAlerts(existingAlerts);

  // 4. Persist to Firestore
  try {
    const alertRef = doc(db, 'security_access_alerts', alertId);
    await setDoc(alertRef, updatedAlert, { merge: true });
  } catch (err) {
    console.warn('[SecurityAlerts] Firestore sync note (saved locally):', err);
  }
};

/**
 * Dismiss or resolve an alert
 */
export const dismissSecurityAlert = async (alertId: string): Promise<void> => {
  const alerts = getCachedSecurityAlerts();
  const updated = alerts.filter(a => a.id !== alertId);
  saveCachedAlerts(updated);

  try {
    const alertRef = doc(db, 'security_access_alerts', alertId);
    await deleteDoc(alertRef);
  } catch (err) {
    console.warn('[SecurityAlerts] Error removing alert from Firestore:', err);
  }
};

/**
 * Mark all alerts as read by admin
 */
export const markAllSecurityAlertsAsRead = async (): Promise<void> => {
  const alerts = getCachedSecurityAlerts();
  const updated = alerts.map(a => ({ ...a, readByAdmin: true }));
  saveCachedAlerts(updated);

  try {
    for (const alert of updated) {
      const alertRef = doc(db, 'security_access_alerts', alert.id);
      await updateDoc(alertRef, { readByAdmin: true }).catch(() => {});
    }
  } catch (err) {
    console.warn('[SecurityAlerts] Error marking alerts as read in Firestore:', err);
  }
};

/**
 * Clear all security alerts
 */
export const clearAllSecurityAlerts = async (): Promise<void> => {
  const alerts = getCachedSecurityAlerts();
  saveCachedAlerts([]);

  try {
    for (const alert of alerts) {
      const alertRef = doc(db, 'security_access_alerts', alert.id);
      await deleteDoc(alertRef).catch(() => {});
    }
  } catch (err) {
    console.warn('[SecurityAlerts] Error clearing Firestore alerts:', err);
  }
};

/**
 * Real-time listener for security alerts with local fallback
 */
export const subscribeToSecurityAlerts = (callback: (alerts: SecurityAlert[]) => void) => {
  // Trigger initial from cache
  callback(getCachedSecurityAlerts());

  // Listen to local events
  const handleLocalUpdate = (e: any) => {
    if (e.detail) {
      callback(e.detail);
    } else {
      callback(getCachedSecurityAlerts());
    }
  };

  window.addEventListener('asrarhub_security_alerts_updated', handleLocalUpdate);
  window.addEventListener('storage', handleLocalUpdate);

  // Firestore real-time listener
  let unsubscribeFirestore = () => {};
  try {
    const alertsQuery = query(collection(db, 'security_access_alerts'), orderBy('lastAttemptAt', 'desc'), limit(100));
    unsubscribeFirestore = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const firestoreAlerts: SecurityAlert[] = [];
        snapshot.forEach((docSnap) => {
          firestoreAlerts.push(docSnap.data() as SecurityAlert);
        });

        // Merge with local cache
        const local = getCachedSecurityAlerts();
        const map = new Map<string, SecurityAlert>();
        local.forEach(a => map.set(a.id, a));
        firestoreAlerts.forEach(a => map.set(a.id, a));

        const merged = Array.from(map.values()).sort((a, b) => b.lastAttemptAt - a.lastAttemptAt);
        saveCachedAlerts(merged);
        callback(merged);
      },
      (error) => {
        console.warn('[SecurityAlerts] Firestore subscription note (using local cache):', error);
      }
    );
  } catch (err) {
    console.warn('[SecurityAlerts] Listener init note:', err);
  }

  return () => {
    window.removeEventListener('asrarhub_security_alerts_updated', handleLocalUpdate);
    window.removeEventListener('storage', handleLocalUpdate);
    unsubscribeFirestore();
  };
};
