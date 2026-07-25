import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, ArrowLeft, Moon, Star, Wind, Flame, Droplets, Mountain, Key, Shield, Sparkles, 
  BookOpen, Compass, Search, Filter, Volume2, CheckCircle2, ChevronRight, Copy, Check, Calculator, Clock, Layers, Heart, Grid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { triggerProtectionModal } from '../../../components/ContentProtectionManager';
import { motion, AnimatePresence } from 'motion/react';
import { SpiritualCompatibilityTawafuq } from '../../../components/SpiritualCompatibilityTawafuq';
import { KhatimWafqGenerator } from '../../../components/KhatimWafqGenerator';
import { PlanetaryLetterClock } from '../../../components/PlanetaryLetterClock';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface LetterInfo {
  char: string;
  name: string;
  nameAr: string;
  element: 'Feu' | 'Terre' | 'Air' | 'Eau';
  nature: 'Lumineuse (Nourani)' | 'Sombre (Zulmani)';
  angel: string;
  angelArabic: string;
  demon: string;
  demonArabic: string;
  incense: string;
  planet: string;
  surah: string;
  abjad: number;
  abjadKabir: number;
  bodyPart: string;
  secret: string;
  secretWird: {
    title: string;
    master: string;
    repetitionCount: number;
    arabicText: string;
    transliteration: string;
    translation: string;
    benefits: string[];
    bestTime: string;
  };
}

export const GRAND_MASTER_WORDS = [
  {
    id: 'ibn_arabi_alif',
    letterChar: 'ا',
    title: "Wird Al-Alif Al-A'zam (Le Secret de l'Unité Primordiale)",
    master: "Cheikh al-Akbar Ibn 'Arabi (Al-Futuhat al-Makkiyya)",
    targetLetter: "Alif (ا)",
    repetitionCount: 111,
    arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِسِرِّ الأَلِفِ القَائِمِ الدَّائِمِ الَّذِي اسْتَمَدَّتْ مِنْهُ السَّماوَاتُ وَالأَرْضُونَ، أَنْ تُقِيمَ لِسَانِي بِالحَقِّ وَتَمْلأَ قَلْبِي بِنُورِ المَعْرِفَةِ.",
    transliteration: "Allahumma inni as'aluka bi-sirri al-Alifi al-qa'imi ad-da'imi alladhi istamaddat minhu as-samawatu wal-arduna, an tuqima lisani bil-haqqi wa tamla'a qalbi bi-nuri al-ma'rifah.",
    translation: "Ô Allah, je Te demande par le secret de l'Alif dressé et éternel dont s'agrippent les cieux et la terre, d'affermir ma langue dans la vérité et de remplir mon cœur de la lumière de la connaissance gnostique.",
    ritual: "À réciter au lever du soleil (Fajr) orienté vers la Qibla, en brûlant de l'encens de Musc pur ou du Luban Dhakar.",
    benefits: ["Élévation de la conscience spirituelle", "Clarté d'esprit et charisme royal", "Ouverture des verrous psychiques"]
  },
  {
    id: 'ghazali_qaf',
    letterChar: 'ق',
    title: "Wird Al-Qaf Al-Qahhariyya (La Domination des Forces Subtiles)",
    master: "Hujjat al-Islam Imam Al-Ghazali",
    targetLetter: "Qaf (ق)",
    repetitionCount: 100,
    arabicText: "يَا قَادِرُ يَا قَهَّارُ بِسِرِّ القَافِ المَجِيدَةِ، أَلْقِ هَيْبَتِي فِي قُلُوبِ الخَلْقِ وَاحْفَظْنِي مِنْ جَمِيعِ المَكْرُوهَاتِ.",
    transliteration: "Ya Qadiru ya Qahharu bi-sirri al-Qafi al-majidah, alqi haybati fi qulubi al-khalqi wa-hfazni min jami'i al-makruhat.",
    translation: "Ô Tout-Puissant, Ô Dominateur Suprême, par le secret du Qaf glorieux, insuffle le respect et la vénération dans les cœurs des créatures et préserve-moi de toute détresse.",
    ritual: "Idéalement le mardi à l'heure planétaire de Mars ou Jupiter.",
    benefits: ["Prestige auprès des décideurs", "Invulnérabilité contre la magie noire", "Succès judiciaire"]
  },
  {
    id: 'ghazali_muthallath',
    letterChar: 'ح',
    title: "Wird Al-Muthallath Al-Ghazali (Le Secret de la Grâce & du Dénouement)",
    master: "Hujjat al-Islam Imam Al-Ghazali",
    targetLetter: "Ha (ح) / Kaf (ك)",
    repetitionCount: 129,
    arabicText: "يَا لَطِيفًا لَمْ يَزَلْ أُلْطُفْ بِنَا فِيمَا نَزَلْ، إِنَّكَ لَطِيفٌ لَمْ تَزَلْ، أُلْطُفْ بِنَا وَالمُسْلِمِينَ، بِسِرِّ سِرِّ خَاتَمِ الغَزَالِيِّ وَالمِفْتَاحِ المُبَارَكِ.",
    transliteration: "Ya Latifan lam yazal ultuf bina fima nazal, innaka Latifun lam yazal, ultuf bina wal-Muslimin, bi-sirri sirri khatami al-Ghazali wal-miftahi al-mubarak.",
    translation: "Ô Subtil Dévoué Qui ne cesse d'être Doux, sois Doux envers nous dans les épreuves qui descendent. Tu es le Subtil Incomparable, étends Ta bienveillance sur nous par le mystère céleste du Sceau de Ghazali.",
    ritual: "À réciter 129 fois après la prière du Fajr ou lors d'un besoin urgent avec fumigation d'Oliban ou de Mastic.",
    benefits: ["Résolution miracle des difficultés inextricables", "Protection contre l'oppression", "Attraction de la douceur divine"]
  },
  {
    id: 'jilani_kaf',
    letterChar: 'ك',
    title: "Wird Al-Sultani Al-Qadiri (Le Secret de la Souveraineté Spirituelle)",
    master: "Sultan al-Awliya Cheikh 'Abdul Qadir al-Jilani",
    targetLetter: "Kaf (ك) / KHYAS",
    repetitionCount: 111,
    arabicText: "يَا عَزِيزُ يَا كَافِي يَا قَادِرُ يَا مَقْتَدِرُ، اكْفِنِي شَرَّ مَا أَخَافُ وَأَحْذَرُ، وَأَلْبِسْنِي خِلْعَةَ التَّمْكِينِ وَالعِزَّةِ فِي الدَّارَيْنِ.",
    transliteration: "Ya 'Azizu ya Kafi ya Qadiru ya Muqtadir, ikfini sharra ma akhafu wa ahdhar, wa albisni khil'ata at-tamkini wal-'izzati fi ad-darayn.",
    translation: "Ô Puissant, Ô Suffisant, Ô Déterminant, Ô Omnipotent ! Suffis-moi contre tout ce que je crains et appréhende, et revêts-moi du manteau de la souveraineté spirituelle et de la noblesse dans les deux mondes.",
    ritual: "Après la prière du Sobh ou lors du Tahajjud en fumigeant du bois d'Oud pur.",
    benefits: ["Courage inébranlable et sérénité", "Rayonnement de l'autorité spirituelle", "Guérison des peurs et faiblesses"]
  },
  {
    id: 'nawawi_bism',
    letterChar: 'ب',
    title: "Hizb Al-Hifz Wal-Aman (Le Bouclier des Prophètes & Pieux)",
    master: "Imam Yahya ibn Sharaf Al-Nawawi",
    targetLetter: "Ba (ب) / Alif (ا)",
    repetitionCount: 3,
    arabicText: "بِسْمِ اللهِ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، أَقُولُ عَلَى نَفْسِي وَعَلَى دِينِي وَعَلَى أَهْلِي وَعَلَى أَوْلاَدِي وَعَلَى مَالِي وَعَلَى أَصْحَابِي أَلْفَ بِسْمِ اللهِ.",
    transliteration: "Bismillahi, Allahu Akbar, Allahu Akbar, Allahu Akbar, aqulu 'ala nafsi wa 'ala dini wa 'ala ahli wa 'ala awladi wa 'ala mali wa 'ala as-habi alfa Bismillah.",
    translation: "Au nom d'Allah, Allah est le Plus Grand (3x) ! Je place sous la garde d'un millier de 'Bismillah' mon âme, ma foi, ma famille, mes enfants, mes biens et mes compagnons.",
    ritual: "Récitation rituelle chaque matin au lever du jour et chaque soir au coucher du soleil.",
    benefits: ["Immunité absolue contre le mauvais œil et la sorcellerie", "Protection intégrale du foyer et des enfants", "Inviolabilité de l'esprit"]
  },
  {
    id: 'albuni_mim',
    letterChar: 'م',
    title: "Wird Al-Mim Al-Muhammadiyya (Le Sceau des Mystères)",
    master: "Imam Ahmad al-Buni (Shams al-Ma'arif al-Kubra)",
    targetLetter: "Mim (م)",
    repetitionCount: 40,
    arabicText: "يَا قَيُّومُ يَا مَنَّانُ بِسِرِّ المِيمِ المَحْمُودَةِ، اكْشِفْ لِي عَنْ حَقَائِقِ الأَشْيَاءِ وَافْتَحْ لِي أَبْوَابَ الرَّحْمَةِ المَغْلُوقَةِ.",
    transliteration: "Ya Qayyumu ya Mannanu bi-sirri al-Mimi al-mahmudati, ikshif li 'an haqa'iqi al-ashya'i wa-ftah li abwaba ar-rahmati al-maghluqah.",
    translation: "Ô Éternel Subsitant, Ô Dispensateur de grâces, par le mystère du Mim béni, dévoile-moi la réalité ultime des êtres et déverrouille les trésors cachés de Ta grâce.",
    ritual: "Exécuter 40 répétitions chaque soir pendant 40 jours consécutifs avec fumigation de clou de girofle.",
    benefits: ["Acquisition de la sagesse inspirée (Ilm Ladunni)", "Protection contre l'orgueil", "Paix intérieure profonde"]
  },
  {
    id: 'tijani_nun',
    letterChar: 'ن',
    title: "Wird Al-Nun Wal-Qalam (L'Encre de la Table Gardée)",
    master: "Cheikh Ahmad At-Tijani",
    targetLetter: "Nun (ن)",
    repetitionCount: 106,
    arabicText: "ن وَالْقَلَمِ وَمَا يَسْطُرُونَ، اللَّهُمَّ نَوِّرْ بَصِيرَتِي بِنُورِ النُّونِ، وَاجْعَلْنِي مِنَ الَّذِينَ هَدَيْتَهُمْ إِلَى صِرَاطِكَ المُسْتَقِيمِ.",
    transliteration: "Nun wal-qalami wa ma yasturun. Allahumma nawwir basirati bi-nuri an-Nuni, wa-j'alni mina alladhina hadaytahum ila siratika al-mustaqim.",
    translation: "Nun. Par la plume et ce qu'ils écrivent. Ô Allah, illumine ma vision intérieure par la lumière du Nun, et compte-moi parmi ceux que Tu as guidés sur Ton droit chemin.",
    ritual: "Récitation après la prière du 'Isha, idéalement les nuits de pleine lune.",
    benefits: ["Activation du Kashf (Vision subtile)", "Amélioration de la mémoire et des capacités d'apprentissage", "Protection des enfants"]
  },
  {
    id: 'shadhili_lam_alif',
    letterChar: 'ل',
    title: "Wird Al-Lam-Alif (La Libération des Chaînes et Entraves)",
    master: "Imam Abu al-Hasan ash-Shadhili",
    targetLetter: "Lam (ل)",
    repetitionCount: 71,
    arabicText: "لاَ إِلَهَ إِلاَّ اللهُ الحَقُّ المُبِينُ، بِسِرِّ اللاَّمِ وَالأَلِفِ اقْضِ حَاجَاتِي وَادْفَعْ عَنِّي شَرَّ الحَاسِدِينَ وَالمَكَّارِينَ.",
    transliteration: "La ilaha illa Allahu al-Haqqu al-Mubin, bi-sirri al-Lami wal-Alifi iqdi hajati wa-dfa' 'anni sharra al-hasidina wal-makkarin.",
    translation: "Il n'y a de divinité qu'Allah, le Vrai, le Manifeste. Par le secret combiné du Lam et de l'Alif, exauce mes besoins et repousse loin de moi la malice des envieux et des comploteurs.",
    ritual: "À répéter à l'heure de la prière du Asr avec fumigation d'ambre pur.",
    benefits: ["Dissolution des blocages financiers et relationnels", "Victoire sur les complots", "Attraction du charisme"]
  },
  {
    id: 'rifai_shin',
    letterChar: 'ش',
    title: "Wird Al-Sirr Al-Rifa'i (La Clef de l'Humilité & du Secours)",
    master: "Imam Ahmad ar-Rifa'i",
    targetLetter: "Shin (ش) / Ya (ي)",
    repetitionCount: 66,
    arabicText: "يَا غِيَاثَ المُسْتَغِيثِينَ، يَا أَمَانَ الخَائِفِينَ، أَدْرِكْنِي بِسِرِّ التَّوَضُّعِ وَالخُضُوعِ وَاجْعَلْنِي فِي حِمَاكَ الَّذِي لاَ يُضَامُ.",
    transliteration: "Ya Ghiyatha al-mustaghithina, ya Amana al-kha'ifina, adrikni bi-sirri at-tawadu'i wal-khudu'i wa-j'alni fi himaka alladhi la yudam.",
    translation: "Ô Secours de ceux qui implorent assistance, Ô Refuge des apeurés, rejoins-moi par le secret de l'humilité et place-moi sous Ta protection inviolable.",
    ritual: "À réciter après le Maghrib avec présence du cœur et fumigation de santal.",
    benefits: ["Apaisement immédiat des urgences", "Protection lors des épreuves", "Attraction de la clémence"]
  },
  {
    id: 'busiri_burda',
    letterChar: 'م',
    title: "Wird Al-Burda Al-Mubaraka (Le Manteau de Guérison)",
    master: "Imam Sharaf ad-Din al-Busiri",
    targetLetter: "Mim (م) / Ba (ب)",
    repetitionCount: 99,
    arabicText: "مَوْلاَيَ صَلِّ وَسَلِّمْ دَائِمًا أَبَدًا، عَلَى حَبِيبِكَ خَيْرِ الخَلْقِ كُلِّهِمِ، هُوَ الحَبِيبُ الَّذِي تُرْجَى شَفَاعَتُهُ، لِكُلِّ هَوْلٍ مِنَ الأَهْوَالِ مُقْتَحِمِ.",
    transliteration: "Mawlaya salli wa sallim da'iman abadan, 'ala Habibika khayri al-khalqi kullihimi, Huwal-Habibulladhi turja shafa'atuhu, li-kulli hawlin minal-ahwali muqtahami.",
    translation: "Mon Seigneur, répands Tes grâces et Ta paix à jamais sur Ton Bien-Aimé, la meilleure de toutes les créatures. C'est le Bien-Aimé dont l'intercession est espérée contre toute terreur déferlante.",
    ritual: "À réciter la nuit du vendredi avec de l'eau de rose et du musc.",
    benefits: ["Guérison des maladies physiques et spirituelles", "Vision bénie en rêve", "Prospérité et sérénité"]
  },
  {
    id: 'tilimsani_ayn',
    letterChar: 'ع',
    title: "Wird Al-'Ayn Al-Basirah (La Source de la Clairvoyance)",
    master: "Al-Tilimsani (Kitab al-Usool)",
    targetLetter: "Ayn (ع)",
    repetitionCount: 70,
    arabicText: "يَا عَلِيمُ يَا عَظِيمُ بِسِرِّ العَيْنِ النَّافِذَةِ، انْصُرْنِي عَلَى النَّفْسِ وَالشَّيْطَانِ وَهَبْ لِي عِلْمًا نَافِعًا.",
    transliteration: "Ya 'Alimu ya 'Azimu bi-sirri al-'Ayni an-nafidhah, unsurni 'ala an-nafsi wash-shaytani wa-hab li 'ilman nafi'a.",
    translation: "Ô Omniscient, Ô Immense, par le secret de l'Ayn pénétrant, donne-moi la victoire sur mon ego et Satan, et accorde-moi une connaissance éminemment utile.",
    ritual: "À exécuter le vendredi avant la prière du Jumu'ah.",
    benefits: ["Éloquence sublime", "Lumière dans le regard et persuasion", "Élimination des doutes"]
  },
  {
    id: 'maalaynahn_alif',
    letterChar: 'ا',
    title: "Wird Al-Fath Al-Mubin (La Lumière des Sables et de l'Esprit)",
    master: "Cheikh Ma al-'Aynayn al-Qalqami",
    targetLetter: "Alif (ا) / Waw (و)",
    repetitionCount: 100,
    arabicText: "يَا ظَاهِرُ يَا بَاطِنُ يَا نُورُ يَا حَقُّ، افْتَحْ عَلَيَّ فَتْحًا مُبِينًا وَاهْدِنِي صِرَاطًا مُسْتَقِيمًا، وَانْصُرْنِي نَصْرًا عَزِيزًا.",
    transliteration: "Ya Zahiru ya Batinu ya Nuru ya Haqqu, iftah 'alayya fathan mubinan wa-hdini siratan mustaqiman, wa-nsurni nasran 'aziza.",
    translation: "Ô Apparent, Ô Caché, Ô Lumière, Ô Vérité ! Ouvre-moi une victoire éclatante, guide-moi sur la voie droite et accorde-moi un secours glorieux.",
    ritual: "Avant le lever du soleil au désert ou dans un lieu paisible.",
    benefits: ["Victoire sur les obstacles impossibles", "Gnose et clarté de vision", "Déverrouillage des connaissances"]
  }
];

