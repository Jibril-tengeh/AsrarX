import React, { useState, useMemo } from 'react';
import { Scale, Sparkles, Info, RefreshCw, Activity, Layers, ShieldCheck } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface KhatamJabirTabProps {
  language: string;
}

// Letter elemental classification according to Jabir Ibn Hayyan
const JABIR_LETTER_ELEMENTS: Record<string, { element: 'fire' | 'air' | 'water' | 'earth'; hot: number; cold: number; dry: number; moist: number }> = {
  'ا': { element: 'fire', hot: 3, cold: 0, dry: 3, moist: 0 },
  'أ': { element: 'fire', hot: 3, cold: 0, dry: 3, moist: 0 },
  'إ': { element: 'fire', hot: 3, cold: 0, dry: 3, moist: 0 },
  'آ': { element: 'fire', hot: 3, cold: 0, dry: 3, moist: 0 },
  'ه': { element: 'fire', hot: 2, cold: 0, dry: 2, moist: 0 },
  'ط': { element: 'fire', hot: 4, cold: 0, dry: 4, moist: 0 },
  'م': { element: 'fire', hot: 2, cold: 0, dry: 2, moist: 0 },
  'ف': { element: 'fire', hot: 3, cold: 0, dry: 3, moist: 0 },
  'ش': { element: 'fire', hot: 4, cold: 0, dry: 4, moist: 0 },
  'ذ': { element: 'fire', hot: 2, cold: 0, dry: 2, moist: 0 },

  'ب': { element: 'air', hot: 3, cold: 0, dry: 0, moist: 3 },
  'و': { element: 'air', hot: 2, cold: 0, dry: 0, moist: 2 },
  'ي': { element: 'air', hot: 4, cold: 0, dry: 0, moist: 4 },
  'ن': { element: 'air', hot: 3, cold: 0, dry: 0, moist: 3 },
  'ص': { element: 'air', hot: 2, cold: 0, dry: 0, moist: 2 },
  'ت': { element: 'air', hot: 4, cold: 0, dry: 0, moist: 4 },
  'ض': { element: 'air', hot: 3, cold: 0, dry: 0, moist: 3 },

  'ج': { element: 'water', hot: 0, cold: 3, dry: 0, moist: 3 },
  'ز': { element: 'water', hot: 0, cold: 2, dry: 0, moist: 2 },
  'ك': { element: 'water', hot: 0, cold: 4, dry: 0, moist: 4 },
  'س': { element: 'water', hot: 0, cold: 3, dry: 0, moist: 3 },
  'ق': { element: 'water', hot: 0, cold: 2, dry: 0, moist: 2 },
  'ث': { element: 'water', hot: 0, cold: 4, dry: 0, moist: 4 },
  'ظ': { element: 'water', hot: 0, cold: 3, dry: 0, moist: 3 },

  'د': { element: 'earth', hot: 0, cold: 3, dry: 3, moist: 0 },
  'ح': { element: 'earth', hot: 0, cold: 2, dry: 2, moist: 0 },
  'ل': { element: 'earth', hot: 0, cold: 4, dry: 4, moist: 0 },
  'ع': { element: 'earth', hot: 0, cold: 3, dry: 3, moist: 0 },
  'ر': { element: 'earth', hot: 0, cold: 2, dry: 2, moist: 0 },
  'خ': { element: 'earth', hot: 0, cold: 4, dry: 4, moist: 0 },
  'غ': { element: 'earth', hot: 0, cold: 3, dry: 3, moist: 0 },
};

