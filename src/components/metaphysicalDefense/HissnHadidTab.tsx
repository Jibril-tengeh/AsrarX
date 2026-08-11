import React, { useState, useMemo } from 'react';
import { Shield, Sparkles, Lock } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface HissnHadidTabProps {
  language: string;
}

const PROTECTION_DIVINE_NAMES = [
  { text: 'يا حفيظ', abjad: 998, fr: 'Ya Hafeez (Le Préservateur)', en: 'Ya Hafeez (The Preserver)', ha: 'Ya Hafeez (Mai Karewa)' },
  { text: 'يا قوي', abjad: 116, fr: 'Ya Qawiy (Le Fort)', en: 'Ya Qawiy (The All-Strong)', ha: 'Ya Qawiy (Mai Karfi)' },
  { text: 'يا عزيز', abjad: 94, fr: 'Ya Aziz (Le Puissant)', en: 'Ya Aziz (The Mighty)', ha: 'Ya Aziz (Mai Mafi Girma)' },
  { text: 'يا مانع', abjad: 161, fr: 'Ya Mani\' (Le Protecteur Écarteur)', en: 'Ya Mani\' (The Shielding Preventer)', ha: 'Ya Mani\' (Mai Kare Cutarwa)' },
];

export default function HissnHadidTab({ language }: HissnHadidTabProps) {
  const [selectedNameText, setSelectedNameText] = useState<string>('يا حفيظ');
  const [customText, setCustomText] = useState<string>('يا حفيظ يا مانع');

  const activeText = useMemo(() => {
    if (selectedNameText === 'custom') return customText;
    return selectedNameText;
  }, [selectedNameText, customText]);

  const activeAbjad = useMemo(() => calculateAbjadValue(activeText) || 998, [activeText]);

  // Hadid (Iron) Iron Value = 26
  const ironMatrix = useMemo(() => {
    const base = Math.floor(activeAbjad / 26) + 1;
    return [
      [26, 26 * 2, 26 * 3, 26],
      [26 * 4, base, base + 26, 26 * 2],
      [26 * 3, base + 52, base + 78, 26 * 4],
      [26, 26 * 3, 26 * 2, 26]
    ];
  }, [activeAbjad]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('hissn-hadid-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hissn_hadid_${activeText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? "Hissn al-Hadid (Iron Element Defensive Shield)"
              : language === 'ha'
              ? "Hissn al-Hadid (Ganuwar Karfe na Kariya)"
              : "Hissn al-Hadid (Bouclier de Fer & Grille de Protection)"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? "Protective defensive grid calculated using the metaphysical properties of Iron (Surah Al-Hadid, Abjad 26)."
              : language === 'ha'
              ? "Ganuwa da ma'aunin kariya na karfe bisa lambar Abjad 26 da sunayen Allah na tsaro."
              : "Grille défensive protectrice calculée à partir des propriétés métaphysiques de l'élément Fer (Abjad 26 / Sourate Al-Hadid)."}
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Select Divine Protective Name:' : language === 'ha' ? 'Zabi Sunan Allah na Kariya:' : 'Choisir un Nom Divin Protecteur :'}
          </label>
          <select
            value={selectedNameText}
            onChange={(e) => setSelectedNameText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-500 outline-none"
          >
            {PROTECTION_DIVINE_NAMES.map((n, idx) => (
              <option key={idx} value={n.text}>
                {language === 'en' ? n.en : language === 'ha' ? n.ha : n.fr} (Abjad: {n.abjad})
              </option>
            ))}
            <option value="custom">
              {language === 'en' ? 'Custom Protection Intention' : language === 'ha' ? 'Rubutun Niyya na Musamman' : 'Intention Personnalisée'}
            </option>
          </select>
        </div>

        {selectedNameText === 'custom' && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {language === 'en' ? 'Custom Text (Arabic):' : language === 'ha' ? 'Rubuta Kalma (Larabci):' : 'Texte d\'Intention (en Arabe) :'}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-slate-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* SVG Container & Iron Shield Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Shield (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 rounded-3xl border border-slate-600/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{activeText} (Hadid = 26)</span>
          </div>

          <svg id="hissn-hadid-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#0b1329" rx="20" />

            {/* Iron Shield Border Outer */}
            <path d="M 160 20 L 290 60 L 290 180 C 290 250 160 300 160 300 C 160 300 30 250 30 180 L 30 60 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
            <path d="M 160 32 L 278 68 L 278 175 C 278 238 160 284 160 284 C 160 284 42 238 42 175 L 42 68 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Inner Metallic Grid */}
            <g opacity="0.8">
              <line x1="80" y1="100" x2="240" y2="100" stroke="#64748b" strokeWidth="2" />
              <line x1="80" y1="150" x2="240" y2="150" stroke="#64748b" strokeWidth="2" />
              <line x1="80" y1="200" x2="240" y2="200" stroke="#64748b" strokeWidth="2" />

              <line x1="120" y1="80" x2="120" y2="230" stroke="#64748b" strokeWidth="2" />
              <line x1="160" y1="80" x2="160" y2="230" stroke="#64748b" strokeWidth="2" />
              <line x1="200" y1="80" x2="200" y2="230" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Central Arabic Calligraphy */}
            <text x="160" y="155" textAnchor="middle" fill="#f8fafc" fontSize="22" fontFamily="serif" fontWeight="bold">
              {activeText}
            </text>

            <text x="160" y="260" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">
              Abjad: {activeAbjad} | Hadid: 26
            </text>
          </svg>

          <ExportFormatButtons
            svgId="hissn-hadid-svg"
            filename={`hissn_hadid_${activeText}`}
            title={language === 'en' ? 'Hissn al-Hadid (Iron Shield)' : language === 'ha' ? 'Hissn al-Hadid (Ganuwar Karfe)' : 'Hissn al-Hadid (Bouclier de Fer)'}
            subtitle={`Abjad: ${activeAbjad} • Fer (Hadid) = 26`}
            language={language}
          />
        </div>

        {/* Technical Guidance & Iron Matrix Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Lock size={16} />
              <span>{language === 'en' ? 'Iron Matrix Shield Properties:' : language === 'ha' ? 'Kasusuwa da Kariyar Karfe:' : 'Propriétés de la Matrice de Fer :'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              {ironMatrix.map((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className="p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold">
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white block">
              {language === 'en' ? 'Metaphysical Principle of Iron Shield:' : language === 'ha' ? 'Ilimin Karfe a Tsaro:' : 'Principe Métaphysique du Fer :'}
            </span>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Iron (Hadid = 26) resonates with force and spiritual defense as highlighted in Surah 57:25 ("We sent down Iron, wherein is great military might and benefits for the people").'
                : language === 'ha'
                ? 'Karfe (Hadid = 26) yana da babban tasiri wajen kariya da fatattakar sharri kamar yadda yake a Surat Al-Hadid.'
                : 'Le Fer (Hadid = 26) possède une résonance de résistance et de protection absolue (Sourate 57:25 "Et Nous avons fait descendre le Fer, où il y a une force redoutable et des utilités").'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
