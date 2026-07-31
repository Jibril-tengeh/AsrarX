import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Flame, Moon, Sun, Shield, Feather, 
  Droplets, Clock, Heart, Compass, CheckCircle2, ChevronDown, ChevronUp, Scroll
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

const guideTranslations = {
  fr: {
    guideTitle: "Guide d'Utilisation Rituelle & Pratique Sacrée du Khatim",
    guideSubtitle: "Comment tracer, consacrer et utiliser le Sceau/Wafq pour qu'il s'anime de bénédictions et de résonance mystique.",
    step1Title: "1. Purification & Disposition Intérieure (Taharah & Niyyah)",
    step1Desc: "Tout travail avec la science des lettres et des nombres exige une parfaite pureté physique et spirituelle.",
    step1Bullets: [
      "Ablutions (Wudhu) complètes et vêtements propres (blancs de préférence).",
      "S'isoler dans un endroit calme (Khalwa) parfumé, exempt de bruit et de statues/images profanes.",
      "S'orienter rigoureusement face à la Qibla (direction sacrée).",
      "Formuler l'intention (Niyyah) clairement dans son cœur avec sincérité et humilité."
    ],

    step2Title: "2. Choix de l'Heure Planétaire & Encens (Sa'at Al-Falak & Bakhoor)",
    step2Desc: "L'énergie du Khatim s'harmonise avec l'heure planétaire et l'encens correspondant à votre intention :",
    planetaryHours: [
      { day: "Dimanche (Soleil / Shams)", use: "Charisme, élévation, succès, autorité", incense: "Oliban (Luban Dhakar) & Musc" },
      { day: "Lundi (Lune / Qamar)", use: "Protection du foyer, paix intérieure, voyage", incense: "Musc blanc & Ambre" },
      { day: "Mardi (Mars / Mirrikh)", use: "Victoire, force, défense contre le mal", incense: "Sandal rouge & Cendre d'Oliban" },
      { day: "Mercredi (Mercure / Utarid)", use: "Commerce, intelligence, études, écriture", incense: "Benjoin (Jawi) & Mastic" },
      { day: "Jeudi (Jupiter / Mushtari)", use: "Abondance (Rizq), prospérité financière, chance", incense: "Oud royal, Musc & Oliban" },
      { day: "Vendredi (Vénus / Zohra)", use: "Amour, réconciliation, harmonie, mariage", incense: "Fleurs de Rose, Oud & Musc" },
      { day: "Samedi (Saturne / Zuhal)", use: "Ancrage, protection lourde, désenvoûtement", incense: "Harmal (Péganum) & Oliban" }
    ],

    step3Title: "3. Préparation de l'Encre Sacrée & Support (Midad & Qalam)",
    step3Desc: "Le support et l'encre agissent comme le récepteur physique de la fréquence mystique.",
    step3Bullets: [
      "Encre Traditionnelle (Midad al-Za'faran) : Mélanger de l'Eau de Rose pure avec du Safran irani/marocain et une pincée de poudre de Musc.",
      "Instrument : Utiliser un calame traditionnel en roseau (Qalam al-Qasab) ou un stylo de précision réservé uniquement aux écrits sacrés.",
      "Support : Papier vierge non ligné, parchemin végétal ou feuille blanche immaculée."
    ],

    step4Title: "4. Ordre Mystique de Traçage du Khatim (Tarteeb al-Kitabah)",
    step4Desc: "Le traçage suit une géométrie sacrée précise. Respectez scrupuleusement l'ordre des nombres.",
    step4Bullets: [
      "Écrire la Basmala (بسم الله الرحمن الرحيم) tout en haut de la feuille.",
      "Tracer le carré extérieur et les lignes internes du Wafq.",
      "Remplissage chronologique (Rasm Al-Miftah) : Remplissez les cases du carré TOUJOURS par ordre numérique croissant, de la valeur la plus petite (Al-Miftah - La Clé) jusqu'à la plus grande.",
      "Ne sautez aucune case et ne remplissez jamais au hasard. Chaque nombre posé est une brique de l'édifice.",
      "Inscrire les 4 Archanges aux 4 coins si indiqué (Jibrail, Mikail, Israfil, Azrail)."
    ],

    step5Title: "5. Consécration & Récitation du Zikr (Al-Aziymah & Ad-Da'wah)",
    step5Desc: "Animer le Khatim par le souffle de la récitation et la fumée sacrée.",
    step5Bullets: [
      "Allumer l'encens correspondant au moment de la rédaction.",
      "Tenir le Khatim au-dessus de la fumée d'encens douce sans le brûler.",
      "Réciter 11 fois la Salawat sur le Prophète (صلى الله عليه وسلم) pour ouvrir la porte de l'acceptation.",
      "Répéter le Verset ou le Nom Divin correspondant au Poids Total Abjad du Khatim exactement le nombre requis (Adad).",
      "À la fin de chaque centaine ou à la fin du Zikr, souffler doucement 3 fois (An-Nafth) sur le Khatim en visualisant la lumière qui l'imprègne.",
      "Terminer par 11 fois la Salawat et une Doua sincère pour formuler la requête."
    ],

    step6Title: "6. Pliage, Port & Preservation (At-Tashm'i & Al-Haml)",
    step6Desc: "Conserver la charge sacrée du Khatim en toute sécurité.",
    step6Bullets: [
      "Plier le papier en forme rectangulaire ou triangulaire vers l'intérieur (pour garder l'énergie concentrée).",
      "Protéger le plieur dans un étui en cuir propre, du tissu vert/soie ou de la cire naturelle.",
      "Pour la prospérité : Porter sur soi dans la poche droite ou placer dans la caisse/lieu de commerce.",
      "Pour la protection/paix : Porter au niveau de la poitrine (côté cœur) ou suspendre au-dessus de l'entrée de la maison.",
      "Ne jamais introduire le Khatim dans des lieux impurs (toilettes) sans l'avoir retiré ou protégé de manière hermétique."
    ],

    quickSummary: "En résumé : Pureté + Safran & Eau de Rose + Heure propice + Zikr au nombre exact du Khatim = Résonance mystique accomplie."
  },

  en: {
    guideTitle: "Ritual Usage & Sacred Practice Guide for Khatims",
    guideSubtitle: "How to trace, consecrate, and use the Sacred Seal/Wafq to fill it with blessings and mystical resonance.",
    step1Title: "1. Purification & Inner Intent (Taharah & Niyyah)",
    step1Desc: "All work with the science of letters and numbers requires complete physical and spiritual purity.",
    step1Bullets: [
      "Perform full ablutions (Wudhu) and wear clean clothes (preferably white).",
      "Isolate in a quiet, fragrant space (Khalwa) free from noise and profane idols or distraction.",
      "Face directly towards the Qibla (sacred direction).",
      "Formulate your intention (Niyyah) clearly in your heart with sincerity and humility."
    ],

    step2Title: "2. Planetary Hour & Incense Selection (Sa'at Al-Falak & Bakhoor)",
    step2Desc: "The energy of the Khatim aligns with the planetary hour and incense matching your intention:",
    planetaryHours: [
      { day: "Sunday (Sun / Shams)", use: "Charisma, elevation, success, authority", incense: "Frankincense (Luban) & Musk" },
      { day: "Monday (Moon / Qamar)", use: "Home protection, inner peace, travel safety", incense: "White Musk & Amber" },
      { day: "Tuesday (Mars / Mirrikh)", use: "Victory, courage, defense against evil", incense: "Red Sandalwood & Frankincense ash" },
      { day: "Wednesday (Mercury / Utarid)", use: "Commerce, intelligence, writing, studies", incense: "Gum Benzoin (Jawi) & Mastic" },
      { day: "Thursday (Jupiter / Mushtari)", use: "Abundance (Rizq), financial wealth, luck", incense: "Royal Oud, Musk & Frankincense" },
      { day: "Friday (Venus / Zohra)", use: "Love, reconciliation, harmony, marriage", incense: "Rose petals, Oud & Musk" },
      { day: "Saturday (Saturn / Zuhal)", use: "Grounding, heavy protection, unbinding", incense: "Syrian Rue (Harmal) & Frankincense" }
    ],

    step3Title: "3. Sacred Ink & Writing Support (Midad & Qalam)",
    step3Desc: "The support and ink act as the physical receiver for mystical resonance.",
    step3Bullets: [
      "Traditional Ink (Midad al-Za'faran): Mix pure Rose Water with Iranian/Moroccan Saffron and a pinch of Musk powder.",
      "Instrument: Use a traditional reed pen (Qalam al-Qasab) or a clean fine pen dedicated solely to sacred texts.",
      "Support: Unlined virgin paper, vegetable parchment, or pure white sheet."
    ],

    step4Title: "4. Mystical Tracing Order of the Khatim (Tarteeb al-Kitabah)",
    step4Desc: "Tracing follows precise sacred geometry. Respect the numerical order strictly.",
    step4Bullets: [
      "Write the Basmala (بسم الله الرحمن الرحيم) at the top of the page.",
      "Draw the outer square frame and inner grid lines of the Wafq.",
      "Chronological Filling (Rasm Al-Miftah): ALWAYS fill the square cells in ascending numerical order, starting from the smallest value (Al-Miftah - The Key) to the largest.",
      "Do not skip any cell or fill randomly. Every placed number is a cornerstone of the spiritual structure.",
      "Write the names of the 4 Archangels at the 4 corners if specified (Jibrail, Mikail, Israfil, Azrail)."
    ],

    step5Title: "5. Consecration & Zikr Recitation (Al-Aziymah & Ad-Da'wah)",
    step5Desc: "Animate the Khatim through the breath of recitation and sacred smoke.",
    step5Bullets: [
      "Light the corresponding incense during writing and consecration.",
      "Hold the Khatim above the gentle incense smoke without scorching it.",
      "Recite Salawat upon the Prophet (ﷺ) 11 times to open the gate of divine acceptance.",
      "Repeat the Verse or Divine Name matching the Total Abjad Weight of the Khatim for the exact required count (Adad).",
      "At the end of each hundred or at the conclusion of the Zikr, gently blow 3 times (An-Nafth) over the Khatim, visualizing divine light infusing it.",
      "Conclude with 11 Salawat and a sincere Dua for your request."
    ],

    step6Title: "6. Folding, Carrying & Preservation (At-Tashm'i & Al-Haml)",
    step6Desc: "Preserve the sacred charge of the Khatim safely.",
    step6Bullets: [
      "Fold the paper inwards into a rectangle or triangle (to keep the energy concentrated).",
      "Enclose the folded Khatim in a clean leather pouch, green silk, or natural beeswax.",
      "For prosperity: Carry in your right pocket or place in your cash register/store.",
      "For protection/peace: Wear at chest level (heart side) or hang above your home entrance.",
      "Never take the Khatim into impure places (washrooms) unless fully sealed or removed beforehand."
    ],

    quickSummary: "Summary: Purity + Saffron & Rosewater + Fortunate Hour + Zikr matching exact Abjad count = Accomplished Spiritual Resonance."
  },

  ha: {
    guideTitle: "Jagorar Yin Amfani da Khatimi da Aikin Asiri Mai Tsarki",
    guideSubtitle: "Yadda ake rubutawa, tsarkakewa da amfani da Khatimi ko Wafq domin ya cika da albarka da amsa addu'a.",
    step1Title: "1. Tsarki da Kyautata Niyya (Taharah & Niyyah)",
    step1Desc: "Dukkan aikin ilimin haruffa da lambobi yana buƙatar cikakken tsarki na jiki da ruhi.",
    step1Bullets: [
      "Yin alwala ko wanka mai kyau sannan a saka tufafi masu tsarki (fari ya fi kyau).",
      "Kadaita a wuri mai natsuwa da ƙanshi (Khalwa), ba tare da surutu ko hotuna ba.",
      "Fuskantar Alqibla kai tsaye.",
      "Kyautata niyya a zuciya da tsananin kankantar kai a gaban Allah."
    ],

    step2Title: "2. Zaɓar Sa'ar Taurari da Turare (Sa'at Al-Falak & Bakhoor)",
    step2Desc: "Ƙarfin Khatimi yana dacewa da sa'ar tauraro da turaren da ya dace da buƙatarka:",
    planetaryHours: [
      { day: "Lahadi (Rana / Shams)", use: "Ƙarfi, ɗaukaka, nasara, matsayi", incense: "Turaren Luban Dhakar da Musk" },
      { day: "Litinin (Wata / Qamar)", use: "Kariya ta gida, kwanciyar hankali, tafiya", incense: "Faren Musk da Ambra" },
      { day: "Talata (Mars / Mirrikh)", use: "Nasara a kan maƙiya, jarumtaka", incense: "Sandal mai ja da Tokar Luban" },
      { day: "Laraba (Utarid / Mercure)", use: "Kasuwanci, fahimta, ilimi, rubutu", incense: "Turaren Jawi da Mastic" },
      { day: "Alhamis (Mushtari / Jupiter)", use: "Bungasa arziki (Rizq), dukiya, nasara", incense: "Oud na sarakuna da Musk" },
      { day: "Juma'a (Zohra / Vénus)", use: "Soyayya, sasanta mutane, daidaito, aure", incense: "Furen Rose, Oud da Musk" },
      { day: "Asabar (Zuhal / Saturne)", use: "Tabbata, kariya daga maita da sammu", incense: "Turaren Harmal da Luban" }
    ],

    step3Title: "3. Shirya Tawada Mai Tsarki da Takarda (Midad & Qalam)",
    step3Desc: "Tawada da takarda sune ma'aji na sirri da ke karɓar amsa da hasken Wafq.",
    step3Bullets: [
      "Tawadar Asiri (Midad al-Za me falan): Haɗa ruwan Rose mai kyau da Za'afaran da kaɗan daga garin Musk.",
      "Alƙalami: Amfani da alƙalamin kara na gargajiya (Qalam al-Qasab) ko alƙalami na musamman da aka ware don rubutu mai tsarki.",
      "Takarda: Takarda farat ba tare da layuka ba ko takardar za'afaran."
    ],

    step4Title: "4. Tsarin Cika Gidajen Khatimi (Tarteeb al-Kitabah)",
    step4Desc: "Rubutun Wafq yana bin tsarin lissafi na gaskiya. Bi addadin gidaje a hankali.",
    step4Bullets: [
      "Rubuta Basmala (بسم الله الرحمن الرحيم) a saman takardar.",
      "Zāna layukan waje da na ciki na Khatimi.",
      "Cika gidaje dalla-dalla (Rasm Al-Miftah): Koda yaushe a fara cika gidan da yake da lamba mafi ƙanta (Al-Miftah - Makulli) zuwa babba.",
      "Kada ka tsallake gida ko cikawarsa ta hantsai. Kowace lamba ginshiƙi ce na sirrin Wafq.",
      "Rubuta sunayen Mala'iku 4 a kusurwoyi guda huɗu idan an buƙata (Jibrail, Mikail, Israfil, Azrail)."
    ],

    step5Title: "5. Karatun Zikiri da Tofe (Al-Aziymah & Ad-Da'wah)",
    step5Desc: "Cillar da Khatimi da karfin karatun zikiri da turaren wuta.",
    step5Bullets: [
      "Cinna turaren wuta na lokacin gudanar da rubutu.",
      "Rƙe Khatimi a saman hayakin turare a hankali ba tare da ya ƙone ba.",
      "Karanta Salatin Annabi (صلى الله عليه وسلم) sau 11 domin buɗe ƙofar amsa.",
      "Maimaita Sunan Allah ko Aya mai dacewa da adadin Jimillar Abjad na Khatimi daidai addadinsa.",
      "A ƙarshen kowane ɗari ko ƙarshen zikiri, hura iska a hankali sau 3 (An-Nafth) a kan Khatimi tare da tunanin haske na shiga cikinsa.",
      "Kammala da Salatin Annabi sau 11 da addu'a ta gaskiya ga buƙatarka."
    ],

    step6Title: "6. Naɗewa, Ɗauka da Tsara (At-Tashm'i & Al-Haml)",
    step6Desc: "Ajiye karfin asirin Khatimi a sahalce.",
    step6Bullets: [
      "Naɗe takardar zuwa ciki don riƙe ƙarfin asirin a kulle.",
      "Saka naɗaɗɗen Khatimi a cikin fatar dabbar da aka goge, siliki kore ko kire na ƙarshe.",
      "Don samun arziki: Sanya a aljihu na dama ko ajiye a wurin ajiyar kuɗi na shago.",
      "Don kariya/kwanciyar hankali: Sanya a saman ƙirji (wurin zuciya) ko rataya a saman ƙofar gida.",
      "Kada a shiga wurare marasa tsarki (wurin wanka/bayan gida) da Khatimi ba tare da an cire shi ko an rufe shi sosai ba."
    ],
    quickSummary: "Taikaitawa: Tsarki + Za'afaran & Ruwan Rose + Sa'a mai kyau + Zikiri daidai addadin Khatimi = Cikakken amsa addu'a da albarka."
  }
};

