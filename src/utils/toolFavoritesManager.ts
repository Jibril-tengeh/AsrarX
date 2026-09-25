/**
 * AsrarHub - Tool Favorites Manager
 * Allows users to bookmark/favorite spiritual tools, persisting locally
 * and synchronizing across components and tabs via custom events.
 */

const FAVORITES_STORAGE_KEY = 'asrar_favorite_tools';
const FAVORITES_EVENT = 'asrar_tool_favorites_updated';

/**
 * Get the list of favorite tool IDs from localStorage
 */
export function getFavoriteToolIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      // Default to quick access tools if available, or a starter list
      const starter = ['abjad', 'tasbih', 'names-of-allah', 'khatim'];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[ToolFavoritesManager] Error reading favorites:', err);
    return [];
  }
}

/**
 * Save favorite tool IDs to localStorage and broadcast change
 */
export function saveFavoriteToolIds(ids: string[]): void {
  try {
    const uniqueIds = Array.from(new Set(ids));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(uniqueIds));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { favorites: uniqueIds } }));
    }
  } catch (err) {
    console.error('[ToolFavoritesManager] Error saving favorites:', err);
  }
}

/**
 * Check if a tool is favorited
 */
export function isToolFavorite(toolId: string): boolean {
  const favorites = getFavoriteToolIds();
  return favorites.includes(toolId);
}

/**
 * Toggle favorite status of a single tool.
 * Returns true if now favorited, false if removed.
 */
export function toggleFavoriteTool(toolId: string): boolean {
  const current = getFavoriteToolIds();
  const exists = current.includes(toolId);
  let updated: string[];

  if (exists) {
    updated = current.filter((id) => id !== toolId);
  } else {
    updated = [toolId, ...current];
  }

  saveFavoriteToolIds(updated);
  return !exists;
}

/**
 * Add a tool to favorites
 */
export function addFavoriteTool(toolId: string): void {
  const current = getFavoriteToolIds();
  if (!current.includes(toolId)) {
    saveFavoriteToolIds([toolId, ...current]);
  }
}

/**
 * Remove a tool from favorites
 */
export function removeFavoriteTool(toolId: string): void {
  const current = getFavoriteToolIds();
  saveFavoriteToolIds(current.filter((id) => id !== toolId));
}

/**
 * Batch add or remove favorites
 */
export function batchUpdateFavorites(toolIds: string[], shouldFavorite: boolean): void {
  const current = new Set(getFavoriteToolIds());
  if (shouldFavorite) {
    toolIds.forEach((id) => current.add(id));
  } else {
    toolIds.forEach((id) => current.delete(id));
  }
  saveFavoriteToolIds(Array.from(current));
}
