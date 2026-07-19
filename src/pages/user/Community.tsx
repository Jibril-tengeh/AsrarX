import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Pin,
  Inbox,
  Share2,
  Mic,
  Volume2,
  Play,
  Pause,
  Image as ImageIcon,
  Video as VideoIcon,
  Code as CodeIcon,
  Smile,
  Trash2,
  Copy,
  Check,
  MapPin,
  ThumbsUp,
  Heart,
  Globe,
  Plus,
  Square,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Vote,
  Radio,
  X,
  Flag,
  AlertTriangle,
  MoreHorizontal,
  CornerUpLeft,
  Pencil,
  Bookmark
} from "lucide-react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Import comments
import { PostComments } from "./PostComments";
import { DirectMessages } from "./DirectMessages";

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorLocation?: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  isPinned?: boolean;
  codeSnippet?: {
    code: string;
    language: string;
    explanation?: string;
  };
  voiceNotes?: string[]; // base64 arrays
  attachments?: {
    type: "image" | "video";
    url: string; // base64 urls
  }[];
  reactions?: {
    like?: string[]; // userIds
    love?: string[];
    haha?: string[];
    wow?: string[];
    sad?: string[];
    angry?: string[];
  };
}

const localTranslations: Record<string, Record<string, string>> = {
  fr: {
    communityTitle: "Asrar Communauté",
    communitySubtitle: "Partagez vos secrets spirituels, wirds et codes",
    standardTab: "Publication standard",
    codeTab: "Éditeur de code Pro",
    writePlaceholder: "Partagez une question, une expérience spirituelle ou un wird précieux...",
    codePlaceholder: "Saisissez votre code, formule mathématique ou script de zikr...",
    expPlaceholder: "Expliquez brièvement ce que fait ce code ou comment l'utiliser...",
    languageLabel: "Langage",
    attachImage: "Ajouter des images",
    attachVideo: "Ajouter une vidéo",
    recording: "Enregistrement en cours...",
    clickToRecord: "Enregistrer un message vocal",
    stopRecord: "Arrêter l'enregistrement",
    previewVoice: "Écouter le message vocal",
    deleteVoice: "Supprimer",
    publishBtn: "Publier dans le flux",
    publishing: "Publication en cours...",
    mustBeLoggedIn: "Veuillez vous connecter pour publier.",
    publishedSuccess: "Publication réussie !",
    pendingMod: "Votre message est en attente de modération.",
    noPosts: "Aucune publication pour le moment. Lancez la discussion !",
    reactionsCount: "réactions",
    commentBtn: "Commenter",
    shareBtn: "Partager",
    copyCode: "Copier le code",
    copiedCode: "Copié !",
    pinned: "Épinglé par l'administrateur",
    allCircles: "Toutes les publications",
    emojisTitle: "Insérer un émoji",
    deletePostBtn: "Supprimer la publication",
    proPreview: "Aperçu du code en direct",
    messagesTab: "Discussions",
    pollsTab: "Sondages",
    friendsTab: "Membres & Amis",
    onlineTab: "Membres en Ligne",
    addFriend: "Ajouter en ami",
    removeFriend: "Retirer",
    alreadyVoted: "Déjà voté",
    voteBtn: "Voter",
    totalVotes: "votes",
    searchMembers: "Rechercher des membres ou pays..."
  },
  en: {
    communityTitle: "Asrar Community",
    communitySubtitle: "Share your spiritual secrets, wirds, and codes",
    standardTab: "Standard Post",
    codeTab: "Pro Code Editor",
    writePlaceholder: "Share a question, a spiritual experience, or a precious wird...",
    codePlaceholder: "Enter your code, mathematical formula, or zikr script...",
    expPlaceholder: "Briefly explain what this code does or how to use it...",
    languageLabel: "Language",
    attachImage: "Add Images",
    attachVideo: "Add Video",
    recording: "Recording in progress...",
    clickToRecord: "Record a voice note",
    stopRecord: "Stop recording",
    previewVoice: "Preview voice note",
    deleteVoice: "Delete",
    publishBtn: "Publish to Feed",
    publishing: "Publishing...",
    mustBeLoggedIn: "Please log in to publish.",
    publishedSuccess: "Published successfully!",
    pendingMod: "Your post is pending moderation.",
    noPosts: "No posts yet. Start the conversation!",
    reactionsCount: "reactions",
    commentBtn: "Comment",
    shareBtn: "Share",
    copyCode: "Copy Code",
    copiedCode: "Copied!",
    pinned: "Pinned by Administrator",
    allCircles: "All posts",
    emojisTitle: "Insert Emoji",
    deletePostBtn: "Delete Post",
    proPreview: "Live Code Preview",
    messagesTab: "Discussions",
    pollsTab: "Polls",
    friendsTab: "Members & Friends",
    onlineTab: "Online Members",
    addFriend: "Add Friend",
    removeFriend: "Remove",
    alreadyVoted: "Already Voted",
    voteBtn: "Vote",
    totalVotes: "votes",
    searchMembers: "Search members or countries..."
  },
  ha: {
    communityTitle: "Asrar Al'umma",
    communitySubtitle: "Raba asirin ruhaniya, wirdi, da lambobin zikiri",
    standardTab: "Rubutu na yau da kullun",
    codeTab: "Editan lambobi na Pro",
    writePlaceholder: "Raba tambaya, ƙwarewar ruhaniya, ko wirdi mai daraja...",
    codePlaceholder: "Shigar da lambarku, dabarar lissafi, ko rubutun zikiri...",
    expPlaceholder: "Yi bayani a taƙaice abin da wannan lambar ke yi ko yadda ake amfani da ita...",
    languageLabel: "Yare",
    attachImage: "Ƙara hotuna",
    attachVideo: "Ƙara bidiyo",
    recording: "Ana nadar murya...",
    clickToRecord: "Nadi muryar saƙo",
    stopRecord: "Dakatar da nadi",
    previewVoice: "Saurari muryar saƙo",
    deleteVoice: "Goge",
    publishBtn: "Wallafa a shafi",
    publishing: "Ana wallafawa...",
    mustBeLoggedIn: "Da fatan za a shiga don wallafawa.",
    publishedSuccess: "An wallafa cikin nasara!",
    pendingMod: "Rubutun ku yana jiran amincewa.",
    noPosts: "Babu rubutu tukunna. Fara tattaunawar!",
    reactionsCount: "martani",
    commentBtn: "Sharhi",
    shareBtn: "Raba",
    copyCode: "Kwafi lambar",
    copiedCode: "An kwafa!",
    pinned: "Gudanarwa ya sanya a sama",
    allCircles: "Dukkan rubutu",
    emojisTitle: "Saka emoji",
    deletePostBtn: "Goge Rubutun",
    proPreview: "Samfoti Na Gaskiya",
    messagesTab: "Tattaunawa",
    pollsTab: "Zaɓe",
    friendsTab: "Mambobi da Abokai",
    onlineTab: "Mambobi kan Layi",
    addFriend: "Ƙara Aboki",
    removeFriend: "Cire",
    alreadyVoted: "An riga an zaɓa",
    voteBtn: "Zaɓa",
    totalVotes: "ƙuri'u",
    searchMembers: "Nemi mambobi ko ƙasashe..."
  }
};

