import React, { useState, useMemo } from 'react';
import { Snowflake, Sparkles } from 'lucide-react';
import { calculateAbjadValue, COLD_LETTERS } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface AlTafreeqTabProps {
  language: string;
}

const CONFLICT_PRESETS = [
  { text: 'عداوة', fr: 'Adawah (Hostilité / Ennamitié)', en: 'Adawah (Enmity / Hostility)', ha: 'Adawah (Makiya da Gaba)' },
  { text: 'حسد', fr: 'Hasad (Jalousie / Envie)', en: 'Hasad (Envy / Jealousy)', ha: 'Hasad (Kishi da Hassada)' },
  { text: 'نزاع', fr: 'Niza\' (Dispute / Conflit)', en: 'Niza\' (Dispute / Conflict)', ha: 'Niza\' (Rikici da Jayayya)' },
  { text: 'غضب', fr: 'Ghadab (Colère / Emportement)', en: 'Ghadab (Anger / Wrath)', ha: 'Ghadab (Fushi da Hucewa)' },
];

export default function AlTafreeqTab({ language }: AlTafreeqTabProps) {
  const [selectedConflict, setSelectedConflict] = useState<string>('عداوة');
  const [customConflict, setCustomConflict] = useState<string>('عداوة');

  const activeText = useMemo(() => {
    if (selectedConflict === 'custom') return customConflict;
    return selectedConflict;
  }, [selectedConflict, customConflict]);

  const activeAbjad = useMemo(() => calculateAbjadValue(activeText) || 120, [activeText]);

  // Extract cold letters from active text or fallback cold set
  const extractedColdLetters = useMemo(() => {
    const letters = activeText.split('');
    const matched = letters.filter((l) => COLD_LETTERS.includes(l));
    if (matched.length === 0) {
      // Fallback cold sequence based on activeAbjad
      const pool = ['م', 'د', 'ح', 'ع', 'ر', 'خ', 'غ', 'ب', 'و', 'ي', 'ن', 'ص', 'ت', 'ض'];
      return pool.slice(0, (activeAbjad % 6) + 3);
    }
    return matched;
  }, [activeText, activeAbjad]);

  const repetitionCount = useMemo(() => {
    return (activeAbjad * 7) % 999 + 111;
  }, [activeAbjad]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('al-tafreeq-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al_tafreeq_${activeText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl text-cyan-600 dark:text-cyan-400">
          <Snowflake size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Al-Tafreeq (Conflict Energy Dissipation)'
              : language === 'ha'
              ? 'Al-Tafreeq (Tarwatsa Masifu da Rikici)'
              : 'Al-Tafreeq (Dispersion des Énergies de Conflit)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Calculates cold elemental letter sequences (Water & Earth elements) to cool down and dissipate hostility.'
              : language === 'ha'
              ? 'Yana lissafin haruffa masu sanyi (Ruwa da Kasa) domin kwantar da fushi da tarwatsa adawa.'
              : 'Calcule des séquences de lettres froides (éléments Eau & Terre) pour refroidir et dissiper l\'agressivité.'}
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? "Select Type of Conflict / Tension:" : language === 'ha' ? "Zabi Nau'in Rikici ko Gaba:" : "Sélectionner le Type de Conflit :"}
          </label>
          <select
            value={selectedConflict}
            onChange={(e) => setSelectedConflict(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            {CONFLICT_PRESETS.map((c, idx) => (
              <option key={idx} value={c.text}>
                {language === 'en' ? c.en : language === 'ha' ? c.ha : c.fr}
              </option>
            ))}
            <option value="custom">
              {language === 'en' ? 'Custom Conflict Subject' : language === 'ha' ? 'Abun Rikici na Musamman' : 'Sujet de Conflit Personnalisé'}
            </option>
          </select>
        </div>

        {selectedConflict === 'custom' && (
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              {language === 'en' ? 'Custom Subject (Arabic):' : language === 'ha' ? 'Sunan Rikicin (Larabci):' : 'Sujet du Conflit (en Arabe) :'}
            </label>
            <input
              type="text"
              value={customConflict}
              onChange={(e) => setCustomConflict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Results & Visual SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual SVG (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-cyan-950 via-slate-950 to-blue-950 rounded-3xl border border-cyan-600/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Al-Tafreeq • {activeText}</span>
          </div>

          <svg id="al-tafreeq-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 280" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="280" fill="#082f49" rx="20" />

            {/* Cold Water Waves Circle */}
            <circle cx="160" cy="140" r="110" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="8,4" />
            <circle cx="160" cy="140" r="95" fill="none" stroke="#0284c7" strokeWidth="1.5" />

            {/* Cold Letters Ring */}
            {extractedColdLetters.map((letter, idx) => {
              const angle = (idx * 2 * Math.PI) / extractedColdLetters.length - Math.PI / 2;
              const x = 160 + 75 * Math.cos(angle);
              const y = 140 + 75 * Math.sin(angle);
              return (
                <text key={idx} x={x} y={y + 6} textAnchor="middle" fill="#7dd3fc" fontSize="20" fontFamily="serif" fontWeight="bold">
                  {letter}
                </text>
              );
            })}

            {/* Central Conflict Text (Dissolving/Dashed) */}
            <text x="160" y="145" textAnchor="middle" fill="#e0f2fe" fontSize="24" fontFamily="serif" fontWeight="bold">
              {activeText}
            </text>

            <text x="160" y="235" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace">
              Abjad: {activeAbjad} | {language === 'en' ? 'Repeats:' : language === 'ha' ? 'Maimaitawa:' : 'Répétitions :'} {repetitionCount}
            </text>
          </svg>

          <ExportFormatButtons
            svgId="al-tafreeq-svg"
            filename={`al_tafreeq_${activeText}`}
            title={language === 'en' ? 'Al-Tafreeq Neutralizer Diagram' : language === 'ha' ? 'Taswirar Al-Tafreeq' : 'Désamorçage Al-Tafreeq'}
            subtitle={`Abjad: ${activeAbjad} • ${extractedColdLetters.length} Lettres Froides`}
            language={language}
          />
        </div>

        {/* Detailed Cold Letter Sequence (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-cyan-900 dark:text-cyan-200 flex items-center gap-2">
              <Snowflake size={16} />
              <span>{language === 'en' ? 'Extracted Cold Letter Sequence:' : language === 'ha' ? 'Jerin Haruffa Masu Sanyi:' : 'Séquence Extrainte des Lettres Froides :'}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {extractedColdLetters.map((letter, idx) => (
                <div key={idx} className="px-3.5 py-2 bg-white dark:bg-gray-800 rounded-xl border border-cyan-300 dark:border-cyan-700 text-cyan-900 dark:text-cyan-100 font-bold text-base shadow-sm">
                  {letter}
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-between">
              <span>{language === 'en' ? 'Dissolution Frequency:' : language === 'ha' ? 'Adadin Karatun Tarwatsawa:' : 'Fréquence de Dissolution :'}</span>
              <span className="font-mono font-bold text-sm bg-cyan-200 dark:bg-cyan-900/80 px-3 py-1 rounded-lg">
                {repetitionCount} {language === 'en' ? 'times' : language === 'ha' ? 'sau' : 'fois'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white block">
              {language === 'en' ? 'Hermetic Cooling Mechanism:' : language === 'ha' ? 'Hanyar Kwantar da Wuta:' : 'Mécanisme d\'Apaisement Hermétique :'}
            </span>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Hostility and conflict carry fiery elemental heat. Al-Tafreeq applies cold element letters (Water & Earth) to balance and neutralize intense thermal friction.'
                : language === 'ha'
                ? 'Gaba da fushi suna dauke da zafi irin na wuta. Al-Tafreeq yana amfani da haruffa masu sanyi (Ruwa da Kasa) domin sanyaya fushin.'
                : 'Les conflits et la colère sont de nature élémentaire enflammée. Al-Tafreeq applique les lettres froides (Eau et Terre) pour équilibrer et éteindre la friction thermique.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
