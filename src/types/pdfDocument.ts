export interface PdfDocument {
  id: string;
  title: string;
  title_en?: string;
  title_ha?: string;
  description: string;
  description_en?: string;
  description_ha?: string;
  author?: string;
  category: 'asrar' | 'invocations' | 'tafsir' | 'manuscrits' | 'sciences_lettres' | 'spiritualite' | 'divers';
  language: 'fr' | 'ar' | 'en' | 'ha' | 'mixed';
  pdfUrl: string;
  coverUrl?: string;
  fileSize?: string;
  pagesCount?: number;
  isPremium: boolean;
  isMaintenance: boolean;
  maintenanceMessage?: string;
  downloadCount?: number;
  viewCount?: number;
  publishedAt: string;
  tags?: string[];
  featured?: boolean;
}

export interface OfflineStoredPdf {
  id: string;
  blob: Blob;
  dataUrl?: string;
  metadata: PdfDocument;
  downloadedAt: number;
  sizeBytes: number;
}
