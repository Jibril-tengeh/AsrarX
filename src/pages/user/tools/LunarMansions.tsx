import React, { useState, useEffect } from 'react';
import { Moon, ArrowLeft, Star, Compass, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { motion } from 'motion/react';

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
  { id: 22, name: "Sa'd al-Dhabih", arabic: "سعد الذابح", element: "Feu", nature: "Maléfique", desc: "La chance du sacrificateur. Énergie de coupure et de perte. Souvent associée à la fuite, l'exil ou le sacrifice forcé. Elle contrecarre presque toute bonne action entreprise sous son influence.", propitious: ["Fuite", "Exil", "Séparation forcée"], unpropitious: ["Toute bonne action", "Alliances"] },
  { id: 23, name: "Sa'd Bula", arabic: "سعد بلع", element: "Terre", nature: "Mixte", desc: "La chance de l'avalement. Demeure de consommation et de dissolution. Elle est étrangement favorable à la médecine (guérir en avalant le mal) et aux divorces (dissoudre l'union).", propitious: ["Divorce", "Médecine", "Traitements"], unpropitious: [] },
  { id: 24, name: "Sa'd al-Su'ud", arabic: "سعد السعود", element: "Air", nature: "Très Bénéfique", desc: "La chance des chances. La demeure la plus fortunée. Elle couronne de succès toutes les entreprises, apporte l'amour, favorise les mariages et confère des faveurs royales.", propitious: ["Amour", "Mariage", "Succès royal", "Élévation"], unpropitious: [] },
  { id: 25, name: "Sa'd al-Akhbiya", arabic: "سعد الأخبية", element: "Eau", nature: "Bénéfique", desc: "La chance des tentes. Demeure de la dissimulation et de la protection. Excellente pour concevoir des talismans protecteurs, assiéger une forteresse ou cacher ses intentions.", propitious: ["Assièger", "Magie protectrice", "Secrets"], unpropitious: [] },
  { id: 26, name: "Al-Fargh al-Muqaddam", arabic: "الفرغ المقدم", element: "Feu", nature: "Mixte", desc: "Le premier bec du seau. Demeure active favorisant le mouvement, le voyage, et les interventions médicales. Cependant, elle est néfaste pour sceller des unions comme le mariage.", propitious: ["Voyage", "Médecine", "Soins"], unpropitious: ["Mariage", "Stabilité"] },
  { id: 27, name: "Al-Fargh al-Mu'akkhar", arabic: "الفرغ المؤخر", element: "Eau", nature: "Bénéfique", desc: "Le second bec du seau. Demeure de flux financier. Propice au commerce, aux achats et aux investissements, mais elle déconseille fortement de contracter des emprunts.", propitious: ["Commerce", "Achats", "Gains"], unpropitious: ["Emprunts", "Dettes"] },
  { id: 28, name: "Rasha", arabic: "الرشا", element: "Eau", nature: "Bénéfique", desc: "Le ventre du poisson. Dernière demeure clôturant le cycle lunaire. Énergie de plénitude, extrêmement favorable pour finaliser des affaires et pour la magie de l'attraction.", propitious: ["Toutes les affaires", "Magie d'attraction", "Finalisation"], unpropitious: [] },
];

