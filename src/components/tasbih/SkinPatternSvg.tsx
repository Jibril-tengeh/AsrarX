import React from 'react';

interface SkinPatternSvgProps {
  type: string;
  className?: string;
}

export const SkinPatternSvg: React.FC<SkinPatternSvgProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'brick':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="brick-pattern" width="60" height="24" patternUnits="userSpaceOnUse">
              {/* Row 1 */}
              <rect x="1" y="1" width="58" height="10" rx="1" fill="#c2410c" fillOpacity="0.4" stroke="#431407" strokeWidth="1.5" strokeOpacity="0.8" />
              {/* Row 2 */}
              <rect x="-29" y="13" width="58" height="10" rx="1" fill="#9a3412" fillOpacity="0.4" stroke="#431407" strokeWidth="1.5" strokeOpacity="0.8" />
              <rect x="31" y="13" width="58" height="10" rx="1" fill="#7c2d12" fillOpacity="0.4" stroke="#431407" strokeWidth="1.5" strokeOpacity="0.8" />
            </pattern>
            <radialGradient id="brick-radial-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#brick-pattern)" />
          {/* Circular ripple rings around the button */}
          <circle cx="50%" cy="65%" r="70" fill="none" stroke="#fed7aa" strokeWidth="2" strokeOpacity="0.25" />
          <circle cx="50%" cy="65%" r="95" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeOpacity="0.2" />
          <circle cx="50%" cy="65%" r="120" fill="none" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.15" />
          <rect width="100%" height="100%" fill="url(#brick-radial-glow)" />
        </svg>
      );

    case 'waves':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-pattern" width="50" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 15 Q 12.5 0, 25 15 T 50 15" fill="none" stroke="#e0f2fe" strokeWidth="2.5" strokeOpacity="0.35" />
              <path d="M 0 25 Q 12.5 10, 25 25 T 50 25" fill="none" stroke="#bae6fd" strokeWidth="1.5" strokeOpacity="0.25" />
              <path d="M 0 5 Q 12.5 -10, 25 5 T 50 5" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.2" />
            </pattern>
            <radialGradient id="wave-radial" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0.75" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-pattern)" />
          <rect width="100%" height="100%" fill="url(#wave-radial)" />
        </svg>
      );

    case 'drops':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="drop-grad-1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </radialGradient>
            <radialGradient id="drop-highlight" cx="30%" cy="30%" r="30%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Realistic raindrop clusters */}
          <g opacity="0.85">
            <ellipse cx="25%" cy="18%" rx="7" ry="6" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="23%" cy="16%" r="2" fill="url(#drop-highlight)" />

            <ellipse cx="78%" cy="22%" rx="9" ry="8" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="76%" cy="20%" r="3" fill="url(#drop-highlight)" />

            <ellipse cx="18%" cy="45%" rx="5" ry="5" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="17%" cy="44%" r="1.5" fill="url(#drop-highlight)" />

            <ellipse cx="85%" cy="52%" rx="8" ry="7" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="83%" cy="50%" r="2.5" fill="url(#drop-highlight)" />

            <ellipse cx="30%" cy="85%" rx="6" ry="5" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="29%" cy="84%" r="2" fill="url(#drop-highlight)" />

            <ellipse cx="72%" cy="82%" rx="7" ry="6" fill="url(#drop-grad-1)" stroke="#0f172a" strokeWidth="0.5" />
            <circle cx="70%" cy="80%" r="2" fill="url(#drop-highlight)" />
          </g>
        </svg>
      );

    case 'glitter':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="glitter-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.7" />
              <circle cx="10" cy="4" r="1.5" fill="#a7f3d0" fillOpacity="0.8" />
              <circle cx="6" cy="12" r="0.8" fill="#ffffff" fillOpacity="0.6" />
              <circle cx="14" cy="14" r="1.2" fill="#6ee7b7" fillOpacity="0.75" />
              <path d="M 4 2 L 6 4 L 4 6 L 2 4 Z" fill="#ecfdf5" fillOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#glitter-pattern)" />
        </svg>
      );

    case 'nebula':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="nebula-glow-1" cx="30%" cy="25%" r="50%">
              <stop offset="0%" stopColor="#e879f9" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebula-glow-2" cx="70%" cy="75%" r="60%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#nebula-glow-1)" />
          <rect width="100%" height="100%" fill="url(#nebula-glow-2)" />
          {/* Star specks */}
          <circle cx="15%" cy="20%" r="1.2" fill="#ffffff" opacity="0.9" />
          <circle cx="82%" cy="15%" r="1" fill="#ffffff" opacity="0.85" />
          <circle cx="45%" cy="38%" r="1.5" fill="#fbcfe8" opacity="0.9" />
          <circle cx="20%" cy="70%" r="1" fill="#ffffff" opacity="0.75" />
          <circle cx="85%" cy="80%" r="1.8" fill="#e0e7ff" opacity="0.9" />
        </svg>
      );

    case 'carbon':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="carbon-weave" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#27272a" />
              <rect x="6" width="6" height="6" fill="#18181b" />
              <rect y="6" width="6" height="6" fill="#18181b" />
              <rect x="6" y="6" width="6" height="6" fill="#3f3f46" />
              <line x1="0" y1="0" x2="12" y2="12" stroke="#52525b" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#carbon-weave)" />
        </svg>
      );

    case 'marble':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="marble-vein" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#78716c" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#ca8a04" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#57534e" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M -20 50 Q 80 120, 150 70 T 320 180" fill="none" stroke="url(#marble-vein)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          <path d="M 50 -10 Q 180 90, 220 220 T 350 320" fill="none" stroke="url(#marble-vein)" strokeWidth="2.5" opacity="0.5" />
          <path d="M 200 40 Q 260 140, 180 260" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.3" />
        </svg>
      );

    case 'gold':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gold-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.5" />
              <stop offset="25%" stopColor="#eab308" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#ca8a04" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-sheen)" />
        </svg>
      );

    case 'rose':
      return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rose-sheen" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#fbcfe8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#831843" stopOpacity="0.6" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#rose-sheen)" />
          <ellipse cx="65%" cy="35%" rx="50" ry="25" fill="#ffffff" fillOpacity="0.15" />
        </svg>
      );

    default:
      return null;
  }
};
