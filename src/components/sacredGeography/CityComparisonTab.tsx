import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Flame, Wind, Droplets, Mountain, Sparkles, MapPin, Compass } from 'lucide-react';
import { WORLD_CITIES, WorldCity } from '../../data/worldCities';
import { calculateAbjadValue } from '../../utils/abjad';

interface CityComparisonTabProps {
  language: string;
  city1Name: string;
  lat1: number;
  lng1: number;
}

function decimalToDMS(deg: number) {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60);
  return `${degrees}° ${minutes}' ${seconds}"`;
}

function calculateGeodesy(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const y = Math.sin(dLon) * Math.cos(radLat2);
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;

  return { distanceKm, azimuthDeg: brng };
}

function calculateElementalDistribution(text: string) {
  const fireChars = ['ا', 'أ', 'إ', 'آ', 'ه', 'ة', 'ط', 'م', 'ف', 'ش', 'ذ'];
  const airChars = ['ب', 'و', 'ي', 'ن', 'ص', 'ت', 'ض'];
  const waterChars = ['ج', 'ز', 'ك', 'س', 'ق', 'ث', 'ظ'];
  const earthChars = ['د', 'ح', 'ل', 'ع', 'ر', 'خ', 'غ'];

  let fire = 0, air = 0, water = 0, earth = 0;
  for (const char of text) {
    if (fireChars.includes(char)) fire++;
    else if (airChars.includes(char)) air++;
    else if (waterChars.includes(char)) water++;
    else if (earthChars.includes(char)) earth++;
  }
  const total = fire + air + water + earth || 1;
  return {
    firePct: Math.round((fire / total) * 100),
    airPct: Math.round((air / total) * 100),
    waterPct: Math.round((water / total) * 100),
    earthPct: Math.round((earth / total) * 100),
  };
}

const PLANET_RULERS = [
  { id: 1, nameFr: 'Soleil (الشمس)', nameEn: 'Sun (Shams)', incenseFr: 'Oudh & Safran', element: 'Feu' },
  { id: 2, nameFr: 'Lune (القمر)', nameEn: 'Moon (Qamar)', incenseFr: 'Camphre & Musc Blanc', element: 'Eau' },
  { id: 3, nameFr: 'Mars (المريخ)', nameEn: 'Mars (Mrikh)', incenseFr: 'Harmal & Sang-de-dragon', element: 'Feu' },
  { id: 4, nameFr: 'Mercure (عطارد)', nameEn: 'Mercury (Utarid)', incenseFr: 'Mastic & Benjoin', element: 'Air' },
  { id: 5, nameFr: 'Jupiter (المشتري)', nameEn: 'Jupiter (Mushtari)', incenseFr: 'Santal & Ambre', element: 'Air' },
  { id: 6, nameFr: 'Vénus (الزهراء)', nameEn: 'Venus (Zuhara)', incenseFr: 'Eau de Rose & Jasmin', element: 'Eau' },
  { id: 7, nameFr: 'Saturne (زحل)', nameEn: 'Saturn (Zuhal)', incenseFr: 'Myrrhe & Lubān Dhakar', element: 'Terre' },
];

