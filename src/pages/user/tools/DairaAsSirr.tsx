import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Download, RefreshCw, Feather, Eye, Compass, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateAbjadValue } from '../../../utils/abjad';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const ABJAD_LETTERS_28 = [
  'أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'
];

const ANGELS = ['جبرائيل', 'ميكائيل', 'إسرافيل', 'عزرائيل'];

export const DairaAsSirr: React.FC = () => {
  const { t, language } = useLanguage();
  const [inputName, setInputName] = useState('سر الأسرار');
  const [selectedTheme, setSelectedTheme] = useState<'emerald' | 'gold' | 'indigo' | 'crimson'>('gold');
  const [showParchment, setShowParchment] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const abjadVal = calculateAbjadValue(inputName);

  // Generate divine name or angel based on value
  const extractedAngel = `${inputName.trim().replace(/\s+/g, '')}ائيل`;

  const themeColors = {
    gold: {
      bg: '#1c1917',
      ring1: '#f59e0b',
      ring2: '#d97706',
      ring3: '#b45309',
      text: '#fef3c7',
      accent: '#fbbf24',
    },
    emerald: {
      bg: '#022c22',
      ring1: '#10b981',
      ring2: '#059669',
      ring3: '#047857',
      text: '#ecfdf5',
      accent: '#34d399',
    },
    indigo: {
      bg: '#0f172a',
      ring1: '#6366f1',
      ring2: '#4f46e5',
      ring3: '#4338ca',
      text: '#e0e7ff',
      accent: '#818cf8',
    },
    crimson: {
      bg: '#270505',
      ring1: '#ef4444',
      ring2: '#dc2626',
      ring3: '#b91c1c',
      text: '#fef2f2',
      accent: '#f87171',
    },
  };

  const currentTheme = themeColors[selectedTheme];

  const handleExportCanvas = async () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = async () => {
      if (ctx) {
        ctx.fillStyle = currentTheme.bg;
        ctx.fillRect(0, 0, 1000, 1000);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        await downloadCanvasImage(canvas, `daira_as_sirr_${abjadVal}.png`);
      }
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Dā'ira As-Sirr</span>
            <Sparkles className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {language === 'fr'
              ? 'Générateur de Sceaux Circulaires Concentriques & Couronnes Théurgiques'
              : language === 'ha'
              ? "Kayan Fitar da Hatsimin Dā'ira na Kewaye & Sarakunan Ruhaniya"
              : 'Concentric Circular Seal & Theurgic Crown Generator'}
          </p>
        </div>
        <ToolInfoTooltip toolId="daira-as-sirr" />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs & Parameters */}
        <div className="lg:col-span-1 space-y-5 bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {language === 'fr' ? 'Intention / Nom Mystique' : language === 'ha' ? 'Niyya ko Suna' : 'Intention or Mystical Name'}
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-serif text-right text-base focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Ex: Ya Latif"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {language === 'fr' ? 'Poids Abjad (Zimām)' : language === 'ha' ? 'Lambar Abjad' : 'Abjad Weight'}
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{abjadVal}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {language === 'fr' ? 'Thème Mystique' : language === 'ha' ? "Launin Dā'ira" : 'Mystic Theme'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['gold', 'emerald', 'indigo', 'crimson'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTheme(t)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all capitalize cursor-pointer ${
                    selectedTheme === t
                      ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {language === 'fr' ? 'Rotation Spirituelle' : language === 'ha' ? 'Juyin Kewaye' : 'Rotation Speed'}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setShowParchment(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Feather className="w-4 h-4" />
              <span>{language === 'fr' ? 'Exporter en Parchemin' : language === 'ha' ? 'Fitar a Takardar Saffron' : 'Export as Parchment'}</span>
            </button>
            <button
              onClick={handleExportCanvas}
              className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{language === 'fr' ? 'Télécharger PNG Sceau' : language === 'ha' ? 'Saukar PNG' : 'Download Seal PNG'}</span>
            </button>
          </div>
        </div>

        {/* Right Circular Canvas Render */}
        <div className="lg:col-span-2 bg-zinc-950 rounded-3xl p-4 sm:p-8 border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[420px]">
          {/* SVG Daira Renderer */}
          <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              style={{
                animation: rotationSpeed > 0 ? `spin ${21 - rotationSpeed}s linear infinite` : 'none',
              }}
            >
              {/* Dark Background Circle */}
              <circle cx="250" cy="250" r="245" fill={currentTheme.bg} stroke={currentTheme.ring1} strokeWidth="2" />

              {/* Outer Ring 1: 28 Abjad Letters */}
              <circle cx="250" cy="250" r="220" fill="none" stroke={currentTheme.ring2} strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="180" fill="none" stroke={currentTheme.ring1} strokeWidth="2" />

              {/* Render 28 Abjad Letters around outer ring */}
              {ABJAD_LETTERS_28.map((letter, i) => {
                const angle = (i * 360) / 28 - 90;
                const rad = (angle * Math.PI) / 180;
                const x = 250 + 200 * Math.cos(rad);
                const y = 250 + 200 * Math.sin(rad);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill={currentTheme.accent}
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="Amiri, serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {letter}
                  </text>
                );
              })}

              {/* Middle Ring 2: 4 Angels */}
              <circle cx="250" cy="250" r="140" fill="none" stroke={currentTheme.ring3} strokeWidth="1" />
              {ANGELS.map((angel, i) => {
                const angle = i * 90 - 45;
                const rad = (angle * Math.PI) / 180;
                const x = 250 + 160 * Math.cos(rad);
                const y = 250 + 160 * Math.sin(rad);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill={currentTheme.text}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="Amiri, serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {angel}
                  </text>
                );
              })}

              {/* Central Geometric Octagram */}
              <circle cx="250" cy="250" r="100" fill="none" stroke={currentTheme.ring1} strokeWidth="2" />
              <polygon points="250,150 320,180 350,250 320,320 250,350 180,320 150,250 180,180" fill="none" stroke={currentTheme.ring2} strokeWidth="1" />

              {/* Inner Heart Intention Calligraphy */}
              <circle cx="250" cy="250" r="70" fill={currentTheme.bg} stroke={currentTheme.accent} strokeWidth="1.5" />
              <text
                x="250"
                y="240"
                fill={currentTheme.text}
                fontSize="18"
                fontWeight="bold"
                fontFamily="Amiri, serif"
                textAnchor="middle"
              >
                {inputName || 'سر'}
              </text>
              <text
                x="250"
                y="268"
                fill={currentTheme.accent}
                fontSize="12"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {abjadVal}
              </text>
            </svg>
          </div>

          <p className="text-xs text-zinc-400 mt-6 text-center font-serif">
            ✦ Dā'ira Al-Sirr & Sceau de Protection Concentrique ✦
          </p>
        </div>
      </div>

      {/* Parchment Modal Exporter */}
      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title="Dā'ira As-Sirr — Circular Seal"
        subtitle={
          language === 'fr'
            ? `Sceau de protection & couronne concentrique de ${inputName}`
            : language === 'ha'
            ? `Khatimin kariya da rawani na ${inputName}`
            : `Protection seal & concentric crown of ${inputName}`
        }
        recipientName={inputName}
        abjadWeight={abjadVal}
        content={
          <div className="space-y-4 text-center">
            <p className="text-2xl font-serif text-amber-900 font-bold">{inputName}</p>
            <p className="text-sm font-mono text-amber-800">
              {language === 'fr' ? 'Poids Zimām :' : language === 'ha' ? 'Nauyi Zimām :' : 'Weight Zimām:'} {abjadVal} | Khādim: {extractedAngel}
            </p>
            <div className="p-4 bg-amber-200/40 rounded-2xl border border-amber-600/30 text-xs font-serif leading-relaxed text-amber-950">
              {language === 'fr'
                ? '"Ce sceau concentrique regroupe la couronne des 28 lettres et des 4 archanges célestes (Jibril, Mikail, Israfil, Azrail) scellant l\'intention mystique."'
                : language === 'ha'
                ? '"Wannan khatimi yana tattara haruffa 28 da manyan Mala\'iku 4 (Jibril, Mikail, Israfil, Azrail) don kulla muradin ruhi."'
                : '"This concentric seal combines the crown of 28 letters and the 4 celestial archangels (Jibril, Mikail, Israfil, Azrail) sealing the mystical intention."'}
            </div>
          </div>
        }
      />
    </div>
  );
};
