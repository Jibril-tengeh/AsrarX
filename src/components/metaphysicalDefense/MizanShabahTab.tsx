import React, { useState, useMemo } from 'react';
import { Gem, Sparkles, Info, RefreshCw, BarChart2 } from 'lucide-react';
import { calculateAbjadValue, getElementalBreakdown } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface MizanShabahTabProps {
  language: string;
}

const MINERAL_RECOMMENDATIONS = {
  fire: {
    stoneAr: 'عقيق أحمر / ياقوت',
    stoneFr: 'Cornaline & Corindon Rouge (Aqeeq Ahmar)',
    stoneEn: 'Carnelian & Red Ruby (Aqeeq Ahmar)',
    stoneHa: 'Dutsen Aqeeq Ja (Aqeeq Ahmar)',
    color: '#ef4444',
    bg: '#450a0a',
    propertiesFr: 'Compense le manque de Feu vital, renforce le courage, la volonté et repousse les léthargies mystiques.',
    propertiesEn: 'Compensates for Fire deficit, boosts vital courage, willpower, and wards off spiritual lethargy.',
    propertiesHa: 'Yana cike karancin Wuta, yana kara karfin zuciya da kariya daga kasala da sihiri.'
  },
  air: {
    stoneAr: 'عقيق أصفر / زبرجد',
    stoneFr: 'Topaze Jaune & Péridot (Aqeeq Asfar)',
    stoneEn: 'Yellow Topaz & Peridot (Aqeeq Asfar)',
    stoneHa: 'Dutsen Aqeeq Rakka (Aqeeq Asfar)',
    color: '#eab308',
    bg: '#422006',
    propertiesFr: 'Rétablit l\'Élément Air, clarifie l\'intellect, dissipe les nuages mentaux et attache la protection intellectuelle.',
    propertiesEn: 'Restores Air element, clarifies mind, dissipates mental fog and secures intellectual defense.',
    propertiesHa: 'Yana saita iska, yana fayyace tunani da basira gami da kariya daga waswasi.'
  },
  water: {
    stoneAr: 'فيروز / زمرد',
    stoneFr: 'Turquoise & Émeraude (Fairooz)',
    stoneEn: 'Turquoise & Emerald (Fairooz)',
    stoneHa: 'Dutsen Fairooz (Turquoise)',
    color: '#06b6d4',
    bg: '#083344',
    propertiesFr: 'Comble la carence en Eau, apaise le stress psychique, apporte le calme émotionnel et attire la sérénité.',
    propertiesEn: 'Replenishes Water deficit, calms psychic stress, brings emotional peace and spiritual serenity.',
    propertiesHa: 'Yana cike karancin Ruwa, yana sanyaya rai da korar damuwa gami da kawo salama.'
  },
  earth: {
    stoneAr: 'حجر اليشب / حديد صيني',
    stoneFr: 'Jaspe Noir & Hématite (Hajar al-Yashb)',
    stoneEn: 'Black Jasper & Hematite (Hajar al-Yashb)',
    stoneHa: 'Dutsen Hajar al-Yashb (Hematite)',
    color: '#10b981',
    bg: '#022c22',
    propertiesFr: 'Ancre l\'Élément Terre, stabilise la santé physique, offre un bouclier contre les envoûtements d\'enracinement.',
    propertiesEn: 'Anchors Earth element, stabilizes physical health, builds grounding shield against malevolent spellcraft.',
    propertiesHa: 'Yana kafawa da saita Kasa, yana kiyaye lafiyar jiki da tsare mutum daga asiri.'
  }
};

