import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Scale,
  Compass,
  Clock,
  ShieldAlert,
  Info,
  RefreshCw,
  Download,
  Flame,
  Music,
  BookOpen,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';

import TilasimNujumTab from '../../../components/advancedAlchemy/TilasimNujumTab';
import KhatamJabirTab from '../../../components/advancedAlchemy/KhatamJabirTab';
import UsturlabManazilTab from '../../../components/advancedAlchemy/UsturlabManazilTab';
import KhatamSaharTab from '../../../components/advancedAlchemy/KhatamSaharTab';
import MizanHararahTab from '../../../components/advancedAlchemy/MizanHararahTab';
import MizanTaraneemTab from '../../../components/advancedAlchemy/MizanTaraneemTab';
import QurahAnbiyaTab from '../../../components/advancedAlchemy/QurahAnbiyaTab';
import CalligraphieFractaleTab from '../../../components/advancedAlchemy/CalligraphieFractaleTab';

const UI_TEXTS = {
  fr: {
    pageTitle: "Systèmes Alchimiques & Hermétiques Avancés",
    pageSubtitle: "Ingénierie hermétique des 15 étoiles béhéniennes, balance de Jabir, cadran divinatoire des prophètes, jauge thermique, harmonie phonétique et calligraphie fractale.",
    headerBadge: "Systèmes Alchimiques & Hermétiques",

    tabs: {
      nujum: "Tilasim al-Nujum (15 Étoiles)",
      jabir: "Khatam Jabir (Balance Alchimique)",
      hararah: "Mizan al-Hararah (Chaleur & Fatigue)",
      taraneem: "Mizan al-Taraneem (Harmonie)",
      usturlab: "Usturlab al-Manazil (Azimut 3D)",
      sahar: "Khatam al-Sahar (Aube)",
      anbiya: "Qur'ah al-Anbiya (Grand Cadran 120)",
      fractal: "Calligraphie Fractale (Vectoriel)"
    },

    infoTitle: "Avertissement & Rigueur Traditionnelle",
    infoText: "Ces outils sont fondés sur le corpus hermétique d'Hermès Trismégiste, Jabir Ibn Hayyan et Al-Buni. Manipulez les correspondances physiques et spirituelles avec sérénité et dévotion."
  },
  en: {
    pageTitle: "Advanced Alchemical & Hermetic Systems",
    pageSubtitle: "Hermetic engineering of 15 Behenian stars, Jabirian elemental balance, prophetic oracle dial, thermal gauge, phonetic harmony, and fractal calligraphy.",
    headerBadge: "Alchemical & Hermetic Systems",

    tabs: {
      nujum: "Tilasim al-Nujum (15 Stars)",
      jabir: "Khatam Jabir (Alchemical Balance)",
      hararah: "Mizan al-Hararah (Heat & Fatigue)",
      taraneem: "Mizan al-Taraneem (Harmony)",
      usturlab: "Usturlab al-Manazil (3D Azimuth)",
      sahar: "Khatam al-Sahar (Dawn)",
      anbiya: "Qur'ah al-Anbiya (120 Dial)",
      fractal: "Fractal Calligraphy (Vector)"
    },

    infoTitle: "Traditional Rigor & Notice",
    infoText: "These tools are based on the hermetic corpus of Hermes Trismegistus, Jabir Ibn Hayyan, and Al-Buni. Handle physical and spiritual correspondences with devotion and clarity."
  },
  ha: {
    pageTitle: "Tsarin Alchimie da Hermetisme na Ci Gaba",
    pageSubtitle: "Ilimin taurari 15 na Hermetisme, ma'aunin Alchimie na Jabir, awon qura na annabawa 120, gwajin zafin kai, mawakar muryoyi da rubutun fractal.",
    headerBadge: "Tsarin Alchimie da Ilimin Sirri",

    tabs: {
      nujum: "Tilasim al-Nujum (Taurari 15)",
      jabir: "Khatam Jabir (Awon Alchimie)",
      hararah: "Mizan al-Hararah (Zafi da Gajiya)",
      taraneem: "Mizan al-Taraneem (Amsar Muryoyi)",
      usturlab: "Usturlab al-Manazil (Usturlab 3D)",
      sahar: "Khatam al-Sahar (Gidan Asuba)",
      anbiya: "Qur'ah al-Anbiya (Awon Qura 120)",
      fractal: "Rubutun Fractal (Calligraphie)"
    },

    infoTitle: "Sanarwa ta Ilimin Sirri",
    infoText: "Wadannan kayan aiki sun dogara ne akan ilimin Hermetisme, Jabir Ibn Hayyan da Al-Buni. Yi amfani da su da nutsuwa da girmamawa."
  }
};

export default function AdvancedAlchemy() {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'nujum' | 'jabir' | 'hararah' | 'taraneem' | 'usturlab' | 'sahar' | 'anbiya' | 'fractal'>('nujum');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-amber-950 p-8 text-white shadow-2xl border border-teal-500/30">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>{t.headerBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.pageTitle}
          </h1>

          <p className="text-sm text-teal-100/80 max-w-3xl leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {[
          { id: 'nujum', label: t.tabs.nujum, icon: Star },
          { id: 'jabir', label: t.tabs.jabir, icon: Scale },
          { id: 'hararah', label: t.tabs.hararah, icon: Flame },
          { id: 'taraneem', label: t.tabs.taraneem, icon: Music },
          { id: 'usturlab', label: t.tabs.usturlab, icon: Compass },
          { id: 'sahar', label: t.tabs.sahar, icon: Clock },
          { id: 'anbiya', label: t.tabs.anbiya, icon: BookOpen },
          { id: 'fractal', label: t.tabs.fractal, icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'nujum' && <TilasimNujumTab language={language} />}
      {activeTab === 'jabir' && <KhatamJabirTab language={language} />}
      {activeTab === 'hararah' && <MizanHararahTab language={language} />}
      {activeTab === 'taraneem' && <MizanTaraneemTab language={language} />}
      {activeTab === 'usturlab' && <UsturlabManazilTab language={language} />}
      {activeTab === 'sahar' && <KhatamSaharTab language={language} />}
      {activeTab === 'anbiya' && <QurahAnbiyaTab language={language} />}
      {activeTab === 'fractal' && <CalligraphieFractaleTab language={language} />}

      {/* Info Notice Footer */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
        <Info size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">{t.infoTitle}</h4>
          <p className="mt-1 text-teal-800 dark:text-teal-300 leading-relaxed">
            {t.infoText}
          </p>
        </div>
      </div>
    </div>
  );
}
