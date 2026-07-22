import React, { useState } from 'react';
import { Heart, Sparkles, Flame, Droplets, Mountain, Wind, RefreshCw, ShieldAlert, CheckCircle, Copy, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FULL_28_LETTERS_DATA, LetterInfo } from '../pages/user/tools/ScienceOfLetters';
import { useFeatures } from '../contexts/FeatureContext';

// Helper map for Latin to Arabic transliteration for names
const LATIN_TO_ARABIC_MAP: { [key: string]: string } = {
  a: 'ا', b: 'ب', t: 'ت', th: 'ث', j: 'ج', h: 'ح', kh: 'خ',
  d: 'د', dh: 'ذ', r: 'ر', z: 'ز', s: 'س', sh: 'ش', sad: 'ص',
  dad: 'ض', ta: 'ط', zha: 'ظ', ayn: 'ع', gh: 'غ', f: 'ف', q: 'ق',
  k: 'ك', l: 'ل', m: 'م', n: 'ن', w: 'و', y: 'ي', e: 'ا', o: 'و', u: 'و', i: 'ي'
};

const convertLatinToArabicIfPossible = (str: string): string => {
  const containsArabic = /[\u0600-\u06FF]/.test(str);
  if (containsArabic) return str;

  // Convert latin letters to arabic
  let result = '';
  const lower = str.toLowerCase().replace(/[^a-z]/g, '');
  let i = 0;
  while (i < lower.length) {
    if (i + 1 < lower.length && LATIN_TO_ARABIC_MAP[lower.substring(i, i + 2)]) {
      result += LATIN_TO_ARABIC_MAP[lower.substring(i, i + 2)];
      i += 2;
    } else if (LATIN_TO_ARABIC_MAP[lower[i]]) {
      result += LATIN_TO_ARABIC_MAP[lower[i]];
      i++;
    } else {
      i++;
    }
  }
  return result;
};

interface ElementalBreakdown {
  Feu: number;
  Terre: number;
  Air: number;
  Eau: number;
  totalLetters: number;
  totalAbjad: number;
  lettersList: LetterInfo[];
}

const analyzeNameElements = (rawName: string): ElementalBreakdown => {
  const arabicStr = convertLatinToArabicIfPossible(rawName);
  const breakdown: ElementalBreakdown = {
    Feu: 0,
    Terre: 0,
    Air: 0,
    Eau: 0,
    totalLetters: 0,
    totalAbjad: 0,
    lettersList: []
  };

  for (const char of arabicStr) {
    const letter = FULL_28_LETTERS_DATA.find(l => l.char === char);
    if (letter) {
      breakdown[letter.element] += 1;
      breakdown.totalAbjad += letter.abjad;
      breakdown.totalLetters += 1;
      breakdown.lettersList.push(letter);
    }
  }

  return breakdown;
};

