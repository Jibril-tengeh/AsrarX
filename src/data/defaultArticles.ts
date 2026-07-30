export interface DefaultArticle {
  id: string;
  title: string;
  title_en?: string;
  title_ha?: string;
  hook: string;
  hook_en?: string;
  hook_ha?: string;
  category: string;
  subCategory?: string;
  status: string;
  isPremium: boolean;
  thumbnail: string;
  content: string;
  content_en?: string;
  content_ha?: string;
  benefits: string[];
  createdAt: string;
}

export const INITIAL_DEFAULT_ARTICLES: DefaultArticle[] = [
  {
    id: 'default_art_1',
    title: 'Les Secrets Spirituels du Zikr Ya-Latif (129 Fois)',
    title_en: 'Spiritual Secrets of the Ya-Latif Zikr (129 Times)',
    title_ha: 'Asirin Zikiri Ya-Latif (Sau 129)',
    hook: 'Découvrez la dimension ésotérique du Nom Divin Al-Latif (Le Subtil, Le Bienveillant) et comment sa récitation apporte soulagement et ouverture.',
    hook_en: 'Discover the esoteric dimension of the Divine Name Al-Latif and how its recitation brings relief and spiritual ease.',
    hook_ha: 'Koyi babban asirin Sunan Allah Al-Latif da yadda amfani da shi yake kawo sauƙi da buɗe ƙofa.',
    category: 'recette',
    subCategory: 'Zikr & Invocations',
    status: 'Published',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Soulagement des angoisses et difficultés',
      'Attraction de la douceur divine et de la bénédiction (Barakah)',
      'Protection contre les épreuves cachées',
      'Apaisement de l\'esprit et clarté mentale'
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    content: `
      <h2>La Subtilité du Nom Divin Al-Latif</h2>
      <p>Le Nom <strong>Al-Latif</strong> (اللطيف) fait partie des Noms Divins les plus doux et les plus efficients dans la tradition ésotérique islamique. Il exprime à la fois la connaissance absolue des moindres détails secrets de l'univers et la bienveillance infinie par laquelle le Créateur accorde Ses bienfaits de manière imperceptible.</p>

      <h3>La Valeur Numérique (Abjad) : 129</h3>
      <p>Dans le système de calcul de l'Abjad Saghir et Abjad Kabir, la valeur numérique du Nom <strong>Latif</strong> est de <strong>129</strong>. C'est pourquoi la récitation de ce Nom au nombre de 129 fois est considérée comme la clé standard d'activation de sa lumière spirituelle.</p>

      <h3>Méthode d'Accomplissement Pratique</h3>
      <ol>
        <li>Effectuez vos ablutions complètes et installez-vous face à la Qibla dans un endroit paisible.</li>
        <li>Récitez 3 fois la Fatiha et la demande de pardon (Astaghfirullah 100 fois).</li>
        <li>Envoyez les salutations sur le Prophète (Salat al-Fatih ou Salat Ibrahimiyyah 10 ou 100 fois).</li>
        <li>Récitez le Nom <strong>Ya-Latif</strong> exactement <strong>129 fois</strong> avec présence du cœur.</li>
        <li>Concluez par la récitation du verset : <em>"Allah est Doux envers Ses serviteurs. Il attribue Ses biens à qui Il veut. Et C'est Lui le Fort, le Puissant."</em> (Sourate Ash-Shura, v.19).</li>
      </ol>

      <p class="font-bold text-emerald-600 dark:text-emerald-400 mt-4">Note : La régularité quotidienne après la prière du Fajr ou du Maghrib déploie une sérénité inestimable dans votre foyer.</p>
    `,
    content_en: `
      <h2>The Subtlety of the Divine Name Al-Latif</h2>
      <p>The Name <strong>Al-Latif</strong> (The Subtle, The Kind) is one of the most benevolent Divine Names. It encompasses profound divine awareness and hidden blessings.</p>
      <h3>Abjad Numerical Value: 129</h3>
      <p>In Islamic numerology, the name Latif corresponds to the number 129. Reciting it 129 times activates deep inner peace and divine guidance.</p>
    `,
    content_ha: `
      <h2>Babban Asirin Sunan Allah Al-Latif</h2>
      <p>Sunan Allah <strong>Al-Latif</strong> yana ɗaya daga cikin sunaye masu ƙarfi wajen kawo sauƙi da samun nasara a rayuwa.</p>
      <h3>Lamba Tasa : 129</h3>
      <p>A lissafin Abjad, lambar Latif ita ce 129. Karanta shi sau 129 yana kawo haske da kariya.</p>
    `
  },
  {
    id: 'default_art_2',
    title: 'Guide Pratique de la Muraqabah & Méditation du Cœur',
    title_en: 'Practical Guide to Muraqabah & Heart Meditation',
    title_ha: 'Hanyar Muraqabah da Zurfafa Tunani a Zuciya',
    hook: 'Apprenez l\'art de l\'introspection spirituelle et du silence intérieur selon les méthodes ancestrales de Muraqabah.',
    hook_en: 'Learn the art of spiritual introspection and inner stillness through ancient Muraqabah meditation techniques.',
    hook_ha: 'Koyi hanyoyin zurfafa tunani da tsarkake zuciya ta hanyar Muraqabah.',
    category: 'muraqabah',
    subCategory: 'Spiritualité & Méditation',
    status: 'Published',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Ancrage spirituel et réduction du stress',
      'Développement de la conscience du Cœur (Qalb)',
      'Élimination des pensées parasites (Waswas)',
      'Connexion constante à la Présence Divinement Ressentie'
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    content: `
      <h2>Qu'est-ce que la Muraqabah ?</h2>
      <p>La <strong>Muraqabah</strong> est la pratique mystique de la vigilance du cœur. Elle consiste à maintenir son attention focalisée sur le Créateur tout en observant l'état intérieur de son âme (Nafs).</p>

      <h3>Les 3 Étapes Fondamentales</h3>
      <ul>
        <li><strong>L'Immobilisation du Corps (Jilsah) :</strong> Asseyez-vous confortablement, le dos droit, les yeux doucement fermés.</li>
        <li><strong>La Régulation du Souffle (Tanaffus) :</strong> Inspirez profondément par le nez en visualisant la lumière divine pénétrer votre cœur, puis expirez lentement.</li>
        <li><strong>L'Écoute du Cœur :</strong> Portez toute votre attention sur les battements du cœur au centre de votre poitrine en répétant silencieusement le Nom "ALLAH" à chaque battement.</li>
      </ul>
    `
  },
  {
    id: 'default_art_3',
    title: 'Protections Puissantes contre le Mauvais Œil (Rouqyah Authentique)',
    title_en: 'Powerful Protections against Evil Eye (Authentic Ruqyah)',
    title_ha: 'Kariya da Maganin Sharrin Ido (Rukiyyah)',
    hook: 'Les versets fondamentaux et invocations du Prophète (SWS) pour fortifier votre aura spirituelle et protéger votre famille.',
    hook_en: 'Essential Quranic verses and prophetic supplications to fortify your spiritual shield against negative energy.',
    hook_ha: "Ayoyin Alkur'ani da addu'o'in Kariyar sharrin ido da hassada.",
    category: 'rouqyah',
    subCategory: 'Protection & Guérison',
    status: 'Published',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Dissipation des blocages énergétiques et lourdeurs',
      'Fortification du bouclier spirituel familial',
      'Purification de l\'habitat et des objets',
      'Sommeil paisible sans cauchemars'
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    content: `
      <h2>Comprendre le Mauvais Œil (Al-'Ayn)</h2>
      <p>Le mauvais œil est une réalité spirituelle reconnue. Il survient lorsqu'un regard chargé d'envie ou d'admiration non bénie projette une onde perturbatrice sur une personne, un bien ou une santé.</p>

      <h3>Le Protocole de Protection Quotidien</h3>
      <p>Pour vous prémunir efficacement :</p>
      <ol>
        <li>Récitez chaque matin et soir les trois sourates protectrices (Al-Ikhlas, Al-Falaq, An-Nas) 3 fois chacune dans vos mains puis passez-les sur votre corps.</li>
        <li>Récitez l'Invocation : <em>"A'oudhou bi-kalimatillahi at-tamati min sharri ma khalaq"</em> (3 fois).</li>
        <li>Récitez Ayat al-Kursi avant de sortir de chez vous et avant de dormir.</li>
      </ol>
    `
  },
  {
    id: 'default_art_4',
    title: 'Secrets de la Sourate Al-Waqi\'ah pour l\'Abondance (Barakah)',
    title_en: 'Secrets of Surah Al-Waqiah for Prosperity and Barakah',
    title_ha: 'Asirin Suratu Al-Waqi\'ah Domin Bude Kofa da Arziki',
    hook: 'Pourquoi la lecture nocturne de la Sourate 56 est reconnue comme le remède ultime contre la pauvreté et la disette.',
    hook_en: 'Why reciting Surah 56 every night is renowned as the ultimate spiritual key to financial ease and blessing.',
    hook_ha: 'Saboda me karanta Suratul Waqi\'ah daren kowace rana yake kawo baraka da warware matsalar rayuwa.',
    category: 'sirr',
    subCategory: 'Secrets & Prospérité',
    status: 'Published',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    benefits: [
      'Ouverture des portes de la subsistance licite (Rizq)',
      'Élimination progressive des dettes et soucis financiers',
      'Préservation du foyer contre le besoin',
      'Rayonnement de sérénité et de gratitude'
    ],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    content: `
      <h2>La Sourate de la Richesse Spirituelle</h2>
      <p>Le Prophète Muhammad (SWS) a dit : <em>"Quiconque récite la Sourate Al-Waqi'ah chaque nuit ne sera jamais touché par la pauvreté."</em></p>

      <h3>Moment Privilégié de Récitation</h3>
      <p>Le meilleur moment pour réciter cette magnifique sourate se situe entre la prière du Maghrib et celle de l'Isha, ou juste avant le coucher. L'intention doit toujours être tournée vers l'obtention d'un Rizq halāl et béni.</p>
    `
  }
];
