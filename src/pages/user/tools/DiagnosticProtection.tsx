import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Activity,
  Compass,
  Moon,
  Sun,
  Flame,
  Wind,
  Droplets,
  Mountain,
  Sparkles,
  Clock,
  MapPin,
  Building2,
  BookOpen,
  Heart,
  Search,
  Share2,
  Download,
  Copy,
  Check,
  RotateCcw,
  Info,
  Calendar,
  Zap,
  Award,
  HelpCircle,
  FileText,
  Eye,
  AlertTriangle,
  Scale,
  Feather,
  Compass as CompassIcon,
  ShoppingBag,
  CloudMoon,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { calculateAbjadValue, numberToAbjadLetters, extractCelestialKhadimName } from '../../../utils/abjad';
import { downloadCanvasImage } from '../../../utils/downloadHelper';

interface SectionDict {
  title: string;
  subtitle: string;
  btnCalculate: string;
  placeholderName: string;
  placeholderMother: string;
}

const UI_TEXTS = {
  fr: {
    pageTitle: "Diagnostic & Protection Spirituelle",
    pageSubtitle: "Bilan complet des nœuds mystiques, influences cosmologiques, harmonies temporelles et remèdes protecteurs",
    tabGlobal: "Diagnostic Global (1-4)",
    tabHarmony: "Harmonies & Affaires",
    tabCosmos: "Cosmos & Horaires",
    tabOniro: "Rêves & Vœux",
    tabProtection: "Éclipses & Hijama",
    
    // Modulo 9
    mod9Title: "1. Diagnostic Modulo 9 (Taba' wal-Mizaj)",
    mod9Desc: "Division de l'Abjad du Nom + Nom de la mère par 9 pour déterminer le Tempérament Spirituel et le Reste Mystique (1 à 9).",
    
    // Modulo 12
    mod12Title: "2. Diagnostic Modulo 12 (Maison de Blocage)",
    mod12Desc: "Identification de la Maison Astrologique de perturbation (Maison I à XII).",

    // Modulo 4
    mod4Title: "3. Dysfonctionnement Élémentaire (Modulo 4)",
    mod4Desc: "Analyse du déséquilibre de l'Élément gouverneur (Feu, Air, Eau, Terre).",

    // Suhuf
    suhufTitle: "4. Recommandations d'Écritures Sacrées (Suhuf)",
    suhufDesc: "Versets coraniques et noms sacrés à transcrire pour dissoudre le blocage.",

    // Influences Temporelles
    temporalTitle: "5. Influences Temporelles & Climat Astrologique",
    temporalDesc: "Analyse des corrélations entre perturbations subies et le climat planétaire actif.",

    // Jihat
    jihatTitle: "6. Orientation Spatiale (Jihat al-Dhikr)",
    jihatDesc: "Direction cardinale optimale pour les séances de méditation et dhikr.",

    // Rizq Commercial
    rizqTitle: "7. Rizq Commercial & Potentiel d'Entreprise",
    rizqDesc: "Évaluation vibratoire du nom d'un projet, boutique ou entreprise avec le propriétaire.",

    // Décodeur de rêves
    dreamTitle: "8. Décodeur Abjad de Rêves",
    dreamDesc: "Analyse numérique des mots-clés d'un songe pour révéler sa guidance ou sa protection.",

    // Tiers de la nuit
    nightTitle: "9. Calculateur du Dernier Tiers de la Nuit",
    nightDesc: "Détermination précise des heures de bénédiction et Tahajjud selon Maghrib et Fajr.",

    // Harmonie de biens
    propertyTitle: "10. Harmonie de Biens (Achat Immobilier)",
    propertyDesc: "Adéquation vibratoire entre l'acquéreur et l'adresse du bien.",

    // Impact Saisonnier
    seasonTitle: "11. Impact Saisonnier Élémentaire",
    seasonDesc: "Influence de la saison actuelle sur le tempérament personnel.",

    // Calendrier Hijama
    hijamaTitle: "12. Calendrier Prophétique de Hijama",
    hijamaDesc: "Jours de la Sunnah (17, 19, 21 du mois hégirien) et créneaux favorables.",

    // Guide Encens
    incenseTitle: "13. Guide d'Encens & Heures Planétaires",
    incenseDesc: "Parfums et Bukhoor recommandés selon l'heure planétaire courante.",

    // Aptitude Spirituelle
    qabiliyyahTitle: "14. Aptitude Spirituelle (Qabiliyyah)",
    qabiliyyahDesc: "Évaluation du potentiel d'affinité avec les sciences traditionnelles.",

    // Résonance Géographique
    geoTitle: "15. Résonance Géographique (Ville/Pays)",
    geoDesc: "Compatibilité numérique entre un prénom et un lieu de résidence ou de voyage.",

    // Intentions Symboliques
    niyyahTitle: "16. Structuralisation des Intentions (Niyyah)",
    niyyahDesc: "Équilibrage numérique de la formulation d'un vœu ou d'une prière.",

    // Éclipses
    eclipseTitle: "17. Traqueur d'Impact d'Éclipses",
    eclipseDesc: "Vigilance spirituelle lors des éclipses solaires et lunaires à venir.",

    labels: {
      personName: "Prénom / Nom",
      motherName: "Nom de la Mère",
      businessName: "Nom du Projet / Boutique",
      propertyAddress: "Adresse / Numéro du Bien",
      cityName: "Nom de la Ville / Pays",
      dreamKeywords: "Mots-clés du rêve (ex: Serpent, Eau, Clef)",
      wishText: "Formulation du Vœu / Intention",
      sunsetTime: "Heure du Coucher de Soleil (Maghrib)",
      sunriseTime: "Heure du Lever du Soleil (Fajr)",
      btnCalculate: "Lancer le Diagnostic",
      copied: "Copié !",
      copy: "Copier",
      downloadParchment: "Télécharger la Fiche de Protection",
      resultTitle: "Résultat du Diagnostic Spirituel",
      abjadVal: "Valeur Abjad Totale",
      remainder: "Reste Mystique",
      element: "Élément",
      house: "Maison Astrologique",
      cardinal: "Direction Cardinale",
      remedy: "Remède Spirituel & Prescription",
      score: "Indice de Compatibilité",
      status: "Évaluation",
      hours: "Créneaux Clés"
    }
  },
  en: {
    pageTitle: "Diagnostic & Spiritual Protection",
    pageSubtitle: "Comprehensive analysis of mystical knots, cosmological influences, temporal harmonies, and protective remedies",
    tabGlobal: "Global Diagnostic (1-4)",
    tabHarmony: "Harmony & Business",
    tabCosmos: "Cosmos & Timing",
    tabOniro: "Dreams & Intentions",
    tabProtection: "Eclipses & Hijama",

    mod9Title: "1. Modulo 9 Diagnostic (Taba' wal-Mizaj)",
    mod9Desc: "Division of Name + Mother's Name Abjad by 9 to determine Spiritual Temperament and Mystical Remainder (1 to 9).",

    mod12Title: "2. Modulo 12 Diagnostic (Blockage House)",
    mod12Desc: "Identification of the perturbed Astrological House (House I to XII).",

    mod4Title: "3. Elemental Dysfunction (Modulo 4)",
    mod4Desc: "Analysis of elemental imbalance (Fire, Air, Water, Earth).",

    suhufTitle: "4. Sacred Writings Recommendation (Suhuf)",
    suhufDesc: "Quranic verses and sacred names to transcribe for dissolving blockages.",

    temporalTitle: "5. Temporal Influences & Astrological Climate",
    temporalDesc: "Analysis of correlation between symptoms and planetary hours.",

    jihatTitle: "6. Spatial Direction (Jihat al-Dhikr)",
    jihatDesc: "Optimal cardinal direction for meditation and dhikr sessions.",

    rizqTitle: "7. Business Rizq & Project Potential",
    rizqDesc: "Vibrational evaluation of a shop or project name with its owner.",

    dreamTitle: "8. Abjad Dream Symbol Decoder",
    dreamDesc: "Numerical analysis of key dream words for spiritual guidance.",

    nightTitle: "9. Last Third of the Night Calculator",
    nightDesc: "Precise determination of Tahajjud and blessing hours from Maghrib and Fajr.",

    propertyTitle: "10. Real Estate Property Harmony",
    propertyDesc: "Vibrational alignment between buyer and property address.",

    seasonTitle: "11. Seasonal Elemental Impact",
    seasonDesc: "Influence of current season on personal temperament.",

    hijamaTitle: "12. Prophetic Hijama Calendar",
    hijamaDesc: "Sunnah days (17, 19, 21 of Hijri month) and optimal time slots.",

    incenseTitle: "13. Incense & Planetary Hour Guide",
    incenseDesc: "Recommended Bukhoor according to active planetary hour.",

    qabiliyyahTitle: "14. Spiritual Aptitude (Qabiliyyah)",
    qabiliyyahDesc: "Evaluation of innate affinity for traditional esoteric sciences.",

    geoTitle: "15. Geographical Resonance (City/Country)",
    geoDesc: "Numerical compatibility between a name and residence or travel location.",

    niyyahTitle: "16. Intention Structuring (Niyyah)",
    niyyahDesc: "Numerical balancing of prayer or wish formulations.",

    eclipseTitle: "17. Eclipse Impact Tracker",
    eclipseDesc: "Spiritual vigilance during upcoming solar and lunar eclipses.",

    labels: {
      personName: "First / Last Name",
      motherName: "Mother's Name",
      businessName: "Project / Shop Name",
      propertyAddress: "Address / Property Number",
      cityName: "City / Country Name",
      dreamKeywords: "Dream Keywords (e.g. Snake, Water, Key)",
      wishText: "Wish / Intention Text",
      sunsetTime: "Sunset Time (Maghrib)",
      sunriseTime: "Sunrise Time (Fajr)",
      btnCalculate: "Run Diagnostic",
      copied: "Copied!",
      copy: "Copy",
      downloadParchment: "Download Protection Sheet",
      resultTitle: "Spiritual Diagnostic Result",
      abjadVal: "Total Abjad Value",
      remainder: "Mystical Remainder",
      element: "Element",
      house: "Astrological House",
      cardinal: "Cardinal Direction",
      remedy: "Spiritual Remedy & Prescription",
      score: "Compatibility Score",
      status: "Evaluation",
      hours: "Key Time Slots"
    }
  },
  ha: {
    pageTitle: "Bincike & Kariyar Asiri (Diagnostic & Protection)",
    pageSubtitle: "Cikakken bincike na sa'a, daidaiton taurari, kariya da addu'o'in warware matsaloli",
    tabGlobal: "Binciken Farko (1-4)",
    tabHarmony: "Daidaito & Kasuwanci",
    tabCosmos: "Taurari & Lokuta",
    tabOniro: "Mafarki & Niyya",
    tabProtection: "Rana/Wata & Hijama",

    mod9Title: "1. Bincike na Modulo 9 (Taba' wal-Mizaj)",
    mod9Desc: "Raba lamba ta Abjad na Suna + Sunan Uwa da 9 domin gano Yanayin Asiri (1 zuwa 9).",

    mod12Title: "2. Bincike na Modulo 12 (Gidan Matsala)",
    mod12Desc: "Gano Gidan Taurari (Gida I zuwa XII) da ke kawo matsala ko toshewa.",

    mod4Title: "3. Karkataccen Yanayi (Modulo 4)",
    mod4Desc: "Gano matsalar Iska, Wuta, Ruwa ko Kasa a jikin mutum.",

    mod4Desc2: "Shawarwari na Rubutun Ayoyi na Asiri.",
    suhufTitle: "4. Ayoyin Rubutu na Kariya (Suhuf)",
    suhufDesc: "Aya da Sunayen Allah da za a rubuta a shaye ko a rataya.",

    temporalTitle: "5. Tasirin Lokaci & Taurari",
    temporalDesc: "Duba alakar matsaloli da sa'o'in taurari na kowace rana.",

    jihatTitle: "6. Madaidaicin Bangare (Jihat al-Dhikr)",
    jihatDesc: "Madaidaicin bangare (Gabas, Yamma, Arewa, Kudu) na zikiri.",

    rizqTitle: "7. Rizq na Kasuwanci & Suna",
    rizqDesc: "Auna dacen sunan shaguna, kasuwanci ko aiki da sunan mai shi.",

    dreamTitle: "8. Fasassar Mafarki ta Abjad",
    dreamDesc: "Bincika lambobi na kalmomin mafarki domin gano ma'ana ko kariya.",

    nightTitle: "9. Lissafin Sulusi na Karshe na Dare",
    nightDesc: "Lissafin ainihin lokacin Tahajjud daga Magriba zuwa Asuba.",

    propertyTitle: "10. Dacewar Gida ko Filaye (Achat)",
    propertyDesc: "Auna dacen sunan mai saya da adireshin gida ko fili.",

    seasonTitle: "11. Tasirin Lokacin Shekara (Saisons)",
    seasonDesc: "Irin tasirin da lokacin rani ko damina ke yi wa mutum.",

    hijamaTitle: "12. Ranakun Kaho na Sunnah (Hijama)",
    hijamaDesc: "Ranakun 17, 19, 21 na watan musulunci domin cin kaho.",

    incenseTitle: "13. Jagoran Turaren Wuta (Bukhoor)",
    incenseDesc: "Irin turaren da ya dace a kunna a sa'o'in taurari.",

    qabiliyyahTitle: "14. Dace da Ilimin Asiri (Qabiliyyah)",
    qabiliyyahDesc: "Auna kwazato da dacewar mutum da ilimin Abjad ko Awfaq.",

    geoTitle: "15. Dacewar Garuruwa da Kasashe",
    geoDesc: "Auna dacen sunan mutum da birni ko kasar da yake son tafiya.",

    niyyahTitle: "16. Tsara Niyya & Addu'a (Niyyah)",
    niyyahDesc: "Lissafa cikar lambobin addu'a domin samun karbuwa.",

    eclipseTitle: "17. Kariyar Husufi da Kusufi",
    eclipseDesc: "Addu'o'i da tsaro lokacin da aka yi husufin rana ko wata.",

    labels: {
      personName: "Sunan Mutum / Cikakken Suna",
      motherName: "Sunan Mahaifiya",
      businessName: "Sunan Shago / Kasuwanci",
      propertyAddress: "Adireshin Gida / Lambar Fili",
      cityName: "Sunan Birni / Kasa",
      dreamKeywords: "Kalmomin Mafarki (misali: Maciji, Ruwa, Makulli)",
      wishText: "Rubutun Buqata / Niyya",
      sunsetTime: "Lokacin Cadi (Magriba)",
      sunriseTime: "Lokacin Asuba (Fajr)",
      btnCalculate: "Fara Bincike",
      copied: "An Kwafa!",
      copy: "Kwafa",
      downloadParchment: "Sauke Takardar Kariya",
      resultTitle: "Sakamakon Binciken Asiri",
      abjadVal: "Cikakken Abjad",
      remainder: "Sauran Lissafi",
      element: "Yanayi (Element)",
      house: "Gidan Taurari",
      cardinal: "Bangaren Zikiri",
      remedy: "Magani & Ayoyin Kariya",
      score: "Gwada Dacewa (%)",
      status: "Matsayi",
      hours: "Sa'o'i na Albarka"
    }
  }
};

