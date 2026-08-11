import React, { useState, useMemo } from 'react';
import { Sun, Sparkles, Download, Clock, Info, Heart, Shield } from 'lucide-react';
import { calculateAbjadValue, numberToAbjadLetters } from '../../utils/abjad';

interface KhatamSaharTabProps {
  language: string;
}

const PRE_DAWN_LITANIES = [
  { id: 'latif', nameFr: 'Ya Latif (يا لطيف - Le Doux)', nameEn: 'Ya Latif (Oh Gentle One)', nameHa: 'Ya Latif (Mai Tausayi)', text: 'يا لطيف', abjad: 129 },
  { id: 'noor', nameFr: 'Ya Noor (يا نور - La Lumière)', nameEn: 'Ya Noor (Oh Light)', nameHa: 'Ya Noor (Haske)', text: 'يا نور', abjad: 256 },
  { id: 'salam', nameFr: 'Ya Salam (يا سلام - La Paix)', nameEn: 'Ya Salam (Oh Peace)', nameHa: 'Ya Salam (Aman)', text: 'يا سلام', abjad: 131 },
  { id: 'hayy', nameFr: 'Ya Hayyu Ya Qayyum (يا حي يا قيوم)', nameEn: 'Ya Hayyu Ya Qayyum (The Living, Eternal)', nameHa: 'Ya Hayyu Ya Qayyum', text: 'يا حي يا قيوم', abjad: 174 },
];

// Soft Letters (Huruf Layyina / Nuraniyyah)
const SOFT_LETTERS_MATRIX = [
  ['ا', 'م', 'ن'],
  ['ي', 'هـ', 'و'],
  ['ر', 'ح', 'س']
];

