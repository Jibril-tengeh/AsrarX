import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sparkles, Feather } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { calculateHijriDate } from '../../../utils/hijriDate';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const dicts = {
  fr: {
    title: "Calendrier Hijri & Nuits Blanches",
    subtitle: "Calculateur de Pleine Lune (Al-Ayyām Al-Bīḍ) & Nuits Propices d'Invocations",
    selectDate: "Sélectionner la Date Grégorienne",
    corresHijri: "Date Hijri Correspondante",
    whiteDayAlert: "Nuit Blanche (Al-Ayyām Al-Bīḍ)",
    whiteDayAlertDesc: "Jour propice au jeûne prophétique et aux grands dhikrs nocturnes.",
    ordinaryDay: "Journée lunaire ordinaire. Les prochaines Nuits Blanches sont prévues les 13, 14 et 15 du mois hégirien.",
    exportBtn: "Exporter Fiche Lunaire",
    propiciousTitle: "Nuits Propices & Prochaines Nuits Blanches (Al-Ayyām Al-Bīḍ)",
    day13: "13 Hégirien",
    day13Title: "Début du Jeûne",
    day13Desc: "Lune croissante forte",
    day14: "14 Hégirien",
    day14Title: "Pleine Lune Exacte",
    day14Desc: "Apogée énergétique",
    day15: "15 Hégirien",
    day15Title: "Clôture des Nuits",
    day15Desc: "Maintien de l'harmonie",
    recomTitle: "✦ Recommandation Spirituelle des Nuits Blanches :",
    recomText: "\"Le Prophète (صلى الله عليه وسلم) recommandait le jeûne des trois jours blancs chaque mois hégirien. Ces nuits de pleine lune sont exceptionnelles pour les invocations majeures, la purification du cœur et les séances de Zikr prolongées.\"",
    parchmentTitle: "Calendrier Lunaire — Nuits Blanches",
    gregCorres: "Correspondance Grégorienne :",
    blessedWhiteDay: "Aujourd'hui est une Nuit Blanche (Al-Ayyām Al-Bīḍ) bénie !",
    infoWhiteDays: "Les Nuits Blanches ont lieu les 13, 14 et 15 de chaque mois hégirien."
  },
  en: {
    title: "Hijri Calendar & White Days",
    subtitle: "Full Moon Calculator (Al-Ayyam Al-Bid) & Propitious Nights for Invocations",
    selectDate: "Select Gregorian Date",
    corresHijri: "Corresponding Hijri Date",
    whiteDayAlert: "White Day (Al-Ayyam Al-Bid)",
    whiteDayAlertDesc: "Auspicious day for prophetic fasting and major nocturnal dhikr sessions.",
    ordinaryDay: "Ordinary lunar day. The next White Days are scheduled for the 13th, 14th, and 15th of the Hijri month.",
    exportBtn: "Export Lunar Card",
    propiciousTitle: "Propitious Nights & Upcoming White Days (Al-Ayyam Al-Bid)",
    day13: "13th Hijri",
    day13Title: "Fasting Begins",
    day13Desc: "Strong waxing moon",
    day14: "14th Hijri",
    day14Title: "Exact Full Moon",
    day14Desc: "Energetic peak",
    day15: "15th Hijri",
    day15Title: "Closing of White Nights",
    day15Desc: "Maintaining spiritual balance",
    recomTitle: "✦ Spiritual Recommendation for White Days:",
    recomText: "\"The Prophet (peace be upon him) recommended fasting the three white days of each Hijri month. These full moon nights are exceptional for major supplications, heart purification, and extended Dhikr sessions.\"",
    parchmentTitle: "Lunar Calendar — White Days",
    gregCorres: "Gregorian Date:",
    blessedWhiteDay: "Today is a blessed White Night (Al-Ayyam Al-Bid)!",
    infoWhiteDays: "White Nights take place on the 13th, 14th, and 15th of each Hijri month."
  },
  ha: {
    title: "Kwandatsin Musulunci da Fararen Darare",
    subtitle: "Kwandatsin Musulunci da Ranakun Fararen Darare (Al-Ayyam Al-Bid: 13, 14, 15)",
    selectDate: "Zaɓi Kwanan Wata na Turawa",
    corresHijri: "Kwanan Wata na Musulunci (Hijri)",
    whiteDayAlert: "Farar Rana (Al-Ayyam Al-Bid)",
    whiteDayAlertDesc: "Rana ce mai kyau ga azumin Annabi da yin amfani da daren wata wajen Ambato.",
    ordinaryDay: "Rana ce ta al'ada. Fararen Darare masu zuwa za su kasance a ranaku 13, 14 da 15 na watan Hijriyya.",
    exportBtn: "Fitar da Takardar Wata",
    propiciousTitle: "Darare Masu Albarka da Fararen Darare (Al-Ayyam Al-Bid)",
    day13: "Ranar 13 ga Hijri",
    day13Title: "Farin Shiga Azumi",
    day13Desc: "Karfin Wata yana hauhawa",
    day14: "Ranar 14 ga Hijri",
    day14Title: "Cikakken Farin Wata",
    day14Desc: "Kololuwar Karfin Karama",
    day15: "Ranar 15 ga Hijri",
    day15Title: "Kammala Darare",
    day15Desc: "Tsayar da Zaman Lafiya da Sirri",
    recomTitle: "✦ Shawarwari na Ruhu don Fararen Darare:",
    recomText: "\"Annabi (S.A.W) ya yi wasiyya da azumtar ranakun fararen darare guda uku a kowane watan Musulunci. Wadannan dararen cikakken wata suna da matukar muhimmanci ga addu'o'i na musamman da tsarkake zuciya.\"",
    parchmentTitle: "Kwandatsin Wata — Fararen Darare",
    gregCorres: "Kwanan Wata na Turawa:",
    blessedWhiteDay: "Yau Rana ce ta Farar Darare (Al-Ayyām Al-Bīḍ) mai albarka!",
    infoWhiteDays: "Fararen Darare suna kasancewa a ranaku 13, 14 da 15 na kowane watan Musulunci."
  }
};