// Modulo 9 Profiles Data
const MODULO_9_PROFILES = [
  {
    rem: 1,
    nature: "Feu / Alif (النَّار - أ)",
    element: "Feu",
    governor: "Alif (أ) - Shams (Soleil)",
    cardinal: "Est (شرق)",
    spiritualProfile: "Lumière d'Initiation & Volonté d'Action. Profil de leader spirituel, sujet aux accès de colère ou aux maux de tête en cas de blocage.",
    houseBlockage: "Obstacle d'Orgueil ou Jalousie Directe",
    suhuf: "Sourate Al-Fatiha + Ayat al-Kursi (7 fois avec safran)",
    remedy: "Bain de purification à l'eau de rose coranisée le Dimanche au lever du soleil."
  },
  {
    rem: 2,
    nature: "Terre / Ba (الأَرْض - ب)",
    element: "Terre",
    governor: "Ba (ب) - Qamar (Lune)",
    cardinal: "Sud (جنوب)",
    spiritualProfile: "Ancrage, Stabilité & Richesse. Risque de lourdeur physique, fatigue matinale et stagnation de subsistance quand perturbé.",
    houseBlockage: "Blocage des Biens & Richesse Matérielle",
    suhuf: "Sourate Ya-Sin + Verset du Trône (3 fois sur plaque blanche)",
    remedy: "Fumigation d'Oudh et Santal le Lundi soir, aumône de pain ou céréales aux indigents."
  },
  {
    rem: 3,
    nature: "Air / Jim (الهَوَاء - ج)",
    element: "Air",
    governor: "Jim (ج) - Utarid (Mercure)",
    cardinal: "Nord (شمال)",
    spiritualProfile: "Communication, Intellect & Subtilité. Tendance aux doutes obsessionnels, gaz/ballonnements et instabilité de pensée.",
    houseBlockage: "Incompréhension des Proches & Dispersion mental",
    suhuf: "Sourate Al-Inshirah (9 fois) + Asma al-Husna (Ya Alim, Ya Hakim)",
    remedy: "Encens Mastic et Benjoin le Mercredi, dhikr posé avec respiration profonde à l'Aube."
  },
  {
    rem: 4,
    nature: "Eau / Dal (المَاء - د)",
    element: "Eau",
    governor: "Dal (د) - Zuhara (Vénus)",
    cardinal: "Ouest (غرب)",
    spiritualProfile: "Intériorité, Émotions & Douceur. Risque de mélancolie, rétention d'eau, attachement toxique ou tristesse inexpliquée.",
    houseBlockage: "Attachement Emotionnel & Blocage Sentimental",
    suhuf: "Sourate Al-Kawtar (70 fois) + Ya Wadud Ya Latif",
    remedy: "Boire de l'eau de Zamzam infusée au safran le Vendredi avant la prière du Jumu'ah."
  },
  {
    rem: 5,
    nature: "Feu / Ha (النَّار - هـ)",
    element: "Feu",
    governor: "Ha (هـ) - Mrikkh (Mars)",
    cardinal: "Est (شرق)",
    spiritualProfile: "Pouvoir, Énergie & Charisme Royal. Risque d'attaques directes, conflits soudains et tensions musculaires.",
    houseBlockage: "Conflits d'Autorité & Oppositions Violentes",
    suhuf: "Sourate Al-Fil + Ayat al-Hifz (7 fois)",
    remedy: "Lavage au sel marin purifié et eau de fleur d'oranger le Mardi."
  },
  {
    rem: 6,
    nature: "Terre / Waw (الأَرْض - و)",
    element: "Terre",
    governor: "Waw (و) - Mushtari (Jupiter)",
    cardinal: "Sud (جنوب)",
    spiritualProfile: "Justice, Foi & Expansion Bénie. Risque de stagnation professionnelle lors des mauvaises conjonctures.",
    houseBlockage: "Frein dans l'Élévation Sociale ou les Contrats",
    suhuf: "Sourate Al-Waqi'ah + Ya Razzaq Ya Fattah",
    remedy: "Encens de Safran et Santal rouge le Jeudi matin."
  },
  {
    rem: 7,
    nature: "Air / Zay (الهَوَاء - ز)",
    element: "Air",
    governor: "Zay (ز) - Zuhal (Saturne)",
    cardinal: "Nord (شمال)",
    spiritualProfile: "Prophétie, Ascèse & Profondeur. Sujet à la solitude, lourdeur des membres et isolement involontaire.",
    houseBlockage: "Sortilège d'Enfermement ou Peur Nocturne",
    suhuf: "Sourate Al-Falaq & An-Nas (21 fois) + Ayat al-Kursi",
    remedy: "Fumigation de Myrrhe et Graine Noire (Habat al-Baraka) le Samedi."
  },
  {
    rem: 8,
    nature: "Eau / Hah (المَاء - ح)",
    element: "Eau",
    governor: "Hah (ح) - Qamar/Utarid",
    cardinal: "Ouest (غرب)",
    spiritualProfile: "Purification, Clémence & Miséricorde. Sujet au mauvais œil (Ayn) par excès d'empathie.",
    houseBlockage: "Mauvais Œil sur les Relations & Santé",
    suhuf: "Sourate Al-Qalam (Versets 51-52) + Ya Shafi Ya Kafi",
    remedy: "Bain à l'eau de pluie ou de puits coranisée le Vendredi soir."
  },
  {
    rem: 9,
    nature: "Axe Céleste / Taa (النُّور - ط)",
    element: "Lumière",
    governor: "Taa (ط) - Qutb (Axe Céleste)",
    cardinal: "Qibla / Centre (Kabaa)",
    spiritualProfile: "Perfection Numérique & Protection Élevée. Capacité naturelle de vision et intuition supérieure.",
    houseBlockage: "Épreuve de Purification d'Élévation Spirituelle",
    suhuf: "Sourate Al-Ikhlas (111 fois) + Asma al-Husna accomplis",
    remedy: "Retraite de Dhikr (Khilwah) de 3 jours avec jeûne et invocations à l'Aube."
  }
];

