import React, { useState } from 'react';
import { Shield, Sparkles, BookOpen, Crown, Check, Plus, Feather, Flame, Moon, Sun, ArrowRight } from 'lucide-react';
import { ARCHANGELS_PRESET, QURANIC_TAWQ_PRESETS, findMatchingDivineNames, calculateRuhaniyyaNames } from '../../utils/khatimEngine';

interface SacredFramingControlsProps {
  totalAdad: number;
  tawqFrame: string[];
  cornerCalligraphy: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  onUpdateTawq: (borders: string[]) => void;
  onUpdateCorners: (corners: { topLeft: string; topRight: string; bottomLeft: string; bottomRight: string }) => void;
  className?: string;
}

export const SacredFramingControls: React.FC<SacredFramingControlsProps> = ({
  totalAdad,
  tawqFrame,
  cornerCalligraphy,
  onUpdateTawq,
  onUpdateCorners,
  className = '',
}) => {
  const [selectedTab, setSelectedTab] = useState<'archangels' | 'quranic' | 'divine_names' | 'ruhaniyya'>('archangels');

  const matchingNames = findMatchingDivineNames(totalAdad || 66, 6);
  const ruhaniyya = calculateRuhaniyyaNames(totalAdad || 66);

  // Handle Apply 4 Archangels
  const handleApplyArchangels = () => {
    onUpdateCorners(ARCHANGELS_PRESET.corners);
    onUpdateTawq([
      ARCHANGELS_PRESET.borders.top,
      ARCHANGELS_PRESET.borders.right,
      ARCHANGELS_PRESET.borders.bottom,
      ARCHANGELS_PRESET.borders.left,
    ]);
  };

  // Handle Apply Quranic Tawq
  const handleApplyQuranicPreset = (presetId: string) => {
    const preset = QURANIC_TAWQ_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onUpdateTawq([preset.top, preset.right, preset.bottom, preset.left]);
  };

  // Handle Apply Divine Name to Corners
  const handleApplyDivineNameToCorners = (nameAr: string) => {
    onUpdateCorners({
      topLeft: nameAr,
      topRight: nameAr,
      bottomLeft: nameAr,
      bottomRight: nameAr,
    });
  };

  // Handle Apply Ruhaniyya Angel to Top/Right and Servant to Bottom/Left
  const handleApplyRuhaniyya = () => {
    onUpdateCorners({
      topLeft: `يَا ${ruhaniyya.malakAlawi.ar}`,
      topRight: `يَا ${ruhaniyya.malakAlawi.ar}`,
      bottomLeft: `بِحَقِّ ${ruhaniyya.khadimSufli.ar}`,
      bottomRight: `أَجِبْ يَا ${ruhaniyya.khadimSufli.ar}`,
    });
    onUpdateTawq([
      `أَقْسَمْتُ عَلَيْكَ يَا ${ruhaniyya.malakAlawi.ar} بِحَقِّ اسْمِ اللَّهِ الأَعْظَمِ`,
      `أَجِبْ وَتَوَكَّلْ بِقَضَاءِ هَذِهِ الحَاجَةِ فِي هَذِهِ السَّاعَةِ`,
      `الوَحَا الوَحَا العَجَلَ العَجَلَ السَّاعَةَ السَّاعَةَ`,
      `بَارَكَ اللَّهُ فِيكُمْ وَعَلَيْكُمْ وَجَزَاكُمُ اللَّهُ خَيْرًا`,
    ]);
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-7 text-amber-100 shadow-xl space-y-6 ${className}`}>
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-300">
            <Crown size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Encadrement Sacré & Rūḥāniyya Personnalisée</span>
            </h3>
            <p className="text-xs text-indigo-200/80">
              4 Archanges, Versets Coraniques périphériques (Tawq), Noms Divins et Serviteurs spirituels
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-1.5 rounded-2xl border border-indigo-500/30">
        <button
          type="button"
          onClick={() => setSelectedTab('archangels')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedTab === 'archangels'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Shield size={14} />
          <span>4 Grands Archanges</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab('quranic')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedTab === 'quranic'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <BookOpen size={14} />
          <span>Tawq Coranique</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab('divine_names')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedTab === 'divine_names'
              ? 'bg-indigo-500 text-white font-black shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          <span>Noms Divins Résonants</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTab('ruhaniyya')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            selectedTab === 'ruhaniyya'
              ? 'bg-purple-600 text-white font-black shadow-md'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Feather size={14} />
          <span>Rūḥāniyya / Khoddam</span>
        </button>
      </div>

      {/* TAB 1: 4 ARCHANGELS */}
      {selectedTab === 'archangels' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-4 rounded-2xl border border-amber-500/30">
            <div>
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Shield size={16} className="text-amber-400" />
                <span>Les 4 Grands Archanges Célestes (الملائكة الأربعة المقربون)</span>
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Place automatiquement Jibrīl, Mīkā'īl, Isrāfīl et 'Izrā'īl aux 4 coins cardinaux du Khatim.
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyArchangels}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Check size={15} />
              <span>Appliquer aux 4 Coins & Bordures</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ARCHANGELS_PRESET.namesList.map((archangel) => (
              <div key={archangel.ar} className="bg-black/50 border border-amber-500/20 rounded-2xl p-3.5 space-y-1.5 text-center">
                <span className="text-base font-arabic font-bold text-amber-300 block" dir="rtl">{archangel.ar}</span>
                <span className="text-xs font-bold text-white block">{archangel.fr}</span>
                <span className="text-[10px] text-amber-200/70 block">{archangel.virtue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QURANIC TAWQ PRESETS */}
      {selectedTab === 'quranic' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-emerald-500/30">
            Sélectionnez un Tawq sacré pour encadrer automatiquement les 4 bordures extérieures (Haut, Droite, Bas, Gauche) avec les versets coraniques les plus puissants :
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QURANIC_TAWQ_PRESETS.map((preset) => (
              <div key={preset.id} className="bg-black/50 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">{preset.nameFr}</span>
                    <span className="text-[10px] font-arabic text-amber-300" dir="rtl">{preset.nameAr}</span>
                  </div>
                  <p className="text-xs font-arabic text-gray-200 line-clamp-2 leading-relaxed" dir="rtl">
                    {preset.top}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyQuranicPreset(preset.id)}
                  className="w-full py-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Appliquer au Tawq</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIVINE NAMES RESONATING */}
      {selectedTab === 'divine_names' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-indigo-500/30">
            Noms Divins d'Allah (الأسماء الحسنى) dont la valeur Abjad résonne avec le poids total ({totalAdad}) :
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchingNames.map((name) => (
              <div key={name.ar} className="bg-black/50 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-arabic font-bold text-amber-300" dir="rtl">{name.ar}</span>
                    <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Adad: {name.abjad}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block">{name.tr} — {name.fr}</span>
                  <span className="text-[10px] text-gray-400 block line-clamp-1">{name.ref}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyDivineNameToCorners(name.ar)}
                    className="py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer text-center"
                  >
                    Aux 4 Coins
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTawq([`يَا ${name.ar} يَا ذَا الجَلاَلِ`, `يَا ${name.ar} يَا رَحْمَٰنُ`, `يَا ${name.ar} يَا قَيُّومُ`, `يَا ${name.ar} يَا كَرِيمُ`])}
                    className="py-1.5 px-2 bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white border border-amber-500/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer text-center"
                  >
                    Dans le Tawq
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RUHANIYYA / KHODDAM */}
      {selectedTab === 'ruhaniyya' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/40 p-4 rounded-2xl border border-purple-500/30">
            <div>
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Feather size={16} className="text-purple-400" />
                <span>Extraction Spirituelle des Serviteurs (استخراج الروحانية والخدام)</span>
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Calculés à partir de la décomposition des lettres du nombre {totalAdad} ({ruhaniyya.rawLetters})
              </p>
            </div>

            <button
              type="button"
              onClick={handleApplyRuhaniyya}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Sparkles size={15} />
              <span>Consacrer avec ces Serviteurs</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upper Angel */}
            <div className="bg-black/50 border border-purple-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase">Ange Supérieur Céleste (الملك العلوي)</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">Suffixe -yā'īl</span>
              </div>
              <span className="text-xl font-arabic font-black text-amber-300 block" dir="rtl">
                يَا {ruhaniyya.malakAlawi.ar}
              </span>
              <p className="text-xs text-gray-300">{ruhaniyya.malakAlawi.meaningFr}</p>
            </div>

            {/* Lower Servant */}
            <div className="bg-black/50 border border-indigo-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase">Esprit Exécuteur Terrestre (الخادم السفلي)</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Suffixe -ṭaysh</span>
              </div>
              <span className="text-xl font-arabic font-black text-indigo-300 block" dir="rtl">
                {ruhaniyya.khadimSufli.ar}
              </span>
              <p className="text-xs text-gray-300">{ruhaniyya.khadimSufli.meaningFr}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
