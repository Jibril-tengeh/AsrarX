import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { applyAsrarHubWatermark } from './watermark';

/**
 * Downloads or saves a canvas image safely on both Web and Native (Android/iOS via Capacitor).
 * Automatically applies the AsrarHub watermark footer before exporting.
 */
export async function downloadCanvasImage(
  sourceCanvas: HTMLCanvasElement,
  fileName: string = 'asrarhub-export.png',
  skipWatermark: boolean = false
): Promise<boolean> {
  try {
    // Apply AsrarHub Watermark systematically
    const finalCanvas = skipWatermark ? sourceCanvas : applyAsrarHubWatermark(sourceCanvas);
    const dataUrl = finalCanvas.toDataURL('image/png');

    if (Capacitor.isNativePlatform()) {
      // Native storage execution (Android / iOS via Capacitor)
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const cleanFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      const path = `AsrarHub/${cleanFileName}`;

      try {
        await Filesystem.requestPermissions();
      } catch (pErr) {
        console.warn('Filesystem requestPermissions warning:', pErr);
      }

      // Try Documents directory first, then Cache directory as fallback
      try {
        await Filesystem.writeFile({
          path,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        return true;
      } catch (docErr) {
        console.warn('Documents write failed, retrying in Cache directory:', docErr);
        try {
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true
          });
          return true;
        } catch (cacheErr) {
          console.warn('Cache write failed, retrying in Data directory:', cacheErr);
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Data,
            recursive: true
          });
          return true;
        }
      }
    } else {
      // Browser standard fallback
      const link = document.createElement('a');
      link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }
  } catch (err) {
    console.error('Error saving image with downloadHelper:', err);
    
    // Fallback standard download attempt if Capacitor errors out
    try {
      const finalCanvas = skipWatermark ? sourceCanvas : applyAsrarHubWatermark(sourceCanvas);
      const dataUrl = finalCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (e) {
      console.error('Fallback browser download also failed:', e);
      return false;
    }
  }
}

/**
 * Custom React hook for storage permissions and file exports
 */
export function useStorageAccess() {
  const isNative = Capacitor.isNativePlatform();

  const requestStoragePermissions = async () => {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        await navigator.storage.persist();
      } catch (e) {
        console.warn('Persistent storage authorization notice:', e);
      }
    }

    if (!isNative) return true;
    try {
      const status = await Filesystem.requestPermissions();
      return status.publicStorage === 'granted';
    } catch (err) {
      console.warn('Storage permission request warning:', err);
      return true;
    }
  };

  const saveImage = async (canvas: HTMLCanvasElement, filename: string, skipWatermark = false) => {
    await requestStoragePermissions();
    return await downloadCanvasImage(canvas, filename, skipWatermark);
  };

  return {
    isNative,
    requestStoragePermissions,
    saveImage,
  };
}
