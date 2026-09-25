/**
 * AsrarHub - Tool Groups & Batch Favorites Manager
 * Allows grouping tools into "Quick Access" and custom user categories,
 * with batch selection, offline persistence, and event synchronization.
 */

export interface ToolGroup {
  id: string;
  name: string;
  nameEn?: string;
  nameHa?: string;
  icon: string;
  color: string;
  toolIds: string[];
  isCustom: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'asrarhub_tool_groups';
const EVENT_NAME = 'asrarhub_tool_groups_updated';

// Built-in default Quick Access group
const DEFAULT_QUICK_ACCESS_GROUP: ToolGroup = {
  id: 'quick_access',
  name: 'Accès Rapide',
  nameEn: 'Quick Access',
  nameHa: 'Sauƙin Shiga',
  icon: 'Star',
  color: 'amber',
  toolIds: ['abjad', 'tasbih', 'names-of-allah', 'khatim'],
  isCustom: false,
  createdAt: 1700000000000,
};

export const AVAILABLE_GROUP_ICONS = [
  { id: 'Star', label: 'Étoile' },
  { id: 'Sparkles', label: 'Étincelles' },
  { id: 'Shield', label: 'Bouclier' },
  { id: 'Bookmark', label: 'Marque-page' },
  { id: 'Zap', label: 'Éclair' },
  { id: 'Moon', label: 'Lune' },
  { id: 'Flame', label: 'Flamme' },
  { id: 'Compass', label: 'Boussole' },
  { id: 'Folder', label: 'Dossier' },
];

export const AVAILABLE_GROUP_COLORS = [
  { id: 'amber', label: 'Ambre Doré', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  { id: 'emerald', label: 'Émeraude', bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
  { id: 'indigo', label: 'Indigo Royal', bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
  { id: 'purple', label: 'Pourpre Mystique', bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
  { id: 'rose', label: 'Rose Rubis', bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
  { id: 'cyan', label: 'Cyan Céleste', bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500' },
];

/**
 * Retrieve all tool groups from local storage
 */
export function getToolGroups(): ToolGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveToolGroups([DEFAULT_QUICK_ACCESS_GROUP]);
      return [DEFAULT_QUICK_ACCESS_GROUP];
    }
    const parsed: ToolGroup[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveToolGroups([DEFAULT_QUICK_ACCESS_GROUP]);
      return [DEFAULT_QUICK_ACCESS_GROUP];
    }
    // Ensure quick_access exists
    const hasQuickAccess = parsed.some(g => g.id === 'quick_access');
    if (!hasQuickAccess) {
      parsed.unshift(DEFAULT_QUICK_ACCESS_GROUP);
      saveToolGroups(parsed);
    }
    return parsed;
  } catch (err) {
    console.warn('[ToolGroupsManager] Error loading groups, using default:', err);
    return [DEFAULT_QUICK_ACCESS_GROUP];
  }
}

/**
 * Save tool groups to local storage and broadcast change
 */
export function saveToolGroups(groups: ToolGroup[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { groups } }));
    }
  } catch (err) {
    console.error('[ToolGroupsManager] Error saving groups:', err);
  }
}

/**
 * Batch add multiple tools to a group
 */
export function batchAddToolsToGroup(groupId: string, toolIds: string[]): ToolGroup[] {
  const groups = getToolGroups();
  const updated = groups.map(group => {
    if (group.id === groupId) {
      const existing = new Set(group.toolIds);
      toolIds.forEach(id => existing.add(id));
      return {
        ...group,
        toolIds: Array.from(existing),
      };
    }
    return group;
  });
  saveToolGroups(updated);
  return updated;
}

/**
 * Batch remove multiple tools from a group
 */
export function batchRemoveToolsFromGroup(groupId: string, toolIds: string[]): ToolGroup[] {
  const groups = getToolGroups();
  const set = new Set(toolIds);
  const updated = groups.map(group => {
    if (group.id === groupId) {
      return {
        ...group,
        toolIds: group.toolIds.filter(id => !set.has(id)),
      };
    }
    return group;
  });
  saveToolGroups(updated);
  return updated;
}

/**
 * Toggle single tool favorite in Quick Access
 */
export function toggleQuickAccessTool(toolId: string): boolean {
  const groups = getToolGroups();
  const qa = groups.find(g => g.id === 'quick_access') || DEFAULT_QUICK_ACCESS_GROUP;
  const isPresent = qa.toolIds.includes(toolId);
  if (isPresent) {
    batchRemoveToolsFromGroup('quick_access', [toolId]);
    return false;
  } else {
    batchAddToolsToGroup('quick_access', [toolId]);
    return true;
  }
}

/**
 * Check if tool is in Quick Access
 */
export function isToolInQuickAccess(toolId: string): boolean {
  const groups = getToolGroups();
  const qa = groups.find(g => g.id === 'quick_access');
  return qa ? qa.toolIds.includes(toolId) : false;
}

/**
 * Create a new custom category/group with optional initial tools
 */
export function createCustomToolGroup(
  name: string,
  toolIds: string[] = [],
  icon: string = 'Folder',
  color: string = 'indigo'
): ToolGroup {
  const cleanName = name.trim();
  const id = `group_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newGroup: ToolGroup = {
    id,
    name: cleanName,
    icon,
    color,
    toolIds: Array.from(new Set(toolIds)),
    isCustom: true,
    createdAt: Date.now(),
  };

  const groups = getToolGroups();
  const updated = [...groups, newGroup];
  saveToolGroups(updated);
  return newGroup;
}

/**
 * Delete a custom group (cannot delete built-in quick_access)
 */
export function deleteCustomToolGroup(groupId: string): boolean {
  if (groupId === 'quick_access') return false;
  const groups = getToolGroups();
  const filtered = groups.filter(g => g.id !== groupId);
  saveToolGroups(filtered);
  return true;
}

/**
 * Update group details (name, icon, color)
 */
export function updateToolGroup(
  groupId: string,
  updates: Partial<Pick<ToolGroup, 'name' | 'icon' | 'color'>>
): ToolGroup[] {
  const groups = getToolGroups();
  const updated = groups.map(g => {
    if (g.id === groupId) {
      return { ...g, ...updates };
    }
    return g;
  });
  saveToolGroups(updated);
  return updated;
}
