import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Layers
} from 'lucide-react';
import { ArticleSecretItem } from '../../types';

interface MultiSecretArticleContentProps {
  content?: string;
  secrets?: ArticleSecretItem[];
  articleTitle?: string;
  readingMode?: boolean;
  fontSize?: number;
  style?: React.CSSProperties;
}

interface ParsedSubSection {
  id: string;
  type: 'objectif' | 'exemple' | 'anniyya' | 'effet' | 'rouqya' | 'generic';
  title: string;
  htmlContent: string;
}

interface ParsedSecret {
  id: string;
  title: string;
  introHtml?: string;
  subSections: ParsedSubSection[];
}

/**
 * Detects canonical sub-section types
 */
const detectSubSectionType = (title: string): 'objectif' | 'exemple' | 'anniyya' | 'effet' | 'rouqya' | 'generic' => {
  const norm = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (norm.includes('objectif') || norm.includes('but') || norm.includes('finalite')) return 'objectif';
  if (norm.includes('exemple') || norm.includes('cas') || norm.includes('illustration')) return 'exemple';
  if (norm.includes('anniyya') || norm.includes('niyya') || norm.includes('intention')) return 'anniyya';
  if (norm.includes('effet') || norm.includes('bienfait') || norm.includes('resultat') || norm.includes('impact')) return 'effet';
  if (norm.includes('rouqya') || norm.includes('ruqya') || norm.includes('roqya') || norm.includes('methode de rouqya') || norm.includes('protocole')) return 'rouqya';
  return 'generic';
};

/**
 * Single Accordion Item - Style fidèle et visible conforme à l'Image 2
 * (Titre grand et bien noir en majuscules gras à gauche, flèche nette et épaisse à droite)
 */
