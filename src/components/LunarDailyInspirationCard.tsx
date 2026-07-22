import React, { useState } from 'react';
import { Moon, Sparkles, Image as ImageIcon, Calendar, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import { ContemplativeAudioPlayer } from './ContemplativeAudioPlayer';
import { VerseVisualGeneratorModal } from './VerseVisualGeneratorModal';

interface LunarDailyInspirationCardProps {
  language?: string;
  className?: string;
}

export const LUNAR_PHASE_DAILY_VERSES = [
  {
    phaseNameFr: "Nouvelle Lune (Al-Muhaq)",
    phaseNameEn: "New Moon (Al-Muhaq)",
    phaseNameHa: "Sabuwar Wata (Al-Muhaq)",
    emoji: "🌑",
    verseTitle: "Al-An'am (6:96)",
    arabicText: "فَالِقُ الْإِصْبَاحِ وَجَعَلَ اللَّيْلَ سَكَنًا وَالشَّمْسَ وَالْقَمَرَ حُسْبَانًا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ",
    phoneticText: "Faliqul-isbahi wa ja'alal-layla sakanan wash-shamsa wal-qamara husbana",
    translationFr: "Il fend l'aube, fait de la nuit un repos, et du soleil et de la lune une mesure du temps. Tel est l'ordre établi par le Puissant, l'Omniscient.",
    translationEn: "He causes the dawn to break and made the night for rest and the sun and moon for calculation. That is the determination of the Exalted in Might, the Knowing.",
    translationHa: "Mai tsaga Asuba shine Ya sanya dare ya zama natsuwa da rana da wata domin lissafi.",
    benefitFr: "Méditation sur le renouveau spirituel et la clarté divine de l'aube."
  },
  {
    phaseNameFr: "Premier Croissant (Al-Hilal)",
    phaseNameEn: "Crescent Moon (Al-Hilal)",
    phaseNameHa: "Farkon Tsaya (Al-Hilal)",
    emoji: "🌒",
    verseTitle: "Al-Baqarah (2:189)",
    arabicText: "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
    phoneticText: "Yas'alunaka 'anil-ahillati qul hiya mawaqitu lin-nasi wal-hajj",
    translationFr: "Ils t'interrogent sur les nouvelles lunes. Dis : 'Elles servent aux hommes à mesurer le temps et pour le Pèlerinage.'",
    translationEn: "They ask you about the new moons. Say: 'They are measurements of time for the people and for Hajj.'",
    translationHa: "Suna tambayarka game da sabbin watanni. Ka ce: Su abubuwan auna lokaci ne ga mutane.",
    benefitFr: "Bénédiction pour l'initiation de nouveaux projets et la fixation d'intentions pures."
  },
  {
    phaseNameFr: "Premier Quartier (Al-Tarbii' Al-Awwal)",
    phaseNameEn: "First Quarter (Al-Tarbii' Al-Awwal)",
    phaseNameHa: "Rubu'i na Farko (Al-Tarbii')",
    emoji: "🌓",
    verseTitle: "Ya-Sin (36:39)",
    arabicText: "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
    phoneticText: "Wal-qamara qaddarnahu manazila hatta 'ada kal-'urjunil-qadim",
    translationFr: "Et la lune, Nous lui avons déterminé des phases jusqu'à ce qu'elle devienne comme la palme desséchée.",
    translationEn: "And the moon - We have determined for it phases, until it returns like the old date stalk.",
    translationHa: "Shi kuma wata Mun sanya masa tsaya-tsaya har ya koma kamar busasshen goyon kwan kwan.",
    benefitFr: "Équilibre intérieur, sérénité et harmonie dans la traversée des étapes."
  },
  {
    phaseNameFr: "Lune Gibbeuse Croissante (Al-Ahdab)",
    phaseNameEn: "Waxing Gibbous (Al-Ahdab)",
    phaseNameHa: "Karfin Cika (Al-Ahdab)",
    emoji: "🌔",
    verseTitle: "Al-Qamar (54:1)",
    arabicText: "اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ",
    phoneticText: "Iqtarabatis-Sa'atu wanshaqqal-qamar",
    translationFr: "L'Heure approche et la lune s'est fendue.",
    translationEn: "The Hour has come near, and the moon has split.",
    translationHa: "Sawa ta kusanta kuma wata ya tsage.",
    benefitFr: "Ouverture des portes de la sagesse et illumination des secrets cachés."
  },
  {
    phaseNameFr: "Pleine Lune (Al-Badr)",
    phaseNameEn: "Full Moon (Al-Badr)",
    phaseNameHa: "Cikakken Wata (Al-Badr)",
    emoji: "🌕",
    verseTitle: "Ar-Rahman (55:7-9)",
    arabicText: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۝ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ۝ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ",
    phoneticText: "Was-sama'a rafa'aha wa wada'al-mizan... Wa aqimul-wazna bil-qisti wa la tukhsirul-mizan",
    translationFr: "Et quant au ciel, Il l'a élevé bien haut. Et Il a établi la balance, afin que vous ne transgressiez pas dans la pesée. Et établissez le poids avec équité.",
    translationEn: "And the heaven He raised and imposed the balance, that you not transgress within the balance. And establish weight in justice.",
    translationHa: "Kuma sama Ya daga ta kuma Ya sanya ma'auni domin kada ku yi keta a ma'auni.",
    benefitFr: "Puissance contemplative maximale, justice divine et plénitude de la lumière spirituelle."
  },
  {
    phaseNameFr: "Lune Gibbeuse Décroissante",
    phaseNameEn: "Waning Gibbous",
    phaseNameHa: "Raguwar Cika",
    emoji: "🌖",
    verseTitle: "Ar-Rahman (55:5)",
    arabicText: "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ",
    phoneticText: "Ash-shamsu wal-qamaru bihusban",
    translationFr: "Le soleil et la lune évoluent selon un calcul minutieux.",
    translationEn: "The sun and the moon move by precise calculation.",
    translationHa: "Rana da wata suna tafiya ne bisa ga lissafi.",
    benefitFr: "Précision céleste, gratitude et reconnaissance du décret parfait."
  },
  {
    phaseNameFr: "Dernier Quartier (Al-Tarbii' Al-Thani)",
    phaseNameEn: "Third Quarter (Al-Tarbii' Al-Thani)",
    phaseNameHa: "Rubu'i na Karshe",
    emoji: "🌗",
    verseTitle: "Al-Furqan (25:61)",
    arabicText: "تَبَارَكَ الَّذِي جَعَلَ فِي السَّمَاءِ بُرُوجًا وَجَعَلَ فِيهَا سِرَاجًا وَقَمَرًا مُّنِيرًا",
    phoneticText: "Tabarakal-ladhi ja'ala fis-sama'i burujan wa ja'ala fiha sirajan wa qamaran munira",
    translationFr: "Béni soit Celui qui a placé dans le ciel des constellations et y a placé un flambeau et une lune éclairante !",
    translationEn: "Blessed is He who has placed in the sky constellations and placed therein a lamp and a luminous moon!",
    translationHa: "Albarka ta tabbata ga wanda Ya sanya Buruj a sama kuma Ya sanya fitila da wata mai haskakawa.",
    benefitFr: "Lumière dans les ténèbres, protection contre les illusions et paix du cœur."
  },
  {
    phaseNameFr: "Dernier Croissant (Al-Mahaq)",
    phaseNameEn: "Waning Crescent (Al-Mahaq)",
    phaseNameHa: "Karshen Tsaya (Al-Mahaq)",
    emoji: "🌘",
    verseTitle: "Nuh (71:16)",
    arabicText: "وَجَعَلَ الْقَمَرَ فِيهِنَّ نُورًا وَجَعَلَ الشَّمْسَ سِرَاجًا",
    phoneticText: "Wa ja'alal-qamara fihinna nuran wa ja'alash-shamsa siraja",
    translationFr: "Et y a fait de la lune une lumière et du soleil une lampe.",
    translationEn: "And made the moon therein a light and made the sun a burning lamp.",
    translationHa: "Kuma Ya sanya wata a cikinsu ya zama haske kuma Ya sanya rana tana fitila.",
    benefitFr: "Introspection profonde, purification des pensées et réconfort intérieur."
  }
];

export const LunarDailyInspirationCard: React.FC<LunarDailyInspirationCardProps> = ({
  language = 'fr',
  className = ''
}) => {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  // Calculate day of lunar cycle (1 to 29.53) based on current date
  const getTodayLunarIndex = (): number => {
    const now = new Date();
    // Reference date: New Moon on Jan 11, 2024
    const refDate = new Date(2024, 0, 11);
    const diffDays = (now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
    const synodicMonth = 29.53058770576;
    const currentPhaseRatio = (diffDays % synodicMonth) / synodicMonth;
    const index = Math.floor(currentPhaseRatio * LUNAR_PHASE_DAILY_VERSES.length);
    return Math.max(0, Math.min(LUNAR_PHASE_DAILY_VERSES.length - 1, index));
  };

  const currentVerseIndex = getTodayLunarIndex();
  const verseData = LUNAR_PHASE_DAILY_VERSES[currentVerseIndex];

  const phaseName = language === 'fr' 
    ? verseData.phaseNameFr 
    : language === 'ha' 
    ? verseData.phaseNameHa 
    : verseData.phaseNameEn;

  const translation = language === 'fr'
    ? verseData.translationFr
    : language === 'ha'
    ? verseData.translationHa
    : verseData.translationEn;

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden backdrop-blur-sm ${className}`}>
      {/* Background glowing particles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{verseData.emoji}</span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
              {language === 'fr' ? "CARTE D'INSPIRATION DU JOUR • PHASE LUNAIRE COURANTE" : "DAILY LUNAR INSPIRATION CARD"}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-amber-200">
              {phaseName}
            </h4>
          </div>
        </div>

        <button
          onClick={() => setShowGeneratorModal(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <ImageIcon size={14} className="text-amber-400" />
          <span>{language === 'fr' ? "Générer Visuel" : "Generate Visual"}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 text-center my-3 relative">
        <span className="text-xs text-amber-400 font-mono font-bold block mb-2">
          ﴿ {verseData.verseTitle} ﴾
        </span>

        <p dir="rtl" className="font-quran text-2xl sm:text-3xl font-bold text-amber-100 leading-[2.2] text-center my-3" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}>
          {verseData.arabicText}
        </p>

        <p className="text-xs text-emerald-300/90 italic font-serif mb-2">
          "{verseData.phoneticText}"
        </p>

        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
          « {translation} »
        </p>

        {verseData.benefitFr && (
          <p className="text-[11px] text-amber-300/80 font-medium mt-3 pt-2 border-t border-emerald-500/10 flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-amber-400" />
            {verseData.benefitFr}
          </p>
        )}
      </div>

      {/* Embedded Contemplative Audio Player */}
      <div className="mt-4">
        <ContemplativeAudioPlayer
          verseTitle={`${verseData.verseTitle} - ${phaseName}`}
          arabicText={verseData.arabicText}
          phoneticText={verseData.phoneticText}
          translationText={translation}
          language={language}
          onOpenVisualGenerator={() => setShowGeneratorModal(true)}
        />
      </div>

      {/* Visual Generator Modal */}
      <VerseVisualGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        verseTitle={verseData.verseTitle}
        arabicText={verseData.arabicText}
        phoneticText={verseData.phoneticText}
        translationText={translation}
        lunarPhaseName={phaseName}
        language={language}
      />
    </div>
  );
};
