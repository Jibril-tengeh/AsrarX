import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Crown,
  Compass,
  Star,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  Bookmark,
  Layers,
  Wand2,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useFeatures } from "../contexts/FeatureContext";
import { useAuth } from "../contexts/AuthContext";
import { tools, ToolItem } from "../data/tools";

// Curated high quality cinematic spiritual looping video backgrounds
// with reliable CDNs and instant CSS/Canvas fallbacks
const VIDEO_PRESETS = [
  {
    id: "cosmic",
    name: "Cosmique Mystique",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-indigo-950/80 via-slate-900/85 to-purple-950/90",
    accentColor: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-500/30",
  },
  {
    id: "golden",
    name: "Lumière Dorée Sacrée",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-slowly-41525-large.mp4",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-amber-950/85 via-stone-900/85 to-yellow-950/90",
    accentColor: "from-amber-400 to-yellow-500",
    borderColor: "border-amber-500/30",
  },
  {
    id: "emerald",
    name: "Aurore Émeraude",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-green-aurora-borealis-in-the-night-sky-40097-large.mp4",
    poster: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-emerald-950/85 via-teal-950/85 to-slate-900/90",
    accentColor: "from-emerald-400 to-teal-400",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "twilight",
    name: "Nébuleuse Royale",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-starfield-in-space-41526-large.mp4",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    gradient: "from-purple-950/85 via-fuchsia-950/80 to-slate-950/90",
    accentColor: "from-fuchsia-400 to-purple-400",
    borderColor: "border-purple-500/30",
  },
];

interface ToolsVideoSliderProps {
  className?: string;
}

