import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Search, ArrowLeft, RefreshCw, Sparkles, BookOpen, Folder as FolderIcon, Trash2, Save, Heart, Clock, Sun, Moon, Calendar, CheckCircle2, Copy, Check, Eye, Compass, Plus, ShieldCheck, Download, Feather } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { exportWirdToImage } from '../../../utils/wirdExporter';
import { getZikrCache, setZikrCache, syncPersonalWirdsOffline } from '../../../utils/zikrSyncEngine';
import { RitualDhikrCalculator } from '../../../components/RitualDhikrCalculator';

interface SavedWird {
  id: string;
  name: string;
  arabic: string;
  weight: number;
  folderId: string;
  dateSaved: string;
}

interface Folder {
  id: string;
  name: string;
}

interface GhazaliWirdItem {
  id: string;
  dayFr: string;
  dayEn: string;
  dayHa: string;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  arabic: string;
  transliteration: string;
  translationFr: string;
  translationEn: string;
  translationHa: string;
  count: number;
  virtueFr: string;
  virtueEn: string;
  virtueHa: string;
}

const GHAZALI_WEEKLY_WORDS: GhazaliWirdItem[] = [
  {
    id: 'ghazali_friday',
    dayFr: 'Vendredi',
    dayEn: 'Friday',
    dayHa: 'Jumma\'a',
    titleFr: 'Wird du Vendredi : Le Nom Majestueux',
    titleEn: 'Friday Wird: The Supreme Name',
    titleHa: 'Zikirin Jumma\'a: Sunan Girma',
    arabic: 'يَا أَللَّهُ',
    transliteration: 'Ya Allah',
    translationFr: 'Ô Allah, le Nom Divin Suprême',
    translationEn: 'O Allah, the Supreme Divine Name',
    translationHa: 'Ya Allah, Sunan Allah Mafi Girma',
    count: 1000,
    virtueFr: 'Lumière de certitude, élévation de l\'âme et concrétisation de la foi.',
    virtueEn: 'Light of certainty, elevation of the soul, and fulfillment of faith.',
    virtueHa: 'Hasken tabbas, daukakar ruhi da cikar imani.'
  },
  {
    id: 'ghazali_saturday',
    dayFr: 'Samedi',
    dayEn: 'Saturday',
    dayHa: 'Asabar',
    titleFr: 'Wird du Samedi : L\'Unicité Purificatrice',
    titleEn: 'Saturday Wird: Purifying Tawhid',
    titleHa: 'Zikirin Asabar: Kadaita Allah',
    arabic: 'لاَ إِلَهَ إِلاَّ ٱللَّهُ',
    transliteration: 'La ilaha illa Allah',
    translationFr: 'Il n\'y a de divinité qu\'Allah',
    translationEn: 'There is no god but Allah',
    translationHa: 'Babu abun bautawa da gaskiya sai Allah',
    count: 1000,
    virtueFr: 'Effacement des doutes, illumination du cœur et bouclier contre l\'illusion.',
    virtueEn: 'Removal of doubts, illumination of the heart, and shield against illusion.',
    virtueHa: 'Yaye doubt, hasken zuciya da kariya daga rudu.'
  },
  {
    id: 'ghazali_sunday',
    dayFr: 'Dimanche',
    dayEn: 'Sunday',
    dayHa: 'Lahadi',
    titleFr: 'Wird du Dimanche : La Vie & la Subsistance Divine',
    titleEn: 'Sunday Wird: Divine Life & Sustenance',
    titleHa: 'Zikirin Lahadi: Rayuwa da Arzikin Ubangiji',
    arabic: 'يَا حَيُّ يَا قَيُّومُ',
    transliteration: 'Ya Hayyu Ya Qayyumu',
    translationFr: 'Ô Vivant, Ô Subsistant par Soi-même',
    translationEn: 'O Ever-Living, O Self-Sustaining Sustainer',
    translationHa: 'Ya Rayayye, Ya Mai Tsayawa da Kansa',
    count: 1000,
    virtueFr: 'Revitalisation du cœur mort, clarté d\'esprit et subsistance bénie.',
    virtueEn: 'Revitalization of the dead heart, clarity of mind, and blessed sustenance.',
    virtueHa: 'Rayar da zuciya matacciya, natsuwar hankali da arzuki mai albarka.'
  },
  {
    id: 'ghazali_monday',
    dayFr: 'Lundi',
    dayEn: 'Monday',
    dayHa: 'Litinin',
    titleFr: 'Wird du Lundi : La Force Absolue',
    titleEn: 'Monday Wird: Absolute Divine Power',
    titleHa: 'Zikirin Litinin: Karfin Ubangiji',
    arabic: 'لاَ حَوْلَ وَلاَ قُوَّۃَ إِلاَّ بِٱللَّهِ ٱلْعَلِيِّ ٱلْعَظِيمِ',
    transliteration: 'La hawla wa la quwwata illa billahi al-\'Aliyyi al-\'Adheem',
    translationFr: 'Il n\'y a de force ni de puissance qu\'en Allah, le Très-Haut, l\'Immense',
    translationEn: 'There is no power nor strength except with Allah, the Most High, the Supreme',
    translationHa: 'Babu dabara kuma babu karfi sai tare da Allah Mafi Daukaka Mafi Girma',
    count: 1000,
    virtueFr: 'Dénouement des situations impossibles, protection et levée des fardeaux.',
    virtueEn: 'Unraveling impossible situations, protection, and lifting of heavy burdens.',
    virtueHa: 'Bude abubuwa masu wuya, kariya da cire nauyi.'
  },
  {
    id: 'ghazali_tuesday',
    dayFr: 'Mardi',
    dayEn: 'Tuesday',
    dayHa: 'Talata',
    titleFr: 'Wird du Mardi : Bénédiction sur le Prophète ﷺ',
    titleEn: 'Tuesday Wird: Blessings upon the Prophet ﷺ',
    titleHa: 'Zikirin Talata: Salatin Annabi ﷺ',
    arabic: 'ٱللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَعَلَىٰ آلِهِ وَصَحْبِهِ وَسَلِّمْ',
    transliteration: 'Allahumma salli \'ala Sayyidina Muhammadin wa \'ala alihi wa sahbihi wa sallim',
    translationFr: 'Ô Allah, répands Tes bénédictions et Ta paix sur notre Maître Muhammad, sa famille et ses compagnons',
    translationEn: 'O Allah, send blessings and peace upon our Master Muhammad, his family and companions',
    translationHa: 'Ya Allah, ka yi salati da taslima ga Shugabanmu Muhammadu da alalensa da sahabansa',
    count: 1000,
    virtueFr: 'Attraction de la miséricorde divine, apaisement de l\'âme et réponse aux invocations.',
    virtueEn: 'Attraction of divine mercy, soothing of the soul, and answered prayers.',
    virtueHa: 'Jan hankalin rahama, samun natsuwar ruhi da karɓar addu\'o\'i.'
  },
  {
    id: 'ghazali_wednesday',
    dayFr: 'Mercredi',
    dayEn: 'Wednesday',
    dayHa: 'Larabawa',
    titleFr: 'Wird du Mercredi : L\'Istiġfār Purificateur',
    titleEn: 'Wednesday Wird: Purifying Istighfar',
    titleHa: 'Zikirin Laraba: Neman Gafara',
    arabic: 'أَسْتَغْفِرُ ٱللَّهَ ٱلْعَظِيمَ ٱلَّذِي لاَ إِلَهَ إِلاَّ هُوَ ٱلْحَيُّ ٱلْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah al-\'Adheem alladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh',
    translationFr: 'Je demande pardon à Allah l\'Immense, en dehors de Qui il n\'y a point de divinité, le Vivant, le Subsistant, et je me repens à Lui',
    translationEn: 'I seek forgiveness from Allah the Supreme, besides Whom there is no god, the Ever-Living, the Self-Sustaining, and I repent to Him',
    translationHa: 'Ina neman gafarar Allah Mafi Girma, wanda babu abun bautawa da gaskiya sai Shi, Rayayye Mai Tsayawa, kuma ina tuba gare Shi',
    count: 1000,
    virtueFr: 'Lavage des erreurs, ouverture des vannes du pardon et purification spirituelle.',
    virtueEn: 'Cleansing of shortcomings, opening the gates of forgiveness and spiritual purity.',
    virtueHa: 'Wanke kuskure, bude kofofin gafara da tsarkakewar ruhi.'
  },
  {
    id: 'ghazali_thursday',
    dayFr: 'Jeudi',
    dayEn: 'Thursday',
    dayHa: 'Alhamis',
    titleFr: 'Wird du Jeudi : La Glorification Angélique',
    titleEn: 'Thursday Wird: Angelic Glorification',
    titleHa: 'Zikirin Alhamis: Tasbihin Mala\'iku',
    arabic: 'سُبْحَانَ ٱللَّهِ وَبِحَمْدِهِ سُبْحَانَ ٱللَّهِ ٱلْعَظِيمِ',
    transliteration: 'Subhanallahi wa bi-hamdihi Subhanallahi al-\'Adheem',
    translationFr: 'Gloire à Allah et louange à Lui, Gloire à Allah l\'Immense',
    translationEn: 'Glory be to Allah and His praise, Glory be to Allah the Supreme',
    translationHa: 'Tsarki ya tabbata ga Allah da yabo gare Shi, Tsarki ya tabbata ga Allah Mafi Girma',
    count: 1000,
    virtueFr: 'Lourdeur suprême sur la balance des actions, amour divin et sérénité.',
    virtueEn: 'Supreme weight on the scale of deeds, divine love, and deep serenity.',
    virtueHa: 'Nauyi a sikelin ayyuka, soyayyar Ubangiji da samun natsuwa.'
  }
];

