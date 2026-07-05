export interface AsmaName {
  ar: string;
  tr: string;
  fr: string;
  abjad: number;
  ref: string;
  quranOptions: {
    count?: number;
    surah: string;
    verse: string;
    excerptAr: string;
    excerptFr: string;
    context?: string;
  };
}

export const asmaListData: AsmaName[] = [
  {
    ar: "اللَّهُ",
    tr: "Allah",
    fr: "Le Dieu Absolu",
    abjad: 66,
    ref: "Nom suprême (Ism al-A'dham)",
    quranOptions: {
      count: 2698,
      surah: "Al-Fatihah",
      verse: "1",
      excerptAr: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      excerptFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
      context: "Le nom suprême de l'Essence (Dhat). Il contient l'énergie de tous les autres noms. Il invoque la globalité de la Présence divine."
    }
  },
  {
    ar: "الرَّحْمَٰنُ",
    tr: "Ar-Rahmān",
    fr: "Le Très Miséricordieux",
    abjad: 298,
    ref: "Miséricorde générale",
    quranOptions: {
      count: 57,
      surah: "Ta-Ha",
      verse: "5",
      excerptAr: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ",
      excerptFr: "Le Tout Miséricordieux S'est établi [Istawa] sur le Trône.",
      context: "La grâce de Rahman irrigue chaque atome de la création, indépendamment du mérite."
    }
  },
  {
    ar: "الرَّحِيمُ",
    tr: "Ar-Rahīm",
    fr: "Le Tout Miséricordieux",
    abjad: 258,
    ref: "Miséricorde spécifique",
    quranOptions: {
      count: 114,
      surah: "Al-Ahzab",
      verse: "43",
      excerptAr: "وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا",
      excerptFr: "Et Il est Miséricordieux envers les croyants.",
      context: "Une miséricorde continue, protectrice et ciblée pour le croyant sincère."
    }
  },
  {
    ar: "الْمَلِكُ",
    tr: "Al-Malik",
    fr: "Le Souverain",
    abjad: 90,
    ref: "Domination absolue",
    quranOptions: {
      count: 5,
      surah: "Ta-Ha",
      verse: "114",
      excerptAr: "فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ",
      excerptFr: "Que soit exalté Allah, le vrai Souverain !",
      context: "Révèle la maîtrise totale de l'Être Exalté sur les cieux et la terre."
    }
  },
  {
    ar: "الْقُدُّوسُ",
    tr: "Al-Quddūs",
    fr: "L'Infiniment Saint",
    abjad: 170,
    ref: "Pureté",
    quranOptions: {
      count: 2,
      surah: "Al-Jumu'ah",
      verse: "1",
      excerptAr: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ",
      excerptFr: "Ce qui est dans les cieux et ce qui est sur la terre glorifient Allah, le Souverain, le Pur...",
      context: "Le nom de l'aseptisation spirituelle. Al-Quddus transcende toute imperfection."
    }
  },
  {
    ar: "السَّلَامُ",
    tr: "As-Salām",
    fr: "La Paix",
    abjad: 131,
    ref: "Source de paix",
    quranOptions: {
      count: 42,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ",
      excerptFr: "C'est Lui Allah. Nulle divinité à part Lui, Le Souverain, Le Pur, L'Apaisant...",
      context: "L'apaisement absolu (As-Salam) protège de l'annihilation et équilibre le cosmos."
    }
  },
  {
    ar: "الْمُؤْمِنُ",
    tr: "Al-Mu'min",
    fr: "Le Fidèle, le Sécurisant",
    abjad: 136,
    ref: "Foi et sécurité",
    quranOptions: {
      count: 1,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ",
      excerptFr: "...L'Apaisant, Le Rassurant, Le Prédominant...",
      context: "Al-Mu'min insuffle la lumière de la certitude (Yaqin) dans le cœur effrayé."
    }
  },
  {
    ar: "الْمُهَيْمِنُ",
    tr: "Al-Muhaymin",
    fr: "Le Surveillant",
    abjad: 145,
    ref: "Protection",
    quranOptions: {
      count: 1,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ",
      excerptFr: "...Le Rassurant, Le Prédominant, Le Tout Puissant...",
      context: "Celui qui englobe toute chose de Son observation de manière protectrice."
    }
  },
  {
    ar: "الْعَزِيزُ",
    tr: "Al-'Azīz",
    fr: "Le Tout Puissant",
    abjad: 94,
    ref: "Puissance et dignité",
    quranOptions: {
      count: 92,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ",
      excerptFr: "...Le Prédominant, Le Tout Puissant, Le Contraignant...",
      context: "Nom de victoires imposantes, offrant le prestige (Hayba) et un statut d'invulnérabilité."
    }
  },
  {
    ar: "الْجَبَّارُ",
    tr: "Al-Jabbār",
    fr: "Celui qui domine et contraint",
    abjad: 206,
    ref: "Restauration et force",
    quranOptions: {
      count: 1,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
      excerptFr: "...Le Tout Puissant, Le Contraignant, Le Superbe.",
      context: "L'énergie divine qui redresse les destins courbés et répare les fractures de l'âme."
    }
  },
  {
    ar: "الْمُتَكَبِّرُ",
    tr: "Al-Mutakabbir",
    fr: "Le Superbe",
    abjad: 662,
    ref: "Grandeur",
    quranOptions: {
      count: 1,
      surah: "Al-Hashr",
      verse: "23",
      excerptAr: "الْجَبَّارُ الْمُتَكَبِّرُ ۚ سُبْحَانَ اللَّهِ",
      excerptFr: "...Le Contraignant, Le Superbe. Gloire à Allah...",
      context: "Le nom de l'Exaltation infinie, dépouillant l'Ego (Nafs) de ses prétentions à la grandeur."
    }
  },
  {
    ar: "الْخَالِقُ",
    tr: "Al-Khāliq",
    fr: "Le Créateur",
    abjad: 731,
    ref: "Création ex-nihilo",
    quranOptions: {
      count: 8,
      surah: "Al-Hashr",
      verse: "24",
      excerptAr: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ",
      excerptFr: "C'est Lui Allah, le Créateur, Celui qui donne un commencement...",
      context: "Le grand concepteur qui invente à partir du néant absolu ('Adham)."
    }
  },
  {
    ar: "الْبَارِئُ",
    tr: "Al-Bāri'",
    fr: "Le Producteur",
    abjad: 213,
    ref: "Conception",
    quranOptions: {
      count: 3,
      surah: "Al-Hashr",
      verse: "24",
      excerptAr: "الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ",
      excerptFr: "...le Créateur, Celui qui donne un commencement, le Formateur.",
      context: "C'est le processus actif de concrétisation et de détachement du chaos pur."
    }
  },
  {
    ar: "الْمُصَوِّرُ",
    tr: "Al-Musawwir",
    fr: "Le Formateur",
    abjad: 336,
    ref: "Forme et Beauté",
    quranOptions: {
      count: 1,
      surah: "Al-Hashr",
      verse: "24",
      excerptAr: "الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ",
      excerptFr: "...Celui qui donne commencement à toute chose, le Formateur. À Lui les plus beaux Noms.",
      context: "L'artiste cosmique qui donne la forme (Sura) individuelle et esthétique."
    }
  },
  {
    ar: "الْغَفَّارُ",
    tr: "Al-Ghaffār",
    fr: "Le Grand Pardonneur",
    abjad: 1281,
    ref: "Pardon infini",
    quranOptions: {
      count: 5,
      surah: "Nuh",
      verse: "10",
      excerptAr: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا",
      excerptFr: "J'ai dit : Implorez le pardon de votre Seigneur, car Il est grand Pardonneur.",
      context: "Absout répétitivement sans se lasser et dissout le karma obscur."
    }
  },
  {
    ar: "الْقَهَّارُ",
    tr: "Al-Qahhār",
    fr: "Le Tout Dominateur",
    abjad: 306,
    ref: "Soumission des éléments",
    quranOptions: {
      count: 6,
      surah: "Yusuf",
      verse: "39",
      excerptAr: "أَأَرْبَابٌ مُّتَفَرِّقُونَ خَيْرٌ أَمِ اللَّهُ الْوَاحِدُ الْقَهَّارُ",
      excerptFr: "Qui est le meilleur : des seigneurs multiples, ou Dieu, l'Unique, le Dominateur suprême?",
      context: "Force colossale de Majesté. Al-Qahhar écrase toute rébellion."
    }
  },
  {
    ar: "الْوَهَّابُ",
    tr: "Al-Wahhāb",
    fr: "Le Très Généreux",
    abjad: 14,
    ref: "Dons continus",
    quranOptions: {
      count: 3,
      surah: "Ali 'Imran",
      verse: "8",
      excerptAr: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا... وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
      excerptFr: "Accorde-nous Ta miséricorde, car C'est Toi le Dispensateur de toutes grâces.",
      context: "Le don fulgurant sans contrepartie méritée, provoquant des ouvertures imprévues."
    }
  },
  {
    ar: "الرَّزَّاقُ",
    tr: "Ar-Razzāq",
    fr: "Le Pourvoyeur",
    abjad: 308,
    ref: "Subsistance",
    quranOptions: {
      count: 1,
      surah: "Adh-Dhariyat",
      verse: "58",
      excerptAr: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
      excerptFr: "En vérité, c'est Allah qui est le grand Pourvoyeur, Le Détenteur de la force, l'Inébranlable.",
      context: "Le fleuve intarissable attirant le Rizq matériel et spirituel."
    }
  },
  {
    ar: "الْفَتَّاحُ",
    tr: "Al-Fattāh",
    fr: "Celui qui accorde la victoire",
    abjad: 489,
    ref: "Ouverture des portes",
    quranOptions: {
      count: 1,
      surah: "Saba",
      verse: "26",
      excerptAr: "ثُمَّ يَفْتَحُ بَيْنَنَا بِالْحَقِّ وَهُوَ الْفَتَّاحُ الْعَلِيمُ",
      excerptFr: "...Puis, Il tranchera entre nous avec justice, car Il est le grand Juge Suprême (Fattah), l'Omniscient.",
      context: "Tranche les conflits indécis et débloque toutes les impasses."
    }
  },
  {
    ar: "الْعَلِيمُ",
    tr: "Al-'Alīm",
    fr: "L'Omniscient",
    abjad: 150,
    ref: "Savoir absolu",
    quranOptions: {
      count: 153,
      surah: "Al-Baqarah",
      verse: "32",
      excerptAr: "قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا ۖ إِنَّكَ أَنتَ الْعَلِيمُ الْحَكِيمُ",
      excerptFr: "Ils dirent : Gloire à Toi ! Nous n'avons de savoir que ce que Tu nous as appris. Certes Toi, Tu es l'Omniscient, le Sage.",
      context: "L'intelligence pénétrant les secrets microscopiques du réel."
    }
  },
  {
    ar: "الْقَابِضُ",
    tr: "Al-Qābid",
    fr: "Celui qui retient",
    abjad: 903,
    ref: "Rétention",
    quranOptions: {
      count: 0,
      surah: "Al-Baqarah",
      verse: "245",
      excerptAr: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ",
      excerptFr: "Et c'est Allah qui retient (Yaqbid) et qui étend (Yabsut), et c'est vers Lui que vous retournerez.",
      context: "Maîtrise le balancier existentiel de la restriction (Qabd) et pacifie les passions."
    }
  },
  {
    ar: "الْبَاسِطُ",
    tr: "Al-Bāsit",
    fr: "Celui qui étend",
    abjad: 72,
    ref: "Extension de la subsistance",
    quranOptions: {
      count: 0,
      surah: "Al-Baqarah",
      verse: "245",
      excerptAr: "وَاللَّهُ يَقْبِضُ وَيَبْسُطُ وَإِلَيْهِ تُرْجَعُونَ",
      excerptFr: "Et c'est Allah qui retient (Yaqbid) et qui étend (Yabsut)...",
      context: "Apporteur d'Ouverture et d'allégresse matérielle ou de l'âme."
    }
  },
  {
    ar: "الْخَافِضُ",
    tr: "Al-Khāfid",
    fr: "Celui qui abaisse",
    abjad: 1481,
    ref: "L'abaissement des orgueilleux",
    quranOptions: {
      count: 0,
      surah: "Al-Waqi'ah",
      verse: "3",
      excerptAr: "خَافِضَةٌ رَّافِعَةٌ",
      excerptFr: "Il abaissera les uns, élèvera les autres.",
      context: "Le nom de la justice corrective abaissant l'arrogance des tyrans."
    }
  },
  {
    ar: "الرَّافِعُ",
    tr: "Ar-Rāfi'",
    fr: "Celui qui élève",
    abjad: 351,
    ref: "Élévation spirituelle et matérielle",
    quranOptions: {
      count: 0,
      surah: "Al-Mu'min",
      verse: "15",
      excerptAr: "رَفِيعُ الدَّرَجَاتِ ذُو الْعَرْشِ",
      excerptFr: "Il est Celui qui est infiniment élevé en degrés, Seigneur du Trône.",
      context: "Élève les statuts sociaux, les consciences, et accorde l'estime générale."
    }
  },
  {
    ar: "الْمُعِزُّ",
    tr: "Al-Mu'izz",
    fr: "Celui qui donne la puissance",
    abjad: 117,
    ref: "Honneur et dignité",
    quranOptions: {
      count: 0,
      surah: "Ali 'Imran",
      verse: "26",
      excerptAr: "وَتُعِزُّ mَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ",
      excerptFr: "Tu donnes la puissance à qui Tu veux, et Tu humilies qui Tu veux.",
      context: "Enveloppe le zâkir d'une aura de prestance respectée."
    }
  },
  {
    ar: "الْمُذِلُّ",
    tr: "Al-Mudhill",
    fr: "Celui qui humilie",
    abjad: 770,
    ref: "Protection contre les tyrans",
    quranOptions: {
      count: 0,
      surah: "Ali 'Imran",
      verse: "26",
      excerptAr: "وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ",
      excerptFr: "Tu donnes la puissance à qui Tu veux, et Tu humilies qui Tu veux...",
      context: "Neutralise l'égo surdimensionné des oppresseurs et protège le faible."
    }
  },
  {
    ar: "السَّمِيعُ",
    tr: "As-Samī'",
    fr: "L'Audient",
    abjad: 180,
    ref: "Écoute absolue",
    quranOptions: {
      count: 45,
      surah: "Al-Baqarah",
      verse: "127",
      excerptAr: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
      excerptFr: "Seigneur, accepte ceci de notre part, car c'est Toi l'Audient, l'Omniscient.",
      context: "L'écoute subtile percevant chaque vibration intime pour l'exaucer."
    }
  },
  {
    ar: "الْبَصِيرُ",
    tr: "Al-Basīr",
    fr: "Le Voyant",
    abjad: 302,
    ref: "Vision totale",
    quranOptions: {
      count: 42,
      surah: "Al-Baqarah",
      verse: "110",
      excerptAr: "إِنَّ اللَّهَ بِمَا تَعْمَلُونَ بَصِيرٌ",
      excerptFr: "Certes, Allah observe parfaitement ce que vous faites.",
      context: "Perce les secrets des cœurs et aiguise la clairvoyance."
    }
  },
  {
    ar: "الْحَكَمُ",
    tr: "Al-Hakam",
    fr: "Le Juge",
    abjad: 68,
    ref: "Arbitrage suprême",
    quranOptions: {
      count: 0,
      surah: "Al-An'am",
      verse: "114",
      excerptAr: "أَفَغَيْرَ اللَّهِ أَبْتَغِي حَكَمًا",
      excerptFr: "Chercherai-je un autre juge qu'Allah ?",
      context: "Rétablit l'équilibre légitime dans les litiges les plus complexes."
    }
  },
  {
    ar: "الْعَدْلُ",
    tr: "Al-'Adl",
    fr: "Le Juste",
    abjad: 104,
    ref: "Justice équitable",
    quranOptions: {
      count: 0,
      surah: "Al-An'am",
      verse: "115",
      excerptAr: "وَتَمَّتْ كَلِمَتُ رَبِّكَ صِدْقًا وَعَدْلًا",
      excerptFr: "La parole de ton Seigneur s'est accomplie en toute vérité et justice.",
      context: "L'équité universelle régissant les destins et harmonisant les forces."
    }
  },
  {
    ar: "اللَّطِيفُ",
    tr: "Al-Latīf",
    fr: "Le Subtil",
    abjad: 129,
    ref: "Grâce imperceptible",
    quranOptions: {
      count: 7,
      surah: "Al-An'am",
      verse: "103",
      excerptAr: "لَّا تُدْرِكُهُ الْأَبْصَارُ وَهُوَ يُدْرِكُ الْأَبْصَارَ ۖ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
      excerptFr: "Les regards ne peuvent l'atteindre, cependant qu'Il saisit tous les regards. Et Il est le Subtil, le Parfaitement Connaisseur.",
      context: "Bénit de Sa douceur subtile, résolvant les crises sans aucun heurt."
    }
  },
  {
    ar: "الْخَبِيرُ",
    tr: "Al-Khabīr",
    fr: "Le Très-Instruit",
    abjad: 812,
    ref: "Connaissance intime",
    quranOptions: {
      count: 45,
      surah: "Al-An'am",
      verse: "103",
      excerptAr: "وَهُوَ اللَّطِيفُ الْخَبِيرُ",
      excerptFr: "Et Il est le Subtil, le Parfaitement Connaisseur.",
      context: "Dévoile les mystères profonds des situations et démasque les complots."
    }
  },
  {
    ar: "الْحَلِيمُ",
    tr: "Al-Halīm",
    fr: "Le Très Clément",
    abjad: 88,
    ref: "Patience et mansuétude",
    quranOptions: {
      count: 15,
      surah: "Al-Baqarah",
      verse: "225",
      excerptAr: "وَاللَّهُ غَفُورٌ حَلِيمٌ",
      excerptFr: "Et Allah est Pardonneur et Plein de mansuétude.",
      context: "Apaise toute tension nerveuse, insuffle le calme et la patience."
    }
  },
  {
    ar: "الْعَظِيمُ",
    tr: "Al-'Azīm",
    fr: "L'Immense",
    abjad: 1020,
    ref: "Grandeur absolue",
    quranOptions: {
      count: 9,
      surah: "Al-Baqarah",
      verse: "255",
      excerptAr: "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      excerptFr: "Et Il est le Très Haut, l'Immense.",
      context: "La splendeur cosmique protégeant l'esprit et fortifiant la moralité."
    }
  },
  {
    ar: "الْغَفُورُ",
    tr: "Al-Ghafūr",
    fr: "Le Tout-Pardonneur",
    abjad: 1286,
    ref: "Pardon inconditionnel",
    quranOptions: {
      count: 91,
      surah: "Al-Baqarah",
      verse: "173",
      excerptAr: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
      excerptFr: "Certes, Allah est Pardonneur et Miséricordieux.",
      context: "Absout les fardeaux psychiques et apporte une paix lumineuse."
    }
  },
  {
    ar: "الشَّكُورُ",
    tr: "Ash-Shakūr",
    fr: "Le Très-Reconnaissant",
    abjad: 526,
    ref: "Multiplication des récompenses",
    quranOptions: {
      count: 4,
      surah: "Fatir",
      verse: "30",
      excerptAr: "إِنَّهُ غَفُورٌ شَكُورٌ",
      excerptFr: "Il est certes Pardonneur et Reconnaissant.",
      context: "Multiplie vos efforts modestes en de colossales bénédictions."
    }
  },
  {
    ar: "الْعَلِيُّ",
    tr: "Al-'Aliyy",
    fr: "Le Très Haut",
    abjad: 110,
    ref: "Élévation absolue",
    quranOptions: {
      count: 11,
      surah: "Al-Baqarah",
      verse: "255",
      excerptAr: "وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      excerptFr: "Et Il est le Très Haut, l'Immense.",
      context: "Élève par-dessus les conflits d'ici-bas vers les sommets spirituels."
    }
  },
  {
    ar: "الْكَبِيرُ",
    tr: "Al-Kabīr",
    fr: "Le Très Grand",
    abjad: 232,
    ref: "Majesté infinie",
    quranOptions: {
      count: 6,
      surah: "Ar-Ra'd",
      verse: "9",
      excerptAr: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ",
      excerptFr: "Le Connaisseur de l'invisible et du visible, le Grand, le Sublime.",
      context: "Affirme l'autorité morale et dissipe l'intimidation par les tyrans."
    }
  },
  {
    ar: "الْحَفِيظُ",
    tr: "Al-Hafīz",
    fr: "Le Gardien",
    abjad: 998,
    ref: "Protection infaillible",
    quranOptions: {
      count: 3,
      surah: "Hud",
      verse: "57",
      excerptAr: "إِنَّ رَبِّي عَلَىٰ كُلِّ شَيْءٍ حَفِيظٌ",
      excerptFr: "Certes, mon Seigneur veille sur toute chose.",
      context: "Le rempart céleste protégeant contre les maladies, vols et calamités."
    }
  },
  {
    ar: "الْمُقِيتُ",
    tr: "Al-Muqīt",
    fr: "Le Nourrisseur",
    abjad: 550,
    ref: "Subsistance physique et spirituelle",
    quranOptions: {
      count: 1,
      surah: "An-Nisa",
      verse: "85",
      excerptAr: "وَكَانَ اللَّهُ عَلَىٰ كُلِّ شَيْءٍ مُّقِيتًا",
      excerptFr: "Et Allah est le Gardien et le Pourvoyeur de toute chose.",
      context: "Garantit que chaque créature reçoit son apport quotidien légitime."
    }
  },
  {
    ar: "الْحَسِيبُ",
    tr: "Al-Hasīb",
    fr: "Celui qui réclame des comptes",
    abjad: 80,
    ref: "Protection et suffisance",
    quranOptions: {
      count: 4,
      surah: "An-Nisa",
      verse: "6",
      excerptAr: "وَكَفَىٰ بِاللَّهِ حَسِيبًا",
      excerptFr: "Et Allah suffit pour tenir les comptes.",
      context: "La suffisance absolue de l'invocateur face à l'inquiétude."
    }
  },
  {
    ar: "الْجَلِيلُ",
    tr: "Al-Jalīl",
    fr: "Le Majestueux",
    abjad: 73,
    ref: "Splendeur et dignité",
    quranOptions: {
      count: 0,
      surah: "Ar-Rahman",
      verse: "27",
      excerptAr: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
      excerptFr: "Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse.",
      context: "Inculque la révérence et le respect dans le cœur de l'entourage."
    }
  },
  {
    ar: "الْكَرِيمُ",
    tr: "Al-Karīm",
    fr: "Le Tout-Généreux",
    abjad: 270,
    ref: "Générosité illimitée",
    quranOptions: {
      count: 3,
      surah: "Al-Infitar",
      verse: "6",
      excerptAr: "مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ",
      excerptFr: "Qu'est-ce qui t'a trompé au sujet de ton Seigneur, le Généreux ?",
      context: "Ouvre l'abondance matérielle et dissipe l'égoïsme ou l'avarice."
    }
  },
  {
    ar: "الرَّقِيبُ",
    tr: "Al-Raqīb",
    fr: "Le Vigilant",
    abjad: 312,
    ref: "Surveillance aimante",
    quranOptions: {
      count: 3,
      surah: "An-Nisa",
      verse: "1",
      excerptAr: "إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا",
      excerptFr: "Certes, Allah vous observe parfaitement.",
      context: "Protège le foyer et l'intimité familiale en votre absence."
    }
  },
  {
    ar: "الْمُجِيبُ",
    tr: "Al-Mujīb",
    fr: "Celui qui exauce",
    abjad: 55,
    ref: "Exaucement",
    quranOptions: {
      count: 1,
      surah: "Hud",
      verse: "61",
      excerptAr: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ",
      excerptFr: "Mon Seigneur est tout proche et Il répond toujours.",
      context: "Le secours immédiat accordé à l'invocateur dans le besoin."
    }
  },
  {
    ar: "الْوَاسِعُ",
    tr: "Al-Wāsi'",
    fr: "L'Ample",
    abjad: 137,
    ref: "Expansion illimitée",
    quranOptions: {
      count: 9,
      surah: "Al-Baqarah",
      verse: "115",
      excerptAr: "إِنَّ اللَّهَ وَاسِعٌ عَلِيمٌ",
      excerptFr: "Certes, Allah est Immense et Omniscient.",
      context: "L'élargissement de l'esprit, des finances et de la patience divine."
    }
  },
  {
    ar: "الْحَكِيمُ",
    tr: "Al-Hakīm",
    fr: "Le Sage",
    abjad: 78,
    ref: "Sagesse supérieure",
    quranOptions: {
      count: 97,
      surah: "Al-Baqarah",
      verse: "32",
      excerptAr: "إِنَّكَ أَنتَ الْعَلِيمُ الْحَكِيمُ",
      excerptFr: "Certes c'est Toi l'Omniscient, le Sage.",
      context: "Permet de discerner la raison cachée derrière les voiles du destin."
    }
  },
  {
    ar: "الْوَدُودُ",
    tr: "Al-Wadūd",
    fr: "Le Tout Aimant",
    abjad: 20,
    ref: "Amour divin",
    quranOptions: {
      count: 2,
      surah: "Hud",
      verse: "90",
      excerptAr: "إِنَّ رَبِّي رَحِيمٌ وَدُودٌ",
      excerptFr: "Mon Seigneur est Miséricordieux et très Aimant.",
      context: "Diffuse l'harmonie et l'attraction affective saine au sein des couples."
    }
  },
  {
    ar: "الْمَجِيدُ",
    tr: "Al-Majīd",
    fr: "Le Très Glorieux",
    abjad: 57,
    ref: "Gloire et noblesse",
    quranOptions: {
      count: 4,
      surah: "Hud",
      verse: "73",
      excerptAr: "إِنَّهُ حَمِيدٌ مَّجِيدٌ",
      excerptFr: "Il est certes digne de louange et de gloire.",
      context: "Guérit l'amour-propre et purifie la lignée des tares morales."
    }
  },
  {
    ar: "الْبَاعِثُ",
    tr: "Al-Bā'ith",
    fr: "Celui qui ressuscite",
    abjad: 573,
    ref: "Résurrection",
    quranOptions: {
      count: 0,
      surah: "Yasin",
      verse: "12",
      excerptAr: "إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ",
      excerptFr: "C'est Nous qui ressuscitons les morts...",
      context: "Insuffle un renouveau aux projets éteints ou à la foi défaillante."
    }
  },
  {
    ar: "الشَّهِيدُ",
    tr: "Ash-Shahīd",
    fr: "Le Témoin",
    abjad: 319,
    ref: "Témoignage universel",
    quranOptions: {
      count: 18,
      surah: "Al-Buruj",
      verse: "9",
      excerptAr: "وَاللَّهُ عَلَىٰ كُلِّ شَيْءٍ شَهِيدٌ",
      excerptFr: "Et Allah est témoin de toute chose.",
      context: "La vérité absolue s'imposant devant les calomnies ou faux témoignages."
    }
  },
  {
    ar: "الْحَقُّ",
    tr: "Al-Haqq",
    fr: "Le Vrai",
    abjad: 108,
    ref: "Vérité absolue",
    quranOptions: {
      count: 227,
      surah: "Al-Hajj",
      verse: "6",
      excerptAr: "ذَٰلِكَ بِأَنَّ اللَّهَ هُوَ الْحَقُّ وَأَنَّهُ يُحْيِي الْمَوْتَىٰ",
      excerptFr: "Il en est ainsi parce qu'Allah est le Vrai (Al-Haqq) et que c'est Lui qui redonne la vie aux morts.",
      context: "Établit fermement la réalité spirituelle face aux illusions trompeuses."
    }
  },
  {
    ar: "الْوَكِيلُ",
    tr: "Al-Wakīl",
    fr: "Le Tuteur / Garant",
    abjad: 66,
    ref: "Garant absolu",
    quranOptions: {
      count: 14,
      surah: "Al-An'am",
      verse: "102",
      excerptAr: "وَهُوَ عَلَىٰ كُلِّ شَيْءٍ وَكِيلٌ",
      excerptFr: "Et Il est le Garant / Tuteur de toute chose.",
      context: "S'en remettre entièrement à Lui pour décharger ses angoisses et soucis."
    }
  },
  {
    ar: "الْقَوِيُّ",
    tr: "Al-Qawiyy",
    fr: "Le Fort",
    abjad: 116,
    ref: "Force absolue",
    quranOptions: {
      count: 9,
      surah: "Al-Anfal",
      verse: "52",
      excerptAr: "إِنَّ اللَّهَ قَوِيٌّ شَدِيدُ الْعِقَابِ",
      excerptFr: "Certes, Allah est fort et redoutable en châtiment.",
      context: "Donne une vigueur physique et une résistance mentale sans égale."
    }
  },
  {
    ar: "الْمَتِينُ",
    tr: "Al-Matin",
    fr: "L'Inébranlable",
    abjad: 500,
    ref: "Fermeté absolue",
    quranOptions: {
      count: 1,
      surah: "Adh-Dhariyat",
      verse: "58",
      excerptAr: "إِنَّ اللَّهَ هُوَ الرَّزَّاقُ ذُو الْقُوَّةِ الْمَتِينُ",
      excerptFr: "En vérité, c'est Allah qui est le grand Pourvoyeur, Le Détenteur de la force, l'Inébranlable.",
      context: "La solidité suprême résistant à toutes les pressions émotives."
    }
  },
  {
    ar: "الْوَلِيُّ",
    tr: "Al-Waliyy",
    fr: "Le Protecteur",
    abjad: 46,
    ref: "Allié spirituel",
    quranOptions: {
      count: 11,
      surah: "Al-Baqarah",
      verse: "257",
      excerptAr: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا",
      excerptFr: "Allah est le Protecteur de ceux qui ont la foi.",
      context: "Fait jaillir des soutiens de l'invisible et assure l'amitié sincère."
    }
  },
  {
    ar: "الْحَمِيدُ",
    tr: "Al-Hamīd",
    fr: "Le Louable",
    abjad: 62,
    ref: "Louange infinie",
    quranOptions: {
      count: 17,
      surah: "Ibrahim",
      verse: "1",
      excerptAr: "إِلَىٰ صِرَاطِ الْعَزِيزِ الْحَمِيدِ",
      excerptFr: "...sur le chemin du Tout-Puissant, du digne de louange.",
      context: "Illumine la réputation et attire la considération méritée d'autrui."
    }
  },
  {
    ar: "الْمُحْصِي",
    tr: "Al-Muhsī",
    fr: "Celui qui tient les comptes",
    abjad: 148,
    ref: "Précision absolue",
    quranOptions: {
      count: 0,
      surah: "Maryam",
      verse: "94",
      excerptAr: "لَقَدْ أَحْصَاهُمْ وَعَدَّهُمْ عَدًّا",
      excerptFr: "Il les a répertoriés et dénombrés exactement.",
      context: "Aide à structurer l'esprit, à mémoriser les sciences sacrées."
    }
  },
  {
    ar: "الْمُبْدِئُ",
    tr: "Al-Mubdi'",
    fr: "L'Auteur",
    abjad: 56,
    ref: "Commencement de toute chose",
    quranOptions: {
      count: 0,
      surah: "Al-Buruj",
      verse: "13",
      excerptAr: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ",
      excerptFr: "C'est Lui qui commence la création et la recommence.",
      context: "Idéal pour lancer une nouvelle entreprise, un projet de vie."
    }
  },
  {
    ar: "الْمُعِيدُ",
    tr: "Al-Mu'īd",
    fr: "Celui qui fait revivre",
    abjad: 124,
    ref: "Restauration",
    quranOptions: {
      count: 0,
      surah: "Al-Buruj",
      verse: "13",
      excerptAr: "إِنَّهُ هُوَ يُبْدِئُ وَيُعِيدُ",
      excerptFr: "C'est Lui qui commence la création et la recommence...",
      context: "Aide à reconstruire après un désastre et retrouver ce qui est perdu."
    }
  },
  {
    ar: "الْمُحْيِي",
    tr: "Al-Muhyī",
    fr: "Celui qui donne la vie",
    abjad: 46,
    ref: "Vitalité et régénération",
    quranOptions: {
      count: 0,
      surah: "Fussilat",
      verse: "39",
      excerptAr: "إِنَّ الَّذِي أَحْيَاهَا لَمُحْيِي الْمَوْتَىٰ",
      excerptFr: "Celui qui lui redonne la vie ressuscitera certes les morts.",
      context: "Régénère le corps malade, apporte une vitalité débordante."
    }
  },
  {
    ar: "الْمُمِيتُ",
    tr: "Al-Mumīt",
    fr: "Celui qui donne la mort",
    abjad: 490,
    ref: "Maîtrise des passions",
    quranOptions: {
      count: 0,
      surah: "Al-Baqarah",
      verse: "258",
      excerptAr: "رَبِّيَ الَّذِي يُحْيِي وَيُمِيتُ",
      excerptFr: "Mon Seigneur est Celui qui donne la vie et la mort.",
      context: "Aide à dompter l'Ego charnel (Nafs) et ses pulsions sombres."
    }
  },
  {
    ar: "الْحَيُّ",
    tr: "Al-Hayy",
    fr: "Le Vivant",
    abjad: 18,
    ref: "Vie éternelle",
    quranOptions: {
      count: 5,
      surah: "Al-Baqarah",
      verse: "255",
      excerptAr: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      excerptFr: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même.",
      context: "Le nom de la force de vie divine luttant contre l'épuisement."
    }
  },
  {
    ar: "الْقَيُّومُ",
    tr: "Al-Qayyūm",
    fr: "L'Immuable",
    abjad: 156,
    ref: "Autonomie et subsistance",
    quranOptions: {
      count: 3,
      surah: "Al-Baqarah",
      verse: "255",
      excerptAr: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      excerptFr: "Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même...",
      context: "Maintient la stabilité financière et la clarté d'esprit."
    }
  },
  {
    ar: "الْوَاجِدُ",
    tr: "Al-Wājid",
    fr: "L'Opulent",
    abjad: 14,
    ref: "Richesse et plénitude",
    quranOptions: {
      count: 0,
      surah: "Ad-Duha",
      verse: "8",
      excerptAr: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ",
      excerptFr: "Et Il t'a trouvé pauvre et t'a enrichi.",
      context: "Élimine le sentiment de manque et attire l'abondance."
    }
  },
  {
    ar: "الْمَاجِدُ",
    tr: "Al-Mājid",
    fr: "Le Noble",
    abjad: 48,
    ref: "Splendeur",
    quranOptions: {
      count: 0,
      surah: "Al-Buruj",
      verse: "15",
      excerptAr: "ذُو الْعَرْشِ الْمَجِيدُ",
      excerptFr: "Le Maître du Trône, le Tout-Glorieux.",
      context: "Illumine l'aura, apporte le respect et la distinction morale."
    }
  },
  {
    ar: "الْوَاحِدُ",
    tr: "Al-Wāhid",
    fr: "L'Unique",
    abjad: 19,
    ref: "Unicité cosmique",
    quranOptions: {
      count: 30,
      surah: "Al-Baqarah",
      verse: "163",
      excerptAr: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ",
      excerptFr: "Et votre Divinité est une divinité unique.",
      context: "Unifie l'esprit dispersé et élimine la crainte de la solitude."
    }
  },
  {
    ar: "الْأَحَدُ",
    tr: "Al-Ahad",
    fr: "L'Un",
    abjad: 13,
    ref: "Unicité pure",
    quranOptions: {
      count: 1,
      surah: "Al-Ikhlas",
      verse: "1",
      excerptAr: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      excerptFr: "Dis : Il est Allah, l'Unique.",
      context: "La quintessence de l'Unicité dissolvant toutes les illusions d'ici-bas."
    }
  },
  {
    ar: "الصَّمَدُ",
    tr: "As-Samad",
    fr: "Le Maître absolu",
    abjad: 134,
    ref: "Soutien universel",
    quranOptions: {
      count: 1,
      surah: "Al-Ikhlas",
      verse: "2",
      excerptAr: "اللَّهُ الصَّمَدُ",
      excerptFr: "Allah, le Seul à être imploré pour nos besoins.",
      context: "Libère le pratiquant de toute dépendance matérielle d'autrui."
    }
  },
  {
    ar: "الْقَادِرُ",
    tr: "Al-Qādir",
    fr: "Le Puissant",
    abjad: 305,
    ref: "Pouvoir absolu",
    quranOptions: {
      count: 12,
      surah: "Al-Isra",
      verse: "99",
      excerptAr: "إِنَّ اللَّهَ قَادِرٌ عَلَىٰ أَن يَخْلُقَ مِثْلَهُمْ",
      excerptFr: "Certes, Allah est capable de créer leur pareil.",
      context: "Donne la capacité de matérialiser les objectifs vertueux."
    }
  },
  {
    ar: "الْمُقْتَدِرُ",
    tr: "Al-Muqtadir",
    fr: "Le Tout-Puissant",
    abjad: 744,
    ref: "Décret absolu",
    quranOptions: {
      count: 4,
      surah: "Al-Qamar",
      verse: "42",
      excerptAr: "فَأَخَذْنَاهُمْ أَخْذَ عَزِيزٍ مُّقْتَدِرٍ",
      excerptFr: "Nous les saisîmes donc de la saisie d'un Puissant, Tout-Puissant.",
      context: "Éradique les blocages majeurs du destin en un battement de paupière."
    }
  },
  {
    ar: "الْمُقَدِّمُ",
    tr: "Al-Muqaddim",
    fr: "Celui qui devance",
    abjad: 184,
    ref: "Avancement",
    quranOptions: {
      count: 0,
      surah: "Qaf",
      verse: "28",
      excerptAr: "وَقَدْ قَدَّمْتُ إِلَيْكُم بِالْوَعِيدِ",
      excerptFr: "Alors que Je vous avais déjà fait part de Mes menaces.",
      context: "Accélère l'atteinte du succès et devance sainement la concurrence."
    }
  },
  {
    ar: "الْمُؤَخِّرُ",
    tr: "Al-Mu'akhkhir",
    fr: "Celui qui retarde",
    abjad: 846,
    ref: "Sagesse du temps",
    quranOptions: {
      count: 0,
      surah: "Nuh",
      verse: "4",
      excerptAr: "وَيُؤَخِّرْكُمْ إِلَىٰ أَجَلٍ مُّسَمًّى",
      excerptFr: "Et Il vous accordera un délai jusqu'à un terme fixé.",
      context: "Repousse le danger imminent ou le malheur, enseignant la patience."
    }
  },
  {
    ar: "الْأَوَّلُ",
    tr: "Al-Awwal",
    fr: "Le Premier",
    abjad: 37,
    ref: "Antériorité éternelle",
    quranOptions: {
      count: 1,
      surah: "Al-Hadid",
      verse: "3",
      excerptAr: "هُوَ الْأَوَّلُ وَالْآخِرُ",
      excerptFr: "C'est Lui le Premier et le Dernier.",
      context: "Pose des jalons de vie robustes dès le départ d'une entreprise."
    }
  },
  {
    ar: "الْآخِرُ",
    tr: "Al-Ākhir",
    fr: "Le Dernier",
    abjad: 801,
    ref: "Subsistance éternelle",
    quranOptions: {
      count: 1,
      surah: "Al-Hadid",
      verse: "3",
      excerptAr: "هُوَ الْأَوَّلُ وَالْآخِرُ",
      excerptFr: "C'est Lui le Premier et le Dernier...",
      context: "Garantit une issue favorable et heureuse dans tout projet initié."
    }
  },
  {
    ar: "الظَّاهِرُ",
    tr: "Az-Zāhir",
    fr: "L'Apparent",
    abjad: 1106,
    ref: "Preuve manifeste",
    quranOptions: {
      count: 1,
      surah: "Al-Hadid",
      verse: "3",
      excerptAr: "وَالظَّاهِرُ وَالْبَاطِنُ",
      excerptFr: "L'Apparent et le Caché.",
      context: "Expose au grand jour la vérité morale de l'invocateur."
    }
  },
  {
    ar: "الْبَاطِنُ",
    tr: "Al-Bātin",
    fr: "Le Caché",
    abjad: 62,
    ref: "Intériorité",
    quranOptions: {
      count: 1,
      surah: "Al-Hadid",
      verse: "3",
      excerptAr: "وَالظَّاهِرُ وَالْبَاطِنُ",
      excerptFr: "L'Apparent et le Caché...",
      context: "Facilite l'accès aux profondeurs intérieures et la méditation."
    }
  },
  {
    ar: "الْوَالِي",
    tr: "Al-Wālī",
    fr: "Le Maître",
    abjad: 47,
    ref: "Gouvernance",
    quranOptions: {
      count: 1,
      surah: "Ar-Ra'd",
      verse: "11",
      excerptAr: "وَمَا لَهُم مِّن دُونِهِ مِن وَالٍ",
      excerptFr: "Et ils n'ont en dehors de Lui aucun protecteur.",
      context: "Idéal pour guider avec sagesse et présider les responsabilités civiles."
    }
  },
  {
    ar: "الْمُتَعَالِي",
    tr: "Al-Muta'ālī",
    fr: "Le Sublime",
    abjad: 541,
    ref: "Transcendance",
    quranOptions: {
      count: 1,
      surah: "Ar-Ra'd",
      verse: "9",
      excerptAr: "الْكَبِيرُ الْمُتَعَالِ",
      excerptFr: "Le Grand, le Sublime.",
      context: "Élève la dignité et la réputation face aux dénigrements d'autrui."
    }
  },
  {
    ar: "الْبَرُّ",
    tr: "Al-Barr",
    fr: "Le Bienveillant",
    abjad: 202,
    ref: "Bonté infinie",
    quranOptions: {
      count: 1,
      surah: "At-Tur",
      verse: "28",
      excerptAr: "إِنَّهُ هُوَ الْبَرُّ الرَّحِيمُ",
      excerptFr: "C'est Lui le Bienveillant, le Très Miséricordieux.",
      context: "Favorise l'affabilité d'autrui et la réussite des démarches d'entraide."
    }
  },
  {
    ar: "التَّوَّابُ",
    tr: "At-Tawwāb",
    fr: "Celui qui accueille le repentir",
    abjad: 409,
    ref: "Pardon",
    quranOptions: {
      count: 11,
      surah: "Al-Baqarah",
      verse: "37",
      excerptAr: "إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ",
      excerptFr: "C'est Lui l'Accueillant au repentir, le Très Miséricordieux.",
      context: "Facilite l'allègement de la culpabilité et rétablit l'harmonie spirituelle."
    }
  },
  {
    ar: "الْمُنْتَقِمُ",
    tr: "Al-Muntaqim",
    fr: "Le Vengeur",
    abjad: 630,
    ref: "Justice corrective",
    quranOptions: {
      count: 3,
      surah: "As-Sajdah",
      verse: "22",
      excerptAr: "إِنَّا مِنَ الْمُجْرِمِينَ مُنتَقِمُونَ",
      excerptFr: "Nous nous vengerons certes des criminels.",
      context: "S'en remettre à la seule Justice absolue pour rétablir son bon droit."
    }
  },
  {
    ar: "الْعَفُوُّ",
    tr: "Al-'Afuww",
    fr: "L'Indulgent",
    abjad: 156,
    ref: "Effacement des fautes",
    quranOptions: {
      count: 5,
      surah: "An-Nisa",
      verse: "99",
      excerptAr: "وَكَانَ اللَّهُ عَفُوًّا غَفُورًا",
      excerptFr: "Et Allah est Indulgent et Pardonneur.",
      context: "Efface complètement les scories intérieures de l'esprit."
    }
  },
  {
    ar: "الرَّؤُوفُ",
    tr: "Ar-Ra'ūf",
    fr: "Le Très Bienveillant",
    abjad: 287,
    ref: "Compassion",
    quranOptions: {
      count: 11,
      surah: "Al-Baqarah",
      verse: "207",
      excerptAr: "وَاللَّهُ رَؤُوفٌ بِالْعِبَادِ",
      excerptFr: "Et Allah est Plein de compassion pour Ses serviteurs.",
      context: "Accorde la clémence divine dans le quotidien et adoucit les relations."
    }
  },
  {
    ar: "مَالِكُ الْمُلْكِ",
    tr: "Mālik-ul-Mulk",
    fr: "Le Possesseur du Royaume",
    abjad: 212,
    ref: "Souveraineté",
    quranOptions: {
      count: 1,
      surah: "Ali 'Imran",
      verse: "26",
      excerptAr: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ",
      excerptFr: "Dis : Ô Allah, Maître de la souveraineté absolue.",
      context: "Stabilise la situation sociale ou professionnelle de manière durable."
    }
  },
  {
    ar: "ذُو الْجَلَالِ وَالْإِكْرَامِ",
    tr: "Dhū-l-Jalāli wal-Ikrām",
    fr: "Détenteur de la Majesté et de la Générosité",
    abjad: 1100,
    ref: "Seigneur suprême",
    quranOptions: {
      count: 2,
      surah: "Ar-Rahman",
      verse: "27",
      excerptAr: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
      excerptFr: "Seule subsistera la Face de ton Seigneur, plein de majesté et de noblesse.",
      context: "Unifie la noblesse de la rigueur et l'élégance de la générosité divine."
    }
  },
  {
    ar: "الْمُقْسِطُ",
    tr: "Al-Muqsit",
    fr: "L'Équitable",
    abjad: 209,
    ref: "Harmonie",
    quranOptions: {
      count: 0,
      surah: "Al-A'raf",
      verse: "29",
      excerptAr: "قُلْ أَمَرَ رَبِّي بِالْقِسْطِ",
      excerptFr: "Dis : Mon Seigneur a commandé l'équité.",
      context: "Rétablit l'harmonie civile et élimine les sources de litiges."
    }
  },
  {
    ar: "الْجَامِعُ",
    tr: "Al-Jāmi'",
    fr: "Le Rassembleur",
    abjad: 114,
    ref: "Rassemblement",
    quranOptions: {
      count: 3,
      surah: "Ali 'Imran",
      verse: "9",
      excerptAr: "إِنَّكَ جَامِعُ النَّاسِ لِيَوْمٍ لَّا رَيْبَ فِيهِ",
      excerptFr: "C'est Toi qui rassembleras les gens en un jour au sujet duquel il n'y a point de doute.",
      context: "Rassemble ce qui a été dispersé (familles séparées, objets perdus, esprits)."
    }
  },
  {
    ar: "الْغَنِيُّ",
    tr: "Al-Ghaniyy",
    fr: "Le Riche",
    abjad: 1060,
    ref: "Indépendance",
    quranOptions: {
      count: 18,
      surah: "Al-Baqarah",
      verse: "263",
      excerptAr: "وَاللَّهُ غَنِيٌّ حَلِيمٌ",
      excerptFr: "Et Allah se suffit à Lui-même et Il est indulgent.",
      context: "Attire l'autonomie financière et spirituelle par l'aisance du cœur."
    }
  },
  {
    ar: "الْمُغْنِي",
    tr: "Al-Mughnī",
    fr: "Celui qui enrichit",
    abjad: 1100,
    ref: "Enrichissement",
    quranOptions: {
      count: 0,
      surah: "An-Najm",
      verse: "48",
      excerptAr: "وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ",
      excerptFr: "Et c'est Lui qui enrichit et qui donne les biens.",
      context: "Attire la fortune matérielle et pacifie les craintes de pauvreté."
    }
  },
  {
    ar: "الْمَانِعُ",
    tr: "Al-Māni'",
    fr: "Le Défenseur",
    abjad: 161,
    ref: "Protection",
    quranOptions: {
      count: 0,
      surah: "Al-Mulk",
      verse: "20",
      excerptAr: "أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم",
      excerptFr: "Quel est donc ce groupe qui pourrait vous défendre ?",
      context: "Fait barrage aux accidents, maladies, et complots hostiles."
    }
  },
  {
    ar: "الضَّارُّ",
    tr: "Ad-Dārr",
    fr: "Celui qui peut nuire",
    abjad: 1001,
    ref: "Contrôle",
    quranOptions: {
      count: 0,
      surah: "Al-An'am",
      verse: "17",
      excerptAr: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ",
      excerptFr: "Et si Allah fait qu'un mal te touche, nul ne peut l'écarter en dehors de Lui.",
      context: "Rappelle que l'épreuve forge la patience de l'invocateur."
    }
  },
  {
    ar: "النَّافِعُ",
    tr: "An-Nāfi'",
    fr: "L'Utile",
    abjad: 201,
    ref: "Profit",
    quranOptions: {
      count: 0,
      surah: "Al-Fath",
      verse: "11",
      excerptAr: "فَمَن يَمْلِكُ لَكُم مِّنَ اللَّهِ شَيْئًا إِنْ أَرَادَ بِكُمْ ضَرًّا أَوْ أَرَادَ بِكُمْ نَفْعًا",
      excerptFr: "Qui donc peut quelque chose pour vous contre Allah, s'Il veut vous faire du mal ou s'Il veut vous faire du bien ?",
      context: "Attire le succès commercial, favorise la santé et l'utilité publique."
    }
  },
  {
    ar: "النُّورُ",
    tr: "An-Nūr",
    fr: "La Lumière",
    abjad: 256,
    ref: "Illumination",
    quranOptions: {
      count: 43,
      surah: "An-Nur",
      verse: "35",
      excerptAr: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
      excerptFr: "Allah est la Lumière des cieux et de la terre.",
      context: "La lumière spirituelle guidant le cœur à travers les ténèbres."
    }
  },
  {
    ar: "الْهَادِي",
    tr: "Al-Hādī",
    fr: "Le Guide",
    abjad: 20,
    ref: "Guidance",
    quranOptions: {
      count: 10,
      surah: "Al-Furqan",
      verse: "31",
      excerptAr: "وَكَفَىٰ بِرَبِّكَ هَادِيًا وَنَصِيرًا",
      excerptFr: "Et ton Seigneur suffit comme guide et comme soutien.",
      context: "Guide les esprits indécis vers le droit chemin."
    }
  },
  {
    ar: "الْبَدِيعُ",
    tr: "Al-Badī'",
    fr: "Le Novateur",
    abjad: 86,
    ref: "Créativité",
    quranOptions: {
      count: 2,
      surah: "Al-Baqarah",
      verse: "117",
      excerptAr: "بَدِيعُ السَّمَاوَاتِ وَالْأَرْضِ",
      excerptFr: "Créateur des cieux et de la terre sans modèle préalable.",
      context: "Insuffle l'inspiration artistique et les idées innovantes."
    }
  },
  {
    ar: "الْبَاقِي",
    tr: "Al-Bāqī",
    fr: "Le Permanent",
    abjad: 113,
    ref: "Éternité",
    quranOptions: {
      count: 0,
      surah: "Ta-Ha",
      verse: "73",
      excerptAr: "وَاللَّهُ خَيْرٌ وَأَبْقَىٰ",
      excerptFr: "Et Allah est Meilleur et Subsiste plus durablement.",
      context: "Assure la longévité des bonnes actions et la pérennité."
    }
  },
  {
    ar: "الْوَارِثُ",
    tr: "Al-Wārith",
    fr: "L'Héritier",
    abjad: 707,
    ref: "Héritage final",
    quranOptions: {
      count: 3,
      surah: "Al-Hijr",
      verse: "23",
      excerptAr: "وَنَحْنُ الْوَارِثُونَ",
      excerptFr: "Et c'est Nous qui sommes l'Héritier suprême.",
      context: "Rassure sur le fait que tout effort sera divinement compensé."
    }
  },
  {
    ar: "الرَّشِيدُ",
    tr: "Ar-Rashīd",
    fr: "Le Guide droit",
    abjad: 514,
    ref: "Orientation",
    quranOptions: {
      count: 0,
      surah: "Al-Kahf",
      verse: "17",
      excerptAr: "فَلَن تَجِدَ لَهُ وَلِيًّا مُّرْشِدًا",
      excerptFr: "Tu ne trouveras pour lui aucun protecteur pour le guider.",
      context: "Aide à choisir la meilleure voie sans faire d'erreur regrettable."
    }
  },
  {
    ar: "الصَّبُورُ",
    tr: "As-Sabūr",
    fr: "Le Patient",
    abjad: 298,
    ref: "Patience infinie",
    quranOptions: {
      count: 0,
      surah: "Al-Baqarah",
      verse: "153",
      excerptAr: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      excerptFr: "Certes, Allah est avec ceux qui sont patients.",
      context: "Insuffle la sérénité nécessaire pour surmonter l'angoisse."
    }
  }
];
