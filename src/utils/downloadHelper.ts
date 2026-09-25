import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { applyAsrarHubWatermark } from './watermark';
import { notifyDownloadStart, notifyDownloadSuccess, notifyDownloadError } from './downloadNotification';

/**
 * Downloads or saves a canvas image safely on both Web and Native (Android/iOS via Capacitor).
 * Automatically applies the AsrarHub watermark footer before exporting.
 */
export async function downloadCanvasImage(
  sourceCanvas: HTMLCanvasElement,
  fileName: string = 'asrarhub-export.png',
  skipWatermark: boolean = false
): Promise<boolean> {
  const cleanFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  notifyDownloadStart(cleanFileName);

  try {
    // Apply AsrarHub Watermark systematically
    const finalCanvas = skipWatermark ? sourceCanvas : applyAsrarHubWatermark(sourceCanvas);
    const dataUrl = finalCanvas.toDataURL('image/png');

    const extraData = {
      dataUrl,
      fileType: 'image' as const,
      toolRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    if (Capacitor.isNativePlatform()) {
      // Native storage execution (Android / iOS via Capacitor)
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
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
        notifyDownloadSuccess(cleanFileName, undefined, extraData);
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
          notifyDownloadSuccess(cleanFileName, undefined, extraData);
          return true;
        } catch (cacheErr) {
          console.warn('Cache write failed, retrying in Data directory:', cacheErr);
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Data,
            recursive: true
          });
          notifyDownloadSuccess(cleanFileName, undefined, extraData);
          return true;
        }
      }
    } else {
      // Browser standard fallback
      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notifyDownloadSuccess(cleanFileName, undefined, extraData);
      return true;
    }
  } catch (err) {
    console.error('Error saving image with downloadHelper:', err);
    
    // Fallback standard download attempt if Capacitor errors out
    try {
      const finalCanvas = skipWatermark ? sourceCanvas : applyAsrarHubWatermark(sourceCanvas);
      const dataUrl = finalCanvas.toDataURL('image/png');
      const extraData = {
        dataUrl,
        fileType: 'image' as const,
        toolRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
      };
      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notifyDownloadSuccess(cleanFileName, undefined, extraData);
      return true;
    } catch (e) {
      console.error('Fallback browser download also failed:', e);
      notifyDownloadError(cleanFileName);
      return false;
    }
  }
}

/**
 * Downloads or saves a Video File (.webm or .mp4) on both Web and Native (Capacitor).
 */
export async function downloadVideoFile(
  videoBlob: Blob,
  fileName: string = 'verset_contemplatif.webm'
): Promise<boolean> {
  notifyDownloadStart(fileName);

  try {
    if (Capacitor.isNativePlatform()) {
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      return new Promise<boolean>((resolve) => {
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          const path = `AsrarHub/${fileName}`;

          try {
            await Filesystem.requestPermissions();
          } catch (_) {}

          try {
            await Filesystem.writeFile({
              path,
              data: base64Data,
              directory: Directory.Documents,
              recursive: true
            });
            notifyDownloadSuccess(fileName);
            resolve(true);
          } catch (err) {
            console.warn('Native video save failed, retrying in Cache:', err);
            try {
              await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
                recursive: true
              });
              notifyDownloadSuccess(fileName);
              resolve(true);
            } catch (cacheErr) {
              notifyDownloadError(fileName);
              resolve(false);
            }
          }
        };
      });
    } else {
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      notifyDownloadSuccess(fileName);
      return true;
    }
  } catch (err) {
    console.error('Error in downloadVideoFile:', err);
    notifyDownloadError(fileName);
    return false;
  }
}

/**
 * Downloads or saves a PDF file generated by jsPDF on both Web and Native (Android/iOS via Capacitor).
 */
