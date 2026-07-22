import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles, Shield, Leaf, Volume2, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { get, set } from 'idb-keyval';

export interface LunarPhaseInfo {
  phaseName: string;
  phaseNameAr: string;
  illumination: number; // 0 - 100%
  stage: 'new_moon' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full_moon' | 'waning_gibbous' | 'third_quarter' | 'waning_crescent';
  mysticDescription: { fr: string; en: string; ha: string };
  protectiveVerse: {
    surah: string;
    ayah: string;
    arabicText: string;
    translation: { fr: string; en: string; ha: string };
  };
  herbier: {
    plants: string[];
    essentialOils: string[];
    incenseBinauralHz: number;
    usage: { fr: string; en: string; ha: string };
  };
}

// Calculate current lunar phase based on synodic month formula
export function calculateCurrentLunarPhase(): LunarPhaseInfo {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Known new moon reference date: Jan 11, 2024
  const refDate = new Date(2024, 0, 11).getTime();
  const diffDays = (date.getTime() - refDate) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058770576;
  const cycleDay = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
  const illumination = Math.round((1 - Math.cos((cycleDay / synodicMonth) * 2 * Math.PI)) / 2 * 100);

  if (cycleDay < 1.84566) {
    return {
      phaseName: "Nouvelle Lune (Al-Muhaq)",
      phaseNameAr: "المحاق",
      illumination,
      stage: 'new_moon',
      mysticDescription: {
        fr: "Période de renouveau mystique, de purification des intentions et de pose de graines spirituelles.",
        en: "Period of mystical renewal, purification of intentions, and planting spiritual seeds.",
        ha: "Lokacin sabuntawa na sirri, tsarkake niyya da shuka irin ruhi."
      },
      protectiveVerse: {
        surah: "Al-An'am",
        ayah: "96",
        arabicText: "فَالِقُ الْإِصْبَاحِ وَجَعَلَ اللَّيْلَ سَكَنًا وَالشَّمْسَ وَالْقَمَرَ حُسْبَانًا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ",
        translation: {
          fr: "Il fend l'aube, fait de la nuit un repos, et du soleil et de la lune une mesure du temps. Tel est l'ordre fixé par le Puissant, l'Omniscient.",
          en: "He is the Cleaver of the daybreak. He has made the night for rest and the sun and moon for calculation. That is the determination of the Exalted in Might, the Knowing.",
          ha: "Yana tsaga alfijir, kuma Ya sanya dare ya zama natsuwa, da rana da wata su zama ma'auni. Wannan ne ƙaddarar Mafi Ƙarfi, Mafi Sani."
        }
      },
      herbier: {
        plants: ["Sauge Blanche", "Myrrhe", "Nigelle"],
        essentialOils: ["Huile d'Encens Oliban", "Huile de Cèdre"],
        incenseBinauralHz: 432,
        usage: {
          fr: "Brûlez de la myrrhe et de la sauge pendant la prière de nuit pour purifier l'esprit et purifier le foyer.",
          en: "Burn myrrh and sage during night prayers to cleanse the mind and purify the home.",
          ha: "Ƙona luban da shuka mai albarka a cikin addu'ar dare don tsarkake rai da gida."
        }
      }
    };
  } else if (cycleDay < 5.53699) {
    return {
      phaseName: "Premier Croissant (Al-Hilal)",
      phaseNameAr: "الهلال",
      illumination,
      stage: 'waxing_crescent',
      mysticDescription: {
        fr: "La lumière naissante de l'Hilal symbolise la bénédiction, la croissance des affaires et le début des invocations régulières.",
        en: "The rising light of Hilal symbolizes blessings, business growth, and the onset of regular invocations.",
        ha: "Hasken fari na Hilal yana nuna albarka, haɓakar kasuwanci da farkon ambato."
      },
      protectiveVerse: {
        surah: "Al-Baqarah",
        ayah: "189",
        arabicText: "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
        translation: {
          fr: "Ils t'interrogent sur les nouvelles lunes. Dis : 'Elles servent aux hommes à mesurer le temps et pour le Pèlerinage.'",
          en: "They ask you about the new moons. Say: 'They are measurements of time for the people and for Hajj.'",
          ha: "Suna tambayarka game da jilolin wata. Ka ce: 'Su ma'aunin lokaci ne ga mutane da aikin Hajj.'"
        }
      },
      herbier: {
        plants: ["Fenouil", "Camomille", "Basilic Sacré"],
        essentialOils: ["Huile de Rose", "Huile de Lavande"],
        incenseBinauralHz: 528,
        usage: {
          fr: "Diffusion d'essence de rose et fumigation de basilic pour favoriser l'attraction bénéfique et l'ouverture des portes.",
          en: "Diffuse rose essence and basil smoke to enhance positive attraction and spiritual opening.",
          ha: "Shafa man fure da turaren basilic don buɗe ƙofofin arziki da albarka."
        }
      }
    };
  } else if (cycleDay < 9.22831) {
    return {
      phaseName: "Premier Quartier (Al-Tarbii' Al-Awwal)",
      phaseNameAr: "التربيع الأول",
      illumination,
      stage: 'first_quarter',
      mysticDescription: {
        fr: "Équilibre entre l'ombre et la lumière. Moment idéal pour l'action déterminée, la réconciliation et le renforcement du Wird.",
        en: "Balance between shadow and light. Ideal time for decisive action, reconciliation, and strengthening the Wird.",
        ha: "Daidaito tsakanin inuwa da haske. Lokaci mafi kyau don ƙuduri da ƙarfafa wirdi."
      },
      protectiveVerse: {
        surah: "Yasin",
        ayah: "39",
        arabicText: "وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
        translation: {
          fr: "Et la lune, Nous lui avons déterminé des phases jusqu'à ce qu'elle devienne comme la palme desséchée.",
          en: "And the moon - We have determined for it phases, until it returns like the old dried date stalk.",
          ha: "Shima wata Mun ƙaddara masa matakai har ya koma kamar busasshen karfe na kwan kwan."
        }
      },
      herbier: {
        plants: ["Thym", "Romarin", "Eucalyptus"],
        essentialOils: ["Huile de Menthe Poivrée", "Huile de Romarin"],
        incenseBinauralHz: 639,
        usage: {
          fr: "Ondulations de thym et romarin pour clarifier le jugement et élever le niveau de concentration.",
          en: "Thyme and rosemary vibrations to clarify judgment and raise focus levels.",
          ha: "Turaren thyme da rosemary don tsarkake tunani da maida hankali."
        }
      }
    };
  } else if (cycleDay < 12.91963) {
    return {
      phaseName: "Lune Gibbeuse Croissante (Al-Ahdab Al-Awwal)",
      phaseNameAr: "الأحدب الأول",
      illumination,
      stage: 'waxing_gibbous',
      mysticDescription: {
        fr: "La puissance céleste s'amplifie. Préparation intensive aux nuits de Zikr et d'alignement spirituel.",
        en: "Celestial power amplifies. Intensive preparation for nights of Zikr and spiritual alignment.",
        ha: "Ƙarfin samaniya yana ƙaruwa. Shiri na musamman don dararen ambato."
      },
      protectiveVerse: {
        surah: "Al-Qamar",
        ayah: "1",
        arabicText: "اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ",
        translation: {
          fr: "L'Heure approche et la lune s'est fendue.",
          en: "The Hour has come near, and the moon has split.",
          ha: "Sa'a ta kusanto, kuma wata ya tsage."
        }
      },
      herbier: {
        plants: ["Santal Blanc", "Laurier", "Cannelle"],
        essentialOils: ["Huile de Santal", "Huile de Cannelle"],
        incenseBinauralHz: 741,
        usage: {
          fr: "Brûlez du bois de santal et des feuilles de laurier pour attirer le charisme et la protection des anges.",
          en: "Burn sandalwood and bay leaves to invite charisma and angelic protection.",
          ha: "Ƙona itacen santal da ganye don jawo kwarjini da kariyar mala'iku."
        }
      }
    };
  } else if (cycleDay < 16.61096) {
    return {
      phaseName: "Pleine Lune (Al-Badr - Les 3 Jours Blancs)",
      phaseNameAr: "البدر - الأيام البيض",
      illumination,
      stage: 'full_moon',
      mysticDescription: {
        fr: "Plein rayonnement céleste (Al-Badr). Sommet d'énergie pour la Muraqabah, les voeux spirituels, le jeûne et le Zikr des 99 Noms.",
        en: "Full celestial radiance (Al-Badr). Peak energy for Muraqabah, spiritual vows, fasting, and Zikr of 99 Names.",
        ha: "Haske na cika na Al-Badr. Mafi ƙoluwar ƙarfin ruhi don Muraqabah, azumin kwanaki farare da zikiri."
      },
      protectiveVerse: {
        surah: "Al-Inshiqaq",
        ayah: "18",
        arabicText: "وَالْقَمَرِ إِذَا اتَّسَقَ ۝ لَتَرْكَبُنَّ طَبَقًا عَن طَبَقٍ",
        translation: {
          fr: "Et par la lune quand elle devient pleine ! Vous passerez certes par des états successifs.",
          en: "And by the moon when it becomes full! You shall surely embark upon stage after stage.",
          ha: "Murna da wata sa'ad da ya cika! Lalle za ku shiga hali bayan hali."
        }
      },
      herbier: {
        plants: ["Oliban Mâle (Luban Jawi)", "Rose de Damas", "Santal Rouge"],
        essentialOils: ["Huile de Luban", "Huile d'Ambre Pur"],
        incenseBinauralHz: 528,
        usage: {
          fr: "Brûler du Luban Jawi de haute pureté pendant les 3 Jours Blancs lors de la récitation nocturne.",
          en: "Burn pure Luban Jawi during the 3 White Days during night recitation.",
          ha: "Ƙona turaren Luban Jawi mai inganci a lokacin azumin kwanaki 3 farare a darare."
        }
      }
    };
  } else if (cycleDay < 20.30228) {
    return {
      phaseName: "Lune Gibbeuse Décroissante (Al-Ahdab Al-Thani)",
      phaseNameAr: "الأحدب الثاني",
      illumination,
      stage: 'waning_gibbous',
      mysticDescription: {
        fr: "Période de partage de la sagesse acquise, de gratitude profonde et de transmission des secrets.",
        en: "Period of sharing acquired wisdom, deep gratitude, and transmission of secrets.",
        ha: "Lokacin raba hikimar da aka samu, godiya ta zurfi da mika asiri."
      },
      protectiveVerse: {
        surah: "Ar-Rahman",
        ayah: "5",
        arabicText: "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ",
        translation: {
          fr: "Le soleil et la lune évoluent selon un calcul minutieux.",
          en: "The sun and the moon move by precise calculation.",
          ha: "Rana da wata suna tafiya da lissafi na ƙwarewa."
        }
      },
      herbier: {
        plants: ["Verveine", "Anis Étoilé", "Gingembre"],
        essentialOils: ["Huile de Bergamote", "Huile de Citronnelle"],
        incenseBinauralHz: 852,
        usage: {
          fr: "Infusion de verveine et anis avec fumigation d'ambre pour ancrer la gratitude et la sérénité.",
          en: "Verveine and anise infusion with amber smoke to ground gratitude and serenity.",
          ha: "Sha shayin verveine da turaren ambre don tabbatar da natsuwa da godiya."
        }
      }
    };
  } else if (cycleDay < 23.99361) {
    return {
      phaseName: "Dernier Quartier (Al-Tarbii' Al-Thani)",
      phaseNameAr: "التربيع الثاني",
      illumination,
      stage: 'third_quarter',
      mysticDescription: {
        fr: "Temps de libération des blocages, du pardon absolu et du détachement des fardeaux négatifs.",
        en: "Time for releasing blockages, absolute forgiveness, and letting go of negative burdens.",
        ha: "Lokacin warware cikas, gafarar gaskiya da korar damuwa."
      },
      protectiveVerse: {
        surah: "Al-Furqan",
        ayah: "61",
        arabicText: "تَبَارَكَ الَّذِي جَعَلَ فِي السَّمَاءِ بُرُوجًا وَجَعَلَ فِيهَا سِرَاجًا وَقَمَرًا مُّنِيرًا",
        translation: {
          fr: "Béni soit Celui qui a placé dans le ciel des constellations et y a placé un flambeau et une lune éclairante !",
          en: "Blessed is He who has placed in the sky constellations and placed therein a lamp and a luminous moon!",
          ha: "Barka da Wanda Ya sanya taurari a sama, kuma Ya sanya fitila mai haske da wata mai haskakawa!"
        }
      },
      herbier: {
        plants: ["Saule", "Feuilles de Citronnier", "Graine de Cumin Noir"],
        essentialOils: ["Huile d'Arbre à Thé", "Huile d'Eucalyptus"],
        incenseBinauralHz: 396,
        usage: {
          fr: "Bain spirituel à l'eau de cumin noir et fumigation de graines de nigelle pour dissoudre les mauvaises influences.",
          en: "Spiritual bath with black seed water and nigella smoke to dissolve negative influences.",
          ha: "Wankan ruwan habbatussauda da turare don korar shaidanu da cikas."
        }
      }
    };
  } else {
    return {
      phaseName: "Dernier Croissant (Al-Mahaq Al-Thani)",
      phaseNameAr: "الهلال الاخير",
      illumination,
      stage: 'waning_crescent',
      mysticDescription: {
        fr: "Dernier lueur du cycle. Temps de repos contemplatif, de bilan spirituel et de sommeil réparateur.",
        en: "Final glow of the cycle. Time for contemplative rest, spiritual inventory, and restful sleep.",
        ha: "Haske na karshe na wata. Lokacin hutu na ambato da binciken rai."
      },
      protectiveVerse: {
        surah: "Nuh",
        ayah: "16",
        arabicText: "وَجَعَلَ الْقَمَرَ فِيهِنَّ نُورًا وَجَعَلَ الشَّمْسَ سِرَاجًا",
        translation: {
          fr: "Et Y a fait de la lune une lumière et du soleil une lampe.",
          en: "And made the moon therein a light and made the sun a burning lamp.",
          ha: "Kuma Ya sanya wata a cikinsu ya zama haske, kuma Ya sanya rana ta zama fitila."
        }
      },
      herbier: {
        plants: ["Fleurs de Camomille", "Pétales de Rose", "Camphre"],
        essentialOils: ["Huile de Camomille", "Huile de Néroli"],
        incenseBinauralHz: 432,
        usage: {
          fr: "Infusion apaisante de camomille et de rose avec brume de camphre avant le sommeil.",
          en: "Soothing chamomile and rose infusion with camphor mist before sleep.",
          ha: "Sha shayin camomille da furen rose tare da camphre kafin barci."
        }
      }
    };
  }
}

