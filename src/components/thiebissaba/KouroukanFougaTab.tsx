import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Volume2, Copy, Check } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';

interface KouroukanFougaTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

export default function KouroukanFougaTab({ t, langKey }: KouroukanFougaTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${t.kouroukan.oathTitle}\n${t.kouroukan.oathText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <ShieldCheck className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.kouroukan.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.kouroukan.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Oath & Charter */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-black text-amber-200 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            <span>{t.kouroukan.oathTitle}</span>
          </h3>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyReport}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-3">
          <p className="text-sm sm:text-base text-amber-100 italic leading-relaxed text-center font-serif">
            « {t.kouroukan.oathText} »
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.kouroukan.shieldProtection}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Le sceau protège contre la jalousie, le mauvais œil et la stagnation des affaires.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-2">
              <Volume2 size={16} />
              <span>{t.kouroukan.zikrFrequency}</span>
            </span>
            <p className="text-xs text-slate-300 font-mono">
              72 Répétitions par jour • Rythme 108 BPM (Rythme Doundounba de la Victoire)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
