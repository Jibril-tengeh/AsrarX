import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Lightbulb, 
  Heart, 
  Sparkles, 
  Shield, 
  Layers, 
  Copy,
  BookOpen,
  ArrowDown,
  ArrowUp,
  FileCode2
} from 'lucide-react';
import { ArticleSecretItem } from '../../types';

interface MultiSecretsBuilderProps {
  secrets: ArticleSecretItem[];
  onChange: (updatedSecrets: ArticleSecretItem[]) => void;
  onSyncToEditor: (html: string) => void;
}

export const MultiSecretsBuilder: React.FC<MultiSecretsBuilderProps> = ({
  secrets,
  onChange,
  onSyncToEditor,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleAddSecret = () => {
    const newIdx = secrets.length + 1;
    const newSecret: ArticleSecretItem = {
      id: `secret_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `Secret #${newIdx} : Titre du secret`,
      objectif: '',
      exemple: '',
      anniyya: '',
      effet: '',
      methodesRouqya: '',
      additionalContent: ''
    };
    const next = [...secrets, newSecret];
    onChange(next);
    setExpandedIndex(next.length - 1);
  };

  const handleUpdateSecret = (index: number, field: keyof ArticleSecretItem, value: string) => {
    const next = [...secrets];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleDeleteSecret = (index: number) => {
    if (window.confirm("Supprimer ce secret de la page ?")) {
      const next = secrets.filter((_, i) => i !== index);
      onChange(next);
      if (expandedIndex === index) {
        setExpandedIndex(next.length > 0 ? Math.max(0, index - 1) : null);
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === secrets.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const next = [...secrets];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next);
    setExpandedIndex(targetIdx);
  };

  // Compiles all structured secrets into standard semantic HTML with <h2> and <h3>
  const compileToHtml = (): string => {
    return secrets.map((s, idx) => {
      const title = s.title?.trim() || `Secret #${idx + 1}`;
      let html = `<h2>${title}</h2>\n`;

      if (s.objectif?.trim()) {
        html += `<h3>OBJECTIF</h3>\n<p>${s.objectif.trim().replace(/\n/g, '<br/>')}</p>\n`;
      }
      if (s.exemple?.trim()) {
        html += `<h3>EXEMPLE</h3>\n<p>${s.exemple.trim().replace(/\n/g, '<br/>')}</p>\n`;
      }
      if (s.anniyya?.trim()) {
        html += `<h3>ANNIYYA</h3>\n<p>${s.anniyya.trim().replace(/\n/g, '<br/>')}</p>\n`;
      }
      if (s.effet?.trim()) {
        html += `<h3>L'EFFET</h3>\n<p>${s.effet.trim().replace(/\n/g, '<br/>')}</p>\n`;
      }
      if (s.methodesRouqya?.trim()) {
        html += `<h3>MÉTHODES DE ROUQYA</h3>\n<p>${s.methodesRouqya.trim().replace(/\n/g, '<br/>')}</p>\n`;
      }
      if (s.additionalContent?.trim()) {
        html += `<p>${s.additionalContent.trim()}</p>\n`;
      }

      return html;
    }).join('\n<hr/>\n\n');
  };

  const handleSyncClick = () => {
    const compiled = compileToHtml();
    onSyncToEditor(compiled);
  };

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-slate-50/50 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-gray-900/40 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-200/60 dark:border-emerald-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Layers size={18} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>Gestionnaire de Secrets Multiples sur cette Page</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[11px] font-black">
                {secrets.length} secret{secrets.length > 1 ? 's' : ''}
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Chaque secret et ses sous-titres (OBJECTIF, EXEMPLE, ANNIYYA, L'EFFET, ROUQYA) seront fermés par défaut et s'ouvriront au clic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddSecret}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus size={14} />
            <span>Ajouter un Secret</span>
          </button>

          {secrets.length > 0 && (
            <button
              type="button"
              onClick={handleSyncClick}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Copier et synchroniser vers l'éditeur de texte principal"
            >
              <FileCode2 size={14} />
              <span>Générer dans l'Éditeur</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {secrets.length === 0 ? (
        <div className="text-center py-8 px-4 bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-700/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h5 className="font-bold text-xs text-gray-900 dark:text-white">
            Aucun secret additionnel configuré
          </h5>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Cliquez sur « Ajouter un Secret » ci-dessous pour publier plusieurs secrets indépendants sur cette même page avec la structure en sous-titres H3.
          </p>
          <button
            type="button"
            onClick={handleAddSecret}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Créer le Secret #1</span>
          </button>
        </div>
      ) : (
        /* Secret Cards List */
        <div className="space-y-3">
          {secrets.map((sec, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div 
                key={sec.id || `builder-secret-${idx}`}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs transition-all"
              >
                {/* Secret Card Header */}
                <div 
                  className={`p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                    isExpanded ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      {sec.title || `Secret #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-20 text-gray-500 cursor-pointer"
                      title="Monter"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === secrets.length - 1}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-20 text-gray-500 cursor-pointer"
                      title="Descendre"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSecret(idx)}
                      className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500 cursor-pointer ml-1"
                      title="Supprimer ce secret"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Secret Card Edit Fields */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 bg-gray-50/40 dark:bg-gray-850/40">
                    
                    {/* Secret Title */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                        TITRE DU SECRET (Bouton d'ouverture principal) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={sec.title || ''}
                        onChange={(e) => handleUpdateSecret(idx, 'title', e.target.value)}
                        placeholder="ex: Secret 1 : Pour la protection et l'ouverture divine..."
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      
                      {/* 1. OBJECTIF (H3) */}
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                          <Target size={13} />
                          <span>1. OBJECTIF (Sous-titre H3)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={sec.objectif || ''}
                          onChange={(e) => handleUpdateSecret(idx, 'objectif', e.target.value)}
                          placeholder="Qu'est-ce qu'on cherche à obtenir à travers ce secret..."
                          className="w-full bg-emerald-50/30 dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500 resize-y"
                        />
                      </div>

                      {/* 2. EXEMPLE (H3) */}
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-amber-200/80 dark:border-amber-900/50 space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-black text-amber-800 dark:text-amber-300">
                          <Lightbulb size={13} />
                          <span>2. EXEMPLE (Sous-titre H3)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={sec.exemple || ''}
                          onChange={(e) => handleUpdateSecret(idx, 'exemple', e.target.value)}
                          placeholder="Exemple pratique d'application, témoignage ou situation concrète..."
                          className="w-full bg-amber-50/30 dark:bg-gray-800 border border-amber-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none focus:border-amber-500 resize-y"
                        />
                      </div>

                      {/* 3. ANNIYYA (H3) */}
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-rose-200/80 dark:border-rose-900/50 space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-black text-rose-800 dark:text-rose-300">
                          <Heart size={13} />
                          <span>3. ANNIYYA / INTENTION (Sous-titre H3)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={sec.anniyya || ''}
                          onChange={(e) => handleUpdateSecret(idx, 'anniyya', e.target.value)}
                          placeholder="Formulation sacrée de l'intention (An-Niyya) avant de commencer..."
                          className="w-full bg-rose-50/30 dark:bg-gray-800 border border-rose-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none focus:border-rose-500 resize-y"
                        />
                      </div>

                      {/* 4. L'EFFET (H3) */}
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-purple-200/80 dark:border-purple-900/50 space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-black text-purple-800 dark:text-purple-300">
                          <Sparkles size={13} />
                          <span>4. L'EFFET (Sous-titre H3)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={sec.effet || ''}
                          onChange={(e) => handleUpdateSecret(idx, 'effet', e.target.value)}
                          placeholder="L'effet spirituel produit, sensations, durée d'action..."
                          className="w-full bg-purple-50/30 dark:bg-gray-800 border border-purple-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none focus:border-purple-500 resize-y"
                        />
                      </div>
                    </div>

                    {/* 5. MÉTHODES DE ROUQYA (H3) */}
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-blue-200/80 dark:border-blue-900/50 space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[11px] font-black text-blue-800 dark:text-blue-300">
                        <Shield size={13} />
                        <span>5. MÉTHODES DE ROUQYA / APPLICATION (Sous-titre H3)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={sec.methodesRouqya || ''}
                        onChange={(e) => handleUpdateSecret(idx, 'methodesRouqya', e.target.value)}
                        placeholder="Récitations spécifiques, préparation de l'eau coranisée, lavages, friction..."
                        className="w-full bg-blue-50/30 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 resize-y"
                      />
                    </div>

                    {/* Additional Content / Talasams / Verses */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                        Contenu Complémentaire (Formules, Zikrs, Nombres, Talasams - Optionnel)
                      </label>
                      <textarea
                        rows={2}
                        value={sec.additionalContent || ''}
                        onChange={(e) => handleUpdateSecret(idx, 'additionalContent', e.target.value)}
                        placeholder="Zikr complémentaire, heures favorables, talasams..."
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white outline-none focus:border-emerald-500 resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
