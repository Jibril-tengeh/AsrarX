export type VideoCardThemeId =
  | 'cosmic-nebula'
  | 'golden-geometry'
  | 'cyber-emerald'
  | 'royal-amethyst'
  | 'desert-starlight'
  | 'quantum-abjad'
  | 'warp-speed'
  | 'nocturne-moon'
  | 'emerald-oasis'
  | 'solar-flare';

export interface VideoCardPreset {
  id: VideoCardThemeId;
  index: number;
  titleFr: string;
  titleEn: string;
  titleHa: string;
  subtitleFr: string;
  subtitleEn: string;
  subtitleHa: string;
  badgeFr: string;
  badgeEn: string;
  badgeHa: string;
  accentColor: string;
  glowColor: string;
  buttonGradient: string;
  borderGradient: string;
  overlayGradient: string;
  particleType: 'stars' | 'gold-dust' | 'cyber-grid' | 'amethyst-gems' | 'sand-sparks' | 'abjad-glyphs' | 'warp-lines' | 'moon-mist' | 'oasis-bokeh' | 'solar-plasma';
  videoUrl?: string; // Direct MP4 video background loop
  videoPoster?: string;
  iconName: 'Sparkles' | 'Crown' | 'Shield' | 'Zap' | 'Compass' | 'Layers' | 'Orbit' | 'Moon' | 'Gem' | 'Flame';
  audioEffectFreq?: number;
}