// Multilingual translations database for all 62 tools
const TOOL_TRANSLATIONS: Record<string, { fr: { title: string; desc: string }; en: { title: string; desc: string }; ha: { title: string; desc: string } }> = {
  "abjad": {
    fr: { title: "Calculateur Abjad", desc: "Calculez la valeur numérique mystique de vos noms et wirds." },
    en: { title: "Abjad Calculator", desc: "Calculate the mystical numerical value of your names and wirds." },
    ha: { title: "Kwamfutar Hisabin Abjad", desc: "Lissafa adadin asirin lambobin sunayenku da wirdi." }
  },
  "custom-dua": {
    fr: { title: "Générateur de Du'a Custom", desc: "Invocations personnalisées alignées sur votre nom, votre intention et le poids Abjad." },
    en: { title: "Custom Du'a Generator", desc: "Personalized prayers aligned with your name, intention, and Abjad weight." },
    ha: { title: "Maikirkiro Addu'a Ta Musamman", desc: "Addu'o'i na musamman da suka dace da sunanka, niyyarka da adadin Abjad." }
  },
  "advanced-raml-processing": {
    fr: { title: "Traitement Avancé de Raml", desc: "Sceau concentrique de Sable (Khatam al-Raml), Heure de Tracé (Sa'at al-Tacht) et Analyse des blocages." },
    en: { title: "Advanced Geomancy (Raml)", desc: "Concentric Sand Seal (Khatam al-Raml), Casting Hour (Sa'at al-Tacht) & Blockage Analysis." },
    ha: { title: "Cikakken Binciken Ƙasa (Raml)", desc: "Hatimin Ƙasa na musamman, lokacin zane (Sa'at al-Tacht) da nazarin matsaloli." }
  },
  "seals-catalogue": {
    fr: { title: "Catalogue des Sceaux", desc: "Explorez, basculez et téléchargez les 17 Sceaux et Khawatim de la Lune." },
    en: { title: "Sacred Seals Catalogue", desc: "Explore, customize and download the 17 Lunar Seals and Khawatim." },
    ha: { title: "Rumbun Hatimai Masu Tsarki", desc: "Bincika, zabi kuma sauke hatimai 17 na wata da khawatim." }
  },
  "asma": {
    fr: { title: "Noms Divins Personnels", desc: "Découvrez vos noms divins correspondants au poids mystique de votre nom." },
    en: { title: "Personal Divine Names", desc: "Discover your divine names matching the mystical weight of your name." },
    ha: { title: "Sunayen Allah Na Musamman", desc: "Gano sunayen Allah masu dacewa da adadin nauyin sunanka." }
  },
  "99names": {
    fr: { title: "Les 99 Noms d'Allah", desc: "Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna)." },
    en: { title: "The 99 Names of Allah", desc: "Search, study and contemplate the Sublime Names (Asma al-Husna)." },
    ha: { title: "Kyawawan Sunayen Allah 99", desc: "Bincika, koya kuma fahimci kyawawan sunayen Allah (Asmaul Husna)." }
  },
  "quran": {
    fr: { title: "Le Saint Coran", desc: "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar." },
    en: { title: "The Holy Quran", desc: "Reading and contemplating the Quran, the foundational pillar of all spiritual secrets." },
    ha: { title: "Alkur'ani Mai Girma", desc: "Karatun Alkur'ani mai girma, ginshikin dukkan sirrin asrar." }
  },
  "tasbih": {
    fr: { title: "Tasbih Virtuel", desc: "Un compteur de zikr intelligent pour suivre vos récitations quotidiennes." },
    en: { title: "Virtual Tasbih", desc: "A smart zikr counter to effortlessly track your daily recitations." },
    ha: { title: "Tasbaha Mai Sauƙi", desc: "Lissafin zikiri na zamani mai sauki don bibiyar adadin ibadunku na yau da kullum." }
  },
  "daily-dhikr": {
    fr: { title: "Suivi de Zikr Quotidien", desc: "Définissez des objectifs et suivez votre Dhikr quotidien avec persistance." },
    en: { title: "Daily Dhikr Tracker", desc: "Set spiritual targets and track your daily Dhikr with consistency." },
    ha: { title: "Bibiyar Zikiri na Kullum", desc: "Kafa manufofi da bibiyar zikiranku na kullum cikin sauƙi." }
  },
  "planetary": {
    fr: { title: "Heures Planétaires", desc: "Déterminez les heures spirituelles propices pour vos invocations et opérations." },
    en: { title: "Planetary Hours", desc: "Determine the most auspicious spiritual hours for your prayers and rituals." },
    ha: { title: "Sa'o'in Taurari da Lokuta", desc: "Gano lokuta masu albarka don yin addu'o'i da ayyukan asrar." }
  },
  "zakat": {
    fr: { title: "Calculateur de Zakat", desc: "Calculez précisément votre Zakat al-Maal sur diverses richesses." },
    en: { title: "Zakat Calculator", desc: "Accurately calculate your Zakat al-Maal on diverse assets and savings." },
    ha: { title: "Kwamfutar Zakka", desc: "Lissafa ainihin zakkar dukiyarku cikin inganci da sauƙi." }
  },
  "faraid": {
    fr: { title: "Calculateur de Faraid", desc: "Calculez les parts d'héritage selon la jurisprudence islamique." },
    en: { title: "Islamic Inheritance (Faraid)", desc: "Calculate inheritance shares in accordance with Islamic jurisprudence." },
    ha: { title: "Lissafin Gado (Fara'id)", desc: "Lissafa rabon gado daidai da koyarwar shari'ar Musulunci." }
  },
  "dreams": {
    fr: { title: "Journal des Rêves (IA)", desc: "Analysez et documentez vos rêves avec l'IA spirituelle inspirée d'Ibn Sirin." },
    en: { title: "Dream Journal (AI)", desc: "Analyze and document your dreams with spiritual AI inspired by Ibn Sirin." },
    ha: { title: "Fassarar Mafarki (AI)", desc: "Yi nazari da fassara mafarkanku tare da fasahar AI mai tushe daga Ibn Sirin." }
  },
  "halaqat": {
    fr: { title: "Halaqat Virtuelles", desc: "Cercles de Dhikr en temps réel et objectifs communautaires." },
    en: { title: "Virtual Halaqat", desc: "Real-time collective Dhikr circles and spiritual community milestones." },
    ha: { title: "Majalisar Zikiri ta Jama'a", desc: "Halaqobin zikiri na kai-tsaye tare da 'yan uwa a kowane lokaci." }
  },
  "personal-wird": {
    fr: { title: "Générateur de Wird & Rituels", desc: "Istikhraj al-Asma : Calculez votre Zikr personnel selon votre poids mystique." },
    en: { title: "Wird & Rituals Generator", desc: "Istikhraj al-Asma: Calculate personalized daily Awrad according to your name's weight." },
    ha: { title: "Maikirkiro Wirdi da Ayyuka", desc: "Istikhraj al-Asma: Lissafa wirdin zikirinku na musamman da ya dace da nauyinku." }
  },
  "lunar-mansions": {
    fr: { title: "Demeures de la Lune", desc: "Manazil al-Qamar : Suivez les 28 demeures astrologiques pour vos opérations spirituelles." },
    en: { title: "Lunar Mansions (Manazil)", desc: "Manazil al-Qamar: Track the 28 lunar mansions for precise spiritual timing." },
    ha: { title: "Manazilan Wata (28)", desc: "Manazil al-Qamar: Bibiyar matakan wata 28 don ayyukan asrar da lokuta masu albarka." }
  },
  "spiritual-compatibility": {
    fr: { title: "Compatibilité Spirituelle", desc: "Hisab al-Tawafuq : Règle d'Al-Buni pour l'harmonie des couples et partenariats." },
    en: { title: "Spiritual Compatibility", desc: "Hisab al-Tawafuq: Al-Buni's method for marriage and partnership harmony." },
    ha: { title: "Dacewar Ruhi (Tawafuq)", desc: "Hisab al-Tawafuq: Hanyar Sheikh Al-Buni don duba dacewar aure da abota." }
  },
  "ilm-jafar": {
    fr: { title: "Oracle de Jafar", desc: "Ilm al-Jafar : Divination suprême par la fracturation des lettres et Taksir." },
    en: { title: "Oracle of Jafar", desc: "Ilm al-Jafar: Esoteric wisdom through letter fracturing (Taksir) and mystical extraction." },
    ha: { title: "Ilimin Jafaru", desc: "Ilm al-Jafar: Zurfafa bincike ta hanyar karayar haruffa da Taksir." }
  },
  "grand-oaths": {
    fr: { title: "Grands Serments", desc: "Da'awat & Azayim : Bibliothèque complète des invocations et serments majeurs." },
    en: { title: "Grand Oaths & Da'awat", desc: "Da'awat & Azayim: Complete library of major spiritual invocations." },
    ha: { title: "Rantsuwar Asrar (Da'awat)", desc: "Da'awat & Azayim: Rumbun addu'o'i da manyan kiran ruhi." }
  },
  "elemental": {
    fr: { title: "Analyseur Élémentaire", desc: "Tabai' al-Huruf : Découvrez la nature dominante de votre nom (Feu, Terre, Air, Eau)." },
    en: { title: "Elemental Nature Analysis", desc: "Tabai' al-Huruf: Discover the dominant element of your soul (Fire, Earth, Air, Water)." },
    ha: { title: "Binciken Hali da Yanayi", desc: "Tabai' al-Huruf: Gano yanayin sunanka tsakanin Wuta, Ƙasa, Iska da Ruwa." }
  },
  "geomancy": {
    fr: { title: "Géomancie Arabe", desc: "Khatt ar-Raml : Générez et interprétez les figures géomantiques pour vos consultations." },
    en: { title: "Arabic Geomancy", desc: "Khatt ar-Raml: Generate and interpret geomantic figures for authentic consultation." },
    ha: { title: "Ilimin Ramli na Larabci", desc: "Khatt ar-Raml: Zane da fassarar sassan ramli don sanin hakikanin al'amura." }
  },
  "letters": {
    fr: { title: "Science des Lettres", desc: "Sirr al-Huruf : Découvrez les secrets et mystères de chaque lettre arabe." },
    en: { title: "Science of Letters (Huruf)", desc: "Sirr al-Huruf: Unveil numerical secrets and cosmic mysteries of Arabic letters." },
    ha: { title: "Ilimin Haruffa (Ilmul Huruf)", desc: "Sirr al-Huruf: Gano sirrika da asirin kowace harafi na Larabci." }
  },
  "rouhaniyya": {
    fr: { title: "Extracteur Rouhaniyya", desc: "Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids." },
    en: { title: "Rouhaniyya Extractor", desc: "Derive guardian spirits and celestial entities based on sacred names and weights." },
    ha: { title: "Ciro Ruhaniyya", desc: "Ciro sunayen rundunonin ruhi da mala'iku bisa ma'aunin sunaye da adadin Abjad." }
  },
  "taksir": {
    fr: { title: "Taksir (Brisures)", desc: "Générez des matrices de Taksir et des combinaisons ésotériques de lettres." },
    en: { title: "Taksir (Letter Permutation)", desc: "Generate advanced Taksir matrices and harmonious letter permutations." },
    ha: { title: "Taksir (Karayar Haruffa)", desc: "Kirkirar matattarar haruffa da sauye-sauyen asrar cikin sauƙi." }
  },
  "sirr": {
    fr: { title: "Sirr Al-Asrar", desc: "Analyse ésotérique absolue : éléments, auras, gardiens et khuddam." },
    en: { title: "Sirr Al-Asrar", desc: "Supreme esoteric analysis: elements, spiritual aura, and guardian khuddam." },
    ha: { title: "Sirrul Asrar", desc: "Cikakken binciken asiri: yanayin taurari, aura da khuddam." }
  },
  "zairja": {
    fr: { title: "Miroir de la Za'irja", desc: "Oracle spirituel et poème répondeur prophétique par la science des lettres." },
    en: { title: "Mirror of Za'irja", desc: "Spiritual oracle and prophetic responding poetry through the science of letters." },
    ha: { title: "Madubin Za'irja", desc: "Ilimin amsa tambayoyi ta hanyar baituka da asirin haruffa." }
  },
  "ring-pendant-talisman": {
    fr: { title: "Talisman de Bague & Pendentifs", desc: "Gravez virtuellement des versets ou talsams circulaires et ovales pour bagues et pendentifs." },
    en: { title: "Ring & Pendant Talismans", desc: "Engrave verses and sacred talsams in circular or oval geometry for rings and amulets." },
    ha: { title: "Hatimin Zobe da Wuyan Hannu", desc: "Zana ayoyi da talsamai na musamman don zobe da laya." }
  },
  "combustion-eclipse": {
    fr: { title: "Éclipses & Combustions", desc: "Alertes célestes en temps réel des phases critiques et combustions planétaires." },
    en: { title: "Eclipse & Planetary Combustion", desc: "Real-time alerts for celestial eclipses and planet combustion periods." },
    ha: { title: "Husufi da Kusufi na Taurari", desc: "Sanarwa na kai-tsaye kan lokutan husufin wata da haduwar taurari." }
  },
  "khatim": {
    fr: { title: "Générateur de Khatim", desc: "Créez des carrés magiques (Wafq) 3x3 harmonisés selon les règles traditionnelles." },
    en: { title: "Khatim Generator (Wafq)", desc: "Create traditional 3x3 magic squares (Wafq) harmonized with numerical values." },
    ha: { title: "Maikirkiro Hatimi (Wafaqi)", desc: "Kirkirar hatimi 3x3 na asali da ya dace da lissafin sunaye da ayoyi." }
  },
  "talsam": {
    fr: { title: "Générateur de Talsam", desc: "Créez des mots de pouvoir et talsams chiffrés pour sceller vos invocations." },
    en: { title: "Talsam Generator", desc: "Formulate encrypted power words and sacred ciphers to seal your prayers." },
    ha: { title: "Maikirkiro Talsami", desc: "Kirkirar kalmomin sirri da talsamai masu karfi don kulle ayyukan asrar." }
  },
  "istikhara": {
    fr: { title: "Istikhara Numérique", desc: "Consultation spirituelle guidée basée sur le Coran et le calcul d'Abjad." },
    en: { title: "Digital Istikhara", desc: "Guided spiritual consultation based on the Holy Quran and Abjad calculations." },
    ha: { title: "Istihara ta Fasaha", desc: "Neman zabin Allah cikin sauki bisa koyarwar Alkur'ani da lissafin Abjad." }
  },
  "khouddam": {
    fr: { title: "Détecteur de Khouddam", desc: "Extraction de l'ange et du serviteur spirituel protecteur associé à votre identité." },
    en: { title: "Khuddam & Guardian Detector", desc: "Extract celestial guardians and spiritual servants aligned with your identity." },
    ha: { title: "Gano Khuddam da Masu Tsaro", desc: "Gano mala'iku da rundunonin kariya masu dacewa da sunanka da na mahaifiyarka." }
  },
  "awfaq": {
    fr: { title: "Awfaq Supérieurs (3x3 à 10x10)", desc: "Générateur de carrés magiques avec calcul du Kasr et alignement des 4 éléments." },
    en: { title: "Grand Awfaq (3x3 to 10x10)", desc: "Advanced magic square generator with Kasr fraction distribution and elemental balance." },
    ha: { title: "Babban Awfaq (3x3 zuwa 10x10)", desc: "Kirkirar hatimai manya daga 3x3 har zuwa 10x10 tare da raba kasaru." }
  },
  "quranic-faal": {
    fr: { title: "Istikhara Coranique (Fa'l)", desc: "Consultation traditionnelle du Coran pour la guidance et l'éclairage des choix." },
    en: { title: "Quranic Fa'l (Guidance)", desc: "Traditional Quranic divination method for clear guidance and divine reassurance." },
    ha: { title: "Fa'ali na Alkur'ani", desc: "Hanyar bude Alkur'ani don neman shiriya da tabbatar da alheri a lamura." }
  },
  "ia-rapprochements": {
    fr: { title: "IA Rapprochements Ésotériques", desc: "Croisez vos rêves, le poids de votre nom, et le climat céleste actuel pour des zikrs personnalisés." },
    en: { title: "Esoteric AI Synthesis", desc: "Cross-reference dreams, personal name weights, and cosmic climates for personalized Awrad." },
    ha: { title: "Hada Ilmin AI da Asrar", desc: "Hada mafarki, nauyin suna da yanayin sama don fitar da zikiri na musamman." }
  },
  "daira-as-sirr": {
    fr: { title: "Dā'ira As-Sirr (Sceaux Radiaux)", desc: "Tracé automatique de diagrammes concentriques radiaux selon la tradition d'Al-Buni." },
    en: { title: "Da'irat As-Sirr (Radial Seals)", desc: "Automatic construction of concentric sacred radial diagrams in Ahmad Al-Buni's tradition." },
    ha: { title: "Da'irat As-Sirr (Hatimi Mai Zagaye)", desc: "Zana hatimai masu kewayen zagaye bisa ka'idojin Sheikh Ahmad Al-Buni." }
  },
  "saah-ijabah": {
    fr: { title: "Sā'ah al-Ijābah (Horloge d'Exaucement)", desc: "Calculateur en temps réel des heures sacrées d'exaucement des invocations." },
    en: { title: "Sa'ah al-Ijabah (Hour of Acceptance)", desc: "Real-time calculator for sacred celestial windows of accepted prayers." },
    ha: { title: "Sa'atul Ijabah (Sa'ar Karɓar Addu'a)", desc: "Kwamfutar gano ainihin lokutan da addu'a ba ta faduwa kasa." }
  },
  "seven-kings": {
    fr: { title: "Les 7 Sceaux des Rois Célestes", desc: "Générez et visualisez en haute définition les sceaux des 7 Rois Célestes d'Al-Buni." },
    en: { title: "The 7 Seals of Spiritual Kings", desc: "Generate and visualize the ancient seals of the 7 Celestial Kings in high resolution." },
    ha: { title: "Hatimai 7 na Sarakunan Ruhi", desc: "Kirkira da duba manyan hatimai 7 na sarakunan ruhi cikin cikakken haske." }
  },
  "quran-analogy": {
    fr: { title: "Analogie Coranique Profonde", desc: "Révélez les relations vibratoires entre sourates, versets et intentions." },
    en: { title: "Deep Quranic Analogy", desc: "Reveal esoteric harmonies between Surahs, Ayats, and your personal intentions." },
    ha: { title: "Kwatancen Alkur'ani Mai Zurfi", desc: "Gano alakar ayoyi da surorin Alkur'ani da suka dace da bukatarka." }
  },
  "zikr-levels": {
    fr: { title: "Niveaux & Degrés de Zikr", desc: "Guide méthodique pour structurer l'élévation de votre wird selon les stations mystiques." },
    en: { title: "Zikr Degrees & Stations", desc: "Methodical guide to elevate your daily wird through authentic mystical stations." },
    ha: { title: "Darajojin Zikiri da Maqamomi", desc: "Hanyar inganta karatun zikiri daga mataki zuwa mataki na ruhi." }
  },
  "hijri-full-moon": {
    fr: { title: "Pleine Lune & Jours Blancs", desc: "Calculateur précis des nuits de pleine lune et des jours blancs (Ayyām al-Bīḍ)." },
    en: { title: "Full Moon & White Days", desc: "Accurate tracking of full moon nights and the blessed White Days (Ayyām al-Bīḍ)." },
    ha: { title: "Daren Cikakken Wata da Kwanakin Farra", desc: "Lissafin ranakun cikar wata da kwanakin azumin Ayyām al-Bīḍ." }
  },
  "murid-journal": {
    fr: { title: "Journal Spirituel du Mourid", desc: "Espace intime pour consigner vos progrès, visions, songes et retraites (Khalwa)." },
    en: { title: "Murid's Spiritual Journal", desc: "Sacred private space to log your insights, spiritual progress, and Khalwa visions." },
    ha: { title: "Littafin Muridi na Sirri", desc: "Wurin rubuta bayanan ruhi, ci gaban ibada da abubuwan da aka gani a khalwa." }
  },
  "al-buni-shams": {
    fr: { title: "Shams al-Ma'arif (Al-Buni)", desc: "Explorateur complet des 40 chapitres et secrets sacrés de Shams al-Ma'arif." },
    en: { title: "Shams al-Ma'arif Explorer", desc: "Complete explorer of the 40 chapters and sacred treatises of Shams al-Ma'arif." },
    ha: { title: "Shamsul Ma'arif na Sheikh Al-Buni", desc: "Binciken cikakkun surori 40 da asirai masu daraja na Shamsul Ma'arif." }
  },
  "rajma-charms": {
    fr: { title: "Détecteur de Rajma & Sortilèges", desc: "Diagnostic des énergies lourdes, blocages occultes et protocoles de libération." },
    en: { title: "Rajma & Curse Protection", desc: "Diagnose negative spiritual blockages and obtain divine liberation protocols." },
    ha: { title: "Kariyar Sihiri da Jifa (Rajma)", desc: "Gano matsalolin sihiri da jifa tare da hanyoyin magance su cikin yardar Allah." }
  },
  "sacred-books": {
    fr: { title: "Bibliothèque des Livres Sacrés", desc: "Traités classiques d'Al-Buni, Ibn Arabi, Al-Ghazali et maîtres du Soufisme." },
    en: { title: "Sacred Books Library", desc: "Classic spiritual treatises by Al-Buni, Ibn Arabi, Al-Ghazali and master Sufis." },
    ha: { title: "Rumbun Littattafan Asrar", desc: "Manyan littattafan Sheikh Al-Buni, Ibn Arabi, Al-Ghazali da malaman asrar." }
  },
  "diagnostic-protection": {
    fr: { title: "Diagnostic & Protection Spirituelle", desc: "Bilan complet de votre aura, boucliers théurgiques et remparts de lumière." },
    en: { title: "Spiritual Diagnostic & Armor", desc: "Complete aura assessment, protective theurgic shields, and divine light armor." },
    ha: { title: "Binciken Kariya da Lafiyar Ruhi", desc: "Binciken kariya daga sharri da gina ganuwar tsaro ta hasken ayoyi." }
  },
  "talismanic-geometry": {
    fr: { title: "Géométrie Talismanique Sacrée", desc: "Conception géométrique sacrée de sceaux, pentacles et matrices de protection." },
    en: { title: "Sacred Talismanic Geometry", desc: "Sacred geometrical design of seals, pentacles, and protective matrices." },
    ha: { title: "Zanen Hatimin Tsaro na Ruhi", desc: "Zanen hatimai da layoyi masu tsari na musamman don tsaro da kariya." }
  },
  "talsams-extraction": {
    fr: { title: "Extracteur de Talsams Avancé", desc: "Extraction fine des codes numériques, inversions et sceaux de puissance." },
    en: { title: "Advanced Talsam Extractor", desc: "Precision extraction of numeric codes, reversed letters, and ciphered power seals." },
    ha: { title: "Ciro Manyan Talsamai", desc: "Ciro lambobin sirri da kalmomin talsami masu ban mamaki." }
  },
  "astrological-elections": {
    fr: { title: "Élections Astrologiques Sacrées", desc: "Calcul des moments propices pour débuter commerces, mariages, voyages et rituels." },
    en: { title: "Sacred Astrological Elections", desc: "Elect auspicious astrological timing for business, marriages, travels, and sacred rites." },
    ha: { title: "Zaben Lokacin Albarka na Ayyuka", desc: "Zaben ainihin lokacin da taurari ke bada alheri don kasuwanci da aure." }
  },
  "sacred-geography": {
    fr: { title: "Géographie Sacrée & Qibla", desc: "Orientation théurgique, direction exacte de la Mecque et résonances géographiques." },
    en: { title: "Sacred Geography & Qibla", desc: "Theurgic alignment, high-precision Qibla direction, and holy earth energy grids." },
    ha: { title: "Alƙibla da Taswirar Wurare Masu Albarka", desc: "Gano ainihin Alkibla da taswirar wurare masu falala a duniya." }
  },
  "advanced-alchemy": {
    fr: { title: "Alchimie Spirituelle (Al-Kimiya)", desc: "Transmutation des états de l'âme et science des correspondances subtiles." },
    en: { title: "Spiritual Alchemy (Al-Kimiya)", desc: "Soul transmutation, spiritual purification, and subtle theurgic correspondences." },
    ha: { title: "Kimiyyar Asrar ta Ruhi (Al-Kimiya)", desc: "Tsarkake zuciya da sauya halaye zuwa matsayin haske da daukaka." }
  },
  "metaphysical-defense": {
    fr: { title: "Défense Métaphysique", desc: "Protocoles de neutralisation contre le mauvais œil, la jalousie et les attaques occultes." },
    en: { title: "Metaphysical Defense", desc: "Spiritual counter-measures against the evil eye, envy, and unseen occult forces." },
    ha: { title: "Kariya daga Bakin Ido da Hassada", desc: "Addu'o'i da kariya daga sharrin mahassada da bakin ido." }
  },
  "discretion-protection": {
    fr: { title: "Protection & Discrétion (Khitman)", desc: "Secrets de dissimulation spirituelle et protection de vos biens et projets." },
    en: { title: "Discretion & Shielding (Khitman)", desc: "Spiritual concealment and preservation of your blessings and noble projects." },
    ha: { title: "Sirrin Boyewa da Tsare Albarka (Kitman)", desc: "Sirrin kare alheri da ayyukan alheri daga idon makiyan asiri." }
  },
  "anchoring-stability": {
    fr: { title: "Ancrage & Stabilité Spirituelle", desc: "Enracinement intérieur, sérénité de l'esprit et fermeté face aux épreuves." },
    en: { title: "Spiritual Anchoring & Stability", desc: "Deep inner grounding, spiritual peace, and resilience against worldly trials." },
    ha: { title: "Natsuwar Zuciya da Tabbatuwa", desc: "Samun natsuwa mai dorewa da karfin zuciya a cikin kowanne yanayi." }
  },
  "spiritual-hub": {
    fr: { title: "Hub Spirituel Universel", desc: "Point de convergence de l'ensemble des modules, traités et calculateurs sacrés." },
    en: { title: "Universal Spiritual Hub", desc: "Central convergence point for all sacred treatises, calculators, and occult tools." },
    ha: { title: "Babban Rumbun Asrar", desc: "Wurin haduwar dukkan ilimomi, littattafai da kayan aikin asrar." }
  },
  "thiebissaba-tradition": {
    fr: { title: "Tradition Thiébissaba", desc: "Science traditionnelle d'Afrique de l'Ouest combinant sable, lettres et sagesse ancestrale." },
    en: { title: "Thiebissaba Tradition", desc: "West African sacred esoteric science integrating earth signs, letters, and wisdom." },
    ha: { title: "Ilmin Thiebissaba na Yammacin Afirka", desc: "Ilimin asalin Afirka mai hada kasan ramli da haruffan asrar." }
  },
  "high-precision-individualization": {
    fr: { title: "Individualisation Haute Précision", desc: "Harmonisation ultra-précise de vos wirds selon l'heure, l'ascendant et le tempérament." },
    en: { title: "High-Precision Individualization", desc: "Tailor-made wird configuration aligned with birth hour, ascendant, and temperament." },
    ha: { title: "Daidaita Ayyuka Daidai da Halin Mutum", desc: "Tsara zikiri daidai da lokacin haihuwa, yanayin tauraro da halitta." }
  },
  "divination-qurah": {
    fr: { title: "Divination Qur'ah Sacrée", desc: "Tirage théurgique selon la table de l'Imam Ja'far as-Sadiq et des anciens sages." },
    en: { title: "Sacred Qur'ah Divination", desc: "Authentic theurgic lots based on Imam Ja'far as-Sadiq and ancient sages." },
    ha: { title: "Kuri'ar Ja'farus Sadiq (Qur'ah)", desc: "Kuri'a mai albarka ta Imam Ja'farus Sadiq don neman haske a kan al'amura." }
  },
  "ibn-arabi-seals": {
    fr: { title: "Sceaux du Sheikh Ibn Arabi", desc: "Géométries théosophiques et diagrammes sacrés du Sheikh al-Akbar." },
    en: { title: "Seals of Sheikh Ibn Arabi", desc: "Theosophical sacred geometries and diagrams from the Greatest Master (Al-Shaykh al-Akbar)." },
    ha: { title: "Hatimai na Sheikh Ibn Arabi", desc: "Zane da hatimai na musamman daga Babban Sheikh Muhyiddin Ibn Arabi." }
  },
  "advanced-geomancy": {
    fr: { title: "Géomancie Avancée (Maison par Maison)", desc: "Interprétation des 16 maisons géomantiques, juges suprêmes et issues finales." },
    en: { title: "Advanced Geomancy (16 Houses)", desc: "In-depth analysis of the 16 geomantic houses, supreme judges, and ultimate outcomes." },
    ha: { title: "Zurfin Ilimin Ramli (Gidaje 16)", desc: "Cikakken bayani kan gidajen ramli 16 da fitar da alkalanci na karshe." }
  },
  "comparative-traditions": {
    fr: { title: "Traditions Comparées d'Orient & Maghreb", desc: "Pont mystique entre les écoles hermétiques orientales et les maîtres du Maghreb." },
    en: { title: "Comparative Eastern & Maghrebi Traditions", desc: "Esoteric bridge connecting Eastern hermetic schools with Maghrebi masters." },
    ha: { title: "Bambancin Hanyoyin Gabas da Magrib", desc: "Kwatanta hanyoyin ilimin asrar na Masar, Sham da kasashen Magrib." }
  },
  "lunar-cycles": {
    fr: { title: "Cycles Lunaires & Conjonctions", desc: "Surveillance en temps réel des phases lunaires, apogées et conjonctions sacrées." },
    en: { title: "Lunar Cycles & Conjunctions", desc: "Real-time surveillance of lunar phases, apogees, and sacred cosmic conjunctions." },
    ha: { title: "Zagayen Wata da Haduwar Taurari", desc: "Kula da sauye-sauyen hasken wata da haduwarsa da taurari a kowanne lokaci." }
  }
};

