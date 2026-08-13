/**
 * Utility functions for resolving, sanitizing, and falling back article thumbnail images.
 * Handles raw Base64 strings, HTTP-to-HTTPS upgrades, alternative property names,
 * and provides curated high-definition spiritual and mystical Unsplash images
 * when images fail or are missing.
 */

export const DEFAULT_SPIRITUAL_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop', // Quran / Light rays
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', // Meditation / Calm sunset
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop', // Lantern / Mystical night
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop', // Sacred scroll / Parchment
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=800&auto=format&fit=crop', // Mosque architecture / Geometry
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=800&auto=format&fit=crop', // Celestial night / Stars
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', // Golden light rays
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', // Golden sands / Dunes
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', // Cosmic sky
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', // Serene mountains
];

/**
 * Sanitizes any raw image string or URL to ensure valid display in <img> tags.
 * Adds missing data:image headers for raw Base64 strings and converts http: to https:.
 */
export const sanitizeImageSource = (rawSrc?: string | null): string => {
  if (!rawSrc || typeof rawSrc !== 'string') return '';
  const trimmed = rawSrc.trim();
  if (!trimmed) return '';

  // 1. Raw Base64 string without data:image prefix
  if (!trimmed.startsWith('http') && !trimmed.startsWith('data:') && !trimmed.startsWith('/') && !trimmed.startsWith('blob:')) {
    if (trimmed.startsWith('/9j/')) return `data:image/jpeg;base64,${trimmed}`;
    if (trimmed.startsWith('iVBORw0K')) return `data:image/png;base64,${trimmed}`;
    if (trimmed.startsWith('R0lGOD')) return `data:image/gif;base64,${trimmed}`;
    if (trimmed.startsWith('UklGR')) return `data:image/webp;base64,${trimmed}`;
    if (trimmed.startsWith('PHN2Zy')) return `data:image/svg+xml;base64,${trimmed}`;
    // Generic base64 fallback
    if (/^[A-Za-z0-9+/=]+$/.test(trimmed.slice(0, 100))) {
      return `data:image/jpeg;base64,${trimmed}`;
    }
  }

  // 2. Upgrade HTTP to HTTPS for secure origins
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }

  return trimmed;
};

export const getArticleFallbackImage = (article?: { id?: string; title?: string; category?: string; subCategory?: string } | null): string => {
  if (!article) return DEFAULT_SPIRITUAL_FALLBACK_IMAGES[0];

  const cat = (article.category || '').toLowerCase();
  const sub = (article.subCategory || '').toLowerCase();
  const title = (article.title || '').toLowerCase();

  // Category & Keyword matching
  if (cat.includes('rouqyah') || cat.includes('protection') || sub.includes('protection') || title.includes('protection') || title.includes('evil eye') || title.includes('sharrin') || title.includes('pact')) {
    return 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop';
  }
  if (cat.includes('sirr') || cat.includes('secret') || sub.includes('prospérité') || sub.includes('prosperity') || title.includes('obstacle') || title.includes('unblocking') || title.includes('hurricane')) {
    return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop';
  }
  if (cat.includes('muraqabah') || sub.includes('méditation') || sub.includes('meditation') || title.includes('mental') || title.includes('blockage') || title.includes('annihilation')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop';
  }
  if (cat.includes('wird') || cat.includes('recette') || sub.includes('zikr') || title.includes('verset') || title.includes('verse') || title.includes('quran') || title.includes('al-')) {
    return 'https://images.unsplash.com/photo-1542816417-0983cbe32277?q=80&w=800&auto=format&fit=crop';
  }

  // Deterministic fallback using hash code of ID or title
  const seed = (article.id || '') + (article.title || 'asrarhub');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_SPIRITUAL_FALLBACK_IMAGES.length;
  return DEFAULT_SPIRITUAL_FALLBACK_IMAGES[index];
};

/**
 * Generates an offline-safe thematic SVG Data URI placeholder image.
 * Guarantees crisp visual rendering even when completely offline or when external image URLs fail.
 */
