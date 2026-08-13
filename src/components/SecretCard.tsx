import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, ScrollText, Crown } from 'lucide-react';
import { AsrarItem } from '../types';
import { getApiUrl } from '../lib/api';
import { getArticleImageUrl, getArticleFallbackImage, getThematicSvgPlaceholder, sanitizeImageSource } from '../utils/articleImageUtils';
import { reportImageError } from '../utils/imageDebugger';

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
  const [translated, setTranslated] = useState<{ title?: string; hook?: string }>({});

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

  // 2. Check local storage cache or auto-translate if missing
  useEffect(() => {
    if (language === 'fr') return;
    if (manualTitle && manualHook) return;

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
    const fetchAutoTranslation = async () => {
      try {
        const res = await fetch(getApiUrl('/api/translate-article'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            hook: item.hook || '',
            content: item.content || '',
            benefits: item.benefits || [],
            targetLanguage: language
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && (data.title || data.hook)) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            if (isMounted) {
              setTranslated({
                title: data.title,
                hook: data.hook
              });
            }
          }
        }
      } catch (e) {
        console.warn(`[SecretCard] Translation error for ${item.id} (${language}):`, e);
      }
    };

    fetchAutoTranslation();
    return () => { isMounted = false; };
  }, [item.id, item.title, item.hook, language, manualTitle, manualHook]);

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

  if (layoutMode === 'list') {
    return (
      <Link to={`/secret/${item.id}`} state={{ item }} className="block w-full group">
        <div className="flex flex-row h-[130px] sm:h-[150px] cursor-pointer bg-white dark:bg-gray-800 rounded-[1.25rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
          {/* Image Area */}
          <div className="w-[110px] sm:w-[140px] h-full relative bg-gray-100 dark:bg-gray-900 flex-shrink-0">
            <ImageWithFallback 
              src={resolvedImageUrl} 
              fallbackSrc={fallbackImageUrl}
              itemInfo={item}
              alt={displayTitle} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Badge */}
            <div className="absolute top-2 left-2 flex gap-1 z-10 max-w-[calc(100%-16px)]">
              {item.isPremium && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full flex items-center shadow-sm">
                  <Crown size={12} className="shrink-0" />
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide truncate">
                <span className="capitalize">{categoryLabel}</span>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-2 sm:p-3 flex-1 flex flex-col justify-center bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden">
            <h3 className="text-[15px] sm:text-[17px] font-bold text-gray-900 dark:text-gray-100 mb-1.5 leading-snug line-clamp-2 mt-0">
              {displayTitle}
            </h3>
            {displayHook && (
              <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-[12px] leading-relaxed line-clamp-2">
                {displayHook}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Grid1 and Grid2 modes
  const isGrid1 = layoutMode === 'grid1';

  return (
    <Link to={`/secret/${item.id}`} state={{ item }} className="block h-full group">
       <div className="flex flex-col h-full cursor-pointer bg-white dark:bg-gray-800 rounded-[1.5rem] sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
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
             <div className="absolute top-3 left-3 flex gap-1.5 z-10 transition-colors max-w-[calc(100%-24px)]">
               {item.isPremium && (
                 <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-full flex items-center shadow-md">
                   <Crown size={14} className="shrink-0" />
                 </div>
               )}
               <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide truncate whitespace-nowrap">
                 <span className="capitalize">{categoryLabel}</span>
               </div>
             </div>

             {/* Title Over Image */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none z-0"></div>
             <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
               <h3 className={`font-bold text-white mb-0 leading-snug drop-shadow-md line-clamp-3 ${isGrid1 ? 'text-[18px] sm:text-[20px]' : 'text-[14px] sm:text-[16px]'}`}>
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
  );
};

