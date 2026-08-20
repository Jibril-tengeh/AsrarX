export interface FloatingBackButtonColorPreset {
  id: string;
  name: string;
  category: 'dark' | 'gold' | 'emerald' | 'blue' | 'purple' | 'red' | 'light';
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass: string;
  previewBg: string;
  previewBorder: string;
}

export interface FloatingBackButtonShapePreset {
  id: string;
  name: string;
  desc: string;
  containerClass: string;
  style?: React.CSSProperties;
  innerClass?: string;
  iconClass?: string;
}

export interface FloatingBackButtonConfig {
  enabled: boolean;
  colorPreset: string;
  shape: string;
  iconStyle: string;
  iconColor: string;
  animationMode: string;
  glassBlur: string;
  borderStyle: string;
  size: number;
  position: string;
  opacity: number;
}

export const DEFAULT_FLOATING_BACK_CONFIG: FloatingBackButtonConfig = {
  enabled: true,
  colorPreset: 'glass-dark',
  shape: 'circle',
  iconStyle: 'arrow-left',
  iconColor: '#facc15', // yellow-400
  animationMode: 'pulse',
  glassBlur: 'medium',
  borderStyle: 'white-subtle',
  size: 56,
  position: 'bottom-left',
  opacity: 0.4,
};

// 22 Rich Transparent Glassmorphic Colors
export const FLOATING_BACK_COLORS: FloatingBackButtonColorPreset[] = [
  {
    id: 'glass-dark',
    name: 'Verre Noir Fumé',
    category: 'dark',
    bgClass: 'bg-black/35 dark:bg-black/55',
    borderClass: 'border-white/30 dark:border-white/20',
    textClass: 'text-yellow-400',
    glowClass: 'shadow-black/60',
    previewBg: 'rgba(0,0,0,0.5)',
    previewBorder: 'rgba(255,255,255,0.3)',
  },
  {
    id: 'glass-obsidian',
    name: 'Obsidienne Profonde',
    category: 'dark',
    bgClass: 'bg-zinc-950/60 dark:bg-black/75',
    borderClass: 'border-zinc-700/50 dark:border-zinc-800/60',
    textClass: 'text-zinc-100',
    glowClass: 'shadow-zinc-950/70',
    previewBg: 'rgba(24,24,27,0.7)',
    previewBorder: 'rgba(113,113,122,0.4)',
  },
  {
    id: 'glass-amber',
    name: 'Ambre Sacré',
    category: 'gold',
    bgClass: 'bg-amber-950/40 dark:bg-amber-950/60',
    borderClass: 'border-amber-500/50 dark:border-amber-400/40',
    textClass: 'text-amber-300',
    glowClass: 'shadow-amber-950/60 ring-1 ring-amber-500/30',
    previewBg: 'rgba(69,26,3,0.5)',
    previewBorder: 'rgba(245,158,11,0.5)',
  },
  {
    id: 'glass-gold',
    name: 'Or Solaire Brillant',
    category: 'gold',
    bgClass: 'bg-yellow-900/35 dark:bg-yellow-950/55',
    borderClass: 'border-yellow-400/60 dark:border-yellow-300/50',
    textClass: 'text-yellow-300',
    glowClass: 'shadow-yellow-500/20 ring-1 ring-yellow-400/40',
    previewBg: 'rgba(113,63,18,0.5)',
    previewBorder: 'rgba(250,204,21,0.6)',
  },
  {
    id: 'glass-emerald',
    name: 'Émeraude Mystique',
    category: 'emerald',
    bgClass: 'bg-emerald-950/45 dark:bg-emerald-950/65',
    borderClass: 'border-emerald-500/50 dark:border-emerald-400/45',
    textClass: 'text-emerald-300',
    glowClass: 'shadow-emerald-950/60 ring-1 ring-emerald-500/30',
    previewBg: 'rgba(2,44,34,0.55)',
    previewBorder: 'rgba(16,185,129,0.55)',
  },
  {
    id: 'glass-mint',
    name: 'Menthe Néon',
    category: 'emerald',
    bgClass: 'bg-teal-900/35 dark:bg-teal-950/55',
    borderClass: 'border-teal-400/50 dark:border-teal-300/45',
    textClass: 'text-teal-200',
    glowClass: 'shadow-teal-500/20 ring-1 ring-teal-400/30',
    previewBg: 'rgba(19,78,74,0.45)',
    previewBorder: 'rgba(45,212,191,0.5)',
  },
  {
    id: 'glass-sapphire',
    name: 'Saphir Céleste',
    category: 'blue',
    bgClass: 'bg-sky-950/45 dark:bg-sky-950/65',
    borderClass: 'border-sky-400/50 dark:border-sky-300/45',
    textClass: 'text-sky-200',
    glowClass: 'shadow-sky-950/60 ring-1 ring-sky-400/30',
    previewBg: 'rgba(8,47,73,0.55)',
    previewBorder: 'rgba(56,189,248,0.5)',
  },
  {
    id: 'glass-electric-blue',
    name: 'Bleu Électrique',
    category: 'blue',
    bgClass: 'bg-blue-950/50 dark:bg-blue-950/70',
    borderClass: 'border-blue-500/55 dark:border-blue-400/50',
    textClass: 'text-blue-200',
    glowClass: 'shadow-blue-500/25 ring-1 ring-blue-500/40',
    previewBg: 'rgba(23,37,84,0.55)',
    previewBorder: 'rgba(59,130,246,0.55)',
  },
  {
    id: 'glass-cyan',
    name: 'Cyan Océan',
    category: 'blue',
    bgClass: 'bg-cyan-950/45 dark:bg-cyan-950/65',
    borderClass: 'border-cyan-400/50 dark:border-cyan-300/45',
    textClass: 'text-cyan-200',
    glowClass: 'shadow-cyan-950/60 ring-1 ring-cyan-400/30',
    previewBg: 'rgba(22,78,99,0.5)',
    previewBorder: 'rgba(34,211,238,0.5)',
  },
  {
    id: 'glass-turquoise',
    name: 'Turquoise Éthéré',
    category: 'emerald',
    bgClass: 'bg-teal-950/45 dark:bg-teal-950/65',
    borderClass: 'border-teal-400/50 dark:border-teal-300/45',
    textClass: 'text-teal-200',
    glowClass: 'shadow-teal-950/60',
    previewBg: 'rgba(19,78,74,0.5)',
    previewBorder: 'rgba(45,212,191,0.5)',
  },
  {
    id: 'glass-ruby',
    name: 'Rubis Royal',
    category: 'red',
    bgClass: 'bg-rose-950/45 dark:bg-rose-950/65',
    borderClass: 'border-rose-500/50 dark:border-rose-400/45',
    textClass: 'text-rose-200',
    glowClass: 'shadow-rose-950/60 ring-1 ring-rose-500/30',
    previewBg: 'rgba(76,5,25,0.55)',
    previewBorder: 'rgba(244,63,94,0.5)',
  },
  {
    id: 'glass-crimson',
    name: 'Cramoisi Sacré',
    category: 'red',
    bgClass: 'bg-red-950/50 dark:bg-red-950/70',
    borderClass: 'border-red-500/55 dark:border-red-400/50',
    textClass: 'text-red-200',
    glowClass: 'shadow-red-950/60 ring-1 ring-red-500/35',
    previewBg: 'rgba(69,10,10,0.55)',
    previewBorder: 'rgba(239,68,68,0.55)',
  },
  {
    id: 'glass-violet',
    name: 'Améthyste / Violet',
    category: 'purple',
    bgClass: 'bg-purple-950/45 dark:bg-purple-950/65',
    borderClass: 'border-purple-500/50 dark:border-purple-400/45',
    textClass: 'text-purple-200',
    glowClass: 'shadow-purple-950/60 ring-1 ring-purple-500/30',
    previewBg: 'rgba(59,7,100,0.55)',
    previewBorder: 'rgba(168,85,247,0.5)',
  },
  {
    id: 'glass-indigo',
    name: 'Indigo Nocturne',
    category: 'purple',
    bgClass: 'bg-indigo-950/50 dark:bg-indigo-950/70',
    borderClass: 'border-indigo-500/55 dark:border-indigo-400/50',
    textClass: 'text-indigo-200',
    glowClass: 'shadow-indigo-950/60 ring-1 ring-indigo-500/35',
    previewBg: 'rgba(30,27,75,0.55)',
    previewBorder: 'rgba(99,102,241,0.55)',
  },
  {
    id: 'glass-fuchsia',
    name: 'Fuchsia Lumineux',
    category: 'purple',
    bgClass: 'bg-fuchsia-950/45 dark:bg-fuchsia-950/65',
    borderClass: 'border-fuchsia-500/50 dark:border-fuchsia-400/45',
    textClass: 'text-fuchsia-200',
    glowClass: 'shadow-fuchsia-950/60 ring-1 ring-fuchsia-500/30',
    previewBg: 'rgba(74,4,78,0.55)',
    previewBorder: 'rgba(217,70,239,0.5)',
  },
  {
    id: 'glass-sunset',
    name: 'Coucher de Soleil',
    category: 'gold',
    bgClass: 'bg-orange-950/45 dark:bg-orange-950/65',
    borderClass: 'border-orange-500/50 dark:border-orange-400/45',
    textClass: 'text-orange-200',
    glowClass: 'shadow-orange-950/60 ring-1 ring-orange-500/30',
    previewBg: 'rgba(67,20,7,0.55)',
    previewBorder: 'rgba(249,115,22,0.5)',
  },
  {
    id: 'glass-bronze',
    name: 'Bronze Ancien',
    category: 'gold',
    bgClass: 'bg-stone-900/50 dark:bg-stone-950/70',
    borderClass: 'border-amber-600/50 dark:border-amber-500/45',
    textClass: 'text-amber-200',
    glowClass: 'shadow-stone-950/60',
    previewBg: 'rgba(41,37,36,0.6)',
    previewBorder: 'rgba(217,119,6,0.5)',
  },
  {
    id: 'glass-slate',
    name: 'Ardoise Titane',
    category: 'dark',
    bgClass: 'bg-slate-900/45 dark:bg-slate-950/65',
    borderClass: 'border-slate-500/40 dark:border-slate-400/35',
    textClass: 'text-slate-200',
    glowClass: 'shadow-slate-950/60',
    previewBg: 'rgba(15,23,42,0.55)',
    previewBorder: 'rgba(100,116,139,0.4)',
  },
  {
    id: 'glass-lime',
    name: 'Lime Végétal',
    category: 'emerald',
    bgClass: 'bg-lime-950/40 dark:bg-lime-950/60',
    borderClass: 'border-lime-500/50 dark:border-lime-400/45',
    textClass: 'text-lime-200',
    glowClass: 'shadow-lime-950/60',
    previewBg: 'rgba(26,46,5,0.5)',
    previewBorder: 'rgba(132,204,22,0.5)',
  },
  {
    id: 'glass-white',
    name: 'Cristal Blanc Givré',
    category: 'light',
    bgClass: 'bg-white/25 dark:bg-white/15',
    borderClass: 'border-white/45 dark:border-white/30',
    textClass: 'text-white',
    glowClass: 'shadow-white/20 ring-1 ring-white/30',
    previewBg: 'rgba(255,255,255,0.3)',
    previewBorder: 'rgba(255,255,255,0.5)',
  },
  {
    id: 'glass-solar',
    name: 'Solaire Radiant',
    category: 'gold',
    bgClass: 'bg-amber-600/30 dark:bg-amber-500/25',
    borderClass: 'border-amber-300/60 dark:border-amber-200/50',
    textClass: 'text-amber-100',
    glowClass: 'shadow-amber-500/30 ring-1 ring-amber-300/50',
    previewBg: 'rgba(217,119,6,0.35)',
    previewBorder: 'rgba(252,211,77,0.6)',
  },
  {
    id: 'glass-silver',
    name: 'Miroir Argenté',
    category: 'light',
    bgClass: 'bg-slate-400/20 dark:bg-slate-300/15',
    borderClass: 'border-slate-200/50 dark:border-slate-100/40',
    textClass: 'text-slate-100',
    glowClass: 'shadow-slate-300/20',
    previewBg: 'rgba(148,163,184,0.25)',
    previewBorder: 'rgba(226,232,240,0.5)',
  },
];

