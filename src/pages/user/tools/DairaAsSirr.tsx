import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Download, Feather, Flame, Gem } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateAbjadValue } from '../../../utils/abjad';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const ABJAD_LETTERS_28 = [
  'أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'
];

const ANGELS = ['جبرائيل', 'ميكائيل', 'إسرافيل', 'عزرائيل'];

interface SevenKingInfo {
  dayId: string;
  dayFr: string; dayEn: string; dayHa: string;
  nameFr: string; nameEn: string; nameHa: string;
  metalFr: string; metalEn: string; metalHa: string;
  incenseFr: string; incenseEn: string; incenseHa: string;
  angel: string;
}

const SEVEN_KINGS: SevenKingInfo[] = [
  {
    dayId: 'sunday',
    dayFr: 'Dimanche', dayEn: 'Sunday', dayHa: 'Lahadi',
    nameFr: 'Al-Mudhib (المذهب)', nameEn: 'Al-Mudhib (المذهب)', nameHa: 'Al-Mudhib (المذهب)',
    metalFr: 'Or (Dhahab - 🟡)', metalEn: 'Gold (Dhahab - 🟡)', metalHa: 'Zinariya (Dhahab - 🟡)',
    incenseFr: 'Lubān Mâle & Safran', incenseEn: 'Male Frankincense & Saffron', incenseHa: 'Luban da Za\'afaran',
    angel: 'Ruqiyail'
  },
  {
    dayId: 'monday',
    dayFr: 'Lundi', dayEn: 'Monday', dayHa: 'Litinin',
    nameFr: 'Al-Abyad (الأبيض)', nameEn: 'Al-Abyad (الأبيض)', nameHa: 'Al-Abyad (الأبيض)',
    metalFr: 'Argent (Fiddah - ⚪)', metalEn: 'Silver (Fiddah - ⚪)', metalHa: 'Azurfa (Fiddah - ⚪)',
    incenseFr: 'Musc Blanc & Camphre', incenseEn: 'White Musk & Camphor', incenseHa: 'Farar Muski da Kafur',
    angel: 'Jibril'
  },
  {
    dayId: 'tuesday',
    dayFr: 'Mardi', dayEn: 'Tuesday', dayHa: 'Talata',
    nameFr: 'Al-Ahmar (الأحمر)', nameEn: 'Al-Ahmar (الأحمر)', nameHa: 'Al-Ahmar (الأحمر)',
    metalFr: 'Cuivre Rouge (Nuhas - 🔴)', metalEn: 'Red Copper (Nuhas - 🔴)', metalHa: 'Jajan Tagulla (Nuhas - 🔴)',
    incenseFr: 'Santal Rouge & Poivre', incenseEn: 'Red Sandalwood & Pepper', incenseHa: 'Jajan Sandal da Citta',
    angel: 'Samsamail'
  },
  {
    dayId: 'wednesday',
    dayFr: 'Mercredi', dayEn: 'Wednesday', dayHa: 'Laraba',
    nameFr: 'Barqān (برقان)', nameEn: 'Barqān (برقان)', nameHa: 'Barqān (برقان)',
    metalFr: 'Mercure / Étain (Qasdir - 🔵)', metalEn: 'Mercury / Tin (Qasdir - 🔵)', metalHa: 'Urfa / Tassai (Qasdir - 🔵)',
    incenseFr: 'Sandaraque & Mastic', incenseEn: 'Sandarac & Mastic', incenseHa: 'Sandarak da Mastic',
    angel: 'Mikail'
  },
  {
    dayId: 'thursday',
    dayFr: 'Jeudi', dayEn: 'Thursday', dayHa: 'Alhamis',
    nameFr: 'Shamhūrish (شمهورش)', nameEn: 'Shamhūrish (شمهورش)', nameHa: 'Shamhūrish (شمهورش)',
    metalFr: 'Étain / Laiton (Sufur - 🟠)', metalEn: 'Tin / Brass (Sufur - 🟠)', metalHa: 'Tassai / Tagulla (Sufur - 🟠)',
    incenseFr: 'Ambre Gris & Santal', incenseEn: 'Ambergris & Sandalwood', incenseHa: 'Ambar da Sandal',
    angel: 'Sarfiyail'
  },
  {
    dayId: 'friday',
    dayFr: 'Vendredi', dayEn: 'Friday', dayHa: 'Juma\'a',
    nameFr: 'Zouba\'ah (زوبعة)', nameEn: 'Zouba\'ah (زوبعة)', nameHa: 'Zouba\'ah (زوبعة)',
    metalFr: 'Cuivre / Bronze (🟢)', metalEn: 'Copper / Bronze (🟢)', metalHa: 'Tagulla / Bronze (🟢)',
    incenseFr: 'Mastic & Oud Blanc', incenseEn: 'Mastic & White Oud', incenseHa: 'Mastic da Farin Udi',
    angel: 'Aniyail'
  },
  {
    dayId: 'saturday',
    dayFr: 'Samedi', dayEn: 'Saturday', dayHa: 'Asabar',
    nameFr: 'Maymūn (ميمون)', nameEn: 'Maymūn (ميمون)', nameHa: 'Maymūn (ميمون)',
    metalFr: 'Plomb (Rasas - ⬛)', metalEn: 'Lead (Rasas - ⬛)', metalHa: 'Dalma (Rasas - ⬛)',
    incenseFr: 'Myrrhe & Soufre', incenseEn: 'Myrrh & Sulfur', incenseHa: 'Murru da Kibriya',
    angel: 'Kasfiyail'
  }
];

