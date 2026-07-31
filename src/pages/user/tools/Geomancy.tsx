import React, { useState } from 'react';
import { 
  Compass, ArrowLeft, RefreshCw, Layers, Sparkles, BookOpen, Info, 
  Globe, ShieldCheck, HeartHandshake, Flame, Wind, Droplets, Mountain, 
  Key, Sliders, User, Calculator, CheckCircle, AlertTriangle, Search, Eye,
  Download, GitMerge, MapPin, TrendingUp, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';

// Abjad mapping for Name calculation mode
const ABJAD_MAP: Record<string, number> = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ـه': 5,
  'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10, 'ك': 20, 'ل': 30, 'م': 40,
  'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300,
  'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 80, 'g': 3, 'h': 8, 'i': 10,
  'j': 3, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 6, 'p': 2, 'q': 100, 'r': 200,
  's': 60, 't': 400, 'u': 6, 'v': 6, 'w': 6, 'x': 60, 'y': 10, 'z': 7
};

export interface GeomancyFigureDetail {
  code: string;
  latin: string;
  arabic: string;
  african: string; // West African / Sikidy name
  indian: string;  // Ramal Shastra name
  element: 'fire' | 'air' | 'water' | 'earth';
  elementName: { fr: string; en: string; ha: string };
  planet: { fr: string; en: string; ha: string };
  zodiac: { fr: string; en: string; ha: string };
  nature: { fr: string; en: string; ha: string };
  meaning: { fr: string; en: string; ha: string };
  africanMeaning: { fr: string; en: string; ha: string };
  africanSaraka: { fr: string; en: string; ha: string }; // Recommended Sacrifice / Sadaqah
  indianGraha: string;
  indianDosha: string;
  recommendedDhikr: string;
  bodyPart: { fr: string; en: string; ha: string };
}

