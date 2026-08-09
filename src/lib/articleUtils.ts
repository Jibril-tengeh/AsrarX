/**
 * Utility function to determine if an article status string is publicly visible to non-admin users.
 * Returns false if status contains 'Draft', 'Brouillon', 'Archived', 'Archivé', 'Inactive', 'Disabled', 'Pending', etc.
 */
export const isPubliclyVisibleArticle = (status: any): boolean => {
  if (status === null || status === undefined) {
    return true; // Default to true if un-statused legacy item
  }
  const s = String(status).trim().toLowerCase();
  if (!s) return true;

  // Forbidden keywords that indicate a non-published/draft/archived state
  const forbiddenKeywords = [
    'draft',
    'brouillon',
    'archive',
    'archivé',
    'archiv',
    'inactive',
    'inactif',
    'disabled',
    'désactivé',
    'desactive',
    'pending',
    'attente',
    'hidden',
    'masqué',
    'masque'
  ];

  for (const kw of forbiddenKeywords) {
    if (s.includes(kw)) {
      return false;
    }
  }

  return true;
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
