import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  MapPin,
  Sun,
  Globe,
  Sparkles,
  Info,
  Layers,
  Clock,
  RefreshCw,
  Copy,
  Check,
  Navigation,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Share2,
  ChevronRight,
  ShieldAlert,
  Search,
  Map,
  RotateCw,
  Calendar,
  X,
  Crosshair,
  Download,
  Wand2,
  Scroll,
  ShieldCheck,
  FileText,
  Palette,
  ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateAbjadValue, numberToAbjadLetters } from '../../../utils/abjad';
import { saveCalculationToHistory } from '../../../utils/calculationHistory';
import { applyTashkeel } from '../../../utils/tashkeel';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import ContinentCitySelector from '../../../components/sacredGeography/ContinentCitySelector';
import InteractiveMap from '../../../components/sacredGeography/InteractiveMap';
import CityComparisonTab from '../../../components/sacredGeography/CityComparisonTab';
import { WORLD_CITIES } from '../../../data/worldCities';

// Preset Sacred & Historical Centers
interface SacredCenter {
  id: string;
  flag: string;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  lat: number;
  lng: number;
  abjadVal: number;
  descriptionFr: string;
  descriptionEn: string;
  descriptionHa: string;
}

const SACRED_CENTERS: SacredCenter[] = [
  {
    id: 'makkah',
    flag: '🇸🇦',
    nameFr: 'La Mecque (Kaaba)',
    nameEn: 'Mecca (Kaaba)',
    nameHa: "Makkah (Ka'aba)",
    arabicName: 'المكة المكرمة',
    lat: 21.4225,
    lng: 39.8262,
    abjadVal: 361,
    descriptionFr: 'Centre originel et pôle spirituel mondial de la Qibla.',
    descriptionEn: 'Original center and global spiritual pole of the Qibla.',
    descriptionHa: 'Cibiyar farko kuma alkiblar dukkan musulman duniya.'
  },
  {
    id: 'madinah',
    flag: '🇸🇦',
    nameFr: 'Médine (Masjid an-Nabawi)',
    nameEn: 'Medina (Masjid an-Nabawi)',
    nameHa: 'Madina (Masallacin Annabi)',
    arabicName: 'المدينة المنورة',
    lat: 24.4672,
    lng: 39.6111,
    abjadVal: 102,
    descriptionFr: 'Sanctuaire de sérénité, cité de la Lumière prophétique.',
    descriptionEn: 'Sanctuary of serenity, city of prophetic Light.',
    descriptionHa: 'Birnin aminci da hasken Manzon Allah.'
  },
  {
    id: 'jerusalem',
    flag: '🇵🇸',
    nameFr: 'Jérusalem (Al-Quds)',
    nameEn: 'Jerusalem (Al-Quds)',
    nameHa: 'Jerusalem (Al-Quds)',
    arabicName: 'القدس الشريف',
    lat: 31.7780,
    lng: 35.2354,
    abjadVal: 305,
    descriptionFr: 'Troisième sanctuaire sacré et station de l’Ascension (Isra).',
    descriptionEn: 'Third sacred sanctuary and station of the Ascension (Isra).',
    descriptionHa: "Wuri mai tsarki na uku da gidan Isra'i."
  },
  {
    id: 'fez',
    flag: '🇲🇦',
    nameFr: 'Fès (Qarawiyyin & Sebtah)',
    nameEn: 'Fez (Qarawiyyin)',
    nameHa: 'Fas (Qarawiyyin)',
    arabicName: 'فاس العريقة',
    lat: 34.0333,
    lng: -5.0000,
    abjadVal: 141,
    descriptionFr: 'Capitale spirituelle de l’Occident musulman et pôle de savoir.',
    descriptionEn: 'Spiritual capital of the Muslim West and pole of knowledge.',
    descriptionHa: 'Babban birnin ruhi na Yammacin duniya.'
  },
  {
    id: 'timbuktu',
    flag: '🇲🇱',
    nameFr: 'Tombouctou (Sankoré)',
    nameEn: 'Timbuktu (Sankore)',
    nameHa: 'Timbuktu (Sankore)',
    arabicName: 'تنبكتو المحروسة',
    lat: 16.7666,
    lng: -3.0072,
    abjadVal: 488,
    descriptionFr: 'Phare ésotérique du Désert et gardien des manuscrits.',
    descriptionEn: 'Esoteric lighthouse of the Desert and manuscript guardian.',
    descriptionHa: 'Cibiyar ilimin daji da kiyaye littattafai.'
  },
  {
    id: 'kano',
    flag: '🇳🇬',
    nameFr: 'Kano (Grande Mosquée)',
    nameEn: 'Kano (Grand Mosque)',
    nameHa: "Kano (Masallacin Juma'a)",
    arabicName: 'كانو التاريخية',
    lat: 12.0022,
    lng: 8.5920,
    abjadVal: 77,
    descriptionFr: 'Carrefour millénaire du commerce et de la science sahélienne.',
    descriptionEn: 'Millenary crossroads of commerce and Sahelian science.',
    descriptionHa: "Mahaɗar kasuwanci da ilimin al'adun Sahel."
  },
  {
    id: 'touba',
    flag: '🇸🇳',
    nameFr: 'Touba (Grande Mosquée)',
    nameEn: 'Touba (Grand Mosque)',
    nameHa: 'Touba (Babban Masallaci)',
    arabicName: 'طوبى المباركة',
    lat: 14.8667,
    lng: -15.8833,
    abjadVal: 20,
    descriptionFr: 'Cité sainte de la Mouridiyyah et pôle de Barakah.',
    descriptionEn: 'Holy city of Mouridiyyah and pole of Barakah.',
    descriptionHa: 'Birni mai albarka na Muridiyya.'
  }
];

// Preset World Cities for Quick Geographic Selection
const PRESET_CITIES = [
  { nameFr: 'Dakar', nameEn: 'Dakar', nameHa: 'Dakar', flag: '🇸🇳', country: 'Sénégal', lat: 14.7167, lng: -17.4677, arabic: 'داكار' },
  { nameFr: 'Makkah', nameEn: 'Mecca', nameHa: 'Makkah', flag: '🇸🇦', country: 'Arabie Saoudite', lat: 21.4225, lng: 39.8262, arabic: 'مكة' },
  { nameFr: 'Madinah', nameEn: 'Medina', nameHa: 'Madina', flag: '🇸🇦', country: 'Arabie Saoudite', lat: 24.4672, lng: 39.6111, arabic: 'المدينة' },
  { nameFr: 'Al-Quds', nameEn: 'Jerusalem', nameHa: 'Jerusalem', flag: '🇵🇸', country: 'Palestine', lat: 31.7780, lng: 35.2354, arabic: 'القدس' },
  { nameFr: 'Fès', nameEn: 'Fez', nameHa: 'Fas', flag: '🇲🇦', country: 'Maroc', lat: 34.0333, lng: -5.0000, arabic: 'فاس' },
  { nameFr: 'Tombouctou', nameEn: 'Timbuktu', nameHa: 'Timbuktu', flag: '🇲🇱', country: 'Mali', lat: 16.7666, lng: -3.0072, arabic: 'تنبكتو' },
  { nameFr: 'Kano', nameEn: 'Kano', nameHa: 'Kano', flag: '🇳🇬', country: 'Nigeria', lat: 12.0022, lng: 8.5920, arabic: 'كانو' },
  { nameFr: 'Niamey', nameEn: 'Niamey', nameHa: 'Niamey', flag: '🇳🇪', country: 'Niger', lat: 13.5116, lng: 2.1254, arabic: 'نيامي' },
  { nameFr: 'Bamako', nameEn: 'Bamako', nameHa: 'Bamako', flag: '🇲🇱', country: 'Mali', lat: 12.6392, lng: -8.0029, arabic: 'باماكو' },
  { nameFr: 'Nouakchott', nameEn: 'Nouakchott', nameHa: 'Nouakchott', flag: '🇲🇷', country: 'Mauritanie', lat: 18.0735, lng: -15.9582, arabic: 'نواكشوط' },
  { nameFr: 'Ouagadougou', nameEn: 'Ouagadougou', nameHa: 'Ouagadougou', flag: '🇧🇫', country: 'Burkina Faso', lat: 12.3714, lng: -1.5197, arabic: 'واغادوغو' },
  { nameFr: 'Abidjan', nameEn: 'Abidjan', nameHa: 'Abidjan', flag: '🇨🇮', country: "Côte d'Ivoire", lat: 5.3600, lng: -4.0083, arabic: 'أبيدجان' },
  { nameFr: 'Conakry', nameEn: 'Conakry', nameHa: 'Conakry', flag: '🇬🇳', country: 'Guinée', lat: 9.6412, lng: -13.5784, arabic: 'كوناكري' },
  { nameFr: "N'Djamena", nameEn: "N'Djamena", nameHa: "N'Djamena", flag: '🇹🇩', country: 'Tchad', lat: 12.1348, lng: 15.0557, arabic: 'نجامينا' },
  { nameFr: 'Caire', nameEn: 'Cairo', nameHa: 'Cairo', flag: '🇪🇬', country: 'Égypte', lat: 30.0444, lng: 31.2357, arabic: 'القاهرة' },
  { nameFr: 'Istanbul', nameEn: 'Istanbul', nameHa: 'Istanbul', flag: '🇹🇷', country: 'Turquie', lat: 41.0082, lng: 28.9784, arabic: 'إسطنبول' },
  { nameFr: 'Paris', nameEn: 'Paris', nameHa: 'Paris', flag: '🇫🇷', country: 'France', lat: 48.8566, lng: 2.3522, arabic: 'باريس' },
  { nameFr: 'Londres', nameEn: 'London', nameHa: 'London', flag: '🇬🇧', country: 'Royaume-Uni', lat: 51.5074, lng: -0.1278, arabic: 'لندن' },
  { nameFr: 'New York', nameEn: 'New York', nameHa: 'New York', flag: '🇺🇸', country: 'États-Unis', lat: 40.7128, lng: -74.0060, arabic: 'نيويورك' }
];

