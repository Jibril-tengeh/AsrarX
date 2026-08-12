import React, { useState, useMemo } from 'react';
import { Music, Sparkles, Info, Activity, Radio, Volume2 } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface MizanTaraneemTabProps {
  language: string;
}

const PRESET_ENTITIES = [
  { name: 'Jibra\'il (جبرائيل)', text: 'جبرائيل', type: 'Angel of Revelation / Light' },
  { name: 'Mika\'il (ميخائيل)', text: 'ميخائيل', type: 'Angel of Sustenance & Rain' },
  { name: 'Israfil (إسرافيل)', text: 'إسرافيل', type: 'Angel of Resurrection / Trumpet' },
  { name: 'Azra\'il (عزرائيل)', text: 'عزرائيل', textAr: 'عزرائيل', type: 'Angel of Soul Transition' },
  { name: 'Ya Latif (يا لطيف)', text: 'يا لطيف', type: 'Gentle Divine Name' },
];

const DHALAQA_LETTERS = new Set(['ر', 'ل', 'م', 'ن', 'ف', 'ب']); // Liquid letters
const SFEIR_LETTERS = new Set(['ص', 'س', 'ز']); // Sibilant letters
const HALQ_LETTERS = new Set(['ء', 'أ', 'إ', 'ه', 'ع', 'ح', 'غ', 'خ']); // Guttural letters