export const FULL_28_LETTERS_DATA: LetterInfo[] = [
  { 
    char: 'ا', name: 'Alif', nameAr: 'أَلِف', element: 'Feu', nature: 'Lumineuse (Nourani)', angel: 'Hatmaya\'il', angelArabic: 'هَطْمَائِيلُ', demon: 'Hadhayun', demonArabic: 'هَذَايُون', incense: 'Musc & Oliban', planet: 'Soleil', surah: 'Al-Baqarah (1:1)', abjad: 1, abjadKabir: 111, bodyPart: 'Tête & Cerveau', 
    secret: "Lettre de l'Axe Divin. Elle régit le principe créateur, l'autorité spirituelle ultime et le commandement.",
    secretWird: {
      title: "Wird de l'Alif Primordial",
      master: "Ibn 'Arabi",
      repetitionCount: 111,
      arabicText: "يَا أَللَّهُ يَا حَيُّ يَا قَيُّومُ بِسِرِّ الأَلِفِ القَائِمِ أَقِمْ لِي أَمْرِي",
      transliteration: "Ya Allahu ya Hayyu ya Qayyumu bi-sirri al-Alifi al-qa'imi aqim li amri.",
      translation: "Ô Allah, Ô Vivant, Ô Immuable, par le secret de l'Alif dressé, redresse ma situation.",
      benefits: ["Autorité morale", "Clarté de pensée", "Élévation spirituelle"],
      bestTime: "Aube (Fajr)"
    }
  },
  { 
    char: 'ب', name: 'Ba', nameAr: 'بَاء', element: 'Terre', nature: 'Lumineuse (Nourani)', angel: 'Kamlaya\'il', angelArabic: 'كَمْلَائِيلُ', demon: 'Kashmash', demonArabic: 'كَشْمَش', incense: 'Encens Mâle (Luban)', planet: 'Lune', surah: 'Al-Imran', abjad: 2, abjadKabir: 3, bodyPart: 'Cœur & Thorax', 
    secret: "Le Point sous le Ba renferme toute l'existence. Lettre de la manifestation, de la bénédiction et de la guérison.",
    secretWird: {
      title: "Wird du Point du Ba",
      master: "Imam 'Ali ibn Abi Talib",
      repetitionCount: 128,
      arabicText: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ، يَا بَارِئُ يَا بَاسِطُ أَنْزِلْ بَرَكَتَكَ عَلَيَّ",
      transliteration: "Bismillahi ar-Rahmani ar-Rahim, ya Bari'u ya Basitu anzil barakataka 'alayya.",
      translation: "Au nom d'Allah le Tout Miséricordieux. Ô Créateur, Ô Dispensateur, fais descendre Ta bénédiction sur moi.",
      benefits: ["Bénédiction matérielle", "Guérison des douleurs", "Ouverture des cœurs"],
      bestTime: "Soir"
    }
  },
  { 
    char: 'ج', name: 'Jim', nameAr: 'جِيم', element: 'Air', nature: 'Sombre (Zulmani)', angel: 'Tanqayail', angelArabic: 'طَنْقَائِيلُ', demon: 'Atyan', demonArabic: 'عَطْيَان', incense: 'Santal Rouge', planet: 'Mars', surah: 'An-Nisa', abjad: 3, abjadKabir: 53, bodyPart: 'Poumons & Voies respiratoires', 
    secret: "Lettre de la Majeur et de la Prospérité. Attire la richesse et permet d'éradiquer la pauvreté.",
    secretWird: {
      title: "Wird du Jim de l'Abondance",
      master: "Al-Buni",
      repetitionCount: 353,
      arabicText: "يَا جَامِعُ يَا جَلِيلُ اجْمَعْ لِي خَيْرَاتِ الدُّنْيَا وَالآخِرَةِ",
      transliteration: "Ya Jami'u ya Jalilu ijma' li khayrati ad-dunya wal-akhirah.",
      translation: "Ô Rassembleur, Ô Majestueux, rassemble pour moi les bienfaits d'ici-bas et de l'au-delà.",
      benefits: ["Richesse légitime", "Rassemblement des cœurs", "Victoire"],
      bestTime: "Matin"
    }
  },
  { 
    char: 'د', name: 'Dal', nameAr: 'دَال', element: 'Eau', nature: 'Sombre (Zulmani)', angel: 'Halyaya\'il', angelArabic: 'حَلْيَائِيلُ', demon: 'Rawan', demonArabic: 'رَوَان', incense: 'Oud Pur', planet: 'Mercure', surah: 'Al-Ma\'idah', abjad: 4, abjadKabir: 35, bodyPart: 'Foie & Vésicule', 
    secret: "Lettre de la Stabilité et de l'Amour Spirituel. Utile pour rétablir la paix dans les foyers.",
    secretWird: {
      title: "Wird du Dal d'Affection",
      master: "Imam Ash-Shadhili",
      repetitionCount: 435,
      arabicText: "يَا دَائِمُ يَا دَيَّانُ أَلْقِ المَوَدَّةَ وَالمَحَبَّةَ فِي القُلُوبِ",
      transliteration: "Ya Da'imu ya Dayyanu alqi al-mawaddata wal-mahabbata fi al-qulub.",
      translation: "Ô Éternel, Ô Juge Suprême, insuffle l'affection et l'amour dans les cœurs.",
      benefits: ["Harmonie conjugale", "Réconciliation", "Stabilité"],
      bestTime: "Coucher du soleil"
    }
  },
  { 
    char: 'ه', name: 'Ha', nameAr: 'هَاء', element: 'Feu', nature: 'Lumineuse (Nourani)', angel: 'Mahkaya\'il', angelArabic: 'مَهْكَائِيلُ', demon: 'Hawaf', demonArabic: 'هَوَاف', incense: 'Safran', planet: 'Jupiter', surah: 'Al-An\'am', abjad: 5, abjadKabir: 11, bodyPart: 'Système Nerveux', 
    secret: "Lettre du Souffle Huwa (Lui). Clé de la Muraqabah, du calme mental et de la clairvoyance.",
    secretWird: {
      title: "Wird du Ha de la Présence Divine",
      master: "Cheikh Ahmad Tijani",
      repetitionCount: 66,
      arabicText: "يَا هُوَ يَا هَادِي اِهْدِنِي لِنُورِكَ الأَعْظَمِ",
      transliteration: "Ya Huwa ya Hadi ihdini li-nurika al-a'zam.",
      translation: "Ô Lui, Ô Guide, guide-moi vers Ta lumière suprême.",
      benefits: ["Clairvoyance", "Paix psychique", "Inspiration divine"],
      bestTime: "Minuit (Tahajjud)"
    }
  },
  { 
    char: 'و', name: 'Waw', nameAr: 'وَاو', element: 'Terre', nature: 'Sombre (Zulmani)', angel: 'Ruhaya\'il', angelArabic: 'رُوهَائِيلُ', demon: 'Zawaba\'ah', demonArabic: 'زَوَبَعَة', incense: 'Mastic', planet: 'Vénus', surah: 'Al-A\'raf', abjad: 6, abjadKabir: 13, bodyPart: 'Colonne vertébrale', 
    secret: "Lettre de la Jonction (Atf). Elle lie le monde céleste au monde terrestre.",
    secretWird: {
      title: "Wird du Waw de l'Union",
      master: "Al-Tilimsani",
      repetitionCount: 116,
      arabicText: "يَا وَدُودُ يَا وَهَّابُ هَبْ لِي مِنْ لَدُنْكَ رَحْمَةً وَوُدًّا",
      transliteration: "Ya Wadudu ya Wahhabu hab li min ladunka rahmatan wa wudda.",
      translation: "Ô Bienveillant, Ô Dispensateur, accorde-moi de Ta part une miséricorde et une affection sincère.",
      benefits: ["Facilitation des mariages", "Entente mutuelle", "Protection des liens"],
      bestTime: "Aube"
    }
  },
  { 
    char: 'ز', name: 'Zay', nameAr: 'زَاي', element: 'Air', nature: 'Sombre (Zulmani)', angel: 'Samhaya\'il', angelArabic: 'سَمْهَائِيلُ', demon: 'Maymun', demonArabic: 'مَيْمُون', incense: 'Coriandre', planet: 'Saturne', surah: 'Al-Anfal', abjad: 7, abjadKabir: 18, bodyPart: 'Reins & Reins spirituels', 
    secret: "Lettre du Rayonnement et du Succès commercial. Protège des pertes financières.",
    secretWird: {
      title: "Wird du Zay de la Prospérité",
      master: "Al-Buni",
      repetitionCount: 77,
      arabicText: "يَا زَكِيُّ يَا زَاهِرُ زَكِّ نَفْسِي وَأَظْهِرْ حَقِّي",
      transliteration: "Ya Zakiyyu ya Zahiru zakki nafsi wa azhir haqqi.",
      translation: "Ô Pur, Ô Eclatant, purifie mon âme et manifeste mon droit.",
      benefits: ["Succès commercial", "Protection contre le vol", "Éclat personnel"],
      bestTime: "Matin"
    }
  },
  { 
    char: 'ح', name: 'Ha', nameAr: 'حَاء', element: 'Eau', nature: 'Lumineuse (Nourani)', angel: 'Dardaya\'il', angelArabic: 'دَرْدَائِيلُ', demon: 'Shamhurish', demonArabic: 'شَمْهُورِش', incense: 'Myrrhe', planet: 'Soleil', surah: 'At-Tawbah', abjad: 8, abjadKabir: 9, bodyPart: 'Estomac & Digestif', 
    secret: "Lettre de la Vie (Al-Hayat) et de la Pureté. Éradique les mauvais sorts et impuretés.",
    secretWird: {
      title: "Wird du Ha de la Guérison",
      master: "Imam Al-Ghazali",
      repetitionCount: 88,
      arabicText: "يَا حَيُّ يَا حَلِيمُ اِشْفِنِي مِنْ كُلِّ دَاءٍ وَبَلاَءٍ",
      transliteration: "Ya Hayyu ya Halimu ishfini min kulli da'in wa bala'.",
      translation: "Ô Vivant, Ô Indulgent, guéris-moi de toute maladie et de toute épreuve.",
      benefits: ["Guérison physique", "Dissolution des blocages", "Vitalité"],
      bestTime: "Aujourd'hui à midi"
    }
  },
  { 
    char: 'ط', name: 'Ta', nameAr: 'طَاء', element: 'Feu', nature: 'Lumineuse (Nourani)', angel: 'Ghalghayail', angelArabic: 'غَلْغَائِيلُ', demon: 'Ahmar', demonArabic: 'أَحْمَر', incense: 'Oliban', planet: 'Lune', surah: 'Yunus', abjad: 9, abjadKabir: 19, bodyPart: 'Membres & Musculature', 
    secret: "Lettre de la Force de Coercition et de la Protection Nocturne. Repousse les attaques négatives.",
    secretWird: {
      title: "Wird du Ta du Bouclier Lumineux",
      master: "Ibn 'Arabi",
      repetitionCount: 119,
      arabicText: "يَا طَاهِرُ يَا طَبِيبُ طَهِّرْ قَلْبِي وَاحْفَظْنِي مِنْ كَيْدِ الظَّالِمِينَ",
      transliteration: "Ya Tahiru ya Tabibu tahhir qalbi wa-hfazni min kaydi az-zalimin.",
      translation: "Ô Pur, Ô Guérisseur, purifie mon cœur et préserve-moi de la ruse des oppresseurs.",
      benefits: ["Protection nocturne", "Dissipation des peurs", "Force physique"],
      bestTime: "Nuit"
    }
  },
  { 
    char: 'ي', name: 'Ya', nameAr: 'يَاء', element: 'Terre', nature: 'Lumineuse (Nourani)', angel: 'Saryayil', angelArabic: 'صَرْيَائِيلُ', demon: 'Murrah', demonArabic: 'مُرَّة', incense: 'Bois de Rose', planet: 'Mars', surah: 'Hud', abjad: 10, abjadKabir: 11, bodyPart: 'Mains & Doigts', 
    secret: "Lettre de la Certitude (Yaqin) et de l'Accomplissement. Débloque l'apprentissage rapide.",
    secretWird: {
      title: "Wird du Ya de la Certitude",
      master: "Cheikh Ahmad Tijani",
      repetitionCount: 110,
      arabicText: "يَا يَقِينُ يَا مُعِينُ أَعِنِّي عَلَى طَاعَتِكَ وَارْزُقْنِي الحِكْمَةَ",
      transliteration: "Ya Yaqinu ya Mu'inu a'inni 'ala ta'atika wa-rzuqni al-hikmah.",
      translation: "Ô Certitude, Ô Secoureur, aide-moi dans Ton obéissance et accorde-moi la sagesse.",
      benefits: ["Mémoire phénoménale", "Efficacité au travail", "Paix du mental"],
      bestTime: "Après le Fajr"
    }
  },
  { 
    char: 'ك', name: 'Kaf', nameAr: 'كَاف', element: 'Air', nature: 'Lumineuse (Nourani)', angel: 'Kalkayail', angelArabic: 'كَلْكَائِيلُ', demon: 'Barqan', demonArabic: 'بَرْقَان', incense: 'Benjoin (Jawi)', planet: 'Mercure', surah: 'Yusuf', abjad: 20, abjadKabir: 101, bodyPart: 'Gorge & Cordes vocales', 
    secret: "Lettre du Kafi (Celui qui suffit). Assure l'autosuffisance et protège du mauvais œil.",
    secretWird: {
      title: "Wird du Kaf de la Suffisance Divine",
      master: "Al-Buni",
      repetitionCount: 111,
      arabicText: "يَا كَافِي يَا كَرِيمُ اكْفِنِي مَا أَهَمَّنِي مِنْ أُمُورِ الدُّنْيَا وَالآخِرَةِ",
      transliteration: "Ya Kafi ya Karimu ikfini ma ahammani min umuri ad-dunya wal-akhirah.",
      translation: "Ô Suffisant, Ô Généreux, suffis-moi dans toutes mes préoccupation d'ici-bas et de l'au-delà.",
      benefits: ["Autonomie financière", "Protection anti-evil-eye", "Eloquence"],
      bestTime: "Crépuscule"
    }
  },
  { 
    char: 'ل', name: 'Lam', nameAr: 'لاَم', element: 'Eau', nature: 'Lumineuse (Nourani)', angel: 'Mahayail', angelArabic: 'مَهَيَائِيلُ', demon: 'Shamradal', demonArabic: 'شَمْرَدَل', incense: 'Ambre Gris', planet: 'Jupiter', surah: 'Ar-Ra\'d', abjad: 30, abjadKabir: 71, bodyPart: 'Langue & Parole', 
    secret: "Lettre de la Douceur et de la Grace. Facilite le pardon et la réconciliation.",
    secretWird: {
      title: "Wird du Lam de la Grace Divine",
      master: "Imam Ash-Shadhili",
      repetitionCount: 71,
      arabicText: "يَا لَطِيفُ يَا أَللَّهُ أُلْطُفْ بِي فِي قَضَائِكَ وَيَسِّرْ لِي كُلَّ عَسِيرٍ",
      transliteration: "Ya Latifu ya Allahu ultuf bi fi qada'ika wa yassir li kulla 'asir.",
      translation: "Ô Subtil, Ô Allah, sois bienveillant envers moi dans Tes décrets et facilite-moi toute difficulté.",
      benefits: ["Adoucissement des épreuves", "Paix familiale", "Charisme subtil"],
      bestTime: "Soir"
    }
  },
  { 
    char: 'م', name: 'Mim', nameAr: 'مِيم', element: 'Feu', nature: 'Lumineuse (Nourani)', angel: 'Mikhail', angelArabic: 'مِيكَائِيلُ', demon: 'Mansur', demonArabic: 'مَنْصُور', incense: 'Clou de Girofle', planet: 'Vénus', surah: 'Ibrahim', abjad: 40, abjadKabir: 90, bodyPart: 'Système Sanguin', 
    secret: "Lettre du Royaume (Mulk) et du Prophète Muhammad. Sceau de l'élévation et du charisme.",
    secretWird: {
      title: "Wird du Mim de la Royauté Spirituelle",
      master: "Ibn 'Arabi",
      repetitionCount: 90,
      arabicText: "يَا مَالِكُ يَا مُهَيْمِنُ مَلِّكْنِي زِمَامَ نَفْسِي وَارْزُقْنِي الهَيْبَةَ",
      transliteration: "Ya Maliku ya Muhayminu mallikni zimama nafsi wa-rzuqni al-haybah.",
      translation: "Ô Souverain, Ô Dominant, donne-moi la maîtrise de mon ego et accorde-moi le charisme.",
      benefits: ["Maîtrise de soi", "Respect de l'entourage", "Élévation sociale"],
      bestTime: "Aube"
    }
  },
  { 
    char: 'ن', name: 'Nun', nameAr: 'نُون', element: 'Terre', nature: 'Lumineuse (Nourani)', angel: 'Sa\'qayail', angelArabic: 'سَعْقَائِيلُ', demon: 'Zalzal', demonArabic: 'زَلْزَل', incense: 'Harmal', planet: 'Saturne', surah: 'Al-Hijr', abjad: 50, abjadKabir: 106, bodyPart: 'Yeux & Vision', 
    secret: "Lettre de la Lumière (Nur) et de la Connaissance Céleste. Ouvre la perception subtile.",
    secretWird: {
      title: "Wird du Nun de la Lumière",
      master: "Ahmad Tijani",
      repetitionCount: 106,
      arabicText: "يَا نُورُ يَا هَادِي نَوِّرْ قَلْبِي وَبَصَرِي بِنُورِ المَعْرِفَةِ",
      transliteration: "Ya Nuru ya Hadi nawwir qalbi wa basari bi-nuri al-ma'rifah.",
      translation: "Ô Lumière, Ô Guide, illumine mon cœur et ma vue par la lumière de la connaissance.",
      benefits: ["Ouverture du 3e œil spirituel", "Sérénité absolue", "Protection"],
      bestTime: "Minuit"
    }
  },
  { 
    char: 'س', name: 'Sin', nameAr: 'سِين', element: 'Air', nature: 'Sombre (Zulmani)', angel: 'Ta\'kalyail', angelArabic: 'طَعْكَايَائِيلُ', demon: 'Sahir', demonArabic: 'سَاهِر', incense: 'Camphre', planet: 'Soleil', surah: 'An-Nahl', abjad: 60, abjadKabir: 120, bodyPart: 'Dents & Mâchoire', 
    secret: "Lettre du Secret (Sirr) et de la Paix (Salam). Repousse la pauvreté et accélère les voyages.",
    secretWird: {
      title: "Wird du Sin du Secret et de la Paix",
      master: "Al-Ghazali",
      repetitionCount: 120,
      arabicText: "يَا سَلاَمُ يَا سَمِيعُ سَلِّمْنِي مِنْ كُلِّ سُوءٍ وَاسْمَعْ دُعَائِي",
      transliteration: "Ya Salamu ya Sami'u sallimni min kulli su'in wa-sma' du'a'i.",
      translation: "Ô Paix, Ô Audient, préserve-moi de tout mal et exauce mon invocation.",
      benefits: ["Sécurité lors des déplacements", "Paix du cœur", "Protection financière"],
      bestTime: "Après la prière du Maghrib"
    }
  },
  { 
    char: 'ع', name: 'Ayn', nameAr: 'عَيْن', element: 'Eau', nature: 'Lumineuse (Nourani)', angel: 'Salqaqyail', angelArabic: 'صَلْقَقْيَائِيلُ', demon: 'Asfur', demonArabic: 'عَصْفُور', incense: 'Costus Indien', planet: 'Lune', surah: 'Al-Isra', abjad: 70, abjadKabir: 130, bodyPart: 'Vaisseaux sanguins', 
    secret: "Lettre de la Source ('Ayn) et du Savoir. Accorde la haute éloquence et le discernement.",
    secretWird: {
      title: "Wird de l'Ayn de l'Éloquence",
      master: "Al-Tilimsani",
      repetitionCount: 130,
      arabicText: "يَا عَلِيمُ يَا عَظِيمُ عَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا",
      transliteration: "Ya 'Alimu ya 'Azimu 'allimni ma yanfa'uni wa zidni 'ilma.",
      translation: "Ô Omniscient, Ô Immense, enseigne-moi ce qui m'est utile et augmente ma science.",
      benefits: ["Grande éloquence public", "Réussite aux examens", "Clairvoyance"],
      bestTime: "Vendredi matin"
    }
  },
  { 
    char: 'ف', name: 'Fa', nameAr: 'فَاء', element: 'Feu', nature: 'Sombre (Zulmani)', angel: 'Tartayail', angelArabic: 'طَرْطَائِيلُ', demon: 'Fazir', demonArabic: 'فَازِر', incense: 'Styrax', planet: 'Mars', surah: 'Al-Kahf', abjad: 80, abjadKabir: 81, bodyPart: 'Nez & Odorat', 
    secret: "Lettre de la Victoire (Fath) et du Soulagement. Libère des dettes et des blocages.",
    secretWird: {
      title: "Wird du Fa de l'Ouverture",
      master: "Al-Buni",
      repetitionCount: 88,
      arabicText: "يَا فَتَّاحُ يَا رَزَّاقُ افْتَحْ لِي أَبْوَابَ الخَيْرِ كُلِّهَا",
      transliteration: "Ya Fattahu ya Razzaqu iftah li abwaba al-khayri kullaha.",
      translation: "Ô Fendeur, Ô Subvenant, ouvre-moi toutes les portes du bien.",
      benefits: ["Libération des dettes", "Ouverture commerciale", "Trouver les objets perdus"],
      bestTime: "Matin après Fajr"
    }
  },
  { 
    char: 'ص', name: 'Sad', nameAr: 'صَاد', element: 'Terre', nature: 'Lumineuse (Nourani)', angel: 'Surayail', angelArabic: 'صُورَيَائِيلُ', demon: 'Salsal', demonArabic: 'صَلْصَال', incense: 'Galbanum', planet: 'Mercure', surah: 'Maryam', abjad: 90, abjadKabir: 95, bodyPart: 'Os & Squelette', 
    secret: "Lettre de la Sincérité (Sidq) et de la Patience (Sabr). Confère une fermeté imbranlable.",
    secretWird: {
      title: "Wird du Sad de la Sincérité",
      master: "Ibn 'Arabi",
      repetitionCount: 95,
      arabicText: "يَا صَادِقُ يَا صَبُورُ ثَبِّتْنِي عَلَى الحَقِّ وَاهْدِنِي صِرَاطَ الصَّالِحِينَ",
      transliteration: "Ya Sadiqu ya Saburu thabbitni 'ala al-haqqi wa-hdini sirata as-salihin.",
      translation: "Ô Sincère, Ô Endurant, affermis-moi sur la vérité et guide-moi sur la voie des vertueux.",
      benefits: ["Courage suprême", "Endurance physique", "Chasse les hésitations"],
      bestTime: "Après-midi"
    }
  },
  { 
    char: 'ق', name: 'Qaf', nameAr: 'قَاف', element: 'Air', nature: 'Lumineuse (Nourani)', angel: 'Qalqayail', angelArabic: 'قَلْقَائِيلُ', demon: 'Qarun', demonArabic: 'قَارُون', incense: 'Aloès', planet: 'Jupiter', surah: 'Ta-Ha', abjad: 100, abjadKabir: 181, bodyPart: 'Cervelet & Nuque', 
    secret: "Lettre de la Force Coercitive (Qudrah) et de la Proximité Divin. Domine les ennemis.",
    secretWird: {
      title: "Wird du Qaf de la Puissance",
      master: "Al-Ghazali",
      repetitionCount: 181,
      arabicText: "يَا قَادِرُ يَا قَوِيُّ أَلْقِ رُعْبِي فِي قُلُوبِ أَعْدَائِي وَانْصُرْنِي",
      transliteration: "Ya Qadiru ya Qawiyyu alqi ru'bi fi qulubi a'da'i wa-nsurni.",
      translation: "Ô Puissant, Ô Fort, insuffle ma crainte dans le cœur de mes ennemis et accorde-moi la victoire.",
      benefits: ["Victoire sur les tyrans", "Invulnérabilité psychique", "Haut statut"],
      bestTime: "Mardi à l'aube"
    }
  },
  { 
    char: 'ر', name: 'Ra', nameAr: 'رَاء', element: 'Eau', nature: 'Sombre (Zulmani)', angel: 'Ruqayail', angelArabic: 'رُوقَيَائِيلُ', demon: 'Rashid', demonArabic: 'رَاشِد', incense: 'Santal Blanc', planet: 'Vénus', surah: 'Al-Anbiya', abjad: 200, abjadKabir: 201, bodyPart: 'Pieds & Jambes', 
    secret: "Lettre de la Miséricorde (Rahmah) et de l'Équilibre. Dissipe la dépression et la tristesse.",
    secretWird: {
      title: "Wird du Ra de la Miséricorde",
      master: "Ahmad Tijani",
      repetitionCount: 200,
      arabicText: "يَا رَحْمَنُ يَا رَحِيمُ ارْحَمْنِي وَفَرِّجْ هَمِّي وَأَدْخِلِ السُّرُورَ فِي قَلْبِي",
      transliteration: "Ya Rahmanu ya Rahimu irhamni wa farrij hammi wa adkhil as-surura fi qalbi.",
      translation: "Ô Tout Miséricordieux, Ô Très Miséricordieux, fais-moi miséricorde, dissipe mon souci et mets la joie dans mon cœur.",
      benefits: ["Guérison de la dépression", "Générosité des gens", "Joie spirituelle"],
      bestTime: "Matin"
    }
  },
  { 
    char: 'ش', name: 'Shin', nameAr: 'شِين', element: 'Feu', nature: 'Sombre (Zulmani)', angel: 'Shamhayail', angelArabic: 'شَمْهَائِيلُ', demon: 'Shayban', demonArabic: 'شَيْبَان', incense: 'Rose de Damas', planet: 'Saturne', surah: 'Al-Hajj', abjad: 300, abjadKabir: 360, bodyPart: 'Épaules', 
    secret: "Lettre du Rayonnement (Shu'a') et de la Justice. Fait plier les injustices et disperse les complots.",
    secretWird: {
      title: "Wird du Shin de la Justice",
      master: "Al-Buni",
      repetitionCount: 360,
      arabicText: "يَا شَكُورُ يَا شَهِيدُ انْصُرْنِي عَلَى مَنْ ظَلَمَنِي وَاشْدُدْ أَزْرِي",
      transliteration: "Ya Shakuru ya Shahidu unsurni 'ala man zalamani wa-shdud azri.",
      translation: "Ô Reconnaissant, Ô Témoin, donne-moi la victoire sur qui m'a lésé et fortifie ma position.",
      benefits: ["Obtention de justice", "Dispersion des machinations", "Courage"],
      bestTime: "Nuit du jeudi au vendredi"
    }
  },
  { 
    char: 'ت', name: 'Ta', nameAr: 'تَاء', element: 'Terre', nature: 'Sombre (Zulmani)', angel: 'Ta\'nayail', angelArabic: 'طَعْنَائِيلُ', demon: 'Tarish', demonArabic: 'تَارِش', incense: 'Cannelle', planet: 'Soleil', surah: 'Al-Mu\'minun', abjad: 400, abjadKabir: 401, bodyPart: 'Peau & Epiderme', 
    secret: "Lettre du Repentir (Tawbah) et de la Solidité. Enracine les projets et protège le foyer.",
    secretWird: {
      title: "Wird du Ta de la Fermeté",
      master: "Imam Ash-Shadhili",
      repetitionCount: 400,
      arabicText: "يَا تَوَّابُ يَا ثَابِتُ تُبْ عَلَيَّ وَثَبِّتْ أَقْدَامِي فِي كُلِّ عَمَلٍ",
      transliteration: "Ya Tawwabu ya Thabitu tub 'alayya wa thabbit aqdami fi kulli 'amal.",
      translation: "Ô Accueillant au repentir, Ô Inébranlable, accepte mon repentir et affermis mes pas dans chaque œuvre.",
      benefits: ["Ancrage des projets", "Pardon des péchés", "Solidité des affaires"],
      bestTime: "Crépuscule"
    }
  },
  { 
    char: 'ث', name: 'Tha', nameAr: 'ثَاء', element: 'Air', nature: 'Sombre (Zulmani)', angel: 'Tha\'nayail', angelArabic: 'ثَعْنَائِيلُ', demon: 'Thabit', demonArabic: 'ثَابِت', incense: 'Safran pur', planet: 'Lune', surah: 'An-Nur', abjad: 500, abjadKabir: 501, bodyPart: 'Articulations', 
    secret: "Lettre de la Constance (Thabat) et de l'Amour Divin. Apporte les bonnes nouvelles.",
    secretWird: {
      title: "Wird du Tha des Bonnes Nouvelles",
      master: "Ibn 'Arabi",
      repetitionCount: 500,
      arabicText: "يَا ثَابِتُ يَا غَنِيُّ ثَبِّتْ إِيمَانِي وَارْزُقْنِي مِنْ حَيْثُ لاَ أَحْتَسِبُ",
      transliteration: "Ya Thabitu ya Ghaniyu thabbit imani wa-rzuqni min haythu la ahtasib.",
      translation: "Ô Constant, Ô Riche par Soi, affermis ma foi et pourvois à mes besoins de là où je ne m'attends pas.",
      benefits: ["Réception de bonnes nouvelles", "Foi inébranlable", "Subsistance inattendue"],
      bestTime: "Aube"
    }
  },
  { 
    char: 'خ', name: 'Kha', nameAr: 'خَاء', element: 'Eau', nature: 'Sombre (Zulmani)', angel: 'Khalkayail', angelArabic: 'خَلْكَائِيلُ', demon: 'Khanzar', demonArabic: 'خَنْزَر', incense: 'Ail séché & Harmal', planet: 'Mars', surah: 'Al-Furqan', abjad: 600, abjadKabir: 601, bodyPart: 'Lymphe & Sang', 
    secret: "Lettre du Créateur (Khaliq) et de la Protection contre les attaques occultes.",
    secretWird: {
      title: "Wird du Kha du Bouclier Occulte",
      master: "Al-Buni",
      repetitionCount: 600,
      arabicText: "يَا خَالِقُ يَا خَبِيرُ احْفَظْنِي مِنْ شَرِّ الخَلْقِ وَالمَكْرِ الخَفِيِّ",
      transliteration: "Ya Khaliqu ya Khabiru ihfazni min sharri al-khalqi wal-makri al-khafiy.",
      translation: "Ô Créateur, Ô Parfaitement Informé, préserve-moi du mal des créatures et de la ruse cachée.",
      benefits: ["Purdification des lieux hantés", "Neutralisation de la jalousie", "Bouclier psychique"],
      bestTime: "Nuit"
    }
  },
  { 
    char: 'ذ', name: 'Dhal', nameAr: 'ذَال', element: 'Feu', nature: 'Sombre (Zulmani)', angel: 'Dhalqayail', angelArabic: 'ذَلْقَائِيلُ', demon: 'Dhidhan', demonArabic: 'ذِيْدَان', incense: 'Nigelle (Habbat al-Baraka)', planet: 'Mercure', surah: 'Ash-Shu\'ara', abjad: 700, abjadKabir: 731, bodyPart: 'Oreilles & Ouïe', 
    secret: "Lettre du Souvenir (Dhikr) et de la Dignité. Fait taire les calomnies.",
    secretWird: {
      title: "Wird du Dhal de la Dignité Divine",
      master: "Ahmad Tijani",
      repetitionCount: 731,
      arabicText: "يَا ذَا الجَلاَلِ وَالإِكْرَامِ، رَفِّعْ قَدْرِي وَاكْفِنِي شَرَّ الأَلْسُنِ الكَاذِبَةِ",
      transliteration: "Ya Dhal-Jalali wal-Ikram, raffi' qadri wa-kfini sharra al-alsuni al-kadhibah.",
      translation: "Ô Possesseur de la Majesté et de la Générosité, élève mon rang et préserve-moi du mal des langues mensongères.",
      benefits: ["Faire taire la calomnie", "Dignité morale", "Protection de la réputation"],
      bestTime: "Soir"
    }
  },
  { 
    char: 'ض', name: 'Dhad', nameAr: 'ضَاد', element: 'Terre', nature: 'Sombre (Zulmani)', angel: 'Dhanqayail', angelArabic: 'ضَنْقَائِيلُ', demon: 'Dharyan', demonArabic: 'ضَرْيَان', incense: 'Graines de Moutarde', planet: 'Jupiter', surah: 'An-Naml', abjad: 800, abjadKabir: 805, bodyPart: 'Côtés du corps & Ribs', 
    secret: "Lettre de la Lumière (Diya') et de la Restitution des Droits spoliés.",
    secretWird: {
      title: "Wird du Dhad de la Restitution",
      master: "Al-Ghazali",
      repetitionCount: 800,
      arabicText: "يَا ضَارُّ يَا نَافِعُ، ارْدُدْ عَلَيَّ حَقِّي المَغْصُوبَ وَانْصُرْنِي عَلَى الظَّالِمِينَ",
      transliteration: "Ya Darru ya Nafi'u, urdud 'alayya haqqi al-maghsuba wa-nsurni 'ala az-zalimin.",
      translation: "Ô Seul Capable de Nuire ou de Profiter, rends-moi mon droit spolié et donne-moi la victoire sur les injustes.",
      benefits: ["Récupération des sommes dues", "Dénouement des blocages", "Victoire"],
      bestTime: "Nuit du mardi"
    }
  },
  { 
    char: 'ظ', name: 'Zha', nameAr: 'ظَاء', element: 'Air', nature: 'Sombre (Zulmani)', angel: 'Zhalqayail', angelArabic: 'ظَلْقَائِيلُ', demon: 'Zhami', demonArabic: 'ظَامِي', incense: 'Gomme Ammoniaque', planet: 'Vénus', surah: 'Al-Qasas', abjad: 900, abjadKabir: 901, bodyPart: 'Ongles & Cheveux', 
    secret: "Lettre de la Manifestation (Zuhur) et de la Protection Absolue.",
    secretWird: {
      title: "Wird du Zha de la Protection Inviolable",
      master: "Ibn 'Arabi",
      repetitionCount: 900,
      arabicText: "يَا ظَاهِرُ يَا عَظِيمُ، أَظْهِرْ بَرَهَانِي وَاحْفَظْنِي بِعَيْنِكَ الَّتِي لاَ تَنَامُ",
      transliteration: "Ya Zahiru ya 'Azimu, azhir burhani wa-hfazni bi-'aynika allati la tanam.",
      translation: "Ô Manifeste, Ô Immense, fais éclater ma preuve et garde-moi par Ton œil qui ne dort jamais.",
      benefits: ["Invulnérabilité contre les complots", "Décrocher gain de cause", "Protection"],
      bestTime: "Aube"
    }
  },
  { 
    char: 'غ', name: 'Ghayn', nameAr: 'غَيْن', element: 'Eau', nature: 'Sombre (Zulmani)', angel: 'Ghalkayail', angelArabic: 'غَلْكَائِيلُ', demon: 'Ghasib', demonArabic: 'غَاصِب', incense: 'Asafoetida (Haltit)', planet: 'Saturne', surah: 'Al-\'Ankabut', abjad: 1000, abjadKabir: 1060, bodyPart: 'Moelle osseuse', 
    secret: "Lettre de l'Indépendance (Ghina) et du Mystère Célé. Éloigne la pauvreté extrême.",
    secretWird: {
      title: "Wird du Ghayn de l'Opulence Divine",
      master: "Al-Buni",
      repetitionCount: 1000,
      arabicText: "يَا غَنِيُّ يَا غَفَّارُ، أَغْنِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ وَاغْفِرْ لِي ذُنُوبِي",
      transliteration: "Ya Ghaniyu ya Ghaffaru, aghnini bi-halalika 'an haramika wa-ghfir li dhunubi.",
      translation: "Ô Absolument Riche, Ô Grand Pardonneur, enrichis-moi par Ton licite loin de Ton interdit et pardonne mes fautes.",
      benefits: ["Fin de la pauvreté", "Secret des mystères", "Dissipation des dettes lourdes"],
      bestTime: "Minuit"
    }
  }
];