export const ToolsVideoSlider: React.FC<ToolsVideoSliderProps> = ({ className = "" }) => {
  const { language, t } = useLanguage();
  const { featureToggles } = useFeatures();
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  // Admin Feature Controls
  const isSliderEnabled = featureToggles?.tools_video_slider_enabled !== false;
  const autoplaySpeed = typeof featureToggles?.tools_slider_autoplay_speed === 'number' 
    ? featureToggles.tools_slider_autoplay_speed 
    : 6000; // 6 seconds default
  const isVideoBgActive = featureToggles?.tools_slider_video_bg !== false;
  const customVideoUrl = featureToggles?.tools_slider_custom_video_url || "";
  const filterSelection = featureToggles?.tools_slider_filter || "all"; // all, simple, advanced, popular
  const customTitle = featureToggles?.tools_slider_title || "";

  // Prepare tools list according to admin filter
  const filteredTools = useMemo(() => {
    let list = [...tools];
    if (filterSelection === "simple") {
      list = list.filter((t) => t.level === "simple");
    } else if (filterSelection === "advanced") {
      list = list.filter((t) => t.level === "advanced");
    } else if (filterSelection === "popular") {
      const popularIds = ["quran", "abjad", "tasbih", "daily-dhikr", "planetary", "asma", "99names", "dreams", "seals-catalogue", "advanced-raml-processing"];
      list = list.filter((t) => popularIds.includes(t.id));
    }
    return list.length > 0 ? list : tools;
  }, [filterSelection]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [savedTools, setSavedTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("asrarhub_saved_slider_tools");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (!isPlaying || isHovered || autoplaySpeed <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTools.length);
    }, autoplaySpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, autoplaySpeed, filteredTools.length]);

  // If slider is disabled by Admin, don't render
  if (!isSliderEnabled || filteredTools.length === 0) {
    return null;
  }

  const currentTool = filteredTools[currentIndex] || filteredTools[0];
  const videoTheme = VIDEO_PRESETS[currentIndex % VIDEO_PRESETS.length];
  const activeVideoUrl = customVideoUrl || videoTheme.videoUrl;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? filteredTools.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % filteredTools.length);
  };

  const toggleBookmark = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    setSavedTools((prev) => {
      const updated = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      try {
        localStorage.setItem("asrarhub_saved_slider_tools", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isSaved = savedTools.includes(currentTool.id);

  // Dynamic localized tool names & description
  const getToolTitle = (tool: ToolItem) => {
    const key = `tools.${tool.id}.title`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    const directTranslation = TOOL_TRANSLATIONS[tool.id]?.[language as 'fr' | 'en' | 'ha']?.title;
    if (directTranslation) return directTranslation;
    return tool.title;
  };

  const getToolDesc = (tool: ToolItem) => {
    const keyDesc = `tools.${tool.id}.description`;
    const keyShort = `tools.${tool.id}.desc`;
    const transDesc = t(keyDesc);
    if (transDesc && transDesc !== keyDesc) return transDesc;
    const transShort = t(keyShort);
    if (transShort && transShort !== keyShort) return transShort;
    const directTranslation = TOOL_TRANSLATIONS[tool.id]?.[language as 'fr' | 'en' | 'ha']?.desc;
    if (directTranslation) return directTranslation;
    return tool.description;
  };

  const getActionLabel = () => {
    if (language === 'fr') return "Ouvrir l'outil";
    if (language === 'ha') return "Buɗe Kayan Aiki";
    return "Launch Tool";
  };

  const getLevelLabel = (level: "simple" | "advanced") => {
    if (level === "advanced") {
      if (language === 'fr') return "Khassa / Avancé";
      if (language === 'ha') return "Khassa / Na Musamman";
      return "Khassa / Advanced";
    }
    if (language === 'fr') return "Essentiel";
    if (language === 'ha') return "Mai Muhimmanci";
    return "Essential";
  };

  const getSpecialBadge = (toolId: string) => {
    if (toolId === "quran") {
      return {
        icon: <BookOpen size={10} />,
        label: language === 'fr' ? "Coran Complet" : language === 'ha' ? "Cikakken Alkur'ani" : "Complete Quran",
        className: "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
      };
    }
    if (toolId === "dreams") {
      return {
        icon: <Wand2 size={10} />,
        label: language === 'fr' ? "IA Ibn Sirin" : language === 'ha' ? "Fassarar Mafarki AI" : "Ibn Sirin AI",
        className: "bg-purple-500/30 text-purple-200 border border-purple-400/40"
      };
    }
    if (toolId === "advanced-raml-processing") {
      return {
        icon: <Compass size={10} />,
        label: language === 'fr' ? "Sceau de Sable" : language === 'ha' ? "Hatimin Ƙasa (Raml)" : "Sand Seal (Raml)",
        className: "bg-yellow-500/30 text-yellow-200 border border-yellow-400/40"
      };
    }
    return null;
  };

  return (
    <section 
      id="tools-video-slider"
      className={`relative w-full mb-2 sm:mb-2.5 select-none pt-0.5 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Header / Bar */}
      <div className="flex items-center justify-between px-0.5 mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Wand2 size={15} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>{customTitle || (language === 'fr' ? "Outils Spirituels" : language === 'ha' ? "Kayan Aikin Asrar" : "Spiritual Tools")}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                {currentIndex + 1}/{filteredTools.length}
              </span>
            </h3>
          </div>
        </div>

        {/* Play/Pause & Arrow Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs transition-colors shadow-xs"
            title={
              isPlaying 
                ? (language === 'fr' ? "Mettre en pause le slider" : language === 'ha' ? "Dakata da slider" : "Pause auto-slide")
                : (language === 'fr' ? "Reprendre la lecture automatique" : language === 'ha' ? "Ci gaba da tafiyar slider" : "Resume auto-slide")
            }
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors shadow-xs"
            aria-label={language === 'fr' ? "Outil précédent" : language === 'ha' ? "Kayan aiki na baya" : "Previous tool"}
            title={language === 'fr' ? "Outil précédent" : language === 'ha' ? "Kayan aiki na baya" : "Previous tool"}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={handleNext}
            className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors shadow-xs"
            aria-label={language === 'fr' ? "Outil suivant" : language === 'ha' ? "Kayan aiki na gaba" : "Next tool"}
            title={language === 'fr' ? "Outil suivant" : language === 'ha' ? "Kayan aiki na gaba" : "Next tool"}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Video Slider Card with Gesture Dragging */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-gray-200/80 dark:border-gray-800 bg-gray-950 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between">
        
        {/* Looping Background Video */}
        {isVideoBgActive && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              key={activeVideoUrl}
              src={activeVideoUrl}
              poster={videoTheme.poster}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center opacity-45 sm:opacity-55 filter brightness-90 saturate-125 scale-105 transition-all duration-700"
            />
          </div>
        )}

        {/* Ambient Animated Gradient Overlays & Fallback Canvas Atmosphere */}
        <div className={`absolute inset-0 z-[1] bg-gradient-to-r ${videoTheme.gradient} backdrop-blur-[2px] transition-all duration-700`} />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

        {/* Animated Particles & Glow Lights */}
        <div className="absolute top-[-30%] -right-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-30%] -left-10 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" />

        {/* Slide Content with Motion Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool.id}
            initial={{ opacity: 0, x: 25, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -25, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 p-4 sm:p-5 flex flex-col justify-between flex-1"
          >
            {/* Top Bar: Tool Tag + Level Badge + Bookmark Button */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xs">
                  <Sparkles size={11} className="text-amber-300 animate-spin" />
                  <span className={currentTool.level === "advanced" ? "text-amber-300" : "text-emerald-300"}>
                    {getLevelLabel(currentTool.level)}
                  </span>
                </span>

                {(() => {
                  const specialBadge = getSpecialBadge(currentTool.id);
                  if (!specialBadge) return null;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${specialBadge.className}`}>
                      {specialBadge.icon} {specialBadge.label}
                    </span>
                  );
                })()}
              </div>

              {/* Bookmark Toggle */}
              <button
                onClick={(e) => toggleBookmark(e, currentTool.id)}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all border ${
                  isSaved
                    ? "bg-amber-500 text-white border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                    : "bg-black/30 text-white/70 hover:text-white border-white/15 hover:bg-black/50"
                }`}
                title={
                  isSaved 
                    ? (language === 'fr' ? "Retirer des favoris" : language === 'ha' ? "Cire daga wanda aka fi so" : "Remove from favorites")
                    : (language === 'fr' ? "Ajouter aux favoris" : language === 'ha' ? "Ajiye a matsayin wanda aka fi so" : "Add to favorites")
                }
              >
                <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
              </button>
            </div>

            {/* Middle Section: Icon + Title + Description */}
            <div className="flex items-start gap-3.5 my-auto">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${currentTool.color} p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center border border-white/30`}
              >
                <div className="w-full h-full rounded-[14px] bg-black/25 flex items-center justify-center text-white backdrop-blur-xs">
                  {React.createElement(currentTool.icon, { size: 24, className: "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" })}
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight drop-shadow-sm flex items-center gap-1.5 truncate">
                  {getToolTitle(currentTool)}
                </h4>
                <p className="text-xs sm:text-sm text-gray-200/90 mt-1 line-clamp-2 leading-relaxed">
                  {getToolDesc(currentTool)}
                </p>
              </div>
            </div>

            {/* Bottom Row: Direct Action Button */}
            <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-white/10">
              <div className="flex items-center gap-1 text-[11px] text-gray-300 font-medium hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {language === 'fr' ? "Interactif & Rapide" : language === 'ha' ? "Mai Sauri da Sauƙi" : "Interactive & Fast"}
                </span>
              </div>

              {/* Direct Open Button */}
              <Link
                to={currentTool.path}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 hover:shadow-emerald-500/25 transition-all transform active:scale-95 border border-emerald-400/40 group"
              >
                <span>{getActionLabel()}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Pagination Dots & Progress Bar */}
        <div className="relative z-10 px-4 pb-2.5 pt-1 flex items-center justify-center gap-1.5">
          {filteredTools.slice(0, Math.min(filteredTools.length, 12)).map((tool, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={tool.id ? `slider-dot-${tool.id}-${idx}` : `slider-dot-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-6 h-1.5 bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={
                  language === 'fr'
                    ? `Aller à l'outil ${getToolTitle(tool)}`
                    : language === 'ha'
                    ? `Je zuwa ${getToolTitle(tool)}`
                    : `Go to ${getToolTitle(tool)}`
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
