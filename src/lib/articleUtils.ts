/**
 * Utility function to determine if an article status string is publicly visible to non-admin users.
 * Strictly excludes only "Draft" (Brouillon) and "Archive" (Archivé/Archived).
 * All other articles (Published, Publié, Public, or un-statused) are immediately visible.
 */
export const isPubliclyVisibleArticle = (status: any): boolean => {
  if (status === null || status === undefined) {
    return true; // Default to true if un-statused
  }
  const s = String(status).trim().toLowerCase();
  if (!s) return true;

  // Forbidden keywords: only drafts and archives
  const forbiddenKeywords = [
    'draft',
    'brouillon',
    'archive',
    'archivé',
    'archivee',
    'archiv'
  ];

  for (const kw of forbiddenKeywords) {
    if (s.includes(kw)) {
      return false;
    }
  }

  return true;
};

/**
 * Robustly parses any timestamp format (Firestore Timestamp, ISO string, Date object, Unix seconds/ms)
 * into a numeric millisecond timestamp for accurate mathematical sorting.
 */
export const parseArticleTimestamp = (val: any): number => {
  if (!val) return 0;
  try {
    if (typeof val === 'number') {
      // If unix seconds (e.g. 1700000000), convert to ms
      if (val < 10000000000) {
        return val * 1000;
      }
      return val;
    }
    if (typeof val === 'object') {
      if (typeof val.toDate === 'function') {
        return val.toDate().getTime();
      }
      if (typeof val.seconds === 'number') {
        return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1000000);
      }
      if (val instanceof Date) {
        return val.getTime();
      }
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return 0;
      // If pure numeric string
      if (/^\d+$/.test(trimmed)) {
        const num = Number(trimmed);
        return num < 10000000000 ? num * 1000 : num;
      }
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
};

/**
 * Stably and deterministically sorts articles in consistent order:
 * 1. Pinned articles first (if pinned)
 * 2. Explicit custom order/orderIndex (if present)
 * 3. Chronological date (newest first by default)
 * 4. Deterministic string tiebreaker by ID to prevent any layout jumping/flicker
 */
export const sortArticlesInOrder = <T extends { id?: string; [key: string]: any }>(articles: T[], descending = true): T[] => {
  if (!Array.isArray(articles)) return [];
  const copy = [...articles];

  return copy.sort((a, b) => {
    // 1. Pinned status check
    const aPinned = Boolean(a?.isPinned || a?.pinned);
    const bPinned = Boolean(b?.isPinned || b?.pinned);
    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }

    // 2. Explicit custom order index (e.g. 1, 2, 3...)
    const aOrder = typeof a?.order === 'number' ? a.order : typeof a?.orderIndex === 'number' ? a.orderIndex : null;
    const bOrder = typeof b?.order === 'number' ? b.order : typeof b?.orderIndex === 'number' ? b.orderIndex : null;
    if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // 3. Date / CreatedAt / PublishDate / UpdatedAt timestamp
    const aTime = parseArticleTimestamp(a?.createdAt || a?.publishDate || a?.updatedAt || a?.date);
    const bTime = parseArticleTimestamp(b?.createdAt || b?.publishDate || b?.updatedAt || b?.date);

    if (aTime !== bTime) {
      return descending ? bTime - aTime : aTime - bTime;
    }

    // 4. Deterministic fallback tiebreaker by ID so order is 100% stable
    const aId = String(a?.id || '');
    const bId = String(b?.id || '');
    return aId.localeCompare(bId);
  });
};

export const getTranslatedArticleTitle = (article: any, language: string): string => {
  if (!article) return '';
  if (language === 'fr') return article.title_fr || article.title || '';

  const manual = language === 'en' ? article.title_en : article.title_ha;
  if (manual && manual.trim().length > 0) return manual;

  try {
    const cached = localStorage.getItem(`asrar_trans_${article.id}_${language}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.title) return parsed.title;
    }
  } catch (e) {}

  return article.title || '';
};

export const getTranslatedArticleHook = (article: any, language: string): string => {
  if (!article) return '';
  if (language === 'fr') return article.hook_fr || article.hook || '';

  const manual = language === 'en' ? article.hook_en : article.hook_ha;
  if (manual && manual.trim().length > 0) return manual;

  try {
    const cached = localStorage.getItem(`asrar_trans_${article.id}_${language}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.hook) return parsed.hook;
    }
  } catch (e) {}

  return article.hook || '';
};
