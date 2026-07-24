import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Info, ChevronDown, ChevronUp, BookOpen, Key, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToolInfoTooltipProps {
  toolId: string;
}

interface InterpretationGuide {
  title: string;
  howItWorks: string;
  interpretation: string;
  advice: string;
}

const guides: Record<string, Record<string, InterpretationGuide>> = {
  fr: {
    abjad: {
      title: "Interprétation de la valeur Abjad",
      howItWorks: "Chaque lettre de l'alphabet arabe possède une valeur numérique sacrée universelle. Le système Mashriqi (oriental) et Maghribi (occidental) diffèrent légèrement sur certaines lettres (Sâd, Dâd, Sîn, etc.).",
      interpretation: "Le nombre total obtenu (Adad) représente la vibration mystique unique du mot ou du nom. Il permet d'accorder vos zikrs (invocations) à la fréquence exacte de votre nom ou d'un nom divin d'Allah.",
      advice: "Répétez vos wirds ou vos prières un nombre de fois égal à la valeur Abjad calculée pour maximiser la résonance ésotérique et l'harmonie vibratoire spirituelle."
    },
    zairja: {
      title: "Interprétation de l'Oracle Zairja",
      howItWorks: "Le Zairja est un astrolabe kabbalistique soufi qui combine les lettres de votre question, l'heure actuelle, les degrés astrologiques et les rythmes ésotériques pour générer une réponse chiffrée.",
      interpretation: "Le cercle de lettres et la phrase finale révèlent les forces spirituelles cachées et les vérités intérieures sous-jacentes à votre interrogation. Ne lisez pas la réponse de façon uniquement littérale, mais comme une métaphore spirituelle.",
      advice: "Méditez sur chaque lettre et mot révélé. Formulez toujours des questions sincères, orientées vers la sagesse divine, l'évolution spirituelle et l'auto-compréhension."
    },
    taksir: {
      title: "Interprétation des Brisures de Taksir",
      howItWorks: "Le Taksir consiste à entrelacer les lettres d'une formule sacrée, en alternant les lettres de droite et de gauche de la ligne précédente jusqu'à ce que la ligne initiale se répète d'elle-même (fermeture de la matrice).",
      interpretation: "Chaque ligne représente une étape de déconcentration et de reconstruction de la vibration sacrée originelle. Le tableau complet agit comme un récepteur d'énergie vibratoire focalisant la formule.",
      advice: "Utilisez le Taksir généré pour vos méditations contemplatives. Répétez ou visualisez chaque ligne de haut en bas pour internaliser la progression mystique des énergies divines."
    },
    ilm_jafar: {
      title: "Interprétation d'Ilm Ja'far",
      howItWorks: "La science ésotérique du Ja'far (science des lettres) analyse les racines consonantiques, les valeurs numériques et les correspondances astrales pour décomposer les secrets du futur et du passé.",
      interpretation: "Les lettres générées et les nombres associés indiquent les énergies divines régissant votre situation. Les corrélations kabbalistiques pointent vers des versets spécifiques ou des noms de protection.",
      advice: "Le Ja'far exige une pureté absolue du cœur. Utilisez les résultats pour éclairer votre guidance intérieure et orienter vos prières vers les aspects divins révélés."
    },
    elemental: {
      title: "Interprétation des Quatre Éléments",
      howItWorks: "Ce module décompose les lettres de votre nom pour calculer la proportion exacte des 4 éléments fondamentaux : le Feu (Nari), l'Air (Hawai), l'Eau (Ma'i) et la Terre (Turabi).",
      interpretation: "Une dominance de Feu indique la passion et l'action ; l'Air favorise l'intellect et la communication ; l'Eau symbolise l'intuition et la spiritualité ; la Terre apporte la stabilité et l'ancrage.",
      advice: "Si un élément est en déficit, compensez-le par des zikrs associés aux éléments complémentaires ou en portant des couleurs et en adoptant des habitudes harmonisantes."
    },
    khouddam: {
      title: "Interprétation des Serviteurs (Khouddam)",
      howItWorks: "Calcule les noms des entités angéliques célestes (finissant par A'il - -ائيل) et terrestres/génies (finissant par Yush - -يوش) associées à la signature vibratoire de votre nom.",
      interpretation: "Ces noms sacrés représentent les canaux d'influence divine spécifiques qui vous protègent et soutiennent vos invocations. Ils sont le reflet microcosmique des gardiens de la création.",
      advice: "Ne cherchez jamais à forcer le contact. Invoquez plutôt la bienveillance de Dieu et remerciez pour la protection céleste constante manifestée à travers ces énergies positives."
    },
    rouhaniyya: {
      title: "Interprétation de la Rouhaniyya",
      howItWorks: "Extrait la force de l'esprit spirituel (Rouhaniyya) actif d'une formule de zikr ou d'un nom à partir de sa structure numérique élémentaire et céleste.",
      interpretation: "La force spirituelle calculée détermine l'impact vibratoire de vos prières. Une Rouhaniyya élevée indique que la formule possède un fort pouvoir de transmutation intérieure.",
      advice: "Récitez vos formules avec dévotion, concentration et sincérité. La force de l'intention pure est ce qui active la Rouhaniyya de tout zikr."
    },
    khatim: {
      title: "Interprétation du Khatim / Sceau",
      howItWorks: "Le Khatim (générateur de Wafq) place votre valeur numérique cible au centre d'un carré magique 3x3 selon une règle stricte de progression numérique harmonieuse.",
      interpretation: "Le carré magique est un équilibreur d'énergies cosmiques. La somme des lignes, colonnes et diagonales est identique, représentant la perfection divine et l'unité cosmique (Tawhid).",
      advice: "Visualisez le Sceau sacré pendant vos séances de méditation. Il aide à centrer l'esprit, à stabiliser les pensées et à sceller spirituellement vos intentions de lumière."
    },
    talsam: {
      title: "Interprétation des Talsams de Pouvoir",
      howItWorks: "Le Talsam fusionne et chiffre les lettres de votre invocation ou de vos noms sacrés pour créer un mot unique de haute densité vibratoire.",
      interpretation: "Le mot de pouvoir généré concentre toute l'essence de votre intention spirituelle sous une forme géométrique et phonétique sacrée non accessible à l'esprit rationnel.",
      advice: "Récitez le Talsam ou conservez-le en mémoire comme un ancrage de votre foi et de votre dévouement envers la Volonté divine souveraine."
    },
    "seven-kings": {
      title: "Interprétation des Sceaux des 7 Rois Célestes",
      howItWorks: "Chaque jour de la semaine est régi par un Ange Céleste (Mala'ik), un Roi Terrestre, un Nom Divin, une planète et un carré magique Wafq d'une dimension choisie (3x3 à 10x10).",
      interpretation: "Le sceau combine le sceau solomonien, l'octagramme des 8 directions et le carré sacré pour concentrer les résonances théurgiques et équilibrer les énergies planétaires du jour.",
      advice: "Effectuez votre méditation ou zikr le jour correspondant, à l'heure planétaire propice, en utilisant l'encens recommandé et en récitant le nom divin associé."
    },
    geomancy: {
      title: "Interprétation de la Géomancie (Khatt ar-Raml)",
      howItWorks: "Génère les 16 maisons géomantiques à partir des 4 Mères (soit par tirage de sable, saisie manuelle ou calcul Abjad). Les Filles, Nièces, Témoins, Juge et Suprême sont calculés par l'addition binaire sacrée.",
      interpretation: "Le Juge (M15) donne la réponse directe à votre interrogation, tandis que le Suprême (M16) scelle l'issue ultime à long terme. L'analyse par domaine (M1 vs M-Cible) et la boussole spatiale révèlent les dynamiques d'action.",
      advice: "Consultez le thème avec respect et sérénité. Effectuez l'aumône (Saraka) et les zikrs recommandés pour harmoniser les énergies élémentaires et débloquer les situations."
    }
  },
  en: {
    abjad: {
      title: "Interpretation of the Abjad Value",
      howItWorks: "Each Arabic letter has a universal sacred numerical value. The Mashriqi (Eastern) and Maghribi (Western) systems differ slightly on certain letters (Sâd, Dâd, Sîn, etc.).",
      interpretation: "The total number obtained (Adad) represents the unique mystic vibration of the word or name. It allows you to tune your zikrs (invocations) to the exact frequency of your name or of a Divine Name of Allah.",
      advice: "Repeat your wirds or prayers a number of times equal to the calculated Abjad value to maximize esoteric resonance and spiritual vibrational harmony."
    },
    zairja: {
      title: "Interpretation of the Zairja Oracle",
      howItWorks: "The Zairja is a Sufi kabbalistic astrolabe that combines the letters of your question, the current time, astrological degrees, and esoteric rhythms to generate a coded response.",
      interpretation: "The circle of letters and the final phrase reveal the hidden spiritual forces and inner truths underlying your query. Do not read the answer literally, but as a spiritual metaphor.",
      advice: "Meditate on every letter and word revealed. Always formulate sincere questions oriented towards divine wisdom, spiritual growth, and self-understanding."
    },
    taksir: {
      title: "Interpretation of Taksir Matrix",
      howItWorks: "Taksir consists of interlacing the letters of a sacred formula, alternating letters from the right and left of the previous line until the initial line repeats itself (closing the matrix).",
      interpretation: "Each line represents a stage of deconstructing and rebuilding the original sacred vibration. The complete matrix acts as a spiritual lens focusing the power of the formula.",
      advice: "Use the generated Taksir for your contemplative meditations. Repeat or visualize each line from top to bottom to internalize the mystical progression of divine energies."
    },
    ilm_jafar: {
      title: "Interpretation of Ilm Ja'far",
      howItWorks: "The esoteric science of Ja'far (science of letters) analyzes consonantal roots, numerical values, and astral correspondences to unpack secrets of the future and the past.",
      interpretation: "The generated letters and associated numbers indicate the divine energies governing your situation. Mystical correlations point towards specific protective verses or divine names.",
      advice: "Ja'far requires absolute purity of heart. Use the results to enlighten your inner guidance and orient your prayers towards the revealed divine aspects."
    },
    elemental: {
      title: "Interpretation of the Four Elements",
      howItWorks: "This module breaks down the letters of your name to calculate the exact proportion of the 4 fundamental elements: Fire (Nari), Air (Hawai), Water (Ma'i), and Earth (Turabi).",
      interpretation: "A Fire dominance indicates passion and action; Air favors intellect and communication; Water symbolizes intuition and spirituality; Earth brings stability and grounding.",
      advice: "If an element is lacking, compensate for it with zikrs associated with the complementary elements, or by wearing colors and adopting habits that restore balance."
    },
    khouddam: {
      title: "Interpretation of Servants (Khouddam)",
      howItWorks: "Calculates the names of the celestial angelic entities (ending in A'il - -ائيل) and terrestrial entities/genies (ending in Yush - -يosh) associated with the vibrational signature of your name.",
      interpretation: "These sacred names represent specific channels of divine influence that protect you and support your invocations. They are micro-cosmic reflections of cosmic guardians.",
      advice: "Never try to force contact. Instead, seek God's grace and give thanks for the constant celestial protection manifested through these positive energies."
    },
    rouhaniyya: {
      title: "Interpretation of Rouhaniyya",
      howItWorks: "Extracts the spiritual power (Rouhaniyya) active in a zikr formula or name from its basic numerical and elemental structure.",
      interpretation: "The calculated spiritual force determines the vibrational impact of your prayers. A high Rouhaniyya indicates that the formula possesses a strong power of inner transformation.",
      advice: "Recite your formulas with devotion, focus, and sincerity. The power of pure intention is what activates the Rouhaniyya of any zikr."
    },
    khatim: {
      title: "Interpretation of Khatim / Seal",
      howItWorks: "The Khatim (Wafq generator) places your target numerical value inside a 3x3 magic square following strict rules of harmonious numerical progression.",
      interpretation: "The magic square is a balancer of cosmic energies. The sum of rows, columns, and diagonals is identical, representing divine perfection and cosmic unity (Tawhid).",
      advice: "Visualize the sacred Seal during your meditation sessions. It helps to center the mind, stabilize thoughts, and spiritually seal your light intentions."
    },
    talsam: {
      title: "Interpretation of Power Talsams",
      howItWorks: "The Talsam merges and encrypts the letters of your invocation or sacred names to create a unique word of high vibrational density.",
      interpretation: "The generated word of power concentrates the entire essence of your spiritual intent in a geometric and phonetic sacred form not accessible to the rational mind.",
      advice: "Recite the Talsam or hold it in your memory as an anchor of your faith and devotion to the sovereign Divine Will."
    },
    "seven-kings": {
      title: "Interpretation of the Seals of the 7 Celestial Kings",
      howItWorks: "Each day of the week is governed by a Celestial Angel (Mala'ik), an Earthly King, a Divine Name, a planet, and a Wafq magic square of chosen dimensions (3x3 to 10x10).",
      interpretation: "The seal combines the Solomonian seal, the 8-directional octagram, and the sacred square to focus theurgic resonances and balance the daily planetary energies.",
      advice: "Perform your meditation or zikr on the corresponding day during the auspicious planetary hour, using the recommended incense and reciting the associated divine name."
    },
    geomancy: {
      title: "Interpretation of Geomancy (Khatt ar-Raml)",
      howItWorks: "Generates the 16 geomantic houses from 4 Mothers (via sand casting, manual input, or Abjad calculation). Daughters, Nieces, Witnesses, Judge, and Supreme are calculated through sacred binary addition.",
      interpretation: "The Judge (H15) provides the direct answer to your question, while the Supreme (H16) seals the ultimate long-term outcome. Domain analysis (H1 vs Target-H) and spatial compass reveal action dynamics.",
      advice: "Consult the chart with respect and peace. Perform the recommended charity (Saraka) and dhikrs to harmonize elemental energies and unblock situations."
    }
  },
  ha: {
    abjad: {
      title: "Ma'anar Darajar Abjad",
      howItWorks: "Kowane harafi na Larabci yana da darajar lissafi ta musamman. Akwai dan bambanci tsakanin tsarin Mashriqi da Maghribi.",
      interpretation: "Jimillar lambar da aka samu tana wakiltar muryar ruhi ta kalmar. Yana taimaka maka wajen daidaita zikiri da sunanka.",
      advice: "Sake karanta addu'o'inka gwargwadon adadin darajar Abjad da aka lissafa don samun cikakken sakamako."
    },
    zairja: {
      title: "Fassarar Zairja",
      howItWorks: "Zairja wata na'ura ce ta Sufaye da ke hada haruffan tambayarka da lokaci don ba ka amsar ruhi.",
      interpretation: "Haruffan da aka samu suna nuna gaskiya ta ciki. Kada ka fassara amsar a zahiri kawai, fassara ta a matsayin misalin ruhi.",
      advice: "Yi tunani a kan kowane harafi da kalma da aka bayyana. Koyaushe ka tambayi abubuwa da gaskiya don neman hikima."
    },
    taksir: {
      title: "Fassarar Taksir",
      howItWorks: "Taksir hanya ce ta hada haruffa daki-daki har sai layin farko ya sake bayyana don rufe jadawalin.",
      interpretation: "Kowane layi yana wakiltar matakin sake fasalin muryar ruhi. Cikakken jadawalin yana zama kamar jagora mai karfi.",
      advice: "Yi amfani da Taksir wajen yin tunani mai zurfi. Karanta layukan daga sama zuwa kasa."
    },
    ilm_jafar: {
      title: "Fassarar Ilimin Ja'far",
      howItWorks: "Ilimin sirri na Ja'far yana binciken tushen haruffa, lambobi da taurari don bayyana asirin ruhi.",
      interpretation: "Haruffa da lambobin da aka samu suna nuna kariya da sirrin da ke tattare da yanayin mutum.",
      advice: "Ilimin Ja'far yana bukatar tsarkin zuciya da gaskiya. Yi amfani da sakamakon wajen addu'a."
    },
    elemental: {
      title: "Fassarar Sassan Hudu (Anasir)",
      howItWorks: "Wannan bangaren yana rarraba haruffan sunanka zuwa sassa hudu: Wuta (Nari), Iska (Hawai), Ruwa (Ma'i), da Kasa (Turabi).",
      interpretation: "Rinjayen Wuta yana nuna karfi da kwarin gwiwa; Iska tana nuna tunani; Ruwa yana nuna hankali da ilimi; Kasa tana nuna tabbatuwa.",
      advice: "Idan wani bangare ya yi karanci, cike shi da zikiri ko addu'o'in da suka dace."
    },
    khouddam: {
      title: "Fassarar Masu Hidima (Khouddam)",
      howItWorks: "Yana lissafa sunayen ruhohin sama (da ke karewa da \"A'il\") da na kasa (da ke karewa da \"Yush\") masu alaka da sunanka.",
      interpretation: "Wadannan sunaye masu tsarki suna wakiltar hanyoyin kariya na Ubangiji da ke taimaka maka wajen addu'a.",
      advice: "Koyaushe ka gode wa Allah kuma ka nemi kariya ta gaskiya daga gare Shi kawai."
    },
    rouhaniyya: {
      title: "Fassarar Rouhaniyya",
      howItWorks: "Yana fitar da karfin ruhi (Rouhaniyya) da ke aiki a cikin zikiri ko suna daga lambobi da haruffa.",
      interpretation: "Karfin ruhaniya da aka lissafa yana nuna tasirin addu'o'inka. Cikakken Rouhaniyya yana nuna karfin amsa addu'a.",
      advice: "Karanta zikirinka da cikakkiyar nutsuwa, biyayya da gaskiya don kunna karfin Rouhaniyya."
    },
    khatim: {
      title: "Fassarar Hatimi / Khatim",
      howItWorks: "Hatimi yana saka darajar lambarka a tsakiyar sahu 3x3 bisa tsari na musamman na lissafi.",
      interpretation: "Sikofin yana daidaita karfin ruhi. Jimillar kowane layi tana zama daya, wanda ke nuna kadaitakar Ubangiji.",
      advice: "Natsu wajen duba Hatimin yayin tunani don samun natsuwa da karfin addu'a."
    },
    talsam: {
      title: "Fassarar Talsam",
      howItWorks: "Talsam yana tattara haruffan addu'arka ko sunaye masu tsarki zuwa kalma guda mai karfin ruhi.",
      interpretation: "Kalmar talsam da aka samu tana dunkule kudurinka na ruhi zuwa wata hanya ta musamman.",
      advice: "Rike talsam din a matsayin madogara ta kyakkyawan zatonka ga Allah."
    },
    "seven-kings": {
      title: "Fassarar Hatsiman Sarakunan Sama 7",
      howItWorks: "Kowace rana ta mako tana karkashin mulkin Mala'ikan Sama, Sarkin Kasa, Sunan Allah, Tauraro, da Wafq mai lambobi (3x3 zuwa 10x10).",
      interpretation: "Hatsimin yana haɗa hatimin Suleimanu, tauraro mai baki 8, da wafq domin tattara albarkar ruhananci da tauraro na ranar.",
      advice: "Yi addu'arka ko zikirinka a ranar da ta dace, a sa'ar tauraron, tare da turaren wuta da aka gindaya da karanta sunan Allah."
    },
    geomancy: {
      title: "Fassarar Duban Kasa (Khatt ar-Raml)",
      howItWorks: "Yana samarda gidajen kasa 16 daga uwaye 4 (ta hanyar duba a yashi, shigarwa da hannu ko lissafin Abjad). Yammata, jikoki, shaidu, Alkali da Mafi Daukaka ana samun su ta hanyar lissafin lamba.",
      interpretation: "Alkali (G15) yana ba da amsa kai tsaye ga tambayarka, yayin da Mafi Daukaka (G16) yake rufe karshen al'amari. Binciken bangare (G1 da Gidan Tambaya) da boussole suna nuna hanyar motsi.",
      advice: "Duba kasa da girmamawa da nutsuwa. Yi sadaka da zikirin da aka shawarta domin daidaita karfin sassan hudu da bude hanya."
    }
  }
};