// Presets for User Needs / Intentions (Niyyah)
interface IntentionPreset {
  id: string;
  icon: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  textAr: string;
}

const INTENTION_PRESETS: IntentionPreset[] = [
  { id: 'protection', icon: '🛡️', titleFr: 'Protection & Sécurité (الحفظ والحيطة)', titleEn: 'Protection & Safety', titleHa: 'Tsaro da Kariya', textAr: 'الحفظ والحيطة والوقاية' },
  { id: 'opening', icon: '🌟', titleFr: 'Ouverture & Succès (الفتح والنجاح)', titleEn: 'Opening & Success', titleHa: 'Bude Kofofi da Nasara', textAr: 'الفتح والنجاح والقبول' },
  { id: 'barakah', icon: '💰', titleFr: 'Barakah & Prospérité (البركة والرزق)', titleEn: 'Barakah & Prosperity', titleHa: 'Albarka da Bunkasa', textAr: 'البركة والرزق العميم' },
  { id: 'peace', icon: '🕊️', titleFr: 'Paix & Sérénité (السكينة والصلح)', titleEn: 'Peace & Serenity', titleHa: 'Kwanciyar Hankali da Salama', textAr: 'السكينة والصلح والأمان' },
  { id: 'healing', icon: '🌿', titleFr: 'Guérison & Vitalité (الشفاء والعافية)', titleEn: 'Healing & Vitality', titleHa: 'Lafiya da Warkewa', textAr: 'الشفاء والعافية والبركة' },
  { id: 'elevation', icon: '👑', titleFr: 'Élévation & Prestige (الرفعة والمهابة)', titleEn: 'Elevation & Prestige', titleHa: 'Daukaka da Girma', textAr: 'الرفعة والعزة والمهابة' },
  { id: 'custom', icon: '✍️', titleFr: 'Intention Personnalisée', titleEn: 'Custom Intention', titleHa: 'Niyyar Hannu', textAr: '' }
];

