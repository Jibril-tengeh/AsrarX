import { PdfDocument } from '../types/pdfDocument';

/**
 * Retrieves the appropriate cover / thumbnail URL for a PDF based on user's active language.
 * Falls back gracefully to default cover or other language covers if missing.
 */
export function getPdfCoverUrl(pdf?: Partial<PdfDocument> | null, language: string = 'fr'): string | undefined {
  if (!pdf) return undefined;
  
  if (language === 'en') {
    return pdf.coverUrl_en || pdf.coverUrl || pdf.coverUrl_ha;
  }
  
  if (language === 'ha') {
    return pdf.coverUrl_ha || pdf.coverUrl || pdf.coverUrl_en;
  }
  
  // Default to French / generic coverUrl
  return pdf.coverUrl || pdf.coverUrl_en || pdf.coverUrl_ha;
}

/**
 * Compresses and converts an uploaded image File into an optimized WebP / JPEG Data URL.
 * Allows admins to upload book covers directly from their device without needing external URLs.
 */
export async function compressImageFileToDataUrl(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic verification
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier sélectionné n’est pas une image valide.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Impossible de charger l’image pour compression.'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio scaling (max 800x1200 for book covers)
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if 2D context fails
          resolve(reader.result as string);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for ultra-lightweight size, fallback to JPEG
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData && webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch (e) {
          // Ignore and use jpeg
        }

        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
