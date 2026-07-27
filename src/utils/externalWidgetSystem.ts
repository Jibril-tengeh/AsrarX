import { getCurrentPlanetaryHour, playNotificationTone, requestNotificationPermission } from './planetaryNotifications';

export interface WidgetData {
  title?: string;
  arabicTitle?: string;
  planetName?: string;
  planetArabic?: string;
  planetSymbol?: string;
  khadimName?: string;
  zikrText?: string;
  zikrCount?: number;
  abjadWeight?: number;
  sealGrid?: string[][];
  language?: 'fr' | 'ar' | 'ha' | 'en';
}

/**
  * Check if Document Picture-in-Picture or Standard Video Picture-in-Picture is supported
  */
export function isPictureInPictureSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'documentPictureInPicture' in window ||
    'pictureInPictureEnabled' in document ||
    (document as any).webkitSupportsPresentationMode
  );
}

/**
 * 1. TRIGGER FULL SYSTEM NOTIFICATION WIDGET ON OS LOCK SCREEN / STATUS BAR
 * Appears as an interactive notification card on mobile & desktop outside the app.
 */
export async function triggerSystemWidgetNotification(data?: WidgetData, delayMs = 0) {
  const currentPlanet = getCurrentPlanetaryHour();
  const lang = data?.language || 'fr';

  const title = data?.title || (
    lang === 'fr' 
      ? `📜 Widget Sacré • ${currentPlanet.planet.name} (${currentPlanet.planet.arabic})` 
      : `📜 Sacred Widget • ${currentPlanet.planet.name} (${currentPlanet.planet.arabic})`
  );

  const body = `${currentPlanet.planet.symbol} Heure #${currentPlanet.hourNumber} • ${currentPlanet.planet.favorability}\n📿 Zikr: ${data?.zikrText || 'Subhanallah'} (${data?.zikrCount || 0}) • Zimām: ${data?.abjadWeight || 489}`;

  playNotificationTone();

  // 1. Service Worker Notification with Actions
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage({
        type: 'SEND_FULL_WIDGET_NOTIFICATION',
        title,
        body,
        icon: '/icon-192.png',
        tag: 'asrarhub-system-widget',
        delayMs,
        url: '/',
        actions: [
          { action: 'increment_zikr', title: '📿 Compter Zikr (+1)' },
          { action: 'open_app', title: '📜 Ouvrir AsrarHub' }
        ]
      });
      return true;
    } catch (err) {
      console.warn('SW PostMessage notice:', err);
    }
  }

  // 2. Browser Native Notification fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        tag: 'asrarhub-system-widget',
      });
    }, delayMs);
    return true;
  }

  // Request permission if not granted
  const granted = await requestNotificationPermission();
  if (granted && 'Notification' in window) {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      tag: 'asrarhub-system-widget',
    });
    return true;
  }

  return false;
}

/**
 * 2. LAUNCH FLOATING PICTURE-IN-PICTURE (PIP) WIDGET OVERLAY
 * Keeps a live interactive widget floating on top of all other apps on the screen!
 */
let activePipWindow: Window | null = null;