export async function downloadPdfDoc(
  doc: any,
  fileName: string = 'asrarhub-document.pdf'
): Promise<boolean> {
  const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  notifyDownloadStart(cleanFileName);

  try {
    if (Capacitor.isNativePlatform()) {
      // Get base64 string from jsPDF
      const dataUri = doc.output('datauristring');
      const base64Data = dataUri.replace(/^data:application\/pdf;filename=[^;]+;base64,/, '')
                                .replace(/^data:application\/pdf;base64,/, '');
      const path = `AsrarHub/${cleanFileName}`;

      try {
        await Filesystem.requestPermissions();
      } catch (pErr) {
        console.warn('Filesystem requestPermissions warning:', pErr);
      }

      try {
        await Filesystem.writeFile({
          path,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        notifyDownloadSuccess(cleanFileName);
        return true;
      } catch (docErr) {
        console.warn('Documents PDF write failed, retrying in Cache directory:', docErr);
        try {
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true
          });
          notifyDownloadSuccess(cleanFileName);
          return true;
        } catch (cacheErr) {
          console.warn('Cache PDF write failed, retrying in Data directory:', cacheErr);
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Data,
            recursive: true
          });
          notifyDownloadSuccess(cleanFileName);
          return true;
        }
      }
    } else {
      // Browser standard download
      doc.save(cleanFileName);
      notifyDownloadSuccess(cleanFileName);
      return true;
    }
  } catch (err) {
    console.error('Error saving PDF with downloadPdfDoc:', err);
    try {
      doc.save(cleanFileName);
      notifyDownloadSuccess(cleanFileName);
      return true;
    } catch (e) {
      notifyDownloadError(cleanFileName);
      return false;
    }
  }
}

/**
 * Downloads an image in High Resolution (Haute Résolution / HD), with optional Ultra HD upscale (2x).
 * Supports both base64 data URLs, object URLs, and remote URLs across Web and Capacitor mobile.
 */
export async function downloadImageHighRes(
  imageUrl: string,
  fileName: string = 'asrarhub-image-hd.png',
  options?: {
    upscaleFactor?: number; // 1 = full native HD, 2 = Ultra-HD 2x bicubic upscale
    format?: 'image/png' | 'image/jpeg';
    quality?: number; // 0.95 - 1.0
    skipWatermark?: boolean;
  }
): Promise<boolean> {
  const upscale = Math.max(1, Math.min(options?.upscaleFactor || 1, 4));
  const format = options?.format || 'image/png';
  const quality = options?.quality ?? (format === 'image/jpeg' ? 0.96 : 1.0);
  const ext = format === 'image/jpeg' ? '.jpg' : '.png';
  const cleanFileName = fileName.toLowerCase().endsWith(ext) ? fileName : `${fileName.replace(/\.[^/.]+$/, '')}${ext}`;

  notifyDownloadStart(cleanFileName);

  try {
    // Load image into an HTMLImageElement
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Impossible de charger l\'image en haute résolution.'));
      img.src = imageUrl;
    });

    const naturalWidth = img.naturalWidth || img.width || 1200;
    const naturalHeight = img.naturalHeight || img.height || 800;
    const targetWidth = naturalWidth * upscale;
    const targetHeight = naturalHeight * upscale;

    // Create high-resolution offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context non disponible');
    }

    // High quality rendering configuration
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If JPEG, fill white background to avoid transparent black pixels
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Apply watermark optionally (default keeps clean HD image)
    const finalCanvas = options?.skipWatermark !== false ? canvas : applyAsrarHubWatermark(canvas);
    const dataUrl = finalCanvas.toDataURL(format, quality);

    const extraData = {
      dataUrl,
      fileType: 'image' as const,
      toolRoute: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    if (Capacitor.isNativePlatform()) {
      const base64Data = dataUrl.split(',')[1];
      const path = `AsrarHub/${cleanFileName}`;

      try {
        await Filesystem.requestPermissions();
      } catch (pErr) {
        console.warn('Filesystem requestPermissions warning:', pErr);
      }

      try {
        await Filesystem.writeFile({
          path,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        notifyDownloadSuccess(cleanFileName, undefined, extraData);
        return true;
      } catch (docErr) {
        try {
          await Filesystem.writeFile({
            path: cleanFileName,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true
          });
          notifyDownloadSuccess(cleanFileName, undefined, extraData);
          return true;
        } catch (cacheErr) {
          const link = document.createElement('a');
          link.download = cleanFileName;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          notifyDownloadSuccess(cleanFileName, undefined, extraData);
          return true;
        }
      }
    } else {
      // Browser high resolution download via Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      notifyDownloadSuccess(cleanFileName, undefined, extraData);
      return true;
    }
  } catch (err) {
    console.error('Erreur lors du téléchargement en haute résolution:', err);
    // Direct fallback if canvas processing failed
    try {
      const link = document.createElement('a');
      link.download = cleanFileName;
      link.href = imageUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notifyDownloadSuccess(cleanFileName);
      return true;
    } catch (fallbackErr) {
      notifyDownloadError(cleanFileName);
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
