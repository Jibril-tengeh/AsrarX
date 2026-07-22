import React, { useState, useRef } from 'react';
import { ArrowLeft, Circle, Disc, Sparkles, Download, Copy, Check, Shield, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../../../utils/downloadHelper';

interface MetalOption {
  id: string;
  nameFr: string;
  gradient: string;
  borderColor: string;
  textColor: string;
  shadow: string;
}

const METALS: MetalOption[] = [
  { id: 'silver', nameFr: 'Argent Pur (Fidda)', gradient: 'from-slate-200 via-gray-100 to-slate-400', borderColor: '#94a3b8', textColor: '#334155', shadow: 'rgba(148, 163, 184, 0.4)' },
  { id: 'gold', nameFr: 'Or Sacré (Dhahab)', gradient: 'from-amber-200 via-yellow-300 to-amber-500', borderColor: '#eab308', textColor: '#78350f', shadow: 'rgba(234, 179, 8, 0.4)' },
  { id: 'copper', nameFr: 'Cuivre Rouge (Nahas)', gradient: 'from-orange-300 via-amber-600 to-orange-700', borderColor: '#ea580c', textColor: '#7c2d12', shadow: 'rgba(234, 88, 12, 0.4)' },
  { id: 'bronze', nameFr: 'Bronze Antique', gradient: 'from-yellow-700 via-amber-800 to-stone-900', borderColor: '#854d0e', textColor: '#451a03', shadow: 'rgba(133, 77, 14, 0.4)' },
  { id: 'iron', nameFr: 'Fer de Protection (Hadid)', gradient: 'from-zinc-400 via-zinc-600 to-zinc-900', borderColor: '#52525b', textColor: '#18181b', shadow: 'rgba(82, 82, 91, 0.4)' },
];

interface GemOption {
  id: string;
  nameFr: string;
  colorHex: string;
  innerGlow: string;
}

const GEMSTONES: GemOption[] = [
  { id: 'aqeeq_red', nameFr: 'Agate Yemenite Rouge (Aqeeq)', colorHex: '#991b1b', innerGlow: '#f87171' },
  { id: 'aqeeq_yellow', nameFr: 'Agate Jaune (Sharaf al-Shams)', colorHex: '#ca8a04', innerGlow: '#fef08a' },
  { id: 'emerald', nameFr: 'Émeraude Spirituelle (Zumurrud)', colorHex: '#065f46', innerGlow: '#34d399' },
  { id: 'ruby', nameFr: 'Rubis Royal (Yaqut)', colorHex: '#881337', innerGlow: '#fb7185' },
  { id: 'turquoise', nameFr: 'Turquoise Bénie (Firouz)', colorHex: '#0e7490', innerGlow: '#22d3ee' },
  { id: 'lapis', nameFr: 'Lapis-Lazuli Bleu Nuit (Lajward)', colorHex: '#1e3a8a', innerGlow: '#60a5fa' },
  { id: 'amethyst', nameFr: 'Améthyste Violette', colorHex: '#581c87', innerGlow: '#c084fc' },
  { id: 'none', nameFr: 'Aucune Pierre (Plaque Métal Purgée)', colorHex: 'transparent', innerGlow: 'transparent' },
];

export const RingPendantTalisman: React.FC = () => {
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;

  const [talismanType, setTalismanType] = useState<'ring' | 'pendant'>('ring');
  const [metal, setMetal] = useState<MetalOption>(METALS[0]);
  const [gemstone, setGemstone] = useState<GemOption>(GEMSTONES[0]);

  // Engraving text
  const [outerText, setOuterText] = useState<string>('فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ');
  const [centerText, setCenterText] = useState<string>('يا حفيظ يا سلام');
  const [innerNumber, setInnerNumber] = useState<string>('998');

  const [copied, setCopied] = useState(false);
  const { isPremium } = useAuth();
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const totalAbjadOuter = calculateAbjadValue(outerText);
  const totalAbjadCenter = calculateAbjadValue(centerText);
  const grandTotal = totalAbjadOuter + totalAbjadCenter + (parseInt(innerNumber, 10) || 0);

  const exportAsPng = async () => {
    if (!svgContainerRef.current) return;
    if (!isPremium) {
      triggerProtectionModal('download');
      return;
    }
    try {
      const canvas = await toCanvas(svgContainerRef.current, { backgroundColor: '#0f172a', skipFonts: true });
      await downloadCanvasImage(canvas, `talisman-${talismanType}-${metal.id}.png`);
    } catch (e) {
      console.error(e);
    }
  };

  const copyDetails = () => {
    if (disableDuaCopy) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const details = `TALISMAN DE ${talismanType === 'ring' ? 'BAGUE' : 'PENDENTIF'} THÉURGIQUE
Métal : ${metal.nameFr}
Pierre : ${gemstone.nameFr}
Gravure Extérieure : ${outerText} (Adad: ${totalAbjadOuter})
Gravure Centrale : ${centerText} (Adad: ${totalAbjadCenter})
Sceau Numérique : ${innerNumber}
Poids Mystique Total (Adad Jummal) : ${grandTotal}`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" />
            Générateur de Talismans de Bague & Pendentifs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Concevez et gravez virtuellement des bijoux théurgiques sacrés prêts pour artisan bijoutier ou méditation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Type Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              1. Type de Bijou Sacré
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTalismanType('ring')}
                className={`p-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  talismanType === 'ring'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Circle size={20} className="text-amber-500" />
                <span>Bague Théurgique (Khatim)</span>
              </button>
              <button
                onClick={() => setTalismanType('pendant')}
                className={`p-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  talismanType === 'pendant'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-900 dark:text-amber-300 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Disc size={20} className="text-amber-500" />
                <span>Pendentif / Medaillon</span>
              </button>
            </div>
          </div>

          {/* Metal & Gem Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                2. Alliage Métallique
              </label>
              <select
                value={metal.id}
                onChange={(e) => {
                  const found = METALS.find(m => m.id === e.target.value);
                  if (found) setMetal(found);
                }}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-sm text-gray-900 dark:text-white focus:outline-none"
              >
                {METALS.map(m => (
                  <option key={m.id} value={m.id}>{m.nameFr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                3. Pierre Précieuse / Sertissage (Aqeeq)
              </label>
              <select
                value={gemstone.id}
                onChange={(e) => {
                  const found = GEMSTONES.find(g => g.id === e.target.value);
                  if (found) setGemstone(found);
                }}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-sm text-gray-900 dark:text-white focus:outline-none"
              >
                {GEMSTONES.map(g => (
                  <option key={g.id} value={g.id}>{g.nameFr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Texts Input */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              4. Inscriptions & Gravures Théurgiques
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gravure Extérieure (Cercle Biseau)
              </label>
              <input
                type="text"
                value={outerText}
                onChange={(e) => setOuterText(e.target.value)}
                placeholder="Verset, Asma al-Husna ou Talsam..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none"
                dir="rtl"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Adad Jummal : {totalAbjadOuter}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gravure Centrale (Sceau / Nom)
              </label>
              <input
                type="text"
                value={centerText}
                onChange={(e) => setCenterText(e.target.value)}
                placeholder="Nom Divin, Khadim..."
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-arabic font-bold text-gray-900 dark:text-white focus:outline-none"
                dir="rtl"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Adad Jummal : {totalAbjadCenter}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Sceau Numérique Secret (Adad / Wafq)
              </label>
              <input
                type="text"
                value={innerNumber}
                onChange={(e) => setInnerNumber(e.target.value)}
                placeholder="Ex: 998"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Preview Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            ref={svgContainerRef}
            className="w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[420px]"
          >
            {/* Background subtle star grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            {/* AsrarHub Watermarks overlay in 4 corners and center background */}
            <div className="absolute top-3 left-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>
            <div className="absolute bottom-3 right-4 text-[10px] font-bold tracking-widest text-amber-500/30 pointer-events-none select-none uppercase">
              AsrarHub
            </div>

            {/* AsrarHub Brand Header Logo */}
            <div className="relative z-10 flex items-center gap-1.5 mb-2 bg-slate-800/80 px-3 py-1 rounded-full border border-amber-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black tracking-wider text-amber-300 uppercase">AsrarHub</span>
              <span className="text-[10px] text-slate-400 font-semibold">• Sceau Officiel</span>
            </div>

            {/* SVG Visual */}
            <div className="relative z-10 my-4 transform transition-transform hover:scale-105">
              <svg
                width={talismanType === 'ring' ? '280' : '260'}
                height={talismanType === 'ring' ? '280' : '320'}
                viewBox="0 0 300 300"
                className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Metal Gradient */}
                  <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor={metal.borderColor} />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>

                  {/* Gemstone Radial */}
                  <radialGradient id="gemGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor={gemstone.innerGlow} />
                    <stop offset="70%" stopColor={gemstone.colorHex} />
                    <stop offset="100%" stopColor="#000000" />
                  </radialGradient>

                  {/* Circular Text Path */}
                  <path id="circlePath" d="M 150,150 m -110,0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0" />
                  <path id="ovalPath" d="M 150,150 m -100,0 a 100,120 0 1,1 200,0 a 100,120 0 1,1 -200,0" />
                </defs>

                {/* Outer Bezel */}
                {talismanType === 'ring' ? (
                  <>
                    <circle cx="150" cy="150" r="140" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <circle cx="150" cy="150" r="122" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                ) : (
                  <>
                    <ellipse cx="150" cy="150" rx="135" ry="145" fill="url(#metalGrad)" stroke={metal.borderColor} strokeWidth="4" />
                    <ellipse cx="150" cy="150" rx="115" ry="125" fill="#090d16" stroke={metal.borderColor} strokeWidth="2" />
                  </>
                )}

                {/* Gemstone Overlay */}
                {gemstone.id !== 'none' && (
                  talismanType === 'ring' ? (
                    <circle cx="150" cy="150" r="80" fill="url(#gemGrad)" opacity="0.85" stroke={metal.borderColor} strokeWidth="2" />
                  ) : (
                    <ellipse cx="150" cy="150" rx="75" ry="85" fill="url(#gemGrad)" opacity="0.85" stroke={metal.borderColor} strokeWidth="2" />
                  )
                )}

                {/* Outer Curved Arabic Text */}
                <text fill={gemstone.id === 'none' ? metal.borderColor : '#f8fafc'} fontSize="13" fontWeight="bold" fontFamily="Amiri, serif">
                  <textPath href={talismanType === 'ring' ? '#circlePath' : '#ovalPath'} startOffset="50%" textAnchor="middle">
                    {outerText}
                  </textPath>
                </text>

                {/* Center Seal / Inscription */}
                <g textAnchor="middle" dominantBaseline="central">
                  {/* Decorative Islamic Star / Geometry in Center */}
                  <polygon
                    points="150,115 158,138 183,138 163,152 170,175 150,160 130,175 137,152 117,138 142,138"
                    fill="none"
                    stroke={metal.borderColor}
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <text
                    x="150"
                    y="142"
                    fill="#ffffff"
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="Amiri, serif"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {centerText}
                  </text>
                  <text
                    x="150"
                    y="168"
                    fill="#f59e0b"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    [ {innerNumber} ]
                  </text>
                </g>
              </svg>
            </div>

            {/* Summary Metadata Card */}
            <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-1.5 mt-2">
              <div className="flex justify-between font-bold text-slate-100">
                <span>Alliage : {metal.nameFr}</span>
                <span>Poids Total : {grandTotal}</span>
              </div>
              <div>Pierre : <strong className="text-amber-400">{gemstone.nameFr}</strong></div>
              <div className="truncate">Cercle : <span className="font-arabic">{outerText}</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 w-full justify-center">
            <button
              onClick={exportAsPng}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Download size={16} />
              Télécharger l'Image (PNG HD)
            </button>
            {!disableDuaCopy && (
              <button
                onClick={copyDetails}
                className="px-6 py-3 rounded-2xl bg-slate-800 dark:bg-gray-700 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copied ? "Copié !" : "Copier la Fiche Technique Bijoutier"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