// Complete 16 Geomantic Figures Data with 4 Traditions (Maghrebi, West African, Indian, European/Latin)
export const FIGURES_DATABASE: Record<string, GeomancyFigureDetail> = {
  "1-1-1-1": {
    code: "1-1-1-1",
    latin: "Via",
    arabic: "الطريق (At-Tariq)",
    african: "Yissourou / Alhassane",
    indian: "Marga (मार्ग)",
    element: "water",
    elementName: { fr: "Eau", en: "Water", ha: "Ruwa" },
    planet: { fr: "Lune (Régente)", en: "Moon (Ruler)", ha: "Wata" },
    zodiac: { fr: "Cancer", en: "Cancer", ha: "Kansa" },
    nature: { fr: "Neutre / Mobile", en: "Neutral / Mobile", ha: "Tsaka-tsaki / Mai motsi" },
    meaning: { 
      fr: "Changement, voyage, mouvement, fluidité et cheminement. Indique des transitions rapides et la nécessité d'un guide.", 
      en: "Change, travel, movement, fluidity, and pathway. Indicates rapid transitions and the need for guidance.", 
      ha: "Canji, tafiya, motsi, da bude hanya. Yana nuna sauye-sauye da bukatar jaoranci." 
    },
    africanMeaning: {
      fr: "Symbole du grand voyageur et du chercheur. Présage de déblocage de route et de voyage imminent.",
      en: "Symbol of the great traveler and seeker. Portends unblocking of paths and imminent journey.",
      ha: "Alamar mai tafiya nesa da mai neman shawara. Yana nuna bude hanyar da aka kulle."
    },
    africanSaraka: {
      fr: "Aumône de lait frais, kolas blanches ou eau pure aux voyageurs.",
      en: "Charity of fresh milk, white kola nuts, or pure water to travelers.",
      ha: "Sadakar madara mai sanyi, goro fari, ko ruwa mai tsarki ga masafira."
    },
    indianGraha: "Chandra (Moon)",
    indianDosha: "Kapha",
    recommendedDhikr: "Ya Hadi (يا هادي) - 100x",
    bodyPart: { fr: "Estomac et fluides corporéaux", en: "Stomach and bodily fluids", ha: "Ciki da ruwan jiki" }
  },
  "2-2-2-2": {
    code: "2-2-2-2",
    latin: "Populus",
    arabic: "الجماعة (Al-Jama'a)",
    african: "Jama'a / Sori",
    indian: "Samuha (समूह)",
    element: "water",
    elementName: { fr: "Eau", en: "Water", ha: "Ruwa" },
    planet: { fr: "Lune (Fixe)", en: "Moon (Fixed)", ha: "Wata" },
    zodiac: { fr: "Capricorne", en: "Capricorn", ha: "Kaprikon" },
    nature: { fr: "Neutre / Passif", en: "Neutral / Passive", ha: "Tsaka-tsaki / Mara motsi" },
    meaning: { 
      fr: "Foules, assemblée, opinion publique et passivité. Multiplie la force des figures environnantes.", 
      en: "Crowds, assembly, public opinion, and passivity. Multiplies the force of surrounding figures.", 
      ha: "Taron mutane, ra'ayin jama'a da shuru. Yana ninka karfin sauran rabe-rabe." 
    },
    africanMeaning: {
      fr: "Rassemblement familial ou communautaire. Force du nombre et consensus du village.",
      en: "Family or community gathering. Strength in numbers and village consensus.",
      ha: "Taron dangi ko na gari. Karfin taron mutane da hadin kai."
    },
    africanSaraka: {
      fr: "Partage de plat collectif (riz ou couscous) aux enfants de la communauté.",
      en: "Sharing a collective meal (rice or couscous) with village children.",
      ha: "Sadakar abinci mai yawa (shinkafa ko tuwo) ga yaran al'umma."
    },
    indianGraha: "Ketu / Chandra",
    indianDosha: "Kapha / Vata",
    recommendedDhikr: "Ya Jami' (يا جامع) - 114x",
    bodyPart: { fr: "Système lymphatique et yeux", en: "Lymphatic system and eyes", ha: "Hanyoyin jini da idanu" }
  },
  "1-2-1-2": {
    code: "1-2-1-2",
    latin: "Conjunctio",
    arabic: "الاجتماع (Al-Ijtima')",
    african: "Adama / Coumba",
    indian: "Milana (मिलन)",
    element: "air",
    elementName: { fr: "Air", en: "Air", ha: "Iska" },
    planet: { fr: "Mercure", en: "Mercury", ha: "Utarid" },
    zodiac: { fr: "Vierge", en: "Virgo", ha: "Virgo" },
    nature: { fr: "Bénéfique / Harmonieux", en: "Beneficent / Harmonious", ha: "Mai albarka / Daidaito" },
    meaning: { 
      fr: "Union, contrat, mariage, association et alliance heureuse. Excellente augure pour la négociation.", 
      en: "Union, contract, marriage, partnership, and happy alliance. Great omen for negotiation.", 
      ha: "Aure, yarjejeniya, hadaka, da abota mai kyau. Alama ce mai kyau ga kasuwanci." 
    },
    africanMeaning: {
      fr: "Alliance ancestrale réconciliée, mariage béni et entente parfaite entre deux familles.",
      en: "Reconciled ancestral alliance, blessed marriage, and perfect agreement between families.",
      ha: "Daidaiton dangi, auren albarka, da kyakkyawar alaka tsakanin gidaje."
    },
    africanSaraka: {
      fr: "Offrande de 2 noix de kola attachées ensemble ou friandises à un couple.",
      en: "Offering of 2 kola nuts tied together or sweets to a married couple.",
      ha: "Sadakar goro guda biyu a haɗe ko zakin alawa ga ma'aurata."
    },
    indianGraha: "Budha (Mercury)",
    indianDosha: "Vata",
    recommendedDhikr: "Ya Wadud (يا ودود) - 200x",
    bodyPart: { fr: "Mains, bras et système nerveux", en: "Hands, arms, and nervous system", ha: "Hannaye, hannu da jijiyoyi" }
  },
  "2-1-2-1": {
    code: "2-1-2-1",
    latin: "Carcer",
    arabic: "القبض الداخل (Al-Qabd ad-Dakhil)",
    african: "Bandiou / Kounta",
    indian: "Bandhana (बंधन)",
    element: "earth",
    elementName: { fr: "Terre", en: "Earth", ha: "Kasa" },
    planet: { fr: "Saturne", en: "Saturn", ha: "Zuhal" },
    zodiac: { fr: "Poissons", en: "Pisces", ha: "Kifi" },
    nature: { fr: "Maléfique / Restreint", en: "Malefic / Restrictive", ha: "Mara kyau / Kullewa" },
    meaning: { 
      fr: "Isolement, prison, blocage, secret gardé, fermeture et retards. Utile uniquement pour la conservation.", 
      en: "Isolation, prison, blockage, kept secret, closure, and delays. Useful only for preservation.", 
      ha: "Kullewa, gidan yari, jinkiri, asirin da aka boye da tsarewa. Yana da amfani kawai don adana abu." 
    },
    africanMeaning: {
      fr: "Attachement occulte, secret de famille enfermé ou blocage temporaire nécessitant libération.",
      en: "Occult tie, locked family secret, or temporary blockage requiring spiritual release.",
      ha: "Kullewa ta asiri, boyayyen sirri na gida ko jinkiri da ke bukatar addu'a."
    },
    africanSaraka: {
      fr: "Don de cadenas ouvert, pain complet ou clé inutilisée à un indigent.",
      en: "Donation of an open padlock, whole wheat bread, or unused key to a poor person.",
      ha: "Sadakar kwadodo a bude, buredi ko mabuɗi ga matsi."
    },
    indianGraha: "Shani (Saturn)",
    indianDosha: "Vata / Kapha",
    recommendedDhikr: "Ya Fattah (يا فتاح) - 489x",
    bodyPart: { fr: "Squelette, genoux et articulations", en: "Skeleton, knees, and joints", ha: "Kashi, gwiwoyi da gaba" }
  },
  "1-1-2-2": {
    code: "1-1-2-2",
    latin: "Fortuna Major",
    arabic: "النصرة الخارجة (An-Nusra al-Kharija)",
    african: "Souleymane / N'Soloman",
    indian: "Maha Labha (महा लाभ)",
    element: "fire",
    elementName: { fr: "Feu", en: "Fire", ha: "Wuta" },
    planet: { fr: "Soleil", en: "Sun", ha: "Rana" },
    zodiac: { fr: "Lion", en: "Leo", ha: "Zaki" },
    nature: { fr: "Très Bénéfique", en: "Highly Beneficent", ha: "Mai albarka sosai" },
    meaning: { 
      fr: "Victoire majeure, succès éclatant, haute protection divine et réussite durable.", 
      en: "Major victory, brilliant success, high divine protection, and lasting achievement.", 
      ha: "Babban nasara, daukaka, kariya ta Ubangiji da wadata mai dorewa." 
    },
    africanMeaning: {
      fr: "Le Sceptre du Roi (Soliman). Couronnement, noblesse, charisme invincible et triomphe.",
      en: "The King's Scepter (Solomon). Coronation, nobility, invincible charisma, and triumph.",
      ha: "Sanda ta Sarki (Annabi Sulaiman). Sarauta, daukaka, karfin magana da nasara."
    },
    africanSaraka: {
      fr: "Aumône d'un vêtement blanc noble ou festin offert aux sages de la mosquée.",
      en: "Charity of noble white clothing or feast offered to mosque elders.",
      ha: "Sadakar riga fara mai kyau ko ciyar da malamai da dattawa."
    },
    indianGraha: "Surya (Sun)",
    indianDosha: "Pitta",
    recommendedDhikr: "Ya Malik (يا ملك) - 90x",
    bodyPart: { fr: "Cœur, colonne vertébrale et vitalité", en: "Heart, spine, and vitality", ha: "Zuciya, bayan jiki da karfi" }
  },
  "2-2-1-1": {
    code: "2-2-1-1",
    latin: "Fortuna Minor",
    arabic: "النصرة الداخلة (An-Nusra ad-Dakhila)",
    african: "Alou / Aliou",
    indian: "Alpa Labha (अल्प लाभ)",
    element: "fire",
    elementName: { fr: "Feu", en: "Fire", ha: "Wuta" },
    planet: { fr: "Soleil", en: "Sun", ha: "Rana" },
    zodiac: { fr: "Bélier", en: "Aries", ha: "Rago" },
    nature: { fr: "Bénéfique Rapidement", en: "Quickly Beneficent", ha: "Mai albarka ta sauri" },
    meaning: { 
      fr: "Petit succès immédiat, secours rapide, chance soudaine mais parfois volatile.", 
      en: "Immediate small success, rapid relief, sudden luck but sometimes volatile.", 
      ha: "Kankanin nasara na gaggawa, taimako mai sauri, sa'a ta dan lokaci." 
    },
    africanMeaning: {
      fr: "L'Épée du Guerrier (Ali). Courage impétueux, victoire rapide sur les obstacles immédiats.",
      en: "The Warrior's Sword (Ali). Impetuous courage, swift victory over immediate obstacles.",
      ha: "Takobi ta gwanin fada (Sayyidina Ali). Jajircewa da kakkabe matsaloli nan take."
    },
    africanSaraka: {
      fr: "Don de viande rouge grillée ou d'ustensiles métalliques.",
      en: "Donation of grilled red meat or metallic tools.",
      ha: "Sadakar nama soyayye ko kayan karfe."
    },
    indianGraha: "Surya / Mangala",
    indianDosha: "Pitta",
    recommendedDhikr: "Ya Qawiyyu (يا قوي) - 116x",
    bodyPart: { fr: "Tête, visage et yeux", en: "Head, face, and eyes", ha: "Kai, fuska da idanu" }
  },
  "1-2-2-1": {
    code: "1-2-2-1",
    latin: "Acquisitio",
    arabic: "القبض الخارج (Al-Qabd al-Kharij)",
    african: "Mangoussi / Moriba",
    indian: "Labha (लाभ)",
    element: "air",
    elementName: { fr: "Air", en: "Air", ha: "Iska" },
    planet: { fr: "Jupiter", en: "Jupiter", ha: "Mushtari" },
    zodiac: { fr: "Sagittaire", en: "Sagittarius", ha: "Uqub" },
    nature: { fr: "Très Bénéfique", en: "Highly Beneficent", ha: "Mai albarka sosai" },
    meaning: { 
      fr: "Abondance, prospérité matérielle, rentrée d'argent, profit et expansion réussie.", 
      en: "Abundance, material prosperity, influx of money, profit, and successful expansion.", 
      ha: "Arziki, karuwar kudi, ribar kasuwanci, fadada kasuwanci da samun bukata." 
    },
    africanMeaning: {
      fr: "Le Grenier Rempli. Prospérité des récoltes, bénédiction financière et richesse matérielle.",
      en: "The Filled Granary. Harvest prosperity, financial blessing, and material wealth.",
      ha: "Rumbun abinci mai cika. Samun amfanin gona, albarkar kudi da dukiya."
    },
    africanSaraka: {
      fr: "Don de céréales (millet, maïs, riz) ou sucreries en quantité généreuse.",
      en: "Donation of grains (millet, corn, rice) or generous sweets.",
      ha: "Sadakar hatsi (dawa, masara, shinkafa) ko zakin abinci mai yawa."
    },
    indianGraha: "Guru (Jupiter)",
    indianDosha: "Kapha",
    recommendedDhikr: "Ya Razzaq (يا رزاق) - 308x",
    bodyPart: { fr: "Hanches, cuisses et foie", en: "Hips, thighs, and liver", ha: "Kwankwaso, cinyoyi da hanta" }
  },
  "2-1-1-2": {
    code: "2-1-1-2",
    latin: "Amissio",
    arabic: "الشكلة / العقلة (Ash-Shakl / Al-Uqla)",
    african: "Raki / Lansana",
    indian: "Hani (हानि)",
    element: "earth",
    elementName: { fr: "Terre", en: "Earth", ha: "Kasa" },
    planet: { fr: "Vénus", en: "Venus", ha: "Zuhra" },
    zodiac: { fr: "Taureau", en: "Taurus", ha: "Sa'a" },
    nature: { fr: "Maléfique / Dépense", en: "Malefic / Loss", ha: "Mara kyau / Asara" },
    meaning: { 
      fr: "Perte financière, fuite de ressources, détachement ou abandon. Favorable pour éliminer les maux.", 
      en: "Financial loss, leak of resources, detachment, or surrender. Favorable for purging harm.", 
      ha: "Asarar kudi, fita kudi, barin abu. Yana da kyau kawai don rabuwa da matsala." 
    },
    africanMeaning: {
      fr: "Poche percée. Dépenses imprévues ou abandon nécessaire pour éviter pire malédiction.",
      en: "Pierced pocket. Unforeseen expenses or necessary surrender to avoid worse curse.",
      ha: "Aljihu mai huda. Fitar kudi ba zato ba tsammani ko rabuwa da abu don samun lafiya."
    },
    africanSaraka: {
      fr: "Jeter des pièces de monnaie anciennes dans l'eau courante ou donner de vieux vêtements.",
      en: "Tossing old coins in running water or giving away old clothes.",
      ha: "Jefa kudi a cikin kogi ko sadakar tsoffin tufafi."
    },
    indianGraha: "Shukra (Venus)",
    indianDosha: "Kapha / Pitta",
    recommendedDhikr: "Ya Hafiz (يا حفيظ) - 998x",
    bodyPart: { fr: "Gorge, cou et reins", en: "Throat, neck, and kidneys", ha: "Makogwaro, wuya da koda" }
  },
  "1-1-1-2": {
    code: "1-1-1-2",
    latin: "Albus",
    arabic: "البياض (Al-Bayad)",
    african: "Safi / Ibrahim",
    indian: "Shweta (श्वेत)",
    element: "water",
    elementName: { fr: "Eau", en: "Water", ha: "Ruwa" },
    planet: { fr: "Mercure", en: "Mercury", ha: "Utarid" },
    zodiac: { fr: "Gémeaux", en: "Gemini", ha: "Jauza" },
    nature: { fr: "Très Bénéfique", en: "Highly Beneficent", ha: "Mai albarka sosai" },
    meaning: { 
      fr: "Pureté, sagesse, paix, sérénité, vérité, sincérité et clarté d'esprit.", 
      en: "Purity, wisdom, peace, serenity, truth, sincerity, and mental clarity.", 
      ha: "Tsarki, hikima, zaman lafiya, gaskiya da tsarkin zuciya." 
    },
    africanMeaning: {
      fr: "Le Pagne Blanc du Sage (Abraham). Bénédiction spirituelle, paix du cœur et sagesse suprême.",
      en: "The Sage's White Garment (Abraham). Spiritual blessing, peace of heart, and supreme wisdom.",
      ha: "Farar riga ta Annabi Ibrahim. Albarkar ruhaniya, zaman lafiya da gaskiya."
    },
    africanSaraka: {
      fr: "Aumône de lait, farine blanche, sucre ou bougies blanches.",
      en: "Charity of milk, white flour, sugar, or white candles.",
      ha: "Sadakar madara, fula, sukari ko fitilar kyandir fari."
    },
    indianGraha: "Budha / Shukra",
    indianDosha: "Vata / Kapha",
    recommendedDhikr: "Ya Salam (يا سلام) - 131x",
    bodyPart: { fr: "Poumons, épaules et esprit", en: "Lungs, shoulders, and mind", ha: "Huhu, kafadu da kwakwalwa" }
  },
  "2-1-1-1": {
    code: "2-1-1-1",
    latin: "Rubeus",
    arabic: "الحمرة (Al-Humra)",
    african: "Tontagui / Oumar",
    indian: "Rakta (रक्त)",
    element: "fire",
    elementName: { fr: "Feu", en: "Fire", ha: "Wuta" },
    planet: { fr: "Mars", en: "Mars", ha: "Mirrikh" },
    zodiac: { fr: "Scorpion", en: "Scorpio", ha: "Aqrab" },
    nature: { fr: "Maléfique / Inflammable", en: "Malefic / Inflammable", ha: "Mara kyau / Fushi" },
    meaning: { 
      fr: "Colère, passion destructrice, conflit, sang versé, impulsion et danger immédiat.", 
      en: "Anger, destructive passion, conflict, bloodshed, impulse, and immediate danger.", 
      ha: "Fushi, hauka, tashin hankali, jini, da hadari na gaggawa." 
    },
    africanMeaning: {
      fr: "Le Feu du Guerrier (Omar). Tempête, dispute violente, sang et passion aveugle.",
      en: "The Warrior's Fire (Omar). Storm, violent dispute, blood, and blind passion.",
      ha: "Wutar fada (Sayyidina Umar). Tashin hankali, fushi da hadarin jini."
    },
    africanSaraka: {
      fr: "Immolation d'un coq rouge ou aumône de piment rouge et viande aux nécessiteux.",
      en: "Sacrifice of a red rooster or charity of red pepper and meat to the needy.",
      ha: "Sadakar zakara ja ko barkono ja da nama ga mabukata."
    },
    indianGraha: "Mangala (Mars)",
    indianDosha: "Pitta",
    recommendedDhikr: "Ya Jabbar (يا جبار) - 206x",
    bodyPart: { fr: "Sang, tête et organes génitaux", en: "Blood, head, and reproductive organs", ha: "Jini, kai da al'aura" }
  },
  "1-2-1-1": {
    code: "1-2-1-1",
    latin: "Puella",
    arabic: "العتبة الخارجة (Al-Ataba al-Kharija)",
    african: "Lassina / Younous",
    indian: "Kanya (कन्या)",
    element: "air",
    elementName: { fr: "Air", en: "Air", ha: "Iska" },
    planet: { fr: "Vénus", en: "Venus", ha: "Zuhra" },
    zodiac: { fr: "Balance", en: "Libra", ha: "Mizan" },
    nature: { fr: "Bénéfique / Doux", en: "Beneficent / Sweet", ha: "Mai albarka / Sanyi" },
    meaning: { 
      fr: "Douceur, beauté, plaisir, art, esthétique, séduction et harmonie féminine.", 
      en: "Sweetness, beauty, pleasure, art, aesthetics, seduction, and feminine harmony.", 
      ha: "Sanyi, kyau, nishadi, fasaha, da kawance mai kyau." 
    },
    africanMeaning: {
      fr: "La Belle Jeune Fille. Séduction, élégance, musique et agréables nouvelles amoureuses.",
      en: "The Beautiful Maiden. Seduction, elegance, music, and pleasant love news.",
      ha: "Kyakkyawar budurwa. Soyayya, ado, nishadi da labari mai dadi."
    },
    africanSaraka: {
      fr: "Don de parfums doux, miroirs, tissus colorés ou friandises aux jeunes femmes.",
      en: "Gift of sweet perfumes, mirrors, colorful fabrics, or sweets to young women.",
      ha: "Sadakar tirare mai kamshi, madubi, kyallen kaya ko alawa ga mata."
    },
    indianGraha: "Shukra (Venus)",
    indianDosha: "Kapha",
    recommendedDhikr: "Ya Jamil (يا جميل) - 166x",
    bodyPart: { fr: "Peau, reins et système endocrinien", en: "Skin, kidneys, and endocrine system", ha: "Fatar jiki, koda da halitta" }
  },
  "1-1-2-1": {
    code: "1-1-2-1",
    latin: "Puer",
    arabic: "العتبة الداخلة (Al-Ataba ad-Dakhila)",
    african: "Badra / Issa",
    indian: "Putra (पुत्र)",
    element: "fire",
    elementName: { fr: "Feu", en: "Fire", ha: "Wuta" },
    planet: { fr: "Mars", en: "Mars", ha: "Mirrikh" },
    zodiac: { fr: "Bélier", en: "Aries", ha: "Rago" },
    nature: { fr: "Mixte / Combatif", en: "Mixed / Combative", ha: "Gami / Mai yaki" },
    meaning: { 
      fr: "Énergie combative, impétuosité, audace, rivalité et virilité. Excellent pour la lutte.", 
      en: "Combative energy, impetuosity, boldness, rivalry, and virility. Excellent for fighting.", 
      ha: "Karfin yaki, jajircewa, gaba da fada. Yana da kyau don neman haqqi." 
    },
    africanMeaning: {
      fr: "Le Jeune Guerrier Ardent (Jésus/Issa). Ardeur, impétuosité et audace d'action.",
      en: "The Ardent Young Warrior (Jesus/Issa). Ardor, impetuosity, and boldness of action.",
      ha: "Saurayi mai zafin nama (Annabi Isa). Karfin gwiwa da zafin nama."
    },
    africanSaraka: {
      fr: "Aumône d'œufs crus, couteau ou outils de travail à un jeune travailleur.",
      en: "Charity of raw eggs, knife, or work tools to a young worker.",
      ha: "Sadakar qwai danye, wuka ko kayan aiki ga saurayi mai kwazo."
    },
    indianGraha: "Mangala (Mars)",
    indianDosha: "Pitta",
    recommendedDhikr: "Ya Aziz (يا عزيز) - 94x",
    bodyPart: { fr: "Muscles, tête et énergie physique", en: "Muscles, head, and physical energy", ha: "Tsoka, kai da karfin jiki" }
  },
  "1-2-2-2": {
    code: "1-2-2-2",
    latin: "Caput Draconis",
    arabic: "النقي الخد (An-Naqi al-Khadd)",
    african: "N'Garlan / Idris",
    indian: "Rahu Mukha (राहु मुख)",
    element: "earth",
    elementName: { fr: "Terre", en: "Earth", ha: "Kasa" },
    planet: { fr: "Tête du Dragon (Rahu)", en: "Dragon's Head (Rahu)", ha: "Kan Maciji" },
    zodiac: { fr: "Taureau", en: "Taurus", ha: "Sa'a" },
    nature: { fr: "Très Bénéfique / Élévation", en: "Highly Beneficent / Elevation", ha: "Mai albarka / Daukaka" },
    meaning: { 
      fr: "Porte d'entrée favorable, nouveau départ, élévation spirituelle et matérielle.", 
      en: "Favorable entry threshold, new beginning, spiritual and material elevation.", 
      ha: "Kofar shiga mai albarka, sabon farawa, daukaka ta ruhaniya da abun duniya." 
    },
    africanMeaning: {
      fr: "Le Seuil du Prophète Idriss. Élévation intellectuelle, secrets de la terre et sagesse.",
      en: "The Threshold of Prophet Enoch/Idris. Intellectual elevation, earth secrets, and wisdom.",
      ha: "Kofar Annabi Idriss. Ilimi mai zurfi, asirin kasa da daukaka."
    },
    africanSaraka: {
      fr: "Offrande de dattes fraîches, miel pur ou encens précieux.",
      en: "Offering of fresh dates, pure honey, or precious incense.",
      ha: "Sadakar dabino danye, zuma mai tsarki ko turaren wuta mai tsada."
    },
    indianGraha: "Rahu",
    indianDosha: "Vata",
    recommendedDhikr: "Ya Ali (يا علي) - 110x",
    bodyPart: { fr: "Tête, cerveau et intuition", en: "Head, brain, and intuition", ha: "Kai, kwakwalwa da ganin asiri" }
  },
  "2-2-2-1": {
    code: "2-2-2-1",
    latin: "Cauda Draconis",
    arabic: "الانكيس (Al-Inkis)",
    african: "Garlan / N'Garlan Inverse",
    indian: "Ketu Puchha (केतु पुच्छ)",
    element: "fire",
    elementName: { fr: "Feu", en: "Fire", ha: "Wuta" },
    planet: { fr: "Queue du Dragon (Ketu)", en: "Dragon's Tail (Ketu)", ha: "Wutsiyar Maciji" },
    zodiac: { fr: "Scorpion", en: "Scorpio", ha: "Aqrab" },
    nature: { fr: "Maléfique / Sortie", en: "Malefic / Exit", ha: "Mara kyau / Fita" },
    meaning: { 
      fr: "Sortie difficile, fin de cycle douloureuse, illusions, déception et trahison.", 
      en: "Difficult exit, painful end of cycle, illusions, disappointment, and betrayal.", 
      ha: "Fita mai wuya, karshen lamari mai zafi, yaudara, bacin rai da cin amana." 
    },
    africanMeaning: {
      fr: "La Queue du Maciji. Trahison sournoise, illusion magique ou fin inévitable d'un bail.",
      en: "The Serpent's Tail. Devious betrayal, magical illusion, or inevitable end of a deal.",
      ha: "Wutsiyar Maciji. Cin amana ta boye, yaudarar asiri ko karshen alaka."
    },
    africanSaraka: {
      fr: "Don de vieux Balai, cendres chaudes ou sel gros grain hors de la maison.",
      en: "Donation of an old broom, warm ashes, or coarse salt outside the house.",
      ha: "Sadakar tsohon tsani, toka ko gishiri mai tsatsa a wajen gida."
    },
    indianGraha: "Ketu",
    indianDosha: "Pitta / Vata",
    recommendedDhikr: "Ya Mani' (يا مانع) - 161x",
    bodyPart: { fr: "Pieds, gros orteil et élimination", en: "Feet, big toe, and elimination system", ha: "Kafafu, yatsun kafa da najasa" }
  },
  "2-1-2-2": {
    code: "2-1-2-2",
    latin: "Laetitia",
    arabic: "الأحيان (Al-Ahyan)",
    african: "Mahdiou / Adam",
    indian: "Ananda (आनंद)",
    element: "air",
    elementName: { fr: "Air", en: "Air", ha: "Iska" },
    planet: { fr: "Jupiter", en: "Jupiter", ha: "Mushtari" },
    zodiac: { fr: "Poissons", en: "Pisces", ha: "Kifi" },
    nature: { fr: "Très Bénéfique", en: "Highly Beneficent", ha: "Mai albarka sosai" },
    meaning: { 
      fr: "Immense joie, félicité, santé parfaite, célébration, bonne nouvelle et élévation.", 
      en: "Immense joy, bliss, perfect health, celebration, good news, and elevation.", 
      ha: "Babban farinciki, jin dadi, lafiya mai kyau, biki da kyakkyawaccen labari." 
    },
    africanMeaning: {
      fr: "La Joie d'Adam au Paradis. Délivrance de toute peine, fête au village et naissance bénie.",
      en: "The Joy of Adam in Paradise. Deliverance from all grief, village feast, and blessed birth.",
      ha: "Farincikin Annabi Adam a Aljanna. Samun mafita daga damuwa da bikin gari."
    },
    africanSaraka: {
      fr: "Aumône de jus sucré, miel, kolas roses ou dons aux orphelins.",
      en: "Charity of sweet juice, honey, pink kola nuts, or gifts to orphans.",
      ha: "Sadakar abin sha mai zaki, zuma, goro mai ruwan hoda ko taimakon marayu."
    },
    indianGraha: "Guru (Jupiter)",
    indianDosha: "Kapha",
    recommendedDhikr: "Ya Basit (يا باسط) - 72x",
    bodyPart: { fr: "Visage, sourire et cœur", en: "Face, smile, and heart", ha: "Fuska, murmushi da zuciya" }
  },
  "2-2-1-2": {
    code: "2-2-1-2",
    latin: "Tristitia",
    arabic: "النصرة / الفيض الخارج (Al-Fayd al-Kharij)",
    african: "Lomara / Ayyoub",
    indian: "Dukkha (दुःख)",
    element: "earth",
    elementName: { fr: "Terre", en: "Earth", ha: "Kasa" },
    planet: { fr: "Saturne", en: "Saturn", ha: "Zuhal" },
    zodiac: { fr: "Scorpion", en: "Scorpio", ha: "Aqrab" },
    nature: { fr: "Maléfique / Lourd", en: "Malefic / Heavy", ha: "Mara kyau / Nauyi" },
    meaning: { 
      fr: "Chagrin, tristesse profonde, fardeau matériel, solitude et obstacles souterrains.", 
      en: "Sorrow, deep grief, material burden, solitude, and underground obstacles.", 
      ha: "Bakinciki, bacin rai, nauyin al'amuran duniya, kadaita da cikas." 
    },
    africanMeaning: {
      fr: "L'Épreuve de Job (Ayyoub). Patience dans la douleur, lourd fardeau et mélancolie.",
      en: "The Trial of Job (Ayyoub). Patience through pain, heavy burden, and melancholy.",
      ha: "Jarrabawar Annabi Ayuba. Hakuri a lokacin tsanani da nauyin zuciya."
    },
    africanSaraka: {
      fr: "Aumône de terre cuite, charbon froid, haricots noirs ou graines d'en haut.",
      en: "Charity of baked clay, cold charcoal, black beans, or subterranean seeds.",
      ha: "Sadakar tukunya ta kasa, dokar gawayi, ko wake baki ga matsuwa."
    },
    indianGraha: "Shani (Saturn)",
    indianDosha: "Vata",
    recommendedDhikr: "Ya Sabur (يا صبور) - 298x",
    bodyPart: { fr: "Dos, lombaires et os", en: "Back, spine, and bones", ha: "Baya, kugu da kashi" }
  }
};

