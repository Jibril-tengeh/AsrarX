import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Sparkles,
  Shield,
  Bookmark,
  Zap,
  Moon,
  Flame,
  Compass,
  Folder,
  Plus,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ToolGroup,
  AVAILABLE_GROUP_ICONS,
  AVAILABLE_GROUP_COLORS,
  batchAddToolsToGroup,
  createCustomToolGroup,
} from '../../utils/toolGroupsManager';

interface BatchCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedToolIds: string[];
  groups: ToolGroup[];
  onSuccess: (targetGroupName: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Star,
  Sparkles,
  Shield,
  Bookmark,
  Zap,
  Moon,
  Flame,
  Compass,
  Folder,
};

export const BatchCategoryModal: React.FC<BatchCategoryModalProps> = ({
  isOpen,
  onClose,
  selectedToolIds,
  groups,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('quick_access');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupIcon, setNewGroupIcon] = useState<string>('Folder');
  const [newGroupColor, setNewGroupColor] = useState<string>('indigo');

  if (!isOpen) return null;

  const handleApply = () => {
    if (isCreatingNew) {
      if (!newGroupName.trim()) return;
      const created = createCustomToolGroup(
        newGroupName.trim(),
        selectedToolIds,
        newGroupIcon,
        newGroupColor
      );
      onSuccess(created.name);
      onClose();
    } else {
      const targetGroup = groups.find((g) => g.id === selectedGroupId);
      if (targetGroup) {
        batchAddToolsToGroup(targetGroup.id, selectedToolIds);
        onSuccess(targetGroup.name);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Folder size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {language === 'fr'
                    ? 'Ajouter à un groupe'
                    : language === 'ha'
                    ? 'Ƙara zuwa rukuni'
                    : 'Add to Group / Category'}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {selectedToolIds.length}{' '}
                  {language === 'fr'
                    ? 'outil(s) sélectionné(s)'
                    : language === 'ha'
                    ? 'kayan aiki da aka zaɓa'
                    : 'tool(s) selected'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mode Switch: Existing vs New */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  !isCreatingNew
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {language === 'fr'
                  ? 'Groupes Existants'
                  : language === 'ha'
                  ? 'Rukunan da ke akwai'
                  : 'Existing Groups'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNew(true)}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  isCreatingNew
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <Plus size={14} />
                <span>
                  {language === 'fr'
                    ? 'Nouveau Groupe'
                    : language === 'ha'
                    ? 'Sabuwar Rukuni'
                    : 'New Group'}
                </span>
              </button>
            </div>

            {!isCreatingNew ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {language === 'fr'
                    ? 'Sélectionnez le groupe de destination :'
                    : language === 'ha'
                    ? 'Zaɓi rukunin makoma:'
                    : 'Select target group:'}
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                  {groups.map((group) => {
                    const IconComp = ICON_MAP[group.icon] || Folder;
                    const isSelected = selectedGroupId === group.id;
                    const alreadyInGroupCount = selectedToolIds.filter((id) =>
                      group.toolIds.includes(id)
                    ).length;

                    return (
                      <div
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                            : 'border-gray-200 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                              group.color === 'amber'
                                ? 'bg-amber-500'
                                : group.color === 'emerald'
                                ? 'bg-emerald-500'
                                : group.color === 'purple'
                                ? 'bg-purple-500'
                                : group.color === 'rose'
                                ? 'bg-rose-500'
                                : group.color === 'cyan'
                                ? 'bg-cyan-500'
                                : 'bg-indigo-500'
                            }`}
                          >
                            <IconComp size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              <span>{group.name}</span>
                              {group.id === 'quick_access' && (
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded-full">
                                  ⭐ {language === 'fr' ? 'Favoris' : 'Favorites'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                              {group.toolIds.length}{' '}
                              {language === 'fr'
                                ? 'outils au total'
                                : language === 'ha'
                                ? 'kayan aiki gaba ɗaya'
                                : 'tools total'}
                              {alreadyInGroupCount > 0 && ` (${alreadyInGroupCount} déjà présent)`}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    {language === 'fr'
                      ? 'Nom de la catégorie'
                      : language === 'ha'
                      ? 'Sunan rukuni'
                      : 'Category Name'}
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder={
                      language === 'fr'
                        ? 'Ex: Mes Rituels de Protection, Calculs Quotidiens...'
                        : language === 'ha'
                        ? 'Misali: Ayyukan yau da kullun...'
                        : 'e.g., Protection Rituals, Daily Calculations...'
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    {language === 'fr' ? 'Icône' : language === 'ha' ? 'Alama' : 'Icon'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_GROUP_ICONS.map((item) => {
                      const IconComp = ICON_MAP[item.id] || Folder;
                      const isSelected = newGroupIcon === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setNewGroupIcon(item.id)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-xs'
                              : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                          title={item.label}
                        >
                          <IconComp size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    {language === 'fr' ? 'Couleur' : language === 'ha' ? 'Launi' : 'Color'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_GROUP_COLORS.map((col) => {
                      const isSelected = newGroupColor === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setNewGroupColor(col.id)}
                          className={`w-7 h-7 rounded-xl ${col.bg} flex items-center justify-center text-white transition-all ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-gray-900 scale-110 shadow-xs'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          title={col.label}
                        >
                          {isSelected && <Check size={14} className="stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Annuler' : language === 'ha' ? 'Soke' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isCreatingNew && !newGroupName.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CheckCircle2 size={14} />
              <span>
                {isCreatingNew
                  ? language === 'fr'
                    ? 'Créer et Ajouter'
                    : language === 'ha'
                    ? 'Ƙirƙira & Ƙara'
                    : 'Create & Add'
                  : language === 'fr'
                  ? 'Ajouter au groupe'
                  : language === 'ha'
                  ? 'Ƙara zuwa rukuni'
                  : 'Add to Group'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
