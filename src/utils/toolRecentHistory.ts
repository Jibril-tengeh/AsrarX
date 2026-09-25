/**
 * AsrarHub - Recent Tools History Manager
 * Keeps track of the last 5 spiritual tools consulted by the user,
 * persisting them locally in localStorage and broadcasting changes.
 */

export interface RecentToolItem {
  toolId: string;
  timestamp: number;
}

const RECENT_TOOLS_KEY = 'asrarhub_recent_tools';
const RECENT_TOOLS_EVENT = 'asrarhub_recent_tools_updated';
const MAX_RECENT_TOOLS = 5;

/**
 * Retrieve the list of up to 5 recently consulted tools
 */
export function getRecentTools(): RecentToolItem[] {
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize items
    const valid = parsed.filter(
      (item) => item && typeof item.toolId === 'string' && typeof item.timestamp === 'number'
    );
    return valid.slice(0, MAX_RECENT_TOOLS);
  } catch (err) {
    console.warn('[ToolRecentHistory] Error reading recent tools:', err);
    return [];
  }
}

/**
 * Record a consulted tool into recent history (max 5 items, newest first)
 */
export function recordRecentTool(toolId: string): RecentToolItem[] {
  if (!toolId) return getRecentTools();

  try {
    const current = getRecentTools();
    // Remove if previously existing to avoid duplicates and bring to top
    const filtered = current.filter((item) => item.toolId !== toolId);
    const newEntry: RecentToolItem = {
      toolId,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_TOOLS);

    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
    // Also update legacy single tool key for backwards compatibility
    localStorage.setItem('asrarhub_last_tool', toolId);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(RECENT_TOOLS_EVENT, { detail: { recentTools: updated } })
      );
    }
    return updated;
  } catch (err) {
    console.error('[ToolRecentHistory] Error saving recent tool:', err);
    return getRecentTools();
  }
}

/**
 * Remove a specific tool from recent history
 */
export function removeRecentTool(toolId: string): RecentToolItem[] {
  try {
    const current = getRecentTools();
    const updated = current.filter((item) => item.toolId !== toolId);
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(RECENT_TOOLS_EVENT, { detail: { recentTools: updated } })
      );
    }
    return updated;
  } catch (err) {
    console.error('[ToolRecentHistory] Error removing recent tool:', err);
    return getRecentTools();
  }
}

/**
 * Clear all recent tools history
 */
export function clearRecentTools(): void {
  try {
    localStorage.removeItem(RECENT_TOOLS_KEY);
    localStorage.removeItem('asrarhub_last_tool');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(RECENT_TOOLS_EVENT, { detail: { recentTools: [] } })
      );
    }
  } catch (err) {
    console.error('[ToolRecentHistory] Error clearing recent tools:', err);
  }
}

/**
 * Format timestamp into relative display (French, English, Hausa)
 */
export function formatRecentTime(timestamp: number, language: string = 'fr'): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) {
    return language === 'fr'
      ? "À l'instant"
      : language === 'ha'
      ? 'Yanzu nan'
      : 'Just now';
  }
  if (diffMin < 60) {
    return language === 'fr'
      ? `Il y a ${diffMin} min`
      : language === 'ha'
      ? `Minti ${diffMin} da suka wuce`
      : `${diffMin}m ago`;
  }
  if (diffHours < 24) {
    return language === 'fr'
      ? `Il y a ${diffHours}h`
      : language === 'ha'
      ? `Sa'a ${diffHours} da suka wuce`
      : `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return language === 'fr'
      ? 'Hier'
      : language === 'ha'
      ? 'Jiya'
      : 'Yesterday';
  }
  return language === 'fr'
    ? `Il y a ${diffDays} j`
    : language === 'ha'
    ? `Kwana ${diffDays} da suka wuce`
    : `${diffDays}d ago`;
}
