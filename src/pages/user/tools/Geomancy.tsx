import React, { useState } from 'react';
import { Compass, ArrowLeft, RefreshCw, Layers, Sparkles, BookOpen, Info, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

// Geomantic Figures data with translations
const FIGURES_DATA: Record<string, Record<string, { name: string; latin: string; nature: string; meaning: string; arabic: string }>> = {
  "1-1-1-1": {
    fr: { name: "La Voie", latin: "Via", nature: "Neutre", meaning: "Indique le changement, le mouvement, le voyage et les transitions. Force neutre dépendant du contexte.", arabic: "الطريق" },
    en: { name: "The Way", latin: "Via", nature: "Neutral", meaning: "Indicates change, movement, travel, and transitions. A neutral force depending on the context.", arabic: "الطريق" },
    ha: { name: "Hanya", latin: "Via", nature: "Tsaka-tsaki", meaning: "Yana nuna canji, tafiya, da sauye-sauye. Karfi ne na tsaka-tsaki dangane da yanayi.", arabic: "الطريق" }
  },
  "2-2-2-2": {
    fr: { name: "Le Peuple", latin: "Populus", nature: "Neutre", meaning: "Représente les foules, l'opinion publique et la stabilité passive. Multiplie l'influence des autres.", arabic: "الجماعة" },
    en: { name: "The People", latin: "Populus", nature: "Neutral", meaning: "Represents crowds, public opinion, and passive stability. Multiplies the influence of others.", arabic: "الجماعة" },
    ha: { name: "Jama'a", latin: "Populus", nature: "Tsaka-tsaki", meaning: "Yana wakiltar taron mutane, ra'ayin jama'a da dorewa. Yana ninka tasirin sauran rabe-rabe.", arabic: "الجماعة" }
  },
  "1-2-1-2": {
    fr: { name: "La Conjonction", latin: "Conjunctio", nature: "Bénéfique", meaning: "Symbole d'union, de contrats, de mariage et d'accords. Très faste pour les partenariats.", arabic: "الاجتماع" },
    en: { name: "Conjunction", latin: "Conjunctio", nature: "Beneficent", meaning: "Symbol of union, contracts, marriage, and agreements. Highly auspicious for partnerships.", arabic: "الاجتماع" },
    ha: { name: "Hadaka", latin: "Conjunctio", nature: "Mai albarka", meaning: "Alamar hadaka, yarjejeniya, aure, da daidaito. Yana da kyau sosai ga abokan tarayya.", arabic: "الاجتماع" }
  },
  "2-1-2-1": {
    fr: { name: "La Prison", latin: "Carcer", nature: "Maléfique", meaning: "Représente l'isolement, les retards, les restrictions et les secrets. Bon pour préserver.", arabic: "القبض الداخل" },
    en: { name: "The Prison", latin: "Carcer", nature: "Malefic", meaning: "Represents isolation, delays, restrictions, and secrets. Good for preserving or keeping.", arabic: "القبض الداخل" },
    ha: { name: "Gidan Yari", latin: "Carcer", nature: "Mara kyau", meaning: "Yana nuna kadaita, jinkiri, hani da asiri. Yana da kyau kawai don kiyayewa ko boyewa.", arabic: "القبض الداخل" }
  },
  "1-1-2-2": {
    fr: { name: "La Grande Fortune", latin: "Fortuna Major", nature: "Très Bénéfique", meaning: "Succès éclatant, protection divine puissante, victoire stable et durable.", arabic: "النصرة الخارجة" },
    en: { name: "Major Fortune", latin: "Fortuna Major", nature: "Highly Beneficent", meaning: "Brilliant success, powerful divine protection, stable and lasting victory.", arabic: "النصرة الخارجة" },
    ha: { name: "Babban Arziki", latin: "Fortuna Major", nature: "Mai yawan gaske", meaning: "Babban nasara, kariya ta Allah mai karfi, nasara mai dorewa.", arabic: "النصرة الخارجة" }
  },
  "2-2-1-1": {
    fr: { name: "La Petite Fortune", latin: "Fortuna Minor", nature: "Bénéfique", meaning: "Succès rapide mais temporaire ou superficiel. Chance immédiate à saisir.", arabic: "النصرة الداخلة" },
    en: { name: "Minor Fortune", latin: "Fortuna Minor", nature: "Beneficent", meaning: "Quick but temporary or superficial success. Immediate chance to be seized.", arabic: "النصرة الداخلة" },
    ha: { name: "Kankanin Arziki", latin: "Fortuna Minor", nature: "Mai albarka", meaning: "Nasara mai sauri amma ta dan lokaci. Sa'a ce ta gaggawa da ya kamata a yi amfani da ita.", arabic: "النصرة الداخلة" }
  },
  "1-2-2-1": {
    fr: { name: "Le Gain", latin: "Acquisitio", nature: "Bénéfique", meaning: "Gain financier, prospérité, absorption positive, expansion et réussite matérielle.", arabic: "القبض الخارج" },
    en: { name: "Gain", latin: "Acquisitio", nature: "Beneficent", meaning: "Financial gain, prosperity, positive absorption, expansion, and material success.", arabic: "القبض الخارج" },
    ha: { name: "Samun Kudi", latin: "Acquisitio", nature: "Mai albarka", meaning: "Samun kudi, ci gaba, fadada arziki da nasarar abun duniya.", arabic: "القبض الخارج" }
  },
  "2-1-1-2": {
    fr: { name: "La Perte", latin: "Amissio", nature: "Maléfique", meaning: "Perte financière, désengagement, fuite d'énergie ou abandon. Utile pour bannir.", arabic: "القبض الداخل" },
    en: { name: "Loss", latin: "Amissio", nature: "Malefic", meaning: "Financial loss, disengagement, energy leak, or surrender. Useful for banishing.", arabic: "القبض الداخل" },
    ha: { name: "Rashi", latin: "Amissio", nature: "Mara kyau", meaning: "Asarar kudi, guduwar karfi, ko saduda. Yana da amfani kawai don korar abubuwan da ba a so.", arabic: "القبض الداخل" }
  },
  "1-1-1-2": {
    fr: { name: "Le Blanc", latin: "Albus", nature: "Bénéfique", meaning: "Sagesse, pureté, paix, clarté d'esprit et honnêteté. Favorable au dialogue.", arabic: "البياض" },
    en: { name: "The White", latin: "Albus", nature: "Beneficent", meaning: "Wisdom, purity, peace, clarity of mind, and honesty. Favorable for dialogue.", arabic: "البياض" },
    ha: { name: "Fari", latin: "Albus", nature: "Mai albarka", meaning: "Hikima, tsarki, zaman lafiya, tsarkin zuciya da gaskiya. Yana da kyau ga tattaunawa.", arabic: "البياض" }
  },
  "2-1-1-1": {
    fr: { name: "Le Rouge", latin: "Rubeus", nature: "Maléfique", meaning: "Colère, passion destructrice, violence, impulsion incontrôlée. Danger et hostilité.", arabic: "الحمرة" },
    en: { name: "The Red", latin: "Rubeus", nature: "Malefic", meaning: "Anger, destructive passion, violence, uncontrolled impulse. Danger and hostility.", arabic: "الحمرة" },
    ha: { name: "Ja", latin: "Rubeus", nature: "Mara kyau", meaning: "Fushi, hauka, tashin hankali, da saurin fushi. Akwai hadari da gaba.", arabic: "الحمرة" }
  },
  "1-2-1-1": {
    fr: { name: "La Jeune Fille", latin: "Puella", nature: "Bénéfique", meaning: "Harmonie, plaisir, amitié, esthétique et douceur. Influence féminine agréable.", arabic: "العتبة الخارجة" },
    en: { name: "The Girl", latin: "Puella", nature: "Beneficent", meaning: "Harmony, pleasure, friendship, aesthetics, and sweetness. Pleasant feminine influence.", arabic: "العتبة الخارجة" },
    ha: { name: "Yarinya", latin: "Puella", nature: "Mai albarka", meaning: "Daidaito, nishadi, abota, kyau da sanyi. Tasiri ne mai dadi na mata.", arabic: "العتبة الخارجة" }
  },
  "1-1-2-1": {
    fr: { name: "Le Garçon", latin: "Puer", nature: "Mixte", meaning: "Énergie active, combativité, rivalité, audace. Idéal pour la lutte, non pour la paix.", arabic: "العتبة الداخلة" },
    en: { name: "The Boy", latin: "Puer", nature: "Mixed", meaning: "Active energy, combativeness, rivalry, boldness. Ideal for struggle, not for peace.", arabic: "العتبة الداخلة" },
    ha: { name: "Yaro", latin: "Puer", nature: "Gami", meaning: "Karfi mai sauri, yaki, gaba, da jajircewa. Ya dace don fada, ba zaman lafiya ba.", arabic: "العتبة الداخلة" }
  },
  "1-2-2-2": {
    fr: { name: "La Tête du Dragon", latin: "Caput Draconis", nature: "Bénéfique", meaning: "Nouveau départ, entrée de chance, opportunité d'élévation spirituelle ou matérielle.", arabic: "النقي الخد" },
    en: { name: "The Dragon's Head", latin: "Caput Draconis", nature: "Beneficent", meaning: "New start, entry of luck, opportunity for spiritual or material elevation.", arabic: "النقي الخد" },
    ha: { name: "Kan Maciji", latin: "Caput Draconis", nature: "Mai albarka", meaning: "Sabon farawa, shigar sa'a, damar daukaka ta ruhaniya ko ta duniya.", arabic: "النqui الخد" }
  },
  "2-2-2-1": {
    fr: { name: "La Queue du Dragon", latin: "Cauda Draconis", nature: "Maléfique", meaning: "Sortie difficile, fin de cycle douloureuse, illusions ou trahison. À abandonner.", arabic: "الانكيس" },
    en: { name: "The Dragon's Tail", latin: "Cauda Draconis", nature: "Malefic", meaning: "Difficult exit, painful end of cycle, illusions, or betrayal. Time to let go.", arabic: "الانكيس" },
    ha: { name: "Wutsiyar Maciji", latin: "Cauda Draconis", nature: "Mara kyau", meaning: "Fita mai wuya, karshen lamari mai zafi, yaudara ko cin amana. Lokaci ne na bari.", arabic: "الانكيس" }
  },
  "2-1-2-2": {
    fr: { name: "La Joie", latin: "Laetitia", nature: "Très Bénéfique", meaning: "Grande joie, bonheur, bonne santé, célébration et élévation spirituelle.", arabic: "الاحيان" },
    en: { name: "Joy", latin: "Laetitia", nature: "Highly Beneficent", meaning: "Great joy, happiness, good health, celebration, and spiritual elevation.", arabic: "الاحيان" },
    ha: { name: "Farinciki", latin: "Laetitia", nature: "Mai yawan gaske", meaning: "Babban farinciki, jin dadi, lafiyar jiki, biki da daukaka ta ruhaniya.", arabic: "الاحيان" }
  },
  "2-2-1-2": {
    fr: { name: "La Tristesse", latin: "Tristitia", nature: "Maléfique", meaning: "Tristesse, chagrin, fardeau matériel, solitude. Lié aux choses souterraines.", arabic: "الفيض الخارج" },
    en: { name: "Sorrow", latin: "Tristitia", nature: "Malefic", meaning: "Sorrow, grief, material burden, solitude. Linked to heavy or underground matters.", arabic: "الفيض الخارج" },
    ha: { name: "Bakinciki", latin: "Tristitia", nature: "Mara kyau", meaning: "Bakinciki, bacin rai, nauyi na duniya, da kadaita. Yana da alaka da abubuwa masu nauyi.", arabic: "الفيض الخارج" }
  }
};

// UI Translations
const GEOMANCY_TRANSLATIONS: Record<string, any> = {
  fr: {
    back: "Retour aux outils",
    title: "Géomancie (Khatt ar-Raml)",
    desc: "Générez et interprétez les figures géomantiques pour consulter le destin.",
    generating: "Consultation du sable...",
    generate: "Générer le thème",
    synthesis: "🔮 Synthèse de la Consultation",
    judge: "Le Juge (Maison 15)",
    supreme: "Le Suprême (Maison 16)",
    judgeDesc: "Le Juge représente la réponse finale à votre question.",
    supremeDesc: "Le Suprême montre l'issue à long terme de cette situation.",
    details: "Analyse Détaillée des 16 Maisons",
    clickHouse: "Cliquez sur une maison pour voir son interprétation",
    natureLabel: "Nature",
    meaningLabel: "Signification",
    symbolLabel: "Aperçu de la Figure",
    houseLabel: "Maison",
    houseNames: [
      "La Vie (Maison 1 : Le Consultant, vitalité)",
      "L'Argent (Maison 2 : Finances, acquisitions)",
      "Les Frères (Maison 3 : Entourage proche, communication)",
      "Le Foyer (Maison 4 : Patrimoine, foyer, fin)",
      "Les Enfants (Maison 5 : Amours, plaisirs, création)",
      "La Maladie (Maison 6 : Santé, travail, servitudes)",
      "Le Mariage (Maison 7 : Unions, contrats, conjoints)",
      "La Mort (Maison 8 : Crises, transformations, héritages)",
      "Les Voyages (Maison 9 : Spiritualité, philosophie, lointain)",
      "Le Pouvoir (Maison 10 : Réussite, carrière, honneur)",
      "L'Espoir (Maison 11 : Amis, projets, soutiens)",
      "Les Épreuves (Maison 12 : Obstacles secrets, solitude)",
      "Témoin Droit (Maison 13 : Le Passé, la situation actuelle)",
      "Témoin Gauche (Maison 14 : Le Futur proche, opportunités)",
      "Le Juge (Maison 15 : Le Verdict de la question)",
      "Le Suprême (Maison 16 : L'Issue finale à long terme)"
    ]
  },
  en: {
    back: "Back to tools",
    title: "Geomancy (Khatt ar-Raml)",
    desc: "Generate and interpret geomantic figures to consult destiny.",
    generating: "Consulting the sand...",
    generate: "Generate theme",
    synthesis: "🔮 Consultation Synthesis",
    judge: "The Judge (House 15)",
    supreme: "The Supreme (House 16)",
    judgeDesc: "The Judge represents the final answer to your question.",
    supremeDesc: "The Supreme shows the long-term outcome of this situation.",
    details: "Detailed Analysis of the 16 Houses",
    clickHouse: "Click on a house to see its interpretation",
    natureLabel: "Nature",
    meaningLabel: "Meaning",
    symbolLabel: "Figure Details",
    houseLabel: "House",
    houseNames: [
      "Life (House 1: The Consultant, vitality)",
      "Money (House 2: Finances, acquisitions)",
      "Siblings (House 3: Close entourage, short trips)",
      "Home (House 4: Heritage, household, end of things)",
      "Children (House 5: Love, pleasures, creation)",
      "Sickness (House 6: Health, work, daily life)",
      "Marriage (House 7: Unions, contracts, partners)",
      "Death (House 8: Crises, transformations, heritage)",
      "Journeys (House 9: Spirituality, higher study, distance)",
      "Power (House 10: Success, career, honor)",
      "Hope (House 11: Friends, projects, support)",
      "Trials (House 12: Secret obstacles, solitude)",
      "Right Witness (House 13: The Past, current situation)",
      "Left Witness (House 14: Near Future, opportunities)",
      "The Judge (House 15: The Verdict of the question)",
      "The Supreme (House 16: The Long-term final outcome)"
    ]
  },
  ha: {
    back: "Koma ga kayan aiki",
    title: "Kaddara ta Kasa (Khatt ar-Raml)",
    desc: "Samar da kuma fassara alamomin kasa don duba kaddara.",
    generating: "Duban kasa ana nan ana yi...",
    generate: "Hada rabe-raben kasa",
    synthesis: "🔮 Hadakar Duban Kasa",
    judge: "Alkali (Gida na 15)",
    supreme: "Mafi daukaka (Gida na 16)",
    judgeDesc: "Alkali yana nuna amsar karshe ga tambayarka.",
    supremeDesc: "Mafi daukaka yana nuna yadda karshen lamarin zai kasance a nan gaba.",
    details: "Fassarar Gidaje 16 Daki-daki",
    clickHouse: "Danna kan gida don ganin fassararsa",
    natureLabel: "Dabi'a",
    meaningLabel: "Fassara",
    symbolLabel: "Bayanan Alama",
    houseLabel: "Gida",
    houseNames: [
      "Rayuwa (Gida na 1: Mai duba, jiki da lafiya)",
      "Kudi (Gida na 2: Arziki, kudi da sayayya)",
      "Yan uwa (Gida na 3: Yan uwa na kusa, tafiya)",
      "Gida (Gida na 4: Dukiya, gida da karshen lamari)",
      "Yara (Gida na 5: Soyayya, nishadi da haihuwa)",
      "Rashin lafiya (Gida na 6: Lafiya da aiki)",
      "Aure (Gida na 7: Aure, yarjejeniya da abokan tarayya)",
      "Mutuwa (Gida na 8: Wahala, sauye-sauye, gado)",
      "Tafiya (Gida na 9: Ibada, ilimi, tafiya mai nisa)",
      "Mulki (Gida na 10: Nasara, aiki, daukaka)",
      "Fata (Gida na 11: Abokan arziki, tsare-tsare)",
      "Jarrabawa (Gida na 12: Abokan gaba na boye, kadaita)",
      "Shaidar Dama (Gida na 13: Abubuwan da suka gabata)",
      "Shaidar Hagu (Gida na 14: Abubuwan ke tafe nan kusa)",
      "Alkali (Gida na 15: Hukuncin karshe)",
      "Mafi daukaka (Gida na 16: Karshen lamari na dogon lokaci)"
    ]
  }
};

export const Geomancy: React.FC = () => {
  const { language } = useLanguage();
  const currentLang = (language === 'ha' || language === 'en' || language === 'fr') ? language : 'fr';
  const localT = GEOMANCY_TRANSLATIONS[currentLang] || GEOMANCY_TRANSLATIONS['fr'];

  const [figures, setFigures] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const generateFigures = () => {
    setIsGenerating(true);
    setSelectedHouse(null);
    setTimeout(() => {
      // Generate 4 random mothers (4 arrays of 4 bits)
      const m1 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m2 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m3 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      const m4 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);

      // Daughters
      const d1 = [m1[0], m2[0], m3[0], m4[0]];
      const d2 = [m1[1], m2[1], m3[1], m4[1]];
      const d3 = [m1[2], m2[2], m3[2], m4[2]];
      const d4 = [m1[3], m2[3], m3[3], m4[3]];

      // Nieces
      const combine = (a: number[], b: number[]) => a.map((val, i) => (val + b[i]) % 2 === 0 ? 2 : 1);
      const n1 = combine(m1, m2);
      const n2 = combine(m3, m4);
      const n3 = combine(d1, d2);
      const n4 = combine(d3, d4);

      // Witnesses
      const w1 = combine(n1, n2);
      const w2 = combine(n3, n4);

      // Judge
      const j = combine(w1, w2);

      // Reconciler / Supreme
      const r = combine(j, m1);

      setFigures([m1, m2, m3, m4, d1, d2, d3, d4, n1, n2, n3, n4, w1, w2, j, r]);
      setIsGenerating(false);
    }, 1200);
  };

  const getFigureInfo = (fig: number[]) => {
    const key = fig.join('-');
    return FIGURES_DATA[key]?.[currentLang] || FIGURES_DATA[key]?.['fr'] || { name: 'Unknown', latin: '', nature: '', meaning: '', arabic: '' };
  };

  const renderDots = (arr: number[]) => (
    <div className="flex flex-col gap-1 items-center justify-center">
      {arr.map((val, i) => (
        <div key={i} className="flex gap-1.5">
          {val === 2 ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm"></div>
            </>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium mb-4 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          {localT.back}
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Layers className="text-amber-500" size={32} />
          {localT.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base break-words">{localT.desc}</p>
      </div>

      <div className="flex justify-center mb-8 sm:mb-12">
        <button 
          onClick={generateFigures}
          disabled={isGenerating}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-2xl shadow-sm flex items-center gap-2.5 transition-all"
        >
          <RefreshCw size={20} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? localT.generating : localT.generate}
        </button>
      </div>

      <AnimatePresence>
        {figures.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Grid of Houses */}
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-3 text-center flex items-center justify-center gap-1.5">
                <Info size={14} />
                {localT.clickHouse}
              </p>
              <div 
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4" 
                dir="rtl"
              >
                {figures.slice(0, 16).map((fig, i) => {
                  const figInfo = getFigureInfo(fig);
                  const isSelected = selectedHouse === i;
                  return (
                    <button 
                      key={i} 
                      onClick={() => {
                        setSelectedHouse(i);
                        const element = document.getElementById(`house-details-${i}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`flex flex-col items-center p-3.5 bg-amber-50/50 dark:bg-amber-950/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 border transition-all rounded-xl text-right cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-100/70 dark:bg-amber-900/30' 
                          : 'border-amber-200/60 dark:border-amber-800/20'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-bold mb-2 h-7 overflow-hidden text-center leading-tight flex items-center justify-center">
                        {localT.houseNames[i].split(' (')[0]}
                      </span>
                      <div className="my-2 h-16 flex items-center justify-center" dir="ltr">
                        {renderDots(fig)}
                      </div>
                      <span className="text-[10px] text-amber-700/60 dark:text-amber-400/50 font-arabic mt-1 font-medium">{figInfo.name}</span>
                      <span className="text-[9px] text-gray-400 mt-1">H{i+1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synthesis Cards for Judge and Supreme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 p-5 sm:p-7 rounded-2xl border border-amber-200/50 dark:border-amber-800/10">
              <div className="col-span-1 md:col-span-2 mb-2">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={20} />
                  {localT.synthesis}
                </h3>
              </div>

              {/* Judge card */}
              <div className="bg-white dark:bg-gray-800/60 p-5 rounded-xl shadow-sm border border-amber-200/30 dark:border-amber-800/20 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full uppercase">
                      {localT.judge}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      {getFigureInfo(figures[14]).name} ({getFigureInfo(figures[14]).latin})
                    </h4>
                    <p className="text-xl font-arabic text-amber-600 mt-1" dir="rtl">{getFigureInfo(figures[14]).arabic}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-gray-900/50 rounded-lg" dir="ltr">
                    {renderDots(figures[14])}
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 italic">{localT.judgeDesc}</p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                  <p><strong>{localT.natureLabel}:</strong> <span className="font-semibold text-amber-700 dark:text-amber-300">{getFigureInfo(figures[14]).nature}</span></p>
                  <p><strong>{localT.meaningLabel}:</strong> {getFigureInfo(figures[14]).meaning}</p>
                </div>
              </div>

              {/* Supreme card */}
              <div className="bg-white dark:bg-gray-800/60 p-5 rounded-xl shadow-sm border border-amber-200/30 dark:border-amber-800/20 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-full uppercase">
                      {localT.supreme}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                      {getFigureInfo(figures[15]).name} ({getFigureInfo(figures[15]).latin})
                    </h4>
                    <p className="text-xl font-arabic text-orange-600 mt-1" dir="rtl">{getFigureInfo(figures[15]).arabic}</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-gray-900/50 rounded-lg" dir="ltr">
                    {renderDots(figures[15])}
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 italic">{localT.supremeDesc}</p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                  <p><strong>{localT.natureLabel}:</strong> <span className="font-semibold text-orange-700 dark:text-orange-300">{getFigureInfo(figures[15]).nature}</span></p>
                  <p><strong>{localT.meaningLabel}:</strong> {getFigureInfo(figures[15]).meaning}</p>
                </div>
              </div>
            </div>

            {/* Detailed Analysis of all 16 Houses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="text-amber-500" size={20} />
                {localT.details}
              </h3>
              
              <div className="space-y-4">
                {figures.map((fig, idx) => {
                  const figInfo = getFigureInfo(fig);
                  const isHighlighted = selectedHouse === idx;
                  return (
                    <div 
                      key={idx}
                      id={`house-details-${idx}`}
                      className={`p-4 rounded-xl border transition-all ${
                        isHighlighted 
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400/80 ring-1 ring-amber-400' 
                          : 'bg-gray-50/50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shrink-0 shadow-sm" dir="ltr">
                            {renderDots(fig)}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                              {localT.houseLabel} {idx + 1}
                            </span>
                            <h4 className="text-base font-bold text-gray-950 dark:text-white mt-0.5">
                              {localT.houseNames[idx]}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {figInfo.name} ({figInfo.latin})
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                              <span className="text-xs font-arabic text-gray-500 dark:text-gray-400" dir="rtl">
                                {figInfo.arabic}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:self-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                            figInfo.nature.includes('Bénéfique') || figInfo.nature.includes('Beneficent') || figInfo.nature.includes('albarka') || figInfo.nature.includes('gaske')
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                              : figInfo.nature.includes('Maléfique') || figInfo.nature.includes('Malefic') || figInfo.nature.includes('muni') || figInfo.nature.includes('kyau')
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                          }`}>
                            {figInfo.nature}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {figInfo.meaning}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
