import React, { useState, useMemo } from 'react';
import { HelpCircle, Sparkles, RotateCw, BookOpen, Compass, Shield } from 'lucide-react';
import { calculateAbjadValue } from '../../utils/abjad';
import { ExportFormatButtons } from '../common/ExportFormatButtons';

interface QurahAnbiyaTabProps {
  language: string;
}

const PROPHETIC_STATIONS = [
  { id: 1, prophetFr: "Maqam Adam (L'Éveil & Repentir)", prophetEn: "Maqam Adam (Awakening & Repentance)", prophetHa: "Maqam Nabi Adam (Tawba da Haske)", omenFr: "Favorable. Succès après épreuve. Garder la pureté d'intention.", omenEn: "Favorable. Success after trial. Maintain purity of intent.", omenHa: "Rassammce. Nasara bayan wahala. Tsabtace niyya." },
  { id: 2, prophetFr: "Maqam Idris (Ilim & Élevation)", prophetEn: "Maqam Idris (Knowledge & Elevation)", prophetHa: "Maqam Nabi Idris (Ilimi da Daukaka)", omenFr: "Très Favorable. Élévation spirituelle et maîtrise de la sagesse.", omenEn: "Very Favorable. Spiritual elevation and mastery of wisdom.", omenHa: "Yayi kyau sosai. Daukakar ilimi da basira." },
  { id: 3, prophetFr: "Maqam Nuh (L'Arche & Sauvegarde)", prophetEn: "Maqam Noah (The Ark & Protection)", prophetHa: "Maqam Nabi Nuhu (Jirgi da Kariya)", omenFr: "Protection Divine. Traversez la tempête avec patience.", omenEn: "Divine Protection. Cross the storm with patience.", omenHa: "Kariya daga Allah. Yi hakuri a cikin tsanani." },
  { id: 4, prophetFr: "Maqam Ibrahim (L'Amitié Divine & Épreuve)", prophetEn: "Maqam Abraham (Divine Friendship)", prophetHa: "Maqam Nabi Ibrahim (Khaliylullah)", omenFr: "Protection contre le feu des épreuves. Triomphe assuré.", omenEn: "Protection against trial fires. Assured triumph.", omenHa: "Nasara a kan makiya. Kariya daga wuta." },
  { id: 5, prophetFr: "Maqam Yusuf (La Royauté après la Prison)", prophetEn: "Maqam Joseph (Sovereignty after Confinement)", prophetHa: "Maqam Nabi Yusuf (Sarauta bayan Wahala)", omenFr: "Grande Victoire & Honneur. La patience porte ses fruits d'or.", omenEn: "Great Victory & Honor. Patience yields golden fruit.", omenHa: "Nasara mai girma da girma bayan hakuri." },
  { id: 6, prophetFr: "Maqam Musa (Le Bâton & La Parole)", prophetEn: "Maqam Moses (The Staff & Discourse)", prophetHa: "Maqam Nabi Musa (Sanda da Magana)", omenFr: "Clarté et Puissance. Les obstacles illusionnistes seront brisés.", omenEn: "Clarity and Power. Illusionary obstacles shall be broken.", omenHa: "Karfi da Bayani. Dukkan cikas zai wargaje." },
  { id: 7, prophetFr: "Maqam Dawud (La Sagesse & Le Fer Doux)", prophetEn: "Maqam David (Wisdom & Malleable Iron)", prophetHa: "Maqam Nabi Dawud (Muryar Dadi da Karfe)", omenFr: "Victoire matérielle et spirituelle. Les cœurs durs s'adoucissent.", omenEn: "Material and spiritual victory. Hard hearts soften.", omenHa: "Nasara ta dukiya da ruhi. Zukata za su narke." },
  { id: 8, prophetFr: "Maqam Sulayman (Le Royaume & La Souveraineté)", prophetEn: "Maqam Solomon (Kingdom & Dominion)", prophetHa: "Maqam Nabi Sulaiman (Sarauta da Mulki)", omenFr: "Abondance extrême & Autorité. Vos souhaits sont exaucés.", omenEn: "Extreme Abundance & Authority. Your wishes are granted.", omenHa: "Bisa arziki da mulki. Niyyar ka zata cika." },
  { id: 9, prophetFr: "Maqam Ayyub (La Patience & Guerison)", prophetEn: "Maqam Job (Patience & Healing)", prophetHa: "Maqam Nabi Ayyuba (Hakuri da Warkewa)", omenFr: "Guérison prochaine. La délivrance arrive au moment parfait.", omenEn: "Upcoming Healing. Deliverance arrives at the perfect time.", omenHa: "Lafiya da warkewa. Samuwar sauki na kusa." },
  { id: 10, prophetFr: "Maqam Yunus (Le Poisson & La Lumière)", prophetEn: "Maqam Jonah (The Whale & Light)", prophetHa: "Maqam Nabi Yunus (Kifi da Haske)", omenFr: "Répétez le Tasbih. La lumière jaillira des ténèbres.", omenEn: "Repeat Tasbih. Light shall burst forth from darkness.", omenHa: "Raita tasbihi. Haske zai fito daga duhu." },
  { id: 11, prophetFr: "Maqam 'Isa (Le Souffle & La Résurrection)", prophetEn: "Maqam Jesus (The Breath & Revival)", prophetHa: "Maqam Nabi Isa (Ami da Rayawa)", omenFr: "Renouveau complet. Guérison des affaires bloquées.", omenEn: "Complete Renewal. Healing of blocked affairs.", omenHa: "Sabuntawa. Buɗewar al'amura masu nauyi." },
  { id: 12, prophetFr: "Maqam Muhammad (La Sceau & La Victoire Éclatante)", prophetEn: "Maqam Muhammad (The Seal & Manifest Victory)", prophetHa: "Maqam Annabi Muhammad (Cikamakon Annabawa)", omenFr: "Bénédiction Totale & Lumière Suprême. Accomplissement parfait.", omenEn: "Total Blessing & Supreme Light. Perfect accomplishment.", omenHa: "Albarka mai girma da cikar buri dari bisa dari." }
];

