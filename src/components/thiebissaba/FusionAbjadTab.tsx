import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { ThiebissabaTranslation } from './thiebissabaTranslations';
import { MANDINGUE_FIGURES, MandingueFigure, calculateKadyo } from '../../utils/thiebissaba';

interface FusionAbjadTabProps {
  t: ThiebissabaTranslation;
  langKey: 'fr' | 'en' | 'ha';
}

// Simple Abjad calculator helper
function computeAbjadScore(text: string): number {
  if (!text) return 111;
  let score = 0;
  for (let i = 0; i < text.length; i++) {
    score += text.charCodeAt(i);
  }
  return score % 999 || 111;
}

export default function FusionAbjadTab({ t, langKey }: FusionAbjadTabProps) {
  const [userName, setUserName] = useState('Moussa');
  const [copied, setCopied] = useState(false);

  const abjadVal = computeAbjadScore(userName);
  const overriddenSo1Index = abjadVal % MANDINGUE_FIGURES.length;
  const overriddenSo1 = MANDINGUE_FIGURES[overriddenSo1Index];

  const f2 = MANDINGUE_FIGURES[1]; // Mori
  const f3 = MANDINGUE_FIGURES[2]; // Fama

  const kadyo = calculateKadyo(overriddenSo1, f2, f3, 12);
  const kadyoFig = kadyo.verdictFigure;

  // 3x3 Wafq matrix values
  const wafqCell1 = abjadVal;
  const wafqCell2 = abjadVal + 1;
  const wafqCell3 = abjadVal + 2;
  const wafqCell4 = abjadVal + 3;
  const wafqCell5 = abjadVal + 4;
  const wafqCell6 = abjadVal + 5;
  const wafqCell7 = abjadVal + 6;
  const wafqCell8 = abjadVal + 7;
  const wafqCell9 = abjadVal + 8;

  const handleCopy = () => {
    const report = `Fusion Thiebissaba-Abjad:\nNom: ${userName}\nValeur Abjad: ${abjadVal}\nSô 1 Personnalisé: ${overriddenSo1.nameFr} (${overriddenSo1.code})\nVerdict Kadyo Fusionné: ${kadyoFig.nameFr}`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Layers className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.fusion.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.fusion.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
            {t.fusion.userNameInput}
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Entrez votre nom ou prénom..."
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between font-mono">
          <span>{t.fusion.abjadValue}:</span>
          <span className="text-lg font-black">{abjadVal}</span>
        </div>
      </div>

      {/* Fusion Result & Wafq Grid */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              {t.fusion.overriddenHouse1}
            </span>
            <h3 className="text-2xl font-black text-amber-200">
              Sô 1 = {overriddenSo1.nameFr} ({overriddenSo1.symbol})
            </h3>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t.copied : t.copyReport}</span>
          </button>
        </div>

        {/* 3x3 Wafq Matrix Grid */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block text-center">
            {t.fusion.wafqGridTitle} (Wafq Thiebissaba-Abjad)
          </span>

          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto font-mono text-center">
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell1}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell2}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell3}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell4}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell5}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell6}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell7}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell8}</div>
            <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-black">{wafqCell9}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