export default function MizanShabahTab({ language }: MizanShabahTabProps) {
  const [userName, setUserName] = useState<string>('محمد');
  const [motherName, setMotherName] = useState<string>('مريم');

  const combinedText = useMemo(() => {
    return `${userName} ${motherName}`.trim();
  }, [userName, motherName]);

  const elementalBreakdown = useMemo(() => {
    return getElementalBreakdown(combinedText);
  }, [combinedText]);

  // Find elemental deficit (lowest non-zero percentage or absolute minimum)
  const deficitElement = useMemo(() => {
    const { fire, air, water, earth } = elementalBreakdown;
    const elements = [
      { name: 'fire', value: fire },
      { name: 'air', value: air },
      { name: 'water', value: water },
      { name: 'earth', value: earth }
    ];
    elements.sort((a, b) => a.value - b.value);
    return elements[0].name as 'fire' | 'air' | 'water' | 'earth';
  }, [elementalBreakdown]);

  const mineral = MINERAL_RECOMMENDATIONS[deficitElement];

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('mizan-shabah-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mizan_shabah_${combinedText}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
          <Gem size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? "Mizan al-Shabah (Protective Mineral & Stone Balance)"
              : language === 'ha'
              ? "Mizan al-Shabah (Ma'aunin Duwatsun Kariya)"
              : "Mizan al-Shabah (Analyse & Recommandation de Pierres de Protection)"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? "Analyzes elemental deficit (Fire, Air, Water, Earth) to prescribe the ideal protective gemstone."
              : language === 'ha'
              ? "Yana binciken karancin sinadirai a sunanka domin ba ka shawarar dutsen kariya mafi dacewa."
              : "Analyse le déficit élémentaire (Feu, Air, Eau, Terre) pour prescrire la pierre minérale de protection optimale."}
          </p>
        </div>
      </div>

      {/* Input Name & Mother Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'First Name (Arabic):' : language === 'ha' ? 'Sunanka (Larabci):' : 'Prénom (en Arabe) :'}
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? "Mother's Name (Arabic):" : language === 'ha' ? "Sunan Mahaifiya (Larabci):" : "Nom de la Mère (en Arabe) :"}
          </label>
          <input
            type="text"
            value={motherName}
            onChange={(e) => setMotherName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Diagram (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 rounded-3xl border border-emerald-600/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Mizan al-Shabah</span>
          </div>

          <svg id="mizan-shabah-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 300" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="300" fill="#022c22" rx="20" />

            {/* Faceted Gem Crystal */}
            <polygon points="160,40 230,90 230,190 160,240 90,190 90,90" fill="none" stroke={mineral.color} strokeWidth="3" />
            <polygon points="160,60 210,100 210,180 160,220 110,180 110,100" fill={mineral.color} opacity="0.25" stroke={mineral.color} strokeWidth="1" />

            {/* Inner Arabic Stone Name */}
            <text x="160" y="145" textAnchor="middle" fill="#f0fdf4" fontSize="22" fontFamily="serif" fontWeight="bold">
              {mineral.stoneAr}
            </text>

            <text x="160" y="275" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontFamily="monospace">
              Deficit: {deficitElement.toUpperCase()} | {combinedText}
            </text>
          </svg>

          <ExportFormatButtons
            svgId="mizan-shabah-svg"
            filename={`mizan_shabah_${userName}_${mineral.stoneAr}`}
            title={language === 'en' ? 'Mizan al-Shabah Mineral Shield' : language === 'ha' ? 'Mizan al-Shabah Dutsen Kariya' : 'Mizan al-Shabah Bouclier Minéral'}
            subtitle={`Pierre: ${mineral.stoneFr} • Élément Déficitaire: ${deficitElement.toUpperCase()}`}
            language={language}
          />
        </div>

        {/* Elemental Analysis & Recommended Stone Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Elemental Bars */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-widest text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <BarChart2 size={16} />
              <span>{language === 'en' ? 'Elemental Profile Analysis:' : language === 'ha' ? 'Siffar Sinadirai 4:' : 'Profil Élémentaire :'}</span>
            </h3>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between font-bold text-red-700 dark:text-red-400 mb-0.5">
                  <span>{language === 'en' ? 'Fire (Nar):' : language === 'ha' ? 'Wuta (Nar):' : 'Feu (Nar) :'}</span>
                  <span>{elementalBreakdown.fire}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${elementalBreakdown.fire}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                  <span>{language === 'en' ? 'Air (Hawa):' : language === 'ha' ? 'Iska (Hawa):' : 'Air (Hawa) :'}</span>
                  <span>{elementalBreakdown.air}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${elementalBreakdown.air}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-cyan-700 dark:text-cyan-400 mb-0.5">
                  <span>{language === 'en' ? 'Water (Ma):' : language === 'ha' ? 'Ruwa (Ma):' : 'Eau (Ma) :'}</span>
                  <span>{elementalBreakdown.water}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${elementalBreakdown.water}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                  <span>{language === 'en' ? 'Earth (Turab):' : language === 'ha' ? 'Kasa (Turab):' : 'Terre (Turab) :'}</span>
                  <span>{elementalBreakdown.earth}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${elementalBreakdown.earth}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Stone Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-emerald-500 space-y-2 text-xs">
            <div className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">
              {language === 'en' ? 'Recommended Protective Mineral:' : language === 'ha' ? 'Dutsen Kariya da Aka Shawarta:' : 'Pierre de Protection Recommandée :'}
            </div>
            <div className="text-base font-bold text-gray-900 dark:text-white flex items-center justify-between">
              <span>{language === 'en' ? mineral.stoneEn : language === 'ha' ? mineral.stoneHa : mineral.stoneFr}</span>
              <span className="font-serif text-lg text-emerald-600 dark:text-emerald-400">{mineral.stoneAr}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-1 border-t border-gray-100 dark:border-gray-700">
              {language === 'en' ? mineral.propertiesEn : language === 'ha' ? mineral.propertiesHa : mineral.propertiesFr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
