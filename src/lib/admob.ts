import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

class AdMobService {
  private initialized = false;

  async init() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    try {
      await AdMob.initialize({
        initializeForTesting: true,
      });
      this.initialized = true;
      console.log('AdMob Initialized Successfully on Native');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  /**
   * Shows a rewarded ad.
   * Returns true if the native ad was shown, false if we should fall back to Web ad modal.
   */
  async showRewardedAd(
    onRewardEarned: (amount: number) => void,
    onDismiss: () => void
  ): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return false; // Not native, fallback to web modal
    }

    try {
      if (!this.initialized) {
        await this.init();
      }

      // Ad Unit ID - Use Google's test ad unit ID for Android/iOS
      const adId = Capacitor.getPlatform() === 'ios' 
        ? 'ca-app-pub-3940256099942544/1712485313' // iOS Test Reward ID
        : 'ca-app-pub-3940256099942544/5224354917'; // Android Test Reward ID

      // Prepare Reward Video Ad
      await AdMob.prepareRewardVideoAd({
        adId: adId,
        isTesting: true
      });

      let earned = false;
      let rewardAmount = 10;

      // Register listener for reward earned
      const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
        earned = true;
        rewardAmount = reward.amount || 10;
        console.log('User earned reward:', reward);
      });

      // Register listener for ad dismissed
      const dismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('Reward ad dismissed');
        // Clean up listeners
        rewardListener.remove();
        dismissListener.remove();
        
        if (earned) {
          onRewardEarned(rewardAmount);
        } else {
          onDismiss();
        }
      });

      // Show Reward Video Ad
      await AdMob.showRewardVideoAd();
      return true;
    } catch (error) {
      console.error('Failed to show native Rewarded Ad:', error);
      return false; // Fallback to custom web ad modal on failure
    }
  }
}

export const admobService = new AdMobService();
