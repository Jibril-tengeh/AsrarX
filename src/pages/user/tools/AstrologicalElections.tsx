import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  Building,
  Navigation,
  Heart,
  FileText,
  Sprout,
  ShoppingBag,
  RotateCcw,
  Copy,
  Check,
  Shield,
  Star,
  Sun,
  Moon,
  Zap,
  Info,
  ChevronRight,
  Download,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

// Complete translations dictionary for French (fr), English (en), and Hausa (ha)
const UI_TEXTS = {
  fr: {
    pageTitle: "Élections Astrologiques (علم الاختيارات الفلكية)",
    pageSubtitle: "Calculs traditionnels des moments propices pour la fondation, les voyages, les alliances, les contrats, l'agriculture et le commerce.",

    tabs: {
      bina: "Fondation (Bina')",
      safar: "Voyage (Safar)",
      nikah: "Alliances (Nikah)",
      uqud: "Contrats ('Uqud)",
      falahah: "Récoltes (Falahah)",
      tijarah: "Commerce (Tijarah)"
    },

    // 1. Fondation
    binaTitle: "1. Fondation d'édifice & Première Pierre (إختيار البناء)",
    binaDesc: "Calcule l'heure optimale et la fenêtre céleste propice pour poser la première pierre d'un bâtiment ou d'une demeure.",
    buildingTypeLabel: "Type d'Édifice",
    buildingTypes: {
      residential: "Maison Résidentielle / Foyer",
      commercial: "Complexe Commercial / Magasin",
      sanctuary: "Mosquée / Lieu de Culte",
      fortress: "Clôture / Mur de Protection"
    },
    ownerSignLabel: "Signe Astrologique du Propriétaire",
    targetMonthLabel: "Mois Visé",
    binaResultTitle: "Fenêtre d'Élection pour la Première Pierre",
    binaMoonSign: "Position de la Lune : Signe Fixe (Taureau / Lion / Scorpion / Verseau)",
    binaAscendant: "Ascendant Recommandé : Signe de Terre ou Fixe",
    binaPlanetaryHour: "Heure Planétaire Idéale : Saturne bien disposé ou Jupiter",
    binaAdvice: "Recommandation : Sceller une pièce en argent ou verser de l'eau de rose sur le coin nord-est lors du tracé.",

    // 2. Voyage
    safarTitle: "2. Voyage & Traversée Sécurisée (إختيار السفر)",
    safarDesc: "Identifie les périodes les plus sûres d'après le mouvement de Mercure, la Lune et l'ascendant personnel.",
    travelDirectionLabel: "Direction du Voyage",
    directions: {
      north: "Nord (Shamal)",
      south: "Sud (Janub)",
      east: "Est (Sharq)",
      west: "Ouest (Gharb)"
    },
    travelModeLabel: "Moyen de Transport",
    travelModes: {
      land: "Voie Terrestre (Route / Train)",
      air: "Voie Aérienne (Avion)",
      sea: "Voie Maritime (Bâteau / Mer)"
    },
    mercuryStatusLabel: "Statut de Mercure ('Utarid)",
    safarPassengerSignLabel: "Signe Astrologique du Voyageur",
    safarResultTitle: "Période de Départ Optimale",
    safarMercuryRule: "Mercure : Direct et hors de combustion solaire",
    safarMoonRule: "Lune : En signe Cardinal/Mutable (Gémeaux, Sagittaire, Verseau)",
    safarVerse: "Verset de Protection du Voyageur : 'Subhanalladhi Sakhkhara Lana Hadha...'",

    // 3. Alliances
    nikahTitle: "3. Alliances & Mariage Idéal (إختيار النكاح)",
    nikahDesc: "Calcule la date de mariage idéale favorisant l'amour durable, la paix et la stabilité familiale.",
    groomSignLabel: "Signe de l'Époux",
    brideSignLabel: "Signe de l'Épouse",
    nikahIntentionLabel: "Intention Principale",
    nikahIntentions: {
      harmony: "Paix & Harmonie Familiale",
      fertility: "Fécondité & Descendance",
      prosperity: "Prospérité & Entraide",
      protection: "Protection contre les Dissensions"
    },
    nikahResultTitle: "Date & Heure de Célébration Propices",
    nikahVenusRule: "Vénus (Al-Zuhara) : En dignité (Taureau, Balance, Poissons) exempte d'affliction",
    nikahMoonRule: "Trine Lune-Vénus ou Lune-Jupiter actif",
    nikahAdvice: "Conseil Traditionnel : Éviter absolument la Lune en Scorpion ou en combustion.",

    // 4. Signature de Contrats
    uqudTitle: "4. Signature de Contrats & Documents (إختيار العقود)",
    uqudDesc: "Repère les heures de Mercure exemptes d'afflictions pour signer des actes, partenariats et conventions.",
    contractTypeLabel: "Type de Contrat",
    contractTypes: {
      partnership: "Partenariat Commercial / Association",
      property: "Achat / Vente Immobilière",
      employment: "Contrat de Travail / Emploi",
      loan: "Accord Financier / Prêt"
    },
    targetDayLabel: "Jour Souhaité",
    uqudResultTitle: "Créneau Idéal de Signature",
    uqudMercuryHour: "Heure de Mercure (Saa'at 'Utarid)",
    uqudMoonPhase: "Lune Croissante (Hilal / Badr)",
    uqudCaution: "Mise en garde : Éviter la rétrogradation de Mercure et les carrés martiens.",

    // 5. Récoltes
    falahahTitle: "5. Récoltes & Semailles Agricoles (إختيار الفلاحة)",
    falahahDesc: "Indique les moments optimaux pour planter, greffer et récolter selon l'élément de la terre et la Lune.",
    cropTypeLabel: "Type de Culture / Plante",
    cropTypes: {
      cereals: "Céréales & Grains (Blé, Riz, Maïs)",
      trees: "Arbres Fruitiers & Vergers",
      roots: "Tubercules & Racines (Cariole, Oignon)",
      herbs: "Plantes Médicinales & Aromatiques"
    },
    agriActionLabel: "Action Agricole",
    agriActions: {
      sowing: "Semence & Plantation",
      grafting: "Greffe & Taille",
      harvest: "Récolte & Engrangement",
      irrigation: "Irrigation & Fertilisant"
    },
    falahahResultTitle: "Fenêtre Agricole Favorisée",
    falahahEarthRule: "Lune en Signe de Terre (Taureau, Vierge, Capricorne)",
    falahahMansionRule: "Demeure Lunaire : Al-Thurayya ou Al-Simak",
    falahahElementScore: "Affinité Élémentaire Terre",

    // 6. Commerce
    tijarahTitle: "6. Ouverture de Commerce & Boutiques (إختيار التجارة)",
    tijarahDesc: "Calcule les conjonctions et heures Soleil-Jupiter favorables à l'abondance et à l'attraction de la clientèle.",
    businessDomainLabel: "Domaine d'Activité",
    businessDomains: {
      retail: "Commerce de Détail / Magasin",
      online: "Boutique en Ligne / E-Commerce",
      artisan: "Atelier Artisanal / Création",
      hospitality: "Restauration / Hôtellerie"
    },
    ownerAbjadLabel: "Valeur Abjad du Nom du Commerçant (Optionnel)",
    tijarahResultTitle: "Heure d'Inauguration & Premier Encaissement",
    tijarahJupiterRule: "Aspect Soleil-Jupiter (Conjonction / Trine / Sextile)",
    tijarahHour: "Heure Planétaire : Jupiter (Al-Mushtari) ou Soleil (Al-Shams)",
    tijarahIncense: "Encens de Barakah : Benjoin (Laban Jawi) et Mastic de Chios",

    // Common Labels
    labels: {
      zodiacSigns: {
        aries: "Bélier (Al-Hamal - Feu)",
        taurus: "Taureau (Al-Thawr - Terre)",
        gemini: "Gémeaux (Al-Jawza' - Air)",
        cancer: "Cancer (Al-Saratan - Eau)",
        leo: "Lion (Al-Asad - Feu)",
        virgo: "Vierge (Al-Sunbulah - Terre)",
        libra: "Balance (Al-Mizan - Air)",
        scorpio: "Scorpion (Al-Aqrab - Eau)",
        sagittarius: "Sagittaire (Al-Qaws - Feu)",
        capricorn: "Capricorne (Al-Jady - Terre)",
        aquarius: "Verseau (Al-Delw - Air)",
        pisces: "Poissons (Al-Hut - Eau)"
      },
      days: {
        monday: "Lundi (Al-Ithnayn - Lune)",
        tuesday: "Mardi (Al-Thulatha' - Mars)",
        wednesday: "Mercredi (Al-Arbi'a' - Mercure)",
        thursday: "Jeudi (Al-Khamis - Jupiter)",
        friday: "Vendredi (Al-Jumu'ah - Vénus)",
        saturday: "Samedi (Al-Sabt - Saturne)",
        sunday: "Dimanche (Al-Ahad - Soleil)"
      },
      months: {
        m1: "Janvier / Muharram",
        m2: "Février / Safar",
        m3: "Mars / Rabi' al-Awwal",
        m4: "Avril / Rabi' al-Thani",
        m5: "Mai / Jumada al-Ula",
        m6: "Juin / Jumada al-Thaniyah",
        m7: "Juillet / Rajab",
        m8: "Août / Sha'ban",
        m9: "Septembre / Ramadan",
        m10: "Octobre / Shawwal",
        m11: "Novembre / Dhu al-Qi'dah",
        m12: "Décembre / Dhu al-Hijjah"
      },
      calculate: "Calculer les Élections",
      copy: "Copier le Bilan d'Élection",
      copied: "Copié !",
      electionScore: "Score d'Élection Céleste",
      optimalHour: "Heure Locale Optimale",
      favorableWindow: "Fenêtre d'Action Favorable",
      afflictionsToAvoid: "Afflictions à Éviter",
      lunarMansion: "Demeure Lunaire (Manzil)",
      barakahIndex: "Indice de Barakah & Réussite",
      spiritualRitual: "Rituel de Bénédiction Recommandé",
      printPDF: "Exporter le Bilan Détaillé"
    }
  },
  en: {
    pageTitle: "Astrological Elections (علم الاختيارات الفلكية)",
    pageSubtitle: "Traditional calculations of auspicious timing for foundation, travel, alliances, contracts, agriculture, and commerce.",

    tabs: {
      bina: "Foundation (Bina')",
      safar: "Travel (Safar)",
      nikah: "Alliances (Nikah)",
      uqud: "Contracts ('Uqud)",
      falahah: "Harvests (Falahah)",
      tijarah: "Commerce (Tijarah)"
    },

    binaTitle: "1. Building Foundation & First Stone (إختيار البناء)",
    binaDesc: "Calculates the optimal hour and celestial window to lay the foundation stone of a house or building.",
    buildingTypeLabel: "Building Type",
    buildingTypes: {
      residential: "Residential Home / House",
      commercial: "Commercial Complex / Shop",
      sanctuary: "Mosque / Place of Worship",
      fortress: "Enclosure / Protective Wall"
    },
    ownerSignLabel: "Owner's Zodiac Sign",
    targetMonthLabel: "Target Month",
    binaResultTitle: "First Stone Election Window",
    binaMoonSign: "Moon Position: Fixed Sign (Taurus / Leo / Scorpio / Aquarius)",
    binaAscendant: "Recommended Ascendant: Earth or Fixed Sign",
    binaPlanetaryHour: "Ideal Planetary Hour: Well-placed Saturn or Jupiter",
    binaAdvice: "Recommendation: Seal a silver coin or sprinkle rose water on the northeast corner during layout.",

    safarTitle: "2. Travel & Safe Journey (إختيار السفر)",
    safarDesc: "Identifies the safest travel windows based on Mercury's motion, Moon phase, and personal ascendant.",
    travelDirectionLabel: "Travel Direction",
    directions: {
      north: "North (Shamal)",
      south: "South (Janub)",
      east: "East (Sharq)",
      west: "West (Gharb)"
    },
    travelModeLabel: "Transport Mode",
    travelModes: {
      land: "Land (Road / Train)",
      air: "Air (Flight)",
      sea: "Sea (Ship / Water)"
    },
    mercuryStatusLabel: "Mercury Status ('Utarid)",
    safarPassengerSignLabel: "Traveler's Zodiac Sign",
    safarResultTitle: "Optimal Departure Window",
    safarMercuryRule: "Mercury: Direct motion and free from solar combustion",
    safarMoonRule: "Moon: In Cardinal/Mutable Sign (Gemini, Sagittarius, Aquarius)",
    safarVerse: "Traveler's Protection Verse: 'Subhanalladhi Sakhkhara Lana Hadha...'",

    nikahTitle: "3. Alliances & Marriage Timing (إختيار النكاح)",
    nikahDesc: "Calculates the ideal marriage date fostering lasting love, family peace, and emotional stability.",
    groomSignLabel: "Groom's Zodiac Sign",
    brideSignLabel: "Bride's Zodiac Sign",
    nikahIntentionLabel: "Primary Intention",
    nikahIntentions: {
      harmony: "Family Peace & Harmony",
      fertility: "Fertility & Descendants",
      prosperity: "Prosperity & Mutual Aid",
      protection: "Protection Against Disputes"
    },
    nikahResultTitle: "Auspicious Date & Celebration Hour",
    nikahVenusRule: "Venus (Al-Zuhara): Dignified (Taurus, Libra, Pisces) and unafflicted",
    nikahMoonRule: "Active Moon-Venus or Moon-Jupiter trine",
    nikahAdvice: "Traditional Guidance: Strictly avoid Moon in Scorpio or combusted Moon.",

    uqudTitle: "4. Contract Signing & Agreements (إختيار العقود)",
    uqudDesc: "Locates Mercury hours free from afflictions to sign legal deeds, partnerships, and agreements.",
    contractTypeLabel: "Contract Type",
    contractTypes: {
      partnership: "Business Partnership / Association",
      property: "Real Estate Purchase / Sale",
      employment: "Employment Contract / Job",
      loan: "Financial Agreement / Loan"
    },
    targetDayLabel: "Preferred Day",
    uqudResultTitle: "Ideal Signing Window",
    uqudMercuryHour: "Mercury Hour (Saa'at 'Utarid)",
    uqudMoonPhase: "Waxing Moon (Hilal / Badr)",
    uqudCaution: "Warning: Avoid Mercury retrograde and harsh Mars squares.",

    falahahTitle: "5. Harvests & Agricultural Sowing (إختيار الفلاحة)",
    falahahDesc: "Indicates optimal planting, grafting, and harvesting times according to Earth element and lunar mansions.",
    cropTypeLabel: "Crop / Plant Type",
    cropTypes: {
      cereals: "Grains & Cereals (Wheat, Rice, Corn)",
      trees: "Fruit Trees & Orchards",
      roots: "Roots & Tubers (Carrot, Onion)",
      herbs: "Medicinal & Aromatic Herbs"
    },
    agriActionLabel: "Agricultural Action",
    agriActions: {
      sowing: "Sowing & Planting",
      grafting: "Grafting & Pruning",
      harvest: "Harvesting & Storing",
      irrigation: "Irrigation & Fertilizing"
    },
    falahahResultTitle: "Favored Agricultural Window",
    falahahEarthRule: "Moon in Earth Sign (Taurus, Virgo, Capricorn)",
    falahahMansionRule: "Lunar Mansion: Al-Thurayya or Al-Simak",
    falahahElementScore: "Earth Element Affinity Score",

    tijarahTitle: "6. Business & Shop Opening (إختيار التجارة)",
    tijarahDesc: "Calculates Sun-Jupiter conjunctions and hours favorable for financial prosperity and attracting clientele.",
    businessDomainLabel: "Business Sector",
    businessDomains: {
      retail: "Retail Shop / Store",
      online: "Online Store / E-Commerce",
      artisan: "Craft Workshop / Artisanal",
      hospitality: "Restaurant / Hospitality"
    },
    ownerAbjadLabel: "Abjad Value of Owner Name (Optional)",
    tijarahResultTitle: "Grand Opening & First Revenue Hour",
    tijarahJupiterRule: "Sun-Jupiter Aspect (Conjunction / Trine / Sextile)",
    tijarahHour: "Planetary Hour: Jupiter (Al-Mushtari) or Sun (Al-Shams)",
    tijarahIncense: "Incense for Barakah: Benzoin Resin & Chios Mastic",

    labels: {
      zodiacSigns: {
        aries: "Aries (Al-Hamal - Fire)",
        taurus: "Taurus (Al-Thawr - Earth)",
        gemini: "Gemini (Al-Jawza' - Air)",
        cancer: "Cancer (Al-Saratan - Water)",
        leo: "Leo (Al-Asad - Fire)",
        virgo: "Virgo (Al-Sunbulah - Earth)",
        libra: "Libra (Al-Mizan - Air)",
        scorpio: "Scorpio (Al-Aqrab - Water)",
        sagittarius: "Sagittarius (Al-Qaws - Fire)",
        capricorn: "Capricorn (Al-Jady - Earth)",
        aquarius: "Aquarius (Al-Delw - Air)",
        pisces: "Pisces (Al-Hut - Water)"
      },
      days: {
        monday: "Monday (Al-Ithnayn - Moon)",
        tuesday: "Tuesday (Al-Thulatha' - Mars)",
        wednesday: "Wednesday (Al-Arbi'a' - Mercury)",
        thursday: "Thursday (Al-Khamis - Jupiter)",
        friday: "Friday (Al-Jumu'ah - Venus)",
        saturday: "Saturday (Al-Sabt - Saturn)",
        sunday: "Sunday (Al-Ahad - Sun)"
      },
      months: {
        m1: "January / Muharram",
        m2: "February / Safar",
        m3: "March / Rabi' al-Awwal",
        m4: "April / Rabi' al-Thani",
        m5: "May / Jumada al-Ula",
        m6: "June / Jumada al-Thaniyah",
        m7: "July / Rajab",
        m8: "August / Sha'ban",
        m9: "September / Ramadan",
        m10: "October / Shawwal",
        m11: "November / Dhu al-Qi'dah",
        m12: "December / Dhu al-Hijjah"
      },
      calculate: "Calculate Elections",
      copy: "Copy Election Report",
      copied: "Copied!",
      electionScore: "Celestial Election Score",
      optimalHour: "Optimal Local Time",
      favorableWindow: "Favorable Action Window",
      afflictionsToAvoid: "Afflictions to Avoid",
      lunarMansion: "Lunar Mansion (Manzil)",
      barakahIndex: "Barakah & Success Index",
      spiritualRitual: "Recommended Blessing Ritual",
      printPDF: "Export Detailed Report"
    }
  },
  ha: {
    pageTitle: "Zaben Lokutan Taurari (علم الاختيارات الفلكية)",
    pageSubtitle: "Lissafin lokuta masu albarka na gina gida, tafiye-tafiye, aure, kullun kwangila, noma da bude kasuwanci.",

    tabs: {
      bina: "Ginuwa (Bina')",
      safar: "Tafiya (Safar)",
      nikah: "Aure (Nikah)",
      uqud: "Kwangila ('Uqud)",
      falahah: "Noma (Falahah)",
      tijarah: "Kasuwanci (Tijarah)"
    },

    binaTitle: "1. Harsashin Gida da Sanya Dutsen Farko (إختيار البناء)",
    binaDesc: "Lissafa mafi kyawun sa'a da lokacin taurari don dasa harsashin gida ko bene.",
    buildingTypeLabel: "Nau'in Gini",
    buildingTypes: {
      residential: "Gidan Zama / Iyali",
      commercial: "Shaguna / Katafaren Kasuwa",
      sanctuary: "Masallaci / Wajen Ibada",
      fortress: "Katangar Kariya / Ganuwa"
    },
    ownerSignLabel: "Tauraron Mai Gini",
    targetMonthLabel: "Watan da ake Buqata",
    binaResultTitle: "Lokacin Zaben Sanya Harsashi",
    binaMoonSign: "Mazaunin Wata: Mazauni Tsayaffat (Saura / Zaki / Karkanda / Dolu)",
    binaAscendant: "Tauraron Shiga: Tauraron Kasa ko Tsayaffat",
    binaPlanetaryHour: "Sa'ar Tauraro: Zuhal Mai Kyau ko Mushtari",
    binaAdvice: "Shawarwarin Asiri: Binne tsabar azurfa ko yayafa ruwan wardi a kusurwar Arewa-Gabas lokacin zana gini.",

    safarTitle: "2. Tafiya da Tsira daga Hatsari (إختيار السفر)",
    safarDesc: "Binciko mafi aminci da kariya na lokacin tafiya ta hanyar motsin Uta'rid da Wata.",
    travelDirectionLabel: "Gefen Tafiya",
    directions: {
      north: "Arewa (Shamal)",
      south: "Kudu (Janub)",
      east: "Gabas (Sharq)",
      west: "Yamma (Gharb)"
    },
    travelModeLabel: "Hanyar Tafiya",
    travelModes: {
      land: "Tafiyar Kasa (Mota / Jirgin Kasa)",
      air: "Tafiyar Samaniya (Jirgin Sama)",
      sea: "Tafiyar Ruwa (Jirgin Ruwa / Teku)"
    },
    mercuryStatusLabel: "Matsayin Utarid (Mercure)",
    safarPassengerSignLabel: "Tauraron Dan Tafiya",
    safarResultTitle: "Mafi Kyawun Lokacin Tashi",
    safarMercuryRule: "Utarid: Yana tafiya madaidaiciya ba tare da kona ranar rani ba",
    safarMoonRule: "Wata: A cikin taurari masu sauyawa (Jauza', Qaws, Delw)",
    safarVerse: "Ayar Kariyar Dan Tafiya: 'Subhanalladhi Sakhkhara Lana Hadha...'",

    nikahTitle: "3. Kullun Aure da Zama da Tausayi (إختيار النكاح)",
    nikahDesc: "Lissafa ranar aure mai sa albarka, zaman lafiya, soyayya da fahimtar juna a iyali.",
    groomSignLabel: "Tauraron Ango",
    brideSignLabel: "Tauraron Amarya",
    nikahIntentionLabel: "Babban Buri",
    nikahIntentions: {
      harmony: "Zaman Lafiya da Kaunar Iyali",
      fertility: "Haihuwa da Albarkar Ya'ya",
      prosperity: "Rizqi da Taimakon Juna",
      protection: "Kariya daga Intan-Intan"
    },
    nikahResultTitle: "Kyakkyawan Ranar da Sa'ar Daura Aure",
    nikahVenusRule: "Zuhara (Vénus): Tana cikin mazauninta na alfarma (Thawr, Mizan, Hut)",
    nikahMoonRule: "Kyakkyawar tsayuwa tsakanin Wata da Zuhara ko Mushtari",
    nikahAdvice: "Gargadin Gargajiya: Guje wa daura aure lokacin da Wata yake karkashin Aqrab (Scorpion).",

    uqudTitle: "4. Sa Sa hannu a Kwangila da Takardu (إختيار العقود)",
    uqudDesc: "Zaɓi sa'o'in Utarid masu 'yanci daga matsalar taurari domin sa hannu kan takardun kasuwanci.",
    contractTypeLabel: "Nau'in Kwangila",
    contractTypes: {
      partnership: "Kwangilar Kasuwanci / Kawance",
      property: "Sayen Fili ko Gida",
      employment: "Kwangilar Aiki / Daukar Ma'aikata",
      loan: "Kulle Bashi ko Yarjejeniyar Kudi"
    },
    targetDayLabel: "Ranar da ake Buri",
    uqudResultTitle: "Lokacin Sa Hannu Mai Nasara",
    uqudMercuryHour: "Sa'ar Utarid (Saa'at 'Utarid)",
    uqudMoonPhase: "Girmamar Wata (Hilal / Badr)",
    uqudCaution: "Tandama: Guje wa lokacin da Utarid yake komawa baya (retrograde).",

    falahahTitle: "5. Noma da Shuka Kayan Abinci (إختيار الفلاحة)",
    falahahDesc: "Bayyana lokacin shuka, dashe da girbi bisa la'akari da sinadarin Kasa da mazaunin Wata.",
    cropTypeLabel: "Nau'in Shuka",
    cropTypes: {
      cereals: "Hatsin Abinci (Alkama, Shinkafa, Masara)",
      trees: "Bishiyoyin 'Ya'yan Itace",
      roots: "Kayan Karkashin Kasa (Karas, Albasa, Doyar Kasa)",
      herbs: "Ganyayyakin Magani da Kamshi"
    },
    agriActionLabel: "Aikin Noma",
    agriActions: {
      sowing: "Shuka da Dasa Ise",
      grafting: "Manna Reshe da Gyara",
      harvest: "Girbi da Bunkasa Rumbu",
      irrigation: "Bada Ruwa da Taki"
    },
    falahahResultTitle: "Lokacin Noma Mai Nasara",
    falahahEarthRule: "Wata a cikin Tauraron Kasa (Thawr, Sunbulah, Jady)",
    falahahMansionRule: "Mazaunin Wata: Al-Thurayya ko Al-Simak",
    falahahElementScore: "Girman Sinadarin Kasa",

    tijarahTitle: "6. Bude Shago da Fara Kasuwanci (إختيار التجارة)",
    tijarahDesc: "Lissafa sa'o'in Rana da Mushtari don samun kasuwa, kwararar abokan ciniki da albarka.",
    businessDomainLabel: "Sashin Kasuwanci",
    businessDomains: {
      retail: "Shagon Sayar da Kayan Masarufi",
      online: "Kasuwancin Yanar Gizo (Online Store)",
      artisan: "Wajen Sana'ar Hannu",
      hospitality: "Shagon Abinci ko Masauki"
    },
    ownerAbjadLabel: "Lissafin Abjad na Sunan Mai Kasuwanci (Zabi)",
    tijarahResultTitle: "Sa'ar Bude Kofa da Karbar Kudin Farko",
    tijarahJupiterRule: "Hadakar Rana da Mushtari (Conjunction / Trine)",
    tijarahHour: "Sa'ar Tauraro: Mushtari (Jupiter) ko Shams (Rana)",
    tijarahIncense: "Turaren Albarka: Laban Jawi da Mastaki",

    labels: {
      zodiacSigns: {
        aries: "Hamal (Bélier - Wuta)",
        taurus: "Thawr (Taureau - Kasa)",
        gemini: "Jawza' (Gémeaux - Iska)",
        cancer: "Saratan (Cancer - Ruwa)",
        leo: "Asad (Lion - Wuta)",
        virgo: "Sunbulah (Vierge - Kasa)",
        libra: "Mizan (Balance - Iska)",
        scorpio: "Aqrab (Scorpion - Ruwa)",
        sagittarius: "Qaws (Sagittaire - Wuta)",
        capricorn: "Jady (Capricorne - Kasa)",
        aquarius: "Delw (Verseau - Iska)",
        pisces: "Hut (Poissons - Ruwa)"
      },
      days: {
        monday: "Litinin (Al-Ithnayn - Wata)",
        tuesday: "Talata (Al-Thulatha' - Mrikh)",
        wednesday: "Larabawa (Al-Arbi'a' - Utarid)",
        thursday: "Alhamis (Al-Khamis - Mushtari)",
        friday: "Jumma'a (Al-Jumu'ah - Zuhara)",
        saturday: "Asabar (Al-Sabt - Zuhal)",
        sunday: "Lahadi (Al-Ahad - Shams)"
      },
      months: {
        m1: "Janairu / Muharram",
        m2: "Fabrairu / Safar",
        m3: "Maris / Rabi' al-Awwal",
        m4: "Afrilu / Rabi' al-Thani",
        m5: "Mayu / Jumada al-Ula",
        m6: "Yuni / Jumada al-Thaniyah",
        m7: "Yuli / Rajab",
        m8: "Agusta / Sha'ban",
        m9: "Satumba / Ramadan",
        m10: "Oktoba / Shawwal",
        m11: "Nuwamba / Dhu al-Qi'dah",
        m12: "Disamba / Dhu al-Hijjah"
      },
      calculate: "Lissafa Lokutan Taurari",
      copy: "Kwafi Rahoton Zabe",
      copied: "An Kwafa!",
      electionScore: "Maki na Lokacin Taurari",
      optimalHour: "Mafi Kyawun Sa'ar Gida",
      favorableWindow: "Lokacin Aiki Mai Nasara",
      afflictionsToAvoid: "Aron Taurari da za a Gujeta",
      lunarMansion: "Mazaunin Wata (Manzil)",
      barakahIndex: "Koyaushe Albarka da Nasara",
      spiritualRitual: "Rituwal din Bunkasa Albarka",
      printPDF: "Fitard da Cikakken Rahoto"
    }
  }
};

