import React, { useState, useMemo, useEffect } from 'react';
import { 
  Code, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  FileText, 
  CreditCard, 
  Layers, 
  Sparkles, 
  ArrowLeft,
  RefreshCw,
  Download,
  Key,
  Server,
  Zap,
  Globe,
  Box,
  CheckCircle2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  Gauge,
  Moon,
  Sun,
  Smartphone,
  Laptop
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ASRARHUB_API_DOCS, ApiEndpointDoc } from '../data/apiDocsData';
import { useLanguage } from '../contexts/LanguageContext';

export interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  rateLimit: number;
  createdAt: number;
  status: 'active' | 'revoked';
}

const DOCS_I18N = {
  fr: {
    backToApp: "Retour à l'application",
    openApiSpec: "Spécification OpenAPI (JSON)",
    heroBadge: "AsrarHub Public API v1 • Intégration sur Sites Tiers",
    heroTitle: "Documentation API Développeur AsrarHub",
    heroDesc: "Diffusez les secrets spirituels authentiques, les calculs de l'Abjad, le wird quotidien et les vertus des Noms Divins directement sur votre propre site web, application mobile ou blog WordPress.",
    darkModeTitle: "Mode Sombre Dédié",
    lightModeTitle: "Mode Lumineux",
    corsTitle: "CORS Ouvert",
    corsDesc: "Tout domaine autorisé",
    entryTitle: "Point d'entrée v1",
    formatTitle: "Format d'échange",
    widgetTitle: "Widgets sans code",
    widgetDesc: "iFrame disponible",
    
    // API Key Manager
    keyManagerTitle: "Gestionnaire de Clés API Développeur",
    keyManagerSubtitle: "Créez vos clés d'authentification personnalisées avec limitation de débit (Rate Limiting) pour protéger vos quotas et alimenter vos applications.",
    generateNewKey: "Créer une nouvelle clé API",
    keyNameLabel: "Nom de l'application / Projet",
    keyNamePlaceholder: "Ex: Mon Blog WordPress, App Flutter, Site Perso...",
    rateLimitLabel: "Quota de requêtes (Rate Limiting)",
    rateLimitDesc: "Nombre maximal de requêtes autorisées par minute pour protéger vos serveurs et éviter les abus.",
    rateLimitOption60: "60 req / min (Standard)",
    rateLimitOption120: "120 req / min (Développeur Pro)",
    rateLimitOption300: "300 req / min (Haute Performance)",
    generateBtn: "Générer la clé",
    generating: "Génération en cours...",
    yourKeysList: "Vos clés API configurées",
    noKeysYet: "Aucune clé personnalisée créée. La clé démo publique est utilisée par défaut.",
    activeBadge: "Actif",
    revokedBadge: "Révoqué",
    activeForSnippets: "Clé active (injectée dans le code)",
    setActive: "Utiliser dans les exemples",
    revokeKey: "Révoquer la clé",
    revokeConfirm: "Êtes-vous sûr de vouloir révoquer cette clé API ? Toutes les requêtes l'utilisant renverront une erreur 403.",
    keyCreatedSuccess: "Votre clé API a été générée avec succès ! Copiez-la et conservez-la en lieu sûr.",
    demoNotice: "💡 La clé sélectionnée ci-dessous est automatiquement injectée dans tous les exemples de code de la documentation.",

    guideTitle: "Comment intégrer l'API AsrarHub sur votre propre site web ?",
    guideDesc: "Grâce à la prise en charge complète du protocole CORS (Cross-Origin Resource Sharing), vous pouvez consommer cette API depuis n'importe quel nom de domaine tiers (WordPress, Wix, Shopify, blog personnel, application mobile Flutter/React Native).",
    option1Badge: "Option 1 • JavaScript (HTML / Frontend)",
    option1Title: "Appel direct dans votre page web",
    option1Desc: "Insérez un simple script JS pour afficher automatiquement les derniers secrets sur votre page d'accueil.",
    option2Badge: "Option 2 • PHP (WordPress / Backend)",
    option2Title: "Plugin ou Shortcode WordPress",
    option2Desc: "Récupérez les secrets côté serveur dans un thème WordPress ou une extension PHP personnalisée.",
    option3Badge: "Option 3 • Widget iFrame (Zéro Code)",
    option3Title: "Copier-coller sur Blogger / Wix",
    option3Desc: "Affichez directement le badge interactif du Wird du Jour sans écrire une seule ligne de programmation.",
    widgetPreviewNotice: "Aperçu réel du widget externe : Voici exactement comment il s'affiche lorsqu'un webmaster l'insère sur son site.",
    testWidgetTab: "Tester le widget dans un nouvel onglet",
    searchPlaceholder: "Rechercher une route (/api/v1/secrets, /api/v1/tools/abjad...)",
    routesCount: (count: number) => `${count} route${count > 1 ? 's' : ''}`,
    allRoutes: "Toutes les routes",
    catPublicApi: "API Externe (Secrets & Catégories)",
    catTools: "Outils Spirituels Embarquables",
    catAi: "Intelligence Spirituelle & IA",
    catQuran: "Coran & Audio",
    catPdf: "Bibliothèque PDF",
    catPayment: "Paiements & VIP",
    catSystem: "Système & Statut",
    runTest: "Tester cette route (Live)",
    testing: "Exécution du test...",
    copyRoute: "Copier la route",
    copied: "Copié !",
    copyCode: "Copier le code",
    copyResponse: "Copier la réponse",
    requestParams: "Paramètres de la requête :",
    paramName: "Nom",
    paramType: "Type",
    paramRequired: "Obligatoire",
    paramDesc: "Description",
    requiredYes: "Oui",
    requiredNo: "Optionnel",
    jsonResponse: "Réponse JSON (200 OK)",
    authPublic: "Public (Open API)",
    authUser: "Jeton Utilisateur (Firebase)",
    authAdmin: "Secret Admin Requis",
  },
  en: {
    backToApp: "Back to app",
    openApiSpec: "OpenAPI Spec (JSON)",
    heroBadge: "AsrarHub Public API v1 • Third-Party Integration",
    heroTitle: "AsrarHub Developer API Documentation",
    heroDesc: "Broadcast authentic spiritual secrets, Abjad calculations, daily wird, and virtues of the Divine Names directly on your own website, mobile app, or WordPress blog.",
    darkModeTitle: "Dedicated Dark Mode",
    lightModeTitle: "Light Mode",
    corsTitle: "Open CORS",
    corsDesc: "All domains allowed",
    entryTitle: "v1 Base Endpoint",
    formatTitle: "Payload Format",
    widgetTitle: "No-Code Widgets",
    widgetDesc: "iFrame available",
    
    // API Key Manager
    keyManagerTitle: "Developer API Keys Manager",
    keyManagerSubtitle: "Generate and manage your custom authentication keys with configurable rate limits to protect your quotas and power your applications.",
    generateNewKey: "Generate new API key",
    keyNameLabel: "Application / Project Name",
    keyNamePlaceholder: "e.g. My WordPress Blog, Flutter App, Personal Site...",
    rateLimitLabel: "Rate Limiting Quota",
    rateLimitDesc: "Maximum number of allowed requests per minute to prevent abuse and protect your infrastructure.",
    rateLimitOption60: "60 req / min (Standard)",
    rateLimitOption120: "120 req / min (Pro Developer)",
    rateLimitOption300: "300 req / min (High Performance)",
    generateBtn: "Generate Key",
    generating: "Generating...",
    yourKeysList: "Your configured API keys",
    noKeysYet: "No custom keys generated yet. The public demo key is used by default.",
    activeBadge: "Active",
    revokedBadge: "Revoked",
    activeForSnippets: "Active key (injected into code)",
    setActive: "Use in code snippets",
    revokeKey: "Revoke key",
    revokeConfirm: "Are you sure you want to revoke this API key? Any client using it will immediately receive 403 Forbidden.",
    keyCreatedSuccess: "Your API key was generated successfully! Copy and store it securely.",
    demoNotice: "💡 The selected key below is automatically injected into all documentation code examples.",

    guideTitle: "How to integrate AsrarHub API into your website?",
    guideDesc: "With full CORS (Cross-Origin Resource Sharing) support, you can consume this API from any third-party domain (WordPress, Wix, Shopify, personal blog, Flutter/React Native mobile app).",
    option1Badge: "Option 1 • JavaScript (HTML / Frontend)",
    option1Title: "Direct call in your web page",
    option1Desc: "Insert a simple JS script to automatically display the latest secrets on your home page.",
    option2Badge: "Option 2 • PHP (WordPress / Backend)",
    option2Title: "WordPress Plugin or Shortcode",
    option2Desc: "Fetch secrets server-side within a WordPress theme or custom PHP extension.",
    option3Badge: "Option 3 • iFrame Widget (No-Code)",
    option3Title: "Copy-paste on Blogger / Wix",
    option3Desc: "Directly embed the interactive Daily Wird badge without writing a single line of code.",
    widgetPreviewNotice: "Live external widget preview: Here is exactly how it looks when a webmaster embeds it.",
    testWidgetTab: "Test widget in new tab",
    searchPlaceholder: "Search an endpoint (/api/v1/secrets, /api/v1/tools/abjad...)",
    routesCount: (count: number) => `${count} endpoint${count > 1 ? 's' : ''}`,
    allRoutes: "All endpoints",
    catPublicApi: "Public API (Secrets & Categories)",
    catTools: "Embeddable Spiritual Tools",
    catAi: "Spiritual Intelligence & AI",
    catQuran: "Quran & Audio",
    catPdf: "PDF Library",
    catPayment: "Payments & VIP",
    catSystem: "System & Health",
    runTest: "Test endpoint (Live)",
    testing: "Running test...",
    copyRoute: "Copy route",
    copied: "Copied!",
    copyCode: "Copy code",
    copyResponse: "Copy response",
    requestParams: "Request Parameters:",
    paramName: "Name",
    paramType: "Type",
    paramRequired: "Required",
    paramDesc: "Description",
    requiredYes: "Yes",
    requiredNo: "Optional",
    jsonResponse: "JSON Response (200 OK)",
    authPublic: "Public (Open API)",
    authUser: "User Token (Firebase)",
    authAdmin: "Admin Secret Required",
  },
  ha: {
    backToApp: "Koma zuwa manhaja",
    openApiSpec: "Bayanin OpenAPI (JSON)",
    heroBadge: "AsrarHub Public API v1 • Haɗawa a Wasu Shafuka",
    heroTitle: "Bayanin API na Masu Ƙirƙira na AsrarHub",
    heroDesc: "Rarraba ingantattun asirai, lissafin Abjad, wirdin kowace rana da falalar Sunayen Allah kai tsaye a shafinku na yanar gizo, manhajar waya ko WordPress.",
    darkModeTitle: "Yanayin Duhu na Musamman",
    lightModeTitle: "Yanayin Haske",
    corsTitle: "Buɗaɗɗen CORS",
    corsDesc: "Duk shafuka an ba da izini",
    entryTitle: "Tushen v1",
    formatTitle: "Tsarin Bayanai",
    widgetTitle: "Widget ba tare da lamba ba",
    widgetDesc: "Akwai iFrame",
    
    // API Key Manager
    keyManagerTitle: "Manajan Makullin API na Masu Kera",
    keyManagerSubtitle: "Ƙirƙiri kuma sarrafa makullan shiga tare da saita iyakar tambayoyi (Rate Limiting) don kariya.",
    generateNewKey: "Ƙirƙiri sabon makullin API",
    keyNameLabel: "Sunan Manhaja / Aiki",
    keyNamePlaceholder: "Misali: Shafina na WordPress, App na waya...",
    rateLimitLabel: "Iyakar Tambayoyi (Rate Limiting)",
    rateLimitDesc: "Matsakaicin adadin tambayoyi a kowane minti don hana cunkoso da kariya.",
    rateLimitOption60: "60 tambaya / minti (Daidai)",
    rateLimitOption120: "120 tambaya / minti (Kwararre)",
    rateLimitOption300: "300 tambaya / minti (Mai Sauri)",
    generateBtn: "Ƙirƙiri Makulli",
    generating: "Ana ƙirƙirawa...",
    yourKeysList: "Makullan API ɗinku da aka saita",
    noKeysYet: "Ba a ƙirƙiri wani makulli na musamman ba. Ana amfani da makullin gwaji na yanzu.",
    activeBadge: "Yana Aiki",
    revokedBadge: "An Soke",
    activeForSnippets: "Makulli mai aiki (a cikin lambobi)",
    setActive: "Yi amfani a misalai",
    revokeKey: "Soke makulli",
    revokeConfirm: "Shin kuna da tabbacin kuna son soke wannan makullin API? Duk tambayoyin da ke amfani da shi za a hana su (403).",
    keyCreatedSuccess: "An ƙirƙiri makullin API ɗinku cikin nasara! Kwafa kuma ku ajiye shi a amintaccen wuri.",
    demoNotice: "💡 Makullin da aka zaɓa a ƙasa yana shiga kai tsaye a cikin dukkan lambobin misali na wannan shafi.",

    guideTitle: "Yadda zaku saka API na AsrarHub a shafinku na yanar gizo?",
    guideDesc: "Tare da cikakken goyon bayan CORS, zaku iya amfani da wannan API daga kowace irin manhaja ko shafin yanar gizo (WordPress, Wix, Shopify, da manhajojin waya).",
    option1Badge: "Zaɓi 1 • JavaScript (HTML / Frontend)",
    option1Title: "Kira kai tsaye a shafinku",
    option1Desc: "Saka sauƙaƙan rubutun JS don nuna sabbin asirai a shafinku kai tsaye.",
    option2Badge: "Zaɓi 2 • PHP (WordPress / Backend)",
    option2Title: "Plugin ko Shortcode na WordPress",
    option2Desc: "Karɓi asirai ta bangaren uwar garke a WordPress ko tsarin PHP na kanku.",
    option3Badge: "Zaɓi 3 • Widget na iFrame (Babu Lamba)",
    option3Title: "Kwafa da manna a Blogger / Wix",
    option3Desc: "Nuna katin Wirdin Rana kai tsaye ba tare da rubuta lambar kwamfuta ba.",
    widgetPreviewNotice: "Misalin widget: Ga yadda yake bayyana idan aka saka shi a wani shafi na waje.",
    testWidgetTab: "Gwada widget a sabon shafi",
    searchPlaceholder: "Nemi hanyar API (/api/v1/secrets, /api/v1/tools/abjad...)",
    routesCount: (count: number) => `Hanyoyi ${count}`,
    allRoutes: "Duk hanyoyin",
    catPublicApi: "API na Waje (Asirai & Rukuni)",
    catTools: "Kayan Aiki na Ruhi",
    catAi: "Basirar Ruhi & AI",
    catQuran: "Alƙur'ani & Sautuka",
    catPdf: "Dakin Karatun PDF",
    catPayment: "Biya & VIP",
    catSystem: "Tsari & Lafiya",
    runTest: "Gwada wannan hanyar (Live)",
    testing: "Ana gwadawa...",
    copyRoute: "Kwafi hanya",
    copied: "An kwafa!",
    copyCode: "Kwafi lamba",
    copyResponse: "Kwafi amsa",
    requestParams: "Abubuwan Bukata na Tambaya:",
    paramName: "Suna",
    paramType: "Nau'i",
    paramRequired: "Dole",
    paramDesc: "Bayani",
    requiredYes: "Eh",
    requiredNo: "Na Zaɓi",
    jsonResponse: "Amsar JSON (200 OK)",
    authPublic: "Buɗaɗɗe (Open API)",
    authUser: "Alamar Mai Amfani (Firebase)",
    authAdmin: "Ana Bukatar Asirin Admin",
  }
};

