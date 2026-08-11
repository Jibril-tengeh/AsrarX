import React, { useState, useMemo } from 'react';
import { Sparkles, Star, RotateCcw, Download, Info, ShieldAlert, Compass } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

interface KhatamBurujTabProps {
  language: string;
}

interface ZodiacSign {
  id: number;
  nameFr: string;
  nameEn: string;
  nameHa: string;
  arabicName: string;
  abjad: number;
  elementFr: 'Feu' | 'Terre' | 'Air' | 'Eau';
  elementEn: 'Fire' | 'Earth' | 'Air' | 'Water';
  elementHa: 'Wuta' | 'Kasa' | 'Iska' | 'Ruwa';
  planetFr: string;
  planetEn: string;
  planetHa: string;
  angelFr: string;
  angelEn: string;
  angelHa: string;
  color: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 1, nameFr: "Bélier (Al-Hamal)", nameEn: "Aries (Al-Hamal)", nameHa: "Al-Hamal (Bélier)", arabicName: "الحمل", abjad: 88, elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", planetFr: "Mars (المريخ)", planetEn: "Mars", planetHa: "Mrikh", angelFr: "Samsama'il", angelEn: "Samsamail", angelHa: "Samsama'il", color: "#ef4444" },
  { id: 2, nameFr: "Taureau (Al-Thawr)", nameEn: "Taurus (Al-Thawr)", nameHa: "Al-Thawr (Taureau)", arabicName: "الثور", abjad: 707, elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", planetFr: "Vénus (الزهراء)", planetEn: "Venus", planetHa: "Zuhara", angelFr: "Anya'il", angelEn: "Anyail", angelHa: "Anya'il", color: "#10b981" },
  { id: 3, nameFr: "Gémeaux (Al-Jawza')", nameEn: "Gemini (Al-Jawza')", nameHa: "Al-Jawza' (Gémeaux)", arabicName: "الجوزاء", abjad: 58, elementFr: "Air", elementEn: "Air", elementHa: "Iska", planetFr: "Mercure (عطارد)", planetEn: "Mercury", planetHa: "Utarid", angelFr: "Rukya'il", angelEn: "Rukyail", angelHa: "Rukya'il", color: "#3b82f6" },
  { id: 4, nameFr: "Cancer (Al-Saratan)", nameEn: "Cancer (Al-Saratan)", nameHa: "Al-Saratan (Cancer)", arabicName: "السرطان", abjad: 360, elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", planetFr: "Lune (القمر)", planetEn: "Moon", planetHa: "Qamar", angelFr: "Jibra'il", angelEn: "Gabriel", angelHa: "Jibril", color: "#06b6d4" },
  { id: 5, nameFr: "Lion (Al-Asad)", nameEn: "Leo (Al-Asad)", nameHa: "Al-Asad (Lion)", arabicName: "الأسد", abjad: 95, elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", planetFr: "Soleil (الشمس)", planetEn: "Sun", planetHa: "Shams", angelFr: "Mika'il", angelEn: "Michael", angelHa: "Mikail", color: "#f59e0b" },
  { id: 6, nameFr: "Vierge (Al-Sunbulah)", nameEn: "Virgo (Al-Sunbulah)", nameHa: "Al-Sunbulah (Vierge)", arabicName: "السنبلة", abjad: 168, elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", planetFr: "Mercure (عطارد)", planetEn: "Mercury", planetHa: "Utarid", angelFr: "Sarfya'il", angelEn: "Sarfyail", angelHa: "Sarfya'il", color: "#059669" },
  { id: 7, nameFr: "Balance (Al-Mizan)", nameEn: "Libra (Al-Mizan)", nameHa: "Al-Mizan (Balance)", arabicName: "الميزان", abjad: 118, elementFr: "Air", elementEn: "Air", elementHa: "Iska", planetFr: "Vénus (الزهراء)", planetEn: "Venus", planetHa: "Zuhara", angelFr: "Anya'il", angelEn: "Anyail", angelHa: "Anya'il", color: "#60a5fa" },
  { id: 8, nameFr: "Scorpion (Al-'Aqrab)", nameEn: "Scorpio (Al-'Aqrab)", nameHa: "Al-'Aqrab (Scorpion)", arabicName: "العقرب", abjad: 383, elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", planetFr: "Mars (المريخ)", planetEn: "Mars", planetHa: "Mrikh", angelFr: "Azra'il", angelEn: "Azrael", angelHa: "Azra'il", color: "#0284c7" },
  { id: 9, nameFr: "Sagittaire (Al-Qaws)", nameEn: "Sagittarius (Al-Qaws)", nameHa: "Al-Qaws (Sagittaire)", arabicName: "القوس", abjad: 197, elementFr: "Feu", elementEn: "Fire", elementHa: "Wuta", planetFr: "Jupiter (المشتري)", planetEn: "Jupiter", planetHa: "Mushtari", angelFr: "Kashfiya'il", angelEn: "Kashfiyail", angelHa: "Kashfiya'il", color: "#d97706" },
  { id: 10, nameFr: "Capricorne (Al-Jady)", nameEn: "Capricorn (Al-Jady)", nameHa: "Al-Jady (Capricorne)", arabicName: "الجدي", abjad: 47, elementFr: "Terre", elementEn: "Earth", elementHa: "Kasa", planetFr: "Saturne (زحل)", planetEn: "Saturn", planetHa: "Zuhal", angelFr: "Kasma'il", angelEn: "Kasmail", angelHa: "Kasma'il", color: "#047857" },
  { id: 11, nameFr: "Verseau (Al-Dalw)", nameEn: "Aquarius (Al-Dalw)", nameHa: "Al-Dalw (Verseau)", arabicName: "الدلو", abjad: 41, elementFr: "Air", elementEn: "Air", elementHa: "Iska", planetFr: "Saturne (زحل)", planetEn: "Saturn", planetHa: "Zuhal", angelFr: "Kasma'il", angelEn: "Kasmail", angelHa: "Kasma'il", color: "#2563eb" },
  { id: 12, nameFr: "Poissons (Al-Hut)", nameEn: "Pisces (Al-Hut)", nameHa: "Al-Hut (Poissons)", arabicName: "الحوت", abjad: 419, elementFr: "Eau", elementEn: "Water", elementHa: "Ruwa", planetFr: "Jupiter (المشتري)", planetEn: "Jupiter", planetHa: "Mushtari", angelFr: "Israfil", angelEn: "Israfil", angelHa: "Israfil", color: "#0891b2" },
];

export default function KhatamBurujTab({ language }: KhatamBurujTabProps) {
  const [selectedSignId, setSelectedSignId] = useState<number>(1);
  const [personName, setPersonName] = useState<string>('');
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const selectedSign = useMemo(
    () => ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0],
    [selectedSignId]
  );

  // Ascendant calculation based on person's name Abjad % 12
  const nameAbjad = useMemo(() => calculateAbjadValue(personName) || 0, [personName]);
  const calculatedSign = useMemo(() => {
    if (!nameAbjad) return null;
    const signIndex = (nameAbjad % 12) || 12;
    return ZODIAC_SIGNS.find((s) => s.id === signIndex) || ZODIAC_SIGNS[0];
  }, [nameAbjad]);

  // Total Hexagram Abjad Sum
  const totalHexagramAbjad = useMemo(
    () => ZODIAC_SIGNS.reduce((acc, curr) => acc + curr.abjad, 0),
    []
  );

  // Handle SVG Download
  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('khatam-buruj-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khatam_al_buruj_${selectedSign.arabicName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl text-amber-600 dark:text-amber-400">
          <Star size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Khatam al-Buruj (Zodiacal Hexagram & Star)'
              : language === 'ha'
              ? 'Hatimin Buruj (Taurari da Siffar Hexagram)'
              : 'Khatam al-Buruj (Hexagramme Zodiacal & Sceau des 12 Signes)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Arranges the Abjad values and governing spirits of the 12 ascending zodiacal signs along the vertices of a sacred star.'
              : language === 'ha'
              ? 'Shirya lambobin Abjad da aljannun gidan taurari 12 a kusurwoyin hatimi.'
              : 'Dispose l\'Abjad des signes zodiacaux ascendants aux sommets d\'une étoile sacrée à 12 branches avec leurs gouverneurs spirituels.'}
          </p>
        </div>
      </div>

      {/* Inputs & Ascendant Finder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en'
              ? 'Find Ascendant Zodiac Sign by Name:'
              : language === 'ha'
              ? 'Nemi Buruj Ta Hanyar Suna:'
              : 'Trouver le Signe Ascendant par le Nom (Nom + Mère):'}
          </label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder={
              language === 'en' ? 'e.g. Ahmad bin Maryam' : language === 'ha' ? 'Misali: Ahmad dan Maryam' : 'ex: Ahmad bint Maryam'
            }
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
          {calculatedSign && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-amber-900 dark:text-amber-200 font-bold">
              <span>
                {language === 'en' ? 'Calculated Ascendant Sign:' : language === 'ha' ? 'Tauraronka Na Asali:' : 'Signe Ascendant Calculé :'} {calculatedSign.arabicName} ({calculatedSign.nameFr})
              </span>
              <button
                onClick={() => setSelectedSignId(calculatedSign.id)}
                className="px-2.5 py-1 bg-amber-600 text-white text-[11px] rounded-lg hover:bg-amber-500 transition-all cursor-pointer"
              >
                {language === 'en' ? 'Select Sign' : language === 'ha' ? 'Zaba' : 'Sélectionner'}
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Directly Select Zodiac Sign:' : language === 'ha' ? 'Zabi Tauraro:' : 'Sélectionner Directement un Signe:'}
          </label>
          <select
            value={selectedSignId}
            onChange={(e) => setSelectedSignId(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {language === 'en' ? s.nameEn : language === 'ha' ? s.nameHa : s.nameFr} ({s.arabicName}) - Abjad: {s.abjad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive SVG Seal Canvas & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Star Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-amber-500/30 relative">
          <svg
            id="khatam-buruj-svg"
            viewBox="0 0 500 500"
            className="w-full max-w-[420px] h-auto drop-shadow-2xl transition-transform duration-700"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            <defs>
              <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Glow */}
            <circle cx="250" cy="250" r="230" fill="url(#goldGlow)" />

            {/* Concentric Outer Circles */}
            <circle cx="250" cy="250" r="220" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
            <circle cx="250" cy="250" r="200" fill="none" stroke="#d97706" strokeWidth="3" />
            <circle cx="250" cy="250" r="140" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="80" fill="#0f172a" stroke="#d97706" strokeWidth="2" />

            {/* Dodecagram / Hexagram Interconnecting Lines */}
            {ZODIAC_SIGNS.map((s, idx) => {
              const angle1 = (idx * 30 * Math.PI) / 180;
              const angle2 = (((idx + 5) % 12) * 30 * Math.PI) / 180;
              const angle3 = (((idx + 7) % 12) * 30 * Math.PI) / 180;
              const r = 200;
              const x1 = 250 + r * Math.sin(angle1);
              const y1 = 250 - r * Math.cos(angle1);
              const x2 = 250 + r * Math.sin(angle2);
              const y2 = 250 - r * Math.cos(angle2);
              const x3 = 250 + r * Math.sin(angle3);
              const y3 = 250 - r * Math.cos(angle3);

              return (
                <g key={idx}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="0.8" opacity="0.4" />
                  <line x1={x1} y1={y1} x2={x3} y2={y3} stroke="#d97706" strokeWidth="0.8" opacity="0.4" />
                </g>
              );
            })}

            {/* Central Abjad Sum & Symbol */}
            <text x="250" y="240" textAnchor="middle" fill="#fef08a" fontSize="16" fontFamily="serif" fontWeight="bold">
              {selectedSign.arabicName}
            </text>
            <text x="250" y="265" textAnchor="middle" fill="#f59e0b" fontSize="13" fontFamily="monospace" fontWeight="bold">
              Abjad: {selectedSign.abjad}
            </text>

            {/* 12 Vertices with Zodiac Signs */}
            {ZODIAC_SIGNS.map((s, idx) => {
              const angle = (idx * 30 * Math.PI) / 180;
              const rPos = 200;
              const x = 250 + rPos * Math.sin(angle);
              const y = 250 - rPos * Math.cos(angle);
              const isSelected = s.id === selectedSignId;

              return (
                <g key={s.id} className="cursor-pointer" onClick={() => setSelectedSignId(s.id)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 20 : 16}
                    fill={isSelected ? '#f59e0b' : '#1e293b'}
                    stroke={isSelected ? '#fef08a' : s.color}
                    strokeWidth={isSelected ? '3' : '2'}
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {s.arabicName}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setRotationAngle((prev) => prev + 30)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>{language === 'en' ? 'Rotate Star (+30°)' : language === 'ha' ? 'Juyawa (+30°)' : 'Pivoter l\'Étoile (+30°)'}</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download size={14} />
              <span>{language === 'en' ? 'Download SVG Seal' : language === 'ha' ? 'Sauke Hatimi (SVG)' : 'Télécharger le Sceau (SVG)'}</span>
            </button>
          </div>
        </div>

        {/* Selected Sign Details Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800 pb-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {language === 'en' ? 'Selected Zodiacal Vertex' : language === 'ha' ? 'Zababben Tauraro' : 'Sommet Zodiacal Sélectionné'}
                </span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {language === 'en' ? selectedSign.nameEn : language === 'ha' ? selectedSign.nameHa : selectedSign.nameFr}
                </h3>
              </div>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 dir-rtl font-serif">
                {selectedSign.arabicName}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Abjad Weight:' : 'Poids Abjad :'}</span>
                <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">{selectedSign.abjad}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Elemental Nature:' : 'Nature Élémentaire :'}</span>
                <span className="font-bold text-gray-900 dark:text-white" style={{ color: selectedSign.color }}>
                  {language === 'en' ? selectedSign.elementEn : language === 'ha' ? selectedSign.elementHa : selectedSign.elementFr}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
                <span className="text-gray-500">{language === 'en' ? 'Governing Planet:' : 'Planète Gouvernante :'}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {language === 'en' ? selectedSign.planetEn : language === 'ha' ? selectedSign.planetHa : selectedSign.planetFr}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">{language === 'en' ? 'Angelic Governor:' : 'Ange Gouverneur :'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSign.angelFr}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs space-y-1">
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Total Ring Abjad Sum:' : language === 'ha' ? 'Jimlar Abjad na Taurari 12:' : 'Somme Abjad Totale du Ring Zodiacal :'}
            </span>
            <p className="text-lg font-mono font-black text-amber-600 dark:text-amber-400">
              {totalHexagramAbjad} <span className="text-xs font-normal text-gray-500">(Lumière des 12 Sphères Célestes)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
