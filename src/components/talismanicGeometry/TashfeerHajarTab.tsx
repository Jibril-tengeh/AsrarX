import React, { useState, useMemo } from 'react';
import { Layers, Download, Sparkles, Eye, Copy, Check } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';

interface TashfeerHajarTabProps {
  language: string;
}

// South Arabian Musnad Epigraphic Alphabet mapping to Arabic & Abjad
interface MusnadSymbol {
  musnadGlyph: string;
  nabataeanGlyph: string;
  arabicLetter: string;
  abjadValue: number;
  transliteration: string;
}

const MUSNAD_ALPHABET: MusnadSymbol[] = [
  { musnadGlyph: '0', nabataeanGlyph: '𐢀', arabicLetter: 'أ', abjadValue: 1, transliteration: 'Alif' },
  { musnadGlyph: '1', nabataeanGlyph: '𐢁', arabicLetter: 'ب', abjadValue: 2, transliteration: 'Bā' },
  { musnadGlyph: '2', nabataeanGlyph: '𐢂', arabicLetter: 'ج', abjadValue: 3, transliteration: 'Jīm' },
  { musnadGlyph: '3', nabataeanGlyph: '𐢃', arabicLetter: 'د', abjadValue: 4, transliteration: 'Dāl' },
  { musnadGlyph: '4', nabataeanGlyph: '𐢄', arabicLetter: 'ه', abjadValue: 5, transliteration: 'Hā' },
  { musnadGlyph: '5', nabataeanGlyph: '𐢅', arabicLetter: 'و', abjadValue: 6, transliteration: 'Wāw' },
  { musnadGlyph: '6', nabataeanGlyph: '𐢆', arabicLetter: 'ز', abjadValue: 7, transliteration: 'Zāy' },
  { musnadGlyph: '7', nabataeanGlyph: '𐢇', arabicLetter: 'ح', abjadValue: 8, transliteration: 'Ḥā' },
  { musnadGlyph: '8', nabataeanGlyph: '𐢈', arabicLetter: 'ط', abjadValue: 9, transliteration: 'Ṭā' },
  { musnadGlyph: '9', nabataeanGlyph: '𐢉', arabicLetter: 'ي', abjadValue: 10, transliteration: 'Yā' },
  { musnadGlyph: 'A', nabataeanGlyph: '𐢊', arabicLetter: 'ك', abjadValue: 20, transliteration: 'Kāf' },
  { musnadGlyph: 'B', nabataeanGlyph: '𐢋', arabicLetter: 'ل', abjadValue: 30, transliteration: 'Lām' },
  { musnadGlyph: 'C', nabataeanGlyph: '𐢌', arabicLetter: 'م', abjadValue: 40, transliteration: 'Mīm' },
  { musnadGlyph: 'D', nabataeanGlyph: '𐢍', arabicLetter: 'ن', abjadValue: 50, transliteration: 'Nūn' },
  { musnadGlyph: 'E', nabataeanGlyph: '𐢎', arabicLetter: 'س', abjadValue: 60, transliteration: 'Sīn' },
  { musnadGlyph: 'F', nabataeanGlyph: '𐢏', arabicLetter: 'ع', abjadValue: 70, transliteration: '‘Ayn' },
  { musnadGlyph: 'G', nabataeanGlyph: '𐢐', arabicLetter: 'ف', abjadValue: 80, transliteration: 'Fā' },
  { musnadGlyph: 'H', nabataeanGlyph: '𐢑', arabicLetter: 'ص', abjadValue: 90, transliteration: 'Ṣād' },
  { musnadGlyph: 'I', nabataeanGlyph: '𐢒', arabicLetter: 'ق', abjadValue: 100, transliteration: 'Qāf' },
  { musnadGlyph: 'J', nabataeanGlyph: '𐢓', arabicLetter: 'ر', abjadValue: 200, transliteration: 'Rā' },
  { musnadGlyph: 'K', nabataeanGlyph: '𐢔', arabicLetter: 'ش', abjadValue: 300, transliteration: 'Shīn' },
  { musnadGlyph: 'L', nabataeanGlyph: '𐢕', arabicLetter: 'ت', abjadValue: 400, transliteration: 'Tā' },
];

const PRESET_INSCRIPTIONS = [
  {
    titleFr: "Dédicace de la Reine de Saba (سبأ)",
    titleEn: "Dedication of the Queen of Sheba",
    titleHa: "Gaisuwar Sarauniya Saba",
    textArabic: "سلام بركة ملك سبأ",
    musnadText: "EB0C 1JA4 CBA E10",
    meaningFr: "Paix et bénédiction royale du Royaume de Saba."
  },
  {
    titleFr: "Inscription de Protection de Pétra (البتراء)",
    titleEn: "Petra Protection Rock Inscription",
    titleHa: "Dutsen Kariya na Petra",
    textArabic: "حرز نصر وسلام",
    musnadText: "76J DHJ 5EB0C",
    meaningFr: "Amulette de victoire et de paix gravée dans la roche."
  },
  {
    titleFr: "Dédicace de Mada'in Salih (مدائن صالح)",
    titleEn: "Mada'in Salih Epigraph",
    titleHa: "Rubutun Mada'in Salih",
    textArabic: "الله نور وحكمة",
    musnadText: "0BB4 D5J 7AC4",
    meaningFr: "Invocation divine gravée sur la stèle d'Al-Ula."
  }
];

