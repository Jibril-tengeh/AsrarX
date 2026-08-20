import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  CornerUpLeft,
  Undo2,
  MoveLeft,
  Reply,
  ArrowLeftCircle,
  ChevronLeftSquare,
} from 'lucide-react';
import {
  FloatingBackButtonConfig,
  FLOATING_BACK_COLORS,
  FLOATING_BACK_SHAPES,
  FLOATING_BACK_POSITIONS,
} from '../utils/floatingBackButtonConfig';

interface Props {
  config: FloatingBackButtonConfig;
  onClick?: () => void;
  isPreview?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const FloatingBackButtonRenderer: React.FC<Props> = ({
  config,
  onClick,
  isPreview = false,
  className = '',
  ariaLabel = 'Retour',
}) => {
  const colorPreset =
    FLOATING_BACK_COLORS.find((c) => c.id === config.colorPreset) ||
    FLOATING_BACK_COLORS[0];

  const shapePreset =
    FLOATING_BACK_SHAPES.find((s) => s.id === config.shape) ||
    FLOATING_BACK_SHAPES[0];

  const positionPreset =
    FLOATING_BACK_POSITIONS.find((p) => p.id === config.position) ||
    FLOATING_BACK_POSITIONS[0];

  const size = config.size || 56;
  const iconSize = Math.round(size * 0.5);

  // Determine Icon Component
  const renderIcon = () => {
    const iconProps = {
      size: iconSize,
      style: { color: config.iconColor || '#facc15' },
      className: 'drop-shadow-md transition-all shrink-0',
    };

    switch (config.iconStyle) {
      case 'chevron-left':
        return <ChevronLeft {...iconProps} />;
      case 'corner-up-left':
        return <CornerUpLeft {...iconProps} />;
      case 'undo':
        return <Undo2 {...iconProps} />;
      case 'move-left':
        return <MoveLeft {...iconProps} />;
      case 'reply':
        return <Reply {...iconProps} />;
      case 'arrow-left-circle':
        return <ArrowLeftCircle {...iconProps} />;
      case 'chevron-left-square':
        return <ChevronLeftSquare {...iconProps} />;
      case 'arrow-left':
      default:
        return <ArrowLeft {...iconProps} />;
    }
  };

  // Glass blur class
  const getBlurClass = () => {
    switch (config.glassBlur) {
      case 'subtle':
        return 'backdrop-blur-xs';
      case 'heavy':
        return 'backdrop-blur-xl';
      case 'glass-neon':
        return 'backdrop-blur-md ring-2 ring-white/30';
      case 'medium':
      default:
        return 'backdrop-blur-md';
    }
  };

  // Border style
  const getBorderClass = () => {
    switch (config.borderStyle) {
      case 'gold':
        return 'border border-amber-400/60 shadow-amber-500/20';
      case 'emerald':
        return 'border border-emerald-400/60 shadow-emerald-500/20';
      case 'neon-cyan':
        return 'border border-cyan-400/60 shadow-cyan-500/30';
      case 'none':
        return 'border-0';
      case 'dashed':
        return 'border border-dashed border-white/40';
      case 'white-subtle':
      default:
        return colorPreset.borderClass || 'border border-white/30 dark:border-white/20';
    }
  };

  // Animation variants & classes
  const getAnimationProps = () => {
    if (isPreview) return {};

    switch (config.animationMode) {
      case 'bounce':
        return {
          animate: { x: [0, -6, 0] },
          transition: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' as const },
        };
      case 'float':
        return {
          animate: { y: [0, -5, 0] },
          transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
        };
      case 'glow':
        return {
          animate: {
            boxShadow: [
              '0 0 0 rgba(250,204,21,0)',
              '0 0 16px rgba(250,204,21,0.4)',
              '0 0 0 rgba(250,204,21,0)',
            ],
          },
          transition: { repeat: Infinity, duration: 2 },
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const },
        };
      case 'shimmer':
        return {
          animate: { opacity: [0.85, 1, 0.85] },
          transition: { repeat: Infinity, duration: 1.8 },
        };
      case 'static':
      default:
        return {};
    }
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...(shapePreset.style || {}),
  };

  const baseClasses = `
    relative flex items-center justify-center
    shadow-2xl select-none cursor-pointer
    transition-all duration-300
    ${colorPreset.bgClass}
    ${getBlurClass()}
    ${getBorderClass()}
    ${shapePreset.containerClass}
    ${colorPreset.glowClass || ''}
  `;

  if (isPreview) {
    return (
      <div
        style={containerStyle}
        onClick={onClick}
        className={`${baseClasses} ${className} hover:scale-105 active:scale-95`}
        title={`Aperçu: ${shapePreset.name} - ${colorPreset.name}`}
      >
        <div className={`flex items-center justify-center ${shapePreset.innerClass || ''}`}>
          {renderIcon()}
        </div>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.8 }}
      whileHover={{ scale: 1.1, x: 3 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={containerStyle}
      className={`fixed ${positionPreset.class} z-[100] ${baseClasses} ${className} hover:scale-110 active:scale-95`}
      aria-label={ariaLabel}
      {...getAnimationProps()}
    >
      <div className={`flex items-center justify-center ${shapePreset.innerClass || ''}`}>
        {renderIcon()}
      </div>
    </motion.button>
  );
};
