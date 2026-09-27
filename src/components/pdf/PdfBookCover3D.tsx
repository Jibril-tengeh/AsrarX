import React, { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Sparkles, 
  BookOpen, 
  Sun
} from 'lucide-react';
import { PdfDocument } from '../../types/pdfDocument';
import { getPdfCoverUrl } from '../../utils/pdfCoverHelper';

interface PdfBookCoverProps {
  pdf: Partial<PdfDocument>;
  language?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'full';
  className?: string;
  showShadow?: boolean;
  customScale?: number;
  customFit?: 'cover' | 'contain' | 'fill';
  customAspectRatio?: 'book' | 'portrait' | 'square' | 'auto';
}

/**
 * Clean 2D PDF Book Cover / Thumbnail
 * 100% Flat 2D layout (No fake 3D book spine, no 3D tilt, no 3D distortion).
 * Supports scaling, fit modes, and 'full' bleed to fill card thumbnail containers.
 */
export const PdfBookCover3D: React.FC<PdfBookCoverProps> = ({
  pdf,
  language = 'fr',
  size = 'md',
  className = '',
  showShadow = true,
  customScale,
  customFit,
  customAspectRatio,
}) => {
  const [imageError, setImageError] = useState(false);

  const activeCoverUrl = getPdfCoverUrl(pdf, language);

  // Localized Titles
  const localizedTitle = 
    (language === 'en' && pdf.title_en) || 
    (language === 'ha' && pdf.title_ha) || 
    pdf.title || 
    'Document AsrarHub';

  const authorName = pdf.author || 'Jibril SBI';

  // Scale & Fit options
  const coverFit = customFit || pdf.coverFit || 'cover';
  const rawScale = customScale ?? pdf.coverScale ?? 100;
  const scaleRatio = Math.max(0.4, Math.min(1.2, rawScale / 100));

  const isFull = size === 'full';

  // Dimension presets (Clean 2D aspect ratio ~ 1 : 1.4 for book covers)
  const sizeClasses = {
    xs: 'w-14 h-20 text-[6px]',
    sm: 'w-20 h-28 text-[7px]',
    md: 'w-32 h-44 text-[9px]',
    lg: 'w-44 h-60 text-xs',
    xl: 'w-56 h-76 text-sm',
    hero: 'w-64 h-88 sm:w-72 sm:h-96 text-base',
    full: 'w-full h-full text-xs',
  }[size];

  return (
    <div className={`relative ${isFull ? 'w-full h-full block' : 'inline-block'} select-none group ${className}`}>
      {/* 2D Flat Book Cover Container */}
      <div 
        className={`relative ${sizeClasses} ${isFull ? 'rounded-none border-0' : 'rounded-xl border border-slate-200/90 dark:border-slate-700/80'} overflow-hidden bg-slate-900 flex items-center justify-center transition-all duration-200 ${
          showShadow && !isFull ? 'shadow-sm group-hover:shadow-md' : ''
        }`}
      >
        {/* Custom Cover Image (2D Flat Preview with scale & fit support) */}
        {activeCoverUrl && !imageError ? (
          <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* Ambient blur background for contain mode or transparent covers */}
            {coverFit === 'contain' && (
              <img
                src={activeCoverUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-40 select-none pointer-events-none"
              />
            )}
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                transform: !isFull && scaleRatio !== 1 ? `scale(${scaleRatio})` : undefined,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={activeCoverUrl}
                alt={localizedTitle}
                className={`select-none transition-all duration-200 ${
                  isFull
                    ? (coverFit === 'contain' ? 'max-w-full max-h-full object-contain relative z-10' : 'w-full h-full object-cover')
                    : (coverFit === 'contain' ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover')
                }`}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        ) : (
          /* Elegant 2D Default Book Cover (Full Bleed Islamic Typography & Illumination) */
          <div className={`relative w-full h-full ${isFull ? 'p-4 sm:p-5' : 'p-2.5 sm:p-3'} flex flex-col justify-between bg-gradient-to-br from-[#12261b] via-[#09150f] to-[#040906] text-white overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]`}>
            {/* Ambient Radial Golden Aura */}
            <div className="absolute inset-0 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

            {/* Inner Border Frame */}
            <div className="absolute inset-2 sm:inset-3 border border-emerald-500/30 rounded-xl pointer-events-none">
              <div className="absolute inset-1 border border-amber-500/20 rounded-lg" />
              {/* Corner Ornaments */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400" />
            </div>

            {/* Header Section */}
            <div className="text-center relative z-10 pt-1">
              <div className="font-serif tracking-[0.25em] font-black text-amber-300 uppercase text-[11px] sm:text-[13px] leading-tight drop-shadow-xs">
                ASRARHUB
              </div>
              <div className="text-[8px] sm:text-[9px] font-bold tracking-widest text-emerald-400/90 uppercase mt-0.5 flex items-center justify-center gap-1.5">
                <span>CORAN</span>
                <span>•</span>
                <span>ASRAR</span>
                <span>•</span>
                <span>DU'Ā</span>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="text-center my-auto px-2 relative z-10 py-2">
              <h4 className="font-serif font-black text-white uppercase tracking-tight leading-tight line-clamp-3 text-sm sm:text-base drop-shadow-md">
                {localizedTitle}
              </h4>
              
              {/* Spiritual Badges Row */}
              <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
                <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-amber-300 flex items-center justify-center shadow-xs" title="Protection">
                  <Shield size={11} />
                </div>
                <div className="w-5 h-5 rounded-full bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-xs" title="Azkar">
                  <Sparkles size={11} />
                </div>
                <div className="w-5 h-5 rounded-full bg-teal-500/30 border border-teal-500/40 text-teal-300 flex items-center justify-center shadow-xs" title="Ouverture">
                  <Sun size={11} />
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-xs" title="Sagesse">
                  <BookOpen size={11} />
                </div>
              </div>
            </div>

            {/* Footer / Author Section */}
            <div className="relative z-10 text-center pb-1">
              <div className="h-[1px] w-3/4 mx-auto bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent mb-1.5" />
              <div className="font-serif font-bold text-slate-200 tracking-wider text-[10px] sm:text-[11px] truncate">
                {authorName}
              </div>
              <div className="text-[7px] sm:text-[8px] tracking-widest text-emerald-400/80 uppercase font-semibold">
                Édition Spéciale AsrarHub
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Clean alias for direct usage
export const PdfBookCover = PdfBookCover3D;
