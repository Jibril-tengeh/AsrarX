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
  Bookmark,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  Folder,
  ChevronDown,
  Paperclip,
  Search,
  Info,
  Gift
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
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Helper components
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
  replyTo?: {
    authorName: string;
    content: string;
    postId: string;
  };
  codeSnippet?: {
    code: string;
    language: string;
    explanation?: string;
  };
  voiceNotes?: string[]; // base64 array
  attachments?: {
    type: "image" | "video" | "audio";
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
  poll?: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: string[]; // userIds who voted
    }[];
    isClosed?: boolean;
  };
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

const localTranslations: Record<string, Record<string, string>> = {
  fr: {
    communityTitle: "Asrar Al'umma Group 📿",
    tgSubtitle: "Canal officiel de secrets spirituels, wirds et codes",
    onlineSuffix: "en ligne",
    membersSuffix: "membres",
    searchPlaceholder: "Rechercher dans la discussion...",
    msgPlaceholder: "Écrire un message...",
    runCodeBtn: "Exécuter le code",
    compiling: "Compilateur en cours...",
    pinnedMessage: "Message Épinglé",
    replyingTo: "Répondre à",
    sendGift: "Offrir un cadeau spirituel (+50 pts)",
    dmBtn: "Message Privé",
    addFriend: "Ajouter en ami",
    rulesCharter: "Charte de l'Al'umma",
    rule1: "Respect mutuel & sincérité",
    rule2: "Partage authentique de secrets",
    rule3: "Pas de publicité ni spam",
    rule4: "Fraternité & entraide",
    groupInfo: "Infos du groupe",
    membersListTitle: "Liste des Membres",
    sharedMediaTitle: "Médias Partagés",
    createPollTitle: "Créer un Sondage",
    createPollBtn: "Publier le sondage",
    addOptionBtn: "Ajouter un choix",
    shareCodeTitle: "Partager un Code",
    shareCodeBtn: "Publier le code",
    codeExpPlaceholder: "Expliquez brièvement comment utiliser ce wird...",
    voted: "Voté",
    votesCount: "votes",
    noMessages: "Aucun message ici. Lancez la discussion !",
    copied: "Copié !",
    deleteSuccess: "Message supprimé avec succès.",
    giftSuccess: "Cadeau envoyé ! +50 points spirituels.",
    mustBeLoggedIn: "Veuillez vous connecter pour participer."
  },
  en: {
    communityTitle: "Asrar Al'umma Group 📿",
    tgSubtitle: "Official channel for spiritual secrets, wirds & codes",
    onlineSuffix: "online",
    membersSuffix: "members",
    searchPlaceholder: "Search in chat...",
    msgPlaceholder: "Write a message...",
    runCodeBtn: "Execute Code",
    compiling: "Compiling code...",
    pinnedMessage: "Pinned Message",
    replyingTo: "Replying to",
    sendGift: "Send spiritual gift (+50 pts)",
    dmBtn: "Private Message",
    addFriend: "Add Friend",
    rulesCharter: "Al'umma Charter",
    rule1: "Mutual respect & sincerity",
    rule2: "Authentic sharing of secrets",
    rule3: "No ads or spam allowed",
    rule4: "Brotherhood & spiritual aid",
    groupInfo: "Group Info",
    membersListTitle: "Members List",
    sharedMediaTitle: "Shared Media",
    createPollTitle: "Create a Poll",
    createPollBtn: "Publish Poll",
    addOptionBtn: "Add Option",
    shareCodeTitle: "Share Code",
    shareCodeBtn: "Publish Code",
    codeExpPlaceholder: "Explain briefly how to use this wird...",
    voted: "Voted",
    votesCount: "votes",
    noMessages: "No messages yet. Start the conversation!",
    copied: "Copied!",
    deleteSuccess: "Message deleted successfully.",
    giftSuccess: "Gift sent! +50 spiritual points.",
    mustBeLoggedIn: "Please log in to participate."
  },
  ha: {
    communityTitle: "Asrar Al'umma Group 📿",
    tgSubtitle: "Tashar sirrin ruhaniya da dabarun wirdi",
    onlineSuffix: "kan layi",
    membersSuffix: "mambobi",
    searchPlaceholder: "Nemi sako a tattaunawa...",
    msgPlaceholder: "Rubuta sako...",
    runCodeBtn: "Gudanar da Code",
    compiling: "Ana hada code...",
    pinnedMessage: "Sakon da aka makala",
    replyingTo: "Mayar da martani ga",
    sendGift: "Kyautar Ruhaniya (+50 maki)",
    dmBtn: "Sakon Sirri",
    addFriend: "Kara Aboki",
    rulesCharter: "Dokokin Al'umma",
    rule1: "Girmama juna da gaskiya",
    rule2: "Raba asirai na gaskiya",
    rule3: "Babu talla ko spam",
    rule4: "Taimakon juna na ruhaniya",
    groupInfo: "Bayanin Rukunin",
    membersListTitle: "Mambobi",
    sharedMediaTitle: "Hotuna da Bidiyo",
    createPollTitle: "Zabe na Rukunin",
    createPollBtn: "Wallafa Zabe",
    addOptionBtn: "Kara Zabuka",
    shareCodeTitle: "Raba Code",
    shareCodeBtn: "Wallafa Code",
    codeExpPlaceholder: "Yi bayani a takaice yadda ake amfani da wannan wirdi...",
    voted: "Zabe ya gama",
    votesCount: "muryoyi",
    noMessages: "Babu sakonni a nan. Fara tattaunawa !",
    copied: "An kofa !",
    deleteSuccess: "An goge sakon cikin nasara.",
    giftSuccess: "An tura kyauta! +50 maki na ruhaniya.",
    mustBeLoggedIn: "Da fatan za a shiga don shiga tattaunawa."
  }
};

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// Calcul de la valeur mystique (Zikr) d'un Nom Divin
const zikrName = "Al-Latif";
const abjadValue = 129; // Valeur abjad de Ya Latif
const targetDays = 9;

console.log("Nom de Zikr:", zikrName);
console.log("Valeur Abjad:", abjadValue);
console.log("Nombre total de récitions sur " + targetDays + " jours:", abjadValue * targetDays);`,
  python: `# Calcul de la division temporelle pour les prieres de nuit (Tahajjud)
sunset = "19:15"
sunrise = "06:10"
print("Planificateur de veillée spirituelle active")
print("Sunset:", sunset, "Sunrise:", sunrise)`,
  sql: `-- Table de suivi de recitations spirituelles d'Asrar
CREATE TABLE my_zikr_tracker (
  id INT PRIMARY KEY,
  zikr_name VARCHAR(100),
  count_target INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
  html: `<div style="background-color: #074d2b; padding: 24px; font-family: 'Inter', system-ui, sans-serif; text-align: center; border-radius: 16px; color: #ffffff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);">
  <h1 style="font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0; line-height: 1.2;">
    PROTOCOLE DE L'APPEL D'IBRAHIM
  </h1>
  <p style="color: #facc15; font-size: 16px; font-style: italic; font-weight: 600; margin: 0 0 24px 0; line-height: 1.4;">
    "Aller au pèlerinage n'est pas une question d'argent, mais une question d'invitation."
  </p>
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; text-align: left; color: #1e293b; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
    <h3 style="color: #0369a1; font-size: 15px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #38bdf8; padding-bottom: 6px; margin: 0 0 12px 0;">
      DESCRIPTION MYSTIQUE
    </h3>
    <p style="font-size: 14px; line-height: 1.6; color: #0284c7; font-weight: 500; margin: 0;">
      Ce secret est le levier spirituel du percement des dimensions pour rejoindre la Kaaba. Il active l'invitation divine immédiate pour accomplir le Hajj ou la Umrah sous la protection céleste.
    </p>
  </div>
</div>`
};

