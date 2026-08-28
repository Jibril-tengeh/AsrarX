import { VideoCardThemeId } from './updateCards';

export interface PromoAnnouncement {
  id: string;
  isActive: boolean;
  promoCode: string;
  videoCardTheme: VideoCardThemeId;
  
  // Titles
  titleFr: string;
  titleEn: string;
  titleHa: string;
  
  // Descriptions / Details
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
  
  // Badges (e.g. "OFFRE FLASH VIP", "CODE PROMO OFFICIEL")
  badgeFr: string;
  badgeEn: string;
  badgeHa: string;
  
  // Benefit label (e.g. "⚡ 2 Heures VIP Offertes", "-50% de Réduction", "Accès Illimité")
  benefitFr: string;
  benefitEn: string;
  benefitHa: string;
  
  // Call to action button text
  ctaTextFr: string;
  ctaTextEn: string;
  ctaTextHa: string;

  // Features list (Bullet points)
  perksFr?: string[];
  perksEn?: string[];
  perksHa?: string[];
  
  // Expiration & countdown
  hasExpiry: boolean;
  expiryDate?: string; // ISO date string or timestamp e.g. "2026-09-01T23:59:59"
  
  // Display locations
  showAsModal: boolean; // Interactive video popup for visitors
  showInBanner: boolean; // Top banner across pages
  targetPages?: ('all' | 'home' | 'store' | 'payment')[];
  
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export const DEFAULT_PROMO_ANNOUNCEMENT: PromoAnnouncement = {
  id: 'active_announcement',
  isActive: true,
  promoCode: 'VIP2H',
  videoCardTheme: 'golden-geometry',
  
  titleFr: 'Offre Spéciale Asrar VIP Débloquée !',
  titleEn: 'Special Asrar VIP Offer Unlocked!',
  titleHa: 'Babban Rangwamen Asrar VIP!',
  
  descriptionFr: 'Bénéficiez d\'un accès complet à tous les grands Wirds, secrets sacrés et calculs Abjad avec notre code promo exclusif.',
  descriptionEn: 'Enjoy full access to all sacred Wirds, secret recipes, and Abjad calculations with our exclusive promo code.',
  descriptionHa: 'Samu cikakken damar shiga dukkan Wirdodi, asirai masu tsarki da lissafin Abjad tare da lambar rangwame.',
  
  badgeFr: '👑 OFFRE FLASH VIP',
  badgeEn: '👑 VIP FLASH PROMO',
  badgeHa: '👑 BABBAN RANGWAME',
  
  benefitFr: '⚡ 2 Heures VIP Offertes Immédiatement',
  benefitEn: '⚡ 2 Hours Free VIP Access',
  benefitHa: '⚡ Awanni 2 Na Kyauta a VIP',
  
  ctaTextFr: 'Copier & Débloquer VIP',
  ctaTextEn: 'Copy Code & Unlock VIP',
  ctaTextHa: 'Kwafi Lambar & Bude VIP',
  
  perksFr: [
    'Déblocage immédiat de tous les wirds & secrets',
    'Accès au moteur d\'écoute audio des récitateurs',
    'Calculateur Abjad et géométrie sacrée illimités',
    'Activation 100% gratuite et instantanée'
  ],
  perksEn: [
    'Instant unlock of all wirds & sacred secrets',
    'Full access to audio reciters and Ruqyah engine',
    'Unlimited Abjad calculator & sacred geometry',
    '100% free and instant activation'
  ],
  perksHa: [
    'Bude dukkan wirdodi da asirai nan take',
    'Sauraron makaranta da Ruqyah a ko da yaushe',
    'Lissafin Abjad da sirrin haruffa ba iyaka',
    'Kunna aiki cikin sauki da sauri kyauta'
  ],
  
  hasExpiry: false,
  expiryDate: '',
  showAsModal: true,
  showInBanner: true,
  targetPages: ['all'],
  
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'Admin'
};