const MANSION_TRANSLATIONS: Record<string, Record<number, Partial<Mansion>>> = {
  fr: {
    1: {
      name: "Al-Sharatain",
      desc: "Les deux cornes du Bélier. Première demeure marquant le début du zodiaque lunaire. Favorable aux initiatives rapides, aux voyages et à l'acquisition de connaissances, mais déconseillée pour les engagements durables comme le mariage ou la fondation d'édifices.",
      propitious: ["Voyages", "Commerce", "Nouvelles rencontres"],
      unpropitious: ["Mariage", "Construction"],
      element: "Feu",
      nature: "Bénéfique"
    },
    2: {
      name: "Al-Butayn",
      desc: "Le ventre du Bélier. Demeure de nature modérée, souvent liée à la découverte de choses cachées, la plantation et l'ancrage. Elle n'est cependant pas favorable pour entreprendre des voyages sur l'eau.",
      propitious: ["Recherche de trésors", "Plantations", "Achats"],
      unpropitious: ["Voyages sur l'eau", "Vente"],
      element: "Terre",
      nature: "Mixte"
    },
    3: {
      name: "Al-Thurayya",
      desc: "Les Pléiades. Une des demeures les plus fastes et lumineuses. Elle est le siège de la chance, de l'amour, des bénédictions et de l'alchimie spirituelle. Hautement recommandée pour toute œuvre de rassemblement et d'affection.",
      propitious: ["Amour (Mahabba)", "Alchimie", "Bénédictions", "Acquisitions"],
      unpropitious: ["Opérations de séparation", "Conflits"],
      element: "Air",
      nature: "Très Bénéfique"
    },
    4: {
      name: "Al-Dabaran",
      desc: "Le suiveur (Aldébaran). Astre rouge marquant l'œil du Taureau, porteur de discorde et de séparation. Cette demeure est redoutée pour le commerce et le mariage, et souvent utilisée dans les œuvres de destruction.",
      propitious: ["Destruction d'ennemis", "Séparation (Tafriq)"],
      unpropitious: ["Mariage", "Commerce", "Voyage", "Accords"],
      element: "Terre",
      nature: "Maléfique"
    },
    5: {
      name: "Al-Haq'a",
      desc: "La tache blanche. Associée à Orion, cette demeure favorise l'intellect, l'apprentissage des sciences occultes et la méditation. Elle requiert le calme et déconseille les conflits ouverts.",
      propitious: ["Études mystiques", "Méditation", "Compréhension"],
      unpropitious: ["Confrontations", "Guerres"],
      element: "Air",
      nature: "Mixte"
    },
    6: {
      name: "Al-Han'a",
      desc: "La marque. Demeure faste pour approcher les puissants, formuler des requêtes et chasser. Elle apporte le succès dans les entreprises audacieuses mais n'est pas favorable aux prêts financiers.",
      propitious: ["Chasse", "Demandes aux rois", "Audace"],
      unpropitious: ["Prêts d'argent", "Dettes"],
      element: "Feu",
      nature: "Bénéfique"
    },
    7: {
      name: "Al-Dhira",
      desc: "Le bras ou la patte avant. Demeure très positive liée à la croissance, la guérison et l'abondance. Elle est idéale pour semer, cultiver et s'engager dans des échanges commerciaux prospères.",
      propitious: ["Guérison", "Commerce", "Agriculture", "Nouvel emploi"],
      unpropitious: [],
      element: "Eau",
      nature: "Bénéfique"
    },
    8: {
      name: "Al-Nathra",
      desc: "La crèche. Associée au Lion, elle apporte une énergie soudaine et brève. Utile pour des opérations magiques ou matérielles qui nécessitent une conclusion rapide, mais mauvaise pour les projets de longue haleine.",
      propitious: ["Opérations rapides", "Victoire soudaine"],
      unpropitious: ["Opérations à long terme", "Contrats durables"],
      element: "Feu",
      nature: "Mixte"
    },
    9: {
      name: "Al-Tarf",
      desc: "Le regard du Lion. Demeure de la colère et de la vengeance. Son influence est lourde et destructrice. Elle n'est employée que pour les malédictions ou pour se débarrasser d'un adversaire oppressif.",
      propitious: ["Malédictions justifiées", "Défense agressive"],
      unpropitious: ["Tout le reste", "Voyages", "Mariage"],
      element: "Terre",
      nature: "Maléfique"
    },
    10: {
      name: "Al-Jabha",
      desc: "Le front du Lion (Régulus). Demeure royale par excellence. Elle confère charisme, élévation, respect et victoire éclatante. Excellente pour l'amour et pour briller en société.",
      propitious: ["Amour", "Réussite", "Charisme", "Renommée"],
      unpropitious: [],
      element: "Feu",
      nature: "Très Bénéfique"
    },
    11: {
      name: "Al-Zubra",
      desc: "La crinière du Lion. Demeure protectrice et acquisitive. Favorable à l'accumulation de richesses, à la protection de ses biens et à la consolidation de sa position matérielle ou sociale.",
      propitious: ["Acquisition de biens", "Succès", "Protection"],
      unpropitious: [],
      element: "Terre",
      nature: "Bénéfique"
    },
    12: {
      name: "Al-Sarfah",
      desc: "Le changement céleste. Marque un tournant. Elle est propice pour renverser des situations bloquées, libérer les prisonniers et pour l'agriculture, mais dangereuse pour les voyages maritimes.",
      propitious: ["Libération de prisonniers", "Agriculture", "Changement"],
      unpropitious: ["Navigations", "Stabilité"],
      element: "Air",
      nature: "Mixte"
    },
    13: {
      name: "Al-Awwa",
      desc: "Le hurleur (constellation de la Vierge). Demeure très favorable aux unions, aux mariages, aux associations commerciales fructueuses et à la réconciliation entre ennemis.",
      propitious: ["Mariage", "Accords commerciaux", "Réconciliation"],
      unpropitious: [],
      element: "Terre",
      nature: "Bénéfique"
    },
    14: {
      name: "Al-Simak",
      desc: "L'exalté (Spica). Étoile brillante apportant des énergies fluctuantes. Favorable aux opérations d'attraction amoureuse et aux voyages, mais défavorable pour le traitement des maladies qui pourraient s'aggraver.",
      propitious: ["Magie d'amour", "Voyage", "Déménagement"],
      unpropitious: ["Maladies", "Soins médicaux"],
      element: "Feu",
      nature: "Mixte"
    },
    15: {
      name: "Al-Ghafr",
      desc: "La couverture. Une des meilleures demeures pour la spiritualité. Elle favorise le recueillement, l'exaucement des prières, la découverte de trésors enfouis et la réalisation de toutes les bonnes œuvres.",
      propitious: ["Toutes les bonnes œuvres", "Prières", "Trésors"],
      unpropitious: [],
      element: "Terre",
      nature: "Très Bénéfique"
    },
    16: {
      name: "Al-Zubana",
      desc: "Les pinces du Scorpion. Demeure de la séparation, de la discorde et de l'inimitié. Elle est redoutée et utilisée uniquement pour créer des conflits, séparer les alliés ou se venger.",
      propitious: ["Séparation", "Discorde", "Rupture"],
      unpropitious: ["Voyage", "Mariage", "Commerce"],
      element: "Air",
      nature: "Maléfique"
    },
    17: {
      name: "Al-Iklil",
      desc: "La couronne du Scorpion. Influence mitigée, propice aux constructions solides et à l'acquisition d'animaux, mais elle nécessite de la prudence dans les affaires sociales ou relationnelles.",
      propitious: ["Bâtir", "Acheter des animaux", "Fondations"],
      unpropitious: [],
      element: "Eau",
      nature: "Mixte"
    },
    18: {
      name: "Al-Qalb",
      desc: "Le cœur du Scorpion (Antarès). Étoile de la guerre, de la violence et de la destruction. Son énergie est purement martiale. Totalement déconseillée pour l'amour, la paix ou les accords.",
      propitious: ["Destruction", "Guerre", "Domination"],
      unpropitious: ["Amour", "Paix", "Voyages"],
      element: "Feu",
      nature: "Maléfique"
    },
    19: {
      name: "Al-Shaulah",
      desc: "Le dard du Scorpion. Énergie vive et piquante, idéale pour chasser, traquer ou mener des opérations secrètes, mystiques et cachées. Demande une grande maîtrise.",
      propitious: ["Chasse", "Opérations secrètes", "Poursuites"],
      unpropitious: [],
      element: "Eau",
      nature: "Mixte"
    },
    20: {
      name: "Al-Na'aim",
      desc: "Les autruches. Demeure d'ouverture et d'expansion. Favorable à tous les déplacements, aux voyages commerciaux lointains, et à la domestication ou l'achat de montures.",
      propitious: ["Voyages", "Commerce", "Chevaux et véhicules"],
      unpropitious: [],
      element: "Feu",
      nature: "Bénéfique"
    },
    21: {
      name: "Al-Baldah",
      desc: "La ville ou le lieu désert. Demeure de construction et d'établissement. Très favorable pour fonder une maison, se marier, et récolter les fruits de son labeur.",
      propitious: ["Bâtir", "Mariage", "Récoltes", "Établissement"],
      unpropitious: [],
      element: "Terre",
      nature: "Bénéfique"
    },
    22: {
      name: "Sa'd al-Dhabih",
      desc: "La chance du sacrificateur. Énergie de coupure et de perte. Souvent associée à la fuite, l'exil ou le sacrifice forcé. Elle contrecarre presque toute bonne action entreprise sous son influence.",
      propitious: ["Fuite", "Exil", "Séparation forcée"],
      unpropitious: ["Toute bonne action", "Alliances"],
      element: "Feu",
      nature: "Maléfique"
    },
    23: {
      name: "Sa'd Bula",
      desc: "La chance de l'avalement. Demeure de consommation et de dissolution. Elle est étrangement favorable à la médecine (guérir en avalant le mal) et aux divorces (dissoudre l'union).",
      propitious: ["Divorce", "Médecine", "Traitements"],
      unpropitious: [],
      element: "Terre",
      nature: "Mixte"
    },
    24: {
      name: "Sa'd al-Su'ud",
      desc: "La chance des chances. La demeure la plus fortunée. Elle couronne de succès toutes les entreprises, apporte l'amour, favorise les mariages et confère des faveurs royales.",
      propitious: ["Amour", "Mariage", "Succès royal", "Élévation"],
      unpropitious: [],
      element: "Air",
      nature: "Très Bénéfique"
    },
    25: {
      name: "Sa'd al-Akhbiya",
      desc: "La chance des tentes. Demeure de la dissimulation et de la protection. Excellente pour concevoir des talismans protecteurs, assiéger une forteresse ou cacher ses intentions.",
      propitious: ["Assièger", "Magie protectrice", "Secrets"],
      unpropitious: [],
      element: "Eau",
      nature: "Bénéfique"
    },
    26: {
      name: "Al-Fargh al-Muqaddam",
      desc: "Le premier bec du seau. Demeure active favorisant le mouvement, le voyage, et les interventions médicales. Cependant, elle est néfaste pour sceller des unions comme le mariage.",
      propitious: ["Voyage", "Médecine", "Soins"],
      unpropitious: ["Mariage", "Stabilité"],
      element: "Feu",
      nature: "Mixte"
    },
    27: {
      name: "Al-Fargh al-Mu'akkhar",
      desc: "Le second bec du seau. Demeure de flux financier. Propice au commerce, aux achats et aux investissements, mais elle déconseille fortement de contracter des emprunts.",
      propitious: ["Commerce", "Achats", "Gains"],
      unpropitious: ["Emprunts", "Dettes"],
      element: "Eau",
      nature: "Bénéfique"
    },
    28: {
      name: "Rasha",
      desc: "Le ventre du poisson. Dernière demeure clôturant le cycle lunaire. Énergie de plénitude, extrêmement favorable pour finaliser des affaires et pour la magie de l'attraction.",
      propitious: ["Toutes les affaires", "Magie d'attraction", "Finalisation"],
      unpropitious: [],
      element: "Eau",
      nature: "Bénéfique"
    }
  },
  en: {
    1: {
      name: "Al-Sharatain",
      desc: "The two horns of Aries. First mansion marking the beginning of the lunar zodiac. Favorable for quick initiatives, travel, and acquiring knowledge, but discouraged for long-term commitments like marriage or laying building foundations.",
      propitious: ["Travel", "Commerce", "New Meetings"],
      unpropitious: ["Marriage", "Construction"],
      element: "Fire",
      nature: "Beneficent"
    },
    2: {
      name: "Al-Butayn",
      desc: "The belly of Aries. A mansion of moderate nature, often linked to the discovery of hidden things, planting, and grounding. However, it is not favorable for embarking on water journeys.",
      propitious: ["Treasure Hunting", "Planting", "Purchasing"],
      unpropitious: ["Water Journeys", "Selling"],
      element: "Earth",
      nature: "Mixed"
    },
    3: {
      name: "Al-Thurayya",
      desc: "The Pleiades. One of the most fortunate and bright mansions. It is the seat of luck, love, blessings, and spiritual alchemy. Highly recommended for any work of gathering and affection.",
      propitious: ["Love (Mahabba)", "Alchemy", "Blessings", "Acquisitions"],
      unpropitious: ["Separation operations", "Conflicts"],
      element: "Air",
      nature: "Highly Beneficent"
    },
    4: {
      name: "Al-Dabaran",
      desc: "The follower (Aldebaran). A red star marking the eye of Taurus, carrying discord and separation. This mansion is feared for trade and marriage, and often used in works of destruction.",
      propitious: ["Destruction of Enemies", "Separation (Tafriq)"],
      unpropitious: ["Marriage", "Commerce", "Travel", "Agreements"],
      element: "Earth",
      nature: "Malefic"
    },
    5: {
      name: "Al-Haq'a",
      desc: "The white spot. Associated with Orion, this mansion favors the intellect, learning occult sciences, and meditation. It requires calm and discourages open conflicts.",
      propitious: ["Mystical Studies", "Meditation", "Understanding"],
      unpropitious: ["Confrontations", "Wars"],
      element: "Air",
      nature: "Mixed"
    },
    6: {
      name: "Al-Han'a",
      desc: "The brand. A fortunate mansion for approaching powerful people, making requests, and hunting. It brings success in bold endeavors but is unfavorable for financial loans.",
      propitious: ["Hunting", "Requests to Kings", "Boldness"],
      unpropitious: ["Money Loans", "Debts"],
      element: "Fire",
      nature: "Beneficent"
    },
    7: {
      name: "Al-Dhira",
      desc: "The arm or front paw. A very positive mansion linked to growth, healing, and abundance. It is ideal for sowing, cultivating, and engaging in prosperous commercial exchanges.",
      propitious: ["Healing", "Commerce", "Agriculture", "New Job"],
      unpropitious: [],
      element: "Water",
      nature: "Beneficent"
    },
    8: {
      name: "Al-Nathra",
      desc: "The crib. Associated with Leo, it brings sudden and brief energy. Useful for magical or material operations requiring quick closure, but bad for long-term projects.",
      propitious: ["Quick Operations", "Sudden Victory"],
      unpropitious: ["Long-term Operations", "Durable Contracts"],
      element: "Fire",
      nature: "Mixed"
    },
    9: {
      name: "Al-Tarf",
      desc: "The gaze of the Lion. Mansion of anger and revenge. Its influence is heavy and destructive. It is used only for justified curses or to rid oneself of an oppressive adversary.",
      propitious: ["Justified Curses", "Aggressive Defense"],
      unpropitious: ["Everything Else", "Travel", "Marriage"],
      element: "Earth",
      nature: "Malefic"
    },
    10: {
      name: "Al-Jabha",
      desc: "The forehead of the Lion (Regulus). The royal mansion par excellence. It confers charisma, elevation, respect, and brilliant victory. Excellent for love and shining in society.",
      propitious: ["Love", "Success", "Charisma", "Renown"],
      unpropitious: [],
      element: "Fire",
      nature: "Highly Beneficent"
    },
    11: {
      name: "Al-Zubra",
      desc: "The mane of the Lion. A protective and acquisitive mansion. Favorable for accumulating wealth, protecting possessions, and consolidating material or social positions.",
      propitious: ["Wealth Acquisition", "Success", "Protection"],
      unpropitious: [],
      element: "Earth",
      nature: "Beneficent"
    },
    12: {
      name: "Al-Sarfah",
      desc: "The celestial change. Marks a turning point. It is propitious for reversing blocked situations, freeing prisoners, and for agriculture, but dangerous for maritime travel.",
      propitious: ["Freeing Prisoners", "Agriculture", "Change"],
      unpropitious: ["Navigation", "Stability"],
      element: "Air",
      nature: "Mixed"
    },
    13: {
      name: "Al-Awwa",
      desc: "The howler (Virgo constellation). Very favorable mansion for unions, marriages, fruitful business partnerships, and reconciliation between enemies.",
      propitious: ["Marriage", "Business Agreements", "Reconciliation"],
      unpropitious: [],
      element: "Earth",
      nature: "Beneficent"
    },
    14: {
      name: "Al-Simak",
      desc: "The exalted one (Spica). A bright star bringing fluctuating energies. Favorable for love attraction and travel, but unfavorable for treating illnesses as they might worsen.",
      propitious: ["Love Magic", "Travel", "Relocation"],
      unpropitious: ["Illness treatment", "Medical care"],
      element: "Fire",
      nature: "Mixed"
    },
    15: {
      name: "Al-Ghafr",
      desc: "The covering. One of the best mansions for spirituality. It favors contemplation, answering of prayers, discovering hidden treasures, and performing all good works.",
      propitious: ["All Good Works", "Prayers", "Treasures"],
      unpropitious: [],
      element: "Earth",
      nature: "Highly Beneficent"
    },
    16: {
      name: "Al-Zubana",
      desc: "The claws of the Scorpion. Mansion of separation, discord, and enmity. It is feared and used only to create conflicts, separate allies, or take revenge.",
      propitious: ["Separation", "Discord", "Rupture"],
      unpropitious: ["Travel", "Marriage", "Commerce"],
      element: "Air",
      nature: "Malefic"
    },
    17: {
      name: "Al-Iklil",
      desc: "The crown of the Scorpion. Mixed influence, propice to solid constructions and buying animals, but requires caution in social or relational matters.",
      propitious: ["Building", "Buying Animals", "Foundations"],
      unpropitious: [],
      element: "Water",
      nature: "Mixed"
    },
    18: {
      name: "Al-Qalb",
      desc: "The heart of the Scorpion (Antares). Star of war, violence, and destruction. Its energy is purely martial. Totally discouraged for love, peace, or agreements.",
      propitious: ["Destruction", "War", "Domination"],
      unpropitious: ["Love", "Peace", "Travel"],
      element: "Fire",
      nature: "Malefic"
    },
    19: {
      name: "Al-Shaulah",
      desc: "The sting of the Scorpion. Quick and biting energy, ideal for hunting, tracking, or carrying out secret, mystical, and hidden operations. Demands great mastery.",
      propitious: ["Hunting", "Secret Operations", "Chases"],
      unpropitious: [],
      element: "Water",
      nature: "Mixed"
    },
    20: {
      name: "Al-Na'aim",
      desc: "The ostriches. Mansion of openness and expansion. Favorable for all travel, distant commercial trips, and domesticating or purchasing mounts.",
      propitious: ["Travel", "Commerce", "Horses & Vehicles"],
      unpropitious: [],
      element: "Fire",
      nature: "Beneficent"
    },
    21: {
      name: "Al-Baldah",
      desc: "The town or empty place. Mansion of building and establishment. Very favorable for founding a house, marrying, and harvesting fruits of labor.",
      propitious: ["Building", "Marriage", "Harvests", "Establishment"],
      unpropitious: [],
      element: "Earth",
      nature: "Beneficent"
    },
    22: {
      name: "Sa'd al-Dhabih",
      desc: "The luck of the slaughterer. Energy of severing and loss. Often associated with flight, exile, or forced sacrifice. It thwarts almost any good deed undertaken under its influence.",
      propitious: ["Flight", "Exile", "Forced Separation"],
      unpropitious: ["Any Good Deed", "Alliances"],
      element: "Fire",
      nature: "Malefic"
    },
    23: {
      name: "Sa'd Bula",
      desc: "The luck of swallowing. Mansion of consumption and dissolution. Strangely favorable for medicine (healing by swallowing the evil) and divorces (dissolving the union).",
      propitious: ["Divorce", "Medicine", "Treatments"],
      unpropitious: [],
      element: "Earth",
      nature: "Mixed"
    },
    24: {
      name: "Sa'd al-Su'ud",
      desc: "The luck of lucks. The most fortunate mansion. It crowns all undertakings with success, brings love, favors marriages, and confers royal favors.",
      propitious: ["Love", "Marriage", "Royal Success", "Elevation"],
      unpropitious: [],
      element: "Air",
      nature: "Highly Beneficent"
    },
    25: {
      name: "Sa'd al-Akhbiya",
      desc: "The luck of the tents. Mansion of concealment and protection. Excellent for designing protective talismans, besieging a fortress, or hiding one's intentions.",
      propitious: ["Besieging", "Protective Magic", "Secrets"],
      unpropitious: [],
      element: "Water",
      nature: "Beneficent"
    },
    26: {
      name: "Al-Fargh al-Muqaddam",
      desc: "The first spout of the bucket. Active mansion favoring movement, travel, and medical interventions. However, it is harmful for sealing unions like marriage.",
      propitious: ["Travel", "Medicine", "Care"],
      unpropitious: ["Marriage", "Stability"],
      element: "Fire",
      nature: "Mixed"
    },
    27: {
      name: "Al-Fargh al-Mu'akkhar",
      desc: "The second spout of the bucket. Mansion of financial flow. Propitious for commerce, purchases, and investments, but strongly discourages taking out loans.",
      propitious: ["Commerce", "Purchases", "Gains"],
      unpropitious: ["Loans", "Debts"],
      element: "Water",
      nature: "Beneficent"
    },
    28: {
      name: "Rasha",
      desc: "The belly of the fish. Last mansion closing the lunar cycle. Energy of fullness, extremely favorable for finalizing business and for attraction magic.",
      propitious: ["All Business", "Attraction Magic", "Finalization"],
      unpropitious: [],
      element: "Water",
      nature: "Beneficent"
    }
  },
  ha: {
    1: {
      name: "Al-Sharatain",
      desc: "Kahon rago guda biyu. Gida na farko da ke nuna farkon falakin wata. Yana da kyau ga hanzari, tafiye-tafiye da neman ilimi, amma ba a ba da shawarar yin aure ko gina gidaje ba.",
      propitious: ["Tafiya", "Kasuwanci", "Saduwa da mutane"],
      unpropitious: ["Aure", "Gine-gine"],
      element: "Wuta",
      nature: "Mai albarka"
    },
    2: {
      name: "Al-Butayn",
      desc: "Cikin rago. Gida ne mai dabi'a matsakaiciya, galibi yana da alaƙa da gano abubuwan da ke ɓoye, dasa shuki, da kafuwa. Amma ba shi da kyau ga tafiya ta ruwa.",
      propitious: ["Neman dukiya", "Dasa shuki", "Saye"],
      unpropitious: ["Tafiyar Ruwa", "Siyarwa"],
      element: "Kasa",
      nature: "Gami"
    },
    3: {
      name: "Al-Thurayya",
      desc: "Taruwar taurari. Ɗaya daga cikin gidaje mafi sa'a da haske. Shi ne mazaunin sa'a, soyayya, albarka da canjin ruhaniya. Ana ba da shawara sosai ga kowane aiki na taruwa da ƙauna.",
      propitious: ["Soyayya (Mahabba)", "Haskakawa", "Albarka", "Saye"],
      unpropitious: ["Ayyukan rabuwa", "Rikici"],
      element: "Iska",
      nature: "Mai yawan gaske"
    },
    4: {
      name: "Al-Dabaran",
      desc: "Mai biyo baya (Aldebaran). Jan tauraro da ke nuna idon bijimi, yana ɗauke da gaba da rabuwa. Ana tsoron wannan gida don kasuwanci da aure, kuma galibi ana amfani da shi wajen ayyukan rugujewa.",
      propitious: ["Rusa Abokan gaba", "Rabuwa (Tafriq)"],
      unpropitious: ["Aure", "Kasuwanci", "Tafiya", "Yarjejeniya"],
      element: "Kasa",
      nature: "Mara kyau"
    },
    5: {
      name: "Al-Haq'a",
      desc: "Farar damba. Haɗe da taurarin Orion, wannan gida yana taimaka wa hankali, koyon ilimin asiri da tunani na zurfafa. Yana buƙatar natsuwa kuma yana hana rikici.",
      propitious: ["Karatun Sirri", "Tunanin Zurfafa", "Fahimta"],
      unpropitious: ["Fada", "Yaki"],
      element: "Iska",
      nature: "Gami"
    },
    6: {
      name: "Al-Han'a",
      desc: "Alama. Kyakkyawan gida don kusantar sarakuna ko manyan mutane, gabatar da buƙatu, da farauta. Yana kawo nasara a cikin ayyuka masu ƙarfi amma ba shi da kyau ga rance.",
      propitious: ["Farauta", "Neman Alfarmar Sarakuna", "Zukata"],
      unpropitious: ["Bada rance", "Basussuka"],
      element: "Wuta",
      nature: "Mai albarka"
    },
    7: {
      name: "Al-Dhira",
      desc: "Hannun gaba. Gida mai kyau sosai mai alaƙa da haɓaka, waraka da wadatar arziki. Ya dace don shuka, noma da shiga cikin harkokin kasuwanci masu albarka.",
      propitious: ["Waraka", "Kasuwanci", "Noma", "Sabon Aiki"],
      unpropitious: [],
      element: "Ruwa",
      nature: "Mai albarka"
    },
    8: {
      name: "Al-Nathra",
      desc: "Wurin kwanciya. Haɗe da zakin daji, yana kawo ƙarfi na farat ɗaya da ɗan lokaci. Yana da amfani ga ayyukan asiri ko na duniya waɗanda ke buƙatar kammalawa cikin sauri, amma ba shi da kyau ga ayyuka na dogon lokaci.",
      propitious: ["Ayyuka masu sauri", "Nasara ta farat daya"],
      unpropitious: ["Ayyuka na dogon lokaci", "Yarjejeniyar dorewa"],
      element: "Wuta",
      nature: "Gami"
    },
    9: {
      name: "Al-Tarf",
      desc: "Kallon zakin daji. Gidan fushi da ramuwa. Tasirinsa yana da nauyi da lalacewa. Ana amfani da shi ne kawai don la'anta ta gaskiya ko don kawar da abokin gaba mai zalunci.",
      propitious: ["La'anta ta gaskiya", "Kariya mai karfi"],
      unpropitious: ["Sauran abubuwa", "Tafiya", "Aure"],
      element: "Kasa",
      nature: "Mara kyau"
    },
    10: {
      name: "Al-Jabha",
      desc: "Gaban goshin zaki (Regulus). Gidan sarakuna na musamman. Yana ba da kwarjini, ɗaukaka, daraja da nasara mai haske. Kyakkyawan gida don soyayya da fice a cikin al'umma.",
      propitious: ["Soyayya", "Nasara", "Kwarjini", "Shaharar jiki"],
      unpropitious: [],
      element: "Wuta",
      nature: "Mai yawan gaske"
    },
    11: {
      name: "Al-Zubra",
      desc: "Gashin wuyan zaki. Gida mai kariya da samun dukiya. Yana da kyau don tara dukiya, kare kadarori da tabbatar da matsayi na abun duniya ko na al'umma.",
      propitious: ["Samun Dukiya", "Nasara", "Kariya"],
      unpropitious: [],
      element: "Kasa",
      nature: "Mai albarka"
    },
    12: {
      name: "Al-Sarfah",
      desc: "Canjin sararin samaniya. Yana nuna juyi. Yana da kyau don juyar da matsaloli masu wuya, 'yantar da fursunoni da noma, amma yana da hadari ga tafiya ta teku.",
      propitious: ["Yantar da fursunoni", "Noma", "Canji"],
      unpropitious: ["Tafiyar Ruwa", "Dorewar jiki"],
      element: "Iska",
      nature: "Gami"
    },
    13: {
      name: "Al-Awwa",
      desc: "Mai kuka (taurarin budurwa). Gida mai kyau sosai ga aure, tarayya ta kasuwanci mai fa'ida, da sulhu tsakanin abokan gaba.",
      propitious: ["Aure", "Yarjejeniyar Kasuwanci", "Sulhu"],
      unpropitious: [],
      element: "Kasa",
      nature: "Mai albarka"
    },
    14: {
      name: "Al-Simak",
      desc: "Maɗaukaki (Spica). Tauraro mai haske mai kawo ƙarfin da ke canzawa akai-akai. Yana da kyau ga ayyukan jawo soyayya da tafiya, amma ba shi da kyau ga magance cututtuka saboda suna iya tsananta.",
      propitious: ["Asirin Soyayya", "Tafiya", "Canza Gida"],
      unpropitious: ["Maganin cuta", "Kula da lafiya"],
      element: "Wuta",
      nature: "Gami"
    },
    15: {
      name: "Al-Ghafr",
      desc: "Sutura. Ɗaya daga cikin mafi kyawun gidaje don harkokin ruhaniya. Yana taimaka wa natsuwa, amsa addu'o'i, gano dukiyar da ke ɓoye, da yin kowane kyakkyawan aiki.",
      propitious: ["Kowane kyakkyawan aiki", "Addu'o'i", "Arziki na boye"],
      unpropitious: [],
      element: "Kasa",
      nature: "Mai yawan gaske"
    },
    16: {
      name: "Al-Zubana",
      desc: "Kahon kunama. Gidan rabuwa, husuma da gaba. Ana tsoronsa kuma ana amfani da shi ne kawai don haifar da rigima, raba abokan tarayya ko ɗaukar fansa.",
      propitious: ["Rabuwa", "Rikici", "Karyawa"],
      unpropitious: ["Tafiya", "Aure", "Kasuwanci"],
      element: "Iska",
      nature: "Mara kyau"
    },
    17: {
      name: "Al-Iklil",
      desc: "Rawanin kunama. Tasiri mai gami, yana da kyau don gine-gine masu ƙarfi da sayen dabbobi, amma yana buƙatar taka tsantsan a cikin alakar mutane.",
      propitious: ["Gina", "Sayan Dabbobi", "Gine-gine"],
      unpropitious: [],
      element: "Ruwa",
      nature: "Gami"
    },
    18: {
      name: "Al-Qalb",
      desc: "Zuciyar kunama (Antares). Tauraron yaƙi, tashin hankali da lalacewa. Ƙarfinsa na yaki ne kawai. Ba a ba da shawararsa ga soyayya, zaman lafiya ko yarjejeniya ba.",
      propitious: ["Karyawa", "Yaki", "Mulki"],
      unpropitious: ["Soyayya", "Zaman lafiya", "Tafiya"],
      element: "Wuta",
      nature: "Mara kyau"
    },
    19: {
      name: "Al-Shaulah",
      desc: "Harin kunama. Kyakkyawan ƙarfi mai sauri, mai kyau don farauta, bin diddigi ko yin ayyuka na asiri na ruhaniya. Yana buƙatar babban sani.",
      propitious: ["Farauta", "Ayyukan Asiri", "Bin diddigi"],
      unpropitious: [],
      element: "Ruwa",
      nature: "Gami"
    },
    20: {
      name: "Al-Na'aim",
      desc: "Jimina guda biyu. Gidan budewa da faɗaɗawa. Yana da kyau ga duk tafiye-tafiye, kasuwanci mai nisa, da horarwa ko sayen dawakai.",
      propitious: ["Tafiya", "Kasuwanci", "Dawakai da Motoci"],
      unpropitious: [],
      element: "Wuta",
      nature: "Mai albarka"
    },
    21: {
      name: "Al-Baldah",
      desc: "Gari ko kango. Gidan gina gida da zama. Yana da kyau sosai don gina gida, yin aure da girbin amfanin gona.",
      propitious: ["Gina", "Aure", "Girbi", "Zama"],
      unpropitious: [],
      element: "Kasa",
      nature: "Mai albarka"
    },
    22: {
      name: "Sa'd al-Dhabih",
      desc: "Sa'ar mai yanka. Karfin yanke alaka da rashi. Yawancin lokaci ana haɗa shi da guduwa, gudun hijira ko hadaya ta dole. Yana rushe duk wani kyakkyawan aiki da aka fara a ƙarƙashin tasirinsa.",
      propitious: ["Guduwa", "Hijira", "Rabuwa ta dole"],
      unpropitious: ["Duk kyakkyawan aiki", "Hadaka"],
      element: "Wuta",
      nature: "Mara kyau"
    },
    23: {
      name: "Sa'd Bula",
      desc: "Sa'ar hadiye abu. Gidan amfani da narkewa. Yana da kyau ga magani (waraka ta hanyar haɗiye magani) da saki (narkar da aure).",
      propitious: ["Saki", "Magani", "Maganoni"],
      unpropitious: [],
      element: "Kasa",
      nature: "Gami"
    },
    24: {
      name: "Sa'd al-Su'ud",
      desc: "Mafi dacewar sa'o'i. Gidan da ya fi kowane sa'a. Yana kawo nasara a kowane aiki, yana kawo soyayya, aure, da samun tagomashi daga sarakuna.",
      propitious: ["Soyayya", "Aure", "Nasarar Sarauta", "Daukaka"],
      unpropitious: [],
      element: "Iska",
      nature: "Mai yawan gaske"
    },
    25: {
      name: "Sa'd al-Akhbiya",
      desc: "Sa'ar tantuna. Gidan ɓoyewa da kariya. Yana da kyau don tsara laya ta kariya ko ɓoye niyya.",
      propitious: ["Kai tsaye fada", "Laya ta Kariya", "Asiri"],
      unpropitious: [],
      element: "Ruwa",
      nature: "Mai albarka"
    },
    26: {
      name: "Al-Fargh al-Muqaddam",
      desc: "Farkon bakin guga. Gida mai ƙarfi da ke taimaka wa tafiya da kula da lafiya. Amma ba shi da kyau ga aure.",
      propitious: ["Tafiya", "Ilimin Magani", "Kula"],
      unpropitious: ["Aure", "Dorewa"],
      element: "Wuta",
      nature: "Gami"
    },
    27: {
      name: "Al-Fargh al-Mu'akkhar",
      desc: "Bakin guga na biyu. Gidan kwararar kudi. Yana da kyau ga kasuwanci, saye da saka jari, amma yana hana karbar bashi sosai.",
      propitious: ["Kasuwanci", "Saye", "Samun kudi"],
      unpropitious: ["Bashi", "Basussuka"],
      element: "Ruwa",
      nature: "Mai albarka"
    },
    28: {
      name: "Rasha",
      desc: "Cikin kifi. Gida na ƙarshe da ke rufe zagayen wata. Yana da ƙarfin cikar abu, kuma yana da kyau sosai don kammala ayyuka da asirin jan hankali.",
      propitious: ["Duk Harkoki", "Asirin Jawo Abu", "Kammalawa"],
      unpropitious: [],
      element: "Ruwa",
      nature: "Mai albarka"
    }
  }
};

