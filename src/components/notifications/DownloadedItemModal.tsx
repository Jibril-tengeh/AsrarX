import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  FolderArchive, 
  Trash2, 
  Eye
} from 'lucide-react';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { useNavigate } from 'react-router-dom';
import { DownloadRecord, getRecentDownloads, deleteDownloadRecord, clearAllDownloads } from '../../utils/downloadStorage';
import { useLanguage } from '../../contexts/LanguageContext';

interface DownloadedItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: DownloadRecord | null;
}

export const DownloadedItemModal: React.FC<DownloadedItemModalProps> = ({
  isOpen,
  onClose,
  initialItem,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'preview' | 'history'>('preview');
  const [currentItem, setCurrentItem] = useState<DownloadRecord | null>(initialItem || null);
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    if (initialItem) {
      setCurrentItem(initialItem);
      setActiveTab('preview');
      setZoomScale(1);
    }
  }, [initialItem]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    const list = await getRecentDownloads();
    setHistory(list);
    if (!currentItem && list.length > 0) {
      setCurrentItem(list[0]);
    }
  };

  const handleShare = async () => {
    if (!currentItem) return;

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: currentItem.fileName,
          text: `Fichier AsrarHub : ${currentItem.fileName}`,
          url: currentItem.dataUrl || undefined,
          dialogTitle: 'Partager le fichier',
        });
      } else if (navigator.share) {
        if (currentItem.dataUrl && currentItem.dataUrl.startsWith('data:image')) {
          // Convert base64 to file
          try {
            const res = await fetch(currentItem.dataUrl);
            const blob = await res.blob();
            const file = new File([blob], currentItem.fileName, { type: blob.type });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: currentItem.fileName,
                files: [file],
              });
              return;
            }
          } catch (blobErr) {
            console.warn('Blob share fallback:', blobErr);
          }
        }
        await navigator.share({
          title: currentItem.fileName,
          text: `Fichier AsrarHub : ${currentItem.fileName}`,
        });
      } else {
        // Fallback: copy link or trigger notification
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      }
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  const handleRedownload = () => {
    if (!currentItem?.dataUrl) return;
    const a = document.createElement('a');
    a.href = currentItem.dataUrl;
    a.download = currentItem.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDownloadRecord(id);
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    if (currentItem?.id === id) {
      setCurrentItem(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm(language === 'fr' ? 'Effacer tout l\'historique des téléchargements ?' : 'Clear all download history?')) {
      await clearAllDownloads();
      setHistory([]);
      setCurrentItem(null);
    }
  };

  const handleNavigateToTool = () => {
    if (currentItem?.toolRoute) {
      onClose();
      navigate(currentItem.toolRoute);
    } else {
      onClose();
      navigate('/tools');
    }
  };

  if (!isOpen) return null;

  const isImage = currentItem?.fileType === 'image' || currentItem?.fileName?.match(/\.(png|jpe?g|webp|svg)$/i);

  return (
    <AnimatePresence>
      <div 
        id="downloaded-item-modal-overlay"
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          id="downloaded-item-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`bg-gray-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden w-full text-white ${
            isFullscreen ? 'fixed inset-2 z-[100000] max-w-none h-[calc(100vh-16px)]' : 'max-w-2xl max-h-[90vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-950/80">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <CheckCircle2 size={22} className="text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400/90">
                    {language === 'fr' ? 'Fichier Téléchargé' : language === 'ha' ? 'Fayil Da Aka Zazzage' : 'Downloaded File'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                    Prêt
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-100 truncate">
                  {currentItem?.fileName || (language === 'fr' ? 'Fichier exporté' : 'Exported file')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="toggle-modal-fullscreen-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                title={isFullscreen ? 'Réduire' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                id="close-download-modal-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer"
                title="Fermer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-5 pt-3 pb-2 bg-gray-950/40 border-b border-gray-800/60">
            <button
              id="tab-download-preview-btn"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <Eye size={16} />
              {language === 'fr' ? 'Aperçu Direct' : language === 'ha' ? 'Gani Kai Tsaye' : 'Direct Preview'}
            </button>
            <button
              id="tab-download-history-btn"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
              }`}
            >
              <FolderArchive size={16} />
              {language === 'fr' ? 'Historique' : language === 'ha' ? 'Tarihin Saukewa' : 'History'}
              {history.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'history' ? 'bg-black/20 text-gray-900' : 'bg-gray-800 text-gray-300'
                }`}>
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {activeTab === 'preview' ? (
              <>
                {/* Visual Preview Canvas Box */}
                <div className="relative bg-gray-950 rounded-2xl border border-gray-800 flex flex-col items-center justify-center p-3 sm:p-6 min-h-[260px] sm:min-h-[340px] overflow-hidden group shadow-inner">
                  {/* Floating Zoom Controls for Images */}
                  {isImage && currentItem?.dataUrl && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gray-900/90 backdrop-blur-md border border-gray-700/80 rounded-xl p-1 shadow-lg">
                      <button
                        onClick={() => setZoomScale((s) => Math.min(3, s + 0.25))}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        title="Zoom +"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={() => setZoomScale((s) => Math.max(0.5, s - 0.25))}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        title="Zoom -"
                      >
                        <ZoomOut size={16} />
                      </button>
                      <button
                        onClick={() => setZoomScale(1)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        title="Réinitialiser"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-amber-400 px-2">
                        {Math.round(zoomScale * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Render Image or Fallback */}
                  {isImage && currentItem?.dataUrl ? (
                    <div className="overflow-auto max-w-full max-h-full flex items-center justify-center p-2">
                      <motion.img
                        src={currentItem.dataUrl}
                        alt={currentItem.fileName}
                        style={{ transform: `scale(${zoomScale})` }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="max-h-[380px] max-w-full object-contain rounded-xl shadow-2xl border border-amber-500/20 select-none pointer-events-auto"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                      <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        {currentItem?.fileType === 'pdf' ? (
                          <FileText size={40} />
                        ) : (
                          <ImageIcon size={40} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-200">{currentItem?.fileName || 'Document AsrarHub'}</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                          {language === 'fr' 
                            ? 'Fichier sauvegardé dans la mémoire de votre appareil (Dossier AsrarHub / Téléchargements).'
                            : 'File saved in your device storage (AsrarHub / Downloads folder).'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata & Quick Info Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-950/60 p-3.5 rounded-2xl border border-gray-800/80 text-xs">
                  <div className="flex items-center gap-2.5 text-gray-300">
                    <Clock size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <div className="text-gray-500 font-medium">{language === 'fr' ? 'Date d\'enregistrement' : 'Saved Date'}</div>
                      <div className="font-semibold text-gray-200">
                        {currentItem?.timestamp ? new Date(currentItem.timestamp).toLocaleString() : new Date().toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-gray-300">
                    <FolderArchive size={16} className="text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-gray-500 font-medium">{language === 'fr' ? 'Emplacement de stockage' : 'Storage Location'}</div>
                      <div className="font-semibold text-gray-200 truncate">
                        {Capacitor.isNativePlatform() ? 'Documents / AsrarHub' : 'Téléchargements'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {currentItem?.dataUrl && (
                    <button
                      id="download-again-btn"
                      onClick={handleRedownload}
                      className="flex-1 min-w-[140px] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      <Download size={17} />
                      {language === 'fr' ? 'Télécharger à nouveau' : language === 'ha' ? 'Sake Saukewa' : 'Download Again'}
                    </button>
                  )}

                  <button
                    id="share-download-btn"
                    onClick={handleShare}
                    className="flex-1 min-w-[120px] py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-gray-700 cursor-pointer"
                  >
                    <Share2 size={17} className="text-amber-400" />
                    {language === 'fr' ? 'Partager' : language === 'ha' ? 'Raba' : 'Share'}
                  </button>

                  {currentItem?.toolRoute && (
                    <button
                      id="view-tool-origin-btn"
                      onClick={handleNavigateToTool}
                      className="py-3 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-amber-500/30 cursor-pointer"
                    >
                      <ExternalLink size={16} />
                      {language === 'fr' ? 'Ouvrir l\'outil' : 'Open Tool'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* History Tab */
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {history.length} {language === 'fr' ? 'élément(s) exporté(s)' : 'exported items'}
                  </span>
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      {language === 'fr' ? 'Effacer tout' : 'Clear all'}
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="p-8 text-center bg-gray-950/60 rounded-2xl border border-gray-800/80 flex flex-col items-center gap-3">
                    <FolderArchive size={36} className="text-gray-600" />
                    <p className="text-xs text-gray-400">
                      {language === 'fr' ? 'Aucun téléchargement enregistré pour le moment.' : 'No saved downloads yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setCurrentItem(item);
                          setActiveTab('preview');
                          setZoomScale(1);
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          currentItem?.id === item.id
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                            : 'bg-gray-950/60 border-gray-800/80 hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.dataUrl && item.dataUrl.startsWith('data:image') ? (
                            <img
                              src={item.dataUrl}
                              alt={item.fileName}
                              className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 bg-black shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-amber-400 shrink-0">
                              <FileText size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-200 truncate">
                              {item.fileName}
                            </h4>
                            <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {copiedToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-gray-950 font-bold px-4 py-2 rounded-full text-xs shadow-xl flex items-center gap-2 z-50"
              >
                <CheckCircle2 size={15} />
                Lien copié dans le presse-papier !
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