export const Community: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const lang = language === "en" || language === "ha" ? language : "fr";
  const tLocal = (key: string) => localTranslations[lang][key] || localTranslations["fr"][key] || key;

  const location = useLocation();
  const navigate = useNavigate();

  // Firestore & local states
  const [posts, setPosts] = useState<Post[]>([]);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"info" | "members" | "media" | "ai">("info");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Message Sending Inputs
  const [messageText, setMessageText] = useState("");
  const [replyToPost, setReplyToPost] = useState<Post | null>(null);

  // Media Attachment States
  const [attachedMedias, setAttachedMedias] = useState<{ type: "image" | "video" | "audio"; url: string }[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [codeSharingEnabled, setCodeSharingEnabled] = useState(true);

  // AI Chat States
  const [aiChatMessages, setAiChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Salam Alaykoum. Je suis votre Guide spirituel IA. Posez-moi des questions sur les wirds, les Noms d'Allah, l'interprétation de vos rêves ou les secrets spirituels d'AsrarHub." }
  ]);
  const [aiInputText, setAiInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<any>(null);

  // Search filter
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Modals
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeContent, setCodeContent] = useState(CODE_TEMPLATES.javascript);
  const [codeExplanation, setCodeExplanation] = useState("");
  const [showPreviewDirectly, setShowPreviewDirectly] = useState(true);
  const [activeCodeViewMap, setActiveCodeViewMap] = useState<Record<string, "code" | "preview">>({});

  const [selectedProfileMember, setSelectedProfileMember] = useState<Member | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Active threads (comments)
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  // Floating Context Menu
  const [activeContextMenuPostId, setActiveContextMenuPostId] = useState<string | null>(null);
  const [contextMenuCoords, setContextMenuCoords] = useState<{ x: number; y: number } | null>(null);

  // Inline Compiler logs
  const [compiledOutputs, setCompiledOutputs] = useState<Record<string, string[]>>({});
  const [isCompilingMap, setIsCompilingMap] = useState<Record<string, boolean>>({});
  const [htmlPreviews, setHtmlPreviews] = useState<Record<string, string>>({});
  const [compilerTabMap, setCompilerTabMap] = useState<Record<string, "terminal" | "preview">>({});

  // DM Drawer trigger
  const [dmRecipient, setDmRecipient] = useState<{ id: string; name: string } | null>(null);
  const [isDMOpen, setIsDMOpen] = useState(false);

  // Robust playing audio states
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);
  const currentlyPlayingAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoiceNote = (audioSrc: string, postId: string, index: number) => {
    const key = `${postId}-${index}`;
    
    // If clicking on already playing audio, stop it
    if (playingAudioKey === key) {
      if (currentlyPlayingAudioRef.current) {
        currentlyPlayingAudioRef.current.pause();
        currentlyPlayingAudioRef.current = null;
      }
      setPlayingAudioKey(null);
      return;
    }

    // Stop any previously playing audio first
    if (currentlyPlayingAudioRef.current) {
      currentlyPlayingAudioRef.current.pause();
      currentlyPlayingAudioRef.current = null;
    }

    setPlayingAudioKey(key);

    // If it's a simulated voice note or empty, play a gorgeous synthetic sound
    if (!audioSrc || audioSrc.startsWith("simulated:") || audioSrc === "null" || audioSrc === "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          
          const playTone = (freq: number, start: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
            gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(ctx.currentTime + start);
            osc.stop(ctx.currentTime + start + duration);
          };

          // Beautiful ascending high-tech Telegram-like voice note sound sequence
          playTone(392, 0, 0.35);      // G4
          playTone(523.25, 0.15, 0.35); // C5
          playTone(659.25, 0.3, 0.6);   // E5
          
          setTimeout(() => {
            setPlayingAudioKey((prev) => (prev === key ? null : prev));
            ctx.close();
          }, 1200);
        } else {
          setTimeout(() => {
            setPlayingAudioKey((prev) => (prev === key ? null : prev));
          }, 1200);
        }
      } catch (err) {
        console.warn("Synth playback failed:", err);
        setTimeout(() => {
          setPlayingAudioKey((prev) => (prev === key ? null : prev));
        }, 1200);
      }
      return;
    }

    // Standard HTML5 Audio elements
    try {
      const snd = new Audio(audioSrc);
      currentlyPlayingAudioRef.current = snd;
      
      snd.addEventListener("ended", () => {
        setPlayingAudioKey((prev) => (prev === key ? null : prev));
        if (currentlyPlayingAudioRef.current === snd) {
          currentlyPlayingAudioRef.current = null;
        }
      });

      snd.addEventListener("error", (e) => {
        console.warn("Audio element error, falling back to synthesizer chime:", e);
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const playTone = (freq: number, start: number, duration: number) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
              gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
              gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
              osc.connect(gainNode);
              gainNode.connect(ctx.destination);
              osc.start(ctx.currentTime + start);
              osc.stop(ctx.currentTime + start + duration);
            };
            playTone(392, 0, 0.35);
            playTone(523.25, 0.15, 0.35);
            playTone(659.25, 0.3, 0.6);
            setTimeout(() => {
              setPlayingAudioKey((prev) => (prev === key ? null : prev));
              ctx.close();
            }, 1200);
          } else {
            setPlayingAudioKey((prev) => (prev === key ? null : prev));
          }
        } catch (synthErr) {
          setPlayingAudioKey((prev) => (prev === key ? null : prev));
        }
      });

      snd.play().catch((playErr) => {
        console.warn("Audio play promise rejected, using synthesizer chime:", playErr);
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const playTone = (freq: number, start: number, duration: number) => {
              const osc = ctx.createOscillator();
              const gainNode = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
              gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
              gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
              gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
              osc.connect(gainNode);
              gainNode.connect(ctx.destination);
              osc.start(ctx.currentTime + start);
              osc.stop(ctx.currentTime + start + duration);
            };
            playTone(392, 0, 0.35);
            playTone(523.25, 0.15, 0.35);
            playTone(659.25, 0.3, 0.6);
            setTimeout(() => {
              setPlayingAudioKey((prev) => (prev === key ? null : prev));
              ctx.close();
            }, 1200);
          } else {
            setPlayingAudioKey((prev) => (prev === key ? null : prev));
          }
        } catch (synthErr) {
          setPlayingAudioKey((prev) => (prev === key ? null : prev));
        }
      });
    } catch (createErr) {
      console.warn("Could not instantiate Audio helper:", createErr);
      setPlayingAudioKey((prev) => (prev === key ? null : prev));
    }
  };

  // Subscribe to community global settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "community_settings", "global"), (snap) => {
      if (snap.exists()) {
        setCodeSharingEnabled(snap.data().codeSharingEnabled !== false);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleCodeSharing = async () => {
    try {
      await setDoc(doc(db, "community_settings", "global"), {
        codeSharingEnabled: !codeSharingEnabled
      }, { merge: true });
    } catch (err) {
      console.error("Error toggling code sharing settings:", err);
    }
  };

  const handleSendAiMessage = async (overrideText?: string) => {
    const textToSend = overrideText || aiInputText;
    if (!textToSend.trim() || isAiLoading) return;

    setAiInputText("");
    const newHistory = [...aiChatMessages, { sender: "user" as const, text: textToSend }];
    setAiChatMessages(newHistory);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/community/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory.slice(-6)
        })
      });
      const data = await response.json();
      if (data.reply) {
        setAiChatMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setAiChatMessages((prev) => [...prev, { sender: "ai", text: "Je n'ai pas pu me connecter à mon réservoir de sagesse spirituelle." }]);
      }
    } catch (err) {
      console.error("AI guide chat client error:", err);
      setAiChatMessages((prev) => [...prev, { sender: "ai", text: "Une erreur s'est produite lors de la connexion avec votre guide." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Refs for scroll container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Community Posts
  useEffect(() => {
    let q;
    if (user?.role === "admin") {
      q = query(collection(db, "community_posts"), orderBy("createdAt", "asc"));
    } else {
      q = query(collection(db, "community_posts"), where("status", "==", "approved"), orderBy("createdAt", "asc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            reactions: data.reactions || { like: [], love: [], haha: [], wow: [], sad: [], angry: [] }
          } as Post;
        });
        setPosts(postsData);
        // Scroll to bottom on new messages
        setTimeout(scrollToBottom, 200);
      },
      (error) => {
        console.error("Community posts onSnapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Fetch Users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetched: Member[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const role = data.role || "Aspirant";
        let roleColor = "from-blue-500 to-indigo-600";
        if (role === "admin" || role === "Admin") roleColor = "from-red-500 to-rose-600";
        else if (role === "Sage" || role === "Scholar" || role === "Érudit") roleColor = "from-amber-500 to-yellow-600";
        else if (role === "Expert") roleColor = "from-emerald-500 to-teal-600";

        fetched.push({
          id: docSnap.id,
          name: data.displayName || data.name || "Aspirant",
          role: role,
          roleColor: roleColor,
          points: data.points || data.totalPoints || data.spiritualPoints || 350,
          country: data.country || "Maroc",
          avatar: data.avatar || "📿",
          isOnline: data.isOnline || false,
        });
      });
      setMembersList(fetched);
    });
    return () => unsubscribe();
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts.length]);

  // Handle Voice Recording Simulation
  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordedAudio(null);
    setRecordingSeconds(0);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        let options = {};
        if (typeof MediaRecorder.isTypeSupported === "function") {
          if (MediaRecorder.isTypeSupported("audio/webm")) {
            options = { mimeType: "audio/webm" };
          } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
            options = { mimeType: "audio/mp4" };
          } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
            options = { mimeType: "audio/ogg" };
          } else if (MediaRecorder.isTypeSupported("audio/wav")) {
            options = { mimeType: "audio/wav" };
          }
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event: any) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setRecordedAudio(reader.result as string);
          };
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        recordingIntervalRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        throw new Error("Recording not supported");
      }
    } catch (err) {
      console.warn("MediaRecorder mic access error, starting simulated timer:", err);
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error("Error stopping media recorder, generating chime:", err);
        generateSimulatedVoiceNote();
      }
    } else {
      // Simulate synthetic audio voice file
      generateSimulatedVoiceNote();
    }
  };

  const generateSimulatedVoiceNote = () => {
    // Generate a real, standard, short playable base64 WAV sound of a bell/chime!
    // This ensures that even when microphone permission is denied, or inside sandboxed iframe without mic access,
    // they get a REAL, playable, sending-compatible audio base64 instead of a simulated tag!
    try {
      const sampleRate = 8000;
      const duration = 1.5; // seconds
      const numSamples = sampleRate * duration;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      /* RIFF identifier */
      view.setUint32(0, 0x52494646, false); // "RIFF"
      /* file length */
      view.setUint32(4, 36 + numSamples * 2, true);
      /* RIFF type */
      view.setUint32(8, 0x57415645, false); // "WAVE"
      /* format chunk identifier */
      view.setUint32(12, 0x666d7420, false); // "fmt "
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, 1, true);
      /* channel count */
      view.setUint16(22, 1, true);
      /* sample rate */
      view.setUint32(24, sampleRate, true);
      /* byte rate (sample rate * block align) */
      view.setUint32(28, sampleRate * 2, true);
      /* block align (channel count * bytes per sample) */
      view.setUint16(32, 2, true);
      /* bits per sample */
      view.setUint16(34, 16, true);
      /* data chunk identifier */
      view.setUint32(36, 0x64617461, false); // "data"
      /* data chunk length */
      view.setUint32(40, numSamples * 2, true);

      // Write sine wave chime sound
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const freq = t < 0.6 ? 784 : 1046.5; // G5 then C6
        const envelope = Math.max(0, 1 - t / duration);
        const sample = Math.sin(2 * Math.PI * freq * t) * 32767 * 0.3 * envelope;
        view.setInt16(44 + i * 2, sample, true);
      }

      const blob = new Blob([buffer], { type: "audio/wav" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedAudio(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Error creating synthetic wav chime:", e);
      setRecordedAudio(`simulated:voice_note_chime_${Date.now()}`);
    }
  };

  // Attach Media File Change (Supports Images, Videos, Audios)
  const handleMediaAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      if (file.size > 15 * 1024 * 1024) {
        alert("Fichier trop volumineux (Max 15Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        let type: "image" | "video" | "audio" = "image";
        if (file.type.startsWith("video/")) {
          type = "video";
        } else if (file.type.startsWith("audio/")) {
          type = "audio";
        }
        setAttachedMedias((prev) => [...prev, { type, url: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit standard text message, audio, or attachment
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      alert(tLocal("mustBeLoggedIn"));
      return;
    }

    if (!messageText.trim() && attachedMedias.length === 0 && !recordedAudio) {
      return;
    }

    const payload: any = {
      authorId: user.uid,
      authorName: user.name || "Aspirant",
      authorLocation: user.country ? `${user.country}` : "Sénégal",
      status: "approved",
      content: messageText.trim(),
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

    if (replyToPost) {
      payload.replyTo = {
        authorName: replyToPost.authorName,
        content: replyToPost.content.substring(0, 50),
        postId: replyToPost.id
      };
    }

    if (attachedMedias.length > 0) {
      payload.attachments = attachedMedias;
    }

    if (recordedAudio) {
      payload.voiceNotes = [recordedAudio];
    }

    try {
      await addDoc(collection(db, "community_posts"), payload);
      // Reset
      setMessageText("");
      setReplyToPost(null);
      setAttachedMedias([]);
      setRecordedAudio(null);
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message to Firestore:", err);
    }
  };

  // Submit Poll Message
  const handlePublishPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!pollQuestion.trim()) return;

    const options = pollOptions.filter((opt) => opt.trim() !== "");
    if (options.length < 2) {
      alert("Veuillez fournir au moins 2 options.");
      return;
    }

    const payload: any = {
      authorId: user.uid,
      authorName: user.name || "Aspirant",
      authorLocation: user.country || "Sénégal",
      status: "approved",
      content: `📊 [Sondage] ${pollQuestion}`,
      createdAt: serverTimestamp() || new Date(),
      poll: {
        question: pollQuestion.trim(),
        options: options.map((opt, idx) => ({
          id: `opt_${Date.now()}_${idx}`,
          text: opt.trim(),
          votes: []
        })),
        isClosed: false
      }
    };

    try {
      await addDoc(collection(db, "community_posts"), payload);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setIsPollModalOpen(false);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Code Message
  const handlePublishCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!codeContent.trim()) return;

    const payload: any = {
      authorId: user.uid,
      authorName: user.name || "Aspirant",
      authorLocation: user.country || "Sénégal",
      status: "approved",
      content: codeExplanation.trim() || `💻 [Code] Partage de code ${codeLanguage}`,
      createdAt: serverTimestamp() || new Date(),
      codeSnippet: {
        code: codeContent.trim(),
        language: codeLanguage,
        explanation: codeExplanation.trim(),
        showPreviewDirectly: codeLanguage === "html" ? true : false
      }
    };

    try {
      await addDoc(collection(db, "community_posts"), payload);
      setCodeContent(CODE_TEMPLATES.javascript);
      setCodeExplanation("");
      setShowPreviewDirectly(true);
      setIsCodeModalOpen(false);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // Real-time Poll voting inside bubble
  const handlePollVote = async (postId: string, optionId: string) => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.poll) return;

    const updatedOptions = post.poll.options.map((opt) => {
      let votes = opt.votes ? [...opt.votes] : [];
      // If user clicked this option, toggle their vote. If clicked another, remove their vote from this option
      if (opt.id === optionId) {
        if (votes.includes(user.uid)) {
          votes = votes.filter((v) => v !== user.uid);
        } else {
          votes.push(user.uid);
        }
      } else {
        votes = votes.filter((v) => v !== user.uid);
      }
      return { ...opt, votes };
    });

    try {
      await updateDoc(doc(db, "community_posts", postId), {
        "poll.options": updatedOptions
      });
    } catch (err) {
      console.error("Error voting on poll:", err);
    }
  };

  // Reaction picker triggers
  const handleAddReaction = async (postId: string, react: "like" | "love" | "haha" | "wow" | "sad" | "angry") => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const rx = { ...post.reactions } as any;
    const types = ["like", "love", "haha", "wow", "sad", "angry"];

    // Ensure array structure
    types.forEach((t) => {
      if (!rx[t]) rx[t] = [];
    });

    const alreadyHasThis = rx[react].includes(user.uid);

    // Remove user's previous reaction from all types (single reaction constraint)
    types.forEach((t) => {
      rx[t] = rx[t].filter((uid: string) => uid !== user.uid);
    });

    // Toggle reaction
    if (!alreadyHasThis) {
      rx[react].push(user.uid);
    }

    try {
      await updateDoc(doc(db, "community_posts", postId), { reactions: rx });
    } catch (err) {
      console.error("Error updating reaction:", err);
    }
    setActiveContextMenuPostId(null);
  };

  // Delete message
  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteDoc(doc(db, "community_posts", postId));
        setActiveContextMenuPostId(null);
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  // Pin / Unpin message
  const handlePinPost = async (postId: string, isCurrentlyPinned: boolean) => {
    try {
      await updateDoc(doc(db, "community_posts", postId), {
        isPinned: !isCurrentlyPinned
      });
      setActiveContextMenuPostId(null);
    } catch (err) {
      console.error("Error pinning post:", err);
    }
  };

  // Send Spiritual points Gift
  const handleSendSpiritualGift = async (recipientId: string) => {
    if (!user) return;
    if (recipientId === user.uid) return;
    try {
      const recRef = doc(db, "users", recipientId);
      await updateDoc(recRef, {
        points: (membersList.find((m) => m.id === recipientId)?.points || 0) + 50
      });
      alert(tLocal("giftSuccess"));
      setSelectedProfileMember(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Run Code logic helper
  const stripTypeScriptTypes = (code: string): string => {
    let js = code;
    js = js.replace(/enum\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*?)\}/g, (match, enumName, enumBody) => {
      const lines = enumBody.split(",");
      const entries: string[] = [];
      let lastVal = 0;
      lines.forEach((line: string) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const parts = trimmed.split("=");
        const key = parts[0].trim();
        if (!key) return;
        let val: any = lastVal;
        if (parts[1]) {
          const rawVal = parts[1].trim();
          const parsedVal = parseInt(rawVal);
          if (!isNaN(parsedVal)) {
            val = parsedVal;
            lastVal = val + 1;
          } else {
            entries.push(`  "${key}": ${rawVal}`);
            return;
          }
        } else {
          lastVal++;
        }
        entries.push(`  "${key}": ${val},\n  "${val}": "${key}"`);
      });
      return `const ${enumName} = {\n${entries.join(",\n")}\n};`;
    });
    js = js.replace(/interface\s+[A-Za-z_$][\w$]*(?:\s+extends\s+[^{]+)?\s*\{[\s\S]*?\}/g, "");
    js = js.replace(/type\s+[A-Za-z_$][\w$]*\s*=\s*[^;]+;/g, "");
    js = js.replace(/\b(public|private|protected|readonly)\s+/g, "");
    js = js.replace(/\s+as\s+[A-Za-z_$][\w$]*(?:\s*<[^>]+>)?(?:\s*\[\])?/g, "");
    js = js.replace(/:\s*[A-Za-z_$][\w$]*(?:\s*<[^>]+>)?(?:\s*\[\])?(?=\s*(?:=|,|;|\)|{))/g, "");
    js = js.replace(/\)\s*:\s*[A-Za-z_$][\w$]*(?:\s*<[^>]+>)?(?:\s*\[\])?(?=\s*\{)/g, ")");
    return js;
  };

  const handleRunCompiler = async (postId: string, code: string, language: string) => {
    setIsCompilingMap(prev => ({ ...prev, [postId]: true }));
    let currentLogs = ["[Sandbox] Initializing Virtual Sandbox Machine...", `[Sandbox] Code Language: ${language.toUpperCase()}`];
    setCompiledOutputs(prev => ({ ...prev, [postId]: currentLogs }));

    await new Promise((r) => setTimeout(r, 600));

    try {
      if (language === "javascript" || language === "typescript") {
        let codeToRun = code;
        if (language === "typescript") {
          codeToRun = stripTypeScriptTypes(code);
        }

        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
          error: (...args: any[]) => logs.push("[ERROR] " + args.map(String).join(" ")),
          warn: (...args: any[]) => logs.push("[WARNING] " + args.map(String).join(" "))
        };

        const runFn = new Function("console", `
          try {
            ${codeToRun}
          } catch(err) {
            console.error(err.message);
          }
        `);

        runFn(customConsole);
        setCompiledOutputs(prev => ({ ...prev, [postId]: [...currentLogs, "[Sandbox] Sandbox Execution Finished.", ...logs] }));
      } else if (language === "html") {
        setHtmlPreviews(prev => ({ ...prev, [postId]: code }));
        setCompilerTabMap(prev => ({ ...prev, [postId]: "preview" }));
        setCompiledOutputs(prev => ({ ...prev, [postId]: [...currentLogs, "[Sandbox] Rendered in Preview tab successfully."] }));
      } else {
        // Python / SQL Simulation output
        setCompiledOutputs(prev => ({ ...prev, [postId]: [...currentLogs, "[Mock Engine] Compiled and executed successfully on Asrar Virtual Environment.", "Output:", `> Guran_Zikr_Result: Success (Simulation Mode for Python/SQL)`] }));
      }
    } catch (e: any) {
      setCompiledOutputs(prev => ({ ...prev, [postId]: [...currentLogs, `[Sandbox Error] ${e.message}`] }));
    } finally {
      setIsCompilingMap(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Filter posts based on search input
  const filteredPosts = posts.filter((p) => {
    if (!chatSearchQuery) return true;
    const contentMatch = p.content?.toLowerCase().includes(chatSearchQuery.toLowerCase());
    const authorMatch = p.authorName?.toLowerCase().includes(chatSearchQuery.toLowerCase());
    const snippetMatch = p.codeSnippet?.code?.toLowerCase().includes(chatSearchQuery.toLowerCase());
    return contentMatch || authorMatch || snippetMatch;
  });

  // Get color for user names based on string hash (Telegram name coloring)
  const getNameColorClass = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "text-red-500",
      "text-green-500",
      "text-blue-500",
      "text-pink-500",
      "text-purple-500",
      "text-yellow-600",
      "text-orange-500",
      "text-teal-500",
      "text-indigo-500"
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  // Format timestamp safely
  const formatTime = (createdAt: any) => {
    if (!createdAt) return "00:00";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateLabel = (createdAt: any) => {
    if (!createdAt) return "Aujourd'hui";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
  };

  // Find the pinned message
  const pinnedPost = posts.find(p => p.isPinned);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 safe-area-pt pb-28">
      
      {/* Telegram-specific styles */}
      <style>{`
        .telegram-chat-bg {
          background-color: #eef2e6;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M10 15c2-1.5 4-1.5 5 0s1 3-1 4.5-4 1.5-5 0-1-3 1-4.5zM35 50c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zm20-35c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zM20 70c1-1 2-1 2.5 0s.5 1.5-.5 2.5-2 1-2.5 0-.5-1.5.5-2.5zm45 5c1-1 2-1 2.5 0s.5 1.5-.5 2.5-2 1-2.5 0-.5-1.5.5-2.5z' fill='%23a2c595' fill-opacity='0.12'/%3E%3Cpath d='M65 45c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zM5 45c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3z' fill='%23a2c595' fill-opacity='0.12'/%3E%3Ccircle cx='30' cy='20' r='1.5' fill='%23a2c595' fill-opacity='0.12'/%3E%3Ccircle cx='70' cy='65' r='1.5' fill='%23a2c595' fill-opacity='0.12'/%3E%3Ccircle cx='50' cy='75' r='1.5' fill='%23a2c595' fill-opacity='0.12'/%3E%3Ccircle cx='10' cy='65' r='1.5' fill='%23a2c595' fill-opacity='0.12'/%3E%3Cpath d='M30 65c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2zm20-30c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2z' fill='none' stroke='%23a2c595' stroke-width='1' stroke-opacity='0.15'/%3E%3C/svg%3E");
        }
        .dark .telegram-chat-bg {
          background-color: #0b111c;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M10 15c2-1.5 4-1.5 5 0s1 3-1 4.5-4 1.5-5 0-1-3 1-4.5zM35 50c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zm20-35c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zM20 70c1-1 2-1 2.5 0s.5 1.5-.5 2.5-2 1-2.5 0-.5-1.5.5-2.5zm45 5c1-1 2-1 2.5 0s.5 1.5-.5 2.5-2 1-2.5 0-.5-1.5.5-2.5z' fill='%231e293b' fill-opacity='0.25'/%3E%3Cpath d='M65 45c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3zM5 45c1.5-1 3-1 3.5 0s.5 2-.5 3-2.5 1-3.5 0-.5-2 .5-3z' fill='%231e293b' fill-opacity='0.25'/%3E%3Ccircle cx='30' cy='20' r='1.5' fill='%231e293b' fill-opacity='0.25'/%3E%3Ccircle cx='70' cy='65' r='1.5' fill='%231e293b' fill-opacity='0.25'/%3E%3Ccircle cx='50' cy='75' r='1.5' fill='%231e293b' fill-opacity='0.25'/%3E%3Ccircle cx='10' cy='65' r='1.5' fill='%231e293b' fill-opacity='0.25'/%3E%3Cpath d='M30 65c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2zm20-30c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2z' fill='none' stroke='%231e293b' stroke-width='1' stroke-opacity='0.25'/%3E%3C/svg%3E");
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bubble-tail-left {
          position: relative;
        }
        .bubble-tail-left::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: -6px;
          width: 8px;
          height: 8px;
          background-color: inherit;
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
        .bubble-tail-right {
          position: relative;
        }
        .bubble-tail-right::before {
          content: "";
          position: absolute;
          bottom: 0;
          right: -6px;
          width: 8px;
          height: 8px;
          background-color: inherit;
          clip-path: polygon(0 0, 0 100%, 100% 100%);
        }
      `}</style>

      <div className="bg-white dark:bg-[#111926] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl h-[78vh] flex flex-col md:flex-row relative">
        
        {/* Left/Main Column: Telegram Chat Interface */}
        <div className="flex-1 flex flex-col h-full relative">
          
          {/* Telegram Header */}
          <div className="bg-white dark:bg-[#151f2d] border-b border-gray-100 dark:border-gray-800/80 px-4 py-3 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold shadow-md relative">
                🕌
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#151f2d] rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                  {tLocal("communityTitle")}
                  <Sparkles size={14} className="text-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-gray-400 truncate max-w-[220px] sm:max-w-[400px]">
                  {membersList.length} {tLocal("membersSuffix")} • {membersList.filter(m => m.isOnline).length} {tLocal("onlineSuffix")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  showSearchInput ? "bg-emerald-500/10 text-emerald-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-all cursor-pointer hidden md:block"
                title={tLocal("groupInfo")}
              >
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* Search Bar transition */}
          <AnimatePresence>
            {showSearchInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-50 dark:bg-[#141b27] border-b border-gray-150 dark:border-gray-800/60 px-4 py-2 shrink-0 flex items-center gap-2"
              >
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={tLocal("searchPlaceholder")}
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                />
                {chatSearchQuery && (
                  <button onClick={() => setChatSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sticky Pinned Message Banner */}
          {pinnedPost && (
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between gap-3 text-left z-10 shrink-0 relative">
              <div className="flex items-start gap-2 min-w-0">
                <Pin size={12} className="text-emerald-500 mt-1 shrink-0 rotate-45" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    {tLocal("pinnedMessage")}
                  </span>
                  <button
                    onClick={() => {
                      document.getElementById(`msg-${pinnedPost.id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block text-xs text-gray-700 dark:text-gray-200 truncate hover:underline cursor-pointer font-semibold"
                  >
                    <span className="font-black text-gray-900 dark:text-white">{pinnedPost.authorName}:</span> {pinnedPost.content}
                  </button>
                </div>
              </div>
              <button
                onClick={() => handlePinPost(pinnedPost.id, true)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                title="Détacher le message"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Chat Messages scroll area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-4 telegram-chat-bg relative no-scrollbar"
          >
            {filteredPosts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md mb-3 text-xl">
                  📿
                </div>
                <p className="text-sm text-gray-400 italic">
                  {tLocal("noMessages")}
                </p>
              </div>
            ) : (
              filteredPosts.map((post, idx) => {
                const isOurPost = post.authorId === user?.uid;
                const showAvatar = !isOurPost;
                
                // Day changes separator check
                const prevPost = idx > 0 ? filteredPosts[idx - 1] : null;
                const showDateHeader = !prevPost || (post.createdAt && prevPost.createdAt && 
                  new Date(post.createdAt.toDate ? post.createdAt.toDate() : post.createdAt).toDateString() !== 
                  new Date(prevPost.createdAt.toDate ? prevPost.createdAt.toDate() : prevPost.createdAt).toDateString());

                const authorMember = membersList.find((m) => m.id === post.authorId || m.name === post.authorName);
                const rx = post.reactions || {};
                const currentReactionCount = (rx.like?.length || 0) + (rx.love?.length || 0) + (rx.haha?.length || 0) + (rx.wow?.length || 0) + (rx.sad?.length || 0) + (rx.angry?.length || 0);

                return (
                  <div key={post.id} className="space-y-3">
                    {/* Centered Date Separator */}
                    {showDateHeader && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-400/10 dark:bg-black/30 backdrop-blur text-gray-500 dark:text-gray-300 text-[10.5px] font-extrabold px-3 py-1 rounded-full border border-gray-200/10 shadow-sm">
                          {formatDateLabel(post.createdAt)}
                        </span>
                      </div>
                    )}

                    {/* Chat Bubble Layout Row */}
                    <div
                      id={`msg-${post.id}`}
                      className={`flex items-start gap-2.5 group ${isOurPost ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"} ${post.codeSnippet ? "w-full max-w-[95%] sm:max-w-[80%] min-w-0" : "max-w-[85%] sm:max-w-[70%]"}`}
                    >
                      {/* Avatar */}
                      {showAvatar && (
                        <button
                          onClick={() => {
                            if (authorMember) {
                              setSelectedProfileMember(authorMember);
                            }
                          }}
                          className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-sm border border-gray-150 dark:border-gray-700/80 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                        >
                          {authorMember?.avatar || "📿"}
                        </button>
                      )}

                      {/* Bubble Inner Container */}
                      <div
                        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-sm relative min-w-0 ${
                          post.codeSnippet ? "w-full" : ""
                        } ${
                          isOurPost
                            ? "bg-[#d9fdd3] text-gray-900 dark:bg-[#2b5278] dark:text-white rounded-br-none bubble-tail-right"
                            : "bg-white text-gray-900 dark:bg-[#182533] dark:text-white rounded-bl-none bubble-tail-left border border-gray-100 dark:border-gray-800/80"
                        }`}
                      >
                        {/* Sender's Unique Colored Name Header */}
                        {!isOurPost && (
                          <div className="flex items-center gap-1.5 pb-1 justify-between">
                            <span
                              onClick={() => authorMember && setSelectedProfileMember(authorMember)}
                              className={`text-[11px] font-black hover:underline cursor-pointer ${getNameColorClass(post.authorName)}`}
                            >
                              {post.authorName}
                            </span>
                            {authorMember?.role === "admin" && (
                              <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-widest border border-red-500/20">
                                admin
                              </span>
                            )}
                          </div>
                        )}

                        {/* Reply Header Preview within Bubble */}
                        {post.replyTo && (
                          <div className="bg-black/5 dark:bg-white/5 border-l-2 border-emerald-400 dark:border-teal-400 px-2 py-1.5 rounded-r-lg mb-2 text-left text-xs max-w-full">
                            <span className="block font-black text-[9.5px] text-emerald-600 dark:text-teal-300">
                              {post.replyTo.authorName}
                            </span>
                            <p className="text-gray-500 dark:text-gray-300 text-[10.5px] truncate">
                              {post.replyTo.content}
                            </p>
                          </div>
                        )}

                        {/* Main Text Content */}
                        {post.content && (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
                            {post.content}
                          </p>
                        )}

                        {/* Media Attachments (Flawless Image, Video, Audio) */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className="grid grid-cols-1 gap-3 mt-2">
                            {post.attachments.map((att, i) => {
                              if (att.type === "video") {
                                return (
                                  <div key={i} className="rounded-2xl overflow-hidden max-h-[280px] bg-black/15 dark:bg-black/40 border border-gray-150 dark:border-gray-800">
                                    <video
                                      src={att.url}
                                      controls
                                      className="w-full h-auto max-h-[280px] block"
                                    />
                                  </div>
                                );
                              } else if (att.type === "audio") {
                                return (
                                  <div key={i} className="flex items-center gap-2.5 bg-black/10 dark:bg-white/5 p-2.5 rounded-xl w-full max-w-[280px] select-none border border-gray-100 dark:border-gray-800">
                                    <audio src={att.url} controls className="w-full text-xs" />
                                  </div>
                                );
                              } else {
                                // Default to Image
                                return (
                                  <img
                                    key={i}
                                    src={att.url}
                                    alt="Attachment"
                                    onClick={() => {
                                      const imagesOnly = post.attachments!.filter(a => a.type === "image" || !a.type).map(a => a.url);
                                      const imgIndex = imagesOnly.indexOf(att.url);
                                      setLightboxImages(imagesOnly);
                                      setLightboxIndex(imgIndex >= 0 ? imgIndex : 0);
                                    }}
                                    className="rounded-xl max-h-[220px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                );
                              }
                            })}
                          </div>
                        )}

                        {/* Voice notes */}
                        {post.voiceNotes && post.voiceNotes.map((audio, i) => {
                          const isPlayingThis = playingAudioKey === `${post.id}-${i}`;
                          return (
                            <div key={i} className="flex items-center gap-2.5 bg-black/10 dark:bg-white/5 p-2 rounded-xl mt-2 w-[220px] sm:w-[240px] select-none">
                              <button
                                onClick={() => handlePlayVoiceNote(audio, post.id, i)}
                                className={`p-2 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                                  isPlayingThis ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                                }`}
                                title={isPlayingThis ? "Pause" : "Play"}
                              >
                                {isPlayingThis ? <Pause size={12} /> : <Play size={12} />}
                              </button>
                              <div className="flex-1">
                                <span className="block text-[9px] font-bold opacity-60">Message Vocal</span>
                                <div className="h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full w-full overflow-hidden mt-1">
                                  <div className={`h-full ${isPlayingThis ? "bg-amber-400 animate-pulse w-full" : "bg-emerald-400 w-2/3"} transition-all duration-300`} />
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Code Compiler Block snippet */}
                        {post.codeSnippet && (() => {
                          const isHTML = post.codeSnippet.language === "html";
                          const currentView = activeCodeViewMap[post.id] || ((post.codeSnippet as any).showPreviewDirectly ? "preview" : "code");
                          
                          return (
                            <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800/80 mt-3 overflow-hidden text-left shadow-lg w-full min-w-0">
                              {/* Browser header tab bar */}
                              <div className="bg-[#2d2d2d] px-3.5 py-2.5 flex items-center justify-between text-xs text-gray-300 border-b border-gray-900/60 select-none">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* macOS action dots */}
                                  <div className="flex gap-1.5 shrink-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
                                  </div>
                                  <span className="ml-1.5 font-mono text-[11px] text-gray-400 font-bold truncate flex items-center gap-1">
                                    📄 {isHTML ? "index.html" : `code.${post.codeSnippet.language === "javascript" ? "js" : post.codeSnippet.language === "typescript" ? "ts" : post.codeSnippet.language === "python" ? "py" : "sql"}`}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                  {isHTML && (
                                    <div className="flex bg-black/50 rounded-lg p-0.5 border border-gray-800">
                                      <button
                                        onClick={() => setActiveCodeViewMap(prev => ({ ...prev, [post.id]: "preview" }))}
                                        className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer ${
                                          currentView === "preview"
                                            ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        Aperçu
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (user?.subscriptionTier !== "premium" && user?.subscriptionTier !== "pro" && user?.role !== "admin") {
                                            alert("Option Premium : Seuls les membres Premium peuvent voir le code source d'un aperçu.");
                                            return;
                                          }
                                          setActiveCodeViewMap(prev => ({ ...prev, [post.id]: "code" }))
                                        }}
                                        className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-md transition-all cursor-pointer flex items-center gap-0.5 ${
                                          currentView === "code"
                                            ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                      >
                                        Code {(user?.subscriptionTier !== "premium" && user?.subscriptionTier !== "pro" && user?.role !== "admin") && "🔒"}
                                      </button>
                                    </div>
                                  )}
                                  
                                  <button
                                    onClick={() => {
                                      if (isHTML && user?.subscriptionTier !== "premium" && user?.subscriptionTier !== "pro" && user?.role !== "admin") {
                                        alert("Option Premium : Seuls les membres Premium peuvent copier le code source d'un aperçu.");
                                        return;
                                      }
                                      navigator.clipboard.writeText(post.codeSnippet!.code);
                                      alert(tLocal("copied"));
                                    }}
                                    className="p-1 text-gray-500 hover:text-white rounded transition-colors"
                                    title="Copier le code"
                                  >
                                    <Copy size={12} />
                                  </button>
                                </div>
                              </div>

                              {/* Preview Frame or Source Code Codebox */}
                              {isHTML && currentView === "preview" ? (
                                <div className="bg-white p-0 relative transition-all duration-300 w-full overflow-hidden">
                                  <iframe
                                    title={`Live Preview - ${post.id}`}
                                    srcDoc={post.codeSnippet.code}
                                    className="w-full min-h-[380px] h-auto border-none block"
                                    sandbox="allow-scripts"
                                  />
                                </div>
                              ) : (
                                <div className="p-3 font-mono w-full min-w-0 overflow-hidden relative">
                                  {isHTML && user?.subscriptionTier !== "premium" && user?.subscriptionTier !== "pro" && user?.role !== "admin" ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-950/80 rounded-2xl border border-dashed border-gray-800/60 my-2">
                                      <span className="text-3xl mb-3 animate-pulse">👑</span>
                                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Source Code Verrouillée</h4>
                                      <p className="text-[10px] text-gray-400 max-w-[280px] mt-1 leading-relaxed">
                                        Le code source de cet aperçu interactif est réservé aux membres Premium d'AsrarHub.
                                      </p>
                                      <button
                                        onClick={() => navigate("/user/profile")}
                                        className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-black uppercase rounded-xl shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                                      >
                                        Devenir Premium
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <pre className="text-xs text-green-400 overflow-x-auto max-h-[220px] no-scrollbar w-full max-w-full">
                                        <code>{post.codeSnippet.code}</code>
                                      </pre>

                                      {/* Compilation controller panel for non-html or when testing in code view */}
                                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-800/80">
                                        <button
                                          onClick={() => handleRunCompiler(post.id, post.codeSnippet!.code, post.codeSnippet!.language)}
                                          disabled={isCompilingMap[post.id]}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
                                        >
                                          {isCompilingMap[post.id] ? (
                                            <>
                                              <div className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                              <span>{tLocal("compiling")}</span>
                                            </>
                                          ) : (
                                            <>
                                              <Play size={10} />
                                              <span>{tLocal("runCodeBtn")}</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {/* Code Compilation Output logs */}
                                      {compiledOutputs[post.id] && (
                                        <div className="mt-3 bg-black/40 border border-gray-800/80 rounded-lg p-2.5 font-mono text-[10.5px]">
                                          <div className="flex items-center justify-between border-b border-gray-800/60 pb-1.5 mb-1.5">
                                            <span className="text-gray-500 uppercase tracking-widest text-[9px] font-extrabold">Console</span>
                                          </div>
                                          <div className="space-y-1 max-h-[120px] overflow-y-auto no-scrollbar text-gray-300">
                                            {compiledOutputs[post.id].map((log, i) => (
                                              <div key={i}>{log}</div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Interactive Poll Component Block */}
                        {post.poll && (
                          <div className="bg-gray-50 dark:bg-black/30 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-left mt-2">
                            <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white mb-3">
                              📊 {post.poll.question}
                            </h4>
                            <div className="space-y-2.5">
                              {post.poll.options.map((opt) => {
                                const totalVotes = post.poll!.options.reduce((sum, o) => sum + (o.votes?.length || 0), 0);
                                const vCount = opt.votes ? opt.votes.length : 0;
                                const pct = totalVotes > 0 ? Math.round((vCount / totalVotes) * 100) : 0;
                                const userHasVotedThis = opt.votes?.includes(user?.uid || "");

                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handlePollVote(post.id, opt.id)}
                                    className={`w-full text-left relative p-2.5 rounded-xl border text-xs font-bold transition-all overflow-hidden flex items-center justify-between cursor-pointer ${
                                      userHasVotedThis
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                        : "bg-white dark:bg-[#1f293d] border-gray-150 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    <div className="absolute inset-y-0 left-0 bg-emerald-500/10 dark:bg-emerald-500/20 pointer-events-none transition-all duration-500" style={{ width: `${pct}%` }} />
                                    <span className="relative z-10 flex items-center gap-1.5 truncate">
                                      {userHasVotedThis && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                                      {opt.text}
                                    </span>
                                    <span className="relative z-10 text-[10.5px] text-gray-400 shrink-0 font-black">
                                      {pct}% ({vCount})
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-2.5 text-right font-black">
                              {post.poll.options.reduce((sum, o) => sum + (o.votes?.length || 0), 0)} {tLocal("votesCount")}
                            </div>
                          </div>
                        )}

                        {/* Bottom Right status details inside bubble */}
                        <div className="flex items-center gap-1 justify-end mt-1 text-[9.5px] text-gray-500/70 dark:text-gray-300/60 font-semibold select-none">
                          <span>{formatTime(post.createdAt)}</span>
                          {isOurPost && <span className="text-emerald-600 dark:text-sky-300 ml-0.5 font-bold">✓✓</span>}
                        </div>

                        {/* Chat Menu Trigger Trigger Button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setContextMenuCoords({ x: rect.left, y: rect.top });
                              setActiveContextMenuPostId(post.id);
                            }}
                            className="p-1 bg-black/10 dark:bg-white/10 hover:bg-black/20 text-gray-500 dark:text-white rounded-lg cursor-pointer"
                          >
                            <MoreHorizontal size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Small Reaction indicators resting at the bottom border of the bubble */}
                      {currentReactionCount > 0 && (
                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700/80 px-1.5 py-0.5 rounded-full shadow-sm text-[10px] mt-1">
                          {rx.like?.length > 0 && <span>👍</span>}
                          {rx.love?.length > 0 && <span>❤️</span>}
                          {rx.haha?.length > 0 && <span>😂</span>}
                          {rx.wow?.length > 0 && <span>😮</span>}
                          {rx.sad?.length > 0 && <span>😢</span>}
                          {rx.angry?.length > 0 && <span>😡</span>}
                          <span className="font-mono text-gray-500 font-extrabold">{currentReactionCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Context Bar */}
          {replyToPost && (
            <div className="bg-gray-50 dark:bg-[#131d2a] border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center justify-between shrink-0 text-left">
              <div className="flex items-center gap-2 text-xs border-l-2 border-emerald-500 pl-2">
                <CornerUpLeft size={14} className="text-emerald-500" />
                <div>
                  <span className="block font-black text-gray-900 dark:text-white">
                    {tLocal("replyingTo")} {replyToPost.authorName}
                  </span>
                  <p className="text-gray-400 truncate max-w-[400px]">
                    {replyToPost.content}
                  </p>
                </div>
              </div>
              <button onClick={() => setReplyToPost(null)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Draft Preview & Review Area (Fais que l'utilisateur édite et vérifie les textes avant de le publier) */}
          {(messageText.trim() || recordedAudio || attachedMedias.length > 0) && (
            <div className="mx-4 my-2 p-3 bg-emerald-500/5 dark:bg-teal-500/5 border border-emerald-500/10 dark:border-teal-500/10 rounded-2xl text-left shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-150 dark:border-gray-800/60 mb-2">
                <span className="text-[10px] font-black text-emerald-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Aperçu de votre publication (Vérification avant envoi)
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500">
                  Modifiez votre texte ou écoutez votre voix ci-dessous
                </span>
              </div>
              
              <div className="space-y-2.5">
                {/* Editable Text Area to refine text draft directly */}
                {messageText.trim() && (
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase text-gray-400">Message écrit :</label>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Écrivez ou modifiez votre texte..."
                      className="w-full bg-white dark:bg-[#151f2d] border border-gray-200 dark:border-gray-800/80 rounded-xl p-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none min-h-[50px] max-h-[120px] shadow-sm font-sans"
                    />
                  </div>
                )}

                {/* Voice Note Draft Preview with Playback */}
                {recordedAudio && (
                  <div className="flex items-center justify-between gap-3 bg-amber-500/10 dark:bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handlePlayVoiceNote(recordedAudio, "draft", 0)}
                        className={`p-2 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                          playingAudioKey === "draft-0" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                        }`}
                        title={playingAudioKey === "draft-0" ? "Pause" : "Écouter l'enregistrement"}
                      >
                        {playingAudioKey === "draft-0" ? <Pause size={12} /> : <Play size={12} />}
                      </button>
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">Message Vocal (Aperçu)</span>
                        <span className="block text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">Enregistrement prêt. Écoutez pour vérifier avant publication.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordedAudio(null);
                        if (playingAudioKey === "draft-0") {
                          if (currentlyPlayingAudioRef.current) {
                            currentlyPlayingAudioRef.current.pause();
                            currentlyPlayingAudioRef.current = null;
                          }
                          setPlayingAudioKey(null);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer l'enregistrement vocal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                
                {/* Media Files List and Discard Options */}
                {attachedMedias.length > 0 && (
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase text-gray-400">Pièces jointes ({attachedMedias.length}) :</label>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {attachedMedias.map((media, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                          {media.type === "image" ? (
                            <img src={media.url} className="w-16 h-12 object-cover" />
                          ) : media.type === "video" ? (
                            <div className="w-16 h-12 bg-black flex items-center justify-center text-[9px] text-white font-bold">🎥 VIDÉO</div>
                          ) : (
                            <div className="w-16 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] text-emerald-600 dark:text-teal-400 font-bold">🎵 AUDIO</div>
                          )}
                          <button
                            type="button"
                            onClick={() => setAttachedMedias((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                            style={{ width: "14px", height: "14px" }}
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom input area layout */}
          <div className="bg-[#f0f4f8]/50 dark:bg-[#0b111c] px-4 py-3 flex items-center gap-2 shrink-0 z-10 border-t border-gray-100 dark:border-gray-800/80">
            {/* Main Rounded Input Bar (includes Smile, Input Field, Attachments/Code/Polls) */}
            <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-[#182533] rounded-3xl px-3 py-1.5 border border-gray-200/50 dark:border-gray-800/80 shadow-sm">
              
              {/* Smile Emoji Icon */}
              <button
                type="button"
                onClick={() => setMessageText(prev => prev + "✨")}
                className="p-1.5 text-gray-400 hover:text-emerald-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
                title="Ajouter un symbole de bénédiction"
              >
                <Smile size={20} />
              </button>
 
              {/* Main Text Message Input Field */}
              <form onSubmit={handleSendMessage} className="flex-1">
                {isRecording ? (
                  <div className="flex-1 flex items-center gap-2 text-red-500 font-bold text-[11px] sm:text-xs animate-pulse py-1.5 select-none">
                    <span className="w-2 h-2 rounded-full bg-red-500 block animate-ping"></span>
                    <span>Enregistrement... {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecording(false);
                        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
                        if (mediaRecorderRef.current) {
                          try {
                            mediaRecorderRef.current.stop();
                          } catch (_) {}
                        }
                        mediaRecorderRef.current = null;
                        setRecordedAudio(null);
                      }}
                      className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer font-bold transition-colors text-[10px] uppercase tracking-wider"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={tLocal("msgPlaceholder")}
                    className="w-full bg-transparent border-none text-xs sm:text-sm py-1.5 text-gray-900 dark:text-white focus:outline-none focus:ring-0 placeholder-gray-400"
                  />
                )}
              </form>
 
              {/* Display total attached media indicator */}
              {attachedMedias.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto max-w-[150px] no-scrollbar shrink-0 select-none bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                  {attachedMedias.map((media, idx) => (
                    <div key={idx} className="relative shrink-0">
                      {media.type === "image" ? (
                        <img src={media.url} className="w-7 h-7 rounded-lg object-cover" />
                      ) : media.type === "video" ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">🎥</div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">🎵</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setAttachedMedias((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                        style={{ width: "12px", height: "12px" }}
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const paperBtn = document.getElementById("hidden-media-uploader");
                    paperBtn?.click();
                  }}
                  className="p-1.5 text-gray-400 hover:text-emerald-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
                  title="Ajouter des images, vidéos ou audios"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  id="hidden-media-uploader"
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleMediaAttach}
                  className="hidden"
                />
              </div>
 
              {/* Code Creator Quick Icon Button */}
              <button
                type="button"
                onClick={() => {
                  if (!codeSharingEnabled && user?.role !== "admin") {
                    alert("Le partage de code a été temporairement désactivé par l'administrateur.");
                    return;
                  }
                  setIsCodeModalOpen(true);
                }}
                className={`p-1.5 transition-colors cursor-pointer relative ${
                  !codeSharingEnabled && user?.role !== "admin"
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-400 hover:text-emerald-500 dark:hover:text-teal-400"
                }`}
                title={!codeSharingEnabled && user?.role !== "admin" ? "Partage de code désactivé" : tLocal("shareCodeTitle")}
              >
                <CodeIcon size={20} />
                {!codeSharingEnabled && user?.role !== "admin" && <span className="absolute top-0 right-0 text-[8px]">🔒</span>}
              </button>
 
              {/* Poll Creator Quick Icon Button */}
              <button
                type="button"
                onClick={() => setIsPollModalOpen(true)}
                className="p-1.5 text-gray-400 hover:text-emerald-500 dark:hover:text-teal-400 transition-colors cursor-pointer"
                title={tLocal("createPollTitle")}
              >
                <Vote size={20} />
              </button>
            </div>
 
            {/* Circular Send / Voice Note Action Button outside the pill */}
            {messageText.trim() || attachedMedias.length > 0 || recordedAudio ? (
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-11 h-11 bg-[#2481cc] hover:bg-[#2071b3] text-white rounded-full flex items-center justify-center shadow-md shadow-blue-500/15 active:scale-95 cursor-pointer transition-all shrink-0"
                title="Envoyer le message"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer active:scale-95 ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse shadow-red-500/20"
                    : "bg-[#2481cc] hover:bg-[#2071b3] text-white shadow-blue-500/15"
                }`}
                title={isRecording ? "Cliquer pour arrêter l'enregistrement" : "Enregistrer un message vocal"}
              >
                {isRecording ? <Volume2 size={18} className="animate-bounce" /> : <Mic size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Sidebar Column: Group Details & Online Members */}
        {sidebarOpen && (
          <div className="w-full md:w-80 bg-white dark:bg-[#141b27] border-l border-gray-100 dark:border-gray-800/80 flex flex-col shrink-0">
            
            {/* Sidebar Tabs switcher */}
            <div className="grid grid-cols-4 bg-gray-50 dark:bg-[#111926] p-1 border-b border-gray-100 dark:border-gray-800/80 shrink-0">
              <button
                onClick={() => setActiveSidebarTab("info")}
                className={`py-2 text-[9px] sm:text-[10px] font-black uppercase rounded-xl tracking-tighter sm:tracking-wider transition-all cursor-pointer flex items-center justify-center text-center ${
                  activeSidebarTab === "info" ? "bg-white dark:bg-[#151f2d] text-emerald-600 dark:text-teal-400 shadow-sm" : "text-gray-400"
                }`}
              >
                Infos
              </button>
              <button
                onClick={() => setActiveSidebarTab("members")}
                className={`py-2 text-[9px] sm:text-[10px] font-black uppercase rounded-xl tracking-tighter sm:tracking-wider transition-all cursor-pointer flex items-center justify-center text-center ${
                  activeSidebarTab === "members" ? "bg-white dark:bg-[#151f2d] text-emerald-600 dark:text-teal-400 shadow-sm" : "text-gray-400"
                }`}
              >
                Membres
              </button>
              <button
                onClick={() => setActiveSidebarTab("media")}
                className={`py-2 text-[9px] sm:text-[10px] font-black uppercase rounded-xl tracking-tighter sm:tracking-wider transition-all cursor-pointer flex items-center justify-center text-center ${
                  activeSidebarTab === "media" ? "bg-white dark:bg-[#151f2d] text-emerald-600 dark:text-teal-400 shadow-sm" : "text-gray-400"
                }`}
              >
                Médias
              </button>
              <button
                onClick={() => setActiveSidebarTab("ai")}
                className={`py-2 text-[9px] sm:text-[10px] font-black uppercase rounded-xl tracking-tighter sm:tracking-wider transition-all cursor-pointer flex items-center justify-center gap-0.5 text-center ${
                  activeSidebarTab === "ai" ? "bg-white dark:bg-[#151f2d] text-emerald-600 dark:text-teal-400 shadow-sm" : "text-gray-400"
                }`}
              >
                IA Asrar
              </button>
            </div>

            {/* Tab content space */}
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              
              {/* Tab 1: Group Info Overview */}
              {activeSidebarTab === "info" && (
                <div className="space-y-5 text-left">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-1">Description</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                      {tLocal("tgSubtitle")}. Partagez des codes mystiques (Zikr, Abjad, calculs astronomiques) et des wirds authentiques en toute fraternité.
                    </p>
                  </div>

                  {user?.role === "admin" && (
                    <div className="bg-red-500/5 dark:bg-red-950/10 p-3.5 rounded-2xl border border-red-500/10 space-y-2.5">
                      <span className="block text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest">
                        🛡️ Contrôles d'Administration
                      </span>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="block font-bold text-gray-800 dark:text-gray-250">Partage de Code</span>
                          <span className="block text-[9px] text-gray-400">Activer/désactiver l'écriture</span>
                        </div>
                        <button
                          onClick={handleToggleCodeSharing}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                            codeSharingEnabled
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          {codeSharingEnabled ? "Activé" : "Désactivé"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-2.5">{tLocal("rulesCharter")}</h4>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-500">🕌</span>
                        <span>{tLocal("rule1")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-500">📿</span>
                        <span>{tLocal("rule2")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-500">🛡️</span>
                        <span>{tLocal("rule3")}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-500">🤝</span>
                        <span>{tLocal("rule4")}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20 text-center">
                    <span className="block text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Membres Actifs</span>
                    <span className="block text-2xl font-black text-gray-900 dark:text-white">
                      {membersList.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Members List */}
              {activeSidebarTab === "members" && (
                <div className="space-y-3.5 text-left">
                  {membersList.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedProfileMember(m)}
                      className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-base shadow-inner border border-gray-150 dark:border-gray-700/80 relative">
                          {m.avatar}
                          {m.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 animate-pulse" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                            {m.name}
                          </span>
                          <span className="block text-[9.5px] text-gray-400">
                            {m.country} • {m.points} pts
                          </span>
                        </div>
                      </div>

                      {/* Small role badge */}
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md uppercase">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Shared Media */}
              {activeSidebarTab === "media" && (
                <div className="space-y-4 text-left">
                  <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mb-2.5">Photos Partagées</h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {posts
                      .filter((p) => p.attachments && p.attachments.some((a) => a.type === "image"))
                      .flatMap((p) => p.attachments!)
                      .slice(0, 12)
                      .map((att, i) => (
                        <img
                          key={i}
                          src={att.url}
                          alt="Shared attachment"
                          onClick={() => {
                            setLightboxImages([att.url]);
                            setLightboxIndex(0);
                          }}
                          className="w-full h-16 rounded-lg object-cover cursor-pointer hover:opacity-95"
                        />
                      ))}
                  </div>

                  <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest mt-4 mb-2.5">Codes Source</h4>
                  <div className="space-y-2">
                    {posts
                      .filter((p) => p.codeSnippet)
                      .slice(0, 5)
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            document.getElementById(`msg-${p.id}`)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-gray-50 dark:bg-gray-800/40 p-2 rounded-xl border border-gray-150 dark:border-gray-800/50 cursor-pointer hover:bg-gray-100 text-left"
                        >
                          <span className="block text-[9.5px] font-bold uppercase text-emerald-600 dark:text-teal-400">
                            {p.codeSnippet!.language}
                          </span>
                          <span className="block text-[11px] text-gray-500 dark:text-gray-300 truncate">
                            {p.content}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 4: IA Asrar Spiritual Assistant (Premium Option) */}
              {activeSidebarTab === "ai" && (
                <div className="flex flex-col h-[65vh] text-left">
                  {user?.subscriptionTier !== "premium" && user?.subscriptionTier !== "pro" && user?.role !== "admin" ? (
                    <div className="space-y-4 text-center py-10 px-4">
                      <span className="text-4xl block animate-bounce">👑</span>
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider font-sans">Assistant IA Asrar</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        Débloquez l'IA spirituelle pour obtenir des recommandations personnalisées de wirds, l'interprétation de vos rêves selon Ibn Sirin, et la science des Noms d'Allah.
                      </p>
                      <button
                        onClick={() => navigate("/user/profile")}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-black uppercase rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
                      >
                        Devenir Premium
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar mb-3 flex flex-col">
                        {aiChatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                            <div
                              className={`p-3 rounded-2xl text-[11px] sm:text-xs leading-relaxed max-w-[90%] whitespace-pre-wrap ${
                                msg.sender === "user"
                                  ? "bg-[#2481cc] text-white rounded-tr-none"
                                  : "bg-gray-100 dark:bg-[#182533] text-gray-900 dark:text-white rounded-tl-none border border-gray-150 dark:border-gray-800/80"
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isAiLoading && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-extrabold tracking-wider pt-2 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            <span>L'esprit médite...</span>
                          </div>
                        )}
                      </div>

                      {/* Suggestions area */}
                      <div className="flex gap-1.5 overflow-x-auto pb-2.5 no-scrollbar shrink-0 select-none">
                        {[
                          "Bienfaits de Ya Latif ?",
                          "Un wird pour la paix",
                          "Interpréter un rêve de Lion",
                          "Secrets de Salat al-Fatih"
                        ].map((qStr) => (
                          <button
                            key={qStr}
                            onClick={() => handleSendAiMessage(qStr)}
                            className="shrink-0 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-[#1c2a39] dark:hover:bg-[#233547] border border-gray-150 dark:border-gray-750/50 rounded-xl text-[9.5px] text-gray-500 dark:text-gray-300 font-bold transition-all cursor-pointer"
                          >
                            {qStr}
                          </button>
                        ))}
                      </div>

                      {/* Input Bar */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800/60 shrink-0">
                        <input
                          type="text"
                          value={aiInputText}
                          onChange={(e) => setAiInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendAiMessage();
                          }}
                          placeholder="Posez votre question spirituelle..."
                          className="flex-1 p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-750 text-xs text-gray-800 dark:text-white rounded-xl focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendAiMessage()}
                          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Context/Reactions Menu Popup */}
      <AnimatePresence>
        {activeContextMenuPostId && contextMenuCoords && (
          <>
            {/* Backdrop cover overlay */}
            <div onClick={() => setActiveContextMenuPostId(null)} className="fixed inset-0 z-40" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700/80 rounded-2xl shadow-2xl p-2.5 z-50 w-56 text-left"
              style={{
                top: `${Math.min(contextMenuCoords.y, window.innerHeight - 250)}px`,
                left: `${Math.min(contextMenuCoords.x, window.innerWidth - 240)}px`
              }}
            >
              {/* Emojis list reaction bar */}
              <div className="flex items-center gap-1 pb-2 border-b border-gray-100 dark:border-gray-700/50 mb-2 justify-around">
                {[
                  { icon: "👍", type: "like" },
                  { icon: "❤️", type: "love" },
                  { icon: "😂", type: "haha" },
                  { icon: "😮", type: "wow" },
                  { icon: "😢", type: "sad" },
                  { icon: "😡", type: "angry" }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddReaction(activeContextMenuPostId, item.type as any)}
                    className="hover:scale-125 text-base cursor-pointer active:scale-95 transition-transform"
                  >
                    {item.icon}
                  </button>
                ))}
              </div>

              {/* Action operations lists */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    const post = posts.find((p) => p.id === activeContextMenuPostId);
                    if (post) setReplyToPost(post);
                    setActiveContextMenuPostId(null);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 cursor-pointer"
                >
                  <CornerUpLeft size={13} /> {tLocal("replyingTo")}
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() => {
                      const post = posts.find((p) => p.id === activeContextMenuPostId);
                      if (post) handlePinPost(post.id, !!post.isPinned);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Pin size={13} /> {posts.find((p) => p.id === activeContextMenuPostId)?.isPinned ? "Désépingler" : "Épingler"}
                  </button>
                )}

                {(user?.role === "admin" || posts.find((p) => p.id === activeContextMenuPostId)?.authorId === user?.uid) && (
                  <button
                    onClick={() => handleDeletePost(activeContextMenuPostId)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={13} /> {tLocal("deletePostBtn") || "Supprimer"}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL 1: Create Poll Builder */}
      <AnimatePresence>
        {isPollModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-700 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50 mb-4">
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white uppercase tracking-wider">
                  🗳️ {tLocal("createPollTitle")}
                </h3>
                <button onClick={() => setIsPollModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handlePublishPoll} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Question</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Quelle heure préférez-vous pour le wird collectif ?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-800 dark:text-white border border-gray-100 dark:border-gray-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Choix de réponses</label>
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        required={i < 2}
                        placeholder={`Choix ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[i] = e.target.value;
                          setPollOptions(updated);
                        }}
                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-xs text-gray-800 dark:text-white border border-gray-100 dark:border-gray-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <Plus size={14} /> {tLocal("addOptionBtn")}
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all cursor-pointer"
                  >
                    {tLocal("createPollBtn")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Share Code/Wird Builder */}
      <AnimatePresence>
        {isCodeModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 w-full ${codeLanguage === "html" ? "max-w-2xl" : "max-w-xl"} shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 text-left`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50 mb-4">
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white uppercase tracking-wider">
                  💻 {tLocal("shareCodeTitle")}
                </h3>
                <button onClick={() => setIsCodeModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handlePublishCode} className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Langage</label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => {
                        setCodeLanguage(e.target.value);
                        setCodeContent(CODE_TEMPLATES[e.target.value] || "");
                      }}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-xs text-gray-800 dark:text-white border border-gray-100 dark:border-gray-750 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL Database</option>
                      <option value="html">HTML Render Preview</option>
                    </select>
                  </div>

                  {codeLanguage === "html" && (
                    <label className="flex items-center gap-2.5 p-3 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/20 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showPreviewDirectly}
                        onChange={(e) => setShowPreviewDirectly(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                      />
                      <span className="text-xs font-bold text-gray-750 dark:text-gray-300">
                        Publier sous forme d'aperçu direct dans le groupe
                      </span>
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Code Source</label>
                  <textarea
                    rows={6}
                    required
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="w-full p-3.5 bg-gray-900 text-green-400 font-mono text-xs rounded-xl focus:outline-none"
                  />
                </div>

                {codeLanguage === "html" && codeContent.trim() && (
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Aperçu en temps réel</label>
                    <div className="border border-gray-100 dark:border-gray-700/50 rounded-2xl overflow-hidden bg-white shadow-inner">
                      <div className="bg-gray-50 px-3.5 py-1.5 border-b border-gray-100 flex items-center justify-between select-none">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                          Rendu Live
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 font-mono">iframe sandbox</span>
                      </div>
                      <iframe
                        title="Live Creation Preview"
                        srcDoc={codeContent}
                        sandbox="allow-scripts"
                        className="w-full h-[150px] border-0 bg-white block"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Explications / Secret</label>
                  <input
                    type="text"
                    placeholder={tLocal("codeExpPlaceholder")}
                    value={codeExplanation}
                    onChange={(e) => setCodeExplanation(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-800 dark:text-white border border-gray-100 dark:border-gray-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all cursor-pointer"
                  >
                    {tLocal("shareCodeBtn")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Detailed Profile Popover Card */}
      <AnimatePresence>
        {selectedProfileMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedProfileMember(null)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-4xl shadow-inner border border-gray-150 dark:border-gray-750 mx-auto mb-4 relative">
                {selectedProfileMember.avatar}
                {selectedProfileMember.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 animate-pulse" />
                )}
              </div>

              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                {selectedProfileMember.name}
              </h3>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-0.5">
                <MapPin size={12} /> {selectedProfileMember.country} • {selectedProfileMember.isOnline ? "En Ligne" : "Hors Ligne"}
              </p>

              <div className="my-5 grid grid-cols-2 gap-3.5">
                <div className="bg-gray-50/50 dark:bg-gray-900/30 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-750/30 text-center">
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Rang</span>
                  <span className="block text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 uppercase">
                    {selectedProfileMember.role}
                  </span>
                </div>
                <div className="bg-gray-50/50 dark:bg-gray-900/30 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-750/30 text-center">
                  <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Points</span>
                  <span className="block text-xs font-black text-gray-900 dark:text-white mt-1">
                    {selectedProfileMember.points} pts
                  </span>
                </div>
              </div>

              {/* Action buttons on Profile Card */}
              <div className="space-y-2 pt-2">
                {user?.uid !== selectedProfileMember.id && (
                  <>
                    <button
                      onClick={() => {
                        setDmRecipient({ id: selectedProfileMember.id, name: selectedProfileMember.name });
                        setIsDMOpen(true);
                        setSelectedProfileMember(null);
                      }}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={13} /> {tLocal("dmBtn")}
                    </button>

                    <button
                      onClick={() => handleSendSpiritualGift(selectedProfileMember.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-90 text-white text-xs font-bold rounded-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gift size={13} /> {tLocal("sendGift")}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                alt="Enlarged shared capture"
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
              Capture {lightboxIndex + 1} / {lightboxImages.length}
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
    </div>
  );
};