// 21 Distinct Shapes & Morphologies
export const FLOATING_BACK_SHAPES: FloatingBackButtonShapePreset[] = [
  {
    id: 'circle',
    name: 'Cercle Pur',
    desc: 'Rond classique équilibré',
    containerClass: 'rounded-full',
  },
  {
    id: 'squircle',
    name: 'Squircle Moderne',
    desc: 'Super-ellipse douce iOS/Android',
    containerClass: 'rounded-2xl',
  },
  {
    id: 'rounded-square',
    name: 'Carré Arrondi',
    desc: 'Carré doux et structuré',
    containerClass: 'rounded-xl',
  },
  {
    id: 'pill-vertical',
    name: 'Gélule Verticale',
    desc: 'Capsule haute ergonomique',
    containerClass: 'rounded-full scale-y-110',
  },
  {
    id: 'pill-horizontal',
    name: 'Capsule Horizontale',
    desc: 'Format bouton allongé',
    containerClass: 'rounded-full scale-x-110',
  },
  {
    id: 'diamond',
    name: 'Losange Mystique',
    desc: 'Rotatif à 45° géométrique',
    containerClass: 'rounded-xl rotate-45',
    innerClass: '-rotate-45',
  },
  {
    id: 'hexagon',
    name: 'Hexagone Régulier',
    desc: '6 faces géométriques sacrées',
    containerClass: 'rounded-none',
    style: { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  },
  {
    id: 'octagon',
    name: 'Octogone Sacré',
    desc: '8 côtés Khatim As-Sulayman',
    containerClass: 'rounded-none',
    style: { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  },
  {
    id: 'shield',
    name: 'Bouclier Protecteur',
    desc: 'Protection spirituelle',
    containerClass: 'rounded-none',
    style: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 68%, 50% 100%, 0% 68%)' },
  },
  {
    id: 'teardrop-left',
    name: 'Goutte Gauche',
    desc: 'Pointe directionnelle vers le retour',
    containerClass: 'rounded-tl-none rounded-tr-3xl rounded-br-3xl rounded-bl-3xl',
  },
  {
    id: 'teardrop-bottom',
    name: 'Goutte Basse',
    desc: 'Goutte de lumière zénithale',
    containerClass: 'rounded-t-full rounded-b-none',
  },
  {
    id: 'leaf-soft',
    name: 'Feuille Zen',
    desc: 'Courbes asymétriques naturelles',
    containerClass: 'rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md',
  },
  {
    id: 'leaf-inverted',
    name: 'Feuille Inversée',
    desc: 'Symétrie végétale croisée',
    containerClass: 'rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md',
  },
  {
    id: 'badge',
    name: 'Badge Festonné',
    desc: 'Médaillon précieux',
    containerClass: 'rounded-3xl',
    style: { clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)' },
  },
  {
    id: 'star-4',
    name: 'Étoile à 4 Branches',
    desc: 'Étoile sacrée Najm',
    containerClass: 'rounded-none',
    style: { clipPath: 'polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)' },
  },
  {
    id: 'chamfer',
    name: 'Biseau Futuriste',
    desc: 'Coins biseautés high-tech',
    containerClass: 'rounded-none',
    style: { clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)' },
  },
  {
    id: 'flower-4',
    name: 'Fleur à 4 Lobes',
    desc: 'Trèfle spirituel de prospérité',
    containerClass: 'rounded-2xl',
    style: { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  },
  {
    id: 'sharp-square',
    name: 'Carré Épuré',
    desc: 'Minimalisme géométrique net',
    containerClass: 'rounded-md',
  },
  {
    id: 'curved-tab',
    name: 'Onglet Flottant',
    desc: 'Bord incurvé latéral',
    containerClass: 'rounded-r-2xl rounded-l-none',
  },
  {
    id: 'arch',
    name: 'Arche Mihrab',
    desc: 'Dôme spirituel sacré',
    containerClass: 'rounded-t-full rounded-b-md',
  },
  {
    id: 'double-ring',
    name: 'Double Anneau',
    desc: 'Halo circulaire avec double cerclage',
    containerClass: 'rounded-full ring-4 ring-white/20 dark:ring-white/10 ring-offset-2 ring-offset-transparent',
  },
];

// Icon Options
export const FLOATING_BACK_ICONS = [
  { id: 'arrow-left', name: 'Flèche Standard (ArrowLeft)' },
  { id: 'chevron-left', name: 'Chevron Moderne (ChevronLeft)' },
  { id: 'corner-up-left', name: 'Flèche Ascendante (CornerUpLeft)' },
  { id: 'undo', name: 'Flèche Retour (Undo)' },
  { id: 'move-left', name: 'Flèche Fine (MoveLeft)' },
  { id: 'reply', name: 'Flèche Réponse (Reply)' },
  { id: 'arrow-left-circle', name: 'Flèche Cerclée (ArrowCircle)' },
  { id: 'chevron-left-square', name: 'Chevron Carré (ChevronSquare)' },
];

// Animation Modes
export const FLOATING_BACK_ANIMATIONS = [
  { id: 'pulse', name: 'Pulsation Douce (Pulse)', desc: 'Battement périodique subtil' },
  { id: 'bounce', name: 'Rebond Léger (Bounce)', desc: 'Mouvement fluide vers la gauche' },
  { id: 'glow', name: 'Lueur Halo (Glow)', desc: 'Aura respirante lumineuse' },
  { id: 'float', name: 'Lévitation (Float)', desc: 'Flottement vertical continu' },
  { id: 'static', name: 'Fixe Minimaliste (Static)', desc: 'Sans animation' },
  { id: 'shimmer', name: 'Reflet Métallique (Shimmer)', desc: 'Balayage lumineux' },
];

// Positions
export const FLOATING_BACK_POSITIONS = [
  { id: 'bottom-left', name: 'Bas Gauche (Standard)', class: 'left-4 bottom-24' },
  { id: 'bottom-left-high', name: 'Bas Gauche Surélevé', class: 'left-4 bottom-32' },
  { id: 'middle-left', name: 'Milieu Gauche', class: 'left-3 top-1/2 -translate-y-1/2' },
  { id: 'bottom-right', name: 'Bas Droite', class: 'right-4 bottom-24' },
];

// Icon Color Presets
export const ICON_COLOR_PRESETS = [
  { label: 'Or / Jaune', value: '#facc15', class: 'bg-yellow-400 text-black' },
  { label: 'Blanc Pur', value: '#ffffff', class: 'bg-white text-black' },
  { label: 'Émeraude', value: '#10b981', class: 'bg-emerald-500 text-white' },
  { label: 'Cyan Ciel', value: '#38bdf8', class: 'bg-sky-400 text-black' },
  { label: 'Rose Rubis', value: '#f43f5e', class: 'bg-rose-500 text-white' },
  { label: 'Violet', value: '#a855f7', class: 'bg-purple-500 text-white' },
  { label: 'Orange', value: '#fb923c', class: 'bg-orange-400 text-black' },
  { label: 'Ambre Chaud', value: '#fbbf24', class: 'bg-amber-400 text-black' },
  { label: 'Menthe', value: '#34d399', class: 'bg-teal-400 text-black' },
  { label: 'Bleu Royal', value: '#3b82f6', class: 'bg-blue-500 text-white' },
];

export function getFloatingBackButtonConfig(featureToggles: any): FloatingBackButtonConfig {
  if (!featureToggles) return DEFAULT_FLOATING_BACK_CONFIG;

  const rawConfig = featureToggles.floatingBackButton_config;
  if (rawConfig && typeof rawConfig === 'object') {
    return {
      enabled: rawConfig.enabled !== undefined ? Boolean(rawConfig.enabled) : true,
      colorPreset: rawConfig.colorPreset || DEFAULT_FLOATING_BACK_CONFIG.colorPreset,
      shape: rawConfig.shape || DEFAULT_FLOATING_BACK_CONFIG.shape,
      iconStyle: rawConfig.iconStyle || DEFAULT_FLOATING_BACK_CONFIG.iconStyle,
      iconColor: rawConfig.iconColor || DEFAULT_FLOATING_BACK_CONFIG.iconColor,
      animationMode: rawConfig.animationMode || DEFAULT_FLOATING_BACK_CONFIG.animationMode,
      glassBlur: rawConfig.glassBlur || DEFAULT_FLOATING_BACK_CONFIG.glassBlur,
      borderStyle: rawConfig.borderStyle || DEFAULT_FLOATING_BACK_CONFIG.borderStyle,
      size: Number(rawConfig.size) || DEFAULT_FLOATING_BACK_CONFIG.size,
      position: rawConfig.position || DEFAULT_FLOATING_BACK_CONFIG.position,
      opacity: rawConfig.opacity !== undefined ? Number(rawConfig.opacity) : DEFAULT_FLOATING_BACK_CONFIG.opacity,
    };
  }

  // Fallback to top-level featureToggles keys if present
  return {
    enabled: featureToggles.floatingBackButton_enabled !== undefined 
      ? Boolean(featureToggles.floatingBackButton_enabled) 
      : (featureToggles.floating_back_button_enabled !== undefined 
          ? Boolean(featureToggles.floating_back_button_enabled) 
          : true),
    colorPreset: featureToggles.floatingBackButton_colorPreset || featureToggles.floating_back_button_color || DEFAULT_FLOATING_BACK_CONFIG.colorPreset,
    shape: featureToggles.floatingBackButton_shape || featureToggles.floating_back_button_shape || DEFAULT_FLOATING_BACK_CONFIG.shape,
    iconStyle: featureToggles.floatingBackButton_iconStyle || featureToggles.floating_back_button_icon || DEFAULT_FLOATING_BACK_CONFIG.iconStyle,
    iconColor: featureToggles.floatingBackButton_iconColor || featureToggles.floating_back_button_icon_color || DEFAULT_FLOATING_BACK_CONFIG.iconColor,
    animationMode: featureToggles.floatingBackButton_animationMode || featureToggles.floating_back_button_animation || DEFAULT_FLOATING_BACK_CONFIG.animationMode,
    glassBlur: featureToggles.floatingBackButton_glassBlur || DEFAULT_FLOATING_BACK_CONFIG.glassBlur,
    borderStyle: featureToggles.floatingBackButton_borderStyle || DEFAULT_FLOATING_BACK_CONFIG.borderStyle,
    size: Number(featureToggles.floatingBackButton_size) || DEFAULT_FLOATING_BACK_CONFIG.size,
    position: featureToggles.floatingBackButton_position || DEFAULT_FLOATING_BACK_CONFIG.position,
    opacity: featureToggles.floatingBackButton_opacity !== undefined ? Number(featureToggles.floatingBackButton_opacity) : DEFAULT_FLOATING_BACK_CONFIG.opacity,
  };
}
