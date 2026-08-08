import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Feather, Copy, Check, RotateCcw, Share2, Bookmark, Save, 
  Volume2, Shield, Heart, Zap, Compass, Star, ChevronLeft, Download, Award
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { exportWirdToImage } from '../../../utils/wirdExporter';

// Abjad calculation map
const ABJAD_MAP: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ھ': 5,
  'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10, 'ئ': 10, 'ك': 20, 'ل': 30,
  'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200,
  'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  // Latin letters approximation for non-arabic input
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 80, 'g': 3, 'h': 8, 'i': 10,
  'j': 3, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 6, 'p': 2, 'q': 100,
  'r': 200, 's': 60, 't': 400, 'u': 6, 'v': 6, 'w': 6, 'x': 60, 'y': 10, 'z': 7
};

function calculateAbjadScore(str: string): number {
  if (!str) return 0;
  let total = 0;
  const clean = str.toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (ABJAD_MAP[char]) {
      total += ABJAD_MAP[char];
    }
  }
  return total || 66; // Fallback to 66 (Allah) if 0
}

interface IntentionPreset {
  id: string;
  icon: any;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  divineNamesFr: string[];
  divineNamesEn: string[];
  divineNamesHa: string[];
  arabicNames: string[];
  baseDuaArabic: string;
  transliterationFr: string;
  transliterationEn: string;
  transliterationHa: string;
  meaningFr: string;
  meaningEn: string;
  meaningHa: string;
  recommendedCount: number;
}