// Astrological Houses Data
const HOUSES_BLOCKAGE = [
  { id: 1, name: "Maison I (L'Âme / An-Nafs)", desc: "Blocage personnel, perte d'identité, doutes et épuisement d'énergie vitale." },
  { id: 2, name: "Maison II (Richesses / Al-Mal)", desc: "Freins financiers, fuite des ressources et stagnation des revenus." },
  { id: 3, name: "Maison III (Entourage / Al-Ikhwan)", desc: "Conflits avec les proches, mauvaises langues et rupture de communication." },
  { id: 4, name: "Maison IV (Le Foyer / Al-Maskan)", desc: "Lourdeur dans la maison, disputes familiales et instabilité du lieu de vie." },
  { id: 5, name: "Maison V (Projets / Al-Aulad)", desc: "Blocage de la créativité, difficulté de réalisation des projets et enfants." },
  { id: 6, name: "Maison VI (Épreuves / Al-Amrad)", desc: "Fatigue chronique, maladies inexpliquées et attaques corporelles." },
  { id: 7, name: "Maison VII (Alliances / Al-Zawaj)", desc: "Ruptures sentimentales, blocage de mariage et trahison d'associés." },
  { id: 8, name: "Maison VIII (Angoisses / Al-Khawf)", desc: "Insomnies, peurs irraisonnées et transformations douloureuses." },
  { id: 9, name: "Maison IX (Voyages & Foi / Al-Safar)", desc: "Blocage des visas/voyages, stagnation dans les études et la foi." },
  { id: 10, name: "Maison X (Réputation / Al-Jah)", desc: "Obstacles professionnels, perte de statut et mauvais œil sur la carrière." },
  { id: 11, name: "Maison XI (Protecteurs / Al-Raja)", desc: "Déception des soutiens, promesses non tenues et trahison amicale." },
  { id: 12, name: "Maison XII (Ennemis Cachés / Al-A'da)", desc: "Jalousie occulte, mauvais sortilège (Sihr) et ennemis invisibles." }
];

