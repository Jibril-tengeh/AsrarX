import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, Sparkles, Copy, Check, Feather } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { calculateAbjadValue } from '../../../utils/abjad';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

interface QuranVerseAnalogy {
  surah: string;
  ayahNo: number;
  arabic: string;
  translationFr: string;
  translationEn: string;
  abjadWeight: number;
  keywords: string[];
}

const QURANIC_DATASET: QuranVerseAnalogy[] = [
  {
    surah: 'Al-Fatiha',
    ayahNo: 1,
    arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    translationFr: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    abjadWeight: 786,
    keywords: ['bismillah', 'protection', 'ouverture', '786'],
  },
  {
    surah: 'Al-Baqarah (Ayat al-Kursi)',
    ayahNo: 255,
    arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    translationFr: 'Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence.',
    abjadWeight: 231,
    keywords: ['kursi', 'protection', 'hayy', 'qayyum'],
  },
  {
    surah: 'Al-Ikhlas',
    ayahNo: 1,
    arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    translationFr: 'Dis : Il est Allah, Unique.',
    translationEn: 'Say, He is Allah, [who is] One.',
    abjadWeight: 223,
    keywords: ['tawhid', 'unicité', 'ahad'],
  },
  {
    surah: 'Ya-Sin',
    ayahNo: 58,
    arabic: 'سَلَٰمٌ قَوْلًۭا مِّن رَّبٍّۭ رَّحِيمٍ',
    translationFr: '"Paix et salut", parole de la part d\'un Seigneur Très Miséricordieux.',
    translationEn: '"Peace," a word from a Merciful Lord.',
    abjadWeight: 818,
    keywords: ['salam', 'paix', 'salut', 'rahim'],
  },
  {
    surah: 'Al-Anbiya',
    ayahNo: 87,
    arabic: 'لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ',
    translationFr: 'Pas de divinité à part Toi ! Pureté à Toi ! J\'étais vraiment du nombre des injustes.',
    translationEn: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    abjadWeight: 2175,
    keywords: ['yunus', 'délivrance', 'tasbih'],
  },
  {
    surah: 'Al-Inshirah',
    ayahNo: 5,
    arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    translationFr: 'À côté de la difficulté est certes une facilité !',
    translationEn: 'For indeed, with hardship [will be] ease.',
    abjadWeight: 593,
    keywords: ['facilité', 'soulagement', 'usr', 'yusr'],
  },
  {
    surah: 'An-Nasr',
    ayahNo: 1,
    arabic: 'إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ',
    translationFr: 'Lorsque vient le secours d\'Allah ainsi que la victoire,',
    translationEn: 'When the victory of Allah has come and the conquest,',
    abjadWeight: 1471,
    keywords: ['victoire', 'secours', 'nasr', 'fath'],
  },
  {
    surah: 'Al-Baqarah',
    ayahNo: 137,
    arabic: 'فَسَيَكْفِيكَهُمُ ٱللَّهُ ۚ وَهُوَ ٱلسَّمِيعُ ٱلْعَلِيمُ',
    translationFr: 'Allah te suffira contre eux. Il est l\'Audient, l\'Omniscient.',
    translationEn: 'And Allah will be sufficient for you against them. And He is the Hearing, the Knowing.',
    abjadWeight: 1377,
    keywords: ['protection', 'bouclier', 'kafiy'],
  },
  {
    surah: 'At-Tawbah',
    ayahNo: 129,
    arabic: 'حَسْبِىَ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ',
    translationFr: 'Allah me suffit ! Pas de divinité que Lui. En Lui je place ma confiance.',
    translationEn: 'Sufficient for me is Allah; there is no deity except Him. On Him I have relied.',
    abjadWeight: 832,
    keywords: ['hasbiya', 'confiance', 'tawakkul'],
  },
];