const PRESETS: IntentionPreset[] = [
  {
    id: 'protection',
    icon: Shield,
    titleFr: 'Protection & Shielding',
    titleEn: 'Protection & Shielding',
    titleHa: 'Kariya da Tsaro (Protection)',
    divineNamesFr: ['Ya Hafiz (Le Protecteur)', 'Ya Mani (Le Défenseur)', 'Ya Salam (La Paix)'],
    divineNamesEn: ['Ya Hafiz (The Preserver)', 'Ya Mani (The Defender)', 'Ya Salam (The Peace)'],
    divineNamesHa: ['Ya Hafiz (Mai Kariya)', 'Ya Mani (Mai Hana Cuta)', 'Ya Salam (Mai Aminci)'],
    arabicNames: ['يَا حَفِيظُ', 'يَا مَانِعُ', 'يَا سَلَامُ'],
    baseDuaArabic: 'اللَّهُمَّ يَا حَفِيظُ يَا مَانِعُ يَا سَلَامُ، احْفَظْنِي مِنْ كُلِّ سُوءٍ وَادْفَعْ عَنِّي كُلَّ بَلَاءٍ بِسِرِّ أَسْمَائِكَ الْحُسْنَى',
    transliterationFr: 'Allahumma Ya Hafiz, Ya Mani, Ya Salam, ihfazni min kulli su’in wadfa’ ‘anni kulla bala’in bi-sirri asma’ikal husna.',
    transliterationEn: 'Allahumma Ya Hafiz, Ya Mani, Ya Salam, ihfazni min kulli su’in wadfa’ ‘anni kulla bala’in bi-sirri asma’ikal husna.',
    transliterationHa: 'Allahumma Ya Hafiz, Ya Mani, Ya Salam, kare ni daga dukkan sharri da bala’i da sirrin sunayen ka masu albarka.',
    meaningFr: 'Ô Allah, Le Protecteur, Le Défenseur, La Paix Supreme, préserve-moi de tout mal et éloigne de moi toute épreuve par le secret de Tes Noms Sublimes.',
    meaningEn: 'O Allah, The Preserver, The Defender, The Giver of Peace, protect me from all harm and ward off all trials through the secret of Your Most Beautiful Names.',
    meaningHa: 'Ya Allah, Mai Kariya, Mai Hana Cuta, Mai Aminci, ka tsare ni daga dukkan sharri da masifa albarkacin sunayen ka masu kyau.',
    recommendedCount: 111
  },
  {
    id: 'sustenance',
    icon: Zap,
    titleFr: 'Abondance & Prosperité',
    titleEn: 'Abundance & Provision',
    titleHa: 'Arziqi da Nasara (Abundance)',
    divineNamesFr: ['Ya Razzaq (Le Pourvoyeur)', 'Ya Fattah (L\'Ouvreur)', 'Ya Wahhab (Le Donateur)'],
    divineNamesEn: ['Ya Razzaq (The Provider)', 'Ya Fattah (The Opener)', 'Ya Wahhab (The Bestower)'],
    divineNamesHa: ['Ya Razzaq (Mai Ba da Arziqi)', 'Ya Fattah (Mai Bude Kofofi)', 'Ya Wahhab (Mai Kyauta)'],
    arabicNames: ['يَا رَزَّاقُ', 'يَا فَتَّاحُ', 'يَا وَهَّابُ'],
    baseDuaArabic: 'اللَّهُمَّ يَا رَزَّاقُ يَا فَتَّاحُ يَا وَهَّابُ، افْتَحْ لِي أَبْوَابَ رَزْقِكَ وَافِضْ عَلَيَّ مِنْ بَرَكَاتِكَ الصَّالِحَةِ',
    transliterationFr: 'Allahumma Ya Razzaq, Ya Fattah, Ya Wahhab, iftah li abwaba rizqika wa afidh ‘alayya min barakatikas salihah.',
    transliterationEn: 'Allahumma Ya Razzaq, Ya Fattah, Ya Wahhab, iftah li abwaba rizqika wa afidh ‘alayya min barakatikas salihah.',
    transliterationHa: 'Allahumma Ya Razzaq, Ya Fattah, Ya Wahhab, bude min kofofin arziqin ka ka zuba min albarkar ka masu yawa.',
    meaningFr: 'Ô Allah, Le Pourvoyeur, L\'Ouvreur suprême, Le Généreux Donateur, ouvre-moi les portes de Ta subsistance et déverse sur moi Tes bénédictions infinies.',
    meaningEn: 'O Allah, The Provider, The Opener, The Bestower, open for me the doors of Your sustenance and shower upon me Your blessed favors.',
    meaningHa: 'Ya Allah, Mai Arziqantarwa, Mai Bude Kofofi, Mai Kyauta, ka bude min hanyoyin arziqi ka zaqada min albarka.',
    recommendedCount: 313
  },
  {
    id: 'peace',
    icon: Heart,
    titleFr: 'Sérénité & Paix du Cœur',
    titleEn: 'Inner Peace & Tranquility',
    titleHa: 'Natsuwa da Zaman Lafiya (Inner Peace)',
    divineNamesFr: ['Ya Latif (Le Bienveillant)', 'Ya Wadud (L\'Aimant)', 'Ya Quddus (Le Très Saint)'],
    divineNamesEn: ['Ya Latif (The Subtle/Gentle)', 'Ya Wadud (The Loving)', 'Ya Quddus (The Holy)'],
    divineNamesHa: ['Ya Latif (Mai Tausayi da Takatsantsan)', 'Ya Wadud (Mai Kauna)', 'Ya Quddus (Mai Tsarki)'],
    arabicNames: ['يَا لَطِيفُ', 'يَا وَدُودُ', 'يَا قُدُّوسُ'],
    baseDuaArabic: 'اللَّهُمَّ يَا لَطِيفُ يَا وَدُودُ يَا قُدُّوسُ، امْلَأْ قَلْبِي نُوراً وَسَكِينَةً وَانْزِعْ عَنِّي الْهَمَّ وَالْحُزْنَ',
    transliterationFr: 'Allahumma Ya Latif, Ya Wadud, Ya Quddus, imla’ qalbi nuran wa sakinatan wanza’ ‘annil hamma wal huzn.',
    transliterationEn: 'Allahumma Ya Latif, Ya Wadud, Ya Quddus, imla’ qalbi nuran wa sakinatan wanza’ ‘annil hamma wal huzn.',
    transliterationHa: 'Allahumma Ya Latif, Ya Wadud, Ya Quddus, cika zuciyata da haske da natsuwa, ka cire min damuwa da bacin rai.',
    meaningFr: 'Ô Allah, Le Bienveillant, L\'Aimant, Le Très-Saint, remplis mon cœur de lumière et de quiétude, et ôte de moi toute anxiété et tristesse.',
    meaningEn: 'O Allah, The Subtle, The Loving, The Most Sacred, fill my heart with light and tranquility, and remove from me all grief and sorrow.',
    meaningHa: 'Ya Allah, Mai Tausayi, Mai So, Mai Tsarki, ka cika zuciyata da haske da kwanciyar hankali, ka yaye min damuwa.',
    recommendedCount: 129
  },
  {
    id: 'wisdom',
    icon: Compass,
    titleFr: 'Sagesse & Lumière d\'Esprit',
    titleEn: 'Wisdom & Mental Clarity',
    titleHa: 'Hikima da Hasken Hankali (Wisdom)',
    divineNamesFr: ['Ya Alim (L\'Omniscient)', 'Ya Nur (La Lumière)', 'Ya Hakim (Le Sage)'],
    divineNamesEn: ['Ya Alim (The All-Knowing)', 'Ya Nur (The Light)', 'Ya Hakim (The Wise)'],
    divineNamesHa: ['Ya Alim (Mai Sanin Komai)', 'Ya Nur (Mai Haske)', 'Ya Hakim (Mai Hikima)'],
    arabicNames: ['يَا عَلِيمُ', 'يَا نُورُ', 'يَا حَكِيمُ'],
    baseDuaArabic: 'اللَّهُمَّ يَا عَلِيمُ يَا نُورُ يَا حَكِيمُ، زِدْنِي عِلْماً وَأَنِرْ بَصِيرَتِي وَاهْدِنِي لِأَحْسَنِ الأَعْمَالِ',
    transliterationFr: 'Allahumma Ya Alim, Ya Nur, Ya Hakim, zidni ‘ilman wa anir basirati wahdini li-ahsanil a’mal.',
    transliterationEn: 'Allahumma Ya Alim, Ya Nur, Ya Hakim, zidni ‘ilman wa anir basirati wahdini li-ahsanil a’mal.',
    transliterationHa: 'Allahumma Ya Alim, Ya Nur, Ya Hakim, qara min ilmi da basira, ka shiryar da ni zuwa ga aiyuka mafi kyau.',
    meaningFr: 'Ô Allah, L\'Omniscient, La Lumière des Cieux, Le Sage, augmente mes connaissances, illumine mon intuition et guide-moi vers les plus nobles actions.',
    meaningEn: 'O Allah, The All-Knowing, The Light, The All-Wise, increase me in knowledge, enlighten my insight, and guide me to the best of deeds.',
    meaningHa: 'Ya Allah, Mai Ilmi, Hasken Samaniya, Mai Hikima, ka qara min ilmi da basira da kyakkyawan turba.',
    recommendedCount: 1000
  }
];

