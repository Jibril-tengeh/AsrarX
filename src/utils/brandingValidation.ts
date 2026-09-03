/**
 * Branding Validation Utility
 * Ensures uploaded logo and loading screen images adhere to format (SVG, PNG, JPG, WebP, GIF)
 * and size constraints (< 1MB) for optimal app performance and storage efficiency.
 */

export const MAX_BRANDING_FILE_SIZE_BYTES = 5 * 1024 * 1024; // Allow up to 5MB upload with auto-compression
export const MAX_BRANDING_FILE_SIZE_MB = 5;

export const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/svg+xml',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif'
];

export const SUPPORTED_EXTENSIONS = ['.png', '.svg', '.jpg', '.jpeg', '.webp', '.gif'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  fileDetails?: {
    name: string;
    size: number;
    sizeFormatted: string;
    type: string;
    width?: number;
    height?: number;
  };
}

/**
 * Formats bytes to human-readable size string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Octets';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validates an uploaded file for branding usage
 */
export function validateBrandingFile(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'Aucun fichier sélectionné.' };
  }

  // 1. Check MIME type or extension
  const isMimeValid = SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase());
  const fileName = file.name.toLowerCase();
  const isExtensionValid = SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!isMimeValid && !isExtensionValid) {
    return {
      isValid: false,
      error: `Format non supporté (${file.type || 'Inconnu'}). Veuillez utiliser un format PNG, SVG, JPG, WebP ou GIF.`
    };
  }

  // 2. Check file size (must be <= 5MB)
  if (file.size > MAX_BRANDING_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Le fichier dépasse la limite autorisée de ${MAX_BRANDING_FILE_SIZE_MB} Mo (Taille actuelle : ${formatBytes(file.size)}). Veuillez compresser l'image.`
    };
  }

  return {
    isValid: true,
    fileDetails: {
      name: file.name,
      size: file.size,
      sizeFormatted: formatBytes(file.size),
      type: file.type
    }
  };
}

/**
 * Compresses and converts an image file to an optimized Base64 string for instant loading
 */
export function compressAndOptimizeImage(file: File, maxDimension = 512, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Preserve SVG and animated GIF as original data URLs
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      convertFileToBase64(file).then(resolve).catch(reject);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          convertFileToBase64(file).then(resolve).catch(reject);
          return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, otherwise JPEG or PNG
        let result = '';
        try {
          const optimizedDataUrl = canvas.toDataURL('image/webp', quality);
          if (optimizedDataUrl && optimizedDataUrl.startsWith('data:image/webp')) {
            result = optimizedDataUrl;
          }
        } catch {
          // Fallback to PNG / JPEG
        }

        if (!result) {
          try {
            result = canvas.toDataURL('image/png');
          } catch {
            result = canvas.toDataURL();
          }
        }

        // If oversized (> 420,000 chars), resize down to fit comfortably in Firestore
        if (result.length > 420000) {
          try {
            const smallerCanvas = document.createElement('canvas');
            const scale = Math.sqrt(350000 / result.length);
            smallerCanvas.width = Math.max(64, Math.round(width * scale));
            smallerCanvas.height = Math.max(64, Math.round(height * scale));
            const sCtx = smallerCanvas.getContext('2d');
            if (sCtx) {
              sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
              const compactWebp = smallerCanvas.toDataURL('image/webp', 0.75);
              if (compactWebp && compactWebp.length < result.length) {
                result = compactWebp;
              }
            }
          } catch (_) {}
        }

        resolve(result);
      };
      img.onerror = () => {
        convertFileToBase64(file).then(resolve).catch(reject);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a valid File to Base64 data URL string
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Erreur de conversion de l'image en base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Reads image dimensions from a Data URL
 */
export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = dataUrl;
  });
}
