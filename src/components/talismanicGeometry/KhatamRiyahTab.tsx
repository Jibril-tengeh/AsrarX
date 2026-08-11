import React, { useState, useMemo } from 'react';
import { Compass, Wind, Download, Info, Sparkles } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

interface KhatamRiyahTabProps {
  language: string;
}

interface WindData {
  id: string;
  directionFr: string;
  directionEn: string;
  directionHa: string;
  arabicName: string;
  transliteration: string;
  abjad: number;
  qualityFr: string;
  qualityEn: string;
  qualityHa: string;
  elementFr: string;
  elementEn: string;
  elementHa: string;
  angel: string;
  incenseFr: string;
  incenseEn: string;
  incenseHa: string;
  angle: number; // in degrees from North
}

const WINDS: WindData[] = [
  {
    id: 'N',
    directionFr: 'Nord (الشمال)',
    directionEn: 'North (Al-Shamal)',
    directionHa: 'Arewa (Al-Shamal)',
    arabicName: 'الشمال',
    transliteration: 'Al-Shamal',
    abjad: 371,
    qualityFr: 'Froid & Sec (Stabilité, Ancrage)',
    qualityEn: 'Cold & Dry (Stability, Grounding)',
    qualityHa: 'Sanyi da Bushewa',
    elementFr: 'Terre (الأرض)',
    elementEn: 'Earth',
    elementHa: 'Kasa',
    angel: 'Israfil (إسرافيل)',
    incenseFr: 'Myrrhe, Storax',
    incenseEn: 'Myrrh, Storax',
    incenseHa: 'Storax da Kamshi',
    angle: 0
  },
  {
    id: 'NE',
    directionFr: 'Nord-Est (النسيم)',
    directionEn: 'Northeast (Al-Naseem)',
    directionHa: 'Arewaci-Gabas (Al-Naseem)',
    arabicName: 'النسيم',
    transliteration: 'Al-Naseem',
    abjad: 165,
    qualityFr: 'Doux & Élevant (Inspiration, Bénédiction)',
    qualityEn: 'Soft & Elevating (Inspiration, Blessing)',
    qualityHa: 'Mai Taimako da Albarka',
    elementFr: 'Air-Terre',
    elementEn: 'Air-Earth',
    elementHa: 'Iska-Kasa',
    angel: 'Rukya\'il (روقيائيل)',
    incenseFr: 'Santal Blanc, Lavande',
    incenseEn: 'White Sandalwood, Lavender',
    incenseHa: 'Sandal Fari',
    angle: 45
  },
  {
    id: 'E',
    directionFr: 'Est (الصبا)',
    directionEn: 'East (Al-Saba)',
    directionHa: 'Gabas (Al-Saba)',
    arabicName: 'الصبا',
    transliteration: 'Al-Saba',
    abjad: 123,
    qualityFr: 'Chaud & Sec (Ouverture, Victoire, Joie)',
    qualityEn: 'Hot & Dry (Opening, Victory, Joy)',
    qualityHa: 'Zafi da Bushewa',
    elementFr: 'Air (الهواء)',
    elementEn: 'Air',
    elementHa: 'Iska',
    angel: 'Jibra\'il (جبرائيل)',
    incenseFr: 'Encens Mâle, Oliban',
    incenseEn: 'Frankincense, Olibanum',
    incenseHa: 'Turaren Wuta Oliban',
    angle: 90
  },
  {
    id: 'SE',
    directionFr: 'Sud-Est (السموم)',
    directionEn: 'Southeast (Al-Samoom)',
    directionHa: 'Kudanci-Gabas (Al-Samoom)',
    arabicName: 'السموم',
    transliteration: 'Al-Samoom',
    abjad: 177,
    qualityFr: 'Ardent & Purificateur (Dissolution)',
    qualityEn: 'Scorching & Purifying (Dissolution)',
    qualityHa: 'Mai Zafe Tsari',
    elementFr: 'Feu-Air',
    elementEn: 'Fire-Air',
    elementHa: 'Wuta-Iska',
    angel: 'Samsama\'il (سمسمائيل)',
    incenseFr: 'Camphre, Soufre Noble',
    incenseEn: 'Camphor, Noble Sulfur',
    incenseHa: 'Kafur da Turare',
    angle: 135
  },
  {
    id: 'S',
    directionFr: 'Sud (الجنوب)',
    directionEn: 'South (Al-Janub)',
    directionHa: 'Kudu (Al-Janub)',
    arabicName: 'الجنوب',
    transliteration: 'Al-Janub',
    abjad: 86,
    qualityFr: 'Chaud & Humide (Fertilité, Abondance)',
    qualityEn: 'Hot & Moist (Fertility, Abundance)',
    qualityHa: 'Zafi da Dumi',
    elementFr: 'Feu (النار)',
    elementEn: 'Fire',
    elementHa: 'Wuta',
    angel: 'Mika\'il (ميخائيل)',
    incenseFr: 'Oud, Ambre Gris',
    incenseEn: 'Oud, Ambergris',
    incenseHa: 'Turaren Oud da Ambre',
    angle: 180
  },
  {
    id: 'SW',
    directionFr: 'Sud-Ouest (الإعصار)',
    directionEn: 'Southwest (Al-I\'sar)',
    directionHa: 'Kudanci-Yamma (Al-I\'sar)',
    arabicName: 'الإعصار',
    transliteration: 'Al-I\'sar',
    abjad: 362,
    qualityFr: 'Puissant & Tourbillonnant (Bouclier)',
    qualityEn: 'Powerful & Swirling (Shield)',
    qualityHa: 'Iska Mai Karfi',
    elementFr: 'Eau-Feu',
    elementEn: 'Water-Fire',
    elementHa: 'Ruwa-Wuta',
    angel: 'Sarfya\'il (صرفيائيل)',
    incenseFr: 'Benjoin Rouge, Clou de Girofle',
    incenseEn: 'Red Benzoin, Clove',
    incenseHa: 'Turaren Benjoin',
    angle: 225
  },
  {
    id: 'W',
    directionFr: 'Ouest (الدبور)',
    directionEn: 'West (Al-Daboor)',
    directionHa: 'Yamma (Al-Daboor)',
    arabicName: 'الدبور',
    transliteration: 'Al-Daboor',
    abjad: 219,
    qualityFr: 'Froid & Humide (Introspection, Mystères)',
    qualityEn: 'Cold & Moist (Introspection, Mysteries)',
    qualityHa: 'Sanyi da Sumu',
    elementFr: 'Eau (الماء)',
    elementEn: 'Water',
    elementHa: 'Ruwa',
    angel: 'Anya\'il (عنيائيل)',
    incenseFr: 'Musc Noir, Rose Mystique',
    incenseEn: 'Black Musk, Mystic Rose',
    incenseHa: 'Musk Baki',
    angle: 270
  },
  {
    id: 'NW',
    directionFr: 'Nord-Ouest (الحرور)',
    directionEn: 'Northwest (Al-Haroor)',
    directionHa: 'Arewaci-Yamma (Al-Haroor)',
    arabicName: 'الحرور',
    transliteration: 'Al-Haroor',
    abjad: 254,
    qualityFr: 'Nocturne & Régénérateur (Clarté)',
    qualityEn: 'Nocturnal & Regenerative (Clarity)',
    qualityHa: 'Mai Natsuwa da Tsari',
    elementFr: 'Terre-Eau',
    elementEn: 'Earth-Water',
    elementHa: 'Kasa-Ruwa',
    angel: 'Kasma\'il (كسفيائيل)',
    incenseFr: 'Jasmin Nocturne, Menthile',
    incenseEn: 'Night Jasmine, Mint',
    incenseHa: 'Jasmin Fari',
    angle: 315
  }
];

