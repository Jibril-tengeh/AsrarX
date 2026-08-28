import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, ArrowLeft, BookOpen, Sparkles, Check, Copy, Heart, 
  ShieldAlert, ShieldCheck, Sun, Moon, HelpCircle, CheckCircle2, 
  Volume2, VolumeX, Download, AlertTriangle, Lightbulb, Gift, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { useFeatures } from '../../../contexts/FeatureContext';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../../../utils/downloadHelper';

interface QuranicIstikharaOutcome {
  id: string;
  verdictType: 'fath' | 'khayr' | 'tawakkul' | 'qabid' | 'sabr';
  verdictTitle: string;
  badgeColor: string;
  verseAr: string;
  surahRef: string;
  phonetic: string;
  translation: string;
  interpretation: string;
  actionPlan: {
    doAction: string;
    avoidAction: string;
    auspiciousTiming: string;
  };
  recommendedSadaqa: string;
  recommendedDhikr: string;
}

const QURANIC_ORACLES: QuranicIstikharaOutcome[] = [
  {
    id: 'fath-1',
    verdictType: 'fath',
    verdictTitle: 'Fath Mubīn (Ouverture Majeure & Bénédiction)',
    badgeColor: 'emerald',
    verseAr: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا ۝ لِيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِن ذَنبِكَ وَمَا تَأَخَّرَ وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُّسْتَقِيمًا',
    surahRef: 'Sourate Al-Fath (48:1-2)',
    phonetic: "Inna fatahna laka fathan mubina, li-yaghfira laka Allahu ma taqaddama min dhanbika wa ma ta'akhkhara wa yutimma ni'matahu 'alayka wa yahdiyaka siratan mustaqima.",
    translation: "En vérité Nous t'avons accordé une victoire éclatante, afin qu'Allah te pardonne tes péchés passés et futurs, parachève sur toi Son bienfait et te guide sur une voie droite.",
    interpretation: "Cette affaire est baignée d'une grâce et d'une ouverture divine manifeste. Toutes les énergies célestes sont favorables. Vous pouvez vous engager pleinement et sans crainte, car les portes de la réussite sont déverrouillées.",
    actionPlan: {
      doAction: "Passez immédiatement à l'action en plaçant votre confiance absolue en Allah (Tawakkul).",
      avoidAction: "Évitez le doute excessif ou la procrastination qui pourrait dissiper l'opportunité.",
      auspiciousTiming: "L'aube (après Fajr) ou le matin du vendredi pour poser le premier jalon."
    },
    recommendedSadaqa: "Offrez un repas chaud ou du pain blanc à des nécessiteux pour sceller la bénédiction.",
    recommendedDhikr: "يَا فَتَّاحُ يَا عَلِيمُ (489 fois après la prière du matin)"
  },
  {
    id: 'khayr-1',
    verdictType: 'khayr',
    verdictTitle: 'Khayr Maknūn (Bienfait Caché & Patience Récompensée)',
    badgeColor: 'blue',
    verseAr: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ ۗ وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ',
    surahRef: 'Sourate Al-Baqarah (2:216)',
    phonetic: "Wa 'asa an takrahu shay'an wa huwa khayrun lakum, wa 'asa an tuhibbu shay'an wa huwa sharrun lakum, wa Allahu ya'lamu wa antum la ta'lamun.",
    translation: "Il se peut que vous ayez de l'aversion pour une chose alors qu'elle est un bien pour vous. Et il se peut que vous aimiez une chose alors qu'elle est un mal pour vous. C'est Allah qui sait, alors que vous ne savez pas.",
    interpretation: "La situation semble comporter des aspérités ou des contrariétés superficielles, mais elle recèle en réalité une immense protection et un trésor spirituel déguisé. Ne jugez pas d'après les apparences immédiates.",
    actionPlan: {
      doAction: "Adoptez la flexibilité et acceptez les ajustements nécessaires sans forcer les portes verrouillées.",
      avoidAction: "Ne cédez pas à l'amertume ou au jugement hâtif.",
      auspiciousTiming: "La nuit du lundi ou le milieu de semaine pour réévaluer sereinement."
    },
    recommendedSadaqa: "Faites un don discret en monnaie pour conjurer les obstacles.",
    recommendedDhikr: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ (450 fois par jour)"
  },
  {
    id: 'tawakkul-1',
    verdictType: 'tawakkul',
    verdictTitle: 'Tawakkul & Mujāhada (Effort Nécessaire & Soutien Divin)',
    badgeColor: 'amber',
    verseAr: 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ ۝ إِن يَنصُرْكُمُ اللَّهُ فَلَا غَالِبَ لَكُمْ',
    surahRef: 'Sourate Ali \'Imran (3:159-160)',
    phonetic: "Fa-idha 'azamta fa-tawakkal 'ala Allahi, inna Allaha yuhibbul-mutawakkilin. In yansurkumu Allahu fala ghaliba lakum.",
    translation: "Puis de même, quand tu t'es décidé, confie-toi à Allah, car Allah aime ceux qui se confient à Lui. Si Allah vous donne Son secours, nul ne peut vous vaincre.",
    interpretation: "Cette affaire exige une fermeté de volonté (Azm) et un labeur sincère. Le succès ne viendra pas sans sacrifice ni organisation, mais la providence divine vous accompagnera à chaque pas si votre intention reste pure.",
    actionPlan: {
      doAction: "Structurez précisément votre plan d'action, consultez des personnes sages et compétentes.",
      avoidAction: "Ne comptez pas uniquement sur la chance ; redoublez de rigueur et d'engagement.",
      auspiciousTiming: "Le début de matinée d'un mardi ou d'un jeudi."
    },
    recommendedSadaqa: "Aidez un étudiant ou partagez de la nourriture avec vos voisins.",
    recommendedDhikr: "يَا قَوِيُّ يَا مَتِينُ يَا وَكِيلُ (116 fois)"
  },
  {
    id: 'qabid-1',
    verdictType: 'qabid',
    verdictTitle: 'Qabid & Prudence Divine (Avertissement & Retenue)',
    badgeColor: 'rose',
    verseAr: 'فَاعْرِضْ عَنْهُمْ وَانتَظِرْ إِنَّهُم مُّنتَظِرُونَ ۝ وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِ أَزْوَاجًا مِّنْهُمْ',
    surahRef: 'Sourate As-Sajdah (32:30) & Ta-Ha',
    phonetic: "Fa-a'rid 'anhum wantazir innahum muntazirun. Wa la tamuddanna 'aynayka ila ma matta'na bihi azwajan minhum.",
    translation: "Écarte-toi d'eux et attends. Eux aussi attendent. Et ne tends point tes yeux vers ce dont Nous avons gratifié certains d'entre eux.",
    interpretation: "Cette consultation révèle des voiles d'obscurité, des pièges cachés ou des conflits d'intérêts. Il est fortement déconseillé de vous précipiter dans cette voie pour le moment. La sagesse commande de s'abstenir ou de reporter.",
    actionPlan: {
      doAction: "Prenez du recul, protégez vos secrets et vos acquis, et observez l'évolution sans vous engager financièrement ou émotionnellement.",
      avoidAction: "Évitez tout contrat hâtif, toute alliance douteuse ou tout investissement majeur.",
      auspiciousTiming: "Période de retenue spirituelle et de jeûne volontaire."
    },
    recommendedSadaqa: "Donnez une aumône de purification (sel, eau ou vêtements) pour repousser les nuisances.",
    recommendedDhikr: "يَا حَفِيظُ يَا مَانِعُ يَا سَلَامُ (336 fois matin et soir)"
  },
  {
    id: 'sabr-1',
    verdictType: 'sabr',
    verdictTitle: 'Sabr Jamīl (Patience Sublime & Mûrissement)',
    badgeColor: 'purple',
    verseAr: 'فَاصْبِرْ صَبْرًا جَمِيلًا ۝ إِنَّهُمْ يَرَوْنَهُ بَعِيدًا ۝ وَنَرَاهُ قَرِيبًا',
    surahRef: 'Sourate Al-Ma\'arij (70:5-7)',
    phonetic: "Fasbir sabran jamila, innahum yarawnahu ba'ida, wa narahu qariba.",
    translation: "Fais preuve d'une belle patience. Ils le voient bien loin, alors que Nous le voyons tout proche.",
    interpretation: "Le moment idéal n'est pas encore venu. L'affaire n'est pas mauvaise en soi, mais les conditions célestes et terrestres ne sont pas encore mûres. La précipitation gâcherait le fruit.",
    actionPlan: {
      doAction: "Consacrez cette période à la préparation intérieure, à l'apprentissage et au perfectionnement.",
      avoidAction: "Ne forcez pas le destin et ne cédez pas à l'impatience.",
      auspiciousTiming: "Le dernier tiers de la nuit pour invoquer la clairvoyance."
    },
    recommendedSadaqa: "Offrez de l'eau fraîche aux passants ou dans un lieu de culte.",
    recommendedDhikr: "يَا صَبُورُ يَا حَلِيمُ (298 fois)"
  }
];

