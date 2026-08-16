import { PrivacyScreen } from '@capacitor-community/privacy-screen';

declare global {
  interface Window {
    AndroidSecurity?: {
      setScreenProtection: (enabled: boolean) => void;
      isScreenProtectionEnabled: () => boolean;
    };
  }
}

export type ProtectionMode = 'all_allowed' | 'premium_only' | 'all_blocked';

/**
 * Determine effective screenshot protection mode from feature toggles.
 */
export function getScreenshotProtectionMode(featureToggles: any): ProtectionMode {
  if (featureToggles?.screenshot_protection_mode) {
    return featureToggles.screenshot_protection_mode as ProtectionMode;
  }
  if (featureToggles?.anti_screenshot === false || featureToggles?.anti_screenshot === 'all_allowed') {
    return 'all_allowed';
  }
  if (featureToggles?.anti_screenshot === 'all_blocked') {
    return 'all_blocked';
  }
  if (featureToggles?.anti_screenshot === 'premium_only') {
    return 'premium_only';
  }
  // Default is premium_only (standard VIP-driven protection)
  return 'premium_only';
}

/**
 * Determine effective text copy protection mode from feature toggles.
 */
export function getTextCopyProtectionMode(featureToggles: any): ProtectionMode {
  if (featureToggles?.text_copy_protection_mode) {
    return featureToggles.text_copy_protection_mode as ProtectionMode;
  }
  if (featureToggles?.text_copy_protection === 'all_allowed' || featureToggles?.text_copy_protection === false) {
    return 'all_allowed';
  }
  if (featureToggles?.text_copy_protection === 'all_blocked' || featureToggles?.disable_dua_copy === true) {
    return 'all_blocked';
  }
  if (featureToggles?.text_copy_protection === 'premium_only') {
    return 'premium_only';
  }
  // Default is premium_only
  return 'premium_only';
}

/**
 * Check if screenshots should be blocked for the current user.
 */
export function isScreenshotBlocked(featureToggles: any, isPremium: boolean): boolean {
  const mode = getScreenshotProtectionMode(featureToggles);
  if (mode === 'all_allowed') return false;
  if (mode === 'all_blocked') return true;
  return !isPremium; // 'premium_only'
}

/**
 * Check if text copy and selection should be blocked for the current user.
 */
export function isTextCopyBlocked(featureToggles: any, isPremium: boolean): boolean {
  const mode = getTextCopyProtectionMode(featureToggles);
  if (mode === 'all_allowed') return false;
  if (mode === 'all_blocked') return true;
  return !isPremium; // 'premium_only'
}

let isInitialized = false;
let currentScreenProtection = true;
let currentCopyProtection = true;

let screenStyleElement: HTMLStyleElement | null = null;
let copyStyleElement: HTMLStyleElement | null = null;

const ANTI_SCREENSHOT_CSS = `
/* Empêcher l'impression et les captures d'écran par impression/PDF */
@media print {
  html, body, #root {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
}
`;

const ANTI_COPY_CSS = `
/* Désactiver la sélection de texte sauvage et le glisser-déposer sur les articles et outils */
body, p, span, h1, h2, h3, h4, h5, h6, article, img, svg, canvas, button, div, section, main,
.no-screenshot-select,
.prose,
.article-content,
.tool-content,
.spiritual-card,
.mystic-content {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
}

input, textarea, [contenteditable="true"], .selectable-text {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

/* Désactiver l'enregistrement et le glisser-déposer d'images */
img,
img.protected-asset,
.protected-seal {
  -webkit-user-drag: none !important;
  user-drag: none !important;
}
`;

function injectScreenStyles() {
  if (typeof document === 'undefined') return;
  if (!screenStyleElement) {
    screenStyleElement = document.createElement('style');
    screenStyleElement.id = 'asrarhub-anti-screenshot-css';
    screenStyleElement.innerHTML = ANTI_SCREENSHOT_CSS;
    document.head.appendChild(screenStyleElement);
  }
}

