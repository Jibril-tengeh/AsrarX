import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Activity, RefreshCw, Sparkles, ChevronDown, Check, Play, Pause, RotateCcw } from 'lucide-react';
import { COUNTER_SKINS, CounterSkin } from './counterSkins';
import { SkinPatternSvg } from './SkinPatternSvg';

interface RealisticDigitalCounterProps {
  count: number;
  target: number;
  activeZikr: {
    text: string;
    arabic?: string;
    target: number;
  };
  onIncrement: () => void;
  onReset: () => void;
  onSelectZikrModal?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  isAutoIncrementing: boolean;
  onToggleAutoIncrement: () => void;
  autoIncrementSpeed: number;
  onChangeAutoIncrementSpeed: (speed: number) => void;
  lang: string;
}

export const RealisticDigitalCounter: React.FC<RealisticDigitalCounterProps> = ({
  count,
  target,
  activeZikr,
  onIncrement,
  onReset,
  onSelectZikrModal,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  isAutoIncrementing,
  onToggleAutoIncrement,
  autoIncrementSpeed,
  onChangeAutoIncrementSpeed,
  lang,
}) => {
  // Load saved skin from localStorage or default to brick_terracotta (matching screenshot)
  const [selectedSkinId, setSelectedSkinId] = useState<string>(() => {
    try {
      return localStorage.getItem('tasbih_counter_skin') || 'brick_terracotta';
    } catch {
      return 'brick_terracotta';
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('tasbih_counter_skin');
        if (saved && saved !== selectedSkinId) {
          setSelectedSkinId(saved);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedSkinId]);

  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isResetPressed, setIsResetPressed] = useState(false);
  const skinScrollRef = useRef<HTMLDivElement>(null);

  const activeSkin = COUNTER_SKINS.find(s => s.id === selectedSkinId) || COUNTER_SKINS[0];

  const handleSelectSkin = (skinId: string) => {
    setSelectedSkinId(skinId);
    try {
      localStorage.setItem('tasbih_counter_skin', skinId);
    } catch (e) {
      console.warn('Could not save skin:', e);
    }
  };

  const handleMainButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsButtonPressed(true);
    onIncrement();
  };

  const handleMainButtonUp = () => {
    setIsButtonPressed(false);
  };

  const handleResetButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResetPressed(true);
    onReset();
  };

  const handleResetButtonUp = () => {
    setIsResetPressed(false);
  };

  // Format count to standard 5-digit LCD readout when needed, or dynamic
  const formattedCount = count.toLocaleString();
  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0;

  return (
    <div className="w-full flex flex-col items-center select-none pb-6">
      
      {/* 1. HORIZONTAL SKINS SELECTOR (Matching User Screenshot Row at Top) */}
      <div className="w-full max-w-md mb-5 px-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>{lang === 'fr' ? 'Modèles & Thèmes de Tasbih' : lang === 'ha' ? 'Nau\'in Carbi' : 'Counter Models & Skins'}</span>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {activeSkin.name[lang as 'fr' | 'en' | 'ha'] || activeSkin.name.fr}
          </span>
        </div>

        {/* Scrollable Mini Counters Row */}
        <div 
          ref={skinScrollRef}
          className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 snap-x"
          style={{ scrollBehavior: 'smooth' }}
        >
          {COUNTER_SKINS.map((skin) => {
            const isSelected = skin.id === selectedSkinId;
            return (
              <button
                key={skin.id}
                onClick={() => handleSelectSkin(skin.id)}
                className={`relative shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-2xl transition-all snap-center cursor-pointer group ${
                  isSelected 
                    ? 'ring-2 ring-amber-500 scale-105 bg-amber-500/10 shadow-md' 
                    : 'opacity-75 hover:opacity-100 hover:scale-100'
                }`}
                title={skin.name[lang as 'fr' | 'en' | 'ha'] || skin.name.fr}
              >
                {/* Mini Physical Counter Replica */}
                <div 
                  className={`w-12 h-16 rounded-t-2xl rounded-b-xl relative overflow-hidden shadow-sm border border-black/30 flex flex-col items-center justify-between p-1`}
                  style={{ background: skin.previewBg }}
                >
                  <SkinPatternSvg type={skin.bgType} className="opacity-60" />
                  
                  {/* Mini LCD Display */}
                  <div 
                    className="w-9 h-4 rounded-sm border border-black/60 flex items-center justify-end px-1 shadow-inner relative z-10"
                    style={{ backgroundColor: skin.lcdBg }}
                  >
                    <span 
                      className="text-[8px] font-mono font-bold leading-none"
                      style={{ color: skin.digitColor }}
                    >
                      {count > 9999 ? '9999+' : count}
                    </span>
                  </div>

                  {/* Mini Main Button */}
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-white via-gray-200 to-gray-400 border border-gray-500/80 shadow-xs relative z-10 flex items-center justify-center mb-0.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-gray-100 to-gray-300 shadow-inner" />
                  </div>
                </div>

                {/* Skin Name */}
                <span className={`text-[10px] font-semibold truncate max-w-[60px] text-center ${
                  isSelected ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {skin.name[lang as 'fr' | 'en' | 'ha'] || skin.name.fr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE ZIKR BANNER */}
      <div className="w-full max-w-sm mb-4 px-2">
        <button 
          onClick={onSelectZikrModal}
          className="w-full text-center px-4 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border border-gray-200/80 dark:border-gray-700/80 transition-transform active:scale-[0.98] group flex flex-col items-center cursor-pointer"
        >
          {activeZikr.arabic && (
            <h2 className="text-xl sm:text-2xl font-serif text-emerald-800 dark:text-emerald-400 font-bold mb-1" dir="rtl">
              {activeZikr.arabic}
            </h2>
          )}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
              {activeZikr.text}
            </span>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </div>
          {target > 0 && (
            <div className="flex items-center gap-2 mt-1.5 w-full max-w-[200px]">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400">
                {count}/{target}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* 3. REALISTIC TALLY COUNTER PHYSICAL BODY (Matching User's Screenshot) */}
      <div className="relative flex flex-col items-center justify-center my-2 select-none">
        
        {/* Ambient Drop Shadow & Glow */}
        <div 
          className="absolute -inset-2 rounded-[3.5rem] blur-xl opacity-40 transition-all duration-500 pointer-events-none"
          style={{ backgroundColor: activeSkin.accentColor }}
        />

        {/* Counter Outer Chassis Case */}
        <div 
          id="realistic-tasbih-chassis"
          className="relative w-[300px] sm:w-[330px] h-[440px] sm:h-[470px] rounded-t-[4.5rem] rounded-b-[4.2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-8px_16px_rgba(0,0,0,0.6)] border-4 border-[#262626]/80 p-5 flex flex-col items-center justify-between overflow-hidden transition-all duration-500"
          style={{ 
            background: activeSkin.previewBg,
          }}
        >
          {/* Authentic Material Texture SVG Overlay */}
          <SkinPatternSvg type={activeSkin.bgType} />

          {/* Realistic Ergonomic Edge Shadows & Reflections */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/50 pointer-events-none rounded-[inherit]" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[4rem]" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-b-[4rem]" />
          
          {/* Side Ergonomic Grips / Waist Curves Highlights */}
          <div className="absolute left-1 top-1/4 bottom-1/4 w-2 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <div className="absolute right-1 top-1/4 bottom-1/4 w-2 bg-black/40 rounded-full blur-[1px] pointer-events-none" />

          {/* 3.1 AUTHENTIC LCD DIGITAL SCREEN BOX */}
          <div className="relative z-10 w-full pt-4 flex flex-col items-center">
            {/* Outer Bezel */}
            <div 
              className="w-[245px] sm:w-[265px] h-[105px] sm:h-[115px] rounded-[1.8rem] bg-gradient-to-b from-[#1c1917] via-[#292524] to-[#0c0a09] p-2.5 shadow-[0_8px_16px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)] border-2 border-[#44403c] flex flex-col items-center justify-between"
            >
              {/* Recessed LCD Screen Window */}
              <div 
                className="w-full h-[64px] sm:h-[70px] rounded-xl border-2 border-[#1c1917] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-end px-4 relative overflow-hidden"
                style={{ 
                  backgroundColor: activeSkin.lcdBg,
                }}
              >
                {/* LCD Glass Glare & Reflection */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                <div className="absolute -left-10 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none" />

                {/* Faint LCD Inactive 88888 Background Digits (authentic 7-segment feel) */}
                <div 
                  className="absolute right-4 text-3xl sm:text-4xl font-mono font-bold tracking-wider opacity-10 select-none pointer-events-none"
                  style={{ color: activeSkin.digitColor }}
                >
                  88888
                </div>

                {/* Active LCD Digits (Bold Digital Display matching screenshot) */}
                <span 
                  className="text-4xl sm:text-5xl font-mono font-black tracking-tight relative z-10 tabular-nums drop-shadow-xs"
                  style={{ 
                    color: activeSkin.digitColor,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                  }}
                >
                  {formattedCount}
                </span>

                {/* Goal indicator pill inside LCD */}
                {target > 0 && (
                  <div 
                    className="absolute left-2.5 bottom-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/15 text-black/70 flex items-center gap-1"
                  >
                    <span>🎯</span>
                    <span>{target}</span>
                  </div>
                )}
              </div>

              {/* Bottom Labels: COUNT & RESET (Printed on the plastic bezel) */}
              <div className="w-full flex items-center justify-around px-4 text-[11px] font-bold tracking-[0.25em] text-gray-400/90 uppercase select-none">
                <span className="hover:text-white transition-colors">COUNT</span>
                <span className="hover:text-white transition-colors">RESET</span>
              </div>
            </div>
          </div>

          {/* 3.2 PHYSICAL BUTTONS SECTION (Large Center Button + Upper-Right Reset Button) */}
          <div className="relative z-10 w-full flex-1 flex items-center justify-center mt-2 mb-4">
            
            {/* Upper Right Reset Button (positioned accurately matching screenshot) */}
            <div className="absolute right-4 sm:right-6 top-1 z-20 flex flex-col items-center">
              <button
                id="btn-tasbih-reset-physical"
                onMouseDown={handleResetButtonDown}
                onMouseUp={handleResetButtonUp}
                onTouchStart={handleResetButtonDown}
                onTouchEnd={handleResetButtonUp}
                className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#f5f5f5] via-[#d4d4d8] to-[#71717a] p-1 border-2 border-[#52525b] shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] active:shadow-inner transition-transform cursor-pointer flex items-center justify-center ${
                  isResetPressed ? 'scale-90 translate-y-0.5' : 'hover:scale-105 active:scale-95'
                }`}
                title={lang === 'fr' ? 'Réinitialiser le compteur' : 'Reset counter'}
              >
                {/* Metallic button cap */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#e4e4e7] to-[#a1a1aa] shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  <RotateCcw size={13} className="text-gray-700 drop-shadow-xs" />
                </div>
              </button>
              <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest mt-0.5 drop-shadow-md">
                Reset
              </span>
            </div>

            {/* Huge 3D Chrome Tactile Main Counting Button */}
            <div className="relative flex items-center justify-center">
              {/* Outer Chrome Bezel Ring with metallic reflections */}
              <div 
                className="w-40 sm:w-44 h-40 sm:h-44 rounded-full p-2.5 bg-gradient-to-br from-[#ffffff] via-[#9ca3af] to-[#374151] shadow-[0_12px_24px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(0,0,0,0.7)] border-2 border-[#4b5563] flex items-center justify-center"
              >
                {/* Deep Recessed Cavity Shadow */}
                <div className="w-full h-full rounded-full p-2 bg-gradient-to-b from-[#18181b] via-[#27272a] to-[#09090b] shadow-inner flex items-center justify-center">
                  
                  {/* Interactive Tactile Dome Button */}
                  <button
                    id="btn-tasbih-count-physical"
                    onMouseDown={handleMainButtonDown}
                    onMouseUp={handleMainButtonUp}
                    onTouchStart={handleMainButtonDown}
                    onTouchEnd={handleMainButtonUp}
                    className={`w-full h-full rounded-full bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#94a3b8] p-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_4px_8px_rgba(255,255,255,1),inset_0_-6px_12px_rgba(0,0,0,0.4)] border border-[#cbd5e1] flex items-center justify-center transition-all duration-75 cursor-pointer ${
                      isButtonPressed 
                        ? 'translate-y-1.5 scale-[0.94] shadow-[inset_0_6px_12px_rgba(0,0,0,0.6)] brightness-95' 
                        : 'hover:brightness-105 active:scale-95'
                    }`}
                  >
                    {/* Inner Convex Button Cap with Radial Highlight */}
                    <div className="w-full h-full rounded-full bg-radial from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Glossy Top Highlight */}
                      <div className="absolute top-2 left-1/4 right-1/4 h-8 bg-gradient-to-b from-white/80 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
                      
                      {/* Tactile Grip Ring Accent */}
                      <div className="w-16 h-16 rounded-full border border-black/10 opacity-30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border border-black/10 opacity-30" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3.3 BOTTOM FINGER STRAP MOUNT HOLE / ACCENT */}
          <div className="relative z-10 mb-1 flex items-center justify-center">
            <div className="w-10 h-3 rounded-full bg-black/60 shadow-inner border border-white/20 flex items-center justify-center">
              <div className="w-6 h-1 bg-black/80 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAST ACTION BAR (Sound, Vibration, Auto-Increment) */}
      <div className="w-full max-w-sm mt-3 px-2 flex items-center justify-between gap-2">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            soundEnabled 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
              : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
          title="Son"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{soundEnabled ? (lang === 'fr' ? 'Son Actif' : 'Sound On') : (lang === 'fr' ? 'Muet' : 'Mute')}</span>
        </button>

        {/* Vibration Toggle */}
        <button
          onClick={onToggleVibration}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            vibrationEnabled 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
              : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
          title="Vibration"
        >
          <Activity size={15} />
          <span>{vibrationEnabled ? 'Vibreur' : 'Sans Vibreur'}</span>
        </button>

        {/* Auto Increment */}
        <button
          onClick={onToggleAutoIncrement}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            isAutoIncrementing 
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
          title="Auto-Incrément"
        >
          {isAutoIncrementing ? <Pause size={15} /> : <Play size={15} />}
          <span>Auto</span>
        </button>
      </div>

      {/* Auto-increment speed adjust if active */}
      {isAutoIncrementing && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex items-center justify-between text-xs"
        >
          <span className="font-semibold text-amber-800 dark:text-amber-300">Vitesse Auto :</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeAutoIncrementSpeed(Math.max(250, autoIncrementSpeed - 250))}
              className="w-6 h-6 rounded-lg bg-amber-200 dark:bg-amber-800 font-bold flex items-center justify-center hover:bg-amber-300"
            >
              -
            </button>
            <span className="font-mono font-bold text-amber-900 dark:text-amber-200">
              {(autoIncrementSpeed / 1000).toFixed(2)}s
            </span>
            <button
              onClick={() => onChangeAutoIncrementSpeed(Math.min(5000, autoIncrementSpeed + 250))}
              className="w-6 h-6 rounded-lg bg-amber-200 dark:bg-amber-800 font-bold flex items-center justify-center hover:bg-amber-300"
            >
              +
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