export const CoranAnalogyAbjad: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('محمد');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedForParchment, setSelectedForParchment] = useState<QuranVerseAnalogy | null>(null);

  const calculatedVal = isNaN(Number(searchTerm)) ? calculateAbjadValue(searchTerm) : Number(searchTerm);

  const matches = QURANIC_DATASET.map((v) => {
    const diff = Math.abs(v.abjadWeight - calculatedVal);
    const isMultiple = calculatedVal > 0 && v.abjadWeight % calculatedVal === 0;
    return {
      ...v,
      diff,
      isMultiple,
      multipleRatio: isMultiple ? v.abjadWeight / calculatedVal : null,
    };
  }).sort((a, b) => a.diff - b.diff);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Corresp'Ayāt par Abjad</span>
            <BookOpen className="w-6 h-6 text-emerald-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {language === 'fr'
              ? 'Recherche d\'Analogie & Versets Coraniques Correspondants au Poids Mystique'
              : language === 'ha'
              ? 'Neman Ayoyin Al-Qur\'ani da Suka Dace da Lambar Abjad'
              : 'Quranic Verse & Abjad Weight Analogy Search'}
          </p>
        </div>
        <ToolInfoTooltip toolId="quran-analogy" />
      </div>

      {/* Input Search Box */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {language === 'fr' ? 'Entrez un Nom ou une Valeur Abjad (Lamba)' : 'Enter Name or Abjad Number'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-serif text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ex: Muhammad ou 313"
            />
            <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            Poids Analytique (Adad):
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {calculatedVal}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Versets & Formules Coraniques en Résonance</span>
        </h2>

        {matches.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                Surah {item.surah} (V. {item.ayahNo})
              </span>
              <div className="flex items-center gap-2">
                {item.isMultiple && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Multiple x{item.multipleRatio}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-300">
                  Adad: {item.abjadWeight}
                </span>
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-serif text-right text-gray-900 dark:text-white leading-relaxed pt-1">
              {item.arabic}
            </p>

            <p className="text-xs italic text-gray-600 dark:text-gray-300">
              "{language === 'fr' ? item.translationFr : item.translationEn}"
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => handleCopy(`${item.arabic} — ${item.surah}:${item.ayahNo}`, idx)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === idx ? 'Copié' : 'Copier'}</span>
              </button>
              <button
                onClick={() => setSelectedForParchment(item)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Exporter Parchemin</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Parchment Exporter */}
      {selectedForParchment && (
        <ParchmentExporterModal
          isOpen={!!selectedForParchment}
          onClose={() => setSelectedForParchment(null)}
          title={
            language === 'fr'
              ? `Verset Coranique Personnel — ${selectedForParchment.surah}`
              : language === 'ha'
              ? `Ayar Alkur'ani na Kanka — ${selectedForParchment.surah}`
              : `Personal Quranic Verse — ${selectedForParchment.surah}`
          }
          subtitle={
            language === 'fr'
              ? `Résonance Abjad avec la valeur ${calculatedVal}`
              : language === 'ha'
              ? `Amon Abjad da daraja ${calculatedVal}`
              : `Abjad resonance with value ${calculatedVal}`
          }
          abjadWeight={selectedForParchment.abjadWeight}
          content={
            <div className="space-y-4 text-center">
              <p className="text-2xl sm:text-3xl font-serif text-amber-950 font-bold leading-relaxed">
                {selectedForParchment.arabic}
              </p>
              <p className="text-xs italic text-amber-900">
                "{language === 'en' ? (selectedForParchment.translationEn || selectedForParchment.translationFr) : selectedForParchment.translationFr}"
              </p>
              <p className="text-xs font-mono text-amber-800 pt-2 border-t border-amber-600/30">
                {language === 'fr'
                  ? `Sourate ${selectedForParchment.surah}, Verset ${selectedForParchment.ayahNo} (Poids : ${selectedForParchment.abjadWeight})`
                  : language === 'ha'
                  ? `Suratu ${selectedForParchment.surah}, Aya ${selectedForParchment.ayahNo} (Nauyi : ${selectedForParchment.abjadWeight})`
                  : `Surah ${selectedForParchment.surah}, Verse ${selectedForParchment.ayahNo} (Weight: ${selectedForParchment.abjadWeight})`}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};
