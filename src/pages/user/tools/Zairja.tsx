import React, { useState, useEffect, useRef } from 'react';
import { 
  Hexagon, ArrowLeft, Send, Download, Sparkles, BookOpen, Check, Copy, Volume2, VolumeX, 
  Compass, Music, Feather, Calendar, Clock, MapPin, Orbit, ShieldCheck, Flame, 
  Wind, Droplets, Mountain, RefreshCw, Eye, Layers, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';

interface ZairjaOracleResult {
  arabicVerse: string;
  translation: string;
  interpretation: string;
  astrologicalDiagnosis?: string;
  recommendedDhikr: string;
  spiritualPrescription?: string;
  numericString: string;
  maqam?: string;
  qutbDegree?: number;
  elementDominance?: string;
  burujDegrees?: Array<{ degree: number; sign: string; signAr: string; element: string; letter: string }>;
  taksirMatrix?: string[][];
  elementalCounts?: { fire: number; earth: number; air: number; water: number };
}

const BURUJ_LIST = [
  { sign: "Bélier", signAr: "الحمل", element: "Feu", elementAr: "نار", ruler: "Mars" },
  { sign: "Taureau", signAr: "الثور", element: "Terre", elementAr: "تراب", ruler: "Vénus" },
  { sign: "Gémeaux", signAr: "الجوزاء", element: "Air", elementAr: "هواء", ruler: "Mercure" },
  { sign: "Cancer", signAr: "السرطان", element: "Eau", elementAr: "ماء", ruler: "Lune" },
  { sign: "Lion", signAr: "الأسد", element: "Feu", elementAr: "نار", ruler: "Soleil" },
  { sign: "Vierge", signAr: "العذراء", element: "Terre", elementAr: "تراب", ruler: "Mercure" },
  { sign: "Balance", signAr: "الميزان", element: "Air", elementAr: "هواء", ruler: "Vénus" },
  { sign: "Scorpion", signAr: "العقرب", element: "Eau", elementAr: "ماء", ruler: "Mars" },
  { sign: "Sagittaire", signAr: "القوس", element: "Feu", elementAr: "نار", ruler: "Jupiter" },
  { sign: "Capricorne", signAr: "الجدي", element: "Terre", elementAr: "تراب", ruler: "Saturne" },
  { sign: "Verseau", signAr: "الدلو", element: "Air", elementAr: "هواء", ruler: "Saturne" },
  { sign: "Poissons", signAr: "الحوت", element: "Eau", elementAr: "ماء", ruler: "Jupiter" }
];

const zairjaI18n = {
  fr: {
    title: "Le Système de Consultation Zairja Traditionnelle",
    badge: "Matrice d'Ibn Khaldoun & Al-Sabti",
    desc: "Algorithme astro-arithmologique complet associant la Niyyah, la date, l'heure, l'ascendant (Tālí') et les 4 éléments pour générer l'oracle codé.",
    questionLabel: "Question Sacrée / Niyyah du Consultant",
    promptPlaceholder: "Ex: Quel est le sens spirituel et l'issue de mon projet actuel ?",
    birthDateLabel: "Date de Naissance ou de Consultation",
    birthTimeLabel: "Heure de Naissance ou de Consultation",
    ascendantLabel: "Ascendant Céleste (Tāli' / الطالع)",
    autoAscendant: "Calculer automatiquement selon l'heure",
    locationLabel: "Ville / Coordonnées Célestes",
    locationPlaceholder: "Ex: Fès, Tombouctou, Paris, Le Caire, Dakar...",
    calculateBtn: "Déployer la Za'irja Traditionnelle",
    decomposing: "Génération de la Matrice de Taksīr & Cercle des 28 Lettres...",
    taksirTitle: "Table du Taksīr & Décomposition des Lettres (Bast al-Hurūf)",
    elementalTitle: "Équilibre des 4 Éléments Primordiaux (Ṭabāyi')",
    fire: "Feu (Nār)",
    earth: "Terre (Turāb)",
    air: "Air (Hawā')",
    water: "Eau (Mā')",
    qutbLabel: "Degré du Pôle Céleste (Qutb)",
    numericChord: "Corde Numérique Extraite (Al-Watar al-Raqamī)",
    poemTitle: "Poème Répondeur de la Za'irja (Qasida & Bayt)",
    exegeticalTitle: "Exégèse & Discernement Spirituel (Sharh) :",
    astroDiagnosisTitle: "Diagnostic Astro-Céleste :",
    prescriptionTitle: "Prescription & Remède Spirituel (Sadaqa & Moment) :",
    dhikrTitle: "Dhikr d'Activation Numérique :",
    degreesTitle: "Décomposition en 12 Degrés Zodiacaux (Dā'irat al-Burūj)",
    degreesDesc: "Harmonisation des lettres avec les 12 maisons célestes et leurs planètes souveraines :",
    maqamTitle: "Synthétiseur des Fréquences Maqām Spirituel",
    maqamDesc: "Vibration harmonique accordée selon le Maqām céleste de votre oracle :",
    playMaqam: "Écouter le Maqām",
    stopMaqam: "Arrêter l'Audio",
    saveImage: "Télécharger PNG HD",
    parchmentBtn: "Télécharger Parchemin",
    copyBtn: "Copier le Compte-Rendu",
    copied: "Copié avec succès !"
  },
  en: {
    title: "Traditional Zairja Consultation System",
    badge: "Ibn Khaldun & Al-Sabti Matrix",
    desc: "Complete astro-arithmological algorithm combining Niyyah, date, time, ascendant (Tāli') and the 4 elements to generate the coded oracle.",
    questionLabel: "Sacred Question / Consultant Niyyah",
    promptPlaceholder: "E.g.: What is the spiritual meaning and outcome of my current path?",
    birthDateLabel: "Birth or Consultation Date",
    birthTimeLabel: "Birth or Consultation Time",
    ascendantLabel: "Celestial Ascendant (Tāli' / الطالع)",
    autoAscendant: "Calculate automatically by time",
    locationLabel: "City / Celestial Coordinates",
    locationPlaceholder: "E.g.: Fez, Timbuktu, London, Cairo, New York...",
    calculateBtn: "Deploy Traditional Za'irja",
    decomposing: "Generating Taksīr Matrix & 28-Letter Circle...",
    taksirTitle: "Taksīr Matrix & Letter Breakdown (Bast al-Hurūf)",
    elementalTitle: "Equilibrium of the 4 Primordial Elements (Ṭabāyi')",
    fire: "Fire (Nār)",
    earth: "Earth (Turāb)",
    air: "Air (Hawā')",
    water: "Water (Mā')",
    qutbLabel: "Celestial Pole Degree (Qutb)",
    numericChord: "Extracted Numeric Cord (Al-Watar al-Raqamī)",
    poemTitle: "Answering Poem of the Za'irja (Qasida & Bayt)",
    exegeticalTitle: "Spiritual Exegesis & Discernment (Sharh):",
    astroDiagnosisTitle: "Astro-Celestial Diagnosis:",
    prescriptionTitle: "Spiritual Prescription & Remedy (Sadaqa & Timing):",
    dhikrTitle: "Numerical Activation Dhikr:",
    degreesTitle: "12 Zodiac Degrees Breakdown (Dā'irat al-Burūj)",
    degreesDesc: "Harmonization of letters with the 12 celestial houses and sovereign rulers:",
    maqamTitle: "Spiritual Maqām Frequency Synthesizer",
    maqamDesc: "Harmonic drone tuned to the celestial Maqām of your oracle:",
    playMaqam: "Play Maqām Drone",
    stopMaqam: "Stop Audio",
    saveImage: "Download HD PNG",
    parchmentBtn: "Download Parchment",
    copyBtn: "Copy Consultation",
    copied: "Copied successfully!"
  },
  ha: {
    title: "Tsarin Duban Za'irja Na Gargajiya",
    badge: "Taswirar Ibn Khaldun & Al-Sabti",
    desc: "Cikakken tsarin lissafin asiri da ke haɗa Niyya, kwanan wata, lokaci, Buruj na sama (Tāli') da sinadarai 4 don fitar da amsar ruhi.",
    questionLabel: "Tambaya Mai Alfarma / Niyyar Mai Neman Shawara",
    promptPlaceholder: "Misali: Menene makomar wannan aiki nawa a fannin ruhi?",
    birthDateLabel: "Ranar Haihuwa ko Ranar Duba",
    birthTimeLabel: "Lokacin Haihuwa ko Lokacin Duba",
    ascendantLabel: "Buruj na Sama (Tāli' / الطالع)",
    autoAscendant: "Lissafa ta atomatik bisa lokaci",
    locationLabel: "Gari / Wurin Da Ake Ciki",
    locationPlaceholder: "Misali: Kano, Niamey, Makka, Alkahira, Paris...",
    calculateBtn: "Fara Duban Za'irja",
    decomposing: "Ana sarrafa haruffa 28 da Taswirar Taksir...",
    taksirTitle: "Taswirar Taksir da Raba Haruffa (Bast al-Hurūf)",
    elementalTitle: "Sinadarai 4 na Halitta (Ṭabāyi')",
    fire: "Wuta (Nār)",
    earth: "Kasa (Turāb)",
    air: "Iska (Hawā')",
    water: "Ruwa (Mā')",
    qutbLabel: "Matakin Qutb na Sama",
    numericChord: "Tsarin Lambobi Na Za'irja (Al-Watar al-Raqamī)",
    poemTitle: "Waƙar Amsa Ta Za'irja (Qasida & Bayt)",
    exegeticalTitle: "Tafsiri da Shiriyar Ruhi (Sharh):",
    astroDiagnosisTitle: "Binciken Taurari da Lokaci:",
    prescriptionTitle: "Magani da Sadakar Da Ake Bada Shawara:",
    dhikrTitle: "Zikirin Lambobi na Za'irja:",
    degreesTitle: "Rarrabawa Zuwa Buruj 12 (Dā'irat al-Burūj)",
    degreesDesc: "Haɗa haruffa da gidajen sama 12 tare da taurarin da ke mulki:",
    maqamTitle: "Sauti Mai Natsuwa na Maqām",
    maqamDesc: "Sautin amsawa na musamman da aka daidaita da Maqām na Za'irja:",
    playMaqam: "Saurari Sauti",
    stopMaqam: "Tsai da Sauti",
    saveImage: "Zazzage Hoto PNG",
    parchmentBtn: "Zazzage Parchemin",
    copyBtn: "Kwafi Bayanin",
    copied: "An kwafa cikin nasara!"
  }
};

// Elemental letter classification in classical Ilm al-Huruf
const ELEMENTAL_LETTERS = {
  fire: ['ا', 'ه', 'ط', 'م', 'ف', 'ش', 'ذ'],
  earth: ['ب', 'و', 'ي', 'ن', 'ص', 'ت', 'ض'],
  air: ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'],
  water: ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ']
};

export const Zairja: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const txt = zairjaI18n[langKey] || zairjaI18n.fr;

  // Form states
  const [question, setQuestion] = useState('');
  const [birthDate, setBirthDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [birthTime, setBirthTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [ascendantSign, setAscendantSign] = useState<string>('Bélier');
  const [isAutoAscendant, setIsAutoAscendant] = useState<boolean>(true);
  const [location, setLocation] = useState('Fès / Al-Quds');

  // Calculation & Output states
  const [isProcessing, setIsProcessing] = useState(false);
  const [answer, setAnswer] = useState<ZairjaOracleResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Maqam Audio Synth
  const [isPlayingMaqam, setIsPlayingMaqam] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Scramble animation
  const [scrambleText, setScrambleText] = useState('');

  // Auto calculate ascendant sign based on hour if enabled
  useEffect(() => {
    if (isAutoAscendant && birthTime) {
      const [h] = birthTime.split(':').map(Number);
      // Rough 2-hour per zodiac sign approximation from sunrise (approx 6am = Aries)
      const offset = Math.floor(((h >= 6 ? h - 6 : h + 18) / 2)) % 12;
      setAscendantSign(BURUJ_LIST[offset].sign);
    }
  }, [birthTime, isAutoAscendant]);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      const chars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
      interval = setInterval(() => {
        let fake = '';
        for (let i = 0; i < 24; i++) fake += chars[Math.floor(Math.random() * chars.length)] + ' ';
        setScrambleText(fake);
      }, 50);
    } else {
      setScrambleText('');
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playMaqamFrequency = () => {
    if (isPlayingMaqam) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsPlayingMaqam(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Base frequencies corresponding to spiritual Maqamat
      const maqamName = answer?.maqam || 'Rast';
      let baseFreq = 220; // Default A3
      if (maqamName === 'Bayati') baseFreq = 220;
      else if (maqamName === 'Hijaz') baseFreq = 246.94;
      else if (maqamName === 'Saba') baseFreq = 233.08;
      else if (maqamName === 'Sika') baseFreq = 250.0;
      else if (maqamName === 'Rast') baseFreq = 261.63; // C4

      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 1.25, baseFreq * 0.75];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.06 / (idx + 1), ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });

      setIsPlayingMaqam(true);
    } catch (err) {
      console.error('Audio synthesis failed:', err);
    }
  };

  const processZairja = async () => {
    if (!question || question.length < 3) return;

    setIsProcessing(true);
    setAnswer(null);

    // Compute traditional values
    const fullText = `${question} ${birthDate} ${birthTime} ${ascendantSign} ${location}`;
    const abjadSum = calculateAbjadValue(fullText);

    // Elemental letter frequency calculation
    const letters = fullText.replace(/[^a-zA-Z\u0600-\u06FF]/g, '').toLowerCase();
    let fireCount = 1;
    let earthCount = 1;
    let airCount = 1;
    let waterCount = 1;

    for (const char of letters) {
      if (ELEMENTAL_LETTERS.fire.includes(char)) fireCount++;
      else if (ELEMENTAL_LETTERS.earth.includes(char)) earthCount++;
      else if (ELEMENTAL_LETTERS.air.includes(char)) airCount++;
      else if (ELEMENTAL_LETTERS.water.includes(char)) waterCount++;
      else {
        // Distribute latin letters deterministically
        const code = char.charCodeAt(0);
        if (code % 4 === 0) fireCount++;
        else if (code % 4 === 1) earthCount++;
        else if (code % 4 === 2) airCount++;
        else waterCount++;
      }
    }

    const elementalCounts = { fire: fireCount, earth: earthCount, air: airCount, water: waterCount };
    const elementsArray = [
      { name: 'Feu / Nār', val: fireCount },
      { name: 'Terre / Turāb', val: earthCount },
      { name: 'Air / Hawā’', val: airCount },
      { name: 'Eau / Mā’', val: waterCount }
    ].sort((a, b) => b.val - a.val);
    const elementDominance = elementsArray[0].name;

    // Calculate Qutb Degree
    const qutbDegree = (abjadSum % 360) + 1;

    // 12 Zodiac Degrees breakdown
    const cleanLetters = (question + 'ابجد').replace(/[^a-zA-Z\u0600-\u06FF]/g, '');
    const burujDegrees = BURUJ_LIST.map((b, idx) => ({
      degree: ((abjadSum + idx * 30 + (b.sign === ascendantSign ? 15 : 0)) % 360) + 1,
      sign: b.sign,
      signAr: b.signAr,
      element: b.element,
      letter: cleanLetters[idx % cleanLetters.length] || 'ا'
    }));

    // Taksir Matrix (4x4 or 3x3 letter permutation)
    const seedLetters = (question.replace(/\s+/g, '') + 'سرالحكمةالالهية').slice(0, 16).split('');
    const taksirMatrix: string[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: string[] = [];
      for (let c = 0; c < 4; c++) {
        row.push(seedLetters[(r * 4 + c) % seedLetters.length] || 'ن');
      }
      taksirMatrix.push(row);
    }

    const maqams = ['Rast', 'Bayati', 'Hijaz', 'Saba', 'Sika', 'Nahawand'];
    const chosenMaqam = maqams[abjadSum % maqams.length];

    try {
      const response = await fetch('/api/zairja/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question, 
          abjadSum, 
          language,
          birthDate,
          birthTime,
          ascendant: ascendantSign,
          location,
          elementDominance,
          qutbDegree
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer({ 
          ...data, 
          burujDegrees, 
          maqam: chosenMaqam,
          qutbDegree,
          elementDominance,
          elementalCounts,
          taksirMatrix
        });
      } else {
        throw new Error("Offline fallback");
      }
    } catch (error) {
      setTimeout(() => {
        const fallbackResults = [
          {
            arabicVerse: "فَصْبِرْ صَبْرًا جَمِيلًا إِنَّ مَعَ الْعُسْرِ يُسْرًا\nوَإِنَّ نُورَ الْحَقِّ يُبْدِي مَا كَانَ سِرًّا",
            translation: langKey === 'en' 
              ? "Be patient with noble perseverance, for ease indeed accompanies hardship, and the divine light unveils what was concealed."
              : langKey === 'ha'
              ? "Ka yi kyakkyawan haƙuri, lallai tare da tsanani akwai sauƙi, kuma hasken gaskiya zai bayyana abin da yake a ɓoye."
              : "Patientez d'une belle constance, car après l'épreuve surgit la délivrance, et la lumière de vérité dévoile tout mystère caché.",
            interpretation: langKey === 'en'
              ? `The Za'irja reveals that your ascendant (${ascendantSign}) is harmonizing with the ${elementDominance} element. The current barrier is a spiritual crucible preparing a lasting opening.`
              : langKey === 'ha'
              ? `Za'irja ta nuna cewa Buruj ɗinka (${ascendantSign}) yana tafiya daidai da sinadarin ${elementDominance}. Wannan jinkirin yana share fagen babban alheri ne.`
              : `La Za'irja indique que l'ascendant (${ascendantSign}) et la dominante (${elementDominance}) sont en conjonction bénéfique. Le blocage apparent n'est qu'un voile passager avant une expansion durable.`,
            astrologicalDiagnosis: `Degré du Pôle fixé à ${qutbDegree}°. L'ascendant ${ascendantSign} gouverné par les influx célestes assure la victoire si la discrétion est maintenue.`,
            recommendedDhikr: "يَا فَتَّاحُ يَا عَلِيمُ (489 fois)",
            spiritualPrescription: "Offrez une aumône blanche (pain ou lait) un jeudi matin, et récitez la sourate Al-Inshirah 7 fois à l'aube.",
            numericString: `${abjadSum} - ${qutbDegree} - 786 - 489 - 129 - 66`
          }
        ];

        const selected = fallbackResults[abjadSum % fallbackResults.length];
        setAnswer({ 
          ...selected, 
          burujDegrees, 
          maqam: chosenMaqam,
          qutbDegree,
          elementDominance,
          elementalCounts,
          taksirMatrix
        });
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#09090b', skipFonts: true });
      await downloadCanvasImage(canvas, 'zairja-consultation-asrarhub.png');
    } catch (e) {
      console.error(e);
    }
  };

  const downloadParchmentImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { 
        backgroundColor: '#fef3c7', 
        skipFonts: true,
        style: {
          backgroundColor: '#fef3c7',
          color: '#451a03',
          border: '4px solid #b45309',
          borderRadius: '24px',
        }
      });
      await downloadCanvasImage(canvas, 'zairja-parchemin-sacree.png');
    } catch (e) {
      console.error(e);
    }
  };

  const copyResultText = () => {
    if (disableDuaCopy || !answer) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const text = `=== LE SYSTÈME DE CONSULTATION ZAIRJA TRADITIONNELLE ===
Question : "${question}"
Date & Heure : ${birthDate} à ${birthTime} | Ascendant : ${ascendantSign} | Ville : ${location}
Degré du Pôle (Qutb) : ${answer.qutbDegree}° | Élément Dominant : ${answer.elementDominance}

Poème Sacré Répondeur (Bayt / Qasida) :
${answer.arabicVerse}

Traduction :
« ${answer.translation} »

Exégèse & Discernement (Sharh) :
${answer.interpretation}

Diagnostic Astro-Céleste :
${answer.astrologicalDiagnosis || 'Alignement harmonieux'}

Prescription Spirituelle & Sadaqa :
${answer.spiritualPrescription || 'Aumône et méditation matinale'}

Dhikr d'Activation : ${answer.recommendedDhikr}
Corde Numérique Sacrée : ${answer.numericString}
=====================================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2.5 -ml-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider mb-1">
            <Orbit size={13} className="text-purple-500" />
            <span>{txt.badge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Hexagon className="text-purple-600 dark:text-purple-400 fill-purple-500/20" />
            {txt.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {txt.desc}
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-7 shadow-lg border border-zinc-200/80 dark:border-zinc-800 relative z-10 mb-8 backdrop-blur-sm">
        <div className="space-y-4">
          {/* Question */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-500" />
              <span>{txt.questionLabel}</span>
            </label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={txt.promptPlaceholder}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-sm sm:text-base text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium transition-all resize-none shadow-inner"
              disabled={isProcessing}
            />
          </div>

          {/* Biographical & Astrological Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            {/* Birth/Consultation Date */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={13} className="text-purple-500" />
                <span>{txt.birthDateLabel}</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Birth/Consultation Time */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock size={13} className="text-purple-500" />
                <span>{txt.birthTimeLabel}</span>
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Ascendant Zodiac Sign (Tali') */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Compass size={13} className="text-amber-500" />
                <span>{txt.ascendantLabel}</span>
              </label>
              <select
                value={ascendantSign}
                onChange={(e) => {
                  setAscendantSign(e.target.value);
                  setIsAutoAscendant(false);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {BURUJ_LIST.map((b) => (
                  <option key={b.sign} value={b.sign}>
                    {b.sign} ({b.signAr}) - {b.element}
                  </option>
                ))}
              </select>
            </div>

            {/* Location / Coordinates */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin size={13} className="text-emerald-500" />
                <span>{txt.locationLabel}</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={txt.locationPlaceholder}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={processZairja}
            disabled={isProcessing || question.length < 3}
            className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-amber-700 hover:from-purple-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                  <Hexagon size={20} />
                </motion.div>
                <span>{txt.decomposing}</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>{txt.calculateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ToolInfoTooltip toolId="zairja" />

      {/* Animation & Results Section */}
      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 text-center bg-zinc-950 rounded-3xl p-8 sm:p-10 border border-purple-900/50 shadow-2xl overflow-hidden relative"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-amber-400 mb-6">
              <RefreshCw size={14} className="animate-spin text-purple-400" />
              <span>{txt.decomposing}</span>
            </div>
            <div className="font-arabic text-3xl sm:text-5xl text-purple-400/90 tracking-widest break-all leading-relaxed font-bold select-none drop-shadow" dir="rtl">
              {scrambleText}
            </div>
          </motion.div>
        )}

        {answer && !isProcessing && (
          <motion.div 
            key="answer"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-6"
          >
            <div 
              ref={resultRef} 
              className="bg-zinc-950 rounded-3xl p-5 sm:p-8 border-2 border-purple-800/50 text-center shadow-2xl w-full text-white space-y-6 relative overflow-hidden"
            >
              {/* Header Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-black tracking-wider uppercase">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>AsrarHub • Za'irja Traditionnelle</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {txt.qutbLabel}: <strong className="text-amber-400">{answer.qutbDegree}°</strong> | {answer.elementDominance}
                </div>
              </div>

              {/* Numeric Cord */}
              <div className="bg-zinc-900/90 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">
                  {txt.numericChord}
                </span>
                <p className="font-mono text-sm sm:text-base tracking-[0.25em] text-amber-300 font-bold">
                  {answer.numericString}
                </p>
              </div>

              {/* Arabic Rhyming Poem (Qasida / Bayt) */}
              <div className="bg-gradient-to-b from-purple-950/60 to-zinc-900 p-6 sm:p-8 rounded-3xl border border-purple-600/40 shadow-inner relative space-y-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block flex items-center justify-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  {txt.poemTitle}
                </span>
                <p className="text-2xl sm:text-4xl font-arabic text-amber-100 leading-loose font-bold whitespace-pre-line drop-shadow-md" dir="rtl">
                  {answer.arabicVerse}
                </p>
              </div>

              {/* Translation */}
              <div className="bg-zinc-900/60 p-4 rounded-2xl border-l-4 border-purple-500 text-left">
                <p className="text-base sm:text-lg font-serif text-zinc-200 italic leading-relaxed">
                  « {answer.translation} »
                </p>
              </div>

              {/* Exegesis (Sharh) & Astro Diagnosis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Spiritual Exegesis */}
                <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-purple-900/40 space-y-2">
                  <strong className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <BookOpen size={15} className="text-purple-400" /> 
                    {txt.exegeticalTitle}
                  </strong>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {answer.interpretation}
                  </p>
                </div>

                {/* Astro Diagnosis & Prescription */}
                <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-amber-900/40 space-y-3">
                  <div>
                    <strong className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1">
                      <Compass size={15} className="text-amber-400" /> 
                      {txt.astroDiagnosisTitle}
                    </strong>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {answer.astrologicalDiagnosis || `Alignement avec l'ascendant ${ascendantSign} et résonance élémentaire.`}
                    </p>
                  </div>
                  {answer.spiritualPrescription && (
                    <div className="pt-2 border-t border-zinc-800">
                      <strong className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={15} className="text-emerald-400" />
                        {txt.prescriptionTitle}
                      </strong>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {answer.spiritualPrescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dhikr d'Activation */}
              <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl text-amber-200 text-sm font-bold flex items-center justify-center gap-2">
                <Sparkles size={16} className="text-amber-400 shrink-0" />
                <span>{txt.dhikrTitle} <span className="text-white underline decoration-amber-500">{answer.recommendedDhikr}</span></span>
              </div>

              {/* 4 Elements Balance Visualizer */}
              {answer.elementalCounts && (
                <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 text-left space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block flex items-center gap-1.5">
                    <Layers size={14} className="text-purple-400" />
                    {txt.elementalTitle}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-red-950/40 border border-red-800/40 p-2.5 rounded-xl flex items-center gap-2">
                      <Flame size={18} className="text-red-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-400 block">{txt.fire}</span>
                        <span className="text-xs font-bold text-red-300">{answer.elementalCounts.fire} pts</span>
                      </div>
                    </div>
                    <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl flex items-center gap-2">
                      <Mountain size={18} className="text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-400 block">{txt.earth}</span>
                        <span className="text-xs font-bold text-amber-300">{answer.elementalCounts.earth} pts</span>
                      </div>
                    </div>
                    <div className="bg-cyan-950/40 border border-cyan-800/40 p-2.5 rounded-xl flex items-center gap-2">
                      <Wind size={18} className="text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-400 block">{txt.air}</span>
                        <span className="text-xs font-bold text-cyan-300">{answer.elementalCounts.air} pts</span>
                      </div>
                    </div>
                    <div className="bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl flex items-center gap-2">
                      <Droplets size={18} className="text-blue-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-zinc-400 block">{txt.water}</span>
                        <span className="text-xs font-bold text-blue-300">{answer.elementalCounts.water} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 12 Zodiac Degrees Table */}
              {answer.burujDegrees && (
                <div className="text-left bg-zinc-950/90 border border-purple-900/40 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Compass className="w-4 h-4 text-purple-400" />
                    {txt.degreesTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{txt.degreesDesc}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                    {answer.burujDegrees.map((d, i) => (
                      <div key={i} className={`p-2.5 rounded-xl text-center border ${
                        d.sign === ascendantSign 
                          ? 'bg-purple-900/40 border-purple-500 text-purple-100 shadow-md ring-1 ring-purple-400/50' 
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-amber-400 font-bold">{d.degree}°</span>
                          <span className="text-[9px] text-zinc-400 uppercase">{d.element}</span>
                        </div>
                        <span className="font-arabic text-sm text-white font-bold block" dir="rtl">{d.signAr}</span>
                        <span className="text-[10px] text-zinc-400 block">{d.sign}</span>
                        <span className="text-xs font-mono font-bold text-purple-300 mt-1 block">« {d.letter} »</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maqam Acoustic Synthesizer Section */}
              <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-2xl text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-400" />
                    {txt.maqamTitle} ({answer.maqam || 'Rast'})
                  </h4>
                  <p className="text-[11px] text-zinc-300">{txt.maqamDesc}</p>
                </div>
                <button
                  onClick={playMaqamFrequency}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md ${
                    isPlayingMaqam 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                  }`}
                >
                  {isPlayingMaqam ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingMaqam ? txt.stopMaqam : txt.playMaqam}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button 
                onClick={downloadImage} 
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer"
              >
                <Download size={16} className="text-emerald-400" />
                <span>{txt.saveImage}</span>
              </button>
              <button 
                onClick={downloadParchmentImage} 
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer"
              >
                <Feather size={16} />
                <span>{txt.parchmentBtn}</span>
              </button>
              {!disableDuaCopy && (
                <button 
                  onClick={copyResultText} 
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer"
                >
                  {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                  <span>{copied ? txt.copied : txt.copyBtn}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Zairja;
