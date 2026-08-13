export interface QurahTranslation {
  title: string;
  subtitle: string;
  description: string;
  infoToolTip: string;
  tabs: {
    cauris: string;
    caurisDesc: string;
    azlam: string;
    azlamDesc: string;
    dial: string;
    dialDesc: string;
  };
  common: {
    questionPlaceholder: string;
    intentionLabel: string;
    intentionDomains: {
      general: string;
      love: string;
      business: string;
      health: string;
      protection: string;
      spiritual: string;
    };
    spin: string;
    toss: string;
    pullStick: string;
    shakeBox: string;
    reset: string;
    copy: string;
    copied: string;
    export: string;
    verdict: string;
    advice: string;
    dhikr: string;
    sadaka: string;
    element: string;
    favorable: string;
    unfavorable: string;
    neutral: string;
    customChoices: string;
    addChoice: string;
    removeChoice: string;
  };
  cauris: {
    title: string;
    subtitle: string;
    modes: {
      mode4: string;
      mode8: string;
      mode16: string;
    };
    instructions: string;
    openLabel: string;
    closedLabel: string;
    toggleHelp: string;
    results: Record<string, {
      name: string;
      arabicName: string;
      verdict: string;
      summary: string;
      details: string;
      sadaka: string;
      dhikr: string;
      element: string;
    }>;
  };
  azlam: {
    title: string;
    subtitle: string;
    modes: {
      mode3: string;
      mode7: string;
    };
    instructions: string;
    sticks: Record<string, {
      name: string;
      arabicName: string;
      verdict: string;
      summary: string;
      proverb: string;
      strategy: string;
      element: string;
    }>;
  };
  dial: {
    title: string;
    subtitle: string;
    presets: {
      binary: string;
      strategic: string;
      daily: string;
      custom: string;
    };
    instructions: string;
    spinningText: string;
    presetItems: Record<string, string[]>;
    itemAdvice: Record<string, {
      summary: string;
      recommendation: string;
      dhikr: string;
    }>;
  };
}