// UI Translations for French, English, Hausa
const GEOMANCY_I18N: Record<string, any> = {
  fr: {
    back: "Retour aux outils",
    title: "Géomancie Avancée & Multi-Traditions (Khatt ar-Raml)",
    desc: "Analyse géomantique holistique : Traditions Arabo-Maghrébine, Ouest-Africaine (Sikidy), Indienne (Ramal Shastra) & Latine.",
    traditionsBadge: "Maghreb • Sikidy • Ramal • Europe",

    // Tabs
    tabTheme: "📊 Thème des 16 Maisons",
    tabDomain: "🎯 Analyse & Domaine",
    tabTraditions: "🌍 Traditions Comparées",
    tabElements: "⚖️ Éléments & Astrologie",
    tabSecret: "🔑 Voie du Secret & Remèdes",
    tabDictionary: "📖 Encyclopédie (16 Figures)",

    // Modes & Generation
    generationModeLabel: "Mode de Génération :",
    modeAuto: "Tirage Sable",
    modeManual: "Saisie Mères",
    modeAbjad: "Abjad (Nom)",
    generating: "Consultation du sable en cours...",
    generate: "Générer le Thème",
    manualPrompt: "Sélectionnez les 4 Mères (M1, M2, M3, M4) :",
    motherLabel: "Mère",
    namePrompt: "Nom du Consultant / Questionneur :",
    motherNamePrompt: "Nom de la Mère :",
    namePlaceholder: "ex: Ibrahim / إبراهيم",
    motherNamePlaceholder: "ex: Amina / أمينة",
    calculateAbjad: "Calculer & Générer les Mères",

    // Chart & Detail
    clickHouse: "Cliquez sur une maison pour explorer son analyse complète",
    exportPNG: "Exporter Thème (PNG)",
    judge: "Le Juge (Maison 15)",
    supreme: "Le Suprême (Maison 16)",
    judgeDesc: "Le Verdict direct à votre question (M15).",
    supremeDesc: "L'Avenir ultime à long terme (M16).",
    natureLabel: "Nature",
    meaningLabel: "Signification",
    houseLabel: "Maison",
    generalInterpretation: "Interprétation Générale",
    sikidyTitle: "Sikidy & Saraka (Recommandation Africaine)",
    charityLabel: "💡 Aumône (Saraka) :",

    // Domain Analysis Section
    domainAnalysisTitle: "Analyse par Domaine de Question",
    m1VsTarget: "Maison 1 vs Maison Cible",
    domainCareer: "💼 Carrière & Pouvoir",
    domainFinances: "💰 Finances & Fortune",
    domainMarriage: "❤️ Mariage & Union",
    domainTravel: "✈️ Voyage & Savoir",
    domainHealth: "🛡️ Santé & Épreuves",
    domainFriends: "👥 Amis & Projets",
    domainHome: "🏠 Foyer & Patrimoine",
    domainObstacles: "🔮 Obstacles & Secrets",

    consultantLabel: "Consultant (M1)",
    targetLabel: "Objet",
    judgeLabel: "Juge (M15)",
    supremeLabel: "Issue (M16)",
    diagnosticTitle: "Diagnostic Thématique pour : Maison",
    recommendationLabel: "✨ Recommandation :",

    // Passations (Al-Intiqal)
    passationsTitle: "Passations des Figures & Compagnonnage (Al-Intiqal)",
    passationsSubtitle: "Répétition des figures dans les 16 Maisons (Circulation d'énergie)",
    noPassations: "Aucune répétition directe détectée dans le thème. Chaque Maison accueille une figure unique (Thème très diversifié).",
    housesBadge: "Maisons :",

    // Compass & Directions (Al-Jiha)
    compassTitle: "Boussole Géomantique & Orientation Spatiale (Al-Jiha)",
    compassSubtitle: "Direction prédominante du thème pour la recherche ou les déplacements",
    dominantDirLabel: "Direction Dominante :",
    secondaryDirLabel: "Secteur Secondaire :",
    dirEastName: "Est (Feu / Orient)",
    dirEastDesc: "Secteur de l'action, des décisions rapides, de la vitalité et des initiatives.",
    dirNorthName: "Nord (Air / Vent)",
    dirNorthDesc: "Secteur de l'intelligence, des communications, du commerce et de la sagesse.",
    dirWestName: "Ouest (Eau / Coucher)",
    dirWestDesc: "Secteur des émotions, de la guérison, de l'intuition et des voyages maritimes.",
    dirSouthName: "Sud (Terre / Sol)",
    dirSouthDesc: "Secteur de l'ancrage, du patrimoine immobilier, de la stabilité et de la patience.",

    // Traditions Comparées
    multiTraditionTitle: "Analyse Multi-Traditions des Figures Clés",
    tradAraboMaghrebi: "🌙 Arabo-Maghrébine",
    tradAfrican: "🌍 Africaine (Sikidy)",
    tradIndian: "🛕 Indienne (Ramal)",
    tradEuropean: "🏛️ Latine / Européenne",
    planetLabel: "Planète :",
    zodiacLabel: "Zodiaque :",
    elementLabel: "Élément :",

    // Elements & Advice
    elementalBalance: "Bilan des Éléments du Thème",
    fireCount: "Feu (Nar / Action)",
    airCount: "Air (Hawa / Pensée)",
    waterCount: "Eau (Ma / Émotion)",
    earthCount: "Terre (Turab / Matière)",
    dominantElement: "Élément Dominant",
    elementAdvice: "Conseil Élémentaire",
    fireDominanceText: "Dominance du Feu : Indique une énergie d'action zélée, de décision rapide, d'impulsion mais attention aux colères ou précipitations.",
    airDominanceText: "Dominance de l'Air : Indique une prédominance des pensées, contrats, négociations, idées et communication sociale.",
    waterDominanceText: "Dominance de l'Eau : Indique des voyages, de la sensibilité émotionnelle, de la spiritualité et du mouvement fluide.",
    earthDominanceText: "Dominance de la Terre : Indique des considérations matérielles, financières, des possessions durables ou de la lenteur.",

    // Secret Path
    secretPathTitle: "Tariq al-Nogta (La Voie du Secret)",
    secretPathDesc: "Retraçage de la lignée du point supérieur (Feu) du Juge jusqu'aux Mères pour révéler la cause cachée de la situation.",
    headLineageLabel: "Lignée de la Tête du Juge (M15)",
    secretMothersLabel: "Mères d'origine connectées au point du secret :",
    noneDirectly: "Aucune directe",
    themeValidity: "Vérification du Mizan (Valide)",
    themeInvalidity: "Attention : Le Mizan est impair ! Thème asymétrique.",
    recommendedSaraka: "Aumône & Sacrifices Recommandés (Tradition Africaine / Sikidy)",
    recommendedDhikr: "Dhikr & Noms Divins Protecteurs",
    dhikrAdvice: "À réciter matin ou soir pour débloquer les énergies bénéfiques du thème.",

    // Encyclopedia
    dictionaryTitle: "Dictionnaire des 16 Figures Géomantiques",
    searchPlaceholder: "Rechercher une figure (nom latin, arabe, africain...)",

    // Canvas Export
    canvasTitle: "ASRARHUB — THÈME GÉOMANTIQUE COMPLET (KHATT AR-RAML)",
    canvasSubtitle: "Calcul des 16 Maisons • Mizan, Passations & Remèdes Spirituels",
    canvasFooter: "Prophétique & Géomancie Traditionnelle — AsrarHub Application",

    houseNames: [
      "M1 : La Vie & Le Consultant",
      "M2 : L'Argent & Finances",
      "M3 : Les Frères & Proches",
      "M4 : Le Foyer & Patrimoine",
      "M5 : Les Enfants & Amours",
      "M6 : La Maladie & Servitudes",
      "M7 : Le Mariage & Contrats",
      "M8 : La Mort & Crises",
      "M9 : Les Voyages & Spiritualité",
      "M10 : Le Pouvoir & Réussite",
      "M11 : L'Espoir & Amis",
      "M12 : Les Épreuves & Obstacles",
      "M13 : Témoin Droit (Le Passé)",
      "M14 : Témoin Gauche (Le Futur)",
      "M15 : Le Juge (Le Verdict)",
      "M16 : Le Suprême (L'Issue Finale)"
    ]
  },
  en: {
    back: "Back to tools",
    title: "Advanced Multi-Tradition Geomancy (Khatt ar-Raml)",
    desc: "Holistic Geomantic System: Arab-Maghrebi, West African (Sikidy), Indian (Ramal Shastra) & Latin Traditions.",
    traditionsBadge: "Maghreb • Sikidy • Ramal • Europe",

    // Tabs
    tabTheme: "📊 16 Houses Chart",
    tabDomain: "🎯 Analysis & Domain",
    tabTraditions: "🌍 Compared Traditions",
    tabElements: "⚖️ Elements & Astrology",
    tabSecret: "🔑 Secret Path & Remedies",
    tabDictionary: "📖 Encyclopedia (16 Figures)",

    // Modes & Generation
    generationModeLabel: "Generation Mode:",
    modeAuto: "Sand Casting",
    modeManual: "Mothers Input",
    modeAbjad: "Abjad (Name)",
    generating: "Consulting the sand...",
    generate: "Generate Chart",
    manualPrompt: "Select the 4 Mothers (M1, M2, M3, M4):",
    motherLabel: "Mother",
    namePrompt: "Consultant / Questioner Name:",
    motherNamePrompt: "Mother's Name:",
    namePlaceholder: "e.g.: Ibrahim / إبراهيم",
    motherNamePlaceholder: "e.g.: Amina / أمينة",
    calculateAbjad: "Calculate & Generate Mothers",

    // Chart & Detail
    clickHouse: "Click on any house to inspect full tradition details",
    exportPNG: "Export Chart (PNG)",
    judge: "The Judge (House 15)",
    supreme: "The Supreme (House 16)",
    judgeDesc: "Direct verdict to your question (H15).",
    supremeDesc: "Ultimate long-term outcome (H16).",
    natureLabel: "Nature",
    meaningLabel: "Meaning",
    houseLabel: "House",
    generalInterpretation: "General Interpretation",
    sikidyTitle: "Sikidy & Saraka (African Recommendation)",
    charityLabel: "💡 Charity (Saraka):",

    // Domain Analysis Section
    domainAnalysisTitle: "Question Domain Analysis",
    m1VsTarget: "House 1 vs Target House",
    domainCareer: "💼 Career & Power",
    domainFinances: "💰 Finances & Fortune",
    domainMarriage: "❤️ Marriage & Union",
    domainTravel: "✈️ Travel & Knowledge",
    domainHealth: "🛡️ Health & Trials",
    domainFriends: "👥 Friends & Projects",
    domainHome: "🏠 Home & Heritage",
    domainObstacles: "🔮 Obstacles & Secrets",

    consultantLabel: "Consultant (H1)",
    targetLabel: "Target",
    judgeLabel: "Judge (H15)",
    supremeLabel: "Outcome (H16)",
    diagnosticTitle: "Thematic Diagnosis for: House",
    recommendationLabel: "✨ Recommendation:",

    // Passations (Al-Intiqal)
    passationsTitle: "Passations & Company of Figures (Al-Intiqal)",
    passationsSubtitle: "Repetition of figures across the 16 Houses (Energy Circulation)",
    noPassations: "No direct repetition detected in the chart. Each House hosts a unique figure (Highly diversified chart).",
    housesBadge: "Houses:",

    // Compass & Directions (Al-Jiha)
    compassTitle: "Geomantic Compass & Spatial Orientation (Al-Jiha)",
    compassSubtitle: "Predominant direction of the chart for searches or travel",
    dominantDirLabel: "Dominant Direction:",
    secondaryDirLabel: "Secondary Sector:",
    dirEastName: "East (Fire / Orient)",
    dirEastDesc: "Sector of action, swift decisions, vitality, and initiatives.",
    dirNorthName: "North (Air / Wind)",
    dirNorthDesc: "Sector of intelligence, communications, trade, and wisdom.",
    dirWestName: "West (Water / Sunset)",
    dirWestDesc: "Sector of emotions, healing, intuition, and sea travel.",
    dirSouthName: "South (Earth / Ground)",
    dirSouthDesc: "Sector of grounding, real estate heritage, stability, and patience.",

    // Traditions Comparées
    multiTraditionTitle: "Multi-Tradition Analysis of Key Figures",
    tradAraboMaghrebi: "🌙 Arab-Maghrebi",
    tradAfrican: "🌍 African (Sikidy)",
    tradIndian: "🛕 Indian (Ramal)",
    tradEuropean: "🏛️ Latin / European",
    planetLabel: "Planet:",
    zodiacLabel: "Zodiac:",
    elementLabel: "Element:",

    // Elements & Advice
    elementalBalance: "Chart Elemental Balance",
    fireCount: "Fire (Action / Energy)",
    airCount: "Air (Thought / Mind)",
    waterCount: "Water (Emotion / Travel)",
    earthCount: "Earth (Matter / Stability)",
    dominantElement: "Dominant Element",
    elementAdvice: "Elemental Advice",
    fireDominanceText: "Fire Dominance: Indicates zeal, swift decisions, and impulse, but beware of anger or haste.",
    airDominanceText: "Air Dominance: Indicates a prevalence of thoughts, contracts, negotiations, ideas, and social communication.",
    waterDominanceText: "Water Dominance: Indicates travel, emotional sensitivity, spirituality, and fluid movement.",
    earthDominanceText: "Earth Dominance: Indicates material considerations, financial matters, lasting possessions, or slowness.",

    // Secret Path
    secretPathTitle: "Tariq al-Nogta (The Path of the Secret)",
    secretPathDesc: "Tracing the top line (Fire) of the Judge back to the Mother houses to reveal the hidden root cause.",
    headLineageLabel: "Head Lineage of the Judge (H15)",
    secretMothersLabel: "Original Mothers connected to secret point:",
    noneDirectly: "None directly",
    themeValidity: "Mizan Balance Check (Valid)",
    themeInvalidity: "Warning: Mizan is odd! Asymmetrical chart.",
    recommendedSaraka: "Recommended Charity & Sacrifices (African Sikidy Tradition)",
    recommendedDhikr: "Protective Dhikr & Divine Names",
    dhikrAdvice: "Recite morning or evening to unlock the beneficial energies of the chart.",

    // Encyclopedia
    dictionaryTitle: "Dictionary of the 16 Geomantic Figures",
    searchPlaceholder: "Search figure (Latin, Arabic, African name...)",

    // Canvas Export
    canvasTitle: "ASRARHUB — COMPLETE GEOMANTIC CHART (KHATT AR-RAML)",
    canvasSubtitle: "16 Houses Calculation • Mizan, Passations & Spiritual Remedies",
    canvasFooter: "Prophetic & Traditional Geomancy — AsrarHub Application",

    houseNames: [
      "H1: Life & The Consultant",
      "H2: Money & Wealth",
      "H3: Siblings & Relatives",
      "H4: Home & Ancestry",
      "H5: Children & Love",
      "H6: Sickness & Work",
      "H7: Marriage & Contracts",
      "H8: Death & Crises",
      "H9: Journeys & Faith",
      "H10: Power & Success",
      "H11: Hope & Friends",
      "H12: Trials & Secrets",
      "H13: Right Witness (Past)",
      "H14: Left Witness (Future)",
      "H15: The Judge (Verdict)",
      "H16: The Supreme (Final Outcome)"
    ]
  },
  ha: {
    back: "Koma ga kayan aiki",
    title: "Kaddara ta Kasa ta Mabiya Daban-daban (Khatt ar-Raml)",
    desc: "Binciken Kasa mai Zurfi: Al'adun Larabawa, Afirka (Sikidy), Indiya (Ramal Shastra) da Turawa.",
    traditionsBadge: "Arewacin Afirka • Sikidy • Ramal • Turai",

    // Tabs
    tabTheme: "📊 Gidaje 16 na Kasa",
    tabDomain: "🎯 Binciken Bangare",
    tabTraditions: "🌍 Kwatanta Al'adu",
    tabElements: "⚖️ Abubuwa & Taurari",
    tabSecret: "🔑 Hanyar Asiri & Magani",
    tabDictionary: "📖 Kamus na Alamomi 16",

    // Modes & Generation
    generationModeLabel: "Hanyar Samarda Kasa:",
    modeAuto: "Duban Yashi",
    modeManual: "Shigar da Uwaye",
    modeAbjad: "Lissafin Abjad (Suna)",
    generating: "Ana duban kasa...",
    generate: "Samarda Jadawali",
    manualPrompt: "Zabi uwayen kasa guda 4 (M1, M2, M3, M4):",
    motherLabel: "Mahaifiya",
    namePrompt: "Sunan Mai Tambaya:",
    motherNamePrompt: "Sunan Mahaifiya:",
    namePlaceholder: "misali: Ibrahim / إبراهيم",
    motherNamePlaceholder: "misali: Amina / أمينة",
    calculateAbjad: "Lissafa & Samarda Uwaye",

    // Chart & Detail
    clickHouse: "Danna kan kowane gida don ganin bayanan al'ada gaba daya",
    exportPNG: "Fitar da Jadawali (PNG)",
    judge: "Alkali (Gida na 15)",
    supreme: "Mafi Daukaka (Gida na 16)",
    judgeDesc: "Amsar karshe ga tambayarka (G15).",
    supremeDesc: "Karshen lamari na dogon lokaci (G16).",
    natureLabel: "Dabi'a",
    meaningLabel: "Fassara",
    houseLabel: "Gida",
    generalInterpretation: "Bayanin Gaba Daya",
    sikidyTitle: "Sikidy da Sadaka (Bayanin Afirka)",
    charityLabel: "💡 Sadaka:",

    // Domain Analysis Section
    domainAnalysisTitle: "Binciken Bangaren Tambaya",
    m1VsTarget: "Gida 1 da Gidan Tambaya",
    domainCareer: "💼 Aiki da Sarauta",
    domainFinances: "💰 Kudi da Arziki",
    domainMarriage: "❤️ Aure da Dangantaka",
    domainTravel: "✈️ Tafiya da Ilimi",
    domainHealth: "🛡️ Lafiya da Jarrabawa",
    domainFriends: "👥 Abokai da Shirye-shirye",
    domainHome: "🏠 Gida da Dukiya",
    domainObstacles: "🔮 Matsaloli da Asirori",

    consultantLabel: "Mai Tambaya (G1)",
    targetLabel: "Abin Tambaya",
    judgeLabel: "Alkali (G15)",
    supremeLabel: "Karshe (G16)",
    diagnosticTitle: "Binciken Bangare ga: Gida",
    recommendationLabel: "✨ Shawara:",

    // Passations (Al-Intiqal)
    passationsTitle: "Motsin Alamomi da Haɗuwa (Al-Intiqal)",
    passationsSubtitle: "Maimaituwar alamomi a gidaje 16 (Yaduwar Karfi)",
    noPassations: "Babu maimaituwar alama kai tsaye. Kowane gida yana da alama ta musamman.",
    housesBadge: "Gidaje:",

    // Compass & Directions (Al-Jiha)
    compassTitle: "Tausiyar Kasa da Bangaren Jagora (Al-Jiha)",
    compassSubtitle: "Mafi rinjayen bangare don bincike ko tafiya",
    dominantDirLabel: "Bangare Mafi Rinjiye:",
    secondaryDirLabel: "Bangare na Biyu:",
    dirEastName: "Gabas (Wuta / Orient)",
    dirEastDesc: "Bangaren aiki, yanke shawara ta sauri, karfin jiki da kwarin gwiwa.",
    dirNorthName: "Arewa (Iska / Vent)",
    dirNorthDesc: "Bangaren ilimi, sadarwa, kasuwanci da hikima.",
    dirWestName: "Yamma (Ruwa / Coucher)",
    dirWestDesc: "Bangaren juyayi, waraka, tunani da tafiyar ruwa.",
    dirSouthName: "Kudu (Kasa / Sol)",
    dirSouthDesc: "Bangaren tabbatuwa, gida da dukiya, zaman lafiya da hakuri.",

    // Traditions Comparées
    multiTraditionTitle: "Kwatanta Al'adun Alamomi Masu Muhimmanci",
    tradAraboMaghrebi: "🌙 Larabawa & Arewacin Afirka",
    tradAfrican: "🌍 Afirka (Sikidy)",
    tradIndian: "🛕 Indiya (Ramal)",
    tradEuropean: "🏛️ Latin da Turai",
    planetLabel: "Tauraro:",
    zodiacLabel: "Burji:",
    elementLabel: "Sinadari:",

    // Elements & Advice
    elementalBalance: "Lissafin Abubuwan Hudu a Kasa",
    fireCount: "Wuta (Niyya da Karfi)",
    airCount: "Iska (Tunani da Magana)",
    waterCount: "Ruwa (Juyayi da Tafiya)",
    earthCount: "Kasa (Arziki da Dorewa)",
    dominantElement: "Abin da ya fi Yawa",
    elementAdvice: "Shawarar Abubuwan Kasa",
    fireDominanceText: "Rinjayen Wuta: Yana nuna zafin nama, yanke shawara ta sauri da kwarin gwiwa, amma a kiyayi fushi ko gaggawa.",
    airDominanceText: "Rinjayen Iska: Yana nuna mamayar tunani, yarjejeniya, kasuwanci, shawarwari da sadarwa.",
    waterDominanceText: "Rinjayen Ruwa: Yana nuna tafiye-tafiye, tausayi, ruhananci da saukin al'amura.",
    earthDominanceText: "Rinjayen Kasa: Yana nuna al'amuran dukiya, kudi, dawwamammun abubuwa ko jinkiri.",

    // Secret Path
    secretPathTitle: "Tariq al-Nogta (Hanyar Boyayyen Asiri)",
    secretPathDesc: "Binciken samo asalin matsalar ta hanyar bin layin wuta na Alkali zuwa gidan Uwaye.",
    headLineageLabel: "Nasabar Kan Alkali (G15)",
    secretMothersLabel: "Uwaye da ke haɗe da ma'aunin asiri:",
    noneDirectly: "Babu kai tsaye",
    themeValidity: "Tabbatar da Mizan (Yana da Kyau)",
    themeInvalidity: "An samu rashin daidaito a lissafin Mizan.",
    recommendedSaraka: "Sadakar da Aka Shawarta (Al'adar Afirka / Sikidy)",
    recommendedDhikr: "Zikiri da Sunaye Masu Albarka",
    dhikrAdvice: "A karanta da safe ko maraice don bude albarkar jadawalin.",

    // Encyclopedia
    dictionaryTitle: "Kamus na Alamomi 16 na Kasa",
    searchPlaceholder: "Binciki alamar kasa (da Latin, Larabci ko Sunan Afirka)...",

    // Canvas Export
    canvasTitle: "ASRARHUB — JADAWALIN DUBAN KASA (KHATT AR-RAML)",
    canvasSubtitle: "Lissafin Gidaje 16 • Mizan, Motsi da Maganin Ruhi",
    canvasFooter: "Ilimin Kasa na Annabawa da Al'ada — AsrarHub Application",

    houseNames: [
      "G1: Rayuwa da Mai Duba",
      "G2: Kudi da Dukiya",
      "G3: Yan Uwa na Kusa",
      "G4: Gida da Karshen Lamari",
      "G5: Yara da Soyayya",
      "G6: Rashin Lafiya da Aiki",
      "G7: Aure da Yarjejeniya",
      "G8: Mutuwa da Wahala",
      "G9: Tafiya da Ibada",
      "G10: Mulki da Daukaka",
      "G11: Fata da Abokan Arziki",
      "G12: Jarrabawa da Abokan Gaba",
      "G13: Shaidar Dama (Tarihi)",
      "G14: Shaidar Hagu (Nan Gaba)",
      "G15: Alkali (Hukunci)",
      "G16: Mafi Daukaka (Karshe)"
    ]
  }
};

