/**
 * Utility to automatically extract metadata (page count, file size) from a PDF
 * using pdfjs-dist and binary fallback parsing.
 */

export function formatPdfFileSize(bytes: number): string {
  if (!bytes || bytes <= 0 || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} Ko`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} Mo`;
}

/**
 * Fast binary fallback to count pages from PDF raw text / bytes
 */
export function extractPageCountFromBinary(buffer: ArrayBuffer): number | null {
  try {
    const decoder = new TextDecoder('latin1');
    // Decode either entire buffer or last 1MB + first 1MB for speed
    const text = decoder.decode(buffer);

    // Try finding root /Count \d+ in /Type /Pages
    // Pattern: /Type\s*/Pages\s*[\s\S]*?/Count\s+(\d+) or /Count\s+(\d+)[\s\S]*?/Type\s*/Pages
    const pagesCountMatches = text.match(/\/Count\s+(\d+)/g);
    if (pagesCountMatches && pagesCountMatches.length > 0) {
      // Often the highest number in /Count represents the total pages
      let maxCount = 0;
      for (const m of pagesCountMatches) {
        const num = parseInt(m.replace(/[^0-9]/g, ''), 10);
        if (num > maxCount && num < 100000) {
          maxCount = num;
        }
      }
      if (maxCount > 0) return maxCount;
    }

    // Secondary fallback: count occurrences of /Type /Page (excluding /Pages)
    const pageMatches = text.match(/\/Type\s*\/Page[^a-zA-Z]/g);
    if (pageMatches && pageMatches.length > 0) {
      return pageMatches.length;
    }
  } catch (err) {
    console.warn('Binary PDF parse note:', err);
  }
  return null;
}

export interface PdfMetadataResult {
  pagesCount: number | null;
  fileSizeBytes: number | null;
  formattedFileSize: string | null;
}

/**
 * Detect pages count and file size from a File, Blob, ArrayBuffer, or Data URI
 */
export async function detectPdfMetadata(
  source: File | Blob | ArrayBuffer | string
): Promise<PdfMetadataResult> {
  let arrayBuffer: ArrayBuffer | null = null;
  let fileSizeBytes: number | null = null;

  try {
    if (source instanceof File) {
      fileSizeBytes = source.size;
      arrayBuffer = await source.arrayBuffer();
    } else if (source instanceof Blob) {
      fileSizeBytes = source.size;
      arrayBuffer = await source.arrayBuffer();
    } else if (source instanceof ArrayBuffer) {
      arrayBuffer = source;
      fileSizeBytes = source.byteLength;
    } else if (typeof source === 'string') {
      if (source.startsWith('data:')) {
        const parts = source.split(';base64,');
        const b64 = parts.length > 1 ? parts[1] : parts[0];
        const binaryString = atob(b64);
        const len = binaryString.length;
        fileSizeBytes = len;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer as ArrayBuffer;
      } else if (source.startsWith('http://') || source.startsWith('https://')) {
        // Try to fetch metadata
        const response = await fetch(source, { method: 'GET' });
        if (response.ok) {
          const cl = response.headers.get('content-length');
          if (cl) fileSizeBytes = parseInt(cl, 10);
          arrayBuffer = await response.arrayBuffer();
          if (!fileSizeBytes && arrayBuffer) fileSizeBytes = arrayBuffer.byteLength;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading PDF source for metadata:', e);
  }

  const formattedFileSize = fileSizeBytes ? formatPdfFileSize(fileSizeBytes) : null;
  let pagesCount: number | null = null;

  if (arrayBuffer) {
    // 1. Try with pdfjs-dist
    try {
      const pdfjsLib = await import('pdfjs-dist');
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${
          pdfjsLib.version || '4.0.379'
        }/build/pdf.worker.min.mjs`;
      } catch (_) {}

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const doc = await loadingTask.promise;
      if (doc && typeof doc.numPages === 'number' && doc.numPages > 0) {
        pagesCount = doc.numPages;
      }
    } catch (pdfjsErr) {
      console.warn('pdfjs-dist failed, falling back to binary parser:', pdfjsErr);
    }

    // 2. Fallback to binary pattern extraction if pdfjs didn't return a count
    if (!pagesCount) {
      pagesCount = extractPageCountFromBinary(arrayBuffer);
    }
  }

  return {
    pagesCount,
    fileSizeBytes,
    formattedFileSize,
  };
}
