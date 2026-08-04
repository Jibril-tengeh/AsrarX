import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Image as ImageIcon, Calendar, Radio, ChevronDown, ChevronUp, Bookmark, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContemplativeAudioPlayer } from './ContemplativeAudioPlayer';
import { VerseVisualGeneratorModal } from './VerseVisualGeneratorModal';
import { VerseSaveExportModal } from './VerseSaveExportModal';

interface LunarDailyInspirationCardProps {
  language?: string;
  className?: string;
}

// 8 Lunar Phases basic information
export const LUNAR_PHASES = [
  {
    phaseNameFr: "Nouvelle Lune (Al-Muhaq)",
    phaseNameEn: "New Moon (Al-Muhaq)",
    phaseNameHa: "Sabuwar Wata (Al-Muhaq)",
    emoji: "🌑"
  },
  {
    phaseNameFr: "Premier Croissant (Al-Hilal)",
    phaseNameEn: "Crescent Moon (Al-Hilal)",
    phaseNameHa: "Jinjirin Wata (Al-Hilal)",
    emoji: "🌒"
  },
  {
    phaseNameFr: "Premier Quartier (Al-Tarbii' Al-Awwal)",
    phaseNameEn: "First Quarter (Al-Tarbii')",
    phaseNameHa: "Rubu'i na Farko (Al-Tarbii')",
    emoji: "🌓"
  },
  {
    phaseNameFr: "Lune Gibbeuse Croissante (Al-Ahdab)",
    phaseNameEn: "Waxing Gibbous (Al-Ahdab)",
    phaseNameHa: "Wata Mai Karuwa (Al-Ahdab)",
    emoji: "🌔"
  },
  {
    phaseNameFr: "Pleine Lune Sacrée (Al-Badr Al-Kamil)",
    phaseNameEn: "Sacred Full Moon (Al-Badr)",
    phaseNameHa: "Cikakken Wata (Al-Badr)",
    emoji: "🌕"
  },
  {
    phaseNameFr: "Lune Gibbeuse Décroissante",
    phaseNameEn: "Waning Gibbous",
    phaseNameHa: "Raguwar Cika",
    emoji: "🌖"
  },
  {
    phaseNameFr: "Dernier Quartier (Al-Tarbii' Al-Thani)",
    phaseNameEn: "Third Quarter (Al-Tarbii')",
    phaseNameHa: "Rubu'i na Karshe",
    emoji: "🌗"
  },
  {
    phaseNameFr: "Dernier Croissant & Lune Noire",
    phaseNameEn: "Waning Crescent",
    phaseNameHa: "Karshen Tsaya",
    emoji: "🌘"
  }
];