export const Geomancy: React.FC = () => {
  const { language } = useLanguage();
  const langKey = (language === 'ha' || language === 'en' || language === 'fr') ? language : 'fr';
  const i18n = GEOMANCY_I18N[langKey] || GEOMANCY_I18N['fr'];

  const [activeTab, setActiveTab] = useState<'chart' | 'interpretation' | 'traditions' | 'elements' | 'secret' | 'dictionary'>('chart');
  const [inputMode, setInputMode] = useState<'auto' | 'manual' | 'abjad'>('auto');
  const [selectedDomain, setSelectedDomain] = useState<number>(10); // Default to House 10 (Career/Power)
  
  // Custom manual inputs
  const [manualMothers, setManualMothers] = useState<string[]>(["1-1-1-1", "2-2-2-2", "1-2-1-2", "2-1-2-1"]);
  const [userName, setUserName] = useState('');
  const [userMotherName, setUserMotherName] = useState('');

  const [figures, setFigures] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [dictionarySearch, setDictionarySearch] = useState('');

  // Calculate 16 figures from 4 mothers
  const computeFullChartFromMothers = (m1: number[], m2: number[], m3: number[], m4: number[]) => {
    // Daughters
    const d1 = [m1[0], m2[0], m3[0], m4[0]];
    const d2 = [m1[1], m2[1], m3[1], m4[1]];
    const d3 = [m1[2], m2[2], m3[2], m4[2]];
    const d4 = [m1[3], m2[3], m3[3], m4[3]];

    // Addition modulo 2 (even = 2, odd = 1)
    const combine = (a: number[], b: number[]) => a.map((val, i) => (val + b[i]) % 2 === 0 ? 2 : 1);

    // Nieces
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

    return [m1, m2, m3, m4, d1, d2, d3, d4, n1, n2, n3, n4, w1, w2, j, r];
  };

  const generateFigures = () => {
    setIsGenerating(true);
    setSelectedHouse(null);

    setTimeout(() => {
      let m1: number[], m2: number[], m3: number[], m4: number[];

      if (inputMode === 'auto') {
        m1 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
        m2 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
        m3 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
        m4 = Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : 2);
      } else if (inputMode === 'manual') {
        m1 = manualMothers[0].split('-').map(Number);
        m2 = manualMothers[1].split('-').map(Number);
        m3 = manualMothers[2].split('-').map(Number);
        m4 = manualMothers[3].split('-').map(Number);
      } else {
        // Abjad Calculation
        const combinedStr = (userName + userMotherName).toLowerCase();
        let abjadSum = 0;
        for (let char of combinedStr) {
          if (ABJAD_MAP[char]) {
            abjadSum += ABJAD_MAP[char];
          } else {
            abjadSum += (char.charCodeAt(0) % 9) + 1;
          }
        }
        if (abjadSum === 0) abjadSum = 123; // fallback

        m1 = [(abjadSum % 2) + 1, ((abjadSum + 1) % 2) + 1, ((abjadSum + 2) % 2) + 1, ((abjadSum + 3) % 2) + 1];
        m2 = [((abjadSum * 2) % 2) + 1, (((abjadSum * 2) + 1) % 2) + 1, (((abjadSum * 2) + 2) % 2) + 1, (((abjadSum * 2) + 3) % 2) + 1];
        m3 = [((abjadSum * 3) % 2) + 1, (((abjadSum * 3) + 1) % 2) + 1, (((abjadSum * 3) + 2) % 2) + 1, (((abjadSum * 3) + 3) % 2) + 1];
        m4 = [((abjadSum * 4) % 2) + 1, (((abjadSum * 4) + 1) % 2) + 1, (((abjadSum * 4) + 2) % 2) + 1, (((abjadSum * 4) + 3) % 2) + 1];
      }

      const fullChart = computeFullChartFromMothers(m1, m2, m3, m4);
      setFigures(fullChart);
      setIsGenerating(false);
    }, 800);
  };

  // Helper to look up figure details
  const getFigureDetail = (figArr: number[]): GeomancyFigureDetail => {
    const key = figArr.join('-');
    return FIGURES_DATABASE[key] || FIGURES_DATABASE["1-1-1-1"];
  };

  // Render 4 lines of dots
  const renderDots = (arr: number[], size: 'sm' | 'md' | 'lg' = 'md') => {
    const dotSizes = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3.5 h-3.5'
    };
    return (
      <div className="flex flex-col gap-1 items-center justify-center">
        {arr.map((val, i) => (
          <div key={i} className="flex gap-1.5">
            {val === 2 ? (
              <>
                <div className={`${dotSizes[size]} rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm`}></div>
                <div className={`${dotSizes[size]} rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm`}></div>
              </>
            ) : (
              <div className={`${dotSizes[size]} rounded-full bg-amber-900 dark:bg-amber-100 shadow-sm`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Calculate Elemental distribution across the 16 houses
  const getElementalStats = () => {
    if (figures.length === 0) return { fire: 0, air: 0, water: 0, earth: 0, dominant: 'fire' };
    let counts = { fire: 0, air: 0, water: 0, earth: 0 };
    figures.forEach(fig => {
      const detail = getFigureDetail(fig);
      counts[detail.element]++;
    });
    
    let maxCount = -1;
    let dominant = 'fire';
    (Object.keys(counts) as Array<keyof typeof counts>).forEach(el => {
      if (counts[el] > maxCount) {
        maxCount = counts[el];
        dominant = el;
      }
    });

    return { ...counts, dominant };
  };

  // Check Mizan validity (Sum of dots in Judge House 15 must be even)
  const isMizanValid = () => {
    if (figures.length < 15) return true;
    const judgeDots = figures[14].reduce((a, b) => a + b, 0);
    return judgeDots % 2 === 0;
  };

  // Tariq al-Nogta (Path of the Secret): Trace Judge's line 1 (Fire line) back to Mothers
  const getSecretPathMothers = () => {
    if (figures.length < 15) return [];
    const judgeTopLine = figures[14][0]; // 1 or 2
    const matchingMothers: number[] = [];
    [0, 1, 2, 3].forEach(idx => {
      if (figures[idx][0] === judgeTopLine) {
        matchingMothers.push(idx + 1);
      }
    });
    return matchingMothers;
  };

  // Analyze Repetitions & House Passations (Intiqal & Sohba)
  const getRepetitionsAndPassations = () => {
    if (figures.length < 16) return [];
    const map: Record<string, number[]> = {};
    figures.slice(0, 16).forEach((fig, idx) => {
      const code = fig.join('-');
      if (!map[code]) map[code] = [];
      map[code].push(idx + 1); // 1-indexed House numbers
    });

    const results: { code: string; detail: GeomancyFigureDetail; houses: number[]; interpretation: string }[] = [];
    Object.entries(map).forEach(([code, houses]) => {
      if (houses.length >= 2) {
        const detail = FIGURES_DATABASE[code] || FIGURES_DATABASE["1-1-1-1"];
        let interp = "";
        if (houses.includes(1) && houses.includes(10)) {
          interp = "Passation remarquable entre le Demandeur (M1) et le Pouvoir (M10) : L'intention du consultant se concrétise directement dans la sphère d'autorité, garantissant succès et promotion.";
        } else if (houses.includes(1) && houses.includes(7)) {
          interp = "Passation entre le Demandeur (M1) et l'Adversaire/Partenaire (M7) : Lien direct ou effet miroir avec l'autre partie. Négociation, association ou rencontre décisive.";
        } else if (houses.includes(1) && houses.includes(2)) {
          interp = "Passation vers les Biens (M2) : Les démarches personnelles du consultant agissent immédiatement sur ses finances et bénéfices matériels.";
        } else if (houses.includes(1) && houses.includes(8)) {
          interp = "Présence simultanée en M1 et M8 (Crainte/Transformation) : Avertissement sur une entrave temporaire ou une inquiétude à apaiser par le Dhikr.";
        } else if (houses.includes(15) || houses.includes(16)) {
          interp = `Répétition dans la Maison du Juge/Suprême (M15/M16) : La force de la figure ${detail.latin} (${detail.arabic}) scelle le dénouement de la consultation.`;
        } else {
          interp = `Répétition de la figure ${detail.latin} dans les Maisons ${houses.join(', ')} : Amplification de la vibration élémentaire ${detail.elementName.fr} dans ces secteurs de vie.`;
        }
        results.push({ code, detail, houses, interpretation: interp });
      }
    });
    return results;
  };

  // Spatial Direction / Compass calculation
  const getSpatialDirection = () => {
    if (figures.length < 16) return { primary: 'Nord', secondary: 'Est', advice: '' };
    const stats = getElementalStats();
    // Fire = Est, Air = Nord, Water = Ouest, Earth = Sud
    const dirScores = [
      { name: 'Est (Feu / Orient)', count: stats.fire, element: 'fire', desc: 'Secteur de l\'action, des décisions rapides, de la vitalité et des initiatives.' },
      { name: 'Nord (Air / Vent)', count: stats.air, element: 'air', desc: 'Secteur de l\'intelligence, des communications, du commerce et de la sagesse.' },
      { name: 'Ouest (Eau / Coucher)', count: stats.water, element: 'water', desc: 'Secteur des émotions, de la guérison, de l\'intuition et des voyages maritimes.' },
      { name: 'Sud (Terre / Sol)', count: stats.earth, element: 'earth', desc: 'Secteur de l\'ancrage, du patrimoine immobilier, de la stabilité et de la patience.' }
    ].sort((a, b) => b.count - a.count);

    return {
      primary: dirScores[0].name,
      secondary: dirScores[1].name,
      primaryObj: dirScores[0],
      secondaryObj: dirScores[1],
      advice: `L'énergie spatiale dominante du thème pointe vers la direction ${dirScores[0].name}. Pour vos démarches physiques, la recherche d'un objet égaré ou l'orientation d'un lieu d'action, privilégiez ce quadrant.`
    };
  };

  // Export 16 Houses Chart as PNG Image
  const exportChartAsImage = async () => {
    if (figures.length < 16) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background fill
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header banner
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, canvas.width, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASRARHUB — THÈME GÉOMANTIQUE COMPLET (KHATT AR-RAML)', canvas.width / 2, 45);

    ctx.font = '16px sans-serif';
    ctx.fillText('Calcul des 16 Maisons • Mizan, Passations & Remèdes Spirituels', canvas.width / 2, 72);

    // Grid of 16 houses
    const cols = 4;
    const padding = 25;
    const startY = 120;
    const cellWidth = (canvas.width - padding * (cols + 1)) / cols;
    const cellHeight = 180;

    figures.slice(0, 16).forEach((fig, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = padding + col * (cellWidth + padding);
      const y = startY + row * (cellHeight + 15);

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, cellWidth, cellHeight, 12);
      ctx.fill();
      ctx.stroke();

      // House Title
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      const houseLabel = i18n.houseNames[idx] ? i18n.houseNames[idx].split(' : ')[0] : `Maison ${idx + 1}`;
      ctx.fillText(`M${idx + 1}: ${houseLabel}`, x + cellWidth / 2, y + 26);

      // Dots
      const detail = getFigureDetail(fig);
      const dotYStart = y + 50;
      fig.forEach((val, lIdx) => {
        const ly = dotYStart + lIdx * 18;
        ctx.fillStyle = '#f59e0b';
        if (val === 2) {
          ctx.beginPath();
          ctx.arc(x + cellWidth / 2 - 10, ly, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + cellWidth / 2 + 10, ly, 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x + cellWidth / 2, ly, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Figure Names
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${detail.latin} — ${detail.arabic.split(' ')[0]}`, x + cellWidth / 2, y + 140);

      ctx.fillStyle = '#10b981';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Sikidy: ${detail.african.split(' / ')[0]}`, x + cellWidth / 2, y + 160);
    });

    // Footer
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Prophétique & Géomancie Traditionnelle — AsrarHub Application', canvas.width / 2, canvas.height - 25);

    await downloadCanvasImage(canvas, `Geomancie_Theme_${Date.now()}.png`);
  };

  const elemStats = getElementalStats();

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt min-h-screen pb-24 flex flex-col">
      {/* Top Banner */}
      <div className="mb-4 shrink-0">
        <Link to="/tools" className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium mb-2 transition-colors">
          <ArrowLeft className="mr-2" size={18} />
          {i18n.back}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-900/40 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <Compass className="text-amber-500 animate-spin-slow shrink-0" size={28} />
              <span className="truncate">{i18n.title}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs sm:text-sm leading-relaxed">
              {i18n.desc}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/50 text-xs font-semibold text-amber-800 dark:text-amber-300 shrink-0 self-start md:self-auto">
            <Globe size={16} className="text-amber-500 shrink-0" />
            <span>{i18n.traditionsBadge}</span>
          </div>
        </div>
        <div className="mt-2">
          <ToolInfoTooltip toolId="geomancy" />
        </div>
      </div>

      {/* Internal Scrollable Workspace */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      {/* Mode Selector & Generator controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            <Sliders size={16} className="text-amber-500" />
            <span>{i18n.generationModeLabel}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-full sm:w-auto">
            {[
              { id: 'auto', label: i18n.modeAuto, icon: Sparkles },
              { id: 'manual', label: i18n.modeManual, icon: Layers },
              { id: 'abjad', label: i18n.modeAbjad, icon: Calculator }
            ].map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setInputMode(m.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                    inputMode === m.id
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  <Icon size={13} className="shrink-0" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Inputs depending on mode */}
        {inputMode === 'manual' && (
          <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 space-y-2.5">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300">{i18n.manualPrompt}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {i18n.motherLabel} {idx + 1} ({langKey === 'ha' ? 'G' : langKey === 'en' ? 'H' : 'M'}{idx + 1})
                  </label>
                  <select
                    value={manualMothers[idx]}
                    onChange={(e) => {
                      const updated = [...manualMothers];
                      updated[idx] = e.target.value;
                      setManualMothers(updated);
                    }}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.keys(FIGURES_DATABASE).map(code => {
                      const fig = FIGURES_DATABASE[code];
                      return (
                        <option key={code} value={code}>
                          {fig.latin} ({fig.arabic.split(' ')[0]} - {fig.african.split(' / ')[0]})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {inputMode === 'abjad' && (
          <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-amber-500" />
                  {i18n.namePrompt}
                </label>
                <input
                  type="text"
                  placeholder={i18n.namePlaceholder}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <HeartHandshake size={13} className="text-amber-500" />
                  {i18n.motherNamePrompt}
                </label>
                <input
                  type="text"
                  placeholder={i18n.motherNamePlaceholder}
                  value={userMotherName}
                  onChange={(e) => setUserMotherName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={generateFigures}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01] text-xs sm:text-sm"
          >
            <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
            <span>{isGenerating ? i18n.generating : i18n.generate}</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      {figures.length > 0 && (
        <div className="flex items-center justify-start gap-1.5 overflow-x-auto pb-2.5 mb-5 no-scrollbar border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'chart', label: i18n.tabTheme, icon: Layers },
            { id: 'interpretation', label: i18n.tabDomain, icon: Target },
            { id: 'traditions', label: i18n.tabTraditions, icon: Globe },
            { id: 'elements', label: i18n.tabElements, icon: Flame },
            { id: 'secret', label: i18n.tabSecret, icon: Key },
            { id: 'dictionary', label: i18n.tabDictionary, icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 hover:border-amber-400'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 1: 16 Houses Chart & Interactive Grid */}
      {figures.length > 0 && activeTab === 'chart' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Validity Badge & PNG Export */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/30">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              {isMizanValid() ? (
                <>
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                  <span>{i18n.themeValidity}</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                  <span>{i18n.themeInvalidity}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 hidden sm:flex items-center gap-1">
                <Info size={13} />
                {i18n.clickHouse}
              </p>
              <button
                onClick={exportChartAsImage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>{i18n.exportPNG}</span>
              </button>
            </div>
          </div>

          {/* 16 Houses Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-2.5" dir="rtl">
            {figures.slice(0, 16).map((fig, i) => {
              const detail = getFigureDetail(fig);
              const isSelected = selectedHouse === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedHouse(i)}
                  className={`flex flex-col items-center p-2 bg-white dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 border transition-all rounded-xl text-right cursor-pointer shadow-xs relative overflow-hidden ${
                    isSelected
                      ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/90 dark:bg-amber-950/40'
                      : 'border-gray-200/80 dark:border-gray-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-0.5 h-4 text-center leading-tight flex items-center justify-center truncate w-full">
                    {i18n.houseNames[i].split(' : ')[0]}
                  </span>
                  <div className="my-1 h-11 flex items-center justify-center" dir="ltr">
                    {renderDots(fig, 'sm')}
                  </div>
                  <span className="text-[10px] font-bold text-gray-900 dark:text-white mt-0.5 truncate w-full text-center">{detail.latin}</span>
                  <span className="text-[9px] font-arabic text-amber-600 dark:text-amber-400 truncate w-full text-center" dir="rtl">{detail.arabic.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected House Deep Analysis Card */}
          {selectedHouse !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-500/40 space-y-3.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-gray-900 rounded-xl border border-amber-200 dark:border-gray-700 shrink-0" dir="ltr">
                    {renderDots(figures[selectedHouse], 'md')}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      {i18n.houseNames[selectedHouse]}
                    </span>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-0.5">
                      {getFigureDetail(figures[selectedHouse]).latin} — {getFigureDetail(figures[selectedHouse]).arabic}
                    </h3>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Sikidy : {getFigureDetail(figures[selectedHouse]).african} • Ramal : {getFigureDetail(figures[selectedHouse]).indian}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-lg shrink-0">
                  {getFigureDetail(figures[selectedHouse]).nature[langKey]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700/60 space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <BookOpen size={14} className="text-amber-500" />
                    {i18n.generalInterpretation}
                  </p>
                  <p className="leading-relaxed">{getFigureDetail(figures[selectedHouse]).meaning[langKey]}</p>
                </div>

                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-xs">
                    <ShieldCheck size={14} className="text-amber-500" />
                    {i18n.sikidyTitle}
                  </p>
                  <p className="leading-relaxed">{getFigureDetail(figures[selectedHouse]).africanMeaning[langKey]}</p>
                  <p className="font-semibold text-amber-800 dark:text-amber-300 mt-1 pt-1 border-t border-amber-200/40">
                    {i18n.charityLabel} {getFigureDetail(figures[selectedHouse]).africanSaraka[langKey]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Judge (M15) & Supreme (M16) Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 dark:from-amber-950/30 dark:via-gray-900 dark:to-orange-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/30">
            {/* Judge */}
            <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl shadow-xs border border-amber-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/40 px-2 py-0.5 rounded-md uppercase">
                    {i18n.judge}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {getFigureDetail(figures[14]).latin} ({getFigureDetail(figures[14]).arabic})
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-0.5">
                    {getFigureDetail(figures[14]).african}
                  </p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-gray-900 rounded-lg shrink-0" dir="ltr">
                  {renderDots(figures[14], 'sm')}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic">{i18n.judgeDesc}</p>
              <div className="text-xs text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2 leading-relaxed">
                {getFigureDetail(figures[14]).meaning[langKey]}
              </div>
            </div>

            {/* Supreme */}
            <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl shadow-xs border border-orange-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/40 px-2 py-0.5 rounded-md uppercase">
                    {i18n.supreme}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {getFigureDetail(figures[15]).latin} ({getFigureDetail(figures[15]).arabic})
                  </h4>
                  <p className="text-[11px] text-orange-700 dark:text-orange-300 font-semibold mt-0.5">
                    {getFigureDetail(figures[15]).african}
                  </p>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-gray-900 rounded-lg shrink-0" dir="ltr">
                  {renderDots(figures[15], 'sm')}
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic">{i18n.supremeDesc}</p>
              <div className="text-xs text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2 leading-relaxed">
                {getFigureDetail(figures[15]).meaning[langKey]}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Domaine, Passations & Directions Spatiales */}
      {figures.length > 0 && activeTab === 'interpretation' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 1. Domain Selector & Synthesis Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Target className="text-amber-500" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{i18n.domainAnalysisTitle}</h3>
              </div>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                {i18n.m1VsTarget}
              </span>
            </div>

            {/* Domains Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { house: 10, label: i18n.domainCareer, houseName: langKey === 'ha' ? 'G10' : langKey === 'en' ? 'H10' : 'M10' },
                { house: 2, label: i18n.domainFinances, houseName: langKey === 'ha' ? 'G2' : langKey === 'en' ? 'H2' : 'M2' },
                { house: 7, label: i18n.domainMarriage, houseName: langKey === 'ha' ? 'G7' : langKey === 'en' ? 'H7' : 'M7' },
                { house: 9, label: i18n.domainTravel, houseName: langKey === 'ha' ? 'G9' : langKey === 'en' ? 'H9' : 'M9' },
                { house: 6, label: i18n.domainHealth, houseName: langKey === 'ha' ? 'G6' : langKey === 'en' ? 'H6' : 'M6' },
                { house: 11, label: i18n.domainFriends, houseName: langKey === 'ha' ? 'G11' : langKey === 'en' ? 'H11' : 'M11' },
                { house: 4, label: i18n.domainHome, houseName: langKey === 'ha' ? 'G4' : langKey === 'en' ? 'H4' : 'M4' },
                { house: 12, label: i18n.domainObstacles, houseName: langKey === 'ha' ? 'G12' : langKey === 'en' ? 'H12' : 'M12' },
              ].map((d) => (
                <button
                  key={d.house}
                  onClick={() => setSelectedDomain(d.house)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer border ${
                    selectedDomain === d.house
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400'
                  }`}
                >
                  <span className="truncate">{d.label}</span>
                  <span className="text-[10px] opacity-80 shrink-0 ml-1">({d.houseName})</span>
                </button>
              ))}
            </div>

            {/* Synthesis Cards */}
            {figures.length >= 16 && (
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/50 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center" dir="ltr">
                  <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">{i18n.consultantLabel}</span>
                    <div className="my-1 flex justify-center">{renderDots(figures[0], 'sm')}</div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{getFigureDetail(figures[0]).latin}</p>
                    <p className="text-[10px] text-gray-500">{getFigureDetail(figures[0]).elementName[langKey]}</p>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-amber-400/80 shadow-xs">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">{i18n.targetLabel} ({langKey === 'ha' ? 'G' : langKey === 'en' ? 'H' : 'M'}{selectedDomain})</span>
                    <div className="my-1 flex justify-center">{renderDots(figures[selectedDomain - 1], 'sm')}</div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{getFigureDetail(figures[selectedDomain - 1]).latin}</p>
                    <p className="text-[10px] text-gray-500">{getFigureDetail(figures[selectedDomain - 1]).elementName[langKey]}</p>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">{i18n.judgeLabel}</span>
                    <div className="my-1 flex justify-center">{renderDots(figures[14], 'sm')}</div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{getFigureDetail(figures[14]).latin}</p>
                    <p className="text-[10px] text-gray-500">{getFigureDetail(figures[14]).elementName[langKey]}</p>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">{i18n.supremeLabel}</span>
                    <div className="my-1 flex justify-center">{renderDots(figures[15], 'sm')}</div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{getFigureDetail(figures[15]).latin}</p>
                    <p className="text-[10px] text-gray-500">{getFigureDetail(figures[15]).elementName[langKey]}</p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-200/40 text-xs space-y-1.5 text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    {i18n.diagnosticTitle} {selectedDomain} ({i18n.houseNames[selectedDomain - 1]})
                  </p>
                  <p>
                    {langKey === 'fr' && (
                      <>
                        L'énergie du Demandeur (<strong>{getFigureDetail(figures[0]).latin}</strong>) rencontre l'énergie du Domaine visé (<strong>{getFigureDetail(figures[selectedDomain - 1]).latin}</strong>).
                        L'interaction élémentaire <strong>{getFigureDetail(figures[0]).elementName[langKey]} &amp; {getFigureDetail(figures[selectedDomain - 1]).elementName[langKey]}</strong> indique une dynamique de progression sous le contrôle du Juge <strong>{getFigureDetail(figures[14]).latin}</strong>.
                      </>
                    )}
                    {langKey === 'en' && (
                      <>
                        The Applicant's energy (<strong>{getFigureDetail(figures[0]).latin}</strong>) meets the energy of the target Domain (<strong>{getFigureDetail(figures[selectedDomain - 1]).latin}</strong>).
                        The elemental interaction <strong>{getFigureDetail(figures[0]).elementName[langKey]} &amp; {getFigureDetail(figures[selectedDomain - 1]).elementName[langKey]}</strong> indicates a dynamic progression under the control of the Judge <strong>{getFigureDetail(figures[14]).latin}</strong>.
                      </>
                    )}
                    {langKey === 'ha' && (
                      <>
                        Karfin Mai Tambaya (<strong>{getFigureDetail(figures[0]).latin}</strong>) yana haɗuwa da karfin Bangaren da ake tambaya (<strong>{getFigureDetail(figures[selectedDomain - 1]).latin}</strong>).
                        Hadin sinadaran <strong>{getFigureDetail(figures[0]).elementName[langKey]} &amp; {getFigureDetail(figures[selectedDomain - 1]).elementName[langKey]}</strong> yana nuna ci gaba karkashin ikonsa na Alkali <strong>{getFigureDetail(figures[14]).latin}</strong>.
                      </>
                    )}
                  </p>
                  <p className="text-amber-800 dark:text-amber-300 font-semibold pt-1 border-t border-gray-100 dark:border-gray-700">
                    {i18n.recommendationLabel} {getFigureDetail(figures[selectedDomain - 1]).meaning[langKey]}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Passations & Repetitions (Intiqal) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <GitMerge className="text-amber-500" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{i18n.passationsTitle}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-300">{i18n.passationsSubtitle}</p>
              </div>
            </div>

            {getRepetitionsAndPassations().length === 0 ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl text-xs text-gray-500 text-center">
                {i18n.noPassations}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getRepetitionsAndPassations().map((p, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {p.detail.latin} ({p.detail.arabic})
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">
                        {i18n.housesBadge} {p.houses.map(h => `${langKey === 'ha' ? 'G' : langKey === 'en' ? 'H' : 'M'}${h}`).join(', ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{p.interpretation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Spatial Orientation & Lost Object Finder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Compass className="text-amber-500" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">{i18n.compassTitle}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-300">{i18n.compassSubtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                  <MapPin size={18} className="text-amber-500" />
                  <span>{i18n.dominantDirLabel} {getSpatialDirection().primary}</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getSpatialDirection().advice}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xs">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span>{i18n.secondaryDirLabel} {getSpatialDirection().secondary}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {getSpatialDirection().primaryObj.desc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Traditions Comparées */}
      {figures.length > 0 && activeTab === 'traditions' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Globe className="text-amber-500" size={18} />
              {i18n.multiTraditionTitle}
            </h3>
            <div className="space-y-3">
              {[0, 14, 15].map(houseIdx => {
                const detail = getFigureDetail(figures[houseIdx]);
                return (
                  <div key={houseIdx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700 pb-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {i18n.houseNames[houseIdx]}
                      </span>
                      <div className="flex items-center gap-2" dir="ltr">
                        {renderDots(figures[houseIdx], 'sm')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                      {/* Maghreb */}
                      <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-amber-200/50 space-y-0.5">
                        <span className="font-bold text-amber-700 dark:text-amber-300 block text-[11px]">{i18n.tradAraboMaghrebi}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{detail.arabic}</p>
                        <p className="text-gray-500 text-[11px]">{i18n.planetLabel} {detail.planet[langKey]}</p>
                        <p className="text-gray-500 text-[11px]">{i18n.zodiacLabel} {detail.zodiac[langKey]}</p>
                      </div>

                      {/* West Africa */}
                      <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200/50 space-y-0.5">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[11px]">{i18n.tradAfrican}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{detail.african}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-snug">{detail.africanMeaning[langKey]}</p>
                      </div>

                      {/* Indian Ramal */}
                      <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-purple-200/50 space-y-0.5">
                        <span className="font-bold text-purple-700 dark:text-purple-300 block text-[11px]">{i18n.tradIndian}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{detail.indian}</p>
                        <p className="text-gray-500 text-[11px]">Graha : {detail.indianGraha}</p>
                        <p className="text-gray-500 text-[11px]">Dosha : {detail.indianDosha}</p>
                      </div>

                      {/* European */}
                      <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-blue-200/50 space-y-0.5">
                        <span className="font-bold text-blue-700 dark:text-blue-300 block text-[11px]">{i18n.tradEuropean}</span>
                        <p className="font-bold text-gray-900 dark:text-white text-xs">{detail.latin}</p>
                        <p className="text-gray-500 text-[11px]">{i18n.elementLabel} {detail.elementName[langKey]}</p>
                        <p className="text-gray-500 text-[11px]">{detail.nature[langKey]}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Éléments & Astrologie */}
      {figures.length > 0 && activeTab === 'elements' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame className="text-amber-500" size={18} />
              {i18n.elementalBalance}
            </h3>

            {/* Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 text-center space-y-0.5">
                <Flame className="mx-auto text-red-500" size={20} />
                <span className="text-[11px] font-bold text-red-700 dark:text-red-300 block">{i18n.fireCount}</span>
                <span className="text-xl font-black text-red-900 dark:text-red-200">{elemStats.fire} / 16</span>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200/50 text-center space-y-0.5">
                <Wind className="mx-auto text-sky-500" size={20} />
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 block">{i18n.airCount}</span>
                <span className="text-xl font-black text-sky-900 dark:text-sky-200">{elemStats.air} / 16</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 text-center space-y-0.5">
                <Droplets className="mx-auto text-blue-500" size={20} />
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">{i18n.waterCount}</span>
                <span className="text-xl font-black text-blue-900 dark:text-blue-200">{elemStats.water} / 16</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 text-center space-y-0.5">
                <Mountain className="mx-auto text-amber-600" size={20} />
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">{i18n.earthCount}</span>
                <span className="text-xl font-black text-amber-950 dark:text-amber-200">{elemStats.earth} / 16</span>
              </div>
            </div>

            {/* Dominant Element Analysis */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 text-xs text-gray-800 dark:text-gray-200 leading-relaxed space-y-1.5">
              <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                {i18n.dominantElement} : <span className="uppercase font-extrabold text-amber-600">{elemStats.dominant}</span>
              </h4>
              {elemStats.dominant === 'fire' && (
                <p>
                  {langKey === 'fr' && "Dominance du Feu : Indique une énergie d'action zélée, de décision rapide, d'impulsion mais attention aux colères ou précipitations."}
                  {langKey === 'en' && "Fire Dominance: Indicates zeal for action, quick decision-making, drive, but beware of anger or haste."}
                  {langKey === 'ha' && "Mafi rinjayen Wuta: Yana nuna azama wajen aiki, yanke shawara cikin sauri, amma a kiyayi fushi ko hanzari marar amfani."}
                </p>
              )}
              {elemStats.dominant === 'air' && (
                <p>
                  {langKey === 'fr' && "Dominance de l'Air : Indique une prédominance des pensées, contrats, négociations, idées et communication sociale."}
                  {langKey === 'en' && "Air Dominance: Indicates a prevalence of thoughts, contracts, negotiations, ideas, and social communication."}
                  {langKey === 'ha' && "Mafi rinjayen Iska: Yana nuna rinjayen tunani, kwangiloli, tattaunawa, ra'ayoyi da tattaunawa tsakanin al'umma."}
                </p>
              )}
              {elemStats.dominant === 'water' && (
                <p>
                  {langKey === 'fr' && "Dominance de l'Eau : Indique des voyages, de la sensibilité émotionnelle, de la spiritualité et du mouvement fluide."}
                  {langKey === 'en' && "Water Dominance: Indicates travel, emotional sensitivity, spirituality, and fluid movement."}
                  {langKey === 'ha' && "Mafi rinjayen Ruwa: Yana nuna tafiye-tafiye, ji na zuciya, tsarkin ruhi da kuma tafiya cikin sauki."}
                </p>
              )}
              {elemStats.dominant === 'earth' && (
                <p>
                  {langKey === 'fr' && "Dominance de la Terre : Indique des considérations matérielles, financières, des possessions durables ou de la lenteur."}
                  {langKey === 'en' && "Earth Dominance: Indicates material or financial considerations, durable possessions, or steady patience."}
                  {langKey === 'ha' && "Mafi rinjayen Kasa: Yana nuna abubuwan duniya, kudi, dukiyar dindindin ko kuma jinkiri na hikima."}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Voie du Secret (Tariq al-Nogta) & Remèdes */}
      {figures.length > 0 && activeTab === 'secret' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="text-amber-500" size={18} />
                {i18n.secretPathTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{i18n.secretPathDesc}</p>
            </div>

            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">{i18n.headLineageLabel}</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {i18n.secretMothersLabel} <strong>{getSecretPathMothers().map(m => `${langKey === 'ha' ? 'Gida' : langKey === 'en' ? 'House' : 'Maison'} ${m}`).join(', ') || i18n.noneDirectly}</strong>
                </p>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-amber-300 shrink-0" dir="ltr">
                {renderDots(figures[14], 'sm')}
              </div>
            </div>

            {/* Recommended Saraka & Dhikr for Judge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 space-y-1.5">
                <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  {i18n.recommendedSaraka}
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getFigureDetail(figures[14]).africanSaraka[langKey]}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 space-y-1.5">
                <h4 className="font-bold text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-purple-500" />
                  {i18n.recommendedDhikr}
                </h4>
                <p className="text-xs font-extrabold text-purple-800 dark:text-purple-300">
                  {getFigureDetail(figures[14]).recommendedDhikr}
                </p>
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  {i18n.dhikrAdvice}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 5: Dictionary / Encyclopedia */}
      {activeTab === 'dictionary' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/80 dark:border-gray-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="text-amber-500" size={18} />
                {i18n.dictionaryTitle}
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder={i18n.searchPlaceholder}
                  value={dictionarySearch}
                  onChange={(e) => setDictionarySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(FIGURES_DATABASE)
                .filter(code => {
                  const fig = FIGURES_DATABASE[code];
                  const query = dictionarySearch.toLowerCase();
                  return (
                    fig.latin.toLowerCase().includes(query) ||
                    fig.arabic.toLowerCase().includes(query) ||
                    fig.african.toLowerCase().includes(query) ||
                    fig.indian.toLowerCase().includes(query)
                  );
                })
                .map(code => {
                  const fig = FIGURES_DATABASE[code];
                  const figArr = code.split('-').map(Number);
                  return (
                    <div key={code} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-700/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 shrink-0" dir="ltr">
                            {renderDots(figArr, 'sm')}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-gray-900 dark:text-white">{fig.latin} — {fig.arabic}</h4>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{fig.african}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-md">
                          {fig.elementName[langKey]}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {fig.meaning[langKey]}
                      </p>

                      <div className="pt-1.5 border-t border-gray-200/50 dark:border-gray-700 text-[10px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span> {i18n.planetLabel} {fig.planet[langKey]}</span>
                        <span> {i18n.zodiacLabel} {fig.zodiac[langKey]}</span>
                        <span> Ramal : {fig.indian}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default Geomancy;