function removeScreenStyles() {
  if (screenStyleElement && screenStyleElement.parentNode) {
    screenStyleElement.parentNode.removeChild(screenStyleElement);
    screenStyleElement = null;
  }
}

function injectCopyStyles() {
  if (typeof document === 'undefined') return;
  if (!copyStyleElement) {
    copyStyleElement = document.createElement('style');
    copyStyleElement.id = 'asrarhub-anti-copy-css';
    copyStyleElement.innerHTML = ANTI_COPY_CSS;
    document.head.appendChild(copyStyleElement);
  }
}

function removeCopyStyles() {
  if (copyStyleElement && copyStyleElement.parentNode) {
    copyStyleElement.parentNode.removeChild(copyStyleElement);
    copyStyleElement = null;
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!currentScreenProtection) return;

  // PrintScreen Key
  if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('');
      }
    } catch (_) {}
    showWarningToast("🛡️ Les captures d'écran sont protégées sur AsrarHub.");
    return false;
  }

  // Windows Snipping tool / Mac screenshot / Save shortcuts
  // Ctrl+P (Print), Ctrl+S (Save), Ctrl+Shift+S (Snipping/Screenshot), Meta+Shift+3/4/5
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  if (isCtrlOrCmd) {
    const key = e.key.toLowerCase();
    if (key === 'p' || key === 's' || (e.shiftKey && (key === 's' || key === 'i' || key === '3' || key === '4' || key === '5'))) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast("🛡️ Les captures d'écran et impressions sont protégées.");
      return false;
    }
  }
};

let toastTimeout: any = null;
export function showWarningToast(customMsg?: string) {
  if (typeof document === 'undefined') return;
  
  let toast = document.getElementById('asrar-screenshot-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'asrar-screenshot-toast';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[999999] bg-gray-900/95 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all duration-300 pointer-events-none text-center max-w-[90vw]';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="font-size: 18px;">🛡️</span>
    <span>${customMsg || "Les captures d'écran et copies sont protégées sur AsrarHub."}</span>
  `;

  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0)';

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 20px)';
    }
  }, 3000);
}

/**
 * Enable or disable anti-screenshot protection across Android (FLAG_SECURE),
 * Capacitor PrivacyScreen plugin, and Web/PWA print layer.
 */
export async function setScreenProtection(enabled: boolean) {
  currentScreenProtection = enabled;

  // 1. Android Native JavascriptInterface
  try {
    if (typeof window !== 'undefined' && window.AndroidSecurity && typeof window.AndroidSecurity.setScreenProtection === 'function') {
      window.AndroidSecurity.setScreenProtection(enabled);
    }
  } catch (err) {
    console.warn('[AntiScreenshot] AndroidSecurity bridge error:', err);
  }

  // 2. Capacitor PrivacyScreen Plugin
  try {
    if (enabled) {
      await PrivacyScreen.enable();
    } else {
      await PrivacyScreen.disable();
    }
  } catch (err) {
    // Plugin might not be running in standard web browser
  }

  // 3. Web Layer
  if (enabled) {
    injectScreenStyles();
  } else {
    removeScreenStyles();
  }
}

/**
 * Enable or disable text copy and selection CSS rules.
 */
export function setTextCopyProtection(enabled: boolean) {
  currentCopyProtection = enabled;
  if (enabled) {
    injectCopyStyles();
  } else {
    removeCopyStyles();
  }
}

/**
 * Initialize protection listeners on app startup.
 */
export function initAntiScreenshot(initialScreenEnabled: boolean = true, initialCopyEnabled: boolean = true) {
  if (typeof window === 'undefined') return;

  if (!isInitialized) {
    isInitialized = true;
    window.addEventListener('keydown', handleKeyDown, true);
  }

  setScreenProtection(initialScreenEnabled);
  setTextCopyProtection(initialCopyEnabled);
}