// Complete i18n Dictionary
const TRANSLATIONS = {
  fr: {
    title: "Géographie Sacrée & Tellurisme (الجغرافيا المقدسة)",
    subtitle: "Coordonnées Abjad, Boussole de Résonance, Qibla par l'Abjad, Tellurisme Spéculatif, Passage Solaire et Talsam / Khatim de la Ville.",
    headerBadge: "Géographie Sacrée",
    
    tabs: {
      abjadCoords: "Coordonnées Abjad",
      resonanceCompass: "Boussole de Résonance",
      abjadQibla: "Qibla par l'Abjad",
      tellurism: "Tellurisme Spéculatif",
      solarZenith: "Passage Solaire",
      talsamKhatim: "Talsam & Khatim de la Ville"
    },

    labels: {
      useMyLocation: "Ma position actuelle (GPS)",
      autoLocationDetected: "Position auto-détectée",
      openMapBtn: "Sélectionner sur la Carte (Map)",
      closeMapBtn: "Valider la Position",
      mapModalTitle: "Carte Interactive de Géographie Sacrée",
      mapInstructions: "Cliquez n'importe où sur la carte ou glissez le marqueur pour définir vos coordonnées géographiques exactes.",
      selectPresetCity: "Sélectionner une ville connue :",
      customCoords: "Saisie Manuelle des Coordonnées",
      latitude: "Latitude (°N)",
      longitude: "Longitude (°E)",
      cityName: "Nom de la Ville / Lieu :",
      cityNamePlaceholder: "Ex: Dakar, Paris, Fez, Kano...",
      copied: "Copié dans le presse-papier !",
      copyBtn: "Copier la Synthèse",
      calculateBtn: "Calculer les Alignements",
      sacredCenter: "Centre Sacré de Référence :",
      distanceKm: "Distance Géodésique",
      distanceNautical: "Milles Nautiques",
      azimuthDeg: "Azimut / Angle",
      resonanceScore: "Score de Résonance",
      dominantElement: "Élément Dominant",
      soilRuler: "Gouverneur Céleste du Sol",
      elementalBreakdown: "Répartition des 4 Éléments de la Terre",
      fire: "Feu (النار)",
      air: "Air (الهواء)",
      water: "Eau (الماء)",
      earth: "Terre (الأرض)",
      suitabilityRatings: "Aptitudes Théurgiques du Lieu",
      khalwa: "Retraite Spirituelle (Khalwa)",
      tilasm: "Écriture de Talismans",
      muraqaba: "Méditation & Recueillement",
      rizq: "Prospérité & Commerce",
      recommendedIncense: "Encens & Bukhoor Adapté :",
      solarPassageTitle: "Heure Exacte du Passage Solaire (Zénith & Zill al-Zawāl)",
      solarPassageDesc: "Le moment où le Soleil traverse le méridien local. La pause idéale pour équilibrer les flux et renouveler la purification.",
      datePicker: "Date de Consultation :",
      zenithTime: "Heure du Zénith (Passage Solaire)",
      shadowFactor: "Facteur d'Ombre (Zill al-Zawāl)",
      nextPassageIn: "Prochain Passage dans :",
      pauseRecommendation: "Recommandation de Pause Solaire",
      pauseRecommendationDesc: "Pendant les 3 à 5 minutes encadrant l'instant précis du passage au zénith, observez un temps d'arrêt. Interrompez le tracé des figures complexes pour reprendre immédiatement après le basculement d'ombre.",
      esotericQiblaAngle: "Azimut de Qibla Bāṭiniyyah",
      lunarMansion: "Maison Lunaires (Manzil)",
      zodiacSign: "Signe Zodiacal (Burj)",
      orientationDhikr: "Invocations & Noms Divins de Résonance",

      degrees: "Degrés",
      minutes: "Minutes",
      seconds: "Secondes",
      latLetters: "Lettres Latitude",
      lngLetters: "Lettres Longitude",
      geoAbjadSeal: "SCEAU GÉOGRAPHIQUE ABJAD DU LIEU",
      totalAbjadWeight: "Poids Abjad Total des Coordonnées",
      compassRoseTitle: "Rose des Vents & Alignement Azimut",
      directAxis: "Axe direct vers",
      cityAbjadWeight: "Poids Abjad du lieu",
      meccaAbjadWeight: "Poids Abjad de La Mecque (المكة)",
      combinedSum: "Somme Combinée Sacrée",
      reiterations: "réitérations",
      cardinalN: "N (شمال)",
      cardinalE: "E (شرق)",
      cardinalS: "S (جنوب)",
      cardinalW: "O (غرب)",
      searchLocationPlaceholder: "Rechercher une ville...",
      searchBtn: "Rechercher",

      // Talsam & Khatim Labels
      talsamKhatimTitle: "Talsam Vocalisé (avec Tashkeel) & Sceau (Khatim 3x3) de la Ville",
      talsamKhatimDesc: "Génération théurgique du Talsam sacré avec voyellation intégrale (Tashkeel) et construction du Khatim 3x3 (Wafq Ghazali) basé sur le nom du lieu, ses coordonnées Abjad et votre intention.",
      selectIntention: "Sélectionner une Intention / Niyyah :",
      customIntentionLabel: "Intention Personnalisée / Besoin Spécifique :",
      customIntentionPlaceholder: "Ex: Protection contre le mauvais œil, réussite du commerce, paix...",
      vocalizedTalsamTitle: "Talsam Sacré Vocalisé (avec Tashkeel Complet)",
      servantAngel: "Serviteur Angélique du Lieu (Khādim)",
      reiterationCount: "Nombre de Réitérations (Dhikr)",
      khatimMatrixTitle: "Khatim & Wafq Ghazali 3x3 de la Ville",
      totalAbjadFormula: "Formule d'Abjad Cumulé",
      downloadKhatimPng: "Télécharger le Khatim (PNG)",
      copyTalsamTashkeel: "Copier le Talsam (avec Tashkeel)",
      themeGold: "Thème Or & Nuit",
      themeParchment: "Thème Parchemin",
      themeEmerald: "Thème Émeraude",
      khatimMagicSum: "Somme Magique du Wafq",
      archangelsCorners: "Archanges Gouverneurs"
    },

    descriptions: {
      abjadCoordsDesc: "Conversion des degrés, minutes et secondes géographiques en séquences de lettres Abjad Mashriqī et réduction mystique de l'emplacement.",
      resonanceCompassDesc: "Calcul de la distance géodésique et de la ligne de force par rapport aux grands centres historiques et sanctuaires de la tradition.",
      abjadQiblaDesc: "Calcul de l'orientation spirituelle basé sur l'addition mystique et le modulo ésotérique des valeurs d'Abjad du lieu et de la Mecque.",
      tellurismDesc: "Évaluation de l'influence tellurique du sol selon le poids des lettres du nom traditionnel et son gouverneur céleste.",
      solarZenithDesc: "Calcul du passage au zénith parfait sans ombre (Zawāl al-Shams) pour marquer la pause des calculs théurgiques.",
      talsamKhatimDesc: "Construction d'un Talsam à voyelles parfaites et d'un Sceau carré de protection et d'harmonie pour la ville."
    }
  },

  en: {
    title: "Sacred Geography & Tellurism (الجغرافيا المقدسة)",
    subtitle: "Abjad Coordinates, Resonance Compass, Abjad Qibla, Speculative Tellurism, Solar Zenith Passage, and City Talsam/Khatim.",
    headerBadge: "Sacred Geography",

    tabs: {
      abjadCoords: "Abjad Coordinates",
      resonanceCompass: "Resonance Compass",
      abjadQibla: "Abjad Qibla",
      tellurism: "Speculative Tellurism",
      solarZenith: "Solar Passage",
      talsamKhatim: "City Talsam & Khatim"
    },

    labels: {
      useMyLocation: "My Current Position (GPS)",
      autoLocationDetected: "Auto-detected position",
      openMapBtn: "Select on Interactive Map",
      closeMapBtn: "Confirm Position",
      mapModalTitle: "Interactive Sacred Geography Map",
      mapInstructions: "Click anywhere on the map or drag the pin marker to set your exact geographical coordinates.",
      selectPresetCity: "Select a known city:",
      customCoords: "Manual Coordinate Input",
      latitude: "Latitude (°N)",
      longitude: "Longitude (°E)",
      cityName: "City / Location Name:",
      cityNamePlaceholder: "e.g. Dakar, Paris, Fez, Kano...",
      copied: "Copied to clipboard!",
      copyBtn: "Copy Summary",
      calculateBtn: "Calculate Alignments",
      sacredCenter: "Reference Sacred Center:",
      distanceKm: "Geodesic Distance",
      distanceNautical: "Nautical Miles",
      azimuthDeg: "Azimuth / Angle",
      resonanceScore: "Resonance Score",
      dominantElement: "Dominant Element",
      soilRuler: "Celestial Soil Ruler",
      elementalBreakdown: "Distribution of the 4 Earth Elements",
      fire: "Fire (النار)",
      air: "Air (الهواء)",
      water: "Water (الماء)",
      earth: "Earth (الأرض)",
      suitabilityRatings: "Theurgic Aptitudes of the Soil",
      khalwa: "Spiritual Retreat (Khalwa)",
      tilasm: "Talisman Writing",
      muraqaba: "Meditation & Contemplation",
      rizq: "Prosperity & Commerce",
      recommendedIncense: "Recommended Incense / Bukhoor:",
      solarPassageTitle: "Exact Solar Zenith Time (Zawāl & Minimum Shadow)",
      solarPassageDesc: "The moment when the Sun crosses the local meridian. The ideal pause to balance energy flows and renew spiritual focus.",
      datePicker: "Consultation Date:",
      zenithTime: "Zenith Time (Solar Passage)",
      shadowFactor: "Shadow Factor (Zill al-Zawāl)",
      nextPassageIn: "Next Passage in:",
      pauseRecommendation: "Solar Pause Recommendation",
      pauseRecommendationDesc: "For 3 to 5 minutes surrounding the exact zenith moment, observe a sacred pause. Pause complex computations and resume immediately after shadow shift.",
      esotericQiblaAngle: "Bāṭiniyyah Qibla Azimuth",
      lunarMansion: "Lunar Mansion (Manzil)",
      zodiacSign: "Zodiac Sign (Burj)",
      orientationDhikr: "Resonance Divine Names & Invocations",

      degrees: "Degrees",
      minutes: "Minutes",
      seconds: "Seconds",
      latLetters: "Latitude Letters",
      lngLetters: "Longitude Letters",
      geoAbjadSeal: "ABJAD GEOGRAPHIC SEAL OF LOCATION",
      totalAbjadWeight: "Total Coordinates Abjad Weight",
      compassRoseTitle: "Compass Rose & Azimuth Alignment",
      directAxis: "Direct axis towards",
      cityAbjadWeight: "Location Abjad Weight",
      meccaAbjadWeight: "Mecca Abjad Weight (المكة)",
      combinedSum: "Sacred Combined Sum",
      reiterations: "reiterations",
      cardinalN: "N (North)",
      cardinalE: "E (East)",
      cardinalS: "S (South)",
      cardinalW: "W (West)",
      searchLocationPlaceholder: "Search city...",
      searchBtn: "Search",

      // Talsam & Khatim Labels
      talsamKhatimTitle: "Vocalized City Talsam (with Tashkeel) & Powerful Khatim Seal",
      talsamKhatimDesc: "Theurgic generation of the Talsam with full Tashkeel diacritics and construction of the 3x3 Ghazali Wafq Seal based on location name, Abjad coordinates, and your intention.",
      selectIntention: "Select an Intention / Niyyah:",
      customIntentionLabel: "Custom Intention / Specific Need:",
      customIntentionPlaceholder: "e.g. Protection, business prosperity, peace...",
      vocalizedTalsamTitle: "Sacred Vocalized Talsam (with Full Tashkeel)",
      servantAngel: "Angelic Servant of the Location (Khādim)",
      reiterationCount: "Reiteration Count (Dhikr)",
      khatimMatrixTitle: "3x3 Ghazali Wafq Seal of the City",
      totalAbjadFormula: "Cumulative Abjad Formula",
      downloadKhatimPng: "Download Khatim Seal (PNG)",
      copyTalsamTashkeel: "Copy Talsam (with Tashkeel)",
      themeGold: "Gold & Night Theme",
      themeParchment: "Parchment Theme",
      themeEmerald: "Emerald Theme",
      khatimMagicSum: "Wafq Magic Sum",
      archangelsCorners: "Governing Archangels"
    },

    descriptions: {
      abjadCoordsDesc: "Conversion of geographic degrees, minutes, and seconds into Mashriqī Abjad letter sequences and mystical location signature.",
      resonanceCompassDesc: "Calculation of geodesic distance and directional force line relative to major historical centers and sanctuaries.",
      abjadQiblaDesc: "Spiritual direction calculation based on mystical addition and esoteric modulo of the Abjad values of the location and Mecca.",
      tellurismDesc: "Evaluation of the telluric soil influence according to the letter weights of the traditional name and its governing planet.",
      solarZenithDesc: "Calculation of the shadowless solar zenith passage (Zawāl al-Shams) to mark the sacred pause in computations.",
      talsamKhatimDesc: "Construction of a vocalized Talsam and a powerful square Seal for location protection and harmony."
    }
  },

  ha: {
    title: "Ilimin Kasa da Muhalli Mai Tsarki (الجغرافيا المقدسة)",
    subtitle: "Lissafin Lambobin Abjad na Kasa, Ma'aunin Nisa da Alkibla, Alkiblar Abjad, Yanayin Kasa, Lokacin Zawal, da Talsam da Khatim na Birni.",
    headerBadge: "Ilimin Kasa Mai Tsarki",

    tabs: {
      abjadCoords: "Lambobin Abjad na Kasa",
      resonanceCompass: "Ma'aunin Nisa da Alkibla",
      abjadQibla: "Alkiblar Abjad",
      tellurism: "Yanayin Kasa da Toza",
      solarZenith: "Zawal na Rana",
      talsamKhatim: "Talsam da Khatim na Birni"
    },

    labels: {
      useMyLocation: "Mataimakin Wurina na Yanzu (GPS)",
      autoLocationDetected: "An gano matsayi ta atomatik",
      openMapBtn: "Zabi a Kan Taswira (Map)",
      closeMapBtn: "Tabbatar da Wuri",
      mapModalTitle: "Taswira Mai Motsi na Muhalli Mai Tsarki",
      mapInstructions: "Danna kowane wuri a taswira ko kuka ja alamar don saita ainihin lambobin wurinku.",
      selectPresetCity: "Zabi shahararren birni:",
      customCoords: "Shigar da Lambobin Kasa da Hannu",
      latitude: "Arewaci (°N)",
      longitude: "Gabasci (°E)",
      cityName: "Sunan Birni / Wuri:",
      cityNamePlaceholder: "Kamar: Dakar, Paris, Fas, Kano...",
      copied: "An Kwafa gaba daya!",
      copyBtn: "Kwafi Sakamako",
      calculateBtn: "Lissafa Dangantaka",
      sacredCenter: "Cibiyar Tsarki na Masarauta:",
      distanceKm: "Nisan Kasa (Kilomita)",
      distanceNautical: "Milles Nautiques",
      azimuthDeg: "Kwanar Alkibla (°)",
      resonanceScore: "Darajar Jituwa da Ruhi",
      dominantElement: "Siffa Mafi Karfi",
      soilRuler: "Kaukab Mai Mulkin Tozan",
      elementalBreakdown: "Raba Siffofi Hudu na Kasa",
      fire: "Wuta (النار)",
      air: "Iska (الهواء)",
      water: "Ruwa (الماء)",
      earth: "Kasa (الأرض)",
      suitabilityRatings: "Dacewar Gidaje ga Ayukan Ruhi",
      khalwa: "Khalwa / Bitar Ruhi",
      tilasm: "Rubutun Hatimi da Talsam",
      muraqaba: "Muraqaba da Tunani",
      rizq: "Sami Bunkasar Arziki da Kasuwanci",
      recommendedIncense: "Turaren Bukhoor da Ya Dace:",
      solarPassageTitle: "Lokacin Zawal da Sani na Rana (Zawāl al-Shams)",
      solarPassageDesc: "Lokacin da rana ta kai tsakiyar sama. Lokaci ne na huta lissafi domin samun tsarki da albarka.",
      datePicker: "Kwanan Wata:",
      zenithTime: "Cikakken Lokacin Zawal",
      shadowFactor: "Gwajin Inuwar Zawal (Zill al-Zawāl)",
      nextPassageIn: "Sauran Lokaci zuwa Zawal:",
      pauseRecommendation: "Hutu a Lokacin Zawal",
      pauseRecommendationDesc: "A cikin minti 3 zuwa 5 a yayin tsakiyar zawal, ka dakata da rubutun asiri har sai inuwa ta goce.",
      esotericQiblaAngle: "Kwanar Alkibla na Asiri",
      lunarMansion: "Manzilin Wata (Manzil)",
      zodiacSign: "Burjin Samaniya (Burj)",
      orientationDhikr: "Sunayen Allah na Zikr",

      degrees: "Madagari",
      minutes: "Minti",
      seconds: "Daqiqa",
      latLetters: "Haruffan Lat",
      lngLetters: "Haruffan Lng",
      geoAbjadSeal: "HATIMIN ABJAD NA WURI",
      totalAbjadWeight: "Jimillar Abjad na Lambobi",
      compassRoseTitle: "Ma'aunin Iskoki da Alkibla",
      directAxis: "Hanya Kai Tsaye zuwa",
      cityAbjadWeight: "Lissafin Abjad na Birni",
      meccaAbjadWeight: "Lissafin Abjad na Makkah (المكة)",
      combinedSum: "Haɗaɗɗiyar Jimillar Albarka",
      reiterations: "maimaitawa",
      cardinalN: "Arewaci (شمال)",
      cardinalE: "Gabasci (شرق)",
      cardinalS: "Kudancin (جنوب)",
      cardinalW: "Yammaci (غرب)",
      searchLocationPlaceholder: "Bincika birni...",
      searchBtn: "Bincika",

      // Talsam & Khatim Labels
      talsamKhatimTitle: "Talsam Mai Tashkeel da Khatimi Mai Karfi na Birni",
      talsamKhatimDesc: "Aikin gano Talsam mai gaba daya Tashkeel da gina Wafq 3x3 na Ghazali dangane da sunan wuri, lambobin Abjad da niyyarka.",
      selectIntention: "Zabi Niyya / Buqata:",
      customIntentionLabel: "Niyyar Hannu / Buqata ta Musamman:",
      customIntentionPlaceholder: "Kamar: Tsaro daga sharri, kasuwanci, aminci...",
      vocalizedTalsamTitle: "Talsam Mai Tsarki (Mai Cikakken Tashkeel)",
      servantAngel: "Mala'ika Mai Tsaron Wuri (Khādim)",
      reiterationCount: "Yawan Karanta Zikr",
      khatimMatrixTitle: "Hatimin Wafq 3x3 na Birni",
      totalAbjadFormula: "Haruffa da Lissafin Abjad",
      downloadKhatimPng: "Sauke Khatim (PNG)",
      copyTalsamTashkeel: "Kwafi Talsam (Mai Tashkeel)",
      themeGold: "Kalar Zinariya da Duhu",
      themeParchment: "Kalar Takardar Tsohuwa",
      themeEmerald: "Kalar Zumarada",
      khatimMagicSum: "Jimillar Wafq",
      archangelsCorners: "Mala'iku Hudu Masu Sarauta"
    },

    descriptions: {
      abjadCoordsDesc: "Mayar da lambobin lat da long zuwa haruffan Abjad da gano nauyin asiri na muhalli.",
      resonanceCompassDesc: "Lissafin nisan kilomita da kwanar alkibla zuwa manyan birane masu albarka na duniya.",
      abjadQiblaDesc: "Lissafin alkibla ta hanyar amfani da haruffan sunan birni da garin Makkah.",
      tellurismDesc: "Gano tasirin tozan kasa ta amfani da Abjad na sunan birni da kaukab mai tsaro.",
      solarZenithDesc: "Lissafa cikakken lokacin zawal na rana don huta lissafin asiri da sabunta alwala.",
      talsamKhatimDesc: "Rubuta talsam mai gaba daya Tashkeel da gina hatimi 3x3 don kariya da albarka."
    }
  }
};

