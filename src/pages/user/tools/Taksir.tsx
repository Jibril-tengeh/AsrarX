import React, { useState } from 'react';
import { Shuffle, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';

const taksirDict = {
  fr: {
    title: "Science du Taksir",
    info: "Le Taksir (Sadr wa Mu'akkhar) est l'art divinatoire d'entrelacer les lettres d'une invocation ou d'une phrase de l'extérieur vers l'intérieur jusqu'à recréer la phrase originale (Zimam). Utilisé pour générer de nouveaux noms spirituels mystiques.",
    inputLabel: "Mot ou Phrase (Arabe recommandé)",
    inputPlaceholder: "Ex: بسم الله",
    btnSubmit: "Briser",
    matrixTitle: (lines: number) => `Matrice de Taksir (${lines} lignes)`,
    matrixFooter: "La première et la dernière ligne (Zimam) doivent être identiques. La matrice est parachevée."
  },
  en: {
    title: "Science of Taksir",
    info: "Taksir (Sadr wa Mu'akkhar) is the divinatory art of weaving letters of an invocation or phrase from outer to inner until the original phrase is recreated (Zimam). Used to generate new mystic spiritual names.",
    inputLabel: "Word or Phrase (Arabic recommended)",
    inputPlaceholder: "Ex: بسم الله",
    btnSubmit: "Break",
    matrixTitle: (lines: number) => `Taksir Matrix (${lines} lines)`,
    matrixFooter: "The first and last lines (Zimam) must be identical. The matrix is complete."
  },
  ha: {
    title: "Ilimin Taksir",
    info: "Taksir (Sadr wa Mu'akkhar) wata fasaha ce ta musamman ta raba haruffan addu'a ko jumla daga waje zuwa ciki har sai an sake dawo da asalin jumlar (Zimam). Ana amfani da shi don samar da sababbin sunaye na ruhaniya.",
    inputLabel: "Kalma ko Jumla (An fi son Larabci)",
    inputPlaceholder: "Alal misali: بسم الله",
    btnSubmit: "Karyawa",
    matrixTitle: (lines: number) => `Siffar Taksir (Layi ${lines})`,
    matrixFooter: "Layi na farko da na ƙarshe (Zimam) dole ne su zama iri ɗaya. An kammala rukunin."
  }
};

export const Taksir: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = taksirDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || taksirDict.fr;
  const [inputWord, setInputWord] = useState('');
  const [matrix, setMatrix] = useState<string[][]>([]);

  // Simple Taksir function:
  // Interleaves the letters (e.g. from both ends, or specific esoteric permutation)
  // The most common esoteric Taksir is "Sadr w Mu'akhkhar" (Front & Back):
  // Take first letter, then last letter, then second, then second to last, etc.
  const generateTaksir = () => {
    if (!inputWord) return;

    // Gamification
    let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
    stats.tools_used = (stats.tools_used || 0) + 1;
    localStorage.setItem('asrar_stats', JSON.stringify(stats));

    const sanitize = inputWord.replace(/\s+/g, '');
    let currentLine = sanitize.split('');
    const original = currentLine.join('');
    
    const lines: string[][] = [currentLine];
    
    const maxIter = 100; // prevent absolute infinite loops in case of weird identical string
    let iterations = 0;

    while (iterations < maxIter) {
      const newLine = [];
      let left = 0;
      let right = currentLine.length - 1;
      
      // Front and Back weaving
      while (left <= right) {
        if (left === right) {
          newLine.push(currentLine[left]);
        } else {
          newLine.push(currentLine[left]);
          newLine.push(currentLine[right]);
        }
        left++;
        right--;
      }
      
      lines.push(newLine);
      currentLine = newLine;
      
      // Stop when we reach the original word (Taksir cycle complete = Zimam)
      if (newLine.join('') === original) {
         break;
      }
      iterations++;
    }

    setMatrix(lines);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shuffle className="text-rose-500" />
            {dict.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{t("tools.taksir.description")}</p>
        </div>
      </div>

      <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-2xl p-5 mb-8 flex items-start gap-4">
        <Info className="text-rose-500 shrink-0 mt-0.5" size={24} />
        <p className="text-sm text-rose-800 dark:text-rose-200 font-medium leading-relaxed">
          {dict.info}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">{dict.inputLabel}</label>
        <div className="flex gap-4">
           <input 
             type="text" 
             value={inputWord} 
             onChange={e => setInputWord(e.target.value)} 
             placeholder={dict.inputPlaceholder} 
             className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-xl font-bold font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
             dir="auto"
           />
           <button 
             onClick={generateTaksir}
             disabled={!inputWord}
             className="h-16 px-8 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
           >
              <Shuffle size={20} /> {dict.btnSubmit}
           </button>
        </div>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="taksir" />
      </div>

      <AnimatePresence>
        {matrix.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm"
          >
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">{dict.matrixTitle(matrix.length)}</h3>
              
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full text-center">
                  {matrix.map((line, rowIdx) => (
                    <div 
                      key={rowIdx} 
                      className={`flex justify-center gap-1 sm:gap-2 mb-2 ${rowIdx === 0 || rowIdx === matrix.length - 1 ? 'bg-rose-50 dark:bg-rose-900/20 rounded-xl p-2' : 'p-2'}`}
                      dir="rtl"
                    >
                      {line.map((letter, colIdx) => (
                        <div 
                          key={colIdx} 
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center font-arabic text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                 {dict.matrixFooter}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