export const AstrologicalElections: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'bina' | 'safar' | 'nikah' | 'uqud' | 'falahah' | 'tijarah'>('bina');

  // Tab 1: Bina State
  const [binaBuildingType, setBinaBuildingType] = useState<keyof typeof UI_TEXTS.fr.buildingTypes>('residential');
  const [binaOwnerSign, setBinaOwnerSign] = useState<keyof typeof UI_TEXTS.fr.labels.zodiacSigns>('taurus');
  const [binaTargetMonth, setBinaTargetMonth] = useState<keyof typeof UI_TEXTS.fr.labels.months>('m5');

  // Tab 2: Safar State
  const [safarDirection, setSafarDirection] = useState<keyof typeof UI_TEXTS.fr.directions>('north');
  const [safarMode, setSafarMode] = useState<keyof typeof UI_TEXTS.fr.travelModes>('land');
  const [safarPassengerSign, setSafarPassengerSign] = useState<keyof typeof UI_TEXTS.fr.labels.zodiacSigns>('gemini');

  // Tab 3: Nikah State
  const [nikahGroomSign, setNikahGroomSign] = useState<keyof typeof UI_TEXTS.fr.labels.zodiacSigns>('leo');
  const [nikahBrideSign, setNikahBrideSign] = useState<keyof typeof UI_TEXTS.fr.labels.zodiacSigns>('taurus');
  const [nikahIntention, setNikahIntention] = useState<keyof typeof UI_TEXTS.fr.nikahIntentions>('harmony');

  // Tab 4: Uqud State
  const [uqudContractType, setUqudContractType] = useState<keyof typeof UI_TEXTS.fr.contractTypes>('partnership');
  const [uqudTargetDay, setUqudTargetDay] = useState<keyof typeof UI_TEXTS.fr.labels.days>('wednesday');

  // Tab 5: Falahah State
  const [falahahCropType, setFalahahCropType] = useState<keyof typeof UI_TEXTS.fr.cropTypes>('cereals');
  const [falahahAction, setFalahahAction] = useState<keyof typeof UI_TEXTS.fr.agriActions>('sowing');

  // Tab 6: Tijarah State
  const [tijarahDomain, setTijarahDomain] = useState<keyof typeof UI_TEXTS.fr.businessDomains>('retail');
  const [tijarahOwnerAbjad, setTijarahOwnerAbjad] = useState<number>(92);

  const [copied, setCopied] = useState(false);

  // 1. Bina Calculation Engine
  const binaData = useMemo(() => {
    let score = 92;
    if (binaOwnerSign === 'taurus' || binaOwnerSign === 'virgo' || binaOwnerSign === 'capricorn') score += 5;
    if (binaBuildingType === 'sanctuary') score += 3;

    const details = {
      fr: {
        optimalHour: "10:15 - 11:45 (Heure de Saturne / Mushtari)",
        favorableWindow: "3ème & 7ème jour après la nouvelle lune",
        ascendant: "Ascendant Taureau (24°) ou Capricorne (12°)",
        moonMansion: "Manzil 4 (Al-Dabaran - الدبران) ou Manzil 10 (Al-Jabhah)",
        afflictions: "Garder la Lune éloignée des carrés de Mars (Al-Mirrikh)"
      },
      en: {
        optimalHour: "10:15 - 11:45 (Saturn / Jupiter Hour)",
        favorableWindow: "3rd & 7th day after new moon",
        ascendant: "Ascendant Taurus (24°) or Capricorn (12°)",
        moonMansion: "Mansion 4 (Al-Dabaran) or Mansion 10 (Al-Jabhah)",
        afflictions: "Keep Moon away from Mars squares (Al-Mirrikh)"
      },
      ha: {
        optimalHour: "10:15 - 11:45 (Sa'ar Zuhal / Mushtari)",
        favorableWindow: "Rana ta 3 da ta 7 bayan wata ya tsaya",
        ascendant: "Shigar Taurus (24°) ko Capricorn (12°)",
        moonMansion: "Mazauni 4 (Al-Dabaran) ko Mazauni 10 (Al-Jabhah)",
        afflictions: "Guje wa haɗakar Wata da Tauraron Mrikh"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "10:15 - 11:45 (Heure de Saturne / Mushtari)",
      favorableWindow: "3ème & 7ème jour après la nouvelle lune",
      ascendant: "Ascendant Taureau (24°) ou Capricorne (12°)",
      moonMansion: "Manzil 4 (Al-Dabaran - الدبران) ou Manzil 10 (Al-Jabhah)",
      afflictions: "Garder la Lune éloignée des carrés de Mars (Al-Mirrikh)"
    };

    return {
      score: Math.min(score, 99),
      ...details
    };
  }, [binaBuildingType, binaOwnerSign, binaTargetMonth, language]);

  // 2. Safar Calculation Engine
  const safarData = useMemo(() => {
    let score = 88;
    if (safarDirection === 'north' || safarDirection === 'east') score += 4;
    if (safarMode === 'air') score += 3;

    const details = {
      fr: {
        optimalHour: "07:30 - 09:00 (Heure de Mercure / 'Utarid)",
        favorableWindow: "Mardi à l'aube ou Jeudi en première heure",
        mercuryStatus: "Mercure Madaidaici (Direct, Vitesse +1°15'/jour)",
        moonMansion: "Manzil 3 (Al-Thurayya - الثريا) - Protection sur les routes"
      },
      en: {
        optimalHour: "07:30 - 09:00 (Mercury Hour)",
        favorableWindow: "Tuesday at dawn or Thursday first hour",
        mercuryStatus: "Mercury Direct (+1°15'/day speed)",
        moonMansion: "Mansion 3 (Al-Thurayya) - Road protection"
      },
      ha: {
        optimalHour: "07:30 - 09:00 (Sa'ar Utarid)",
        favorableWindow: "Talata da asuba ko Alhamis sa'a ta farko",
        mercuryStatus: "Utarid Madaidaici (+1°15'/rana speed)",
        moonMansion: "Mazauni 3 (Al-Thurayya) - Kariyar hanya"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "07:30 - 09:00 (Heure de Mercure / 'Utarid)",
      favorableWindow: "Mardi à l'aube ou Jeudi en première heure",
      mercuryStatus: "Mercure Madaidaici (Direct, Vitesse +1°15'/jour)",
      moonMansion: "Manzil 3 (Al-Thurayya - الثريا) - Protection sur les routes"
    };

    return {
      score: Math.min(score, 98),
      ...details,
      protectionVerse: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ"
    };
  }, [safarDirection, safarMode, safarPassengerSign, language]);

  // 3. Nikah Calculation Engine
  const nikahData = useMemo(() => {
    let score = 95;
    if (nikahIntention === 'harmony') score += 3;

    const details = {
      fr: {
        optimalHour: "16:00 - 17:30 (Heure de Vénus / Al-Zuhara)",
        favorableWindow: "Vendredi soir après Asr ou Dimanche matin",
        venusDignity: "Vénus en Poissons (Exaltation 27°) ou Balance",
        moonTrine: "Trine Lune-Jupiter (120°) favorisant l'affection mutuelle",
        forbiddenWarning: "Garder la cérémonie strictement en dehors de la Lune en Scorpion"
      },
      en: {
        optimalHour: "16:00 - 17:30 (Venus Hour)",
        favorableWindow: "Friday evening after Asr or Sunday morning",
        venusDignity: "Venus in Pisces (27° Exaltation) or Libra",
        moonTrine: "Moon-Jupiter Trine (120°) fostering mutual affection",
        forbiddenWarning: "Strictly avoid Moon in Scorpio during ceremony"
      },
      ha: {
        optimalHour: "16:00 - 17:30 (Sa'ar Zuhara)",
        favorableWindow: "Jumma'a da yamma bayan Asr ko Lahadi da safe",
        venusDignity: "Zuhara a cikin Pisces ko Libra",
        moonTrine: "Tsyuwa mai kyau tsakanin Wata da Mushtari (120°)",
        forbiddenWarning: "Guje wa daura aure lokacin da Wata ke a Scorpion"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "16:00 - 17:30 (Heure de Vénus / Al-Zuhara)",
      favorableWindow: "Vendredi soir après Asr ou Dimanche matin",
      venusDignity: "Vénus en Poissons (Exaltation 27°) ou Balance",
      moonTrine: "Trine Lune-Jupiter (120°) favorisant l'affection mutuelle",
      forbiddenWarning: "Garder la cérémonie strictement en dehors de la Lune en Scorpion"
    };

    return {
      score: Math.min(score, 99),
      ...details
    };
  }, [nikahGroomSign, nikahBrideSign, nikahIntention, language]);

  // 4. Uqud Calculation Engine
  const uqudData = useMemo(() => {
    let score = 91;
    if (uqudTargetDay === 'wednesday') score += 6;

    const details = {
      fr: {
        optimalHour: "09:00 - 10:15 (Saa'at 'Utarid)",
        favorableWindow: "Du 4ème au 12ème jour du mois lunaire",
        mercuryCondition: "Mercure en Gémeaux ou Vierge (Dignité intégrale)",
        moonPhase: "Croissant de Lune (Hilal Mubarrak)",
        cautionNote: "Éviter la période de Lune vide de course (Void of Course)"
      },
      en: {
        optimalHour: "09:00 - 10:15 (Mercury Hour)",
        favorableWindow: "4th to 12th day of lunar month",
        mercuryCondition: "Mercury in Gemini or Virgo (Full dignity)",
        moonPhase: "Waxing Crescent Moon (Hilal Mubarak)",
        cautionNote: "Avoid Moon Void of Course periods"
      },
      ha: {
        optimalHour: "09:00 - 10:15 (Sa'ar Utarid)",
        favorableWindow: "Ranar 4 zuwa 12 ga watan kamawa",
        mercuryCondition: "Utarid a Gemini ko Virgo (Gikakken iko)",
        moonPhase: "Girmamar Wata (Hilal Mubarak)",
        cautionNote: "Guje wa lokacin da Wata bashi da tsayuwa"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "09:00 - 10:15 (Saa'at 'Utarid)",
      favorableWindow: "Du 4ème au 12ème jour du mois lunaire",
      mercuryCondition: "Mercure en Gémeaux ou Vierge (Dignité intégrale)",
      moonPhase: "Croissant de Lune (Hilal Mubarrak)",
      cautionNote: "Éviter la période de Lune vide de course (Void of Course)"
    };

    return {
      score: Math.min(score, 97),
      ...details
    };
  }, [uqudContractType, uqudTargetDay, language]);

  // 5. Falahah Calculation Engine
  const falahahData = useMemo(() => {
    let score = 93;
    if (falahahCropType === 'cereals' || falahahCropType === 'roots') score += 4;

    const details = {
      fr: {
        optimalHour: "06:00 - 08:00 (Aube - Heure du Soleil / Saturne)",
        favorableWindow: "Lune montante en signe de Terre (Taureau/Vierge)",
        earthElementAffinity: "96% (Affinité Terrestre Maximale)",
        mansion: "Al-Simak al-A'zal (السماك الأعزل) - Croissance vigoureuse",
        soilRitual: "Sprinkler 7 gouttes d'eau de puits bénite sur la première semence"
      },
      en: {
        optimalHour: "06:00 - 08:00 (Dawn - Sun / Saturn Hour)",
        favorableWindow: "Waxing Moon in Earth Sign (Taurus/Virgo)",
        earthElementAffinity: "96% (Maximum Earth Affinity)",
        mansion: "Al-Simak al-A'zal - Vigorous growth",
        soilRitual: "Sprinkle 7 drops of blessed well water on the first seed"
      },
      ha: {
        optimalHour: "06:00 - 08:00 (Asuba - Sa'ar Shams / Zuhal)",
        favorableWindow: "Wata mai girma a tauraron Kasa (Thawr/Sunbulah)",
        earthElementAffinity: "96% (Daidaiton Kasa)",
        mansion: "Al-Simak al-A'zal - Bunkasar girmama shuka",
        soilRitual: "Yayafa digo 7 na ruwan rijiya a kan shuka ta farko"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "06:00 - 08:00 (Aube - Heure du Soleil / Saturne)",
      favorableWindow: "Lune montante en signe de Terre (Taureau/Vierge)",
      earthElementAffinity: "96% (Affinité Terrestre Maximale)",
      mansion: "Al-Simak al-A'zal (السماك الأعزل) - Croissance vigoureuse",
      soilRitual: "Sprinkler 7 gouttes d'eau de puits bénite sur la première semence"
    };

    return {
      score: Math.min(score, 98),
      ...details
    };
  }, [falahahCropType, falahahAction, language]);

  // 6. Tijarah Calculation Engine
  const tijarahData = useMemo(() => {
    let score = 96;
    if (tijarahDomain === 'retail' || tijarahDomain === 'hospitality') score += 3;

    const details = {
      fr: {
        optimalHour: "08:30 - 10:00 (Heure de Jupiter / Al-Mushtari)",
        favorableWindow: "Jeudi matin au lever du soleil",
        sunJupiterAspect: "Trine exact Soleil-Jupiter (120°)",
        customerAttraction: "Attraction de la Clientèle & Barakah Comerciale",
        incense: "Brûler du Mastic de Chios (Mastaki) et du Benjoin blanc"
      },
      en: {
        optimalHour: "08:30 - 10:00 (Jupiter Hour)",
        favorableWindow: "Thursday morning at sunrise",
        sunJupiterAspect: "Exact Sun-Jupiter Trine (120°)",
        customerAttraction: "Client Attraction & Commercial Barakah",
        incense: "Burn Chios Mastic and White Benzoin"
      },
      ha: {
        optimalHour: "08:30 - 10:00 (Sa'ar Mushtari)",
        favorableWindow: "Alhamis da safe lokacin hualar rana",
        sunJupiterAspect: "Hadaka mai kyau tsakanin Shams da Mushtari (120°)",
        customerAttraction: "Jan hankalin abokan ciniki da Albarka",
        incense: "Kona turaren Mastaki da Laban Jawi farri"
      }
    }[(language as 'fr'|'en'|'ha')] || {
      optimalHour: "08:30 - 10:00 (Heure de Jupiter / Al-Mushtari)",
      favorableWindow: "Jeudi matin au lever du soleil",
      sunJupiterAspect: "Trine exact Soleil-Jupiter (120°)",
      customerAttraction: "Attraction de la Clientèle & Barakah Comerciale",
      incense: "Brûler du Mastic de Chios (Mastaki) et du Benjoin blanc"
    };

    return {
      score: Math.min(score, 99),
      ...details
    };
  }, [tijarahDomain, tijarahOwnerAbjad, language]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-hidden">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-teal-950 to-indigo-950 text-white p-4 sm:p-8 shadow-2xl border border-amber-500/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Compass size={320} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Star size={14} /> {t.pageTitle}
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-amber-100 break-words">
            {t.pageTitle}
          </h1>
          <p className="text-gray-300 text-xs sm:text-base leading-relaxed break-words">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 max-w-full">
        {[
          { id: 'bina', label: t.tabs.bina, icon: Building },
          { id: 'safar', label: t.tabs.safar, icon: Navigation },
          { id: 'nikah', label: t.tabs.nikah, icon: Heart },
          { id: 'uqud', label: t.tabs.uqud, icon: FileText },
          { id: 'falahah', label: t.tabs.falahah, icon: Sprout },
          { id: 'tijarah', label: t.tabs.tijarah, icon: ShoppingBag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BINA (BUILDING & FOUNDATION) */}
      {activeTab === 'bina' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-amber-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0">
              <Building size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.binaTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.binaDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.buildingTypeLabel}
              </label>
              <select
                value={binaBuildingType}
                onChange={(e) => setBinaBuildingType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {Object.entries(t.buildingTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.ownerSignLabel}
              </label>
              <select
                value={binaOwnerSign}
                onChange={(e) => setBinaOwnerSign(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {Object.entries(t.labels.zodiacSigns).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.targetMonthLabel}
              </label>
              <select
                value={binaTargetMonth}
                onChange={(e) => setBinaTargetMonth(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {Object.entries(t.labels.months).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Block */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-950 via-slate-950 to-stone-950 rounded-3xl border border-amber-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.binaResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-100 mt-1 break-words">{binaData.optimalHour}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-amber-300">{t.labels.electionScore}</span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{binaData.score}%</p>
                </div>
                <button
                  onClick={() => handleCopy(`${t.binaTitle}\n${binaData.optimalHour}\nScore: ${binaData.score}%`)}
                  className="p-3 bg-amber-500/20 hover:bg-amber-500/40 rounded-2xl border border-amber-400/40 text-amber-200 cursor-pointer"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-amber-100/90">
              <div className="p-4 bg-amber-900/20 rounded-2xl border border-amber-800/40 space-y-1">
                <span className="text-amber-400 font-bold block">🌙 {t.binaMoonSign.split(':')[0]}</span>
                <p className="break-words">{t.binaMoonSign}</p>
              </div>
              <div className="p-4 bg-amber-900/20 rounded-2xl border border-amber-800/40 space-y-1">
                <span className="text-amber-400 font-bold block">✨ {t.binaAscendant.split(':')[0]}</span>
                <p className="break-words">{binaData.ascendant}</p>
              </div>
              <div className="p-4 bg-amber-900/20 rounded-2xl border border-amber-800/40 space-y-1">
                <span className="text-amber-400 font-bold block">⭐ {t.labels.lunarMansion}</span>
                <p className="break-words">{binaData.moonMansion}</p>
              </div>
              <div className="p-4 bg-amber-900/20 rounded-2xl border border-amber-800/40 space-y-1">
                <span className="text-amber-400 font-bold block">🛡️ {t.labels.afflictionsToAvoid}</span>
                <p className="break-words">{binaData.afflictions}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-400/30 text-xs text-amber-200">
              <span className="font-bold text-amber-300 block mb-1">📜 {t.labels.spiritualRitual} :</span>
              <p className="break-words">{t.binaAdvice}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFAR (TRAVEL) */}
      {activeTab === 'safar' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-teal-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-teal-100 dark:bg-teal-900/50 rounded-2xl text-teal-600 dark:text-teal-400 shrink-0">
              <Navigation size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.safarTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.safarDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.travelDirectionLabel}
              </label>
              <select
                value={safarDirection}
                onChange={(e) => setSafarDirection(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {Object.entries(t.directions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.travelModeLabel}
              </label>
              <select
                value={safarMode}
                onChange={(e) => setSafarMode(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {Object.entries(t.travelModes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.safarPassengerSignLabel}
              </label>
              <select
                value={safarPassengerSign}
                onChange={(e) => setSafarPassengerSign(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {Object.entries(t.labels.zodiacSigns).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-br from-teal-950 via-slate-950 to-indigo-950 rounded-3xl border border-teal-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-teal-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">{t.safarResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-teal-100 mt-1 break-words">{safarData.optimalHour}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-teal-300">{t.labels.electionScore}</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">{safarData.score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-teal-100/90">
              <div className="p-4 bg-teal-900/20 rounded-2xl border border-teal-800/40 space-y-1">
                <span className="text-teal-400 font-bold block">☿ {t.mercuryStatusLabel}</span>
                <p className="break-words">{safarData.mercuryStatus}</p>
              </div>
              <div className="p-4 bg-teal-900/20 rounded-2xl border border-teal-800/40 space-y-1">
                <span className="text-teal-400 font-bold block">🌙 {t.labels.lunarMansion}</span>
                <p className="break-words">{safarData.moonMansion}</p>
              </div>
            </div>

            <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-400/30 text-center space-y-2">
              <span className="text-xs font-bold text-teal-300 uppercase">{t.safarVerse}</span>
              <p className="text-base sm:text-lg font-extrabold text-amber-200 dir-rtl break-all">{safarData.protectionVerse}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NIKAH (ALLIANCES & MARRIAGE) */}
      {activeTab === 'nikah' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-rose-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 shrink-0">
              <Heart size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.nikahTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.nikahDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.groomSignLabel}
              </label>
              <select
                value={nikahGroomSign}
                onChange={(e) => setNikahGroomSign(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
              >
                {Object.entries(t.labels.zodiacSigns).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.brideSignLabel}
              </label>
              <select
                value={nikahBrideSign}
                onChange={(e) => setNikahBrideSign(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
              >
                {Object.entries(t.labels.zodiacSigns).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.nikahIntentionLabel}
              </label>
              <select
                value={nikahIntention}
                onChange={(e) => setNikahIntention(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
              >
                {Object.entries(t.nikahIntentions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-br from-rose-950 via-slate-950 to-pink-950 rounded-3xl border border-rose-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-rose-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">{t.nikahResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-rose-100 mt-1 break-words">{nikahData.optimalHour}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-rose-300">{t.labels.electionScore}</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">{nikahData.score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-rose-100/90">
              <div className="p-4 bg-rose-900/20 rounded-2xl border border-rose-800/40 space-y-1">
                <span className="text-rose-400 font-bold block">♀️ {t.nikahVenusRule}</span>
                <p className="break-words">{nikahData.venusDignity}</p>
              </div>
              <div className="p-4 bg-rose-900/20 rounded-2xl border border-rose-800/40 space-y-1">
                <span className="text-rose-400 font-bold block">🌙 {t.nikahMoonRule}</span>
                <p className="break-words">{nikahData.moonTrine}</p>
              </div>
            </div>

            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-400/30 text-xs text-rose-200">
              <span className="font-bold text-rose-300 block mb-1">⚠️ {t.labels.afflictionsToAvoid} :</span>
              <p className="break-words">{nikahData.forbiddenWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UQUD (CONTRACTS & SIGNATURE) */}
      {activeTab === 'uqud' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-indigo-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <FileText size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.uqudTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.uqudDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.contractTypeLabel}
              </label>
              <select
                value={uqudContractType}
                onChange={(e) => setUqudContractType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.entries(t.contractTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.targetDayLabel}
              </label>
              <select
                value={uqudTargetDay}
                onChange={(e) => setUqudTargetDay(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.entries(t.labels.days).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 rounded-3xl border border-indigo-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-indigo-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{t.uqudResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-100 mt-1 break-words">{uqudData.optimalHour}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-300">{t.labels.electionScore}</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">{uqudData.score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-indigo-100/90">
              <div className="p-4 bg-indigo-900/20 rounded-2xl border border-indigo-800/40 space-y-1">
                <span className="text-indigo-400 font-bold block">☿ {t.uqudMercuryHour}</span>
                <p className="break-words">{uqudData.mercuryCondition}</p>
              </div>
              <div className="p-4 bg-indigo-900/20 rounded-2xl border border-indigo-800/40 space-y-1">
                <span className="text-indigo-400 font-bold block">🌙 {t.uqudMoonPhase}</span>
                <p className="break-words">{uqudData.moonPhase}</p>
              </div>
            </div>

            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-400/30 text-xs text-indigo-200">
              <span className="font-bold text-indigo-300 block mb-1">📜 {t.uqudCaution}</span>
              <p className="break-words">{uqudData.cautionNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FALAHAH (HARVEST & AGRICULTURE) */}
      {activeTab === 'falahah' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-emerald-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sprout size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.falahahTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.falahahDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.cropTypeLabel}
              </label>
              <select
                value={falahahCropType}
                onChange={(e) => setFalahahCropType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Object.entries(t.cropTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.agriActionLabel}
              </label>
              <select
                value={falahahAction}
                onChange={(e) => setFalahahAction(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Object.entries(t.agriActions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 rounded-3xl border border-emerald-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-emerald-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t.falahahResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-100 mt-1 break-words">{falahahData.optimalHour}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-300">{t.falahahElementScore}</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{falahahData.score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-emerald-100/90">
              <div className="p-4 bg-emerald-900/20 rounded-2xl border border-emerald-800/40 space-y-1">
                <span className="text-emerald-400 font-bold block">🌍 {t.falahahEarthRule}</span>
                <p className="break-words">{t.falahahEarthRule}</p>
              </div>
              <div className="p-4 bg-emerald-900/20 rounded-2xl border border-emerald-800/40 space-y-1">
                <span className="text-emerald-400 font-bold block">⭐ {t.falahahMansionRule}</span>
                <p className="break-words">{falahahData.mansion}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-400/30 text-xs text-emerald-200">
              <span className="font-bold text-emerald-300 block mb-1">🌱 {t.labels.spiritualRitual} :</span>
              <p className="break-words">{falahahData.soilRitual}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TIJARAH (COMMERCE & BUSINESS) */}
      {activeTab === 'tijarah' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-purple-500/30 space-y-6 overflow-hidden max-w-full">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 sm:p-3 bg-purple-100 dark:bg-purple-900/50 rounded-2xl text-purple-600 dark:text-purple-400 shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white break-words">{t.tijarahTitle}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words leading-normal">{t.tijarahDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.businessDomainLabel}
              </label>
              <select
                value={tijarahDomain}
                onChange={(e) => setTijarahDomain(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {Object.entries(t.businessDomains).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t.ownerAbjadLabel}
              </label>
              <input
                type="number"
                value={tijarahOwnerAbjad}
                onChange={(e) => setTijarahOwnerAbjad(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-extrabold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 rounded-3xl border border-purple-500/40 text-white space-y-6 overflow-hidden max-w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-purple-500/20 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">{t.tijarahResultTitle}</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-purple-100 mt-1 break-words">{tijarahData.optimalHour}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-300">{t.labels.barakahIndex}</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">{tijarahData.score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-purple-100/90">
              <div className="p-4 bg-purple-900/20 rounded-2xl border border-purple-800/40 space-y-1">
                <span className="text-purple-400 font-bold block">☀️ {t.tijarahJupiterRule}</span>
                <p className="break-words">{tijarahData.sunJupiterAspect}</p>
              </div>
              <div className="p-4 bg-purple-900/20 rounded-2xl border border-purple-800/40 space-y-1">
                <span className="text-purple-400 font-bold block">✨ {t.labels.barakahIndex}</span>
                <p className="break-words">{tijarahData.customerAttraction}</p>
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-400/30 text-xs text-purple-200">
              <span className="font-bold text-purple-300 block mb-1">🕯️ {t.tijarahIncense}</span>
              <p className="break-words">{tijarahData.incense}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologicalElections;
