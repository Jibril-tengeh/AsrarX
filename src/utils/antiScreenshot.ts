import { PrivacyScreen } from '@capacitor-community/privacy-screen';

declare global {
  interface Window {
    AndroidSecurity?: {
      setScreenProtection: (enabled: boolean) => void;
      isScreenProtectionEnabled: () => boolean;
    };
  }
}

let isInitialized = false;
let currentProtectionState = true;
let styleElement: HTMLStyleElement | null = null;

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

/* Désactiver la sélection de texte sauvage et le glisser-déposer sur les articles et outils */
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

/* Désactiver l'enregistrement et le clic-droit d'images */
img.protected-asset,
.protected-seal {
  pointer-events: none !important;
  -webkit-user-drag: none !important;
  user-drag: none !important;
}
`;

function injectAntiScreenshotStyles() {
  if (typeof document === 'undefined') return;
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'asrarhub-anti-screenshot-css';
    styleElement.innerHTML = ANTI_SCREENSHOT_CSS;
    document.head.appendChild(styleElement);
  }
}

function removeAntiScreenshotStyles() {
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
    styleElement = null;
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!currentProtectionState) return;

  // PrintScreen Key
  if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
    e.preventDefault();
    e.stopPropagation();
    showWarningToast();
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
      showWarningToast();
      return false;
    }
  }
};

const handleContextMenu = (e: MouseEvent) => {
  if (!currentProtectionState) return;
  // If target is inside an article, tool, sacred text or seal
  const target = e.target as HTMLElement | null;
  if (
    target &&
    (target.closest('.prose') ||
      target.closest('.article-content') ||
      target.closest('.tool-content') ||
      target.closest('.spiritual-card') ||
      target.closest('.mystic-content') ||
      target.closest('article') ||
      target.tagName === 'IMG' ||
      target.tagName === 'CANVAS' ||
      target.tagName === 'SVG')
  ) {
    e.preventDefault();
  }
};

let toastTimeout: any = null;
function showWarningToast() {
  if (typeof document === 'undefined') return;
  
  let toast = document.getElementById('asrar-screenshot-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'asrar-screenshot-toast';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[999999] bg-gray-900/95 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all duration-300 pointer-events-none text-center max-w-[90vw]';
    toast.innerHTML = `
      <span style="font-size: 18px;">🛡️</span>
      <span>Les captures d'écran et copies sont protégées sur AsrarHub.</span>
    `;
    document.body.appendChild(toast);
  }

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
 * Capacitor PrivacyScreen plugin, and Web/PWA layer.
 */
export async function setScreenProtection(enabled: boolean) {
  currentProtectionState = enabled;

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
    injectAntiScreenshotStyles();
  } else {
    removeAntiScreenshotStyles();
  }
}

/**
 * Initialize anti-screenshot listeners on app startup.
 */
export function initAntiScreenshot(initialEnabled: boolean = true) {
  if (typeof window === 'undefined' || isInitialized) {
    if (isInitialized) {
      setScreenProtection(initialEnabled);
    }
    return;
  }

  isInitialized = true;
  currentProtectionState = initialEnabled;

  // Initial application
  setScreenProtection(initialEnabled);

  // Attach global DOM listeners
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('contextmenu', handleContextMenu, true);
}
