import {
  Calculator,
  Clock,
  Activity,
  Compass,
  BookOpen,
  Star,
  Sparkles,
  Users,
  Key,
  Shield,
  Eye,
  Hexagon,
  Coins,
  Scale,
  Moon,
  ListTodo,
  Layers,
  Shuffle,
  Target,
} from "lucide-react";

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  path: string;
  level: "simple" | "advanced";
  comingSoon?: boolean;
}

export const tools: ToolItem[] = [
  // Simple Tools
  {
    id: "abjad",
    title: "Calculateur Abjad",
    description: "Calculez la valeur numérique mystique de vos noms et wirds.",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    path: "/tools/abjad",
    level: "simple",
  },
  {
    id: "asma",
    title: "Noms Divins Personnels",
    description:
      "Découvrez vos noms divins correspondants au poids mystique de votre nom.",
    icon: Sparkles,
    color: "from-indigo-500 to-cyan-600",
    path: "/tools/asma",
    level: "simple",
  },
  {
    id: "99names",
    title: "Les 99 Noms d'Allah",
    description:
      "Recherchez, étudiez et comprenez les Noms Sublimes (Asma al-Husna).",
    icon: ListTodo,
    color: "from-cyan-500 to-blue-600",
    path: "/tools/99names",
    level: "simple",
  },
  {
    id: "quran",
    title: "Le Saint Coran",
    description:
      "Lecture et méditation sur le Coran, l'outil fondamental de tout Asrar.",
    icon: BookOpen,
    color: "from-emerald-600 to-teal-800",
    path: "/tools/quran",
    level: "simple",
  },
  {
    id: "tasbih",
    title: "Tasbih Virtuel",
    description:
      "Un compteur de zikr intelligent pour suivre vos récitations quotidiennes.",
    icon: Activity,
    color: "from-emerald-500 to-teal-600",
    path: "/tools/tasbih",
    level: "simple",
  },
  {
    id: "daily-dhikr",
    title: "Daily Dhikr Tracker",
    description:
      "Définissez des objectifs et suivez votre Dhikr quotidien avec persistance.",
    icon: Target,
    color: "from-emerald-600 to-green-700",
    path: "/tools/daily-dhikr",
    level: "simple",
  },
  {
    id: "planetary",
    title: "Heures Planétaires",
    description:
      "Déterminez les heures spirituelles propices pour vos invocations.",
    icon: Clock,
    color: "from-amber-500 to-orange-600",
    path: "/tools/planetary",
    level: "simple",
  },
  {
    id: "zakat",
    title: "Calculateur de Zakat",
    description:
      "Calculez précisément votre Zakat al-Maal sur diverses richesses.",
    icon: Coins,
    color: "from-yellow-500 to-amber-600",
    path: "/tools/zakat",
    level: "simple",
  },
  {
    id: "faraid",
    title: "Calculateur de Faraid",
    description:
      "Calculez les parts d'héritage selon la jurisprudence islamique.",
    icon: Scale,
    color: "from-amber-600 to-red-600",
    path: "/tools/faraid",
    level: "simple",
  },
  {
    id: "dreams",
    title: "Journal des Rêves (IA)",
    description: "Analysez et documentez vos rêves avec l'IA d'Ibn Sirin.",
    icon: Moon,
    color: "from-blue-700 to-indigo-900",
    path: "/tools/dreams",
    level: "simple",
  },
  {
    id: "halaqat",
    title: "Halaqat Virtuelles",
    description: "Cercles de Dhikr en temps réel et objectifs communautaires.",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    path: "/tools/halaqat",
    level: "simple",
  },
  // Advanced Tools
  {
    id: "personal-wird",
    title: "Générateur de Wird",
    description:
      "Istikhraj al-Asma: Calculez votre Zikr personnel selon votre poids mystique.",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    path: "/tools/personal-wird",
    level: "advanced",
  },
  {
    id: "lunar-mansions",
    title: "Demeures de la Lune",
    description:
      "Manazil al-Qamar: Suivez les 28 demeures astrologiques pour vos opérations.",
    icon: Compass,
    color: "from-indigo-500 to-blue-600",
    path: "/tools/lunar-mansions",
    level: "advanced",
  },
  {
    id: "spiritual-compatibility",
    title: "Compatibilité Spirituelle",
    description:
      "Hisab al-Tawafuq: Règle d'Al-Buni pour le mariage et les partenariats.",
    icon: Scale,
    color: "from-rose-500 to-pink-600",
    path: "/tools/spiritual-compatibility",
    level: "advanced",
  },
  {
    id: "ilm-jafar",
    title: "Oracle de Jafar",
    description:
      "Ilm al-Jafar: Divination suprême par la fracturation des lettres (Taksir).",
    icon: Key,
    color: "from-purple-500 to-indigo-600",
    path: "/tools/ilm-jafar",
    level: "advanced",
  },
  {
    id: "grand-oaths",
    title: "Grands Serments",
    description: "Da'awat & Azayim: Bibliothèque des invocations majeures.",
    icon: Shield,
    color: "from-amber-500 to-orange-600",
    path: "/tools/grand-oaths",
    level: "advanced",
  },
  {
    id: "elemental",
    title: "Analyseur Élémentaire",
    description:
      "Tabai' al-Huruf: Découvrez la nature dominante de votre nom (Feu, Terre, Air, Eau).",
    icon: Star,
    color: "from-red-500 to-orange-600",
    path: "/tools/elemental",
    level: "advanced",
  },
  {
    id: "geomancy",
    title: "Géomancie Arabe",
    description:
      "Khatt ar-Raml: Générez et interprétez les figures géomantiques pour consulter.",
    icon: Layers,
    color: "from-amber-600 to-yellow-800",
    path: "/tools/geomancy",
    level: "advanced",
  },
  {
    id: "letters",
    title: "Science des Lettres",
    description:
      "Sirr al-Huruf: Découvrez les mystères associés à chaque lettre arabe.",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    path: "/tools/letters",
    level: "advanced",
  },
  {
    id: "rouhaniyya",
    title: "Extracteur Rouhaniyya",
    description:
      "Extraction des esprits célestes ou terrestres basés sur les Noms et le Poids.",
    icon: Layers,
    color: "from-fuchsia-600 to-purple-800",
    path: "/tools/rouhaniyya",
    level: "advanced",
  },
  {
    id: "taksir",
    title: "Taksir (Brisures)",
    description: "Générez des matrices de Taksir et des cassures de lettres.",
    icon: Shuffle,
    color: "from-orange-500 to-rose-600",
    path: "/tools/taksir",
    level: "advanced",
  },
  {
    id: "sirr",
    title: "Sirr Al-Asrar",
    description: "Analyse ésotérique absolue : éléments, auras, et khuddam.",
    icon: Eye,
    color: "from-violet-700 to-purple-900",
    path: "/tools/sirr",
    level: "advanced",
  },
  {
    id: "zairja",
    title: "Oracle Zairja",
    description:
      "La machine ancestrale des soufis pour prédire et éclaircir les questions mystiques.",
    icon: Hexagon,
    color: "from-zinc-700 to-black",
    path: "/tools/zairja",
    level: "advanced",
  },
  {
    id: "khatim",
    title: "Générateur de Khatim",
    description:
      "Créez des carrés magiques (Wafq) 3x3 basés sur des valeurs numériques.",
    icon: Star,
    color: "from-purple-500 to-pink-600",
    path: "/tools/khatim",
    comingSoon: false,
    level: "advanced",
  },
  {
    id: "talsam",
    title: "Générateur de Talsam",
    description:
      "Créez des mots de pouvoir et talsams chiffrés pour encapsuler vos invocations.",
    icon: Key,
    color: "from-slate-600 to-gray-900",
    path: "/tools/talsam",
    level: "advanced",
  },
  {
    id: "istikhara",
    title: "Istikhara Numérique",
    description:
      "Tirage du sort spirituel basé sur le Saint Coran et la science d'Abjad.",
    icon: Compass,
    color: "from-teal-500 to-emerald-600",
    path: "/tools/istikhara",
    level: "advanced",
  },
  {
    id: "khouddam",
    title: "Extracteur de Khouddam",
    description:
      "Calculez et invoquez les entités spirituelles angéliques et terrestres (A'il et Yush) liées à un nom.",
    icon: Sparkles,
    color: "from-amber-600 to-red-800",
    path: "/tools/khouddam",
    level: "advanced",
  },
  {
    id: "awfaq",
    title: "Générateur de Awfaq",
    description:
      "Créez des carrés magiques complexes (Muthallath, Murabba) avec alignement planétaire et intentions.",
    icon: Hexagon,
    color: "from-fuchsia-600 to-pink-800",
    path: "/tools/awfaq",
    level: "advanced",
  },
  {
    id: "quranic-faal",
    title: "Istikhara Coranique (Faal)",
    description:
      "Méthode mystique de consultation du Coran pour la divination et la guidance (Tirage de sort).",
    icon: BookOpen,
    color: "from-blue-700 to-indigo-900",
    path: "/tools/quranic-faal",
    level: "advanced",
  },
  {
    id: "ia-rapprochements",
    title: "IA Rapprochements Ésotériques",
    description: "Croisez vos rêves, le poids de votre nom, et le climat céleste actuel pour des zikrs personnalisés.",
    icon: Sparkles,
    color: "from-purple-600 via-indigo-600 to-pink-600",
    path: "/tools/ia-rapprochements",
    level: "advanced",
  },
];
