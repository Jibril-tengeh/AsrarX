import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, Bot, Sparkles, MessageCircle, ChevronLeft, Plus, Trash2, Menu, X, MessageSquare, History, Cloud, CloudOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

export const FaqPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<{ id: string; text: string; lang: string }[]>([]);

  const defaultPromptsByLang: Record<string, string[]> = {
    fr: [
      "Qu'est-ce qu'un wird et comment le pratiquer ?",
      "Comment me protéger contre le mauvais œil ?",
      "Quel est le moment idéal pour faire le zikr ?",
      "Quelle est la différence entre un secret et une recette ?"
    ],
    en: [
      "What is a wird and how to practice it?",
      "How to protect myself from the evil eye?",
      "What is the best time for doing dhikr?",
      "What is the difference between a secret and a recipe?"
    ],
    ha: [
      "Mene ne wird kuma yaya ake yin sa?",
      "Yaya zan kare kaina daga kakar maita ko miyagun idanu?",
      "Wane lokaci ne ya fi dacewa don yin zikirai?",
      "Menene bambanci tsakanin sirri da rubutu ko girke-girke?"
    ]
  };

  // Fetch prompts from Firestore
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'assistant_prompts'));
        const prompts: { id: string; text: string; lang: string }[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.text) {
            prompts.push({
              id: docSnap.id,
              text: data.text,
              lang: data.lang || 'fr'
            });
          }
        });
        setCustomPrompts(prompts);
      } catch (err) {
        console.warn("Could not load custom assistant prompts from Firestore (falling back to default presets):", err);
      }
    };
    fetchPrompts();
  }, []);

  const activePrompts = customPrompts.length > 0
    ? customPrompts.filter(p => p.lang === language).map(p => p.text)
    : [];

  const promptsToShow = activePrompts.length > 0
    ? activePrompts
    : (defaultPromptsByLang[language] || defaultPromptsByLang['fr']);

  // Load sessions from Firestore (if user is authenticated) or localStorage
  useEffect(() => {
    const loadSessions = async () => {
      setIsSyncing(true);
      if (user) {
        try {
          const q = query(collection(db, 'chat_sessions'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedSessions: ChatSession[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedSessions.push({
              id: docSnap.id,
              title: data.title || '',
              timestamp: data.timestamp || '',
              messages: data.messages || [],
            });
          });

          if (fetchedSessions.length > 0) {
            // Sort by id descending (id is timestamp based 'sess_' + timestamp) or updatedAt
            fetchedSessions.sort((a, b) => b.id.localeCompare(a.id));
            setSessions(fetchedSessions);
            setActiveSessionId(fetchedSessions[0].id);
          } else {
            // Create initial session
            const initialSession: ChatSession = {
              id: 'sess_' + Date.now(),
              title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
              timestamp: new Date().toLocaleDateString(),
              messages: []
            };
            setSessions([initialSession]);
            setActiveSessionId(initialSession.id);
            // Save to firestore
            await setDoc(doc(db, 'chat_sessions', initialSession.id), {
              ...initialSession,
              userId: user.uid,
              updatedAt: new Date().toISOString()
            });
          }
        } catch (e) {
          console.error("Error reading Firestore chat sessions, using fallback:", e);
          const fallbackSession: ChatSession = {
            id: 'sess_' + Date.now(),
            title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
            timestamp: new Date().toLocaleDateString(),
            messages: []
          };
          setSessions([fallbackSession]);
          setActiveSessionId(fallbackSession.id);
        }
      } else {
        // Guest mode - localStorage
        const saved = localStorage.getItem('asrarhub_faq_sessions');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSessions(parsed);
              setActiveSessionId(parsed[0].id);
              setIsSyncing(false);
              return;
            }
          } catch (e) {
            console.error("Error reading saved chat sessions:", e);
          }
        }
        // Create initial empty session
        const initialSession: ChatSession = {
          id: 'sess_' + Date.now(),
          title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
          timestamp: new Date().toLocaleDateString(),
          messages: []
        };
        setSessions([initialSession]);
        setActiveSessionId(initialSession.id);
      }
      setIsSyncing(false);
    };

    loadSessions();
  }, [user, language]);

  const saveSessions = async (updated: ChatSession[]) => {
    setSessions(updated);
    if (!user) {
      localStorage.setItem('asrarhub_faq_sessions', JSON.stringify(updated));
    }
  };

  const handleNewSession = async () => {
    const newSession: ChatSession = {
      id: 'sess_' + Date.now(),
      title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
      timestamp: new Date().toLocaleDateString(),
      messages: []
    };
    
    // Update local state
    await saveSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);

    // Save to Firestore if user is authenticated
    if (user) {
      try {
        await setDoc(doc(db, 'chat_sessions', newSession.id), {
          ...newSession,
          userId: user.uid,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Failed to save new session to Firestore", err);
      }
    }
  };

  const handleDeleteSession = async (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== idToDelete);
    let nextActiveId: string | null = null;

    if (updated.length === 0) {
      const fallbackSession: ChatSession = {
        id: 'sess_' + Date.now(),
        title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
        timestamp: new Date().toLocaleDateString(),
        messages: []
      };
      await saveSessions([fallbackSession]);
      nextActiveId = fallbackSession.id;

      if (user) {
        try {
          await setDoc(doc(db, 'chat_sessions', fallbackSession.id), {
            ...fallbackSession,
            userId: user.uid,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      await saveSessions(updated);
      if (activeSessionId === idToDelete) {
        nextActiveId = updated[0].id;
      } else {
        nextActiveId = activeSessionId;
      }
    }

    setActiveSessionId(nextActiveId);

    // Delete from Firestore
    if (user) {
      try {
        await deleteDoc(doc(db, 'chat_sessions', idToDelete));
      } catch (err) {
        console.error("Failed to delete session from Firestore", err);
      }
    }
  };

  const handleClearAllHistory = async () => {
    const confirmMessage = language === 'en'
      ? 'Are you sure you want to clear your entire chat history?'
      : language === 'ha'
        ? 'Shin kuna da tabbacin kuna son share duk tarihin tattaunawar ku?'
        : 'Êtes-vous sûr de vouloir effacer tout votre historique de discussion ?';

    if (!window.confirm(confirmMessage)) return;

    setIsSyncing(true);
    if (user) {
      try {
        const q = query(collection(db, 'chat_sessions'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        querySnapshot.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      } catch (err) {
        console.error("Failed to clear Firestore chat history", err);
      }
    }

    const fallbackSession: ChatSession = {
      id: 'sess_' + Date.now(),
      title: language === 'en' ? 'New Conversation' : language === 'ha' ? 'Sabuwar Tattaunawa' : 'Nouvelle conversation',
      timestamp: new Date().toLocaleDateString(),
      messages: []
    };

    if (user) {
      try {
        await setDoc(doc(db, 'chat_sessions', fallbackSession.id), {
          ...fallbackSession,
          userId: user.uid,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('asrarhub_faq_sessions', JSON.stringify([fallbackSession]));
    }

    setSessions([fallbackSession]);
    setActiveSessionId(fallbackSession.id);
    setIsSidebarOpen(false);
    setIsSyncing(false);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [];

  const handleAsk = async (text: string = question) => {
    if (!text.trim()) return;
    
    let currentSessionId = activeSessionId;
    let currentSession = activeSession;
    let currentSessionsList = [...sessions];
    
    // Dynamic / lazy creation of a session if we don't have one active
    if (!currentSessionId || !currentSession) {
      const newSessId = 'sess_' + Date.now();
      const newSess: ChatSession = {
        id: newSessId,
        title: text.slice(0, 32) + (text.length > 32 ? '...' : ''),
        timestamp: new Date().toLocaleDateString(),
        messages: []
      };
      currentSessionId = newSessId;
      currentSession = newSess;
      currentSessionsList = [newSess, ...sessions];
      
      setSessions(currentSessionsList);
      setActiveSessionId(newSessId);
      
      if (user) {
        try {
          await setDoc(doc(db, 'chat_sessions', newSessId), {
            ...newSess,
            userId: user.uid,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          console.error("Dynamic session creation Firestore save error:", err);
        }
      } else {
        localStorage.setItem('asrarhub_faq_sessions', JSON.stringify(currentSessionsList));
      }
    }
    
    // Add user message
    const userMsg: ChatMessage = { role: 'user', content: text };
    let newTitle = currentSession.title;
    if (currentSession.messages.length === 0 || currentSession.title.startsWith('Nouvelle') || currentSession.title.startsWith('New') || currentSession.title.startsWith('Sabuwar')) {
      newTitle = text.slice(0, 32) + (text.length > 32 ? '...' : '');
    }

    const updatedMessages = [...currentSession.messages, userMsg];
    const updatedSessions = currentSessionsList.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: updatedMessages, title: newTitle };
      }
      return s;
    });
    
    await saveSessions(updatedSessions);
    setQuestion('');
    setIsLoading(true);

    // Save user message and potentially updated title to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'chat_sessions', currentSessionId), {
          id: currentSessionId,
          title: newTitle,
          messages: updatedMessages,
          timestamp: currentSession.timestamp,
          userId: user.uid,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firestore save error", err);
      }
    }

    try {
      const targetUrl = getApiUrl('/api/assistant/faq');
      console.log(`[Assistant] Sending prompt request to API: "${targetUrl}"`, { question: text, language });
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, language })
      });
      
      let answerText = '';
      if (!response.ok) {
        console.error(`[Assistant] API response error. Status: ${response.status} ${response.statusText}, Target URL: ${targetUrl}`);
        if (response.status === 503) {
          answerText = "Le service d'intelligence artificielle est actuellement très sollicité. Veuillez patienter quelques instants et réessayer.";
        } else {
          answerText = "Erreur de connexion. Veuillez réessayer plus tard.";
        }
      } else {
        const data = await response.json();
        console.log(`[Assistant] API response success. Target URL: ${targetUrl}`, data);
        answerText = data.answer || "Désolé, je n'ai pas pu générer de réponse.";
      }

      const assistantMsg: ChatMessage = { role: 'assistant', content: answerText };
      const finalMessages = [...updatedMessages, assistantMsg];
      const sessionsWithReply = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: finalMessages };
        }
        return s;
      });
      await saveSessions(sessionsWithReply);

      // Save assistant message to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'chat_sessions', currentSessionId), {
            id: currentSessionId,
            title: newTitle,
            messages: finalMessages,
            timestamp: currentSession.timestamp,
            userId: user.uid,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          console.error("Firestore save assistant reply error", err);
        }
      }
    } catch (error) {
      console.error("[Assistant] Exception during assistant prompt dispatch:", error);
      const errReply: ChatMessage = { role: 'assistant', content: "Erreur de connexion. Veuillez réessayer plus tard." };
      const finalMessagesWithError = [...updatedMessages, errReply];
      const sessionsWithError = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: finalMessagesWithError };
        }
        return s;
      });
      await saveSessions(sessionsWithError);

      if (user) {
        try {
          await setDoc(doc(db, 'chat_sessions', currentSessionId), {
            id: currentSessionId,
            title: newTitle,
            messages: finalMessagesWithError,
            timestamp: currentSession.timestamp,
            userId: user.uid,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          console.error(err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto h-[calc(100vh-160px)] md:h-[calc(100vh-110px)] flex flex-col md:flex-row gap-6 relative overflow-hidden w-full">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shrink-0 h-full justify-between">
        <div className="flex flex-col flex-1 overflow-hidden">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-sm mb-4 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>{language === 'en' ? 'New Chat' : language === 'ha' ? 'Tattaunawa Sabuwa' : 'Nouvelle discussion'}</span>
          </button>

          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-widest px-2 mb-3 shrink-0">
            <History size={14} />
            <span>{language === 'en' ? 'History' : language === 'ha' ? 'Tarihi' : 'Historique'}</span>
          </div>

          <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                  activeSessionId === s.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                  <MessageSquare size={16} className="shrink-0 opacity-70" />
                  <span className="truncate text-sm">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                  title="Supprimer la discussion"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER PERSISTENCE INDICATOR & CLEAR ALL */}
        <div className="flex items-center justify-between gap-2 px-2 pt-4 border-t border-gray-100 dark:border-gray-800 shrink-0 mt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            {user ? (
              <>
                <Cloud size={14} className="text-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">Cloud activé</span>
              </>
            ) : (
              <>
                <CloudOff size={14} className="text-amber-500 shrink-0" />
                <span className="truncate">Stockage local</span>
              </>
            )}
          </div>
          <button
            onClick={handleClearAllHistory}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shrink-0"
            title={language === 'en' ? 'Clear all history' : language === 'ha' ? 'Share duka' : 'Effacer tout l\'historique'}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-950 z-50 p-6 flex flex-col md:hidden justify-between animate-none"
            >
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bot size={20} className="text-emerald-500" />
                    FAQ IA Historique
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <button
                  onClick={handleNewSession}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-sm mb-6 shrink-0 cursor-pointer"
                >
                  <Plus size={18} />
                  <span>{language === 'en' ? 'New Chat' : language === 'ha' ? 'Tattaunawa Sabuwa' : 'Nouvelle discussion'}</span>
                </button>

                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-widest px-2 mb-3 shrink-0">
                  <History size={14} />
                  <span>{language === 'en' ? 'History' : language === 'ha' ? 'Tarihi' : 'Historique'}</span>
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                  {sessions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveSessionId(s.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        activeSessionId === s.id
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold'
                          : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                        <MessageSquare size={16} className="shrink-0 opacity-70" />
                        <span className="truncate text-sm">{s.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOBILE FOOTER PERSISTENCE INDICATOR & CLEAR ALL */}
              <div className="flex items-center justify-between gap-2 px-2 pt-4 border-t border-gray-100 dark:border-gray-850 shrink-0 mt-4">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                  {user ? (
                    <>
                      <Cloud size={14} className="text-emerald-500 animate-pulse shrink-0" />
                      <span className="truncate">Cloud activé</span>
                    </>
                  ) : (
                    <>
                      <CloudOff size={14} className="text-amber-500 shrink-0" />
                      <span className="truncate">Stockage local</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleClearAllHistory}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shrink-0"
                  title={language === 'en' ? 'Clear all history' : language === 'ha' ? 'Share duka' : 'Effacer tout l\'historique'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CHAT MAIN INTERFACE */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        
        {/* HEADER / ACTIONS BAR */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shrink-0">
              <ChevronLeft size={24} />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shrink-0 cursor-pointer"
              title="Afficher l'historique"
            >
              <Menu size={24} />
            </button>
            <div className="truncate">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-emerald-500 shrink-0" size={20} />
                <span className="truncate">AsrarHub Assistant AI</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {language === 'en' 
                  ? 'Ask any questions about Wirds, spiritual points or Quranic features.' 
                  : language === 'ha' 
                    ? 'Tambayi komai game da Wirds, maki na ruhaniya, ko kariya.' 
                    : 'Posez des questions sur les wirds, les points spirituels et les outils.'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleNewSession}
            className="md:hidden flex items-center justify-center p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-sm"
            title="Nouvelle conversation"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex flex-col overflow-hidden relative min-w-0 w-full">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Bot size={48} className="mb-4 text-emerald-100 dark:text-emerald-900 animate-pulse" />
                <p className="mb-6 max-w-md text-sm leading-relaxed">
                  {language === 'en'
                    ? "Hello! I am your spiritual helper AI. Ask me about wirds, protective prayers, planetary hours or magic squares."
                    : language === 'ha'
                      ? "Barka da zuwa! Ni ne mataimakin ku na asiri da ruhaniya. Tambaye ni game da zikirai, kariya, ko taurari."
                      : "Je suis votre assistant IA spécialisé dans les sciences spirituelles et l'utilisation de l'application AsrarHub. Posez-moi vos questions."
                  }
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-full px-2">
                  {promptsToShow.map((q, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleAsk(q)}
                      className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer whitespace-normal break-words text-left sm:text-center max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-br-none' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-850 dark:text-gray-150 rounded-bl-none border border-gray-200/20'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-gray-100 text-sm break-words overflow-x-auto">
                        <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none p-4 text-gray-500 flex items-center gap-2 border border-gray-200/20 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT FORM */}
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder={language === 'en' ? 'Ask a question...' : language === 'ha' ? 'Yi tambaya...' : 'Posez votre question...'}
              disabled={isLoading}
              className="w-full pl-5 pr-14 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm shadow-inner"
            />
            <button
              onClick={() => handleAsk()}
              disabled={!question.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-emerald-500 text-white disabled:opacity-50 disabled:bg-gray-450 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