export default function KhatamRiyahTab({ language }: KhatamRiyahTabProps) {
  const [selectedWindId, setSelectedWindId] = useState<string>('E');
  const [centerIntent, setCenterIntent] = useState<string>('سلام ورحمة');

  const selectedWind = useMemo(
    () => WINDS.find((w) => w.id === selectedWindId) || WINDS[2],
    [selectedWindId]
  );

  const centerAbjad = useMemo(() => calculateAbjadValue(centerIntent) || 0, [centerIntent]);
  const totalWindsAbjad = useMemo(() => WINDS.reduce((acc, curr) => acc + curr.abjad, 0), []);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('khatam-riyah-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatam_riyah_${selectedWind.transliteration}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-sky-100 dark:bg-sky-900/50 rounded-2xl text-sky-600 dark:text-sky-400">
          <Wind size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Khatam al-Riyah (Octagram of the 8 Cosmic Winds)'
              : language === 'ha'
              ? 'Hatimin Vents (Taqadiri na Iska 8 na Sama)'
              : 'Khatam al-Riyah (Octagramme des 8 Vents Traditionnels)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Arranges the Abjad weights and spiritual qualities of the 4 cardinal and 4 intercardinal winds around a central intent.'
              : language === 'ha'
              ? 'Kintsa lambobin Abjad na iskoki 8 masu gaba hudu da tsakiya.'
              : 'Dispose aux 8 directions cardinales les Abjads des noms des quatre vents traditionnels (Shamal, Janub, Saba, Daboor) et leurs 4 vents secondaires.'}
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Central Intent / Name:' : language === 'ha' ? 'Sunan Tsakiya:' : 'Nom / Intention au Cœur du Sceau :'}
          </label>
          <input
            type="text"
            value={centerIntent}
            onChange={(e) => setCenterIntent(e.target.value)}
            placeholder="ex: سلام ورحمة, فتح مبين..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base dir-rtl focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Focus Cosmic Wind Vector:' : language === 'ha' ? 'Zabi Iska:' : 'Sélectionner une Direction du Vent :'}
          </label>
          <select
            value={selectedWindId}
            onChange={(e) => setSelectedWindId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-sky-500 outline-none"
          >
            {WINDS.map((w) => (
              <option key={w.id} value={w.id}>
                {language === 'en' ? w.directionEn : language === 'ha' ? w.directionHa : w.directionFr} - Abjad: {w.abjad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SVG Compass & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Octagram Wind Rose (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-950 rounded-3xl border border-sky-500/30 relative shadow-2xl">
          <svg id="khatam-riyah-svg" viewBox="0 0 500 500" className="w-full max-w-[420px] h-auto drop-shadow-2xl">
            <defs>
              <radialGradient id="skyGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="250" cy="250" r="230" fill="url(#skyGlow)" />
            <circle cx="250" cy="250" r="210" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="#0284c7" strokeWidth="2" />
            <circle cx="250" cy="250" r="85" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />

            {/* Octagram Star Lines */}
            {WINDS.map((w, idx) => {
              const rad = (w.angle * Math.PI) / 180;
              const xFar = 250 + 180 * Math.sin(rad);
              const yFar = 250 - 180 * Math.cos(rad);
              return <line key={idx} x1="250" y1="250" x2={xFar} y2={yFar} stroke="#0284c7" strokeWidth="1" opacity="0.6" />;
            })}

            {/* Central Text */}
            <text x="250" y="242" textAnchor="middle" fill="#7dd3fc" fontSize="15" fontFamily="serif" fontWeight="bold">
              {centerIntent}
            </text>
            <text x="250" y="265" textAnchor="middle" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
              Abjad: {centerAbjad}
            </text>

            {/* 8 Wind Nodes */}
            {WINDS.map((w) => {
              const rad = (w.angle * Math.PI) / 180;
              const x = 250 + 180 * Math.sin(rad);
              const y = 250 - 180 * Math.cos(rad);
              const isSelected = w.id === selectedWindId;

              return (
                <g key={w.id} className="cursor-pointer" onClick={() => setSelectedWindId(w.id)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 22 : 17}
                    fill={isSelected ? '#0284c7' : '#1e293b'}
                    stroke={isSelected ? '#7dd3fc' : '#38bdf8'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#bae6fd'}
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {w.arabicName}
                  </text>
                </g>
              );
            })}
          </svg>

          <button
            onClick={handleDownloadSVG}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Download size={14} />
            <span>{language === 'en' ? 'Download Wind Compass SVG' : 'Télécharger le Sceau des Vents (SVG)'}</span>
          </button>
        </div>

        {/* Selected Wind Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-sky-50/70 dark:bg-sky-950/30 border-2 border-sky-300 dark:border-sky-700 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-800 pb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  {language === 'en' ? 'Wind Direction Details' : 'Propriétés du Vent Céleste'}
                </span>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {language === 'en' ? selectedWind.directionEn : language === 'ha' ? selectedWind.directionHa : selectedWind.directionFr}
                </h3>
              </div>
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-serif">
                {selectedWind.arabicName}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-sky-200/50 dark:border-sky-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Abjad Weight:' : 'Poids Abjad :'}</span>
                <span className="font-mono font-extrabold text-sky-600 dark:text-sky-400 text-sm">{selectedWind.abjad}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-200/50 dark:border-sky-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Thermal/Moisture Quality:' : 'Qualité Thermique :'}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? selectedWind.qualityEn : language === 'ha' ? selectedWind.qualityHa : selectedWind.qualityFr}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-200/50 dark:border-sky-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Element:' : 'Élément :'}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? selectedWind.elementEn : language === 'ha' ? selectedWind.elementHa : selectedWind.elementFr}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-200/50 dark:border-sky-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Angelic Guard:' : 'Ange Guardien :'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedWind.angel}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">{language === 'en' ? 'Recommended Incense:' : 'Encens Associé :'}</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {language === 'en' ? selectedWind.incenseEn : language === 'ha' ? selectedWind.incenseHa : selectedWind.incenseFr}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs">
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Total 8 Winds Abjad Weight:' : 'Poids Abjad Cumulé des 8 Vents :'}
            </span>
            <p className="text-base font-mono font-black text-sky-600 dark:text-sky-400 mt-1">
              {totalWindsAbjad} + {centerAbjad} = {totalWindsAbjad + centerAbjad}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
