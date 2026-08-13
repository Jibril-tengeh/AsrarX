import React, { useState, useMemo } from 'react';
import { Compass, Star, Scale, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { AnchoringTranslation } from './anchoringTranslations';
import { calculateAbjadValue } from '../../utils/abjad';

interface MizanThawabitTabProps {
  t: AnchoringTranslation;
}

// Great Behenian / Fixed Stars Reference Data
const FIXED_STARS_DATA = [
  { nameAr: 'الدبران (Al-Dabarān)', nameFr: 'Aldébaran', constellation: 'Tureau (Taurus)', value: 257, element: 'Feu / Terre', stone: 'Rubis & Pierre de Sang' },
  { nameAr: 'قلب الأسد (Qalb al-Asad)', nameFr: 'Régulus', constellation: 'Lion (Leo)', value: 164, element: 'Feu', stone: 'Granat & Topaze' },
  { nameAr: 'السماك الأعزل (Al-Simāk)', nameFr: 'Spica', constellation: 'Vierge (Virgo)', value: 121, element: 'Air / Terre', stone: 'Émeraude & Saphir' },
  { nameAr: 'قلب العقرب (Qalb al-‘Aqrab)', nameFr: 'Antarès', constellation: 'Scorpion', value: 203, element: 'Eau / Feu', stone: 'Sardoine & Améthyste' },
  { nameAr: 'النسر الواقع (Al-Nasr al-Wāqi‘)', nameFr: 'Véga', constellation: 'Lyre (Lyra)', value: 388, element: 'Air', stone: 'Chrysolite' },
  { nameAr: 'الشعرى العبور (Al-Shi‘rā)', nameFr: 'Sirius', constellation: 'Grand Chien', value: 581, element: 'Eau', stone: 'Béryl clair' },
  { nameAr: 'فم الحوت (Fam al-Ḥūt)', nameFr: 'Fomalhaut', constellation: 'Poisson Austral', value: 535, element: 'Eau', stone: 'Aquamarine' },
  { nameAr: 'العيوق (Al-‘Ayyūq)', nameFr: 'Capella', constellation: 'Cocher (Auriga)', value: 197, element: 'Terre / Air', stone: 'Saphir jaune' },
  { nameAr: 'رأس الغول (Ra’s al-Ghūl)', nameFr: 'Algol', constellation: 'Persée (Perseus)', value: 538, element: 'Eau / Feu', stone: 'Diamant & Onyx' },
  { nameAr: 'السماك الرامح (Al-Rāmiḥ)', nameFr: 'Arcturus', constellation: 'Bouvier (Boötes)', value: 398, element: 'Air', stone: 'Jaspe' }
];

export default function MizanThawabitTab({ t }: MizanThawabitTabProps) {
  const [nameInput, setNameInput] = useState('إبراهيم');

  // Compute Star Resonance
  const starComparisonData = useMemo(() => {
    const raw = nameInput.trim() || 'إبراهيم';
    const nameWeight = calculateAbjadValue(raw);

    const list = FIXED_STARS_DATA.map((star) => {
      const diff = Math.abs(nameWeight - star.value);
      const maxVal = Math.max(nameWeight, star.value);
      const harmonyPct = Math.max(10, Math.min(99, Math.round(100 - (diff * 100) / maxVal)));
      return {
        ...star,
        diff,
        harmonyPct
      };
    });

    // Sort by highest harmony percentage
    list.sort((a, b) => b.harmonyPct - a.harmonyPct);

    const dominantStar = list[0];

    return {
      nameWeight,
      list,
      dominantStar
    };
  }, [nameInput]);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Scale className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.mizanThawabit.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.mizanThawabit.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
            {t.mizanThawabit.nameLabel}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Ex: إبراهيم"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-arabic focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <div className="px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-bold flex items-center justify-center gap-2">
              <span>Poids Abjad :</span>
              <span className="font-mono font-black text-base">{starComparisonData.nameWeight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dominant Star Highlight Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl text-white space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Star size={16} />
            <span>{t.mizanThawabit.dominantStar}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            Harmonie {starComparisonData.dominantStar.harmonyPct}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="text-2xl sm:text-3xl font-black font-arabic text-amber-300">
              {starComparisonData.dominantStar.nameAr}
            </div>
            <div className="text-slate-300 text-sm font-bold mt-1">
              Étoile {starComparisonData.dominantStar.nameFr} ({starComparisonData.dominantStar.constellation})
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs space-y-1">
            <span className="text-amber-400 font-bold block">{t.mizanThawabit.talismanicRecommendation}</span>
            <p className="text-slate-300">
              Support recommandé : <strong className="text-white">{starComparisonData.dominantStar.stone}</strong>. Élément : <strong className="text-indigo-300">{starComparisonData.dominantStar.element}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Fixed Stars Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Star className="text-amber-500" size={18} />
          <span>{t.mizanThawabit.starTableTitle}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-bold">{t.mizanThawabit.starName}</th>
                <th className="py-2.5 px-3 font-bold">{t.mizanThawabit.starConstellation}</th>
                <th className="py-2.5 px-3 font-bold">{t.mizanThawabit.starWeight}</th>
                <th className="py-2.5 px-3 font-bold">{t.mizanThawabit.harmonyScore}</th>
                <th className="py-2.5 px-3 font-bold">{t.mizanThawabit.elementalMatch}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-800 dark:text-slate-200">
              {starComparisonData.list.map((star, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-arabic text-sm font-bold text-amber-600 dark:text-amber-400">
                    {star.nameAr} ({star.nameFr})
                  </td>
                  <td className="py-2.5 px-3 font-medium">{star.constellation}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{star.value}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded font-mono font-bold ${
                      star.harmonyPct > 75
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {star.harmonyPct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 dark:text-slate-400">{star.element}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