const dairaI18n = {
  fr: {
    title: "Dā'ira As-Sirr & Sceaux des 7 Rois Célestes",
    desc: "Moteur graphique interactif concentrique isolant les 28 lettres, 4 Archanges et les 7 Rois Célestes avec rappels d'incensement & métaux.",
    intentionLabel: "Intention / Nom Mystique",
    weightLabel: "Poids Abjad (Zimām)",
    themeLabel: "Thème Mystique",
    themeNames: { gold: "Or", emerald: "Émeraude", indigo: "Indigo", crimson: "Cramoisi" },
    rotationLabel: "Rotation 3D du Diagramme Concentrique",
    tiltLabel: "Inclinaison 3D (Perspective)",
    todayKingTitle: "Rappel d'Incensement & Métal Sacré du Jour",
    kingLabel: "Roi :",
    metalLabel: "Métal Dédié :",
    incenseLabel: "Encens Sacrés :",
    angelLabel: "Archange Régent :",
    exportParchment: "Exporter en Parchemin",
    downloadPng: "Télécharger PNG Sceau",
    diagramCaption: "✦ Dā'ira Al-Sirr & Sceau de Protection Concentrique ✦",
    parchmentTitle: "Dā'ira As-Sirr — Sceau Concentrique",
    parchmentSubtitle: "Sceau de protection de {name}",
    parchmentWeight: "Poids Zimām : {weight} | Khādim : {khadim}",
    parchmentNote: "\"Ce sceau concentrique regroupe la couronne des 28 lettres, des 4 archanges et des 7 Rois Célestes.\""
  },
  en: {
    title: "Dā'ira As-Sirr & Seals of the 7 Celestial Kings",
    desc: "Interactive concentric diagram isolating 28 letters, 4 Archangels, and 7 Celestial Kings with incense & metal reminders.",
    intentionLabel: "Intention / Mystical Name",
    weightLabel: "Abjad Weight (Zimām)",
    themeLabel: "Mystic Theme",
    themeNames: { gold: "Gold", emerald: "Emerald", indigo: "Indigo", crimson: "Crimson" },
    rotationLabel: "3D Rotation of Concentric Diagram",
    tiltLabel: "3D Perspective Tilt",
    todayKingTitle: "Today's Incense & Sacred Metal Reminder",
    kingLabel: "King:",
    metalLabel: "Dedicated Metal:",
    incenseLabel: "Sacred Incense:",
    angelLabel: "Regent Archangel:",
    exportParchment: "Export as Parchment",
    downloadPng: "Download Seal PNG",
    diagramCaption: "✦ Dā'ira Al-Sirr & Concentric Protection Seal ✦",
    parchmentTitle: "Dā'ira As-Sirr — Circular Seal",
    parchmentSubtitle: "Protection seal for {name}",
    parchmentWeight: "Zimām Weight: {weight} | Khādim: {khadim}",
    parchmentNote: "\"This concentric seal gathers the crown of the 28 letters, 4 archangels, and 7 Celestial Kings.\""
  },
  ha: {
    title: "Dā'ira As-Sirr & Khatimin Sarakuna 7 na Sama",
    desc: "Moteur mai motsi 3D don keɓance haruffa 28, Mala'iku 4 da Sarakuna 7 tare da tunatarwar turaren wuta da karfe.",
    intentionLabel: "Niyya ko Suna",
    weightLabel: "Lambar Abjad (Zimām)",
    themeLabel: "Launin Dā'ira",
    themeNames: { gold: "Gold", emerald: "Emerald", indigo: "Indigo", crimson: "Crimson" },
    rotationLabel: "Juyin Kewaye 3D",
    tiltLabel: "Kishiyar Tattara 3D",
    todayKingTitle: "Turaren Wuta & Karfen Yau",
    kingLabel: "Sarki:",
    metalLabel: "Karfen Ranar:",
    incenseLabel: "Turaren Wuta:",
    angelLabel: "Mala'ika Mai Sarauta:",
    exportParchment: "Fitar a Takardar Saffron",
    downloadPng: "Saukar PNG",
    diagramCaption: "✦ Dā'ira Al-Sirr & Khatim din Kariya na Kewayi ✦",
    parchmentTitle: "Dā'ira As-Sirr — Khatim na Kewayi",
    parchmentSubtitle: "Khatim din kariya na {name}",
    parchmentWeight: "Nauyin Zimām: {weight} | Khādim: {khadim}",
    parchmentNote: "\"Wannan khatim na kewayi yana hade rawanin haruffa 28, Mala'iku 4 da Sarakunan Sama 7.\""
  }
};

