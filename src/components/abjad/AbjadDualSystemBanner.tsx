import React from 'react';
import { Sparkles, Globe, Compass, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AbjadDualSystemBannerProps {
  activeSystem: 'mashriqi' | 'maghribi';
  onSystemChange: (sys: 'mashriqi' | 'maghribi') => void;
  valMashriqi: number;
  valMaghribi: number;
  onCopyVal: (val: number) => void;
  copied: boolean;
}

export const AbjadDualSystemBanner: React.FC<AbjadDualSystemBannerProps> = ({
  activeSystem,
  onSystemChange,
  valMashriqi,
  valMaghribi,
  onCopyVal,
  copied
}) => {
  return (
    <div className="space-y-3">
      {/* System Toggle Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/80">
        <div className="flex items-center gap-1.5 px-3 py-1">
          <Globe size={16} className="text-blue-500 shrink-0" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
            Système Abjad Actif :
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-gray-900 rounded-xl shadow-xs border border-gray-200/60 dark:border-gray-700">
          <button
            type="button"
            onClick={() => onSystemChange('mashriqi')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSystem === 'mashriqi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>Abjad Oriental (Hawwaz)</span>
          </button>
          <button
            type="button"
            onClick={() => onSystemChange('maghribi')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSystem === 'maghribi'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>Abjad Maghrébin (Abajad)</span>
          </button>
        </div>
      </div>

      {/* Dual Value Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Mashriqi Card */}
        <div
          onClick={() => onSystemChange('mashriqi')}
          className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer transition-all duration-300 ${
            activeSystem === 'mashriqi'
              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 ring-2 ring-blue-400 shadow-blue-500/20'
              : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -translate-y-6 translate-x-6" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-100">
                Abjad Oriental (Mashriq)
              </span>
              {activeSystem === 'mashriqi' && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase">
                  Actif
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-5xl font-black tracking-tight tabular-nums py-1">
              {valMashriqi}
            </div>

            <p className="text-[10px] text-blue-100/90 font-arabic">
              أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ
            </p>

            {valMashriqi > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyVal(valMashriqi);
                }}
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-full text-xs font-semibold backdrop-blur-xs transition-all active:scale-95"
              >
                {copied && activeSystem === 'mashriqi' ? (
                  <>
                    <Check size={13} className="text-emerald-300" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <span>Copier ({valMashriqi})</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Maghribi Card */}
        <div
          onClick={() => onSystemChange('maghribi')}
          className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 text-white shadow-md cursor-pointer transition-all duration-300 ${
            activeSystem === 'maghribi'
              ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 ring-2 ring-emerald-400 shadow-emerald-500/20'
              : 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-70 hover:opacity-90'
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -translate-y-6 translate-x-6" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-100">
                Abjad Maghrébin (Occidental)
              </span>
              {activeSystem === 'maghribi' && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase">
                  Actif
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-5xl font-black tracking-tight tabular-nums py-1">
              {valMaghribi}
            </div>

            <p className="text-[10px] text-emerald-100/90 font-arabic">
              أبجد هوز حطي كلمن صعفض قرست ثخذ ظغش
            </p>

            {valMaghribi > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyVal(valMaghribi);
                }}
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-full text-xs font-semibold backdrop-blur-xs transition-all active:scale-95"
              >
                {copied && activeSystem === 'maghribi' ? (
                  <>
                    <Check size={13} className="text-emerald-300" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <span>Copier ({valMaghribi})</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