const UI_LABELS: Record<string, any> = {
  fr: {
    back: "Retour aux outils",
    title: "Les 28 Demeures de la Lune",
    system: "Système Arabe",
    select: "Sélectionnez une Demeure",
    today: "Aujourd'hui",
    activeToday: "Demeure Actuelle (Aujourd'hui)",
    mansion: "Demeure",
    nature: "Nature",
    element: "Élément",
    desc: "Description",
    propitious: "Actions Propices",
    unpropitious: "Actions Déconseillées",
    noneRecommended: "Aucune action recommandée",
    noRestriction: "Aucune restriction majeure"
  },
  en: {
    back: "Back to tools",
    title: "The 28 Lunar Mansions",
    system: "Arabic System",
    select: "Select a Mansion",
    today: "Today",
    activeToday: "Current Mansion (Today)",
    mansion: "Mansion",
    nature: "Nature",
    element: "Element",
    desc: "Description",
    propitious: "Propitious Actions",
    unpropitious: "Unpropitious Actions",
    noneRecommended: "No actions recommended",
    noRestriction: "No major restrictions"
  },
  ha: {
    back: "Koma ga kayan aiki",
    title: "Gidaje 28 na Wata",
    system: "Tsarin Larabawa",
    select: "Zaɓi Gida",
    today: "Yau",
    activeToday: "Gidan Yanzu (Yau)",
    mansion: "Gida",
    nature: "Dabi'a",
    element: "Hali",
    desc: "Bayanin Gida",
    propitious: "Ayyukan Da Suke Da Kyau",
    unpropitious: "Ayyukan Da Suke Da Muni",
    noneRecommended: "Babu wani aiki da aka shawarta",
    noRestriction: "Babu wani babban hani"
  }
};