export const ToolInfoTooltip: React.FC<ToolInfoTooltipProps> = ({ toolId }) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentGuide = guides[language]?.[toolId] || guides['fr']?.[toolId] || guides['en']?.[toolId];

  if (!currentGuide) return null;

  return (
    <div className="w-full bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/70 dark:border-blue-900/30 rounded-2xl p-4 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100/60 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Info size={18} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-950 dark:text-gray-150 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {currentGuide.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('toolTooltip.clickToInterpret', "Cliquez pour voir comment interpréter les résultats")}
            </p>
          </div>
        </div>
        <div className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-blue-100/40 dark:border-blue-900/20 pt-4 text-xs sm:text-sm">
              <div className="space-y-1.5 p-3 bg-white/40 dark:bg-gray-800/20 rounded-xl border border-blue-50/50 dark:border-gray-850">
                <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Key size={13} />
                  {t('toolTooltip.howItWorks', "Fonctionnement")}
                </h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[12.5px]">
                  {currentGuide.howItWorks}
                </p>
              </div>

              <div className="space-y-1.5 p-3 bg-white/40 dark:bg-gray-800/20 rounded-xl border border-blue-50/50 dark:border-gray-850">
                <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <BookOpen size={13} />
                  {t('toolTooltip.interpretation', "Interprétation")}
                </h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[12.5px]">
                  {currentGuide.interpretation}
                </p>
              </div>

              <div className="space-y-1.5 p-3 bg-white/40 dark:bg-gray-800/20 rounded-xl border border-blue-50/50 dark:border-gray-850">
                <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Sparkles size={13} />
                  {t('toolTooltip.spiritualAdvice', "Conseil d'usage")}
                </h5>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[12.5px]">
                  {currentGuide.advice}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