const scienceDict = {
  fr: {
    title: "Science Initiatique des Lettres",
    subtitle: "Explorez les 28 vérités primordiales, la Rouhaniyya des anges, les correspondances anatomiques et les Wirds secrets des grands maîtres (Ibn 'Arabi, Al-Buni, At-Tijani, Ash-Shadhili).",
    tabGrid: "Grille (28 Lettres)",
    tabCalc: "Extracteur (Nom)",
    tabTawafuq: "Compatibilité (Tawafuq)",
    tabKhatim: "Carrés Magiques",
    tabClock: "Horloge Planétaire",
    tabVault: "Caveau des Secrets",
    all: "Tous",
    luminous: "Lumineuse",
    dark: "Sombre",
    filterElem: "Élément:",
    filterNature: "Nature:",
    searchPlaceholder: "Chercher lettre, secret...",
    fire: "Feu",
    earth: "Terre",
    air: "Air",
    water: "Eau"
  },
  en: {
    title: "Initiatic Science of Letters",
    subtitle: "Explore the 28 primordial truths, the Rouhaniyya of angels, anatomical correspondences, and secret Wirds of the great masters (Ibn 'Arabi, Al-Buni, At-Tijani, Ash-Shadhili).",
    tabGrid: "Grid (28 Letters)",
    tabCalc: "Name Extractor",
    tabTawafuq: "Compatibility (Tawafuq)",
    tabKhatim: "Magic Squares",
    tabClock: "Planetary Clock",
    tabVault: "Vault of Secrets",
    all: "All",
    luminous: "Luminous",
    dark: "Dark",
    filterElem: "Element:",
    filterNature: "Nature:",
    searchPlaceholder: "Search letter, secret...",
    fire: "Fire",
    earth: "Earth",
    air: "Air",
    water: "Water"
  },
  ha: {
    title: "Ilmin Haruffa na Asiri",
    subtitle: "Binciki gaskiya 28 na farko, Mala'ikun Rouhaniyya, alaƙa da jiki, da Wirds na asiri daga manyan malamai (Ibn 'Arabi, Al-Buni, At-Tijani, Ash-Shadhili).",
    tabGrid: "Jadawalin Haruffa 28",
    tabCalc: "Fitar da Suna",
    tabTawafuq: "Dacewa (Tawafuq)",
    tabKhatim: "Kayan Khatim da Wafq",
    tabClock: "Agogon Taurari",
    tabVault: "Gidan Asiri",
    all: "Duka",
    luminous: "Mai Haske",
    dark: "Mai Duhu",
    filterElem: "Mazauni:",
    filterNature: "Yanayi:",
    searchPlaceholder: "Nemi harafi, asiri...",
    fire: "Wuta",
    earth: "Turɓaya",
    air: "Iska",
    water: "Ruwa"
  }
};

