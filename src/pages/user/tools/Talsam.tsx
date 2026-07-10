import React, { useState } from 'react';
import { Key, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion } from 'motion/react';

const talsamDict = {
  fr: {
    title: "Générateur de Talsam",
    warning: "Attention: Les Talsams génèrent une forte charge énergétique. Ne les utilisez que si vous êtes initié aux règles de purification (Taharah) et de protection préalable (Tahsin).",
    intentionLabel: "Votre Vœu / Intention (Niyyah)",
    intentionPlaceholder: "Ex: Obtenir l'ouverture dans le commerce...",
    generateBtn: "Extraire le Talsam",
    sealedPowerWord: "Mot de pouvoir scellé",
    instruction: "Inscrivez ce Talsam au centre d'un Khatim (Muthallath) et récitez-le le nombre de fois indiqué entre parenthèses pendant la planète dominante de votre vœu."
  },
  en: {
    title: "Talsam Generator",
    warning: "Warning: Talsams generate a high energy charge. Only use them if you are initiated into the rules of purification (Taharah) and prior spiritual protection (Tahsin).",
    intentionLabel: "Your Wish / Intention (Niyyah)",
    intentionPlaceholder: "Ex: Get success in business...",
    generateBtn: "Extract Talsam",
    sealedPowerWord: "Sealed Word of Power",
    instruction: "Write this Talsam in the center of a Khatim (Muthallath) and recite it the number of times indicated in parentheses during the dominant planet of your wish."
  },
  ha: {
    title: "Mai Samar da Talsam",
    warning: "Gargaɗi: Talsam yana haifar da babban ƙarfin kuzari. Kada ka yi amfani da shi sai idan kana da sani game da dokokin tsarki (Taharah) da kariya ta ruhaniya (Tahsin).",
    intentionLabel: "Manufarka / Bukatarka (Niyyah)",
    intentionPlaceholder: "Alal misali: Samun nasara a kasuwanci...",
    generateBtn: "Fitar da Talsam",
    sealedPowerWord: "Kalmar Iko Da Aka Hatimce",
    instruction: "Rubuta wannan Talsam ɗin a tsakiyar Khatim (Muthallath) sannan ka karanta shi adadin sau da aka nuna a cikin baka lokacin lokacin tauraron da ke da alaƙa da buƙatarka."
  }
};

export const Talsam: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = talsamDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || talsamDict.fr;
  const [intention, setIntention] = useState('');
  const [talsam, setTalsam] = useState('');

  const generateTalsam = () => {
    if (!intention) return;
    
    // Abstract esoteric encoding logic (Rouhaniyat)
    const prefixes = ["أَهْلَ", "مَهْ", "كَهْ", "طَوْ", "غَلْ", "شَمْ", "بَرْمَ"];
    const suffixes = ["قُوشٍ", "يُوطٍ", "شِينٍ", "طَيٍّ", "هَالٍ", "جَالٍ", "هَاتٍ"];
    
    // Use string char codes to vaguely deterministically select tokens
    let charSum = 0;
    for(let i = 0; i < intention.length; i++) {
        charSum += intention.charCodeAt(i);
    }
    
    const w1 = prefixes[charSum % prefixes.length] + suffixes[(charSum*2) % suffixes.length];
    const w2 = prefixes[(charSum*3) % prefixes.length] + suffixes[(charSum+5) % suffixes.length];
    const w3 = prefixes[(charSum*7) % prefixes.length] + suffixes[(charSum+1) % suffixes.length];

    setTalsam(`يَا ${w1} ${w2} ${w3} (${charSum * 3})`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 border-none">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="text-slate-600" />
            {dict.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("tools.talsam.description")}</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
          {dict.warning}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{dict.intentionLabel}</label>
        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder={dict.intentionPlaceholder}
          rows={3}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 resize-none mb-4"
        />
        <button
          onClick={generateTalsam}
          disabled={!intention}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white font-bold disabled:opacity-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> {dict.generateBtn}
        </button>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="talsam" />
      </div>

      {talsam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-700 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-600 rounded-full blur-3xl opacity-20"></div>
          <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">{dict.sealedPowerWord}</h3>
          
          <p className="font-arabic text-3xl sm:text-4xl text-white mb-8 leading-relaxed font-bold tracking-widest" dir="rtl">
            {talsam}
          </p>
          
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-sm">
              {dict.instruction}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