export default function TashfeerHajarTab({ language }: TashfeerHajarTabProps) {
  const [inputText, setInputText] = useState<string>('سلام بركة ملك سبأ');
  const [scriptType, setScriptType] = useState<'musnad' | 'nabataean'>('musnad');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert input text to epigraphic symbols
  const epigraphicResult = useMemo(() => {
    const letters = inputText.split('');
    let musnadString = '';
    let nabataeanString = '';
    let symbolBreakdown: { char: string; musnad: string; nabataean: string; abjad: number }[] = [];

    letters.forEach((char) => {
      if (char === ' ') {
        musnadString += ' 5 '; // Musnad word divider
        nabataeanString += ' ';
        return;
      }
      const match = MUSNAD_ALPHABET.find((m) => m.arabicLetter === char);
      if (match) {
        musnadString += match.musnadGlyph;
        nabataeanString += match.nabataeanGlyph;
        symbolBreakdown.push({
          char,
          musnad: match.musnadGlyph,
          nabataean: match.nabataeanGlyph,
          abjad: match.abjadValue
        });
      } else {
        symbolBreakdown.push({
          char,
          musnad: '0',
          nabataean: '𐢀',
          abjad: calculateAbjadValue(char) || 0
        });
      }
    });

    return { musnadString, nabataeanString, symbolBreakdown };
  }, [inputText]);

  const totalAbjad = useMemo(() => calculateAbjadValue(inputText) || 0, [inputText]);

  const handleCopyText = () => {
    const textToCopy = scriptType === 'musnad' ? epigraphicResult.musnadString : epigraphicResult.nabataeanString;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-2xl text-stone-700 dark:text-stone-300">
          <Layers size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Tashfeer al-Hajar (Ancient South Arabian & Nabataean Epigraphy)'
              : language === 'ha'
              ? 'Tashfeer al-Hajar (Rubutun Dutse na Musnad da Nabataean)'
              : 'Tashfeer al-Hajar (Cryptographie Epigraphique Rupestre Sudarabique & Nabatéenne)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Translates South Arabian Musnad and Nabataean rock inscriptions to extract their ancient secret Abjad values.'
              : language === 'ha'
              ? 'Fassara rubutun kan dutse na mutanen Saba da Nabataean domin cire darajar Abjad.'
              : 'Traduit les symboles sudarabiques (Musnad de Saba) et nabatéens pour en extraire la valeur d\'Abjad cryptée.'}
          </p>
        </div>
      </div>

      {/* Preset Inscriptions Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {language === 'en' ? 'Select Classical Rock Inscription:' : language === 'ha' ? 'Zabi Rubutun Dutse:' : 'Sélectionner une Inscription Rupestre Classique :'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_INSCRIPTIONS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(preset.textArabic)}
              className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 hover:border-amber-500 text-left transition-all cursor-pointer space-y-1"
            >
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                {language === 'en' ? preset.titleEn : language === 'ha' ? preset.titleHa : preset.titleFr}
              </h4>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 font-serif dir-rtl">{preset.textArabic}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text Converter Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2">
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Arabic Phrase to Transcribe:' : 'Texte Arabe à Transcrire en Symboles Rupestres :'}
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ex: سلام بركة..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base dir-rtl focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Epigraphic Style:' : 'Alphabet Epigraphique :'}
          </label>
          <select
            value={scriptType}
            onChange={(e) => setScriptType(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="musnad">Musnad Sudarabique (المسند السبئي)</option>
            <option value="nabataean">Nabatéen de Pétra (الخط النبطي)</option>
          </select>
        </div>
      </div>

      {/* Stone Carving Visual Card */}
      <div className="p-6 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-3xl border border-stone-600 shadow-2xl text-stone-100 space-y-4">
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>{scriptType === 'musnad' ? 'Inscription Musnad de Saba' : 'Gravure Nabatéenne de Pétra'}</span>
          </div>

          <button
            onClick={handleCopyText}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        </div>

        {/* Stone Carved Display */}
        <div className="p-6 bg-stone-950/90 rounded-2xl border border-amber-900/40 text-center space-y-3">
          <div className="text-3xl sm:text-5xl font-mono tracking-widest text-amber-200 drop-shadow-md">
            {scriptType === 'musnad' ? epigraphicResult.musnadString : epigraphicResult.nabataeanString}
          </div>
          <div className="text-sm font-bold text-stone-400 font-serif dir-rtl">{inputText}</div>
        </div>

        {/* Decipherment Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            {language === 'en' ? 'Epigraphic Decipherment Matrix:' : 'Matrice de Déchiffrement d\'Abjad :'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {epigraphicResult.symbolBreakdown.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-center space-y-1">
                <span className="text-lg font-mono text-amber-300 block">{scriptType === 'musnad' ? item.musnad : item.nabataean}</span>
                <span className="text-xs font-bold text-stone-300 block">{item.char}</span>
                <span className="text-[10px] font-mono text-amber-400 block">Abjad: {item.abjad}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-stone-800 flex justify-between items-center text-xs">
          <span className="text-stone-400">{language === 'en' ? 'Total Cryptic Abjad Sum:' : 'Somme Totale d\'Abjad Rupestre :'}</span>
          <span className="text-lg font-mono font-black text-amber-400">{totalAbjad}</span>
        </div>
      </div>
    </div>
  );
}