interface KhatimUsageGuideProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const KhatimUsageGuide: React.FC<KhatimUsageGuideProps> = ({ 
  className = '',
  defaultExpanded = false 
}) => {
  const { language } = useLanguage();
  const t = guideTranslations[(language as 'fr' | 'en' | 'ha') || 'fr'] || guideTranslations.fr;

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className={`w-full bg-gradient-to-br from-purple-950/80 via-zinc-900 to-indigo-950/80 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-xl text-white relative overflow-hidden backdrop-blur-md ${className}`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Toggle */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none group relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/20 border border-purple-500/40 rounded-2xl text-purple-300 group-hover:scale-105 transition-transform">
            <Scroll size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-purple-100 flex items-center gap-2">
              <span>{t.guideTitle}</span>
              <Sparkles size={16} className="text-amber-400 shrink-0" />
            </h3>
            <p className="text-xs text-purple-200/70 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {t.guideSubtitle}
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="p-2.5 rounded-full bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition-colors shrink-0 ml-2"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Interactive Guide */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-purple-500/20 space-y-6 relative z-10"
          >
            {/* Step Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: 0, label: "1. Pureté", icon: Droplets },
                { id: 1, label: "2. Heure & Encens", icon: Clock },
                { id: 2, label: "3. Encre & Calame", icon: Feather },
                { id: 3, label: "4. Ordre Traçage", icon: Compass },
                { id: 4, label: "5. Zikr & Souffle", icon: Flame },
                { id: 5, label: "6. Port & Protection", icon: Shield }
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeStep === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStep(tab.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-lg shadow-purple-500/20 scale-102' 
                        : 'bg-zinc-900/60 hover:bg-zinc-800/80 border-purple-900/40 text-purple-200/80'
                    }`}
                  >
                    <IconComp size={16} className={isActive ? 'text-amber-300' : 'text-purple-400'} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 1: Taharah */}
            {activeStep === 0 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Droplets size={18} /> {t.step1Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step1Desc}</p>
                <ul className="space-y-2 pt-2">
                  {t.step1Bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-purple-100/90">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Step 2: Sa'at Al-Falak & Bakhoor */}
            {activeStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-4">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Clock size={18} /> {t.step2Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step2Desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {t.planetaryHours.map((item, idx) => (
                    <div key={idx} className="p-3 bg-zinc-900/80 rounded-xl border border-purple-500/20 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                        <span>{item.day}</span>
                        <Sun size={14} className="text-amber-400" />
                      </div>
                      <p className="text-[11px] text-purple-100 font-medium">✨ Intention : {item.use}</p>
                      <p className="text-[11px] text-emerald-300/90 flex items-center gap-1">
                        <Flame size={12} className="shrink-0" /> Encens : {item.incense}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Midad & Qalam */}
            {activeStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Feather size={18} /> {t.step3Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step3Desc}</p>
                <ul className="space-y-2 pt-2">
                  {t.step3Bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-purple-100/90">
                      <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Step 4: Tarteeb al-Kitabah */}
            {activeStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Compass size={18} /> {t.step4Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step4Desc}</p>
                <ul className="space-y-2 pt-2">
                  {t.step4Bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-purple-100/90">
                      <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Step 5: Al-Aziymah & Zikr */}
            {activeStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Flame size={18} /> {t.step5Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step5Desc}</p>
                <ul className="space-y-2 pt-2">
                  {t.step5Bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-purple-100/90">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Step 6: Preservation & Carrying */}
            {activeStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-purple-950/30 p-5 rounded-2xl border border-purple-500/20 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Shield size={18} /> {t.step6Title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.step6Desc}</p>
                <ul className="space-y-2 pt-2">
                  {t.step6Bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-purple-100/90">
                      <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Final Bar Notice */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-xl border border-amber-500/30 text-center">
              <p className="text-xs font-bold text-amber-200">
                ✨ {t.quickSummary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