export const CustomDuaGenerator: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [userName, setUserName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<IntentionPreset>(PRESETS[0]);
  const [customIntention, setCustomIntention] = useState('');
  const [abjadValue, setAbjadValue] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0);
  const [targetCount, setTargetCount] = useState<number>(PRESETS[0].recommendedCount);
  const [copied, setCopied] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);

  useEffect(() => {
    const combinedStr = `${userName} ${motherName}`.trim();
    const score = calculateAbjadScore(combinedStr);
    setAbjadValue(score);
  }, [userName, motherName]);

  const handleCopy = () => {
    const fullText = `${selectedPreset.baseDuaArabic}\n\nTranslittération: ${
      language === 'ha' ? selectedPreset.transliterationHa : language === 'en' ? selectedPreset.transliterationEn : selectedPreset.transliterationFr
    }\n\nSignification: ${
      language === 'ha' ? selectedPreset.meaningHa : language === 'en' ? selectedPreset.meaningEn : selectedPreset.meaningFr
    }\n\nNombre recommandé Abjad: ${targetCount}x`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToJournal = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'journal_entries'), {
        userId: user.uid,
        title: `Dua Personnalisée - ${selectedPreset.titleFr}`,
        content: `Invocation: ${selectedPreset.baseDuaArabic}\n\nPoids Abjad: ${abjadValue}\nObjectif Répétitions: ${targetCount}x`,
        createdAt: new Date().toISOString(),
        tags: ['dua', 'abjad', 'wird']
      });
      setSavedToJournal(true);
      setTimeout(() => setSavedToJournal(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleIncrement = () => {
    setCounter(prev => prev + 1);
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const getTitle = (p: IntentionPreset) => {
    if (language === 'ha') return p.titleHa;
    if (language === 'en') return p.titleEn;
    return p.titleFr;
  };

  const getMeaning = (p: IntentionPreset) => {
    if (language === 'ha') return p.meaningHa;
    if (language === 'en') return p.meaningEn;
    return p.meaningFr;
  };

  const getTransliteration = (p: IntentionPreset) => {
    if (language === 'ha') return p.transliterationHa;
    if (language === 'en') return p.transliterationEn;
    return p.transliterationFr;
  };

  const getDivineNames = (p: IntentionPreset) => {
    if (language === 'ha') return p.divineNamesHa;
    if (language === 'en') return p.divineNamesEn;
    return p.divineNamesFr;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
              <Sparkles size={14} />
              <span>
                {language === 'ha' ? 'Niyya da Zikiri da Abjad' : language === 'en' ? 'Personalized Spiritual Supplications' : 'Invocations & Alignements Abjad'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
              {language === 'ha' ? 'Générateur de Du’a da Munajati' : language === 'en' ? 'Custom Du’a & Supplication Generator' : 'Générateur de Du\'a & Invocations sur Mesure'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {language === 'ha' 
                ? 'Yi amfani da sunan ka ko niyyar ka don samun addu\'a da zikiri da yawan maimaitawa da ya dace.' 
                : language === 'en'
                ? 'Generate custom Quranic and prophetic prayers aligned with your personal name Abjad score and intention.'
                : 'Formulez des invocations spirituelles alignées sur votre nom et votre intention, enrichies des Noms Divins et calculs Abjad.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0">
            <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
              {language === 'ha' ? 'Poids Abjad' : language === 'en' ? 'Abjad Value' : 'Poids Abjad Total'}
            </p>
            <p className="text-3xl font-black text-amber-300 font-mono mt-0.5">{abjadValue || 66}</p>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs & Presets */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Feather className="text-emerald-500" size={18} />
              <span>{language === 'ha' ? 'Informations' : language === 'en' ? 'Personal Details' : 'Vos Informations'}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                {language === 'ha' ? 'Sunan ku (Prenom/Nom)' : language === 'en' ? 'Your Name' : 'Votre Prénom / Nom'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="ex: Ibrahim / إبراهيم"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                {language === 'ha' ? 'Sunan Mahaifiya (Facultatif)' : language === 'en' ? 'Mother’s Name (Optional)' : 'Nom de la Mère (Optionnel)'}
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="ex: Amina / آمنة"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Intention Presets */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <Compass className="text-emerald-500" size={18} />
              <span>{language === 'ha' ? 'Zaben Niyya' : language === 'en' ? 'Select Intention' : 'Intention Principale'}</span>
            </h3>

            <div className="space-y-2.5">
              {PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setTargetCount(preset.recommendedCount);
                      setCounter(0);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-200 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-750 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs truncate">{getTitle(preset)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{preset.recommendedCount}x Répétitions</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Prayer Display & Counter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-750 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  {language === 'ha' ? 'Addu\'a ta Zabi' : language === 'en' ? 'Selected Supplication' : 'Formulation Sacrée'}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mt-0.5">
                  {getTitle(selectedPreset)}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? (language === 'ha' ? 'Kwitaccen!' : language === 'en' ? 'Copied!' : 'Copié !') : (language === 'ha' ? 'Kwafa' : language === 'en' ? 'Copy' : 'Copier')}</span>
                </button>

                {user && (
                  <button
                    onClick={handleSaveToJournal}
                    className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <Bookmark size={14} />
                    <span>{savedToJournal ? 'Enregistré !' : 'Sauvegarder'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Arabic Card */}
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-3xl p-6 text-center space-y-4">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                {language === 'ha' ? 'Nombres Divins Haqa' : language === 'en' ? 'Matching Divine Names' : 'Noms Divins Correspondants'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedPreset.arabicNames.map((nm, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded-full font-serif font-bold text-sm">
                    {nm}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <p className="text-xl sm:text-2xl font-serif text-gray-900 dark:text-amber-100 leading-loose tracking-wide font-semibold dir-rtl">
                  {selectedPreset.baseDuaArabic}
                </p>
              </div>
            </div>

            {/* Transliteration & Meaning */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {language === 'ha' ? 'Karantawa (Translittération)' : language === 'en' ? 'Transliteration' : 'Phonétique / Récitation'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-900/50 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  "{getTransliteration(selectedPreset)}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {language === 'ha' ? 'Ma\'ana (Signification)' : language === 'en' ? 'Meaning' : 'Sens Spirituel'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 leading-relaxed">
                  {getMeaning(selectedPreset)}
                </p>
              </div>

              {/* Download PNG & Parchemin Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => exportWirdToImage({
                    name: userName || undefined,
                    motherName: motherName || undefined,
                    arabicZikr: selectedPreset.baseDuaArabic,
                    transliteration: getTransliteration(selectedPreset),
                    abjadWeight: abjadValue > 0 ? abjadValue : targetCount,
                    meaningFr: getMeaning(selectedPreset),
                    title: selectedPreset.titleFr.toUpperCase(),
                    isParchment: false,
                    lang: language,
                  })}
                  className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                  title="Télécharger la Fiche en PNG Deluxe"
                >
                  <Download size={16} className="text-emerald-400" />
                  <span>Télécharger PNG</span>
                </button>
                <button
                  onClick={() => exportWirdToImage({
                    name: userName || undefined,
                    motherName: motherName || undefined,
                    arabicZikr: selectedPreset.baseDuaArabic,
                    transliteration: getTransliteration(selectedPreset),
                    abjadWeight: abjadValue > 0 ? abjadValue : targetCount,
                    meaningFr: getMeaning(selectedPreset),
                    title: `PARCHEMIN • ${selectedPreset.titleFr.toUpperCase()}`,
                    isParchment: true,
                    lang: language,
                  })}
                  className="py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                  title="Télécharger sous forme de Parchemin Sacré"
                >
                  <Feather size={16} />
                  <span>Télécharger Parchemin</span>
                </button>
              </div>
            </div>

            {/* Interactive Recitation Tasbih Counter */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 text-center space-y-4 shadow-lg border border-emerald-500/30">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={14} />
                  <span>Chapelet Interactif Répétitions</span>
                </span>
                <button
                  onClick={() => setCounter(0)}
                  className="p-1.5 hover:bg-white/10 text-emerald-300 rounded-lg transition-colors"
                  title="Réinitialiser"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-5xl font-black font-mono text-amber-300">{counter}</p>
                <p className="text-xs text-emerald-200/80 mt-1 font-semibold">
                  Objectif: {targetCount}x {abjadValue > 0 ? `(Basé sur Abjad: ${abjadValue})` : ''}
                </p>
              </div>

              <button
                onClick={handleIncrement}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-emerald-950 font-black rounded-2xl text-base transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>RÉCITER 1X</span>
                <span className="text-xs opacity-75">(Cliquez ou touchez)</span>
              </button>

              {counter >= targetCount && (
                <div className="p-3 bg-amber-400/20 border border-amber-300/40 rounded-xl text-amber-200 text-xs font-bold animate-bounce">
                  🎉 Objectif de Récitation Atteint ! Qu'Allah exauce votre invocation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDuaGenerator;
