import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Target, Activity, ChevronLeft, Hand, Award, Plus, MapPin, Globe, Check, AlertCircle, Info, Flame, Sparkles, X, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../../lib/firebase';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, onSnapshot, updateDoc, increment, setDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

interface Participant {
  id: string;
  fullName: string;
  country: string;
  city: string;
  count: number;
}

interface HalaqaCircle {
  id: string;
  title: string;
  target: number;
  count: number;
  type: string;
  creatorName: string;
  creatorCountry: string;
  creatorCity: string;
  createdAt: number;
  creatorId?: string;
  status?: 'active' | 'draft';
}

const localTranslations: Record<string, Record<string, string>> = {
  fr: {
    title: "Cercles de Zikr Virtuels (Halaqat)",
    subtitle: "Rejoignez ou créez un cercle spirituel en temps réel et unissez vos forces avec la Oummah.",
    createCircle: "Lancer un Cercle de Zikr",
    circleTitle: "Sujet ou Titre du Cercle",
    target: "Objectif Cible (ex: 100000)",
    zikrType: "Type de Formule / Dhikr",
    creatorName: "Votre Nom Complet",
    creatorCountry: "Votre Pays de Résidence",
    creatorCity: "Votre Ville",
    joinCircle: "Rejoindre le Cercle",
    participants: "Participants Actifs dans ce Cercle",
    noParticipants: "Aucun participant enregistré.",
    btnCreate: "Lancer le Cercle",
    btnCancel: "Annuler",
    activeCircles: "Cercles de Zikr Actifs",
    targetReached: "Objectif Atteint !",
    yourContribution: "Votre Contribution",
    totalProgress: "Progression Générale",
    backToList: "Retour à la liste des cercles",
    joiningAs: "Participation sous le profil de :",
    enterDetails: "Pour participer, veuillez renseigner vos coordonnées :",
    joinedCircleSuccess: "Vous avez rejoint le cercle avec succès !",
    placeholderTitle: "Ex: Salawat de la paix",
    placeholderCity: "Ex: Dakar",
    placeholderCountry: "Ex: Sénégal",
    placeholderName: "Ex: Seydou Diop",
    emptyCircles: "Aucun cercle de Zikr actif pour le moment. Soyez le premier !",
    onlineMode: "Mode Temps Réel Synchronisé",
    offlineMode: "Mode Local (Bac à sable)",
    joinPrompt: "Rejoindre et participer",
    errorFill: "Veuillez remplir tous les champs requis.",
    editTitle: "Modifier le Cercle",
    deleteTitle: "Supprimer le Cercle",
    statusDraft: "Brouillon",
    statusActive: "Actif",
    statusLabel: "Statut du Cercle",
    toggleDraft: "Mettre en brouillon",
    toggleActive: "Publier le cercle",
    saveChanges: "Enregistrer les modifications",
    creatorProfile: "Votre Profil de Créateur",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce cercle ?",
    draftSaved: "Brouillon enregistré !",
    publishSuccess: "Cercle publié avec succès !",
    isDraftAlert: "Ce cercle est actuellement un brouillon. Seul vous pouvez le voir."
  },
  en: {
    title: "Virtual Zikr Circles (Halaqat)",
    subtitle: "Join or create a real-time spiritual circle and unite your forces with the Ummah.",
    createCircle: "Launch a Zikr Circle",
    circleTitle: "Circle Title or Subject",
    target: "Target Objective (e.g., 100000)",
    zikrType: "Dhikr Type / Formula",
    creatorName: "Your Full Name",
    creatorCountry: "Your Country of Residence",
    creatorCity: "Your City",
    joinCircle: "Join Circle",
    participants: "Active Circle Participants",
    noParticipants: "No registered participants yet.",
    btnCreate: "Launch Circle",
    btnCancel: "Cancel",
    activeCircles: "Active Zikr Circles",
    targetReached: "Target Reached!",
    yourContribution: "Your Contribution",
    totalProgress: "General Progress",
    backToList: "Back to circle list",
    joiningAs: "Participating as:",
    enterDetails: "To participate, please enter your details:",
    joinedCircleSuccess: "Successfully joined the circle!",
    placeholderTitle: "E.g., Salawat of Peace",
    placeholderCity: "E.g., London",
    placeholderCountry: "E.g., United Kingdom",
    placeholderName: "E.g., Omar Farooq",
    emptyCircles: "No active Zikr circles at the moment. Be the first to launch one!",
    onlineMode: "Real-time Synchronized Mode",
    offlineMode: "Local Sandbox Mode",
    joinPrompt: "Join and participate",
    errorFill: "Please fill out all required fields.",
    editTitle: "Edit Circle",
    deleteTitle: "Delete Circle",
    statusDraft: "Draft",
    statusActive: "Active",
    statusLabel: "Circle Status",
    toggleDraft: "Set to Draft",
    toggleActive: "Publish Circle",
    saveChanges: "Save Changes",
    creatorProfile: "Your Creator Profile",
    deleteConfirm: "Are you sure you want to delete this circle?",
    draftSaved: "Draft saved!",
    publishSuccess: "Circle successfully published!",
    isDraftAlert: "This circle is currently a draft. Only you can view it."
  },
  ha: {
    title: "Halaqobin Zikiri na Gizo (Halaqat)",
    subtitle: "Shiga ko ƙirƙiri ƙungiyar zikiri na lokaci-da-lokaci kuma ku haɗa ƙarfin ku da Al'umma.",
    createCircle: "Fara Tsarin Zikiri",
    circleTitle: "Sunan ko Batun Tsarin",
    target: "Manufar Niyya (misali: 100000)",
    zikrType: "Irin Zikiri / Formula",
    creatorName: "Cikakken Sunanka",
    creatorCountry: "Ƙasarku ta Zama",
    creatorCity: "Garinku",
    joinCircle: "Shiga Tsarin",
    participants: "Masu Halarta Suna Aiki a Tsarin",
    noParticipants: "Babu masu halarta tukunna.",
    btnCreate: "Fara Tsarin",
    btnCancel: "Soke",
    activeCircles: "Tsarukan Zikiri Da Ke Aiki",
    targetReached: "An Kai Ga Niyya!",
    yourContribution: "Gudunmawar Ku",
    totalProgress: "Ci Gaban Gaba Ɗaya",
    backToList: "Koma zuwa jerin tsaruka",
    joiningAs: "Shiga a matsayin:",
    enterDetails: "Don shiga, da fatan za a cika bayanan ku:",
    joinedCircleSuccess: "An yi nasarar shiga tsarin!",
    placeholderTitle: "Misali: Salawat na Zaman Lafiya",
    placeholderCity: "Misali: Kano",
    placeholderCountry: "Misali: Nigeria",
    placeholderName: "Misali: Ibrahim Bello",
    emptyCircles: "Babu wani tsarin zikiri mai aiki yanzu. Kasance farkon ƙirƙira!",
    onlineMode: "Lokaci-da-Lokaci Sinc Mode",
    offlineMode: "Yanayin Sandbox na Cikin Gida",
    joinPrompt: "Shiga kuma ku shiga",
    errorFill: "Da fatan za a cika duk bayanan da ake buƙata.",
    editTitle: "Gyara Tsari",
    deleteTitle: "Goge Tsari",
    statusDraft: "Brouillon (Ajiye)",
    statusActive: "Mai Aiki",
    statusLabel: "Matsayin Tsari",
    toggleDraft: "Mayar da shi Brouillon",
    toggleActive: "Wallafa Tsari",
    saveChanges: "Ajiye Canje-canje",
    creatorProfile: "Bayananka na Mahalicci",
    deleteConfirm: "Kuna da tabbacin kuna son goge wannan tsari?",
    draftSaved: "An ajiye a matsayin brouillon!",
    publishSuccess: "An wallafa tsarin cikin nasara!",
    isDraftAlert: "Wannan tsarin yana a matsayin brouillon yanzu. Kai kaɗai za ka iya gani."
  }
};

