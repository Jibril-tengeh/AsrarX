import React, { useState } from 'react';
import {
  ShieldAlert,
  Shield,
  Snowflake,
  Gem,
  Lock,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import HissnHadidTab from '../../../components/metaphysicalDefense/HissnHadidTab';
import AlTafreeqTab from '../../../components/metaphysicalDefense/AlTafreeqTab';
import MizanShabahTab from '../../../components/metaphysicalDefense/MizanShabahTab';
import WafqMasdoodTab from '../../../components/metaphysicalDefense/WafqMasdoodTab';

const UI_TEXTS = {
  fr: {
    pageTitle: "Défense Métaphysique & Protection Hermétique",
    pageSubtitle: "Bouclier de Fer (Abjad 26), dispersion des conflits par lettres froides, recommandation de pierres minérales et carré magique masdood aux bordures scellées.",
    headerBadge: "Protection Métaphysique",

    tabs: {
      hissn: "Hissn al-Hadid (Bouclier de Fer)",
      tafreeq: "Al-Tafreeq (Dispersion)",
      shabah: "Mizan al-Shabah (Minéraux)",
      masdood: "Wafq al-Masdood (Forteresse)"
    },

    infoTitle: "Avertissement & Rigueur Traditionnelle",
    infoText: "Ces outils d'ingénierie hermétique et de défense métaphysique s'appuient sur les principes abjadiques de l'élément Fer, la science des lettres froides et le scellement numérique traditionnel. Utiliser à des fins bénéfiques et de protection spirituelle."
  },
  en: {
    pageTitle: "Metaphysical Defense & Hermetic Shielding",
    pageSubtitle: "Iron Shield (Abjad 26), conflict dissipation via cold letters, mineral stone balance, and outer border sealed magic square.",
    headerBadge: "Metaphysical Defense",

    tabs: {
      hissn: "Hissn al-Hadid (Iron Shield)",
      tafreeq: "Al-Tafreeq (Dispersion)",
      shabah: "Mizan al-Shabah (Minerals)",
      masdood: "Wafq al-Masdood (Fortress)"
    },

    infoTitle: "Traditional Rigor & Notice",
    infoText: "These metaphysical defense tools utilize Abjad principles of the Iron element, cold letter sequence mathematics, and sealed border magic squares for spiritual protection."
  },
  ha: {
    pageTitle: "Hanyoyin Kariya da Tsaro na Metaphysique",
    pageSubtitle: "Ganuwar Karfe na Abjad 26, tarwatsa magance rikici da haruffa masu sanyi, zabin duwatsun kariya da gidan wafq masdood mai kariya.",
    headerBadge: "Kariya da Tsaro na Sirri",

    tabs: {
      hissn: "Hissn al-Hadid (Ganuwar Karfe)",
      tafreeq: "Al-Tafreeq (Tarwatsa Rikici)",
      shabah: "Mizan al-Shabah (Duwatsun Kariya)",
      masdood: "Wafq al-Masdood (Gidan Masdood)"
    },

    infoTitle: "Sanarwa ta Ilimin Sirri",
    infoText: "Wadannan hanyoyi na kariya suna amfani da sirrin karfe na Abjad 26, haruffa masu sanyi domin sanyaya fushi da gidan wafq masdood domin kariya daga sharri."
  }
};

export default function MetaphysicalDefense() {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const t = UI_TEXTS[(language as keyof typeof UI_TEXTS)] || UI_TEXTS.fr;

  const [activeTab, setActiveTab] = useState<'hissn' | 'tafreeq' | 'shabah' | 'masdood'>('hissn');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-700/50">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert size={14} className="text-amber-400" />
            <span>{t.headerBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.pageTitle}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>

        {/* Decorative Watermark Icon */}
        <ShieldAlert size={260} className="absolute -right-10 -bottom-16 text-slate-800/20 pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {[
          { id: 'hissn', label: t.tabs.hissn, icon: Shield },
          { id: 'tafreeq', label: t.tabs.tafreeq, icon: Snowflake },
          { id: 'shabah', label: t.tabs.shabah, icon: Gem },
          { id: 'masdood', label: t.tabs.masdood, icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-lg dark:bg-slate-800 dark:text-slate-100 ring-2 ring-slate-500/50'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-amber-400' : 'text-gray-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'hissn' && <HissnHadidTab language={language} />}
      {activeTab === 'tafreeq' && <AlTafreeqTab language={language} />}
      {activeTab === 'shabah' && <MizanShabahTab language={language} />}
      {activeTab === 'masdood' && <WafqMasdoodTab language={language} />}

      {/* Info Notice Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">{t.infoTitle}</span>
          <p className="leading-relaxed">{t.infoText}</p>
        </div>
      </div>
    </div>
  );
}