const GHAZALI_PURIFICATION_STEPS = [
  {
    step: "1",
    nameFr: "Al-Musha'rata (L'Engagement Intérieur)",
    nameEn: "Al-Musha'rata (Inner Commitment)",
    nameHa: "Al-Musha'rata (Alkawarin Zuciya)",
    descFr: "Chaque matin après le Fajr, posez des conditions strictes à votre âme : vous engager solennellement à préserver vos yeux, vos oreilles, votre langue et vos pensées de toute faute.",
    descEn: "Every morning after Fajr, set strict conditions for your soul: solemnly vow to preserve your eyes, ears, tongue, and thoughts from any wrongdoing.",
    descHa: "Kowace safiya bayan Asuba, gindaya sharuda masu tsauri ga ruhinka: daukar alkawari na kare idanu, kunnuwa, harshe da tunani daga sabo.",
    icon: Shield
  },
  {
    step: "2",
    nameFr: "Al-Muraqaba (La Vigilance Continuelle)",
    nameEn: "Al-Muraqaba (Continuous Vigilance)",
    nameHa: "Al-Muraqaba (Lura da Ubangiji)",
    descFr: "Maintenez la conscience vivante qu'Allah observe chaque battement de votre cœur. Avant chaque geste ou parole, demandez-vous : 'Est-ce pour Allah ou pour mon ego ?'",
    descEn: "Maintain active awareness that Allah observes every heartbeat. Before any action or word, ask yourself: 'Is this for Allah or for my ego?'",
    descHa: "Kasance da kyakkyawan tunani cewa Allah yana lura da kowace bugun zuciya. Kafin kowane motsi ko magana, tambayi kanka: 'Sodomin Allah ne ko sodomin buƙata ta?'",
    icon: Eye
  },
  {
    step: "3",
    nameFr: "Al-Muhasaba (L'Examen de Conscience)",
    nameEn: "Al-Muhasaba (Self-Accounting)",
    nameHa: "Al-Muhasaba (Hisabin Kai)",
    descFr: "Chaque soir avant de vous endormir, passez en revue votre journée comme un marchand fait son inventaire. Remerciez pour le bien accompli, et demandez pardon pour les faiblesses.",
    descEn: "Every night before sleep, review your day as a merchant audits his inventory. Give thanks for good deeds, and seek forgiveness for shortcomings.",
    descHa: "Kowace darare kafin barci, binciki ayyukanka na yau kamar yadda ɗan kasuwa ke hisabi. Yi godiya kan alheri, kuma nemi gafara kan kuskure.",
    icon: BookOpen
  },
  {
    step: "4",
    nameFr: "Al-Mujahada (L'Autocorrection & la Lutte)",
    nameEn: "Al-Mujahada (Self-Correction & Struggle)",
    nameHa: "Al-Mujahada (Yaki da Soje)",
    descFr: "Si votre âme a glissé vers la colère, l'orgueil ou la paresse, imposez-lui une discipline corrective immédiate : aumône discrète, jeûne surérogatoire ou récitation accrue de Zikr.",
    descEn: "If your soul slipped into anger, pride, or laziness, impose immediate corrective discipline: quiet charity, voluntary fasting, or increased Dhikr.",
    descHa: "Idan ruhinka ya karkata zuwa fushi, girman kai ko kasala, sanya masa horo nan take: sadaka ta sirri, azumi na son rai ko karara zikiri.",
    icon: RefreshCw
  }
];

const GHAZALI_HEART_DISEASES = [
  {
    diseaseFr: "Al-Kibr (L'Orgueil)",
    diseaseEn: "Al-Kibr (Pride)",
    diseaseHa: "Al-Kibr (Girman Kai)",
    remedyFr: "S'asseoir à terre avec les humbles, effectuer des tâches ménagères et méditer sur la fragilité de la condition humaine.",
    remedyEn: "Sit on the floor with the humble, perform household chores, and reflect on the fragility of human existence.",
    remedyHa: "Zama a kasa tare da talakawa, yin ayyukan gida da tunanin raunin dan adam."
  },
  {
    diseaseFr: "Ar-Riya' (L'Ostentation)",
    diseaseEn: "Ar-Riya' (Showiness / Ostentation)",
    diseaseHa: "Ar-Riya' (Nuna Aiki)",
    remedyFr: "Pratiquer ses Wirds, ses prières surérogatoires et ses aumônes dans le secret le plus absolu sans en parler à personne.",
    remedyEn: "Practice your Wirds, extra prayers, and charity in absolute secrecy without mentioning them to anyone.",
    remedyHa: "Yin zikirori, nafilfili da sadaka a sirri na karshe ba tare da gayawa kowa ba."
  },
  {
    diseaseFr: "Al-Hasad (L'Envie)",
    diseaseEn: "Al-Hasad (Envy)",
    diseaseHa: "Al-Hasad (Hassada)",
    remedyFr: "Prier secrètement pour que la personne enviée reçoive encore plus de bienfaits, et lui offrir des cadeaux bienveillants.",
    remedyEn: "Pray secretly for the envied person to receive even more blessings, and offer them thoughtful gifts.",
    remedyHa: "Yin addu'a a sirri domin wanda ake hassada ya samu karin albarka, da basu kyaututtuka."
  },
  {
    diseaseFr: "Hubb ad-Dunya (L'Attachement Terrestre)",
    diseaseEn: "Hubb ad-Dunya (Love of the World)",
    diseaseHa: "Hubb ad-Dunya (Son Duniya)",
    remedyFr: "Méditer quotidiennement sur la mort (Dhikr al-Mawt) et se rappeler que tout bien matériel n'est qu'un prêt temporaire.",
    remedyEn: "Daily reflection on death (Dhikr al-Mawt) and remembering that material goods are merely temporary loans.",
    remedyHa: "Tunanin mutuwa kowace rana da tunawa cewa duk wani abun duniya aro ne kawai."
  }
];