export const LunarMansions: React.FC = () => {
  const { language, t } = useLanguage();
  const currentLang = (language === 'ha' || language === 'en' || language === 'fr') ? language : 'fr';
  const labels = UI_LABELS[currentLang] || UI_LABELS['fr'];

  const [todayMansion, setTodayMansion] = useState<Mansion | null>(null);
  const [currentMansion, setCurrentMansion] = useState<Mansion | null>(null);

  useEffect(() => {
    // Simulate current mansion based on day of year (simplified approximation)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const mansionIndex = dayOfYear % 28;
    setTodayMansion(MANSIONS[mansionIndex]);
    setCurrentMansion(MANSIONS[mansionIndex]);
  }, []);

  const getLocalizedMansion = (m: Mansion) => {
    const translation = MANSION_TRANSLATIONS[currentLang]?.[m.id];
    return {
      ...m,
      ...translation
    };
  };

  const activeMansion = currentMansion ? getLocalizedMansion(currentMansion) : null;
  const activeTodayMansion = todayMansion ? getLocalizedMansion(todayMansion) : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {labels.back}
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Moon className="text-indigo-500" size={32} />
          {labels.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base break-words">{t("tools.lunar-mansions.description")}</p>
      </div>

      {activeMansion && (
        <div className="mb-8">
          <motion.div
            key={activeMansion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
              <Compass size={200} className="animate-[spin_60s_linear_infinite]" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 font-medium mb-2 text-sm">
                <Clock size={16} />
                {activeMansion.id === activeTodayMansion?.id ? labels.activeToday : `${labels.mansion} #${activeMansion.id}`}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 break-words">{activeMansion.name}</h2>
                  <p className="text-2xl sm:text-3xl font-arabic text-indigo-200 mt-1" dir="rtl">{activeMansion.arabic}</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                    activeMansion.nature.includes('Bénéfique') || activeMansion.nature.includes('Beneficent') || activeMansion.nature.includes('albarka') || activeMansion.nature.includes('gaske')
                      ? 'bg-emerald-500/20 text-emerald-300' : 
                    activeMansion.nature.includes('Maléfique') || activeMansion.nature.includes('Malefic') || activeMansion.nature.includes('muni') || activeMansion.nature.includes('kyau')
                      ? 'bg-red-500/20 text-red-300' : 
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {labels.nature}: {activeMansion.nature}
                  </span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white">
                    {labels.element}: {activeMansion.element}
                  </span>
                </div>
              </div>
              
              <div className="bg-indigo-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-indigo-700/50 backdrop-blur-sm">
                <h3 className="text-indigo-200 font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Info size={18} /> {labels.desc}
                </h3>
                <p className="text-indigo-50 leading-relaxed text-sm sm:text-base md:text-lg break-words">
                  {activeMansion.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-indigo-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-800">
                  <h3 className="text-emerald-400 font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Star size={18} /> {labels.propitious}
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {activeMansion.propitious.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                    {activeMansion.propitious.length === 0 && <li className="text-indigo-300/50 italic text-sm">{labels.noneRecommended}</li>}
                  </ul>
                </div>
                
                <div className="bg-indigo-950/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-800">
                  <h3 className="text-red-400 font-bold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Star size={18} /> {labels.unpropitious}
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base">
                    {activeMansion.unpropitious.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                    {activeMansion.unpropitious.length === 0 && <li className="text-indigo-300/50 italic text-sm">{labels.noRestriction}</li>}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-words">{labels.select}</h2>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap">{labels.system}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-700">
          {MANSIONS.map((mansion) => {
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
                className={`p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-gray-800 cursor-pointer ${
                  isCurrent ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                    isToday ? 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full' : 'text-gray-400'
                  }`}>
                    {isToday ? labels.today : `#${locM.id}`}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    locM.nature.includes('Bénéfique') || locM.nature.includes('Beneficent') || locM.nature.includes('albarka') || locM.nature.includes('gaske')
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                    locM.nature.includes('Maléfique') || locM.nature.includes('Malefic') || locM.nature.includes('muni') || locM.nature.includes('kyau')
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>{locM.nature}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-words">{locM.name}</h3>
                <p className="text-lg sm:text-xl font-arabic text-gray-500 dark:text-gray-400 text-right mt-1" dir="rtl">{locM.arabic}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