const ENDPOINT_LOCALIZATION: Record<string, { en: { title: string; desc: string }; ha: { title: string; desc: string } }> = {
  public_secrets_list: {
    en: { title: "Retrieve Spiritual Secrets & Recipes", desc: "Allows any third-party website (WordPress, mobile app, blog) to fetch published spiritual secrets in real-time with pagination, search, and category filters." },
    ha: { title: "Dauko Asirai da Hanyoyin Ruhi", desc: "Yana ba kowane shafi ko manhaja damar dauko asirai kai tsaye tare da bincike da rabe-raben rukuni." }
  },
  public_secret_detail: {
    en: { title: "Complete Secret Details (Structured H3 Subtitles)", desc: "Returns full secret content with its 5 structured sub-sections (OBJECTIVE, EXAMPLE, ANNIYYA, EFFECT, RUQYAH METHODS) for rendering on your site or blog." },
    ha: { title: "Cikakken Bayanin Asiri (Kashi 5 na H3)", desc: "Yana dawo da dukkan bayanin asiri tare da rabe-raben sa 5 (MANUFA, MISALI, NIYYA, TASIRI, HANYOYIN RUQYA)." }
  },
  public_categories_list: {
    en: { title: "Retrieve Spiritual Categories", desc: "Allows displaying AsrarHub's spiritual thematic navigation (Protection, Wealth, Healing, Love, Letter Sciences) on your own menu." },
    ha: { title: "Dauko Rukunonin Ruhi", desc: "Yana ba da damar nuna rukunonin AsrarHub (Kariya, Bude Kofa, Waraka, Soyayya) a shafinku." }
  },
  public_tools_abjad: {
    en: { title: "Grand Abjad Calculator (Ilm al-Huruf)", desc: "Calculates the sacred numerical value of any Arabic word or verse according to the Grand Abjad, with letter breakdown and dominant cosmic element (Fire, Earth, Air, Water)." },
    ha: { title: "Injin Lissafin Abjad (Ilmul Huruf)", desc: "Yana lissafta adadin lambobin kowane kalma ko ayar Larabci bisa ga babban Abjad da bayanin bangarori (Wuta, Kasa, Iska, Ruwa)." }
  },
  public_tools_asma_ul_husna: {
    en: { title: "99 Divine Names API (Asma-ul-Husna)", desc: "Provides the 99 Names of Allah with Arabic calligraphy, transliteration, English translation, Abjad value, and associated spiritual virtues." },
    ha: { title: "API na Kyawawan Sunayen Allah 99", desc: "Yana ba da Sunayen Allah 99 tare da rubutun Larabci, ma'ana, adadin Abjad da falalarsu ta ruhi." }
  },
  public_tools_daily_wird: {
    en: { title: "Daily Wird & Recommended Litany", desc: "Returns the recommended daily litany depending on the day of the week (Salawat on Monday, Istighfar on Tuesday, Names on Friday) with repetition count." },
    ha: { title: "Wirdin Kowace Rana da Aka Shawarta", desc: "Yana dawo da addu'ar da aka fi so a ranar mako (Salati ranar Litinin, Istigfari Talata, Sunayen Juma'a) da adadin karantawa." }
  },
  public_tools_widget_embed: {
    en: { title: "Turnkey HTML Widget (iFrame Embed)", desc: "Lightweight standalone HTML page designed to be embedded directly into any website via a simple <iframe> tag with zero coding." },
    ha: { title: "Widget na HTML (Saka iFrame kai tsaye)", desc: "Shafin HTML mai sauki da za a iya sakawa a kowane shafi ta hanyar lambar <iframe> ba tare da rubuta lamba ba." }
  },
  health_check: {
    en: { title: "Server Health Check", desc: "Monitors Node/Express server availability, response latency, and operational health." },
    ha: { title: "Duba Lafiyar Uwar Garke", desc: "Yana duba aiki da saurin uwar garke." }
  },
  quran_tafsir: {
    en: { title: "Spiritual Quranic Exegesis (AI Tafsir)", desc: "Deep theological and spiritual analysis of a specific Quranic verse, revealing inner wisdoms and applications." },
    ha: { title: "Fassarar Alkur'ani ta Ruhi (Tafsirin AI)", desc: "Bincike mai zurfi na ayar Alkur'ani da bayanin hikimominta." }
  },
  dreams_interpret: {
    en: { title: "Islamic Dream Interpretation (Ru'ya)", desc: "Decodes dreams according to prominent Islamic scholars (Ibn Sirin, Al-Nabulsi) and spiritual archetypes." },
    ha: { title: "Fassarar Mafarki a Musulunci (Ru'ya)", desc: "Fassara mafarkai bisa koyarwar malamai (Ibn Sirin) da alamomin ruhi." }
  },
  asrar_conseil: {
    en: { title: "Personalized Spiritual Counseling & Guidance", desc: "Generates tailored spiritual recommendations and invocations suited to difficulties or projects." },
    ha: { title: "Shawarar Ruhi ta Musamman", desc: "Yana ba da shawarwari da addu'o'in da suka dace da bukatun mutum." }
  },
  zairja_oracle: {
    en: { title: "Zairja Metaphysical Consultation (Letter Science)", desc: "Metaphysical oracle founded on the millennial science of the 28 Arabic letters and geomantic alchemy." },
    ha: { title: "Neman Hikimar Zairja (Ilmin Haruffa)", desc: "Hanyar binciken hikima bisa ga haruffan Larabci 28 da ilmin Abjad." }
  },
  pdf_custom_list: {
    en: { title: "List of Published PDF Manuscripts & Books", desc: "Retrieves the full catalog of sacred digital books and esoteric manuscripts stored on the server." },
    ha: { title: "Jerin Littattafan PDF da Rubuce-rubuce", desc: "Yana kawo cikakken jerin littattafan da aka wallafa a uwar garke." }
  },
  verify_paystack: {
    en: { title: "Secure Paystack Transaction Verification", desc: "Validates payment authenticity via the official Paystack API to unlock VIP status or PDF book purchases." },
    ha: { title: "Tabbatar da Biyan Kudi na Paystack", desc: "Yana tabbatar da ingancin biyan kudi ta Paystack don kunna matsayin VIP ko littafin PDF." }
  }
};