const GHAZALI_OPTIMAL_TIMES = [
  {
    periodFr: "1. De l'Aube (Fajr) au Lever du Soleil (Ishraq)",
    periodEn: "1. From Dawn (Fajr) to Sunrise (Ishraq)",
    periodHa: "1. Daga Asuba zuwa Fitowar Rana",
    arabicTime: "وِردُ الصَّبَاحِ وَالإِشْرَاقِ",
    activityFr: "Consacré exclusivement au Zikr concentré, aux invocations du matin, à l'Istiġfār et à la récitation du Coran. C'est l'heure de la distribution des subsistances spirituelles. Ne pas se rendormir.",
    activityEn: "Dedicated exclusively to concentrated Dhikr, morning supplications, Istighfar, and Quran recitation. This is the hour of spiritual sustenance distribution. Avoid going back to sleep.",
    activityHa: "Keɓaɓɓe domin zikiri, addu'o'in safe, neman gafara da karatun Alqur'ani. Lokacin rabon arzuki ne na ruhi. Kada a koma barci.",
    icon: Sun,
    badgeColor: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
  },
  {
    periodFr: "2. Du Lever du Soleil au Milieu de la Matinée (Duha)",
    periodEn: "2. From Sunrise to Mid-Morning (Duha)",
    periodHa: "2. Daga Fitowar Rana zuwa Hantsi",
    arabicTime: "صَلاَةُ الضُّحَى وَالتَّفَكُّرُ",
    activityFr: "Prière de Duha (2 à 8 rak'ats), étude des sciences utiles, méditation sur la création et accomplissement des devoirs professionnels avec intention sacrée.",
    activityEn: "Duha prayer (2 to 8 units), study of beneficial knowledge, reflection on creation, and fulfilling professional duties with sacred intention.",
    activityHa: "Sallar Hantsi (raka'a 2 zuwa 8), neman ilimi mai amfani, tunani kan halittar Allah da yin ayyukan yau da kullun da niyya mai kyau.",
    icon: Sparkles,
    badgeColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
  },
  {
    periodFr: "3. Du Milieu de Journée (Zawal/Dhuhr) au Milieu d'Après-Midi ('Asr)",
    periodEn: "3. From Midday (Dhuhr) to Mid-Afternoon ('Asr)",
    periodHa: "3. Daga Azahar zuwa La'asar",
    arabicTime: "القَيْلُولَةُ وَوِرْدُ الظُّهْرِ",
    activityFr: "Courte sieste régénératrice (Qaylula - 15-30 min) avant ou après Dhuhr avec l'intention de fortifier le corps pour le Tahajjud. Prière de Dhuhr et invocations associées.",
    activityEn: "Short regenerative nap (Qaylula - 15-30 min) before or after Dhuhr to strengthen the body for night vigil. Dhuhr prayer and associated litanies.",
    activityHa: "Barcin rana mai gajere (Qaylula) domin samun karfin yin tahajjud a daren. Sallar Azahar da addu'o'in da ke tattare da ita.",
    icon: Compass,
    badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
  },
  {
    periodFr: "4. De la Prière d'Asr au Coucher du Soleil (Maghrib)",
    periodEn: "4. From 'Asr Prayer to Sunset (Maghrib)",
    periodHa: "4. Daga La'asar zuwa Magriba",
    arabicTime: "وِردُ العَصْرِ وَالأَصِيلِ",
    activityFr: "Période sacrée de l'Asil. Récitation intensive de Salawat et d'Istighfar. La toute dernière heure avant le Maghrib (l'heure dorée) est l'un des créneaux d'exaucement majeurs chez l'Imam Al-Ghazali.",
    activityEn: "Sacred period of Asil. Intensive recitation of Salawat and Istighfar. The final hour before Maghrib (golden hour) is a prime time for granted prayers according to Imam Al-Ghazali.",
    activityHa: "Lokaci mai albarka na Asil. Karanta salati da neman gafara sosai. Sa'a ta karshe kafin Magriba na daya daga cikin lokutan karɓar addu'a.",
    icon: Sun,
    badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
  },
  {
    periodFr: "5. Du Coucher du Soleil (Maghrib) à la Prière de la Nuit ('Isha)",
    periodEn: "5. From Sunset (Maghrib) to Night Prayer ('Isha)",
    periodHa: "5. Daga Magriba zuwa Isha'i",
    arabicTime: "صَلاَةُ الأَوَّابِينَ وَإِحْيَاءُ المَغْرِبِ",
    activityFr: "Prière des Awcabin (2 à 6 rak'ats entre Maghrib et 'Isha), lecture du Coran (Sourates Al-Waqi'a et Al-Mulk), et méditation sereine en famille ou dans la solitude.",
    activityEn: "Awcabin prayer (2 to 6 units between Maghrib and 'Isha), Quran reading (Surahs Al-Waqi'a & Al-Mulk), and peaceful reflection with family or in solitude.",
    activityHa: "Sallar Awcabin (raka'a 2 zuwa 6 tsakanin Magriba da Isha'i), karatun Suratul Waqi'a da Al-Mulk, da natsuwa a gida ko keɓewa.",
    icon: Moon,
    badgeColor: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
  },
  {
    periodFr: "6. Le Dernier Tiers de la Nuit (Tahajjud & Sahar)",
    periodEn: "6. The Last Third of the Night (Tahajjud & Sahar)",
    periodHa: "6. Kashi na Karshe na Dare (Tahajjud)",
    arabicTime: "سِرُّ السَّحَرِ وَالمُنَاجَاةُ",
    activityFr: "L'apogée mystique chez Imam Al-Ghazali. Prière de Tahajjud, pleurs d'amour et de crainte, récitation du Wird secret et invocations d'intimité avec le Créateur (*Al-Munajat*).",
    activityEn: "The mystical apex according to Imam Al-Ghazali. Tahajjud vigil, tears of divine love and awe, recitation of secret Wird, and intimate communion with the Creator (*Al-Munajat*).",
    activityHa: "Toluwar lokaci ga Imam Al-Ghazali. Sallar Tahajjud, kuka saboda tsoro da soyayyar Allah, karanta wirdi na sirri da keɓewa da Ubangiji.",
    icon: Sparkles,
    badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
  }
];

const GHAZALI_MAJOR_LITANIES = [
  {
    id: 'ghazali_muthallath_personal',
    titleFr: 'Wird Al-Muthallath Al-Ghazali (Le Secret de la Grâce & du Dénouement)',
    titleEn: 'Wird Al-Muthallath Al-Ghazali (Secret of Grace & Release)',
    titleHa: 'Zikirin Al-Muthallath na Al-Ghazali (Sirrin Rahama da Warware Matsala)',
    arabic: 'يَا لَطِيفًا لَمْ يَزَلْ أُلْطُفْ بِنَا فِيمَا نَزَلْ، إِنَّكَ لَطِيفٌ لَمْ تَزَلْ، أُلْطُفْ بِنَا وَالمُسْلِمِينَ، بِسِرِّ سِرِّ خَاتَمِ الغَزَالِيِّ وَالمِفْتَاحِ المُبَارَكِ.',
    transliteration: 'Ya Latifan lam yazal ultuf bina fima nazal, innaka Latifun lam yazal, ultuf bina wal-Muslimin, bi-sirri sirri khatami al-Ghazali wal-miftahi al-mubarak.',
    translationFr: 'Ô Subtil Qui ne cesse d\'être Doux, sois Doux envers nous dans les épreuves qui descendent. Tu es le Subtil Incomparable, étends Ta bienveillance sur nous par le mystère du Sceau de Ghazali.',
    translationEn: 'O Ever-Gentle One Who never ceases to be Kind, be Gentle with us in all that descends. You are the Subtle Incomparable, extend Your benevolence upon us through the secret of Ghazali\'s Seal.',
    translationHa: 'Ya Mai Sauki da Bayar da Rahama marar karewa, ka saukaka mana cikin abun da ya sauka. Kai Mai Tausayi ne, ka miƙa rahamarka gare mu.',
    repetitionCount: 129,
    benefitFr: 'Résolution miracle des difficultés inextricables, apaisement immédiat de l\'esprit et attraction de la douceur divine.',
    benefitEn: 'Miraculous resolution of intricate difficulties, immediate peace of mind, and attraction of divine grace.',
    benefitHa: 'Warware matsaloli cikin al\'ajabi, samun natsuwar zuciya da samun sauki daga Ubangiji.'
  },
  {
    id: 'ghazali_munajat_personal',
    titleFr: 'Wird Al-Munajat Al-Ghazaliyya (Prière d\'Intimité Spirituelle)',
    titleEn: 'Wird Al-Munajat Al-Ghazaliyya (Prayer of Spiritual Intimacy)',
    titleHa: 'Addu\'ar Kebewa ta Al-Ghazali (Munajat)',
    arabic: 'إِلَهِي أَنْتَ مَقْصُودِي وَرِضَاكَ مَطْلُوبِي، هَبْ لِي قَلْبًا سَلِيمًا نَقِيًّامِنَ العُيُوبِ، وَافْتَحْ لِي أَبْوَابَ مَعْرِفَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.',
    transliteration: 'Ilahi Anta maqsudi wa ridaka matlubi, hab li qalban saliman naqiyyan mina al-\'uyubi, wa-ftah li abwaba ma\'rifatika ya Arham ar-Rahimin.',
    translationFr: 'Mon Dieu, Tu es mon But ultime et Ton agrément est ma quête ; accorde-moi un cœur sain et purifié de tout défaut, et ouvre-moi les portes de Ta Connaissance, Ô Plus Miséricordieux des miséricordieux.',
    translationEn: 'My God, You are my ultimate Goal and Your pleasure is my pursuit; grant me a sound heart pure of defect, and open unto me the gates of Your knowledge, O Most Merciful of merciful ones.',
    translationHa: 'Ya Ubangijina, Kai ne manufata kuma samun yardarka shine buƙatata; ka ba ni zuciya mai tsarki mara aibi, kuma ka bude min kofofin saninki.',
    repetitionCount: 66,
    benefitFr: 'Illumination de l\'âme, éradication des voiles intérieurs et proximité divine.',
    benefitEn: 'Illumination of the soul, eradication of inner veils, and divine proximity.',
    benefitHa: 'Haskaka ruhi, cire shamaki na ciki da samun kusanci ga Allah.'
  }
];

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'daily', name: 'Quotidien (Daily)' },
  { id: 'special', name: 'Occasions Spéciales' },
  { id: 'healing', name: 'Guérison (Healing)' },
  { id: 'uncategorized', name: 'Non classés' }
];
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useFeatures } from '../../../contexts/FeatureContext';
import { motion } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { ASMA_AL_HUSNA } from '../../../utils/asmaData';
import { asmaListData } from '../../../data/asmaListData';
import { asmaListDataTranslations } from '../../../data/asmaListDataTranslations';
import { applyTashkeel } from '../../../utils/tashkeel';

const cleanArabic = (str: string) => {
  return str.replace(/[\u064B-\u065F\u0670]/g, "").replace(/\s+/g, "");
};

const getAsmaDetails = (plainName: string) => {
  const cleanedTarget = cleanArabic(plainName);
  return asmaListData.find(item => cleanArabic(item.ar) === cleanedTarget);
};

const getVocativeArabic = (arName: string) => {
  if (!arName) return '';
  const clean = arName.trim();
  if (clean === "الله" || clean === "اللَّهُ" || clean === "اللّه") {
    return "يَا ٱللَّهُ";
  }
  let base = clean.replace(/^ال[\u064B-\u0653\u0670]?/, '');
  if (base.length > 0) {
    const firstChar = base[0];
    const rest = base.slice(1).replace(/^\u0651/, '');
    base = firstChar + rest;
  }
  return `يَا ${base}`;
};

