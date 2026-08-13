import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Navigation, Sparkles, Clock, Info, RotateCcw } from 'lucide-react';
import { DiscretionTranslation } from './discretionTranslations';

interface UsturlabAsrarTabProps {
  t: DiscretionTranslation;
}

// 28 Abjad Mansions mapped across 360 degrees (12.857 deg each)
const ABJAD_MANSIONS = [
  { char: 'ا', name: 'Alif', mansion: 'Al-Sharaṭān', element: 'Fire', dir: 'Est (Mashriq)' },
  { char: 'ب', name: 'Bā', mansion: 'Al-Buṭayn', element: 'Water', dir: 'Nord-Est' },
  { char: 'ج', name: 'Jīm', mansion: 'Al-Thurayyā', element: 'Air', dir: 'Nord' },
  { char: 'د', name: 'Dāl', mansion: 'Al-Dabarān', element: 'Earth', dir: 'Nord-Ouest' },
  { char: 'ه', name: 'Hā', mansion: 'Al-Haq‘ah', element: 'Fire', dir: 'Ouest (Maghrib)' },
  { char: 'و', name: 'Wāw', mansion: 'Al-Han‘ah', element: 'Air', dir: 'Sud-Ouest' },
  { char: 'ز', name: 'Zāy', mansion: 'Al-Dhirā‘', element: 'Water', dir: 'Sud' },
  { char: 'ح', name: 'Ḥā', mansion: 'Al-Nathrah', element: 'Earth', dir: 'Sud-Est' },
  { char: 'ط', name: 'Ṭā', mansion: 'Al-Ṭarf', element: 'Fire', dir: 'Est (Mashriq)' },
  { char: 'ي', name: 'Yā', mansion: 'Al-Jabhah', element: 'Air', dir: 'Nord-Est' },
  { char: 'ك', name: 'Kāf', mansion: 'Al-Zubrah', element: 'Water', dir: 'Nord' },
  { char: 'ل', name: 'Lām', mansion: 'Al-Ṣarfah', element: 'Earth', dir: 'Nord-Ouest' },
  { char: 'م', name: 'Mīm', mansion: 'Al-‘Awwā’', element: 'Fire', dir: 'Ouest (Maghrib)' },
  { char: 'ن', name: 'Nūn', mansion: 'Al-Simāk', element: 'Air', dir: 'Sud-Ouest' },
  { char: 'س', name: 'Sīn', mansion: 'Al-Ghafr', element: 'Water', dir: 'Sud' },
  { char: 'ع', name: 'Ayn', mansion: 'Al-Zubānā', element: 'Earth', dir: 'Sud-Est' },
  { char: 'ف', name: 'Fā', mansion: 'Al-Iklīl', element: 'Fire', dir: 'Est (Mashriq)' },
  { char: 'ص', name: 'Ṣād', mansion: 'Al-Qalb', element: 'Air', dir: 'Nord-Est' },
  { char: 'ق', name: 'Qāf', mansion: 'Al-Shawlah', element: 'Water', dir: 'Nord' },
  { char: 'ر', name: 'Rā', mansion: 'Al-Na‘ā’im', element: 'Earth', dir: 'Nord-Ouest' },
  { char: 'ش', name: 'Shīn', mansion: 'Al-Baldah', element: 'Fire', dir: 'Ouest (Maghrib)' },
  { char: 'ت', name: 'Tā', mansion: 'Sa‘d al-Dhābiḥ', element: 'Air', dir: 'Sud-Ouest' },
  { char: 'ث', name: 'Thā', mansion: 'Sa‘d Bula‘', element: 'Water', dir: 'Sud' },
  { char: 'خ', name: 'Khā', mansion: 'Sa‘d al-Su‘ūd', element: 'Earth', dir: 'Sud-Est' },
  { char: 'ذ', name: 'Dhāl', mansion: 'Sa‘d al-Akhbiyah', element: 'Fire', dir: 'Est (Mashriq)' },
  { char: 'ض', name: 'Ḍād', mansion: 'Al-Fargh al-Muqaddam', element: 'Air', dir: 'Nord-Est' },
  { char: 'ظ', name: 'Ẓā', mansion: 'Al-Fargh al-Mu’akhkhar', element: 'Water', dir: 'Nord' },
  { char: 'غ', name: 'Ghayn', mansion: 'Batn al-Ḥūt', element: 'Earth', dir: 'Nord-Ouest' }
];

