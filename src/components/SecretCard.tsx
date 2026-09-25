import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, ScrollText, Crown, Headphones, Share2 } from 'lucide-react';
import { AsrarItem } from '../types';
import { getApiUrl } from '../lib/api';
import { getArticleImageUrl, getArticleFallbackImage, getThematicSvgPlaceholder, sanitizeImageSource } from '../utils/articleImageUtils';
import { reportImageError } from '../utils/imageDebugger';
import { ArticleShareModal } from './article/ArticleShareModal';
import { useFeatures } from '../contexts/FeatureContext';
import { 
  is3DCardEffectEnabled, 
  get3DCardTheme, 
  get3DCardIntensity, 
  get3DCardContainerClasses, 
  Card3DTopShine 
} from '../utils/card3dUtils';

export type LayoutMode = 'grid2' | 'grid1' | 'list';

interface SecretCardProps {
  item: AsrarItem;
  layoutMode?: LayoutMode;
  categories?: any[];
}

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  fallbackSrc?: string;
  itemInfo?: { id?: string; title?: string; category?: string; subCategory?: string };
  className?: string;
  [key: string]: any;
}> = ({ src, alt, fallbackSrc, itemInfo, className, ...props }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(() => sanitizeImageSource(src));
  const svgFallback = getThematicSvgPlaceholder(itemInfo);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sanitized = sanitizeImageSource(src);
    setCurrentSrc(sanitized);
    setStatus('loading');
  }, [src]);

  const handleError = () => {
    // Intercept and report error to ImageDebugger
    if (currentSrc && !currentSrc.startsWith('data:image/svg+xml')) {
      reportImageError(currentSrc, { id: itemInfo?.id, title: itemInfo?.title || alt });
    }

    const sanitizedFallback = sanitizeImageSource(fallbackSrc);
    if (sanitizedFallback && currentSrc !== sanitizedFallback && currentSrc !== svgFallback) {
      setCurrentSrc(sanitizedFallback);
      setStatus('loading');
    } else if (currentSrc !== svgFallback) {
      // Tertiary fail-safe: Thematic SVG Data URI placeholder
      setCurrentSrc(svgFallback);
      setStatus('loading');
    } else {
      setStatus('loaded'); // SVG Data URI is guaranteed to load
    }
  };

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setStatus('loaded');
      } else if (imgRef.current.naturalWidth === 0 && currentSrc) {
        handleError();
      }
    }
  }, [currentSrc]);

  return (
    <div className="absolute inset-0 w-full h-full bg-gray-900 overflow-hidden">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse z-10">
           <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${status === 'error' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export const SecretCard: React.FC<SecretCardProps> = ({ item, layoutMode = 'grid2', categories }) => {
  const { t, language } = useLanguage();
  const { featureToggles } = useFeatures();
  const [translated, setTranslated] = useState<{ title?: string; hook?: string }>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 3D Card Relief configuration
  const is3D = is3DCardEffectEnabled(featureToggles, 'article');
  const cardTheme = get3DCardTheme(featureToggles);
  const cardIntensity = get3DCardIntensity(featureToggles);

  // 1. Check direct manual translation properties on item
  let manualTitle = '';
  let manualHook = '';

  if (language === 'en') {
    manualTitle = item.title_en || '';
    manualHook = item.hook_en || '';
  } else if (language === 'ha') {
    manualTitle = item.title_ha || '';
    manualHook = item.hook_ha || '';
  } else if (language === 'fr') {
    manualTitle = item.title_fr || item.title || '';
    manualHook = item.hook_fr || item.hook || '';
  }

  const needsTitleTranslation = !manualTitle && Boolean(item.title);
  const needsHookTranslation = !manualHook && Boolean(item.hook);

  // 2. Check local storage cache or translate if missing
  useEffect(() => {
    if (language === 'fr') return;
    if (!needsTitleTranslation && !needsHookTranslation) return;

    const cacheKey = `asrar_trans_${item.id}_${language}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.title || parsed.hook) {
          setTranslated({
            title: parsed.title,
            hook: parsed.hook
          });
          return;
        }
      }
    } catch (e) {}

    let isMounted = true;
    // Add jitter/stagger to avoid all cards hitting the backend simultaneously
    const timer = setTimeout(async () => {
      try {
        const textsToTranslate: Record<string, string> = {};
        if (needsTitleTranslation && item.title) textsToTranslate.title = item.title;
        if (needsHookTranslation && item.hook) textsToTranslate.hook = item.hook;

        if (Object.keys(textsToTranslate).length === 0) return;

        const res = await fetch(getApiUrl('/api/translate-text'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: textsToTranslate,
            targetLanguage: language
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data) {
            const transResult = {
              title: data.title || manualTitle || item.title,
              hook: data.hook || manualHook || item.hook
            };
            localStorage.setItem(cacheKey, JSON.stringify(transResult));
            if (isMounted) {
              setTranslated(transResult);
            }
          }
        }
      } catch (e) {
        // Silent fallback
      }
    }, Math.floor(Math.random() * 800) + 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [item.id, item.title, item.hook, language, needsTitleTranslation, needsHookTranslation, manualTitle, manualHook]);

  // Final display title and hook
  const displayTitle = manualTitle || translated.title || item.title;
  const displayHook = manualHook || translated.hook || item.hook || '';
  
  // Dynamic category resolution
  let categoryLabel = '';
  const catList = (categories && categories.length > 0) ? categories : (() => {
    try {
      const cached = localStorage.getItem('asrarhub_cached_categories');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  })();

  if (catList && catList.length > 0) {
    const matchedCat = catList.find((c: any) => 
      c.id === item.category || 
      c.id?.toLowerCase() === item.category?.toLowerCase() ||
      c.name?.toLowerCase() === item.category?.toLowerCase()
    );
    if (matchedCat) {
      categoryLabel = language === 'en' 
        ? (matchedCat.name_en || matchedCat.name) 
        : language === 'ha' 
        ? (matchedCat.name_ha || matchedCat.name) 
        : matchedCat.name;
    }
  }

  if (!categoryLabel) {
    if (item.category === 'secret') categoryLabel = t('secrets', "Secrets");
    else if (item.category === 'recette') categoryLabel = t('recettes', "Recettes");
    else if (item.category === 'wird') categoryLabel = t('wirds', "Wirds");
    else categoryLabel = item.category ? (item.category.charAt(0).toUpperCase() + item.category.slice(1)) : t('wirds', "Wirds");
  }

  const CategoryIcon = item.category === 'secret' ? BookOpen : item.category === 'recette' ? Sparkles : ScrollText;

  const resolvedImageUrl = getArticleImageUrl(item);
  const fallbackImageUrl = getArticleFallbackImage(item);

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const origin = window.location.origin;
    const shareUrl = `${origin}/secret/${item.id}`;
    const shareTitle = displayTitle;
    const shareDesc = displayHook || `Découvrez "${displayTitle}" sur AsrarHub`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Native share failed:', err);
      }
    }

    setIsShareModalOpen(true);
  };

  if (layoutMode === 'list') {
    return (
      <>
        <Link to={`/secret/${item.id}`} state={{ item }} className="block w-full group">
          <div className={`flex flex-row min-h-[130px] sm:min-h-[150px] cursor-pointer rounded-[1.25rem] overflow-hidden transition-all duration-300 relative ${
            is3D 
              ? get3DCardContainerClasses(cardTheme, cardIntensity, 'rounded-[1.25rem]') 
              : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:shadow-md group-hover:-translate-y-1'
          }`}>
            {/* Top specular reflection in 3D mode */}
            {is3D && <Card3DTopShine />}

            {/* Image Area */}
            <div className="w-[110px] sm:w-[140px] relative bg-gray-100 dark:bg-gray-900 flex-shrink-0">
              <ImageWithFallback 
                src={resolvedImageUrl} 
                fallbackSrc={fallbackImageUrl}
                itemInfo={item}
                alt={displayTitle} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Badge */}
              <div className="absolute top-2 left-2 flex gap-1 z-10 max-w-[calc(100%-16px)] flex-wrap">
                {item.isPremium && (
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full flex items-center shadow-sm">
                    <Crown size={12} className="shrink-0" />
                  </div>
                )}
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide truncate ${
                  is3D && cardTheme === 'gold_amber'
                    ? 'btn-3d-tactile-amber text-amber-950 font-bold'
                    : 'bg-black/60 backdrop-blur-md text-white'
                }`}>
                  <span className="capitalize">{categoryLabel}</span>
                </div>
                {(item.audioUrl || item.audio_url) && (
                  <div className="bg-amber-600/90 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm" title="Audio disponible">
                    <Headphones size={11} className="shrink-0" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden relative">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-1 leading-snug break-words mt-0 flex-1">
                    {displayTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={handleShareClick}
                    className={`p-1.5 -mr-1 -mt-1 rounded-full transition-colors shrink-0 cursor-pointer ${
                      is3D && cardTheme === 'gold_amber'
                        ? 'btn-3d-tactile-amber text-amber-950'
                        : 'text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-200/60 dark:hover:bg-gray-700'
                    }`}
                    title={language === 'fr' ? 'Partager cet article' : 'Share article'}
                  >
                    <Share2 size={14} />
                  </button>
                </div>
                {displayHook && (
                  <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-[12px] leading-relaxed line-clamp-2 mt-1">
                    {displayHook}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Share Modal Fallback */}
        <ArticleShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          article={{
            id: item.id,
            title: displayTitle,
            hook: displayHook,
            category: categoryLabel,
            imageUrl: resolvedImageUrl,
          }}
        />
      </>
    );
  }

  // Grid1 and Grid2 modes
  const isGrid1 = layoutMode === 'grid1';

  return (
    <>
      <Link to={`/secret/${item.id}`} state={{ item }} className="block h-full group">
         <div className={`flex flex-col h-full cursor-pointer rounded-[1.5rem] sm:rounded-2xl overflow-hidden transition-all duration-300 relative ${
           is3D 
             ? get3DCardContainerClasses(cardTheme, cardIntensity, 'rounded-[1.5rem] sm:rounded-2xl') 
             : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 group-hover:shadow-md group-hover:-translate-y-1'
         }`}>
            {/* Top specular reflection in 3D mode */}
            {is3D && <Card3DTopShine />}

            <div className={`w-full overflow-hidden relative bg-gray-100 dark:bg-gray-900 flex-shrink-0 ${isGrid1 ? 'aspect-video' : 'aspect-[4/5] sm:aspect-square'}`}>
               <ImageWithFallback 
                 src={resolvedImageUrl} 
                 fallbackSrc={fallbackImageUrl}
                 itemInfo={item}
                 alt={displayTitle} 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 referrerPolicy="no-referrer"
               />
               
               {/* Badge Over Image */}
               <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex gap-1.5 z-10 transition-colors max-w-[calc(100%-60px)] flex-wrap items-center">
                 {item.isPremium && (
                   <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center shadow-md">
                     <Crown size={14} className="shrink-0" />
                   </div>
                 )}
                 <div className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide truncate whitespace-nowrap shadow-sm ${
                   is3D && cardTheme === 'gold_amber'
                     ? 'btn-3d-tactile-amber text-amber-950 font-bold'
                     : 'bg-black/65 backdrop-blur-md text-white'
                 }`}>
                   <span className="capitalize">{categoryLabel}</span>
                 </div>
                 {(item.audioUrl || item.audio_url) && (
                   <div className="bg-amber-600/90 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide flex items-center gap-1 shadow-md" title="Audio disponible">
                     <Headphones size={12} className="shrink-0" />
                     <span className="hidden xs:inline text-[9px] uppercase">Audio</span>
                   </div>
                 )}
               </div>

               {/* Quick Share Button */}
               <button
                 type="button"
                 onClick={handleShareClick}
                 className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-15 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                   is3D && cardTheme === 'gold_amber'
                     ? 'btn-3d-tactile-amber text-amber-950'
                     : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/20'
                 }`}
                 title={language === 'fr' ? 'Partager cet article' : 'Share article'}
               >
                 <Share2 size={13} className="sm:w-3.5 sm:h-3.5" />
               </button>

               {/* Enhanced high-contrast gradient overlay so full multiline titles are always legible */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none z-0"></div>
               
               {/* Title Over Image: Full title without line-clamp truncation */}
               <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3.5 z-10">
                 <h3 className={`font-bold text-white mb-0 drop-shadow-md break-words ${
                   isGrid1 
                     ? 'text-[17px] sm:text-[20px] leading-snug' 
                     : 'text-[12.5px] sm:text-[14.5px] leading-[1.25] sm:leading-snug'
                 }`}>
                   {displayTitle}
                 </h3>
               </div>
            </div>
            
            {displayHook && (
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                 {/* Hook */}
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px] sm:text-[12px] line-clamp-3 mt-0">
                   {displayHook}
                 </p>
              </div>
            )}
         </div>
      </Link>

      {/* Share Modal Fallback */}
      <ArticleShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={{
          id: item.id,
          title: displayTitle,
          hook: displayHook,
          category: categoryLabel,
          imageUrl: resolvedImageUrl,
        }}
      />
    </>
  );
};

