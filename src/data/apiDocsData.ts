export interface ApiEndpointDoc {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'public_api' | 'tools' | 'ai' | 'quran' | 'pdf' | 'payment' | 'admin' | 'system';
  categoryLabel: string;
  title: string;
  description: string;
  auth: 'none' | 'user' | 'admin' | 'vip';
  headers?: { name: string; type: string; required: boolean; description: string }[];
  queryParams?: { name: string; type: string; required: boolean; description: string }[];
  bodyParams?: { name: string; type: string; required: boolean; description: string }[];
  sampleRequest?: Record<string, any>;
  sampleResponse: Record<string, any>;
  liveTestable?: boolean;
}

export const ASRARHUB_API_DOCS: ApiEndpointDoc[] = [
  // ========================================================
  // EXTERNAL DEVELOPER API (POUR SITES WEB TIERS & BLOGS)
  // ========================================================
  {
    id: 'public_secrets_list',
    method: 'GET',
    path: '/api/v1/secrets',
    category: 'public_api',
    categoryLabel: 'API Publique Développeur (Sites Tiers)',
    title: 'Récupérer les Secrets & Recettes Spirituelles',
    description: 'Permet à n\'importe quel site web externe (WordPress, application mobile, blog) de récupérer en temps réel la liste des secrets spirituels publiés sur AsrarHub avec pagination, recherche et filtrage par catégorie.',
    auth: 'none',
    queryParams: [
      { name: 'category', type: 'string', required: false, description: 'Filtrer par thématique (ex: "protection", "recette", "fath", "shifa")' },
      { name: 'search', type: 'string', required: false, description: 'Recherche textuelle dans les titres et descriptions' },
      { name: 'page', type: 'number', required: false, description: 'Numéro de page (défaut: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Nombre d\'articles par page (défaut: 10, max: 50)' },
      { name: 'lang', type: 'string', required: false, description: 'Langue désirée : "fr", "en", "ha"' }
    ],
    sampleResponse: {
      success: true,
      source: "AsrarHub Open API v1",
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
      data: [
        {
          id: "art_latif_129",
          title: "Les Secrets Spirituels du Zikr Ya-Latif (129 Fois)",
          hook: "Découvrez la dimension ésotérique du Nom Divin Al-Latif et comment sa récitation apporte soulagement et ouverture.",
          category: "recette",
          subCategory: "Zikr & Invocations",
          isPremium: false,
          thumbnail: "https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop",
          benefits: [
            "Soulagement des angoisses et difficultés",
            "Attraction de la douceur divine",
            "Protection contre les épreuves cachées"
          ],
          createdAt: 1727200000000,
          url: "https://asrarhub.com/secret/art_latif_129"
        }
      ]
    },
    liveTestable: true
  },
  {
    id: 'public_secret_detail',
    method: 'GET',
    path: '/api/v1/secrets/:id',
    category: 'public_api',
    categoryLabel: 'API Publique Développeur (Sites Tiers)',
    title: 'Détails Complets d\'un Secret (Sous-titres H3 structurés)',
    description: 'Renvoie le contenu intégral d\'un secret avec ses 5 sous-sections structurées (OBJECTIF, EXEMPLE, ANNIYYA, L\'EFFET, MÉTHODES DE ROUQYA) pour affichage sur votre site ou blog.',
    auth: 'none',
    sampleResponse: {
      success: true,
      data: {
        id: "art_latif_129",
        title: "Les Secrets Spirituels du Zikr Ya-Latif (129 Fois)",
        hook: "Soulagement et paix intérieure par le Nom Divin Al-Latif.",
        category: "recette",
        subCategory: "Zikr & Invocations",
        benefits: ["Soulagement immédiat", "Barakah"],
        content: "<h2>Secret Ya-Latif</h2><h3>OBJECTIF</h3><p>Attirer la douceur...</p><h3>EXEMPLE</h3><p>Dans les moments d'épreuve...</p><h3>ANNIYYA</h3><p>Intention pure...</p><h3>L'EFFET</h3><p>Apaisement du cœur...</p><h3>MÉTHODES DE ROUQYA</h3><p>Réciter avec un verre d'eau...</p>",
        secrets: [
          {
            title: "Secret Ya-Latif",
            objectif: "Attirer la douceur et dissiper les blocages...",
            exemple: "Cas d'une dette ou d'une angoisse pressante...",
            anniyya: "Je formule l'intention sincère de rechercher la proximité divine...",
            effet: "Ouverture immédiate des cœurs et sérénité...",
            methodesRouqya: "Réciter 129 fois après la prière du Maghrib..."
          }
        ],
        url: "https://asrarhub.com/secret/art_latif_129"
      }
    },
    liveTestable: false
  },
  {
    id: 'public_categories_list',
    method: 'GET',
    path: '/api/v1/categories',
    category: 'public_api',
    categoryLabel: 'API Publique Développeur (Sites Tiers)',
    title: 'Récupérer les Catégories Spirituelles',
    description: 'Permet d\'afficher la navigation thématique d\'AsrarHub (Protection, Ouverture, Guérison, Amour, Sciences des lettres) sur votre propre menu de site web.',
    auth: 'none',
    sampleResponse: {
      success: true,
      data: [
        {
          id: "protection",
          name: "Protection (Tahsin)",
          description: "Boucliers spirituels, protection contre le mauvais œil et la sorcellerie.",
          icon: "Shield",
          color: "#3b82f6"
        },
        {
          id: "fath",
          name: "Ouverture & Richesse (Fath / Rizq)",
          description: "Attraction de la subsistance licite et facilitation.",
          icon: "Coins",
          color: "#10b981"
        },
        {
          id: "shifa",
          name: "Guérison & Santé (Shifa)",
          description: "Remèdes coraniques et invocations de guérison.",
          icon: "Heart",
          color: "#ef4444"
        }
      ]
    },
    liveTestable: true
  },

  // ========================================================
  // OUTILS SPIRITUELS EMBARQUABLES POUR SITES WEB TIERS
  // ========================================================
  {
    id: 'public_tools_abjad',
    method: 'POST',
    path: '/api/v1/tools/abjad',
    category: 'tools',
    categoryLabel: 'Outils Spirituels Embarquables',
    title: 'Calculateur Grand Abjad (Ilm al-Huruf)',
    description: 'Calcule la valeur numérique sacrée de n\'importe quel mot ou verset en arabe selon le Grand Abjad, avec décomposition par lettre et détermination de l\'élément cosmique dominant (Feu, Terre, Air, Eau). Idéal pour intégrer un calculateur sur votre site.',
    auth: 'none',
    bodyParams: [
      { name: 'text', type: 'string', required: true, description: 'Texte ou Nom en arabe (ex: "الله", "محمد", "لطيف")' }
    ],
    sampleRequest: {
      text: "الله"
    },
    sampleResponse: {
      success: true,
      inputText: "الله",
      grandAbjadTotal: 66,
      lettersCount: 4,
      dominantElement: "Eau (Mâ' - Douceur & Guérison)",
      elementalBreakdown: { fire: 1, earth: 0, air: 0, water: 3 },
      breakdown: [
        { char: "ا", value: 1 },
        { char: "ل", value: 30 },
        { char: "ل", value: 30 },
        { char: "ه", value: 5 }
      ]
    },
    liveTestable: true
  },
  {
    id: 'public_tools_asma_ul_husna',
    method: 'GET',
    path: '/api/v1/tools/asma-ul-husna',
    category: 'tools',
    categoryLabel: 'Outils Spirituels Embarquables',
    title: 'API des 99 Noms Divins (Asma-ul-Husna)',
    description: 'Fournit la liste des 99 Noms d\'Allah avec leur calligraphie arabe, translittération, traduction française, valeur Abjad et vertus spirituelles associées.',
    auth: 'none',
    queryParams: [
      { name: 'search', type: 'string', required: false, description: 'Recherche par nom (ex: "latif", "fattah", "razzaq")' }
    ],
    sampleResponse: {
      success: true,
      count: 10,
      data: [
        {
          id: 30,
          arabic: "اللَّطِيفُ",
          transliteration: "Al-Latif",
          translation: "Le Subtil & Infiniment Doux",
          abjad: 129,
          benefit: "Résolution miraculeuse des détresses, apaisement et ouverture providentielle."
        }
      ]
    },
    liveTestable: true
  },
  {
    id: 'public_tools_daily_wird',
    method: 'GET',
    path: '/api/v1/tools/daily-wird',
    category: 'tools',
    categoryLabel: 'Outils Spirituels Embarquables',
    title: 'Wird & Litanie Recommandée du Jour',
    description: 'Renvoie l\'oraison quotidienne recommandée en fonction du jour de la semaine (Salawat le lundi, Istighfar le mardi, Noms d\'amour le vendredi, etc.) avec nombre de répétitions et barakah.',
    auth: 'none',
    sampleResponse: {
      success: true,
      today: {
        day: "Vendredi",
        arabicTitle: "يَا اللَّهُ يَا رَحْمَٰنُ يَا رَحِيمُ",
        transliteration: "Ya Allah Ya Rahman Ya Rahim",
        translation: "Ô Allah, Ô Miséricordieux, Ô Clément",
        repetitions: 1000,
        benefit: "Heure d'exaucement du vendredi, ouverture des portes célestes et paix."
      },
      date: "2026-09-25T22:00:00.000Z"
    },
    liveTestable: true
  },
  {
    id: 'public_tools_widget_embed',
    method: 'GET',
    path: '/api/v1/embed/daily-wird',
    category: 'tools',
    categoryLabel: 'Outils Spirituels Embarquables',
    title: 'Widget HTML « Clé en Main » (Intégration iFrame)',
    description: 'Page HTML légère et autonome conçue pour être insérée directement dans n\'importe quel site web via un simple code <iframe> sans avoir à coder.',
    auth: 'none',
    sampleResponse: {
      note: "Renvoie une page HTML stylisée avec badge du jour, calligraphie dorée et nombre de récitations. Code d'intégration : <iframe src=\"https://asrarhub.com/api/v1/embed/daily-wird\" width=\"360\" height=\"240\" frameborder=\"0\"></iframe>"
    },
    liveTestable: false
  },

  // ========================================================
  // SYSTEM & HEALTH
  // ========================================================
  {
    id: 'health_check',
    method: 'GET',
    path: '/api/health',
    category: 'system',
    categoryLabel: 'Système & Surveillance',
    title: 'Vérification de l\'état du serveur (Health Check)',
    description: 'Permet de surveiller la disponibilité du serveur Node/Express, la latence et l\'état opérationnel des microservices.',
    auth: 'none',
    sampleResponse: {
      status: 'ok',
      timestamp: 1774567200000
    },
    liveTestable: true
  },

  // ========================================================
  // AI & SPIRITUAL ORACLES
  // ========================================================
  {
    id: 'quran_tafsir',
    method: 'POST',
    path: '/api/quran/tafsir',
    category: 'ai',
    categoryLabel: 'Intelligence Spirituelle & IA',
    title: 'Exégèse Coranique Spirituelle (Tafsir IA)',
    description: 'Analyse théologique et spirituelle approfondie d\'un verset coranique spécifique, révélant ses sagesses cachées, son contexte et ses applications intérieures.',
    auth: 'none',
    headers: [
      { name: 'Content-Type', type: 'string', required: true, description: 'application/json' }
    ],
    bodyParams: [
      { name: 'surahNumber', type: 'number', required: true, description: 'Numéro de la sourate (1 à 114)' },
      { name: 'ayahNumber', type: 'number', required: true, description: 'Numéro du verset' },
      { name: 'language', type: 'string', required: false, description: 'Langue de réponse : "fr", "en", "ha"' }
    ],
    sampleRequest: {
      surahNumber: 2,
      ayahNumber: 255,
      language: 'fr'
    },
    sampleResponse: {
      success: true,
      surah: 2,
      ayah: 255,
      tafsir: "L'Ayat Al-Kursi est le sommet métaphysique du Saint Coran. Il consacre l'Unicité absolue (Tawhid), la Toute-Puissance divine et la transcendance d'Allah qui ne sommeille ni ne dort...",
      spiritualApplication: "Récitation quotidienne pour la protection énergétique (Tahsin) et l'élévation spirituelle."
    },
    liveTestable: true
  },
  {
    id: 'dreams_interpret',
    method: 'POST',
    path: '/api/dreams/interpret',
    category: 'ai',
    categoryLabel: 'Intelligence Spirituelle & IA',
    title: 'Interprétation Islamique des Rêves (Rū\'yā)',
    description: 'Décodage des songes à la lumière des grands savants de l\'oniromancie islamique (Ibn Sirin, Al-Nabulsi) et des archétypes spirituels.',
    auth: 'none',
    headers: [
      { name: 'Content-Type', type: 'string', required: true, description: 'application/json' }
    ],
    bodyParams: [
      { name: 'dreamText', type: 'string', required: true, description: 'Description détaillée du rêve raconté par le fidèle' },
      { name: 'dreamerContext', type: 'string', required: false, description: 'Contexte personnel (état émotionnel, heure du rêve, etc.)' },
      { name: 'language', type: 'string', required: false, description: 'Langue de restitution ("fr", "en", "ha")' }
    ],
    sampleRequest: {
      dreamText: "J'ai rêvé que je buvais de l'eau claire et fraîche provenant d'une source sacrée sous un palmier.",
      dreamerContext: "Rêve fait à l'aube après la prière du Fajr",
      language: "fr"
    },
    sampleResponse: {
      success: true,
      interpretation: "Selon l'imam Ibn Sirin, boire de l'eau pure symbolise la guidance divine, la guérison d'un trouble et une subsistance licite (Rizq Halal) en approche.",
      advice: "Formuler l'An-Niyya de remerciement et faire une aumône (Sadaqah) pour sceller ce bienfait."
    },
    liveTestable: false
  },
  {
    id: 'asrar_conseil',
    method: 'POST',
    path: '/api/gemini/asrar-conseil',
    category: 'ai',
    categoryLabel: 'Intelligence Spirituelle & IA',
    title: 'Conseil & Orientation Spirituelle Personnalisée',
    description: 'Génération de recommandations spirituelles personnalisées, choix d\'invocations adaptées aux épreuves ou aux projets selon la tradition prophétique.',
    auth: 'none',
    headers: [
      { name: 'Content-Type', type: 'string', required: true, description: 'application/json' }
    ],
    bodyParams: [
      { name: 'situation', type: 'string', required: true, description: 'Description de la situation, du blocage ou de l\'objectif' },
      { name: 'currentStage', type: 'string', required: false, description: 'Niveau spirituel ou étape actuelle' }
    ],
    sampleRequest: {
      situation: "Je cherche une ouverture professionnelle et financière face à de multiples blocages administratifs.",
      currentStage: "Pratiquant régulier de la prière et de l'istighfar"
    },
    sampleResponse: {
      success: true,
      recommendation: "Il est conseillé d'intensifier la prière de l'aube, de réciter la Sourate Al-Waqi'a chaque soir et d'associer le Nom divin 'Ya Fattah' 489 fois.",
      steps: [
        "Purification rituelle (Woudou complet)",
        "2 Rakaats de Salat Al-Hajah (Prière du besoin)",
        "Récitation du Wird d'ouverture avec intention claire"
      ]
    },
    liveTestable: false
  },
  {
    id: 'zairja_oracle',
    method: 'POST',
    path: '/api/zairja/oracle',
    category: 'ai',
    categoryLabel: 'Intelligence Spirituelle & IA',
    title: 'Consultation de la Zairja (Science des Lettres)',
    description: 'Oracle métaphysique fondé sur la science millénaire des 28 lettres arabes (Ilm al-Huruf), l\'Abjad et l\'alchimie géomantique.',
    auth: 'none',
    bodyParams: [
      { name: 'question', type: 'string', required: true, description: 'Question posée par le consultant' },
      { name: 'abjadValue', type: 'number', required: false, description: 'Valeur numérique totale calculée selon le grand Abjad' }
    ],
    sampleRequest: {
      question: "Quelle est la clé pour surmonter l'angoisse présente ?",
      abjadValue: 129
    },
    sampleResponse: {
      success: true,
      derivedName: "Ya Latif (Le Bienveillant)",
      numericalHarmony: 129,
      letterElement: "Air & Lumière",
      metaphysicalResponse: "La délivrance réside dans la douceur et la confiance absolue. Le Nom divin Al-Latif dissout la constriction des cœurs."
    },
    liveTestable: false
  },

  // ========================================================
  // PDF LIBRARY
  // ========================================================
  {
    id: 'pdf_custom_list',
    method: 'GET',
    path: '/api/pdf/custom-list',
    category: 'pdf',
    categoryLabel: 'Bibliothèque & PDFs Sacrés',
    title: 'Liste des Manuscrits & Livres PDF Publiés',
    description: 'Récupère le catalogue complet des livres numériques et manuscrits ésotériques stockés sur le serveur.',
    auth: 'none',
    sampleResponse: {
      pdfs: [
        {
          id: "pdf_secrets_versets_coran_jibril_sbi",
          title: "Les Secrets des Versets du Coran",
          author: "Jibril SBI",
          category: "asrar",
          pagesCount: 168,
          fileSize: "18.5 Mo",
          isPremium: true,
          price: 5000,
          currency: "FCFA"
        }
      ]
    },
    liveTestable: true
  },

  // ========================================================
  // PAYMENTS & VIP
  // ========================================================
  {
    id: 'verify_paystack',
    method: 'POST',
    path: '/api/verify-paystack',
    category: 'payment',
    categoryLabel: 'Paiements & VIP',
    title: 'Vérification Sécurisée de Transaction Paystack',
    description: 'Valide l\'authenticité d\'un paiement par Carte Bancaire ou Mobile Money via l\'API Paystack officielle et débloque le statut VIP ou l\'achat de livre PDF.',
    auth: 'user',
    bodyParams: [
      { name: 'reference', type: 'string', required: true, description: 'Référence unique générée par la passerelle Paystack' },
      { name: 'userId', type: 'string', required: true, description: 'Identifiant UID Firebase de l\'acheteur' },
      { name: 'planId', type: 'string', required: false, description: 'Identifiant du plan (mensuel, annuel, livre_pdf)' }
    ],
    sampleRequest: {
      reference: "pstk_tx_94820491823",
      userId: "user_firebase_uid_123",
      planId: "vip_annual"
    },
    sampleResponse: {
      success: true,
      status: "paid",
      amount: 15000,
      currency: "FCFA",
      customerEmail: "fidele@asrarhub.com",
      vipActivatedUntil: "2027-09-25T14:00:00.000Z"
    },
    liveTestable: false
  }
];
