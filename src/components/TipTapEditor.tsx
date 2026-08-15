import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Node, mergeAttributes } from '@tiptap/core';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Music,
  Video,
  Code,
  Code2,
  Youtube as YoutubeIcon,
  Upload,
  X,
  Volume2,
  Film,
  Quote,
  Sparkles,
  FileCode,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Check,
  Info
} from 'lucide-react';

export interface UrlValidationResult {
  isValid: boolean;
  message: string;
  level: 'success' | 'warning' | 'error' | 'empty';
  type?: string;
}

export const checkMediaUrlValidity = (url: string, mediaKind: 'video' | 'youtube' | 'audio' | 'embed'): UrlValidationResult => {
  if (!url || !url.trim()) {
    return { isValid: false, message: 'Veuillez saisir une URL', level: 'empty' };
  }
  const trimmed = url.trim();

  // Handle data URLs or local files
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return { isValid: true, message: 'Fichier local / DataURL valide', level: 'success', type: 'local' };
  }

  // Handle iframe html code
  if (mediaKind === 'embed' && (trimmed.includes('<iframe') || trimmed.includes('src='))) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return { isValid: true, message: 'Code d\'intégration iframe valide (src: ' + srcMatch[1].substring(0, 30) + '...)', level: 'success', type: 'iframe' };
    }
    return { isValid: true, message: 'Code d\'intégration HTML valide', level: 'success', type: 'html' };
  }

  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted) && !formatted.startsWith('/') && !formatted.startsWith('#')) {
    formatted = 'https://' + formatted;
  }

  try {
    const parsed = new URL(formatted);
    const host = parsed.hostname.toLowerCase();

    if (mediaKind === 'youtube') {
      const isYouTube = host.includes('youtube.com') || host.includes('youtu.be') || host.includes('youtube-nocookie.com');
      const isVimeo = host.includes('vimeo.com');
      const isDailymotion = host.includes('dailymotion.com');
      if (isYouTube) {
        return { isValid: true, message: 'URL YouTube valide (' + host + ')', level: 'success', type: 'YouTube' };
      }
      if (isVimeo) {
        return { isValid: true, message: 'URL Vimeo valide (' + host + ')', level: 'success', type: 'Vimeo' };
      }
      if (isDailymotion) {
        return { isValid: true, message: 'URL Dailymotion valide (' + host + ')', level: 'success', type: 'Dailymotion' };
      }
      return { isValid: true, message: 'Domaine non standard pour YouTube/Vimeo. L\'intégration peut être limitée.', level: 'warning', type: 'Web' };
    }

    if (mediaKind === 'video') {
      const isVideoExt = /\.(mp4|webm|ogg|mov|m4v|m3u8)(\?.*)?$/i.test(parsed.pathname);
      const isYT = host.includes('youtube.com') || host.includes('youtu.be');
      if (isVideoExt) {
        return { isValid: true, message: 'Fichier vidéo direct valide (.mp4, .webm...)', level: 'success', type: 'MP4/WebM' };
      }
      if (isYT) {
        return { isValid: true, message: 'Lien YouTube détecté. Utilisez le bouton YouTube pour une intégration optimale.', level: 'warning', type: 'YouTube' };
      }
      return { isValid: true, message: 'URL Web valide (vérifiez que la vidéo est accessible publiquement)', level: 'success', type: 'Flux Vidéo' };
    }

    if (mediaKind === 'audio') {
      const isAudioExt = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(parsed.pathname);
      if (isAudioExt) {
        return { isValid: true, message: 'Fichier audio direct valide (.mp3, .wav...)', level: 'success', type: 'MP3/WAV' };
      }
      return { isValid: true, message: 'URL Audio Web valide', level: 'success', type: 'Flux Audio' };
    }

    return { isValid: true, message: 'URL valide', level: 'success', type: 'Web' };
  } catch (e) {
    return { isValid: false, message: 'Format d\'URL malformé. Exemple valide: https://exemple.com/video.mp4', level: 'error' };
  }
};

// Custom TipTap Node for Audio tag
export const AudioNode = Node.create({
  name: 'audio',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: 'true' },
      class: { default: 'w-full my-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio',
        getAttrs: (element: any) => ({
          src: element.getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes({ controls: 'true', class: 'w-full my-3 rounded-lg' }, HTMLAttributes)];
  },
});

