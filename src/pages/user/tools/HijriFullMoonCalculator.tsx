import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Calendar as CalendarIcon, Sparkles, Feather, Clock, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

const HIJRI_MONTHS_FR = [
  'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' ath-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export const HijriFullMoonCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedGregorianDate, setSelectedGregorianDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showParchment, setShowParchment] = useState(false);

  // Conversion approximation logic
  const gDate = new Date(selectedGregorianDate);
  const epochJulian = Math.floor(gDate.getTime() / 86400000) + 2440588;
  const dayHijriApprox = Math.floor((epochJulian - 1948439.5) / 29.530588) % 30 + 1;
  const monthHijriApprox = (Math.floor((epochJulian - 1948439.5) / 29.530588) % 12) + 1;
  const yearHijriApprox = Math.floor((epochJulian - 1948439.5) / 354.36707) + 1;

  const isWhiteDay = dayHijriApprox === 13 || dayHijriApprox === 14 || dayHijriApprox === 15;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Calendrier Hijri & Nuits Blanches</span>
            <Moon className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {language === 'fr'
              ? 'Calculateur de Pleine Lune (Al-Ayyām Al-Bīḍ) & Nuits Propices d\'Invocations'
              : language === 'ha'
              ? 'Kwandatsin Musulunci da Ranakun Fararen Darare (13, 14, 15)'
              : 'Hijri Converter & White Days (Al-Ayyam Al-Bid) Calculator'}
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
              {language === 'fr' ? 'Sélectionner la Date Grégorienne' : 'Select Gregorian Date'}
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
              Date Hijri Correspondante
            </span>
            <p className="text-xl font-bold text-amber-900 dark:text-amber-300 font-serif">
              {dayHijriApprox} {HIJRI_MONTHS_FR[monthHijriApprox - 1]} {yearHijriApprox} AH
            </p>
            <p className="text-sm font-serif text-amber-600 dark:text-amber-400 font-bold">
              {HIJRI_MONTHS_AR[monthHijriApprox - 1]} ({dayHijriApprox})
            </p>
          </div>

          {/* White Day Alert Badge */}
          {isWhiteDay ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="font-bold text-xs block">Nuit Blanche (Al-Ayyām Al-Bīḍ)</span>
                <p className="text-[11px] leading-tight opacity-90">
                  Jour propice au jeûne prophétique et aux grands dhikrs nocturnes.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-xs text-gray-500 dark:text-gray-400">
              Journée lunaire ordinaire. Les prochaines Nuits Blanches sont prévues les 13, 14 et 15 du mois hégirien.
            </div>
          )}

          <button
            onClick={() => setShowParchment(true)}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <Feather className="w-4 h-4" />
            <span>Exporter Fiche Lunaire</span>
          </button>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-500" />
              <span>Nuits Propices & Prochaines Nuits Blanches (Al-Ayyām Al-Bīḍ)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">13 Hégirien</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Début du Jeûne</span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Lune croissante forte</p>
              </div>

              <div className="p-4 bg-amber-100 dark:bg-amber-900/40 rounded-2xl border border-amber-300 dark:border-amber-700/50 text-center shadow-sm">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">14 Hégirien</span>
                <span className="text-sm font-extrabold text-amber-950 dark:text-amber-200">Pleine Lune Exacte</span>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">Apogée énergétique</p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block mb-1">15 Hégirien</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Clôture des Nuits</span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Maintien de l'harmonie</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 text-white rounded-2xl space-y-2 text-xs font-serif leading-relaxed">
              <p className="font-bold text-amber-400 font-sans">✦ Recommandation Spirituelle des Nuits Blanches :</p>
              <p className="text-zinc-300">
                "Le Prophète (صلى الله عليه وسلم) recommandait le jeûne des trois jours blancs chaque mois hégirien. Ces nuits de pleine lune sont exceptionnelles pour les invocations majeures, la purification du cœur et les séances de Zikr prolongées."
              </p>
            </div>
          </div>
        </div>
      </div>

      <ParchmentExporterModal
        isOpen={showParchment}
        onClose={() => setShowParchment(false)}
        title="Calendrier Lunaire — Nuits Blanches"
        subtitle={`Date: ${dayHijriApprox} ${HIJRI_MONTHS_FR[monthHijriApprox - 1]} ${yearHijriApprox} AH`}
        content={
          <div className="space-y-4 text-center">
            <p className="text-2xl font-serif text-amber-950 font-bold">
              {dayHijriApprox} {HIJRI_MONTHS_AR[monthHijriApprox - 1]} {yearHijriApprox}
            </p>
            <p className="text-xs font-sans text-amber-900">
              Correspondance Grégorienne: {selectedGregorianDate}
            </p>
            <p className="text-xs italic text-amber-900 bg-amber-200/50 p-3 rounded-xl border border-amber-600/30">
              {isWhiteDay
                ? "Aujourd'hui est une Nuit Blanche (Al-Ayyām Al-Bīḍ) bénie !"
                : "Les Nuits Blanches ont lieu les 13, 14 et 15 de chaque mois hégirien."}
            </p>
          </div>
        }
      />
    </div>
  );
};
