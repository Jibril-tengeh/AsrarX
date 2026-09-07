import { Capacitor } from '@capacitor/core';

/**
 * Detects if the current running environment is the Native Android App (Play Store APK / Capacitor)
 */
export const isPlayStoreApp = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check if admin is simulating Play Store in session
  if (sessionStorage.getItem('asrarhub_simulate_playstore') === 'true') {
    return true;
  }

  // 1. Official Capacitor native check
  try {
    if (Capacitor.isNativePlatform()) {
      return true;
    }
    if (Capacitor.getPlatform() === 'android') {
      return true;
    }
  } catch (e) {
    // fallback to manual checks
  }

  // 2. Protocol / Origin check for Capacitor Android APK
  if (window.location.protocol === 'capacitor:' || window.location.protocol === 'file:') {
    return true;
  }

  // 3. Window Capacitor global object
  const win = window as any;
  if (win.Capacitor?.isNativePlatform?.() === true || win.Capacitor?.getPlatform?.() === 'android') {
    return true;
  }

  // 4. User-Agent check for Android WebView / Capacitor
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    const ua = navigator.userAgent;
    if (ua.includes('Capacitor') && /android/i.test(ua)) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if the current client is a web browser (desktop PC/Mac, mobile browser, or web PWA)
 */
export const isWebOrPwa = (): boolean => {
  return !isPlayStoreApp();
};

/**
 * Determines whether Paystack should be active on the current client based on feature toggles:
 * - play_store_mode = 'android_only' (or true by default):
 *     Hidden on Native Android Play Store app, but SHOWN on Web / PWA / PC / Mac!
 * - play_store_mode = 'all':
 *     Hidden everywhere (Web + Android)
 * - play_store_mode = false or 'disabled':
 *     Active everywhere
 */
export const shouldEnablePaystack = (featureToggles: any): boolean => {
  if (!featureToggles) return true;

  // If master toggle explicitly turned off
  if (featureToggles.paystack_enabled === false) {
    return false;
  }

  const playStoreMode = featureToggles.play_store_mode;

  if (playStoreMode === 'all') {
    // Disabled everywhere
    return false;
  }

  if (playStoreMode === true || playStoreMode === 'android_only') {
    // If currently running inside the Play Store APK (or simulated), hide it!
    // But if running on the Web (PC, Mac, mobile web, PWA), keep it active!
    if (isPlayStoreApp()) {
      return false;
    }
  }

  return featureToggles.pay_paystack_card !== false || featureToggles.pay_mobile_money !== false;
};

/**
 * Determines if we should show the Play Store compliance notice on the current client
 */
export const isPlayStoreNoticeApplicable = (featureToggles: any): boolean => {
  if (!featureToggles) return false;
  const playStoreMode = featureToggles.play_store_mode;
  if (playStoreMode === 'all') return true;
  if (playStoreMode === true || playStoreMode === 'android_only') {
    return isPlayStoreApp();
  }
  return false;
};