export default function QurahAnbiyaTab({ language }: QurahAnbiyaTabProps) {
  const [querentName, setQuerentName] = useState<string>('محمد');
  const [questionText, setQuestionText] = useState<string>('هل يتحقق المطلب');

  const result = useMemo(() => {
    const valName = calculateAbjadValue(querentName) || 92;
    const valQuest = calculateAbjadValue(questionText) || 100;
    const totalAbjad = valName + valQuest;

    // Reduce mod 120 (1 to 120)
    let section120 = totalAbjad % 120;
    if (section120 === 0) section120 = 120;

    // Map section 1-120 to Prophet station (1-12)
    const stationIndex = Math.floor((section120 - 1) / 10);
    const station = PROPHETIC_STATIONS[stationIndex] || PROPHETIC_STATIONS[0];

    return {
      totalAbjad,
      section120,
      station,
      angleDeg: ((section120 - 1) * 360) / 120
    };
  }, [querentName, questionText]);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('qurah-anbiya-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qurah_anbiya_${result.section120}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl text-emerald-600 dark:text-emerald-400">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'en'
              ? 'Qur\'ah al-Anbiya al-Kubra (120-Section Prophetic Oracle Dial)'
              : language === 'ha'
              ? 'Qur\'ah al-Anbiya al-Kubra (Awon Qura na Annabawa Bawa 120)'
              : 'Qur\'ah al-Anbiya al-Kubra (Grand Cadran de Consultation à 120 Sections)'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'en'
              ? 'Traditional 120-sector divinatory dial based on Abjad numerical reduction for prophetic guidance and spiritual answers.'
              : language === 'ha'
              ? 'Awon qura na gargajiya mai gida 120 na lissafin Abjad domin neman sharia da hasken gaskiya.'
              : 'Cadran divinatoire traditionnel à 120 secteurs basé sur la réduction numérique Abjad pour l\'orientation spirituelle.'}
          </p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Querent Name (Arabic):' : language === 'ha' ? 'Sunan Mai Tambaya (Larabci):' : 'Nom du Demandeur (en Arabe) :'}
          </label>
          <input
            type="text"
            value={querentName}
            onChange={(e) => setQuerentName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
            {language === 'en' ? 'Intention / Subject Question (Arabic):' : language === 'ha' ? 'Niyya ko Tambaya (Larabci):' : 'Intention / Sujet de la Question (en Arabe) :'}
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Dial SVG & Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Dial (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 rounded-3xl border border-emerald-500/40 shadow-2xl text-center space-y-4">
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Section #{result.section120} / 120</span>
          </div>

          <svg id="qurah-anbiya-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-2xl">
            <rect width="320" height="320" fill="#022c22" rx="20" />
            {/* Outer Ring */}
            <circle cx="160" cy="160" r="145" fill="none" stroke="#10b981" strokeWidth="4" />
            <circle cx="160" cy="160" r="135" fill="#064e3b" opacity="0.4" />

            {/* Inner Ring */}
            <circle cx="160" cy="160" r="80" fill="#022c22" stroke="#34d399" strokeWidth="2" />

            {/* 120 Sector Marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 360) / 12;
              const rad = (a * Math.PI) / 180;
              const x1 = 160 + 80 * Math.cos(rad);
              const y1 = 160 + 80 * Math.sin(rad);
              const x2 = 160 + 135 * Math.cos(rad);
              const y2 = 160 + 135 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#059669" strokeWidth="1.5" />;
            })}

            {/* Needle pointing to selected angle */}
            {(() => {
              const rad = ((result.angleDeg - 90) * Math.PI) / 180;
              const nx = 160 + 120 * Math.cos(rad);
              const ny = 160 + 120 * Math.sin(rad);
              return (
                <g>
                  <line x1="160" y1="160" x2={nx} y2={ny} stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                  <circle cx={nx} cy={ny} r="6" fill="#fbbf24" />
                  <circle cx="160" cy="160" r="10" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                </g>
              );
            })()}

            <text x="160" y="165" textAnchor="middle" fill="#ecfdf5" fontSize="18" fontFamily="monospace" fontWeight="bold">
              #{result.section120}
            </text>
          </svg>

          <ExportFormatButtons
            svgId="qurah-anbiya-svg"
            filename={`qurah_anbiya_${result.section120}`}
            title={language === 'en' ? 'Qur\'ah al-Anbiya Oracle Dial' : 'Qur\'ah al-Anbiya Cadran Oraculaire'}
            subtitle={`Station Prophetique #${result.section120}`}
            language={language}
          />
        </div>

        {/* Oracle Station Response (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Compass size={18} />
              <span>
                {language === 'en' ? result.station.prophetEn : language === 'ha' ? result.station.prophetHa : result.station.prophetFr}
              </span>
            </h3>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 space-y-2">
              <span className="text-xs text-gray-500 block uppercase tracking-wider font-bold">
                {language === 'en' ? 'Prophetic Omen & Guidance:' : 'Présage & Guidance Prophesique :'}
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                {language === 'en' ? result.station.omenEn : language === 'ha' ? result.station.omenHa : result.station.omenFr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
