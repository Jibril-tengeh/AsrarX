import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Crown,
  BookOpen,
  Moon,
  Shield,
  Compass
} from "lucide-react";
import { useBackButton } from "../../hooks/useBackButton";

export interface AiChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp?: string;
}

interface CommunityAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  navigate: (path: string) => void;
  messages: AiChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onResetChat?: () => void;
}

const SUGGESTED_QUESTIONS = [
  { text: "Bienfaits & Zikr de Ya Latif ?", icon: "✨", category: "Noms d'Allah" },
  { text: "Un wird puissant pour la paix du cœur", icon: "🕊️", category: "Wirds" },
  { text: "Interpréter un rêve de lion ou d'eau limpide", icon: "🌙", category: "Rêves" },
  { text: "Secrets & Bienfaits de la Salat al-Fatih", icon: "💎", category: "Salat" },
  { text: "Wird d'ouverture et de subsistance (Rizq)", icon: "🌿", category: "Ouverture" },
  { text: "Protection contre le mauvais œil et blocages", icon: "🛡️", category: "Protection" },
  { text: "Comment calculer la valeur Abjad d'un Nom ?", icon: "🔢", category: "Abjad" },
];

export const CommunityAiAssistantModal: React.FC<CommunityAiAssistantModalProps> = ({
  isOpen,
  onClose,
  user,
  navigate,
  messages,
  onSendMessage,
  isLoading,
  onResetChat,
}) => {
  const [inputText, setInputText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook into hardware / navigation back button
  useBackButton(() => {
    onClose();
  }, isOpen);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && (user?.subscriptionTier === "premium" || user?.subscriptionTier === "pro" || user?.role === "admin")) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, user]);

  const handleSend = (textOverride?: string) => {
    const query = (textOverride || inputText).trim();
    if (!query || isLoading) return;
    setInputText("");
    onSendMessage(query);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  const isUserPremium =
    user?.subscriptionTier === "premium" ||
    user?.subscriptionTier === "pro" ||
    user?.role === "admin";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-[65] flex flex-col bg-slate-50 dark:bg-[#0b1120] text-gray-900 dark:text-gray-100 ${
          isFullscreen ? "w-full h-full" : "max-w-4xl mx-auto my-auto h-[90vh] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
        } overflow-hidden font-sans`}
      >
        {/* Fullscreen Header */}
        <header className="h-16 px-3 sm:px-6 bg-white dark:bg-[#0f172a] border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Native-style Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer shrink-0"
              title="Retour à la Communauté"
              aria-label="Retour"
            >
              <ArrowLeft size={22} />
            </button>

            {/* AI Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-500/20 text-lg">
                🕌
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full ring-2 ring-emerald-400/40 animate-pulse" />
            </div>

            {/* Title & Status */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                  <span>IA Asrar</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-teal-400 rounded-full border border-emerald-500/20 hidden sm:inline-flex items-center gap-1">
                    <Sparkles size={11} />
                    Guide Spirituel
                  </span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-teal-400 font-medium truncate flex items-center gap-1">
                <span>En direct</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-gray-500 dark:text-gray-400 truncate">
                  Wirds, Noms d'Allah, Rêves & Secrets coraniques
                </span>
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Reset chat button */}
            {onResetChat && (
              <button
                type="button"
                onClick={onResetChat}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 rounded-xl transition-all cursor-pointer"
                title="Recommencer la conversation"
              >
                <RotateCcw size={18} />
              </button>
            )}

            {/* Toggle Fullscreen / Windowed */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 rounded-xl transition-all cursor-pointer hidden md:flex"
              title={isFullscreen ? "Réduire l'affichage" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 rounded-xl transition-all cursor-pointer"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        {!isUserPremium ? (
          /* Premium locked state */
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white dark:bg-[#111927] border border-gray-200/90 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/25">
                <Crown size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Assistant Spirituel IA Plein Écran
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Bénéficiez d'un accompagnateur spirituel érudit pour vos wirds, l'interprétation islamique de vos songes selon Ibn Sirin, les Noms d'Allah et les secrets d'AsrarHub.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="text-emerald-500 font-extrabold text-sm flex items-center gap-1.5 mb-1">
                    <BookOpen size={15} />
                    <span>Wirds</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Protocoles de zikr personnalisés et calculs Abjad.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="text-blue-500 font-extrabold text-sm flex items-center gap-1.5 mb-1">
                    <Moon size={15} />
                    <span>Rêves</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Interprétations précises selon la Sunna et Ibn Sirin.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/profile");
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                Passer à l'abonnement Premium
              </button>
            </div>
          </div>
        ) : (
          /* Active Chat in Fullscreen */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
              <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={`ai-full-msg-${idx}`}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    {msg.sender === "user" ? (
                      /* User Message Bubble */
                      <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[75%]">
                        <div className="p-3.5 sm:p-4 rounded-2xl rounded-tr-xs bg-emerald-600 dark:bg-emerald-700 text-white shadow-sm text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      /* AI Message Card with Rich Markdown */
                      <div className="flex items-start gap-2.5 sm:gap-3 max-w-[96%] sm:max-w-[90%] w-full">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-sm shrink-0 shadow-sm mt-1">
                          🕌
                        </div>
                        <div className="flex-1 min-w-0 bg-white dark:bg-[#111a28] rounded-2xl rounded-tl-xs border border-gray-200/80 dark:border-gray-800/80 p-4 sm:p-6 shadow-sm">
                          {/* Card Header with Copy button */}
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100 dark:border-gray-800/60">
                            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={12} />
                              Guide Spirituel IA Asrar
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.text, idx)}
                              className="text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                              title="Copier la réponse"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check size={12} className="text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">Copié !</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copier</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Markdown renderer with strict professional H1-H6 styling, colors and emojis */}
                          <div className="text-gray-800 dark:text-gray-100 text-xs sm:text-sm leading-relaxed space-y-2">
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-lg sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-4 mb-3 pb-2 border-b-2 border-emerald-500/20 dark:border-emerald-500/30 flex items-center gap-2.5 tracking-tight">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base sm:text-xl font-extrabold text-teal-700 dark:text-teal-300 mt-4 mb-2 flex items-center gap-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm sm:text-lg font-bold text-amber-700 dark:text-amber-400 mt-3 mb-1.5 flex items-center gap-2">
                                    {children}
                                  </h3>
                                ),
                                h4: ({ children }) => (
                                  <h4 className="text-xs sm:text-base font-bold text-blue-700 dark:text-blue-400 mt-2.5 mb-1 flex items-center gap-1.5">
                                    {children}
                                  </h4>
                                ),
                                h5: ({ children }) => (
                                  <h5 className="text-[11px] sm:text-sm font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 mt-2 mb-1 flex items-center gap-1.5">
                                    {children}
                                  </h5>
                                ),
                                h6: ({ children }) => (
                                  <h6 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-rose-700 dark:text-rose-400 mt-1.5 mb-1 flex items-center gap-1">
                                    {children}
                                  </h6>
                                ),
                                p: ({ children }) => (
                                  <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-200 my-2">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="space-y-1.5 my-2.5 pl-1 sm:pl-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200 list-none">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="space-y-1.5 my-2.5 pl-5 text-xs sm:text-sm text-gray-700 dark:text-gray-200 list-decimal marker:text-emerald-600 dark:marker:text-teal-400 marker:font-bold">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed flex items-start gap-2">
                                    <span className="text-emerald-500 dark:text-teal-400 mt-1 shrink-0 text-xs">🔹</span>
                                    <div className="flex-1">{children}</div>
                                  </li>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-emerald-500 dark:border-teal-400 bg-emerald-500/10 dark:bg-emerald-950/30 px-4 py-3 rounded-r-2xl my-3 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 italic shadow-xs">
                                    {children}
                                  </blockquote>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">
                                    {children}
                                  </strong>
                                ),
                                code: ({ children }) => (
                                  <code className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-teal-300 font-mono px-2 py-0.5 rounded text-[11px] sm:text-xs border border-emerald-200 dark:border-emerald-800/60 font-semibold">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {msg.text}
                            </Markdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-teal-400 text-xs font-bold p-3 bg-emerald-500/10 dark:bg-emerald-950/20 rounded-2xl border border-emerald-500/20 w-fit animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>L'IA Asrar consulte les sagesses spirituelles et compose votre réponse...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Suggestions & Input Section */}
            <div className="bg-white dark:bg-[#0f172a] border-t border-gray-200/80 dark:border-gray-800/80 p-3 sm:p-4 shrink-0 shadow-lg z-20">
              <div className="max-w-4xl mx-auto w-full space-y-2.5">
                {/* Horizontal Suggestion Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={`sug-pill-${idx}`}
                      type="button"
                      onClick={() => handleSend(q.text)}
                      disabled={isLoading}
                      className="shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 dark:bg-[#182335] dark:hover:bg-emerald-950/40 text-gray-700 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-teal-300 border border-gray-200/70 dark:border-gray-750/50 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <span>{q.icon}</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Posez votre question spirituelle (wirds, Noms d'Allah, rêves, secrets)..."
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-[#162032] border border-gray-200 dark:border-gray-750 text-xs sm:text-sm text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-gray-400 transition-all disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="w-11 h-11 flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-md shadow-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer shrink-0"
                    title="Envoyer la question"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
