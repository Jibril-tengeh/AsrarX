import React, { useState } from 'react';
import { User, Shield, Key, Search, ArrowLeft, RefreshCw, Sparkles, BookOpen, Folder as FolderIcon, Trash2, Save } from 'lucide-react';

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

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'daily', name: 'Quotidien (Daily)' },
  { id: 'special', name: 'Occasions Spéciales' },
  { id: 'healing', name: 'Guérison (Healing)' },
  { id: 'uncategorized', name: 'Non classés' }
];
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
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
  if (arName === "الله" || arName === "اللَّهُ") return "يَا ٱللَّهُ";
  let base = arName.replace(/^الْ/, "").replace(/^ال/, "");
  if (base.length > 1 && base[1] === "\u0651") {
    base = base[0] + base.substring(2);
  }
  return applyTashkeel(`يَا ${base}`);
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
    meaningTitle: "Signification & Secrets Spirituels"
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
    meaningTitle: "Meaning & Spiritual Secrets"
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
    meaningTitle: "Ma'ana & Sirrin Ruhaniya"
  }
};

export const PersonalWird: React.FC = () => {
  const { t, language } = useLanguage();
  const dict = wirdDict[(language as 'fr' | 'en' | 'ha') || 'fr'] || wirdDict.fr;
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Folder and Saved Wird states
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('asrar_wird_folders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_FOLDERS;
  });

  const [savedWirds, setSavedWirds] = useState<SavedWird[]>(() => {
    const saved = localStorage.getItem('asrar_saved_wirds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);

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
    localStorage.setItem('asrar_wird_folders', JSON.stringify(updated));
    setNewFolderName('');
    setIsAddingFolder(false);
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'uncategorized' || folderId === 'daily' || folderId === 'special' || folderId === 'healing') return;
    // Remove folder
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    localStorage.setItem('asrar_wird_folders', JSON.stringify(updatedFolders));

    // Move all wirds in that folder to Uncategorized
    const updatedWirds = savedWirds.map(w => w.folderId === folderId ? { ...w, folderId: 'uncategorized' } : w);
    setSavedWirds(updatedWirds);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updatedWirds));
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24">
      <div className="mb-8">
        <Link to="/tools" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {dict.back}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Sparkles className="text-emerald-500" size={32} />
          {dict.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t("tools.personal-wird.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-500" />
              {dict.infoTitle}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.nameLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: محمد"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{dict.motherNameLabel}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Ex: فاطمة"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                    dir="rtl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{dict.motherDesc}</p>
              </div>

              <button
                onClick={calculateWird}
                disabled={!name || !motherName || isCalculating}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    {dict.calculating}
                  </>
                ) : (
                  <>
                    <Key size={20} />
                    {dict.calculateBtn}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {result && weight !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Mystical Weight Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 shadow-md text-white text-center">
                <p className="text-emerald-100 mb-1 font-medium text-sm sm:text-base">{dict.weightTitle}</p>
                <div className="text-5xl sm:text-6xl font-bold font-serif mb-2 tracking-tight">{weight}</div>
                <p className="text-emerald-100 text-xs sm:text-sm">{dict.weightDesc}</p>
              </div>

              {/* Supreme Wird Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  {dict.supremeWird}
                </p>

                {(() => {
                  const matchedDetailsList = result.names.map(n => getAsmaDetails(n)).filter((d): d is NonNullable<typeof d> => d !== undefined);
                  const arabicVocativeStr = applyTashkeel(matchedDetailsList.map(d => getVocativeArabic(d.ar)).join(' '));
                  const translitVocativeStr = matchedDetailsList.map(d => getVocativeTransliteration(d.tr)).join(', ');

                  return (
                    <div className="text-center">
                      {/* Arabic Zikr with Tashkeel and Amiri font */}
                      <div 
                        className="text-4xl sm:text-5xl font-bold mb-4 leading-relaxed text-gray-900 dark:text-white"
                        style={{ fontFamily: "'Amiri', 'Traditional Arabic', system-ui, sans-serif" }}
                        dir="rtl"
                      >
                        {arabicVocativeStr}
                      </div>
                      
                      <p className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4 font-sans">
                        {translitVocativeStr}
                      </p>

                      <div className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-6">
                        {dict.valueZikr(result.totalAbjad)} • {result.diff === 0 ? dict.perfectMatch : `${dict.minorGap(result.diff)}`}
                      </div>

                      <button
                        onClick={saveWird}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-sm active:scale-98"
                      >
                        <Save size={18} />
                        {dict.saveSuccess} (Save)
                      </button>
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
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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

                      <div className="text-xs text-gray-400 dark:text-gray-500 font-mono flex items-center gap-4">
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{dict.preparationDesc}</p>
                    </div>
                  </div>

                  {/* Opening */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.openingTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{dict.openingDesc}</p>
                    </div>
                  </div>

                  {/* Intention */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.intentionTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{dict.intentionDesc}</p>
                    </div>
                  </div>

                  {/* Recitation */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.recitationTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{dict.recitationDesc(weight)}</p>
                    </div>
                  </div>

                  {/* Closing */}
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-emerald-500 rounded-full my-1 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{dict.closingTitle}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{dict.closingDesc}</p>
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
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {dict.waitingDesc}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Wirds Section with Folders & Drag-and-Drop */}
      <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FolderIcon className="text-emerald-500" size={24} />
              {dict.savedTitle}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                >
                  {dict.addBtn}
                </button>
                <button
                  onClick={() => setIsAddingFolder(false)}
                  className="text-gray-400 text-xs hover:text-gray-600 px-1"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 flex flex-col min-h-[220px] transition-all hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">{getFolderName(folder.id, folder.name)}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">
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
                    <div className="h-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 text-center italic py-8">
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
                        <button
                          onClick={() => deleteWird(wird.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
                          title={dict.deleteWird}
                        >
                          <Trash2 size={13} />
                        </button>
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
