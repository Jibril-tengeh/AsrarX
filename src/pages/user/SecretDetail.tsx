import React, { useEffect, useState, useRef } from "react";
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
  X,
  Sliders,
  Volume2,
  VolumeX,
  Folder,
  Play,
  Pause,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getAsrarItems } from "../../data/store";
import { AsrarItem } from "../../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../../components/AuthModal';
import { InteractiveLexiconText } from "../../components/InteractiveLexiconText";
import { PremiumWrapper } from "../../components/PremiumWrapper";

const AccordionSection: React.FC<{ title: string, htmlContent: string, readingMode: boolean, style?: React.CSSProperties }> = ({ title, htmlContent, readingMode, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`rounded-2xl border transition-colors overflow-hidden ${readingMode ? "border-[#e8dcb5] dark:border-[#524830]/50" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`} style={style}>
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
        <div className={`p-4 sm:p-5 border-t ${readingMode ? "border-[#e8dcb5] dark:border-[#524830]/50 text-[#363028] dark:text-[#c4b79d]" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"}`} style={style}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose dark:prose-invert w-full max-w-full break-words overflow-hidden" style={style} />
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
  const [showZenSettings, setShowZenSettings] = useState(false);
  const [zenFont, setZenFont] = useState<'uthmani' | 'naskh' | 'indopak' | 'serif' | 'sans'>('uthmani');
  const [zenBrightness, setZenBrightness] = useState<number>(100);
  const [zenFontSizePx, setZenFontSizePx] = useState<number>(22);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkFolders, setBookmarkFolders] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'full' | 'accordion'>('full');
  const [articleFontSize, setArticleFontSize] = useState<number>(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    return isAndroid ? 14 : 18;
  });
  const [rating, setRating] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speakingWordIndex, setSpeakingWordIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backupIntervalRef = useRef<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    if (!item) return;

    if (language === 'fr') {
      setIsTranslating(false);
      setTranslationError(false);
      setIsTranslated(false);
      return;
    }

    const cacheKey = `asrar_trans_${item.id}_${language}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setIsTranslated(true);
        setTranslationError(false);
        setIsTranslating(false);

        if (item.title === parsed.title) {
          return;
        }
        setItem(prev => {
          if (!prev || prev.id !== item.id) return prev;
          return {
            ...prev,
            title: parsed.title,
            hook: parsed.hook,
            content: parsed.content,
            benefits: parsed.benefits,
          };
        });
        return;
      }
    } catch (e) {
      console.error("Error reading translation cache", e);
    }

    const translateArticle = async () => {
      setIsTranslating(true);
      setTranslationError(false);
      setIsTranslated(false);
      try {
        const staticItems = getAsrarItems();
        const staticItem = staticItems.find(i => i.id === item.id);
        const sourceTitle = staticItem ? staticItem.title : item.title;
        const sourceContent = staticItem ? staticItem.content : item.content;
        const sourceHook = staticItem ? staticItem.hook : item.hook;
        const sourceBenefits = staticItem ? staticItem.benefits : item.benefits;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 seconds timeout for larger articles

        const res = await fetch('/api/translate-article', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            title: sourceTitle,
            content: sourceContent,
            hook: sourceHook,
            benefits: sourceBenefits,
            targetLanguage: language,
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            localStorage.setItem(cacheKey, JSON.stringify(data));
            setIsTranslated(true);
            setTranslationError(false);
            setItem(prev => {
              if (!prev || prev.id !== item.id) return prev;
              return {
                ...prev,
                title: data.title,
                hook: data.hook,
                content: data.content,
                benefits: data.benefits,
              };
            });
          } else {
            setTranslationError(true);
            setIsTranslated(false);
          }
        } else {
          setTranslationError(true);
          setIsTranslated(false);
        }
      } catch (err) {
        console.error("Automatic translation error:", err);
        setTranslationError(true);
        setIsTranslated(false);
      } finally {
        setIsTranslating(false);
      }
    };

    translateArticle();
  }, [id, language, item?.id, retryTrigger]);

  const chunkText = (text: string, maxLength: number): string[] => {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk = '';
    for (const word of words) {
      if ((currentChunk + ' ' + word).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = word;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + word : word;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  };

  const playGoogleTTS = (text: string, lang: string) => {
    setIsSpeaking(true);
    const chunks = chunkText(text, 180);
    let currentChunk = 0;

    const playNext = () => {
      if (currentChunk >= chunks.length) {
        setIsSpeaking(false);
        return;
      }
      const t = chunks[currentChunk];
      const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(t)}`;
      const backupUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(t)}&le=${lang === 'en' ? 'eng' : 'fr'}`;

      const audio = document.createElement('audio');
      audio.setAttribute('referrerpolicy', 'no-referrer');
      audio.src = googleUrl;
      audioRef.current = audio;

      let triedBackup = false;

      const handlePlaybackError = () => {
        if (!triedBackup && lang !== 'ha') {
          triedBackup = true;
          audio.src = backupUrl;
          audio.play().catch(() => {
            currentChunk++;
            playNext();
          });
        } else {
          currentChunk++;
          playNext();
        }
      };

      audio.onended = () => {
        currentChunk++;
        playNext();
      };

      audio.onerror = () => {
        handlePlaybackError();
      };

      audio.play().catch(() => {
        handlePlaybackError();
      });
    };

    playNext();
  };

  // Preload voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Stop any reading when leaving page
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (backupIntervalRef.current) {
        clearInterval(backupIntervalRef.current);
        backupIntervalRef.current = null;
      }
    };
  }, []);

  // Automatically scroll the current spoken word into view
  useEffect(() => {
    if (isSpeaking && speakingWordIndex !== null) {
      const element = document.getElementById(`word-speak-${speakingWordIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [speakingWordIndex, isSpeaking]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  interface WordToken {
    text: string;
    globalIndex: number;
  }

  interface SpokenParagraph {
    type: 'title' | 'verse' | 'content';
    words: WordToken[];
  }

  const buildSpokenSegments = (currentItem: AsrarItem): SpokenParagraph[] => {
    const segments: SpokenParagraph[] = [];
    let globalIndex = 0;

    // Title segment
    const titleWords = currentItem.title.split(/\s+/).filter(w => w.length > 0).map(text => ({
      text,
      globalIndex: globalIndex++
    }));
    segments.push({ type: 'title', words: titleWords });

    // Verse segment
    if (currentItem.verse) {
      const verseWords = currentItem.verse.split(/\s+/).filter(w => w.length > 0).map(text => ({
        text,
        globalIndex: globalIndex++
      }));
      segments.push({ type: 'verse', words: verseWords });
    }

    // Content paragraphs
    const cleanContent = stripHtml(currentItem.content);
    const paragraphs = cleanContent.split('\n').filter(p => p.trim().length > 0);
    paragraphs.forEach(para => {
      const paraWords = para.split(/\s+/).filter(w => w.length > 0).map(text => ({
        text,
        globalIndex: globalIndex++
      }));
      if (paraWords.length > 0) {
        segments.push({ type: 'content', words: paraWords });
      }
    });

    return segments;
  };

  const pauseSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const resumeSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn(e));
    }
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (backupIntervalRef.current) {
      clearInterval(backupIntervalRef.current);
      backupIntervalRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setSpeakingWordIndex(null);
  };

  const handleLectureVocale = () => {
    if (!item) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    setIsPaused(false);
    isPausedRef.current = false;

    const segments = buildSpokenSegments(item);
    const allWords = segments.flatMap(s => s.words);
    const textToRead = allWords.map(w => w.text).join(' ');

    if (!textToRead.trim()) return;

    const lang = language === 'en' ? 'en' : language === 'ha' ? 'ha' : 'fr';

    // Calculate exact offsets for each word to pair with onboundary's charIndex
    const wordsWithOffsets: { text: string; globalIndex: number; start: number; end: number }[] = [];
    let currentOffset = 0;
    for (let i = 0; i < allWords.length; i++) {
      const wordText = allWords[i].text;
      wordsWithOffsets.push({
        text: wordText,
        globalIndex: allWords[i].globalIndex,
        start: currentOffset,
        end: currentOffset + wordText.length
      });
      currentOffset += wordText.length + 1; // +1 for the space
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();

        const newUtterance = new SpeechSynthesisUtterance(textToRead);
        if (language === 'en') {
          newUtterance.lang = 'en-US';
        } else if (language === 'ha') {
          newUtterance.lang = 'ha-NG';
        } else {
          newUtterance.lang = 'fr-FR';
        }

        newUtterance.rate = speechRate * 0.95; // Configurable speech rate
        newUtterance.pitch = 1.0;

        let lastBoundaryTime = Date.now();
        let expectedWordDuration = Math.round(320 / speechRate); // scale duration with rate

        newUtterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingWordIndex(0);
          lastBoundaryTime = Date.now();

          // Start hybrid backup interval to ensure smooth selection even if WebView onboundary is restricted
          if (backupIntervalRef.current) clearInterval(backupIntervalRef.current);
          backupIntervalRef.current = setInterval(() => {
            if (isPausedRef.current) return; // Do not progress if paused
            // If native onboundary hasn't fired in 1500ms, manually step to keep in sync
            if (Date.now() - lastBoundaryTime > 1500) {
              setSpeakingWordIndex(prev => {
                if (prev === null) return 0;
                if (prev < allWords.length - 1) {
                  return prev + 1;
                }
                return prev;
              });
            }
          }, expectedWordDuration);
        };

        newUtterance.onboundary = (event: any) => {
          if (event.name === 'word') {
            lastBoundaryTime = Date.now();
            const charIndex = event.charIndex;
            const matchedWord = wordsWithOffsets.find(w => charIndex >= w.start && charIndex <= w.end);
            if (matchedWord) {
              setSpeakingWordIndex(matchedWord.globalIndex);
            }
          }
        };

        newUtterance.onend = () => {
          if (backupIntervalRef.current) {
            clearInterval(backupIntervalRef.current);
            backupIntervalRef.current = null;
          }
          setIsSpeaking(false);
          setIsPaused(false);
          isPausedRef.current = false;
          setSpeakingWordIndex(null);
        };

        newUtterance.onerror = (e) => {
          console.warn("SpeechSynthesis error:", e);
          if (backupIntervalRef.current) {
            clearInterval(backupIntervalRef.current);
            backupIntervalRef.current = null;
          }
          setIsSpeaking(false);
          setIsPaused(false);
          isPausedRef.current = false;
          setSpeakingWordIndex(null);
        };

        window.speechSynthesis.speak(newUtterance);
      } catch (err) {
        console.warn("SpeechSynthesis error:", err);
        setIsSpeaking(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setSpeakingWordIndex(null);
      }
    } else {
      // In case speechSynthesis is completely missing, we have no choice but to use fallback, 
      // but let's still support the active words animation via an interval!
      setIsSpeaking(true);
      setSpeakingWordIndex(0);
      playGoogleTTS(textToRead, lang);

      let currentVal = 0;
      if (backupIntervalRef.current) clearInterval(backupIntervalRef.current);
      backupIntervalRef.current = setInterval(() => {
        if (isPausedRef.current) return; // Do not progress if paused
        if (currentVal < allWords.length - 1) {
          currentVal++;
          setSpeakingWordIndex(currentVal);
        } else {
          clearInterval(backupIntervalRef.current);
          backupIntervalRef.current = null;
          setIsSpeaking(false);
          setIsPaused(false);
          isPausedRef.current = false;
          setSpeakingWordIndex(null);
        }
      }, Math.round(350 / speechRate));
    }
  };

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
    try {
      setBookmarkFolders(JSON.parse(localStorage.getItem('asrar_bookmark_folders') || '[]'));
    } catch (e) {
      setBookmarkFolders([]);
    }
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
      // Pre-load from local offline details cache for instant view
      try {
        const cachedDetails = JSON.parse(localStorage.getItem('asrarhub_cached_article_details') || '{}');
        if (cachedDetails[id]) {
          setItem(cachedDetails[id]);
          checkBookmark(id);
        }
      } catch (e) {
        console.error("Error reading cached article detail", e);
      }

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
            
            const fetchedItem: AsrarItem = {
              id: docSnap.id,
              title: activeTitle,
              hook: activeHook,
              category: data.category || 'recette',
              content: activeContent,
              benefits: data.benefits || [],
              imageUrl: data.thumbnail,
              isPremium: data.isPremium || false,
              createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
            };

            setItem(fetchedItem);
            checkBookmark(docSnap.id);

            // Save to local cache
            try {
              const cachedDetails = JSON.parse(localStorage.getItem('asrarhub_cached_article_details') || '{}');
              cachedDetails[id] = fetchedItem;
              localStorage.setItem('asrarhub_cached_article_details', JSON.stringify(cachedDetails));
            } catch (e) {
              console.error("Error saving article to offline cache", e);
            }
          } else {
            // Check if we have a cached version
            const cachedDetails = JSON.parse(localStorage.getItem('asrarhub_cached_article_details') || '{}');
            if (cachedDetails[id]) {
              setItem(cachedDetails[id]);
            } else {
              setNotFound(true);
            }
          }
        } catch (error) {
          console.error("Error fetching article from Firestore", error);
          // Fallback to offline cache
          try {
            const cachedDetails = JSON.parse(localStorage.getItem('asrarhub_cached_article_details') || '{}');
            if (cachedDetails[id]) {
              setItem(cachedDetails[id]);
            } else {
              setNotFound(true);
            }
          } catch (e) {
            setNotFound(true);
          }
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
        } else {
           setIsCheckingPremium(false);
        }
      } else {
        setIsCheckingPremium(false);
      }
    }
  }, [item, user, authLoading]);

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("secretDetail.articleNotFound", "Article introuvable")}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t("secretDetail.articleNotFoundDesc", "Cet article a peut-être été supprimé ou l'URL est incorrecte.")}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t("secretDetail.backBtn", "Retourner")}</span>
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
    <PremiumWrapper enabled={item.isPremium} requiredTier="premium" itemId={item.id} pointsCost={(item as any).pointsCost} fallbackTitle="Lecture Secrète Premium">
      <div
        className={`w-full max-w-3xl mx-auto px-4 pt-0 sm:px-6 sm:pt-2 lg:px-8 pb-24 transition-colors duration-500 ${readingMode ? "bg-[#fdfbf7] dark:bg-[#1a1917] min-h-screen" : ""}`}
      >
      <div
        className={`flex items-center justify-between mb-6 ${readingMode ? "max-w-3xl mx-auto" : ""}`}
      >
        <button
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate('/user/dashboard');
            }
          }}
          className={`flex items-center space-x-2 px-3 py-2 -ml-3 rounded-lg transition-colors ${readingMode ? "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden sm:inline">{t("back")}</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full mr-1 sm:mr-2">
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
          
          {/* Lecture Vocale (Text-To-Speech) Button */}
          <button
            onClick={handleLectureVocale}
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${
              isSpeaking 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md animate-pulse font-bold px-3 py-1.5" 
                : readingMode
                  ? "bg-[#f4ebd0] text-[#8b6e3f] hover:bg-[#e8dcb5] dark:bg-[#383120] dark:text-[#d4c39c] dark:hover:bg-[#4a3f35] font-bold px-3 py-1.5"
                  : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/30 font-bold px-3 py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            }`}
            title={isSpeaking ? t("secretDetail.lectureVocaleStop", "Arrêter la lecture") : t("secretDetail.lectureVocalePlay", "Lecture Vocale")}
          >
            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="text-xs hidden sm:inline">{isSpeaking ? t("secretDetail.lectureVocaleStop", "Arrêter") : t("secretDetail.lectureVocalePlay", "Lecture Vocale")}</span>
          </button>

          <button
            onClick={() => setZenMode(true)}
            className="p-2 rounded-full transition-all flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/30 font-bold px-3 py-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            title={t("secretDetail.zenModeTitle", "Mode Zen (Plein Écran)")}
          >
            <Maximize2 size={15} />
            <span className="text-xs hidden sm:inline">{t("secretDetail.zenModeBtn", "Mode Zen")}</span>
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-full transition-colors ${isBookmarked ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"}`}
          >
            <Bookmark size={22} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {isBookmarked && item && (
        <div className={`mb-6 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${readingMode ? "max-w-3xl mx-auto bg-[#f4ebd0]/40 dark:bg-[#383120]/40 border border-[#e8dcb5] dark:border-[#524830]/30" : "bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30"}`}>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Folder size={16} />
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("secretDetail.bookmarkFolder", "Classer ce secret :")}
            </span>
          </div>
          
          <select 
            value={bookmarkFolders.find((f: any) => f.items.includes(item.id))?.id || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__new__') {
                const name = prompt("Nom du nouveau dossier :");
                if (name && name.trim()) {
                  const newId = Date.now().toString();
                  const newFolder = { id: newId, name: name.trim(), items: [item.id] };
                  
                  const updated = bookmarkFolders.map((f: any) => {
                    f.items = f.items.filter((id: string) => id !== item.id);
                    return f;
                  });
                  const finalFolders = [...updated, newFolder];
                  setBookmarkFolders(finalFolders);
                  localStorage.setItem('asrar_bookmark_folders', JSON.stringify(finalFolders));
                }
              } else {
                const updated = bookmarkFolders.map((f: any) => {
                  f.items = f.items.filter((id: string) => id !== item.id);
                  if (f.id === val) {
                    f.items.push(item.id);
                  }
                  return f;
                });
                setBookmarkFolders(updated);
                localStorage.setItem('asrar_bookmark_folders', JSON.stringify(updated));
              }
            }}
            className="bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
          >
            <option value="">📁 Aucun dossier</option>
            {bookmarkFolders.map((f: any) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
            <option value="__new__" className="text-emerald-600 dark:text-emerald-400 font-bold">+ Nouveau dossier...</option>
          </select>
        </div>
      )}

      <div
        className={`w-full overflow-hidden transition-all duration-500 ${readingMode ? "max-w-3xl mx-auto bg-transparent border-none" : "bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"}`}
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
            {language !== 'fr' && (
              <div className="flex items-center gap-1.5 mt-1 select-none mx-auto sm:mx-0">
                {isTranslating ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/75 dark:bg-emerald-900/20 border border-emerald-100/50 dark:border-emerald-800/30 px-2.5 py-1 rounded-full w-fit">
                    <Sparkles size={14} className="animate-spin text-emerald-500" />
                    <span>{t("translating", "Traduction automatique en cours...")}</span>
                  </div>
                ) : translationError ? (
                  <button
                    onClick={() => setRetryTrigger(prev => prev + 1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/75 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30 px-2.5 py-1 rounded-full w-fit hover:bg-red-100/80 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                    title={t("retryTranslation", "Recommencer la traduction")}
                  >
                    <Sparkles size={14} className="text-red-500 animate-pulse" />
                    <span>{t("translationFailed", "Échec de la traduction. Cliquer pour réessayer")}</span>
                  </button>
                ) : isTranslated ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/75 dark:bg-emerald-900/20 border border-emerald-100/50 dark:border-emerald-800/30 px-2.5 py-1 rounded-full w-fit">
                    <Sparkles size={14} className="text-emerald-500" />
                    <span>{t("translated", "Traduit automatiquement par IA")}</span>
                  </div>
                ) : null}
              </div>
            )}
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
              {readingMode && (
                <div className="flex items-center justify-end mb-4 max-w-3xl mx-auto">
                  <div className="flex items-center gap-1.5 bg-[#f4ebd0]/40 dark:bg-[#383120]/40 px-2.5 py-1 rounded-xl border border-[#e8dcb5]/40 dark:border-[#524830]/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b7556] dark:text-[#a89871] mr-1">Taille :</span>
                    <button 
                      onClick={() => setArticleFontSize(prev => Math.max(12, prev - 2))}
                      className="p-1 hover:bg-[#e8dcb5] dark:hover:bg-[#4a3f35] rounded text-[#8b7556] dark:text-[#d4c39c] font-bold text-xs cursor-pointer select-none"
                      title="Diminuer la taille"
                    >
                      A-
                    </button>
                    <span className="text-xs font-semibold text-[#8b7556] dark:text-[#d4c39c] min-w-[28px] text-center font-mono">
                      {articleFontSize}px
                    </span>
                    <button 
                      onClick={() => setArticleFontSize(prev => Math.min(36, prev + 2))}
                      className="p-1 hover:bg-[#e8dcb5] dark:hover:bg-[#4a3f35] rounded text-[#8b7556] dark:text-[#d4c39c] font-bold text-xs cursor-pointer select-none"
                      title="Augmenter la taille"
                    >
                      A+
                    </button>
                  </div>
                </div>
              )}
              {!readingMode && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                  <span className="flex items-center">
                    <BookOpen className="mr-3 text-emerald-500" size={24} />
                    {t("content")}
                  </span>
                  
                  {/* Fine-Tuning Text Size (pointed in blue) */}
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => setArticleFontSize(prev => Math.max(12, prev - 2))}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 font-bold text-xs cursor-pointer select-none"
                      title="Diminuer la taille"
                    >
                      A-
                    </button>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[28px] text-center font-mono">
                      {articleFontSize}px
                    </span>
                    <button 
                      onClick={() => setArticleFontSize(prev => Math.min(36, prev + 2))}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 font-bold text-xs cursor-pointer select-none"
                      title="Augmenter la taille"
                    >
                      A+
                    </button>
                  </div>
                </h2>
              )}
              {isSpeaking && (
                <div className="mb-6 p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-semibold">{t("secretDetail.lectureVocaleActive", "Lecture vocale interactive active (Chaque mot prononcé est sélectionné)")}</span>
                  </div>
                  <button 
                    onClick={handleLectureVocale}
                    className="text-amber-900 dark:text-amber-100 hover:underline font-bold bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-lg transition-all"
                  >
                    {t("secretDetail.stop", "Arrêter")}
                  </button>
                </div>
              )}
              <div
                className={`w-full max-w-full break-words overflow-hidden transition-all ${
                  readingMode
                    ? "text-[#363028] dark:text-[#c4b79d] font-arabic text-xl sm:text-2xl leading-[2.5]"
                    : "text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                }`}
                style={{ fontSize: `${articleFontSize}px` }}
              >
                {isSpeaking ? (
                  <div className="space-y-6 select-text transition-all" style={{ fontSize: `${articleFontSize}px` }}>
                    {buildSpokenSegments(item).map((segment, sIdx) => {
                      if (segment.type === 'title') {
                        return (
                          <h2 key={sIdx} className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                            {segment.words.map((word) => (
                              <span
                                key={word.globalIndex}
                                id={`word-speak-${word.globalIndex}`}
                                className={`inline-block mr-1.5 transition-all duration-150 px-1 rounded ${
                                  speakingWordIndex === word.globalIndex
                                    ? "bg-amber-300 text-slate-900 dark:bg-amber-500 dark:text-slate-900 scale-110 font-bold shadow-md"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {word.text}
                              </span>
                            ))}
                          </h2>
                        );
                      }
                      if (segment.type === 'verse') {
                        return (
                          <div key={sIdx} className="my-6 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30 font-arabic text-center leading-loose text-2xl">
                            {segment.words.map((word) => (
                              <span
                                key={word.globalIndex}
                                id={`word-speak-${word.globalIndex}`}
                                className={`inline-block mr-1.5 transition-all duration-150 px-1 rounded ${
                                  speakingWordIndex === word.globalIndex
                                    ? "bg-amber-300 text-slate-900 dark:bg-amber-500 dark:text-slate-900 scale-110 font-bold shadow-md"
                                    : "text-emerald-800 dark:text-emerald-300"
                                }`}
                              >
                                {word.text}
                              </span>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p key={sIdx} className="mb-4 leading-relaxed text-justify">
                          {segment.words.map((word) => (
                            <span
                              key={word.globalIndex}
                              id={`word-speak-${word.globalIndex}`}
                              className={`inline-block mr-1.5 transition-all duration-150 px-1 rounded ${
                                speakingWordIndex === word.globalIndex
                                  ? "bg-amber-300 text-slate-900 dark:bg-amber-500 dark:text-slate-900 scale-110 font-bold shadow-md"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {word.text}
                            </span>
                          ))}
                        </p>
                      );
                    })}
                  </div>
                ) : (() => {
                  const isHtml = /<[a-z][\s\S]*>/i.test(item.content);

                  if (viewMode === 'full') {
                    return <InteractiveLexiconText content={item.content} isHtml={isHtml} style={{ fontSize: `${articleFontSize}px` }} />;
                  }

                  if (viewMode === 'accordion') {
                    if (!isHtml) {
                      return item.content.split("\n").map((paragraph, idx) => (
                        <p key={idx} className="mb-6" style={{ fontSize: `${articleFontSize}px` }}>{paragraph}</p>
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
                          <AccordionSection key={idx} title={section.title} htmlContent={section.htmlContent} readingMode={readingMode} style={{ fontSize: `${articleFontSize}px` }} />
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t("secretDetail.rateArticle", "Évaluez cet article")}</h3>
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
                    {t("secretDetail.thankYouRating", "Merci pour votre évaluation !")} ({rating}/5)
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
            {/* Integrated Brightness Dimmer Overlay */}
            <div 
              className="fixed inset-0 pointer-events-none bg-black transition-opacity duration-300"
              style={{ 
                opacity: (100 - zenBrightness) / 100,
                zIndex: 99990
              }}
            />

            {/* Top Toolbar */}
            <div className={`w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b shrink-0 relative z-[99995] ${
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
                <span>{t("secretDetail.exitZenMode", "Quitter le mode Zen")}</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                {/* Theme Switcher */}
                <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
                  zenTheme === "cream" ? "bg-[#f4ebd0]/40 border-[#e8dcb5]/40" : zenTheme === "dark" ? "bg-stone-900/40 border-stone-800/40" : "bg-gray-50 border-gray-100"
                }`}>
                  <button
                    onClick={() => setZenTheme("cream")}
                    className={`w-5 h-5 rounded-full bg-[#fdfbf7] border ${zenTheme === "cream" ? "ring-2 ring-emerald-500 border-transparent" : "border-stone-300"}`}
                    title={t("secretDetail.themeCream", "Crème")}
                  />
                  <button
                    onClick={() => setZenTheme("dark")}
                    className={`w-5 h-5 rounded-full bg-[#121214] border ${zenTheme === "dark" ? "ring-2 ring-emerald-500 border-transparent" : "border-stone-700"}`}
                    title={t("secretDetail.themeDark", "Sombre")}
                  />
                  <button
                    onClick={() => setZenTheme("white")}
                    className={`w-5 h-5 rounded-full bg-white border ${zenTheme === "white" ? "ring-2 ring-emerald-500 border-transparent" : "border-gray-350"}`}
                    title={t("secretDetail.themeLight", "Clair")}
                  />
                </div>

                {/* Direct Font Size Adjuster */}
                <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                  zenTheme === "cream" ? "bg-[#f4ebd0]/40 border-[#e8dcb5]/40" : zenTheme === "dark" ? "bg-stone-900/40 border-stone-800/40" : "bg-gray-50 border-gray-100"
                }`}>
                  <button
                    onClick={() => setZenFontSizePx(prev => Math.max(12, prev - 2))}
                    disabled={zenFontSizePx <= 12}
                    className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                      zenFontSizePx <= 12
                        ? "opacity-30 cursor-not-allowed"
                        : zenTheme === "cream"
                        ? "hover:bg-[#f4ebd0] text-[#8b7556]"
                        : zenTheme === "dark"
                        ? "hover:bg-stone-800 text-stone-300"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                    title="Réduire la taille du texte"
                  >
                    A-
                  </button>
                  <span className={`text-[10px] font-bold px-1 ${
                    zenTheme === "cream" ? "text-[#8b7556]" : zenTheme === "dark" ? "text-stone-400" : "text-gray-500"
                  }`}>
                    {zenFontSizePx}px
                  </span>
                  <button
                    onClick={() => setZenFontSizePx(prev => Math.min(48, prev + 2))}
                    disabled={zenFontSizePx >= 48}
                    className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                      zenFontSizePx >= 48
                        ? "opacity-30 cursor-not-allowed"
                        : zenTheme === "cream"
                        ? "hover:bg-[#f4ebd0] text-[#8b7556]"
                        : zenTheme === "dark"
                        ? "hover:bg-stone-800 text-stone-300"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                    title="Agrandir la taille du texte"
                  >
                    A+
                  </button>
                </div>

                {/* Customizable Display Options Dropdown Toggle */}
                <button
                  onClick={() => setShowZenSettings(!showZenSettings)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    zenTheme === "cream"
                      ? "hover:bg-[#f4ebd0] text-[#8b7556] border-[#e8dcb5]"
                      : zenTheme === "dark"
                      ? "hover:bg-stone-800 text-stone-400 border-stone-850"
                      : "hover:bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                  title="Personnaliser l'affichage"
                >
                  <Sliders size={14} />
                  <span>Options</span>
                </button>
              </div>

              {/* Customizable Settings Float Menu */}
              <AnimatePresence>
                {showZenSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-14 right-0 z-[100000] w-72 sm:w-80 p-5 rounded-2xl shadow-2xl border max-h-[75vh] sm:max-h-[85vh] overflow-y-auto ${
                      zenTheme === "cream"
                        ? "bg-[#fdfbf7] border-[#e8dcb5] text-[#3c2f2f]"
                        : zenTheme === "dark"
                        ? "bg-[#1c1c1e] border-stone-800 text-stone-200"
                        : "bg-white border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-4 border-gray-200 dark:border-stone-800">
                      <h3 className="font-bold text-sm">Options de Lecture</h3>
                      <button onClick={() => setShowZenSettings(false)} className="opacity-75 hover:opacity-100">
                        <X size={16} />
                      </button>
                    </div>

                    {/* Font Family Selection */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-75">Police de caractères</label>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {[
                          { id: 'uthmani', label: 'Uthmani (Ar)' },
                          { id: 'naskh', label: 'Naskh (Ar)' },
                          { id: 'indopak', label: 'IndoPak (Ar)' },
                          { id: 'serif', label: 'Sérif (Fr)' },
                          { id: 'sans', label: 'Sans-Sérif' }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setZenFont(f.id as any)}
                            className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                              zenFont === f.id
                                ? "bg-emerald-600 text-white border-transparent"
                                : zenTheme === "cream"
                                ? "border-[#e8dcb5] hover:bg-[#f4ebd0]/50"
                                : zenTheme === "dark"
                                ? "border-stone-800 hover:bg-stone-900"
                                : "border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size Fine Tuning */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider opacity-75">Taille du texte</label>
                        <span className="text-xs font-bold">{zenFontSizePx}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={zenFontSizePx}
                        onChange={(e) => setZenFontSizePx(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    {/* Integrated Brightness */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider opacity-75">Luminosité intégrée</label>
                        <span className="text-xs font-bold">{zenBrightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={zenBrightness}
                        onChange={(e) => setZenBrightness(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Container */}
            <div
              className="w-full max-w-2xl select-text select-none leading-relaxed transition-all pb-24 relative z-[99992]"
              style={{ 
                fontSize: `${zenFontSizePx}px`,
                fontFamily: `var(--font-${zenFont === 'serif' ? 'serif' : zenFont === 'sans' ? 'sans' : zenFont})`,
                lineHeight: zenFont.includes('serif') || zenFont === 'sans' ? '1.8' : '2.2'
              }}
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
                  <p 
                    className={`text-center mb-6 leading-loose font-medium font-${zenFont === 'serif' || zenFont === 'sans' ? 'arabic' : zenFont}`} 
                    style={{ fontSize: `${zenFontSizePx + 8}px` }}
                    dir="rtl"
                  >
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

              <div 
                className="prose dark:prose-invert max-w-none text-justify"
                style={{ 
                  fontSize: `${zenFontSizePx}px`,
                  fontFamily: `var(--font-${zenFont === 'serif' ? 'serif' : zenFont === 'sans' ? 'sans' : zenFont})`,
                }}
              >
                <InteractiveLexiconText 
                  content={item.content} 
                  isHtml={/<[a-z][\s\S]*>/i.test(item.content)} 
                  style={{ 
                    fontSize: `${zenFontSizePx}px`,
                    fontFamily: `var(--font-${zenFont === 'serif' ? 'serif' : zenFont === 'sans' ? 'sans' : zenFont})`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Audio Controller Panel */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100005] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xl flex items-center gap-4 transition-all duration-300 max-w-sm sm:max-w-md w-[92%]"
          >
            {/* Status indicator: pulse circle and label */}
            <div className="flex items-center gap-2 border-r pr-3 border-gray-200 dark:border-gray-800">
              <span className="relative flex h-3 w-3">
                {!isPaused && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isPaused ? 'bg-amber-400' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-sans whitespace-nowrap">
                {isPaused ? t("audio.paused", "En pause") : t("audio.playing", "Lecture")}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between flex-1 gap-2">
              {/* Speed change button */}
              <button
                onClick={() => {
                  const rates = [0.8, 1.0, 1.25, 1.5];
                  const currentIdx = rates.indexOf(speechRate);
                  const nextIdx = (currentIdx + 1) % rates.length;
                  const nextRate = rates[nextIdx];
                  setSpeechRate(nextRate);
                  
                  // If speaking, restart to apply rate instantly!
                  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
                    stopSpeech();
                    setTimeout(() => {
                      handleLectureVocale();
                    }, 100);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold font-mono transition-colors"
                title={t("audio.speed", "Vitesse de lecture")}
              >
                {speechRate}x
              </button>

              <div className="flex items-center gap-1.5">
                {/* Play/Pause Button */}
                <button
                  onClick={isPaused ? resumeSpeech : pauseSpeech}
                  className={`p-2 rounded-full shadow-sm text-white transition-all ${
                    isPaused 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                  title={isPaused ? t("audio.resume", "Reprendre") : t("audio.pause", "Mettre en pause")}
                >
                  {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
                </button>

                {/* Stop Button */}
                <button
                  onClick={stopSpeech}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 shadow-sm transition-all"
                  title={t("audio.stop", "Arrêter")}
                >
                  <Square size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </PremiumWrapper>
  );
};
