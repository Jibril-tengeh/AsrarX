export type Category = string;

export interface AsrarItem {
  id: string;
  title: string;
  hook?: string; // Short hook text
  category: Category;
  subCategory?: string;
  status?: string;
  verse?: string; // Optional related Quran verse
  reference?: string; // e.g. Sourate Al-Baqarah, verset 255
  content: string;
  benefits: string[];
  imageUrl?: string; // URL for the thumbnail image
  audioUrl?: string; // Dedicated audio recording or Wird audio
  audio_url?: string;
  isPremium?: boolean;
  createdAt: string;
  title_en?: string;
  content_en?: string;
  hook_en?: string;
  title_ha?: string;
  content_ha?: string;
  hook_ha?: string;
  title_fr?: string;
  content_fr?: string;
  hook_fr?: string;
  hasManualTranslation?: boolean;
}