export const QURAH_TRANSLATIONS: Record<'fr' | 'en' | 'ha', QurahTranslation> = {
  fr: {
    title: "Divination Traditionnelle (Qur'ah)",
    subtitle: "Oracles Ancestraux : Cauris, Bâtonnets Azlam & Cadran de Décision Virtuel",
    description: "Explorez les trois méthodes traditionnelles de consultation et de tirage au sort (Qur'ah / Kuri) pour éclairer vos décisions quotidiennes, évaluer la stabilité des projets et recevoir une guidance spirituelle précise.",
    infoToolTip: "La Qur'ah désigne la pratique ancestrale du tirage au sort sacré, utilisée dans la tradition africaine et arabo-islamique pour trancher les dilemmes sans passion, solliciter la bénédiction céleste et identifier les actions prioritaires.",
    tabs: {
      cauris: "Tirage de Cauris (Kuri)",
      caurisDesc: "Jet de coquillages sacrés et interprétation des ouvertures",
      azlam: "Bâtonnets Sacrés (Azlam)",
      azlamDesc: "Consultation rapide par tirage de bâtonnets de bois",
      dial: "Cadran de Décision",
      dialDesc: "Roue de choix et tranchant virtuel pour décisions rapides",
    },
    common: {
      questionPlaceholder: "Entrez votre question ou votre intention (ex: Dois-je engager ce projet ?)",
      intentionLabel: "Domaine de Consultation",
      intentionDomains: {
        general: "Général & Alignement",
        love: "Union, Amour & Harmonie",
        business: "Commerce, Travail & Abondance",
        health: "Santé, Énergie & Vitalité",
        protection: "Protection & Voyage",
        spiritual: "Cheminement Spirituel & Wird",
      },
      spin: "Lancer le Cadran",
      toss: "Jeter les Cauris",
      pullStick: "Tirer un Bâtonnet",
      shakeBox: "Mélanger l'Étui (Miqlah)",
      reset: "Réinitialiser",
      copy: "Copier le Résultat",
      copied: "Copié dans le presse-papier !",
      export: "Exporter l'Image",
      verdict: "Verdict Spirituel",
      advice: "Guidance & Orientation",
      dhikr: "Invocations & Dhikr Conseillé",
      sadaka: "Aumône Recommandée (Saraka)",
      element: "Élément Dominant",
      favorable: "Très Favorable",
      unfavorable: "Prudence / S'abstenir",
      neutral: "Attendre & Méditer",
      customChoices: "Options Personnalisées",
      addChoice: "Ajouter une option",
      removeChoice: "Supprimer",
    },
    cauris: {
      title: "Consultation par les Cauris (Kuri)",
      subtitle: "Lecture symbolique de la position dorsale et de la fente des coquillages",
      modes: {
        mode4: "Oracle Rapide (4 Cauris)",
        mode8: "Oracle Intermédiaire (8 Cauris)",
        mode16: "Grand Oracle Traditionnel (16 Cauris)",
      },
      instructions: "Formulez votre intention sincère, puis cliquez sur 'Jeter les Cauris'. Vous pouvez aussi cliquer sur un cauri individuel pour inverser sa face (Fente / Dos).",
      openLabel: "Ouvert (Fente)",
      closedLabel: "Fermé (Dos)",
      toggleHelp: "Cliquez sur n'importe quel cauri pour faire pivoter sa face.",
      results: {
        kole: {
          name: "Kole (4 Fermés)",
          arabicName: "الكتمان والإنغلاق",
          verdict: "Prudence & Retrait Temporaire",
          summary: "Tous les cauris sont retombés sur le dos. Portes fermées ou retard salutaire.",
          details: "Le tirage montre un besoin impératif de discrétion et de protection. Les forces extérieures ne sont pas encore mûres. Abstenez-vous d'agir brusquement et faites une aumône de purification.",
          sadaka: "Masser du lait frais ou donner du pain blanc aux personnes dans le besoin.",
          dhikr: "Ya Hafiz (Le Protecteur) - 111 fois",
          element: "Terre (Ancrage & Patience)",
        },
        afaa: {
          name: "Afaa (1 Ouvert / 3 Fermés)",
          arabicName: "الإقبال والبريق",
          verdict: "Première Lueur & Clarté Naissante",
          summary: "Un cauri ouvert pointe vers la lumière. L'issue s'annonce favorable si conduite avec sagesse.",
          details: "Une première porte s'ouvre. Ce signe annonce la fin d'une période de doute. Procédez étape par étape sans brusquer les événements.",
          sadaka: "Offrir des dattes ou des fruits doux.",
          dhikr: "Ya Nur (La Lumière) - 256 fois",
          element: "Air (Inspiration & Communication)",
        },
        eji: {
          name: "Eji (2 Ouverts / 2 Fermés)",
          arabicName: "الميزان والوفاق",
          verdict: "Équilibre Parfait & Concorde",
          summary: "Parité exacte entre la fente et le dos. Harmonie, paix et alliance fructueuse.",
          details: "Le tirage Eji est le symbole du juste milieu et du contrat équitable. Il favorise le mariage, les associations et la résolution des litiges.",
          sadaka: "Partager un repas en famille ou faire don d'eau potable.",
          dhikr: "Ya Salam (La Paix) - 131 fois",
          element: "Eau (Fluidité & Union)",
        },
        eta: {
          name: "Eta (3 Ouverts / 1 Fermé)",
          arabicName: "الحركة والتمكين",
          verdict: "Action Vivace & Mouvement Triomphant",
          summary: "Trois cauris ouverts appellent à l'action proactive et au courage.",
          details: "Le dynamisme est maximal. Les obstacles cèdent devant la détermination. C'est le moment idéal pour lancer un projet ou exprimer vos choix.",
          sadaka: "Donner des céréales ou du riz aux nécessiteux.",
          dhikr: "Ya Qawiy (Le Fort) - 116 fois",
          element: "Feu (Énergie & Détermination)",
        },
        ero: {
          name: "Ero (4 Ouverts)",
          arabicName: "الفتح المبين",
          verdict: "Victoire Éclatante & Bénédiction Totale",
          summary: "Tous les cauris sont ouverts vers le Ciel. Succès total et grâce divine.",
          details: "L'ouverture est absolue. Vos prières sont exaucées et vos projets bénéficient d'un soutien céleste. Exprimez votre gratitude.",
          sadaka: "Faire un don monétaire joyeux ou offrir des vêtements neufs.",
          dhikr: "Ya Fattah (Le Sublimateur d'Ouverture) - 489 fois",
          element: "Lumière Pure (Sérénité Céleste)",
        },
        // General ratios for 8 and 16 cauris
        majority_closed: {
          name: "Dominance Sombre (Majorité Fermée)",
          arabicName: "غلبة الظل",
          verdict: "Prudence & Réserve",
          summary: "La majorité des cauris révèlent leur face dorsale.",
          details: "Les circonstances demandent de la retenue. Consolidez vos bases avant de vous engager plus loin.",
          sadaka: "Pain frais et bougie blanche.",
          dhikr: "Ya Latif - 129 fois",
          element: "Terre",
        },
        balanced: {
          name: "Lumière Équilibrée (Parité Cauris)",
          arabicName: "الاعتدال التام",
          verdict: "Harmonie & Stabilité",
          summary: "Équilibre entre faces ouvertes et fermées.",
          details: "L'énergie est stable et fluide. Avancez en confiance avec honnêteté.",
          sadaka: "Eau claire et graines.",
          dhikr: "Ya Wahhab - 14 fois",
          element: "Eau & Air",
        },
        majority_open: {
          name: "Dominance Lumineuse (Majorité Ouverte)",
          arabicName: "غلبة النور",
          verdict: "Grande Favorabilité",
          summary: "Une majorité de cauris révèlent leur fente sacrée.",
          details: "Lumière abondante sur la voie. Les intentions sincères trouveront un accomplissement rapide.",
          sadaka: "Offrande de dattes et miel.",
          dhikr: "Ya Karim - 270 fois",
          element: "Feu & Lumière",
        },
      },
    },
    azlam: {
      title: "Consultation des Bâtonnets Sacrés (Azlam)",
      subtitle: "Tirage direct des segments de bois divinatoires",
      modes: {
        mode3: "Tirage de la Triade (3 Bâtonnets)",
        mode7: "Tirage du Septet (7 Bâtonnets)",
      },
      instructions: "Agitez le conteneur sacré (Miqlah) pour mélanger les bâtonnets de bois sculpté, puis tirez un segment pour recevoir la sentence immediate.",
      sticks: {
        amr: {
          name: "Al-Amr (L'Ordre)",
          arabicName: "الأمر بالإقدام",
          verdict: "AGIR / FAIRE",
          summary: "Signal favorable à l'action. Engagez-vous en toute confiance.",
          proverb: "L'action guidée par la sincérité dissout tous les doutes.",
          strategy: "Ne différez plus. Mettez vos plans à exécution dès aujourd'hui.",
          element: "Feu",
        },
        nahy: {
          name: "An-Nahy (L'Interdiction)",
          arabicName: "النهي والامتناع",
          verdict: "RENONCER / S'ABSTENIR",
          summary: "Signal de retenue. Abstenez-vous de poursuivre dans cette voie.",
          proverb: "S'abstenir au bon moment est plus précieux que mille victoires imprudentes.",
          strategy: "Protégez vos ressources et differez tout engagement à plus tard.",
          element: "Terre",
        },
        mutashabih: {
          name: "Al-Mutashabih (Le Neutre / Pause)",
          arabicName: "المتشابه والانتظار",
          verdict: "ATTENDRE / RÉITÉRER",
          summary: "Le Ciel demande du temps. Refaites le tirage ultérieurement.",
          proverb: "Quand le brouillard se lève, le voyageur éclairé marque une halte.",
          strategy: "Faites une pause spirituelle, réévaluez votre intention et réciter des prières.",
          element: "Air",
        },
        afa: {
          name: "Al-Afa (Le Pardon & La Paix)",
          arabicName: "العفو والصلح",
          verdict: "PARDONNER & CONCILIER",
          summary: "Privilégiez la miséricorde, la conciliation et le pardon mutuel.",
          proverb: "La noble indulgence ouvre les cœurs verrouillés.",
          strategy: "Faites le premier pas vers la paix et éliminez toute rancœur.",
          element: "Eau",
        },
        mahl: {
          name: "Al-Mahl (Patience & Répit)",
          arabicName: "المهلة والتريث",
          verdict: "PATIENCE REQUISE",
          summary: "Laissez mûrir les événements naturellement sans forcer le destin.",
          proverb: "Le fruit cueilli trop tôt manque de douceur.",
          strategy: "Déléguez de la patience au temps et gardez un esprit serein.",
          element: "Terre",
        },
        rizq: {
          name: "Ar-Rizq (Prosproité & Abondance)",
          arabicName: "الرزق والبركة",
          verdict: "ABONDANCE ASSURÉE",
          summary: "Bénédiction financière, matérielle et spirituelle en chemin.",
          proverb: "La gratitude attire le surplus de bienfaits.",
          strategy: "Accueillez la prospérité et partagez la grâce par l'aumône.",
          element: "Eau & Terre",
        },
        safar: {
          name: "As-Safar (Voyage & Déplacement)",
          arabicName: "السفر والتغيير",
          verdict: "MOUVEMENT & DEPLACEMENT",
          summary: "Le changement de lieu ou d'horizon apporte la solution.",
          proverb: "L'eau stagnante se trouble, l'eau qui coule reste pure.",
          strategy: "Envisagez un voyage, un changement de cadre ou une nouvelle perspective.",
          element: "Air",
        },
        wafa: {
          name: "Al-Wafa (Fidélité & Accomplissement)",
          arabicName: "الوفاء بالعهد",
          verdict: "ACCOMPLISSEMENT FIDELE",
          summary: "Tenez vos promesses et engagements. Le succès y est garanti.",
          proverb: "La loyauté est le socle de toute grandeur durable.",
          strategy: "Honorerez vos paroles et vos pactes spirituels.",
          element: "Feu",
        },
      },
    },
    dial: {
      title: "Cadran de Décision Virtuel (Qur'ah Dairah)",
      subtitle: "Roue de choix interactive et trancheur de dilemmes",
      presets: {
        binary: "Tranchant Rapide (Oui / Non / Attendre / Aumône)",
        strategic: "Orientation Stratégique (6 Voies)",
        daily: "Perspectives Quotidiennes",
        custom: "Mode Personnalisé",
      },
      instructions: "Posez votre question intérieure, choisissez un type de cadran puis cliquez sur 'Lancer le Cadran' pour faire tourner l'aiguille sacrée.",
      spinningText: "Mouvement du cadran en cours...",
      presetItems: {
        binary: [
          "Oui - Avancer avec Confiance",
          "Non - Éviter & Protéger",
          "Attendre - Temps Nécessaire",
          "Aumône - Offrir une Saraka D'abord",
        ],
        strategic: [
          "Action Directe & Audace",
          "Négociation & Alliance",
          "Prudence & Retrait",
          "Prière & Consultation",
          "Partenariat Favorable",
          "Repos & Méditation",
        ],
        daily: [
          "Opportunité Majeure",
          "Prudence sur les Dépenses",
          "Bénédiction Inattendue",
          "Patience Recommandée",
          "Purification & Nettoyage",
        ],
      },
      itemAdvice: {
        "Oui - Avancer avec Confiance": {
          summary: "Les signaux sont au vert. Votre intuition et votre intention sont alignées.",
          recommendation: "Exécutez vos décisions sans douter.",
          dhikr: "Ya Wali (Le Protecteur) - 47 fois",
        },
        "Non - Éviter & Protéger": {
          summary: "Ce chemin comporte un risque ou une énergie contraire.",
          recommendation: "Redirigez votre attention vers des priorités plus sûres.",
          dhikr: "Ya Mani' (Le Préservateur) - 161 fois",
        },
        "Attendre - Temps Nécessaire": {
          summary: "La situation demande plus de maturité et d'informations.",
          recommendation: "Ne forcez rien aujourd'hui.",
          dhikr: "Ya Sabur (Le Patient) - 100 fois",
        },
        "Aumône - Offrir une Saraka D'abord": {
          summary: "Une petite offrande débloquera les nœuds invisibles.",
          recommendation: "Donnez un peu de pain, d'eau ou de monnaie avant d'agir.",
          dhikr: "Ya Karim (Le Généreux) - 270 fois",
        },
      },
    },
  },
  en: {
    title: "Traditional Divination (Qur'ah)",
    subtitle: "Ancestral Oracles: Cowrie Shells, Azlam Sticks & Virtual Decision Dial",
    description: "Explore three traditional consultation methods (Qur'ah / Kuri) to illuminate your daily decisions, evaluate project stability, and receive precise spiritual guidance.",
    infoToolTip: "Qur'ah represents the ancestral practice of sacred drawing of lots, used in African and Arabo-Islamic traditions to resolve dilemmas impartially, seek divine blessings, and identify priority actions.",
    tabs: {
      cauris: "Cowrie Shell Casting (Kuri)",
      caurisDesc: "Throwing sacred shells & reading apertures",
      azlam: "Sacred Sticks (Azlam)",
      azlamDesc: "Rapid consultation by drawing carved wooden sticks",
      dial: "Decision Dial",
      dialDesc: "Interactive choice wheel for daily dilemmas",
    },
    common: {
      questionPlaceholder: "Enter your question or intention (e.g., Should I launch this project?)",
      intentionLabel: "Consultation Domain",
      intentionDomains: {
        general: "General Alignment & Life",
        love: "Union, Love & Harmony",
        business: "Business, Work & Prosperity",
        health: "Health, Energy & Vitality",
        protection: "Protection & Journey",
        spiritual: "Spiritual Path & Wird",
      },
      spin: "Spin the Dial",
      toss: "Cast Cowries",
      pullStick: "Draw a Stick",
      shakeBox: "Shake Container (Miqlah)",
      reset: "Reset",
      copy: "Copy Result",
      copied: "Copied to clipboard!",
      export: "Export Image",
      verdict: "Spiritual Verdict",
      advice: "Guidance & Orientation",
      dhikr: "Recommended Invocations & Dhikr",
      sadaka: "Recommended Charity (Sadaka)",
      element: "Dominant Element",
      favorable: "Highly Favorable",
      unfavorable: "Caution / Refrain",
      neutral: "Wait & Meditate",
      customChoices: "Custom Options",
      addChoice: "Add option",
      removeChoice: "Remove",
    },
    cauris: {
      title: "Cowrie Shell Consultation (Kuri)",
      subtitle: "Symbolic reading of dorsal side vs open aperture",
      modes: {
        mode4: "Quick Oracle (4 Cowries)",
        mode8: "Intermediate Oracle (8 Cowries)",
        mode16: "Grand Traditional Oracle (16 Cowries)",
      },
      instructions: "Formulate your sincere intention, then click 'Cast Cowries'. You can also click an individual shell to flip its face (Open / Closed).",
      openLabel: "Open (Aperture)",
      closedLabel: "Closed (Back)",
      toggleHelp: "Click any cowrie to flip its orientation.",
      results: {
        kole: {
          name: "Kole (4 Closed)",
          arabicName: "الكتمان والإنغلاق",
          verdict: "Caution & Temporary Retreat",
          summary: "All shells landed flat side up. Closed doors or beneficial delay.",
          details: "The draw shows an urgent need for discretion and spiritual protection. External forces are not yet ripe. Refrain from acting abruptly and give charity.",
          sadaka: "Offer fresh milk or white bread to those in need.",
          dhikr: "Ya Hafiz (The Preserver) - 111 times",
          element: "Earth (Grounding & Patience)",
        },
        afaa: {
          name: "Afaa (1 Open / 3 Closed)",
          arabicName: "الإقبال والبريق",
          verdict: "First Light & Rising Clarity",
          summary: "One open shell points towards light. Favorable outcome if conducted wisely.",
          details: "A first door opens. This sign announces the end of doubt. Proceed step by step without rushing events.",
          sadaka: "Offer fresh dates or sweet fruit.",
          dhikr: "Ya Nur (The Light) - 256 times",
          element: "Air (Inspiration & Communication)",
        },
        eji: {
          name: "Eji (2 Open / 2 Closed)",
          arabicName: "الميزان والوفاق",
          verdict: "Perfect Balance & Harmony",
          summary: "Exact parity between open and closed faces. Harmony, peace, and fruitful alliance.",
          details: "The Eji draw is the symbol of golden balance and fair agreements. It favors marriage, partnerships, and conflict resolution.",
          sadaka: "Share a meal with family or donate clean drinking water.",
          dhikr: "Ya Salam (The Peace) - 131 times",
          element: "Water (Flow & Union)",
        },
        eta: {
          name: "Eta (3 Open / 1 Closed)",
          arabicName: "الحركة والتمكين",
          verdict: "Vibrant Action & Triumphant Movement",
          summary: "Three open cowries call for proactive momentum and courage.",
          details: "Dynamism is at its peak. Obstacles yield before determination. This is the ideal moment to launch a project or state your choices.",
          sadaka: "Give grains or rice to the needy.",
          dhikr: "Ya Qawiy (The Strong) - 116 times",
          element: "Fire (Energy & Determination)",
        },
        ero: {
          name: "Ero (4 Open)",
          arabicName: "الفتح المبين",
          verdict: "Radiant Victory & Total Blessing",
          summary: "All cowries face Heaven. Complete success and divine grace.",
          details: "Openness is absolute. Your prayers are answered and your projects enjoy celestial backing. Express heartfelt gratitude.",
          sadaka: "Give a joyful monetary donation or new clothing.",
          dhikr: "Ya Fattah (The Opener) - 489 times",
          element: "Pure Light (Celestial Serenity)",
        },
        majority_closed: {
          name: "Shadow Dominance (Majority Closed)",
          arabicName: "غلبة الظل",
          verdict: "Caution & Reserve",
          summary: "Most cowries reveal their closed dorsal face.",
          details: "Circumstances require restraint. Consolidate your foundation before stepping further.",
          sadaka: "Fresh bread and white candle.",
          dhikr: "Ya Latif - 129 times",
          element: "Earth",
        },
        balanced: {
          name: "Balanced Light (Equal Shell Parity)",
          arabicName: "الاعتدال التام",
          verdict: "Harmony & Stability",
          summary: "Equal balance between open and closed shells.",
          details: "Energy is smooth and stable. Move forward with confidence and honesty.",
          sadaka: "Pure water and seeds.",
          dhikr: "Ya Wahhab - 14 times",
          element: "Water & Air",
        },
        majority_open: {
          name: "Luminous Dominance (Majority Open)",
          arabicName: "غلبة النور",
          verdict: "High Favorability",
          summary: "A majority of cowries reveal their sacred aperture.",
          details: "Abundant light on your path. Sincere intentions will achieve rapid fulfillment.",
          sadaka: "Offering of dates and honey.",
          dhikr: "Ya Karim - 270 times",
          element: "Fire & Light",
        },
      },
    },
    azlam: {
      title: "Sacred Sticks Consultation (Azlam)",
      subtitle: "Direct draw of carved divination wood segments",
      modes: {
        mode3: "Triad Consultation (3 Sticks)",
        mode7: "Septet Consultation (7 Sticks)",
      },
      instructions: "Shake the sacred leather container (Miqlah) to mix the carved wooden sticks, then draw a segment to receive immediate spiritual verdict.",
      sticks: {
        amr: {
          name: "Al-Amr (The Command)",
          arabicName: "الأمر بالإقدام",
          verdict: "ACT / PROCEED",
          summary: "Favorable signal for action. Commit with confidence.",
          proverb: "Action guided by sincerity dissolves all doubts.",
          strategy: "Delay no longer. Put your plans into motion today.",
          element: "Fire",
        },
        nahy: {
          name: "An-Nahy (The Prohibition)",
          arabicName: "النهي والامتناع",
          verdict: "REFRAIN / ABSTAIN",
          summary: "Signal for restraint. Refrain from pursuing this path.",
          proverb: "Refraining at the right moment is worth more than a thousand reckless victories.",
          strategy: "Protect your resources and postpone any commitment.",
          element: "Earth",
        },
        mutashabih: {
          name: "Al-Mutashabih (The Neutral / Pause)",
          arabicName: "المتشابه والانتظار",
          verdict: "WAIT / REPEAT",
          summary: "Heaven requests time. Repeat the draw later.",
          proverb: "When fog rises, the wise traveler halts.",
          strategy: "Take a spiritual pause, reassess your intention, and offer prayers.",
          element: "Air",
        },
        afa: {
          name: "Al-Afa (Forgiveness & Peace)",
          arabicName: "العفو والصلح",
          verdict: "FORGIVE & RECONCILE",
          summary: "Prioritize mercy, conciliation, and mutual forgiveness.",
          proverb: "Noble forgiveness unlocks locked hearts.",
          strategy: "Take the first step toward peace and banish resentment.",
          element: "Water",
        },
        mahl: {
          name: "Al-Mahl (Patience & Delay)",
          arabicName: "المهلة والتريث",
          verdict: "PATIENCE REQUIRED",
          summary: "Allow events to ripen naturally without forcing destiny.",
          proverb: "Fruit picked too early lacks sweetness.",
          strategy: "Entrust patience to time and keep a serene mind.",
          element: "Earth",
        },
        rizq: {
          name: "Ar-Rizq (Prosperity & Abundance)",
          arabicName: "الرزق والبركة",
          verdict: "ASSURED ABUNDANCE",
          summary: "Financial, material, and spiritual blessings ahead.",
          proverb: "Gratitude attracts surplus blessings.",
          strategy: "Welcome prosperity and share grace through charity.",
          element: "Water & Earth",
        },
        safar: {
          name: "As-Safar (Journey & Movement)",
          arabicName: "السفر والتغيير",
          verdict: "MOVEMENT & TRAVEL",
          summary: "Changing place or location brings the resolution.",
          proverb: "Stagnant water grows murky; flowing water stays pure.",
          strategy: "Consider a trip, a new environment, or a fresh perspective.",
          element: "Air",
        },
        wafa: {
          name: "Al-Wafa (Fulfillment & Promise)",
          arabicName: "الوفاء بالعهد",
          verdict: "FAITHFUL FULFILLMENT",
          summary: "Keep your promises and pledges. Success is guaranteed.",
          proverb: "Loyalty is the bedrock of lasting greatness.",
          strategy: "Honor your words and spiritual pacts.",
          element: "Fire",
        },
      },
    },
    dial: {
      title: "Virtual Decision Dial (Qur'ah Dairah)",
      subtitle: "Interactive choice wheel and dilemma resolver",
      presets: {
        binary: "Quick Decision (Yes / No / Wait / Charity)",
        strategic: "Strategic Orientation (6 Paths)",
        daily: "Daily Outlook",
        custom: "Custom Mode",
      },
      instructions: "Hold your inner question, select a dial type, then click 'Spin the Dial' to rotate the sacred needle.",
      spinningText: "Dial spinning in motion...",
      presetItems: {
        binary: [
          "Yes - Move Forward with Confidence",
          "No - Avoid & Protect",
          "Wait - Necessary Time Needed",
          "Charity - Offer Sadaka First",
        ],
        strategic: [
          "Direct Action & Courage",
          "Negotiation & Alliance",
          "Caution & Withdrawal",
          "Prayer & Consultation",
          "Favorable Partnership",
          "Rest & Meditation",
        ],
        daily: [
          "Major Opportunity",
          "Caution on Expenses",
          "Unexpected Blessing",
          "Patience Recommended",
          "Purification & Cleansing",
        ],
      },
      itemAdvice: {
        "Yes - Move Forward with Confidence": {
          summary: "Signals are clear green. Your intuition and intent are aligned.",
          recommendation: "Execute your decisions without hesitation.",
          dhikr: "Ya Wali (The Protector) - 47 times",
        },
        "No - Avoid & Protect": {
          summary: "This path carries risk or opposing energy.",
          recommendation: "Redirect your focus towards safer priorities.",
          dhikr: "Ya Mani' (The Preventer) - 161 times",
        },
        "Wait - Necessary Time Needed": {
          summary: "The situation requires more maturity and information.",
          recommendation: "Do not force anything today.",
          dhikr: "Ya Sabur (The Patient) - 100 times",
        },
        "Charity - Offer Sadaka First": {
          summary: "A small offering will dissolve invisible blockages.",
          recommendation: "Give bread, water, or coins before taking action.",
          dhikr: "Ya Karim (The Generous) - 270 times",
        },
      },
    },
  },
  ha: {
    title: "Duba na Gargajiya (Qur me / Qur'ah)",
    subtitle: "Hanyoyin Kuri, Sandunan Azlam da Babban Agogon Yanke Shawara",
    description: "Binciki hanyoyin duba na gargajiya guda uku (Qur'ah / Kuri) domin haskaka shawarwarin ka na yau da kullum, gano nasarar ayyuka da samun jagorancin ruhaniya mai zurfi.",
    infoToolTip: "Qur'ah hanya ce ta gargajiya ta jefa kuri mai tsarki a tsakanin al'ummomin Afirka da na Larabawa domin yanke shawara ba tare da son zuciya ba, neman albarka da gano hanyoyi mafi kyau.",
    tabs: {
      cauris: "Jefa Kuri (Cauris)",
      caurisDesc: "Jefa dukan kuri da karanta sa'a",
      azlam: "Sandunan Azlam",
      azlamDesc: "Karamin duba ta hanyar tsintar katakon azlam",
      dial: "Agogon Yanke Shawara",
      dialDesc: "Babban fayafai mai juyawa domin gano abin da ya dace",
    },
    common: {
      questionPlaceholder: "Rubuta tambayarka ko niyyarka (misali: Shin in fara wannan aiki?)",
      intentionLabel: "Fannin Shawara",
      intentionDomains: {
        general: "Na Baki Daya & Daidaito",
        love: "Aure, Soyayya & Zaman Lafiya",
        business: "Kasuwa, Aiki & Arziki",
        health: "Lafiyar Jiki & Karfi",
        protection: "Kariya & Tafiye-tafiye",
        spiritual: "Hanyar Ruhaniya & Wirdin Sa'a",
      },
      spin: "Juyar da Fayafai",
      toss: "Jefa Kuri",
      pullStick: "Ciro Sandan Katako",
      shakeBox: "Girgiza Akwatin Sanduna (Miqlah)",
      reset: "Sake Fara Sabo",
      copy: "Kwali Sakamako",
      copied: "An kwafa cikin nasara!",
      export: "Fitar da Hoton Sakamako",
      verdict: "Hukuncin Ruhaniya",
      advice: "Jagora & Shawara",
      dhikr: "Addu'a da Ambaton Allah (Dhikri)",
      sadaka: "Sadaka da Ake Bukatar Badawa (Saraka)",
      element: "Tabi'ar Sinadari",
      favorable: "Akwai Nasara Sosai",
      unfavorable: "A Yi Hattara / A Dakata",
      neutral: "A Juta A Jira",
      customChoices: "Zabubbukan Kanka",
      addChoice: "Kara Wani Zabi",
      removeChoice: "Cire",
    },
    cauris: {
      title: "Duban Kuri na Gargajiya (Kuri)",
      subtitle: "Binciken budewar kuri ko rufewarsa na gargajiya",
      modes: {
        mode4: "Duba Mai Sauri (Kuri 4)",
        mode8: "Duba Mai Tsakiya (Kuri 8)",
        mode16: "Babban Duban Gargajiya (Kuri 16)",
      },
      instructions: "Ka sa kyakkyawan niyya a zuciya, sannan ka danna 'Jefa Kuri'. Zaka iya danna kowanne kuri domin juye fuskarsa (A bude / A rufe).",
      openLabel: "A Bude (Baki)",
      closedLabel: "A Rufe (Baya)",
      toggleHelp: "Danna kowane kuri domin juyar da fuskarsa.",
      results: {
        kole: {
          name: "Kole (Kuri 4 a Rufe)",
          arabicName: "الكتمان والإنغلاق",
          verdict: "Hattara & Sirri a Yanzu",
          summary: "Dukan kuri 4 sun fadi a rufe. Kofofi a rufe ko jinkiri mai alheri.",
          details: "Wannan yana nuna bukatar sirri da kariya a yanzu. Kada ka yi hanzarin yanke shawara mai karfi. Yi sadaka domin bude hanya.",
          sadaka: "Bada madara danya ko gurasa fari ga mabukata.",
          dhikr: "Ya Hafiz (Mai Kariya) - So 111",
          element: "Kasa (Hakuri da Kafuwa)",
        },
        afaa: {
          name: "Afaa (Kuri 1 a Bude / 3 a Rufe)",
          arabicName: "الإقبال والبريق",
          verdict: "Haske na Farko & Fara Fitowar Sa'a",
          summary: "Kuri guda daya ya bude zuwa sama. Alamar alheri idan aka bi a hankali.",
          details: "Kofa ta farko ta bude. Wannan alama ce ta samun sauki bayan duhu. Ka bi mataki-mataki ba tare da gaggawa ba.",
          sadaka: "Bada dabino ko 'ya'yan itace masu zaki.",
          dhikr: "Ya Nur (Mai Haske) - So 256",
          element: "Iska (Fahimta da Magana)",
        },
        eji: {
          name: "Eji (Kuri 2 a Bude / 2 a Rufe)",
          arabicName: "الميزان والوفاق",
          verdict: "Daidaito Mai Kyau & Zaman Lafiya",
          summary: "Daidaito tsakanin na bude da na rufe. Zaman lafiya da jituwa.",
          details: "Eji alama ce ta zaman lafiya, yarjejeniya mai kyau, kulla aure da warware sabani tsakanin mutane.",
          sadaka: "Ciyar da abinci ga iyalinka ko bada ruwan sha.",
          dhikr: "Ya Salam (Mai Aminci) - So 131",
          element: "Ruwa (Sada Harshe da Tarayya)",
        },
        eta: {
          name: "Eta (Kuri 3 a Bude / 1 a Rufe)",
          arabicName: "الحركة والتمكين",
          verdict: "Motsi Mai Karfi & Nasara",
          summary: "Kuri guda uku a bude suna kiran gudanar da aiki cikin karfin gwiwa.",
          details: "Karfi yana kan kololuwa. Matsoli za su kau gaban jajircewa. Wannan lokaci ne mai kyau na aiwatar da aiki.",
          sadaka: "Bada hatsi ko shinkafa ga talakawa.",
          dhikr: "Ya Qawiy (Mai Karfi) - So 116",
          element: "Wuta (Motsi da Karfin Niyya)",
        },
        ero: {
          name: "Ero (Kuri 4 a Bude)",
          arabicName: "الفتح المبين",
          verdict: "Babban Bude Kofa & Nasara Mai Girma",
          summary: "Dukan kuri 4 sun fuskanci sama. Nasara da albarka mara iyaka.",
          details: "Kofofi sun bude baki daya. Addu'o'inka sun samu karbuwa kuma al'amuranka suna samun goyon bayan sammai. Nuna godiya ga Allah.",
          sadaka: "Bada sadakar kudi da farinciki ko tufafi sababbi.",
          dhikr: "Ya Fattah (Mai Bude Kofofi) - So 489",
          element: "Hasken Sama (Kwanciyar Hankali)",
        },
        majority_closed: {
          name: "Rinjayen Duhi (Mafi Yawa a Rufe)",
          arabicName: "غلبة الظل",
          verdict: "A Yi Hattara",
          summary: "Mafi yawan kuri sun fado a rufe.",
          details: "Al'amuran suna bukatar taka tsantsan. Ka gyara gida kafin ka cigaba.",
          sadaka: "Gurasa da kyandir fari.",
          dhikr: "Ya Latif - So 129",
          element: "Kasa",
        },
        balanced: {
          name: "Daidaito Mai Kyau (Kuri Daidai)",
          arabicName: "الاعتدال التام",
          verdict: "Lafiya da Kafuwa",
          summary: "Daidaito tsakanin na bude da na rufe.",
          details: "Karfi yana gudana lami lafiya. Cigaba da amincewa da gaskiya.",
          sadaka: "Ruwa mai kyau da irin shuka.",
          dhikr: "Ya Wahhab - So 14",
          element: "Ruwa da Iska",
        },
        majority_open: {
          name: "Rinjayen Haske (Mafi Yawa a Bude)",
          arabicName: "غلبة النور",
          verdict: "Nasarar Sa'a",
          summary: "Mafi yawan kuri sun bude bakinsu.",
          details: "Haske mai yawa yana kan hanyarka. Niyya ta gaskiya za ta samu biyan bukata cikin sauri.",
          sadaka: "Bada dabino da zuma.",
          dhikr: "Ya Karim - So 270",
          element: "Wuta da Haske",
        },
      },
    },
    azlam: {
      title: "Binciken Sandunan Azlam (Azlam)",
      subtitle: "Tsintar sandunan katako domin yanke shawara",
      modes: {
        mode3: "Zaɓin Sanduna 3",
        mode7: "Zaɓin Sanduna 7",
      },
      instructions: "Girgiza akwatin sandunan katako (Miqlah), sannan ka zabi sandan guda daya domin samun amsa nan take.",
      sticks: {
        amr: {
          name: "Al-Amr (Umarni)",
          arabicName: "الأمر بالإقدام",
          verdict: "YI AIKI / CIGABA",
          summary: "Alamar cewa hanya a bude take. Cigaba da gaba gadi.",
          proverb: "Aikin da aka gina shi da kyakkyawan niyya yana rusa dukan shakku.",
          strategy: "Kada ka sake jinkirtawa. Fara gudanar da shirye-shiryenka a yau.",
          element: "Wuta",
        },
        nahy: {
          name: "An-Nahy (Hani)",
          arabicName: "النهي والامتناع",
          verdict: "DAKATA / KAR A YI",
          summary: "Alamar gargadi. Kada ka cigaba a wannan hanya.",
          proverb: "Dakatawa a lokacin da ya dace ya fi nasara ta gaggawa dubu.",
          strategy: "Kare arzikinka kuma ka daga wannan shawara zuwa gaba.",
          element: "Kasa",
        },
        mutashabih: {
          name: "Al-Mutashabih (A Jira)",
          arabicName: "المتشابه والانتظار",
          verdict: "JIRA / SAKE DUBA",
          summary: "Al'amuran suna bukatar karamin lokaci. Sake gwadawa anjima.",
          proverb: "Idan hazo ya mamaye hanya, mai hikima yakan dakata.",
          strategy: "Yi shiru ka tsaya ka roki Allah agaji kafin ka sake tsintar sanda.",
          element: "Iska",
        },
        afa: {
          name: "Al-Afa (Yafiya da Zaman Lafiya)",
          arabicName: "العفو والصلح",
          verdict: "YAFE KO SADA HARSHE",
          summary: "Yi amfani da rahama, yafiya da zaman lafiya tsakanin mutane.",
          proverb: "Mutum mai yafiya yana bude zuciyar da ke kulle.",
          strategy: "Fara daukar matakin zaman lafiya da kawar da kiyayya.",
          element: "Ruwa",
        },
        mahl: {
          name: "Al-Mahl (Hakuri da Jinkiri)",
          arabicName: "المهلة والتريث",
          verdict: "BUKATAR HAKURI",
          summary: "Bar al'amura su nuna da kansu ba tare da tursasa kowa ba.",
          proverb: "Ya'yan itacen da aka tsinta da wuri ba sa yin dadi.",
          strategy: "Bada lokaci ga lamarin kuma ka kasance cikin kwanciyar hankali.",
          element: "Kasa",
        },
        rizq: {
          name: "Ar-Rizq (Arziki da Albarka)",
          arabicName: "الرزق والبركة",
          verdict: "ARZIKI MAI TABBAS",
          summary: "Albarka ta kudi, ta jiki da ta ruhaniya tana tafe.",
          proverb: "Godiya ga Allah tana janyo karin albarka.",
          strategy: "Maraba da arzikin kuma ka bada sadaka domin karuwar fa'ida.",
          element: "Ruwa da Kasa",
        },
        safar: {
          name: "As-Safar (Tafiya da Sauyi)",
          arabicName: "السفر والتغيير",
          verdict: "TAFIYA KO SAUYI",
          summary: "Sauya wuri ko muhalli shike kawo mafita ga wannan matsala.",
          proverb: "Ruwan da bai motsi yana lalacewa, amma ruwan da ke gudu yana zama mai tsarki.",
          strategy: "Yi tunanin tafiya ko sauya wuri ko sabon tunani.",
          element: "Iska",
        },
        wafa: {
          name: "Al-Wafa (Cika Alkawari)",
          arabicName: "الوفاء بالعهد",
          verdict: "CIKA ALKAWARI",
          summary: "Cika alkawuran da ka dauka. Nasara tana tare da cika alkawari.",
          proverb: "Rikon amana shi ne gaba-gaba a daukakar dan adam.",
          strategy: "Tsayu akan maganarka da alkawuran ruhaniya.",
          element: "Wuta",
        },
      },
    },
    dial: {
      title: "Agogon Yanke Shawara (Qur'ah Dairah)",
      subtitle: "Fayafai mai juyawa domin warware tambayoyi",
      presets: {
        binary: "Yanke Shawara Caza (Eh / A'a / Jira / Sadaka)",
        strategic: "Hanyoyin Duba Strategics (Hanyoyi 6)",
        daily: "Ganin Sa'ar Yau",
        custom: "Tsarin Kanka",
      },
      instructions: "Yi tambayarka a zuciya, ka zabi irin agogon da kake so, sannan ka danna 'Juyar da Fayafai' domin tsayar da kibiya.",
      spinningText: "Agogon yana juyawa...",
      presetItems: {
        binary: [
          "Eh - Cigaba Cikin Yarda",
          "A'a - Guje wa & Kare Kanka",
          "Jira - Bukatar Lokaci",
          "Sadaka - Bada Saraka da Farko",
        ],
        strategic: [
          "Gudanar da Aiki kai tsaye",
          "Tattaunawa & Tarayya",
          "Hattara & Janye Jiki",
          "Addu'a & Neman Shawara",
          "Kulla Abota Mai Albarka",
          "Hutawa & Yin Nazari",
        ],
        daily: [
          "Babban Nasarar Sa'a",
          "Hattara da Fitar Kudi",
          "Albarka ta Ba-Zata",
          "Ana Bukatar Hakuri",
          "Tsofe Zunubai da Tsarkakewa",
        ],
      },
      itemAdvice: {
        "Eh - Cigaba Cikin Yarda": {
          summary: "Alamomi sun nuna cewa hanya a bude take.",
          recommendation: "Aiwatar da shawararka ba tare da shakku ba.",
          dhikr: "Ya Wali (Mai Kariya) - So 47",
        },
        "A'a - Guje wa & Kare Kanka": {
          summary: "Wannan hanyar tana da hadari ko turjiya.",
          recommendation: "Mayar da hankali zuwa sauran abubuwa mafi aminci.",
          dhikr: "Ya Mani' (Mai Hanawa) - So 161",
        },
        "Jira - Bukatar Lokaci": {
          summary: "Al'amarin yana bukatar Karin lokaci da bayani.",
          recommendation: "Kada ka tursasa komai a yau.",
          dhikr: "Ya Sabur (Mai Hakuri) - So 100",
        },
        "Sadaka - Bada Saraka da Farko": {
          summary: "Patan sadaka kadan zai bude kwankwani a kulla.",
          recommendation: "Bada gurasa, ruwa ko kudi kafin ka gudanar da aiki.",
          dhikr: "Ya Karim (Mai Kyauta) - So 270",
        },
      },
    },
  },
};