export const LunarPhaseWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useLanguage();
  const [lunarData, setLunarData] = useState<LunarPhaseInfo>(calculateCurrentLunarPhase());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isOfflineLoaded, setIsOfflineLoaded] = useState(false);

  useEffect(() => {
    // Save to IndexedDB for seamless offline availability
    async function persistData() {
      try {
        const currentData = calculateCurrentLunarPhase();
        setLunarData(currentData);
        await set('asrar_lunar_phase_current', currentData);
        await set('asrar_herbier_data', currentData.herbier);
        await set('asrar_versets_data', currentData.protectiveVerse);
        setIsOfflineLoaded(true);
      } catch (err) {
        console.warn("Could not save lunar data to IndexedDB:", err);
        // Fallback reading from IndexedDB if offline
        try {
          const cached = await get<LunarPhaseInfo>('asrar_lunar_phase_current');
          if (cached) setLunarData(cached);
        } catch (e) {}
      }
    }
    persistData();
  }, []);

  const playBinauralTone = (freqHz: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqHz, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.1);

      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3100);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  const getMoonIconShape = () => {
    const stage = lunarData.stage;
    if (stage === 'full_moon') {
      return (
        <motion.div 
          animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 12px rgba(251,191,36,0.8))', 'drop-shadow(0 0 25px rgba(251,191,36,0.95))', 'drop-shadow(0 0 12px rgba(251,191,36,0.8))'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-white flex items-center justify-center shadow-lg"
        >
          <div className="w-10 h-10 rounded-full border border-amber-300/40 bg-amber-50/20" />
        </motion.div>
      );
    } else if (stage === 'new_moon') {
      return (
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-900 to-gray-800 border-2 border-amber-500/30 flex items-center justify-center shadow-inner">
          <Moon className="text-amber-500/40" size={26} />
        </div>
      );
    } else {
      return (
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-400/40 flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-amber-300/20 rounded-full blur-sm" />
          <Moon className="text-amber-400 z-10" size={32} />
        </motion.div>
      );
    }
  };

  const desc = lunarData.mysticDescription[language as 'fr' | 'en' | 'ha'] || lunarData.mysticDescription.fr;
  const verseTrans = lunarData.protectiveVerse.translation[language as 'fr' | 'en' | 'ha'] || lunarData.protectiveVerse.translation.fr;
  const herbierUsage = lunarData.herbier.usage[language as 'fr' | 'en' | 'ha'] || lunarData.herbier.usage.fr;

  if (compact) {
    return (
      <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-amber-500/30 text-white shadow-xl flex items-center gap-4">
        <div className="shrink-0">{getMoonIconShape()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{lunarData.phaseName}</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">{lunarData.illumination}% illum.</span>
          </div>
          <p className="text-xs text-gray-300 mt-1 line-clamp-2">{desc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl border border-amber-500/30 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-4">
          {getMoonIconShape()}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-amber-300 tracking-tight">{lunarData.phaseName}</h3>
              <span className="text-sm font-arabic text-amber-200/90" dir="rtl">({lunarData.phaseNameAr})</span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5 flex items-center gap-2">
              <span>Lumière Lunaire : <strong className="text-amber-400 font-mono">{lunarData.illumination}%</strong></span>
              {isOfflineLoaded && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> IndexedDB Hors-ligne</span>}
            </p>
          </div>
        </div>

        <button
          onClick={() => playBinauralTone(lunarData.herbier.incenseBinauralHz)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shrink-0 ${
            isPlayingAudio 
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30' 
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
        >
          <Volume2 size={16} className={isPlayingAudio ? 'animate-bounce' : ''} />
          <span>Fréquence {lunarData.herbier.incenseBinauralHz}Hz</span>
        </button>
      </div>

      {/* Description */}
      <div className="mb-6 p-4 rounded-2xl bg-indigo-900/30 border border-indigo-700/40 text-sm text-indigo-100 leading-relaxed">
        <p className="flex items-start gap-2">
          <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={18} />
          <span>{desc}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* Verset Protecteur */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={16} /> Verset Protecteur de Phase
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                Sourate {lunarData.protectiveVerse.surah} (V.{lunarData.protectiveVerse.ayah})
              </span>
            </div>
            <p className="text-right text-lg sm:text-xl font-arabic leading-loose text-amber-100 my-2" dir="rtl">
              {lunarData.protectiveVerse.arabicText}
            </p>
            <p className="text-xs text-gray-300 italic mt-3 border-t border-slate-800 pt-2">
              "{verseTrans}"
            </p>
          </div>
        </div>

        {/* Herbier Mystique */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf size={16} /> Herbier Mystique Recommandé
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                {lunarData.herbier.incenseBinauralHz}Hz
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold mb-1">Plantes & Encens :</p>
                <div className="flex flex-wrap gap-1.5">
                  {lunarData.herbier.plants.map((plant, i) => (
                    <span key={i} className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 px-2.5 py-0.5 rounded-lg font-medium">
                      🌿 {plant}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] text-gray-400 font-semibold mb-1">Huiles Essentielles :</p>
                <div className="flex flex-wrap gap-1.5">
                  {lunarData.herbier.essentialOils.map((oil, i) => (
                    <span key={i} className="text-xs bg-amber-950/80 text-amber-300 border border-amber-800/50 px-2.5 py-0.5 rounded-lg font-medium">
                      💧 {oil}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 border-t border-slate-800 pt-2">
              <strong>Rituel :</strong> {herbierUsage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