export const getThematicSvgPlaceholder = (article?: { id?: string; title?: string; category?: string; subCategory?: string } | null): string => {
  const cat = (article?.category || '').toLowerCase();
  const sub = (article?.subCategory || '').toLowerCase();
  const title = (article?.title || 'Asrar Hub').trim();

  let bgGradient = 'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #0f172a 100%)'; // Emerald/Dark
  let accentColor = '#f59e0b'; // Gold
  let categoryLabel = 'ASRAR & SIRR';

  if (cat.includes('rouqyah') || cat.includes('protection') || sub.includes('protection')) {
    bgGradient = 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #311042 100%)';
    accentColor = '#38bdf8';
    categoryLabel = 'ROUQYAH & PROTECTION';
  } else if (cat.includes('sirr') || cat.includes('secret') || sub.includes('prospérité')) {
    bgGradient = 'linear-gradient(135deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)';
    accentColor = '#fbbf24';
    categoryLabel = 'SIRR & LUMIÈRE';
  } else if (cat.includes('muraqabah') || sub.includes('méditation')) {
    bgGradient = 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 50%, #09090b 100%)';
    accentColor = '#c084fc';
    categoryLabel = 'MURAQABAH';
  } else if (cat.includes('wird') || cat.includes('recette') || sub.includes('zikr')) {
    bgGradient = 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)';
    accentColor = '#fcd34d';
    categoryLabel = 'WIRD & ZIKR';
  }

  // Safe XML escaping for title
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const truncatedTitle = safeTitle.length > 35 ? safeTitle.slice(0, 32) + '...' : safeTitle;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient.match(/#([0-9a-f]{6})/gi)?.[0] || '#064e3b'}"/>
        <stop offset="50%" stop-color="${bgGradient.match(/#([0-9a-f]{6})/gi)?.[1] || '#022c22'}"/>
        <stop offset="100%" stop-color="${bgGradient.match(/#([0-9a-f]{6})/gi)?.[2] || '#0f172a'}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bgGrad)"/>
    <circle cx="400" cy="260" r="220" fill="url(#glow)"/>
    
    <!-- Geometric Star Aura -->
    <g stroke="${accentColor}" stroke-opacity="0.25" stroke-width="1.5" fill="none">
      <circle cx="400" cy="250" r="140"/>
      <circle cx="400" cy="250" r="100"/>
      <polygon points="400,110 440,210 540,250 440,290 400,390 360,290 260,250 360,210"/>
      <polygon points="400,130 430,220 520,250 430,280 400,370 370,280 280,250 370,220" transform="rotate(45 400 250)"/>
    </g>

    <!-- Center Icon Symbol (Crescent and Star) -->
    <g transform="translate(400, 240) scale(1.4)" fill="${accentColor}" fill-opacity="0.9">
      <path d="M -10 -25 A 25 25 0 1 0 20 20 A 20 20 0 1 1 -10 -25 Z"/>
      <polygon points="12,-15 15,-7 23,-7 17,-2 19,6 12,1 5,6 7,-2 1,-7 9,-7"/>
    </g>

    <!-- Category Badge -->
    <rect x="250" y="380" width="300" height="28" rx="14" fill="${accentColor}" fill-opacity="0.15" stroke="${accentColor}" stroke-opacity="0.4"/>
    <text x="400" y="399" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="bold" fill="${accentColor}" text-anchor="middle" letter-spacing="2">${categoryLabel}</text>

    <!-- Article Title -->
    <text x="400" y="460" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${truncatedTitle}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

/**
 * Returns the article image URL or a category-matched fallback if missing.
 * Checks all possible thumbnail field name variations.
 */
export const getArticleImageUrl = (article?: Record<string, any> | null): string => {
  if (!article) return DEFAULT_SPIRITUAL_FALLBACK_IMAGES[0];
  
  const rawCandidate = 
    article.imageUrl || 
    article.thumbnail || 
    article.image || 
    article.image_url || 
    article.coverImage || 
    article.photo || 
    article.thumb || 
    '';

  const sanitized = sanitizeImageSource(rawCandidate);
  if (sanitized) {
    return sanitized;
  }

  return getArticleFallbackImage(article as any);
};

