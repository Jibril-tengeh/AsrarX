import React, { useState } from 'react';
import { Layers, ArrowLeft, Info, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';

export const RouhaniyyaExtractor: React.FC = () => {
  const { t } = useLanguage();
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<{ celestial: string, terrestrial: string, letters: string } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Simplified Arabic letter mapping by decimal position
  const extractLetters = (num: number) => {
    const lettersMap: Record<number, string> = {
      1: 'ا', 2: 'ب', 3: 'ج', 4: 'د', 5: 'ه', 6: 'و', 7: 'ز', 8: 'ح', 9: 'ط',
      10: 'ي', 20: 'ك', 30: 'ل', 40: 'م', 50: 'ن', 60: 'س', 70: 'ع', 80: 'ف', 90: 'ص',
      100: 'ق', 200: 'ر', 300: 'ش', 400: 'ت', 500: 'ث', 600: 'خ', 700: 'ذ', 800: 'ض', 900: 'ظ',
      1000: 'غ'
    };

    let remaining = num;
    const parts = [];
    
    // Decompose into powers of 10
    let multiplier = 1;
    while (remaining > 0) {
      const digit = remaining % 10;
      if (digit > 0) {
        parts.push(digit * multiplier);
      }
      remaining = Math.floor(remaining / 10);
      multiplier *= 10;
    }

    const extractedLetters = parts.map(p => lettersMap[p] || '').filter(l => l !== '');
    return extractedLetters.join('');
  };

  const generate = () => {
    const n = parseInt(number, 10);
    if (isNaN(n) || n <= 0 || n > 1999) return;

    // Gamification
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    const coreLetters = extractLetters(n);
    
    // Suffixes
    const celestial = coreLetters + 'ائيل';
    const terrestrial = coreLetters + 'طيش';

    setResult({
      letters: coreLetters,
      celestial,
      terrestrial
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={22} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="text-fuchsia-500" size={24} />
            Extracteur Rouhaniyya
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.rouhaniyya.description")}</p>
        </div>
      </div>

      {/* Collapsible Info Section */}
      <div className="bg-fuchsia-50 dark:bg-fuchsia-950/10 border border-fuchsia-100 dark:border-fuchsia-900/30 rounded-2xl p-4 mb-6">
        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="w-full flex items-center justify-between text-fuchsia-800 dark:text-fuchsia-300 font-bold text-sm"
        >
          <span className="flex items-center gap-2">
            <Info size={18} />
            <span>Comment ça fonctionne ?</span>
          </span>
          {showInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showInfo && (
          <p className="text-xs text-fuchsia-700 dark:text-fuchsia-300 mt-2 leading-relaxed">
            Dans la science ésotérique (Ilm al-Ruhaniyat), chaque nombre (issu d'un Nom ou d'un Verset) possède un serviteur spirituel (Khadim). Leur nom est extrait par la conversion du nombre en lettres ('Istintaq'), suivi de l'ajout des suffixes Angéliques ("A'il") et Terrestres ("Tish").
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Valeur Numérique (Zimām)
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
           <input 
             type="number" 
             value={number} 
             onChange={e => setNumber(e.target.value)} 
             placeholder="Ex: 313" 
             className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-12 text-lg font-bold font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
           />
           <button 
             onClick={generate}
             disabled={!number}
             className="h-12 px-6 rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
           >
             <Wand2 size={16} /> Extraire
           </button>
        </div>
      </div>

      <div className="mb-6">
        <ToolInfoTooltip toolId="rouhaniyya" />
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 shadow-sm">
               <h3 className="text-[10px] uppercase tracking-widest font-black text-blue-500 mb-1">Entité Angélique (Malaikah)</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Gouverne de manière éthérique (A'il).</p>
               <div className="text-center py-2">
                 <p className="font-arabic text-4xl text-blue-700 dark:text-blue-400 font-bold mb-3" dir="rtl">{result.celestial}</p>
                 <div className="inline-block px-3 py-1 bg-blue-100/70 dark:bg-blue-900/40 rounded-lg text-blue-800 dark:text-blue-300 font-mono text-xs font-bold tracking-widest">
                   {result.letters} + ائيل
                 </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-900/20 border border-orange-100 dark:border-red-900/30 rounded-2xl p-5 shadow-sm">
               <h3 className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-1">Entité Terrestre (Ardi)</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Gouverne l'action matérielle (Tish).</p>
               <div className="text-center py-2">
                 <p className="font-arabic text-4xl text-orange-700 dark:text-orange-400 font-bold mb-3" dir="rtl">{result.terrestrial}</p>
                 <div className="inline-block px-3 py-1 bg-orange-100/70 dark:bg-orange-900/40 rounded-lg text-orange-800 dark:text-orange-300 font-mono text-xs font-bold tracking-widest">
                   {result.letters} + طيش
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