const DEMO_KEY_FALLBACK = "ah_live_demo_asrarhub_2026";

export const ApiDocsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const langKey = (language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr') as 'fr' | 'en' | 'ha';
  const txt = DOCS_I18N[langKey];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, 'curl' | 'js' | 'php' | 'python'>>({});
  
  // Dedicated Dark Reading Mode state
  const [isDocsDarkMode, setIsDocsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('asrar_api_docs_reading_dark');
      return saved !== null ? saved === 'true' : false;
    } catch (_) {
      return false;
    }
  });

  const toggleDocsDarkMode = () => {
    setIsDocsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('asrar_api_docs_reading_dark', String(next));
      } catch (_) {}
      return next;
    });
  };
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() => {
    try {
      const saved = localStorage.getItem('asrarhub_user_api_keys');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: "key_demo_default",
        key: DEMO_KEY_FALLBACK,
        name: "Clé Démo Publique",
        rateLimit: 60,
        createdAt: Date.now() - 86400000 * 7,
        status: "active"
      }
    ];
  });
  
  const [activeApiKeyString, setActiveApiKeyString] = useState<string>(() => {
    try {
      const savedKey = localStorage.getItem('asrarhub_active_api_key');
      if (savedKey) return savedKey;
    } catch (_) {}
    return DEMO_KEY_FALLBACK;
  });

  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState<number>(60);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [isKeyManagerExpanded, setIsKeyManagerExpanded] = useState<boolean>(true);
  const [justCreatedKey, setJustCreatedKey] = useState<ApiKeyItem | null>(null);

  // Live test states
  const [testingEndpointId, setTestingEndpointId] = useState<string | null>(null);
  const [liveTestResults, setLiveTestResults] = useState<Record<string, { status: number; duration: number; data: any }>>({});

  // Sync keys with server on mount
  useEffect(() => {
    fetch('/api/v1/keys')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setApiKeys(prev => {
            const map = new Map<string, ApiKeyItem>();
            prev.forEach(k => map.set(k.id, k));
            res.data.forEach((k: ApiKeyItem) => map.set(k.id, k));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('asrarhub_user_api_keys', JSON.stringify(merged));
            } catch (_) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  const categories = [
    { id: 'all', label: txt.allRoutes, icon: Layers },
    { id: 'public_api', label: txt.catPublicApi, icon: Globe },
    { id: 'tools', label: txt.catTools, icon: Zap },
    { id: 'ai', label: txt.catAi, icon: Cpu },
    { id: 'quran', label: txt.catQuran, icon: BookOpen },
    { id: 'pdf', label: txt.catPdf, icon: FileText },
    { id: 'payment', label: txt.catPayment, icon: CreditCard },
    { id: 'system', label: txt.catSystem, icon: Server }
  ];

  const filteredEndpoints = useMemo(() => {
    return ASRARHUB_API_DOCS.filter((ep) => {
      if (selectedCategory !== 'all' && ep.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const loc = ENDPOINT_LOCALIZATION[ep.id]?.[langKey === 'fr' ? 'en' : langKey];
        const titleMatch = (loc?.title || ep.title).toLowerCase().includes(q);
        const descMatch = (loc?.desc || ep.description).toLowerCase().includes(q);
        return (
          ep.path.toLowerCase().includes(q) ||
          titleMatch ||
          descMatch ||
          ep.method.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery, langKey]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingKey(true);
    try {
      const res = await fetch('/api/v1/keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim() || 'Mon Application',
          rateLimit: newKeyRateLimit
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const newKey: ApiKeyItem = data.data;
        setApiKeys(prev => {
          const updated = [newKey, ...prev];
          try {
            localStorage.setItem('asrarhub_user_api_keys', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
        setActiveApiKeyString(newKey.key);
        try {
          localStorage.setItem('asrarhub_active_api_key', newKey.key);
        } catch (_) {}
        setJustCreatedKey(newKey);
        setNewKeyName('');
      }
    } catch (err) {
      console.error("Key generation error:", err);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!window.confirm(txt.revokeConfirm)) return;
    setRevokingKeyId(id);
    try {
      await fetch(`/api/v1/keys/${id}/revoke`, { method: 'POST' });
      setApiKeys(prev => {
        const updated = prev.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k);
        try {
          localStorage.setItem('asrarhub_user_api_keys', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      if (activeApiKeyString === apiKeys.find(k => k.id === id)?.key) {
        const activeFallback = apiKeys.find(k => k.status === 'active' && k.id !== id)?.key || DEMO_KEY_FALLBACK;
        setActiveApiKeyString(activeFallback);
        try {
          localStorage.setItem('asrarhub_active_api_key', activeFallback);
        } catch (_) {}
      }
    } catch (err) {
      console.error("Revoke error:", err);
    } finally {
      setRevokingKeyId(null);
    }
  };

  const selectActiveKey = (keyString: string) => {
    setActiveApiKeyString(keyString);
    try {
      localStorage.setItem('asrarhub_active_api_key', keyString);
    } catch (_) {}
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCodeSnippet = (ep: ApiEndpointDoc, lang: 'curl' | 'js' | 'php' | 'python') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://asrarhub.com';
    const fullUrl = `${origin}${ep.path}`;
    const apiKey = activeApiKeyString || DEMO_KEY_FALLBACK;

    if (lang === 'curl') {
      if (ep.method === 'GET') {
        return `curl -X GET "${fullUrl}" \\\n  -H "Accept: application/json" \\\n  -H "x-api-key: ${apiKey}"`;
      }
      return `curl -X POST "${fullUrl}" \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ${apiKey}" \\\n  -d '${JSON.stringify(ep.sampleRequest || {}, null, 2)}'`;
    }

    if (lang === 'js') {
      if (ep.method === 'GET') {
        return `fetch("${fullUrl}", {\n  headers: {\n    "x-api-key": "${apiKey}"\n  }\n})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
      }
      return `fetch("${fullUrl}", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "x-api-key": "${apiKey}"\n  },\n  body: JSON.stringify(${JSON.stringify(ep.sampleRequest || {}, null, 2)})\n})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
    }

    if (lang === 'php') {
      if (ep.method === 'GET') {
        return `<?php\n$url = "${fullUrl}";\n$opts = [\n  "http" => [\n    "header" => "x-api-key: ${apiKey}\\r\\n"\n  ]\n];\n$context = stream_context_create($opts);\n$response = file_get_contents($url, false, $context);\n$data = json_decode($response, true);\nprint_r($data);\n?>`;
      }
      return `<?php\n$url = "${fullUrl}";\n$payload = json_encode(${JSON.stringify(ep.sampleRequest || {})});\n$ch = curl_init($url);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $payload);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n  'Content-Type: application/json',\n  'x-api-key: ${apiKey}'\n]);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$result = curl_exec($ch);\ncurl_close($ch);\necho $result;\n?>`;
    }

    if (lang === 'python') {
      if (ep.method === 'GET') {
        return `import requests\n\nheaders = {"x-api-key": "${apiKey}"}\nresponse = requests.get("${fullUrl}", headers=headers)\nprint(response.json())`;
      }
      return `import requests\n\nheaders = {"x-api-key": "${apiKey}"}\npayload = ${JSON.stringify(ep.sampleRequest || {}, null, 2).replace(/"/g, "'")}\nresponse = requests.post("${fullUrl}", headers=headers, json=payload)\nprint(response.json())`;
    }

    return '';
  };

  const runLiveTest = async (ep: ApiEndpointDoc) => {
    setTestingEndpointId(ep.id);
    const start = performance.now();
    try {
      let res: Response;
      const headers: Record<string, string> = {
        'x-api-key': activeApiKeyString || DEMO_KEY_FALLBACK
      };

      if (ep.method === 'GET') {
        res = await fetch(ep.path, { headers });
      } else {
        headers['Content-Type'] = 'application/json';
        res = await fetch(ep.path, {
          method: 'POST',
          headers,
          body: JSON.stringify(ep.sampleRequest || {})
        });
      }
      const duration = Math.round(performance.now() - start);
      const json = await res.json();
      setLiveTestResults(prev => ({
        ...prev,
        [ep.id]: { status: res.status, duration, data: json }
      }));
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      setLiveTestResults(prev => ({
        ...prev,
        [ep.id]: { status: 500, duration, data: { error: err.message || 'Error executing request' } }
      }));
    } finally {
      setTestingEndpointId(null);
    }
  };

  // Preset guide snippets with active key
  const guideSnippets = {
    js: `fetch('https://asrarhub.com/api/v1/secrets?limit=5', {
  headers: { 'x-api-key': '${activeApiKeyString || DEMO_KEY_FALLBACK}' }
})
  .then(res => res.json())
  .then(data => console.log(data.data));`,

    php: `$opts = [
  "http" => [
    "header" => "x-api-key: ${activeApiKeyString || DEMO_KEY_FALLBACK}\\r\\n"
  ]
];
$context = stream_context_create($opts);
$secrets = json_decode(file_get_contents('https://asrarhub.com/api/v1/secrets', false, $context), true);`,

    iframe: `<iframe 
  src="https://asrarhub.com/api/v1/embed/daily-wird" 
  width="100%" height="220" frameborder="0">
</iframe>`
  };

  return (
    <div className={`w-full max-w-full min-w-0 overflow-x-hidden min-h-screen transition-colors duration-300 pb-24 pt-3 sm:pt-6 px-3 sm:px-6 lg:px-8 mx-auto box-border ${
      isDocsDarkMode
        ? 'bg-[#090d16] text-slate-100'
        : 'bg-gray-50/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100'
    }`}>
      
      {/* Top Navigation Bar - Adaptive Flexbox with Dedicated Dark Reading Mode Toggle */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 mb-4 w-full max-w-full min-w-0">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors p-2 rounded-xl shrink-0 cursor-pointer ${
            isDocsDarkMode 
              ? 'text-gray-300 hover:text-emerald-400 hover:bg-slate-800' 
              : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <ArrowLeft size={16} />
          <span>{txt.backToApp}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Dedicated Dark Reading Mode Toggle */}
          <button
            onClick={toggleDocsDarkMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isDocsDarkMode
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
            title={isDocsDarkMode ? txt.lightModeTitle : txt.darkModeTitle}
          >
            {isDocsDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-500" />}
            <span className="hidden xs:inline">{isDocsDarkMode ? txt.lightModeTitle : txt.darkModeTitle}</span>
            <span className="xs:hidden">{isDocsDarkMode ? 'Clair' : 'Sombre'}</span>
          </button>

          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer ${
              isDocsDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Download size={14} className="text-emerald-500" />
            <span className="hidden xs:inline">{txt.openApiSpec}</span>
            <span className="xs:hidden">OpenAPI</span>
          </a>
        </div>
      </div>

      {/* Hero Banner Header - Strictly bounded without overflow */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-5 sm:mb-6 shadow-xl border w-full max-w-full min-w-0 box-border ${
        isDocsDarkMode
          ? 'bg-gradient-to-br from-slate-950 via-[#0a1628] to-slate-950 border-emerald-500/40'
          : 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/30 text-white'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-full min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2.5 max-w-full truncate">
            <Globe size={13} className="shrink-0" />
            <span className="truncate">{txt.heroBadge}</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2 break-words">
            {txt.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 break-words">
            {txt.heroDesc}
          </p>

          {/* Quick Architecture Indicators - Adaptive Flexbox Columns */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1 text-xs w-full max-w-full min-w-0">
            <div className="flex-1 min-w-[130px] sm:min-w-[160px] p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-0 overflow-hidden">
              <span className="text-[10px] text-gray-400 block font-medium truncate">{txt.corsTitle}</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5 text-xs truncate">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">{txt.corsDesc}</span>
              </span>
            </div>
            <div className="flex-1 min-w-[130px] sm:min-w-[160px] p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-0 overflow-hidden">
              <span className="text-[10px] text-gray-400 block font-medium truncate">{txt.entryTitle}</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5 font-mono text-[11px] truncate">
                <Globe size={13} className="text-cyan-400 shrink-0" />
                <span className="truncate">/api/v1/*</span>
              </span>
            </div>
            <div className="flex-1 min-w-[130px] sm:min-w-[160px] p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-0 overflow-hidden">
              <span className="text-[10px] text-gray-400 block font-medium truncate">{txt.formatTitle}</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5 text-xs truncate">
                <Code size={13} className="text-amber-400 shrink-0" />
                <span className="truncate">JSON / UTF-8</span>
              </span>
            </div>
            <div className="flex-1 min-w-[130px] sm:min-w-[160px] p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-0 overflow-hidden">
              <span className="text-[10px] text-gray-400 block font-medium truncate">{txt.widgetTitle}</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5 text-xs truncate">
                <Box size={13} className="text-purple-400 shrink-0" />
                <span className="truncate">{txt.widgetDesc}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DEVELOPER API KEYS & RATE LIMITING MANAGER */}
      {/* ======================================================== */}
      <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-5 sm:mb-6 border shadow-sm space-y-4 w-full max-w-full min-w-0 box-border ${
        isDocsDarkMode
          ? 'bg-[#0f172a] border-amber-500/40 text-gray-100 shadow-md'
          : 'bg-white dark:bg-gray-800 border-amber-500/40 dark:border-amber-500/30'
      }`}>
        
        {/* Header with expand toggle */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
          isDocsDarkMode ? 'border-gray-800' : 'border-gray-100 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <Key size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>{txt.keyManagerTitle}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Rate Limiting Protégé
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                {txt.keyManagerSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsKeyManagerExpanded(!isKeyManagerExpanded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 self-start sm:self-auto cursor-pointer ${
              isDocsDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-gray-200'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isKeyManagerExpanded ? 'Réduire' : 'Afficher le gestionnaire'}
          </button>
        </div>

        {isKeyManagerExpanded && (
          <div className="space-y-4 pt-1">
            
            {/* Active Key Indicator */}
            <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
              isDocsDarkMode
                ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                : 'bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block truncate">
                    {txt.activeForSnippets} :
                  </span>
                  <code className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 break-all">
                    {activeApiKeyString}
                  </code>
                </div>
              </div>

              <button
                onClick={() => handleCopy(activeApiKeyString, 'active-key-badge')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer shrink-0 transition-all active:scale-95"
              >
                {copiedKey === 'active-key-badge' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedKey === 'active-key-badge' ? txt.copied : txt.copyCode}</span>
              </button>
            </div>

            {/* Just Created Key Banner */}
            {justCreatedKey && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>{txt.keyCreatedSuccess}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                  <span className="break-all">{justCreatedKey.key}</span>
                  <button
                    onClick={() => handleCopy(justCreatedKey.key, 'just-created-copy')}
                    className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedKey === 'just-created-copy' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === 'just-created-copy' ? txt.copied : txt.copyCode}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Key Generation Form - Adaptive Flexbox Columns */}
            <form onSubmit={handleGenerateKey} className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 ${
              isDocsDarkMode
                ? 'bg-[#0b1120] border-gray-800'
                : 'bg-gray-50 dark:bg-gray-850 border-gray-200 dark:border-gray-700'
            }`}>
              <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Plus size={15} className="text-emerald-500" />
                <span>{txt.generateNewKey}</span>
              </h3>

              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 w-full">
                {/* Project / App Name */}
                <div className="space-y-1 flex-1 min-w-0">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300 block">
                    {txt.keyNameLabel}
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={txt.keyNamePlaceholder}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium ${
                      isDocsDarkMode
                        ? 'bg-[#06090e] border border-gray-700 text-white'
                        : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                    }`}
                    required
                  />
                </div>

                {/* Rate Limiting Selector */}
                <div className="space-y-1 w-full md:w-60 shrink-0">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <Gauge size={12} className="text-emerald-500" />
                    <span>{txt.rateLimitLabel}</span>
                  </label>
                  <select
                    value={newKeyRateLimit}
                    onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium cursor-pointer ${
                      isDocsDarkMode
                        ? 'bg-[#06090e] border border-gray-700 text-white'
                        : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    <option value={60}>{txt.rateLimitOption60}</option>
                    <option value={120}>{txt.rateLimitOption120}</option>
                    <option value={300}>{txt.rateLimitOption300}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {txt.rateLimitDesc}
                </span>

                <button
                  type="submit"
                  disabled={isGeneratingKey}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                >
                  {isGeneratingKey ? <RefreshCw size={13} className="animate-spin" /> : <Key size={13} />}
                  <span>{isGeneratingKey ? txt.generating : txt.generateBtn}</span>
                </button>
              </div>
            </form>

            {/* List of Configured Keys */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
                {txt.yourKeysList} ({apiKeys.length}) :
              </span>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {apiKeys.map((item) => {
                  const isRevealed = Boolean(revealedKeys[item.id]);
                  const isActive = activeApiKeyString === item.key;
                  const isRevoked = item.status === 'revoked';
                  const displayKey = isRevealed ? item.key : `${item.key.slice(0, 10)}••••••••${item.key.slice(-4)}`;

                  return (
                    <div
                      key={`key-item-${item.id}`}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        isActive
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-600 shadow-2xs'
                          : isRevoked
                          ? 'bg-gray-100 dark:bg-gray-850/60 border-gray-200 dark:border-gray-700/60 opacity-60'
                          : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            isRevoked
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                          }`}>
                            {isRevoked ? txt.revokedBadge : txt.activeBadge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {item.rateLimit} req/min
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <code className="text-[11px] font-mono font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 break-all">
                            {displayKey}
                          </code>
                          <button
                            onClick={() => toggleRevealKey(item.id)}
                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                            title={isRevealed ? "Masquer la clé" : "Afficher la clé"}
                          >
                            {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => handleCopy(item.key, `copy-key-${item.id}`)}
                            className="p-1 rounded text-gray-400 hover:text-emerald-600 cursor-pointer"
                            title={txt.copyCode}
                          >
                            {copiedKey === `copy-key-${item.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {!isRevoked && (
                          <button
                            onClick={() => selectActiveKey(item.key)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {isActive ? '✓ Utilisée' : txt.setActive}
                          </button>
                        )}

                        {!isRevoked && item.id !== 'key_demo_default' && (
                          <button
                            onClick={() => handleRevokeKey(item.id)}
                            disabled={revokingKeyId === item.id}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title={txt.revokeKey}
                          >
                            {revokingKeyId === item.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guide Pratique : Intégrer l'API sur son propre site web */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-5 sm:mb-6 border border-emerald-500/30 shadow-sm space-y-4 w-full max-w-full min-w-0 overflow-hidden box-border">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
          <Zap size={18} className="text-emerald-500 shrink-0" />
          <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-900 dark:text-white break-words">
            {txt.guideTitle}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">
          {txt.guideDesc}
        </p>

        {/* 3 Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-1 w-full max-w-full min-w-0">
          
          {/* Method 1: JavaScript Fetch */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2 min-w-0 max-w-full overflow-hidden flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase max-w-full truncate">
                {txt.option1Badge}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1 break-words">
                {txt.option1Title}
              </h3>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 break-words">
                {txt.option1Desc}
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-gray-800 text-[10px] text-gray-400">
                <span>JavaScript (fetch)</span>
                <button
                  onClick={() => handleCopy(guideSnippets.js, 'guide-js')}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  title={txt.copyCode}
                >
                  {copiedKey === 'guide-js' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'guide-js' ? txt.copied : txt.copyCode}</span>
                </button>
              </div>
              <pre className="p-2.5 text-emerald-300 text-[10px] font-mono w-full max-w-full overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre">
                {guideSnippets.js}
              </pre>
            </div>
          </div>

          {/* Method 2: PHP / WordPress */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2 min-w-0 max-w-full overflow-hidden flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase max-w-full truncate">
                {txt.option2Badge}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1 break-words">
                {txt.option2Title}
              </h3>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 break-words">
                {txt.option2Desc}
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-gray-800 text-[10px] text-gray-400">
                <span>PHP (file_get_contents)</span>
                <button
                  onClick={() => handleCopy(guideSnippets.php, 'guide-php')}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                  title={txt.copyCode}
                >
                  {copiedKey === 'guide-php' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'guide-php' ? txt.copied : txt.copyCode}</span>
                </button>
              </div>
              <pre className="p-2.5 text-blue-300 text-[10px] font-mono w-full max-w-full overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre">
                {guideSnippets.php}
              </pre>
            </div>
          </div>

          {/* Method 3: Embed Widget iFrame */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2 min-w-0 max-w-full overflow-hidden flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-purple-600 text-white font-black text-[10px] uppercase max-w-full truncate">
                {txt.option3Badge}
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1 break-words">
                {txt.option3Title}
              </h3>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 break-words">
                {txt.option3Desc}
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-gray-800 text-[10px] text-gray-400">
                <span>HTML / iFrame</span>
                <button
                  onClick={() => handleCopy(guideSnippets.iframe, 'guide-iframe')}
                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                  title={txt.copyCode}
                >
                  {copiedKey === 'guide-iframe' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === 'guide-iframe' ? txt.copied : txt.copyCode}</span>
                </button>
              </div>
              <pre className="p-2.5 text-purple-300 text-[10px] font-mono w-full max-w-full overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre">
                {guideSnippets.iframe}
              </pre>
            </div>
          </div>
        </div>

        {/* Live Widget Preview Notice */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full max-w-full min-w-0">
          <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-normal break-words">
            💡 {txt.widgetPreviewNotice}
          </div>
          <a
            href="/api/v1/embed/daily-wird"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-colors shrink-0 cursor-pointer"
          >
            <span>{txt.testWidgetTab}</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3 mb-5 sm:mb-6 w-full max-w-full min-w-0">
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 sm:p-3.5 rounded-2xl border shadow-xs w-full max-w-full min-w-0 box-border ${
          isDocsDarkMode
            ? 'bg-[#0f172a] border-gray-800 text-white'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={txt.searchPlaceholder}
              className={`w-full pl-8 sm:pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 ${
                isDocsDarkMode
                  ? 'bg-[#06090e] border border-gray-700 text-white'
                  : 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
              }`}
            />
          </div>

          <span className="text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0 whitespace-nowrap self-end sm:self-auto">
            {txt.routesCount(filteredEndpoints.length)}
          </span>
        </div>

        {/* Categories Pills - Safe horizontal touch scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 w-full max-w-full min-w-0 hide-scrollbar">
          {categories.map((cat) => {
            const IconC = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={`cat-btn-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : isDocsDarkMode
                    ? 'bg-[#0f172a] text-gray-300 border-gray-800 hover:border-emerald-500/50'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
              >
                <IconC size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-5 sm:space-y-6 w-full max-w-full min-w-0">
        {filteredEndpoints.map((ep) => {
          const currentCodeTab = activeCodeTab[ep.id] || 'curl';
          const testResult = liveTestResults[ep.id];
          const isTesting = testingEndpointId === ep.id;

          const localized = ENDPOINT_LOCALIZATION[ep.id]?.[langKey === 'fr' ? 'en' : langKey];
          const displayTitle = (langKey !== 'fr' && localized?.title) ? localized.title : ep.title;
          const displayDesc = (langKey !== 'fr' && localized?.desc) ? localized.desc : ep.description;

          const methodColor = 
            ep.method === 'GET' ? 'bg-blue-600 text-white' :
            ep.method === 'POST' ? 'bg-emerald-600 text-white' :
            ep.method === 'DELETE' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white';

          const authBadge =
            ep.auth === 'admin' ? { label: txt.authAdmin, class: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300' } :
            ep.auth === 'user' ? { label: txt.authUser, class: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300' } :
            { label: txt.authPublic, class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300' };

          return (
            <div 
              key={`endpoint-${ep.id}`}
              className={`rounded-2xl sm:rounded-3xl border shadow-xs overflow-hidden w-full max-w-full min-w-0 box-border ${
                isDocsDarkMode
                  ? 'bg-[#0f172a] border-gray-800 text-gray-100'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/80'
              }`}
            >
              {/* Endpoint Header Bar - Adaptive Flexbox */}
              <div className={`p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full max-w-full min-w-0 ${
                isDocsDarkMode
                  ? 'bg-[#0b1120] border-gray-800'
                  : 'bg-gray-50/50 dark:bg-gray-850/50 border-gray-100 dark:border-gray-700/60'
              }`}>
                <div className="flex items-center gap-2 flex-wrap min-w-0 max-w-full">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black tracking-wider ${methodColor} shrink-0`}>
                    {ep.method}
                  </span>
                  <code className="text-[11px] sm:text-xs font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-900 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700 break-all max-w-full">
                    {ep.path}
                  </code>
                  <button
                    onClick={() => handleCopy(ep.path, `path-${ep.id}`)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer shrink-0"
                    title={txt.copyRoute}
                  >
                    {copiedKey === `path-${ep.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${authBadge.class} truncate max-w-full`}>
                    {authBadge.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ep.liveTestable && (
                    <button
                      onClick={() => runLiveTest(ep)}
                      disabled={isTesting}
                      className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                    >
                      {isTesting ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                      <span>{isTesting ? txt.testing : txt.runTest}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Endpoint Details */}
              <div className="p-3.5 sm:p-5 space-y-3.5 w-full max-w-full min-w-0">
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-gray-900 dark:text-white mb-1 break-words">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                    {displayDesc}
                  </p>
                </div>

                {/* Parameters table if any */}
                {(ep.bodyParams || ep.queryParams) && (
                  <div className="space-y-1.5 w-full max-w-full min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      {txt.requestParams}
                    </span>

                    {/* Mobile touch-friendly card list (flexbox) */}
                    <div className="block sm:hidden space-y-2">
                      {(ep.bodyParams || ep.queryParams || []).map((p, pIdx) => (
                        <div 
                          key={`param-mobile-${pIdx}`} 
                          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                            isDocsDarkMode ? 'bg-[#0b1120] border-gray-800' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400 break-all">{p.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-400 font-medium">({p.type})</span>
                              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                                p.required ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                              }`}>
                                {p.required ? txt.requiredYes : txt.requiredNo}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">{p.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table layout */}
                    <div className="hidden sm:block w-full max-w-full min-w-0 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-left text-xs min-w-[280px]">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold border-b border-gray-200 dark:border-gray-700 text-[11px]">
                          <tr>
                            <th className="p-2 sm:p-2.5">{txt.paramName}</th>
                            <th className="p-2 sm:p-2.5">{txt.paramType}</th>
                            <th className="p-2 sm:p-2.5">{txt.paramRequired}</th>
                            <th className="p-2 sm:p-2.5">{txt.paramDesc}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[11px]">
                          {(ep.bodyParams || ep.queryParams || []).map((p, pIdx) => (
                            <tr key={`param-${pIdx}`} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50">
                              <td className="p-2 sm:p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 break-all">{p.name}</td>
                              <td className="p-2 sm:p-2.5 text-gray-500">{p.type}</td>
                              <td className="p-2 sm:p-2.5">
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${p.required ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                  {p.required ? txt.requiredYes : txt.requiredNo}
                                </span>
                              </td>
                              <td className="p-2 sm:p-2.5 text-gray-600 dark:text-gray-300 break-words">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Code Examples & Sample Response - Adaptive Flexbox Columns */}
                <div className="flex flex-col lg:flex-row items-stretch gap-3 sm:gap-4 pt-1 w-full max-w-full min-w-0">
                  
                  {/* Code Request Example */}
                  <div className="flex-1 min-w-0 w-full rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-slate-950 text-gray-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-gray-800 w-full max-w-full min-w-0">
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold overflow-x-auto hide-scrollbar">
                        <button
                          onClick={() => setActiveCodeTab(prev => ({ ...prev, [ep.id]: 'curl' }))}
                          className={`px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${currentCodeTab === 'curl' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setActiveCodeTab(prev => ({ ...prev, [ep.id]: 'js' }))}
                          className={`px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${currentCodeTab === 'js' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                          JS / Web
                        </button>
                        <button
                          onClick={() => setActiveCodeTab(prev => ({ ...prev, [ep.id]: 'php' }))}
                          className={`px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${currentCodeTab === 'php' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                          PHP / WP
                        </button>
                        <button
                          onClick={() => setActiveCodeTab(prev => ({ ...prev, [ep.id]: 'python' }))}
                          className={`px-2 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${currentCodeTab === 'python' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                          Python
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopy(getCodeSnippet(ep, currentCodeTab), `code-${ep.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold cursor-pointer shrink-0 transition-colors"
                        title={txt.copyCode}
                      >
                        {copiedKey === `code-${ep.id}` ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === `code-${ep.id}` ? txt.copied : txt.copyCode}</span>
                      </button>
                    </div>

                    <pre className="p-3 text-[10px] sm:text-[11px] font-mono leading-relaxed w-full max-w-full overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre text-emerald-300 max-h-52">
                      {getCodeSnippet(ep, currentCodeTab)}
                    </pre>
                  </div>

                  {/* Sample / Live Response */}
                  <div className="flex-1 min-w-0 w-full rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-slate-950 text-gray-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-gray-800 w-full max-w-full min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 flex items-center gap-1.5 truncate">
                        <span>{txt.jsonResponse}</span>
                        {testResult && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                            HTTP {testResult.status} • {testResult.duration}ms
                          </span>
                        )}
                      </span>

                      <button
                        onClick={() => handleCopy(JSON.stringify(testResult ? testResult.data : ep.sampleResponse, null, 2), `resp-${ep.id}`)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold cursor-pointer shrink-0 transition-colors"
                        title={txt.copyResponse}
                      >
                        {copiedKey === `resp-${ep.id}` ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedKey === `resp-${ep.id}` ? txt.copied : txt.copyResponse}</span>
                      </button>
                    </div>

                    <pre className="p-3 text-[10px] sm:text-[11px] font-mono leading-relaxed w-full max-w-full overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre text-amber-200 max-h-52">
                      {JSON.stringify(testResult ? testResult.data : ep.sampleResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