// Converts Decimal Degrees to DMS format
function decimalToDMS(deg: number): { degrees: number; minutes: number; seconds: number } {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60);
  return { degrees, minutes, seconds };
}

// Convert DMS to Abjad Letters
function dmsToAbjad(dms: { degrees: number; minutes: number; seconds: number }): {
  degLetters: string;
  minLetters: string;
  secLetters: string;
  totalLetters: string;
  totalVal: number;
} {
  const degLetters = numberToAbjadLetters(dms.degrees);
  const minLetters = numberToAbjadLetters(dms.minutes);
  const secLetters = numberToAbjadLetters(dms.seconds);
  const totalLetters = `${degLetters}${minLetters}${secLetters}`;
  const totalVal = calculateAbjadValue(totalLetters);
  return { degLetters, minLetters, secLetters, totalLetters, totalVal };
}

// Haversine formula for distance (km) and Azimuth angle (degrees)
function calculateGeodesy(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { distanceKm: number; nauticalMiles: number; azimuthDeg: number } {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const nauticalMiles = distanceKm * 0.539957;

  // Azimuth / Bearing calculation
  const y = Math.sin(dLon) * Math.cos(radLat2);
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  return { distanceKm, nauticalMiles, azimuthDeg: brng };
}

// Solar Zenith Calculation (Zawāl & Minimum Shadow)
function calculateSolarZenith(lat: number, lng: number, date: Date) {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Approximate Solar Declination (degrees)
  const declination = 23.45 * Math.sin((((284 + dayOfYear) * 360) / 365) * (Math.PI / 180));

  // Equation of Time (EOT in minutes)
  const b = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  // Solar Noon in UTC (hours)
  const solarNoonUTC = 12 - lng / 15 - eot / 60;

  const hours = Math.floor(solarNoonUTC);
  const minutes = Math.floor((solarNoonUTC - hours) * 60);
  const seconds = Math.round(((solarNoonUTC - hours) * 60 - minutes) * 60);

  const pad = (n: number) => (n < 10 ? `0${Math.max(0, n)}` : `${n}`);
  const zenithTimeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} UTC`;

  // Minimum Shadow Factor (Zill al-Zawāl)
  const shadowFactor = Math.abs(Math.tan(((lat - declination) * Math.PI) / 180));

  return {
    zenithTimeString,
    shadowFactor: shadowFactor.toFixed(3),
    declinationDeg: declination.toFixed(2),
    eotMinutes: eot.toFixed(1)
  };
}

// Draw Khatim Seal onto Canvas for PNG Export
function drawKhatimToCanvas(
  canvas: HTMLCanvasElement,
  data: {
    cityName: string;
    cityNameAr: string;
    intentionTitle: string;
    intentionAr: string;
    talsamVocalized: string;
    khadimName: string;
    wafqMatrix: number[][];
    wafqAbjadMatrix: string[][];
    totalSum: number;
    coordsLetters: string;
    theme: 'gold' | 'parchment' | 'emerald';
  }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = 800;
  const h = 1000;
  canvas.width = w;
  canvas.height = h;

  // Color Palettes
  let bgGradient: CanvasGradient;
  let borderGold = '#d97706';
  let innerBorder = '#b45309';
  let textPrimary = '#fef3c7';
  let textSecondary = '#fcd34d';
  let gridLine = '#f59e0b';
  let cellBg = 'rgba(15, 23, 42, 0.85)';

  if (data.theme === 'parchment') {
    bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#fef3c7');
    bgGradient.addColorStop(0.5, '#fde68a');
    bgGradient.addColorStop(1, '#f59e0b');
    borderGold = '#78350f';
    innerBorder = '#92400e';
    textPrimary = '#451a03';
    textSecondary = '#78350f';
    gridLine = '#92400e';
    cellBg = 'rgba(254, 243, 199, 0.9)';
  } else if (data.theme === 'emerald') {
    bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#064e3b');
    bgGradient.addColorStop(0.5, '#022c22');
    bgGradient.addColorStop(1, '#065f46');
    borderGold = '#34d399';
    innerBorder = '#10b981';
    textPrimary = '#ecfdf5';
    textSecondary = '#6ee7b7';
    gridLine = '#10b981';
    cellBg = 'rgba(2, 44, 34, 0.9)';
  } else {
    // Gold / Night
    bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#020617');
    bgGradient.addColorStop(1, '#1e1b4b');
    borderGold = '#fbbf24';
    innerBorder = '#f59e0b';
    textPrimary = '#fffbeb';
    textSecondary = '#fcd34d';
    gridLine = '#d97706';
    cellBg = 'rgba(15, 23, 42, 0.9)';
  }

  // Draw Background
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, w, h);

  // Outer Border Double Frame
  ctx.strokeStyle = borderGold;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.strokeStyle = innerBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Corner Geometric Ornaments
  const corners = [[35, 35], [w - 35, 35], [35, h - 35], [w - 35, h - 35]];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.strokeStyle = borderGold;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Top Title Banner / Bismillah
  ctx.textAlign = 'center';
  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 22px serif';
  ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', w / 2, 70);

  // Subtitle / City Name & Intention
  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`Khatim Sacré de ${data.cityName} (${data.cityNameAr})`, w / 2, 115);

  ctx.fillStyle = borderGold;
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(`Niyyah / Intention: ${data.intentionAr || data.intentionTitle}`, w / 2, 150);

  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = textSecondary;
  ctx.fillText(`Poids Abjad Total = ${data.totalSum} | Coordonnées: ${data.coordsLetters}`, w / 2, 180);

  // Archangels in 4 Corners
  ctx.font = 'bold 16px serif';
  ctx.fillStyle = borderGold;
  ctx.fillText('جِبْرَائِيلُ', 90, 80);
  ctx.fillText('مِيكَائِيلُ', w - 90, 80);
  ctx.fillText('إِسْرَافِيلُ', 90, h - 65);
  ctx.fillText('عِزْرَائِيلُ', w - 90, h - 65);

  // Draw Central 3x3 Wafq Grid
  const gridX = 200;
  const gridY = 210;
  const gridWidth = 400;
  const gridHeight = 400;
  const cellSize = gridWidth / 3;

  // Grid Backdrop
  ctx.fillStyle = cellBg;
  ctx.fillRect(gridX, gridY, gridWidth, gridHeight);

  // Grid Outer Frame
  ctx.strokeStyle = gridLine;
  ctx.lineWidth = 4;
  ctx.strokeRect(gridX, gridY, gridWidth, gridHeight);

  // Inner Grid Lines
  ctx.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(gridX + i * cellSize, gridY);
    ctx.lineTo(gridX + i * cellSize, gridY + gridHeight);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(gridX, gridY + i * cellSize);
    ctx.lineTo(gridX + gridWidth, gridY + i * cellSize);
    ctx.stroke();
  }

  // Populate Wafq Cells with Numbers & Abjad Letters
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cx = gridX + c * cellSize + cellSize / 2;
      const cy = gridY + r * cellSize + cellSize / 2;

      const val = data.wafqMatrix[r][c];
      const abjadLetters = data.wafqAbjadMatrix[r][c];

      // Number
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 24px monospace';
      ctx.fillText(val.toString(), cx, cy - 8);

      // Abjad Letter
      ctx.fillStyle = borderGold;
      ctx.font = 'bold 18px serif';
      ctx.fillText(abjadLetters, cx, cy + 22);
    }
  }

  // Draw Vocalized Talsam Ring / Banner below Wafq
  const talsamBoxY = 640;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(50, talsamBoxY, w - 100, 200);
  ctx.strokeStyle = borderGold;
  ctx.lineWidth = 2;
  ctx.strokeRect(50, talsamBoxY, w - 100, 200);

  ctx.fillStyle = borderGold;
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('تَلْسَمُ الْمَكَانِ الْمُشَكَّلُ (Talsam Vocalisé de la Ville)', w / 2, talsamBoxY + 30);

  ctx.fillStyle = textPrimary;
  ctx.font = 'bold 20px serif';

  // Split Talsam if too long
  const words = data.talsamVocalized.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  ctx.fillText(line1, w / 2, talsamBoxY + 75);
  if (line2) {
    ctx.fillText(line2, w / 2, talsamBoxY + 115);
  }

  ctx.fillStyle = textSecondary;
  ctx.font = 'bold 15px serif';
  ctx.fillText(`Khādim: ${data.khadimName}`, w / 2, talsamBoxY + 160);

  // Footer Information
  ctx.fillStyle = textSecondary;
  ctx.font = '12px sans-serif';
  ctx.fillText('AsrarHub - Géographie Sacrée, Talsams et Khatims de la Tradition', w / 2, h - 45);
}

export default function SacredGeography() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as 'fr' | 'en' | 'ha'] || TRANSLATIONS.fr;

  const [activeTab, setActiveTab] = useState<'coords' | 'compass' | 'qibla' | 'tellurism' | 'solar' | 'talsamKhatim' | 'comparison'>('coords');

  // Location State
  const [cityName, setCityName] = useState<string>('Dakar');
  const [lat, setLat] = useState<number>(14.7167);
  const [lng, setLng] = useState<number>(-17.4677);
  const [selectedPreset, setSelectedPreset] = useState<string>('Dakar');

  // Sacred Center Selection
  const [selectedCenterId, setSelectedCenterId] = useState<string>('makkah');

  // Date for Solar Passage
  const [solarDate, setSolarDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Copy state feedback
  const [copied, setCopied] = useState<boolean>(false);
  const [talsamCopied, setTalsamCopied] = useState<boolean>(false);

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  // Talsam & Khatim User State
  const [selectedIntentionId, setSelectedIntentionId] = useState<string>('protection');
  const [customIntention, setCustomIntention] = useState<string>('');
  const [khatimTheme, setKhatimTheme] = useState<'gold' | 'parchment' | 'emerald'>('gold');
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-detect user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const autoLat = parseFloat(pos.coords.latitude.toFixed(4));
          const autoLng = parseFloat(pos.coords.longitude.toFixed(4));
          setLat(autoLat);
          setLng(autoLng);
          setCityName(language === 'en' ? 'My Location' : language === 'ha' ? "Wurina na Yanzu" : 'Ma Position Actuelle');
          setSelectedPreset('');
        },
        (err) => {
          console.log('Auto geolocation unavailable or denied, keeping default preset:', err);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Initialize and handle Leaflet Map
  useEffect(() => {
    if (!showMapModal || !mapContainerRef.current) return;

    if (!leafletMapInstance.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Custom icon for Map Marker
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background-color: #f59e0b; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; items-center; justify-content: center; font-size: 16px;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { draggable: true, icon: customIcon }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(4));
        const newLng = parseFloat(e.latlng.lng.toFixed(4));
        setLat(newLat);
        setLng(newLng);
        marker.setLatLng(e.latlng);
      });

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLat(parseFloat(pos.lat.toFixed(4)));
        setLng(parseFloat(pos.lng.toFixed(4)));
      });

      leafletMapInstance.current = map;
      markerInstance.current = marker;
    } else {
      leafletMapInstance.current.setView([lat, lng]);
      if (markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
      }
    }

    setTimeout(() => {
      leafletMapInstance.current?.invalidateSize();
    }, 250);
  }, [showMapModal]);

  // Geolocation trigger button
  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const autoLat = parseFloat(pos.coords.latitude.toFixed(4));
          const autoLng = parseFloat(pos.coords.longitude.toFixed(4));
          setLat(autoLat);
          setLng(autoLng);
          setCityName(language === 'en' ? 'My Location' : language === 'ha' ? "Wurina na Yanzu" : 'Ma Position Actuelle');
          setSelectedPreset('');

          if (leafletMapInstance.current && markerInstance.current) {
            leafletMapInstance.current.setView([autoLat, autoLng], 10);
            markerInstance.current.setLatLng([autoLat, autoLng]);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err);
        }
      );
    }
  };

  // Preset Selection Handler
  const handleSelectPreset = (presetName: string) => {
    const found = PRESET_CITIES.find((c) => c.nameFr === presetName || c.nameEn === presetName || c.nameHa === presetName);
    if (found) {
      setSelectedPreset(presetName);
      setCityName(language === 'en' ? found.nameEn : language === 'ha' ? found.nameHa : found.nameFr);
      setLat(found.lat);
      setLng(found.lng);

      if (leafletMapInstance.current && markerInstance.current) {
        leafletMapInstance.current.setView([found.lat, found.lng], 8);
        markerInstance.current.setLatLng([found.lat, found.lng]);
      }
    }
  };

  // Abjad Coordinate Computations
  const latDMS = useMemo(() => decimalToDMS(lat), [lat]);
  const lngDMS = useMemo(() => decimalToDMS(lng), [lng]);

  const latAbjad = useMemo(() => dmsToAbjad(latDMS), [latDMS]);
  const lngAbjad = useMemo(() => dmsToAbjad(lngDMS), [lngDMS]);

  const totalLocationLetters = useMemo(
    () => `${latAbjad.totalLetters}${lngAbjad.totalLetters}`,
    [latAbjad, lngAbjad]
  );
  
  const totalLocationVal = useMemo(
    () => calculateAbjadValue(totalLocationLetters),
    [totalLocationLetters]
  );

  // Elemental Distribution of Location Letters
  const elementalDistribution = useMemo(() => {
    const fireChars = ['ا', 'أ', 'إ', 'آ', 'ه', 'ة', 'ط', 'م', 'ف', 'ش', 'ذ'];
    const airChars = ['ب', 'و', 'ي', 'ن', 'ص', 'ت', 'ض'];
    const waterChars = ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'];
    const earthChars = ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'];

    let fire = 0, air = 0, water = 0, earth = 0;

    for (const char of totalLocationLetters) {
      if (fireChars.includes(char)) fire++;
      else if (airChars.includes(char)) air++;
      else if (waterChars.includes(char)) water++;
      else if (earthChars.includes(char)) earth++;
    }

    const total = fire + air + water + earth || 1;
    return {
      firePct: Math.round((fire / total) * 100),
      airPct: Math.round((air / total) * 100),
      waterPct: Math.round((water / total) * 100),
      earthPct: Math.round((earth / total) * 100)
    };
  }, [totalLocationLetters]);

  // Resonance Compass Calculations
  const selectedCenter = useMemo(
    () => SACRED_CENTERS.find((c) => c.id === selectedCenterId) || SACRED_CENTERS[0],
    [selectedCenterId]
  );

  const geodesy = useMemo(
    () => calculateGeodesy(lat, lng, selectedCenter.lat, selectedCenter.lng),
    [lat, lng, selectedCenter]
  );

  // Resonance score based on distance and Abjad alignment
  const resonanceScore = useMemo(() => {
    const cityAbjad = calculateAbjadValue(cityName) || 100;
    const diff = Math.abs((cityAbjad % 100) - (selectedCenter.abjadVal % 100));
    const score = Math.max(30, 100 - diff * 0.8 - geodesy.distanceKm / 300);
    return Math.round(score);
  }, [cityName, selectedCenter, geodesy]);

  // Qibla par Abjad Calculations
  const abjadQiblaData = useMemo(() => {
    const cityAbjad = calculateAbjadValue(cityName) || 120;
    const meccaAbjad = 361; // Al-Makkah al-Mukarramah
    const combinedSum = cityAbjad + meccaAbjad;

    const angleDeg = (combinedSum * 7) % 360;
    const lunarMansionIndex = (combinedSum % 28) + 1;
    const zodiacIndex = (combinedSum % 12) + 1;

    const LUNAR_MANSIONS = [
      'Al-Sharaṭān (الشريطان)', 'Al-Buṭayn (البطين)', 'Al-Thurayyā (الثريا)', 'Al-Dabarān (الدبران)',
      'Al-Haqʿah (الهقعة)', 'Al-Hanʿah (الهنعة)', 'Al-Dhirāʿ (الذراع)', 'Al-Nathrah (النثرة)',
      'Al-Ṭarf (الطرف)', 'Al-Jabhah (الجبهة)', 'Al-Zubrah (الزبرة)', 'Al-Ṣarfah (الصرفة)',
      'Al-ʿAwwā (العواء)', 'Al-Simāk (Сماك)', 'Al-Ghafr (الغفر)', 'Al-Zubānā (الزبانا)',
      'Al-Iklīl (الإكليل)', 'Al-Qalb (القلب)', 'Al-Shawlah (الشولة)', 'Al-Naʿāʾim (النعائم)',
      'Al-Baldah (البلدة)', 'Saʿd al-Dhābiḥ (سعد الذابح)', 'Saʿd Bulaʿ (سعد بلع)', 'Saʿd al-Suʿūd (سعد السعود)',
      'Saʿd al-Akhbiyah (سعد الأخبية)', 'Al-Fargh al-Muqdim (الفرغ المقدم)', 'Al-Fargh al-Muʾakhar (الفرغ المؤخر)', 'Batn al-Hūt (بطن الحوت)'
    ];

    const ZODIAC_SIGNS = [
      'Burj al-Hamal (الحمل)', 'Burj al-Thawr (الثور)', 'Burj al-Jawzāʾ (الجوزاء)',
      'Burj al-Saraṭān (السرطان)', 'Burj al-Asad (الأسد)', 'Burj al-Sunbulah (السنبلة)',
      'Burj al-Mīzān (الميزان)', 'Burj al-ʿAqrab (العقرب)', 'Burj al-Qaws (القوس)',
      'Burj al-Jady (الجديل)', 'Burj al-Dalw (الدلو)', 'Burj al-Ḥūt (الحوت)'
    ];

    const ORIENTATION_DHIKR = [
      { name: applyTashkeel('يا فتاح يا رزاق'), count: combinedSum },
      { name: applyTashkeel('يا هادي يا نور'), count: cityAbjad + 99 },
      { name: applyTashkeel('يا قيوم يا حي'), count: 361 }
    ];

    return {
      cityAbjad,
      meccaAbjad,
      combinedSum,
      angleDeg,
      mansion: LUNAR_MANSIONS[lunarMansionIndex - 1],
      zodiac: ZODIAC_SIGNS[zodiacIndex - 1],
      dhikrList: ORIENTATION_DHIKR
    };
  }, [cityName]);

  // Speculative Tellurism Computations
  const tellurismData = useMemo(() => {
    const cityAbjad = calculateAbjadValue(cityName) || 200;
    const planetMod = (cityAbjad % 7) || 7;

    const PLANET_RULERS = [
      { id: 1, nameFr: 'Soleil (الشمس)', nameEn: 'Sun (Shams)', nameHa: 'Rana (Shams)', element: 'Feu', incenseFr: 'Oudh & Safran', incenseEn: 'Agarwood & Saffron', incenseHa: "Za'afaran da Hawani" },
      { id: 2, nameFr: 'Lune (القمر)', nameEn: 'Moon (Qamar)', nameHa: 'Wata (Qamar)', element: 'Eau', incenseFr: 'Camphre & Musc Blanc', incenseEn: 'Camphor & White Musk', incenseHa: 'Musk Farfar' },
      { id: 3, nameFr: 'Mars (المريخ)', nameEn: 'Mars (Mrikh)', nameHa: 'Mrikh (Mars)', element: 'Feu', incenseFr: 'Harmal & Sang-de-dragon', incenseEn: 'Harmal & Dragon Blood', incenseHa: 'Harmal da Sang-dragon' },
      { id: 4, nameFr: 'Mercure (عطارد)', nameEn: 'Mercury (Utarid)', nameHa: 'Utarid (Mercury)', element: 'Air', incenseFr: 'Mastic & Benjoin', incenseEn: 'Mastic & Benzoin', incenseHa: 'Lubān Jāwī da Mastic' },
      { id: 5, nameFr: 'Jupiter (المشتري)', nameEn: 'Jupiter (Mushtari)', nameHa: 'Mushtari (Jupiter)', element: 'Air', incenseFr: 'Bois de Santal & Ambre', incenseEn: 'Sandalwood & Amber', incenseHa: 'Sandal da Ambre' },
      { id: 6, nameFr: 'Vénus (الزهراء)', nameEn: 'Venus (Zuhara)', nameHa: 'Zuhara (Venus)', element: 'Eau', incenseFr: 'Eau de Rose & Jasmin', incenseEn: 'Rose Water & Jasmine', incenseHa: 'Ruwan Ward da Jasmine' },
      { id: 7, nameFr: 'Saturne (زحل)', nameEn: 'Saturn (Zuhal)', nameHa: 'Zuhal (Saturn)', element: 'Terre', incenseFr: 'Myrrhe & Encens Mâle (Lubān)', incenseEn: 'Myrrh & Frankincense (Lubān)', incenseHa: 'Lubān Dhakar da Myrrh' }
    ];

    const ruler = PLANET_RULERS.find((p) => p.id === planetMod) || PLANET_RULERS[0];

    const khalwaRating = Math.min(98, Math.max(45, (cityAbjad * 3) % 100));
    const tilasmRating = Math.min(99, Math.max(50, (cityAbjad * 7) % 100));
    const muraqabaRating = Math.min(97, Math.max(40, (cityAbjad * 11) % 100));
    const rizqRating = Math.min(95, Math.max(55, (cityAbjad * 5) % 100));

    return {
      cityAbjad,
      ruler,
      khalwaRating,
      tilasmRating,
      muraqabaRating,
      rizqRating
    };
  }, [cityName]);

  // Solar Zenith Calculation
  const solarData = useMemo(() => {
    const d = new Date(solarDate);
    return calculateSolarZenith(lat, lng, d);
  }, [lat, lng, solarDate]);

  // City Talsam & Khatim Construction Data
  const talsamKhatimData = useMemo(() => {
    const cityAbjad = calculateAbjadValue(cityName) || 150;
    const coordsAbjad = totalLocationVal;

    const selectedIntention = INTENTION_PRESETS.find(i => i.id === selectedIntentionId) || INTENTION_PRESETS[0];
    const intentionText = selectedIntentionId === 'custom' ? (customIntention || 'الحفظ والبركة') : selectedIntention.textAr;
    const intentionAbjad = calculateAbjadValue(intentionText) || 111;

    const totalSum = cityAbjad + coordsAbjad + intentionAbjad;

    // 1. Angelic Servant (Khādim) Name
    const servantLetters = numberToAbjadLetters(totalSum);
    const rawKhadim = servantLetters.length >= 2 ? `${servantLetters}اييل` : 'طهطماييل';
    const khadimName = applyTashkeel(rawKhadim);

    // 2. City Talsam Formula with Full Tashkeel
    const cityArName = PRESET_CITIES.find(c => c.nameFr.toLowerCase() === cityName.toLowerCase())?.arabic || cityName;
    const rawFormula = `يا بشمخ شمخيثا يا ${cityArName} ${totalLocationLetters} اقبلوا بـ ${intentionText}`;
    const talsamVocalized = applyTashkeel(rawFormula);

    // 3. Ghazali 3x3 Wafq Matrix Calculation
    const S = totalSum;
    const M = Math.floor((S - 12) / 3);
    const R = (S - 12) % 3;

    // Cell Values
    const v = [
      0, // index 0 dummy
      M,                                    // 1
      M + 1,                                // 2
      M + 2,                                // 3
      M + 3,                                // 4
      M + 4,                                // 5
      M + 5,                                // 6
      M + 6 + (R >= 1 ? 1 : 0),             // 7
      M + 7 + (R >= 1 ? 1 : 0) + (R >= 2 ? 1 : 0), // 8
      M + 8 + (R >= 1 ? 1 : 0) + (R >= 2 ? 1 : 0)  // 9
    ];

    // Ghazali layout matrix [3][3]
    const wafqMatrix = [
      [v[4], v[9], v[2]],
      [v[3], v[5], v[7]],
      [v[8], v[1], v[6]]
    ];

    // Corresponding Abjad letters for each cell
    const wafqAbjadMatrix = wafqMatrix.map(row =>
      row.map(val => numberToAbjadLetters(val))
    );

    return {
      cityAbjad,
      coordsAbjad,
      intentionAbjad,
      intentionText,
      totalSum,
      khadimName,
      talsamVocalized,
      wafqMatrix,
      wafqAbjadMatrix,
      cityArName
    };
  }, [cityName, totalLocationVal, selectedIntentionId, customIntention]);

  // Handler for Download Khatim PNG
  const handleDownloadKhatimPng = async () => {
    if (!hiddenCanvasRef.current) return;

    drawKhatimToCanvas(hiddenCanvasRef.current, {
      cityName,
      cityNameAr: talsamKhatimData.cityArName,
      intentionTitle: selectedIntentionId === 'custom' ? (customIntention || 'Besoin Libre') : (language === 'en' ? INTENTION_PRESETS.find(i=>i.id===selectedIntentionId)?.titleEn : INTENTION_PRESETS.find(i=>i.id===selectedIntentionId)?.titleFr) || '',
      intentionAr: talsamKhatimData.intentionText,
      talsamVocalized: talsamKhatimData.talsamVocalized,
      khadimName: talsamKhatimData.khadimName,
      wafqMatrix: talsamKhatimData.wafqMatrix,
      wafqAbjadMatrix: talsamKhatimData.wafqAbjadMatrix,
      totalSum: talsamKhatimData.totalSum,
      coordsLetters: totalLocationLetters,
      theme: khatimTheme
    });

    const safeFileName = `Khatim_${cityName.replace(/\s+/g, '_')}_${talsamKhatimData.totalSum}.png`;
    await downloadCanvasImage(hiddenCanvasRef.current, safeFileName);
  };

  // Copy Vocalized Talsam
  const handleCopyTalsam = () => {
    navigator.clipboard.writeText(talsamKhatimData.talsamVocalized);
    setTalsamCopied(true);
    setTimeout(() => setTalsamCopied(false), 2500);
  };

  // Copy Summary Handler
  const handleCopySummary = () => {
    const summary = `
=== ${t.title} ===
${t.labels.cityName} ${cityName} (${lat}° N, ${lng}° E)
- DMS: Lat ${latDMS.degrees}° ${latDMS.minutes}' ${latDMS.seconds}" | Long ${lngDMS.degrees}° ${lngDMS.minutes}' ${lngDMS.seconds}"
- ${t.tabs.abjadCoords}: ${totalLocationLetters} (${totalLocationVal})
- ${t.tabs.resonanceCompass} (${selectedCenter.nameFr}): ${geodesy.distanceKm.toFixed(1)} km | ${geodesy.azimuthDeg.toFixed(1)}°
- ${t.labels.esotericQiblaAngle}: ${abjadQiblaData.angleDeg}°
- ${t.labels.soilRuler}: ${tellurismData.ruler.nameFr}
- ${t.labels.zenithTime}: ${solarData.zenithTimeString}
- ${t.tabs.talsamKhatim}: ${talsamKhatimData.talsamVocalized} (Poids: ${talsamKhatimData.totalSum})
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    saveCalculationToHistory({
      toolId: 'sacred-geography',
      toolName: t.title,
      title: `${cityName} (${lat}°, ${lng}°)`,
      summary: `${cityName}: ${geodesy.distanceKm.toFixed(0)}km -> ${selectedCenter.nameFr} (${geodesy.azimuthDeg.toFixed(0)}°)`,
      details: { summary }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans">
      {/* Hidden Canvas element for PNG rendering */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 p-6 sm:p-10 text-white shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Compass size={14} /> {t.headerBadge}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-amber-100 break-words">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Global Continent & City Selector */}
      <ContinentCitySelector
        language={language}
        cityName={cityName}
        setCityName={setCityName}
        lat={lat}
        setLat={setLat}
        lng={lng}
        setLng={setLng}
        onUseMyLocation={handleUseLocation}
        onOpenMap={() => setShowMapModal(true)}
      />

      {/* MAP MODAL */}
      <AnimatePresence>
        {showMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base">
                  <Map size={20} />
                  <span>{t.labels.mapModalTitle}</span>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Instructions Bar */}
              <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex justify-between items-center flex-wrap gap-2">
                <span>{t.labels.mapInstructions}</span>
                <button
                  onClick={handleUseLocation}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Crosshair size={12} />
                  <span>{t.labels.useMyLocation}</span>
                </button>
              </div>

              {/* Leaflet Map Display */}
              <div className="relative flex-1 min-h-[350px] sm:min-h-[450px] w-full bg-slate-900">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />
              </div>

              {/* Modal Footer with Current Coordinates & Confirm Button */}
              <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {t.labels.latitude}: <strong className="text-amber-600 dark:text-amber-400 font-mono text-sm">{lat}° N</strong>
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {t.labels.longitude}: <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{lng}° E</strong>
                  </span>
                </div>

                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  {t.labels.closeMapBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        {[
          { id: 'coords', icon: Globe, label: t.tabs.abjadCoords },
          { id: 'compass', icon: Compass, label: t.tabs.resonanceCompass },
          { id: 'qibla', icon: Navigation, label: t.tabs.abjadQibla },
          { id: 'tellurism', icon: Mountain, label: t.tabs.tellurism },
          { id: 'solar', icon: Sun, label: t.tabs.solarZenith },
          { id: 'talsamKhatim', icon: Wand2, label: t.tabs.talsamKhatim },
          { id: 'comparison', icon: ArrowLeftRight, label: language === 'en' ? 'City Comparison' : language === 'ha' ? 'Kwatancen Birane' : 'Comparaison de Villes' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COORDONNÉES ABJAD */}
      {activeTab === 'coords' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe size={20} className="text-amber-500" />
                <span>{t.tabs.abjadCoords}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.descriptions.abjadCoordsDesc}
              </p>
            </div>

            {/* DMS Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latitude Box */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
                  <span>{t.labels.latitude} (DMS)</span>
                  <span className="font-mono">{latDMS.degrees}° {latDMS.minutes}' {latDMS.seconds}" N</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.degrees} ({latDMS.degrees}°)</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 dir-rtl">{latAbjad.degLetters}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.minutes} ({latDMS.minutes}')</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 dir-rtl">{latAbjad.minLetters}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.seconds} ({latDMS.seconds}")</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400 dir-rtl">{latAbjad.secLetters}</p>
                  </div>
                </div>

                <div className="text-xs text-amber-900 dark:text-amber-200 font-semibold text-center pt-1">
                  {t.labels.latLetters} ({latAbjad.totalVal}) : <strong className="font-mono text-base text-amber-600 dark:text-amber-400 dir-rtl ml-1">{latAbjad.totalLetters}</strong>
                </div>
              </div>

              {/* Longitude Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  <span>{t.labels.longitude} (DMS)</span>
                  <span className="font-mono">{lngDMS.degrees}° {lngDMS.minutes}' {lngDMS.seconds}" E</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.degrees} ({lngDMS.degrees}°)</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 dir-rtl">{lngAbjad.degLetters}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.minutes} ({lngDMS.minutes}')</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 dir-rtl">{lngAbjad.minLetters}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] text-gray-400">{t.labels.seconds} ({lngDMS.seconds}")</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 dir-rtl">{lngAbjad.secLetters}</p>
                  </div>
                </div>

                <div className="text-xs text-indigo-900 dark:text-indigo-200 font-semibold text-center pt-1">
                  {t.labels.lngLetters} ({lngAbjad.totalVal}) : <strong className="font-mono text-base text-indigo-600 dark:text-indigo-400 dir-rtl ml-1">{lngAbjad.totalLetters}</strong>
                </div>
              </div>
            </div>

            {/* Global Location Sigil Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-amber-500/40 text-center space-y-4 text-white">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                {t.labels.geoAbjadSeal}
              </span>
              <div className="text-3xl sm:text-5xl font-black text-amber-300 tracking-wider dir-rtl font-serif">
                {totalLocationLetters}
              </div>
              <div className="text-xs text-gray-300 font-medium">
                {t.labels.totalAbjadWeight} : <strong className="text-emerald-400 text-base ml-1">{totalLocationVal}</strong>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: BOUSSOLE DE RÉSONANCE */}
      {activeTab === 'compass' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass size={20} className="text-amber-500" />
                <span>{t.tabs.resonanceCompass}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.descriptions.resonanceCompassDesc}
              </p>
            </div>

            {/* Select Sacred Center */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                {t.labels.sacredCenter}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SACRED_CENTERS.map((center) => {
                  const isSelected = selectedCenterId === center.id;
                  return (
                    <button
                      key={center.id}
                      onClick={() => setSelectedCenterId(center.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{center.flag}</span>
                          <span>{language === 'en' ? center.nameEn : language === 'ha' ? center.nameHa : center.nameFr}</span>
                        </span>
                        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 dir-rtl">
                          {center.arabicName}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">
                        {language === 'en' ? center.descriptionEn : language === 'ha' ? center.descriptionHa : center.descriptionFr}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geodesic & Compass Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Compass Rose SVG */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-3xl border border-gray-800 relative min-h-[280px]">
                <div className="text-xs text-amber-400 font-bold uppercase mb-4 tracking-widest text-center">
                  {t.labels.compassRoseTitle} ({geodesy.azimuthDeg.toFixed(1)}°)
                </div>

                <svg viewBox="0 0 200 200" className="w-52 h-52">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#334155" strokeWidth="2" />
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                  <text x="100" y="22" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">{t.labels.cardinalN}</text>
                  <text x="182" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">{t.labels.cardinalE}</text>
                  <text x="100" y="188" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">{t.labels.cardinalS}</text>
                  <text x="18" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">{t.labels.cardinalW}</text>

                  <g transform={`rotate(${geodesy.azimuthDeg}, 100, 100)`}>
                    <line x1="100" y1="100" x2="100" y2="28" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                    <polygon points="100,18 94,32 106,32" fill="#10b981" />
                    <circle cx="100" cy="100" r="6" fill="#f59e0b" />
                  </g>
                </svg>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-300 font-semibold">
                    {t.labels.directAxis} : <span className="text-amber-400 font-bold">{selectedCenter.flag} {selectedCenter.arabicName}</span>
                  </p>
                </div>
              </div>

              {/* Geodesic Stats */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-bold">{t.labels.distanceKm}</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                    {geodesy.distanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {t.labels.distanceNautical}: {geodesy.nauticalMiles.toLocaleString(undefined, { maximumFractionDigits: 1 })} NM
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">{t.labels.azimuthDeg}</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {geodesy.azimuthDeg.toFixed(2)}°
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40">
                  <p className="text-xs text-purple-800 dark:text-purple-300 font-bold">{t.labels.resonanceScore}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                      {resonanceScore}%
                    </p>
                    <div className="w-32 bg-purple-200 dark:bg-purple-900 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${resonanceScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: QIBLA PAR L'ABJAD */}
      {activeTab === 'qibla' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Navigation size={20} className="text-amber-500" />
                <span>{t.tabs.abjadQibla}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.descriptions.abjadQiblaDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Abjad Calculations Box */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <span>{t.labels.cityAbjadWeight} ({cityName}) :</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{abjadQiblaData.cityAbjad}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 font-semibold">
                  <span>{t.labels.meccaAbjadWeight} :</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{abjadQiblaData.meccaAbjad}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center text-sm font-extrabold text-gray-900 dark:text-white">
                  <span>{t.labels.combinedSum} :</span>
                  <span className="text-purple-600 dark:text-purple-400 font-mono">{abjadQiblaData.combinedSum}</span>
                </div>
              </div>

              {/* Modulo Calculations Box */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-3">
                <div>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase">{t.labels.esotericQiblaAngle}</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{abjadQiblaData.angleDeg}°</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-gray-400">{t.labels.lunarMansion}</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{abjadQiblaData.mansion}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{t.labels.zodiacSign}</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{abjadQiblaData.zodiac}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dhikr Invocations for Direction */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                {t.labels.orientationDhikr}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {abjadQiblaData.dhikrList.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-1">
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 dir-rtl">{item.name}</p>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {item.count} {t.labels.reiterations}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: TELLURISME SPÉCULATIF */}
      {activeTab === 'tellurism' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mountain size={20} className="text-amber-500" />
                <span>{t.tabs.tellurism}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.descriptions.tellurismDesc}
              </p>
            </div>

            {/* Ruler & Elemental Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Planetary Ruler */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-500/30 text-white space-y-2">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">{t.labels.soilRuler}</p>
                <p className="text-xl font-black text-amber-200">
                  {language === 'en' ? tellurismData.ruler.nameEn : language === 'ha' ? tellurismData.ruler.nameHa : tellurismData.ruler.nameFr}
                </p>
                <div className="pt-2 border-t border-amber-500/20 text-xs space-y-1">
                  <p className="text-gray-300">
                    <strong>{t.labels.recommendedIncense}</strong>
                  </p>
                  <p className="text-amber-300 font-semibold">
                    {language === 'en' ? tellurismData.ruler.incenseEn : language === 'ha' ? tellurismData.ruler.incenseHa : tellurismData.ruler.incenseFr}
                  </p>
                </div>
              </div>

              {/* Elemental Proportions */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-3">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{t.labels.elementalBreakdown}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40">
                    <p className="text-xs font-bold text-red-600">{t.labels.fire}</p>
                    <p className="text-lg font-black text-red-700 font-mono">{elementalDistribution.firePct}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40">
                    <p className="text-xs font-bold text-blue-600">{t.labels.air}</p>
                    <p className="text-lg font-black text-blue-700 font-mono">{elementalDistribution.airPct}%</p>
                  </div>
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-900/40">
                    <p className="text-xs font-bold text-cyan-600">{t.labels.water}</p>
                    <p className="text-lg font-black text-cyan-700 font-mono">{elementalDistribution.waterPct}%</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    <p className="text-xs font-bold text-amber-600">{t.labels.earth}</p>
                    <p className="text-lg font-black text-amber-700 font-mono">{elementalDistribution.earthPct}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suitability Ratings */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                {t.labels.suitabilityRatings}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t.labels.khalwa, pct: tellurismData.khalwaRating, color: 'bg-emerald-600' },
                  { label: t.labels.tilasm, pct: tellurismData.tilasmRating, color: 'bg-amber-600' },
                  { label: t.labels.muraqaba, pct: tellurismData.muraqabaRating, color: 'bg-purple-600' },
                  { label: t.labels.rizq, pct: tellurismData.rizqRating, color: 'bg-indigo-600' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                      <span>{item.label}</span>
                      <span className="font-mono">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                      <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: HEURE DE PASSAGE SOLAIRE */}
      {activeTab === 'solar' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sun size={20} className="text-amber-500" />
                <span>{t.labels.solarPassageTitle}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.labels.solarPassageDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t.labels.datePicker}
                </label>
                <input
                  type="date"
                  value={solarDate}
                  onChange={(e) => setSolarDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none text-xs"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-center">
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold">{t.labels.zenithTime}</p>
                <p className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                  {solarData.zenithTimeString}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-center">
                <p className="text-xs text-indigo-800 dark:text-indigo-300 font-bold">{t.labels.shadowFactor}</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                  {solarData.shadowFactor}
                </p>
              </div>
            </div>

            {/* Solar Pause Recommendation Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex gap-4 items-start">
              <Clock size={24} className="text-amber-500 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {t.labels.pauseRecommendation}
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.labels.pauseRecommendationDesc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 6: TALSAM & KHATIM DE LA VILLE */}
      {activeTab === 'talsamKhatim' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Wand2 size={20} className="text-amber-500" />
                  <span>{t.labels.talsamKhatimTitle}</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.labels.talsamKhatimDesc}
                </p>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
                {[
                  { id: 'gold', label: t.labels.themeGold, color: 'bg-amber-500' },
                  { id: 'parchment', label: t.labels.themeParchment, color: 'bg-amber-200 text-amber-900' },
                  { id: 'emerald', label: t.labels.themeEmerald, color: 'bg-emerald-600' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setKhatimTheme(th.id as any)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      khatimTheme === th.id
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intention / Need Controller */}
            <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/20 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800/40">
              <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">
                {t.labels.selectIntention}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {INTENTION_PRESETS.map((preset) => {
                  const isSelected = selectedIntentionId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedIntentionId(preset.id)}
                      className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-base">{preset.icon}</span>
                      <span className="text-[10px] leading-tight">
                        {language === 'en' ? preset.titleEn : language === 'ha' ? preset.titleHa : preset.titleFr}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedIntentionId === 'custom' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                    {t.labels.customIntentionLabel}
                  </label>
                  <input
                    type="text"
                    value={customIntention}
                    onChange={(e) => setCustomIntention(e.target.value)}
                    placeholder={t.labels.customIntentionPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Vocalized Talsam Display Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/40 text-white space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                    {t.labels.vocalizedTalsamTitle}
                  </span>
                </div>

                <button
                  onClick={handleCopyTalsam}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  {talsamCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{talsamCopied ? t.labels.copied : t.labels.copyTalsamTashkeel}</span>
                </button>
              </div>

              {/* Talsam Text with Tashkeel */}
              <div className="py-4 text-center space-y-3">
                <div className="text-2xl sm:text-4xl font-black text-amber-200 tracking-wider dir-rtl font-serif leading-loose">
                  {talsamKhatimData.talsamVocalized}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-amber-300/80 pt-2 border-t border-amber-500/20 font-mono">
                  <span>{t.labels.servantAngel}: <strong className="text-white text-sm dir-rtl">{talsamKhatimData.khadimName}</strong></span>
                  <span>•</span>
                  <span>{t.labels.reiterationCount}: <strong className="text-emerald-400 text-sm">{talsamKhatimData.totalSum}</strong></span>
                </div>
              </div>
            </div>

            {/* Khatim Wafq 3x3 Visual Box & Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Scroll size={18} className="text-amber-500" />
                  <span>{t.labels.khatimMatrixTitle}</span>
                </h3>

                <button
                  onClick={handleDownloadKhatimPng}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  <Download size={16} />
                  <span>{t.labels.downloadKhatimPng}</span>
                </button>
              </div>

              {/* Interactive Visual Preview Frame of Khatim */}
              <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all space-y-6 text-center ${
                khatimTheme === 'parchment'
                  ? 'bg-amber-100/90 border-amber-700 text-amber-950'
                  : khatimTheme === 'emerald'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                  : 'bg-slate-950 border-amber-500/50 text-amber-100'
              }`}>
                {/* Header Calligraphy */}
                <div className="space-y-1">
                  <p className="text-xs font-serif font-bold text-amber-600 dark:text-amber-400 dir-rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                  <h4 className="text-xl sm:text-2xl font-black font-serif tracking-wide">
                    {cityName} ({talsamKhatimData.cityArName})
                  </h4>
                  <p className="text-xs font-mono opacity-80">
                    {t.labels.totalAbjadWeight}: {talsamKhatimData.totalSum} | Coordonnées: {totalLocationLetters}
                  </p>
                </div>

                {/* 3x3 Ghazali Wafq Table */}
                <div className="max-w-md mx-auto p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-amber-500/40">
                  <div className="grid grid-cols-3 gap-2">
                    {talsamKhatimData.wafqMatrix.map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                            khatimTheme === 'parchment'
                              ? 'bg-amber-50/80 border-amber-700/40 text-amber-950'
                              : khatimTheme === 'emerald'
                              ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-100'
                              : 'bg-slate-900/80 border-amber-500/40 text-amber-100'
                          }`}
                        >
                          <span className="text-lg sm:text-2xl font-black font-mono">{val}</span>
                          <span className="text-xs sm:text-sm font-extrabold font-serif text-amber-500 dir-rtl">
                            {talsamKhatimData.wafqAbjadMatrix[rIdx][cIdx]}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Vocalized Talsam Footer Band */}
                <div className="p-4 rounded-2xl bg-black/30 border border-amber-500/30 max-w-2xl mx-auto space-y-1">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                    {t.labels.vocalizedTalsamTitle}
                  </p>
                  <p className="text-base sm:text-lg font-bold font-serif dir-rtl leading-relaxed text-amber-200">
                    {talsamKhatimData.talsamVocalized}
                  </p>
                  <p className="text-xs font-semibold text-amber-300/80">
                    Khādim: {talsamKhatimData.khadimName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 7: COMPARAISON DE VILLES */}
      {activeTab === 'comparison' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <CityComparisonTab
            language={language}
            city1Name={cityName}
            lat1={lat}
            lng1={lng}
          />
        </motion.div>
      )}
    </div>
  );
}