const getVocativeTransliteration = (tr: string) => {
  if (tr.toLowerCase() === "allah") return "Ya Allah";
  const hyphenIndex = tr.indexOf("-");
  if (hyphenIndex !== -1) {
    return "Ya " + tr.substring(hyphenIndex + 1);
  }
  return "Ya " + tr;
};

interface MatchResult {
  names: string[];
  totalAbjad: number;
  diff: number;
}

const wirdDict = {
  fr: {
    back: "Retour au tableau de bord",
    title: "Générateur de Wird Personnalisé (Istikhraj)",
    infoTitle: "Vos Informations",
    nameLabel: "Votre Prénom (en arabe)",
    motherNameLabel: "Prénom de la Mère (en arabe)",
    motherDesc: "La tradition mystique utilise le nom de la mère pour l'ancrage spirituel (Tariqa).",
    calculating: "Extraction en cours...",
    calculateBtn: "Calculer mon Wird",
    weightTitle: "Votre Poids Mystique (Abjad)",
    weightDesc: "Ceci représente la fréquence de votre existence.",
    supremeWird: "Votre Wird Suprême",
    valueZikr: (val: number) => `La valeur de ce Zikr est de ${val}.`,
    perfectMatch: "Correspondance parfaite avec votre empreinte spirituelle.",
    minorGap: (diff: number) => `Écart mineur: ${diff}`,
    recitationGuideline: (weight: number) => `Réciter ce Wird ${weight} fois chaque jour (de préférence après la prière du matin ou de la nuit) activera des ouvertures (Fath) et un alignement spirituel profond.`,
    waitingTitle: "En attente de calcul",
    waitingDesc: "Saisissez votre prénom et celui de votre mère en arabe pour découvrir votre Wird de résonance.",
    
    // Saved Wirds Translation
    savedTitle: "Mes Wirds Enregistrés",
    savedDesc: "Glissez-déposez vos wirds dans les dossiers pour les organiser (ou utilisez le sélecteur)",
    createFolder: "+ Créer un dossier",
    folderPlaceholder: "Nom du dossier...",
    addBtn: "Ajouter",
    cancelBtn: "Annuler",
    dragHere: "Glissez des wirds ici",
    frequency: "Fréquence",
    moveTo: "Vers",
    deleteFolder: "Supprimer le dossier",
    deleteWird: "Supprimer de mes wirds",
    alreadySaved: "Ce Wird est déjà enregistré.",
    saveSuccess: "Wird enregistré avec succès !",
    savedInUncategorized: "dans 'Non classés' ! Retrouvez-le ci-dessous.",

    // Folder translations
    folderDaily: "Quotidien",
    folderSpecial: "Occasions Spéciales",
    folderHealing: "Guérison",
    folderUncategorized: "Non classés",

    // Detailed Zikr sections
    zikrGuideTitle: "Guide d'accomplissement du Zikr",
    preparationTitle: "1. Préparation Physique et Spirituelle",
    preparationDesc: "Faites vos ablutions (Wudu), portez des vêtements propres et asseyez-vous dans un endroit calme en faisant face à la Qibla (direction de la Mecque). Allumez un encens doux si possible pour purifier l'atmosphère.",
    openingTitle: "2. Formules d'Ouverture (Prière d'initiation)",
    openingDesc: "Commencez par réciter l'Istighfar (demande de pardon) 11 fois pour purifier le cœur : 'Astaghfirullah al-Adheem'. Ensuite, récitez la Salawat (bénédiction sur le Prophète) 11 fois : 'Allahumma salli 'ala Sayyidina Muhammadin wa 'ala alihi wa sahbihi wa sallim'.",
    intentionTitle: "3. Intention de Résonance (Niyyah)",
    intentionDesc: "Formulez clairement votre intention dans votre cœur. Connectez votre conscience à la vibration divine des Noms d'Allah générés.",
    recitationTitle: "4. Récitation Active (Le Nombre exact)",
    recitationDesc: (weight: number) => `Récitez la formule sacrée combinée exactement ${weight} fois. Utilisez un chapelet (Tasbih) ou les phalanges de votre main droite pour compter avec dévotion et concentration.`,
    closingTitle: "5. Scellement et Doua (Clôture)",
    closingDesc: "Terminez en récitant à nouveau la Salawat 3 fois, puis faites vos douas (prières personnelles) en demandant à Allah de matérialiser les lumières et les bienfaits de ces nobles noms dans votre vie. Passez vos mains sur votre visage pour clore la séance.",
    optimalTimesTitle: "Moments Optimaux",
    optimalTimesDesc: "Après la prière de l'Aube (Fajr) pour l'énergie spirituelle de la journée, ou durant le dernier tiers de la nuit (Tahajjud) pour une intimité mystique maximale.",
    meaningTitle: "Signification & Secrets Spirituels",

    // Ghazali Section
    ghazaliTitle: "Sagesse & Wirds de l'Imam Al-Ghazali (حجة الإسلام)",
    ghazaliSubtitle: "Inspiré d'Ihya 'Ulum al-Din & Bidayat al-Hidayah : Purification du Cœur (Tazkiyat al-Qalb), litanies quotidiennes et horaires de pratique optimaux.",
    ghazaliTabWeekly: "Wirds Hebdomadaires",
    ghazaliTabPurification: "Purification du Cœur",
    ghazaliTabTimes: "Horaires Optimaux",
    ghazaliTabLitanies: "Litanies Majeures",
    ghazaliAddWird: "Ajouter à mes Wirds",
    ghazaliCopied: "Copié !",
    ghazaliStepsTitle: "Les 4 Étapes de la Discipline Intérieure (Ar-Riyāḍah)",
    ghazaliRemediesTitle: "Remèdes des Maladies du Cœur (Amrāḍ al-Qalb)",
    ghazaliWeeklyDesc: "L'Imam Al-Ghazali a consigné dans Bidayat al-Hidayah un Zikr spécifique de 1000 répétitions pour chaque jour de la semaine afin d'irradier le cœur de lumières célestes.",
    ghazaliPurificationDesc: "Méthodologie alchimique de purification de l'âme (Tazkiya) développée par l'Imam Al-Ghazali pour extirper les défauts spirituels et faire briller le miroir du cœur.",
    ghazaliTimesDesc: "L'organisation sacrée de la journée et de la nuit selon la tradition ghazalienne, divisée en 6 moments d'or pour maximiser la présence spirituelle.",
    ghazaliLitaniesDesc: "Les invocations et Wirds sacrés attribués à Hujjat al-Islam Imam Al-Ghazali pour le dénouement des épreuves et l'intimité divine."
  },
  en: {
    back: "Back to dashboard",
    title: "Personalized Wird Generator (Istikhraj)",
    infoTitle: "Your Information",
    nameLabel: "Your First Name (in Arabic)",
    motherNameLabel: "Mother's First Name (in Arabic)",
    motherDesc: "Mystical tradition uses the mother's name for spiritual grounding (Tariqa).",
    calculating: "Extracting...",
    calculateBtn: "Calculate my Wird",
    weightTitle: "Your Mystical Weight (Abjad)",
    weightDesc: "This represents the frequency of your existence.",
    supremeWird: "Your Supreme Wird",
    valueZikr: (val: number) => `The value of this Dhikr is ${val}.`,
    perfectMatch: "Perfect match with your spiritual imprint.",
    minorGap: (diff: number) => `Minor gap: ${diff}`,
    recitationGuideline: (weight: number) => `Reciting this Dhikr ${weight} times daily (preferably after morning or night prayer) will activate openings (Fath) and a deep spiritual alignment.`,
    waitingTitle: "Awaiting calculation",
    waitingDesc: "Enter your first name and your mother's first name in Arabic to discover your resonance Dhikr.",
    
    // Saved Wirds Translation
    savedTitle: "My Saved Wirds",
    savedDesc: "Drag and drop your wirds into folders to organize them (or use the selector)",
    createFolder: "+ Create a folder",
    folderPlaceholder: "Folder name...",
    addBtn: "Add",
    cancelBtn: "Cancel",
    dragHere: "Drag wirds here",
    frequency: "Frequency",
    moveTo: "Move to",
    deleteFolder: "Delete folder",
    deleteWird: "Delete from my wirds",
    alreadySaved: "This Wird is already saved.",
    saveSuccess: "Wird successfully saved!",
    savedInUncategorized: "in 'Uncategorized'! Find it below.",

    // Folder translations
    folderDaily: "Daily",
    folderSpecial: "Special Occasions",
    folderHealing: "Healing",
    folderUncategorized: "Uncategorized",

    // Detailed Zikr sections
    zikrGuideTitle: "Zikr Performance Guide",
    preparationTitle: "1. Physical and Spiritual Preparation",
    preparationDesc: "Perform your ablutions (Wudu), wear clean clothes, and sit in a quiet place facing the Qibla (direction of Mecca). Light a mild incense if possible to purify the atmosphere.",
    openingTitle: "2. Opening Formulas (Initiation Prayer)",
    openingDesc: "Begin by reciting Istighfar (seeking forgiveness) 11 times to purify the heart: 'Astaghfirullah al-Adheem'. Then, recite Salawat (blessings upon the Prophet) 11 times: 'Allahumma salli 'ala Sayyidina Muhammadin wa 'ala alihi wa sahbihi wa sallim'.",
    intentionTitle: "3. Resonance Intention (Niyyah)",
    intentionDesc: "Formulate your intention clearly in your heart. Connect your consciousness to the divine vibration of the generated Names of Allah.",
    recitationTitle: "4. Active Recitation (The Exact Count)",
    recitationDesc: (weight: number) => `Recite the combined sacred formula exactly ${weight} times. Use a rosary (Tasbih) or the joints of your right hand to count with devotion and concentration.`,
    closingTitle: "5. Sealing and Dua (Closing)",
    closingDesc: "Finish by reciting Salawat 3 times, then make your duas (personal supplications) asking Allah to manifest the lights and blessings of these noble names in your life. Wipe your hands over your face to conclude the session.",
    optimalTimesTitle: "Optimal Times",
    optimalTimesDesc: "After Dawn prayer (Fajr) for the day's spiritual energy, or during the last third of the night (Tahajjud) for maximum mystical intimacy.",
    meaningTitle: "Meaning & Spiritual Secrets",

    // Ghazali Section
    ghazaliTitle: "Wisdom & Wirds of Imam Al-Ghazali (حجة الإسلام)",
    ghazaliSubtitle: "Inspired by Ihya 'Ulum al-Din & Bidayat al-Hidayah: Heart Purification (Tazkiyat al-Qalb), daily litanies, and optimal practice schedules.",
    ghazaliTabWeekly: "Weekly Wirds",
    ghazaliTabPurification: "Heart Purification",
    ghazaliTabTimes: "Optimal Times",
    ghazaliTabLitanies: "Major Litanies",
    ghazaliAddWird: "Add to my Wirds",
    ghazaliCopied: "Copied!",
    ghazaliStepsTitle: "The 4 Steps of Inner Discipline (Ar-Riyādah)",
    ghazaliRemediesTitle: "Remedies for Diseases of the Heart (Amrāḍ al-Qalb)",
    ghazaliWeeklyDesc: "Imam Al-Ghazali prescribed in Bidayat al-Hidayah a specific Dhikr of 1000 repetitions for each day of the week to illuminate the heart with celestial light.",
    ghazaliPurificationDesc: "Alchemical heart purification methodology (Tazkiya) developed by Imam Al-Ghazali to eradicate spiritual flaws and polish the mirror of the heart.",
    ghazaliTimesDesc: "Sacred organization of the day and night according to Ghazalian tradition, divided into 6 golden periods for maximum spiritual presence.",
    ghazaliLitaniesDesc: "Sacred supplications and Wirds attributed to Hujjat al-Islam Imam Al-Ghazali for resolving trials and attaining divine intimacy."
  },
  ha: {
    back: "Koma baya",
    title: "Mai Samar da Wird na Keɓaɓɓe (Istikhraj)",
    infoTitle: "Bayananka",
    nameLabel: "Sunanka (da Larabci)",
    motherNameLabel: "Sunan Mahaifiyarka (da Larabci)",
    motherDesc: "Al'adar sufanci tana amfani da sunan uwa don daidaita ruhaniya (Tariqa).",
    calculating: "Ana fitarwa...",
    calculateBtn: "Lissafa Wirdina",
    weightTitle: "Nauyin Ruhaniyarka (Abjad)",
    weightDesc: "Wannan yana wakiltar mitar rayuwarka.",
    supremeWird: "Wirdinka Mafi Girma",
    valueZikr: (val: number) => `Darajar wannan Zikirin ita ce ${val}.`,
    perfectMatch: "Daidaituwa cikakkiya tare da sawun ruhunka.",
    minorGap: (diff: number) => `Girma kadan: ${diff}`,
    recitationGuideline: (weight: number) => `Karanta wannan Wird sau ${weight} kowace rana (zai fi kyau bayan sallar asuba ko dare) zai haifar da budi (Fath) da daidaituwar ruhaniya mai zurfi.`,
    waitingTitle: "Ana jiran lissafi",
    waitingDesc: "Shigar da sunanka da na mahaifiyarka da harshen Larabci don gano Wirdin da ya dace da kai.",
    
    // Saved Wirds Translation
    savedTitle: "Wirdodina da aka Ajiye",
    savedDesc: "Ja kuma ajiye wirdodinka a cikin manyan fayiloli don tsara su (ko amfani da mai zaɓe)",
    createFolder: "+ Ƙirƙiri babban fayil",
    folderPlaceholder: "Sunan babban fayil...",
    addBtn: "Ƙara",
    cancelBtn: "Soke",
    dragHere: "Ja wirdodi a nan",
    frequency: "Mitar zikiri",
    moveTo: "Koma ga",
    deleteFolder: "Goge babban fayil",
    deleteWird: "Goge daga wirdodina",
    alreadySaved: "An riga an ajiye wannan Wird.",
    saveSuccess: "An ajiye Wird cikin nasara !",
    savedInUncategorized: "a cikin 'Mara rabo'! Same shi a ƙasa.",

    // Folder translations
    folderDaily: "Kullum",
    folderSpecial: "Lokuta na Musamman",
    folderHealing: "Warkarwa",
    folderUncategorized: "Mara rabo",

    // Detailed Zikr sections
    zikrGuideTitle: "Jagoran Yin Zikiri",
    preparationTitle: "1. Shiri na Jiki da Ruhi",
    preparationDesc: "Yi alwala (Wudu), sanya tufafi masu tsarki, kuma ka zauna a wuri mai natsuwa kana fuskantar Alqibla. Idan zai yiwu, sanya turare mai dadi don tsarkake wajen.",
    openingTitle: "2. Addu'ar Farko (Mabudin Zikiri)",
    openingDesc: "Fara da karanta Istigfari sau 11 don tsarkake zuciya: 'Astaghfirullah al-Adheem'. Bayan haka, karanta Salatin Annabi sau 11: 'Allahumma salli 'ala Sayyidina Muhammadin wa 'ala alihi wa sahbihi wa sallim'.",
    intentionTitle: "3. Niyyar Zikiri (Niyyah)",
    intentionDesc: "Kullu niyya ta gaskiya a cikin zuciyarka. Haɗa hankalinka da girman Sunayen Allah da aka fitar maka.",
    recitationTitle: "4. Karatun Zikiri (Adadin da ya dace)",
    recitationDesc: (weight: number) => `Karanta wannan zikiri sau ${weight} daidai. Yi amfani da carbi (Tasbih) ko gabbai na hannun dama don kirgawa cikin tsautsayi da natsuwa.`,
    closingTitle: "5. Rufewa da Addu'a (Kammalawa)",
    closingDesc: "Kammala da karanta Salatin Annabi sau 3, sannan ka yi addu'o'in kanka kana rokon Allah Ya sanya albarka da hasken wadannan sunaye a rayuwarka. Shafa fuskarka don kammalawa.",
    optimalTimesTitle: "Mafi kyawun Lokaci",
    optimalTimesDesc: "Bayan Sallar Asuba don samun hasken rana, ko kuma a kashi na uku na karshen dare (Tahajjud) don samun kusanci mafi girma ga Ubangiji.",
    meaningTitle: "Ma'ana & Sirrin Ruhaniya",

    // Ghazali Section
    ghazaliTitle: "Hikima da Zikirorin Imam Al-Ghazali (حجة الإسلام)",
    ghazaliSubtitle: "An samo daga Ihya 'Ulum al-Din & Bidayat al-Hidayah: Tsarkake Zuciya (Tazkiyat al-Qalb), zikirorin kullum da mafi kyawun lokutan yi.",
    ghazaliTabWeekly: "Zikirorin Mako",
    ghazaliTabPurification: "Tsarkake Zuciya",
    ghazaliTabTimes: "Lokuta na Musamman",
    ghazaliTabLitanies: "Manyan Addu'o'i",
    ghazaliAddWird: "Ajiye a Zikirorina",
    ghazaliCopied: "An kwafa!",
    ghazaliStepsTitle: "Matakai 4 na Horo na Ciki (Ar-Riyādah)",
    ghazaliRemediesTitle: "Magungunan Cuta na Zuciya (Amrāḍ al-Qalb)",
    ghazaliWeeklyDesc: "Imam Al-Ghazali ya rubuta a Bidayat al-Hidayah zikiri na musamman guda 1000 domin kowace rana a mako domin haskaka zuciya.",
    ghazaliPurificationDesc: "Hanyar tsarkake zuciya (Tazkiya) da Imam Al-Ghazali ya samar domin cire cututtukan ruhi da gyara zuciya.",
    ghazaliTimesDesc: "Tsara lokutan rana da dare bisa tsarin Al-Ghazali, kasu kashi 6 domin samun albarka da natsuwa.",
    ghazaliLitaniesDesc: "Manyan addu'o'i da wirdodi na Hujjat al-Islam Imam Al-Ghazali domin warware matsaloli da samun kusanci ga Allah."
  }
};

