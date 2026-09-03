import React, { useState, useEffect, useRef } from 'react';
import {
  HardDrive,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Eye,
  FileText,
  ImageIcon,
  Music,
  Film,
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface StoredMediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'audio' | 'video' | 'document' | 'other';
  sizeBytes?: number;
  uploadedAt: string;
  storagePath?: string;
  alt?: string;
}

const LOCAL_STORAGE_MEDIA_KEY = 'asrarhub_admin_media_catalog_v1';

export const AdminMediaStorageManager: React.FC = () => {
  const [files, setFiles] = useState<StoredMediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'video' | 'document'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<StoredMediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from Firestore and sync with fallback localStorage catalog
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadMediaFiles = async () => {
      setLoading(true);
      try {
        const mediaRef = collection(db, 'media_storage');
        const q = query(mediaRef, orderBy('uploadedAt', 'desc'));

        unsubscribe = onSnapshot(q, (snapshot) => {
          const list: StoredMediaFile[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<StoredMediaFile, 'id'>),
          }));
          setFiles(list);
          localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(list));
          setLoading(false);
        }, (err) => {
          console.warn('[Storage Manager] Firestore snapshot warning, using local catalog fallback:', err);
          const cached = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
          if (cached) {
            try {
              setFiles(JSON.parse(cached));
            } catch (e) {}
          }
          setLoading(false);
        });
      } catch (err) {
        console.error('[Storage Manager] Error loading media files:', err);
        const cached = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
        if (cached) {
          try {
            setFiles(JSON.parse(cached));
          } catch (e) {}
        }
        setLoading(false);
      }
    };

    loadMediaFiles();

    return () => unsubscribe();
  }, []);

  // Handle direct file uploads (image, audio, video)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(20);

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const mimeType = file.type;

      let mediaKind: 'image' | 'audio' | 'video' | 'document' | 'other' = 'other';
      if (mimeType.startsWith('image/')) mediaKind = 'image';
      else if (mimeType.startsWith('audio/')) mediaKind = 'audio';
      else if (mimeType.startsWith('video/')) mediaKind = 'video';
      else if (mimeType.includes('pdf') || mimeType.includes('text')) mediaKind = 'document';

      let fileUrl = '';
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `media_uploads/${Date.now()}_${safeFileName}`;

      // 1. Try Firebase Storage first (ideal for cloud hosting and bypasses Firestore document limits)
      try {
        const fileRef = ref(storage, storagePath);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      } catch (storageErr) {
        console.warn('[Storage Manager] Firebase Storage upload skipped or unavailable:', storageErr);
      }

      // 2. Fallback if storage not available
      if (!fileUrl) {
        if (file.size < 600000) {
          // Small file (< 600KB) can safely be stored as base64 without exceeding Firestore's 1MB limit
          fileUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        } else {
          // Large file without storage: create local URL to prevent Firestore 1MB error
          fileUrl = URL.createObjectURL(file);
        }
      }

      if (fileUrl) {
        const newDoc: Omit<StoredMediaFile, 'id'> = {
          name: file.name,
          url: fileUrl.length > 600000 ? `/media/${safeFileName}` : fileUrl,
          type: mediaKind,
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
          storagePath: storagePath,
        };

        try {
          // Only save to Firestore if the URL is not a massive base64 string
          if (newDoc.url.length <= 600000) {
            const docRef = await addDoc(collection(db, 'media_storage'), newDoc);
            const fileWithId: StoredMediaFile = { id: docRef.id, ...newDoc, url: fileUrl };
            setFiles((prev) => [fileWithId, ...prev]);
          } else {
            throw new Error('File data too large for Firestore direct storage');
          }
        } catch (err) {
          console.warn('[Storage Manager] Firestore write skipped/failed, keeping in local session:', err);
          const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          const fileWithId: StoredMediaFile = { id: localId, ...newDoc, url: fileUrl };
          setFiles((prev) => [fileWithId, ...prev]);
        }
      }

      setUploadProgress(Math.round(((i + 1) / uploadedFiles.length) * 100));
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete file from Firestore and Storage catalog
  const handleDeleteFile = async (fileItem: StoredMediaFile) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le fichier "${fileItem.name}" ?`)) {
      return;
    }

    // Try deleting from Firebase Storage if path exists
    if (fileItem.storagePath) {
      try {
        const fileRef = ref(storage, fileItem.storagePath);
        await deleteObject(fileRef);
      } catch (e) {
        console.warn('[Storage Manager] Firebase storage file delete warning:', e);
      }
    }

    // Delete document from Firestore
    try {
      if (!fileItem.id.startsWith('local-')) {
        await deleteDoc(doc(db, 'media_storage', fileItem.id));
      }
    } catch (e) {
      console.warn('[Storage Manager] Firestore doc delete warning:', e);
    }

    // Update state and local storage
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileItem.id);
      localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(updated));
      return updated;
    });

    if (previewFile?.id === fileItem.id) {
      setPreviewFile(null);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || f.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalImages = files.filter((f) => f.type === 'image').length;
  const totalAudios = files.filter((f) => f.type === 'audio').length;
  const totalVideos = files.filter((f) => f.type === 'video').length;
  const totalDocs = files.filter((f) => f.type === 'document' || f.type === 'other').length;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1">
              <HardDrive size={16} />
              <span>Gestionnaire Firebase Storage & Fichiers Articles</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Stockage & Médias Téléversés</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Consultez, téléversez et supprimez facilement toutes les images, fichiers audio et vidéos stockés pour vos articles.
            </p>
          </div>

          <div>
            <input
              type="file"
              multiple
              accept="image/*,audio/*,video/*,.pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl text-sm shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Upload size={18} className="text-emerald-600" />
              <span>{isUploading ? `Téléversement (${uploadProgress}%)...` : 'Téléverser un Fichier'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar during upload */}
      {isUploading && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <div className="flex justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            <span>Téléversement en cours dans le stockage...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-emerald-200 dark:bg-emerald-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <span className="text-xs font-bold uppercase">Images</span>
            <ImageIcon size={18} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{totalImages}</span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-1">
            <span className="text-xs font-bold uppercase">Audios (.mp3)</span>
            <Music size={18} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{totalAudios}</span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-xs font-bold uppercase">Vidéos (.mp4)</span>
            <Film size={18} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{totalVideos}</span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase">Documents</span>
            <FileText size={18} />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">{totalDocs}</span>
        </div>
      </div>

      {/* Controls: Search Bar & Type Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un fichier par nom ou URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedType === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Tous ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('image')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedType === 'image' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Images
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('audio')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedType === 'audio' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Audios
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('video')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedType === 'video' ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Vidéos
          </button>
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 flex flex-col items-center gap-2">
          <RefreshCw size={24} className="animate-spin text-emerald-600" />
          <span className="text-xs font-bold">Chargement des fichiers du stockage...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 p-12 text-center">
          <FolderOpen size={48} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Aucun fichier trouvé</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            {searchQuery ? "Aucun fichier ne correspond à votre recherche." : "Vous n'avez téléversé aucun fichier dans Storage pour le moment."}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <Upload size={14} /> Importer un fichier maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((fileItem) => (
            <div
              key={fileItem.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Media Thumbnail Container */}
              <div className="relative bg-gray-900 h-40 flex items-center justify-center overflow-hidden">
                {fileItem.type === 'image' && (
                  <img src={fileItem.url} alt={fileItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}

                {fileItem.type === 'video' && (
                  <video src={fileItem.url} className="w-full h-full object-cover" muted />
                )}

                {fileItem.type === 'audio' && (
                  <div className="flex flex-col items-center justify-center text-purple-300 p-4 w-full">
                    <Music size={40} className="mb-2 text-purple-400" />
                    <audio controls src={fileItem.url} className="w-full h-8" />
                  </div>
                )}

                {fileItem.type === 'document' && (
                  <div className="flex flex-col items-center justify-center text-gray-300 p-4">
                    <FileText size={40} className="mb-2 text-gray-400" />
                  </div>
                )}

                {/* Badge Type */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/70 backdrop-blur-xs flex items-center gap-1">
                  {fileItem.type === 'image' && <ImageIcon size={11} className="text-blue-400" />}
                  {fileItem.type === 'audio' && <Music size={11} className="text-purple-400" />}
                  {fileItem.type === 'video' && <Film size={11} className="text-amber-400" />}
                  <span className="capitalize">{fileItem.type}</span>
                </div>

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewFile(fileItem)}
                    className="p-2.5 bg-white text-gray-900 rounded-full font-bold shadow-md hover:scale-110 transition-transform"
                    title="Visualiser le fichier"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(fileItem)}
                    className="p-2.5 bg-red-600 text-white rounded-full font-bold shadow-md hover:scale-110 transition-transform"
                    title="Supprimer définitivement du stockage"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate mb-1" title={fileItem.name}>
                    {fileItem.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
                    <span>{formatFileSize(fileItem.sizeBytes)}</span>
                    <span>{new Date(fileItem.uploadedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(fileItem.url, fileItem.id)}
                    className="flex-1 py-1.5 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === fileItem.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedId === fileItem.id ? 'Copié !' : 'Copier URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFile(fileItem)}
                    className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors"
                    title="Supprimer de Firebase Storage"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <span className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-md">
                {previewFile.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-black flex items-center justify-center min-h-[250px]">
              {previewFile.type === 'image' && (
                <img src={previewFile.url} alt={previewFile.name} className="max-h-[60vh] object-contain rounded-lg shadow-md" />
              )}
              {previewFile.type === 'video' && (
                <video controls autoPlay src={previewFile.url} className="max-h-[60vh] rounded-lg shadow-md" />
              )}
              {previewFile.type === 'audio' && (
                <div className="w-full max-w-md p-6 bg-purple-950/80 rounded-2xl text-center">
                  <Music size={48} className="mx-auto text-purple-400 mb-3" />
                  <p className="text-sm font-bold text-white mb-4">{previewFile.name}</p>
                  <audio controls autoPlay src={previewFile.url} className="w-full" />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewFile.url, 'modal')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedId === 'modal' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedId === 'modal' ? 'URL Copiée !' : 'Copier l\'Lien Direct'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteFile(previewFile)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
