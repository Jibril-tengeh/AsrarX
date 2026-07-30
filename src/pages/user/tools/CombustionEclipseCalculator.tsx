import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, AlertTriangle, CheckCircle, Clock, ShieldAlert, Calendar, Sparkles, Compass, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

export const CombustionEclipseCalculator: React.FC = () => {
  const { language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });

  // Translations dictionary for Combustion & Eclipse Calculator
  const texts = {
    fr: {
      title: "Calculateur d'Éclipse & Heures de Combustion (Iqtiran)",
      description: "Alerte céleste en temps réel pour éviter d'effectuer des rituels ou la gravure d'awfaq durant les heures de combustion planétaire.",
      selectLabel: "SÉLECTIONNEZ LA DATE À CONSULTER",
      selectSub: "Vérifiez la clarté céleste avant tout travail spirituel.",
      eclipseBadge: "⚠️ Éclipse Imminente / Active",
      combustionBadge: "⚠️ Lune en Combustion (Iqtiran)",
      criticalTitle: "Période Critique d'Ombre (Inqiras Al-Qamar)",
      criticalDesc: "La Lune se trouve sous les rayons brûlants du Soleil (< 12° d'élongation). Dans la tradition des maîtres du Sirr, il est strictement déconseillé de graver des Awfaq, de confectionner des talismans ou de lancer des invocations majeures durant cette fenêtre.",
      sunMoonDist: "• Distance Soleil-Lune : ",
      recCombustion: "• Recommandation : Istighfar & Protection",
      favorableBadge: "✅ Lune Lumineuse & Réceptive",
      favorableTitle: "Climat Céleste Propice & Harmonieux",
      favorableDesc: "La Lune est affranchie de la combustion solaire. C'est une période bénie pour effectuer vos Zikrs, Invocations, écriture d'Awfaq et travaux d'ouverture (Fath).",
      elongation: "• Élongation : ",
      phaseLabel: "• Phase : ",
      forecastTitle: "Calendrier des 7 Prochains Jours (Alerte Combustion)",
      combustion: "Combustion",
      favorable: "Favorable",
      secretTitle: "Secret des Anciens : Pourquoi éviter la Combustion (Iqtiran) ?",
      secretDesc: "Lorsque la Lune passe à proximité immédiate du Soleil (moins de 12 degrés), elle est considérée comme \"brûlée\" (Mahruqa) par l'éclat solaire suprême. Durant cette phase, l'influence lunaire réceptive est éclipsée. Les maîtres de la science d'Abjad conseillent de consacrer ce temps à l'auto-purification, à la repentance (Istighfar) et au repentir intérieur plutôt qu'aux demandes d'acquisition matérielle.",
      phases: {
        newMoonCombustion: "Nouvelle Lune & Combustion (Iqtiran)",
        firstQuarter: "Premier Quartier (Tarbii Al-Awwal)",
        fullMoon: "Pleine Lune Spirituelle (Badr)",
        waningCombustion: "Lune Morte (Mahaq / End Combustion)",
        waxingMoon: "Lune Croissante (Hilal / Badia)"
      }
    },
    en: {
      title: "Eclipse & Planetary Combustion Calculator (Iqtiran)",
      description: "Real-time celestial alert to avoid performing rituals or engraving awfaq during hours of planetary combustion.",
      selectLabel: "SELECT DATE TO CONSULT",
      selectSub: "Verify celestial clarity before any spiritual work.",
      eclipseBadge: "⚠️ Imminent / Active Eclipse",
      combustionBadge: "⚠️ Moon in Combustion (Iqtiran)",
      criticalTitle: "Critical Shadow Period (Inqiras Al-Qamar)",
      criticalDesc: "The Moon is under the burning rays of the Sun (< 12° elongation). In the tradition of the masters of Sirr, it is strongly advised against engraving Awfaq, crafting talismans, or launching major invocations during this window.",
      sunMoonDist: "• Sun-Moon Distance: ",
      recCombustion: "• Recommendation: Istighfar & Protection",
      favorableBadge: "✅ Luminous & Receptive Moon",
      favorableTitle: "Propitious & Harmonious Celestial Climate",
      favorableDesc: "The Moon is free from solar combustion. This is a blessed period to perform your Dhikrs, Invocations, Awfaq writing, and spiritual opening works (Fath).",
      elongation: "• Elongation: ",
      phaseLabel: "• Phase: ",
      forecastTitle: "7-Day Forecast Calendar (Combustion Alert)",
      combustion: "Combustion",
      favorable: "Favorable",
      secretTitle: "Secret of the Ancients: Why avoid Combustion (Iqtiran)?",
      secretDesc: "When the Moon passes in close proximity to the Sun (less than 12 degrees), it is considered 'burned' (Mahruqa) by the supreme solar glare. During this phase, receptive lunar influence is eclipsed. Masters of Abjad science advise spending this time in self-purification, repentance (Istighfar), and inner reflection rather than material acquisition requests.",
      phases: {
        newMoonCombustion: "New Moon & Combustion (Iqtiran)",
        firstQuarter: "First Quarter (Tarbii Al-Awwal)",
        fullMoon: "Spiritual Full Moon (Badr)",
        waningCombustion: "Waning Moon (Mahaq / End Combustion)",
        waxingMoon: "Waxing Moon (Hilal / Badia)"
      }
    },
    ha: {
      title: "Na'urar Ciro Lokutan Dujami (Eclipse) da Konewa (Iqtiran)",
      description: "Gargadi na taurari a ainihin lokaci domin guje wa yin ayyukan ruhi ko zanen awfaq a lokutan konewa.",
      selectLabel: "ZAVI RANA DOMIN DUBAWA",
      selectSub: "Tabbatar da Hasken Samaniya Kafin kowane Aikin Ruhi.",
      eclipseBadge: "⚠️ Eclipse na Kusatowa / yana Aiki",
      combustionBadge: "⚠️ Wata Yana Cikin Konewa (Iqtiran)",
      criticalTitle: "Lokaci Mai Hadari na Inuwa (Inqiras Al-Qamar)",
      criticalDesc: "Wata yana karkashin hasken rana mai zafi (< 12° elongation). A cikin al'adar malaman Sirri, ana gargadi sosai akan kada a zane Awfaq, ko kera talsam, ko yin manyan addu'o'i a wannan lokaci.",
      sunMoonDist: "• Nisa Tsakanin Rana da Wata: ",
      recCombustion: "• Shawara: Nemun Gafara (Istighfar) & Kariya",
      favorableBadge: "✅ Wata Mai Haske & Karvava",
      favorableTitle: "Yanayin Samaniya Mai Albarka da Dace",
      favorableDesc: "Wata ya fita daga cikin konewar rana. Wannan lokaci ne mai albarka domin yin Zikiri, Addu'o'i, rubuta Awfaq da ayyukan bude kofa (Fath).",
      elongation: "• Kwana (Elongation): ",
      phaseLabel: "• Mataki: ",
      forecastTitle: "Kalandar Kwanaki 7 Masu Zuwa (Gargadin Konewa)",
      combustion: "Konewa",
      favorable: "Mai Kyau",
      secretTitle: "Sirrin Magabata: Me yasa ake Guje wa Konewa (Iqtiran)?",
      secretDesc: "Lallai lokacin da Wata yake kusa sosai da Rana (kasa da digiri 12), ana daukarsa a matsayin 'Koyaye' (Mahruqa) sakamakon karfin hasken rana. A wannan mataki, tasirin wata yana dusashewa. Malaman ilimin Abjadi suna ba da shawarar yin amfani da wannan lokaci wajen tsarkake kai, tuba (Istighfar) da komawa ga Allah maimakon neman abubuwan duniya.",
      phases: {
        newMoonCombustion: "Sabon Wata & Konewa (Iqtiran)",
        firstQuarter: "Rabin Wata na Farko (Tarbii Al-Awwal)",
        fullMoon: "Cikakken Wata (Badr)",
        waningCombustion: "Karshen Wata (Mahaq / Karshen Konewa)",
        waxingMoon: "Tsitstsirar Wata (Hilal / Badia)"
      }
    }
  };

  const currentLang = (language === 'en' || language === 'ha') ? language : 'fr';
  const txt = texts[currentLang];

  // Astronomical / Astrological calculations based on date
  const computeCombustionState = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Approximate Moon-Sun angle (Synodic month ~29.53 days)
    const synodicDays = (dayOfYear + 5) % 29.53;
    const moonSunDegrees = Math.abs((synodicDays / 29.53) * 360 - 180);

    // Is moon within 12 degrees of sun or near 0/360 degrees (New Moon / Combustion)?
    const isCombustion = synodicDays < 1.2 || synodicDays > 28.3 || Math.abs(synodicDays - 14.76) < 0.8;
    
    // Is eclipse probable (near nodes)?
    const isEclipse = (synodicDays < 0.5 || Math.abs(synodicDays - 14.76) < 0.5) && (dayOfYear % 173 < 18);

    // Lunar Phase name
    let phaseName = txt.phases.waxingMoon;
    let phaseColor = "text-emerald-500";
    if (synodicDays < 1.5) {
      phaseName = txt.phases.newMoonCombustion;
      phaseColor = "text-rose-500";
    } else if (synodicDays < 7) {
      phaseName = txt.phases.firstQuarter;
      phaseColor = "text-amber-500";
    } else if (synodicDays >= 13.5 && synodicDays <= 16) {
      phaseName = txt.phases.fullMoon;
      phaseColor = "text-cyan-400";
    } else if (synodicDays > 27) {
      phaseName = txt.phases.waningCombustion;
      phaseColor = "text-rose-400";
    }

    return {
      synodicDays: synodicDays.toFixed(1),
      moonSunAngle: moonSunDegrees.toFixed(1),
      isCombustion,
      isEclipse,
      phaseName,
      phaseColor
    };
  };

  const state = computeCombustionState(selectedDate);

  // Generate 7-day forecast
  const getWeeklySchedule = () => {
    const schedule = [];
    const baseDate = new Date(selectedDate);
    const localeStr = language === 'en' ? 'en-US' : language === 'ha' ? 'ha-NG' : 'fr-FR';
    for (let i = 0; i < 7; i++) {
      const target = new Date(baseDate);
      target.setDate(baseDate.getDate() + i);
      const targetStr = target.toISOString().split('T')[0];
      const res = computeCombustionState(targetStr);
      schedule.push({
        dateStr: targetStr,
        dayLabel: target.toLocaleDateString(localeStr, { weekday: 'short', day: 'numeric', month: 'short' }),
        ...res
      });
    }
    return schedule;
  };

  const weeklySchedule = getWeeklySchedule();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/tools" className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="text-indigo-400" />
            {txt.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            {txt.description}
          </p>
        </div>
      </div>

      {/* Date Picker Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1">
            {txt.selectLabel}
          </label>
          <p className="text-xs text-gray-400">{txt.selectSub}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 font-bold text-sm text-gray-900 dark:text-white focus:outline-none"
        />
      </div>

      {/* Real-time Status Alert Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
        {state.isCombustion || state.isEclipse ? (
          <div className="bg-gradient-to-r from-rose-900 via-red-950 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-700/60 relative overflow-hidden">
            <div className="flex items-start gap-4 z-10 relative">
              <div className="p-3 bg-rose-500/20 rounded-2xl shrink-0 text-rose-300">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-rose-500/30 text-rose-200 text-xs font-bold rounded-full uppercase tracking-wider">
                    {state.isEclipse ? txt.eclipseBadge : txt.combustionBadge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {txt.criticalTitle}
                </h3>
                <p className="text-sm text-rose-100/90 leading-relaxed max-w-2xl">
                  {txt.criticalDesc}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-rose-200 font-medium">
                  <span>{txt.sunMoonDist}{state.moonSunAngle}°</span>
                  <span>{txt.recCombustion}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-700/60 relative overflow-hidden">
            <div className="flex items-start gap-4 z-10 relative">
              <div className="p-3 bg-emerald-500/20 rounded-2xl shrink-0 text-emerald-300">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 text-xs font-bold rounded-full uppercase tracking-wider">
                    {txt.favorableBadge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {txt.favorableTitle}
                </h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                  {txt.favorableDesc}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200 font-medium">
                  <span>{txt.elongation}{state.moonSunAngle}°</span>
                  <span>{txt.phaseLabel}<strong className={state.phaseColor}>{state.phaseName}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <Calendar className="text-indigo-500" />
          {txt.forecastTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weeklySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                item.isCombustion
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-300 mb-1">
                {item.dayLabel}
              </div>
              <div className="text-sm font-bold truncate mb-2">
                {item.phaseName.split(' ')[0]}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium">
                {item.isCombustion ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle size={12} /> {txt.combustion}
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle size={12} /> {txt.favorable}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Esoteric Principles Card */}
      <div className="bg-indigo-950/90 text-indigo-100 rounded-3xl p-6 sm:p-8 border border-indigo-800/60 space-y-4">
        <h4 className="text-base font-bold text-indigo-200 flex items-center gap-2">
          <Info size={18} className="text-indigo-400" />
          {txt.secretTitle}
        </h4>
        <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
          {txt.secretDesc}
        </p>
      </div>
    </div>
  );
};