export const DiagnosticProtection: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'global' | 'harmony' | 'cosmos' | 'oniro' | 'protection'>('global');

  // Input states for feature 1 to 4 (Global Diagnostic)
  const [personName, setPersonName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [hasCalculatedGlobal, setHasCalculatedGlobal] = useState(false);

  // Input states for Rizq Commercial
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessResult, setBusinessResult] = useState<any>(null);

  // Input states for Dream Decoder
  const [dreamInput, setDreamInput] = useState('');
  const [dreamResult, setDreamResult] = useState<any>(null);

  // Input states for Night Thirds
  const [sunsetTime, setSunsetTime] = useState('19:30');
  const [sunriseTime, setSunriseTime] = useState('05:30');

  // Input states for Property Harmony
  const [buyerName, setBuyerName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyResult, setPropertyResult] = useState<any>(null);

  // Input states for Geo Resonance
  const [geoPersonName, setGeoPersonName] = useState('');
  const [cityName, setCityName] = useState('');
  const [geoResult, setGeoResult] = useState<any>(null);

  // Input states for Niyyah
  const [wishText, setWishText] = useState('');
  const [niyyahResult, setNiyyahResult] = useState<any>(null);

  const [copied, setCopied] = useState(false);

  // Abjad calculations for Global Diagnostic
  const globalCalculations = useMemo(() => {
    if (!personName) return null;
    const nameVal = calculateAbjadValue(personName);
    const motherVal = motherName ? calculateAbjadValue(motherName) : 0;
    const totalVal = nameVal + motherVal;

    if (totalVal === 0) return null;

    // Modulo 9
    const rem9 = totalVal % 9 === 0 ? 9 : totalVal % 9;
    const profile9 = MODULO_9_PROFILES.find(p => p.rem === rem9) || MODULO_9_PROFILES[0];

    // Modulo 12
    const rem12 = totalVal % 12 === 0 ? 12 : totalVal % 12;
    const house12 = HOUSES_BLOCKAGE.find(h => h.id === rem12) || HOUSES_BLOCKAGE[0];

    // Modulo 4
    const rem4 = totalVal % 4; // 0=Terre, 1=Feu, 2=Air, 3=Eau
    const elementsListMap = {
      fr: [
        { name: "Terre (Ancrage & Matière)", desc: "Excès de lourdeur ou blocage physique. Nécessite fumigation d'Air et mouvement." },
        { name: "Feu (Énergie & Passion)", desc: "Excès de chaleur, nervosité ou maux de tête. Nécessite purification par l'Eau coranisée." },
        { name: "Air (Pensée & Subtilité)", desc: "Dispersion spirituelle ou doutes. Nécessite fixation par la Terre et Dhikr régulier." },
        { name: "Eau (Émotion & Intériorité)", desc: "Sensibilité excessive ou mélancolie. Nécessite dynamisation par le Feu et versets de lumière." }
      ],
      en: [
        { name: "Earth (Grounding & Matter)", desc: "Excess heaviness or physical blockage. Requires Air fumigation and movement." },
        { name: "Fire (Energy & Passion)", desc: "Excess heat, nervousness or headaches. Requires purification with Quranic water." },
        { name: "Air (Thought & Subtlety)", desc: "Spiritual dispersion or doubts. Requires Earth grounding and regular Dhikr." },
        { name: "Water (Emotion & Inwardness)", desc: "Excess sensitivity or melancholy. Requires Fire activation and light verses." }
      ],
      ha: [
        { name: "Kasa (Daidaito & Abu)", desc: "Tawayar nauyi ko toshewar jiki. Yana bukatar turaren Iska da motsa jiki." },
        { name: "Wuta (Karfi & Tsumi)", desc: "Karfin zafi, fushi ko ciwon kai. Yana bukatar tsarkakewa da ruwan Alqur'ani." },
        { name: "Iska (Tunani & Dabara)", desc: "Tarwatsewar ruhi ko shakka. Yana bukatar kariya ta Kasa da Dhikr na yau da kullum." },
        { name: "Ruwa (Ji da Sakani)", desc: "Yawan damuwa ko kadaici. Yana bukatar karfafa ta Wuta da ayoyin Haske." }
      ]
    };
    const elementsList = elementsListMap[(language as 'fr'|'en'|'ha')] || elementsListMap.fr;
    const element4 = elementsList[rem4];

    // Angelic Khadim
    const khadim = extractCelestialKhadimName(totalVal);

    // Qabiliyyah (Aptitude Spirituelle)
    const qabiliyyahScore = (totalVal % 100) + 1;
    const qabiliyyahTypes = {
      fr: [
        "Discipline des Noms Divins (Asma al-Husna) & Zikr",
        "Science des Lettres (Ilm al-Huruf) & Khawatim",
        "Invocations de Lumière & Rouhaniyya Alawi",
        "Protections, Ruqyah & Purification des Maux"
      ],
      en: [
        "Discipline of Divine Names (Asma al-Husna) & Dhikr",
        "Science of Letters (Ilm al-Huruf) & Khawatim",
        "Light Invocations & Celestial Spirituality",
        "Protections, Ruqyah & Purification from Evils"
      ],
      ha: [
        "Hanyar Sunayen Allah (Asma al-Husna) da Dhikr",
        "Ilimin Haruffa (Ilm al-Huruf) da Khawatim",
        "Invocations na Haske da Ruhiyyar Alawi",
        "Kariya, Ruqyah da Tsarkake Cuta"
      ]
    }[(language as 'fr'|'en'|'ha')] || [
      "Discipline des Noms Divins (Asma al-Husna) & Zikr",
      "Science des Lettres (Ilm al-Huruf) & Khawatim",
      "Invocations de Lumière & Rouhaniyya Alawi",
      "Protections, Ruqyah & Purification des Maux"
    ];
    
    let qabiliyyahType = qabiliyyahTypes[0];
    if (totalVal % 4 === 1) qabiliyyahType = qabiliyyahTypes[1];
    else if (totalVal % 4 === 2) qabiliyyahType = qabiliyyahTypes[2];
    else if (totalVal % 4 === 3) qabiliyyahType = qabiliyyahTypes[3];

    return {
      nameVal,
      motherVal,
      totalVal,
      rem9,
      profile9,
      rem12,
      house12,
      rem4,
      element4,
      khadim,
      qabiliyyahScore,
      qabiliyyahType
    };
  }, [personName, motherName, language]);

  // Night Thirds calculation
  const nightThirds = useMemo(() => {
    try {
      const [sH, sM] = sunsetTime.split(':').map(Number);
      const [rH, rM] = sunriseTime.split(':').map(Number);

      let sunsetMinutes = sH * 60 + sM;
      let sunriseMinutes = rH * 60 + rM;

      if (sunriseMinutes <= sunsetMinutes) {
        sunriseMinutes += 24 * 60; // Next day
      }

      const totalNightMinutes = sunriseMinutes - sunsetMinutes;
      const oneThird = totalNightMinutes / 3;

      const firstThirdEnd = sunsetMinutes + oneThird;
      const secondThirdEnd = sunsetMinutes + 2 * oneThird;

      const formatTime = (mins: number) => {
        const m = Math.floor(mins) % (24 * 60);
        const h = Math.floor(m / 60);
        const min = Math.floor(m % 60);
        return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      };

      return {
        sunset: sunsetTime,
        sunrise: sunriseTime,
        totalDuration: `${Math.floor(totalNightMinutes / 60)}h ${Math.floor(totalNightMinutes % 60)}m`,
        firstThird: `${sunsetTime} - ${formatTime(firstThirdEnd)}`,
        secondThird: `${formatTime(firstThirdEnd)} - ${formatTime(secondThirdEnd)}`,
        lastThird: `${formatTime(secondThirdEnd)} - ${sunriseTime}`, // Blessed Tahajjud window
        lastThirdStart: formatTime(secondThirdEnd)
      };
    } catch (e) {
      return null;
    }
  }, [sunsetTime, sunriseTime]);

  // Business Rizq calculation
  const handleCalculateBusiness = () => {
    if (!businessName) return;
    const bVal = calculateAbjadValue(businessName);
    const oVal = ownerName ? calculateAbjadValue(ownerName) : 0;
    const total = bVal + oVal;

    const rem = total % 9 === 0 ? 9 : total % 9;
    const score = Math.min(99, Math.max(55, 60 + (total % 40)));

    let status = "Prospérité & Croissance Bénie";
    if (rem === 1 || rem === 5) status = "Expansion Rapide & Fort Impact Visuel";
    else if (rem === 2 || rem === 6) status = "Stabilité Durable & Richesse Progressive";
    else if (rem === 3 || rem === 7) status = "Excellente Réputation & Innovation Commerciale";
    else status = "Attraction de la Clientèle & Harmonie Bénie";

    setBusinessResult({
      bVal,
      oVal,
      total,
      score,
      status,
      recommendedAsma: "يَا رَزَّاقُ يَا فَتَّاحُ يَا بَاسِطُ (Ya Razzaq, Ya Fattah, Ya Basit)",
      openingDay: rem % 2 === 0 ? "Jeudi (Al-Khamis)" : "Lundi (Al-Ithnayn)"
    });
  };

  // Dream decoder calculation
  const handleCalculateDream = () => {
    if (!dreamInput) return;
    const val = calculateAbjadValue(dreamInput);
    const rem = val % 4;

    const interpretations = [
      { type: "Avertissement de Matière & Ancrage", verse: "Sourate Al-Baqarah (Aya 255)", advice: "Invoquer la protection contre le doute et faire une petite aumône (Sadaqah)." },
      { type: "Annonce de Réussite & Lumière", verse: "Sourate An-Nasr & Al-Fath", advice: "Rendre grâce par 100 Istighfar et continuer avec sérénité." },
      { type: "Avis de Prudence Relationnelle", verse: "Sourate Al-Falaq & An-Nas", advice: "Réciter les Mu'awwidhatayn 3 fois avant le coucher." },
      { type: "Signe de Guérison & Bénédiction", verse: "Sourate Ya-Sin (Aya 58)", advice: "Boire un verre d'eau coranisée le matin à jeun." }
    ];

    setDreamResult({
      val,
      letters: numberToAbjadLetters(val),
      data: interpretations[rem]
    });
  };

  // Property Harmony calculation
  const handleCalculateProperty = () => {
    if (!buyerName || !propertyAddress) return;
    const buyVal = calculateAbjadValue(buyerName);
    const propVal = calculateAbjadValue(propertyAddress);
    const sum = buyVal + propVal;

    const score = 65 + (sum % 35);
    const rem = sum % 9;

    setPropertyResult({
      buyVal,
      propVal,
      sum,
      score,
      recommendation: rem % 2 === 0
        ? "Excellente harmonie naturelle. Laver le seuil à l'eau salée coranisée avant l'emménagement."
        : "Bonne compatibilité. Réciter la Sourate Al-Baqarah dans la demeure durant 3 jours consécutifs."
    });
  };

  // Geo Resonance calculation
  const handleCalculateGeo = () => {
    if (!geoPersonName || !cityName) return;
    const pVal = calculateAbjadValue(geoPersonName);
    const cVal = calculateAbjadValue(cityName);
    const total = pVal + cVal;

    const score = 70 + (total % 28);

    setGeoResult({
      pVal,
      cVal,
      score,
      verdict: score > 85 ? "Très Forte Résonance - Lieu Propice au Succès & à l'Épanouissement" : "Résonance Favorable - Prospérité sous condition de régularité du Dhikr."
    });
  };

  // Niyyah Wish calculation
  const handleCalculateNiyyah = () => {
    if (!wishText) return;
    const val = calculateAbjadValue(wishText);
    const khadim = extractCelestialKhadimName(val);

    setNiyyahResult({
      val,
      letters: numberToAbjadLetters(val),
      khadim: khadim.name,
      recommendedCount: val > 1000 ? val % 1000 : val,
      balancedFormula: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِسِرِّ (${wishText}) وَبِعَظَمَةِ اسْمِكَ العَظِيمِ أَنْ تَقْضِيَ حَاجَتِي.`
    });
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-emerald-500/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShieldCheck size={320} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Diagnostic Complete & Protective Shield
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-emerald-100">
            {t.pageTitle}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {[
          { id: 'global', label: t.tabGlobal, icon: Activity },
          { id: 'harmony', label: t.tabHarmony, icon: Building2 },
          { id: 'cosmos', label: t.tabCosmos, icon: Compass },
          { id: 'oniro', label: t.tabOniro, icon: CloudMoon },
          { id: 'protection', label: t.tabProtection, icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GLOBAL DIAGNOSTIC (Features 1 to 6) */}
      {activeTab === 'global' && (
        <div className="space-y-8">
          {/* Main Input Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
                <Search size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Saisie du Nom & Filiation (Diagnostic Modulo 9, 12, 4)
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Calcule l'empreinte spirituelle globale à partir du prénom de la personne et de sa mère.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t.labels.personName} *
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="ex: Muhammad (محمد)"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t.labels.motherName} (Optionnel)
                </label>
                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="ex: Maryam (مريم)"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {personName && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  <span>Poids Abjad Prénom: <strong>{calculateAbjadValue(personName)}</strong></span>
                  {motherName && <span className="ml-4">Poids Mère: <strong>{calculateAbjadValue(motherName)}</strong></span>}
                  <span className="ml-4 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    Somme Totale: {calculateAbjadValue(personName) + calculateAbjadValue(motherName)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results Grid if calculated */}
          {globalCalculations && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feature 1: Modulo 9 */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Activity size={18} />
                    <span>{t.mod9Title}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                    Reste : {globalCalculations.rem9} / 9
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tempérament & Élément :</span>
                    <p className="font-bold text-emerald-700 dark:text-emerald-300 text-base">
                      {globalCalculations.profile9.nature}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Gouverneur & Lettre :</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {globalCalculations.profile9.governor}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Profil Spirituel :</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                      {globalCalculations.profile9.spiritualProfile}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Modulo 12 */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <AlertTriangle size={18} />
                    <span>{t.mod12Title}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                    Maison {globalCalculations.rem12} / 12
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Domaine de Blocage Astrologique :</span>
                    <p className="font-bold text-amber-700 dark:text-amber-300 text-base">
                      {globalCalculations.house12.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Symptômes & Manifestations :</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                      {globalCalculations.house12.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Modulo 4 (Elemental Dysfunction) */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Scale size={18} />
                    <span>{t.mod4Title}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs">
                    Modulo 4 = {globalCalculations.rem4}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Élément Perturbé / Dominant :</span>
                    <p className="font-bold text-indigo-700 dark:text-indigo-300 text-base">
                      {globalCalculations.element4.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Diagnostic Élémentaire :</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl">
                      {globalCalculations.element4.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 4: Suhuf (Sacred Writings) */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-teal-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
                    <Feather size={18} />
                    <span>{t.suhufTitle}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Versets & Noms à transcrire :</span>
                    <p className="font-bold text-teal-700 dark:text-teal-300 text-sm bg-teal-50 dark:bg-teal-950/40 p-3 rounded-2xl border border-teal-200 dark:border-teal-800">
                      {globalCalculations.profile9.suhuf}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Rituel de Dissolution :</span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {globalCalculations.profile9.remedy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 6: Jihat (Spatial Direction) & Angelic Khadim */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-purple-500/30 space-y-4 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 gap-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <CompassIcon size={18} />
                    <span>{t.jihatTitle} & Khadim Céleste</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-extrabold text-xs">
                    Direction : {globalCalculations.profile9.cardinal}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900">
                    <span className="text-gray-500 dark:text-gray-400 font-bold block mb-1">Orientation Dhikr</span>
                    <p className="font-extrabold text-purple-700 dark:text-purple-300 text-base">
                      {globalCalculations.profile9.cardinal}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">S'orienter vers cette direction lors des séances de méditation profonde.</p>
                  </div>

                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900">
                    <span className="text-gray-500 dark:text-gray-400 font-bold block mb-1">Khadim Céleste Extrait</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 text-base dir-rtl">
                      {globalCalculations.khadim.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{globalCalculations.khadim.invocation}</p>
                  </div>

                  <div className="p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900">
                    <span className="text-gray-500 dark:text-gray-400 font-bold block mb-1">{t.qabiliyyahTitle}</span>
                    <p className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                      {globalCalculations.qabiliyyahType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Affinité naturelle : {globalCalculations.qabiliyyahScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HARMONIES & BUSINESS (Features 7, 10, 15, 16) */}
      {activeTab === 'harmony' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 7: Rizq Commercial */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.rizqTitle}</h3>
                <p className="text-xs text-gray-500">{t.rizqDesc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.businessName}</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="ex: Asrar Boutique / Al-Baraka"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.personName} (Propriétaire)</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="ex: Ibrahim"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCalculateBusiness}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Évaluer le Potentiel Commercial
              </button>
            </div>

            {businessResult && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>Score Vibratoire : {businessResult.score}%</span>
                  <span>Jour d'Ouverture : {businessResult.openingDay}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300"><strong>Évaluation :</strong> {businessResult.status}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Asma Recommandés :</strong> {businessResult.recommendedAsma}</p>
              </div>
            )}
          </div>

          {/* Feature 10: Property Harmony */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-2xl text-blue-600">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.propertyTitle}</h3>
                <p className="text-xs text-gray-500">{t.propertyDesc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.personName} (Acquéreur)</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="ex: Yusuf"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.propertyAddress}</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="ex: 12 Rue de la Paix"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCalculateProperty}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Calculer l'Adéquation Vibratoire
              </button>
            </div>

            {propertyResult && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-2 text-xs">
                <div className="font-bold text-blue-800 dark:text-blue-300">
                  Compatibilité du Lieu : {propertyResult.score}%
                </div>
                <p className="text-gray-700 dark:text-gray-300"><strong>Rituel de Purification :</strong> {propertyResult.recommendation}</p>
              </div>
            )}
          </div>

          {/* Feature 15: Geo Resonance */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.geoTitle}</h3>
                <p className="text-xs text-gray-500">{t.geoDesc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.personName}</label>
                <input
                  type="text"
                  value={geoPersonName}
                  onChange={(e) => setGeoPersonName(e.target.value)}
                  placeholder="ex: Amina"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.cityName}</label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="ex: Madinah / Medina"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCalculateGeo}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Tester la Résonance Géographique
              </button>
            </div>

            {geoResult && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
                <div className="font-bold text-indigo-800 dark:text-indigo-300">
                  Indice de Résonance : {geoResult.score}%
                </div>
                <p className="text-gray-700 dark:text-gray-300">{geoResult.verdict}</p>
              </div>
            )}
          </div>

          {/* Feature 16: Niyyah Structuring */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.niyyahTitle}</h3>
                <p className="text-xs text-gray-500">{t.niyyahDesc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.wishText}</label>
                <input
                  type="text"
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="ex: Succès, santé et bénédiction"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCalculateNiyyah}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Équilibrer la Formulation du Vœu
              </button>
            </div>

            {niyyahResult && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                <div className="font-bold text-purple-800 dark:text-purple-300">
                  Valeur Abjad de l'Intention : {niyyahResult.val} ({niyyahResult.letters})
                </div>
                <p className="text-gray-700 dark:text-gray-300"><strong>Nombre de Répétitions Équilibré :</strong> {niyyahResult.recommendedCount} fois</p>
                <p className="text-gray-700 dark:text-gray-300 dir-rtl font-semibold text-sm">{niyyahResult.balancedFormula}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COSMOS & TIMING (Features 9, 11, 13) */}
      {activeTab === 'cosmos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature 9: Last Third of Night */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.nightTitle}</h3>
                <p className="text-xs text-gray-500">{t.nightDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.sunsetTime}</label>
                <input
                  type="time"
                  value={sunsetTime}
                  onChange={(e) => setSunsetTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.sunriseTime}</label>
                <input
                  type="time"
                  value={sunriseTime}
                  onChange={(e) => setSunriseTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {nightThirds && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 font-bold block mb-1">Premier Tiers</span>
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{nightThirds.firstThird}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Prière d'Isha & Invocations initiales.</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 font-bold block mb-1">Deuxième Tiers</span>
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{nightThirds.secondThird}</p>
                  <p className="text-[11px] text-gray-500 mt-1">Sommeil béni & repos du corps.</p>
                </div>

                <div className="p-4 bg-amber-500/20 dark:bg-amber-900/40 rounded-2xl border border-amber-500/40 text-amber-900 dark:text-amber-200">
                  <span className="font-extrabold block mb-1 flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-500" /> Dernier Tiers Béni (Tahajjud)
                  </span>
                  <p className="font-extrabold text-amber-700 dark:text-amber-300 text-base">{nightThirds.lastThird}</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">Créneau d'Exaucement Divin Ultime.</p>
                </div>
              </div>
            )}
          </div>

          {/* Feature 13: Incense & Bukhoor Guide */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600">
                <Flame size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.incenseTitle}</h3>
                <p className="text-xs text-gray-500">{t.incenseDesc}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Soleil / Dimanche</span>
                <p className="text-gray-700 dark:text-gray-300">Oudh, Ambre pur, Encens Mâle (Frankincense)</p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Lune / Lundi</span>
                <p className="text-gray-700 dark:text-gray-300">Camphre, Santal Blanc, Musc Blanc</p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Mars / Mardi</span>
                <p className="text-gray-700 dark:text-gray-300">Sang de Dragon, Myrrhe, Poivre Noir</p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Mercure / Mercredi</span>
                <p className="text-gray-700 dark:text-gray-300">Mastic, Benjoin, Styrax</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DREAMS & INTENTIONS (Features 8, 11) */}
      {activeTab === 'oniro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 8: Dream Decoder */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600">
                <CloudMoon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.dreamTitle}</h3>
                <p className="text-xs text-gray-500">{t.dreamDesc}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{t.labels.dreamKeywords}</label>
                <input
                  type="text"
                  value={dreamInput}
                  onChange={(e) => setDreamInput(e.target.value)}
                  placeholder="ex: Serpent, Clé, Eau claire"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCalculateDream}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Décoder le Songe par Abjad
              </button>
            </div>

            {dreamResult && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
                <div className="font-bold text-purple-800 dark:text-purple-300">
                  Valeur Symbolique Abjad : {dreamResult.val} ({dreamResult.letters})
                </div>
                <p className="text-gray-700 dark:text-gray-300"><strong>Nature du Songe :</strong> {dreamResult.data.type}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Verset d'Ancrage :</strong> {dreamResult.data.verse}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Conseil Spirituel :</strong> {dreamResult.data.advice}</p>
              </div>
            )}
          </div>

          {/* Feature 11: Seasonal Impact */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600">
                <Sun size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.seasonTitle}</h3>
                <p className="text-xs text-gray-500">{t.seasonDesc}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Printemps (Chaud & Humide)</span>
                <p className="text-gray-700 dark:text-gray-300">Favorable à l'Air et à l'Eau. Période idéale pour renouveler les vœux et démarrer les projets.</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Été (Chaud & Sec)</span>
                <p className="text-gray-700 dark:text-gray-300">Domination du Feu. Apaiser par la boisson de Zamzam et la méditation rafraîchissante.</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Automne (Froid & Sec)</span>
                <p className="text-gray-700 dark:text-gray-300">Domination de la Terre. Lutter contre la léthargie par la fumigation d'encens de lumière.</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Hiver (Froid & Humide)</span>
                <p className="text-gray-700 dark:text-gray-300">Domination de l'Eau. Favorise la retraite spirituelle (Khilwah) et l'apprentissage profond.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ECLIPSES & HIJAMA (Features 12, 17) */}
      {activeTab === 'protection' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature 12: Hijama Calendar */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600">
                <Droplets size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.hijamaTitle}</h3>
                <p className="text-xs text-gray-500">{t.hijamaDesc}</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800 space-y-3 text-xs">
              <span className="font-extrabold text-rose-800 dark:text-rose-300 block text-sm">Jours de la Sunnah Prophétique :</span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les <strong>17ème, 19ème et 21ème jours du mois lunaire (Hijri)</strong>.
                Surtout lorsqu'ils tombent un Lundi, Mardi ou Jeudi.
              </p>
              <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-rose-100 dark:border-rose-900">
                <span className="font-bold text-gray-800 dark:text-gray-200">Conseil d'Efficacité :</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">À effectuer à jeun le matin après la prière du Sobh ou Duha pour maximiser l'élimination des toxines physiques et énergétiques.</p>
              </div>
            </div>
          </div>

          {/* Feature 17: Eclipse Tracker */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-200">
                <Moon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{t.eclipseTitle}</h3>
                <p className="text-xs text-gray-500">{t.eclipseDesc}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-sm">Vigilance Spirituelle lors des Éclipses :</span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Pendant la fenêtre de combustion d'une éclipse (Kusuf/Khusuf), accomplir la prière de l'éclipse (Salat al-Kusuf), renouveler ses invocations de protection et éviter le démarrage de contrats importants.
              </p>
              <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Prière de Protection :</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Récitation prolongée d'Ayat al-Kursi, des Sourates Al-Falaq et An-Nas avec aumône immédiate.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticProtection;
