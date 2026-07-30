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
