import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Palette,
  Shapes,
  Layers,
  Activity,
  Save,
  Compass,
  Maximize2,
  ShieldCheck,
  Power,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { set } from 'idb-keyval';
import {
  FloatingBackButtonConfig,
  DEFAULT_FLOATING_BACK_CONFIG,
  FLOATING_BACK_COLORS,
  FLOATING_BACK_SHAPES,
  FLOATING_BACK_ICONS,
  FLOATING_BACK_ANIMATIONS,
  FLOATING_BACK_POSITIONS,
  ICON_COLOR_PRESETS,
  getFloatingBackButtonConfig,
} from '../../utils/floatingBackButtonConfig';
import { FloatingBackButtonRenderer } from '../FloatingBackButtonRenderer';

interface Props {
  featureToggles: any;
  onSaveConfig?: (config: FloatingBackButtonConfig) => Promise<void>;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const FloatingBackButtonSettings: React.FC<Props> = ({
  featureToggles,
  onSaveConfig,
  onShowToast,
}) => {
  const [config, setConfig] = useState<FloatingBackButtonConfig>(() =>
    getFloatingBackButtonConfig(featureToggles)
  );
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light' | 'gradient'>('dark');
  const [selectedColorCategory, setSelectedColorCategory] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync with incoming props if changed externally
  useEffect(() => {
    const current = getFloatingBackButtonConfig(featureToggles);
    setConfig((prev) => {
      // only update if not actively modified locally
      if (!hasUnsavedChanges) {
        return current;
      }
      return prev;
    });
  }, [featureToggles, hasUnsavedChanges]);

  const updateConfig = <K extends keyof FloatingBackButtonConfig>(
    key: K,
    value: FloatingBackButtonConfig[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSaveConfig) {
        await onSaveConfig(config);
      } else {
        const batch = {
          floatingBackButton_config: config,
          floatingBackButton_enabled: config.enabled,
          floatingBackButton_colorPreset: config.colorPreset,
          floatingBackButton_shape: config.shape,
          floatingBackButton_iconStyle: config.iconStyle,
          floatingBackButton_iconColor: config.iconColor,
          floatingBackButton_animationMode: config.animationMode,
          floatingBackButton_glassBlur: config.glassBlur,
          floatingBackButton_borderStyle: config.borderStyle,
          floatingBackButton_size: config.size,
          floatingBackButton_position: config.position,
          floatingBackButton_opacity: config.opacity,
        };

        const updated = { ...featureToggles, ...batch };
        try {
          localStorage.setItem('asrar_font_toggles', JSON.stringify(updated));
          await set('asrar_feature_toggles', updated);
          window.dispatchEvent(new Event('asrar_font_updated'));
        } catch (_) {}

        await setDoc(doc(db, 'settings', 'features'), batch, { merge: true });
      }

      setHasUnsavedChanges(false);
      onShowToast?.('Paramètres du bouton retour flottant enregistrés avec succès !', 'success');
    } catch (err) {
      console.error('Error saving floating back button settings:', err);
      onShowToast?.("Erreur lors de l'enregistrement des paramètres.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Voulez-vous réinitialiser le bouton retour flottant aux réglages par défaut ?')) {
      setConfig({ ...DEFAULT_FLOATING_BACK_CONFIG });
      setHasUnsavedChanges(true);
    }
  };

  const filteredColors =
    selectedColorCategory === 'all'
      ? FLOATING_BACK_COLORS
      : FLOATING_BACK_COLORS.filter((c) => c.category === selectedColorCategory);

  const activeColor =
    FLOATING_BACK_COLORS.find((c) => c.id === config.colorPreset) || FLOATING_BACK_COLORS[0];
  const activeShape =
    FLOATING_BACK_SHAPES.find((s) => s.id === config.shape) || FLOATING_BACK_SHAPES[0];

  return (
    <div className="space-y-8">
      {/* Top Banner with Activation Toggle & Live State */}
      <div className="p-5 bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white rounded-3xl border border-gray-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              config.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            <Power size={24} className={config.enabled ? 'animate-pulse' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-white">
                Bouton Retour Flottant (Quick Back Floating Icon)
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider ${
                  config.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {config.enabled ? '● ACTIF (VISIBLE)' : '○ DÉSACTIVÉ (MASQUÉ)'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Gérez la visibilité globale, les 22 couleurs translucides, les 21 formes géométriques sacrées et le mode d'affichage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
            <span>Défaut</span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig('enabled', !config.enabled)}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              config.enabled
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30'
            }`}
          >
            <Power size={15} />
            <span>{config.enabled ? "Désactiver l'Icône" : "Activer l'Icône"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Preview Box */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-amber-500" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Aperçu en Direct Interactif (Live Simulator)
            </h4>
          </div>

          {/* Preview Background Toggle */}
          <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-900 p-1 rounded-xl">
            <span className="text-[10px] font-bold text-gray-500 px-2">Fond test :</span>
            {(['dark', 'light', 'gradient'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPreviewTheme(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  previewTheme === mode
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                {mode === 'dark' ? 'Sombre' : mode === 'light' ? 'Clair' : 'Dégradé'}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Stage */}
        <div
          className={`relative w-full h-48 rounded-2xl flex flex-col items-center justify-center overflow-hidden border transition-all duration-300 ${
            previewTheme === 'dark'
              ? 'bg-gray-950 border-gray-800'
              : previewTheme === 'light'
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-950 border-emerald-800'
          }`}
        >
          {/* Subtle background text simulating an article */}
          <div className="absolute inset-0 p-6 opacity-20 pointer-events-none select-none flex flex-col gap-2 overflow-hidden text-[11px] font-serif leading-relaxed">
            <div className="font-bold text-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — Secrets & Oraisons</div>
            <p>
              Exemple de texte d'article spirituel pour tester la lisibilité et la transparence du bouton flottant au-dessus du contenu.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-white/10 rounded">Abjad: 786</span>
              <span className="px-2 py-0.5 bg-white/10 rounded">Khatim Al-Ghazali</span>
            </div>
          </div>

          {/* Interactive Button Preview */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            {config.enabled ? (
              <FloatingBackButtonRenderer
                config={config}
                isPreview={true}
                className="cursor-pointer shadow-2xl"
              />
            ) : (
              <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2">
                <Power size={16} />
                <span>Icône actuellement désactivée (masquée pour les utilisateurs)</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono bg-black/40 dark:bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
              <span className="text-amber-400 font-bold">{activeShape.name}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{activeColor.name}</span>
              <span>•</span>
              <span>{config.size}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Selector (~22 Transparent Colors) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-emerald-500" />
            <div>
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                Palette de Couleurs Translucides Glassmorphism (22 Couleurs)
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sélectionnez l'ambiance lumineuse transparente de votre choix avec verre dépoli.
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Toutes (22)' },
              { id: 'dark', label: 'Sombres' },
              { id: 'gold', label: 'Or & Ambre' },
              { id: 'emerald', label: 'Émeraude' },
              { id: 'blue', label: 'Saphir & Cyan' },
              { id: 'red', label: 'Rubis' },
              { id: 'purple', label: 'Violet' },
              { id: 'light', label: 'Claires' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedColorCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedColorCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredColors.map((color) => {
            const isSelected = config.colorPreset === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => updateConfig('colorPreset', color.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col items-center justify-between gap-2.5 cursor-pointer group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30 shadow-md scale-102'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                {/* Visual Swatch Pill */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner relative transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: color.previewBg,
                    border: `1.5px solid ${color.previewBorder}`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <ArrowLeft size={20} className={color.textClass} />
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="text-center w-full">
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {color.name}
                  </div>
                  <div className="text-[10px] text-gray-400 capitalize">{color.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shape Morphology Selector (~21 Distinct Shapes) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shapes size={20} className="text-amber-500" />
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
              Forme Géométrique & Spirituelle du Bouton (21 Formes)
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choisissez parmi 21 morphologies sacrées, contemporaines ou asymétriques.
            </p>
          </div>
        </div>

        {/* Shapes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FLOATING_BACK_SHAPES.map((shape) => {
            const isSelected = config.shape === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => updateConfig('shape', shape.id)}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-between gap-2 cursor-pointer group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-500/30 shadow-md scale-102'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
              >
                {/* Shape Thumbnail */}
                <div className="w-12 h-12 flex items-center justify-center relative">
                  <div
                    style={shape.style}
                    className={`w-10 h-10 bg-gray-900 dark:bg-gray-700 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-sm ${
                      shape.containerClass
                    }`}
                  >
                    <div className={shape.innerClass}>
                      <ArrowLeft size={16} />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-gray-950 rounded-full flex items-center justify-center shadow-md font-bold">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {shape.name}
                  </div>
                  <div className="text-[9px] text-gray-400 line-clamp-1">{shape.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Glyphs & Animation Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Icon Glyph & Custom Icon Color */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-sky-500" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Style de l'Icône de Retour & Couleur
            </h4>
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FLOATING_BACK_ICONS.map((ico) => {
              const isSelected = config.iconStyle === ico.id;
              return (
                <button
                  key={ico.id}
                  type="button"
                  onClick={() => updateConfig('iconStyle', ico.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 ring-1 ring-sky-500'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft size={18} className={isSelected ? 'text-sky-500' : ''} />
                  <span className="text-[10px] font-bold truncate w-full">{ico.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Color Presets for Icon Arrow */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Couleur de la Flèche (Icône) :
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {ICON_COLOR_PRESETS.map((ic) => (
                <button
                  key={ic.value}
                  type="button"
                  onClick={() => updateConfig('iconColor', ic.value)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer shadow-xs border ${
                    config.iconColor === ic.value ? 'ring-2 ring-offset-2 ring-sky-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: ic.value }}
                  title={ic.label}
                >
                  {config.iconColor === ic.value && (
                    <Check size={12} className={ic.value === '#ffffff' ? 'text-black' : 'text-white'} />
                  )}
                </button>
              ))}
              <input
                type="color"
                value={config.iconColor || '#facc15'}
                onChange={(e) => updateConfig('iconColor', e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0"
                title="Couleur personnalisée"
              />
            </div>
          </div>
        </div>

        {/* Animation & Blur Effects */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-purple-500" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Mode d'Animation & Verre Dépoli
            </h4>
          </div>

          {/* Animation Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FLOATING_BACK_ANIMATIONS.map((anim) => {
              const isSelected = config.animationMode === anim.id;
              return (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => updateConfig('animationMode', anim.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs font-bold">{anim.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-gray-400">{anim.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Glass Blur & Border Styles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Flou Dépoli (Blur) :
              </label>
              <select
                value={config.glassBlur || 'medium'}
                onChange={(e) => updateConfig('glassBlur', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
              >
                <option value="subtle">Léger (Subtle blur)</option>
                <option value="medium">Standard (Medium blur)</option>
                <option value="heavy">Ultra Dépoli (Frosted Heavy)</option>
                <option value="glass-neon">Néon Glow Glass</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Contour de Bordure :
              </label>
              <select
                value={config.borderStyle || 'white-subtle'}
                onChange={(e) => updateConfig('borderStyle', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-900 dark:text-white"
              >
                <option value="white-subtle">Fin Blanc Transparent</option>
                <option value="gold">Or / Ambre Sacré</option>
                <option value="emerald">Émeraude Lumineuse</option>
                <option value="neon-cyan">Cyan Néon</option>
                <option value="dashed">Tirets Discrets</option>
                <option value="none">Sans Bordure (Épuré)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Position & Sizing */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex items-center gap-2">
          <Maximize2 size={18} className="text-emerald-500" />
          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
            Position à l'Écran & Taille Diamètre
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Position d'ancrage sur l'écran :
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FLOATING_BACK_POSITIONS.map((pos) => {
                const isSelected = config.position === pos.id;
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateConfig('position', pos.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs">{pos.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Diamètre du bouton :
              </label>
              <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                {config.size} px
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="76"
              step="2"
              value={config.size || 56}
              onChange={(e) => updateConfig('size', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>40px (Compact)</span>
              <span>56px (Standard)</span>
              <span>76px (Grand)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Action Bar */}
      <div className="sticky bottom-4 z-40 p-4 bg-gray-900/95 dark:bg-gray-950/95 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          {hasUnsavedChanges ? (
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Modifications non enregistrées
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck size={16} />
              Paramètres synchronisés
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
        </button>
      </div>
    </div>
  );
};
