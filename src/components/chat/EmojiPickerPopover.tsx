import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Clock, Sparkles, Smile, ThumbsUp, Heart, Leaf, Lightbulb, X } from "lucide-react";

export interface EmojiItem {
  emoji: string;
  name: string;
  category: "spiritual" | "smileys" | "gestures" | "hearts" | "nature" | "objects";
  keywords: string[];
}

export const EMOJI_DATABASE: EmojiItem[] = [
  // --- SPIRITUAL & ISLAMIC ---
  { emoji: "📿", name: "Chapelet / Tasbih", category: "spiritual", keywords: ["tasbih", "chapelet", "dhikr", "wird", "prière", "perles", "beads"] },
  { emoji: "🤲", name: "Mains levées / Doua", category: "spiritual", keywords: ["doua", "dua", "priere", "supplication", "mains", "allah", "demande"] },
  { emoji: "🕌", name: "Mosquée", category: "spiritual", keywords: ["mosquee", "masjid", "islam", "priere", "salat", "dome", "minaret"] },
  { emoji: "🕋", name: "Kaaba", category: "spiritual", keywords: ["kaaba", "mecque", "hajj", "omra", "pelerinage", "tawaf"] },
  { emoji: "🌙", name: "Croissant de lune", category: "spiritual", keywords: ["croissant", "lune", "hilal", "ramadan", "nuit", "islam"] },
  { emoji: "✨", name: "Étincelles / Lumière sacrée", category: "spiritual", keywords: ["lumiere", "baraka", "etincelles", "brillant", "sirr", "nour", "etoiles"] },
  { emoji: "🕊️", name: "Colombe de paix", category: "spiritual", keywords: ["colombe", "paix", "oiseau", "salam", "ange", "pur"] },
  { emoji: "📖", name: "Livre ouvert / Coran", category: "spiritual", keywords: ["coran", "livre", "sourate", "lecture", "quran", "kitab", "science"] },
  { emoji: "📜", name: "Parchemin / Rouleau", category: "spiritual", keywords: ["parchemin", "wird", "khatim", "recette", "secret", "manuscrit", "talismans"] },
  { emoji: "🕯️", name: "Bougie / Éveil", category: "spiritual", keywords: ["bougie", "flamme", "lumiere", "meditation", "nuit", "zikr"] },
  { emoji: "⭐", name: "Étoile", category: "spiritual", keywords: ["etoile", "star", "ciel", "nuit", "lumiere"] },
  { emoji: "🌟", name: "Étoile brillante", category: "spiritual", keywords: ["etoile", "nour", "brillant", "succes", "eclat"] },
  { emoji: "💫", name: "Étoile filante", category: "spiritual", keywords: ["etoile", "filante", "voeu", "mystique"] },
  { emoji: "☀️", name: "Soleil radieux", category: "spiritual", keywords: ["soleil", "chams", "aurore", "jour", "clarté"] },
  { emoji: "🌅", name: "Lever de soleil / Fajr", category: "spiritual", keywords: ["fajr", "aurore", "matin", "aube", "priere"] },
  { emoji: "🤍", name: "Cœur blanc pur", category: "spiritual", keywords: ["coeur", "blanc", "purete", "ikhlas", "sincerite"] },
  { emoji: "💚", name: "Cœur vert spirituel", category: "spiritual", keywords: ["coeur", "vert", "islam", "paradis", "prophete", "amour"] },
  { emoji: "🌿", name: "Branche de verdure", category: "spiritual", keywords: ["plante", "paradis", "paix", "nature"] },
  { emoji: "🍃", name: "Feuille au vent", category: "spiritual", keywords: ["feuille", "vent", "souffle", "ruh"] },
  { emoji: "🌺", name: "Fleur du paradis", category: "spiritual", keywords: ["fleur", "paradis", "beaute", "jardin"] },

  // --- SMILEYS & EMOTIONS ---
  { emoji: "😀", name: "Grand sourire", category: "smileys", keywords: ["sourire", "heureux", "joie", "happy", "smile"] },
  { emoji: "😃", name: "Sourire radieux", category: "smileys", keywords: ["sourire", "yeux", "content", "rire"] },
  { emoji: "😄", name: "Sourire bouche bée", category: "smileys", keywords: ["rire", "content", "satisfait"] },
  { emoji: "😁", name: "Sourire éclatant", category: "smileys", keywords: ["dents", "content", "eclat"] },
  { emoji: "😆", name: "Rire fermé", category: "smileys", keywords: ["mort de rire", "amuse"] },
  { emoji: "😅", name: "Sourire avec sueur", category: "smileys", keywords: ["soulagement", "sueur", "ouf"] },
  { emoji: "🤣", name: "Roulant de rire", category: "smileys", keywords: ["mdr", "ptdr", "trop drole", "lol"] },
  { emoji: "😂", name: "Larmes de joie", category: "smileys", keywords: ["pleure de rire", "mdr", "rire", "larmes"] },
  { emoji: "🙂", name: "Léger sourire", category: "smileys", keywords: ["calme", "doux", "paisible"] },
  { emoji: "🙃", name: "Sourire à l'envers", category: "smileys", keywords: ["ironie", "blague", "fou"] },
  { emoji: "😉", name: "Clin d'œil", category: "smileys", keywords: ["clin d'oeil", "complice", "astuce"] },
  { emoji: "😊", name: "Sourire modeste", category: "smileys", keywords: ["timide", "chaleureux", "modeste", "bienveillant"] },
  { emoji: "😇", name: "Auréole d'ange", category: "smileys", keywords: ["ange", "innocent", "benediction", "pur"] },
  { emoji: "🥰", name: "Visage avec cœurs", category: "smileys", keywords: ["amour", "reconnaissance", "choyé", "aime"] },
  { emoji: "😍", name: "Yeux en cœurs", category: "smileys", keywords: ["coup de foudre", "adore", "magnifique", "sublime"] },
  { emoji: "🤩", name: "Yeux étoiles", category: "smileys", keywords: ["emerveille", "fascine", "etoiles", "impressionne"] },
  { emoji: "😘", name: "Bisou volant", category: "smileys", keywords: ["bisou", "coeur", "affection"] },
  { emoji: "😋", name: "Savourant", category: "smileys", keywords: ["delicieux", "gourmand", "plaisir"] },
  { emoji: "😛", name: "Tirant la langue", category: "smileys", keywords: ["langue", "jeu", "farce"] },
  { emoji: "😜", name: "Langue et clin d'œil", category: "smileys", keywords: ["blague", "rigolo", "clin"] },
  { emoji: "🤪", name: "Visage foufou", category: "smileys", keywords: ["fou", "excitation", "dingue"] },
  { emoji: "🤗", name: "Câlin / Étreinte fraternelle", category: "smileys", keywords: ["calin", "bienvenue", "accolade", "chaleur", "hello", "bonjour"] },
  { emoji: "🤔", name: "Pensif / Réflexion", category: "smileys", keywords: ["pense", "reflechi", "doute", "question", "pourquoi"] },
  { emoji: "🫡", name: "Salutation respectueuse", category: "smileys", keywords: ["respect", "salut", "commandement", "compris"] },
  { emoji: "🤫", name: "Chut / Secret", category: "smileys", keywords: ["secret", "sirr", "silence", "discretion"] },
  { emoji: "🤭", name: "Main sur la bouche", category: "smileys", keywords: ["oups", "rire secret", "pardon"] },
  { emoji: "😎", name: "Lunettes de soleil / Sage", category: "smileys", keywords: ["cool", "confiant", "classe", "maitre"] },
  { emoji: "🤓", name: "Savant / Érudit", category: "smileys", keywords: ["erudit", "livres", "etudes", "talib"] },
  { emoji: "🧐", name: "Monocle / Observateur", category: "smileys", keywords: ["analyse", "curieux", "scruter"] },
  { emoji: "😌", name: "Soulagé / Sérénité", category: "smileys", keywords: ["paisible", "alhamdulillah", "zen", "paix"] },
  { emoji: "🥺", name: "Yeux suppliants", category: "smileys", keywords: ["plaidoyer", "sensible", "implore"] },
  { emoji: "🥹", name: "Retenant ses larmes", category: "smileys", keywords: ["emouvant", "reconnaissant", "touche"] },
  { emoji: "😢", name: "Une larme", category: "smileys", keywords: ["triste", "larme", "chagrin"] },
  { emoji: "😭", name: "Pleurs intenses", category: "smileys", keywords: ["pleure", "tres triste", "emotion"] },
  { emoji: "😤", name: "Déterminé", category: "smileys", keywords: ["volonte", "force", "courage"] },
  { emoji: "🤯", name: "Cerveau qui explose", category: "smileys", keywords: ["epoustouflant", "incroyable", "choc", "subhanallah"] },
  { emoji: "🥳", name: "Fête / Célébration", category: "smileys", keywords: ["eid", "fete", "mabrouk", "felicitations", "joie"] },
  { emoji: "😴", name: "Endormi", category: "smileys", keywords: ["sommeil", "dodo", "nuit", "repos"] },
  { emoji: "😷", name: "Masque / Prudence", category: "smileys", keywords: ["malade", "protection", "sante"] },
  { emoji: "🤝", name: "Poignée de main", category: "smileys", keywords: ["accord", "bienvenue", "pacte", "fraternite"] },

  // --- GESTURES & HANDS ---
  { emoji: "👍", name: "Pouce levé", category: "gestures", keywords: ["pouce", "ok", "d'accord", "bien", "valide", "top"] },
  { emoji: "👎", name: "Pouce baissé", category: "gestures", keywords: ["non", "pas d'accord", "mauvais"] },
  { emoji: "👏", name: "Applaudissements", category: "gestures", keywords: ["bravo", "felicitations", "applaudir", "succes"] },
  { emoji: "🙌", name: "Mains levées de joie", category: "gestures", keywords: ["victoire", "gloire", "alhamdulillah", "joie"] },
  { emoji: "👐", name: "Mains ouvertes", category: "gestures", keywords: ["accueil", "don", "partage", "bienvenue"] },
  { emoji: "🙏", name: "Mains jointes / Respect", category: "gestures", keywords: ["choukran", "merci", "respect", "priere", "gratitude"] },
  { emoji: "✌️", name: "Signe de paix / Victoire", category: "gestures", keywords: ["paix", "victoire", "salut"] },
  { emoji: "🤞", name: "Doigts croisés", category: "gestures", keywords: ["espoir", "insha'allah", "chance"] },
  { emoji: "🫰", name: "Cœur avec les doigts", category: "gestures", keywords: ["amour", "coree", "mignon"] },
  { emoji: "🤟", name: "Signe d'amour", category: "gestures", keywords: ["amour", "respect", "rock"] },
  { emoji: "☝️", name: "Index levé / Tawhid", category: "gestures", keywords: ["tawhid", "unicite", "un", "allah", "attention", "rappel"] },
  { emoji: "✋", name: "Main levée / Halte", category: "gestures", keywords: ["salut", "stop", "presence"] },
  { emoji: "👋", name: "Signe de la main", category: "gestures", keywords: ["bonjour", "au revoir", "salut", "coucou"] },
  { emoji: "✍️", name: "Main qui écrit", category: "gestures", keywords: ["ecrire", "note", "khatim", "wird", "copier"] },
  { emoji: "💪", name: "Muscle / Force", category: "gestures", keywords: ["force", "puissance", "courage", "determination"] },
  { emoji: "🫶", name: "Mains formant un cœur", category: "gestures", keywords: ["coeur", "amour", "bienveillance"] },

  // --- HEARTS & LOVE ---
  { emoji: "❤️", name: "Cœur rouge", category: "hearts", keywords: ["coeur", "amour", "aimer", "passion"] },
  { emoji: "💚", name: "Cœur vert", category: "hearts", keywords: ["vert", "paradis", "amour spirituel", "paix"] },
  { emoji: "🤍", name: "Cœur blanc", category: "hearts", keywords: ["purete", "paix", "bonte", "lumiere"] },
  { emoji: "💛", name: "Cœur jaune", category: "hearts", keywords: ["amitie", "soleil", "chaleur"] },
  { emoji: "💙", name: "Cœur bleu", category: "hearts", keywords: ["serenite", "fidelite", "calme"] },
  { emoji: "💜", name: "Cœur violet", category: "hearts", keywords: ["spiritualite", "noble", "magique"] },
  { emoji: "🤎", name: "Cœur brun / Terre", category: "hearts", keywords: ["terre", "ancrage", "racine"] },
  { emoji: "🖤", name: "Cœur noir", category: "hearts", keywords: ["sombre", "mystere"] },
  { emoji: "❤️‍🔥", name: "Cœur en feu", category: "hearts", keywords: ["ardeur", "flamme", "energie", "passion"] },
  { emoji: "❤️‍🩹", name: "Cœur en guérison", category: "hearts", keywords: ["guerison", "chifa", "reparation", "soulagement"] },
  { emoji: "❣️", name: "Point d'exclamation cœur", category: "hearts", keywords: ["attention", "amour", "important"] },
  { emoji: "💕", name: "Deux cœurs", category: "hearts", keywords: ["affection", "amour mutuel"] },
  { emoji: "💖", name: "Cœur scintillant", category: "hearts", keywords: ["etoiles", "eclat", "cheri"] },
  { emoji: "💗", name: "Cœur qui bat", category: "hearts", keywords: ["vie", "battement", "emotion"] },
  { emoji: "💌", name: "Lettre d'amour / Message", category: "hearts", keywords: ["message", "lettre", "secret"] },

  // --- NATURE & ANIMALS ---
  { emoji: "🕊️", name: "Colombe blanche", category: "nature", keywords: ["colombe", "paix", "pur"] },
  { emoji: "🦅", name: "Aigle royal", category: "nature", keywords: ["aigle", "hauteur", "puissance"] },
  { emoji: "🐪", name: "Dromadaire", category: "nature", keywords: ["chameau", "desert", "voyage", "endurance"] },
  { emoji: "🐫", name: "Chameau", category: "nature", keywords: ["desert", "caravane"] },
  { emoji: "🐎", name: "Cheval noble", category: "nature", keywords: ["cheval", "force", "vitesse", "noble"] },
  { emoji: "🦁", name: "Lion majestueux", category: "nature", keywords: ["lion", "courage", "roi", "bravoure"] },
  { emoji: "🌴", name: "Palmier du désert", category: "nature", keywords: ["palmier", "oasis", "dattes", "ombre"] },
  { emoji: "🌲", name: "Arbre éternel", category: "nature", keywords: ["foret", "nature", "vie"] },
  { emoji: "🌹", name: "Rose parfumée", category: "nature", keywords: ["rose", "parfum", "fleur", "amour"] },
  { emoji: "🌸", name: "Fleur de cerisier", category: "nature", keywords: ["printemps", "delicat"] },
  { emoji: "🌼", name: "Fleur jaune", category: "nature", keywords: ["fleur", "soleil"] },
  { emoji: "🌞", name: "Soleil à visage", category: "nature", keywords: ["soleil", "clarté", "lumiere"] },
  { emoji: "🌧️", name: "Pluie bienfaisante", category: "nature", keywords: ["pluie", "rahma", "misericorde", "eau"] },
  { emoji: "⚡", name: "Éclair d'énergie", category: "nature", keywords: ["foudre", "puissance", "energie", "vitesse"] },
  { emoji: "🌊", name: "Vague de l'océan", category: "nature", keywords: ["mer", "eau", "bahr", "vague"] },

  // --- OBJECTS & SYMBOLS ---
  { emoji: "💡", name: "Ampoule / Idée", category: "objects", keywords: ["idee", "lumiere", "solution", "inspiration"] },
  { emoji: "🔑", name: "Clé des secrets", category: "objects", keywords: ["cle", "miftah", "secret", "ouverture", "fath"] },
  { emoji: "💎", name: "Diamant précieux", category: "objects", keywords: ["diamant", "tresor", "bijou", "precieux"] },
  { emoji: "🛡️", name: "Bouclier protecteur", category: "objects", keywords: ["bouclier", "protection", "hifz", "defense"] },
  { emoji: "⚔️", name: "Épées croisées", category: "objects", keywords: ["epee", "zulfiqar", "combat", "force"] },
  { emoji: "🧭", name: "Boussole / Qibla", category: "objects", keywords: ["boussole", "qibla", "direction", "orientation"] },
  { emoji: "⌛", name: "Sablier", category: "objects", keywords: ["temps", "patience", "heure"] },
  { emoji: "⏳", name: "Sablier qui coule", category: "objects", keywords: ["attente", "temps", "cycle"] },
  { emoji: "⏰", name: "Réveil / Heure de prière", category: "objects", keywords: ["reveil", "heure", "salat"] },
  { emoji: "🔔", name: "Cloche de rappel", category: "objects", keywords: ["rappel", "sonnette", "alerte"] },
  { emoji: "🎁", name: "Cadeau / Don", category: "objects", keywords: ["cadeau", "hadiya", "don", "surprise"] },
  { emoji: "🏆", name: "Trophée d'honneur", category: "objects", keywords: ["victoire", "succes", "trophee"] },
  { emoji: "🥇", name: "Médaille d'or", category: "objects", keywords: ["premier", "or", "recompense"] },
  { emoji: "🎯", name: "Cible / Objectif atteint", category: "objects", keywords: ["cible", "but", "precision"] },
  { emoji: "🔒", name: "Cadenas fermé", category: "objects", keywords: ["ferme", "secret", "garde"] },
  { emoji: "🔓", name: "Cadenas ouvert", category: "objects", keywords: ["ouvert", "libere", "debloque"] },
  { emoji: "💯", name: "Score 100 / Parfait", category: "objects", keywords: ["cent", "parfait", "complet"] },
  { emoji: "🔥", name: "Feu sacré / Énergie", category: "objects", keywords: ["feu", "energie", "ardeur", "force", "chaleur"] },
  { emoji: "📌", name: "Épingle de rappel", category: "objects", keywords: ["epingle", "fixer", "important"] },
  { emoji: "📢", name: "Mégaphone / Annonce", category: "objects", keywords: ["annonce", "nouvelle", "message"] }
];