export default function KhatamSaharTab({ language }: KhatamSaharTabProps) {
  const [selectedLitanyId, setSelectedLitanyId] = useState<string>('latif');
  const [customLitany, setCustomLitany] = useState<string>('يا لطيف يا خبير');

  const activeLitanyText = useMemo(() => {
    if (selectedLitanyId === 'custom') return customLitany;
    const found = PRE_DAWN_LITANIES.find((l) => l.id === selectedLitanyId);
    return found ? found.text : 'يا لطيف';
  }, [selectedLitanyId, customLitany]);

  const litanyAbjad = useMemo(() => calculateAbjadValue(activeLitanyText) || 129, [activeLitanyText]);

  // Construct 3x3 Magic Square for Dawn Meditation
  const square3x3 = useMemo(() => {
    const base = Math.floor((litanyAbjad - 12) / 3) || 10;
    const rem = (litanyAbjad - 12) % 3;

    return [
      [8 + base, 1 + base, 6 + base + rem],
      [3 + base, 5 + base, 7 + base],
      [4 + base, 9 + base, 2 + base]
    ];
  }, [litanyAbjad]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('khatam-sahar-3x3-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatam_sahar_${selectedLitanyId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-rose-100 dark:bg-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400">
          <Clock size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Khatam al-Sahar (Pre-Dawn Soft Letter 3x3 Magic Square)'
              : language === 'ha'
              ? 'Khatam al-Sahar (Gidan Wafq 3x3 na Haruffa Masu Dadi Kafin Asuba)'
              : 'Khatam al-Sahar (Carré 3x3 de l\'Aube & Lettres Douces)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Magic square of soft lunar letters (Huruf Layyina) specifically structured for pre-dawn meditation sessions (Sahar / Thuluth al-Layl).'
              : language === 'ha'
              ? 'Gidan wafq 3x3 mai haruffa masu dadi na wata domin zurfafa tunani da ambaton Allah kafin asuba.'
              : 'Carré magique 3x3 composé des lettres douces (Huruf Layyina) spécialement conçu pour les méditations du dernier tiers de la nuit (Sahar).'}
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Select Pre-Dawn Litany / Dhikr:' : language === 'ha' ? 'Zabi Ambato na Asuba:' : 'Choisir la Litanie / Dhikr de l\'Aube :'}
          </label>
          <select
            value={selectedLitanyId}
            onChange={(e) => setSelectedLitanyId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-rose-500 outline-none"
          >
            {PRE_DAWN_LITANIES.map((l) => (
              <option key={l.id} value={l.id}>
                {language === 'en' ? l.nameEn : language === 'ha' ? l.nameHa : l.nameFr} (Abjad: {l.abjad})
              </option>
            ))}
            <option value="custom">
              {language === 'en' ? 'Custom Litany / Prayer' : language === 'ha' ? 'Niyya ta Musamman' : 'Litanie Personnalisée'}
            </option>
          </select>
        </div>

        {selectedLitanyId === 'custom' && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {language === 'en' ? 'Custom Litany Text (Arabic):' : language === 'ha' ? 'Rubuta Kalma (Larabci):' : 'Texte de la Litanie Personnalisée :'}
            </label>
            <input
              type="text"
              value={customLitany}
              onChange={(e) => setCustomLitany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Main Square SVG & Pre-Dawn Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Square Display (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950 rounded-3xl border border-rose-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{language === 'en' ? 'Dawn Magic Square 3x3' : 'Carré de l\'Aube 3x3'}</span>
          </div>

          <svg id="khatam-sahar-3x3-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#2e020d" rx="20" />
            <rect x="10" y="10" width="300" height="300" rx="16" fill="#4c0519" stroke="#fb7185" strokeWidth="3" />

            {/* Grid 3x3 Lines */}
            <line x1="110" y1="10" x2="110" y2="310" stroke="#f43f5e" strokeWidth="2" />
            <line x1="210" y1="10" x2="210" y2="310" stroke="#f43f5e" strokeWidth="2" />
            <line x1="10" y1="110" x2="310" y2="110" stroke="#f43f5e" strokeWidth="2" />
            <line x1="10" y1="210" x2="310" y2="210" stroke="#f43f5e" strokeWidth="2" />

            {/* Square Cells (Numbers + Soft Letters Overlay) */}
            {square3x3.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <g key={`${rIdx}-${cIdx}`}>
                  {/* Number */}
                  <text
                    x={10 + cIdx * 100 + 50}
                    y={10 + rIdx * 100 + 45}
                    textAnchor="middle"
                    fill="#ffe4e6"
                    fontSize="18"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {val}
                  </text>
                  {/* Soft Letter Overlay */}
                  <text
                    x={10 + cIdx * 100 + 50}
                    y={10 + rIdx * 100 + 75}
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontSize="22"
                    fontFamily="serif"
                    fontWeight="bold"
                    opacity="0.8"
                  >
                    {SOFT_LETTERS_MATRIX[rIdx][cIdx]}
                  </text>
                </g>
              ))
            )}
          </svg>

          <div className="text-xs text-rose-200 font-mono">
            {language === 'en' ? 'Litany Abjad Sum:' : 'Poids Abjad de la Litanie :'} <span className="font-bold text-amber-300">{litanyAbjad}</span>
          </div>

          <button
            onClick={handleDownloadSVG}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Download Pre-Dawn Square (SVG)' : 'Télécharger le Carré (SVG)'}</span>
          </button>
        </div>

        {/* Pre-Dawn Protocol & Meditation Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3 text-xs">
            <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-2">
              <Sun size={16} />
              <span>{language === 'en' ? 'Pre-Dawn Meditation Protocol (Sahar):' : 'Protocole de Méditation de l\'Aube (Sahar) :'}</span>
            </h3>

            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-rose-100 dark:border-gray-700">
                <span className="font-bold text-rose-600 block">{language === 'en' ? '1. Optimal Time Frame:' : '1. Moment Propice :'}</span>
                <span>
                  {language === 'en'
                    ? 'During the last third of the night (approx 1h30 before Fajr dawn prayer).'
                    : 'Pendant le dernier tiers de la nuit (environ 1h30 avant la prière du Fajr).'}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-rose-100 dark:border-gray-700">
                <span className="font-bold text-rose-600 block">{language === 'en' ? '2. Recommended Fumigation:' : '2. Encens Préconisé :'}</span>
                <span>
                  {language === 'en'
                    ? 'White Sandalwood, Male Frankincense or Light Ambergris.'
                    : 'Santal Blanc, Oliban Mâle ou Ambre Gris Pur.'}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-rose-100 dark:border-gray-700">
                <span className="font-bold text-rose-600 block">{language === 'en' ? '3. Repetition Target:' : '3. Répétition du Dhikr :'}</span>
                <span>
                  {language === 'en'
                    ? `Repeat "${activeLitanyText}" exactly ${litanyAbjad} times while focusing on the 3x3 square.`
                    : `Répéter "${activeLitanyText}" exactement ${litanyAbjad} fois en contemplant le carré 3x3.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