export async function launchPictureInPictureWidget(data?: WidgetData): Promise<boolean> {
  const currentPlanet = getCurrentPlanetaryHour();

  // Strategy A: Chrome 116+ Document Picture-in-Picture API
  if ('documentPictureInPicture' in window) {
    try {
      if (activePipWindow && !activePipWindow.closed) {
        activePipWindow.focus();
        return true;
      }

      const pipWin = await (window as any).documentPictureInPicture.requestWindow({
        width: 360,
        height: 480,
      });

      activePipWindow = pipWin;

      // Copy stylesheet links to PiP window
      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const link = pipWin.document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = styleSheet.href;
            pipWin.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = pipWin.document.createElement('style');
            Array.from(styleSheet.cssRules).forEach((rule) => {
              style.appendChild(pipWin.document.createTextNode(rule.cssText));
            });
            pipWin.document.head.appendChild(style);
          }
        } catch (e) {
          // Cross-origin CSS ignored
        }
      });

      // Inject widget HTML content into PIP window
      pipWin.document.body.className = 'bg-slate-950 text-slate-100 p-4 font-sans select-none overflow-y-auto min-h-screen';
      
      let count = data?.zikrCount || 0;

      const renderPipContent = () => {
        pipWin.document.body.innerHTML = `
          <div style="font-family: system-ui, sans-serif; background: linear-gradient(135deg, #090314, #120924); color: #fef08a; padding: 16px; border-radius: 16px; border: 1px solid rgba(245, 158, 11, 0.4); text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #10b981; font-weight: bold; margin-bottom: 4px;">
              ✨ AsrarHub • Widget Floating Overlay
            </div>
            
            <div style="font-size: 20px; font-weight: 900; color: #fef08a; margin-bottom: 8px;">
              ${data?.title || 'Khatim Sacré du Jour'}
            </div>

            <!-- Current Planetary Hour Badge -->
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 12px; border-radius: 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 24px;">${currentPlanet.planet.symbol}</span>
              <div style="text-align: right;">
                <div style="font-size: 12px; font-weight: bold; color: #34d399;">
                  ${currentPlanet.planet.name} (${currentPlanet.planet.arabic})
                </div>
                <div style="font-size: 10px; color: #cbd5e1;">
                  Heure #${currentPlanet.hourNumber} • ${currentPlanet.planet.favorability}
                </div>
              </div>
            </div>

            <!-- Magic Grid Preview -->
            <div style="background: #000; border: 1px solid rgba(245, 158, 11, 0.6); border-radius: 8px; padding: 8px; margin: 10px 0; font-family: serif; color: #fef08a;">
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; text-align: center; font-weight: bold; font-size: 14px;">
                <div style="border-right: 1px solid #78350f; border-bottom: 1px solid #78350f; padding: 4px;">160</div>
                <div style="border-right: 1px solid #78350f; border-bottom: 1px solid #78350f; padding: 4px;">153</div>
                <div style="border-bottom: 1px solid #78350f; padding: 4px;">158</div>
                <div style="border-right: 1px solid #78350f; border-bottom: 1px solid #78350f; padding: 4px;">155</div>
                <div style="border-right: 1px solid #78350f; border-bottom: 1px solid #78350f; padding: 4px; color: #34d399;">ر</div>
                <div style="border-bottom: 1px solid #78350f; padding: 4px;">159</div>
                <div style="border-right: 1px solid #78350f; padding: 4px;">156</div>
                <div style="border-right: 1px solid #78350f; padding: 4px;">161</div>
                <div style="padding: 4px;">154</div>
              </div>
            </div>

            <!-- Zikr Counter Widget -->
            <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; margin-top: 10px;">
              <div style="font-size: 11px; color: #a7f3d0; margin-bottom: 4px;">📿 Zikr: ${data?.zikrText || 'Subhanallah'}</div>
              <div id="pip-counter" style="font-size: 32px; font-weight: 900; color: #fff; margin: 4px 0;">
                ${count}
              </div>
              <button id="pip-inc-btn" style="width: 100%; background: #059669; color: #fff; font-weight: bold; padding: 10px; border-radius: 10px; border: none; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(5,150,105,0.4);">
                📿 Compter Zikr (+1)
              </button>
            </div>
          </div>
        `;

        const incBtn = pipWin.document.getElementById('pip-inc-btn');
        if (incBtn) {
          incBtn.onclick = () => {
            count++;
            const counterEl = pipWin.document.getElementById('pip-counter');
            if (counterEl) counterEl.innerText = count.toString();
            playNotificationTone();
          };
        }
      };

      renderPipContent();
      return true;
    } catch (err) {
      console.warn('Document Picture-in-Picture error:', err);
    }
  }

  // Strategy B: Canvas Stream Video Picture-in-Picture fallback
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#0a021a';
      ctx.fillRect(0, 0, 360, 360);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 340, 340);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AsrarHub Sacred Widget', 180, 50);

      ctx.font = 'bold 36px serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`${currentPlanet.planet.symbol} ${currentPlanet.planet.name}`, 180, 120);

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Heure #${currentPlanet.hourNumber} (${currentPlanet.planet.arabic})`, 180, 160);

      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 2;
      ctx.strokeRect(90, 190, 180, 120);
      ctx.fillText('489 • فتح مبين', 180, 255);

      const video = document.createElement('video');
      video.muted = true;
      video.srcObject = canvas.captureStream(10);
      await video.play();

      if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
        return true;
      }
    }
  } catch (err) {
    console.warn('Canvas Video Picture-in-Picture fallback notice:', err);
  }

  // Fall back to triggering System Notification Widget
  return triggerSystemWidgetNotification(data);
}
