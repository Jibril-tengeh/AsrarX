import React, { useState, useMemo } from 'react';
import { Sparkles, Copy, Check, Info, Shield, Moon, Compass, HeartHandshake } from 'lucide-react';
import { AnchoringTranslation } from './anchoringTranslations';
import { calculateAbjadValue, numberToAbjadLetters } from '../../utils/abjad';

interface IsmBatinTabProps {
  t: AnchoringTranslation;
}

// 12 Zodiac Constellations & Abjad Values
const ZODIAC_CONSTELLATIONS = [
  { key: 'aries', nameAr: 'الحمل (Al-Hamal)', nameFr: 'Bélier (Aries)', value: 83, element: 'Fire' },
  { key: 'taurus', nameAr: 'الثور (Al-Thawr)', nameFr: 'Taureau (Taurus)', value: 707, element: 'Earth' },
  { key: 'gemini', nameAr: 'الجوزاء (Al-Jawzā’)', nameFr: 'Gémeaux (Gemini)', value: 52, element: 'Air' },
  { key: 'cancer', nameAr: 'السرطان (Al-Saraṭān)', nameFr: 'Cancer', value: 380, element: 'Water' },
  { key: 'leo', nameAr: 'الأسد (Al-Asad)', nameFr: 'Lion (Leo)', value: 95, element: 'Fire' },
  { key: 'virgo', nameAr: 'العذراء (Al-‘Adhrā’)', nameFr: 'Vierge (Virgo)', value: 1246, element: 'Earth' },
  { key: 'libra', nameAr: 'الميزان (Al-Mīzān)', nameFr: 'Balance (Libra)', value: 117, element: 'Air' },
  { key: 'scorpio', nameAr: 'العقرب (Al-‘Aqrab)', nameFr: 'Scorpion (Scorpio)', value: 372, element: 'Water' },
  { key: 'sagittarius', nameAr: 'القوس (Al-Qaws)', nameFr: 'Sagittaire (Sagittarius)', value: 361, element: 'Fire' },
  { key: 'capricorn', nameAr: 'الجدي (Al-Jady)', nameFr: 'Capricorne (Capricorn)', value: 17, element: 'Earth' },
  { key: 'aquarius', nameAr: 'الدلو (Al-Dalw)', nameFr: 'Verseau (Aquarius)', value: 41, element: 'Air' },
  { key: 'pisces', nameAr: 'الحوت (Al-Ḥūt)', nameFr: 'Poissons (Pisces)', value: 15, element: 'Water' }
];

