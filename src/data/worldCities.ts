export interface WorldCity {
  id: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  countryFr: string;
  countryEn: string;
  continent: 'africa' | 'asia' | 'europe' | 'americas' | 'oceania';
  flag: string;
  lat: number;
  lng: number;
  abjadVal?: number;
}

export const CONTINENTS = [
  { id: 'all', nameFr: 'Tous les Continents', nameEn: 'All Continents', nameHa: 'Dukkan Nahiyoyi', icon: '🌍' },
  { id: 'africa', nameFr: 'Afrique', nameEn: 'Africa', nameHa: 'Afirka', icon: '🌍' },
  { id: 'asia', nameFr: 'Asie & Moyen-Orient', nameEn: 'Asia & Middle East', nameHa: 'Asiya da Gabas Ta Tsakiya', icon: '🕌' },
  { id: 'europe', nameFr: 'Europe', nameEn: 'Europe', nameHa: 'Turai', icon: '🏰' },
  { id: 'americas', nameFr: 'Amériques', nameEn: 'Americas', nameHa: 'Amirka', icon: '🗽' },
  { id: 'oceania', nameFr: 'Océanie', nameEn: 'Oceania', nameHa: 'Oshiniya', icon: '🌊' }
] as const;

export const WORLD_CITIES: WorldCity[] = [
  // ==================== AFRIQUE ====================
  // Sénégal
  { id: 'dakar', nameFr: 'Dakar', nameEn: 'Dakar', nameHa: 'Dakar', arabicName: 'داكار', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 14.7167, lng: -17.4677 },
  { id: 'touba', nameFr: 'Touba', nameEn: 'Touba', nameHa: 'Touba', arabicName: 'طوبى', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 14.8667, lng: -15.8833 },
  { id: 'saint-louis', nameFr: 'Saint-Louis (Ndar)', nameEn: 'Saint-Louis', nameHa: 'Ndar', arabicName: 'نذار', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 16.0326, lng: -16.4818 },
  { id: 'ziguinchor', nameFr: 'Ziguinchor', nameEn: 'Ziguinchor', nameHa: 'Ziguinchor', arabicName: 'زيغينشور', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 12.5680, lng: -16.2730 },
  { id: 'kaolack', nameFr: 'Kaolack', nameEn: 'Kaolack', nameHa: 'Kaolack', arabicName: 'كولاك', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 14.1500, lng: -16.0833 },
  { id: 'thies', nameFr: 'Thiès', nameEn: 'Thies', nameHa: 'Thies', arabicName: 'ثيس', countryFr: 'Sénégal', countryEn: 'Senegal', continent: 'africa', flag: '🇸🇳', lat: 14.7833, lng: -16.9333 },

  // Maroc
  { id: 'fez', nameFr: 'Fès', nameEn: 'Fez', nameHa: 'Fas', arabicName: 'فاس', countryFr: 'Maroc', countryEn: 'Morocco', continent: 'africa', flag: '🇲🇦', lat: 34.0333, lng: -5.0000 },
  { id: 'rabat', nameFr: 'Rabat', nameEn: 'Rabat', nameHa: 'Rabat', arabicName: 'الرباط', countryFr: 'Maroc', countryEn: 'Morocco', continent: 'africa', flag: '🇲🇦', lat: 34.0209, lng: -6.8416 },
  { id: 'casablanca', nameFr: 'Casablanca', nameEn: 'Casablanca', nameHa: 'Casablanca', arabicName: 'الدار البيضاء', countryFr: 'Maroc', countryEn: 'Morocco', continent: 'africa', flag: '🇲🇦', lat: 33.5731, lng: -7.5898 },
  { id: 'marrakech', nameFr: 'Marrakech', nameEn: 'Marrakech', nameHa: 'Marrakech', arabicName: 'مراكش', countryFr: 'Maroc', countryEn: 'Morocco', continent: 'africa', flag: '🇲🇦', lat: 31.6295, lng: -7.9811 },
  { id: 'tanger', nameFr: 'Tanger', nameEn: 'Tangier', nameHa: 'Tanger', arabicName: 'طنجة', countryFr: 'Maroc', countryEn: 'Morocco', continent: 'africa', flag: '🇲🇦', lat: 35.7595, lng: -5.8340 },

  // Mali
  { id: 'bamako', nameFr: 'Bamako', nameEn: 'Bamako', nameHa: 'Bamako', arabicName: 'باماكو', countryFr: 'Mali', countryEn: 'Mali', continent: 'africa', flag: '🇲🇱', lat: 12.6392, lng: -8.0029 },
  { id: 'timbuktu', nameFr: 'Tombouctou', nameEn: 'Timbuktu', nameHa: 'Timbuktu', arabicName: 'تنبكتو', countryFr: 'Mali', countryEn: 'Mali', continent: 'africa', flag: '🇲🇱', lat: 16.7666, lng: -3.0072 },
  { id: 'djenne', nameFr: 'Djenné', nameEn: 'Djenne', nameHa: 'Djenne', arabicName: 'جني', countryFr: 'Mali', countryEn: 'Mali', continent: 'africa', flag: '🇲🇱', lat: 13.9061, lng: -4.5533 },
  { id: 'gao', nameFr: 'Gao', nameEn: 'Gao', nameHa: 'Gao', arabicName: 'غاو', countryFr: 'Mali', countryEn: 'Mali', continent: 'africa', flag: '🇲🇱', lat: 16.2717, lng: -0.0447 },

  // Nigeria
  { id: 'kano', nameFr: 'Kano', nameEn: 'Kano', nameHa: 'Kano', arabicName: 'كانو', countryFr: 'Nigeria', countryEn: 'Nigeria', continent: 'africa', flag: '🇳🇬', lat: 12.0022, lng: 8.5920 },
  { id: 'abuja', nameFr: 'Abuja', nameEn: 'Abuja', nameHa: 'Abuja', arabicName: 'أبوجه', countryFr: 'Nigeria', countryEn: 'Nigeria', continent: 'africa', flag: '🇳🇬', lat: 9.0765, lng: 7.3986 },
  { id: 'lagos', nameFr: 'Lagos', nameEn: 'Lagos', nameHa: 'Lagos', arabicName: 'لاغوس', countryFr: 'Nigeria', countryEn: 'Nigeria', continent: 'africa', flag: '🇳🇬', lat: 6.5244, lng: 3.3792 },
  { id: 'sokoto', nameFr: 'Sokoto', nameEn: 'Sokoto', nameHa: 'Sokoto', arabicName: 'صكتو', countryFr: 'Nigeria', countryEn: 'Nigeria', continent: 'africa', flag: '🇳🇬', lat: 13.0622, lng: 5.2339 },

  // Niger
  { id: 'niamey', nameFr: 'Niamey', nameEn: 'Niamey', nameHa: 'Niamey', arabicName: 'نيامي', countryFr: 'Niger', countryEn: 'Niger', continent: 'africa', flag: '🇳🇪', lat: 13.5116, lng: 2.1254 },
  { id: 'agadez', nameFr: 'Agadez', nameEn: 'Agadez', nameHa: 'Agadez', arabicName: 'أغاديز', countryFr: 'Niger', countryEn: 'Niger', continent: 'africa', flag: '🇳🇪', lat: 16.9733, lng: 7.9908 },
  { id: 'zinder', nameFr: 'Zinder', nameEn: 'Zinder', nameHa: 'Zinder', arabicName: 'زيندر', countryFr: 'Niger', countryEn: 'Niger', continent: 'africa', flag: '🇳🇪', lat: 13.8072, lng: 8.9881 },

  // Mauritanie
  { id: 'nouakchott', nameFr: 'Nouakchott', nameEn: 'Nouakchott', nameHa: 'Nouakchott', arabicName: 'نواكشوط', countryFr: 'Mauritanie', countryEn: 'Mauritania', continent: 'africa', flag: '🇲🇷', lat: 18.0735, lng: -15.9582 },
  { id: 'chinguetti', nameFr: 'Chinguetti', nameEn: 'Chinguetti', nameHa: 'Chinguetti', arabicName: 'شنقيط', countryFr: 'Mauritanie', countryEn: 'Mauritania', continent: 'africa', flag: '🇲🇷', lat: 20.4608, lng: -12.3662 },

  // Burkina Faso
  { id: 'ouagadougou', nameFr: 'Ouagadougou', nameEn: 'Ouagadougou', nameHa: 'Ouagadougou', arabicName: 'واغادوغو', countryFr: 'Burkina Faso', countryEn: 'Burkina Faso', continent: 'africa', flag: '🇧🇫', lat: 12.3714, lng: -1.5197 },
  { id: 'bobo-dioulasso', nameFr: 'Bobo-Dioulasso', nameEn: 'Bobo-Dioulasso', nameHa: 'Bobo-Dioulasso', arabicName: 'بويو ديولاسو', countryFr: 'Burkina Faso', countryEn: 'Burkina Faso', continent: 'africa', flag: '🇧🇫', lat: 11.1772, lng: -4.2979 },

  // Côte d'Ivoire
  { id: 'abidjan', nameFr: 'Abidjan', nameEn: 'Abidjan', nameHa: 'Abidjan', arabicName: 'أبيدجان', countryFr: "Côte d'Ivoire", countryEn: 'Ivory Coast', continent: 'africa', flag: '🇨🇮', lat: 5.3600, lng: -4.0083 },
  { id: 'yamoussoukro', nameFr: 'Yamoussoukro', nameEn: 'Yamoussoukro', nameHa: 'Yamoussoukro', arabicName: 'ياموسوكرو', countryFr: "Côte d'Ivoire", countryEn: 'Ivory Coast', continent: 'africa', flag: '🇨🇮', lat: 6.8276, lng: -5.2893 },

  // Guinée
  { id: 'conakry', nameFr: 'Conakry', nameEn: 'Conakry', nameHa: 'Conakry', arabicName: 'كوناكري', countryFr: 'Guinée', countryEn: 'Guinea', continent: 'africa', flag: '🇬🇳', lat: 9.6412, lng: -13.5784 },
  { id: 'kankan', nameFr: 'Kankan', nameEn: 'Kankan', nameHa: 'Kankan', arabicName: 'كانكان', countryFr: 'Guinée', countryEn: 'Guinea', continent: 'africa', flag: '🇬🇳', lat: 10.3858, lng: -9.3057 },

  // Tchad
  { id: 'ndjamena', nameFr: "N'Djamena", nameEn: "N'Djamena", nameHa: "N'Djamena", arabicName: 'نجامينا', countryFr: 'Tchad', countryEn: 'Chad', continent: 'africa', flag: '🇹🇩', lat: 12.1348, lng: 15.0557 },

  // Égypte
  { id: 'cairo', nameFr: 'Le Caire', nameEn: 'Cairo', nameHa: 'Cairo', arabicName: 'القاهرة', countryFr: 'Égypte', countryEn: 'Egypt', continent: 'africa', flag: '🇪🇬', lat: 30.0444, lng: 31.2357 },
  { id: 'alexandria', nameFr: 'Alexandrie', nameEn: 'Alexandria', nameHa: 'Alexandria', arabicName: 'الإسكندرية', countryFr: 'Égypte', countryEn: 'Egypt', continent: 'africa', flag: '🇪🇬', lat: 31.2001, lng: 29.9187 },

  // Algérie
  { id: 'algiers', nameFr: 'Alger', nameEn: 'Algiers', nameHa: 'Alger', arabicName: 'الجزائر', countryFr: 'Algérie', countryEn: 'Algeria', continent: 'africa', flag: '🇩🇿', lat: 36.7538, lng: 3.0588 },
  { id: 'oran', nameFr: 'Oran', nameEn: 'Oran', nameHa: 'Oran', arabicName: 'وهران', countryFr: 'Algérie', countryEn: 'Algeria', continent: 'africa', flag: '🇩🇿', lat: 35.6971, lng: -0.6308 },
  { id: 'tlemcen', nameFr: 'Tlemcen', nameEn: 'Tlemcen', nameHa: 'Tlemcen', arabicName: 'تلمسان', countryFr: 'Algérie', countryEn: 'Algeria', continent: 'africa', flag: '🇩🇿', lat: 34.8783, lng: -1.3150 },

  // Tunisie
  { id: 'tunis', nameFr: 'Tunis', nameEn: 'Tunis', nameHa: 'Tunis', arabicName: 'تونس', countryFr: 'Tunisie', countryEn: 'Tunisia', continent: 'africa', flag: '🇹🇳', lat: 36.8065, lng: 10.1815 },
  { id: 'kairouan', nameFr: 'Kairouan', nameEn: 'Kairouan', nameHa: 'Kairouan', arabicName: 'القيروان', countryFr: 'Tunisie', countryEn: 'Tunisia', continent: 'africa', flag: '🇹🇳', lat: 35.6781, lng: 10.0963 },

  // Soudan
  { id: 'khartoum', nameFr: 'Khartoum', nameEn: 'Khartoum', nameHa: 'Khartoum', arabicName: 'الخرطوم', countryFr: 'Soudan', countryEn: 'Sudan', continent: 'africa', flag: '🇸🇩', lat: 15.5007, lng: 32.5599 },

  // Cameroun & Gabon & Congo & Éthiopie & Kenya & Afrique du Sud & Ghana
  { id: 'yaounde', nameFr: 'Yaoundé', nameEn: 'Yaounde', nameHa: 'Yaounde', arabicName: 'ياوندي', countryFr: 'Cameroun', countryEn: 'Cameroon', continent: 'africa', flag: '🇨🇲', lat: 3.8480, lng: 11.5021 },
  { id: 'douala', nameFr: 'Douala', nameEn: 'Douala', nameHa: 'Douala', arabicName: 'دوألا', countryFr: 'Cameroun', countryEn: 'Cameroon', continent: 'africa', flag: '🇨🇲', lat: 4.0511, lng: 9.7679 },
  { id: 'libreville', nameFr: 'Libreville', nameEn: 'Libreville', nameHa: 'Libreville', arabicName: 'ليبرفيل', countryFr: 'Gabon', countryEn: 'Gabon', continent: 'africa', flag: '🇬🇦', lat: 0.4162, lng: 9.4673 },
  { id: 'kinshasa', nameFr: 'Kinshasa', nameEn: 'Kinshasa', nameHa: 'Kinshasa', arabicName: 'كينشاسا', countryFr: 'Congo RDC', countryEn: 'DR Congo', continent: 'africa', flag: '🇨🇩', lat: -4.4419, lng: 15.2663 },
  { id: 'addis-ababa', nameFr: 'Addis-Abeba', nameEn: 'Addis Ababa', nameHa: 'Addis Ababa', arabicName: 'أديس أبابا', countryFr: 'Éthiopie', countryEn: 'Ethiopia', continent: 'africa', flag: '🇪🇹', lat: 9.0300, lng: 38.7400 },
  { id: 'nairobi', nameFr: 'Nairobi', nameEn: 'Nairobi', nameHa: 'Nairobi', arabicName: 'نيروبي', countryFr: 'Kenya', countryEn: 'Kenya', continent: 'africa', flag: '🇰🇪', lat: -1.2921, lng: 36.8219 },
  { id: 'accra', nameFr: 'Accra', nameEn: 'Accra', nameHa: 'Accra', arabicName: 'أكرا', countryFr: 'Ghana', countryEn: 'Ghana', continent: 'africa', flag: '🇬🇭', lat: 5.6037, lng: -0.1870 },
  { id: 'lomé', nameFr: 'Lomé', nameEn: 'Lome', nameHa: 'Lome', arabicName: 'لومي', countryFr: 'Togo', countryEn: 'Togo', continent: 'africa', flag: '🇹🇬', lat: 6.1375, lng: 1.2125 },
  { id: 'cotonou', nameFr: 'Cotonou', nameEn: 'Cotonou', nameHa: 'Cotonou', arabicName: 'كوتونو', countryFr: 'Bénin', countryEn: 'Benin', continent: 'africa', flag: '🇧🇯', lat: 6.3703, lng: 2.3963 },

  // ==================== ASIE & MOYEN-ORIENT ====================
  { id: 'makkah', nameFr: 'La Mecque (Makkah)', nameEn: 'Mecca (Makkah)', nameHa: 'Makkah', arabicName: 'مكة المكرمة', countryFr: 'Arabie Saoudite', countryEn: 'Saudi Arabia', continent: 'asia', flag: '🇸🇦', lat: 21.4225, lng: 39.8262 },
  { id: 'madinah', nameFr: 'Médine (Madinah)', nameEn: 'Medina (Madinah)', nameHa: 'Madina', arabicName: 'المدينة المنورة', countryFr: 'Arabie Saoudite', countryEn: 'Saudi Arabia', continent: 'asia', flag: '🇸🇦', lat: 24.4672, lng: 39.6111 },
  { id: 'riyadh', nameFr: 'Riyad', nameEn: 'Riyadh', nameHa: 'Riyadh', arabicName: 'الرياض', countryFr: 'Arabie Saoudite', countryEn: 'Saudi Arabia', continent: 'asia', flag: '🇸🇦', lat: 24.7136, lng: 46.6753 },
  { id: 'jeddah', nameFr: 'Djeddah', nameEn: 'Jeddah', nameHa: 'Jeddah', arabicName: 'جدة', countryFr: 'Arabie Saoudite', countryEn: 'Saudi Arabia', continent: 'asia', flag: '🇸🇦', lat: 21.5433, lng: 39.1728 },

  { id: 'jerusalem', nameFr: 'Jérusalem (Al-Quds)', nameEn: 'Jerusalem (Al-Quds)', nameHa: 'Jerusalem', arabicName: 'القدس الشريف', countryFr: 'Palestine', countryEn: 'Palestine', continent: 'asia', flag: '🇵🇸', lat: 31.7780, lng: 35.2354 },
  { id: 'hebron', nameFr: 'Hébron (Al-Khalil)', nameEn: 'Hebron', nameHa: 'Al-Khalil', arabicName: 'الخليل', countryFr: 'Palestine', countryEn: 'Palestine', continent: 'asia', flag: '🇵🇸', lat: 31.5326, lng: 35.0998 },

  { id: 'istanbul', nameFr: 'Istanbul', nameEn: 'Istanbul', nameHa: 'Istanbul', arabicName: 'إسطنبول', countryFr: 'Turquie', countryEn: 'Turkey', continent: 'asia', flag: '🇹🇷', lat: 41.0082, lng: 28.9784 },
  { id: 'konya', nameFr: 'Konya', nameEn: 'Konya', nameHa: 'Konya', arabicName: 'قونية', countryFr: 'Turquie', countryEn: 'Turkey', continent: 'asia', flag: '🇹🇷', lat: 37.8746, lng: 32.4932 },

  { id: 'baghdad', nameFr: 'Bagdad', nameEn: 'Baghdad', nameHa: 'Baghdad', arabicName: 'بغداد', countryFr: 'Irak', countryEn: 'Iraq', continent: 'asia', flag: '🇮🇶', lat: 33.3152, lng: 44.3661 },
  { id: 'najaf', nameFr: 'Najaf', nameEn: 'Najaf', nameHa: 'Najaf', arabicName: 'النجف', countryFr: 'Irak', countryEn: 'Iraq', continent: 'asia', flag: '🇮🇶', lat: 32.0000, lng: 44.3333 },

  { id: 'tehran', nameFr: 'Téhéran', nameEn: 'Tehran', nameHa: 'Tehran', arabicName: 'طهران', countryFr: 'Iran', countryEn: 'Iran', continent: 'asia', flag: '🇮🇷', lat: 35.6892, lng: 51.3890 },
  { id: 'mashhad', nameFr: 'Mashhad', nameEn: 'Mashhad', nameHa: 'Mashhad', arabicName: 'مشهد', countryFr: 'Iran', countryEn: 'Iran', continent: 'asia', flag: '🇮🇷', lat: 36.2972, lng: 59.6062 },

  { id: 'damascus', nameFr: 'Damas', nameEn: 'Damascus', nameHa: 'Damascus', arabicName: 'دمشق', countryFr: 'Syrie', countryEn: 'Syria', continent: 'asia', flag: '🇸🇾', lat: 33.5138, lng: 36.2765 },
  { id: 'dubai', nameFr: 'Dubaï', nameEn: 'Dubai', nameHa: 'Dubai', arabicName: 'دبي', countryFr: 'Émirats Arabes Unis', countryEn: 'UAE', continent: 'asia', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },

  { id: 'samarkand', nameFr: 'Samarcande', nameEn: 'Samarkand', nameHa: 'Samarkand', arabicName: 'سمرقند', countryFr: 'Ouzbékistan', countryEn: 'Uzbekistan', continent: 'asia', flag: '🇺🇿', lat: 39.6542, lng: 66.9597 },
  { id: 'bukhara', nameFr: 'Boukhara', nameEn: 'Bukhara', nameHa: 'Bukhara', arabicName: 'بخارى', countryFr: 'Ouzbékistan', countryEn: 'Uzbekistan', continent: 'asia', flag: '🇺🇿', lat: 39.7747, lng: 64.4286 },

  { id: 'delhi', nameFr: 'Delhi', nameEn: 'Delhi', nameHa: 'Delhi', arabicName: 'دلهي', countryFr: 'Inde', countryEn: 'India', continent: 'asia', flag: '🇮🇳', lat: 28.6139, lng: 77.2090 },
  { id: 'ajmer', nameFr: 'Ajmer', nameEn: 'Ajmer', nameHa: 'Ajmer', arabicName: 'أجمير', countryFr: 'Inde', countryEn: 'India', continent: 'asia', flag: '🇮🇳', lat: 26.4499, lng: 74.6399 },

  { id: 'lahore', nameFr: 'Lahore', nameEn: 'Lahore', nameHa: 'Lahore', arabicName: 'لاهور', countryFr: 'Pakistan', countryEn: 'Pakistan', continent: 'asia', flag: '🇵🇰', lat: 31.5204, lng: 74.3587 },
  { id: 'jakarta', nameFr: 'Jakarta', nameEn: 'Jakarta', nameHa: 'Jakarta', arabicName: 'جاكرتا', countryFr: 'Indonésie', countryEn: 'Indonesia', continent: 'asia', flag: '🇮🇩', lat: -6.2088, lng: 106.8456 },
  { id: 'banda-aceh', nameFr: 'Banda Aceh', nameEn: 'Banda Aceh', nameHa: 'Banda Aceh', arabicName: 'باندا أتشيه', countryFr: 'Indonésie', countryEn: 'Indonesia', continent: 'asia', flag: '🇮🇩', lat: 5.5483, lng: 95.3238 },
  { id: 'kuala-lumpur', nameFr: 'Kuala Lumpur', nameEn: 'Kuala Lumpur', nameHa: 'Kuala Lumpur', arabicName: 'كوالالمبور', countryFr: 'Malaisie', countryEn: 'Malaysia', continent: 'asia', flag: '🇲🇾', lat: 3.1390, lng: 101.6869 },

  // ==================== EUROPE ====================
  { id: 'paris', nameFr: 'Paris', nameEn: 'Paris', nameHa: 'Paris', arabicName: 'باريس', countryFr: 'France', countryEn: 'France', continent: 'europe', flag: '🇫🇷', lat: 48.8566, lng: 2.3522 },
  { id: 'lyon', nameFr: 'Lyon', nameEn: 'Lyon', nameHa: 'Lyon', arabicName: 'ليون', countryFr: 'France', countryEn: 'France', continent: 'europe', flag: '🇫🇷', lat: 45.7640, lng: 4.8357 },
  { id: 'marseille', nameFr: 'Marseille', nameEn: 'Marseille', nameHa: 'Marseille', arabicName: 'مارسيليا', countryFr: 'France', countryEn: 'France', continent: 'europe', flag: '🇫🇷', lat: 43.2965, lng: 5.3698 },

  { id: 'london', nameFr: 'Londres', nameEn: 'London', nameHa: 'London', arabicName: 'لندن', countryFr: 'Royaume-Uni', countryEn: 'United Kingdom', continent: 'europe', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },

  { id: 'cordoba', nameFr: 'Cordoue', nameEn: 'Cordoba', nameHa: 'Cordoba', arabicName: 'قرطبة', countryFr: 'Espagne', countryEn: 'Spain', continent: 'europe', flag: '🇪🇸', lat: 37.8882, lng: -4.7794 },
  { id: 'granada', nameFr: 'Grenade', nameEn: 'Granada', nameHa: 'Granada', arabicName: 'غرناطة', countryFr: 'Espagne', countryEn: 'Spain', continent: 'europe', flag: '🇪🇸', lat: 37.1773, lng: -3.5986 },
  { id: 'madrid', nameFr: 'Madrid', nameEn: 'Madrid', nameHa: 'Madrid', arabicName: 'مدريد', countryFr: 'Espagne', countryEn: 'Spain', continent: 'europe', flag: '🇪🇸', lat: 40.4168, lng: -3.7038 },

  { id: 'berlin', nameFr: 'Berlin', nameEn: 'Berlin', nameHa: 'Berlin', arabicName: 'برلين', countryFr: 'Allemagne', countryEn: 'Germany', continent: 'europe', flag: '🇩🇪', lat: 52.5200, lng: 13.4050 },
  { id: 'sarajevo', nameFr: 'Sarajevo', nameEn: 'Sarajevo', nameHa: 'Sarajevo', arabicName: 'سراييفو', countryFr: 'Bosnie-Herzégovine', countryEn: 'Bosnia', continent: 'europe', flag: '🇧🇦', lat: 43.8563, lng: 18.4131 },
  { id: 'moscow', nameFr: 'Moscou', nameEn: 'Moscow', nameHa: 'Moscow', arabicName: 'موسكو', countryFr: 'Russie', countryEn: 'Russia', continent: 'europe', flag: '🇷🇺', lat: 55.7558, lng: 37.6173 },

  // ==================== AMÉRIQUES ====================
  { id: 'new-york', nameFr: 'New York', nameEn: 'New York', nameHa: 'New York', arabicName: 'نيويورك', countryFr: 'États-Unis', countryEn: 'United States', continent: 'americas', flag: '🇺🇸', lat: 40.7128, lng: -74.0060 },
  { id: 'washington', nameFr: 'Washington D.C.', nameEn: 'Washington D.C.', nameHa: 'Washington D.C.', arabicName: 'واشنطن', countryFr: 'États-Unis', countryEn: 'United States', continent: 'americas', flag: '🇺🇸', lat: 38.9072, lng: -77.0369 },
  { id: 'montreal', nameFr: 'Montréal', nameEn: 'Montreal', nameHa: 'Montreal', arabicName: 'مونتريال', countryFr: 'Canada', countryEn: 'Canada', continent: 'americas', flag: '🇨🇦', lat: 45.5017, lng: -73.5673 },
  { id: 'mexico-city', nameFr: 'Mexico', nameEn: 'Mexico City', nameHa: 'Mexico City', arabicName: 'مكسيكو', countryFr: 'Mexique', countryEn: 'Mexico', continent: 'americas', flag: '🇲🇽', lat: 19.4326, lng: -99.1332 },
  { id: 'sao-paulo', nameFr: 'Sào Paulo', nameEn: 'Sao Paulo', nameHa: 'Sao Paulo', arabicName: 'ساو باولو', countryFr: 'Brésil', countryEn: 'Brazil', continent: 'americas', flag: '🇧🇷', lat: -23.5505, lng: -46.6333 },

  // ==================== OCÉANIE ====================
  { id: 'sydney', nameFr: 'Sydney', nameEn: 'Sydney', nameHa: 'Sydney', arabicName: 'سيدني', countryFr: 'Australie', countryEn: 'Australia', continent: 'oceania', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 },
  { id: 'auckland', nameFr: 'Auckland', nameEn: 'Auckland', nameHa: 'Auckland', arabicName: 'أوكلاند', countryFr: 'Nouvelle-Zélande', countryEn: 'New Zealand', continent: 'oceania', flag: '🇳🇿', lat: -36.8485, lng: 174.7633 }
];