export default function KhatamJabirTab({ language }: KhatamJabirTabProps) {
  const [inputText, setInputText] = useState<string>('الحكمة والشفاء');

  const analysis = useMemo(() => {
    let totalHot = 0;
    let totalCold = 0;
    let totalDry = 0;
    let totalMoist = 0;
    let letterCount = 0;

    for (const char of inputText) {
      if (JABIR_LETTER_ELEMENTS[char]) {
        const item = JABIR_LETTER_ELEMENTS[char];
        totalHot += item.hot;
        totalCold += item.cold;
        totalDry += item.dry;
        totalMoist += item.moist;
        letterCount++;
      }
    }

    if (letterCount === 0) {
      totalHot = 10;
      totalCold = 5;
      totalDry = 8;
      totalMoist = 7;
    }

    const totalSum = totalHot + totalCold + totalDry + totalMoist || 1;
    const hotPct = Math.round((totalHot / totalSum) * 100);
    const coldPct = Math.round((totalCold / totalSum) * 100);
    const dryPct = Math.round((totalDry / totalSum) * 100);
    const moistPct = Math.round((totalMoist / totalSum) * 100);

    const abjadVal = calculateAbjadValue(inputText) || 120;

    // Determine primary temperament
    let primaryTemperamentFr = 'Équilibré Harmonieux (Itidâl)';
    let primaryTemperamentEn = 'Harmonious Balanced (Itidâl)';
    let primaryTemperamentHa = 'Daitacciya (Itidâl)';

    if (totalHot > totalCold && totalDry > totalMoist) {
      primaryTemperamentFr = 'Chaud & Sec (Feu / Safra\')';
      primaryTemperamentEn = 'Hot & Dry (Fire / Choleric)';
      primaryTemperamentHa = 'Zafi & Bushewa (Wuta)';
    } else if (totalHot > totalCold && totalMoist > totalDry) {
      primaryTemperamentFr = 'Chaud & Humide (Air / Dam)';
      primaryTemperamentEn = 'Hot & Moist (Air / Sanguine)';
      primaryTemperamentHa = 'Zafi & Dumi (Iska)';
    } else if (totalCold > totalHot && totalMoist > totalDry) {
      primaryTemperamentFr = 'Froid & Humide (Eau / Balgham)';
      primaryTemperamentEn = 'Cold & Moist (Water / Phlegmatic)';
      primaryTemperamentHa = 'Sanyi & Dumi (Ruwa)';
    } else if (totalCold > totalHot && totalDry > totalMoist) {
      primaryTemperamentFr = 'Froid & Sec (Terre / Sawda\')';
      primaryTemperamentEn = 'Cold & Dry (Earth / Melancholic)';
      primaryTemperamentHa = 'Sanyi & Bushewa (Kasa)';
    }

    // Determine remedy element
    let remedyFr = 'Oliban Mâle, Santal Blanc & Safranal';
    let remedyEn = 'Male Frankincense, White Sandalwood & Saffron';
    let remedyHa = 'Oliban, Sandal Fari da Safran';

    if (totalHot < totalCold) {
      remedyFr = 'Nécessite Apport de Chaleur (Gingembre, Safran, Myrrhe)';
      remedyEn = 'Requires Heat Addition (Ginger, Saffron, Myrrh)';
      remedyHa = 'Yana buqatar Kara Zafi (Citta, Safran da Myrrhe)';
    } else if (totalDry < totalMoist) {
      remedyFr = 'Nécessite Dessiccation Noble (Santal Rouge, Storax, Camphre)';
      remedyEn = 'Requires Noble Drying (Red Sandalwood, Storax, Camphor)';
      remedyHa = 'Yana buqatar Bushewa (Sandal Jaji da Storax)';
    }

    return {
      totalHot,
      totalCold,
      totalDry,
      totalMoist,
      hotPct,
      coldPct,
      dryPct,
      moistPct,
      abjadVal,
      primaryTemperamentFr,
      primaryTemperamentEn,
      primaryTemperamentHa,
      remedyFr,
      remedyEn,
      remedyHa,
    };
  }, [inputText]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('jabir-scale-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatam_jabir_${inputText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-2xl text-teal-600 dark:text-teal-400">
          <Scale size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Khatam Jabir (Jabirian Alchemical Balance)'
              : language === 'ha'
              ? 'Khatam Jabir (Awon Alchimie na Jabir Ibn Hayyan)'
              : 'Khatam Jabir (Balance Alchimique de Jabir Ibn Hayyan)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Analyzes the exact proportion of Hot, Cold, Dry, and Moist qualities according to Jabir Ibn Hayyan\'s Book of the Balance.'
              : language === 'ha'
              ? 'Auna rabon Zafi, Sanyi, Bushewa da Dumi na haruffan kalma bisa tafarkin Kitab al-Mizan na Jabir Ibn Hayyan.'
              : 'Analyse la proportion exacte des 4 qualités élémentaires (Chaud, Froid, Sec, Humide) d\'un nom selon le Kitab al-Mizan.'}
          </p>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block font-bold text-xs text-gray-700 dark:text-gray-300 mb-1">
          {language === 'en' ? 'Word / Concept to Analyze (Arabic or Latin):' : language === 'ha' ? 'Kalma ko Suna:' : 'Nom, Concept ou Litanie à Analyser :'}
        </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ex: الحكمة والشفاء..."
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* Main Grid: Visual Scale + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Scale Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-teal-950 via-slate-950 to-emerald-950 rounded-3xl border border-teal-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{language === 'en' ? 'Mizan Jabir Scale Visual' : 'Représentation de la Balance de Jabir'}</span>
          </div>

          <svg id="jabir-scale-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#022c22" rx="20" />
            {/* Background Alchemical Frame */}
            <rect x="10" y="10" width="300" height="300" rx="20" fill="#042f2e" stroke="#14b8a6" strokeWidth="2.5" />

            {/* Central Pillar */}
            <line x1="160" y1="40" x2="160" y2="220" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
            <circle cx="160" cy="40" r="10" fill="#2dd4bf" stroke="#042f2e" strokeWidth="2" />

            {/* Balance Beam */}
            <line x1="70" y1="90" x2="250" y2="90" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            <circle cx="160" cy="90" r="7" fill="#f59e0b" />

            {/* Left Pan (Hot / Dry - Fire/Earth) */}
            <line x1="70" y1="90" x2="50" y2="150" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="70" y1="90" x2="90" y2="150" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M 40 150 Q 70 175 100 150 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
            <text x="70" y="190" textAnchor="middle" fill="#fca5a5" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              Chaud/Sec ({analysis.totalHot + analysis.totalDry})
            </text>

            {/* Right Pan (Cold / Moist - Water/Air) */}
            <line x1="250" y1="90" x2="230" y2="150" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="250" y1="90" x2="270" y2="150" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M 220 150 Q 250 175 280 150 Z" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5" />
            <text x="250" y="190" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              Froid/Humide ({analysis.totalCold + analysis.totalMoist})
            </text>

            {/* Center Seal Text */}
            <text x="160" y="255" textAnchor="middle" fill="#ccfbf1" fontSize="15" fontFamily="monospace" fontWeight="bold">
              {inputText}
            </text>
            <text x="160" y="285" textAnchor="middle" fill="#5eead4" fontSize="11" fontFamily="monospace">
              Abjad: {analysis.abjadVal} | Mizan Jabir
            </text>
          </svg>

          <ExportFormatButtons
            svgId="jabir-scale-svg"
            filename={`khatam_jabir_${inputText}`}
            title={language === 'en' ? 'Mizan Jabir Ibn Hayyan Balance' : 'Mizan Jabir Ibn Hayyan'}
            subtitle={`Nom/Formule: ${inputText} • Abjad: ${analysis.abjadVal}`}
            language={language}
          />
        </div>

        {/* 4 Elemental Quality Bars & Diagnosis (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-2">
              <Activity size={16} />
              <span>{language === 'en' ? 'Proportions of the 4 Elemental Qualities:' : 'Proportions des 4 Qualités Alchimiques :'}</span>
            </h3>

            {/* Chaud / Hot */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-red-500">{language === 'en' ? 'Heat (الحرارة / Hot)' : 'Chaleur (الحرارة / Chaud)'}</span>
                <span className="text-gray-700 dark:text-gray-300">{analysis.hotPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${analysis.hotPct}%` }} />
              </div>
            </div>

            {/* Froid / Cold */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-blue-500">{language === 'en' ? 'Coldness (البرودة / Cold)' : 'Froid (البرودة / Froid)'}</span>
                <span className="text-gray-700 dark:text-gray-300">{analysis.coldPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${analysis.coldPct}%` }} />
              </div>
            </div>

            {/* Sec / Dry */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-amber-500">{language === 'en' ? 'Dryness (اليُبوسة / Dry)' : 'Sécheresse (اليُبوسة / Sec)'}</span>
                <span className="text-gray-700 dark:text-gray-300">{analysis.dryPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${analysis.dryPct}%` }} />
              </div>
            </div>

            {/* Humide / Moist */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-teal-500">{language === 'en' ? 'Moisture (الرطوبة / Moist)' : 'Humidité (الرطوبة / Humide)'}</span>
                <span className="text-gray-700 dark:text-gray-300">{analysis.moistPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${analysis.moistPct}%` }} />
              </div>
            </div>
          </div>

          {/* Diagnostic Card */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 text-xs">
            <h4 className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <ShieldCheck size={16} />
              <span>{language === 'en' ? 'Jabirian Temperament & Alchemical Remedy:' : 'Tempérament Jabirien & Remède Alchimique :'}</span>
            </h4>
            <div>
              <span className="text-gray-500">{language === 'en' ? 'Dominant Temperament:' : 'Tempérament Dominant :'} </span>
              <span className="font-extrabold text-teal-700 dark:text-teal-300">
                {language === 'en' ? analysis.primaryTemperamentEn : language === 'ha' ? analysis.primaryTemperamentHa : analysis.primaryTemperamentFr}
              </span>
            </div>
            <div>
              <span className="text-gray-500">{language === 'en' ? 'Recommended Alchemical Correction:' : 'Correction Alchimique Recommandée :'} </span>
              <span className="font-extrabold text-amber-700 dark:text-amber-300">
                {language === 'en' ? analysis.remedyEn : language === 'ha' ? analysis.remedyHa : analysis.remedyFr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