export const HijriFullMoonCalculator: React.FC = () => {
  const { language } = useLanguage();
  const { featureToggles } = useFeatures();
  const [selectedGregorianDate, setSelectedGregorianDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showParchment, setShowParchment] = useState(false);

  const dict = dicts[(language as 'fr' | 'en' | 'ha')] || dicts.fr;

  // Accurate Hijri date calculation
  const offset = featureToggles?.hijriOffset || 0;
  const dateObj = new Date(selectedGregorianDate);
  const hijriRes = calculateHijriDate(dateObj, offset);

  const dayHijri = hijriRes.day;
  const monthName = language === 'en' 
    ? hijriRes.monthNameEn 
    : (language === 'ha' ? hijriRes.monthNameHa : hijriRes.monthNameFr);
  const yearHijri = hijriRes.year;

  const isWhiteDay = dayHijri === 13 || dayHijri === 14 || dayHijri === 15;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{dict.title}</span>
            <Moon className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {dict.subtitle}
          </p>
        </div>
        <ToolInfoTooltip toolId="hijri-full-moon" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Converter Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {dict.selectDate}
            </label>
            <input
              type="date"
              value={selectedGregorianDate}
              onChange={(e) => setSelectedGregorianDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center space-y-1">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">
              {dict.corresHijri}
            </span>
            <p className="text-xl font-bold text-amber-900 dark:text-amber-300 font-serif">
              {dayHijri} {monthName} {yearHijri} AH
            </p>
            <p className="text-sm font-serif text-amber-600 dark:text-amber-400 font-bold">
              {hijriRes.monthNameAr} ({dayHijri})
            </p>
          </div>

          {/* White Day Alert Badge */}
          {isWhiteDay ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-xs block">{dict.whiteDayAlert}</span>
                <p className="text-[11px] leading-tight opacity-90">
                  {dict.whiteDayAlertDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-xs text-gray-500 dark:text-gray-300">
              {dict.ordinaryDay}
            </div>
          )}

          <button
            onClick={() => setShowParchment(true)}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Feather className="w-4 h-4" />
            <span>{dict.exportBtn}</span>
          </button>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-500" />
              <span>{dict.propiciousTitle}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">{dict.day13}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{dict.day13Title}</span>
                <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1">{dict.day13Desc}</p>
              </div>

              <div className="p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl border border-amber-300 dark:border-amber-700/50 text-center shadow-sm">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">{dict.day14}</span>
                <span className="text-sm font-extrabold text-amber-950 dark:text-amber-200">{dict.day14Title}</span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">{dict.day14Desc}</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">{dict.day15}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{dict.day15Title}</span>
                <p className="text-[11px] text-gray-500 dark:text-gray-300 mt-1">{dict.day15Desc}</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 text-white rounded-2xl space-y-2 text-xs font-serif leading-relaxed">
              <p className="font-bold text-amber-700 dark:text-amber-400 font-sans">{dict.recomTitle}</p>
              <p className="text-zinc-300">
                {dict.recomText}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title={dict.parchmentTitle}
        subtitle={`Date: ${dayHijri} ${monthName} ${yearHijri} AH`}
        content={
          <div className="space-y-4 text-center">
            <p className="text-2xl font-serif text-amber-950 font-bold">
              {dayHijri} {hijriRes.monthNameAr} {yearHijri}
            </p>
            <p className="text-xs font-sans text-amber-900">
              {dict.gregCorres} {selectedGregorianDate}
            </p>
            <p className="text-xs italic text-amber-900 bg-amber-200/50 p-3 rounded-xl border border-amber-600/30">
              {isWhiteDay
                ? dict.blessedWhiteDay
                : dict.infoWhiteDays}
            </p>
          </div>
        }
      />
    </div>
  );
};
