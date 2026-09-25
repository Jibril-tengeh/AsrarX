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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showShadow?: boolean;
  customScale?: number;
  customFit?: 'cover' | 'contain' | 'fill';
  customAspectRatio?: 'book' | 'portrait' | 'square' | 'auto';
}

/**
 * Clean 2D PDF Book Cover / Thumbnail
 * 100% Flat 2D layout (No fake 3D book spine, no 3D tilt, no 3D distortion).
 * Supports scaling (reducing/enlarging thumbnail size) and fitting mode (contain vs cover).
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

  // Dimension presets (Clean 2D aspect ratio ~ 1 : 1.4 for book covers)
  const sizeClasses = {
    xs: 'w-14 h-20 text-[6px]',
    sm: 'w-20 h-28 text-[7px]',
    md: 'w-32 h-44 text-[9px]',
    lg: 'w-44 h-60 text-xs',
    xl: 'w-56 h-76 text-sm',
    hero: 'w-64 h-88 sm:w-72 sm:h-96 text-base',
  }[size];

  return (
    <div className={`relative inline-block select-none group ${className}`}>
      {/* 2D Flat Book Cover Container */}
      <div 
        className={`relative ${sizeClasses} rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-center transition-all duration-200 ${
          showShadow ? 'shadow-sm group-hover:shadow-md' : ''
        }`}
      >
        {/* Custom Cover Image (2D Flat Preview with scale & fit support) */}
        {activeCoverUrl && !imageError ? (
          <div className="w-full h-full flex items-center justify-center p-1 overflow-hidden bg-slate-950/5 dark:bg-slate-950/40">
            <div 
              className="w-full h-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: scaleRatio !== 1 ? `scale(${scaleRatio})` : undefined,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={activeCoverUrl}
                alt={localizedTitle}
                className={`max-w-full max-h-full rounded-lg select-none transition-all duration-200 ${
                  coverFit === 'contain' 
                    ? 'w-auto h-auto object-contain' 
                    : coverFit === 'fill'
                    ? 'w-full h-full object-fill'
                    : 'w-full h-full object-cover'
                }`}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        ) : (
          /* Elegant 2D Default Book Cover (Typography & Islamic Ornamentation) */
          <div className="relative w-full h-full p-2.5 sm:p-3 flex flex-col justify-between bg-gradient-to-b from-[#fbf9f4] via-[#f7f4ed] to-[#eee8db] border border-amber-600/20 text-gray-900 rounded-xl">
            {/* Inner Border Frame */}
            <div className="absolute inset-1 sm:inset-1.5 border border-emerald-900/20 pointer-events-none rounded-lg">
              <div className="absolute inset-0.5 border border-amber-600/15 rounded-md" />
            </div>

            {/* Header Section */}
            <div className="text-center relative z-10 pt-0.5">
              <div className="font-serif tracking-widest font-black text-emerald-950 uppercase text-[9px] sm:text-[11px] leading-tight">
                ASRARHUB
              </div>
              <div className="text-[6px] sm:text-[7px] font-bold tracking-wider text-gray-600 uppercase mt-0.5 flex items-center justify-center gap-1">
                <span>CORAN</span>
                <span>•</span>
                <span>ASRAR</span>
                <span>•</span>
                <span>DU'Ā</span>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="text-center my-auto px-1 relative z-10">
              <h4 className="font-serif font-black text-emerald-950 uppercase tracking-tight leading-tight line-clamp-3 text-[10px] sm:text-[12px]">
                {localizedTitle}
              </h4>
              
              {/* Spiritual Badges Row */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-2 flex-wrap">
                <div className="w-4 h-4 rounded-full bg-emerald-900 text-white flex items-center justify-center shadow-xs" title="Protection">
                  <Shield size={9} className="text-amber-300" />
                </div>
                <div className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center shadow-xs" title="Azkar">
                  <Sparkles size={9} />
                </div>
                <div className="w-4 h-4 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-xs" title="Ouverture">
                  <Sun size={9} />
                </div>
                <div className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xs" title="Sagesse">
                  <BookOpen size={9} className="text-amber-200" />
                </div>
              </div>
            </div>

            {/* Footer / Author Section */}
            <div className="relative z-10 text-center pb-0.5">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-800/25 to-transparent mb-1" />
              <div className="font-serif font-bold text-gray-900 tracking-wider text-[8px] sm:text-[9px] truncate">
                {authorName}
              </div>
              <div className="text-[5px] sm:text-[6px] tracking-widest text-emerald-800 uppercase font-semibold">
                Édition AsrarHub
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