export default function UsturlabAsrarTab({ t }: UsturlabAsrarTabProps) {
  const [azimuth, setAzimuth] = useState<number>(145); // default azimuth angle
  const [useLiveGeo, setUseLiveGeo] = useState<boolean>(false);
  const [geoSupported, setGeoSupported] = useState<boolean>(true);

  // Handle device orientation compass if available
  useEffect(() => {
    if (!useLiveGeo) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading = e.alpha;
      if (typeof (e as any).webkitCompassHeading !== 'undefined') {
        compassHeading = (e as any).webkitCompassHeading;
      }
      if (compassHeading !== null && compassHeading !== undefined) {
        setAzimuth(Math.round(compassHeading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setGeoSupported(false);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [useLiveGeo]);

  // Compute active mansion & celestial metrics
  const celestialData = useMemo(() => {
    const normAngle = ((azimuth % 360) + 360) % 360;
    const stepSize = 360 / 28; // ~12.857 deg
    const index = Math.floor(normAngle / stepSize) % 28;
    const activeItem = ABJAD_MANSIONS[index];

    // Discretion level calculated from azimuth angle
    const discretionScore = Math.min(100, Math.max(50, Math.round(65 + Math.sin((normAngle * Math.PI) / 180) * 30)));
    let discretionRating = 'Niveau 3 • Équilibre';
    if (discretionScore > 85) discretionRating = 'Niveau 5 • Kitmān Absolu (Sceau)';
    else if (discretionScore > 70) discretionRating = 'Niveau 4 • Haute Protection';
    else if (discretionScore < 55) discretionRating = 'Niveau 2 • Vigilance Recommandée';

    return {
      angle: normAngle,
      activeItem,
      index,
      discretionScore,
      discretionRating
    };
  }, [azimuth]);

  const astrolabeSize = 420;
  const center = astrolabeSize / 2;
  const radius = 160;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Compass className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.usturlab.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.usturlab.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-5">
            {/* Azimuth Slider / Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                  {t.usturlab.azimuthLabel}
                </label>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm font-black border border-amber-500/30">
                  {celestialData.angle}°
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="359"
                value={celestialData.angle}
                onChange={(e) => {
                  setUseLiveGeo(false);
                  setAzimuth(parseInt(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Compass Live Toggle */}
            <div>
              <button
                onClick={() => setUseLiveGeo(!useLiveGeo)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  useLiveGeo
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white border-gray-300 dark:border-slate-700'
                }`}
              >
                <Navigation size={16} className={useLiveGeo ? 'animate-spin' : ''} />
                <span>{useLiveGeo ? t.usturlab.geoActive : t.usturlab.liveGeoBtn}</span>
              </button>
            </div>

            {/* Live Readout Metrics */}
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.usturlab.activeLetter}</span>
                  <span className="font-arabic text-2xl font-black text-amber-400">
                    {celestialData.activeItem.char} ({celestialData.activeItem.name})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.usturlab.celestialMansion}</span>
                  <span className="font-bold text-emerald-300 text-xs">
                    {celestialData.activeItem.mansion}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.usturlab.skyDirection}</span>
                  <span className="font-bold text-indigo-300 text-xs">
                    {celestialData.activeItem.dir}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.usturlab.dominantElement}</span>
                  <span className="font-bold text-teal-300 text-xs">
                    {celestialData.activeItem.element}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.usturlab.discretionLevel}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-amber-300 text-xs">
                    {celestialData.discretionRating}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {celestialData.discretionScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Brass Astrolabe Dial */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[460px] p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            
            <svg
              id="usturlab-astrolabe-svg"
              viewBox={`0 0 ${astrolabeSize} ${astrolabeSize}`}
              className="w-full h-auto max-w-[380px] select-none drop-shadow-2xl"
            >
              <defs>
                <radialGradient id="brassGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer Brass Rings */}
              <circle cx={center} cy={center} r={radius + 35} fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              <circle cx={center} cy={center} r={radius + 20} fill="none" stroke="#f59e0b" strokeWidth="2" />
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#b45309" strokeWidth="1.5" />
              <circle cx={center} cy={center} r={radius - 25} fill="url(#brassGradient)" stroke="#d97706" strokeWidth="0.8" />

              {/* Cardinal Compass Markers */}
              <text x={center} y={center - radius - 26} textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">N</text>
              <text x={center + radius + 28} y={center + 4} textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">E</text>
              <text x={center} y={center + radius + 32} textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">S</text>
              <text x={center - radius - 28} y={center + 4} textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">W</text>

              {/* 28 Abjad Letter Nodes on Outer Rim */}
              {ABJAD_MANSIONS.map((item, idx) => {
                const angleDeg = (360 / 28) * idx - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const nodeX = center + radius * Math.cos(angleRad);
                const nodeY = center + radius * Math.sin(angleRad);
                const isActive = idx === celestialData.index;

                return (
                  <g key={idx}>
                    <circle
                      cx={nodeX}
                      cy={nodeY}
                      r={isActive ? 13 : 9}
                      fill={isActive ? '#f59e0b' : '#0f172a'}
                      stroke={isActive ? '#fef3c7' : '#b45309'}
                      strokeWidth={isActive ? '2.5' : '1.2'}
                    />
                    <text
                      x={nodeX}
                      y={nodeY + 4}
                      textAnchor="middle"
                      fill={isActive ? '#0f172a' : '#fef3c7'}
                      fontSize={isActive ? '14' : '10'}
                      fontWeight="bold"
                      fontFamily="Traditional Arabic, Amiri, serif"
                    >
                      {item.char}
                    </text>
                  </g>
                );
              })}

              {/* Rotating Pointer / Needle */}
              <g transform={`rotate(${celestialData.angle} ${center} ${center})`}>
                <line
                  x1={center}
                  y1={center}
                  x2={center}
                  y2={center - radius + 10}
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${center},${center - radius - 5} ${center - 6},${center - radius + 12} ${center + 6},${center - radius + 12}`}
                  fill="#ef4444"
                />
              </g>

              {/* Center Brass Hub */}
              <circle cx={center} cy={center} r={22} fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <circle cx={center} cy={center} r={10} fill="#f59e0b" />
            </svg>

            {/* Astrolabe Footer Legend */}
            <div className="mt-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Usturlab al-Asrar • {celestialData.angle}° Azimuth
              </span>
              <p className="text-[10px] text-slate-400">
                Active Mansion: {celestialData.activeItem.mansion} ({celestialData.activeItem.dir})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Guidance Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="text-amber-500" size={18} />
          <span>{t.usturlab.guidanceTitle}</span>
        </h3>

        <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
          {t.usturlab.guidanceBody}
        </p>

        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
              {t.usturlab.timeWindow}
            </span>
            <span className="text-indigo-700 dark:text-indigo-400 font-medium">
              Alignement optimal actuel avec le Manzil {celestialData.activeItem.mansion}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="font-bold text-amber-900 dark:text-amber-300 block">
              {t.usturlab.recommendedDhikr}
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-bold font-arabic text-sm">
              يا حفيظ يا عليم (Yā Ḥafīẓ Yā ‘Alīm)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