export const PersonalWird: React.FC = () => {
  const { t, language } = useLanguage();
  const { featureToggles } = useFeatures();
  const disableDuaCopy = !!featureToggles?.disable_dua_copy;
  const dict = wirdDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || wirdDict.fr;
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Ghazali Section States
  const [ghazaliActiveTab, setGhazaliActiveTab] = useState<'weekly' | 'purification' | 'times' | 'litanies'>('weekly');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Folder and Saved Wird states
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('asrar_wird_folders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_FOLDERS;
  });

  const [savedWirds, setSavedWirds] = useState<SavedWird[]>(() => {
    const saved = localStorage.getItem('asrar_saved_wirds');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Hydrate savedWirds and folders asynchronously from idb-keyval
  useEffect(() => {
    getZikrCache<SavedWird[]>('asrar_saved_wirds', savedWirds).then((cached) => {
      if (Array.isArray(cached) && cached.length > 0) {
        setSavedWirds(cached);
      }
    });

    getZikrCache<Folder[]>('asrar_wird_folders', folders).then((cachedFolders) => {
      if (Array.isArray(cachedFolders) && cachedFolders.length > 0) {
        setFolders(cachedFolders);
      }
    });
  }, []);

  useEffect(() => {
    syncPersonalWirdsOffline(savedWirds).catch((err) => {
      console.warn('Personal wirds cached offline:', err);
    });
  }, [savedWirds]);

  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const handleCopyText = (text: string, id: string) => {
    if (disableDuaCopy) return;
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const saveGhazaliWirdToFolder = (arabic: string, name: string, weight: number) => {
    const isAlreadySaved = savedWirds.some(w => w.arabic === arabic || w.name === name);
    if (isAlreadySaved) {
      alert(dict.alreadySaved);
      return;
    }
    const newWird: SavedWird = {
      id: `ghazali_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      arabic,
      weight,
      folderId: 'daily',
      dateSaved: new Date().toISOString()
    };
    const updated = [...savedWirds, newWird];
    setSavedWirds(updated);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updated));
    alert(`${dict.saveSuccess} (${getFolderName('daily', 'Quotidien')})`);
  };

  const saveWird = () => {
    if (!result || weight === null) return;
    
    const matchedDetailsList = result.names.map(n => getAsmaDetails(n)).filter((d): d is NonNullable<typeof d> => d !== undefined);
    const arabicVocativeStr = applyTashkeel(matchedDetailsList.map(d => getVocativeArabic(d.ar)).join(' '));
    const translitVocativeStr = matchedDetailsList.map(d => getVocativeTransliteration(d.tr)).join(', ');

    const isAlreadySaved = savedWirds.some(w => w.weight === weight && (w.name === translitVocativeStr || w.arabic === arabicVocativeStr));
    if (isAlreadySaved) {
      alert(dict.alreadySaved);
      return;
    }
    
    const newWird: SavedWird = {
      id: Date.now().toString(),
      name: translitVocativeStr,
      arabic: arabicVocativeStr,
      weight,
      folderId: 'uncategorized',
      dateSaved: new Date().toISOString()
    };
    const updated = [...savedWirds, newWird];
    setSavedWirds(updated);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updated));
    alert(`${dict.saveSuccess} ${dict.savedInUncategorized}`);
  };

  const getFolderName = (folderId: string, defaultName: string) => {
    if (folderId === 'daily') return dict.folderDaily || "Quotidien";
    if (folderId === 'special') return dict.folderSpecial || "Occasions Spéciales";
    if (folderId === 'healing') return dict.folderHealing || "Guérison";
    if (folderId === 'uncategorized') return dict.folderUncategorized || "Non classés";
    return defaultName;
  };

  const deleteWird = (id: string) => {
    const updated = savedWirds.filter(w => w.id !== id);
    setSavedWirds(updated);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updated));
  };

  const moveWirdToFolder = (wirdId: string, destFolderId: string) => {
    const updated = savedWirds.map(w => w.id === wirdId ? { ...w, folderId: destFolderId } : w);
    setSavedWirds(updated);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updated));
  };

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name: newFolderName.trim()
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    setZikrCache('asrar_wird_folders', updated).catch(() => {});
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'uncategorized' || folderId === 'daily' || folderId === 'special' || folderId === 'healing') return;
    // Remove folder
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    setZikrCache('asrar_wird_folders', updatedFolders).catch(() => {});

    // Move all wirds in that folder to Uncategorized
    const updatedWirds = savedWirds.map(w => w.folderId === folderId ? { ...w, folderId: 'uncategorized' } : w);
    setSavedWirds(updatedWirds);
  };

  const calculateWird = () => {
    if (!name || !motherName) return;
    setIsCalculating(true);
    
    setTimeout(() => {
      const cleanName = name.replace(/\s+/g, '');
      const cleanMotherName = motherName.replace(/\s+/g, '');
      
      const val1 = calculateAbjadValue(cleanName);
      const val2 = calculateAbjadValue(cleanMotherName);
      const totalWeight = val1 + val2;
      setWeight(totalWeight);

      // Find combination of Names of Allah matching the weight
      const namesWithValues = ASMA_AL_HUSNA.map(n => ({ name: n, val: calculateAbjadValue(n) }));
      let bestMatch: MatchResult = { names: [], totalAbjad: 0, diff: Infinity };

      // 1. Try single name
      for (const n of namesWithValues) {
        const diff = Math.abs(n.val - totalWeight);
        if (diff < bestMatch.diff) {
          bestMatch = { names: [n.name], totalAbjad: n.val, diff };
        }
      }

      // 2. Try two names if diff is still > 0
      if (bestMatch.diff !== 0) {
        for (let i = 0; i < namesWithValues.length; i++) {
          for (let j = i + 1; j < namesWithValues.length; j++) {
            const sum = namesWithValues[i].val + namesWithValues[j].val;
            const diff = Math.abs(sum - totalWeight);
            if (diff < bestMatch.diff) {
              bestMatch = { names: [namesWithValues[i].name, namesWithValues[j].name], totalAbjad: sum, diff };
            }
          }
        }
      }
      
      // 3. Try three names if diff is still > 0
      if (bestMatch.diff !== 0) {
        for (let i = 0; i < namesWithValues.length; i++) {
          for (let j = i + 1; j < namesWithValues.length; j++) {
            for (let k = j + 1; k < namesWithValues.length; k++) {
              const sum = namesWithValues[i].val + namesWithValues[j].val + namesWithValues[k].val;
              const diff = Math.abs(sum - totalWeight);
              if (diff < bestMatch.diff) {
                bestMatch = { names: [namesWithValues[i].name, namesWithValues[j].name, namesWithValues[k].name], totalAbjad: sum, diff };
              }
            }
          }
        }
      }

      setResult(bestMatch);
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-w-0 overflow-x-hidden">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {dict.back}
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 break-words">
          <Sparkles className="text-emerald-500 shrink-0" size={32} />
          {dict.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm sm:text-base">{t("tools.personal-wird.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full min-w-0">
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 w-full min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-500 shrink-0" />
              {dict.infoTitle}
            </h2>

            <div className="space-y-4 w-full min-w-0">
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.nameLabel}</label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: محمد"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all box-border min-w-0"
                    style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="w-full min-w-0">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.motherNameLabel}</label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ex: فاطمة"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all box-border min-w-0"
                    style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                    dir="rtl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{dict.motherDesc}</p>
              </div>

              <button
                onClick={calculateWird}
                disabled={!name || !motherName || isCalculating}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer min-w-0"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin shrink-0" size={20} />
                    {dict.calculating}
                  </>
                ) : (
                  <>
                    <Key size={20} className="shrink-0" />
                    {dict.calculateBtn}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 w-full min-w-0">
          {result && weight !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 w-full min-w-0"
            >
              {/* Mystical Weight Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-8 shadow-md text-white text-center w-full min-w-0 break-words">
                <p className="text-emerald-100 mb-1 font-medium text-sm sm:text-base">{dict.weightTitle}</p>
                <div className="text-4xl sm:text-6xl font-bold font-serif mb-2 tracking-tight">{weight}</div>
                <p className="text-emerald-100 text-xs sm:text-sm">{dict.weightDesc}</p>
              </div>

              {/* Supreme Wird Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden w-full min-w-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                  <Sparkles size={16} className="shrink-0" />
                  {dict.supremeWird}
                </p>

                {(() => {
                  const matchedDetailsList = result.names.map(n => getAsmaDetails(n)).filter((d): d is NonNullable<typeof d> => d !== undefined);
                  const arabicVocativeStr = applyTashkeel(matchedDetailsList.map(d => getVocativeArabic(d.ar)).join(' '));
                  const translitVocativeStr = matchedDetailsList.map(d => getVocativeTransliteration(d.tr)).join(', ');

                  return (
                    <div className="text-center w-full min-w-0">
                      {/* Arabic Zikr with Tashkeel and Amiri font */}
                      <div 
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-relaxed text-gray-900 dark:text-white break-words max-w-full overflow-hidden"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                        dir="rtl"
                      >
                        {arabicVocativeStr}
                      </div>
                      
                      <p className="text-base sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4 font-sans break-words">
                        {translitVocativeStr}
                      </p>

                      <div className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-6 max-w-full break-words">
                        {dict.valueZikr(result.totalAbjad)} • {result.diff === 0 ? dict.perfectMatch : `${dict.minorGap(result.diff)}`}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mt-4">
                        <button
                          onClick={saveWird}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm active:scale-98 min-w-0"
                        >
                          <Save size={16} className="shrink-0" />
                          <span>Enregistrer</span>
                        </button>
                        <button
                          onClick={() => exportWirdToImage({
                            name,
                            motherName,
                            arabicZikr: arabicVocativeStr,
                            transliteration: translitVocativeStr,
                            abjadWeight: result.totalAbjad,
                            meaningFr: language === 'en'
                              ? "Supreme Wird calculated by Istikhraj of Divine Names"
                              : language === 'ha'
                              ? "Zikirin kahan abjad daga Saye na Sunayen Allah"
                              : "Wird Suprême calculé par Istikhraj des Noms Divins",
                            title: language === 'en'
                              ? "SUPREME WIRD & ISTIKHRAJ"
                              : language === 'ha'
                              ? "WIRDIL KAHAN & ISTIKHRAJ"
                              : "WIRD SUPRÊME & ISTIKHRAJ",
                            isParchment: false,
                            lang: language,
                          })}
                          className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm active:scale-98 min-w-0"
                          title="Télécharger l'image PNG haute résolution"
                        >
                          <Download size={16} className="shrink-0 text-emerald-400" />
                          <span>PNG Deluxe</span>
                        </button>
                        <button
                          onClick={() => exportWirdToImage({
                            name,
                            motherName,
                            arabicZikr: arabicVocativeStr,
                            transliteration: translitVocativeStr,
                            abjadWeight: result.totalAbjad,
                            meaningFr: language === 'en'
                              ? "Mystique Parchment engraved with AsrarHub Watermark"
                              : language === 'ha'
                              ? "Takardar Asiri wadda aka hatimta da AsrarHub"
                              : "Parchemin Mystique gravé avec Watermark AsrarHub",
                            title: language === 'en'
                              ? "SUPREME PARCHMENT WIRD"
                              : language === 'ha'
                              ? "TAKARDAR PARCHEMIN WIRDIL"
                              : "PARCHEMIN WIRD SUPRÊME",
                            isParchment: true,
                            lang: language,
                          })}
                          className="py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-sm active:scale-98 min-w-0"
                          title="Télécharger sur Parchemin Mystique"
                        >
                          <Feather size={16} className="shrink-0" />
                          <span>Parchemin</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Develop Each Name in Detail */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  <BookOpen size={20} className="text-emerald-500" />
                  {dict.meaningTitle}
                </h3>
                
                {result.names.map((plainName, idx) => {
                  const details = getAsmaDetails(plainName);
                  if (!details) return null;

                  let meaning = details.fr;
                  let context = details.quranOptions.context || "";
                  let transltrans = details.tr;

                  if (language === 'en' || language === 'ha') {
                    const translationSet = asmaListDataTranslations[details.tr];
                    if (translationSet && translationSet[language]) {
                      meaning = translationSet[language].fr;
                      context = translationSet[language].context;
                    }
                  }

                  return (
                    <div 
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-base">
                              {transltrans}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                              {meaning}
                            </p>
                          </div>
                        </div>
                        {/* Vocalized name in card header */}
                        <div 
                          className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                          dir="rtl"
                        >
                          {details.ar}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 dark:text-gray-300 font-mono flex items-center gap-4">
                        <span>Abjad: <strong className="text-gray-700 dark:text-gray-300 font-bold">{details.abjad}</strong></span>
                        <span>Quran: <strong className="text-gray-700 dark:text-gray-300 font-bold">{details.quranOptions.surah} {details.quranOptions.verse}</strong></span>
                      </div>

                      {context && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                          {context}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step-by-Step Zikr Protocol */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <Sparkles size={20} className="text-emerald-500 shrink-0" />
                  {dict.zikrGuideTitle}
                </h3>

                <div className="space-y-4">
                  {/* Preparation */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.preparationTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{dict.preparationDesc}</p>
                    </div>
                  </div>

                  {/* Opening */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.openingTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{dict.openingDesc}</p>
                    </div>
                  </div>

                  {/* Intention */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.intentionTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{dict.intentionDesc}</p>
                    </div>
                  </div>

                  {/* Recitation */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.recitationTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{dict.recitationDesc(weight)}</p>
                    </div>
                  </div>

                  {/* Closing */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.closingTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{dict.closingDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30 flex gap-3">
                  <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">{dict.optimalTimesTitle}</h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-relaxed">{dict.optimalTimesDesc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 border-dashed rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{dict.waitingTitle}</h3>
              <p className="text-gray-500 dark:text-gray-300 max-w-sm">
                {dict.waitingDesc}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CALCULS DE RITUELS (AWRAD & DHIKR) SUITE */}
      <div className="mt-10">
        <RitualDhikrCalculator />
      </div>

      {/* Imam Al-Ghazali Dedicated Section */}
      <div className="mt-12 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-teal-500/10 dark:from-amber-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg space-y-6 w-full min-w-0 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 dark:border-amber-800/40 pb-5 w-full min-w-0">
          <div className="w-full min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-2 max-w-full">
              <Sparkles size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">Hujjat al-Islam (حجة الإسلام الإمام الغزالي)</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 break-words">
              <BookOpen className="text-amber-600 dark:text-amber-400 shrink-0" size={28} />
              {dict.ghazaliTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
              {dict.ghazaliSubtitle}
            </p>
          </div>
        </div>

        {/* Ghazali Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 touch-pan-x w-full max-w-full">
          {[
            { id: 'weekly', label: dict.ghazaliTabWeekly, icon: Calendar },
            { id: 'purification', label: dict.ghazaliTabPurification, icon: Heart },
            { id: 'times', label: dict.ghazaliTabTimes, icon: Clock },
            { id: 'litanies', label: dict.ghazaliTabLitanies, icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = ghazaliActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setGhazaliActiveTab(tab.id as any)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700 border border-amber-200/50 dark:border-gray-700'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: WEEKLY WORDS */}
        {ghazaliActiveTab === 'weekly' && (
          <div className="space-y-4 w-full min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic bg-white/60 dark:bg-gray-800/60 p-3.5 sm:p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              💡 {dict.ghazaliWeeklyDesc}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
              {GHAZALI_WEEKLY_WORDS.map((w) => {
                const dayName = language === 'en' ? w.dayEn : language === 'ha' ? w.dayHa : w.dayFr;
                const title = language === 'en' ? w.titleEn : language === 'ha' ? w.titleHa : w.titleFr;
                const translation = language === 'en' ? w.translationEn : language === 'ha' ? w.translationHa : w.translationFr;
                const virtue = language === 'en' ? w.virtueEn : language === 'ha' ? w.virtueHa : w.virtueFr;
                const isCopied = copiedTextId === w.id;

                return (
                  <div key={w.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-amber-200/60 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all min-w-0 w-full">
                    <div className="space-y-2 min-w-0 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full truncate">
                          {dayName} • {w.count}x
                        </span>
                        {!disableDuaCopy && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleCopyText(w.arabic, w.id)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                              title="Copier le texte arabe"
                            >
                              {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-900 dark:text-white text-sm break-words">{title}</h3>

                      <div 
                        className="text-2xl sm:text-3xl font-bold text-right text-emerald-700 dark:text-emerald-400 py-1 break-words max-w-full overflow-hidden"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                        dir="rtl"
                      >
                        {w.arabic}
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-300 font-mono italic break-words">
                        "{w.transliteration}"
                      </p>

                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium break-words">
                        « {translation} »
                      </p>

                      <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30 break-words">
                        <strong>Vertu :</strong> {virtue}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 w-full">
                      <button
                        onClick={() => saveGhazaliWirdToFolder(w.arabic, `${dayName} (${w.transliteration})`, w.count)}
                        className="py-2 px-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm min-w-0"
                      >
                        <Plus size={14} className="shrink-0" />
                        <span>{dict.ghazaliAddWird}</span>
                      </button>
                      <button
                        onClick={() => exportWirdToImage({
                          arabicZikr: w.arabic,
                          transliteration: w.transliteration,
                          abjadWeight: w.count,
                          meaningFr: translation,
                          title: `WIRD GHAZALI • ${dayName.toUpperCase()}`,
                          isParchment: false,
                          lang: language,
                        })}
                        className="py-2 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm min-w-0"
                        title="Télécharger PNG"
                      >
                        <Download size={14} className="shrink-0 text-amber-400" />
                        <span>PNG</span>
                      </button>
                      <button
                        onClick={() => exportWirdToImage({
                          arabicZikr: w.arabic,
                          transliteration: w.transliteration,
                          abjadWeight: w.count,
                          meaningFr: translation,
                          title: `PARCHEMIN • ${dayName.toUpperCase()}`,
                          isParchment: true,
                          lang: language,
                        })}
                        className="py-2 px-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm min-w-0"
                        title="Télécharger Parchemin"
                      >
                        <Feather size={14} className="shrink-0" />
                        <span>Parchemin</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HEART PURIFICATION */}
        {ghazaliActiveTab === 'purification' && (
          <div className="space-y-6 w-full min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic bg-white/60 dark:bg-gray-800/60 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              ✨ {dict.ghazaliPurificationDesc}
            </p>

            {/* 4 Steps of Inner Discipline */}
            <div className="space-y-3 w-full min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                {dict.ghazaliStepsTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
                {GHAZALI_PURIFICATION_STEPS.map((s) => {
                  const Icon = s.icon;
                  const name = language === 'en' ? s.nameEn : language === 'ha' ? s.nameHa : s.nameFr;
                  const desc = language === 'en' ? s.descEn : language === 'ha' ? s.descHa : s.descFr;

                  return (
                    <div key={s.step} className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-gray-700 shadow-sm space-y-2 w-full min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {s.step}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5 break-words">
                          <Icon size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                          {name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1 break-words">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Heart Diseases Remedies */}
            <div className="space-y-3 pt-2 w-full min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-rose-500 shrink-0" size={20} />
                {dict.ghazaliRemediesTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
                {GHAZALI_HEART_DISEASES.map((d, i) => {
                  const disease = language === 'en' ? d.diseaseEn : language === 'ha' ? d.diseaseHa : d.diseaseFr;
                  const remedy = language === 'en' ? d.remedyEn : language === 'ha' ? d.remedyHa : d.remedyFr;

                  return (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-rose-100 dark:border-gray-700 shadow-sm space-y-2 w-full min-w-0">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block break-words">
                        Maladie #0{i+1} : {disease}
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100/60 dark:border-rose-900/30 break-words">
                        <strong className="text-rose-800 dark:text-rose-300">Remède d'Al-Ghazali :</strong> {remedy}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPTIMAL PRACTICE TIMES */}
        {ghazaliActiveTab === 'times' && (
          <div className="space-y-4 w-full min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic bg-white/60 dark:bg-gray-800/60 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              🕒 {dict.ghazaliTimesDesc}
            </p>

            <div className="space-y-3 w-full min-w-0">
              {GHAZALI_OPTIMAL_TIMES.map((t, idx) => {
                const Icon = t.icon;
                const period = language === 'en' ? t.periodEn : language === 'ha' ? t.periodHa : t.periodFr;
                const activity = language === 'en' ? t.activityEn : language === 'ha' ? t.activityHa : t.activityFr;

                return (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 w-full min-w-0">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${t.badgeColor}`}>
                          <Icon size={14} className="shrink-0" />
                          {period}
                        </span>
                        <span 
                          className="text-sm font-bold text-gray-500 dark:text-gray-300 font-arabic ml-auto" 
                          dir="rtl"
                        >
                          {t.arabicTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pt-1 break-words">
                        {activity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MAJOR LITANIES */}
        {ghazaliActiveTab === 'litanies' && (
          <div className="space-y-4 w-full min-w-0">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic bg-white/60 dark:bg-gray-800/60 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              📿 {dict.ghazaliLitaniesDesc}
            </p>

            <div className="space-y-4 w-full min-w-0">
              {GHAZALI_MAJOR_LITANIES.map((lit) => {
                const title = language === 'en' ? lit.titleEn : language === 'ha' ? lit.titleHa : lit.titleFr;
                const translation = language === 'en' ? lit.translationEn : language === 'ha' ? lit.translationHa : lit.translationFr;
                const benefit = language === 'en' ? lit.benefitEn : language === 'ha' ? lit.benefitHa : lit.benefitFr;
                const isCopied = copiedTextId === lit.id;

                return (
                  <div key={lit.id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-amber-200/60 dark:border-gray-700 shadow-sm space-y-4 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3 w-full min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2 break-words">
                        <Sparkles className="text-amber-500 shrink-0" size={18} />
                        {title}
                      </h3>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full w-fit shrink-0">
                        Répétition : {lit.repetitionCount}x
                      </span>
                    </div>

                    <div 
                      className="text-2xl sm:text-3xl font-bold text-right text-emerald-800 dark:text-emerald-300 leading-relaxed break-words max-w-full overflow-hidden"
                      style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                      dir="rtl"
                    >
                      {lit.arabic}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 font-mono italic break-words">
                      "{lit.transliteration}"
                    </p>

                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium break-words">
                      « {translation} »
                    </p>

                    <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 break-words">
                      <strong>Bienfaits :</strong> {benefit}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2 w-full min-w-0">
                      {!disableDuaCopy && (
                        <button
                          onClick={() => handleCopyText(lit.arabic, lit.id)}
                          className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer min-w-0"
                        >
                          {isCopied ? <Check size={16} className="text-emerald-500 shrink-0" /> : <Copy size={16} className="shrink-0" />}
                          {isCopied ? dict.ghazaliCopied : "Copier le texte arabe"}
                        </button>
                      )}
                      <button
                        onClick={() => saveGhazaliWirdToFolder(lit.arabic, lit.titleFr, lit.repetitionCount)}
                        className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm min-w-0"
                      >
                        <Plus size={16} className="shrink-0" />
                        {dict.ghazaliAddWird}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Saved Wirds Section with Folders & Drag-and-Drop */}
      <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 w-full min-w-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FolderIcon className="text-emerald-500 shrink-0" size={24} />
              {dict.savedTitle}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {dict.savedDesc}
            </p>
          </div>
          
          {/* Add Folder */}
          <div className="flex items-center gap-2">
            {isAddingFolder ? (
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder={dict.folderPlaceholder}
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  className="bg-transparent text-sm px-2 py-1 outline-none text-gray-900 dark:text-white max-w-[150px]"
                  autoFocus
                />
                <button
                  onClick={addFolder}
                  className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  {dict.addBtn}
                </button>
                <button
                  onClick={() => setIsAddingFolder(false)}
                  className="text-gray-400 text-xs hover:text-gray-600 px-1 cursor-pointer"
                >
                  {dict.cancelBtn}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingFolder(true)}
                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
              >
                {dict.createFolder}
              </button>
            )}
          </div>
        </div>

        {/* Board of Folders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0">
          {folders.map(folder => {
            const folderWirds = savedWirds.filter(w => w.folderId === folder.id);
            return (
              <div
                key={folder.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const itemId = e.dataTransfer.getData('text/plain');
                  if (itemId) moveWirdToFolder(itemId, folder.id);
                }}
                className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5 flex flex-col min-h-[220px] transition-all hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-sm w-full min-w-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">{getFolderName(folder.id, folder.name)}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full font-bold">
                      {folderWirds.length}
                    </span>
                    {folder.id !== 'uncategorized' && folder.id !== 'daily' && folder.id !== 'special' && folder.id !== 'healing' && (
                      <button
                        onClick={() => deleteFolder(folder.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                        title={dict.deleteFolder}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* List of saved wirds inside folder */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[250px] pr-1">
                  {folderWirds.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-300 text-center italic py-8">
                      {dict.dragHere}
                    </div>
                  ) : (
                    folderWirds.map(wird => (
                      <div
                        key={wird.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', wird.id);
                        }}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
                      >
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => exportWirdToImage({
                              arabicZikr: wird.arabic,
                              transliteration: wird.name,
                              abjadWeight: wird.weight,
                              title: language === 'en' ? "SAVED WIRD" : language === 'ha' ? "WIRDIL DA AKA ADANA" : "WIRD ENREGISTRÉ",
                              isParchment: false,
                              lang: language,
                            })}
                            className="text-gray-400 hover:text-emerald-500 p-1 rounded cursor-pointer"
                            title="Télécharger PNG Deluxe"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            onClick={() => exportWirdToImage({
                              arabicZikr: wird.arabic,
                              transliteration: wird.name,
                              abjadWeight: wird.weight,
                              title: language === 'en' ? "SAVED WIRD PARCHMENT" : language === 'ha' ? "TAKARDAR WIRDIL DA AKA ADANA" : "PARCHEMIN WIRD ENREGISTRÉ",
                              isParchment: true,
                              lang: language,
                            })}
                            className="text-gray-400 hover:text-amber-500 p-1 rounded cursor-pointer"
                            title="Télécharger Parchemin"
                          >
                            <Feather size={13} />
                          </button>
                          <button
                            onClick={() => deleteWird(wird.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded cursor-pointer"
                            title={dict.deleteWird}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div 
                          className="text-right text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1" 
                          style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                          dir="rtl"
                        >
                          {wird.arabic}
                        </div>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate pr-4">
                          {wird.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                          <span>{dict.frequency} : {wird.weight}</span>
                          
                          {/* Selector fallback for accessibility and mobile */}
                          <select
                            value={wird.folderId}
                            onChange={(e) => moveWirdToFolder(wird.id, e.target.value)}
                            className="bg-transparent border-0 font-semibold text-[10px] text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer hover:underline p-0 m-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {folders.map(f => (
                              <option key={f.id} value={f.id} className="text-gray-800 dark:text-gray-200">
                                {dict.moveTo} : {getFolderName(f.id, f.name)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
