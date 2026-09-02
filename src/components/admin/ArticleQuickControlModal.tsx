import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, FolderOpen, Tag, Crown, Eye, Edit3, Copy, Trash2, 
  CheckCircle2, AlertCircle, Headphones, Sparkles, ExternalLink,
  Layers, ArrowRight, Save
} from 'lucide-react';
import { getArticleImageUrl } from '../../utils/articleImageUtils';

interface ArticleQuickControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: any | null;
  categories: any[];
  onUpdateStatus: (articleId: string, status: 'Published' | 'Draft') => Promise<void>;
  onUpdateCategory: (articleId: string, category: string, subCategory?: string) => Promise<void>;
  onTogglePremium: (articleId: string) => Promise<void>;
  onDuplicate: (article: any) => Promise<void>;
  onDelete: (articleId: string) => Promise<void>;
  onOpenFullEditor: (article: any) => void;
}

const DEFAULT_MAIN_CATEGORIES = [
  'Secrets & Pratiques',
  'Protection & Ruqyah',
  'Richesse & Ouverture',
  'Invocations & Douas',
  'Sciences Spirituelles',
  'Coran & Sourates',
  'Amour & Harmonie',
  'Santé & Guérison',
  'Zikr & Méditation'
];

export const ArticleQuickControlModal: React.FC<ArticleQuickControlModalProps> = ({
  isOpen,
  onClose,
  article,
  categories,
  onUpdateStatus,
  onUpdateCategory,
  onTogglePremium,
  onDuplicate,
  onDelete,
  onOpenFullEditor
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [customSubCategory, setCustomSubCategory] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPremium, setIsUpdatingPremium] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (article) {
      setSelectedCategory(article.category || 'Secrets & Pratiques');
      setSelectedSubCategory(article.subCategory || '');
      setCustomSubCategory(article.subCategory || '');
      setIsConfirmingDelete(false);
      setIsDeleting(false);
    }
  }, [article]);

  if (!isOpen || !article) return null;

  // Merge default categories and dynamic categories
  const allCategoryNames = Array.from(
    new Set([
      ...DEFAULT_MAIN_CATEGORIES,
      ...categories.map(c => c.name || c.title).filter(Boolean)
    ])
  );

  // Find category object for subcategories
  const currentCategoryObj = categories.find(
    c => (c.name || c.title) === selectedCategory
  );
  const availableSubCategories: string[] = currentCategoryObj?.subCategories?.map((s: any) => s.name || s) || [];

  const handleApplyCategoryChange = async () => {
    if (!selectedCategory) return;
    setIsSavingCategory(true);
    try {
      const finalSubCategory = selectedSubCategory === '__custom__' ? customSubCategory : (selectedSubCategory || customSubCategory);
      await onUpdateCategory(article.id, selectedCategory, finalSubCategory);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleStatusChange = async (newStatus: 'Published' | 'Draft') => {
    if (article.status === newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onUpdateStatus(article.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleTogglePremiumAccess = async () => {
    setIsUpdatingPremium(true);
    try {
      await onTogglePremium(article.id);
    } finally {
      setIsUpdatingPremium(false);
    }
  };

  const handleDuplicateClick = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate(article);
      onClose();
    } finally {
      setIsDuplicating(false);
    }
  };

  const articleImg = getArticleImageUrl(article);
  const articleTitle = article.title || article.title_fr || '(Sans titre)';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-850 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Gestion & Contrôle Total de l'Article</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Déplacez cet article, modifiez son statut, son accès VIP ou dupliquez-le en 1 clic.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* Article Summary Card */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
              <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 relative">
                {articleImg ? (
                  <img src={articleImg} alt={articleTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FolderOpen size={24} />
                  </div>
                )}
                {article.isPremium && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white font-bold text-[9px] rounded-full shadow-xs">
                    ★ VIP
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold rounded-md">
                    {article.category || 'Non catégorisé'}
                  </span>
                  {article.subCategory && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-semibold rounded-md">
                      {article.subCategory}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    article.status === 'Published' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {article.status === 'Published' ? '✓ Publié' : '✎ Brouillon'}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2">
                  {articleTitle}
                </h4>
                <p className="text-[11px] text-gray-400 font-mono">
                  ID: {article.id}
                </p>
              </div>
            </div>

            {/* SECTION 1: Déplacer dans une Catégorie */}
            <div className="p-4 sm:p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <FolderOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Déplacer vers une Catégorie</span>
                </label>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Actuelle : {article.category || 'Général'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Main Category */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Catégorie Principale :</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubCategory('');
                    }}
                    className="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {allCategoryNames.map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Sous-Catégorie (Optionnelle) :</span>
                  {availableSubCategories.length > 0 ? (
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white font-medium outline-none cursor-pointer"
                    >
                      <option value="">-- Aucune sous-catégorie --</option>
                      {availableSubCategories.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                      <option value="__custom__">+ Saisir une autre sous-catégorie...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="ex: Sourate Yassine, Verset Al-Kursi..."
                      value={customSubCategory}
                      onChange={(e) => setCustomSubCategory(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                    />
                  )}
                </div>
              </div>

              {selectedSubCategory === '__custom__' && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Nouvelle sous-catégorie personnalisée :</span>
                  <input
                    type="text"
                    placeholder="Entrez le nom de la sous-catégorie..."
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-xl p-2 text-xs text-gray-900 dark:text-white outline-none"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleApplyCategoryChange}
                disabled={isSavingCategory}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Save size={15} />
                <span>{isSavingCategory ? 'Déplacement en cours...' : `Déplacer vers "${selectedCategory}"`}</span>
              </button>
            </div>

            {/* SECTION 2: Statut de Publication & Accès VIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Statut Toggle */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2.5">
                <label className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Layers size={15} className="text-emerald-500" />
                  <span>Statut de Publication</span>
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Published')}
                    disabled={isUpdatingStatus}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      article.status === 'Published'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <CheckCircle2 size={14} /> Publié (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Draft')}
                    disabled={isUpdatingStatus}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      article.status !== 'Published'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <Tag size={14} /> Brouillon
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  {article.status === 'Published' 
                    ? 'Visible par tous les membres selon leur niveau d\'abonnement.' 
                    : 'Masqué dans le feed public, accessible uniquement aux admins.'}
                </p>
              </div>

              {/* VIP Premium Toggle */}
              <div className="p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Crown size={15} className="text-amber-500" />
                    <span>Niveau d'Accès VIP</span>
                  </label>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    article.isPremium ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {article.isPremium ? '★ Premium VIP' : 'Gratuit (Standard)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePremiumAccess}
                  disabled={isUpdatingPremium}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    article.isPremium
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-700 border border-amber-300 dark:border-amber-700'
                  }`}
                >
                  <Crown size={15} className={article.isPremium ? 'text-white' : 'text-amber-500'} />
                  <span>{article.isPremium ? 'Rendre Gratuit (Tout le monde)' : 'Verrouiller pour VIP Premium'}</span>
                </button>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {article.isPremium ? 'Réservé aux membres ayant un abonnement actif.' : 'Accessible gratuitement à tous les utilisateurs.'}
                </p>
              </div>
            </div>

            {/* Audio Recitation Info */}
            {(article.audioUrl || article.audio_url) && (
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Headphones size={18} className="text-blue-500 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Récitation Audio Disponible
                    </h5>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 truncate max-w-xs">
                      {article.audioTitle || 'Fichier audio attaché'}
                    </p>
                  </div>
                </div>
                <audio controls src={article.audioUrl || article.audio_url} className="h-8 max-w-[160px]" />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDuplicateClick}
                disabled={isDuplicating}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Créer une copie en brouillon"
              >
                <Copy size={14} />
                <span>{isDuplicating ? 'Duplication...' : 'Dupliquer'}</span>
              </button>

              {!isConfirmingDelete ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Supprimer définitivement ce secret"
                >
                  <Trash2 size={14} />
                  <span>Supprimer</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 p-1 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
                  <button
                    type="button"
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await onDelete(article.id);
                        onClose();
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? 'Suppression...' : 'Confirmer ?'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="px-2 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullEditor(article);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Éditeur Complet</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