export const DairaAsSirr: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const txt = dairaI18n[langKey] || dairaI18n.fr;

  const [inputName, setInputName] = useState('سر الأسرار');
  const [selectedTheme, setSelectedTheme] = useState<'emerald' | 'gold' | 'indigo' | 'crimson'>('gold');
  const [showParchment, setShowParchment] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0);
  const [perspectiveTilt, setPerspectiveTilt] = useState<number>(15);
  const svgRef = useRef<SVGSVGElement>(null);

  const abjadVal = calculateAbjadValue(inputName);
  const extractedAngel = `${inputName.trim().replace(/\s+/g, '')}ائيل`;

  const todayIndex = new Date().getDay();
  const rawKing = SEVEN_KINGS[todayIndex];

  const getKingDay = (king: SevenKingInfo) => {
    if (langKey === 'ha') return king.dayHa;
    if (langKey === 'en') return king.dayEn;
    return king.dayFr;
  };

  const getKingName = (king: SevenKingInfo) => {
    if (langKey === 'ha') return king.nameHa;
    if (langKey === 'en') return king.nameEn;
    return king.nameFr;
  };

  const getKingMetal = (king: SevenKingInfo) => {
    if (langKey === 'ha') return king.metalHa;
    if (langKey === 'en') return king.metalEn;
    return king.metalFr;
  };

  const getKingIncense = (king: SevenKingInfo) => {
    if (langKey === 'ha') return king.incenseHa;
    if (langKey === 'en') return king.incenseEn;
    return king.incenseFr;
  };

  const themeColors = {
    gold: {
      bg: '#1c1917',
      ring1: '#f59e0b',
      ring2: '#d97706',
      ring3: '#b45309',
      text: '#fef3c7',
      accent: '#fbbf24',
    },
    emerald: {
      bg: '#022c22',
      ring1: '#10b981',
      ring2: '#059669',
      ring3: '#047857',
      text: '#ecfdf5',
      accent: '#34d399',
    },
    indigo: {
      bg: '#0f172a',
      ring1: '#6366f1',
      ring2: '#4f46e5',
      ring3: '#4338ca',
      text: '#e0e7ff',
      accent: '#818cf8',
    },
    crimson: {
      bg: '#270505',
      ring1: '#ef4444',
      ring2: '#dc2626',
      ring3: '#b91c1c',
      text: '#fef2f2',
      accent: '#f87171',
    },
  };

  const currentTheme = themeColors[selectedTheme];

  const handleExportCanvas = async () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = async () => {
      if (ctx) {
        ctx.fillStyle = currentTheme.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        await downloadCanvasImage(canvas, `daira_as_sirr_${abjadVal}.png`);
      }
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{txt.title}</span>
            <Sparkles className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {txt.desc}
          </p>
        </div>
        <ToolInfoTooltip toolId="daira-as-sirr" />
      </div>

      {/* Today's King, Metal & Incense Card */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40 border border-amber-500/30 p-4 sm:p-5 rounded-3xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {txt.todayKingTitle} ({getKingDay(rawKing)})
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span>{txt.kingLabel} {getKingName(rawKing)}</span>
          </h3>
          <div className="text-xs text-zinc-300 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-medium">
            <span><strong className="text-amber-800 dark:text-amber-300">{txt.metalLabel}</strong> {getKingMetal(rawKing)}</span>
            <span><strong className="text-emerald-300">{txt.incenseLabel}</strong> {getKingIncense(rawKing)}</span>
            <span><strong className="text-indigo-300">{txt.angelLabel}</strong> {rawKing.angel}</span>
          </div>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shrink-0">
          <Gem className="w-6 h-6 text-amber-700 dark:text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs & Parameters */}
        <div className="lg:col-span-1 space-y-5 bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {txt.intentionLabel}
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-serif text-right text-base focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Ex: Ya Latif"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {txt.weightLabel}
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{abjadVal}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {txt.themeLabel}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['gold', 'emerald', 'indigo', 'crimson'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all capitalize cursor-pointer ${
                    selectedTheme === t
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {txt.themeNames[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {txt.rotationLabel}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {txt.tiltLabel}
            </label>
            <input
              type="range"
              min="0"
              max="45"
              value={perspectiveTilt}
              onChange={(e) => setPerspectiveTilt(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setShowParchment(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>{txt.exportParchment}</span>
            </button>
            <button
              onClick={handleExportCanvas}
              className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>{txt.downloadPng}</span>
            </button>
          </div>
        </div>

        {/* Right Circular Canvas Render with 3D Perspective */}
        <div className="lg:col-span-2 bg-zinc-950 rounded-3xl p-4 sm:p-8 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[420px] [perspective:1000px]">
          <div 
            className="relative w-full max-w-[360px] aspect-square flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotateX(${perspectiveTilt}deg)` }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              style={{
                animation: rotationSpeed > 0 ? `spin ${21 - rotationSpeed}s linear infinite` : 'none',
              }}
            >
              <circle cx="250" cy="250" r="245" fill={currentTheme.bg} stroke={currentTheme.ring1} strokeWidth="2" />
              <circle cx="250" cy="250" r="220" fill="none" stroke={currentTheme.ring2} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="180" fill="none" stroke={currentTheme.ring1} strokeWidth="2" />

              {/* 28 Abjad Letters */}
              {ABJAD_LETTERS_28.map((letter, i) => {
                const angle = (i * 360) / 28 - 90;
                const rad = (angle * Math.PI) / 180;
                const x = 250 + 200 * Math.cos(rad);
                const y = 250 + 200 * Math.sin(rad);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill={currentTheme.accent}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="Amiri, serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {letter}
                  </text>
                );
              })}

              {/* 4 Angels */}
              <circle cx="250" cy="250" r="140" fill="none" stroke={currentTheme.ring3} strokeWidth="1" />
              {ANGELS.map((angel, i) => {
                const angle = i * 90 - 45;
                const rad = (angle * Math.PI) / 180;
                const x = 250 + 160 * Math.cos(rad);
                const y = 250 + 160 * Math.sin(rad);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill={currentTheme.text}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="Amiri, serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {angel}
                  </text>
                );
              })}

              <circle cx="250" cy="250" r="100" fill="none" stroke={currentTheme.ring1} strokeWidth="2" />
              <polygon points="250,150 320,180 350,250 320,320 250,350 180,320 150,250 180,180" fill="none" stroke={currentTheme.ring2} strokeWidth="1" />

              <circle cx="250" cy="250" r="70" fill={currentTheme.bg} stroke={currentTheme.accent} strokeWidth="1.5" />
              <text
                x="250"
                y="240"
                fill={currentTheme.text}
                fontSize="18"
                fontWeight="bold"
                fontFamily="Amiri, serif"
                textAnchor="middle"
              >
                {inputName || 'سر'}
              </text>
              <text
                x="250"
                y="268"
                fill={currentTheme.accent}
                fontSize="12"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {abjadVal}
              </text>
            </svg>
          </div>

          <p className="text-xs text-zinc-400 mt-6 text-center font-serif">
            {txt.diagramCaption}
          </p>
        </div>
      </div>

      {/* Parchment Modal Exporter */}
      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title={txt.parchmentTitle}
        subtitle={txt.parchmentSubtitle.replace('{name}', inputName)}
        recipientName={inputName}
        abjadWeight={abjadVal}
        content={
          <div className="space-y-4 text-center">
            <p className="text-2xl font-serif text-amber-900 font-bold">{inputName}</p>
            <p className="text-sm font-mono text-amber-800">
              {txt.parchmentWeight.replace('{weight}', String(abjadVal)).replace('{khadim}', extractedAngel)}
            </p>
            <div className="p-4 bg-amber-200/40 rounded-2xl border border-amber-600/30 text-xs font-serif leading-relaxed text-amber-950">
              {txt.parchmentNote}
            </div>
          </div>
        }
      />
    </div>
  );
};


