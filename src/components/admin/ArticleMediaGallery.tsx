import React, { useState } from 'react';
import {
  ImageIcon,
  Crop,
  Film,
  Music,
  Youtube,
  Trash2,
  Eye,
  Copy,
  Check,
  X,
  Grid,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { checkMediaUrlValidity } from '../TipTapEditor';
import { ImageCropperModal, ImageCropResult } from '../common/ImageCropperModal';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'embed';
  src: string;
  originalTag: string;
  title?: string;
  alt?: string;
}

interface ArticleMediaGalleryProps {
  content: string;
  onChangeContent: (newContent: string) => void;
}

export const ArticleMediaGallery: React.FC<ArticleMediaGalleryProps> = ({ content, onChangeContent }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'embed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPreviewMedia, setSelectedPreviewMedia] = useState<MediaItem | null>(null);
  const [cropperMedia, setCropperMedia] = useState<MediaItem | null>(null);

  const handleCropComplete = (result: ImageCropResult) => {
    if (!cropperMedia) return;
    const oldSrc = cropperMedia.src;
    const newHtml = content.replace(oldSrc, result.dataUrl);
    onChangeContent(newHtml);
    if (selectedPreviewMedia && selectedPreviewMedia.id === cropperMedia.id) {
      setSelectedPreviewMedia({
        ...selectedPreviewMedia,
        src: result.dataUrl
      });
    }
    setCropperMedia(null);
  };

  // Extract all media items from the HTML content string
  const extractMediaFromContent = (html: string): MediaItem[] => {
    if (!html) return [];
    const items: MediaItem[] = [];
    let count = 0;

    // 1. Extract <img> tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      count++;
      const fullTag = match[0];
      const src = match[1];
      const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
      items.push({
        id: `img-${count}-${src.substring(0, 20)}`,
        type: 'image',
        src,
        originalTag: fullTag,
        alt: altMatch ? altMatch[1] : 'Image article',
      });
    }

    // 2. Extract <video> tags
    const videoRegex = /<video[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = videoRegex.exec(html)) !== null) {
      count++;
      const fullTag = match[0];
      const src = match[1];
      items.push({
        id: `vid-${count}-${src.substring(0, 20)}`,
        type: 'video',
        src,
        originalTag: fullTag,
      });
    }

    // 3. Extract <audio> tags
    const audioRegex = /<audio[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = audioRegex.exec(html)) !== null) {
      count++;
      const fullTag = match[0];
      const src = match[1];
      items.push({
        id: `aud-${count}-${src.substring(0, 20)}`,
        type: 'audio',
        src,
        originalTag: fullTag,
      });
    }

    // 4. Extract <iframe> tags
    const iframeRegex = /<iframe[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = iframeRegex.exec(html)) !== null) {
      count++;
      const fullTag = match[0];
      const src = match[1];
      items.push({
        id: `embed-${count}-${src.substring(0, 20)}`,
        type: 'embed',
        src,
        originalTag: fullTag,
      });
    }

    return items;
  };

  const mediaList = extractMediaFromContent(content);

  const filteredList = mediaList.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMediaTag = (item: MediaItem) => {
    if (!window.confirm('Voulez-vous vraiment retirer ce média de l\'article ?')) return;

    // Remove the tag from the content
    let updatedContent = content.replace(item.originalTag, '');

    // Cleanup empty paragraphs or double line breaks if needed
    updatedContent = updatedContent.replace(/<p>\s*<\/p>/gi, '');

    onChangeContent(updatedContent);
  };

  const imageCount = mediaList.filter((m) => m.type === 'image').length;
  const videoCount = mediaList.filter((m) => m.type === 'video').length;
  const audioCount = mediaList.filter((m) => m.type === 'audio').length;
  const embedCount = mediaList.filter((m) => m.type === 'embed').length;

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Grid size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>Galerie Médias de l'Article ({mediaList.length} détecté{mediaList.length > 1 ? 's' : ''})</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Aperçu visuel et gestion directe des images, vidéos, audios et intégrations de votre brouillon
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-gray-200/80 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
          >
            Tous ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('image')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${activeFilter === 'image' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
          >
            <ImageIcon size={13} />
            <span>Images ({imageCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('video')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${activeFilter === 'video' ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
          >
            <Film size={13} />
            <span>Vidéos ({videoCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('audio')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${activeFilter === 'audio' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-xs font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
          >
            <Music size={13} />
            <span>Audios ({audioCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('embed')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${activeFilter === 'embed' ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-xs font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
          >
            <Youtube size={13} />
            <span>Embeds ({embedCount})</span>
          </button>
        </div>
      </div>

      {mediaList.length === 0 ? (
        <div className="py-8 text-center bg-white dark:bg-gray-900/60 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
          <Sparkles className="mx-auto text-emerald-500 mb-2 opacity-60" size={28} />
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Aucun média inséré dans l'article pour le moment</p>
          <p className="text-[11px] text-gray-500 mt-1">Utilisez la barre d'outils de l'éditeur pour ajouter des images, des sons ou des vidéos.</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-6 text-center text-xs text-gray-500">
          Aucun média du type "{activeFilter}" trouvé dans cet article.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const validation = checkMediaUrlValidity(
              item.src,
              item.type === 'embed' ? 'embed' : item.type === 'video' ? 'video' : item.type === 'audio' ? 'audio' : 'video'
            );

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative bg-gray-900 h-36 flex items-center justify-center overflow-hidden group">
                  {item.type === 'image' && (
                    <img
                      src={item.src}
                      alt={item.alt || 'Aperçu'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {item.type === 'video' && (
                    <video src={item.src} className="w-full h-full object-cover" muted />
                  )}

                  {item.type === 'audio' && (
                    <div className="flex flex-col items-center justify-center text-purple-300 p-4 w-full">
                      <Music size={36} className="mb-2 text-purple-400" />
                      <audio controls src={item.src} className="w-full h-8" />
                    </div>
                  )}

                  {item.type === 'embed' && (
                    <div className="flex flex-col items-center justify-center text-red-300 p-4 text-center">
                      <Youtube size={36} className="text-red-500 mb-1" />
                      <span className="text-xs font-mono text-gray-300 truncate max-w-full px-2">{item.src}</span>
                    </div>
                  )}

                  {/* Badge overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/70 backdrop-blur-xs">
                    {item.type === 'image' && <ImageIcon size={12} className="text-blue-400" />}
                    {item.type === 'video' && <Film size={12} className="text-amber-400" />}
                    {item.type === 'audio' && <Music size={12} className="text-purple-400" />}
                    {item.type === 'embed' && <Youtube size={12} className="text-red-400" />}
                    <span className="capitalize">{item.type}</span>
                  </div>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPreviewMedia(item)}
                      className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full font-bold shadow-md transition-transform hover:scale-110"
                      title="Agrandir / Tester le média"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMediaTag(item)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-md transition-transform hover:scale-110"
                      title="Supprimer ce média de l'article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Details Footer */}
                <div className="p-3">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        validation.isValid
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {validation.isValid ? (
                        <CheckCircle2 size={13} className="shrink-0" />
                      ) : (
                        <AlertTriangle size={13} className="shrink-0" />
                      )}
                      <span>{validation.isValid ? 'URL Valide' : 'URL Suspecte'}</span>
                    </span>

                    {validation.type && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono text-[10px]">
                        {validation.type}
                      </span>
                    )}
                  </div>

                  {/* URL Text */}
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate mb-3 bg-gray-50 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                    {item.src}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => setSelectedPreviewMedia(item)}
                      className="flex-1 py-1.5 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye size={13} />
                      <span>Aperçu</span>
                    </button>

                    {item.type === 'image' && (
                      <button
                        type="button"
                        onClick={() => setCropperMedia(item)}
                        className="py-1.5 px-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        title="Recadrer cette image"
                      >
                        <Crop size={13} />
                        <span className="hidden sm:inline">Recadrer</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCopy(item.src, item.id)}
                      className="py-1.5 px-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Copier l'URL"
                    >
                      {copiedId === item.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMediaTag(item)}
                      className="py-1.5 px-2.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Retirer de l'article"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- PREVIEW LIGHTBOX MODAL --- */}
      {selectedPreviewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 dark:text-white capitalize">
                  Aperçu du Média ({selectedPreviewMedia.type})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreviewMedia(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-black min-h-[300px]">
              {selectedPreviewMedia.type === 'image' && (
                <img
                  src={selectedPreviewMedia.src}
                  alt={selectedPreviewMedia.alt || 'Aperçu'}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              )}

              {selectedPreviewMedia.type === 'video' && (
                <video
                  controls
                  autoPlay
                  src={selectedPreviewMedia.src}
                  className="max-h-[60vh] max-w-full rounded-lg shadow-lg"
                />
              )}

              {selectedPreviewMedia.type === 'audio' && (
                <div className="w-full max-w-md p-6 bg-purple-950/80 rounded-2xl border border-purple-800 text-center">
                  <Music size={48} className="mx-auto text-purple-400 mb-4 animate-bounce" />
                  <p className="text-sm font-bold text-white mb-4">Lecture Audio Test</p>
                  <audio controls autoPlay src={selectedPreviewMedia.src} className="w-full" />
                </div>
              )}

              {selectedPreviewMedia.type === 'embed' && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-900">
                  <iframe
                    src={selectedPreviewMedia.src}
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <a
                href={selectedPreviewMedia.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 truncate max-w-md"
              >
                <span>Ouvrir l'URL originale</span>
                <ExternalLink size={12} />
              </a>

              <div className="flex gap-2">
                {selectedPreviewMedia.type === 'image' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCropperMedia(selectedPreviewMedia);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Crop size={14} /> Recadrer l'image
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteMediaTag(selectedPreviewMedia);
                    setSelectedPreviewMedia(null);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewMedia(null)}
                  className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropperMedia && (
        <ImageCropperModal
          isOpen={!!cropperMedia}
          onClose={() => setCropperMedia(null)}
          imageSrc={cropperMedia.src}
          imageAlt={cropperMedia.alt || 'Image de l\'article'}
          onCropComplete={handleCropComplete}
          title="Recadrer l'image de l'article"
        />
      )}
    </div>
  );
};
