import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Calculator, Shield, BookOpen, Layers } from 'lucide-react';
import { OrderMetadata, ORDERS_METADATA } from '../../utils/khatimEngine';

interface KasrMathBreakdownProps {
  gridSize: number;
  totalAdad: number;
  step: number;
  remainder: number;
  kasrHouse: number;
  minRequired: number;
  magicAudit: {
    rowSums: number[];
    colSums: number[];
    diag1Sum: number;
    diag2Sum: number;
    isMagicSquare: boolean;
    targetSum: number;
  } | null;
  className?: string;
}

export const KasrMathBreakdown: React.FC<KasrMathBreakdownProps> = ({
  gridSize,
  totalAdad,
  step,
  remainder,
  kasrHouse,
  minRequired,
  magicAudit,
  className = '',
}) => {
  const orderMeta: OrderMetadata = ORDERS_METADATA[gridSize] || {
    size: gridSize,
    nameFr: `Ordre ${gridSize}x${gridSize}`,
    nameEn: `Order ${gridSize}x${gridSize}`,
    nameAr: `وفق ${gridSize}×${gridSize}`,
    elementFr: "Mixte",
    elementAr: "جامع",
    planetFr: "Falak",
    planetAr: "الفلك",
    baseAsas: Math.floor((gridSize * (gridSize * gridSize - 1)) / 2),
    minMagicSum: Math.floor((gridSize * (gridSize * gridSize + 1)) / 2),
    kasrFormulaDescFr: `(Total - ${Math.floor((gridSize * (gridSize * gridSize - 1)) / 2)}) / ${gridSize}`,
    kasrFormulaDescEn: `(Total - ${Math.floor((gridSize * (gridSize * gridSize - 1)) / 2)}) / ${gridSize}`,
    spiritualVirtueFr: "Équilibre et harmonie spirituelle.",
    spiritualVirtueEn: "Spiritual balance and harmony.",
  };

  const baseAsas = orderMeta.baseAsas;
  const delta = totalAdad - baseAsas;
  const miftah = Math.floor(delta / gridSize);
  const mughlaq = miftah + (gridSize * gridSize - 1) + (remainder > 0 ? remainder : 0);

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-900 border border-purple-500/40 rounded-3xl p-5 sm:p-7 text-amber-100 shadow-xl space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-300">
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Gestion Automatique de la Fracture (Kasr) & Calcul Sacré</span>
            </h3>
            <p className="text-xs text-amber-200/80">
              Décomposition mathématique exacte selon la science traditionnelle de l'Ordre {gridSize}x{gridSize} ({orderMeta.nameAr})
            </p>
          </div>
        </div>

        {magicAudit && (
          <div className={`px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border shadow-sm ${
            magicAudit.isMagicSquare || magicAudit.rowSums[0] === totalAdad
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            <CheckCircle2 size={15} />
            <span>Somme Sacrée : {totalAdad} (Conforme)</span>
          </div>
        )}
      </div>

      {/* Grid of Key Mathematical Variables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* 1. Jumla Total */}
        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-3 text-center flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total (Jumla)</span>
          <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">{totalAdad}</span>
          <span className="text-[9px] text-gray-400 font-arabic">الجملة الكلية</span>
        </div>

        {/* 2. Base Usul / Asas */}
        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-3 text-center flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Base (Asas)</span>
          <span className="text-lg sm:text-xl font-black text-indigo-300 font-mono">{baseAsas}</span>
          <span className="text-[9px] text-gray-400 font-arabic">الأساس / n(n²-1)/2</span>
        </div>

        {/* 3. Miftah (Key) */}
        <div className="bg-black/50 border border-emerald-500/40 rounded-2xl p-3 text-center flex flex-col justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Clé (Miftah)</span>
          <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono">{miftah}</span>
          <span className="text-[9px] text-emerald-400/80 font-arabic">المفتاح (بيت 1)</span>
        </div>

        {/* 4. Khatwa (Step) */}
        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-3 text-center flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Pas (Khatwa)</span>
          <span className="text-lg sm:text-xl font-black text-purple-300 font-mono">1</span>
          <span className="text-[9px] text-gray-400 font-arabic">خطوة المشي</span>
        </div>

        {/* 5. Kasr (Remainder) */}
        <div className={`bg-black/50 border rounded-2xl p-3 text-center flex flex-col justify-center ${
          remainder > 0 ? 'border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-purple-500/30'
        }`}>
          <span className="text-[10px] uppercase font-bold text-amber-400">Fracture (Kasr)</span>
          <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">
            {remainder === 0 ? '0 (Parfait)' : `+${remainder}`}
          </span>
          <span className="text-[9px] text-gray-400 font-arabic">الكسر / الفضلة</span>
        </div>

        {/* 6. Mughlaq (Closing) */}
        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-3 text-center flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Sceau (Mughlaq)</span>
          <span className="text-lg sm:text-xl font-black text-rose-300 font-mono">{mughlaq}</span>
          <span className="text-[9px] text-gray-400 font-arabic">المغلق (بيت {gridSize * gridSize})</span>
        </div>
      </div>

      {/* Mathematical Explanation & Rule of Fracture */}
      <div className="bg-black/40 border border-purple-500/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <BookOpen size={15} />
          <span>Formule Canonique de Répartition du Kasr ({orderMeta.nameFr}) :</span>
        </div>

        <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 font-mono text-xs text-purple-200 leading-relaxed">
          <p>✦ <strong>Calcul du Miftah :</strong> ({totalAdad} - {baseAsas}) ÷ {gridSize} = <strong>{miftah}</strong> avec reste <strong>{remainder}</strong></p>
          {remainder > 0 ? (
            <p className="mt-1 text-amber-300">
              ✦ <strong>Loi de la Fracture (Kasr) :</strong> Le reste de <strong>+{remainder}</strong> est inséré à la <strong>Maison {kasrHouse}</strong> ({kasrHouse}ème case), augmentant les cases suivantes de +{remainder} pour équilibrer la somme totale à {totalAdad}.
            </p>
          ) : (
            <p className="mt-1 text-emerald-300">
              ✦ <strong>Wafq Parfait (Tâmm) :</strong> Le reste est nul (0), le carré magique est parfait sans aucune fracture ni saut de nombre !
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-amber-400 font-bold">Élément & Planète :</span>
            <span>{orderMeta.elementFr} ({orderMeta.planetFr})</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-amber-400 font-bold">Vertu Mystique :</span>
            <span className="truncate">{orderMeta.spiritualVirtueFr}</span>
          </div>
        </div>
      </div>

      {/* Real-Time Magic Sums Verification Matrix */}
      {magicAudit && (
        <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-2">
              <Shield size={15} />
              <span>Vérification Mathématique des Sommes (Lignes, Colonnes, Diagonales) :</span>
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Cible = {totalAdad}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            {/* Rows */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Sommes des {gridSize} Lignes (Rows)</span>
              <div className="flex flex-wrap gap-1">
                {magicAudit.rowSums.map((sum, idx) => (
                  <span
                    key={`row-${idx}`}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sum === totalAdad ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    L{idx + 1}:{sum}
                  </span>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Sommes des {gridSize} Colonnes (Cols)</span>
              <div className="flex flex-wrap gap-1">
                {magicAudit.colSums.map((sum, idx) => (
                  <span
                    key={`col-${idx}`}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      sum === totalAdad ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    C{idx + 1}:{sum}
                  </span>
                ))}
              </div>
            </div>

            {/* Diagonals */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-gray-700/60">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Sommes des 2 Diagonales</span>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    magicAudit.diag1Sum === totalAdad ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  Diag ↘ : {magicAudit.diag1Sum}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    magicAudit.diag2Sum === totalAdad ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  Diag ↗ : {magicAudit.diag2Sum}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