export const ScienceOfLetters: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = scienceDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || scienceDict.fr;
  const { isPremium } = useAuth();
  const [selectedLetter, setSelectedLetter] = useState<LetterInfo | null>(FULL_28_LETTERS_DATA[0]);
  const [activeTab, setActiveTab] = useState<'grid' | 'calculator' | 'tawafuq' | 'khatim' | 'clock' | 'vault'>('grid');
  const [filterElement, setFilterElement] = useState<string>('Tous');
  const [filterNature, setFilterNature] = useState<string>('Tous');
  const [selectedMasterFilter, setSelectedMasterFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Name Abjad Extractor State
  const [inputName, setInputName] = useState('');
  const [extractedResult, setExtractedResult] = useState<any | null>(null);

  // Copy indicator & feature flag
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [disableDuaCopy, setDisableDuaCopy] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'features'), (docSnap) => {
      if (docSnap.exists()) {
        setDisableDuaCopy(!!docSnap.data()?.disable_dua_copy);
      }
    }, () => {});
    return () => unsub();
  }, []);

  // Ref for smooth scroll to details
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleSelectLetter = (letter: LetterInfo) => {
    setSelectedLetter(letter);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopy = (text: string, id: string) => {
    if (disableDuaCopy) return;
    if (!isPremium) {
      triggerProtectionModal('copy');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const getElementIcon = (element: string) => {
    switch(element) {
      case 'Feu': return <Flame size={16} className="text-red-500" />;
      case 'Eau': return <Droplets size={16} className="text-blue-500" />;
      case 'Terre': return <Mountain size={16} className="text-amber-600" />;
      case 'Air': return <Wind size={16} className="text-cyan-500" />;
      default: return <Star size={16} />;
    }
  };

  // Extract Letters & Rouhaniyya from custom text/name
  const calculateNameRouhaniyya = () => {
    if (!inputName.trim()) return;
    const cleanStr = inputName.trim();
    
    // Calculate total Abjad
    let total = 0;
    const letterCounts: { [char: string]: number } = {};
    const foundLetters: LetterInfo[] = [];

    for (const char of cleanStr) {
      const match = FULL_28_LETTERS_DATA.find(l => l.char === char);
      if (match) {
        total += match.abjad;
        letterCounts[char] = (letterCounts[char] || 0) + 1;
        if (!foundLetters.some(l => l.char === char)) {
          foundLetters.push(match);
        }
      }
    }

    // Determine dominant element
    const elemScores = { Feu: 0, Terre: 0, Air: 0, Eau: 0 };
    foundLetters.forEach(l => {
      elemScores[l.element] += 1;
    });
    const dominantElem = (Object.keys(elemScores) as Array<keyof typeof elemScores>).reduce((a, b) => elemScores[a] > elemScores[b] ? a : b);

    // Derived Angelic Name formula (Al-Buni tradition)
    const angelSuffix = "يَائِيلُ"; // -ya'il
    const derivedAngelName = `روُحَانِيَّةُ (${cleanStr}) — [${foundLetters[0]?.angel || 'Hatmaya\'il'}]`;

    setExtractedResult({
      name: cleanStr,
      totalAbjad: total,
      lettersCount: cleanStr.length,
      foundLetters,
      dominantElement: dominantElem,
      derivedAngelName,
      recommendedZikrCount: total > 0 ? total : 111
    });
  };

  const filteredLetters = FULL_28_LETTERS_DATA.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.char.includes(searchQuery) || 
                          l.secret.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesElement = filterElement === 'Tous' || l.element === filterElement;
    const matchesNature = filterNature === 'Tous' || 
                          (filterNature === 'Lumineuse' && l.nature.includes('Lumineuse')) ||
                          (filterNature === 'Sombre' && l.nature.includes('Sombre'));
    return matchesSearch && matchesElement && matchesNature;
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-2.5 sm:p-6 lg:p-8 safe-area-pt pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <Link to="/tools" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-xs sm:text-sm mb-2 sm:mb-4">
          <ArrowLeft className="mr-1.5" size={16} />
          {t("common.backToTools")}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Type className="text-emerald-500 shrink-0" size={22} />
              <span>{dict.title} <span className="font-arabic text-base sm:text-xl font-normal text-emerald-600 dark:text-emerald-400">(علم الحروف)</span></span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm leading-relaxed">
              {dict.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4 overflow-x-auto hide-scrollbar gap-1.5 sm:gap-2 pb-1.5 w-full max-w-full touch-pan-x whitespace-nowrap">
        <button
          onClick={() => setActiveTab('grid')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'grid'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Layers size={15} />
          <span>{dict.tabGrid}</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Calculator size={15} />
          <span>{dict.tabCalc}</span>
        </button>

        <button
          onClick={() => setActiveTab('tawafuq')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'tawafuq'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Heart size={15} />
          <span>{dict.tabTawafuq}</span>
        </button>

        <button
          onClick={() => setActiveTab('khatim')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'khatim'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Grid size={15} />
          <span>{dict.tabKhatim}</span>
        </button>

        <button
          onClick={() => setActiveTab('clock')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'clock'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Clock size={15} />
          <span>{dict.tabClock}</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          className={`py-1.5 px-2.5 sm:px-3.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            activeTab === 'vault'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Key size={15} />
          <span>{dict.tabVault}</span>
        </button>
      </div>

      {/* TAB 1: GRID & DETAILS */}
      {activeTab === 'grid' && (
        <div className="space-y-4 w-full max-w-full">
          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 p-2.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between w-full max-w-full overflow-hidden">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar touch-pan-x max-w-full">
              {/* Element Filter */}
              <div className="flex items-center gap-0.5 bg-gray-50 dark:bg-gray-900 p-0.5 rounded-xl border border-gray-200 dark:border-gray-700 text-[11px] shrink-0">
                <span className="text-gray-400 px-1.5 font-semibold text-[10px] shrink-0">{dict.filterElem}</span>
                {['Tous', 'Feu', 'Terre', 'Air', 'Eau'].map(elem => {
                  const label = elem === 'Tous' ? dict.all : (dict[elem.toLowerCase() as keyof typeof dict] || elem);
                  return (
                    <button
                      key={elem}
                      onClick={() => setFilterElement(elem)}
                      className={`px-2 py-0.5 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                        filterElement === elem
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Nature Filter */}
              <div className="flex items-center gap-0.5 bg-gray-50 dark:bg-gray-900 p-0.5 rounded-xl border border-gray-200 dark:border-gray-700 text-[11px] shrink-0">
                <span className="text-gray-400 px-1.5 font-semibold text-[10px] shrink-0">{dict.filterNature}</span>
                {['Tous', 'Lumineuse', 'Sombre'].map(nat => {
                  const label = nat === 'Tous' ? dict.all : (nat === 'Lumineuse' ? dict.luminous : dict.dark);
                  return (
                    <button
                      key={nat}
                      onClick={() => setFilterNature(nat)}
                      className={`px-2 py-0.5 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                        filterNature === nat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Letter Cards Grid - 4 columns on small mobile, 7 on screens >=480px */}
          <div className="grid grid-cols-4 min-[480px]:grid-cols-7 gap-1.5 sm:gap-2.5 w-full max-w-full" dir="rtl">
            {filteredLetters.map((l) => (
              <motion.button
                key={l.char}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectLetter(l)}
                className={`flex flex-col items-center justify-center rounded-xl font-bold transition-all border relative p-1 sm:p-1.5 h-14 sm:h-16 w-full max-w-full overflow-hidden shrink-0 ${
                  selectedLetter?.char === l.char 
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20 z-10' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                }`}
              >
                <span className="text-lg sm:text-2xl font-arabic leading-none">{l.char}</span>
                <div className="flex items-center gap-0.5 mt-1 leading-none">
                  <span className={`text-[9px] sm:text-[10px] font-sans font-mono ${selectedLetter?.char === l.char ? 'text-emerald-100' : 'text-gray-400'}`}>{l.abjad}</span>
                  <span className="text-[8px] sm:text-[9px] opacity-80">{getElementIcon(l.element)}</span>
                </div>
                
                {/* Visual Indicator of Nature */}
                <span className={`absolute top-1 left-1 w-1.5 h-1.5 rounded-full ${l.nature.includes('Lumineuse') ? 'bg-amber-400 shadow-sm' : 'bg-slate-400'}`} />
              </motion.button>
            ))}
          </div>

          {/* Selected Letter Detailed Breakdown Section */}
          <div ref={detailsRef} className="pt-2 w-full max-w-full">
            <AnimatePresence mode="wait">
              {selectedLetter && (
                <motion.div
                  key={selectedLetter.char}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-gray-800 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-xl space-y-4 sm:space-y-5 relative overflow-hidden w-full max-w-full"
                >
                  <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Info */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 relative z-10 w-full max-w-full">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center rounded-2xl text-3xl sm:text-5xl font-arabic shadow-md shrink-0 border-2 border-emerald-200 dark:border-emerald-900/60">
                      {selectedLetter.char}
                    </div>

                    <div className="flex-1 w-full max-w-full min-w-0 text-center sm:text-left space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full max-w-full">
                        <div className="min-w-0">
                          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white truncate">{selectedLetter.name}</h2>
                            <span className="text-base sm:text-lg font-arabic text-emerald-600 dark:text-emerald-400">({selectedLetter.nameAr})</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                            Anatomie Spirituelle : <strong className="text-emerald-600 dark:text-emerald-400">{selectedLetter.bodyPart}</strong>
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 shrink-0">
                          <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 whitespace-nowrap">
                            Abjad Standard : {selectedLetter.abjad}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/50 whitespace-nowrap">
                            Abjad Kabir : {selectedLetter.abjadKabir}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1 w-full max-w-full">
                        <span className="text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium whitespace-nowrap">
                          {getElementIcon(selectedLetter.element)} Élément : {selectedLetter.element}
                        </span>
                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-medium whitespace-nowrap ${selectedLetter.nature.includes('Lumineuse') ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}>
                          Nature : {selectedLetter.nature}
                        </span>
                        <span className="text-[10px] sm:text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                          Astre : {selectedLetter.planet}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Le Secret (Sirr) */}
                  <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl p-3.5 sm:p-5 border border-emerald-500/20 w-full max-w-full overflow-hidden">
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                      <Key size={18} className="text-emerald-500 shrink-0" /> Le Secret Initiatique (Sirr al-Huruf)
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium text-xs sm:text-base break-words">
                      "{selectedLetter.secret}"
                    </p>
                  </div>

                  {/* Correspondances Spirituelles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
                    {/* Ange / Rouhaniyya */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 w-full max-w-full overflow-hidden">
                      <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Sparkles size={14} className="shrink-0" /> Ange Serviteur (Rouhaniyya)
                      </p>
                      <div className="flex justify-between items-end mt-1.5 gap-2 w-full">
                        <p className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base truncate">{selectedLetter.angel}</p>
                        <p className="text-lg sm:text-xl font-arabic font-bold text-blue-600 dark:text-blue-400 shrink-0" dir="rtl">{selectedLetter.angelArabic}</p>
                      </div>
                    </div>

                    {/* Serviteur / Jinn */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 w-full max-w-full overflow-hidden">
                      <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Shield size={14} className="shrink-0" /> Serviteur Terrestre (Khadim)
                      </p>
                      <div className="flex justify-between items-end mt-1.5 gap-2 w-full">
                        <p className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base truncate">{selectedLetter.demon}</p>
                        <p className="text-lg sm:text-xl font-arabic font-bold text-red-600 dark:text-red-400 shrink-0" dir="rtl">{selectedLetter.demonArabic}</p>
                      </div>
                    </div>

                    {/* Encens (Bakhour) */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 w-full max-w-full overflow-hidden">
                      <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Wind size={14} className="shrink-0" /> Encens Sacré (Bakhour)
                      </p>
                      <p className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base mt-1.5 truncate">{selectedLetter.incense}</p>
                    </div>
                  </div>

                  {/* Dedicated Secret Wird Card */}
                  <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/30 space-y-3 sm:space-y-4 w-full max-w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-indigo-800/50 pb-3 w-full max-w-full">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 flex-wrap">
                          <Star size={12} className="shrink-0" /> Wird Secret ({selectedLetter.secretWird.master})
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-1 break-words">{selectedLetter.secretWird.title}</h4>
                      </div>
                      <span className="text-[11px] sm:text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono font-bold self-start sm:self-auto shrink-0 whitespace-nowrap">
                        Répétition : {selectedLetter.secretWird.repetitionCount}x
                      </span>
                    </div>

                    {/* Arabic Invocation Text */}
                    <div 
                      className={`p-3.5 sm:p-4 bg-slate-950/80 rounded-xl border border-indigo-900/50 text-center relative group w-full max-w-full overflow-hidden ${
                        disableDuaCopy ? 'select-none' : ''
                      }`}
                      onCopy={(e) => { if (disableDuaCopy) e.preventDefault(); }}
                      onContextMenu={(e) => { if (disableDuaCopy) e.preventDefault(); }}
                    >
                      <p className="text-xl sm:text-3xl font-quran leading-relaxed sm:leading-loose text-amber-100 break-words px-2" dir="rtl" style={{ direction: 'rtl' }}>
                        {selectedLetter.secretWird.arabicText}
                      </p>
                      {!disableDuaCopy && (
                        <button
                          onClick={() => handleCopy(selectedLetter.secretWird.arabicText, `card-${selectedLetter.char}`)}
                          className="absolute top-2 right-2 p-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copier le texte"
                        >
                          {copiedText === `card-${selectedLetter.char}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-indigo-200 italic break-words">
                      <strong>Phonétique :</strong> "{selectedLetter.secretWird.transliteration}"
                    </p>

                    <p className="text-xs text-gray-300 break-words">
                      <strong>Traduction :</strong> "{selectedLetter.secretWird.translation}"
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5 text-xs border-t border-indigo-900/40 w-full max-w-full">
                      <span className="text-emerald-400 font-bold shrink-0">Bienfaits :</span>
                      {selectedLetter.secretWird.benefits.map((b, idx) => (
                        <span key={idx} className="bg-indigo-900/40 text-indigo-200 px-2.5 py-0.5 rounded-md text-[11px] break-words">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* TAB 2: EXTRACTION DE ROUHANIYYA (NOM) */}
      {activeTab === 'calculator' && (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 w-full max-w-full overflow-hidden">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-emerald-500 shrink-0" size={20} /> {t("sciencePage.rouhaniyyaExtractorTitle", "Extracteur de Rouhaniyya & Lettres de Nom")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {t("sciencePage.rouhaniyyaExtractorDesc", "Saisissez un prénom ou un mot en arabe (ex: \"محمد\" ou \"علي\" ou votre prénom) pour extraire la composition des lettres, l'élément dominant et la formule de Wird personnalisée.")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-full">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Ex: محمد..."
              className="flex-1 w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-base sm:text-lg font-arabic text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              dir="rtl"
            />
            <button
              onClick={calculateNameRouhaniyya}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles size={18} /> {t("sciencePage.extractRouhaniyya", "Extraire la Rouhaniyya")}
            </button>
          </div>

          {extractedResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700 w-full max-w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-full">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t("sciencePage.totalAbjadValue", "Total Valeur Abjad")}</span>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{extractedResult.totalAbjad}</p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/40 text-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">{t("sciencePage.dominantElement", "Élément Dominant")}</span>
                  <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1 flex items-center justify-center gap-1">
                    {getElementIcon(extractedResult.dominantElement)} {extractedResult.dominantElement}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/40 text-center">
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase">{t("sciencePage.recommendedRepetition", "Répétition Recommandée")}</span>
                  <p className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300 mt-1">{extractedResult.recommendedZikrCount}x</p>
                </div>
              </div>

              {/* Individual Found Letters */}
              <div className="w-full max-w-full">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t("sciencePage.componentLetters", "Lettres Composantes")} ({extractedResult.foundLetters.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-full">
                  {extractedResult.foundLetters.map((l: LetterInfo, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between min-w-0">
                      <span className="text-2xl font-arabic font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{l.char}</span>
                      <div className="text-right min-w-0 truncate">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{l.name}</p>
                        <p className="text-[10px] text-gray-400">Abjad : {l.abjad}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Generated Wird */}
              <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 text-white border border-emerald-500/30 space-y-3 w-full max-w-full overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">{t("sciencePage.deducedInvocationFormula", "Formule d'Invocation Déduite")}</h4>
                <p className="text-base sm:text-lg font-arabic leading-relaxed text-amber-100 break-words" dir="rtl">
                  يَا {extractedResult.foundLetters[0]?.angelArabic || 'هَطْمَائِيلُ'} بِحَقِّ سِرِّ الحُرُوفِ ({extractedResult.foundLetters.map((l: LetterInfo) => l.char).join(' - ')}) اِجْعَلْ لِي مِنْ كُلِّ ضِيقٍ مَخْرَجًا
                </p>
                <p className="text-xs text-gray-300 leading-relaxed break-words">
                  Répéter la formule <strong>{extractedResult.recommendedZikrCount} fois</strong> après la prière du Fajr ou du 'Isha avec l'encens recommandé (<strong>{extractedResult.foundLetters[0]?.incense || 'Musc'}</strong>).
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 3: COMPATIBILITÉ SPIRITUELLE (TAWAFUQ) */}
      {activeTab === 'tawafuq' && (
        <SpiritualCompatibilityTawafuq />
      )}

      {/* TAB 4: CARRÉS MAGIQUES (KHATIM / WAFQ) */}
      {activeTab === 'khatim' && (
        <KhatimWafqGenerator />
      )}

      {/* TAB 5: HORLOGE PLANÉTAIRE DES LETTRES */}
      {activeTab === 'clock' && (
        <PlanetaryLetterClock />
      )}
      {activeTab === 'vault' && (
        <div className="space-y-6 w-full max-w-full">
          <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 p-4 sm:p-6 rounded-3xl border border-amber-500/30 w-full max-w-full">
            <h2 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Key className="text-amber-500 shrink-0" size={20} /> {t("sciencePage.secretVaultTitle", "Le Caveau des Wirds Secrets des Grands Maîtres Initiés")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
              {t("sciencePage.secretVaultDesc", "Ces invocations et wirds sacrés sont attribués aux plus grands imams et cheikhs.")}
            </p>

            {/* Master Filter Buttons Bar */}
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto hide-scrollbar touch-pan-x pb-1 pt-1">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0 mr-1">{t("sciencePage.filterByMaster", "Filtrer par Maître :")}</span>
              {[
                { label: t("sciencePage.allMasters", "Tous les Maîtres"), value: 'Tous' },
                { label: 'Imam Al-Ghazali', value: 'Ghazali' },
                { label: 'Ibn \'Arabi', value: 'Arabi' },
                { label: 'Cheikh \'Abdul Qadir al-Jilani', value: 'Jilani' },
                { label: 'Imam Al-Nawawi', value: 'Nawawi' },
                { label: 'Imam Ash-Shadhili', value: 'Shadhili' },
                { label: 'Imam Al-Buni', value: 'Buni' },
                { label: 'Cheikh At-Tijani', value: 'Tijani' },
                { label: 'Imam Ar-Rifa\'i', value: 'Rifa\'i' },
                { label: 'Imam Al-Busiri', value: 'Busiri' },
                { label: 'Al-Tilimsani', value: 'Tilimsani' },
                { label: 'Ma al-\'Aynayn', value: 'Aynayn' }
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMasterFilter(m.value)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    selectedMasterFilter === m.value
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700 border border-amber-200/50 dark:border-gray-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full max-w-full">
            {GRAND_MASTER_WORDS.filter((w) => {
              if (selectedMasterFilter === 'Tous') return true;
              return w.master.toLowerCase().includes(selectedMasterFilter.toLowerCase()) || 
                     w.id.toLowerCase().includes(selectedMasterFilter.toLowerCase());
            }).map((w) => (
              <div key={w.id} className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg space-y-4 relative overflow-hidden w-full max-w-full">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3 w-full max-w-full">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{w.master}</span>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mt-0.5 break-words">{w.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] sm:text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold">
                      Lettre : {w.targetLetter}
                    </span>
                    <span className="text-[11px] sm:text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-full font-mono font-bold">
                      {w.repetitionCount}x
                    </span>
                  </div>
                </div>

                {/* Arabic Text */}
                <div 
                  className={`p-3.5 sm:p-4 bg-slate-900 text-amber-100 rounded-2xl border border-slate-800 text-center relative w-full max-w-full overflow-hidden ${
                    disableDuaCopy ? 'select-none' : ''
                  }`}
                  onCopy={(e) => { if (disableDuaCopy) e.preventDefault(); }}
                  onContextMenu={(e) => { if (disableDuaCopy) e.preventDefault(); }}
                >
                  <p className="text-lg sm:text-2xl font-arabic leading-relaxed sm:leading-loose break-words px-2" dir="rtl">{w.arabicText}</p>
                  {!disableDuaCopy && (
                    <button
                      onClick={() => handleCopy(w.arabicText, w.id)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors cursor-pointer"
                      title="Copier le texte"
                    >
                      {copiedText === w.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>

                <div className="space-y-1 text-xs break-words">
                  <p className="text-gray-600 dark:text-gray-400"><strong>Phonétique :</strong> "{w.transliteration}"</p>
                  <p className="text-gray-800 dark:text-gray-200"><strong>Traduction :</strong> "{w.translation}"</p>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs space-y-1 w-full max-w-full">
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold break-words"><strong>Rituel d'Exécution :</strong> {w.ritual}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1 w-full max-w-full">
                    {w.benefits.map((b, i) => (
                      <span key={i} className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium text-[11px] break-words">
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScienceOfLetters;