const PROPHETIC_DUA = {
  ar: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ العَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ.",
  phonetic: "Allahumma inni astakhiruka bi-'ilmika, wa astaqdiruka bi-qudratika, wa as'aluka min fadlika al-'azim, fa-innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa anta 'allamu al-ghuyub. Allahumma in kunta ta'lamu anna hadha al-amra khayrun li fi dini wa ma'ashi wa 'aqibati amri faqdurhu li wa yassirhu li thumma barik li fih. Wa in kunta ta'lamu anna hadha al-amra sharrun li fi dini wa ma'ashi wa 'aqibati amri fasrifhu 'anni wasrifni 'anhu, waqdur li al-khayra haythu kana thumma ardini bih.",
  fr: "Ô Allah ! Je Te consulte par Ta science, je Te demande le pouvoir par Ta puissance et je Te sollicite de Ton immense bienfait. Car Tu peux et je ne peux rien, Tu sais et je ne sais rien, et Tu es le Connaisseur suprême des mystères. Ô Allah ! Si Tu sais que cette affaire est un bien pour moi dans ma religion, ma vie présente et l'issue de mon existence, accorde-la-moi, facilite-la-moi, puis bénis-la pour moi. Et si Tu sais que cette affaire est un mal pour moi dans ma religion, ma vie présente et l'issue de mon existence, écarte-la de moi et écarte-moi d'elle, et décrète pour moi le bien où qu'il soit, puis rends-m'en satisfait.",
  en: "O Allah! I seek Your guidance through Your knowledge, and I seek ability through Your power, and I ask You for Your great grace. For You have power and I have none, You know and I know not, and You are the Knower of the unseen. O Allah! If You know that this matter is good for me in my religion, my livelihood, and the end of my affairs, then ordain it for me, make it easy for me, and bless it for me. And if You know that this matter is evil for me in my religion, my livelihood, and the end of my affairs, then turn it away from me and turn me away from it, and ordain for me what is good wherever it may be, and make me pleased with it.",
  ha: "Ya Allah! Ina neman zaɓinka ta hanyar iliminka, ina neman ikonka ta hanyar ƙarfinka, kuma ina roƙonka daga falalarka mai girma. Domin lallai Kana da iko ni ba ni da shi, Ka sani ni ban sani ba, kuma Kai ne Masanin abubuwan ɓoye. Ya Allah! Idan Ka san cewa wannan al'amari alheri ne a gare ni a cikin addinina, rayuwata da karshen lamurana, to Ka kaddara mini shi, Ka saukake mini shi, sannan Ka sanya mini albarka a cikinsa. Idan kuma Ka san wannan al'amari sharri ne a gare ni, to Ka kawar da shi daga gare ni, Ka kaddara mini alheri a duk inda yake, sannan Ka sanya ni in yarda da shi."
};

