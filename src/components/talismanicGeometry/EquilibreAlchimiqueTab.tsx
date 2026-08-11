import React, { useState, useMemo } from 'react';
import { Grid, Sparkles, Download, Info, Compass, RefreshCw } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

interface EquilibreAlchimiqueTabProps {
  language: string;
}

export default function EquilibreAlchimiqueTab({ language }: EquilibreAlchimiqueTabProps) {
  const [locationName, setLocationName] = useState<string>('Demeure de Paix');
  const [imbalanceType, setImbalanceType] = useState<'damp_cold' | 'hot_dry' | 'cold_dry' | 'neutral'>('damp_cold');

  const locationAbjad = useMemo(() => calculateAbjadValue(locationName) || 100, [locationName]);

  // Generate 4x4 Matrix for Thermal-Moisture Equilibrium
  const grid4x4 = useMemo(() => {
    const base = Math.floor(locationAbjad / 16) || 10;
    const rem = locationAbjad % 16;

    // 4x4 Magic Square Base (Al-Khatim Al-Murabba) with elemental offsets
    const baseSquare = [
      [16 + base, 2 + base, 3 + base, 13 + base + rem],
      [5 + base, 11 + base, 10 + base, 8 + base],
      [9 + base, 7 + base, 6 + base, 12 + base],
      [4 + base, 14 + base, 15 + base, 1 + base]
    ];

    // Rows represent 4 Alchemical Qualities: Chaud (Heat), Froid (Cold), Sec (Dry), Humide (Moist)
    return baseSquare;
  }, [locationAbjad]);

  // Quadrant Orientations for the Room (4 Corners)
  const quadrants = [
    {
      cornerFr: 'Coin Nord-Est (Feu / Chaud)',
      cornerEn: 'Northeast Corner (Fire / Hot)',
      cornerHa: 'Arewa-Gabas (Wuta / Zafi)',
      element: 'Feu (الحرارة)',
      qualityFr: 'Harmonie Thermique',
      qualityEn: 'Thermal Harmony',
      incenseFr: 'Oliban Mâle, Benjoin Rouge',
      incenseEn: 'Frankincense, Red Benzoin',
      incenseHa: 'Oliban da Benjoin',
      stoneFr: 'Cornaline & Jaspe Rouge',
      stoneEn: 'Carnelian & Red Jasper',
      stoneHa: 'Dutsen Carnelian'
    },
    {
      cornerFr: 'Coin Nord-Ouest (Air / Sec)',
      cornerEn: 'Northwest Corner (Air / Dry)',
      cornerHa: 'Arewa-Yamma (Iska / Bushewa)',
      element: 'Air (اليُبوسة)',
      qualityFr: 'Ancrage de la Sécheresse Noble',
      qualityEn: 'Grounding Noble Dryness',
      incenseFr: 'Santal Blanc, Lavande',
      incenseEn: 'White Sandalwood, Lavender',
      incenseHa: 'Sandal Fari',
      stoneFr: 'Quartz Blanc & Citrine',
      stoneEn: 'Clear Quartz & Citrine',
      stoneHa: 'Dutsen Quartz'
    },
    {
      cornerFr: 'Coin Sud-Est (Terre / Froid)',
      cornerEn: 'Southeast Corner (Earth / Cold)',
      cornerHa: 'Kudu-Gabas (Kasa / Sanyi)',
      element: 'Terre (البرودة)',
      qualityFr: 'Apaisement du Froid',
      qualityEn: 'Soothing of Coldness',
      incenseFr: 'Myrrhe, Storax',
      incenseEn: 'Myrrh, Storax',
      incenseHa: 'Storax',
      stoneFr: 'Agate Noire & Hématite',
      stoneEn: 'Black Agate & Hematite',
      stoneHa: 'Agate Baki'
    },
    {
      cornerFr: 'Coin Sud-Ouest (Eau / Humide)',
      cornerEn: 'Southwest Corner (Water / Moist)',
      cornerHa: 'Kudu-Yamma (Ruwa / Dumi)',
      element: 'Eau (الرطوبة)',
      qualityFr: 'Régulation de l\'Humidité',
      qualityEn: 'Moisture Balance',
      incenseFr: 'Musk Noir, Ambre Gris',
      incenseEn: 'Black Musk, Ambergris',
      incenseHa: 'Musk Baki',
      stoneFr: 'Lapis-Lazuli & Jade',
      stoneEn: 'Lapis Lazuli & Jade',
      stoneHa: 'Lapis-Lazuli'
    }
  ];

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('equilibre-4x4-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `equilibre_alchimique_${locationName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
          <Grid size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Spatial Alchemical Equilibrium (4x4 Matrix)'
              : language === 'ha'
              ? 'Daituwar Alchimie na Muhalli (Gidan Wafq 4x4)'
              : 'Équilibre Alchimique Spatial (Grille 4x4 Harmonisation Chaud/Froid/Sec/Humide)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Calculates a 4x4 matrix to balance the thermal and moisture qualities (Hot, Cold, Dry, Moist) of a home or location.'
              : language === 'ha'
              ? 'Gidan wafq 4x4 na daitawa tsakanin zafi, sanyi, bushewa da dumi na daki ko gida.'
              : 'Grille 4x4 calculée pour harmoniser le rapport chaud/froid et sec/humide d\'un lieu (maison, chambre, bureau) selon l\'Abjad du lieu.'}
          </p>
        </div>
      </div>

      {/* Location Input & Diagnosis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Location / Room Name:' : language === 'ha' ? 'Sunan Muhalli / Daki:' : 'Nom du Lieu / Maison / Bureau :'}
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="ex: Demeure de Paix, Bureau Fès..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Location Imbalance Diagnosis:' : language === 'ha' ? 'Musa ta Muhalli:' : 'Diagnostic du Déséquilibre Foncier :'}
          </label>
          <select
            value={imbalanceType}
            onChange={(e) => setImbalanceType(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="damp_cold">
              {language === 'en' ? 'Excess Dampness & Cold (Requires Heat/Dryness)' : 'Excès d\'Humidité & Froid (Nécessite Chaleur & Sécheresse)'}
            </option>
            <option value="hot_dry">
              {language === 'en' ? 'Excess Heat & Dryness (Requires Moisture/Cold)' : 'Excès de Chaleur & Sécheresse (Nécessite Humidité & Fraîcheur)'}
            </option>
            <option value="cold_dry">
              {language === 'en' ? 'Cold Dryness & Stagnation' : 'Sécheresse Froide & Stagnation Énergétique'}
            </option>
            <option value="neutral">
              {language === 'en' ? 'Preventive Global Harmonization' : 'Harmonisation Globale Préventive'}
            </option>
          </select>
        </div>
      </div>

      {/* Grid 4x4 Visualizer & Spatial Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 4x4 Matrix Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 rounded-3xl border border-emerald-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>{language === 'en' ? '4x4 Equilibrium Matrix' : 'Grille 4x4 d\'Harmonisation Alchimique'}</span>
          </div>

          <svg id="equilibre-4x4-svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl">
            <rect x="10" y="10" width="300" height="300" rx="16" fill="#064e3b" stroke="#34d399" strokeWidth="3" />

            {/* Grid 4x4 Lines */}
            {[1, 2, 3].map((i) => (
              <g key={i}>
                <line x1={10 + i * 75} y1="10" x2={10 + i * 75} y2="310" stroke="#10b981" strokeWidth="1.5" />
                <line x1="10" y1={10 + i * 75} x2="310" y2={10 + i * 75} stroke="#10b981" strokeWidth="1.5" />
              </g>
            ))}

            {/* Numbers */}
            {grid4x4.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <text
                  key={`${rIdx}-${cIdx}`}
                  x={10 + cIdx * 75 + 37.5}
                  y={10 + rIdx * 75 + 45}
                  textAnchor="middle"
                  fill="#ecfdf5"
                  fontSize="16"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {val}
                </text>
              ))
            )}
          </svg>

          <div className="text-xs text-emerald-200 font-mono">
            {language === 'en' ? 'Abjad Location Sum:' : 'Poids Abjad du Lieu :'} <span className="font-bold text-amber-300">{locationAbjad}</span>
          </div>

          <button
            onClick={handleDownloadSVG}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Download 4x4 Matrix SVG' : 'Télécharger la Grille (SVG)'}</span>
          </button>
        </div>

        {/* 4 Corner Spatial Quadrants (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {language === 'en' ? 'Spatial Placement in the 4 Corners of the Room:' : 'Disposition dans les 4 Coins de la Pièce :'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quadrants.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 space-y-2 transition-all"
              >
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1.5">
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                    {language === 'en' ? q.cornerEn : language === 'ha' ? q.cornerHa : q.cornerFr}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    {q.element}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>
                    <span className="text-gray-500">{language === 'en' ? 'Incense:' : 'Encens :'} </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {language === 'en' ? q.incenseEn : language === 'ha' ? q.incenseHa : q.incenseFr}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{language === 'en' ? 'Stone/Mineral:' : 'Pierre/Minéral :'} </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {language === 'en' ? q.stoneEn : language === 'ha' ? q.stoneHa : q.stoneFr}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