export default function MizanTaraneemTab({ language }: MizanTaraneemTabProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('جبرائيل');
  const [customText, setCustomText] = useState<string>('جبرائيل');

  const activeText = useMemo(() => {
    if (selectedPreset === 'custom') return customText;
    return selectedPreset;
  }, [selectedPreset, customText]);

  const metrics = useMemo(() => {
    let dhalaqCount = 0;
    let sfeirCount = 0;
    let halqCount = 0;
    let totalLetters = 0;

    for (const char of activeText) {
      if (/[\u0600-\u06FF]/.test(char)) {
        totalLetters++;
        if (DHALAQA_LETTERS.has(char)) dhalaqCount++;
        if (SFEIR_LETTERS.has(char)) sfeirCount++;
        if (HALQ_LETTERS.has(char)) halqCount++;
      }
    }

    const safeTotal = Math.max(1, totalLetters);
    const liquidPct = Math.round((dhalaqCount / safeTotal) * 100);
    const sibilantPct = Math.round((sfeirCount / safeTotal) * 100);
    const gutturalPct = Math.round((halqCount / safeTotal) * 100);

    const abjad = calculateAbjadValue(activeText) || 200;

    // Harmonic Resonance Index Calculation (0 - 100%)
    const harmonicResonance = Math.min(99, Math.max(45, Math.round(50 + (liquidPct * 0.3) + (sibilantPct * 0.2) + ((abjad % 33)))));
    // Frequency Pitch Estimate (Hz)
    const baseFreqHz = 216 + (abjad % 300);

    let acousticModeFr = 'Flûté & Céleste (Douceur Subtile)';
    let acousticModeEn = 'Flute-like & Celestial (Subtle Gentleness)';
    let acousticModeHa = 'Mai Sanyi da Amsa A Mawaqi';

    if (gutturalPct > 35) {
      acousticModeFr = 'Majestueux & Profond (Résonance de Puissance)';
      acousticModeEn = 'Majestic & Deep (Power Resonance)';
      acousticModeHa = 'Mai Karfi da Girma';
    } else if (sibilantPct > 25) {
      acousticModeFr = 'Cristallin & Vibratoire (Breezy Echo)';
      acousticModeEn = 'Crystalline & Vibrational (Breezy Echo)';
      acousticModeHa = 'Rai da Sauri Mai Tsarki';
    }

    return {
      totalLetters,
      liquidPct,
      sibilantPct,
      gutturalPct,
      abjad,
      harmonicResonance,
      baseFreqHz,
      acousticModeFr,
      acousticModeEn,
      acousticModeHa
    };
  }, [activeText]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('mizan-taraneem-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mizan_taraneem_${activeText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl text-cyan-600 dark:text-cyan-400">
          <Music size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Mizan al-Taraneem (Phonetic & Harmonic Resonance Balance)'
              : language === 'ha'
              ? 'Mizan al-Taraneem (Awon Muryar Haruffa da Mawaka)'
              : 'Mizan al-Taraneem (Balance d\'Harmonie Phonétique & Résonance)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Measures the phonetic regularity, acoustic fluid balance, and harmonic resonance index of extracted spiritual entities or litanies.'
              : language === 'ha'
              ? 'Auna amsa sautin haruffa da daidaito a tsakanin muryoyin sunayen ruhi ko na dikiya.'
              : 'Mesure la régularité phonétique, la fluidité acoustique et l\'indice de résonance harmonique des entités ou litanies.'}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Select Spiritual Entity or Name:' : language === 'ha' ? 'Zabi Sunan Ruhaniya:' : 'Choisir une Entité ou Nom Spirituel :'}
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            {PRESET_ENTITIES.map((p, idx) => (
              <option key={idx} value={p.text}>
                {p.name} - {p.type}
              </option>
            ))}
            <option value="custom">
              {language === 'en' ? 'Custom Name / Entity' : language === 'ha' ? 'Suna na Musamman' : 'Nom Personnalisé'}
            </option>
          </select>
        </div>

        {selectedPreset === 'custom' && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {language === 'en' ? 'Custom Entity Name (Arabic):' : language === 'ha' ? 'Rubuta Suna (Larabci):' : 'Nom de l\'Entité (en Arabe) :'}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Visual Wave SVG & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Harmonic Sine Wave SVG (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cyan-950 via-slate-950 to-blue-950 rounded-3xl border border-cyan-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{activeText}</span>
          </div>

          <svg id="mizan-taraneem-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect x="10" y="10" width="300" height="200" rx="16" fill="#030712" stroke="#06b6d4" strokeWidth="2" />

            {/* Grid Lines */}
            <line x1="10" y1="110" x2="310" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

            {/* Dynamic Harmonic Wave Path */}
            {(() => {
              const freq = metrics.harmonicResonance / 10;
              let pathD = "M 20 110 ";
              for (let x = 20; x <= 300; x += 5) {
                const y = 110 + Math.sin((x / 30) * freq) * 35 * Math.cos((x / 60));
                pathD += `L ${x} ${y.toFixed(1)} `;
              }
              return (
                <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              );
            })()}

            {/* Secondary Harmonics */}
            {(() => {
              const freq = (metrics.harmonicResonance / 10) * 1.5;
              let pathD = "M 20 110 ";
              for (let x = 20; x <= 300; x += 5) {
                const y = 110 + Math.sin((x / 25) * freq) * 20;
                pathD += `L ${x} ${y.toFixed(1)} `;
              }
              return (
                <path d={pathD} fill="none" stroke="#a5f3fc" strokeWidth="1.5" opacity="0.6" />
              );
            })()}

            <text x="160" y="180" textAnchor="middle" fill="#cffaff" fontSize="14" fontFamily="monospace" fontWeight="bold">
              {metrics.baseFreqHz} Hz | Nisba: {metrics.harmonicResonance}%
            </text>
          </svg>

          <ExportFormatButtons
            svgId="mizan-taraneem-svg"
            filename={`mizan_taraneem_${activeText}`}
            title={language === 'en' ? 'Mizan al-Taraneem Acoustic Wave' : 'Mizan al-Taraneem Resonance Phonétique'}
            subtitle={`Fréquence: ${metrics.baseFreqHz} Hz • Formule: ${activeText}`}
            language={language}
          />
        </div>

        {/* Breakdown Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-cyan-800 dark:text-cyan-200 flex items-center gap-2">
              <Volume2 size={16} />
              <span>{language === 'en' ? 'Acoustic & Phonetic Spectrum:' : 'Spectre Acoustique & Phonétique :'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-cyan-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Liquidity (Dhalaqah):' : 'Fluidité (Dhalaqah) :'}</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{metrics.liquidPct}%</span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-cyan-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Sibilance (Sfeir):' : 'Sifflement (Sfeir) :'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{metrics.sibilantPct}%</span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-cyan-100 dark:border-gray-700">
                <span className="text-gray-500 block">{language === 'en' ? 'Gutturality (Halq):' : 'Gutturalité (Halq) :'}</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{metrics.gutturalPct}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
            <span className="text-gray-500 block">{language === 'en' ? 'Acoustic Harmonic Mode:' : 'Mode Harmonique Acoustique :'}</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              {language === 'en' ? metrics.acousticModeEn : language === 'ha' ? metrics.acousticModeHa : metrics.acousticModeFr}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