const EM_SMILEYS = ["😊", "😂", "🤣", "😍", "🥰", "😎", "😜", "😇", "🤫", "🤩"];
const EM_SPIRITUAL = ["🤲", "📿", "🕌", "🕋", "✨", "📖", "💡", "🛡️", "🌱", "🕊️"];
const EM_REACTIONS = ["👍", "❤️", "🔥", "👏", "🎉", "🙌", "💯", "⭐", "🎯", "🧠"];

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Zikr Cycle Counter Automation\nconst TARGET = 1000;\nlet count = 0;\n\nfunction recite(wirdName) {\n  count++;\n  console.log(\`[ASRAR] Recited \${wirdName}: \${count}/\${TARGET}\`);\n  return count >= TARGET;\n}\n\nrecite("Ya Latif");`,
  typescript: `// TypeScript Spiritual Intent Wrapper\ninterface SacredIntent {\n  wird: string;\n  target: number;\n  sincerityScore: number; \n}\n\nconst myIntent: SacredIntent = {\n  wird: "Astaghfirullah",\n  target: 100,\n  sincerityScore: 100\n};`,
  python: `# Simple Tasbih incrementer script\nclass Tasbih:\n    def __init__(self, name, target):\n        self.name = name\n        self.target = target\n        self.current = 0\n        \n    def tap(self):\n        if self.current < self.target:\n            self.current += 1\n        return f"{self.name}: {self.current}/{self.target}"`,
  sql: `-- Save communal Wird targets\nCREATE TABLE user_wirds (\n  id SERIAL PRIMARY KEY,\n  user_name VARCHAR(100),\n  wird_title VARCHAR(255),\n  count_contributed INT DEFAULT 0,\n  recited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
  arabic: `/* سورة الإخلاص مكررة للبركة والوقاية */\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (١) اللَّهُ الصَّمَدُ (٢) لَمْ يَلِدْ وَلَمْ يُولَدْ (٣) وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (٤)`
};

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

interface Member {
  id: string;
  name: string;
  role: string;
  roleColor: string;
  points: number;
  country: string;
  avatar: string;
  isOnline: boolean;
}

export const Community: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const lang = language === "en" || language === "ha" ? language : "fr";
  const tLocal = (key: string) => localTranslations[lang][key] || localTranslations["fr"][key] || key;

  const location = useLocation();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<"messages" | "polls" | "friends" | "online">("messages");

  const POST_CATEGORIES = [
    { id: "all", label: { fr: "Toutes les catégories", en: "All Categories", ha: "Duka Rukuni" }, color: "bg-emerald-500" },
    { id: "zikr_request", label: { fr: "Demande de Zikr", en: "Zikr Request", ha: "Bukatar Zikiri" }, color: "bg-purple-500" },
    { id: "asrar_sharing", label: { fr: "Partage d'Asrar", en: "Asrar Sharing", ha: "Raba Asrar" }, color: "bg-emerald-500" },
    { id: "testimonials", label: { fr: "Témoignages", en: "Testimonials", ha: "Shaidu" }, color: "bg-amber-500" },
    { id: "general_questions", label: { fr: "Questions générales", en: "General Questions", ha: "Tambayoyi" }, color: "bg-blue-500" }
  ];

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [newPostCategory, setNewPostCategory] = useState("general_questions");

  // Reporting / Flagging State
  const [flagModalPostId, setFlagModalPostId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [reportedPosts, setReportedPosts] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("asrarhub_flagged_posts") || "[]");
    } catch {
      return [];
    }
  });
  const [showReportedPostId, setShowReportedPostId] = useState<Record<string, boolean>>({});

  // Synchronize view query param with React state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get("view");
    if (viewParam === "dms") {
      setIsDMOpen(true);
      setCurrentView("messages");
    } else if (viewParam === "messages" || viewParam === "polls" || viewParam === "friends" || viewParam === "online") {
      setCurrentView(viewParam);
    }
  }, [location.search]);

  // Handle Polls Data
  const defaultPolls: Poll[] = [
    {
      id: "poll_1",
      question: language === "en" ? "Which spiritual wird is your primary focus?" : language === "ha" ? "Wanne wirdi ne kafi mayar da hankali akansa?" : "Quel wird spirituel récitez-vous en priorité ?",
      options: [
        { id: "o1", text: "Ya Latif (يا لطيف)", votes: 42 },
        { id: "o2", text: "Astaghfirullah (أستغفر الله)", votes: 28 },
        { id: "o3", text: "Salat ala Nabi (صلاة على النبي)", votes: 35 },
        { id: "o4", text: "Sourate Al-Ikhlas (سورة الإخلاص)", votes: 19 }
      ],
      totalVotes: 124
    },
    {
      id: "poll_2",
      question: language === "en" ? "How many zikr repetitions do you perform daily?" : language === "ha" ? "Sau nawa kake yin zikiri a kullum?" : "Combien de répétitions de zikr effectuez-vous chaque jour ?",
      options: [
        { id: "o5", text: language === "en" ? "Under 100" : language === "ha" ? "Kasa da 100" : "Moins de 100", votes: 15 },
        { id: "o6", text: "100 - 1000", votes: 54 },
        { id: "o7", text: language === "en" ? "Over 1000" : language === "ha" ? "Sama da 1000" : "Plus de 1000", votes: 37 },
        { id: "o8", text: language === "en" ? "Full custom spiritual cycle" : language === "ha" ? "Cikakken da'ira na musamman" : "Cycle spirituel complet", votes: 21 }
      ],
      totalVotes: 127
    },
    {
      id: "poll_3",
      question: language === "en" ? "Which AsrarHub spiritual tool is most valuable to you?" : language === "ha" ? "Wanne kayan aiki na AsrarHub ne yafi daraja a gareka?" : "Quel outil spirituel d'AsrarHub trouvez-vous le plus précieux ?",
      options: [
        { id: "o9", text: language === "en" ? "Abjad Calculator" : language === "ha" ? "Lissafin Abjad" : "Calculateur Abjad", votes: 48 },
        { id: "o10", text: language === "en" ? "Planetary Hours" : language === "ha" ? "Sifofin Taurari" : "Heures Planétaires", votes: 31 },
        { id: "o11", text: language === "en" ? "Khatim/Magic Square Generator" : language === "ha" ? "Kera Khatim" : "Générateur de Khatim", votes: 59 },
        { id: "o12", text: language === "en" ? "Geomancy / Sand Reading" : language === "ha" ? "Kaddara / Duban Kasa" : "Tracé Géomantique", votes: 26 }
      ],
      totalVotes: 164
    }
  ];

  const [polls, setPolls] = useState<Poll[]>(() => {
    const saved = localStorage.getItem("asrarhub_community_polls");
    return saved ? JSON.parse(saved) : defaultPolls;
  });

  const [votedPolls, setVotedPolls] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("asrarhub_voted_polls");
    return saved ? JSON.parse(saved) : {};
  });

  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""]);

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;

    const validOptions = newPollOptions.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert(language === "en" ? "Please provide at least 2 options!" : "Veuillez fournir au moins 2 options !");
      return;
    }

    const newPoll: Poll = {
      id: `poll_${Date.now()}`,
      question: newPollQuestion.trim(),
      options: validOptions.map((opt, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text: opt.trim(),
        votes: 0
      })),
      totalVotes: 0
    };

    const updated = [newPoll, ...polls];
    setPolls(updated);
    localStorage.setItem("asrarhub_community_polls", JSON.stringify(updated));

    // Reset fields
    setNewPollQuestion("");
    setNewPollOptions(["", ""]);
    setIsCreatingPoll(false);
  };

  const handleDeletePoll = (pollId: string) => {
    if (!window.confirm(language === "en" ? "Are you sure you want to delete this poll?" : "Êtes-vous sûr de vouloir supprimer ce sondage ?")) return;
    const updated = polls.filter(p => p.id !== pollId);
    setPolls(updated);
    localStorage.setItem("asrarhub_community_polls", JSON.stringify(updated));
  };

  const handleResetVote = (pollId: string) => {
    const userVotedOptionId = votedPolls[pollId];
    if (!userVotedOptionId) return;

    const updatedPolls = polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          totalVotes: Math.max(0, p.totalVotes - 1),
          options: p.options.map(o => o.id === userVotedOptionId ? { ...o, votes: Math.max(0, o.votes - 1) } : o)
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    localStorage.setItem("asrarhub_community_polls", JSON.stringify(updatedPolls));

    const updatedVotes = { ...votedPolls };
    delete updatedVotes[pollId];
    setVotedPolls(updatedVotes);
    localStorage.setItem("asrarhub_voted_polls", JSON.stringify(updatedVotes));
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls[pollId]) return;

    const updatedPolls = polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    });

    setPolls(updatedPolls);
    localStorage.setItem("asrarhub_community_polls", JSON.stringify(updatedPolls));

    const updatedVotes = { ...votedPolls, [pollId]: optionId };
    setVotedPolls(updatedVotes);
    localStorage.setItem("asrarhub_voted_polls", JSON.stringify(updatedVotes));
  };

  // Member lists & Friends
  const membersData: Member[] = [
    { id: "m1", name: "Cheikh Al-Bakri", role: "Sage", roleColor: "from-amber-500 to-yellow-600", points: 2850, country: language === "en" ? "Morocco" : "Maroc", avatar: "🕌", isOnline: true },
    { id: "m2", name: "Ousmane Sow", role: "Érudit", roleColor: "from-emerald-500 to-teal-600", points: 1920, country: "Sénégal", avatar: "📖", isOnline: true },
    { id: "m3", name: "Mariama Diallo", role: "Aspirant", roleColor: "from-blue-500 to-indigo-600", points: 450, country: "Guinée", avatar: "✨", isOnline: true },
    { id: "m4", name: "Amadou Bello", role: "Aspirant", roleColor: "from-blue-500 to-indigo-600", points: 720, country: "Nigéria", avatar: "📿", isOnline: true },
    { id: "m5", name: "Fatoumata Bamba", role: "Érudit", roleColor: "from-emerald-500 to-teal-600", points: 1430, country: "Côte d'Ivoire", avatar: "🌱", isOnline: false },
    { id: "m6", name: "Dr. Tarik Mansour", role: "Sage", roleColor: "from-amber-500 to-yellow-600", points: 3100, country: "Égypte", avatar: "🧠", isOnline: false },
    { id: "m7", name: "Ibrahim Tengeh", role: "Admin", roleColor: "from-red-500 to-rose-600", points: 5000, country: "Cameroun", avatar: "🛡️", isOnline: true }
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const getUserBadge = (authorName: string, authorId: string) => {
    const matchedMember = membersData.find(m => m.name === authorName || m.id === authorId);
    const points = matchedMember ? matchedMember.points : (authorId === user?.uid ? 1500 : 350);
    
    if (authorName.toLowerCase().includes("cheikh") || points >= 2500) {
      return {
        label: language === "en" ? "Érudit / Scholar" : language === "ha" ? "Malam / Shaihu" : "Érudit / Sage",
        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
        icon: "📖",
        title: language === "en" ? "Scholar" : language === "ha" ? "Shaihu" : "Érudit"
      };
    } else if (points >= 1200) {
      return {
        label: language === "en" ? "Expert" : language === "ha" ? "Gwani" : "Expert",
        color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
        icon: "⭐",
        title: language === "en" ? "Expert" : language === "ha" ? "Gwani" : "Expert"
      };
    } else if (points >= 600) {
      return {
        label: language === "en" ? "Initiated" : language === "ha" ? "Gwanin Farko" : "Initié",
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
        icon: "✨",
        title: language === "en" ? "Initiated" : language === "ha" ? "Gwanin Farko" : "Initié"
      };
    } else {
      return {
        label: language === "en" ? "Aspirant" : language === "ha" ? "Muridi" : "Aspirant",
        color: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20",
        icon: "📿",
        title: language === "en" ? "Aspirant" : language === "ha" ? "Muridi" : "Aspirant"
      };
    }
  };
  const [friendsList, setFriendsList] = useState<string[]>(() => {
    const saved = localStorage.getItem("asrar_friends_list");
    return saved ? JSON.parse(saved) : ["m1", "m2"];
  });

  const toggleFriend = (memberId: string) => {
    const isFriend = friendsList.includes(memberId);
    let updated;
    if (isFriend) {
      updated = friendsList.filter(id => id !== memberId);
    } else {
      updated = [...friendsList, memberId];
    }
    setFriendsList(updated);
    localStorage.setItem("asrar_friends_list", JSON.stringify(updated));
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"standard" | "code">("standard");

  // Input states
  const [textContent, setTextContent] = useState("");
  const [codeContent, setCodeContent] = useState(CODE_TEMPLATES.javascript);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeExplanation, setCodeExplanation] = useState("");
  
  // Attachments
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);
  
  // Audio Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null); // base64
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<any>(null);

  // General controls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [activeReactionHoverPost, setActiveReactionHoverPost] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Lightbox Modal
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Private messages trigger
  const [dmRecipient, setDmRecipient] = useState<{ id: string; name: string } | null>(null);
  const [isDMOpen, setIsDMOpen] = useState(false);

  // New States for Expanded Actions & Bookmarks & Editing
  const [expandedActionsPostId, setExpandedActionsPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostContent, setEditingPostContent] = useState("");
  const [savedCommunityPostIds, setSavedCommunityPostIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("asrarhub_saved_community_posts") || "[]");
    } catch {
      return [];
    }
  });

  const toggleBookmarkPost = (postId: string) => {
    let updated;
    if (savedCommunityPostIds.includes(postId)) {
      updated = savedCommunityPostIds.filter(id => id !== postId);
    } else {
      updated = [...savedCommunityPostIds, postId];
    }
    setSavedCommunityPostIds(updated);
    localStorage.setItem("asrarhub_saved_community_posts", JSON.stringify(updated));
  };

  const handleSaveEditPost = async (postId: string) => {
    if (!editingPostContent.trim()) return;
    try {
      const postRef = doc(db, "community_posts", postId);
      await updateDoc(postRef, { content: editingPostContent.trim() });
      setEditingPostId(null);
      setEditingPostContent("");
    } catch (err) {
      console.error("Error editing post:", err);
      alert("Erreur lors de la modification du post.");
    }
  };

  // Fetch Community Posts
  useEffect(() => {
    let q;
    if (user?.role === "admin") {
      q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "community_posts"), where("status", "==", "approved"));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            reactions: data.reactions || { like: [], love: [], haha: [], wow: [], sad: [], angry: [] }
          } as Post;
        });

        // Client sorting: Pinned posts first, then newest
        postsData.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setPosts(postsData);
      },
      (error) => {
        console.error("Community onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Audio recording handlers
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordedAudio(null);
    setRecordingSeconds(0);
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event: any) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setRecordedAudio(reader.result as string);
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        throw new Error("API non supportée");
      }
    } catch (err) {
      console.warn("Media devices API not accessible, switching to programmatic simulation note.");
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      // Simulate programmatic custom synthetic voice generation as safe fallback
      generateSimulatedVoiceNote();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const generateSimulatedVoiceNote = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const dest = ctx.createMediaStreamDestination();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 2.0);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.0);
      
      osc.connect(gain);
      gain.connect(dest);
      
      const simulatedRecorder = new MediaRecorder(dest.stream);
      const simulatedChunks: Blob[] = [];
      simulatedRecorder.ondataavailable = (e: any) => simulatedChunks.push(e.data);
      simulatedRecorder.onstop = () => {
        const audioBlob = new Blob(simulatedChunks, { type: "audio/webm" });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(audioBlob);
        fileReader.onloadend = () => {
          setRecordedAudio(fileReader.result as string);
        };
      };
      simulatedRecorder.start();
      osc.start();
      setTimeout(() => {
        osc.stop();
        simulatedRecorder.stop();
        ctx.close();
      }, 2000);
    } catch (e) {
      console.error("Synthesizer fallback error:", e);
    }
  };

  // Attachments handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image trop grande (Max 2MB pour économiser de l'espace).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      alert("Vidéo trop grande (Max 6MB pour économiser de l'espace).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedVideo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Templates fast insertion
  const handleInsertTemplate = () => {
    setCodeContent(CODE_TEMPLATES[codeLanguage] || "");
  };

  // Form submission
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFeedback({ type: "error", message: tLocal("mustBeLoggedIn") });
      return;
    }

    const contentToPublish = activeTab === "standard" ? textContent.trim() : codeExplanation.trim();
    if (activeTab === "standard" && !contentToPublish && attachedImages.length === 0 && !attachedVideo && !recordedAudio) {
      return;
    }
    if (activeTab === "code" && !codeContent.trim()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Basic moderation check
    const isRiskyContent = (text: string) => {
      const lower = text.toLowerCase();
      const badWords = ["sexe", "porn", "baise", "nude", "nu", "sexuel"];
      return badWords.some(word => lower.includes(word));
    };

    const hasRisk = isRiskyContent(contentToPublish) || (activeTab === "code" && isRiskyContent(codeContent));
    const finalStatus = user.role === "admin" ? "approved" : (hasRisk ? "pending" : "approved");

    const authorLocation = user.city && user.country ? `${user.city}, ${user.country}` : "Sénégal";

    try {
      const payload: any = {
        authorId: user.uid,
        authorName: user.name || "Aspirant",
        authorLocation: authorLocation,
        status: finalStatus,
        category: newPostCategory,
        createdAt: serverTimestamp() || new Date(),
        reactions: {
          like: [],
          love: [],
          haha: [],
          wow: [],
          sad: [],
          angry: []
        }
      };

      if (activeTab === "standard") {
        payload.content = contentToPublish;
        if (attachedImages.length > 0) {
          payload.attachments = attachedImages.map(img => ({ type: "image", url: img }));
        }
        if (attachedVideo) {
          if (!payload.attachments) payload.attachments = [];
          payload.attachments.push({ type: "video", url: attachedVideo });
        }
        if (recordedAudio) {
          payload.voiceNotes = [recordedAudio];
        }
      } else {
        // Code tab
        payload.content = codeExplanation || "Code partagé par l'utilisateur";
        payload.codeSnippet = {
          code: codeContent,
          language: codeLanguage,
          explanation: codeExplanation
        };
      }

      await addDoc(collection(db, "community_posts"), payload);

      // Reset
      setTextContent("");
      setCodeContent(CODE_TEMPLATES.javascript);
      setCodeExplanation("");
      setAttachedImages([]);
      setAttachedVideo(null);
      setRecordedAudio(null);
      setShowEmojiPicker(false);

      setFeedback({
        type: "success",
        message: finalStatus === "approved" ? tLocal("publishedSuccess") : tLocal("pendingMod")
      });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Erreur lors de la publication." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reactions Logic (Facebook Style)
  const handleReaction = async (postId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry") => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const updatedReactions = { ...post.reactions } as any;

    // Initialize missing fields if any
    const types = ["like", "love", "haha", "wow", "sad", "angry"];
    types.forEach(t => {
      if (!updatedReactions[t]) updatedReactions[t] = [];
    });

    // Check if user already reacted with this exact reaction
    const alreadyHasThisReaction = updatedReactions[reactionType].includes(user.uid);

    // Remove user's ID from ALL reactions of this post first (Facebook allows only 1 reaction per post)
    types.forEach(t => {
      updatedReactions[t] = updatedReactions[t].filter((uid: string) => uid !== user.uid);
    });

    // If they clicked a new one, add it. If they clicked the same, it stays removed (unreact).
    if (!alreadyHasThisReaction) {
      updatedReactions[reactionType].push(user.uid);
    }

    try {
      await updateDoc(doc(db, "community_posts", postId), {
        reactions: updatedReactions
      });
    } catch (err) {
      console.error("Error updating reactions:", err);
    }
    setActiveReactionHoverPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      try {
        await deleteDoc(doc(db, "community_posts", postId));
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  const handlePinPost = async (postId: string, isPinned: boolean) => {
    try {
      await updateDoc(doc(db, "community_posts", postId), {
        isPinned: !isPinned
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Highlight helper with fallback
  const highlightCodeWithFallback = (code: string, language: string) => {
    try {
      let grammar = Prism.languages.javascript;
      if (language === "typescript") grammar = Prism.languages.typescript || Prism.languages.javascript;
      else if (language === "python") grammar = Prism.languages.python || Prism.languages.javascript;
      else if (language === "sql") grammar = Prism.languages.sql || Prism.languages.javascript;
      else if (language === "html") grammar = Prism.languages.markup || Prism.languages.javascript;
      else if (language === "arabic") {
        return code.replace(
          /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)/g,
          '<span class="text-amber-500 font-bold">$1</span>'
        );
      }
      return Prism.highlight(code, grammar, language);
    } catch (e) {
      return code;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:p-6 lg:p-8 safe-area-pt pb-28 overflow-x-hidden">
      {/* Visual styling and tomorrow prism theme styles */}
      <style>{`
        .prism-code-editor {
          font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
          font-size: 13.5px !important;
          line-height: 20px !important;
        }
        .prism-code-editor textarea {
          outline: none !important;
        }
        .token.comment { color: #6a9955; font-style: italic; }
        .token.keyword { color: #c586c0; font-weight: bold; }
        .token.string { color: #ce9178; }
        .token.number { color: #b5cea8; }
        .token.operator { color: #d4d4d4; }
        .token.function { color: #dcdcaa; }
        .token.class-name { color: #4ec9b0; }
        .token.boolean { color: #569cd6; }
        .token.punctuation { color: #ffd700; }
      `}</style>

      {/* Header section */}
      <div className="flex items-center justify-between mb-8 gap-2.5">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-sm shrink-0">
            <Users size={24} className="animate-pulse sm:w-[30px] sm:h-[30px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight truncate sm:whitespace-normal">
              {tLocal("communityTitle")}
            </h1>
            <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words leading-tight sm:leading-normal">
              {tLocal("communitySubtitle")}
            </p>
          </div>
        </div>

        {user && (
          <button
            onClick={() => setIsDMOpen(true)}
            className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-2xl transition-all relative border border-gray-150 dark:border-gray-700 cursor-pointer shadow-sm active:scale-95"
            title="Messages Privés"
          >
            <Inbox size={22} />
          </button>
        )}
      </div>

      {/* Community Main Sub-navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        <button
          onClick={() => { setCurrentView("messages"); navigate("/community?view=messages"); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${currentView === "messages" ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/15" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"}`}
        >
          <MessageSquare size={14} className={currentView === "messages" ? "animate-pulse" : ""} />
          <span>{tLocal("messagesTab")}</span>
        </button>

        <button
          onClick={() => { setCurrentView("polls"); navigate("/community?view=polls"); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${currentView === "polls" ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/15" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"}`}
        >
          <Vote size={14} />
          <span>{tLocal("pollsTab")}</span>
        </button>

        <button
          onClick={() => setIsDMOpen(true)}
          className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Inbox size={14} />
          <span>{language === "en" ? "Private Messages" : language === "ha" ? "Saƙonnin Sirri" : "Messages Privés"}</span>
        </button>

        <button
          onClick={() => { setCurrentView("friends"); navigate("/community?view=friends"); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${currentView === "friends" ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/15" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"}`}
        >
          <Users size={14} />
          <span>{tLocal("friendsTab")}</span>
        </button>

        <button
          onClick={() => { setCurrentView("online"); navigate("/community?view=online"); }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-3 cursor-pointer border shrink-0 ${currentView === "online" ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/15" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"}`}
        >
          <div className="flex items-center gap-2">
            <Radio size={14} className={currentView === "online" ? "animate-pulse text-white" : "text-emerald-500"} />
            <span>{tLocal("onlineTab")}</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping shrink-0" />
        </button>
      </div>

      {currentView === "messages" && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700/80 mb-8">
        {user ? (
          <form onSubmit={handlePublishPost} className="space-y-4">
            {/* Publisher tab bar */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab("standard")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] min-[375px]:text-xs sm:text-sm font-bold transition-all cursor-pointer px-1 sm:px-2 ${
                  activeTab === "standard"
                    ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                <MessageSquare size={14} className="sm:w-[16px] sm:h-[16px]" />
                <span className="truncate">{tLocal("standardTab")}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] min-[375px]:text-xs sm:text-sm font-bold transition-all cursor-pointer px-1 sm:px-2 ${
                  activeTab === "code"
                    ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                <CodeIcon size={14} className="sm:w-[16px] sm:h-[16px]" />
                <span className="truncate">{tLocal("codeTab")}</span>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase">Pro</span>
              </button>
            </div>

            {/* TAB CONTENT: STANDARD POST */}
            {activeTab === "standard" && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder={tLocal("writePlaceholder")}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-750 rounded-2xl p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  
                  {/* Inline absolute emoji and audio indicators */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg cursor-pointer transition-colors"
                    >
                      <Smile size={18} className="text-amber-500" />
                    </button>
                  </div>
                </div>

                {/* EMOJI KEYBOARD */}
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl space-y-2.5"
                  >
                    <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      {tLocal("emojisTitle")}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {EM_SMILEYS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setTextContent(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-lg text-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {EM_SPIRITUAL.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setTextContent(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-lg text-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {EM_REACTIONS.map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setTextContent(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm rounded-lg text-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PREVIEW VOICE NOTE IF PRESENT */}
                {recordedAudio && (
                  <div className="flex items-center justify-between p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 animate-bounce">
                        <Volume2 size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">
                          {tLocal("previewVoice")}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          Pre-recorded voice note ready
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <audio src={recordedAudio} controls className="h-8 max-w-[150px] sm:max-w-[200px]" />
                      <button
                        type="button"
                        onClick={() => setRecordedAudio(null)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* IMAGES & VIDEOS PREVIEW ROWS */}
                {attachedImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {attachedImages.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-gray-700">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAttachedImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {attachedVideo && (
                  <div className="relative group rounded-xl overflow-hidden max-w-xs border border-gray-200 dark:border-gray-700">
                    <video src={attachedVideo} controls className="w-full aspect-video rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setAttachedVideo(null)}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* BOTTOM MEDIA TRIGGERS */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Image Input */}
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
                      <ImageIcon size={14} className="text-blue-500" />
                      <span>{tLocal("attachImage")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    {/* Video Input */}
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
                      <VideoIcon size={14} className="text-red-500" />
                      <span>{tLocal("attachVideo")}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                    </label>

                    {/* Voice Note Button */}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Mic size={14} className={isRecording ? "text-white" : "text-emerald-500"} />
                      <span>
                        {isRecording
                          ? `${tLocal("stopRecord")} (${recordingSeconds}s)`
                          : tLocal("clickToRecord")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRO CODE SNIPPET */}
            {activeTab === "code" && (
              <div className="space-y-4">
                {/* Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-150 dark:border-gray-850">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-extrabold text-gray-500 dark:text-gray-400">
                      {tLocal("languageLabel")}:
                    </label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => {
                        setCodeLanguage(e.target.value);
                        setCodeContent(CODE_TEMPLATES[e.target.value] || "");
                      }}
                      className="bg-white dark:bg-gray-800 text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-gray-900 dark:text-white"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL Query</option>
                      <option value="arabic">Arabic Wird (Holy)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleInsertTemplate}
                    className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={12} />
                    Insert template
                  </button>
                </div>

                {/* CODE EDITOR CONTAINER (IDE Mock style) */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-750 bg-gray-950 shadow-lg">
                  {/* Mock Window Controls */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                      {codeLanguage}.asrar_snippet
                    </span>
                    <div className="w-4" />
                  </div>

                  {/* Code simple editor with line numbers */}
                  <div className="flex min-h-[180px] text-left">
                    <div className="prism-code-editor w-full p-4 font-mono">
                      <Editor
                        value={codeContent}
                        onValueChange={(code) => setCodeContent(code)}
                        highlight={(code) => highlightCodeWithFallback(code, codeLanguage)}
                        padding={10}
                        style={{
                          fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                          fontSize: 13,
                          backgroundColor: "transparent",
                          color: "#d4d4d4"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* LIVE PREVIEW BLOCK */}
                <div className="p-4 rounded-2xl bg-gray-950 border border-emerald-500/10 text-left shadow-inner">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800/60">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                      <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                      <span>{tLocal("proPreview")}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Real-time Compiler Mode</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-md">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-950 text-[10px] text-gray-400 border-b border-gray-800/40">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-500/80" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider">{codeLanguage}</span>
                    </div>
                    <pre className="p-3 overflow-x-auto max-h-[160px] text-left">
                      <code
                        className="font-mono text-xs text-emerald-300 leading-relaxed block whitespace-pre-wrap break-all"
                        dangerouslySetInnerHTML={{
                          __html: highlightCodeWithFallback(codeContent, codeLanguage)
                        }}
                      />
                    </pre>
                  </div>
                </div>

                {/* Code Explanation Area */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                    Explication / Description:
                  </label>
                  <textarea
                    value={codeExplanation}
                    onChange={(e) => setCodeExplanation(e.target.value)}
                    placeholder={tLocal("expPlaceholder")}
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-750 rounded-2xl p-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Category selection */}
            <div className="bg-gray-50 dark:bg-gray-900/40 p-3 sm:p-4 rounded-2xl border border-gray-150 dark:border-gray-750/80 text-left">
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                {language === "en" ? "Post Category" : language === "ha" ? "Rukuni na Saƙo" : "Catégorie de la publication"}
              </label>
              <div className="flex flex-wrap gap-2">
                {POST_CATEGORIES.filter(c => c.id !== "all").map(c => {
                  const isSelected = newPostCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewPostCategory(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                          : "bg-white dark:bg-gray-850 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-750 hover:bg-gray-100 dark:hover:bg-gray-750"
                      }`}
                    >
                      {c.label[lang] || c.label.fr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEEDBACK STATUS */}
            {feedback && (
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm ${
                  feedback.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                    : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-500/10"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {feedback.message}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-end pt-2 border-t border-gray-100 dark:border-gray-700/60">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  tLocal("publishing")
                ) : (
                  <>
                    <Send size={14} /> {tLocal("publishBtn")}
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-750">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {tLocal("mustBeLoggedIn")}
            </p>
          </div>
        )}
      </div>
      )}

      {/* FEED POSTS TIMELINE */}
      {currentView === "messages" && (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2.5">
            <MessageSquare size={20} className="text-emerald-500" />
            {tLocal("allCircles")}
          </h2>

          {/* Category Filters Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth text-left max-w-full">
            {POST_CATEGORIES.map(c => {
              const isSelected = selectedCategoryFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                      : "bg-white dark:bg-gray-850 text-gray-600 dark:text-gray-300 border-gray-150 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
                >
                  {c.label[lang] || c.label.fr}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCategoryFilter("saved")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0 cursor-pointer flex items-center gap-1 ${
                selectedCategoryFilter === "saved"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                  : "bg-white dark:bg-gray-850 text-gray-600 dark:text-gray-300 border-gray-150 dark:border-gray-750 hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              <Bookmark size={11} className={selectedCategoryFilter === "saved" ? "fill-white" : ""} />
              <span>{language === "en" ? "Saved" : language === "ha" ? "Adana" : "Enregistrés"}</span>
            </button>
          </div>
        </div>

        {(() => {
          const filtered = posts.filter(p => {
            if (selectedCategoryFilter === "saved") {
              return savedCommunityPostIds.includes(p.id);
            }
            return selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
          });

          if (filtered.length === 0) {
            return (
              <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-750 text-gray-400 text-sm italic">
                {language === "en" ? "No publications in this category yet." : language === "ha" ? "Babu saƙonni a cikin wannan rukuni tukunna." : "Aucune publication dans cette catégorie pour le moment."}
              </div>
            );
          }

          return filtered.map((post) => {
            // Count reactions
            const rx = post.reactions || {};
            const totalReactions =
              (rx.like?.length || 0) +
              (rx.love?.length || 0) +
              (rx.haha?.length || 0) +
              (rx.wow?.length || 0) +
              (rx.sad?.length || 0) +
              (rx.angry?.length || 0);

            const hasLiked = rx.like?.includes(user?.uid || "") || false;
            const hasLoved = rx.love?.includes(user?.uid || "") || false;
            const hasHaha = rx.haha?.includes(user?.uid || "") || false;
            const hasWow = rx.wow?.includes(user?.uid || "") || false;
            const hasSad = rx.sad?.includes(user?.uid || "") || false;
            const hasAngry = rx.angry?.includes(user?.uid || "") || false;

            // Determine active reaction emoji or text
            let currentReactionLabel = "React";
            let currentReactionColor = "text-gray-500 hover:text-emerald-500";
            if (hasLiked) { currentReactionLabel = "👍 J'aime"; currentReactionColor = "text-blue-500 font-black"; }
            else if (hasLoved) { currentReactionLabel = "❤️ Adore"; currentReactionColor = "text-red-500 font-black"; }
            else if (hasHaha) { currentReactionLabel = "😂 Haha"; currentReactionColor = "text-yellow-500 font-black"; }
            else if (hasWow) { currentReactionLabel = "😮 Wow"; currentReactionColor = "text-yellow-500 font-black"; }
            else if (hasSad) { currentReactionLabel = "😢 Triste"; currentReactionColor = "text-yellow-500 font-black"; }
            else if (hasAngry) { currentReactionLabel = "😡 Grrrr"; currentReactionColor = "text-orange-500 font-black"; }

            // Get standard preview reactions top 3 emojis
            const activeReactionIcons = [];
            if ((rx.like?.length || 0) > 0) activeReactionIcons.push("👍");
            if ((rx.love?.length || 0) > 0) activeReactionIcons.push("❤️");
            if ((rx.haha?.length || 0) > 0) activeReactionIcons.push("😂");
            if ((rx.wow?.length || 0) > 0) activeReactionIcons.push("😮");
            if ((rx.sad?.length || 0) > 0) activeReactionIcons.push("😢");
            if ((rx.angry?.length || 0) > 0) activeReactionIcons.push("😡");

            const isReported = reportedPosts.includes(post.id);
            if (isReported && !showReportedPostId[post.id]) {
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 rounded-3xl p-5 sm:p-6 text-center space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <AlertTriangle size={20} />
                    <span className="font-extrabold text-xs uppercase tracking-wider">
                      {language === "en" ? "Content Reported" : language === "ha" ? "An Kai Rahoton Saƙo" : "Contenu Signalé"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === "en" ? "This post has been reported by you or the community as inappropriate." : language === "ha" ? "An kai rahoton wannan saƙo saboda bai dace ba." : "Cette publication a été signalée par vous ou la communauté."}
                  </p>
                  <button
                    onClick={() => setShowReportedPostId(prev => ({ ...prev, [post.id]: true }))}
                    className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-150 dark:border-gray-750 cursor-pointer transition-all shadow-sm"
                  >
                    {language === "en" ? "Show post anyway" : language === "ha" ? "Nuna saƙo duk da haka" : "Afficher la publication quand même"}
                  </button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-750/80 space-y-4 text-left"
              >
                {/* Header author info */}
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div
                    onClick={() => {
                      if (user && user.uid !== post.authorId) {
                        setDmRecipient({ id: post.authorId, name: post.authorName });
                        setIsDMOpen(true);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-sm text-sm group-hover:scale-105 transition-transform shrink-0">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span className="truncate group-hover:text-emerald-600 transition-colors">{post.authorName}</span>
                        
                        {/* Display activity-based badge */}
                        {(() => {
                          const badge = getUserBadge(post.authorName, post.authorId);
                          return (
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${badge.color}`} title={badge.label}>
                              <span>{badge.icon}</span>
                              <span>{badge.title}</span>
                            </span>
                          );
                        })()}

                        {post.authorId === user?.uid && (
                          <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">Moi</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {post.category && (
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            post.category === "zikr_request" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/10" :
                            post.category === "asrar_sharing" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/10" :
                            post.category === "testimonials" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/10" :
                            "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/10"
                          }`}>
                            {POST_CATEGORIES.find(cat => cat.id === post.category)?.label[lang] || post.category}
                          </span>
                        )}
                        {post.authorLocation && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                            <MapPin size={10} className="text-red-500" />
                            {post.authorLocation}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono">
                          {post.createdAt?.seconds
                            ? new Date(post.createdAt.seconds * 1000).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Flag/Report Post Button */}
                    {user && post.authorId !== user.uid && (
                      <button
                        onClick={() => {
                          setFlagReason("");
                          setFlagModalPostId(post.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-150 dark:hover:bg-gray-750 ${
                          reportedPosts.includes(post.id) ? "text-red-500 bg-red-50 dark:bg-red-950/20" : "text-gray-400 hover:text-red-500"
                        }`}
                        title="Signaler cette publication"
                      >
                        <Flag size={14} className={reportedPosts.includes(post.id) ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    )}

                    {post.isPinned && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                        <Pin size={10} className="fill-amber-600" />
                        {tLocal("pinned")}
                      </span>
                    )}

                    {/* Admin delete & pin */}
                    {user?.role === "admin" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePinPost(post.id, post.isPinned || false)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            post.isPinned
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Pin size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          title={tLocal("deletePostBtn")}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content body formatted or Edit mode */}
                {editingPostId === post.id ? (
                  <div className="space-y-3 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-2xl border border-gray-100 dark:border-gray-750">
                    <textarea
                      value={editingPostContent}
                      onChange={(e) => setEditingPostContent(e.target.value)}
                      className="w-full min-h-[100px] bg-white dark:bg-gray-850 text-sm border border-gray-200 dark:border-gray-750 rounded-xl p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
                      placeholder={language === "en" ? "Edit your spiritual post..." : "Modifiez votre publication spirituelle..."}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingPostId(null);
                          setEditingPostContent("");
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer transition-all"
                      >
                        {language === "en" ? "Cancel" : "Annuler"}
                      </button>
                      <button
                        onClick={() => handleSaveEditPost(post.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                      >
                        {language === "en" ? "Save" : "Enregistrer"}
                      </button>
                    </div>
                  </div>
                ) : (
                  post.content && (
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed break-words">
                      {post.content}
                    </p>
                  )
                )}

                {/* DYNAMIC ATTACHMENT: MOCK IDE Snippet */}
                {post.codeSnippet && (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-750 bg-gray-950 shadow-md">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-[11px] text-gray-400 border-b border-gray-850">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase">{post.codeSnippet.language}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(post.codeSnippet?.code || "");
                          alert("Code copié !");
                        }}
                        className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title={tLocal("copyCode")}
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-left max-h-[260px] scrollbar-thin">
                      <code
                        className="font-mono text-xs text-gray-300 leading-relaxed block"
                        dangerouslySetInnerHTML={{
                          __html: highlightCodeWithFallback(post.codeSnippet.code, post.codeSnippet.language)
                        }}
                      />
                    </pre>
                  </div>
                )}

                {/* DYNAMIC ATTACHMENTS: VOICE MESSAGES */}
                {post.voiceNotes && post.voiceNotes.map((noteUrl, noteIndex) => (
                  <div
                    key={noteIndex}
                    className="p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 max-w-sm flex items-center gap-3 shadow-sm"
                  >
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Volume2 size={18} />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                        {language === "ha" ? "Saƙon Murya" : "Message Vocal"}
                      </span>
                      <audio src={noteUrl} controls className="h-8 w-full mt-1.5 focus:outline-none" />
                    </div>
                  </div>
                ))}

                {/* DYNAMIC ATTACHMENTS: IMAGE GRID & VIDEO */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="space-y-2">
                    {/* Filter out image urls */}
                    {(() => {
                      const imgs = post.attachments.filter(a => a.type === "image");
                      const vids = post.attachments.filter(a => a.type === "video");
                      
                      return (
                        <>
                          {imgs.length > 0 && (
                            <div className={`grid gap-2 ${imgs.length === 1 ? "grid-cols-1" : imgs.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                              {imgs.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  onClick={() => {
                                    setLightboxImages(imgs.map(i => i.url));
                                    setLightboxIndex(imgIdx);
                                  }}
                                  className="relative rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-gray-700 cursor-pointer group shadow-sm"
                                >
                                  <img src={img.url} alt="attached media" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Maximize2 size={18} className="text-white drop-shadow-sm" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {vids.map((vid, vidIdx) => (
                            <div key={vidIdx} className="rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-gray-700 shadow-sm max-w-lg">
                              <video src={vid.url} controls className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* EXPANDED ACTION BAR */}
                <AnimatePresence>
                  {expandedActionsPostId === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scaleY: 0.8 }}
                      animate={{ opacity: 1, height: "auto", scaleY: 1 }}
                      exit={{ opacity: 0, height: 0, scaleY: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top bg-gray-50/75 dark:bg-gray-900/40 p-2.5 rounded-2xl border border-gray-150/40 dark:border-gray-750/50 flex items-center justify-around gap-2 mt-3 shadow-inner"
                    >
                      {/* Emoji reaction popup trigger */}
                      <button
                        onClick={() => {
                          setActiveReactionHoverPost(activeReactionHoverPost === post.id ? null : post.id);
                        }}
                        className={`p-2 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center ${
                          activeReactionHoverPost === post.id ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={language === "en" ? "Reactions" : "Réactions"}
                      >
                        <Smile size={18} />
                      </button>

                      {/* Reply / Private Message */}
                      <button
                        onClick={() => {
                          if (user) {
                            if (user.uid !== post.authorId) {
                              setDmRecipient({ id: post.authorId, name: post.authorName });
                              setIsDMOpen(true);
                            } else {
                              alert(language === "en" ? "You cannot send a message to yourself!" : "Vous ne pouvez pas vous envoyer de message à vous-même !");
                            }
                          } else {
                            alert(language === "en" ? "Please sign in to send messages." : "Veuillez vous connecter pour envoyer un message.");
                          }
                        }}
                        className={`p-2 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center ${
                          user?.uid === post.authorId ? "text-gray-300 dark:text-gray-750 cursor-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        disabled={user?.uid === post.authorId}
                        title={language === "en" ? "Send Direct Message" : "Envoyer un message privé"}
                      >
                        <CornerUpLeft size={18} />
                      </button>

                      {/* Comment section toggle */}
                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className={`p-2 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center ${
                          expandedPost === post.id ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={language === "en" ? "Comments" : "Commentaires"}
                      >
                        <MessageSquare size={18} />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          const shareText = post.content || "Code spirituel partagé";
                          if (navigator.share) {
                            navigator.share({
                              title: `Post de ${post.authorName}`,
                              text: shareText.substring(0, 100),
                              url: window.location.href
                            }).catch(console.warn);
                          } else {
                            navigator.clipboard.writeText(`${shareText}\nShared from AsrarHub`);
                            alert("Texte copié !");
                          }
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center"
                        title={language === "en" ? "Share" : "Partager"}
                      >
                        <Share2 size={18} />
                      </button>

                      {/* Bookmark/Save Toggle */}
                      <button
                        onClick={() => toggleBookmarkPost(post.id)}
                        className={`p-2 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center ${
                          savedCommunityPostIds.includes(post.id)
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        title={savedCommunityPostIds.includes(post.id) ? (language === "en" ? "Bookmarked" : "Sauvegardé") : (language === "en" ? "Save publication" : "Sauvegarder dans les favoris")}
                      >
                        <Bookmark size={18} className={savedCommunityPostIds.includes(post.id) ? "fill-amber-500 text-amber-500" : ""} />
                      </button>

                      {/* Edit (only author or admin) */}
                      {(post.authorId === user?.uid || user?.role === "admin") ? (
                        <button
                          onClick={() => {
                            setEditingPostId(post.id);
                            setEditingPostContent(post.content);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center"
                          title={language === "en" ? "Edit publication" : "Modifier la publication"}
                        >
                          <Pencil size={18} />
                        </button>
                      ) : (
                        <div className="p-2 text-gray-300 dark:text-gray-750 cursor-not-allowed flex items-center justify-center" title="Modification non autorisée">
                          <Pencil size={18} />
                        </div>
                      )}

                      {/* Delete (only author or admin) */}
                      {(post.authorId === user?.uid || user?.role === "admin") ? (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center"
                          title={language === "en" ? "Delete publication" : "Supprimer la publication"}
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <div className="p-2 text-gray-300 dark:text-gray-750 cursor-not-allowed flex items-center justify-center" title="Suppression non autorisée">
                          <Trash2 size={18} />
                        </div>
                      )}

                      {/* Pin (only Admin) */}
                      {user?.role === "admin" ? (
                        <button
                          onClick={() => handlePinPost(post.id, post.isPinned || false)}
                          className={`p-2 rounded-xl transition-all hover:scale-115 active:scale-95 cursor-pointer flex items-center justify-center ${
                            post.isPinned ? "bg-amber-500/10 text-amber-500" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                          title={post.isPinned ? (language === "en" ? "Unpin" : "Désépingler") : (language === "en" ? "Pin" : "Épingler")}
                        >
                          <Pin size={18} className={post.isPinned ? "fill-amber-500 text-amber-500" : ""} />
                        </button>
                      ) : (
                        <div className="p-2 text-gray-300 dark:text-gray-750 cursor-not-allowed flex items-center justify-center" title="Réservé aux administrateurs">
                          <Pin size={18} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FOOTER INTERACTIVE ACTIONS BAR */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between relative">
                  {/* Reaction icon counts summary (Facebook style) */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    {activeReactionIcons.length > 0 && (
                      <div className="flex -space-x-1 items-center">
                        {activeReactionIcons.slice(0, 3).map((icon, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-700 border border-white dark:border-gray-800 flex items-center justify-center text-[11px] shadow-sm"
                          >
                            {icon}
                          </span>
                        ))}
                      </div>
                    )}
                    {totalReactions > 0 && (
                      <span className="font-bold">
                        {totalReactions} {tLocal("reactionsCount")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* REACTION BUTTON WITH DOCK POPUP */}
                    <div
                      onMouseEnter={() => setActiveReactionHoverPost(post.id)}
                      onMouseLeave={() => setActiveReactionHoverPost(null)}
                      className="relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleReaction(post.id, "like")}
                        className={`px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-xs font-bold cursor-pointer flex items-center gap-1.5 ${currentReactionColor}`}
                      >
                        <ThumbsUp size={14} className={currentReactionLabel !== "React" ? "fill-current" : ""} />
                        <span className="hidden min-[375px]:inline">{currentReactionLabel}</span>
                      </button>

                      {/* Floating reaction dock */}
                      {activeReactionHoverPost === post.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-850 p-2 rounded-full shadow-xl border border-gray-100 dark:border-gray-700 flex gap-2 items-center z-30"
                        >
                          {(["like", "love", "haha", "wow", "sad", "angry"] as const).map((rType) => {
                            const icons = { like: "👍", love: "❤️", haha: "😂", wow: "😮", sad: "😢", angry: "😡" };
                            return (
                              <button
                                key={rType}
                                type="button"
                                onClick={() => handleReaction(post.id, rType)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition-all hover:scale-125 duration-150 cursor-pointer active:scale-95"
                                title={rType}
                              >
                                {icons[rType]}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    {/* COMMENTS TOGGLE BUTTON */}
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-500 hover:text-emerald-500 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span className="hidden min-[375px]:inline">{tLocal("commentBtn")}</span>
                    </button>

                    {/* SHARE BUTTON */}
                    <button
                      onClick={() => {
                        const shareText = post.content || "Code spirituel partagé";
                        if (navigator.share) {
                          navigator.share({
                            title: `Post de ${post.authorName}`,
                            text: shareText.substring(0, 100),
                            url: window.location.href
                          }).catch(console.warn);
                        } else {
                          navigator.clipboard.writeText(`${shareText}\nShared from AsrarHub`);
                          alert("Lien / Texte copié avec succès !");
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 text-gray-500 hover:text-emerald-500 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={14} />
                      <span className="hidden min-[375px]:inline">{tLocal("shareBtn")}</span>
                    </button>

                    {/* ACTIONS MENU TOGGLER */}
                    <button
                      onClick={() => setExpandedActionsPostId(expandedActionsPostId === post.id ? null : post.id)}
                      className={`px-2.5 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        expandedActionsPostId === post.id ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-gray-500 hover:text-emerald-500"
                      }`}
                      title={language === "en" ? "Show Options" : "Plus d'options"}
                    >
                      <MoreHorizontal size={14} className={expandedActionsPostId === post.id ? "rotate-90 transition-all duration-200 text-emerald-500" : "transition-all duration-200"} />
                      <span>{language === "en" ? "Actions" : "Options"}</span>
                    </button>
                  </div>
                </div>

                {/* THREAD COMMENTS ACCORDION */}
                {expandedPost === post.id && <PostComments postId={post.id} />}
              </motion.div>
            );
          });
        })()}
      </div>
      )}

      {/* POLLS VIEW */}
      {/* POLLS VIEW */}
      {currentView === "polls" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white flex items-center gap-2.5">
                <Vote size={22} className="text-emerald-500 animate-pulse" />
                <span>{language === "en" ? "Interactive Community Polls" : language === "ha" ? "Zaɓukan Al'umma" : "Sondages de l'Al'umma"}</span>
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-left">
                {language === "en" ? "Share your opinion and see what other members think." : language === "ha" ? "Bayyana ra'ayinka kuma ka ga abin da sauran mambobi ke tunani." : "Exprimez votre opinion et découvrez l'avis des autres membres de la communauté."}
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setIsCreatingPoll(!isCreatingPoll)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer active:scale-[0.97] shadow-sm shrink-0 self-start sm:self-center ${
                  isCreatingPoll
                    ? "bg-red-500 border-red-400 text-white hover:bg-red-600"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-500/10"
                }`}
              >
                <Plus size={14} className={isCreatingPoll ? "rotate-45 transition-transform duration-200" : "transition-transform duration-200"} />
                <span>{isCreatingPoll ? (language === "en" ? "Close" : "Fermer") : (language === "en" ? "Create a Poll" : "Créer un sondage")}</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {isCreatingPoll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 dark:border-gray-700/80 mb-6 overflow-hidden text-left"
              >
                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      {language === "en" ? "Poll Question" : "Question du sondage"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newPollQuestion}
                      onChange={(e) => setNewPollQuestion(e.target.value)}
                      placeholder={language === "en" ? "What would you like to ask the community?" : "Quelle question souhaitez-vous poser à l'al'umma ?"}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {language === "en" ? "Options" : "Options de réponse"}
                    </label>
                    {newPollOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400 w-4 shrink-0">{idx + 1}.</span>
                        <input
                          type="text"
                          required={idx < 2}
                          value={option}
                          onChange={(e) => {
                            const updated = [...newPollOptions];
                            updated[idx] = e.target.value;
                            setNewPollOptions(updated);
                          }}
                          placeholder={language === "en" ? `Option ${idx + 1}` : `Option ${idx + 1}`}
                          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                        {newPollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newPollOptions.filter((_, i) => i !== idx);
                              setNewPollOptions(updated);
                            }}
                            className="p-2.5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {newPollOptions.length < 6 ? (
                      <button
                        type="button"
                        onClick={() => setNewPollOptions([...newPollOptions, ""])}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/25 px-3.5 py-2 rounded-xl transition-all"
                      >
                        <Plus size={12} />
                        <span>{language === "en" ? "Add Option" : "Ajouter une option"}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">
                        {language === "en" ? "Maximum 6 options reached" : "Maximum de 6 options atteint"}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer"
                    >
                      {language === "en" ? "Publish Poll" : "Publier le sondage"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {polls.map((poll) => {
              const hasVoted = !!votedPolls[poll.id];
              const userVotedOptionId = votedPolls[poll.id];

              return (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/80 flex flex-col justify-between relative group text-left"
                >
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDeletePoll(poll.id)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title={language === "en" ? "Delete Poll" : "Supprimer le sondage"}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-4 leading-snug pr-6">
                      {poll.question}
                    </h3>

                    <div className="space-y-3">
                      {poll.options.map((opt) => {
                        const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                        const isThisSelected = userVotedOptionId === opt.id;

                        return (
                          <div key={opt.id} className="relative">
                            {hasVoted ? (
                              <div className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-3.5 flex items-center justify-between border border-gray-100 dark:border-gray-750 overflow-hidden min-h-[48px] relative gap-3 min-w-0">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`absolute left-0 top-0 bottom-0 ${isThisSelected ? "bg-emerald-500/15 dark:bg-emerald-500/10" : "bg-gray-100 dark:bg-gray-800/60"}`}
                                />
                                <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 relative z-10 flex items-center gap-2 min-w-0 flex-1 text-left break-words">
                                  {isThisSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                                  <span className="break-words">{opt.text}</span>
                                </span>
                                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 relative z-10 font-mono shrink-0 ml-2">
                                  {pct}%
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleVote(poll.id, opt.id)}
                                className="w-full text-left bg-white dark:bg-gray-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-2xl p-3.5 border border-gray-150 dark:border-gray-750 hover:border-emerald-300 dark:hover:border-emerald-900/50 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.98] min-w-0"
                              >
                                <span className="break-words flex-1 min-w-0 text-left">{opt.text}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                                  <span>{tLocal("voteBtn")}</span>
                                  <ChevronRight size={12} />
                                </span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">
                    <span>
                      {poll.totalVotes} {tLocal("totalVotes")}
                    </span>
                    {hasVoted ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetVote(poll.id)}
                          className="text-[9px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold hover:underline cursor-pointer px-2 py-1 rounded-lg transition-colors border border-red-500/10 shrink-0"
                        >
                          {language === "en" ? "Change Vote" : "Modifier mon vote"}
                        </button>
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold shrink-0">
                          {tLocal("alreadyVoted")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-500 font-bold shrink-0">
                        {language === "en" ? "Vote pending" : "Vote en attente"}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* MEMBERS & ONLINE VIEW */}
      {(currentView === "friends" || currentView === "online") && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2.5">
              {currentView === "friends" ? (
                <>
                  <Users size={20} className="text-emerald-500" />
                  <span>{tLocal("friendsTab")}</span>
                </>
              ) : (
                <>
                  <Radio size={20} className="text-emerald-500 animate-pulse" />
                  <span>{tLocal("onlineTab")}</span>
                </>
              )}
            </h2>

            {/* SEARCH DIRECTORY BAR */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tLocal("searchMembers")}
                className="w-full bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 rounded-2xl py-2 px-4 pr-10 text-xs sm:text-sm text-gray-850 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                🔍
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membersData
              .filter(m => {
                if (currentView === "online" && !m.isOnline) return false;
                if (!searchQuery) return true;
                const search = searchQuery.toLowerCase();
                return m.name.toLowerCase().includes(search) || m.country.toLowerCase().includes(search);
              })
              .map((member) => {
                const isFriend = friendsList.includes(member.id);

                return (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 p-3.5 sm:p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-750 flex items-center justify-between gap-3 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-grow">
                      {/* Avatar with status indicator */}
                      <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/15 flex items-center justify-center text-xl shadow-inner select-none shrink-0">
                        {member.avatar}
                        {member.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 animate-pulse" />
                        )}
                      </div>

                      {/* Info block */}
                      <div className="text-left min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className="font-extrabold text-xs sm:text-sm text-gray-850 dark:text-gray-100 truncate max-w-[80px] min-[375px]:max-w-[110px] sm:max-w-[160px]" title={member.name}>
                            {member.name}
                          </span>
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r text-white shadow-sm shrink-0 ${member.roleColor}`}>
                            {member.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-semibold flex-wrap min-w-0">
                          <span className="truncate max-w-[70px] sm:max-w-[100px]">{member.country}</span>
                          <span className="shrink-0">•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{member.points} pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Send private message */}
                      <button
                        onClick={() => {
                          setDmRecipient({ id: member.id, name: member.name });
                          setIsDMOpen(true);
                        }}
                        className="p-2.5 bg-gray-50 dark:bg-gray-750 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-all border border-gray-100 dark:border-gray-700 active:scale-95 cursor-pointer"
                        title="Envoyer un message privé"
                      >
                        <MessageSquare size={14} />
                      </button>

                      {/* Toggle friend button */}
                      <button
                        onClick={() => toggleFriend(member.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 shrink-0 ${isFriend ? "bg-red-50 hover:bg-red-100/75 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 border-red-200/50 dark:border-red-900/40" : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-sm"}`}
                      >
                        {isFriend ? tLocal("removeFriend") : tLocal("addFriend")}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* STUNNING LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxImages([])}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="relative max-w-5xl w-full max-h-[80vh] flex items-center justify-center">
              {lightboxImages.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <img
                src={lightboxImages[lightboxIndex]}
                alt="Lightbox enlarged view"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {lightboxImages.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(prev => (prev + 1) % lightboxImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            <div className="absolute bottom-4 text-white text-xs font-bold uppercase tracking-wider">
              Image {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIVATE MESSAGES DRAWER */}
      {isDMOpen && (
        <DirectMessages
          onClose={() => {
            setIsDMOpen(false);
            setDmRecipient(null);
          }}
          initialRecipientId={dmRecipient?.id}
          initialRecipientName={dmRecipient?.name}
        />
      )}

      {/* STUNNING FLAG / REPORT CONFIRMATION MODAL */}
      <AnimatePresence>
        {flagModalPostId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 text-left"
            >
              <div className="flex items-center gap-3 text-red-500 mb-4">
                <AlertTriangle size={24} />
                <h3 className="font-extrabold text-base sm:text-lg">
                  {language === "en" ? "Report content" : language === "ha" ? "Bayyana Saƙon da bai dace ba" : "Signaler la publication"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                {language === "en" ? "Help us maintain a respectful community. Please choose a reason for flagging this content:" : language === "ha" ? "Taimaka mana mu kiyaye mutuncin al'umma. Zaɓi dalilin bayar da rahoton wannan saƙon:" : "Aidez-nous à maintenir une communauté respectueuse. Veuillez choisir un motif de signalement :"}
              </p>
              
              <div className="space-y-2.5 mb-6">
                {[
                  { id: "spam", fr: "Spam ou publicité abusive", en: "Spam or excessive ads", ha: "Spam ko Talla" },
                  { id: "harassment", fr: "Harcèlement, haine ou intimidation", en: "Harassment, hate or bullying", ha: "Cin zarafi ko Ƙiyayya" },
                  { id: "inappropriate", fr: "Contenu offensant ou indécent", en: "Offensive or indecent content", ha: "Saƙon da bai dace ba" },
                  { id: "misleading", fr: "Fausse information ou égarement spirituel", en: "Misleading or false spiritual guidance", ha: "Kuskuren bayanin sirri" }
                ].map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setFlagReason(reason.id)}
                    className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                      flagReason === reason.id
                        ? "bg-red-500/10 text-red-600 border-red-500 dark:bg-red-950/20 dark:text-red-400"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-750 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {reason[lang] || reason.fr}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setFlagModalPostId(null); setFlagReason(""); }}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-100 dark:border-gray-750 cursor-pointer"
                >
                  {language === "en" ? "Cancel" : language === "ha" ? "Soke" : "Annuler"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!flagReason) return;
                    const updated = [...reportedPosts, flagModalPostId];
                    setReportedPosts(updated);
                    localStorage.setItem("asrarhub_flagged_posts", JSON.stringify(updated));
                    
                    if (user) {
                      try {
                        const postRef = doc(db, "community_posts", flagModalPostId);
                        await updateDoc(postRef, {
                          flaggedCount: (posts.find(p => p.id === flagModalPostId)?.flaggedCount || 0) + 1,
                          [`flags.${user.uid}`]: flagReason
                        });
                      } catch (e) {
                        console.warn("Could not write flag to firebase:", e);
                      }
                    }
                    
                    setFlagModalPostId(null);
                    setFlagReason("");
                    alert(language === "en" ? "Content flagged successfully. Thank you!" : language === "ha" ? "An bayar da rahoton saƙon cikin nasara. Na gode!" : "Publication signalée avec succès. Merci !");
                  }}
                  disabled={!flagReason}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-red-500/10 active:scale-95"
                >
                  {language === "en" ? "Confirm Flag" : language === "ha" ? "Tabbatar" : "Signaler"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