// Rich Pool of 28 Sacred Verses corresponding to the 28 Manazil / Hourly Cycles
export const SACRED_VERSES_POOL = [
  {
    verseTitle: "Al-An'am (6:101)",
    arabicText: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ ۖ أَنَّىٰ يَكُونُ لَهُ وَلَدٌ وَلَمْ تَكُن لَّهُ صَاحِبَةٌ ۖ وَخَلَقَ كُلَّ شَيْءٍ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ",
    phoneticText: "Badi'u as-samawati wal-ard, anna yakunu lahu waladun wa lam takun lahu sahibatun wa khalaqa kulla shay'in wa Huwa bikulli shay'in 'Alim.",
    translationFr: "Créateur des cieux et de la terre à partir du néant ! Comment aurait-Il un enfant alors qu'Il n'a pas de compagne ? C'est Lui qui a tout créé et Il est Omniscient sur toute chose.",
    translationEn: "Originator of the heavens and the earth! How could He have a son when He has no companion? He created all things, and He is Knowing of all things.",
    translationHa: "Shi ne Mai ƙira da ƙirƙirar sammai da ƙasa ba tare da wani misali ba! Ta yaya zai kasance yana da ɗa alhali ba shi da mata? Shi ne Ya halitta kowane abu, kuma Shi Masani ne ga kowane abu.",
    benefitFr: "Purification de l'esprit, sanctification des nouvelles intentions et démarrage béni.",
    benefitEn: "Purification of the spirit, sanctification of new intentions, and blessed fresh start.",
    benefitHa: "Tsarkake zuciya, sanya sabuwar niyya mai albarka da samun nasara."
  },
  {
    verseTitle: "Al-Baqarah (2:189)",
    arabicText: "يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ",
    phoneticText: "Yas'alunaka 'anil-ahillati qul hiya mawaqitu lin-nasi wal-hajj.",
    translationFr: "Ils t'interrogent sur les croissants de lune. Dis : 'Ce sont des repères temporels pour les hommes et pour le pèlerinage.'",
    translationEn: "They ask you about the crescent moons. Say, 'They are measurements of time for the people and for Hajj.'",
    translationHa: "Suna tambayarka game da jinjirin wata. Ka ce: 'Su abubuwan auna lokaci ne ga mutane da kuma aikin Hajj.'",
    benefitFr: "Bénédiction du temps, organisation spirituelle et clarté dans l'action.",
    benefitEn: "Blessing of time, spiritual organization, and clarity in action.",
    benefitHa: "Albarkar lokaci, tsara al'amuran ruhani da hasken tunani."
  },
  {
    verseTitle: "Ar-Rahman (55:7-9)",
    arabicText: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۞ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ۞ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ",
    phoneticText: "Was-sama'a rafa'aha wa wada'al-mizan. Alla tatghaw fil-mizan. Wa aqimul-wazna bil-qisti wa la tukhsirul-mizan.",
    translationFr: "Et quant au ciel, Il l'a élevé et Il a établi la Balance, afin que vous ne transgressiez pas dans la pesée. Et observez l'équité sans fausser la balance.",
    translationEn: "And the heaven He raised and imposed the balance, that you not transgress within the balance. And establish weight in justice and do not make deficient the balance.",
    translationHa: "Kuma samaniya Ya ɗaukaka ta kuma Ya ajiye Sikelin Adalci (Mizan). Domin kada ku keta haddi a cikin awo. Kuma ku tsara awo da adalci kuma kada ku rage sikelin.",
    benefitFr: "Harmonie des forces, équilibre intérieur et fermeté dans la justice.",
    benefitEn: "Harmony of forces, inner balance, and steadfastness in justice.",
    benefitHa: "Daidaituwar makamashi, natsuwa a zuciya da tsayawa a kan gaskiya."
  },
  {
    verseTitle: "Al-Hajj (22:63)",
    arabicText: "أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَتُصْبِحُ الْأَرْضُ مُخْضَرَّةً ۗ إِنَّ اللَّهَ لَطِيفٌ خَبِيرٌ",
    phoneticText: "Alam tara annallaha anzala minas-sama'i ma'an fatusbihul-ardu mukhdarratan innallaha latifun khabir.",
    translationFr: "Ne vois-tu pas qu'Allah fait descendre du ciel une eau, et la terre devient alors verte ? Certes, Allah est Doux, Subtil et Parfaitement Connaisseur.",
    translationEn: "Do you not see that Allah has sent down rain from the sky and the earth becomes green? Indeed, Allah is Subtle and Acquainted.",
    translationHa: "Shin ba ka gani ba cewa Allah yana saukar da ruwa daga sama sai ƙasa ta zama koraye? Lalle Allah Mai tausayi ne kuma Masani.",
    benefitFr: "Expansion de la conscience, prospérité vivifiante et douceur divine.",
    benefitEn: "Expansion of consciousness, revitalizing prosperity, and divine grace.",
    benefitHa: "Buɗe hanyoyin arziki, samun sauƙi na Ubangiji da faɗaɗa tunani."
  },
  {
    verseTitle: "An-Nur (24:35)",
    arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَارَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِيءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُّورٌ عَلَىٰ نُورٍ ۗ يَهْدِي اللَّهُ لِنُورِهِ مَن يَشَاءُ",
    phoneticText: "Allahu nurus-samawati wal-ard. Mathalu nurihi kamishkatin fiha misbah, al-misbahu fi zujajah, az-zujajatu ka'annaha kawkabun durriyyun yuqadu min shajaratin mubarakatin zaytunatin la sharqiyyatin wa la gharbiyyatin yakadu zaytuha yudi'u wa law lam tamsashu nar, Nurun 'ala Nur, yahdillahu linurihi man yasha'.",
    translationFr: "Allah est la Lumière des cieux et de la terre ! Sa lumière est semblable à une niche où se trouve une lampe... Lumière sur lumière ! Allah guide vers Sa lumière qui Il veut.",
    translationEn: "Allah is the Light of the heavens and the earth. Light upon light. Allah guides to His light whom He wills.",
    translationHa: "Allah Shi ne Hasken sammai da ƙasa! Haske ne a kan Haske! Allah yana shiryar da wanda Yake so zuwa ga Haskensa.",
    benefitFr: "Illumination absolue, clarté spirituelle suprême et ouverture des cœurs.",
    benefitEn: "Absolute illumination, supreme spiritual clarity, and heart opening.",
    benefitHa: "Cikakken haske na ruhani, buɗe asirin gaibu da kariya daga duhu."
  },
  {
    verseTitle: "Ibrahim (14:7)",
    arabicText: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    phoneticText: "Wa idh ta'adhdhana rabbukum la'in shakartum la-azidannakum wa la'in kafartum inna 'adhabi lashadid.",
    translationFr: "Et lorsque votre Seigneur proclama : 'Si vous êtes reconnaissants, Je multiplierai très certainement Mes bienfaits sur vous...'",
    translationEn: "And when your Lord proclaimed, 'If you are grateful, I will surely increase you in favor...'",
    translationHa: "Kuma lokacin da Ubangijinku Ya sanar cewa: 'Lallai idan kuka gode, lallai zan ƙara muku bienfaits...'",
    benefitFr: "Reconnaissance des grâces reçues, gratitude profonde et multiplication des bienfaits.",
    benefitEn: "Acknowledgment of received blessings, deep gratitude, and multiplication of favors.",
    benefitHa: "Godiya ga Ubangiji, kiyaye albarka da samun karuwa a kan alheri."
  },
  {
    verseTitle: "Al-Anfal (8:27)",
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَخُونُوا اللَّهَ وَالرَّسُولَ وَتَخُونُوا أَمَانَاتِكُمْ وَأَنتُمْ تَعْلَمُونَ",
    phoneticText: "Ya ayyuhalladhina amanu la takhunullaha war-rasula wa takhunu amanatikum wa antum ta'lamun.",
    translationFr: "Ô vous qui croyez ! Ne trahissez pas Allah et le Messager, et ne trahissez pas vos dépôts confiés alors que vous savez.",
    translationEn: "O you who have believed, do not betray Allah and the Messenger or betray your trusts while you know.",
    translationHa: "Ya ku waɗanda kuka yi imani! Kada ku ci amanar Allah da ManzonSa, kuma kada ku ci amanar amana da aka danƙa muku.",
    benefitFr: "Préservation des secrets spirituels, loyauté inébranlable et protection de la foi.",
    benefitEn: "Preservation of spiritual secrets, steadfast fidelity, and protection of faith.",
    benefitHa: "Kiyaye amana da sirri, kariya daga kuskure da tsayuwa kan gaskiya."
  },
  {
    verseTitle: "Nuh (71:10-12)",
    arabicText: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا ۞ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا ۞ وَيُمْدِدْكُم بِأَمْوَالٍ وَبَنِينَ وَيَجْعَل لَّكُمْ جَنَّاتٍ وَيَجْعَل لَّكُمْ أَنْهَارًا",
    phoneticText: "Faqultustaghfiru rabbakum innahu kana ghaffara. Yursilis-sama'a 'alaykum midrara.",
    translationFr: "J'ai dit : 'Demandez pardon à votre Seigneur, car Il est Grand Pardonneur. Il vous enverra du ciel des pluies abondantes...'",
    translationEn: "Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver. He will send rain from the sky upon you in showers...",
    translationHa: "Sai na ce: 'Ku nemi gafara wajen Ubangijinku, lallai Shi Yana kasancewa Mai Yawan Gafara...'",
    benefitFr: "Purification des mémoires, effacement des fautes par l'Istighfar et régénération spirituelle.",
    benefitEn: "Purification of memories, erasure of faults through Istighfar, and spiritual regeneration.",
    benefitHa: "Nemi gafara (Istighfar), goge kuskure da samun ruwan albarka ga rayuwa."
  },
  {
    verseTitle: "Ya-Sin (36:38-40)",
    arabicText: "وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ ۞ وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ",
    phoneticText: "Wash-shamsu tajri limustaqarril-laha dhalika taqdirul-'Azizil-'Alim. Wal-qamara qaddarnahu manazila hatta 'ada kal-'urjunil-qadim.",
    translationFr: "Et le soleil court vers un gîte qui lui est assigné : telle est la détermination du Puissant, de l'Omniscient. Et la lune, Nous lui avons déterminé des demeures (manazil)...",
    translationEn: "And the sun runs on its course for a period determined for it. That is the decree of the Exalted in Might, the Knowing. And the moon - We have determined for it phases...",
    translationHa: "Kuma rana tana tafiya zuwa ga wurin zamanta: Wannan shi ne ƙaddarar Mafi Rinjaya, Masani. Kuma wata Mun ƙaddara masa masaukai...",
    benefitFr: "Alignement cosmologique parfait, maîtrise des rythmes temporels et paix intérieure.",
    benefitEn: "Perfect cosmological alignment, mastery of temporal rhythms, and inner peace.",
    benefitHa: "Gwajin tafiyar wata da rana da samun cikakkiyar natsuwa a kowane lokaci."
  },
  {
    verseTitle: "Yunus (10:5)",
    arabicText: "هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ",
    phoneticText: "Huwalladhi ja'alash-shamsa diya'an wal-qamara nuran wa qaddarahu manazila lita'lamu 'adadas-sinina wal-hisab.",
    translationFr: "C'est Lui qui a fait du soleil une clarté et de la lune une lumière, et Il en a déterminé les phases afin que vous sachiez le nombre des années et le calcul du temps.",
    translationEn: "It is He who made the sun a shining light and the moon a derived light and determined for it phases - that you may know the number of years and account [of time].",
    translationHa: "Shi ne Wanda Ya sanya rana tana fitar da haske mai zafi da wata yana fitar da haske mai sanyi, kuma Ya ƙaddara masa masaukai domin ku sami sanin lissafin shekaru.",
    benefitFr: "Sagesse des nombres (Abjad), clarté des décisions et harmonie du calcul céleste.",
    benefitEn: "Wisdom of numbers, clarity of decisions, and harmony of celestial accounting.",
    benefitHa: "Bayanin lissafin lambobi da fahimtar al'amuran asiri."
  },
  {
    verseTitle: "Al-Isra (17:12)",
    arabicText: "وَجَعَلْنَا اللَّيْلَ وَالنَّهَارَ آيَتَيْنِ ۖ فَمَحَوْنَا آيَةَ اللَّيْلِ وَجَعَلْنَا آيَةَ النَّهَارِ مُبْصِرَةً",
    phoneticText: "Wa ja'alnal-layla wan-nahara ayatayni famahawna ayatal-layli wa ja'alna ayatan-nahari mubsiratan.",
    translationFr: "Nous avons fait de la nuit et du jour deux signes. Nous avons effacé le signe de la nuit et rendu le signe du jour clair pour voir...",
    translationEn: "And We have made the night and day two signs, then We erased the sign of the night and made the sign of the day visible...",
    translationHa: "Kuma Muka sanya dare da rana a matsayin aya biyu, sai Muka shafe ayar dare kuma Muka sanya ayar rana tana gani...",
    benefitFr: "Discernement entre l'ombre et la lumière, clarté dans la vision nocturne et diurne.",
    benefitEn: "Discernment between shadow and light, clarity in vision day and night.",
    benefitHa: "Rarrabe tsakanin haske da duhu da samun kariya a kowane sa'a."
  },
  {
    verseTitle: "Al-Anbiya (21:33)",
    arabicText: "وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ",
    phoneticText: "Wa Huwalladhi khalaqal-layla wan-nahara wash-shamsa wal-qamar, kullun fi falakin yasbahun.",
    translationFr: "Et c'est Lui qui a créé la nuit et le jour, le soleil et la lune, chacun voguant dans une orbite.",
    translationEn: "And it is He who created the night and the day and the sun and the moon; all [heavenly bodies] in an orbit are swimming.",
    translationHa: "Kuma Shi ne Ya halitta dare da rana da rana da wata, kowannensu yana shawagi a cikin falaki.",
    benefitFr: "Fluidité dans la vie, libération des blocages et intégration du mouvement universel.",
    benefitEn: "Fluidity in life, release of blockages, and integration with universal movement.",
    benefitHa: "Sauƙaƙar hanyoyin rayuwa da kewaye matsaloli da hasken Allah."
  },
  {
    verseTitle: "Al-Hashr (59:22-24)",
    arabicText: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ ۞ هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
    phoneticText: "Huwallahulladhi la ilaha illa Hu, 'Alimul-ghaybi wash-shahadah, Huwar-Rahmanur-Rahim.",
    translationFr: "C'est Lui Allah, nulle autre divinité que Lui, le Connaisseur de l'Inconnaissable et du Visible, le Tout Miséricordieux, le Très Miséricordieux...",
    translationEn: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.",
    translationHa: "Shi ne Allah Wanda babu wani ubangiji sai Shi, Masanin gaibu da sarari, Shi ne Mai rahama Mai jin ƙai.",
    benefitFr: "Protection absolue par les Noms d'Âthâr, sanctification de la demeure et souveraineté.",
    benefitEn: "Absolute protection through Divine Names, sanctification of home and sovereignty.",
    benefitHa: "Kariya ta musamman da Asma'ul Husna da samun nasara."
  },
  {
    verseTitle: "Al-Ikhlas (112:1-4)",
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    phoneticText: "Qul Huwallahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translationFr: "Dis : 'Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui.'",
    translationEn: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
    translationHa: "Ka ce: 'Shi ne Allah Makaɗaici. Allah Shi ne Abin dogaro ga kowa. Ba Ya haifa kuma ba a haife Shi ba. Kuma babu wani tamkar Sa.'",
    benefitFr: "Tawhid pur, détachement des illusions du monde et armure d'unicité.",
    benefitEn: "Pure Monotheism, detachment from worldly illusions, and armor of oneness.",
    benefitHa: "Kadaita Allah da tsarkake zuciya daga duk wani tsoro."
  },
  {
    verseTitle: "Al-Falaq (113:1-5)",
    arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    phoneticText: "Qul a'udhu birabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translationFr: "Dis : 'Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit...'",
    translationEn: "Say, 'I seek refuge in the Lord of daybreak From the evil of that which He created And from the evil of darkness when it settles...'",
    translationHa: "Ka ce: 'Na tsari da Ubangijin hantsi, Daga sharrin abin da Ya halitta, Kuma daga sharrin duhu idan ya shiga...'",
    benefitFr: "Dissolution des nœuds énergétiques, neutralisation du mauvais œil et de l'envie.",
    benefitEn: "Dissolution of energetic knots, neutralization of the evil eye and envy.",
    benefitHa: "Warware kulli da kariya daga sharrin masu hassada."
  },
  {
    verseTitle: "An-Nas (114:1-6)",
    arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
    phoneticText: "Qul a'udhu birabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas.",
    translationFr: "Dis : 'Je cherche protection auprès du Seigneur des hommes, Le Souverain des hommes, Le Dieu des hommes, contre le mal du mauvais conseiller furtif...'",
    translationEn: "Say, 'I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer...'",
    translationHa: "Ka ce: 'Na tsari da Ubangijin mutane, Sarkin mutane, Ubangijin mutane, Daga sharrin mai sanya waswasi mai ɓoyewa...'",
    benefitFr: "Paix psychique totale, bouclier contre les doutes obscurs et sérénité mentale.",
    benefitEn: "Total psychic peace, shield against obscure doubts, and mental serenity.",
    benefitHa: "Samun natsuwa a zuciya da kariya daga waswasin shaidan."
  },
  {
    verseTitle: "Al-Baqarah (2:255 - Ayatul Kursi)",
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ",
    phoneticText: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard.",
    translationFr: "Allah ! Point de divinité à part Lui, Le Vivant, Celui qui subsiste par Lui-même. Ni l'assoupissement ni le sommeil ne L'atteignent. À Lui appartient tout ce qui est dans les cieux et sur la terre...",
    translationEn: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
    translationHa: "Allah! Babu wani ubangiji sai Shi, Mai Riye da rayuwa, Mai tsaye da kanta. Gyangyaɗi ba ya kama Shi ko barci. Shi ne da abin da ke cikin sammai da ƙasa...",
    benefitFr: "Forteresse spirituelle suprême, trône d'autorité divine et protection angélique.",
    benefitEn: "Supreme spiritual fortress, throne of divine authority, and angelic protection.",
    benefitHa: "Ganuwa mai ƙarfi ta ruhani da kariya ta mazaunan sama."
  },
  {
    verseTitle: "Al-Fatihah (1:1-7)",
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمَٰنِ الرَّحِيمِ ۞ مَالِكِ يَوْمِ الدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    phoneticText: "Alhamdu lillahi Rabbil-'alamin. Ar-Rahmanir-Rahim. Maliki Yawmid-Din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim.",
    translationFr: "Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux, Maître du Jour de la rétribution. C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons le secours...",
    translationEn: "All praise is due to Allah, Lord of the worlds - The Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help...",
    translationHa: "Dukkan yabo da godiya sun tabbata ga Allah Ubangijin halitta. Mai rahama Mai jin ƙai. Sarkin Ranar Sakamako. Kai kaɗai muke bautawa kuma Kai kaɗai muke neman taimako...",
    benefitFr: "Ouverture des 7 portes du succès, guérison intégrale et guidée lumineuse.",
    benefitEn: "Opening of the 7 doors of success, integral healing, and luminous guidance.",
    benefitHa: "Buɗe ƙofofi guda 7 na alheri da samun waraka daga kowace cuta."
  },
  {
    verseTitle: "Al-Fath (48:1-3)",
    arabicText: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا ۞ لِّيَغْفِرَ لَكَ اللَّهُ مَا تَقَدَّمَ مِن ذَنبِكَ وَمَا تَأَخَّرَ وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُّسْتَقِيمًا ۞ وَيَنصُرَكَ اللَّهُ نَصْرًا عَزِيزًا",
    phoneticText: "Inna fatahna laka fathan mubina. Liyaghfira lakallahu ma taqaddama min dhanbika wa ma ta'akhkhara wa yutimma ni'matahu 'alayka wa yahdiyaka siratan mustaqima. Wa yansurakallahu nasran 'aziza.",
    translationFr: "En vérité Nous t'avons accordé une victoire éclatante, afin qu'Allah te pardonne tes péchés passés et futurs, parachève Son bienfait sur toi et te guide sur une voie droite...",
    translationEn: "Indeed, We have given you a clear conquest, that Allah may forgive for you what preceded of your sin and what will follow and complete His favor upon you...",
    translationHa: "Lalle Mu Muka buɗe muku buɗi mai bayyana, Domin Allah Ya gafarta muku abin da ya gabata na kuskurenku da abin da ya jinkirta...",
    benefitFr: "Victoire spirituelle et matérielle, déblocage des affaires fermées et secours divin.",
    benefitEn: "Spiritual and material victory, unblocking of closed matters, and divine assistance.",
    benefitHa: "Samun nasara mai girma da buɗe duk wata ƙofa da aka rufe."
  },
  {
    verseTitle: "Al-Waqi'ah (56:75-76)",
    arabicText: "فَلَا أُقْسِمُ بِمَوَاقِعِ النُّجُومِ ۞ وَإِنَّهُ لَقَسَمٌ لَّوْ تَعْلَمُونَ عَظِيمٌ",
    phoneticText: "Fala uqsimu bimawaqi'in-nujum. Wa innahu laqasamul-law ta'lamuna 'azim.",
    translationFr: "Non ! Je jure par les positions des étoiles (et leurs orbites) ! Et c'est vraiment un serment gigantesque, si vous saviez !",
    translationEn: "Then I swear by the setting of the stars, And indeed, it is an oath - if you could know - most great.",
    translationHa: "A'a! Na yi rantsuwa da wuraren da taurari suke faɗuwa! Kuma lalle shi rantsuwa ce mai girma idan kuka sani!",
    benefitFr: "Activation de la vision céleste, compréhension des constellations et force spirituelle.",
    benefitEn: "Activation of celestial vision, understanding of constellations, and spiritual strength.",
    benefitHa: "Faɗaɗa tunanin sararin samaniya da samun ikon asiri."
  },
  {
    verseTitle: "Ash-Sharh (94:1-6)",
    arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۞ وَوَضَعْنَا عَنكَ وِزْرَكَ ۞ الَّذِي أَنقَضَ ظَهْرَكَ ۞ وَرَفَعْنَا لَكَ ذِكْرَكَ ۞ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۞ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    phoneticText: "Alam nashrah laka sadrak. Wa wada'na 'anka wizrak. Alladhi anqada zahrak. Wa rafa'na laka dhikrak. Fa inna ma'al-'usri yusra. Inna ma'al-'usri yusra.",
    translationFr: "N'avons-Nous pas ouvert pour toi ta poitrine ? Et ne t'avons-Nous pas déchargé du fardeau qui accablait ton dos ? Car à côté de la difficulté est certes une facilité !",
    translationEn: "Did We not expand for you your breast? And We removed from you your burden Which weighed upon your back And raised high for you your repute. For indeed, with hardship comes ease.",
    translationHa: "Shin ba Mu buɗe maka ƙirjinka ba? Kuma Mu ka cire maka nauyinka Wanda ya daƙile bayan ka? Lalle tare da tsanani akwai sauƙi!",
    benefitFr: "Dilatation du cœur (Inshirah), soulagement immédiat des soucis et émergence de la facilité.",
    benefitEn: "Expansion of the heart, immediate relief from worries, and emergence of ease.",
    benefitHa: "Natsuwar ƙirji, yaye damuwa abin gaggawa da samun sauƙi."
  },
  {
    verseTitle: "Al-Qadr (97:1-5)",
    arabicText: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ۞ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ۞ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ۞ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ",
    phoneticText: "Inna anzalnahu fi laylatil-qadr. Wa ma adraka ma laylatul-qadr. Laylatul-qadri khayrum-min alfi shahr. Tanazzalul-mala'ikatu war-ruhu fiha bi-idhni rabbihim min kulli amr.",
    translationFr: "Nous l'avons certes fait descendre pendant la Nuit de la Destinée. Et qui te dira ce qu'est la Nuit de la Destinée ? La Nuit de la Destinée est meilleure que mille mois...",
    translationEn: "Indeed, We sent the Qur'an down during the Night of Decree. And what can make you know what is the Night of Decree? The Night of Decree is better than a thousand months...",
    translationHa: "Lalle Mu Muka saukar da shi a cikin Daren Ƙaddara. Kuma me ya sanar da kai daren ƙaddara? Daren ƙaddara ya fi watanni dubu alheri...",
    benefitFr: "Descente de la Sakiynah (Sérénité), connexion avec les Anges et bénédiction des décrets.",
    benefitEn: "Descent of Sakiynah (Serenity), connection with Angels, and blessing of decrees.",
    benefitHa: "Saukar sakina a zuciya da samun albarkar daren ƙaddara."
  },
  {
    verseTitle: "Al-Mulk (67:1-3)",
    arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۞ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
    phoneticText: "Tabarakalladhi biyadihil-mulku wa Huwa 'ala kulli shay'in qadir. Alladhi khalaqal-mawta wal-hayata liyabluwakum ayyukum ahsanu 'amala.",
    translationFr: "Béni soit Celui dans la main de qui est la royauté, et Il est Omnipotent ! Celui qui a créé la mort et la vie afin de vous éprouver qui de vous est le meilleur en œuvre...",
    translationEn: "Blessed is He in whose hand is dominion, and He is over all things competent - [He] who created death and life to test you as to which of you is best in deed...",
    translationHa: "Albarka ta tabbata ga Wanda sarauta take a hannunSa, kuma Shi Mai ikon yi ne a kan kowane abu. Shi ne Ya halitta mutuwa da rayuwa domin Ya jarraba ku...",
    benefitFr: "Souveraineté spirituelle, protection contre le châtiment et dignité céleste.",
    benefitEn: "Spiritual sovereignty, protection from trial, and celestial dignity.",
    benefitHa: "Mulki na ruhani da samun girma da kariya ta har abada."
  },
  {
    verseTitle: "Al-Insan (76:1-3)",
    arabicText: "هَلْ أَتَىٰ عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ لَمْ يَكُن شَيْئًا مَّذْكُورًا ۞ إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ فَجَعَلْنَاهُ سَمِيعًا بَصِيرًا",
    phoneticText: "Hal ata 'alal-insani hinum minad-dahri lam yakun shay'am madhkura. Inna khalaqnal-insana min nutfatin amshajin nabtalihi faja'alnahu sami'am basira.",
    translationFr: "Est-il venu sur l'homme un moment du temps où il n'était même pas quelque chose de mentionnable ? En vérité Nous avons créé l'homme d'une goutte de sperme mélangé pour l'éprouver...",
    translationEn: "Has there come upon man a period of time when he was not a thing mentioned? Indeed, We created man from a sperm-drop mixture that We may try him...",
    translationHa: "Shin wani zamani ya gaza wucewa ga mutum alhali shi ba abin ambata ba ne? Lalle Mu Muka halitta mutum daga ɗan ruwa mai gauraye...",
    benefitFr: "Eveil des sens spirituels (l'Ouïe et la Vue subtiles), humilité et discernement.",
    benefitEn: "Awakening of spiritual senses (subtle Hearing and Sight), humility, and discernment.",
    benefitHa: "Farfado da ji da gani na ruhani da samun sauƙin tunani."
  },
  {
    verseTitle: "Al-Fajr (89:1-5)",
    arabicText: "وَالْفَجْرِ ۞ وَلَيَالٍ عَشْرٍ ۞ وَالشَّفْعِ وَالْوَتْرِ ۞ وَاللَّيْلِ إِذَا يَسْرِ ۞ هَلْ فِي ذَٰلِكَ قَسَمٌ لِّذِي حِجْرٍ",
    phoneticText: "Wal-Fajri. Wa layalin 'ashrin. Wash-shaf'i wal-watri. Wal-layli idha yasri. Hal fi dhalika qasamul-lidhi hijr.",
    translationFr: "Par l'Aube ! Et par les dix nuits ! Par l'Pair et l'Impair ! Et par la nuit quand elle s'écoule ! N'y a-t-il pas en cela un serment pour un doué d'intelligence ?",
    translationEn: "By the dawn, And [by] ten nights, And [by] the even and the odd, And [by] the night when it passes, Is there [not] in that an oath for one of perception?",
    translationHa: "Rantsuwa da Asuba! Da darare goma! Da ma'aurata da mara! Da dare idan yana tafiya! Shin a cikin wannan akwai rantsuwa ga mai hankali?",
    benefitFr: "Lumière du Fajr, maîtrise du Shaf'i et Witr (Pair et Impair) et sagesse profonde.",
    benefitEn: "Light of Fajr, mastery of Shaf'i and Witr (Pair and Impair), and profound wisdom.",
    benefitHa: "Hasken asuba, fahimtar Shaf'i da Witr da samun basira."
  },
  {
    verseTitle: "Al-Jumu'ah (62:9-10)",
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ",
    phoneticText: "Ya ayyuhalladhina amanu idha nudiya lis-salati min yawmil-Jumu'ati fas'aw ila dhikrillahi wa dharul-bay'. Dhalikum khayrul-lakum in kuntum ta'lamun.",
    translationFr: "Ô vous qui avez cru ! Quand on appelle à la prière du jour du Vendredi, empressez-vous à l'invocation d'Allah et laissez de côté le commerce...",
    translationEn: "O you who have believed, when [the adhan] is called for the prayer on the day of Jumu'ah, proceed to the remembrance of Allah and leave trade...",
    translationHa: "Ya ku waɗanda kuka yi imani! Idan aka yi kira zuwa ga salla a ranar Juma'a, sai ku yi hanzari zuwa ga ambaton Allah kuma ku bar ciniki...",
    benefitFr: "Bénédiction de la communauté, lumière du vendredi et prospérité spirituelle.",
    benefitEn: "Blessing of community, light of Friday, and spiritual prosperity.",
    benefitHa: "Albarkar ranar Juma'a da nasarar neman halak."
  },
  {
    verseTitle: "At-Tawbah (9:128-129)",
    arabicText: "لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ حَرِيصٌ عَلَيْكُم بِالْمُؤْمِنِينَ رَءُوفٌ رَّحِيمٌ ۞ فَإِن تَوَلَّوْا فَقُلْ حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    phoneticText: "Laqad ja'akum rasulum min anfusikum 'azizun 'alayhi ma 'anittum harisun 'alaykum bil-mu'minina ra'ufur-rahim. Fa in tawallaw faqul hasbiyallahu la ilaha illa Huwa 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Azim.",
    translationFr: "Certes, un Messager pris parmi vous est venu à vous... Si après cela ils se détournent, dis : 'Allah me suffit ! Point de divinité que Lui. En Lui je place ma confiance, Il est le Seigneur du Trône Immense.'",
    translationEn: "There has certainly come to you a Messenger from among yourselves... But if they turn away, say, 'Sufficient for me is Allah; there is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.'",
    translationHa: "Lalle wani Manzo ya zo muku daga cikinku... Idan sun juya baya sai ka ce: 'Allah Ya wadatar da ni! Babu wani ubangiji sai Shi. Shi na dogara mawa kuma Shi ne Ubangijin Al'arshi Mai Girma.'",
    benefitFr: "Suffisance divine absolue (Hasbiyallah), secours dans les épreuves et protection du Trône.",
    benefitEn: "Absolute Divine sufficiency (Hasbiyallah), rescue in trials, and Throne protection.",
    benefitHa: "Dogara ga Allah gaba ɗaya da kariya ta Ubangijin Al'arshi."
  },
  {
    verseTitle: "Al-Kahf (18:10)",
    arabicText: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    phoneticText: "Idh awal-fityatu ilal-kahfi faqalu Rabbana atina min ladunka rahmataw-wa hayyi' lana min amrina rashada.",
    translationFr: "Quand les jeunes se réfugièrent dans la caverne, ils dirent : 'Ô notre Seigneur, donne-nous de Ta part une miséricorde et assure-nous la droiture dans notre conduite.'",
    translationEn: "When the youths fled to the cave and said, 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.'",
    translationHa: "Lokacin da samari suka fakanta zuwa ga kogo suka ce: 'Ubangijinmu! Ka ba mu rahama daga gare Ka kuma Ka tsara mana al'amuranmu cikin shiriya.'",
    benefitFr: "Protection dans le sanctuaire (Kahf), miséricorde Laduniyyah et rectitude parfaite.",
    benefitEn: "Protection in the sanctuary (Kahf), Laduniyyah mercy, and perfect guidance.",
    benefitHa: "Kariya ta musamman da samun rahamar Ubangiji kai tsaye."
  }
];