export const VIDEO_CARD_PRESETS: VideoCardPreset[] = [
  {
    id: 'cosmic-nebula',
    index: 1,
    titleFr: 'Nébuleuse Cosmique Asrar',
    titleEn: 'Cosmic Asrar Nebula',
    titleHa: 'Hasken Sararin Asrar',
    subtitleFr: 'Une mise à niveau stellaire avec performances quantiques et nouveaux protocoles.',
    subtitleEn: 'A stellar upgrade with quantum speed and brand new spiritual protocols.',
    subtitleHa: 'Sabuntawa mai girma tare da sauri da sabbin asirai masu karfi.',
    badgeFr: 'ÉDITION COSMIQUE',
    badgeEn: 'COSMIC EDITION',
    badgeHa: 'SIGAR SARARI',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    buttonGradient: 'from-violet-600 via-indigo-600 to-purple-700',
    borderGradient: 'from-violet-500/60 via-indigo-500/40 to-purple-500/60',
    overlayGradient: 'from-indigo-950/90 via-purple-950/80 to-slate-950/95',
    particleType: 'stars',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
    iconName: 'Sparkles',
    audioEffectFreq: 528
  },
  {
    id: 'golden-geometry',
    index: 2,
    titleFr: 'Matrice Dorée Sacrée',
    titleEn: 'Sacred Gold Matrix',
    titleHa: 'Zinariya Mai Tsarki',
    subtitleFr: 'Sublimation géométrique 24K : calculs optimisés et zikr haute précision.',
    subtitleEn: '24K Sacred geometry refinement: optimized calculations & precision zikr.',
    subtitleHa: 'Gyaran lissafi na zinare da inganta zikirori da lissafin abjad.',
    badgeFr: 'PRESTIGE OR 24K',
    badgeEn: '24K GOLD PRESTIGE',
    badgeHa: 'ZINARIYA MAI DARAJA',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    buttonGradient: 'from-amber-500 via-yellow-500 to-amber-600',
    borderGradient: 'from-amber-400/80 via-yellow-300/50 to-amber-600/80',
    overlayGradient: 'from-amber-950/90 via-stone-950/85 to-yellow-950/90',
    particleType: 'gold-dust',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-particles-floating-in-the-air-42358-large.mp4',
    iconName: 'Crown',
    audioEffectFreq: 432
  },
  {
    id: 'cyber-emerald',
    index: 3,
    titleFr: 'Noyau Cyber Émeraude',
    titleEn: 'Cyber Emerald Core',
    titleHa: 'Koren Asirai Na Fasaha',
    subtitleFr: 'Architecture blindée, synchronisation instantanée et bouclier de sécurité.',
    subtitleEn: 'Shielded core architecture, lightning sync and reinforced security layers.',
    subtitleHa: 'Kariyar bayanai ta musamman da saurin aiki na zamani.',
    badgeFr: 'SÉCURITÉ BLINDÉE',
    badgeEn: 'SHIELDED CORE',
    badgeHa: 'KARIYA TA MUSAMMAN',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    buttonGradient: 'from-emerald-500 via-teal-500 to-emerald-700',
    borderGradient: 'from-emerald-400/70 via-teal-400/50 to-emerald-600/70',
    overlayGradient: 'from-emerald-950/90 via-slate-950/85 to-teal-950/90',
    particleType: 'cyber-grid',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-green-lines-and-dots-42337-large.mp4',
    iconName: 'Shield',
    audioEffectFreq: 639
  },
  {
    id: 'royal-amethyst',
    index: 4,
    titleFr: 'Améthyste Royale Velours',
    titleEn: 'Royal Velvet Amethyst',
    titleHa: 'Alfarmar Lu\'ulu\'u',
    subtitleFr: 'Harmonie visuelle raffinée, fluidité 120Hz et transition douce.',
    subtitleEn: 'Majestic royal polish with silky 120Hz micro-interactions and smooth flow.',
    subtitleHa: 'Kyakkyawan tsari mai dadi da saukin sarrafawa a wayoyinku.',
    badgeFr: 'ÉDITION IMPÉRIALE',
    badgeEn: 'IMPERIAL EDITION',
    badgeHa: 'SIGAR SARKAI',
    accentColor: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.45)',
    buttonGradient: 'from-fuchsia-600 via-pink-600 to-purple-700',
    borderGradient: 'from-fuchsia-400/70 via-purple-400/50 to-pink-500/70',
    overlayGradient: 'from-fuchsia-950/90 via-purple-950/85 to-slate-950/95',
    particleType: 'amethyst-gems',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pink-and-purple-liquid-marble-in-slow-motion-42398-large.mp4',
    iconName: 'Gem',
    audioEffectFreq: 741
  },
  {
    id: 'desert-starlight',
    index: 5,
    titleFr: 'Nuit Saharienne & Étoiles',
    titleEn: 'Sahara Starlight Night',
    titleHa: 'Daren Hamada Da Taurari',
    subtitleFr: 'Inspiration millénaire du désert avec moteur de recherche d\'asrar accéléré.',
    subtitleEn: 'Timeless Saharan guidance powered by our fastest search engine yet.',
    subtitleHa: 'Hasken asirai da bincike mai sauri cikin sauki.',
    badgeFr: 'HÉRITAGE DU DÉSERT',
    badgeEn: 'DESERT HERITAGE',
    badgeHa: 'GADON HAMADA',
    accentColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.45)',
    buttonGradient: 'from-orange-600 via-amber-600 to-red-600',
    borderGradient: 'from-orange-400/70 via-amber-300/50 to-red-500/70',
    overlayGradient: 'from-orange-950/90 via-stone-950/85 to-amber-950/90',
    particleType: 'sand-sparks',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fire-embers-flying-up-in-the-air-42352-large.mp4',
    iconName: 'Compass',
    audioEffectFreq: 396
  },
  {
    id: 'quantum-abjad',
    index: 6,
    titleFr: 'Portail Abjad Quantique',
    titleEn: 'Quantum Abjad Portal',
    titleHa: 'Kofar Lallafin Abjad',
    subtitleFr: 'Décodage instantané des lettres arabes, calcul des poids et correspondances.',
    subtitleEn: 'Real-time numerical Abjad decoding, gematria weights & planetary links.',
    subtitleHa: 'Fassara da lissafin haruffan larabci nan take ba tare da jinkiri ba.',
    badgeFr: 'ABJAD & NUMÉROLOGIE',
    badgeEn: 'ABJAD & NUMEROLOGY',
    badgeHa: 'LISSAPIN HARUFFA',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    buttonGradient: 'from-cyan-600 via-teal-600 to-blue-600',
    borderGradient: 'from-cyan-400/70 via-teal-300/50 to-blue-500/70',
    overlayGradient: 'from-cyan-950/90 via-slate-950/85 to-blue-950/90',
    particleType: 'abjad-glyphs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-blue-tech-particles-moving-in-a-circle-42338-large.mp4',
    iconName: 'Orbit',
    audioEffectFreq: 852
  },
  {
    id: 'warp-speed',
    index: 7,
    titleFr: 'Vitesse Lumière Hyper-Warp',
    titleEn: 'Hyper-Warp Speed Stream',
    titleHa: 'Gudun Haske Mai Sauri',
    subtitleFr: 'Optimisation extrême du moteur : chargement instantané sans latence.',
    subtitleEn: 'Zero-latency engine optimization: instant UI launch & rapid response.',
    subtitleHa: 'Bude manhaja nan take ba tare da tsayawa ko nauyi ba.',
    badgeFr: 'ULTRA VITESSE 5G',
    badgeEn: 'ULTRA SPEED 5G',
    badgeHa: 'SAURI MAI KARFI',
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    buttonGradient: 'from-blue-600 via-indigo-500 to-sky-500',
    borderGradient: 'from-blue-400/70 via-sky-300/50 to-indigo-500/70',
    overlayGradient: 'from-blue-950/90 via-slate-950/85 to-sky-950/90',
    particleType: 'warp-lines',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traveling-through-a-starfield-in-space-41551-large.mp4',
    iconName: 'Zap',
    audioEffectFreq: 963
  },
  {
    id: 'nocturne-moon',
    index: 8,
    titleFr: 'Croissant Lunaire & Brume',
    titleEn: 'Nocturne Lunar Mist',
    titleHa: 'Hasken Farin Wata',
    subtitleFr: 'Atmosphère spirituelle nocturne, mode sombre reposant et clarté maximale.',
    subtitleEn: 'Calming nocturnal spirit atmosphere with eye-friendly dark dynamics.',
    subtitleHa: 'Yanayi mai sanyi da haske mai dadi ga idanu a lokacin dare.',
    badgeFr: 'SERENITÉ NOCTURNE',
    badgeEn: 'NOCTURNAL SERENITY',
    badgeHa: 'KWANCIN HANKALI',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    buttonGradient: 'from-sky-600 via-slate-700 to-blue-700',
    borderGradient: 'from-sky-400/70 via-blue-300/40 to-slate-500/70',
    overlayGradient: 'from-slate-950/95 via-sky-950/80 to-blue-950/90',
    particleType: 'moon-mist',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    iconName: 'Moon',
    audioEffectFreq: 432
  },
  {
    id: 'emerald-oasis',
    index: 9,
    titleFr: 'Oasis Émeraude & Paix',
    titleEn: 'Emerald Oasis & Peace',
    titleHa: 'Kogin Alkhairi Da Zaman Lafiya',
    subtitleFr: 'Fraîcheur visuelle, gestion du souffle et prières avec interface zen.',
    subtitleEn: 'Lush visual peace, breath control & sacred prayers with zen layout.',
    subtitleHa: 'Zaman lafiya da natsuwa yayin karanta asirai da addu\'o\'i.',
    badgeFr: 'PAIX & HARMONIE',
    badgeEn: 'PEACE & HARMONY',
    badgeHa: 'ZAMAN LAFIYA',
    accentColor: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    buttonGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    borderGradient: 'from-teal-400/70 via-emerald-300/40 to-cyan-500/70',
    overlayGradient: 'from-teal-950/90 via-slate-950/85 to-emerald-950/90',
    particleType: 'oasis-bokeh',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-leaves-42354-large.mp4',
    iconName: 'Layers',
    audioEffectFreq: 528
  },
  {
    id: 'solar-flare',
    index: 10,
    titleFr: 'Couronne Solaire & Flammes',
    titleEn: 'Solar Corona & Flames',
    titleHa: 'Kahon Rana Mai Zafi',
    subtitleFr: 'Puissance maximale : nouvelle génération d\'outils et stabilité absolue.',
    subtitleEn: 'Peak power: next-generation tools, unshakeable stability & elite vigor.',
    subtitleHa: 'Karuwar karfi da ingancin kayan aiki ga duk mai amfani.',
    badgeFr: 'PUISSANCE MAXIMALE',
    badgeEn: 'PEAK POWER',
    badgeHa: 'CIKAKKEN KARFI',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    buttonGradient: 'from-amber-600 via-orange-600 to-rose-600',
    borderGradient: 'from-amber-400/80 via-orange-300/50 to-rose-500/80',
    overlayGradient: 'from-amber-950/90 via-stone-950/85 to-rose-950/90',
    particleType: 'solar-plasma',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-burst-of-orange-particles-42353-large.mp4',
    iconName: 'Flame',
    audioEffectFreq: 741
  }
];

export function getPresetById(id?: VideoCardThemeId | string): VideoCardPreset {
  const found = VIDEO_CARD_PRESETS.find(p => p.id === id);
  return found || VIDEO_CARD_PRESETS[0];
}
