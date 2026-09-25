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
  coverUrl_en?: string;
  coverUrl_ha?: string;
  // Thumbnail display & adaptation options (Admin controllable)
  coverFit?: 'cover' | 'contain' | 'fill';
  coverScale?: number; // scale percent e.g. 50 to 100 (default 100)
  coverAspectRatio?: 'book' | 'portrait' | 'square' | 'auto';
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

  // Commercial Selling Options (Set by Admin)
  isForSale?: boolean;
  price?: number;
  originalPrice?: number;
  currency?: string; // 'FCFA' | 'USD' | 'EUR' | 'NGN' | 'GHS'
  freeForVip?: boolean;
  vipDiscountPercent?: number;
  salesCount?: number;
}

export interface PdfPurchaseRecord {
  id: string; // `${userId}_${pdfId}`
  userId: string;
  userEmail: string;
  userName?: string;
  pdfId: string;
  pdfTitle: string;
  amount: number;
  currency: string;
  paymentMethod: 'paystack' | 'card' | 'mobile_money' | 'spiritual_points' | 'admin_grant' | 'direct';
  paymentReference: string;
  purchasedAt: string;
  securityHash: string;
  status: 'completed' | 'refunded' | 'revoked';
}

export interface OfflineStoredPdf {
  id: string;
  blob: Blob;
  dataUrl?: string;
  metadata: PdfDocument;
  downloadedAt: number;
  sizeBytes: number;
  securityToken?: string;
}