export const LunarDailyInspirationCard: React.FC<LunarDailyInspirationCardProps> = ({
  language = 'fr',
  className = ''
}) => {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showSaveExportModal, setShowSaveExportModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Update current time every minute to maintain strict live hourly alignment
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  // Calculate day of lunar cycle (0 to 7) based on reference date
  const getLunarPhaseIndex = (date: Date): number => {
    const refDate = new Date(2024, 0, 11); // Reference New Moon
    const diffDays = (date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
    const synodicMonth = 29.53058770576;
    const currentPhaseRatio = ((diffDays % synodicMonth) + synodicMonth) % synodicMonth / synodicMonth;
    const index = Math.floor(currentPhaseRatio * LUNAR_PHASES.length);
    return Math.max(0, Math.min(LUNAR_PHASES.length - 1, index));
  };

  // Calculate strict dynamic verse index based on Year, Month, Day, Hour, and Lunar Phase
  const getHourlyVerseIndex = (date: Date, phaseIndex: number): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate(); // 1-31
    const hour = date.getHours(); // 0-23

    // Deterministic seed formula combining year, month, day, hour, and lunar phase
    const seed = (year * 366) + (month * 31) + (day * 24) + hour + (phaseIndex * 7);
    return Math.abs(seed) % SACRED_VERSES_POOL.length;
  };

  const phaseIndex = getLunarPhaseIndex(currentDate);
  const phaseData = LUNAR_PHASES[phaseIndex];
  const verseIndex = getHourlyVerseIndex(currentDate, phaseIndex);
  const verseData = SACRED_VERSES_POOL[verseIndex];

  const phaseName = language === 'fr' 
    ? phaseData.phaseNameFr 
    : language === 'ha' 
    ? phaseData.phaseNameHa 
    : phaseData.phaseNameEn;

  const translation = language === 'fr'
    ? verseData.translationFr
    : language === 'ha'
    ? verseData.translationHa
    : verseData.translationEn;

  const benefit = language === 'fr'
    ? verseData.benefitFr
    : language === 'ha'
    ? verseData.benefitHa
    : verseData.benefitEn;

  // Format current hour and date for display
  const formattedHour = `${currentDate.getHours().toString().padStart(2, '0')}:00`;
  const formattedDateStr = currentDate.toLocaleDateString(
    language === 'fr' ? 'fr-FR' : language === 'ha' ? 'ha-NG' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden backdrop-blur-sm transition-all ${className}`}>
      {/* Background glowing particles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Interactive Header Bar */}
      <div className="flex items-center justify-between gap-3 cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">{phaseData.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                {language === 'fr' 
                  ? "CARTE D'INSPIRATION TEMPORELLE • PHASE LUNAIRE" 
                  : language === 'ha' 
                  ? "KATIN HURAMAR WATA TA RANAR • WATA" 
                  : "TEMPORAL INSPIRATION CARD • LUNAR PHASE"}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-sm">
                <Clock size={10} className="text-amber-400 animate-pulse" />
                <span>{formattedDateStr} • {formattedHour}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                {phaseName}
              </h4>
              <span className="text-[11px] font-mono text-emerald-300/90 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {verseData.verseTitle}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowSaveExportModal(true)}
            className="flex px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title={language === 'fr' ? "Sauvegarder en Image ou Vidéo" : "Save as Image or Video"}
          >
            <Bookmark size={14} className="text-amber-400 fill-amber-400/20" />
            <span>{language === 'fr' ? "Sauvegarder" : language === 'ha' ? "Ajiye" : "Save"}</span>
          </button>

          <button
            onClick={() => setShowGeneratorModal(true)}
            className="hidden sm:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/30 text-amber-200 text-xs font-bold items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <ImageIcon size={14} className="text-amber-400" />
            <span>{language === 'fr' ? "Visuel" : language === 'ha' ? "Hoto" : "Visual"}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
            aria-label={isExpanded 
              ? (language === 'fr' ? "Fermer la carte" : language === 'ha' ? "Rufe katin" : "Close card") 
              : (language === 'fr' ? "Ouvrir la carte" : language === 'ha' ? "Bude katin" : "Expand card")}
          >
            <span className="hidden sm:inline text-xs">
              {isExpanded 
                ? (language === 'fr' ? 'Fermer' : language === 'ha' ? 'Rufe' : 'Close') 
                : (language === 'fr' ? 'Ouvrir' : language === 'ha' ? 'Bude' : 'Expand')}
            </span>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expandable Body Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden pt-4"
          >
            {/* Live Hourly Alignment Notice */}
            <div className="flex items-center justify-between text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-amber-400" />
                <span>
                  {language === 'fr'
                    ? `Verset aligné avec l'heure céleste ${formattedHour} (${formattedDateStr})`
                    : language === 'ha'
                    ? `Ayar da ke dacewa da sa'a ${formattedHour}`
                    : `Verse aligned with celestial hour ${formattedHour}`}
                </span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {language === 'fr' ? "Actualisation Horaire" : "Hourly Sync"}
              </span>
            </div>

            {/* Main Content */}
            <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 text-center my-2 relative">
              <span className="text-xs text-amber-400 font-mono font-bold inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
                <Sparkles size={12} className="text-amber-400" />
                <span>{verseData.verseTitle}</span>
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

              {benefit && (
                <p className="text-[11px] text-amber-300/80 font-medium mt-3 pt-2 border-t border-emerald-500/10 flex items-center justify-center gap-1">
                  <Sparkles size={12} className="text-amber-400" />
                  {benefit}
                </p>
              )}
            </div>

            {/* Embedded Contemplative Audio Player */}
            <div className="mt-4">
              <ContemplativeAudioPlayer
                verseTitle={`${verseData.verseTitle} - ${phaseName} (${formattedHour})`}
                arabicText={verseData.arabicText}
                phoneticText={verseData.phoneticText}
                translationText={translation}
                language={language}
                onOpenVisualGenerator={() => setShowGeneratorModal(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Generator Modal */}
      <VerseVisualGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        verseTitle={verseData.verseTitle}
        arabicText={verseData.arabicText}
        phoneticText={verseData.phoneticText}
        translationText={translation}
        lunarPhaseName={`${phaseName} • ${formattedHour}`}
        language={language}
      />

      {/* Verse Save/Export Modal (Image, Parchemin, Video) */}
      <VerseSaveExportModal
        isOpen={showSaveExportModal}
        onClose={() => setShowSaveExportModal(false)}
        verseTitle={verseData.verseTitle}
        arabicText={verseData.arabicText}
        phoneticText={verseData.phoneticText}
        translationText={translation}
        verseNumber={verseData.verseTitle}
        lunarPhaseName={`${phaseName} (${formattedDateStr} • ${formattedHour})`}
        language={language}
      />
    </div>
  );
};