const RECENT_STORAGE_KEY = "asrarhub_recent_emojis";

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  anchorDirection?: "up" | "down";
}

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  anchorDirection = "up",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recents on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) {
        setRecentEmojis(JSON.parse(saved).slice(0, 16));
      }
    } catch (_) {}
  }, []);

  // Save to recent
  const handlePickEmoji = (emoji: string) => {
    onSelectEmoji(emoji);
    try {
      const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 20);
      setRecentEmojis(updated);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filtered emojis
  const filteredEmojis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EMOJI_DATABASE.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.emoji.includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute left-0 sm:left-2 ${
        anchorDirection === "up" ? "bottom-full mb-3" : "top-full mt-3"
      } w-[92vw] sm:w-[380px] max-w-[400px] bg-white dark:bg-[#15202e] border border-gray-200 dark:border-gray-700/80 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col backdrop-blur-xl animate-fadeIn`}
      style={{ maxHeight: "420px" }}
    >
      {/* Header with Search and Close button */}
      <div className="p-3 border-b border-gray-150 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/60 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un emoji (prière, cœur, rire...)..."
            className="w-full bg-white dark:bg-[#1c2a3d] border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-8 py-1.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          title="Fermer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-[#15202e]/50 overflow-x-auto no-scrollbar select-none">
        <button
          type="button"
          onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "all"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <Sparkles size={12} />
          <span>Tous</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("spiritual"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "spiritual"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Spiritualité & Islam"
        >
          <span>📿</span>
          <span>Spirituel</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("smileys"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "smileys"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Smileys & Émotions"
        >
          <Smile size={12} />
          <span>Émotions</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("gestures"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "gestures"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Gestes & Mains"
        >
          <ThumbsUp size={12} />
          <span>Gestes</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("hearts"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "hearts"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Cœurs & Amour"
        >
          <Heart size={12} />
          <span>Cœurs</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("nature"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "nature"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Nature & Animaux"
        >
          <Leaf size={12} />
          <span>Nature</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveCategory("objects"); setSearchQuery(""); }}
          className={`px-2 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategory === "objects"
              ? "bg-emerald-500 text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Objets & Symboles"
        >
          <Lightbulb size={12} />
          <span>Objets</span>
        </button>
      </div>

      {/* Main Emojis Grid Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[280px] scrollbar-thin">
        {/* Recents row (if any and not searching) */}
        {!searchQuery && recentEmojis.length > 0 && activeCategory === "all" && (
          <div className="space-y-1.5 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              <Clock size={11} />
              <span>Récents</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
              {recentEmojis.map((emoji, idx) => (
                <button
                  key={`recent-${emoji}-${idx}`}
                  type="button"
                  onClick={() => handlePickEmoji(emoji)}
                  className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-transform hover:scale-125 active:scale-95 cursor-pointer select-none"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emojis list */}
        {filteredEmojis.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
            <Smile size={24} className="opacity-40" />
            <p>Aucun emoji trouvé pour « {searchQuery} »</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
            {filteredEmojis.map((item, idx) => (
              <button
                key={`emoji-${item.emoji}-${idx}`}
                type="button"
                onClick={() => handlePickEmoji(item.emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-transform hover:scale-125 active:scale-95 cursor-pointer select-none"
                title={`${item.emoji} ${item.name}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 py-1.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between text-[10px] text-gray-400">
        <span>{filteredEmojis.length} emojis disponibles</span>
        <span className="font-medium text-emerald-600 dark:text-teal-400">Cliquez pour insérer</span>
      </div>
    </div>
  );
};