// Custom TipTap Node for Video tag (MP4/WebM)
export const VideoNode = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: 'true' },
      class: { default: 'w-full max-h-[450px] rounded-xl my-4 shadow-md bg-black' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (element: any) => ({
          src: element.getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes({ controls: 'true', class: 'w-full max-h-[450px] rounded-xl my-4 shadow-md bg-black' }, HTMLAttributes)];
  },
});

// Custom TipTap Node for Iframe Embeds
export const IframeNode = Node.create({
  name: 'iframe',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      frameborder: { default: '0' },
      allowfullscreen: { default: 'true' },
      allow: { default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' },
      class: { default: 'w-full aspect-video rounded-xl my-4 border border-gray-200 dark:border-gray-700 shadow-md' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
        getAttrs: (element: any) => ({
          src: element.getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes({ frameborder: '0', allowfullscreen: 'true', class: 'w-full aspect-video rounded-xl my-4 border border-gray-200 dark:border-gray-700 shadow-md' }, HTMLAttributes)];
  },
});

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MenuBar = ({ editor, isFullScreen, onToggleFullScreen }: { editor: any; isFullScreen?: boolean; onToggleFullScreen?: () => void }) => {
  const [activeModal, setActiveModal] = useState<'link' | 'image' | 'audio' | 'video' | 'embed' | 'code' | null>(null);

  // Link state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  // Image state
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Audio state
  const [audioTab, setAudioTab] = useState<'url' | 'upload'>('url');
  const [audioUrl, setAudioUrl] = useState('');
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Video state
  const [videoTab, setVideoTab] = useState<'url' | 'upload'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Embed state
  const [embedTab, setEmbedTab] = useState<'youtube' | 'code'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [embedHtml, setEmbedHtml] = useState('');

  // Code state
  const [codeContent, setCodeContent] = useState('');

  if (!editor) {
    return null;
  }

  // --- HANDLERS ---
  const handleOpenLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );
    setLinkUrl(previousUrl);
    setLinkText(selectedText);
    setLinkNewTab(true);
    setActiveModal('link');
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    let formattedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/') && !formattedUrl.startsWith('#')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (linkText && editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${formattedUrl}" target="${linkNewTab ? '_blank' : '_self'}" rel="noopener noreferrer">${linkText}</a>`)
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: formattedUrl,
          target: linkNewTab ? '_blank' : '_self',
        })
        .run();
    }
    setActiveModal(null);
  };

  const handleUnlink = () => {
    editor.chain().focus().unsetLink().run();
    setActiveModal(null);
  };

  // Image insertion
  const handleApplyImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || 'Image' }).run();
      setImageUrl('');
      setImageAlt('');
      setActiveModal(null);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          editor.chain().focus().setImage({ src: result, alt: file.name }).run();
          setActiveModal(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Audio insertion
  const handleApplyAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (audioUrl.trim()) {
      editor.commands.insertContent({
        type: 'audio',
        attrs: { src: audioUrl.trim() },
      });
      setAudioUrl('');
      setActiveModal(null);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          editor.commands.insertContent({
            type: 'audio',
            attrs: { src: result },
          });
          setActiveModal(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Video insertion
  const handleApplyVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      editor.commands.insertContent({
        type: 'video',
        attrs: { src: videoUrl.trim() },
      });
      setVideoUrl('');
      setActiveModal(null);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          editor.commands.insertContent({
            type: 'video',
            attrs: { src: result },
          });
          setActiveModal(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Embed insertion (YouTube or HTML iframe code)
  const handleApplyEmbed = (e: React.FormEvent) => {
    e.preventDefault();
    if (embedTab === 'youtube' && youtubeUrl.trim()) {
      editor.commands.setYoutubeVideo({ src: youtubeUrl.trim() });
      setYoutubeUrl('');
      setActiveModal(null);
    } else if (embedTab === 'code' && embedHtml.trim()) {
      // Check if code contains iframe src
      const iframeMatch = embedHtml.match(/src=["']([^"']+)["']/i);
      if (iframeMatch && iframeMatch[1]) {
        editor.commands.insertContent({
          type: 'iframe',
          attrs: { src: iframeMatch[1] },
        });
      } else {
        // Raw insert
        editor.commands.insertContent(embedHtml);
      }
      setEmbedHtml('');
      setActiveModal(null);
    }
  };

  // Code Block insertion
  const handleApplyCodeBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeContent) {
      editor.chain().focus().insertContent(`<pre><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`).run();
      setCodeContent('');
      setActiveModal(null);
    } else {
      editor.chain().focus().toggleCodeBlock().run();
      setActiveModal(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl text-xs sm:text-sm">
        {/* Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded font-bold transition-colors ${editor.isActive('bold') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Gras"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic transition-colors ${editor.isActive('italic') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Italique"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Souligné"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded line-through transition-colors ${editor.isActive('strike') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Barré"
        >
          S
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 my-auto mx-0.5" />

        {/* Color Picker */}
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-7 h-7 p-0 border-0 rounded cursor-pointer bg-transparent"
          title="Couleur du texte"
        />

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 my-auto mx-0.5" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Aligner à gauche"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Centrer"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Aligner à droite"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Justifier"
        >
          <AlignJustify size={16} />
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 my-auto mx-0.5" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-1.5 py-1 rounded font-bold transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-1.5 py-1 rounded font-bold transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-1.5 py-1 rounded font-bold transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          H3
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 my-auto mx-0.5" />

        {/* Lists & Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Liste à puces"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Liste numérotée"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          title="Citation"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 my-auto mx-0.5" />

        {/* --- MEDIA & INSERTION BUTTONS --- */}
        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 p-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          {/* Link Button */}
          <button
            type="button"
            onClick={handleOpenLinkModal}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
              editor.isActive('link')
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs'
            }`}
            title="Insérer un lien"
          >
            <LinkIcon size={14} />
            <span className="hidden sm:inline">Lien</span>
          </button>

          {/* Image Button */}
          <button
            type="button"
            onClick={() => setActiveModal('image')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/60 shadow-xs transition-colors"
            title="Insérer une image"
          >
            <ImageIcon size={14} />
            <span className="hidden sm:inline">Image</span>
          </button>

          {/* Audio Button */}
          <button
            type="button"
            onClick={() => setActiveModal('audio')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/60 shadow-xs transition-colors"
            title="Insérer un fichier ou URL audio"
          >
            <Music size={14} />
            <span className="hidden sm:inline">Audio</span>
          </button>

          {/* Video MP4 Button */}
          <button
            type="button"
            onClick={() => setActiveModal('video')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/60 shadow-xs transition-colors"
            title="Insérer une vidéo MP4 / WebM"
          >
            <Film size={14} />
            <span className="hidden sm:inline">Vidéo</span>
          </button>

          {/* YouTube / Embed Button */}
          <button
            type="button"
            onClick={() => setActiveModal('embed')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/60 shadow-xs transition-colors"
            title="Intégrer YouTube ou Code Embed"
          >
            <YoutubeIcon size={14} />
            <span className="hidden sm:inline">Embed / YouTube</span>
          </button>

          {/* Code Block Button */}
          <button
            type="button"
            onClick={() => setActiveModal('code')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xs transition-colors"
            title="Insérer un bloc de code"
          >
            <Code2 size={14} />
            <span className="hidden sm:inline">Code</span>
          </button>

          {/* FullScreen Button */}
          {onToggleFullScreen && (
            <button
              type="button"
              onClick={onToggleFullScreen}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all ml-auto ${
                isFullScreen
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
              title={isFullScreen ? "Quitter le Plein Écran (Échap)" : "Basculer en Plein Écran"}
            >
              {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span className="inline">{isFullScreen ? 'Quitter Plein Écran' : 'Plein Écran'}</span>
            </button>
          )}
        </div>
      </div>

      {/* --- MODALS FOR MEDIA INSERTION --- */}

      {/* 1. LINK MODAL */}
      {activeModal === 'link' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <LinkIcon size={18} className="text-emerald-600" />
                <span>Insérer / Modifier un lien</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplyLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">URL du lien</label>
                <input
                  type="text"
                  placeholder="https://exemple.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Texte affiché (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Visiter le site officiel"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkNewTab"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="linkNewTab" className="text-xs text-gray-700 dark:text-gray-300">
                  Ouvrir dans un nouvel onglet
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onClick={handleUnlink}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                  >
                    <Unlink size={16} /> Retirer
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Insérer le lien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. IMAGE MODAL */}
      {activeModal === 'image' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-600" />
                <span>Insérer une image</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${imageTab === 'url' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Lien Web (URL)
              </button>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${imageTab === 'upload' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Importer un Fichier
              </button>
            </div>

            {imageTab === 'url' ? (
              <form onSubmit={handleApplyImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">URL de l'image</label>
                  <input
                    type="text"
                    placeholder="https://exemple.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Légende / Description (Optionnel)</label>
                  <input
                    type="text"
                    placeholder="Ex: Illustration du rituel"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!imageUrl.trim()}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Insérer l'image
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageFileInputRef}
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload size={32} className="text-blue-600" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Cliquez pour sélectionner une image</span>
                  <span className="text-xs text-gray-500">Formats supportés: PNG, JPG, WEBP, GIF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. AUDIO MODAL */}
      {activeModal === 'audio' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Music size={18} className="text-purple-600" />
                <span>Insérer un lecteur Audio</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setAudioTab('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${audioTab === 'url' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Lien Audio (URL)
              </button>
              <button
                type="button"
                onClick={() => setAudioTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${audioTab === 'upload' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Importer Fichier MP3 / Audio
              </button>
            </div>

            {audioTab === 'url' ? (
              <form onSubmit={handleApplyAudio} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">URL du fichier audio (.mp3, .wav, .m4a)</label>
                  <input
                    type="text"
                    placeholder="https://exemple.com/audio.mp3"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    autoFocus
                  />
                </div>
                {audioUrl && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block mb-2">Aperçu Audio :</span>
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!audioUrl.trim()}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Insérer l'audio
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioFileInputRef}
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Volume2 size={32} className="text-purple-600" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Cliquez pour importer un audio</span>
                  <span className="text-xs text-gray-500">Formats: MP3, WAV, M4A, OGG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. VIDEO MODAL */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Film size={18} className="text-amber-600" />
                <span>Insérer une Vidéo MP4</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setVideoTab('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${videoTab === 'url' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Lien Vidéo (URL)
              </button>
              <button
                type="button"
                onClick={() => setVideoTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${videoTab === 'upload' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Importer Vidéo MP4
              </button>
            </div>

            {videoTab === 'url' ? (
              <form onSubmit={handleApplyVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">URL du fichier vidéo (.mp4, .webm)</label>
                  <input
                    type="text"
                    placeholder="https://exemple.com/video.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    autoFocus
                  />
                </div>

                {videoUrl.trim() && (() => {
                  const check = checkMediaUrlValidity(videoUrl, 'video');
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      check.level === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : check.level === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {check.level === 'success' ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> : <AlertTriangle size={16} className="shrink-0" />}
                      <span className="font-medium">{check.message}</span>
                    </div>
                  );
                })()}

                {videoUrl && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block mb-2">Aperçu Vidéo :</span>
                    <video controls src={videoUrl} className="w-full rounded-lg max-h-40" />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!videoUrl.trim()}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Insérer la vidéo
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <input
                  type="file"
                  accept="video/*"
                  ref={videoFileInputRef}
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => videoFileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Video size={32} className="text-amber-600" />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Cliquez pour importer une vidéo</span>
                  <span className="text-xs text-gray-500">Formats: MP4, WEBM</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. EMBED / YOUTUBE MODAL */}
      {activeModal === 'embed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <YoutubeIcon size={20} className="text-red-600" />
                <span>Intégrer YouTube / Code d'intégration (Embed)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setEmbedTab('youtube')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${embedTab === 'youtube' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Lien YouTube / Vimeo
              </button>
              <button
                type="button"
                onClick={() => setEmbedTab('code')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${embedTab === 'code' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500'}`}
              >
                Code HTML / iframe Embed
              </button>
            </div>

            {embedTab === 'youtube' ? (
              <form onSubmit={handleApplyEmbed} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">URL de la vidéo YouTube / Vimeo</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                    autoFocus
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Exemple: https://www.youtube.com/watch?v=dQw4w9WgXcQ ou https://youtu.be/...</p>
                </div>

                {youtubeUrl.trim() && (() => {
                  const check = checkMediaUrlValidity(youtubeUrl, 'youtube');
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      check.level === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : check.level === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {check.level === 'success' ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> : <AlertTriangle size={16} className="shrink-0" />}
                      <span className="font-medium">{check.message}</span>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <YoutubeIcon size={16} />
                  Insérer la vidéo YouTube
                </button>
              </form>
            ) : (
              <form onSubmit={handleApplyEmbed} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Code HTML d'intégration (&lt;iframe ...&gt;)</label>
                  <textarea
                    rows={4}
                    placeholder='<iframe src="https://..." width="560" height="315" frameborder="0"></iframe>'
                    value={embedHtml}
                    onChange={(e) => setEmbedHtml(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 font-mono text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    autoFocus
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Collez le code fourni par YouTube, TikTok, Dailymotion ou un lecteur externe.</p>
                </div>

                {embedHtml.trim() && (() => {
                  const check = checkMediaUrlValidity(embedHtml, 'embed');
                  return (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      check.level === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : check.level === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                        : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                    }`}>
                      {check.level === 'success' ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> : <AlertTriangle size={16} className="shrink-0" />}
                      <span className="font-medium">{check.message}</span>
                    </div>
                  );
                })()}

                <button
                  type="submit"
                  disabled={!embedHtml.trim()}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Insérer l'intégration HTML
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. CODE BLOCK MODAL */}
      {activeModal === 'code' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 size={18} className="text-emerald-600" />
                <span>Insérer un Bloc de Code</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplyCodeBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Code source / Extrait</label>
                <textarea
                  rows={6}
                  placeholder="Collez ici votre code..."
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className="w-full bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().toggleCode().run();
                    setActiveModal(null);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-300 transition-colors"
                >
                  Code en ligne
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Insérer le bloc de code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, className }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isSettingContentRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We handle code blocks or let custom nodes run
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-emerald-600 dark:text-emerald-400 underline font-semibold hover:opacity-80',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl my-4 shadow-md',
        },
      }),
      AudioNode,
      VideoNode,
      IframeNode,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ] as any[],
    content: value || '',
    onUpdate: ({ editor }) => {
      if (isSettingContentRef.current) return;
      const html = editor.isEmpty ? '' : editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[280px] p-4 text-gray-900 dark:text-white max-w-full',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const targetHtml = value || '';
    const isTargetEmpty = !targetHtml || targetHtml === '<p></p>' || targetHtml.trim() === '';
    const isCurrentEmpty = !currentHtml || currentHtml === '<p></p>' || currentHtml.trim() === '' || editor.isEmpty;

    if (isTargetEmpty && isCurrentEmpty) {
      if (!editor.isEmpty) {
        isSettingContentRef.current = true;
        editor.commands.clearContent();
        isSettingContentRef.current = false;
      }
      return;
    }

    if (targetHtml !== currentHtml) {
      isSettingContentRef.current = true;
      if (isTargetEmpty) {
        editor.commands.clearContent();
      } else {
        editor.commands.setContent(targetHtml);
      }
      isSettingContentRef.current = false;
    }
  }, [value, editor]);

  return (
    <div
      className={`flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 transition-all ${
        isFullScreen
          ? 'fixed inset-0 z-50 p-4 sm:p-6 rounded-none border-0 bg-white dark:bg-gray-900 shadow-2xl h-screen w-screen overflow-hidden'
          : className || ''
      }`}
    >
      {isFullScreen && (
        <div className="flex items-center justify-between bg-emerald-950 text-white px-4 py-2.5 rounded-t-xl border-b border-emerald-800 mb-2">
          <div className="flex items-center gap-2">
            <Maximize2 size={18} className="text-emerald-400" />
            <span className="font-bold text-sm">Mode Éditeur Plein Écran — Espace de travail sans distraction</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-emerald-200">
            <span className="hidden sm:inline">Caractères: <strong>{editor ? editor.getText().length : 0}</strong></span>
            <button
              type="button"
              onClick={() => setIsFullScreen(false)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Minimize2 size={14} /> Quitter le Plein Écran (Échap)
            </button>
          </div>
        </div>
      )}
      <MenuBar editor={editor} isFullScreen={isFullScreen} onToggleFullScreen={() => setIsFullScreen(!isFullScreen)} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