export const Halaqat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const lang = language === 'en' || language === 'ha' ? language : 'fr';
  const tLocal = (key: string) => localTranslations[lang][key] || localTranslations['fr'][key] || key;

  // Real-time vs Offline fallback state
  const [isOnline, setIsOnline] = useState(false);
  const [circles, setCircles] = useState<HalaqaCircle[]>([]);
  const [activeCircle, setActiveCircle] = useState<HalaqaCircle | null>(null);

  // Handle auto-join from other screens (like Tasbih)
  useEffect(() => {
    const autoJoinId = location.state?.autoJoinId;
    if (autoJoinId && circles.length > 0) {
      const matched = circles.find(c => c.id === autoJoinId);
      if (matched) {
        setActiveCircle(matched);
        // Clear location state to prevent endless looping/re-open on page reload
        window.history.replaceState({}, document.title);
      }
    }
  }, [circles, location.state]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [myContribution, setMyContribution] = useState(0);

  // Profile forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinPromptModal, setShowJoinPromptModal] = useState(false);
  const [joinedCircleIdToSettle, setJoinedCircleIdToSettle] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(100000);
  const [newZikrType, setNewZikrType] = useState('Salawat (Allāhumma ṣalli ʿalā Muḥammad)');
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorCountry, setNewCreatorCountry] = useState('');
  const [newCreatorCity, setNewCreatorCity] = useState('');

  const { user } = useAuth();

  // Edit and draft state
  const [editingCircle, setEditingCircle] = useState<HalaqaCircle | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState(100000);
  const [editZikrType, setEditZikrType] = useState('Salawat (Allāhumma ṣalli ʿalā Muḥammad)');
  const [editCreatorName, setEditCreatorName] = useState('');
  const [editCreatorCountry, setEditCreatorCountry] = useState('');
  const [editCreatorCity, setEditCreatorCity] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'draft'>('active');

  const [createStatus, setCreateStatus] = useState<'active' | 'draft'>('active');

  // Join form state (if user hasn't cached details yet)
  const [userProfile, setUserProfile] = useState<{ fullName: string, country: string, city: string } | null>(null);

  // Pre-fill creator info if cache or user context is available
  useEffect(() => {
    if (userProfile) {
      setNewCreatorName(prev => prev || userProfile.fullName || '');
      setNewCreatorCountry(prev => prev || userProfile.country || '');
      setNewCreatorCity(prev => prev || userProfile.city || '');
    } else if (user) {
      setNewCreatorName(prev => prev || user.name || '');
      setNewCreatorCountry(prev => prev || user.country || '');
    }
  }, [user, userProfile]);

  // Load user profile details cached in session/localStorage
  useEffect(() => {
    // Attempt to load from localStorage user profile cache
    const cachedProfile = localStorage.getItem('asrar_user_profile_cache');
    if (cachedProfile) {
      try {
        setUserProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Try parsing auth state
      try {
        const stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}');
        if (stats?.user_name) {
          setUserProfile({
            fullName: stats.user_name,
            country: stats.user_country || '',
            city: stats.user_city || ''
          });
        }
      } catch (e) {}
    }
  }, []);

  // Sync to database if online, else fall back to local storage
  useEffect(() => {
    // 1. Listen for circles in Firestore
    const unsubscribeCircles = onSnapshot(collection(db, 'halaqat'), (snapshot) => {
      setIsOnline(true);
      const list: HalaqaCircle[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as HalaqaCircle);
      });
      // Sort newest first
      list.sort((a, b) => b.createdAt - a.createdAt);
      setCircles(list);
    }, (error) => {
      console.warn("Operating Virtual Halaqat offline / local fallback mode:", error);
      setIsOnline(false);
      // Load local circles from storage or initial empty set
      const cached = localStorage.getItem('asrar_local_halaqat');
      if (cached) {
        setCircles(JSON.parse(cached));
      } else {
        setCircles([]);
        localStorage.setItem('asrar_local_halaqat', JSON.stringify([]));
      }
    });

    return () => unsubscribeCircles();
  }, [lang]);

  // Sync active circle and participants
  useEffect(() => {
    if (!activeCircle) return;

    let unsubscribeParticipants = () => {};

    if (isOnline) {
      // Listen to participants for active circle
      const q = query(collection(db, 'halaqat_participants'), where('circleId', '==', activeCircle.id));
      unsubscribeParticipants = onSnapshot(q, (snapshot) => {
        const list: Participant[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Participant);
        });
        setParticipants(list);
      });
    } else {
      // Offline mode: only show current user's contribution
      const mockParticipants: Participant[] = [
        { id: 'p_my', fullName: userProfile?.fullName || 'Vous (Salik)', country: userProfile?.country || 'Sénégal', city: userProfile?.city || 'Dakar', count: myContribution }
      ];
      setParticipants(mockParticipants);
    }

    return () => unsubscribeParticipants();
  }, [activeCircle, isOnline, myContribution, userProfile]);

  // Keep activeCircle real-time synced
  useEffect(() => {
    if (!activeCircle) return;
    const matched = circles.find(c => c.id === activeCircle.id);
    if (matched) {
      setActiveCircle(matched);
    }
  }, [circles, activeCircle]);

  // Handle Tasbih tap inside a circle
  const handleCircleTasbihClick = async () => {
    if (!activeCircle) return;
    
    const nextContrib = myContribution + 1;
    setMyContribution(nextContrib);

    if (isOnline) {
      try {
        const circleRef = doc(db, 'halaqat', activeCircle.id);
        await updateDoc(circleRef, {
          count: increment(1)
        });

        if (userProfile) {
          const participantId = `${activeCircle.id}_${userProfile.fullName.replace(/\s+/g, '_')}`;
          const participantRef = doc(db, 'halaqat_participants', participantId);
          await setDoc(participantRef, {
            circleId: activeCircle.id,
            fullName: userProfile.fullName,
            country: userProfile.country,
            city: userProfile.city,
            count: increment(1)
          }, { merge: true });
        }
      } catch (e) {
        console.error("Firestore update error:", e);
      }
    } else {
      // Local mode increment
      const updatedCircles = circles.map(c => {
        if (c.id === activeCircle.id) {
          return { ...c, count: c.count + 1 };
        }
        return c;
      });
      setCircles(updatedCircles);
      localStorage.setItem('asrar_local_halaqat', JSON.stringify(updatedCircles));

      // Update local participants state directly
      setParticipants(prev => prev.map(p => {
        if (p.id === 'p_my') {
          return { ...p, count: nextContrib };
        }
        return p;
      }));
    }
  };

  // Launch circle
  const handleCreateCircleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCreatorName || !newCreatorCountry || !newCreatorCity) {
      alert(tLocal('errorFill'));
      return;
    }

    const circleObj: Omit<HalaqaCircle, 'id'> = {
      title: newTitle,
      target: Number(newTarget),
      count: 0,
      type: newZikrType,
      creatorName: newCreatorName,
      creatorCountry: newCreatorCountry,
      creatorCity: newCreatorCity,
      createdAt: Date.now(),
      creatorId: user?.uid || 'local',
      status: createStatus
    };

    // Cache the creator info to userProfile automatically
    const profObj = { fullName: newCreatorName, country: newCreatorCountry, city: newCreatorCity };
    setUserProfile(profObj);
    localStorage.setItem('asrar_user_profile_cache', JSON.stringify(profObj));

    if (isOnline) {
      try {
        await addDoc(collection(db, 'halaqat'), circleObj);
      } catch (error) {
        console.error(error);
      }
    } else {
      const newId = 'local_' + Date.now();
      const updated = [{ id: newId, ...circleObj }, ...circles];
      setCircles(updated);
      localStorage.setItem('asrar_local_halaqat', JSON.stringify(updated));
    }

    // Reset forms
    setNewTitle('');
    setCreateStatus('active');
    setShowCreateModal(false);
  };

  // Edit circle
  const handleEditCircleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCircle) return;
    if (!editTitle || !editCreatorName || !editCreatorCountry || !editCreatorCity) {
      alert(tLocal('errorFill'));
      return;
    }

    const updatedData = {
      title: editTitle,
      target: Number(editTarget),
      type: editZikrType,
      creatorName: editCreatorName,
      creatorCountry: editCreatorCountry,
      creatorCity: editCreatorCity,
      status: editStatus
    };

    if (isOnline) {
      try {
        const circleRef = doc(db, 'halaqat', editingCircle.id);
        await updateDoc(circleRef, updatedData);
        
        const profObj = { fullName: editCreatorName, country: editCreatorCountry, city: editCreatorCity };
        setUserProfile(profObj);
        localStorage.setItem('asrar_user_profile_cache', JSON.stringify(profObj));
      } catch (error) {
        console.error("Error editing circle:", error);
      }
    } else {
      const updated = circles.map(c => {
        if (c.id === editingCircle.id) {
          return { ...c, ...updatedData };
        }
        return c;
      });
      setCircles(updated);
      localStorage.setItem('asrar_local_halaqat', JSON.stringify(updated));
    }

    if (activeCircle?.id === editingCircle.id) {
      setActiveCircle({ ...activeCircle, ...updatedData });
    }

    setEditingCircle(null);
  };

  // Delete circle
  const handleDeleteCircle = async (circleId: string) => {
    if (!window.confirm(tLocal('deleteConfirm'))) return;

    if (isOnline) {
      try {
        await deleteDoc(doc(db, 'halaqat', circleId));
        if (activeCircle?.id === circleId) {
          setActiveCircle(null);
        }
      } catch (error) {
        console.error("Error deleting circle:", error);
      }
    } else {
      const updated = circles.filter(c => c.id !== circleId);
      setCircles(updated);
      localStorage.setItem('asrar_local_halaqat', JSON.stringify(updated));
      if (activeCircle?.id === circleId) {
        setActiveCircle(null);
      }
    }
  };

  // Toggle draft/active status directly
  const handleToggleStatus = async (circle: HalaqaCircle) => {
    const nextStatus = circle.status === 'draft' ? 'active' : 'draft';

    if (isOnline) {
      try {
        const circleRef = doc(db, 'halaqat', circle.id);
        await updateDoc(circleRef, { status: nextStatus });
      } catch (error) {
        console.error("Error toggling status:", error);
      }
    } else {
      const updated = circles.map(c => {
        if (c.id === circle.id) {
          return { ...c, status: nextStatus as "active" | "draft" };
        }
        return c;
      });
      setCircles(updated);
      localStorage.setItem('asrar_local_halaqat', JSON.stringify(updated));
    }
  };

  // Join Action
  const triggerJoinCircle = (circle: HalaqaCircle) => {
    setMyContribution(0);
    if (!userProfile) {
      setJoinedCircleIdToSettle(circle.id);
      setShowJoinPromptModal(true);
    } else {
      setActiveCircle(circle);
    }
  };

  const handleJoinDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreatorName || !newCreatorCountry || !newCreatorCity) {
      alert(tLocal('errorFill'));
      return;
    }

    const profObj = { fullName: newCreatorName, country: newCreatorCountry, city: newCreatorCity };
    setUserProfile(profObj);
    localStorage.setItem('asrar_user_profile_cache', JSON.stringify(profObj));
    setShowJoinPromptModal(false);

    if (joinedCircleIdToSettle) {
      const targetC = circles.find(c => c.id === joinedCircleIdToSettle);
      if (targetC) {
        setActiveCircle(targetC);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 safe-area-pt pb-24 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (activeCircle) {
                setActiveCircle(null);
              } else {
                navigate('/user/dashboard');
              }
            }}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="text-emerald-500" />
              {tLocal('title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tLocal('subtitle')}</p>
          </div>
        </div>

        {/* CONNECTION STATUS BADGE */}
        <div className="flex items-center gap-2">
          <span className={`flex h-2 w-2 relative`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {isOnline ? tLocal('onlineMode') : tLocal('offlineMode')}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeCircle ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* HERO PROMPT BANNER */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Users size={180} />
              </div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
                  {lang === 'en' ? 'Community Spirit' : lang === 'ha' ? 'Ruhin Al-umma' : 'Force Collective'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {lang === 'en' ? 'Create Your Own Circle' : lang === 'ha' ? 'Fara Naku Tsarin' : 'Créez votre propre assemblée de prières'}
                </h2>
                <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed">
                  {lang === 'en' 
                    ? 'Launch a custom circle for any specific Dhikr or count goal. Let friends, family and brothers worldwide join and contribute live.' 
                    : lang === 'ha' 
                      ? 'Fara tsari na musamman don kowane Zikiri. Bari mutane a duk duniya su shiga su bayar da gudunmawa kai tsaye.' 
                      : 'Initiez un cercle unique pour une formule spécifique. Partagez l\'objectif et visualisez chaque contribution nationale en temps réel.'
                  }
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus size={18} />
                  <span>{tLocal('createCircle')}</span>
                </button>
              </div>
            </div>

            {/* DIRECTORY TITLE */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Flame className="text-amber-500 animate-pulse" size={18} />
                {tLocal('activeCircles')}
              </h3>
            </div>

            {/* CIRCLES GRID */}
            {(() => {
              const filteredCircles = circles.filter(c => {
                if (c.status === 'draft') {
                  return user && (c.creatorId === user.uid || user.role === 'admin');
                }
                return true;
              });

              return filteredCircles.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 dark:bg-gray-850 rounded-3xl border border-gray-150 dark:border-gray-850">
                  <Users className="text-gray-300 dark:text-gray-700 mx-auto mb-3" size={40} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tLocal('emptyCircles')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCircles.map((c) => {
                    const progress = Math.min((c.count / c.target) * 100, 100);
                    const isCreator = user && (c.creatorId === user.uid || user.role === 'admin');
                    return (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={c.id}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-750 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                      >
                        {c.status === 'draft' && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl tracking-wider">
                            {tLocal('statusDraft')}
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-lg truncate max-w-[180px]">
                              {c.type.split(' ')[0]}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <MapPin size={12} />
                              <span>{c.creatorCity}, {c.creatorCountry}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-gray-900 dark:text-white text-base leading-snug hover:text-emerald-600 transition-colors">
                              {c.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {lang === 'en' ? 'Created by' : lang === 'ha' ? 'Wanda ya ƙirƙira' : 'Initié par'} <span className="font-bold text-gray-600 dark:text-gray-300">{c.creatorName}</span>
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-6 space-y-2">
                          <div className="flex justify-between items-end text-xs font-bold font-mono">
                            <span className="text-emerald-600 dark:text-emerald-400 text-sm">{c.count.toLocaleString()}</span>
                            <span className="text-gray-400">/ {c.target.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${progress}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              {progress.toFixed(1)}% {lang === 'en' ? 'Done' : lang === 'ha' ? 'Kammala' : 'Complété'}
                            </span>
                            <div className="flex items-center gap-2">
                              {isCreator && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingCircle(c);
                                      setEditTitle(c.title);
                                      setEditTarget(c.target);
                                      setEditZikrType(c.type);
                                      setEditCreatorName(c.creatorName);
                                      setEditCreatorCountry(c.creatorCountry);
                                      setEditCreatorCity(c.creatorCity);
                                      setEditStatus(c.status || 'active');
                                    }}
                                    className="p-1.5 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
                                    title={tLocal('editTitle')}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCircle(c.id);
                                    }}
                                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
                                    title={tLocal('deleteTitle')}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => triggerJoinCircle(c)}
                                className="text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
                              >
                                {tLocal('joinPrompt')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        ) : (
          /* ACTIVE DHIKR CIRCLE SCREEN */
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* LEFT 2 COLUMNS: TASBIH INTERACTIVE INTERFACE */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-850 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-750 shadow-sm flex flex-col items-center justify-center space-y-8">
              <div className="w-full flex justify-between items-start gap-4">
                <div>
                  <button
                    onClick={() => setActiveCircle(null)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>{tLocal('backToList')}</span>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3 leading-snug">{activeCircle.title}</h2>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeCircle.type}</p>
                  {user && (activeCircle.creatorId === user.uid || user.role === 'admin') && (
                    <div className="flex items-center gap-2 mt-2 bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-xl border border-gray-100 dark:border-gray-750/50 w-fit">
                      {activeCircle.status === 'draft' ? (
                        <span className="text-[10px] bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded">
                          {tLocal('statusDraft')}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded">
                          {tLocal('statusActive')}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setEditingCircle(activeCircle);
                          setEditTitle(activeCircle.title);
                          setEditTarget(activeCircle.target);
                          setEditZikrType(activeCircle.type);
                          setEditCreatorName(activeCircle.creatorName);
                          setEditCreatorCountry(activeCircle.creatorCountry);
                          setEditCreatorCity(activeCircle.creatorCity);
                          setEditStatus(activeCircle.status || 'active');
                        }}
                        className="p-1 rounded text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        title={tLocal('editTitle')}
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteCircle(activeCircle.id)}
                        className="p-1 rounded text-gray-500 hover:text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        title={tLocal('deleteTitle')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">{lang === 'en' ? 'Creator' : lang === 'ha' ? 'Mahalicci' : 'Créateur'}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">{activeCircle.creatorName}</span>
                  <span className="text-[10px] text-gray-400 block">{activeCircle.creatorCity}, {activeCircle.creatorCountry}</span>
                </div>
              </div>

              {/* TASBIH PULSING TRIGGER BUTTON */}
              <div className="relative w-full max-w-md my-4 flex items-center justify-center">
                {activeCircle.count >= activeCircle.target && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-3xl"
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCircleTasbihClick}
                  className={`w-full h-44 sm:h-52 rounded-3xl flex flex-col items-center justify-center text-white relative group shadow-xl border border-white/15 transition-all cursor-pointer ${
                    activeCircle.count >= activeCircle.target
                      ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 shadow-amber-500/20'
                      : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-emerald-500/20'
                  }`}
                >
                  <div className="absolute inset-2 rounded-2xl border-2 border-white/10 scale-100 group-hover:scale-[1.02] transition-transform"></div>
                  <Hand size={44} className="opacity-90 mb-3 animate-pulse" />
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tighter">+{myContribution}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80 mt-2">{tLocal('yourContribution')}</span>
                </motion.button>
              </div>

              {/* COMPACT GENERAL PROGRESS SLIDER */}
              <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-750">
                <div className="flex justify-between items-end text-xs font-extrabold font-mono mb-2">
                  <span className="text-gray-500">{tLocal('totalProgress')}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                    {activeCircle.count.toLocaleString()} <span className="text-gray-400 font-normal">/ {activeCircle.target.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 transition-all duration-300" 
                    style={{ width: `${Math.min((activeCircle.count / activeCircle.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    {Math.min((activeCircle.count / activeCircle.target) * 100, 100).toFixed(2)}%
                  </span>
                  {activeCircle.count >= activeCircle.target && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles size={10} />
                      {tLocal('targetReached')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME PARTICIPANTS DIRECTORY WITH GEOLOCATION */}
            <div className="bg-white dark:bg-gray-850 rounded-3xl p-6 border border-gray-100 dark:border-gray-750 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-gray-750 flex items-center gap-2">
                  <Globe className="text-emerald-500" size={18} />
                  {tLocal('participants')}
                </h3>

                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                  {participants.map((p) => (
                    <div 
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100/10"
                    >
                      <div className="min-w-0 mr-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm block truncate">
                          {p.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                          <MapPin size={10} className="shrink-0" />
                          {p.city}, {p.country}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                          {p.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USER JOIN PROFILE BADGE */}
              {userProfile && (
                <div className="mt-6 pt-4 border-t border-gray-150 dark:border-gray-750 text-xs">
                  <span className="text-gray-400 block uppercase font-bold tracking-widest mb-1">{tLocal('joiningAs')}</span>
                  <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10">
                    <div>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200 block text-sm">{userProfile.fullName}</span>
                      <span className="text-[10px] text-gray-400">{userProfile.city}, {userProfile.country}</span>
                    </div>
                    <button
                      onClick={() => setShowJoinPromptModal(true)}
                      className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      {lang === 'en' ? 'Edit' : lang === 'ha' ? 'Gyara' : 'Modifier'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: CREATE A NEW CIRCLE */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="text-emerald-500" />
                  {tLocal('createCircle')}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCircleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('circleTitle')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={tLocal('placeholderTitle')}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('target')} *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('zikrType')} *</label>
                    <select
                      value={newZikrType}
                      onChange={(e) => setNewZikrType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="Salawat (Allāhumma ṣalli ʿalā Muḥammad)">Salawat</option>
                      <option value="Istighfar (Astaghfirullāh al-ʿAẓīm)">Istighfar</option>
                      <option value="Ya Allah (يَا اللَّهُ)">Ya Allah</option>
                      <option value="Ya Latif (يَا لَطِيفُ)">Ya Latif</option>
                      <option value="La ilaha illa Allah (لَا إِلٰهَ إِلَّا ٱللَّٰهُ)">La ilaha illa Allah</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('statusLabel')} *</label>
                  <select
                    value={createStatus}
                    onChange={(e) => setCreateStatus(e.target.value as 'active' | 'draft')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="active">{tLocal('statusActive')}</option>
                    <option value="draft">{tLocal('statusDraft')}</option>
                  </select>
                </div>

                {/* CREATOR PROFILE FIELDS */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {lang === 'en' ? 'Your Personal Profile Info' : lang === 'ha' ? 'Bayananka na Ruhaniya' : 'Vos Coordonnées Publiques (Visibles)'}
                  </h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={tLocal('placeholderName')}
                      value={newCreatorName}
                      onChange={(e) => setNewCreatorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCountry')} *</label>
                      <input
                        type="text"
                        required
                        placeholder={tLocal('placeholderCountry')}
                        value={newCreatorCountry}
                        onChange={(e) => setNewCreatorCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCity')} *</label>
                      <input
                        type="text"
                        required
                        placeholder={tLocal('placeholderCity')}
                        value={newCreatorCity}
                        onChange={(e) => setNewCreatorCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-3 rounded-2xl border border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm cursor-pointer"
                  >
                    {tLocal('btnCancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {tLocal('btnCreate')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: EDIT AN EXISTING CIRCLE */}
      <AnimatePresence>
        {editingCircle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCircle(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit className="text-emerald-500" />
                  {tLocal('editTitle')}
                </h3>
                <button
                  onClick={() => setEditingCircle(null)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditCircleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('circleTitle')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={tLocal('placeholderTitle')}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('target')} *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={editTarget}
                      onChange={(e) => setEditTarget(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('zikrType')} *</label>
                    <select
                      value={editZikrType}
                      onChange={(e) => setEditZikrType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="Salawat (Allāhumma ṣalli ʿalā Muḥammad)">Salawat</option>
                      <option value="Istighfar (Astaghfirullāh al-ʿAẓīm)">Istighfar</option>
                      <option value="Ya Allah (يَا اللَّهُ)">Ya Allah</option>
                      <option value="Ya Latif (يَا لَطِIFُ)">Ya Latif</option>
                      <option value="La ilaha illa Allah (لَا إِلٰهَ إِلَّا ٱللَّٰهُ)">La ilaha illa Allah</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('statusLabel')} *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'active' | 'draft')}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="active">{tLocal('statusActive')}</option>
                    <option value="draft">{tLocal('statusDraft')}</option>
                  </select>
                </div>

                {/* CREATOR PROFILE FIELDS */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {tLocal('creatorProfile')}
                  </h4>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={tLocal('placeholderName')}
                      value={editCreatorName}
                      onChange={(e) => setEditCreatorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCountry')} *</label>
                      <input
                        type="text"
                        required
                        placeholder={tLocal('placeholderCountry')}
                        value={editCreatorCountry}
                        onChange={(e) => setEditCreatorCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCity')} *</label>
                      <input
                        type="text"
                        required
                        placeholder={tLocal('placeholderCity')}
                        value={editCreatorCity}
                        onChange={(e) => setEditCreatorCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingCircle(null)}
                    className="px-5 py-3 rounded-2xl border border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm cursor-pointer"
                  >
                    {tLocal('btnCancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {tLocal('saveChanges')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ENTER PROFILE TO JOIN AN ASSEMBLAGE */}
      <AnimatePresence>
        {showJoinPromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinPromptModal(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {tLocal('enterDetails')}
                </h3>
                <button
                  onClick={() => setShowJoinPromptModal(false)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleJoinDetailsSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorName')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={tLocal('placeholderName')}
                    value={newCreatorName}
                    onChange={(e) => setNewCreatorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCountry')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={tLocal('placeholderCountry')}
                      value={newCreatorCountry}
                      onChange={(e) => setNewCreatorCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{tLocal('creatorCity')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={tLocal('placeholderCity')}
                      value={newCreatorCity}
                      onChange={(e) => setNewCreatorCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinPromptModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-250 dark:border-gray-750 text-gray-600 dark:text-gray-300 font-bold text-xs cursor-pointer"
                  >
                    {tLocal('btnCancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {tLocal('joinCircle')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
