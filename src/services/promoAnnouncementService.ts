import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { PromoAnnouncement, DEFAULT_PROMO_ANNOUNCEMENT } from '../types/promoAnnouncement';

export const PROMO_ANNOUNCEMENT_STORAGE_KEY = 'asrarhub_active_promo_announcement';
export const PROMO_POPUP_DISMISSED_KEY = 'asrarhub_dismissed_promo_announcement';

class PromoAnnouncementService {
  private activeAnnouncement: PromoAnnouncement = this.loadLocalAnnouncement();

  private loadLocalAnnouncement(): PromoAnnouncement {
    try {
      const stored = localStorage.getItem(PROMO_ANNOUNCEMENT_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROMO_ANNOUNCEMENT, ...JSON.parse(stored) };
      }
    } catch {
      // LocalStorage unavailable
    }
    return DEFAULT_PROMO_ANNOUNCEMENT;
  }

  private saveLocalAnnouncement(data: PromoAnnouncement) {
    try {
      localStorage.setItem(PROMO_ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // LocalStorage quota or error
    }
  }

  /**
   * Get currently cached announcement
   */
  getCachedAnnouncement(): PromoAnnouncement {
    return this.activeAnnouncement;
  }

  /**
   * Subscribe to real-time updates from Firestore doc `promo_announcements/active_announcement`
   */
  subscribeActiveAnnouncement(callback: (announcement: PromoAnnouncement | null) => void): () => void {
    try {
      const docRef = doc(db, 'promo_announcements', 'active_announcement');
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as PromoAnnouncement;
            const full: PromoAnnouncement = {
              ...DEFAULT_PROMO_ANNOUNCEMENT,
              ...data,
              id: docSnap.id
            };
            this.activeAnnouncement = full;
            this.saveLocalAnnouncement(full);
            callback(full);
          } else {
            // Document does not exist yet in Firestore, emit local default if active
            callback(this.activeAnnouncement);
          }
        },
        (error) => {
          console.warn("Error subscribing to promo announcement in Firestore:", error);
          callback(this.activeAnnouncement);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("subscribeActiveAnnouncement error:", e);
      callback(this.activeAnnouncement);
      return () => {};
    }
  }

  /**
   * Fetch current announcement once
   */
  async fetchAnnouncement(): Promise<PromoAnnouncement> {
    try {
      const docRef = doc(db, 'promo_announcements', 'active_announcement');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as PromoAnnouncement;
        const full: PromoAnnouncement = {
          ...DEFAULT_PROMO_ANNOUNCEMENT,
          ...data,
          id: snap.id
        };
        this.activeAnnouncement = full;
        this.saveLocalAnnouncement(full);
        return full;
      }
    } catch (err) {
      console.warn("Could not fetch promo_announcement from Firestore, using local:", err);
    }
    return this.activeAnnouncement;
  }

  /**
   * Save or publish promo announcement in Firestore
   */
  async saveAnnouncement(data: Partial<PromoAnnouncement>): Promise<boolean> {
    try {
      const merged: PromoAnnouncement = {
        ...this.activeAnnouncement,
        ...data,
        id: 'active_announcement',
        updatedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'promo_announcements', 'active_announcement');
      await setDoc(docRef, merged, { merge: true });

      this.activeAnnouncement = merged;
      this.saveLocalAnnouncement(merged);
      return true;
    } catch (err) {
      console.error("Error saving promo announcement to Firestore:", err);
      // Save locally at least
      this.activeAnnouncement = {
        ...this.activeAnnouncement,
        ...data,
        id: 'active_announcement',
        updatedAt: new Date().toISOString()
      };
      this.saveLocalAnnouncement(this.activeAnnouncement);
      throw err;
    }
  }

  /**
   * Toggle active state in 1 click
   */
  async toggleActive(isActive: boolean): Promise<boolean> {
    return this.saveAnnouncement({ isActive });
  }

  /**
   * Check if the user has dismissed the popup today
   */
  isPopupDismissedToday(promoCode: string): boolean {
    try {
      const stored = localStorage.getItem(PROMO_POPUP_DISMISSED_KEY);
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      if (parsed.promoCode !== promoCode) return false;
      
      const now = Date.now();
      const dismissedAt = Number(parsed.timestamp) || 0;
      // 12 hours snooze
      return (now - dismissedAt) < (12 * 60 * 60 * 1000);
    } catch {
      return false;
    }
  }

  /**
   * Mark popup as dismissed
   */
  markPopupDismissed(promoCode: string) {
    try {
      localStorage.setItem(PROMO_POPUP_DISMISSED_KEY, JSON.stringify({
        promoCode,
        timestamp: Date.now()
      }));
    } catch {
      // ignore
    }
  }
}

export const promoAnnouncementService = new PromoAnnouncementService();