export const SpiritualCompatibilityTawafuq: React.FC = () => {
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [mother1, setMother1] = useState('');
  const [mother2, setMother2] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const calculateCompatibility = () => {
    if (!name1.trim() || !name2.trim()) return;

    const name1Full = `${name1} ${mother1}`.trim();
    const name2Full = `${name2} ${mother2}`.trim();

    const elem1 = analyzeNameElements(name1Full);
    const elem2 = analyzeNameElements(name2Full);

    if (elem1.totalLetters === 0 || elem2.totalLetters === 0) return;

    // Elemental compatibility weights
    // Fire + Air = High (+25)
    // Earth + Water = High (+25)
    // Fire + Fire / Earth + Earth / etc = Medium (+15)
    // Air + Water / Earth + Fire = Neutral (+10)
    // Fire + Water / Air + Earth = Conflict (-10 or needs balance)

    let score = 50; // base score

    // Dominant elements
    const getDominant = (e: ElementalBreakdown) => {
      const keys: Array<'Feu' | 'Terre' | 'Air' | 'Eau'> = ['Feu', 'Terre', 'Air', 'Eau'];
      return keys.reduce((a, b) => e[a] > e[b] ? a : b);
    };

    const dom1 = getDominant(elem1);
    const dom2 = getDominant(elem2);

    let interactionType = 'Neutre';
    let interactionDesc = '';

    if ((dom1 === 'Feu' && dom2 === 'Air') || (dom1 === 'Air' && dom2 === 'Feu')) {
      score += 35;
      interactionType = 'Harmonie Élevée (L\'Air attise le Feu)';
      interactionDesc = 'Excellente synergie spirituelle et créative. L\'un apporte la vision et l\'inspiration, l\'autre la force et l\'exécution.';
    } else if ((dom1 === 'Eau' && dom2 === 'Terre') || (dom1 === 'Terre' && dom2 === 'Eau')) {
      score += 35;
      interactionType = 'Harmonie Profonde (L\'Eau fertilise la Terre)';
      interactionDesc = 'Relation très stable, féconde et protectrice. Ancrage solide, confiance mutuelle et paix du foyer.';
    } else if (dom1 === dom2) {
      score += 25;
      interactionType = `Amplification (${dom1} + ${dom2})`;
      interactionDesc = 'Affinité naturelle directe. Vous partagez le même tempérament énergétique, favorisant une compréhension spontanée.';
    } else if ((dom1 === 'Feu' && dom2 === 'Eau') || (dom1 === 'Eau' && dom2 === 'Feu')) {
      score -= 10;
      interactionType = 'Tension Élémentaire (Le Feu et l\'Eau)';
      interactionDesc = 'Opposition d\'éléments. L\'Eau peut éteindre le Feu ou le Feu peut faire bouillir l\'Eau. Nécessite le Wird d\'harmonisation pour adoucir les tempéraments.';
    } else {
      score += 15;
      interactionType = 'Complémentarité Neutre';
      interactionDesc = 'Équilibre passif nécessitant une communication claire et de la patience mutuelle.';
    }

    // Abjad modulo harmony (traditional Tawafuq formula)
    const totalCombinedAbjad = elem1.totalAbjad + elem2.totalAbjad;
    const modulo9 = (totalCombinedAbjad % 9) || 9;

    let tawafuqModDesc = '';
    if ([1, 3, 7, 9].includes(modulo9)) {
      score += 10;
      tawafuqModDesc = 'Nombre d\'alliance bénéfique (Barakah & Ouverture).';
    } else if ([2, 4, 6].includes(modulo9)) {
      score += 5;
      tawafuqModDesc = 'Nombre de stabilité et de construction réciproque.';
    } else {
      tawafuqModDesc = 'Nombre nécessitant de la patience et la récitation de Ya Latif.';
    }

    const finalScore = Math.min(99, Math.max(35, score));

    // Recommended Wird for this pair
    const recommendedWird = {
      name: finalScore >= 75 ? "Ya Wadud (114x) & Ya Jami' (114x)" : "Ya Latif (129x) & Ya Salam (131x)",
      arabic: finalScore >= 75 
        ? "يَا وَدُودُ يَا جَامِعُ اِجْمَعْ بَيْنَهُمَا فِي خَيْرٍ" 
        : "يَا لَطِيفُ يَا سَلاَمُ أَلْقِ المَوَدَّةَ وَالسَّكِينَةَ بَيْنَهُمَا",
      transliteration: finalScore >= 75
        ? "Ya Wadudu ya Jami'u ijma' baynahuma fi khayr."
        : "Ya Latifu ya Salamu alqi al-mawaddata was-sakinata baynahuma.",
      translation: finalScore >= 75
        ? "Ô Bienveillant, Ô Rassembleur, unis-les dans le bien et la bénédiction."
        : "Ô Subtil, Ô Paix, insuffle l'affection et la sérénité entre eux."
    };

    setAnalysisResult({
      name1Arabic: convertLatinToArabicIfPossible(name1),
      name2Arabic: convertLatinToArabicIfPossible(name2),
      elem1,
      elem2,
      dom1,
      dom2,
      score: finalScore,
      interactionType,
      interactionDesc,
      modulo9,
      tawafuqModDesc,
      recommendedWird
    });
  };

  const handleCopyWird = (text: string) => {
    if (disableDuaCopy) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 sm:space-y-6">
      {/* Module Title */}
      <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="text-rose-500 shrink-0" size={20} />
          <span>Calculateur de Compatibilité Spirituelle (Tawafuq)</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          Analyse d'harmonie entre deux personnes ou projets, basée sur les 4 éléments des lettres (Feu, Terre, Air, Eau) et les valeurs Abjad.
        </p>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Entity / Person 1 */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
            <Users size={14} /> Entité / Personne 1
          </div>

          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">Nom / Prénom / Projet :</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Ex: Muhammad / محمد"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">Nom Mère (Optionnel) :</label>
            <input
              type="text"
              value={mother1}
              onChange={(e) => setMother1(e.target.value)}
              placeholder="Ex: Amina / آمنة"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic"
            />
          </div>
        </div>

        {/* Entity / Person 2 */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
            <Heart size={14} /> Entité / Personne 2
          </div>

          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">Nom / Prénom / Projet 2 :</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Ex: Fatima / فاطمة"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-arabic"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">Nom Mère 2 (Optionnel) :</label>
            <input
              type="text"
              value={mother2}
              onChange={(e) => setMother2(e.target.value)}
              placeholder="Ex: Khadija / خديجة"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-arabic"
            />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateCompatibility}
        disabled={!name1.trim() || !name2.trim()}
        className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Sparkles size={16} /> Calculer le Tawafuq Spirituel
      </button>

      {/* Results Section */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700"
        >
          {/* Main Compatibility Score Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white text-center shadow-xl border border-indigo-500/30 relative overflow-hidden">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
              TAWAFUQ • HARMONIE SPIRITUELLE DES LETTRES
            </span>

            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-2xl font-arabic text-amber-200 font-bold">{analysisResult.name1Arabic}</span>
              <Heart className="text-rose-500 animate-pulse" size={24} />
              <span className="text-2xl font-arabic text-amber-200 font-bold">{analysisResult.name2Arabic}</span>
            </div>

            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-300 my-3">
              {analysisResult.score}%
            </div>

            <p className="text-sm font-bold text-emerald-300 max-w-lg mx-auto">
              {analysisResult.interactionType}
            </p>
            <p className="text-xs text-gray-300 mt-1 max-w-xl mx-auto leading-relaxed">
              {analysisResult.interactionDesc}
            </p>
          </div>

          {/* Elemental Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Person 1 Elemental Card */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{name1}</span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">Abjad : {analysisResult.elem1.totalAbjad}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">Feu: {analysisResult.elem1.Feu}</div>
                <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-lg">Terre: {analysisResult.elem1.Terre}</div>
                <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-lg">Air: {analysisResult.elem1.Air}</div>
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">Eau: {analysisResult.elem1.Eau}</div>
              </div>
            </div>

            {/* Person 2 Elemental Card */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{name2}</span>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">Abjad : {analysisResult.elem2.totalAbjad}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                <div className="p-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg">Feu: {analysisResult.elem2.Feu}</div>
                <div className="p-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-lg">Terre: {analysisResult.elem2.Terre}</div>
                <div className="p-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-lg">Air: {analysisResult.elem2.Air}</div>
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">Eau: {analysisResult.elem2.Eau}</div>
              </div>
            </div>
          </div>

          {/* Recommended Alignment Wird */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-500/30 space-y-3 relative w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="shrink-0" /> Recommandation & Invocation d'Harmonisation
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto whitespace-nowrap">
                {analysisResult.recommendedWird.name}
              </span>
            </div>

            <p 
              dir="rtl" 
              className={`text-xl sm:text-3xl font-quran text-amber-100 text-center leading-relaxed sm:leading-[2.2] break-words px-2 w-full max-w-full ${
                disableDuaCopy ? 'select-none' : ''
              }`} 
              style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}
              onCopy={(e) => { if (disableDuaCopy) e.preventDefault(); }}
              onContextMenu={(e) => { if (disableDuaCopy) e.preventDefault(); }}
            >
              {analysisResult.recommendedWird.arabic}
            </p>

            <p className="text-xs text-emerald-200/90 italic text-center break-words">
              "{analysisResult.recommendedWird.transliteration}"
            </p>

            <p className="text-xs text-gray-300 text-center break-words">
              « {analysisResult.recommendedWird.translation} »
            </p>

            {!disableDuaCopy && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleCopyWird(analysisResult.recommendedWird.arabic)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedText ? <Check size={14} className="text-amber-300" /> : <Copy size={14} />}
                  <span>{copiedText ? "Copié !" : "Copier la formule"}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
