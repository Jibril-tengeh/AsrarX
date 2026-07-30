import React, { useState, useEffect, useRef } from 'react';
import { Moon, ArrowLeft, Star, Compass, Clock, Info, Search, Filter, Calendar, Sparkles, Copy, Check, Shield, Heart, Briefcase, Plane, Activity, Feather, RefreshCw, BookOpen, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { EXTRA_MANSIONS_DATA } from '../../../data/lunarMansionDetails';
import { toCanvas } from 'html-to-image';
import { downloadCanvasImage } from '../../../utils/downloadHelper';
import { ParchmentExporterModal } from '../../../components/ParchmentExporterModal';

interface Mansion {
  id: number;
  name: string;
  arabic: string;
  element: string;
  nature: string;
  desc: string;
  propitious: string[];
  unpropitious: string[];
}

const MANSIONS: Mansion[] = [
  { id: 1, name: "Al-Sharatain", arabic: "الشرطين", element: "Feu", nature: "Bénéfique", desc: "Les deux cornes du Bélier. Première demeure marquant le début du zodiaque lunaire. Favorable aux initiatives rapides, aux voyages et à l'acquisition de connaissances, mais déconseillée pour les engagements durables comme le mariage ou la fondation d'édifices.", propitious: ["Voyages", "Commerce", "Nouvelles rencontres"], unpropitious: ["Mariage", "Construction"] },
  { id: 2, name: "Al-Butayn", arabic: "البطين", element: "Terre", nature: "Mixte", desc: "Le ventre du Bélier. Demeure de nature modérée, souvent liée à la découverte de choses cachées, la plantation et l'ancrage. Elle n'est cependant pas favorable pour entreprendre des voyages sur l'eau.", propitious: ["Recherche de trésors", "Plantations", "Achats"], unpropitious: ["Voyages sur l'eau", "Vente"] },
  { id: 3, name: "Al-Thurayya", arabic: "الثريا", element: "Air", nature: "Très Bénéfique", desc: "Les Pléiades. Une des demeures les plus fastes et lumineuses. Elle est le siège de la chance, de l'amour, des bénédictions et de l'alchimie spirituelle. Hautement recommandée pour toute œuvre de rassemblement et d'affection.", propitious: ["Amour (Mahabba)", "Alchimie", "Bénédictions", "Acquisitions"], unpropitious: ["Opérations de séparation", "Conflits"] },
  { id: 4, name: "Al-Dabaran", arabic: "الدبران", element: "Terre", nature: "Maléfique", desc: "Le suiveur (Aldébaran). Astre rouge marquant l'œil du Taureau, porteur de discorde et de séparation. Cette demeure est redoutée pour le commerce et le mariage, et souvent utilisée dans les œuvres de destruction.", propitious: ["Destruction d'ennemis", "Séparation (Tafriq)"], unpropitious: ["Mariage", "Commerce", "Voyage", "Accords"] },
  { id: 5, name: "Al-Haq'a", arabic: "الهقعة", element: "Air", nature: "Mixte", desc: "La tache blanche. Associée à Orion, cette demeure favorise l'intellect, l'apprentissage des sciences occultes et la méditation. Elle requiert le calme et déconseille les conflits ouverts.", propitious: ["Études mystiques", "Méditation", "Compréhension"], unpropitious: ["Confrontations", "Guerres"] },
  { id: 6, name: "Al-Han'a", arabic: "الهنعة", element: "Feu", nature: "Bénéfique", desc: "La marque. Demeure faste pour approcher les puissants, formuler des requêtes et chasser. Elle apporte le succès dans les entreprises audacieuses mais n'est pas favorable aux prêts financiers.", propitious: ["Chasse", "Demandes aux rois", "Audace"], unpropitious: ["Prêts d'argent", "Dettes"] },
  { id: 7, name: "Al-Dhira", arabic: "الذراع", element: "Eau", nature: "Bénéfique", desc: "Le bras ou la patte avant. Demeure très positive liée à la croissance, la guérison et l'abondance. Elle est idéale pour semer, cultiver et s'engager dans des échanges commerciaux prospères.", propitious: ["Guérison", "Commerce", "Agriculture", "Nouvel emploi"], unpropitious: [] },
  { id: 8, name: "Al-Nathra", arabic: "النثرة", element: "Feu", nature: "Mixte", desc: "La crèche. Associée au Lion, elle apporte une énergie soudaine et brève. Utile pour des opérations magiques ou matérielles qui nécessitent une conclusion rapide, mais mauvaise pour les projets de longue haleine.", propitious: ["Opérations rapides", "Victoire soudaine"], unpropitious: ["Opérations à long terme", "Contrats durables"] },
  { id: 9, name: "Al-Tarf", arabic: "الطرف", element: "Terre", nature: "Maléfique", desc: "Le regard du Lion. Demeure de la colère et de la vengeance. Son influence est lourde et destructrice. Elle n'est employée que pour les malédictions ou pour se débarrasser d'un adversaire oppressif.", propitious: ["Malédictions justifiées", "Défense agressive"], unpropitious: ["Tout le reste", "Voyages", "Mariage"] },
  { id: 10, name: "Al-Jabha", arabic: "الجبهة", element: "Feu", nature: "Très Bénéfique", desc: "Le front du Lion (Régulus). Demeure royale par excellence. Elle confère charisme, élévation, respect et victoire éclatante. Excellente pour l'amour et pour briller en société.", propitious: ["Amour", "Réussite", "Charisme", "Renommée"], unpropitious: [] },
  { id: 11, name: "Al-Zubra", arabic: "الزبرة", element: "Terre", nature: "Bénéfique", desc: "La crinière du Lion. Demeure protectrice et acquisitive. Favorable à l'accumulation de richesses, à la protection de ses biens et à la consolidation de sa position matérielle ou sociale.", propitious: ["Acquisition de biens", "Succès", "Protection"], unpropitious: [] },
  { id: 12, name: "Al-Sarfah", arabic: "الصرفة", element: "Air", nature: "Mixte", desc: "Le changement céleste. Marque un tournant. Elle est propice pour renverser des situations bloquées, libérer les prisonniers et pour l'agriculture, mais dangereuse pour les voyages maritimes.", propitious: ["Libération de prisonniers", "Agriculture", "Changement"], unpropitious: ["Navigations", "Stabilité"] },
  { id: 13, name: "Al-Awwa", arabic: "العواء", element: "Terre", nature: "Bénéfique", desc: "Le hurleur (constellation de la Vierge). Demeure très favorable aux unions, aux mariages, aux associations commerciales fructueuses et à la réconciliation entre ennemis.", propitious: ["Mariage", "Accords commerciaux", "Réconciliation"], unpropitious: [] },
  { id: 14, name: "Al-Simak", arabic: "السماك", element: "Feu", nature: "Mixte", desc: "L'exalté (Spica). Étoile brillante apportant des énergies fluctuantes. Favorable aux opérations d'attraction amoureuse et aux voyages, mais défavorable pour le traitement des maladies qui pourraient s'aggraver.", propitious: ["Magie d'amour", "Voyage", "Déménagement"], unpropitious: ["Maladies", "Soins médicaux"] },
  { id: 15, name: "Al-Ghafr", arabic: "الغفر", element: "Terre", nature: "Très Bénéfique", desc: "La couverture. Une des meilleures demeures pour la spiritualité. Elle favorise le recueillement, l'exaucement des prières, la découverte de trésors enfouis et la réalisation de toutes les bonnes œuvres.", propitious: ["Toutes les bonnes œuvres", "Prières", "Trésors"], unpropitious: [] },
  { id: 16, name: "Al-Zubana", arabic: "الزبانا", element: "Air", nature: "Maléfique", desc: "Les pinces du Scorpion. Demeure de la séparation, de la discorde et de l'inimitié. Elle est redoutée et utilisée uniquement pour créer des conflits, séparer les alliés ou se venger.", propitious: ["Séparation", "Discorde", "Rupture"], unpropitious: ["Voyage", "Mariage", "Commerce"] },
  { id: 17, name: "Al-Iklil", arabic: "الإكليل", element: "Eau", nature: "Mixte", desc: "La couronne du Scorpion. Influence mitigée, propice aux constructions solides et à l'acquisition d'animaux, mais elle nécessite de la prudence dans les affaires sociales ou relationnelles.", propitious: ["Bâtir", "Acheter des animaux", "Fondations"], unpropitious: [] },
  { id: 18, name: "Al-Qalb", arabic: "القلب", element: "Feu", nature: "Maléfique", desc: "Le cœur du Scorpion (Antarès). Étoile de la guerre, de la violence et de la destruction. Son énergie est purement martiale. Totalement déconseillée pour l'amour, la paix ou les accords.", propitious: ["Destruction", "Guerre", "Domination"], unpropitious: ["Amour", "Paix", "Voyages"] },
  { id: 19, name: "Al-Shaulah", arabic: "الشولة", element: "Eau", nature: "Mixte", desc: "Le dard du Scorpion. Énergie vive et piquante, idéale pour chasser, traquer ou mener des opérations secrètes, mystiques et cachées. Demande une grande maîtrise.", propitious: ["Chasse", "Opérations secrètes", "Poursuites"], unpropitious: [] },
  { id: 20, name: "Al-Na'aim", arabic: "النعائم", element: "Feu", nature: "Bénéfique", desc: "Les autruches. Demeure d'ouverture et d'expansion. Favorable à tous les déplacements, aux voyages commerciaux lointains, et à la domestication ou l'achat de montures.", propitious: ["Voyages", "Commerce", "Chevaux et véhicules"], unpropitious: [] },
  { id: 21, name: "Al-Baldah", arabic: "البلدة", element: "Terre", nature: "Bénéfique", desc: "La ville ou le lieu désert. Demeure de construction et d'établissement. Très favorable pour fonder une maison, se marier, et récolter les fruits de son labeur.", propitious: ["Bâtir", "Mariage", "Récoltes", "Établissement"], unpropitious: [] },
  { id: 22, name: "Sa'd al-Dhabih", arabic: "سعد الذابح", element: "Feu", nature: "Maléfique", desc: "La chance du sacrificateur. Énergie de coupure et de perte. Souvent associée à la fuite, l'exil ou le sacrifice forcé. Elle contrecarre presque toute bonne action entreprise sous son influence.", propitious: ["Fuite", "Exil", "Séparation forced"], unpropitious: ["Toute bonne action", "Alliances"] },
  { id: 23, name: "Sa'd Bula", arabic: "سعد بلع", element: "Terre", nature: "Mixte", desc: "La chance de l'avalement. Demeure de consommation et de dissolution. Elle est étrangement favorable à la médecine (guérir en avalant le mal) et aux divorces (dissoudre l'union).", propitious: ["Divorce", "Médecine", "Traitements"], unpropitious: [] },
  { id: 24, name: "Sa'd al-Su'ud", arabic: "سعد السعود", element: "Air", nature: "Très Bénéfique", desc: "La chance des chances. La demeure la plus fortunée. Elle couronne de succès toutes les entreprises, apporte l'amour, favorise les mariages et confère des faveurs royales.", propitious: ["Amour", "Mariage", "Succès royal", "Élévation"], unpropitious: [] },
  { id: 25, name: "Sa'd al-Akhbiya", arabic: "سعد الأخبية", element: "Eau", nature: "Bénéfique", desc: "La chance des tentes. Demeure de la dissimulation et de la protection. Excellente pour concevoir des talismans protecteurs, assiéger une forteresse ou cacher ses intentions.", propitious: ["Assièger", "Magie protectrice", "Secrets"], unpropitious: [] },
  { id: 26, name: "Al-Fargh al-Muqaddam", arabic: "الفرغ المقدم", element: "Feu", nature: "Mixte", desc: "Le premier bec du seau. Demeure active favorisant le mouvement, le voyage, et les interventions médicales. Cependant, elle est néfaste pour sceller des unions comme le mariage.", propitious: ["Voyage", "Médecine", "Soins"], unpropitious: ["Mariage", "Stabilité"] },
  { id: 27, name: "Al-Fargh al-Mu'akkhar", arabic: "الفرغ المؤخر", element: "Eau", nature: "Bénéfique", desc: "Le second bec du seau. Demeure de flux financier. Propice au commerce, aux achats et aux investissements, mais elle déconseille fortement de contracter des emprunts.", propitious: ["Commerce", "Achats", "Gains"], unpropitious: ["Emprunts", "Dettes"] },
  { id: 28, name: "Rasha", arabic: "الرشا", element: "Eau", nature: "Bénéfique", desc: "Le ventre du poisson. Dernière demeure clôturant le cycle lunaire. Énergie de plénitude, extrêmement favorable pour finaliser des affaires et pour la magie de l'attraction.", propitious: ["Toutes les affaires", "Magie d'attraction", "Finalisation"], unpropitious: [] },
];

const MANSION_TRANSLATIONS: Record<string, Record<number, Partial<Mansion>>> = {
  fr: {
    1: { name: "Al-Sharatain", element: "Feu", nature: "Bénéfique" },
    2: { name: "Al-Butayn", element: "Terre", nature: "Mixte" },
    3: { name: "Al-Thurayya", element: "Air", nature: "Très Bénéfique" },
    4: { name: "Al-Dabaran", element: "Terre", nature: "Maléfique" },
    5: { name: "Al-Haq'a", element: "Air", nature: "Mixte" },
    6: { name: "Al-Han'a", element: "Feu", nature: "Bénéfique" },
    7: { name: "Al-Dhira", element: "Eau", nature: "Bénéfique" },
    8: { name: "Al-Nathra", element: "Feu", nature: "Mixte" },
    9: { name: "Al-Tarf", element: "Terre", nature: "Maléfique" },
    10: { name: "Al-Jabha", element: "Feu", nature: "Très Bénéfique" },
    11: { name: "Al-Zubra", element: "Terre", nature: "Bénéfique" },
    12: { name: "Al-Sarfah", element: "Air", nature: "Mixte" },
    13: { name: "Al-Awwa", element: "Terre", nature: "Bénéfique" },
    14: { name: "Al-Simak", element: "Feu", nature: "Mixte" },
    15: { name: "Al-Ghafr", element: "Terre", nature: "Très Bénéfique" },
    16: { name: "Al-Zubana", element: "Air", nature: "Maléfique" },
    17: { name: "Al-Iklil", element: "Eau", nature: "Mixte" },
    18: { name: "Al-Qalb", element: "Feu", nature: "Maléfique" },
    19: { name: "Al-Shaulah", element: "Eau", nature: "Mixte" },
    20: { name: "Al-Na'aim", element: "Feu", nature: "Bénéfique" },
    21: { name: "Al-Baldah", element: "Terre", nature: "Bénéfique" },
    22: { name: "Sa'd al-Dhabih", element: "Feu", nature: "Maléfique" },
    23: { name: "Sa'd Bula", element: "Terre", nature: "Mixte" },
    24: { name: "Sa'd al-Su'ud", element: "Air", nature: "Très Bénéfique" },
    25: { name: "Sa'd al-Akhbiya", element: "Eau", nature: "Bénéfique" },
    26: { name: "Al-Fargh al-Muqaddam", element: "Feu", nature: "Mixte" },
    27: { name: "Al-Fargh al-Mu'akkhar", element: "Eau", nature: "Bénéfique" },
    28: { name: "Rasha", element: "Eau", nature: "Bénéfique" }
  },
  en: {
    1: { name: "Al-Sharatain", element: "Fire", nature: "Beneficent" },
    2: { name: "Al-Butayn", element: "Earth", nature: "Mixed" },
    3: { name: "Al-Thurayya", element: "Air", nature: "Highly Beneficent" },
    4: { name: "Al-Dabaran", element: "Earth", nature: "Malefic" },
    5: { name: "Al-Haq'a", element: "Air", nature: "Mixed" },
    6: { name: "Al-Han'a", element: "Fire", nature: "Beneficent" },
    7: { name: "Al-Dhira", element: "Water", nature: "Beneficent" },
    8: { name: "Al-Nathra", element: "Fire", nature: "Mixed" },
    9: { name: "Al-Tarf", element: "Earth", nature: "Malefic" },
    10: { name: "Al-Jabha", element: "Fire", nature: "Highly Beneficent" },
    11: { name: "Al-Zubra", element: "Earth", nature: "Beneficent" },
    12: { name: "Al-Sarfah", element: "Air", nature: "Mixed" },
    13: { name: "Al-Awwa", element: "Earth", nature: "Beneficent" },
    14: { name: "Al-Simak", element: "Fire", nature: "Mixed" },
    15: { name: "Al-Ghafr", element: "Earth", nature: "Highly Beneficent" },
    16: { name: "Al-Zubana", element: "Air", nature: "Malefic" },
    17: { name: "Al-Iklil", element: "Water", nature: "Mixed" },
    18: { name: "Al-Qalb", element: "Fire", nature: "Malefic" },
    19: { name: "Al-Shaulah", element: "Water", nature: "Mixed" },
    20: { name: "Al-Na'aim", element: "Fire", nature: "Beneficent" },
    21: { name: "Al-Baldah", element: "Earth", nature: "Beneficent" },
    22: { name: "Sa'd al-Dhabih", element: "Fire", nature: "Malefic" },
    23: { name: "Sa'd Bula", element: "Earth", nature: "Mixed" },
    24: { name: "Sa'd al-Su'ud", element: "Air", nature: "Highly Beneficent" },
    25: { name: "Sa'd al-Akhbiya", element: "Water", nature: "Beneficent" },
    26: { name: "Al-Fargh al-Muqaddam", element: "Fire", nature: "Mixed" },
    27: { name: "Al-Fargh al-Mu'akkhar", element: "Water", nature: "Beneficent" },
    28: { name: "Rasha", element: "Water", nature: "Beneficent" }
  },
  ha: {
    1: { name: "Al-Sharatain", element: "Wuta", nature: "Mai albarka" },
    2: { name: "Al-Butayn", element: "Kasa", nature: "Gami" },
    3: { name: "Al-Thurayya", element: "Iska", nature: "Mai yawan gaske" },
    4: { name: "Al-Dabaran", element: "Kasa", nature: "Mara kyau" },
    5: { name: "Al-Haq'a", element: "Iska", nature: "Gami" },
    6: { name: "Al-Han'a", element: "Wuta", nature: "Mai albarka" },
    7: { name: "Al-Dhira", element: "Ruwa", nature: "Mai albarka" },
    8: { name: "Al-Nathra", element: "Wuta", nature: "Gami" },
    9: { name: "Al-Tarf", element: "Kasa", nature: "Mara kyau" },
    10: { name: "Al-Jabha", element: "Wuta", nature: "Mai yawan gaske" },
    11: { name: "Al-Zubra", element: "Kasa", nature: "Mai albarka" },
    12: { name: "Al-Sarfah", element: "Iska", nature: "Gami" },
    13: { name: "Al-Awwa", element: "Kasa", nature: "Mai albarka" },
    14: { name: "Al-Simak", element: "Wuta", nature: "Gami" },
    15: { name: "Al-Ghafr", element: "Kasa", nature: "Mai yawan gaske" },
    16: { name: "Al-Zubana", element: "Iska", nature: "Mara kyau" },
    17: { name: "Al-Iklil", element: "Ruwa", nature: "Gami" },
    18: { name: "Al-Qalb", element: "Wuta", nature: "Mara kyau" },
    19: { name: "Al-Shaulah", element: "Ruwa", nature: "Gami" },
    20: { name: "Al-Na'aim", element: "Wuta", nature: "Mai albarka" },
    21: { name: "Al-Baldah", element: "Kasa", nature: "Mai albarka" },
    22: { name: "Sa'd al-Dhabih", element: "Wuta", nature: "Mara kyau" },
    23: { name: "Sa'd Bula", element: "Kasa", nature: "Gami" },
    24: { name: "Sa'd al-Su'ud", element: "Iska", nature: "Mai yawan gaske" },
    25: { name: "Sa'd al-Akhbiya", element: "Ruwa", nature: "Mai albarka" },
    26: { name: "Al-Fargh al-Muqaddam", element: "Wuta", nature: "Gami" },
    27: { name: "Al-Fargh al-Mu'akkhar", element: "Ruwa", nature: "Mai albarka" },
    28: { name: "Rasha", element: "Ruwa", nature: "Mai albarka" }
  }
};

const UI_LABELS: Record<string, any> = {
  fr: {
    back: "Retour aux outils",
    title: "Les 28 Demeures de la Lune (Manazil al-Qamar)",
    subtitle: "Astronomie spirituelle, Sceaux mystiques & Influences angéliques",
    system: "Système Arabe",
    select: "Sélectionnez une Demeure",
    today: "Aujourd'hui",
    activeToday: "Demeure Actuelle (Aujourd'hui)",
    mansion: "Demeure",
    mansionTag: "Demeure Lunaire (Manzil al-Qamar)",
    nature: "Nature",
    element: "Élément",
    desc: "Description & Influences",
    propitious: "Actions Propices",
    unpropitious: "Actions Déconseillées",
    noneRecommended: "Aucune action spécifique recommandée",
    noRestriction: "Aucune restriction majeure",
    angel: "Ange Gardien / Khodam",
    asma: "Noms Divins (Asma al-Husna)",
    incense: "Encens & Bukhoor",
    sadaqah: "Aumône Recommandée (Sadaqah)",
    degree: "Coordonnées / Degrés Zodiaque",
    wird: "Wird & Dhikr du Manzil",
    searchPlaceholder: "Rechercher un manzil, mot-clé (ex: Amour, Voyage, Mariage...)...",
    filterNature: "Nature :",
    filterElem: "Élément :",
    all: "Tous",
    tabOverview: "28 Demeures",
    tabAdvisor: "Conseiller d'Actions",
    tabCalculator: "Calculateur de Lune",
    tabScroll: "Parchemin Mystique",
    advisorTitle: "Guide de Compatibilité d'Actions",
    advisorSub: "Trouvez les demeures lunaires idéales pour votre projet spirituel ou matériel",
    selectIntent: "Choisissez le type d'action que vous souhaitez entreprendre :",
    recMansions: "Demeures Fortement Recommandées",
    avoidMansions: "Demeures à Éviter",
    calcTitle: "Calculateur Lunaire & Astro-Horodatage",
    calcSub: "Calculez le Manzil lunaire exact pour n'importe quelle date",
    pickDate: "Sélectionnez une date :",
    calcBtn: "Calculer le Manzil",
    scrollTitle: "Générateur de Parchemin du Manzil",
    scrollSub: "Visualiser et exporter les symboles, invocations et serviteurs sous forme de parchemin sacré",
    copied: "Copié !",
    copyScroll: "Copier le texte",
    downloadParchment: "Télécharger le Parchemin (PNG)",
    downloading: "Génération...",
    exportParchmentModal: "Imprimer / PDF",
    love: "Amour & Mariage",
    business: "Commerce & Richesse",
    travel: "Voyages & Déplacements",
    healing: "Guérison & Santé",
    spiritual: "Travail Spirituel & Retraite",
    protection: "Protection & Défense"
  },
  en: {
    back: "Back to tools",
    title: "The 28 Lunar Mansions (Manazil al-Qamar)",
    subtitle: "Spiritual astronomy, Mystic seals & Angelic influences",
    system: "Arabic System",
    select: "Select a Mansion",
    today: "Today",
    activeToday: "Current Mansion (Today)",
    mansion: "Mansion",
    mansionTag: "Lunar Mansion (Manzil al-Qamar)",
    nature: "Nature",
    element: "Element",
    desc: "Description & Influences",
    propitious: "Propitious Actions",
    unpropitious: "Unpropitious Actions",
    noneRecommended: "No specific action recommended",
    noRestriction: "No major restrictions",
    angel: "Guardian Angel / Khodam",
    asma: "Divine Names (Asma al-Husna)",
    incense: "Incense & Bukhoor",
    sadaqah: "Recommended Charity (Sadaqah)",
    degree: "Zodiac Coordinates / Degrees",
    wird: "Wird & Dhikr of the Mansion",
    searchPlaceholder: "Search mansion, keyword (e.g. Love, Travel, Marriage...)...",
    filterNature: "Nature:",
    filterElem: "Element:",
    all: "All",
    tabOverview: "28 Mansions",
    tabAdvisor: "Action Advisor",
    tabCalculator: "Moon Calculator",
    tabScroll: "Mystic Scroll",
    advisorTitle: "Action Compatibility Advisor",
    advisorSub: "Find the optimal lunar mansions for your spiritual or worldly project",
    selectIntent: "Select the type of action you wish to undertake:",
    recMansions: "Highly Recommended Mansions",
    avoidMansions: "Mansions to Avoid",
    calcTitle: "Lunar Calculator & Astro-Timestamp",
    calcSub: "Calculate the exact lunar Manzil for any date",
    pickDate: "Select a date:",
    calcBtn: "Calculate Manzil",
    scrollTitle: "Mansion Parchment Generator",
    scrollSub: "Export symbols, invocations and guardians as an ancient scroll",
    copied: "Copied!",
    copyScroll: "Copy text",
    downloadParchment: "Download Parchment (PNG)",
    downloading: "Generating...",
    exportParchmentModal: "Print / PDF",
    love: "Love & Marriage",
    business: "Commerce & Wealth",
    travel: "Travel & Journeys",
    healing: "Healing & Health",
    spiritual: "Spiritual Work & Retreat",
    protection: "Protection & Defense"
  },
  ha: {
    back: "Koma ga kayan aiki",
    title: "Gidaje 28 na Wata (Manazil al-Qamar)",
    subtitle: "Ilimin Taurari, Hatimin Asiri da Mala'iku",
    system: "Tsarin Larabawa",
    select: "Zaɓi Gida",
    today: "Yau",
    activeToday: "Gidan Yanzu (Yau)",
    mansion: "Gida",
    mansionTag: "Gidan Wata (Manazil al-Qamar)",
    nature: "Dabi'a",
    element: "Hali",
    desc: "Bayanin Gida da Tasiri",
    propitious: "Ayyukan Da Suke Da Kyau",
    unpropitious: "Ayyukan Da Suke Da Muni",
    noneRecommended: "Babu wani aiki na musamman",
    noRestriction: "Babu wani babban hani",
    angel: "Mala'ikan Gida / Khodam",
    asma: "Sunayen Allah (Asma al-Husna)",
    incense: "Turare da Bukhoor",
    sadaqah: "Sadaka da Ake So",
    degree: "Rukunin Taurari / Digiri",
    wird: "Wirdin Gida da Addu'a",
    searchPlaceholder: "Bincika gida, kalma (misali: Soyayya, Tafiya, Aure...)...",
    filterNature: "Dabi'a:",
    filterElem: "Hali:",
    all: "Duka",
    tabOverview: "Gidaje 28",
    tabAdvisor: "Mai Bada Shawara",
    tabCalculator: "Lissafin Wata",
    tabScroll: "Takardar Asiri",
    advisorTitle: "Mai Bada Shawa'ar Ayyuka",
    advisorSub: "Nemi gidajen wata mafi dacewa don aikin ka",
    selectIntent: "Zaɓi irin aikin da kake son yi:",
    recMansions: "Gidajen Da Aka Fi Shawarta",
    avoidMansions: "Gidajen Da Zaka Kauce",
    calcTitle: "Kwatandon Wata da Lokaci",
    calcSub: "Lissafa ainihin gidan wata don kowace rana",
    pickDate: "Zaɓi rana:",
    calcBtn: "Lissafa Gidan Wata",
    scrollTitle: "Wurin Fitar Da Takardar Asiri",
    scrollSub: "Fitar da alamomin asiri da addu'o'i a matsayin tsohuwar takarda",
    copied: "An kofa!",
    copyScroll: "Kwandaf rubutu",
    downloadParchment: "Sauke Takardar (PNG)",
    downloading: "Ana saukewa...",
    exportParchmentModal: "Buga / PDF",
    love: "Soyayya da Aure",
    business: "Kasuwanci da Dukiya",
    travel: "Tafiri da Hijira",
    healing: "Waraka da Lafiya",
    spiritual: "Aikin Ruhaniya da Khalwa",
    protection: "Kariya da Tsaro"
  }
};

export const LunarMansions: React.FC = () => {
  const { language, t } = useLanguage();
  const currentLang = (language === 'ha' || language === 'en' || language === 'fr') ? language : 'fr';
  const labels = UI_LABELS[currentLang] || UI_LABELS['fr'];

  const [activeTab, setActiveTab] = useState<'overview' | 'advisor' | 'calculator' | 'scroll'>('overview');
  const [todayMansion, setTodayMansion] = useState<Mansion | null>(null);
  const [currentMansion, setCurrentMansion] = useState<Mansion | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [natureFilter, setNatureFilter] = useState('all');
  const [elementFilter, setElementFilter] = useState('all');

  // Advisor State
  const [selectedIntent, setSelectedIntent] = useState<'love' | 'business' | 'travel' | 'healing' | 'spiritual' | 'protection'>('love');

  // Calculator state
  const [calcDate, setCalcDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calcResultMansion, setCalcResultMansion] = useState<Mansion | null>(null);

  // Copy & Export state
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExporterModal, setShowExporterModal] = useState(false);
  const parchmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate current mansion based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const mansionIndex = dayOfYear % 28;
    setTodayMansion(MANSIONS[mansionIndex]);
    setCurrentMansion(MANSIONS[mansionIndex]);
    setCalcResultMansion(MANSIONS[mansionIndex]);
  }, []);

  const getLocalizedMansion = (m: Mansion) => {
    const translation = MANSION_TRANSLATIONS[currentLang]?.[m.id];
    return {
      ...m,
      ...translation
    };
  };

  const getExtraData = (mansionId: number) => {
    return EXTRA_MANSIONS_DATA[mansionId] || EXTRA_MANSIONS_DATA[1];
  };

  const getLocalizedDegree = (degStr: string, lang: string): string => {
    if (!degStr) return '';
    if (lang === 'en') {
      return degStr
        .replace(/Bélier \/ Aries/g, 'Aries')
        .replace(/Taureau \/ Taurus/g, 'Taurus')
        .replace(/Gémeaux \/ Gemini/g, 'Gemini')
        .replace(/Cancer/g, 'Cancer')
        .replace(/Lion/g, 'Leo')
        .replace(/Vierge/g, 'Virgo')
        .replace(/Balance \/ Libra/g, 'Libra')
        .replace(/Scorpion/g, 'Scorpio')
        .replace(/Sagittaire \/ Sagittarius/g, 'Sagittarius')
        .replace(/Capricorne \/ Capricorn/g, 'Capricorn')
        .replace(/Verseau \/ Aquarius/g, 'Aquarius')
        .replace(/Poissons \/ Pisces/g, 'Pisces');
    }
    return degStr.replace(/ \/ [A-Za-z]+/g, '').trim();
  };

  const handleDownloadParchmentImage = async () => {
    if (!parchmentRef.current || !activeMansion) return;
    setIsDownloading(true);
    try {
      const el = parchmentRef.current;
      const width = el.scrollWidth || el.offsetWidth || 600;
      const height = el.scrollHeight || el.offsetHeight || 800;

      const canvas = await toCanvas(el, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
        width: width,
        height: height,
        style: {
          transform: 'none',
          margin: '0',
          maxHeight: 'none',
          maxWidth: 'none',
          height: `${height}px`,
          width: `${width}px`,
          overflow: 'visible',
        },
        backgroundColor: '#fbf6e9',
      });
      const cleanTitle = activeMansion.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      await downloadCanvasImage(canvas, `parchemin_manzil_${activeMansion.id}_${cleanTitle}.png`);
    } catch (err) {
      console.error('Error downloading parchment image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const activeMansion = currentMansion ? getLocalizedMansion(currentMansion) : null;
  const activeTodayMansion = todayMansion ? getLocalizedMansion(todayMansion) : null;

  // Filter mansions
  const filteredMansions = MANSIONS.filter(m => {
    const locM = getLocalizedMansion(m);
    const matchesSearch = !searchQuery || 
      locM.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      locM.arabic.includes(searchQuery) ||
      locM.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locM.propitious.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesNature = natureFilter === 'all' || 
      (natureFilter === 'beneficent' && (locM.nature.includes('Bénéfique') || locM.nature.includes('Beneficent') || locM.nature.includes('albarka') || locM.nature.includes('gaske'))) ||
      (natureFilter === 'mixed' && (locM.nature.includes('Mixte') || locM.nature.includes('Mixed') || locM.nature.includes('Gami'))) ||
      (natureFilter === 'malefic' && (locM.nature.includes('Maléfique') || locM.nature.includes('Malefic') || locM.nature.includes('muni') || locM.nature.includes('kyau')));

    const matchesElement = elementFilter === 'all' || 
      (elementFilter === 'fire' && (locM.element === 'Feu' || locM.element === 'Fire' || locM.element === 'Wuta')) ||
      (elementFilter === 'earth' && (locM.element === 'Terre' || locM.element === 'Earth' || locM.element === 'Kasa')) ||
      (elementFilter === 'air' && (locM.element === 'Air' || locM.element === 'Iska')) ||
      (elementFilter === 'water' && (locM.element === 'Eau' || locM.element === 'Water' || locM.element === 'Ruwa'));

    return matchesSearch && matchesNature && matchesElement;
  });

  // Calculate Mansion for custom date
  const handleCalculateDate = () => {
    if (!calcDate) return;
    const dateObj = new Date(calcDate);
    const start = new Date(dateObj.getFullYear(), 0, 0);
    const diff = (dateObj.getTime() - start.getTime()) + ((start.getTimezoneOffset() - dateObj.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const mansionIndex = dayOfYear % 28;
    setCalcResultMansion(MANSIONS[mansionIndex]);
  };

  // Get Advisor Recommendations
  const getAdvisorRecommendations = () => {
    switch (selectedIntent) {
      case 'love':
        return {
          rec: [3, 10, 13, 24],
          avoid: [4, 9, 16, 18, 22]
        };
      case 'business':
        return {
          rec: [1, 7, 11, 20, 27],
          avoid: [4, 16, 22]
        };
      case 'travel':
        return {
          rec: [1, 14, 20, 26],
          avoid: [2, 9, 12, 16, 18]
        };
      case 'healing':
        return {
          rec: [7, 23],
          avoid: [14]
        };
      case 'spiritual':
        return {
          rec: [3, 5, 10, 15, 24, 28],
          avoid: [9, 18]
        };
      case 'protection':
        return {
          rec: [11, 19, 25],
          avoid: [4, 18, 22]
        };
    }
  };

  const handleCopyScrollText = () => {
    if (!activeMansion) return;
    const extra = getExtraData(activeMansion.id);
    const angelName = currentLang === 'ha' ? extra.angelHa : currentLang === 'en' ? extra.angelEn : extra.angelFr;
    const asmaName = currentLang === 'ha' ? extra.asmaHa : currentLang === 'en' ? extra.asmaEn : extra.asmaFr;
    const incenseName = currentLang === 'ha' ? extra.incenseHa : currentLang === 'en' ? extra.incenseEn : extra.incenseFr;
    const sadaqahName = currentLang === 'ha' ? extra.sadaqahHa : currentLang === 'en' ? extra.sadaqahEn : extra.sadaqahFr;
    const wirdName = currentLang === 'ha' ? extra.wirdNameHa : currentLang === 'en' ? extra.wirdNameEn : extra.wirdNameFr;

    const text = `📜 ${labels.scrollTitle} - ${activeMansion.name} (${activeMansion.arabic})\n\n` +
      `📌 ${labels.mansion} #${activeMansion.id} | ${extra.degree}\n` +
      `✨ ${labels.nature}: ${activeMansion.nature} | ${labels.element}: ${activeMansion.element}\n\n` +
      `👼 ${labels.angel}: ${angelName} (${extra.angelAr})\n` +
      `📿 ${labels.asma}: ${asmaName} (${extra.asmaAr})\n` +
      `🪵 ${labels.incense}: ${incenseName}\n` +
      `🤝 ${labels.sadaqah}: ${sadaqahName}\n\n` +
      `📖 ${labels.wird}:\n"${extra.wirdAr}" (${extra.wirdCount}x) - ${wirdName}\n\n` +
      `📖 ${labels.desc}:\n${activeMansion.desc}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 safe-area-pt pb-24 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <Link to="/tools" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium mb-3 transition-colors text-sm">
          <ArrowLeft size={18} className="mr-2" />
          {labels.back}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Moon className="text-indigo-500 shrink-0" size={28} />
              <span className="break-words">{labels.title}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-300 mt-1 text-xs sm:text-base">{labels.subtitle}</p>
          </div>

          <span className="self-start sm:self-auto bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
            <Sparkles size={14} />
            {labels.system}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-gray-200 dark:border-gray-800 scrollbar-none max-w-full">
        {[
          { id: 'overview', label: labels.tabOverview, icon: Moon },
          { id: 'advisor', label: labels.tabAdvisor, icon: Compass },
          { id: 'calculator', label: labels.tabCalculator, icon: Calendar },
          { id: 'scroll', label: labels.tabScroll, icon: Feather }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & MANSION CARDS */}
      {activeTab === 'overview' && (
        <>
          {/* Active / Selected Mansion Detailed Card */}
          {activeMansion && (
            <div className="mb-8 w-full max-w-full overflow-hidden">
              <motion.div
                key={activeMansion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl text-white relative overflow-hidden border border-indigo-700/40 w-full"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block pointer-events-none">
                  <Compass size={220} className="animate-[spin_90s_linear_infinite] text-indigo-300" />
                </div>

                <div className="relative z-10 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-indigo-300 font-medium mb-3 text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Clock size={16} />
                      {activeMansion.id === activeTodayMansion?.id ? labels.activeToday : `${labels.mansion} #${activeMansion.id}`}
                    </span>
                    <span className="text-indigo-300 text-[11px] sm:text-xs bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800 break-words max-w-full">
                      {getExtraData(activeMansion.id).degree}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 min-w-0">
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 break-words tracking-tight">{activeMansion.name}</h2>
                      <p className="text-xl sm:text-3xl font-arabic text-amber-800 dark:text-amber-300 mt-1 break-words" dir="rtl">{activeMansion.arabic}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                        activeMansion.nature.includes('Bénéfique') || activeMansion.nature.includes('Beneficent') || activeMansion.nature.includes('albarka') || activeMansion.nature.includes('gaske')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                        activeMansion.nature.includes('Maléfique') || activeMansion.nature.includes('Malefic') || activeMansion.nature.includes('muni') || activeMansion.nature.includes('kyau')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 
                        'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                      }`}>
                        {labels.nature}: {activeMansion.nature}
                      </span>
                      <span className="bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold text-indigo-200 border border-white/10">
                        {labels.element}: {activeMansion.element}
                      </span>
                    </div>
                  </div>

                  {/* Spiritual Correspondences (Angel, Asma, Incense, Sadaqah) */}
                  {(() => {
                    const extra = getExtraData(activeMansion.id);
                    const angelName = currentLang === 'ha' ? extra.angelHa : currentLang === 'en' ? extra.angelEn : extra.angelFr;
                    const asmaName = currentLang === 'ha' ? extra.asmaHa : currentLang === 'en' ? extra.asmaEn : extra.asmaFr;
                    const incenseName = currentLang === 'ha' ? extra.incenseHa : currentLang === 'en' ? extra.incenseEn : extra.incenseFr;
                    const sadaqahName = currentLang === 'ha' ? extra.sadaqahHa : currentLang === 'en' ? extra.sadaqahEn : extra.sadaqahFr;
                    const wirdName = currentLang === 'ha' ? extra.wirdNameHa : currentLang === 'en' ? extra.wirdNameEn : extra.wirdNameFr;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
                        <div className="bg-indigo-950/60 rounded-xl p-3 sm:p-3.5 border border-indigo-800/60 min-w-0 break-words">
                          <span className="text-[11px] text-indigo-300 font-semibold block mb-0.5">{labels.angel}</span>
                          <span className="text-xs sm:text-sm font-bold text-white block break-words">{angelName}</span>
                          <span className="text-xs font-arabic text-amber-800 dark:text-amber-300 block break-words">{extra.angelAr}</span>
                        </div>
                        <div className="bg-indigo-950/60 rounded-xl p-3 sm:p-3.5 border border-indigo-800/60 min-w-0 break-words">
                          <span className="text-[11px] text-indigo-300 font-semibold block mb-0.5">{labels.asma}</span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-300 block break-words">{asmaName}</span>
                          <span className="text-xs font-arabic text-amber-800 dark:text-amber-300 block break-words">{extra.asmaAr}</span>
                        </div>
                        <div className="bg-indigo-950/60 rounded-xl p-3 sm:p-3.5 border border-indigo-800/60 min-w-0 break-words">
                          <span className="text-[11px] text-indigo-300 font-semibold block mb-0.5">{labels.incense}</span>
                          <span className="text-xs font-bold text-amber-800 dark:text-amber-200 block break-words">{incenseName}</span>
                        </div>
                        <div className="bg-indigo-950/60 rounded-xl p-3 sm:p-3.5 border border-indigo-800/60 min-w-0 break-words">
                          <span className="text-[11px] text-indigo-300 font-semibold block mb-0.5">{labels.sadaqah}</span>
                          <span className="text-xs font-bold text-indigo-200 block break-words">{sadaqahName}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Mansion Description */}
                  <div className="bg-indigo-950/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 border border-indigo-800/50 backdrop-blur-sm min-w-0">
                    <h3 className="text-indigo-200 font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Info size={18} className="text-indigo-400 shrink-0" /> {labels.desc}
                    </h3>
                    <p className="text-indigo-50 leading-relaxed text-xs sm:text-base break-words">
                      {activeMansion.desc}
                    </p>
                  </div>

                  {/* Recommended Dhikr / Wird for this mansion */}
                  {(() => {
                    const extra = getExtraData(activeMansion.id);
                    const wirdName = currentLang === 'ha' ? extra.wirdNameHa : currentLang === 'en' ? extra.wirdNameEn : extra.wirdNameFr;
                    return (
                      <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/60 to-emerald-950/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 border border-amber-500/30 min-w-0">
                        <div className="flex justify-between items-center gap-2 mb-2">
                          <h3 className="text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-base flex items-center gap-2">
                            <BookOpen size={18} className="text-amber-700 dark:text-amber-400 shrink-0" /> {labels.wird}
                          </h3>
                          <span className="bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-500/30 shrink-0">
                            {extra.wirdCount}x
                          </span>
                        </div>
                        <p className="text-lg sm:text-2xl font-arabic text-amber-800 dark:text-amber-200 text-center my-3 leading-loose break-words" dir="rtl">
                          {extra.wirdAr}
                        </p>
                        <p className="text-xs sm:text-sm text-indigo-200 text-center italic break-words">
                          {wirdName}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Propitious vs Unpropitious */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-indigo-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-indigo-800/80 min-w-0">
                      <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Star size={18} className="shrink-0" /> {labels.propitious}
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {activeMansion.propitious.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-indigo-100 break-words">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {item}
                          </li>
                        ))}
                        {activeMansion.propitious.length === 0 && <li className="text-indigo-300/50 italic">{labels.noneRecommended}</li>}
                      </ul>
                    </div>

                    <div className="bg-indigo-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-indigo-800/80 min-w-0">
                      <h3 className="text-rose-400 font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <Star size={18} className="shrink-0" /> {labels.unpropitious}
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {activeMansion.unpropitious.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-indigo-100 break-words">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            {item}
                          </li>
                        ))}
                        {activeMansion.unpropitious.length === 0 && <li className="text-indigo-300/50 italic">{labels.noRestriction}</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Filters & Search Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-full">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 min-w-0">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={labels.searchPlaceholder}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 text-xs max-w-full min-w-0">
                  <span className="text-gray-500 dark:text-gray-300 font-semibold shrink-0">{labels.filterNature}</span>
                  <select
                    value={natureFilter}
                    onChange={(e) => setNatureFilter(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none max-w-[140px] sm:max-w-none truncate"
                  >
                    <option value="all">{labels.all}</option>
                    <option value="beneficent">Bénéfique / Fortunate</option>
                    <option value="mixed">Mixte / Mixed</option>
                    <option value="malefic">Maléfique / Malefic</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs max-w-full min-w-0">
                  <span className="text-gray-500 dark:text-gray-300 font-semibold shrink-0">{labels.filterElem}</span>
                  <select
                    value={elementFilter}
                    onChange={(e) => setElementFilter(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none max-w-[130px] sm:max-w-none truncate"
                  >
                    <option value="all">{labels.all}</option>
                    <option value="fire">Feu / Fire / Wuta</option>
                    <option value="earth">Terre / Earth / Kasa</option>
                    <option value="air">Air / Iska</option>
                    <option value="water">Eau / Water / Ruwa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 28 Mansions Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-w-full">
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{labels.select}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-300 font-bold">
                {filteredMansions.length} / 28
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-700 w-full min-w-0">
              {filteredMansions.map((mansion) => {
                const locM = getLocalizedMansion(mansion);
                const isToday = locM.id === activeTodayMansion?.id;
                const isCurrent = activeMansion?.id === locM.id;
                return (
                  <button 
                    key={locM.id} 
                    onClick={() => {
                      setCurrentMansion(mansion);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-3.5 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800 cursor-pointer w-full min-w-0 overflow-hidden ${
                      isCurrent ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2 min-w-0">
                      <span className={`text-[10px] sm:text-xs font-bold shrink-0 ${
                        isToday ? 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {isToday ? labels.today : `#${locM.id}`}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 truncate max-w-[120px] sm:max-w-none ${
                        locM.nature.includes('Bénéfique') || locM.nature.includes('Beneficent') || locM.nature.includes('albarka') || locM.nature.includes('gaske')
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        locM.nature.includes('Maléfique') || locM.nature.includes('Malefic') || locM.nature.includes('muni') || locM.nature.includes('kyau')
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>{locM.nature}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-words min-w-0">{locM.name}</h3>
                    <p className="text-base sm:text-xl font-arabic text-gray-500 dark:text-gray-300 text-right mt-1 break-words min-w-0" dir="rtl">{locM.arabic}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: ACTION COMPATIBILITY ADVISOR */}
      {activeTab === 'advisor' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-full overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Compass className="text-indigo-500 shrink-0" size={24} />
              <span className="break-words">{labels.advisorTitle}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm mt-1 break-words">{labels.advisorSub}</p>
          </div>

          <div className="mb-6 max-w-full">
            <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{labels.selectIntent}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 min-w-0">
              {[
                { id: 'love', label: labels.love, icon: Heart, color: 'text-rose-500' },
                { id: 'business', label: labels.business, icon: Briefcase, color: 'text-emerald-500' },
                { id: 'travel', label: labels.travel, icon: Plane, color: 'text-blue-500' },
                { id: 'healing', label: labels.healing, icon: Activity, color: 'text-teal-500' },
                { id: 'spiritual', label: labels.spiritual, icon: Sparkles, color: 'text-amber-500' },
                { id: 'protection', label: labels.protection, icon: Shield, color: 'text-indigo-500' }
              ].map(item => {
                const Icon = item.icon;
                const isSel = selectedIntent === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIntent(item.id as any)}
                    className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer min-w-0 ${
                      isSel
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} className={`${item.color} shrink-0`} />
                    <span className="text-[11px] sm:text-xs font-bold leading-tight break-words">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          {(() => {
            const advisor = getAdvisorRecommendations();
            if (!advisor) return null;
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-full">
                {/* Recommended */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3.5 sm:p-5 min-w-0">
                  <h3 className="text-emerald-800 dark:text-emerald-300 font-bold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                    <Check size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="break-words">{labels.recMansions}</span>
                  </h3>
                  <div className="space-y-3">
                    {advisor.rec.map(mId => {
                      const m = MANSIONS.find(item => item.id === mId);
                      if (!m) return null;
                      const locM = getLocalizedMansion(m);
                      const extra = getExtraData(m.id);
                      return (
                        <div 
                          key={m.id}
                          onClick={() => {
                            setCurrentMansion(m);
                            setActiveTab('overview');
                          }}
                          className="bg-white dark:bg-gray-800 p-3 sm:p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-800/40 shadow-sm hover:border-emerald-400 transition-all cursor-pointer min-w-0"
                        >
                          <div className="flex justify-between items-center gap-2 mb-1 min-w-0">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 break-words min-w-0">#{locM.id} {locM.name}</span>
                            <span className="text-sm font-arabic text-amber-500 shrink-0" dir="rtl">{locM.arabic}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 break-words">{locM.desc}</p>
                          <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 break-words">
                            <Sparkles size={12} className="shrink-0" /> {extra.asmaFr}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Avoid */}
                <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-3.5 sm:p-5 min-w-0">
                  <h3 className="text-rose-800 dark:text-rose-300 font-bold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-rose-600 dark:text-rose-400 shrink-0" />
                    <span className="break-words">{labels.avoidMansions}</span>
                  </h3>
                  <div className="space-y-3">
                    {advisor.avoid.map(mId => {
                      const m = MANSIONS.find(item => item.id === mId);
                      if (!m) return null;
                      const locM = getLocalizedMansion(m);
                      return (
                        <div 
                          key={m.id}
                          onClick={() => {
                            setCurrentMansion(m);
                            setActiveTab('overview');
                          }}
                          className="bg-white dark:bg-gray-800 p-3 sm:p-3.5 rounded-xl border border-rose-100 dark:border-rose-800/40 shadow-sm hover:border-rose-400 transition-all cursor-pointer min-w-0"
                        >
                          <div className="flex justify-between items-center gap-2 mb-1 min-w-0">
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 break-words min-w-0">#{locM.id} {locM.name}</span>
                            <span className="text-sm font-arabic text-gray-500 shrink-0" dir="rtl">{locM.arabic}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 break-words">{locM.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: MOON & DATE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-full overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-indigo-500 shrink-0" size={24} />
              <span className="break-words">{labels.calcTitle}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm mt-1 break-words">{labels.calcSub}</p>
          </div>

          <div className="max-w-md bg-gray-50 dark:bg-gray-900 p-3.5 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{labels.pickDate}</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={calcDate}
                onChange={(e) => setCalcDate(e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
              />
              <button
                onClick={handleCalculateDate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw size={14} />
                {labels.calcBtn}
              </button>
            </div>
          </div>

          {calcResultMansion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-950 text-white rounded-2xl p-4 sm:p-6 border border-indigo-800 max-w-full overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-indigo-400 block mb-1">
                    {labels.mansion} #{calcResultMansion.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white break-words">{calcResultMansion.name}</h3>
                  <p className="text-lg sm:text-xl font-arabic text-amber-800 dark:text-amber-300 mt-1 break-words" dir="rtl">{calcResultMansion.arabic}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentMansion(calcResultMansion);
                    setActiveTab('overview');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Voir les Détails
                </button>
              </div>

              <div className="bg-indigo-900/50 p-3.5 sm:p-4 rounded-xl border border-indigo-800 mb-4 text-xs sm:text-sm text-indigo-100 break-words">
                {getLocalizedMansion(calcResultMansion).desc}
              </div>

              {(() => {
                const extra = getExtraData(calcResultMansion.id);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-800/40 min-w-0">
                      <span className="text-indigo-400 block font-semibold">{labels.degree}</span>
                      <span className="font-bold text-white block mt-0.5 break-words">{extra.degree}</span>
                    </div>
                    <div className="bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-800/40 min-w-0">
                      <span className="text-indigo-400 block font-semibold">{labels.angel}</span>
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mt-0.5 break-words">{extra.angelFr} ({extra.angelAr})</span>
                    </div>
                    <div className="bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-800/40 min-w-0">
                      <span className="text-indigo-400 block font-semibold">{labels.asma}</span>
                      <span className="font-bold text-emerald-300 block mt-0.5 break-words">{extra.asmaFr}</span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 4: MYSTICAL PARCHMENT GENERATOR */}
      {activeTab === 'scroll' && activeMansion && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Feather className="text-amber-500 shrink-0" size={24} />
                <span className="break-words">{labels.scrollTitle}</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-xs sm:text-sm mt-1 break-words">{labels.scrollSub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyScrollText}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedText ? <Check size={15} /> : <Copy size={15} />}
                {copiedText ? labels.copied : labels.copyScroll}
              </button>

              <button
                onClick={handleDownloadParchmentImage}
                disabled={isDownloading}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Download size={15} />
                {isDownloading ? labels.downloading : labels.downloadParchment}
              </button>

              <button
                onClick={() => setShowExporterModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Printer size={15} />
                {labels.exportParchmentModal}
              </button>
            </div>
          </div>

          {/* Ancient Parchment Manuscript Display */}
          {(() => {
            const extra = getExtraData(activeMansion.id);
            const angelName = currentLang === 'ha' ? extra.angelHa : currentLang === 'en' ? extra.angelEn : extra.angelFr;
            const asmaName = currentLang === 'ha' ? extra.asmaHa : currentLang === 'en' ? extra.asmaEn : extra.asmaFr;
            const incenseName = currentLang === 'ha' ? extra.incenseHa : currentLang === 'en' ? extra.incenseEn : extra.incenseFr;
            const sadaqahName = currentLang === 'ha' ? extra.sadaqahHa : currentLang === 'en' ? extra.sadaqahEn : extra.sadaqahFr;
            const wirdName = currentLang === 'ha' ? extra.wirdNameHa : currentLang === 'en' ? extra.wirdNameEn : extra.wirdNameFr;
            const formattedDegree = getLocalizedDegree(extra.degree, currentLang);

            return (
              <div
                ref={parchmentRef}
                className="relative bg-[#fbf6e9] dark:bg-[#1a1612] text-[#3d2f21] dark:text-[#e8d7c3] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-4 sm:border-8 border-[#d4af37]/40 shadow-2xl overflow-hidden font-serif max-w-full select-none"
              >
                {/* Vintage Corner Ornaments */}
                <div className="absolute top-2 left-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                <div className="absolute top-2 right-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                <div className="absolute bottom-2 left-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>
                <div className="absolute bottom-2 right-2 text-[#d4af37] text-lg sm:text-2xl font-bold select-none">❖</div>

                <div className="text-center border-b-2 border-[#d4af37]/40 pb-4 sm:pb-6 mb-4 sm:mb-6 min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#8b5e34] dark:text-[#d4af37] block mb-1">
                    {labels.mansionTag} #{activeMansion.id}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-[#2a1f17] dark:text-[#f3e5d8] tracking-tight break-words">
                    {activeMansion.name}
                  </h3>
                  <p className="text-2xl sm:text-4xl font-arabic text-[#b8860b] dark:text-[#e6c662] mt-2 break-words" dir="rtl">
                    {activeMansion.arabic}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.angel}:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-300 break-words text-right">{angelName} ({extra.angelAr})</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.asma}:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 break-words text-right">{asmaName} ({extra.asmaAr})</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.element}:</span>
                      <span className="font-bold break-words">{activeMansion.element}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.incense}:</span>
                      <span className="font-bold text-[#8b5e34] dark:text-[#d4af37] break-words text-right">{incenseName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.sadaqah}:</span>
                      <span className="font-bold break-words text-right">{sadaqahName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-b border-[#d4af37]/20 pb-1.5 min-w-0">
                      <span className="font-bold text-[#6b4724] dark:text-[#c4a482] shrink-0">{labels.degree}:</span>
                      <span className="font-mono text-xs break-words text-right">{formattedDegree}</span>
                    </div>
                  </div>
                </div>

                {/* Central Sacred Calligraphy & Invocation */}
                <div className="bg-[#f2e7d3] dark:bg-[#26201a] p-3.5 sm:p-5 rounded-2xl border border-[#d4af37]/40 text-center my-4 sm:my-6 shadow-inner min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8b5e34] dark:text-[#d4af37] block mb-2">
                    {labels.wird} ({extra.wirdCount}X)
                  </span>
                  <p className="text-xl sm:text-3xl font-arabic text-[#2a1f17] dark:text-[#f3e5d8] leading-loose my-2 break-words" dir="rtl">
                    {extra.wirdAr}
                  </p>
                  <p className="text-xs italic text-[#6b4724] dark:text-[#c4a482] break-words">
                    {wirdName}
                  </p>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed italic text-center text-[#523d2b] dark:text-[#c2b19c] break-words">
                  "{activeMansion.desc}"
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Parchment Exporter Modal for High-Res PNG / PDF Print */}
      {activeMansion && (
        <ParchmentExporterModal
          isOpen={showExporterModal}
          onClose={() => setShowExporterModal(false)}
          title={`Manzil_${activeMansion.id}_${activeMansion.name}`}
          subtitle={`${activeMansion.name} (${activeMansion.arabic}) - ${labels.mansionTag} #${activeMansion.id}`}
          content={
            (() => {
              const extra = getExtraData(activeMansion.id);
              const angelName = currentLang === 'ha' ? extra.angelHa : currentLang === 'en' ? extra.angelEn : extra.angelFr;
              const asmaName = currentLang === 'ha' ? extra.asmaHa : currentLang === 'en' ? extra.asmaEn : extra.asmaFr;
              const incenseName = currentLang === 'ha' ? extra.incenseHa : currentLang === 'en' ? extra.incenseEn : extra.incenseFr;
              const sadaqahName = currentLang === 'ha' ? extra.sadaqahHa : currentLang === 'en' ? extra.sadaqahEn : extra.sadaqahFr;
              const wirdName = currentLang === 'ha' ? extra.wirdNameHa : currentLang === 'en' ? extra.wirdNameEn : extra.wirdNameFr;
              const formattedDegree = getLocalizedDegree(extra.degree, currentLang);

              return (
                <div className="relative bg-[#fbf6e9] text-[#3d2f21] p-6 sm:p-8 rounded-2xl border-4 border-[#d4af37]/50 font-serif max-w-full">
                  <div className="absolute top-2 left-2 text-[#d4af37] text-xl font-bold select-none">❖</div>
                  <div className="absolute top-2 right-2 text-[#d4af37] text-xl font-bold select-none">❖</div>
                  <div className="absolute bottom-2 left-2 text-[#d4af37] text-xl font-bold select-none">❖</div>
                  <div className="absolute bottom-2 right-2 text-[#d4af37] text-xl font-bold select-none">❖</div>

                  <div className="text-center border-b-2 border-[#d4af37]/40 pb-4 mb-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#8b5e34] block mb-1">
                      {labels.mansionTag} #{activeMansion.id}
                    </span>
                    <h3 className="text-3xl font-extrabold text-[#2a1f17] tracking-tight">
                      {activeMansion.name}
                    </h3>
                    <p className="text-3xl font-arabic text-[#b8860b] mt-2" dir="rtl">
                      {activeMansion.arabic}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs sm:text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.angel}:</span>
                        <span className="font-bold text-amber-800">{angelName} ({extra.angelAr})</span>
                      </div>
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.asma}:</span>
                        <span className="font-bold text-emerald-800">{asmaName} ({extra.asmaAr})</span>
                      </div>
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.element}:</span>
                        <span className="font-bold">{activeMansion.element}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.incense}:</span>
                        <span className="font-bold text-[#8b5e34]">{incenseName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.sadaqah}:</span>
                        <span className="font-bold">{sadaqahName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#d4af37]/20 pb-1">
                        <span className="font-bold text-[#6b4724]">{labels.degree}:</span>
                        <span className="font-mono text-xs">{formattedDegree}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f2e7d3] p-4 rounded-xl border border-[#d4af37]/40 text-center my-4 shadow-inner">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8b5e34] block mb-1">
                      {labels.wird} ({extra.wirdCount}X)
                    </span>
                    <p className="text-2xl font-arabic text-[#2a1f17] my-2" dir="rtl">
                      {extra.wirdAr}
                    </p>
                    <p className="text-xs italic text-[#6b4724]">
                      {wirdName}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed italic text-center text-[#523d2b] mt-3">
                    "{activeMansion.desc}"
                  </p>
                </div>
              );
            })()
          }
        />
      )}
    </div>
  );
};

export default LunarMansions;
