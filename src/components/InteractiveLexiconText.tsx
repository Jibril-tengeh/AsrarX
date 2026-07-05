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
}

export const InteractiveLexiconText: React.FC<InteractiveLexiconTextProps> = ({
  content,
  className = '',
  isHtml = true
}) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [lexiqueData, setLexiqueData] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<{
    term: string;
    definition: string;
    x: number;
    y: number;
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
        const rect = target.getBoundingClientRect();
        
        // Calculate coordinate relative to document
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        setTooltip({
          term: termName,
          definition: termDef,
          x: rect.left + scrollX + rect.width / 2,
          y: rect.top + scrollY - 12
        });
      } else {
        setTooltip(null);
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
    <div ref={containerRef} className={`relative ${className}`}>
      <div 
        dangerouslySetInnerHTML={{ __html: getHighlightedContent() }} 
        className="prose dark:prose-invert max-w-none text-justify"
      />

      {/* Floating Tooltip Component */}
      <AnimatePresence>
        {tooltip && (
          <>
            {/* Tooltip Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transform: 'translate(-50%, -100%)',
                zIndex: 99999
              }}
              className="w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl border border-amber-100 dark:border-amber-900/50 shadow-2xl p-4 text-left pointer-events-auto select-text"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2 mb-2">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <BookOpen size={15} />
                  <span>{tooltip.term}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltip(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Definition */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                {tooltip.definition}
              </p>

              {/* Little triangle arrow at the bottom of tooltip */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-gray-800"
                style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))' }}
              />
            </motion.div>

            {/* Tap-out listener to close tooltip */}
            <div 
              className="fixed inset-0 z-[99998]" 
              onClick={() => setTooltip(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