const SubSectionAccordionItem: React.FC<{
  sub: ParsedSubSection;
  readingMode: boolean;
  fontSize: number;
}> = ({ sub, readingMode, fontSize }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Titre en majuscules épuré comme sur l'Image 2
  const displayTitle = useMemo(() => {
    const raw = (sub.title || '').trim();
    if (raw) return raw.toUpperCase();
    switch (sub.type) {
      case 'objectif': return "L'OBJECTIF";
      case 'exemple': return 'EXEMPLE';
      case 'anniyya': return 'NIYYA SIMPLE';
      case 'effet': return "L'EFFET";
      case 'rouqya': return 'MÉTHODES DE ROUQYA';
      default: return 'MÉTHODE DE PRATIQUE';
    }
  }, [sub.title, sub.type]);

  const headingFontSize = Math.max(15, fontSize ? fontSize + 1 : 15);

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden my-3 ${
      readingMode
        ? 'border-[#e8dcb5] dark:border-[#524830]/60 bg-[#f9f5e9]/60 dark:bg-[#2b2518]/30'
        : 'border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 shadow-2xs'
    } ${isOpen ? 'ring-1 ring-emerald-500/30 border-emerald-500/40' : ''}`}>
      {/* Clickable Section Heading */}
      <h3 className="m-0 p-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors cursor-pointer select-none ${
            readingMode
              ? 'hover:bg-[#f4ebd0]/40 dark:hover:bg-[#383120]/30 text-[#4a3f35] dark:text-[#d4c39c]'
              : 'hover:bg-gray-50/80 dark:hover:bg-gray-750 text-gray-950 dark:text-white'
          }`}
        >
          <span 
            className="font-black tracking-normal uppercase text-gray-950 dark:text-white pr-3"
            style={{ fontSize: `${headingFontSize}px` }}
          >
            {displayTitle}
          </span>
          <ChevronDown 
            size={21} 
            strokeWidth={2.5}
            className={`text-gray-900 dark:text-gray-100 transform transition-transform duration-300 shrink-0 ${
              isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
            }`} 
          />
        </button>
      </h3>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div 
              className={`p-4 sm:p-5 border-t text-xs sm:text-sm leading-relaxed prose dark:prose-invert max-w-none break-words ${
                readingMode 
                  ? 'border-[#e8dcb5]/60 dark:border-[#524830]/40 text-[#363028] dark:text-[#c4b79d]' 
                  : 'border-gray-100 dark:border-gray-700/80 text-gray-800 dark:text-gray-200'
              }`}
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: sub.htmlContent }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Single Secret Accordion (Utilisé UNIQUEMENT quand l'article contient plusieurs secrets)
 */
const SingleSecretAccordionCard: React.FC<{
  secret: ParsedSecret;
  secretIndex: number;
  totalSecrets: number;
  readingMode: boolean;
  fontSize: number;
}> = ({ secret, secretIndex, totalSecrets, readingMode, fontSize }) => {
  // Le premier secret est ouvert par défaut pour un confort de lecture immédiat, les autres repliés
  const [isOpen, setIsOpen] = useState(secretIndex === 0);

  return (
    <div className={`rounded-2xl sm:rounded-3xl border transition-all overflow-hidden my-4 shadow-xs hover:shadow-md ${
      readingMode
        ? 'border-[#e8dcb5] dark:border-[#524830]/60 bg-[#fbf8ee] dark:bg-[#231e14]'
        : 'border-gray-200/90 dark:border-gray-700/90 bg-white dark:bg-gray-800'
    } ${isOpen ? 'ring-2 ring-emerald-500/30 border-emerald-500/40' : ''}`}>
      
      {/* Secret Title Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors cursor-pointer select-none ${
          readingMode
            ? 'bg-[#f4ebd0]/40 hover:bg-[#f4ebd0]/70 dark:bg-[#383120]/30 dark:hover:bg-[#383120]/50 text-[#4a3f35] dark:text-[#d4c39c]'
            : 'hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-3">
          {/* Secret Number Badge */}
          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
            #{secretIndex + 1}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Secret {secretIndex + 1} sur {totalSecrets}
              </span>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight line-clamp-2 leading-snug">
              {secret.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${
            isOpen ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
            {isOpen ? 'Ouvert' : 'Afficher'}
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
          }`}>
            <ChevronDown size={18} />
          </div>
        </div>
      </button>

      {/* Secret Body (when opened) */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700/60 space-y-4">
              
              {/* Optional Intro/General text before H3 sub-titles */}
              {secret.introHtml && secret.introHtml.trim() && (
                <div 
                  className={`prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl ${
                    readingMode 
                      ? 'bg-[#f4ebd0]/30 text-[#363028] dark:text-[#c4b79d]' 
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 text-gray-700 dark:text-gray-300 border border-emerald-100 dark:border-emerald-900/30'
                  }`}
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: secret.introHtml }}
                />
              )}

              {/* Sub-sections conformes au design épuré de l'Image 1 */}
              {secret.subSections.length > 0 && (
                <div className="space-y-1 pt-1">
                  {secret.subSections.map((sub) => (
                    <SubSectionAccordionItem 
                      key={`sub-${secret.id}-${sub.id}`} 
                      sub={sub} 
                      readingMode={readingMode} 
                      fontSize={fontSize} 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MultiSecretArticleContent: React.FC<MultiSecretArticleContentProps> = ({
  content = '',
  secrets,
  articleTitle = 'Secret Spirituel',
  readingMode = false,
  fontSize = 16,
  style,
}) => {
  // Parse secrets and detect whether this article actually contains MULTIPLE secrets
  const { isMultiSecret, parsedSecrets, singleIntroHtml, singleSubSections } = useMemo(() => {
    // 1. If explicit structured `secrets` array is provided from Admin Builder:
    if (secrets && Array.isArray(secrets) && secrets.length > 0) {
      const items: ParsedSecret[] = secrets.map((item, idx) => {
        const subs: ParsedSubSection[] = [];
        if (item.objectif?.trim()) {
          subs.push({ id: `obj-${idx}`, type: 'objectif', title: "L'OBJECTIF", htmlContent: item.objectif });
        }
        if (item.exemple?.trim()) {
          subs.push({ id: `ex-${idx}`, type: 'exemple', title: 'EXEMPLE', htmlContent: item.exemple });
        }
        if (item.anniyya?.trim()) {
          subs.push({ id: `ann-${idx}`, type: 'anniyya', title: 'NIYYA SIMPLE', htmlContent: item.anniyya });
        }
        if (item.additionalContent?.trim() && !item.methodesRouqya?.trim()) {
          subs.push({ id: `add-${idx}`, type: 'generic', title: 'MÉTHODE DE PRATIQUE', htmlContent: item.additionalContent });
        }
        if (item.effet?.trim()) {
          subs.push({ id: `eff-${idx}`, type: 'effet', title: "L'EFFET", htmlContent: item.effet });
        }
        if (item.methodesRouqya?.trim()) {
          subs.push({ id: `roq-${idx}`, type: 'rouqya', title: 'MÉTHODES DE ROUQYA', htmlContent: item.methodesRouqya });
        }
        if (item.additionalContent?.trim() && item.methodesRouqya?.trim()) {
          subs.push({ id: `add-${idx}`, type: 'generic', title: 'MÉTHODE DE PRATIQUE', htmlContent: item.additionalContent });
        }

        return {
          id: item.id || `secret-${idx}`,
          title: item.title || `Secret #${idx + 1}`,
          subSections: subs
        };
      });

      // Si l'admin a publié AU MOINS 2 secrets -> Mode multi-secrets activé
      if (items.length >= 2) {
        return {
          isMultiSecret: true,
          parsedSecrets: items,
          singleIntroHtml: '',
          singleSubSections: []
        };
      }

      // Si l'admin a publié un SEUL secret -> Mode normal direct (aucun accordéon conteneur #1)
      if (items.length === 1) {
        return {
          isMultiSecret: false,
          parsedSecrets: items,
          singleIntroHtml: content && !/<h[123]/.test(content) ? content : '',
          singleSubSections: items[0].subSections
        };
      }
    }

    // 2. Parse from HTML string using DOMParser
    if (!content || !content.trim()) {
      return {
        isMultiSecret: false,
        parsedSecrets: [],
        singleIntroHtml: '',
        singleSubSections: []
      };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // Le système détecte H1 et H2 comme titres des secrets
      const titleHeadings = Array.from(doc.body.querySelectorAll('h1, h2')).filter(
        (el) => (el.textContent || '').trim().length > 0
      );

      const h3Elements = Array.from(doc.body.querySelectorAll('h3'));

      // SI ET SEULEMENT SI le système détecte AU MOINS 2 titres (H1, H2),
      // il applique automatiquement le mode de plusieurs secrets sur une même page !
      if (titleHeadings.length >= 2) {
        const result: ParsedSecret[] = [];
        const bodyChildren = Array.from(doc.body.childNodes);
        
        let currentSecretTitle = '';
        let currentIntroHtml = '';
        let currentSubs: ParsedSubSection[] = [];
        let currentSubTitle = '';
        let currentSubHtml = '';
        let currentSubType: 'objectif' | 'exemple' | 'anniyya' | 'effet' | 'rouqya' | 'generic' = 'generic';
        let secretIdx = 0;

        const flushSub = () => {
          if (currentSubTitle.trim() && currentSubHtml.trim()) {
            currentSubs.push({
              id: `sub-${secretIdx}-${currentSubs.length}`,
              type: currentSubType,
              title: currentSubTitle,
              htmlContent: currentSubHtml
            });
            currentSubTitle = '';
            currentSubHtml = '';
          }
        };

        const flushSecret = () => {
          flushSub();
          if (currentSecretTitle.trim()) {
            result.push({
              id: `secret-${secretIdx}`,
              title: currentSecretTitle,
              introHtml: currentIntroHtml,
              subSections: [...currentSubs]
            });
            secretIdx++;
            currentIntroHtml = '';
            currentSubs = [];
          }
        };

        bodyChildren.forEach((node) => {
          const nodeName = node.nodeName.toLowerCase();
          
          // H1 ou H2 = Nouveau Secret détecté
          if (nodeName === 'h1' || nodeName === 'h2') {
            flushSecret();
            currentSecretTitle = node.textContent?.trim() || `Secret #${secretIdx + 1}`;
          } else if (nodeName === 'h3') {
            flushSub();
            currentSubTitle = node.textContent?.trim() || 'Sous-section';
            currentSubType = detectSubSectionType(currentSubTitle);
          } else {
            const htmlChunk = node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : (node.textContent || '');
            if (currentSubTitle) {
              currentSubHtml += htmlChunk;
            } else {
              currentIntroHtml += htmlChunk;
            }
          }
        });

        flushSecret();

        if (result.length >= 2) {
          return {
            isMultiSecret: true,
            parsedSecrets: result,
            singleIntroHtml: '',
            singleSubSections: []
          };
        }
      }

      // CAS MONO-SECRET : Un seul secret (0 ou 1 H1/H2)
      // Aucun accordéon global #1 SECRET SPIRITUEL !
      // Style épuré conforme à l'Image 1.
      if (h3Elements.length > 0) {
        const subs: ParsedSubSection[] = [];
        let introHtml = '';
        let currentSubTitle = '';
        let currentSubHtml = '';
        let currentSubType: 'objectif' | 'exemple' | 'anniyya' | 'effet' | 'rouqya' | 'generic' = 'generic';
        let subIdx = 0;

        const flushSub = () => {
          if (currentSubTitle.trim() && currentSubHtml.trim()) {
            subs.push({
              id: `single-sub-${subIdx++}`,
              type: currentSubType,
              title: currentSubTitle,
              htmlContent: currentSubHtml
            });
            currentSubTitle = '';
            currentSubHtml = '';
          }
        };

        Array.from(doc.body.childNodes).forEach((node) => {
          const nodeName = node.nodeName.toLowerCase();
          if (nodeName === 'h3') {
            flushSub();
            currentSubTitle = node.textContent?.trim() || 'Sous-section';
            currentSubType = detectSubSectionType(currentSubTitle);
          } else {
            const chunk = node.nodeType === Node.ELEMENT_NODE ? (node as Element).outerHTML : (node.textContent || '');
            if (currentSubTitle) {
              currentSubHtml += chunk;
            } else {
              introHtml += chunk;
            }
          }
        });

        flushSub();

        return {
          isMultiSecret: false,
          parsedSecrets: [],
          singleIntroHtml: introHtml,
          singleSubSections: subs
        };
      }

      // Standard HTML sans H3
      return {
        isMultiSecret: false,
        parsedSecrets: [],
        singleIntroHtml: content,
        singleSubSections: []
      };

    } catch (err) {
      console.warn('Error parsing article content in MultiSecretArticleContent:', err);
      return {
        isMultiSecret: false,
        parsedSecrets: [],
        singleIntroHtml: content,
        singleSubSections: []
      };
    }
  }, [content, secrets, articleTitle]);

  // =========================================================================
  // CAS 1 : MODE MULTI-SECRETS ACTIVÉ (UNIQUEMENT SI L'ADMIN A PUBLIÉ PLUSIEURS SECRETS)
  // =========================================================================
  if (isMultiSecret && parsedSecrets.length >= 2) {
    return (
      <div className="w-full max-w-full space-y-4" style={style}>
        {/* Bandeau d'information multi-secrets */}
        <div className="flex items-center justify-between px-1 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
          <span className="font-extrabold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <Layers size={15} />
            <span>{parsedSecrets.length} secrets spirituels réunis sur cette page</span>
          </span>
          <span className="text-[11px] opacity-75 hidden xs:inline">
            Cliquez sur un secret pour le lire
          </span>
        </div>

        {parsedSecrets.map((secret, sIdx) => (
          <SingleSecretAccordionCard
            key={`secret-card-${secret.id}-${sIdx}`}
            secret={secret}
            secretIndex={sIdx}
            totalSecrets={parsedSecrets.length}
            readingMode={readingMode}
            fontSize={fontSize}
          />
        ))}
      </div>
    );
  }

  // =========================================================================
  // CAS 2 : ARTICLE UNIQUE / SECRET UNIQUE (PAR DÉFAUT POUR TOUS LES AUTRES ARTICLES)
  // Design épuré identique à l'Image 1 : Titres clairs en majuscules, chevrons sobres, zéro pill/badge.
  // =========================================================================
  return (
    <div className="single-secret-direct-view w-full max-w-full space-y-3" style={style}>
      {/* Contenu principal ou texte d'introduction */}
      {singleIntroHtml && singleIntroHtml.trim() && (
        <div 
          className={`prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed break-words mb-4 ${
            readingMode 
              ? 'text-[#363028] dark:text-[#c4b79d]' 
              : 'text-gray-800 dark:text-gray-200'
          }`}
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: singleIntroHtml }}
        />
      )}

      {/* Accordéons structurés identiques à l'Image 1 */}
      {singleSubSections.length > 0 && (
        <div className="space-y-3 pt-1">
          {singleSubSections.map((sub) => (
            <SubSectionAccordionItem 
              key={`single-sub-${sub.id}`} 
              sub={sub} 
              readingMode={readingMode} 
              fontSize={fontSize} 
            />
          ))}
        </div>
      )}

      {/* Fallback de sécurité si aucun HTML n'a été produit */}
      {!singleIntroHtml && singleSubSections.length === 0 && (
        <div 
          className={`prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed break-words ${
            readingMode ? 'text-[#363028] dark:text-[#c4b79d]' : 'text-gray-800 dark:text-gray-200'
          }`}
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};
