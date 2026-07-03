import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Sparkles,
  ScrollText,
  Bookmark,
  BookType,
  Share2,
  AlignLeft,
  ListTree,
  ChevronDown,
  Heart,
  Shield,
  Droplets,
  Users,
  Crown,
  Maximize2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getAsrarItems } from "../../data/store";
import { AsrarItem } from "../../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../../components/AuthModal';

const AccordionSection: React.FC<{ title: string, htmlContent: string, readingMode: boolean }> = ({ title, htmlContent, readingMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-colors overflow-hidden ${readingMode ? "border-[#e8dcb5] dark:border-[#524830]/50" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold transition-colors ${
          readingMode 
            ? "bg-[#f4ebd0]/30 hover:bg-[#f4ebd0]/50 dark:bg-[#383120]/20 dark:hover:bg-[#383120]/40 text-[#4a3f35] dark:text-[#d4c39c]"
            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white"
        }`}
      >
        <span className="text-lg">{title}</span>
        <ChevronDown size={20} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className={`p-4 sm:p-5 border-t ${readingMode ? "border-[#e8dcb5] dark:border-[#524830]/50 text-[#363028] dark:text-[#c4b79d]" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"}`}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert max-w-none" />
        </div>
      )}
    </div>
  );
};

export const SecretDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [item, setItem] = useState<AsrarItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [readingMode, setReadingMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [zenFontSize, setZenFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [zenTheme, setZenTheme] = useState<'cream' | 'dark' | 'white'>('cream');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewMode, setViewMode] = useState<'full' | 'accordion'>('full');
  const [rating, setRating] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (zenMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [zenMode]);

  useEffect(() => {
    // Scroll to top when loading
    window.scrollTo(0, 0);
    const items = getAsrarItems();
    const foundItem = items.find((i) => i.id === id);
    
    const checkBookmark = (itemId: string) => {
      try {
        const parsed = JSON.parse(
          localStorage.getItem("asrar_bookmarks") || "[]",
        );
        setIsBookmarked(
          Array.isArray(parsed) ? parsed.includes(itemId) : false,
        );
      } catch (e) {
        setIsBookmarked(false);
      }
    };

    if (foundItem) {
      setItem(foundItem);
      checkBookmark(foundItem.id);
    } else if (id) {
      // Try to fetch from Firestore
      const fetchFromFirestore = async () => {
        try {
          const docRef = doc(db, 'articles', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const activeTitle = language === 'fr' ? data.title : data[`title_${language}`] || data.title;
            const activeContent = language === 'fr' ? data.content : data[`content_${language}`] || data.content;
            let activeHook = language === 'fr' ? data.hook : data[`hook_${language}`] || data.hook || '';
            
            if (!activeHook && activeContent) {
              activeHook = activeContent.replace(/<[^>]+>/g, '').substring(0, 120) + '...';
            }
            
            setItem({
              id: docSnap.id,
              title: activeTitle,
              hook: activeHook,
              category: data.category || 'recette',
              content: activeContent,
              benefits: data.benefits || [],
              imageUrl: data.thumbnail,
              isPremium: data.isPremium || false,
              createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
            } as AsrarItem);
            checkBookmark(docSnap.id);
          } else {
            setNotFound(true);
          }
        } catch (error) {
          console.error("Error fetching article from Firestore", error);
          setNotFound(true);
        }
      };
      fetchFromFirestore();
    } else {
      setNotFound(true);
    }
  }, [id, language]);

  const [isCheckingPremium, setIsCheckingPremium] = useState(true);

  useEffect(() => {
    if (item) {
      if (item.isPremium) {
        if (authLoading) {
           setIsCheckingPremium(true);
        } else if (!user) {
           setIsCheckingPremium(true);
           setShowAuthModal(true);
        } else if (user.subscriptionTier !== 'premium' && user.subscriptionTier !== 'pro') {
           setIsCheckingPremium(true);
           navigate('/payment');
        } else {
           setIsCheckingPremium(false);
        }
      } else {
        setIsCheckingPremium(false);
      }
    }
  }, [item, user, authLoading, navigate]);

  const toggleBookmark = () => {
    if (!item) return;
    let bookmarks = [];
    try {
      const parsed = JSON.parse(
        localStorage.getItem("asrar_bookmarks") || "[]",
      );
      if (Array.isArray(parsed)) bookmarks = parsed;
    } catch (e) {
      bookmarks = [];
    }
    let newBookmarks;
    if (bookmarks.includes(item.id)) {
      newBookmarks = bookmarks.filter((bId: string) => bId !== item.id);
      setIsBookmarked(false);
    } else {
      newBookmarks = [...bookmarks, item.id];
      setIsBookmarked(true);
    }
    localStorage.setItem("asrar_bookmarks", JSON.stringify(newBookmarks));
  };

  const handleShare = async () => {
    if (!item) return;
    
    // Assure that we use the real domain instead of localhost for sharing
    let shareUrl = window.location.href;
    if (shareUrl.includes('localhost')) {
      shareUrl = shareUrl.replace(/^http:\/\/localhost(:\d+)?/, 'https://asrarhub.com');
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Découvrez "${item.title}" sur AsrarHub - L'outil des chercheurs spirituels.`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      // Fallback: Copy to clipboard if Web Share API is not supported
      navigator.clipboard.writeText(shareUrl);
      alert(t("linkCopied", "Lien copié dans le presse-papiers !"));
    }
  };

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <BookOpen size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article introuvable</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Cet article a peut-être été supprimé ou l'URL est incorrecte.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retourner</span>
        </button>
      </div>
    );
  }

  if (!item || (item.isPremium && (authLoading || isCheckingPremium))) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
            {t("loading", "Chargement...")}
          </p>
        </div>
        
        {showAuthModal && (
          <AuthModal isOpen={showAuthModal} onClose={() => {
            setShowAuthModal(false);
            navigate(-1);
          }} />
        )}
      </div>
    );
  }

  return (
    <div
      className={`mx-auto px-4 pt-0 sm:px-6 sm:pt-2 lg:px-8 pb-24 transition-colors duration-500 ${readingMode ? "bg-[#fdfbf7] dark:bg-[#1a1917] min-h-screen" : "max-w-3xl"}`}
    >
      <div
        className={`flex items-center justify-between mb-6 ${readingMode ? "max-w-3xl mx-auto" : ""}`}
      >
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 px-3 py-2 -ml-3 rounded-lg transition-colors ${readingMode ? "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">{t("back")}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full mr-2">
            <button
              onClick={() => setViewMode('full')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'full' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              title="Vue complète"
            >
              <AlignLeft size={18} />
            </button>
            <button
              onClick={() => setViewMode('accordion')}
              className={`p-1.5 rounded-full transition-colors ${viewMode === 'accordion' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              title="Vue par sections"
            >
              <ListTree size={18} />
            </button>
          </div>
          <button
            onClick={() => setReadingMode(!readingMode)}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 ${readingMode ? "bg-[#f4ebd0] text-[#8b6e3f] dark:bg-[#383120] dark:text-[#d4c39c]" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"}`}
            title={t("readingMode", "Mode Lecture")}
          >
            <BookType size={22} />
          </button>
          <button
            onClick={() => setZenMode(true)}
            className="p-2 rounded-full transition-all flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/30 font-bold px-3 py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            title="Mode Zen (Plein Écran)"
          >
            <Maximize2 size={15} />
            <span className="text-xs">Mode Zen</span>
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full transition-colors ${isBookmarked ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"}`}
          >
            <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {isBookmarked && (
        <div className={`mb-6 p-3 rounded-xl flex items-center justify-between ${readingMode ? "max-w-3xl mx-auto bg-[#f4ebd0]/30 dark:bg-[#383120]/30" : "bg-gray-50 dark:bg-gray-800"}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Classer dans un dossier :</span>
          <select 
            defaultValue={JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]').find((f: any) => f.items.includes(item.id))?.id || ""}
            onChange={(e) => {
              const folderId = e.target.value;
              try {
                const parsedFolders = JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]');
                const newFolders = parsedFolders.map((f: any) => {
                  f.items = f.items.filter((id: string) => id !== item.id);
                  if (f.id === folderId) {
                    f.items.push(item.id);
                  }
                  return f;
                });
                localStorage.setItem('asrar_bookmark_folders', JSON.stringify(newFolders));
                alert("Dossier mis à jour !");
              } catch (err) {}
            }}
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">-- Sélectionnez --</option>
            {JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]').map((f: any) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-500 ${readingMode ? "max-w-3xl mx-auto bg-transparent border-none" : "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"}`}
      >
        {item.imageUrl && !readingMode && (
          <div className="w-full h-64 sm:h-80 md:h-96 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}
        <div
          className={`${readingMode ? "p-0 sm:p-2 lg:p-4" : "p-6 md:p-8 lg:p-10"}`}
        >
          <div className="flex flex-col items-center sm:items-start gap-4 mb-6">
            {item.isPremium && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-sm font-bold w-fit mx-auto sm:mx-0">
                <Crown size={16} />
                <span>Premium</span>
              </div>
            )}
            <h1
              className={`font-extrabold leading-tight transition-colors text-center sm:text-left w-full ${
                readingMode
                  ? "text-2xl sm:text-3xl md:text-4xl text-[#4a3f35] dark:text-[#d4c39c] font-arabic"
                  : "text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white"
              }`}
            >
              {item.title}
            </h1>
          </div>

          {item.verse && (
            <div
              className={`my-10 p-6 sm:p-8 rounded-2xl border shadow-inner transition-colors ${
                readingMode
                  ? "bg-[#f4ebd0]/50 dark:bg-[#383120]/30 border-[#e8dcb5] dark:border-[#524830]/50"
                  : "bg-emerald-50/70 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50"
              }`}
            >
              <p
                className={`font-arabic text-center mb-6 leading-relaxed transition-all ${
                  readingMode
                    ? "text-3xl sm:text-4xl md:text-5xl text-[#5c4a30] dark:text-[#e8dcb5] leading-loose"
                    : "text-2xl sm:text-3xl md:text-4xl text-emerald-800 dark:text-emerald-300 sm:leading-loose"
                }`}
                dir="rtl"
              >
                " {item.verse} "
              </p>
              {item.reference && (
                <div className="flex items-center justify-center">
                  <div
                    className={`h-px w-12 mr-4 ${readingMode ? "bg-[#d1c29e] dark:bg-[#6b5e40]" : "bg-emerald-200 dark:bg-emerald-700"}`}
                  ></div>
                  <p
                    className={`text-center font-medium ${readingMode ? "text-[#8b7556] dark:text-[#a89871]" : "text-emerald-700 dark:text-emerald-500"}`}
                  >
                    {item.reference}
                  </p>
                  <div
                    className={`h-px w-12 ml-4 ${readingMode ? "bg-[#d1c29e] dark:bg-[#6b5e40]" : "bg-emerald-200 dark:bg-emerald-700"}`}
                  ></div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-10 mt-8">
            <section>
              {!readingMode && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                  <BookOpen className="mr-3 text-emerald-500" size={24} />
                  {t("content")}
                </h2>
              )}
              <div
                className={`max-w-none transition-all ${
                  readingMode
                    ? "text-[#363028] dark:text-[#c4b79d] font-arabic text-xl sm:text-2xl leading-[2.5]"
                    : "text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                }`}
              >
                {(() => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(item.content);

                  if (viewMode === 'full') {
                    if (isHtml) {
                      return <div dangerouslySetInnerHTML={{ __html: item.content }} className="prose dark:prose-invert max-w-none" />;
                    } else {
                      return item.content.split("\n").map((paragraph, idx) => (
                        <p key={idx} className="mb-6">{paragraph}</p>
                      ));
                    }
                  }

                  if (viewMode === 'accordion') {
                    if (!isHtml) {
                      return item.content.split("\n").map((paragraph, idx) => (
                        <p key={idx} className="mb-6">{paragraph}</p>
                      ));
                    }

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(item.content, 'text/html');
                    const sections: { title: string, htmlContent: string }[] = [];
                    let currentTitle = 'Introduction';
                    let currentHtml = '';
                    
                    doc.body.childNodes.forEach(node => {
                      const isHeader = /^H[1-6]$/i.test(node.nodeName);
                      if (isHeader) {
                        if (currentHtml.trim()) {
                          sections.push({ title: currentTitle, htmlContent: currentHtml });
                        }
                        currentTitle = node.textContent || 'Section';
                        currentHtml = '';
                      } else {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          currentHtml += (node as Element).outerHTML;
                        } else if (node.nodeType === Node.TEXT_NODE) {
                          currentHtml += node.textContent;
                        }
                      }
                    });
                    
                    if (currentHtml.trim()) {
                      sections.push({ title: currentTitle, htmlContent: currentHtml });
                    }

                    return (
                      <div className="space-y-4">
                        {sections.map((section, idx) => (
                          <AccordionSection key={idx} title={section.title} htmlContent={section.htmlContent} readingMode={readingMode} />
                        ))}
                      </div>
                    );
                  }
                })()}
              </div>
            </section>

            {/* Rating Section */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Évaluez cet article</h3>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        if (!user) {
                          setShowAuthModal(true);
                          return;
                        }
                        setRating(star);
                      }}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          (rating || 0) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-3 font-medium">
                    Merci pour votre évaluation ! ({rating}/5)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Immersive Zen Reading Mode Overlay */}
      <AnimatePresence>
        {zenMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[9999] overflow-y-auto px-4 py-8 sm:px-12 sm:py-16 md:px-20 md:py-24 flex flex-col items-center justify-start ${
              zenTheme === "cream"
                ? "bg-[#fdfbf7] text-[#3c2f2f]"
                : zenTheme === "dark"
                ? "bg-[#121214] text-[#d1d1d6]"
                : "bg-white text-gray-900"
            }`}
          >
            {/* Top Toolbar */}
            <div className={`w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b shrink-0 ${
              zenTheme === "cream" ? "border-[#e8dcb5]/60" : zenTheme === "dark" ? "border-stone-850/60" : "border-gray-150"
            }`}>
              <button
                onClick={() => setZenMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  zenTheme === "cream"
                    ? "hover:bg-[#f4ebd0] text-[#8b7556]"
                    : zenTheme === "dark"
                    ? "hover:bg-stone-800 text-stone-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <ArrowLeft size={16} />
                <span>Quitter le mode Zen</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                {/* Theme Switcher */}
                <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                  zenTheme === "cream" ? "bg-[#f4ebd0]/40 border-[#e8dcb5]/40" : zenTheme === "dark" ? "bg-stone-900/40 border-stone-800/40" : "bg-gray-50 border-gray-100"
                }`}>
                  <button
                    onClick={() => setZenTheme("cream")}
                    className={`w-5 h-5 rounded-full bg-[#fdfbf7] border ${zenTheme === "cream" ? "ring-2 ring-emerald-500 border-transparent" : "border-stone-300"}`}
                    title="Crème"
                  />
                  <button
                    onClick={() => setZenTheme("dark")}
                    className={`w-5 h-5 rounded-full bg-[#121214] border ${zenTheme === "dark" ? "ring-2 ring-emerald-500 border-transparent" : "border-stone-700"}`}
                    title="Sombre"
                  />
                  <button
                    onClick={() => setZenTheme("white")}
                    className={`w-5 h-5 rounded-full bg-white border ${zenTheme === "white" ? "ring-2 ring-emerald-500 border-transparent" : "border-gray-350"}`}
                    title="Clair"
                  />
                </div>

                {/* Font Size Selector */}
                <div className={`flex items-center rounded-xl p-1 border text-xs font-bold ${
                  zenTheme === "cream" ? "bg-[#f4ebd0]/40 border-[#e8dcb5]/40" : zenTheme === "dark" ? "bg-stone-900/40 border-stone-800/40" : "bg-gray-50 border-gray-100"
                }`}>
                  <button
                    onClick={() => {
                      if (zenFontSize === "xl") setZenFontSize("lg");
                      else if (zenFontSize === "lg") setZenFontSize("md");
                      else if (zenFontSize === "md") setZenFontSize("sm");
                    }}
                    disabled={zenFontSize === "sm"}
                    className="px-2 py-1 hover:opacity-80 disabled:opacity-30 transition-opacity"
                    title="Texte plus petit"
                  >
                    A-
                  </button>
                  <span className="opacity-50 px-1 font-normal">Taille</span>
                  <button
                    onClick={() => {
                      if (zenFontSize === "sm") setZenFontSize("md");
                      else if (zenFontSize === "md") setZenFontSize("lg");
                      else if (zenFontSize === "lg") setZenFontSize("xl");
                    }}
                    disabled={zenFontSize === "xl"}
                    className="px-2 py-1 hover:opacity-80 disabled:opacity-30 transition-opacity"
                    title="Texte plus grand"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div
              className={`w-full max-w-2xl select-text select-none leading-relaxed transition-all pb-24 ${
                zenFontSize === "sm"
                  ? "text-base sm:text-lg leading-[1.8]"
                  : zenFontSize === "md"
                  ? "text-lg sm:text-xl leading-[1.9]"
                  : zenFontSize === "lg"
                  ? "text-xl sm:text-2xl leading-[2.0]"
                  : "text-2xl sm:text-3xl leading-[2.1]"
              }`}
            >
              <h1 className={`font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl text-center mb-10 tracking-tight leading-tight ${
                zenTheme === "cream" ? "text-[#4a3f35]" : zenTheme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {item.title}
              </h1>

              {item.verse && (
                <div className={`my-12 p-6 sm:p-8 rounded-3xl border text-center transition-colors ${
                  zenTheme === "cream"
                    ? "bg-[#f4ebd0]/30 border-[#e8dcb5]/50"
                    : zenTheme === "dark"
                    ? "bg-stone-900/40 border-stone-800/40"
                    : "bg-gray-50 border-gray-150"
                }`}>
                  <p className={`font-arabic text-center mb-6 leading-loose font-medium ${
                    zenFontSize === "sm" ? "text-2xl sm:text-3xl" :
                    zenFontSize === "md" ? "text-3xl sm:text-4xl" :
                    zenFontSize === "lg" ? "text-4xl sm:text-5xl" :
                    "text-5xl sm:text-6xl"
                  }`} dir="rtl">
                    " {item.verse} "
                  </p>
                  {item.reference && (
                    <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${
                      zenTheme === "cream" ? "text-[#8b7556]" : zenTheme === "dark" ? "text-stone-500" : "text-gray-500"
                    }`}>
                      {item.reference}
                    </p>
                  )}
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none font-serif tracking-wide text-justify">
                {(() => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(item.content);
                  if (isHtml) {
                    return <div dangerouslySetInnerHTML={{ __html: item.content }} className="prose dark:prose-invert max-w-none font-serif text-justify" />;
                  } else {
                    return item.content.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-6">{paragraph}</p>
                    ));
                  }
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