export default function IsmBatinTab({ t }: IsmBatinTabProps) {
  const [physicalName, setPhysicalName] = useState('محمد');
  const [motherName, setMotherName] = useState('آمنة');
  const [selectedConstellationKey, setSelectedConstellationKey] = useState('leo');
  const [suffixType, setSuffixType] = useState<'eel' | 'oosh' | 'yael'>('eel');
  const [copied, setCopied] = useState(false);

  // Compute Ism al-Batin
  const soulData = useMemo(() => {
    const rawPhys = physicalName.trim() || 'محمد';
    const physWeight = calculateAbjadValue(rawPhys);

    const rawMoth = motherName.trim();
    const mothWeight = rawMoth ? calculateAbjadValue(rawMoth) : 0;

    const constObj = ZODIAC_CONSTELLATIONS.find(c => c.key === selectedConstellationKey) || ZODIAC_CONSTELLATIONS[4];
    const constWeight = constObj.value;

    // Core rule: Soul Weight = Constellation Weight - Physical Name Weight
    let soulWeight = Math.abs(constWeight - physWeight);
    if (soulWeight === 0) soulWeight = constWeight + physWeight;

    // Convert Soul Weight to Abjad Letters
    const baseSoulLetters = numberToAbjadLetters(soulWeight);

    // Append Spiritual Suffix
    let suffixAr = 'ايل';
    let suffixTrans = 'īl';
    if (suffixType === 'oosh') {
      suffixAr = 'وش';
      suffixTrans = 'ūsh';
    } else if (suffixType === 'yael') {
      suffixAr = 'يائيل';
      suffixTrans = 'yā’īl';
    }

    const fullSoulNameAr = `${baseSoulLetters}${suffixAr}`;
    const fullSoulNameWeight = soulWeight + (suffixType === 'oosh' ? 312 : suffixType === 'yael' ? 52 : 42);

    return {
      physWeight,
      mothWeight,
      constObj,
      soulWeight,
      baseSoulLetters,
      suffixAr,
      suffixTrans,
      fullSoulNameAr,
      fullSoulNameWeight
    };
  }, [physicalName, motherName, selectedConstellationKey, suffixType]);

  const handleCopy = () => {
    const txt = `Ism al-Batin: ${soulData.fullSoulNameAr} (${soulData.fullSoulNameWeight}) - Constellation: ${soulData.constObj.nameFr}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0 mt-1">
            <Sparkles className="text-amber-400" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-200">
              {t.ismBatin.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t.ismBatin.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Input Controls & Result Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.ismBatin.nameInput}
              </label>
              <input
                type="text"
                value={physicalName}
                onChange={(e) => setPhysicalName(e.target.value)}
                placeholder="Ex: محمد"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-arabic focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.ismBatin.motherInput}
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="Ex: آمنة"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm font-arabic focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.ismBatin.constellationSelect}
              </label>
              <select
                value={selectedConstellationKey}
                onChange={(e) => setSelectedConstellationKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {ZODIAC_CONSTELLATIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.nameFr} — {c.nameAr} ({c.value})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                {t.ismBatin.spiritualSuffix}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSuffixType('eel')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    suffixType === 'eel'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  ـايل (-īl)
                </button>
                <button
                  type="button"
                  onClick={() => setSuffixType('yael')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    suffixType === 'yael'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  ـيائيل (-yā’īl)
                </button>
                <button
                  type="button"
                  onClick={() => setSuffixType('oosh')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    suffixType === 'oosh'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-transparent'
                  }`}
                >
                  ـوش (-ūsh)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Soul Name Result Card */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl text-white space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Shield size={16} />
                <span>{t.ismBatin.soulNameResult}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                {soulData.constObj.element} • {soulData.constObj.nameFr}
              </span>
            </div>

            {/* Revealed Soul Name Badge */}
            <div className="text-center py-6 bg-slate-900/80 rounded-2xl border border-amber-500/20 shadow-inner space-y-3">
              <div className="text-4xl sm:text-6xl font-black font-arabic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-300 tracking-wider">
                {soulData.fullSoulNameAr}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                Poids Théurgique Global : <span className="text-amber-400 font-bold font-mono">{soulData.fullSoulNameWeight}</span>
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.ismBatin.physicalWeight}</span>
                <span className="text-amber-300 font-bold font-mono text-base">{soulData.physWeight}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.ismBatin.constellationWeight}</span>
                <span className="text-indigo-300 font-bold font-mono text-base">{soulData.constObj.value}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.ismBatin.soulWeight}</span>
                <span className="text-emerald-400 font-bold font-mono text-base">{soulData.soulWeight}</span>
              </div>
            </div>

            {/* Invocations Section */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <HeartHandshake size={16} />
                <span>{t.ismBatin.divineInvocation}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Invoquer <span className="font-arabic font-bold text-amber-200 text-sm">يا باطن يا ظاهر يا سلام</span> ({soulData.fullSoulNameWeight} fois) pour activer l'ancrage profond de l'âme avec la constellation {soulData.constObj.nameFr}.
              </p>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              {copied ? <Check size={16} className="text-slate-950" /> : <Copy size={16} />}
              <span>{copied ? t.ismBatin.copied : t.ismBatin.copySoulName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
