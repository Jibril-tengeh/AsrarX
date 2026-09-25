/**
 * Manager for user bookmark folders (for classifying saved articles / secrets)
 * Persists in localStorage under 'asrar_bookmark_folders' and synchronizes via custom events.
 */

export interface BookmarkFolder {
  id: string;
  name: string;
  items: string[];
  createdAt?: number;
}

const STORAGE_KEY = 'asrar_bookmark_folders';
const EVENT_NAME = 'asrar_bookmark_folders_updated';

export const getBookmarkFolders = (): BookmarkFolder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[BookmarkFoldersManager] Error reading bookmark folders:', err);
    return [];
  }
};

export const saveBookmarkFolders = (folders: BookmarkFolder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { folders } }));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[BookmarkFoldersManager] Error saving bookmark folders:', err);
  }
};

export const createBookmarkFolder = (name: string, initialItemId?: string): BookmarkFolder | null => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const current = getBookmarkFolders();
  const newId = `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const initialItems: string[] = initialItemId ? [String(initialItemId)] : [];

  // Remove initialItemId from any existing folder if provided
  const updated = current.map((f) => {
    if (initialItemId) {
      return {
        ...f,
        items: f.items.filter((id) => String(id) !== String(initialItemId)),
      };
    }
    return f;
  });

  const newFolder: BookmarkFolder = {
    id: newId,
    name: trimmed,
    items: initialItems,
    createdAt: Date.now(),
  };

  const finalFolders = [...updated, newFolder];
  saveBookmarkFolders(finalFolders);
  return newFolder;
};

export const renameBookmarkFolder = (folderId: string, newName: string): BookmarkFolder[] => {
  const trimmed = newName.trim();
  const current = getBookmarkFolders();
  if (!trimmed) return current;

  const updated = current.map((f) => {
    if (f.id === folderId) {
      return { ...f, name: trimmed };
    }
    return f;
  });

  saveBookmarkFolders(updated);
  return updated;
};

export const deleteBookmarkFolder = (folderId: string): BookmarkFolder[] => {
  const current = getBookmarkFolders();
  const updated = current.filter((f) => f.id !== folderId);
  saveBookmarkFolders(updated);
  return updated;
};

export const assignItemToFolder = (itemId: string, folderId: string): BookmarkFolder[] => {
  const current = getBookmarkFolders();
  const strId = String(itemId);

  const updated = current.map((f) => {
    // Remove item from any folder
    const filteredItems = f.items.filter((id) => String(id) !== strId);
    // If this is target folder, append item
    if (f.id === folderId) {
      filteredItems.push(strId);
    }
    return {
      ...f,
      items: filteredItems,
    };
  });

  saveBookmarkFolders(updated);
  return updated;
};

export const subscribeBookmarkFolders = (callback: (folders: BookmarkFolder[]) => void): (() => void) => {
  const handleUpdate = () => {
    callback(getBookmarkFolders());
  };

  window.addEventListener(EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
};
