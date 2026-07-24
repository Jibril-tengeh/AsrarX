import React, { useState, useEffect } from 'react';
import { BookOpen, Flame, Calendar, Info, ArrowLeft, Star, Wind, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, addDoc, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

interface SyriacName {
  name: string;
  arabic: string;
  meaning: string;
  meaning_en?: string;
  meaning_ha?: string;
}

interface Oath {
  id: string;
  title: string;
  title_en?: string;
  title_ha?: string;
  arabicTitle: string;
  desc: string;
  desc_en?: string;
  desc_ha?: string;
  incense: string;
  incense_en?: string;
  incense_ha?: string;
  day: string;
  day_en?: string;
  day_ha?: string;
  content: string;
  isMaintenance?: boolean;
  syriacNames?: SyriacName[];
}

export const DEFAULT_OATHS = [
  {
    title: "Da'wat al-Birhatiyya",
    title_en: "Da'wat al-Birhatiyya",
    title_ha: "Da'wat al-Birhatiyya",
    arabicTitle: "الدعوة البرهتية",
    desc: "Le serment suprême des anciens sages. Il contient 28 noms syriaques puissants qui commandent les entités supérieures et inférieures. C'est le pilier de la théurgie spirituelle (Rouhaniyya).",
    desc_en: "The supreme oath of the ancient sages. It contains 28 powerful Syriac names commanding higher and lower entities. It is the pillar of spiritual theurgy (Rouhanna).",
    desc_ha: "Babban rantsuwa na tsoffin malamai. Yana ɗauke da sunaye na Siriya masu iko guda 28 waɗanda ke sarrafa talikai na sama da na ƙasa. Shi ne ginshiƙin ilimin ruhaniya (Rouhaniyya).",
    incense: "Encens Mâle (Oliban) et Coriandre",
    incense_en: "Frankincense and Coriander",
    incense_ha: "Turaren Oliban da Coriander",
    day: "Dimanche (Soleil)",
    day_en: "Sunday (Sun)",
    day_ha: "Lahadi (Rana)",
    content: "بِسْمِ اللَّهِ الْقُدُّوسِ الطَّاهِرِ الْعَلِيِّ الْقَاهِرِ... بِرْهَتِيهٍ بِرْهَتِيهٍ (2)، كَرِيرٍ كَرِيرٍ (2)، تَتْلِيهٍ تَتْلِيهٍ (2)، طُورَانٍ طُورَانٍ (2)، مَزْجَلٍ مَزْجَلٍ (2)...",
    isMaintenance: false,
    syriacNames: [
      { name: "Birhatīhin", arabic: "بِرْهَتِيهٍ", meaning: "Subbuhun (Très Saint)", meaning_en: "Highly Glorified", meaning_ha: "Mafi Tsarki" },
      { name: "Karīrin", arabic: "كَرِيرٍ", meaning: "Ilahun (Dieu)", meaning_en: "God", meaning_ha: "Allah" },
      { name: "Tatlīhin", arabic: "تَتْلِيهٍ", meaning: "Al-Quddus (Le Pur)", meaning_en: "The Holy", meaning_ha: "Mafi Tsarki" },
      { name: "Turānin", arabic: "طُورَانٍ", meaning: "Ya Hayyu (Ô Vivant)", meaning_en: "O Ever-Living", meaning_ha: "Ya Rayyu" }
    ],
    createdAt: Date.now()
  },
  {
    title: "Al-Jaljalutiyya (Sughra)",
    title_en: "Al-Jaljalutiyya (Minor)",
    title_ha: "Al-Jaljalutiyya (Sughra)",
    arabicTitle: "الجلجلوتية الصغرى",
    desc: "Le célèbre poème mystique attribué à l'Imam Ali. Composé de 60 versets, il contient les secrets du Nom Suprême caché dans des codes syriaques et hébraïques.",
    desc_en: "The famous mystical poem attributed to Imam Ali. Composed of 60 verses, it contains the secrets of the Supreme Name hidden in Syriac and Hebrew codes.",
    desc_ha: "Shahararriyar waƙar sufa da aka jingina ga Imam Ali. Ya ƙunshi ayoyi 60, yana ɗauke da asirin Babban Suna ɓoye a cikin lambobin Siriya da Ibraniyanci.",
    incense: "Bois d'Aloès et Musc",
    incense_en: "Agarwood and Musk",
    incense_ha: "Turaren Aloes da Almuski",
    day: "Mardi (Mars) ou Vendredi (Vénus)",
    day_en: "Tuesday (Mars) or Friday (Venus)",
    day_ha: "Talata (Mars) ko Jumma'a (Venus)",
    content: "بَدَأْتُ بِبِسْمِ اللَّهِ رُوحِي بِهِ هَدَتْ... إِلَى كَشْفِ أَسْرَارٍ بِبَاطِنِهِ انْطَوَتْ. وَصَلَّيْتُ فِي الثَّانِي عَلَى خَيْرِ خَلْقِهِ... مُحَمَّدٍ مَنْ زَاحَ الضَّلَالَةَ وَالْغَلَتْ. سَأَلْتُكَ بِالِاسْمِ الْمُعَظَّمِ قَدْرُهُ... بِآجٍ أَهُوجٍ جَلَّ جَلْيُوتٍ جَلْجَلَتْ.",
    isMaintenance: false,
    syriacNames: [
      { name: "Ajin", arabic: "آجٍ", meaning: "Allah", meaning_en: "God", meaning_ha: "Allah" },
      { name: "Ahujin", arabic: "أَهُوجٍ", meaning: "Al-Ahad (L'Unique)", meaning_en: "The One", meaning_ha: "Makaɗaici" },
      { name: "Jaljalyutin", arabic: "جَلْجَلُوتٍ", meaning: "Al-Badi' (L'Innovateur)", meaning_en: "The Originator", meaning_ha: "Maƙiri" }
    ],
    createdAt: Date.now() + 1
  },
  {
    title: "Hizb al-Bahr",
    title_en: "Hizb al-Bahr",
    title_ha: "Hizb al-Bahr",
    arabicTitle: "حزب البحر",
    desc: "L'Oraison de la Mer de l'Imam Abu Hasan al-Shadhili. Récitée pour la protection absolue lors des voyages, la dissipation des angoisses et la victoire sur les ennemis invisibles.",
    desc_en: "The Litany of the Sea by Imam Abu Hasan al-Shadhili. Recited for absolute protection during travels, easing of anxieties, and victory over invisible enemies.",
    desc_ha: "Addu'ar Teku ta Imam Abu Hasan al-Shadhili. Ana karanta ta don samun kariya ta cikakkiya yayin tafiye-tafiye, yaye damuwa, da samun nasara akan makiya marasa gani.",
    incense: "Santal et Ambre",
    incense_en: "Sandalwood and Ambergris",
    incense_ha: "Sandal da Ambar",
    day: "Tous les jours après l'Asr",
    day_en: "Every day after Asr",
    day_ha: "Kowace rana bayan sallar La'asar",
    content: "يَا اللَّهُ يَا عَلِيُّ يَا عَظِيمُ يَا حَلِيمُ يَا عَلِيمُ... أَنْتَ رَبِّي وَعِلْمُكَ حَسْبِي... فَنِعْمَ الرَّبُّ رَبِّي وَنِعْمَ الْحَسْبُ حَسْبِي... تَنْصُرُ مَنْ تَشَاءُ وَأَنْتَ الْعَزِيزُ الرَّحِيمُ.",
    isMaintenance: false,
    syriacNames: [],
    createdAt: Date.now() + 2
  }
];

export const GrandOaths: React.FC = () => {
  const { t, language } = useLanguage();
  const [oaths, setOaths] = useState<Oath[]>([]);
  const [selected, setSelected] = useState<Oath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    let unsub: (() => void) | undefined;

    const setupAndSubscribe = async () => {
      try {
        const setupRef = doc(db, 'settings', 'grand_oaths_setup');
        const setupSnap = await getDoc(setupRef);
        
        if (!setupSnap.exists() || !setupSnap.data()?.seeded) {
          // Double check if collection is indeed empty before seeding to avoid duplication
          const qSnap = await getDocs(collection(db, "grand_oaths"));
          if (qSnap.empty) {
            for (const item of DEFAULT_OATHS) {
              await addDoc(collection(db, "grand_oaths"), {
                ...item,
                createdAt: item.createdAt || Date.now()
              });
            }
          }
          await setDoc(setupRef, { seeded: true, seededAt: Date.now() }, { merge: true });
        }
      } catch (err) {
        console.error("Error setting up/seeding grand_oaths:", err);
      }

      if (!active) return;

      unsub = onSnapshot(collection(db, "grand_oaths"), (snap) => {
        const list: Oath[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Oath);
        });

        // Sort by createdAt or title
        list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));

        setOaths(list);
        setLoading(false);

        // Keep selection synchronized if it exists
        if (selected) {
          const updatedSelected = list.find(o => o.id === selected.id);
          if (updatedSelected) {
            setSelected(updatedSelected);
          }
        }
      }, (error) => {
        console.error("Error fetching grand_oaths", error);
        // Local fallback if firebase fails or is unreachable
        setOaths(DEFAULT_OATHS.map((o, idx) => ({ id: `default-${idx}`, ...o })));
        setLoading(false);
      });
    };

    setupAndSubscribe();

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }, [selected]);

  const getLocalizedValue = (obj: any, field: string) => {
    if (!obj) return '';
    if (language === 'en') {
      return obj[`${field}_en`] || obj[field] || '';
    }
    if (language === 'ha') {
      return obj[`${field}_ha`] || obj[field] || '';
    }
    return obj[field] || '';
  };

  const getLocalizedMeaning = (nameObj: any) => {
    if (!nameObj) return '';
    if (language === 'en') return nameObj.meaning_en || nameObj.meaning || '';
    if (language === 'ha') return nameObj.meaning_ha || nameObj.meaning || '';
    return nameObj.meaning || '';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8" id="grand_oaths_header">
        <Link to="/tools" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t("common.back")} {t("tools.grand-oaths.backToDashboard", "au tableau de bord")}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BookOpen className="text-amber-500" size={32} />
          {t("tools.grand-oaths.title", "Les Grands Serments (Azayim)")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.grand-oaths.description")}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {oaths.map((oath) => (
              <button
                key={oath.id}
                id={`btn-oath-${oath.id}`}
                onClick={() => setSelected(oath)}
                className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  selected?.id === oath.id 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:shadow-sm'
                }`}
              >
                {oath.isMaintenance && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Settings size={10} className="animate-spin-slow" />
                    Maint.
                  </span>
                )}
                <h3 className="font-bold text-lg mb-1 pr-12">{getLocalizedValue(oath, 'title')}</h3>
                <p className={`text-xl font-arabic ${selected?.id === oath.id ? 'text-amber-200' : 'text-gray-500'} text-right`} dir="rtl">
                  {oath.arabicTitle}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {selected.isMaintenance ? (
                    <div className="p-12 text-center" id="oath-maintenance-view">
                      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Settings size={40} className="animate-spin-slow" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {t("tools.grand-oaths.underMaintenance", "Sermon en maintenance")}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                        {t("tools.grand-oaths.underMaintenanceDesc", "Ce sermon est temporairement en maintenance pour des ajustements spirituels. Veuillez réessayer plus tard.")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-900/10">
                        <div className="flex justify-between items-start mb-6 gap-4">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{getLocalizedValue(selected, 'title')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">{getLocalizedValue(selected, 'desc')}</p>
                          </div>
                          <div className="text-4xl font-arabic font-bold text-amber-600 opacity-20 hidden sm:block">
                            {selected.arabicTitle}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Wind size={18} className="text-amber-600" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {t("tools.grand-oaths.incenseLabel", "Encens")}: {getLocalizedValue(selected, 'incense')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <Calendar size={18} className="text-blue-500" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {t("tools.grand-oaths.dayLabel", "Jour")}: {getLocalizedValue(selected, 'day')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-sm text-center">
                          {t("tools.grand-oaths.invocationText", "Texte de l'Invocation")}
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                          <p className="text-3xl md:text-4xl font-arabic leading-[2.5] text-gray-900 dark:text-white" dir="rtl">
                            {selected.content}
                          </p>
                        </div>

                        {selected.syriacNames && selected.syriacNames.length > 0 && (
                          <div className="mt-8">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <Star size={18} className="text-amber-500" />
                              {t("tools.grand-oaths.lexiconTitle", "Lexique des Noms Cachés")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selected.syriacNames.map((name, i) => (
                                <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
                                  <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{name.name}</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                      {t("tools.grand-oaths.lexiconMeaning", "Sens")}: {getLocalizedMeaning(name)}
                                    </p>
                                  </div>
                                  <span className="text-2xl font-arabic font-bold text-amber-600" dir="rtl">{name.arabic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center" id="empty-oaths-view">
                  <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mb-6">
                    <BookOpen size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("tools.grand-oaths.selectSermon", "Sélectionnez un Serment")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    {t("tools.grand-oaths.selectSermonDesc", "Choisissez une Da'wa dans le menu de gauche pour lire ses instructions, son encens et ses secrets.")}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrandOaths;
