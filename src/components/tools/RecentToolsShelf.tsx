import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  ChevronRight,
  ChevronDown,
  Trash2,
  Star,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Tool } from '../../data/tools';
import { RecentToolItem, formatRecentTime, clearRecentTools } from '../../utils/toolRecentHistory';

interface RecentToolsShelfProps {
  recentItems: RecentToolItem[];
  allTools: Tool[];
  favoriteToolIds: string[];
  onToggleFavorite: (toolId: string) => void;
  onSelectTool: (tool: Tool) => void;
  onClearRecent: () => void;
}

export const RecentToolsShelf: React.FC<RecentToolsShelfProps> = ({
  recentItems,
  allTools,
  favoriteToolIds,
  onToggleFavorite,
  onSelectTool,
  onClearRecent,
}) => {
  const { language, t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!recentItems || recentItems.length === 0) {
    return null;
  }

  // Match items with full Tool data
  const validRecentTools = recentItems
    .map((item) => {
      const tool = allTools.find((t) => t.id === item.toolId);
      return tool ? { tool, timestamp: item.timestamp } : null;
    })
    .filter((item): item is { tool: Tool; timestamp: number } => item !== null);

  if (validRecentTools.length === 0) return null;

  return (
    <div className="mb-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xs transition-all">
      {/* Header bar */}
      <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5 select-none bg-emerald-500/5 dark:bg-emerald-950/20 border-b border-emerald-500/10">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer group min-w-0 flex-1"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs shrink-0">
            <Clock size={15} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                {language === 'fr'
                  ? 'Récemment consultés'
                  : language === 'ha'
                  ? 'Kayan aikin da aka yi amfani da su kwanan nan'
                  : 'Recently Consulted'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-600/15 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300">
                {validRecentTools.length}/5
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate hidden xs:block">
              {language === 'fr'
                ? 'Vos 5 derniers outils ouverts pour une reprise rapide'
                : 'Your last 5 opened tools for quick resume'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onClearRecent}
            className="p-1 sm:px-2 sm:py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title={language === 'fr' ? "Vider l'historique des outils récents" : 'Clear recent history'}
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">
              {language === 'fr' ? 'Vider' : language === 'ha' ? 'Share' : 'Clear'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Réduire' : 'Développer'}
          >
            <ChevronDown
              size={17}
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-emerald-600' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable list of 5 recent tools */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-2 sm:p-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {validRecentTools.map(({ tool, timestamp }, idx) => {
                const isFav = favoriteToolIds.includes(tool.id);
                const toolTitle =
                  t(`tools.${tool.id}.title`) !== `tools.${tool.id}.title`
                    ? t(`tools.${tool.id}.title`)
                    : tool.title;
                const timeLabel = formatRecentTime(timestamp, language);

                return (
                  <div
                    key={`recent-${tool.id}-${idx}`}
                    className="group relative bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 hover:border-emerald-500/50 rounded-xl p-2.5 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {React.createElement(tool.icon, { size: 14 })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {toolTitle}
                          </h4>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 block truncate">
                            {timeLabel}
                          </span>
                        </div>
                      </div>

                      {/* Favorite button on recent item */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          isFav
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-gray-300 dark:text-gray-600 hover:text-amber-500'
                        }`}
                        title={
                          isFav
                            ? language === 'fr'
                              ? 'Retirer des favoris'
                              : 'Remove from favorites'
                            : language === 'fr'
                            ? 'Ajouter aux favoris'
                            : 'Add to favorites'
                        }
                      >
                        <Star
                          size={14}
                          className={isFav ? 'fill-amber-400 text-amber-500' : ''}
                        />
                      </button>
                    </div>

                    {/* Launch / Reopen button */}
                    <button
                      type="button"
                      onClick={() => onSelectTool(tool)}
                      className="w-full py-1 px-2 mt-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white dark:hover:text-white text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer group-hover:bg-emerald-600 group-hover:text-white"
                    >
                      <span>
                        {language === 'fr'
                          ? 'Reprendre'
                          : language === 'ha'
                          ? 'Bude'
                          : 'Resume'}
                      </span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
