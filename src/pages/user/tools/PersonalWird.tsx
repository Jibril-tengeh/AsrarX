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
    waitingDesc: "Saisissez votre prénom et celui de votre mère en arabe pour découvrir votre Wird de résonance."
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
    waitingDesc: "Enter your first name and your mother's first name in Arabic to discover your resonance Dhikr."
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
    waitingDesc: "Shigar da sunanka da na mahaifiyarka da harshen Larabci don gano Wirdin da ya dace da kai."
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
    const nameStr = `Ya ${result.names.join(', Ya ')}`;
    const isAlreadySaved = savedWirds.some(w => w.name === nameStr && w.weight === weight);
    if (isAlreadySaved) {
      alert("Ce Wird est déjà enregistré.");
      return;
    }
    const newWird: SavedWird = {
      id: Date.now().toString(),
      name: nameStr,
      arabic: `يا ${result.names.join(' يا ')}`,
      weight,
      folderId: 'uncategorized',
      dateSaved: new Date().toISOString()
    };
    const updated = [...savedWirds, newWird];
    setSavedWirds(updated);
    localStorage.setItem('asrar_saved_wirds', JSON.stringify(updated));
    alert("Wird enregistré avec succès dans 'Non classés' ! Retrouvez-le ci-dessous.");
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
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-right font-arabic text-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    dir="rtl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{dict.motherDesc}</p>
              </div>

              <button
                onClick={calculateWird}
                disabled={!name || !motherName || isCalculating}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

        <div>
          {result && weight !== null ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-lg text-white"
            >
              <div className="text-center mb-8">
                <p className="text-emerald-100 mb-2 font-medium">{dict.weightTitle}</p>
                <div className="text-6xl font-bold font-serif mb-2">{weight}</div>
                <p className="text-emerald-100 text-sm">{dict.weightDesc}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center relative">
                <p className="text-emerald-100 mb-4 font-medium flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  {dict.supremeWird}
                </p>
                <div className="text-4xl sm:text-5xl font-arabic font-bold mb-4 leading-tight" dir="rtl">
                  يا {result.names.join(' يا ')}
                </div>
                <p className="text-lg font-medium mb-1">Ya {result.names.join(', Ya ')}</p>
                
                <div className="mt-6 pt-6 border-t border-white/20 text-sm text-emerald-50 mb-4">
                  <p>{dict.valueZikr(result.totalAbjad)}</p>
                  {result.diff === 0 ? (
                    <p className="mt-2 text-yellow-300 font-medium">{dict.perfectMatch}</p>
                  ) : (
                    <p className="mt-2">{dict.minorGap(result.diff)}</p>
                  )}
                </div>

                <button
                  onClick={saveWird}
                  className="w-full bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 transition-all font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Save size={18} />
                  Enregistrer ce Wird
                </button>
              </div>
              
              <div className="mt-6 bg-emerald-800/50 rounded-xl p-4 text-sm text-emerald-100 flex items-start gap-3">
                <BookOpen size={20} className="shrink-0 mt-0.5 text-emerald-300" />
                <p>{dict.recitationGuideline(weight)}</p>
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
              Mes Wirds Enregistrés
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Glissez-déposez vos wirds dans les dossiers pour les organiser (ou utilisez le sélecteur)
            </p>
          </div>
          
          {/* Add Folder */}
          <div className="flex items-center gap-2">
            {isAddingFolder ? (
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Nom du dossier..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  className="bg-transparent text-sm px-2 py-1 outline-none text-gray-900 dark:text-white max-w-[150px]"
                  autoFocus
                />
                <button
                  onClick={addFolder}
                  className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setIsAddingFolder(false)}
                  className="text-gray-400 text-xs hover:text-gray-600 px-1"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingFolder(true)}
                className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-sm border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                + Créer un dossier
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
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">{folder.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-bold">
                      {folderWirds.length}
                    </span>
                    {folder.id !== 'uncategorized' && folder.id !== 'daily' && folder.id !== 'special' && folder.id !== 'healing' && (
                      <button
                        onClick={() => deleteFolder(folder.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                        title="Supprimer le dossier"
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
                      Glissez des wirds ici
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
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                          title="Supprimer de mes wirds"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="font-arabic text-right text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-1" dir="rtl">
                          {wird.arabic}
                        </div>
                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate pr-4">
                          {wird.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                          <span>Fréquence : {wird.weight}</span>
                          
                          {/* Selector fallback for accessibility and mobile */}
                          <select
                            value={wird.folderId}
                            onChange={(e) => moveWirdToFolder(wird.id, e.target.value)}
                            className="bg-transparent border-0 font-semibold text-[10px] text-emerald-600 dark:text-emerald-400 outline-none cursor-pointer hover:underline p-0 m-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {folders.map(f => (
                              <option key={f.id} value={f.id} className="text-gray-800 dark:text-gray-200">
                                Vers : {f.name}
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
