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
      const path = `AsrarHub/${fileName.endsWith('.png') ? fileName : fileName + '.png'}`;

      // Write file to device Documents directory
      await Filesystem.writeFile({
        path,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });

      return true;
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
