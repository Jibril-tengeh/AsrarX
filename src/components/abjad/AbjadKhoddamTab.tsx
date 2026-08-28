import React, { useState } from 'react';
import { Sparkles, Shield, Compass, Copy, Check, Info, Flame, Wind, Droplets, Mountain } from 'lucide-react';
import { generateRouhaniyyaEntities, vocalizeAbjadRootLetters, ElementType } from '../../utils/abjadMasterEngine';

interface AbjadKhoddamTabProps {
  abjadValue: number;
  system: 'mashriqi' | 'maghribi';
  dominantElement: ElementType;
  inputText: string;
}

const TRADITIONAL_SUFFIXES = [
  { id: 'ya_il', label: 'ـيَائِيلُ (-yā\'īl)', ar: 'يَائِيلُ', desc: 'Ange Céleste / Lumière' },
  { id: 'il', label: 'ـئِيلُ (-īl)', ar: 'ئِيلُ', desc: 'Archange Majeur' },
  { id: 'taytash', label: 'ـطَيْطَشٍ (-taytash)', ar: 'طَيْطَشٍ', desc: 'Serviteur d\'Action & Concrétisation' },
  { id: 'lush', label: 'ـلُوشٍ (-lūsh)', ar: 'لُوشٍ', desc: 'Gardien de Protection & Voile' },
  { id: 'yush', label: 'ـيُوشٍ (-yūsh)', ar: 'يُوشٍ', desc: 'Entité Subtile de Méditation' },
  { id: 'halyush', label: 'ـهَلْيُوشٍ (-halyūsh)', ar: 'هَلْيُوشٍ', desc: 'Puissance de Feu & Révélation' },
  { id: 'kalakh', label: 'ـكَلَخٍ (-kalakh)', ar: 'كَلَخٍ', desc: 'Ancrage Terrestre & Trésors' }
];

export const AbjadKhoddamTab: React.FC<AbjadKhoddamTabProps> = ({
  abjadValue,
  system,
  dominantElement,
  inputText
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCustomSuffix, setSelectedCustomSuffix] = useState<string>('يَائِيلُ');
  const [customSuffixInput, setCustomSuffixInput] = useState<string>('');

  const result = generateRouhaniyyaEntities(abjadValue, system, dominantElement);

  const activeSuffix = customSuffixInput.trim() || selectedCustomSuffix;
  const customGeneratedName = `${result.vocalizedRoot}${activeSuffix}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900/15 via-indigo-900/15 to-blue-900/15 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-base">
              <Sparkles size={20} />
              <span>Générateur Algorithmique de Rūḥāniyya & Khoddam</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Extraction selon les règles traditionnelles des lettres racines (Istikhrāj) et vocalisation phonétique sacrée (Tashkeel).
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-xl border border-purple-200 dark:border-purple-800 self-start sm:self-auto shadow-xs">
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Racine Abjad</span>
              <span className="font-arabic font-extrabold text-xl text-purple-600 dark:text-purple-400">
                {result.vocalizedRoot}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Main Guarding Entities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.entities.map((entity) => (
          <div
            key={entity.id}
            className="p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                  {entity.categoryFr}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-arabic text-xs font-bold">
                  {entity.suffixAr}
                </span>
              </div>

              {/* Name Display */}
              <div className="my-3 text-center p-3 rounded-2xl bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 border border-gray-200/80 dark:border-gray-700">
                <div className="font-arabic font-black text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-wide">
                  {entity.nameAr}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {entity.nameTransliteration}
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {entity.natureFr}
              </p>
            </div>

            {/* Invocation / Qasam */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700/80 space-y-2">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 font-arabic text-sm text-gray-800 dark:text-gray-200 text-right leading-relaxed border border-gray-200/60 dark:border-gray-800">
                {entity.qasamInvocationAr}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 italic truncate max-w-[240px]">
                  {entity.qasamInvocationFr}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(`${entity.nameAr}\n${entity.qasamInvocationAr}`, entity.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 transition-all active:scale-95"
                >
                  {copiedId === entity.id ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Degrees Decomposition (Ahād, 'Asharāt, Mi'āt, Ulūf) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h4 className="font-extrabold text-gray-900 dark:text-white text-base mb-1">
          Décomposition par Degrés Célestes (Marātib al-A'dād)
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
          Chaque ordre de grandeur (Unités, Dizaines, Centaines, Milliers) génère son propre ange régent selon la tradition ésotérique.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {result.degrees.map((deg, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                  {deg.levelNameFr}
                </span>
                <div className="text-xl font-black text-gray-900 dark:text-white my-1">
                  {deg.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <span>Lettre racine :</span>
                  <span className="font-arabic font-bold text-base text-blue-600 dark:text-blue-400">
                    {deg.letterAr}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="font-arabic font-bold text-sm text-gray-800 dark:text-gray-200">
                  {deg.khoddamNameAr}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(deg.khoddamNameAr, `deg-${idx}`)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="Copier le nom"
                >
                  {copiedId === `deg-${idx}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Suffix Builder */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-lg border border-indigo-900/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-base text-indigo-100">
            Personnalisation Avancée du Suffixe Spirituel
          </h4>
        </div>

        <p className="text-xs text-indigo-200/80 mb-4">
          Sélectionnez ou tapez un suffixe d'attachement traditionnel pour créer une dérivation sur-mesure :
        </p>

        {/* Suffixes Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TRADITIONAL_SUFFIXES.map((sfx) => (
            <button
              key={sfx.id}
              type="button"
              onClick={() => {
                setSelectedCustomSuffix(sfx.ar);
                setCustomSuffixInput('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCustomSuffix === sfx.ar && !customSuffixInput
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-900/50 text-indigo-200 hover:bg-indigo-900/80 border border-indigo-800/60'
              }`}
            >
              <span className="font-arabic text-sm">{sfx.label}</span>
            </button>
          ))}
        </div>

        {/* Live Custom Name Result */}
        <div className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              Entité Générée Personnalisée
            </span>
            <span className="font-arabic font-black text-3xl text-cyan-300 tracking-wide">
              {customGeneratedName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(customGeneratedName, 'custom-generated')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            {copiedId === 'custom-generated' ? (
              <>
                <Check size={15} className="text-emerald-300" />
                <span>Copié avec succès !</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copier le Serviteur</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