export default function CityComparisonTab({
  language,
  city1Name,
  lat1,
  lng1,
}: CityComparisonTabProps) {
  const [city2Id, setCity2Id] = useState<string>('fez');

  const city2 = useMemo(
    () => WORLD_CITIES.find((c) => c.id === city2Id) || WORLD_CITIES[1],
    [city2Id]
  );

  // Makkah Coordinates for Qibla
  const makkahLat = 21.4225;
  const makkahLng = 39.8262;

  // City 1 Calculations
  const abjad1 = useMemo(() => calculateAbjadValue(city1Name) || 120, [city1Name]);
  const qibla1 = useMemo(() => calculateGeodesy(lat1, lng1, makkahLat, makkahLng), [lat1, lng1]);
  const elem1 = useMemo(() => calculateElementalDistribution(city1Name), [city1Name]);
  const ruler1 = useMemo(() => PLANET_RULERS[(abjad1 % 7) || 0], [abjad1]);

  // City 2 Calculations
  const city2Name = language === 'en' ? city2.nameEn : language === 'ha' ? city2.nameHa : city2.nameFr;
  const abjad2 = useMemo(() => calculateAbjadValue(city2.arabicName) || 140, [city2]);
  const qibla2 = useMemo(
    () => calculateGeodesy(city2.lat, city2.lng, makkahLat, makkahLng),
    [city2]
  );
  const elem2 = useMemo(() => calculateElementalDistribution(city2.arabicName), [city2]);
  const ruler2 = useMemo(() => PLANET_RULERS[(abjad2 % 7) || 0], [abjad2]);

  // Distance between City 1 and City 2
  const distanceBetween = useMemo(
    () => calculateGeodesy(lat1, lng1, city2.lat, city2.lng),
    [lat1, lng1, city2]
  );

  // Spiritual Compatibility Score
  const compatibilityScore = useMemo(() => {
    const diffAbjad = Math.abs((abjad1 % 100) - (abjad2 % 100));
    const score = Math.max(35, 100 - diffAbjad * 0.9 - distanceBetween.distanceKm / 400);
    return Math.round(score);
  }, [abjad1, abjad2, distanceBetween]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight size={20} className="text-amber-500" />
            <span>
              {language === 'en'
                ? 'Geographic & Esoteric City Comparison'
                : language === 'ha'
                ? 'Kwatancen Birane Biyu'
                : 'Matrice de Comparaison Géographique & Tellurique'}
            </span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Side-by-side analysis of two locations: Abjad weight, Qibla alignment, elemental soil balance, and spiritual affinity.'
              : 'Analyse comparative côte à côte : poids d\'Abjad, alignement Qibla, équilibre des éléments et affinité spirituelle.'}
          </p>
        </div>

        {/* City #2 Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'Select City #2:' : 'Comparer avec Ville #2:'}
          </label>
          <select
            value={city2Id}
            onChange={(e) => setCity2Id(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {WORLD_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.nameFr} ({c.arabicName}) - {c.countryFr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CITY #1 CARD */}
        <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/50 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 dark:border-amber-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Ville #1 (Principale)
              </span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-amber-500" />
                <span>{city1Name}</span>
              </h3>
            </div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-serif dir-rtl">
              {city1Name}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
              <span className="text-gray-500">Coordonnées:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{lat1}° N, {lng1}° E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
              <span className="text-gray-500">Poids Abjad Nom:</span>
              <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">{abjad1}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
              <span className="text-gray-500">Distance La Mecque (Qibla):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{qibla1.distanceKm.toFixed(0)} km</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
              <span className="text-gray-500">Angle de la Qibla:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{qibla1.azimuthDeg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-200/50 dark:border-amber-800/30">
              <span className="text-gray-500">Planète Gouvernante du Sol:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{ruler1.nameFr}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Encens / Bukhoor Recommandé:</span>
              <span className="font-bold text-amber-800 dark:text-amber-300">{ruler1.incenseFr}</span>
            </div>
          </div>

          {/* Elemental Distribution */}
          <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-amber-200 dark:border-amber-800/40 space-y-2">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Éléments de la Ville #1
            </p>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
              <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600">Feu {elem1.firePct}%</div>
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600">Air {elem1.airPct}%</div>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">Eau {elem1.waterPct}%</div>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">Terre {elem1.earthPct}%</div>
            </div>
          </div>
        </div>

        {/* CITY #2 CARD */}
        <div className="p-5 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border-2 border-indigo-300 dark:border-indigo-700/50 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Ville #2 (Comparaison)
              </span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>{city2.flag}</span>
                <span>{city2Name}</span>
              </h3>
            </div>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-serif dir-rtl">
              {city2.arabicName}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-gray-500">Coordonnées:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{city2.lat}° N, {city2.lng}° E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-gray-500">Poids Abjad Nom:</span>
              <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{abjad2}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-gray-500">Distance La Mecque (Qibla):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{qibla2.distanceKm.toFixed(0)} km</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-gray-500">Angle de la Qibla:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{qibla2.azimuthDeg.toFixed(1)}°</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-200/50 dark:border-indigo-800/30">
              <span className="text-gray-500">Planète Gouvernante du Sol:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{ruler2.nameFr}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Encens / Bukhoor Recommandé:</span>
              <span className="font-bold text-indigo-800 dark:text-indigo-300">{ruler2.incenseFr}</span>
            </div>
          </div>

          {/* Elemental Distribution */}
          <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 space-y-2">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Éléments de la Ville #2
            </p>
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
              <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600">Feu {elem2.firePct}%</div>
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600">Air {elem2.airPct}%</div>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">Eau {elem2.waterPct}%</div>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">Terre {elem2.earthPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Comparison Score Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-amber-500/40 text-center text-white space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400">
          <Sparkles size={16} />
          <span>Indice d'Affinité Spirituelle & Tellurique entre {city1Name} et {city2Name}</span>
        </div>
        <div className="text-4xl sm:text-5xl font-black text-amber-300">
          {compatibilityScore} / 100
        </div>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">
          Nisa de séparation directe: <strong className="text-emerald-400">{distanceBetween.distanceKm.toFixed(0)} km</strong>.
          {compatibilityScore > 75
            ? ' Harmonie vibratoire élevée et résonance tellurique très favorable.'
            : ' Résonance complémentaire idéale pour les échanges et travaux de protection.'}
        </p>
      </div>
    </div>
  );
}