const istikharaI18n = {
  fr: {
    title: "Système de Consultation Istikhara Coranique Avancée",
    desc: "Protocole spirituel authentique combinant le tirage par l'Abjad coranique, l'interprétation contextuelle et le guide rituel de la Sunnah.",
    tabConsultation: "Tirage & Diagnostic Coranique",
    tabGuide: "Protocole & Prière Pas à Pas",
    intentionLabel: "Votre Niyyah / Question Précise",
    intentionPlaceholder: "Ex: Ce projet de mariage / ce nouveau partenariat professionnel m'est-il bénéfique ?",
    seekerNameLabel: "Prénom du Demandeur",
    seekerNamePlaceholder: "Ex: Ibrahim",
    motherNameLabel: "Prénom de la Mère (Optionnel)",
    motherNamePlaceholder: "Ex: Maryam",
    drawBtn: "Consulter la Table Coranique Sacrée",
    drawingText: "Dévoilement des Feuillets & Calcul d'Abjad...",
    verseRevealedTitle: "Verset Révélé pour votre Situation :",
    phoneticLabel: "Phonétique / Récitation :",
    translationLabel: "Traduction Spirituelle :",
    interpretationTitle: "Exégèse & Diagnostic de l'Âme :",
    actionPlanTitle: "Plan d'Actions Recommandées :",
    doTitle: "Ce qu'il faut faire :",
    avoidTitle: "Ce qu'il faut éviter :",
    timingTitle: "Moment propice d'agir :",
    sadaqaTitle: "Aumône (Sadaqa) Préconisée :",
    dhikrTitle: "Dhikr Quotidien de Renfort :",
    savePngBtn: "Télécharger PNG",
    copySummaryBtn: "Copier la Synthèse",
    copied: "Copié avec succès !",
    guideTitle: "Guide Rituel de la Prière d'Istikhara (Salāt al-Istikhāra)",
    step1Title: "1. Purification & État de Présence (Wudu)",
    step1Desc: "Accomplissez des ablutions parfaites, portez des vêtements propres et tournez-vous vers la Qibla dans un lieu paisible.",
    step2Title: "2. Les Deux Rakaats Sacrées",
    step2Desc: "Priez 2 rakaats surérogatoires. Dans la 1ère après Al-Fatiha, récitez Sourate Al-Kafirun (109). Dans la 2ème après Al-Fatiha, récitez Sourate Al-Ikhlas (112).",
    step3Title: "3. L'Invocation Prophétique (Du'ā)",
    step3Desc: "Après le Salām final, levez les mains avec humilité et récitez l'invocation transmise par le Prophète (SAW).",
    step4Title: "4. Discernement & Signes de Réponse",
    step4Desc: "La réponse se manifeste par l'apaisement du cœur, l'alignement naturel des événements et l'éloignement sans regret des obstacles.",
    playDuaAudio: "Écouter l'Harmonie du Du'ā",
    stopDuaAudio: "Arrêter l'Audio"
  },
  en: {
    title: "Advanced Quranic Istikhara Consultation System",
    desc: "Authentic spiritual protocol combining Quranic Abjad draw, contextual interpretation, and step-by-step Sunnah ritual guide.",
    tabConsultation: "Draw & Quranic Diagnosis",
    tabGuide: "Step-by-Step Prayer Guide",
    intentionLabel: "Your Niyyah / Specific Question",
    intentionPlaceholder: "E.g.: Is this marriage proposal / business venture beneficial for my future?",
    seekerNameLabel: "Seeker's First Name",
    seekerNamePlaceholder: "E.g.: Ibrahim",
    motherNameLabel: "Mother's First Name (Optional)",
    motherNamePlaceholder: "E.g.: Maryam",
    drawBtn: "Consult the Sacred Quranic Table",
    drawingText: "Unveiling Sacred Folios & Abjad Reckoning...",
    verseRevealedTitle: "Revealed Verse for Your Situation:",
    phoneticLabel: "Phonetics / Recitation:",
    translationLabel: "Spiritual Translation:",
    interpretationTitle: "Exegesis & Soul Diagnosis:",
    actionPlanTitle: "Recommended Action Plan:",
    doTitle: "What to do:",
    avoidTitle: "What to avoid:",
    timingTitle: "Auspicious timing:",
    sadaqaTitle: "Recommended Charity (Sadaqa):",
    dhikrTitle: "Daily Reinforcement Dhikr:",
    savePngBtn: "Download PNG",
    copySummaryBtn: "Copy Summary",
    copied: "Copied successfully!",
    guideTitle: "Ritual Guide of Istikhara Prayer (Salāt al-Istikhāra)",
    step1Title: "1. Purification & Sacred Mindset (Wudu)",
    step1Desc: "Perform thorough ablutions, wear clean clothing, and face the Qibla in a quiet serene setting.",
    step2Title: "2. The Two Sacred Units (Raka'at)",
    step2Desc: "Pray 2 non-obligatory units. In unit 1 after Al-Fatiha, recite Surah Al-Kafirun (109). In unit 2 after Al-Fatiha, recite Surah Al-Ikhlas (112).",
    step3Title: "3. The Prophetic Supplication (Du'ā)",
    step3Desc: "After the final Salam, raise your hands with humility and recite the authentic Du'a taught by the Prophet (PBUH).",
    step4Title: "4. Discernment & Signs of Divine Answer",
    step4Desc: "The answer manifests through inner peace, natural ease of circumstances, and effortless departure of obstacles.",
    playDuaAudio: "Play Du'ā Tone Drone",
    stopDuaAudio: "Stop Audio"
  },
  ha: {
    title: "Tsarin Neman Zaɓi Na Istikhara Ta Alqur'ani",
    badge: "Tsarin Sunnah da Lissafin Abjad",
    desc: "Cikakken tsarin neman zaɓi da shiriya wanda ya haɗa lissafin ayoyin Alqur'ani, fassara mai zurfi da koyarwar Annabi (SAW).",
    tabConsultation: "Duba & Fassarar Ayoyi",
    tabGuide: "Yadda Ake Salla & Addu'a",
    intentionLabel: "Niyya ko Tambaya Ta Musamman",
    intentionPlaceholder: "Misali: Shin wannan aure / wannan sabon aiki yana da alheri a gare ni?",
    seekerNameLabel: "Sunan Mai Neman Shiriya",
    seekerNamePlaceholder: "Misali: Ibrahim",
    motherNameLabel: "Sunan Uwa (Ba Dole Ba)",
    motherNamePlaceholder: "Misali: Maryam",
    drawBtn: "Duba Shiriya Daga Allon Alqur'ani",
    drawingText: "Ana buɗe ayoyi da lissafin asiri...",
    verseRevealedTitle: "Ayar Da Ta Fito Don Lamarin Ku:",
    phoneticLabel: "Karatu / Lafazi:",
    translationLabel: "Fassarar Ayar:",
    interpretationTitle: "Tafsiri & Shiriyar Zuciya:",
    actionPlanTitle: "Matakan Da Ya Kamata A Dauka:",
    doTitle: "Abin da ya kamata a yi:",
    avoidTitle: "Abin da ya kamata a kiyaye:",
    timingTitle: "Lokaci mafi kyau:",
    sadaqaTitle: "Sadakar Da Aka Bada Shawara:",
    dhikrTitle: "Zikirin Yau da Kullum:",
    savePngBtn: "Zazzage PNG",
    copySummaryBtn: "Kwafi Bayanin",
    copied: "An kwafa cikin nasara!",
    guideTitle: "Yadda Ake Sallar Istikhara Mataki-Mataki",
    step1Title: "1. Tsarki & Niyya Mai Kyau (Alwala)",
    step1Desc: "Yi cikakkiyar alwala, saka tufafi masu tsarki, kuma fuskanci Alƙibla a wuri mai natsuwa.",
    step2Title: "2. Raka'o'i Biyu na Musamman",
    step2Desc: "Ka yi salla raka'a 2. A raka'ar farko bayan Fatiha karanta Suratul Kafirun. A raka'a ta biyu bayan Fatiha karanta Suratul Ikhlas.",
    step3Title: "3. Addu'ar Istikhara Ta Annabi (SAW)",
    step3Desc: "Bayan ka yi sallama, ɗaga hannaye da kaskantar da kai ka karanta addu'ar da Annabi (SAW) ya koyar.",
    step4Title: "4. Gane Amsar Istikhara",
    step4Desc: "Amsar tana bayyana ne ta hanyar natsuwar zuciya, sauƙaƙewar lamari, da kawar da cikas ba tare da bacin rai ba.",
    playDuaAudio: "Saurari Sautin Addu'a",
    stopDuaAudio: "Tsai da Sauti"
  }
};

