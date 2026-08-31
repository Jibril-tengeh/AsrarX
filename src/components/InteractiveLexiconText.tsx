import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, BookOpen } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';

interface InteractiveLexiconTextProps {
  content: string;
  className?: string;
  isHtml?: boolean;
  style?: React.CSSProperties;
}

export const InteractiveLexiconText: React.FC<InteractiveLexiconTextProps> = ({
  content,
  className = '',
  isHtml = true,
  style
}) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [lexiqueData, setLexiqueData] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<{
    term: string;
    definition: string;
  } | null>(null);

  const defaultLexiqueData = [
    { term: t('lexique.items.alif.term', "Alif (أ)"), category: t('lexique.categories.letters', "Lettres"), description: t('lexique.items.alif.desc', "Première lettre de l'alphabet arabe. Sa valeur numérique est 1. Elle symbolise l'Unicité Divine (Tawhid) et le principe de toute création.") },
    { term: t('lexique.items.ba.term', "Ba' (ب)"), category: t('lexique.categories.letters', "Lettres"), description: t('lexique.items.ba.desc', "Deuxième lettre. Valeur numérique 2. Symbolise le commencement de la création, car le Coran commence par le Bismillah.") },
    { term: t('lexique.items.ha.term', "Ha' (هـ)"), category: t('lexique.categories.letters', "Lettres"), description: t('lexique.items.ha.desc', "Valeur numérique 5. Représente l'Essence Divine (Huwa) et le souffle de vie.") },
    { term: t('lexique.items.zikr.term', "Zikr / Dhikr"), category: t('lexique.categories.concepts', "Concepts"), description: t('lexique.items.zikr.desc', "Le 'rappel' ou 'l'invocation'. Pratique spirituelle consistant à répéter les Noms de Dieu ou des formules sacrées.") },
    { term: t('lexique.items.wird.term', "Wird"), category: t('lexique.categories.concepts', "Concepts"), description: t('lexique.items.wird.desc', "Un exercice spirituel structuré et répété quotidiennement à des moments précis (souvent matin et soir).") },
    { term: t('lexique.items.talsam.term', "Talsam"), category: t('lexique.categories.concepts', "Concepts"), description: t('lexique.items.talsam.desc', "Formule ou sceau mystique condensant une énergie spirituelle ou une supplication prolongée.") },
    { term: t('lexique.items.num7.term', "Nombre 7"), category: t('lexique.categories.numbers', "Nombres"), description: t('lexique.items.num7.desc', "Nombre hautement symbolique : 7 cieux, 7 terres, 7 circumambulations (Tawaf), 7 versets de la Fatiha.") },
    { term: t('lexique.items.num66.term', "Nombre 66"), category: t('lexique.categories.numbers', "Nombres"), description: t('lexique.items.num66.desc', "Valeur numérique du Nom Majestueux 'Allah' selon le système Abjad classique.") },
    { term: t('lexique.items.khatim.term', "Khatim"), category: t('lexique.categories.concepts', "Concepts"), description: t('lexique.items.khatim.desc', "Un carré magique ou sceau utilisé pour concentrer et canaliser les énergies d'un verset ou d'un Nom Divin.") },
  ];

  // Load terms from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'lexique_terms'), (snapshot) => {
      const dbTerms = snapshot.docs.map(doc => {
        const data = doc.data();
        const lang = language;
        return {
          term: data[`word_${lang}`] || data.word,
          category: data.category,
          description: data[`definition_${lang}`] || data.definition
        };
      });
      
      const merged = [...defaultLexiqueData];
      dbTerms.forEach(dbItem => {
        if (dbItem.term && !merged.find(m => m.term.toLowerCase() === dbItem.term.toLowerCase())) {
          merged.push(dbItem);
        }
      });
      setLexiqueData(merged);
    }, (error) => {
      console.warn("InteractiveLexiconText Firestore error (operating offline):", error);
      setLexiqueData(defaultLexiqueData);
    });

    return () => unsubscribe();
  }, [language]);

  // Click handler delegation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTermClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.lexicon-term');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        
        const termName = target.getAttribute('data-term') || '';
        const termDef = target.getAttribute('data-definition') || '';
        
        setTooltip({
          term: termName,
          definition: termDef
        });
      }
    };

    container.addEventListener('click', handleTermClick);
    return () => {
      container.removeEventListener('click', handleTermClick);
    };
  }, []);

  // Escape regex helper
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Main highlighting function
  const getHighlightedContent = () => {
    if (!content) return '';
    const itemsToUse = lexiqueData.length > 0 ? lexiqueData : defaultLexiqueData;
    
    // Sort items by term length descending
    const sortedItems = [...itemsToUse].sort((a, b) => b.term.length - a.term.length);
    
    const keywordToItemMap: { [keyword: string]: any } = {};
    const allKeywords: string[] = [];
    
    sortedItems.forEach(item => {
      if (!item.term) return;
      
      const keywords: string[] = [item.term];
      
      // Extract clean keywords if term has format "Alif (أ)"
      if (item.term.includes('(')) {
        const clean = item.term.replace(/\s*\([^)]+\)/g, '').trim();
        if (clean) keywords.push(clean);
      }
      
      // Extract clean keywords if term has format "Zikr / Dhikr"
      if (item.term.includes('/')) {
        item.term.split('/').forEach((p: string) => {
          const clean = p.trim();
          if (clean) keywords.push(clean);
        });
      }
      
      // Plural extensions for common words
      const lowerTerm = item.term.toLowerCase();
      if (lowerTerm === 'wird') keywords.push('wirds');
      if (lowerTerm === 'talsam') keywords.push('talsams');
      if (lowerTerm === 'khatim') keywords.push('khatims');
      if (lowerTerm === 'secret') keywords.push('secrets');

      const uniqueKeywords = Array.from(new Set(keywords)).filter(Boolean);
      
      uniqueKeywords.forEach(kw => {
        // Skip short numeric keys like '7' as standalone matches in plain text to avoid noise
        if (kw.match(/^\d+$/) && kw.length < 3) return;
        
        allKeywords.push(kw);
        keywordToItemMap[kw.toLowerCase()] = item;
      });
    });
    
    allKeywords.sort((a, b) => b.length - a.length);
    
    if (allKeywords.length === 0) {
      return isHtml ? content : content.replace(/\n/g, '<br/>');
    }

    // Build standard boundaries (allowing French and Arabic characters)
    const escapedKws = allKeywords.map(escapeRegExp);
    
    // Split HTML to avoid matching keywords inside tag attributes
    const parts = isHtml ? content.split(/(<[^>]+>)/g) : [content];
    
    const processedParts = parts.map((part, index) => {
      if (index % 2 !== 0) {
        return part; // Inside a tag
      }
      
      // Outside tag, replace terms
      let text = part;
      
      // We can iterate over all keywords and replace them sequentially, 
      // but to prevent nested replacements, we use a single big regex
      const regexStr = `(?:^|\\s|\\b)(${escapedKws.join('|')})(?:s|es|\\s|\\b|$)`;
      const regex = new RegExp(regexStr, 'gi');
      
      return text.replace(regex, (match, capturedKeyword) => {
        const kwLower = capturedKeyword.toLowerCase();
        const matchedItem = keywordToItemMap[kwLower];
        if (!matchedItem) return match;
        
        const escapedTerm = matchedItem.term.replace(/"/g, '&quot;');
        const escapedDesc = matchedItem.description.replace(/"/g, '&quot;');
        
        const tooltipSpan = `<span class="lexicon-term font-semibold text-amber-600 dark:text-amber-400 border-b border-dotted border-amber-500 cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-950/40 px-1 rounded transition-all" data-term="${escapedTerm}" data-definition="${escapedDesc}">${capturedKeyword}</span>`;
        
        return match.replace(capturedKeyword, tooltipSpan);
      });
    });
    
    return processedParts.join('');
  };

  return (
    <div ref={containerRef} className={`w-full max-w-full break-words overflow-hidden relative ${className}`} style={style}>
      <div 
        dangerouslySetInnerHTML={{ __html: getHighlightedContent() }} 
        className="article-reader-container article-reader-content prose dark:prose-invert w-full max-w-full break-words overflow-hidden text-justify"
        style={style}
      />

      {/* Centered Popup Modal Component */}
      <AnimatePresence>
        {tooltip && (() => {
          const foundItem = lexiqueData.find(item => item.term === tooltip.term);
          const foundCategory = foundItem?.category || t('lexique.categories.concepts', 'Concepts');
          
          return (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              {/* Dark semi-transparent backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setTooltip(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-3xl border border-amber-100 dark:border-amber-900/40 shadow-2xl overflow-hidden text-left flex flex-col pointer-events-auto select-text"
              >
                {/* Header with warm ambient background */}
                <div className="bg-amber-50/50 dark:bg-amber-950/20 px-5 py-4 border-b border-amber-100/50 dark:border-amber-900/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
                        {foundCategory}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {tooltip.term}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setTooltip(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/40 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed max-h-[50vh] overflow-y-auto font-sans">
                  {tooltip.definition}
                </div>

                {/* Footer with close action button */}
                <div className="px-5 pb-5 pt-2 flex justify-end">
                  <button
                    onClick={() => setTooltip(null)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 font-semibold text-sm transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98]"
                  >
                    {t('close', 'D\'accord')}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