export const Istikhara: React.FC = () => {
  const { language } = useLanguage();
  const { isPremium } = useAuth();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const langKey = (language as 'fr' | 'en' | 'ha') || 'fr';
  const txt = istikharaI18n[langKey] || istikharaI18n.fr;

  // Tabs: 'consultation' | 'guide'
  const [activeTab, setActiveTab] = useState<'consultation' | 'guide'>('consultation');

  // Input states
  const [intention, setIntention] = useState('');
  const [seekerName, setSeekerName] = useState('');
  const [motherName, setMotherName] = useState('');

  // Results state
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<QuranicIstikharaOutcome | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Audio Synth for Dua meditation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playDuaSound = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Spiritual Hijaz/Nahawand ambient drone (F3, C4, G4, A#4)
      const freqs = [174.61, 261.63, 392.00, 466.16];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.05 / (idx + 1), ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });

      setIsPlayingAudio(true);
    } catch (e) {
      console.error(e);
    }
  };

  const performConsultation = () => {
    if (!intention || intention.trim().length < 3) return;

    setIsDrawing(true);
    setResult(null);

    // Calculate traditional seed using Abjad of intention + names
    const textToCalc = `${intention} ${seekerName} ${motherName}`.trim();
    const abjadVal = calculateAbjadValue(textToCalc) || 129;

    setTimeout(() => {
      const selectedIndex = abjadVal % QURANIC_ORACLES.length;
      setResult(QURANIC_ORACLES[selectedIndex]);
      setIsDrawing(false);
    }, 1800);
  };

  const downloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#09090b', skipFonts: true });
      await downloadCanvasImage(canvas, 'istikhara-coranique-asrarhub.png');
    } catch (e) {
      console.error(e);
    }
  };

  const copySummary = () => {
    if (disableDuaCopy || !result) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const text = `=== CONSULTATION ISTIKHARA CORANIQUE AVANCÉE ===
Intention / Question : "${intention}"
Demandeur : ${seekerName || 'Anonyme'} ${motherName ? `(fils/fille de ${motherName})` : ''}

VERDICT : ${result.verdictTitle}
VERSET RÉVÉLÉ :
${result.verseAr}
(${result.surahRef})

TRADUCTION :
« ${result.translation} »

EXÉGÈSE & DIAGNOSTIC :
${result.interpretation}

PLAN D'ACTION :
- À faire : ${result.actionPlan.doAction}
- À éviter : ${result.actionPlan.avoidAction}
- Moment propice : ${result.actionPlan.auspiciousTiming}

SADAQA CONSEILLÉE : ${result.recommendedSadaqa}
DHIKR RECOMMANDÉ : ${result.recommendedDhikr}
=================================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/tools" 
          className="p-2.5 -ml-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
        >
          <ArrowLeft size={22} />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-300 text-[11px] font-black uppercase tracking-wider mb-1">
            <Compass size={13} className="text-teal-500" />
            <span>Guidance Coranique & Sunnah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-teal-600 dark:text-teal-400" />
            {txt.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {txt.desc}
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-zinc-200/70 dark:bg-zinc-800/70 p-1 rounded-2xl mb-6 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('consultation')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'consultation'
              ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Compass size={16} />
          <span>{txt.tabConsultation}</span>
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          <span>{txt.tabGuide}</span>
        </button>
      </div>

      <ToolInfoTooltip toolId="istikhara" />

      {activeTab === 'consultation' ? (
        <>
          {/* Consultation Form */}
          <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-7 shadow-lg border border-zinc-200/80 dark:border-zinc-800 mb-8 backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-teal-500" />
                  <span>{txt.intentionLabel}</span>
                </label>
                <textarea
                  rows={2}
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder={txt.intentionPlaceholder}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-sm sm:text-base text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-medium resize-none shadow-inner"
                  disabled={isDrawing}
                />
              </div>

              {/* Names input (classical traditional calculation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    {txt.seekerNameLabel}
                  </label>
                  <input
                    type="text"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value)}
                    placeholder={txt.seekerNamePlaceholder}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    {txt.motherNameLabel}
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder={txt.motherNamePlaceholder}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                onClick={performConsultation}
                disabled={isDrawing || intention.trim().length < 3}
                className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-teal-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isDrawing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Compass size={20} />
                    </motion.div>
                    <span>{txt.drawingText}</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    <span>{txt.drawBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results View */}
          <AnimatePresence mode="wait">
            {result && !isDrawing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div 
                  ref={resultRef}
                  className="bg-zinc-950 rounded-3xl p-5 sm:p-8 border-2 border-teal-800/50 shadow-2xl w-full text-white space-y-6 relative overflow-hidden"
                >
                  {/* Badge Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-black tracking-wider uppercase">
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Istikhara Coranique Révélée</span>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      result.badgeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      result.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      result.badgeColor === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      result.badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {result.verdictTitle}
                    </span>
                  </div>

                  {/* Quranic Verse Block */}
                  <div className="bg-gradient-to-b from-teal-950/50 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-3xl border border-teal-600/30 space-y-4 text-center">
                    <span className="text-xs font-bold text-teal-300 uppercase tracking-widest block">
                      {txt.verseRevealedTitle} ({result.surahRef})
                    </span>
                    <p className="text-2xl sm:text-3xl font-arabic text-amber-100 leading-loose font-bold whitespace-pre-line drop-shadow-md" dir="rtl">
                      {result.verseAr}
                    </p>
                    <div className="pt-2 border-t border-zinc-800 text-left">
                      <p className="text-xs text-zinc-400 italic mb-1">
                        <strong>{txt.phoneticLabel}</strong> {result.phonetic}
                      </p>
                      <p className="text-sm font-serif text-teal-100 leading-relaxed">
                        <strong>{txt.translationLabel}</strong> « {result.translation} »
                      </p>
                    </div>
                  </div>

                  {/* Exegesis / Soul Diagnostic */}
                  <div className="bg-zinc-900/80 p-5 rounded-2xl border border-teal-900/40 text-left space-y-2">
                    <strong className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                      <Heart size={15} className="text-teal-400" />
                      {txt.interpretationTitle}
                    </strong>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {result.interpretation}
                    </p>
                  </div>

                  {/* 3-Step Action Plan */}
                  <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 text-left space-y-3">
                    <strong className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Lightbulb size={15} className="text-amber-400" />
                      {txt.actionPlanTitle}
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-emerald-950/30 border border-emerald-800/30 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-emerald-300 block mb-1 flex items-center gap-1">
                          <CheckCircle2 size={13} /> {txt.doTitle}
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed">{result.actionPlan.doAction}</p>
                      </div>
                      <div className="bg-rose-950/30 border border-rose-800/30 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-rose-300 block mb-1 flex items-center gap-1">
                          <ShieldAlert size={13} /> {txt.avoidTitle}
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed">{result.actionPlan.avoidAction}</p>
                      </div>
                      <div className="bg-cyan-950/30 border border-cyan-800/30 p-3 rounded-xl">
                        <span className="text-[11px] font-bold text-cyan-300 block mb-1 flex items-center gap-1">
                          <Sun size={13} /> {txt.timingTitle}
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed">{result.actionPlan.auspiciousTiming}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sadaqa & Dhikr Recommendations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                      <strong className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                        <Gift size={14} className="text-amber-400" />
                        {txt.sadaqaTitle}
                      </strong>
                      <p className="text-xs text-zinc-300 leading-relaxed">{result.recommendedSadaqa}</p>
                    </div>
                    <div className="bg-teal-950/30 border border-teal-500/30 p-4 rounded-2xl space-y-1">
                      <strong className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase">
                        <Sparkles size={14} className="text-teal-400" />
                        {txt.dhikrTitle}
                      </strong>
                      <p className="text-xs text-zinc-200 font-bold leading-relaxed">{result.recommendedDhikr}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  <button 
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer"
                  >
                    <Download size={16} className="text-emerald-400" />
                    <span>{txt.savePngBtn}</span>
                  </button>
                  {!disableDuaCopy && (
                    <button 
                      onClick={copySummary}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors shadow-lg cursor-pointer"
                    >
                      {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                      <span>{copied ? txt.copied : txt.copySummaryBtn}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Guide Rituel Pas à Pas */
        <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-5 sm:p-8 shadow-lg border border-zinc-200/80 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Compass className="text-teal-500" />
              {txt.guideTitle}
            </h2>
            <button
              onClick={playDuaSound}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-teal-500/20 text-teal-700 dark:text-teal-300 hover:bg-teal-500/30'
              }`}
            >
              {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingAudio ? txt.stopDuaAudio : txt.playDuaAudio}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                {txt.step1Title}
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {txt.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                {txt.step2Title}
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {txt.step2Desc}
              </p>
            </div>
          </div>

          {/* Full Prophetic Dua Box */}
          <div className="bg-gradient-to-br from-teal-950/70 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-teal-500/40 text-white space-y-4 shadow-inner">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block text-center">
              {txt.step3Title}
            </span>
            
            {/* Arabic Text */}
            <p className="text-lg sm:text-xl font-arabic text-amber-100 leading-loose text-center font-bold" dir="rtl">
              {PROPHETIC_DUA.ar}
            </p>

            {/* Phonetic */}
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300 block mb-1">Phonétique :</strong>
              {PROPHETIC_DUA.phonetic}
            </div>

            {/* Translation */}
            <div className="pt-2 border-t border-zinc-800 text-xs sm:text-sm text-teal-100 font-serif leading-relaxed italic">
              <strong className="text-teal-300 not-italic block mb-1">Traduction :</strong>
              « {PROPHETIC_DUA[langKey] || PROPHETIC_DUA.fr} »
            </div>
          </div>

          {/* Step 4: Signs */}
          <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Moon size={15} />
              {txt.step4Title}
            </span>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {txt.step4Desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Istikhara;
