import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Search, 
  ExternalLink, 
  Eye, 
  Upload, 
  HardDrive, 
  BookOpen, 
  Save, 
  X, 
  RefreshCw,
  Sliders,
  Layers
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PdfDocument } from '../../types/pdfDocument';
import { DEFAULT_PDF_DOCUMENTS } from '../../data/defaultPdfDocuments';
import { PdfViewerModal } from '../pdf/PdfViewerModal';

export const AdminPdfDocumentsManager: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'maintenance'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PdfDocument | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<PdfDocument | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PdfDocument>>({
    title: '',
    title_en: '',
    title_ha: '',
    description: '',
    description_en: '',
    description_ha: '',
    author: '',
    category: 'asrar',
    language: 'mixed',
    pdfUrl: '',
    coverUrl: '',
    fileSize: '5.0 Mo',
    pagesCount: 50,
    isPremium: false,
    isMaintenance: false,
    maintenanceMessage: '',
    tags: [],
    featured: false,
  });

  const [tagInput, setTagInput] = useState('');

  // Subscribe to Firestore PDF collection
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const q = query(collection(db, 'pdf_documents'), orderBy('publishedAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as PdfDocument[];
          setPdfs(docs);
        } else {
          // If Firestore collection is empty, seed with default documents
          setPdfs(DEFAULT_PDF_DOCUMENTS);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore pdf subscription note:', err);
        setPdfs(DEFAULT_PDF_DOCUMENTS);
        setLoading(false);
      });
    } catch (e) {
      setPdfs(DEFAULT_PDF_DOCUMENTS);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Quick Toggle Maintenance
  const handleToggleMaintenance = async (pdf: PdfDocument) => {
    const newState = !pdf.isMaintenance;
    try {
      const docRef = doc(db, 'pdf_documents', pdf.id);
      await setDoc(docRef, { ...pdf, isMaintenance: newState }, { merge: true });
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isMaintenance: newState } : p));
    } catch (err) {
      console.error('Error toggling maintenance:', err);
      // Local state fallback
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isMaintenance: newState } : p));
    }
  };

  // Quick Toggle Premium
  const handleTogglePremium = async (pdf: PdfDocument) => {
    const newState = !pdf.isPremium;
    try {
      const docRef = doc(db, 'pdf_documents', pdf.id);
      await setDoc(docRef, { ...pdf, isPremium: newState }, { merge: true });
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isPremium: newState } : p));
    } catch (err) {
      console.error('Error toggling premium:', err);
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isPremium: newState } : p));
    }
  };

  // Delete PDF
  const handleDelete = async (pdf: PdfDocument) => {
    if (!window.confirm(`Supprimer définitivement le PDF "${pdf.title}" ?`)) return;
    try {
      await deleteDoc(doc(db, 'pdf_documents', pdf.id));
      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
    } catch (err) {
      console.error('Error deleting pdf:', err);
      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
    }
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingPdf(null);
    setFormData({
      title: '',
      title_en: '',
      title_ha: '',
      description: '',
      description_en: '',
      description_ha: '',
      author: '',
      category: 'asrar',
      language: 'mixed',
      pdfUrl: '',
      coverUrl: '',
      fileSize: '4.5 Mo',
      pagesCount: 40,
      isPremium: false,
      isMaintenance: false,
      maintenanceMessage: 'Document en cours de révision calligraphique par les administrateurs.',
      tags: ['Asrar', 'PDF'],
      featured: false,
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (pdf: PdfDocument) => {
    setEditingPdf(pdf);
    setFormData({
      ...pdf,
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Handle Local File Upload (Convert to Data URI)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Estimate file size
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' Mo';
    
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData((prev) => ({
          ...prev,
          pdfUrl: reader.result as string,
          fileSize: sizeInMb,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save PDF (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.pdfUrl) {
      alert('Veuillez fournir au moins un titre et une URL ou un fichier PDF.');
      return;
    }

    setSaving(true);
    try {
      const id = editingPdf ? editingPdf.id : `pdf_${Date.now()}`;
      const newRecord: PdfDocument = {
        id,
        title: formData.title || 'Document PDF',
        title_en: formData.title_en || '',
        title_ha: formData.title_ha || '',
        description: formData.description || '',
        description_en: formData.description_en || '',
        description_ha: formData.description_ha || '',
        author: formData.author || "Cheikh de l'Ordre",
        category: formData.category as any || 'asrar',
        language: formData.language as any || 'mixed',
        pdfUrl: formData.pdfUrl || '',
        coverUrl: formData.coverUrl || '',
        fileSize: formData.fileSize || '3.5 Mo',
        pagesCount: Number(formData.pagesCount) || 1,
        isPremium: !!formData.isPremium,
        isMaintenance: !!formData.isMaintenance,
        maintenanceMessage: formData.maintenanceMessage || '',
        downloadCount: editingPdf?.downloadCount || 0,
        viewCount: editingPdf?.viewCount || 0,
        publishedAt: editingPdf?.publishedAt || new Date().toISOString(),
        tags: formData.tags || ['PDF'],
        featured: !!formData.featured,
      };

      const docRef = doc(db, 'pdf_documents', id);
      await setDoc(docRef, newRecord, { merge: true });

      setPdfs((prev) => {
        const exists = prev.some((p) => p.id === id);
        if (exists) {
          return prev.map((p) => (p.id === id ? newRecord : p));
        }
        return [newRecord, ...prev];
      });

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving PDF:', err);
      alert('Erreur lors de la sauvegarde : ' + (err?.message || 'Erreur inconnue'));
    } finally {
      setSaving(false);
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  // Filtered List
  const filteredList = pdfs.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (statusFilter === 'premium' && !p.isPremium) return false;
    if (statusFilter === 'maintenance' && !p.isMaintenance) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-500/20">
            PDF
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>Gestion des Livres & Manuscrits PDF</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                {pdfs.length} publiés
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Publiez des PDFs, activez le mode maintenance, assignez le statut Premium et configurez le téléchargement hors-ligne.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus size={16} />
          <span>Publier un nouveau PDF</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, auteur, contenu..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="all">Toutes Catégories</option>
            <option value="asrar">Asrar & Théurgie</option>
            <option value="invocations">Invocations & Dua</option>
            <option value="manuscrits">Manuscrits Anciens</option>
            <option value="sciences_lettres">Sciences des Lettres</option>
            <option value="spiritualite">Spiritualité</option>
            <option value="tafsir">Tafsir</option>
            <option value="divers">Divers</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="all">Tous les Statuts</option>
            <option value="premium">⭐ Premium VIP</option>
            <option value="maintenance">🛠️ En Maintenance</option>
          </select>
        </div>
      </div>

      {/* Table / Cards List of PDFs */}
      {loading ? (
        <div className="py-12 text-center">
          <RefreshCw size={24} className="animate-spin text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Chargement des documents...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-200 dark:border-gray-700">
          <FileText size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Aucun PDF correspondant</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((pdf) => (
            <div
              key={pdf.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border p-4 shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                pdf.isMaintenance 
                  ? 'border-rose-300 dark:border-rose-800/60 bg-rose-50/20 dark:bg-rose-950/10' 
                  : pdf.isPremium
                  ? 'border-amber-300 dark:border-amber-800/60'
                  : 'border-gray-200/80 dark:border-gray-700/80'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-600/20 border border-red-200 dark:border-red-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black text-red-600 dark:text-red-400">PDF</span>
                  <FileText size={18} className="text-red-500 mt-0.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                      {pdf.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase">
                      {pdf.language}
                    </span>
                    {pdf.isPremium && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <Sparkles size={9} />
                        <span>PREMIUM VIP</span>
                      </span>
                    )}
                    {pdf.isMaintenance && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                        <AlertTriangle size={9} />
                        <span>MAINTENANCE</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {pdf.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {pdf.author || 'Tradition'} • {pdf.pagesCount || 1} pages • {pdf.fileSize || 'PDF'} • Publié le {new Date(pdf.publishedAt).toLocaleDateString('fr-FR')}
                  </p>
                  {pdf.isMaintenance && pdf.maintenanceMessage && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 italic mt-1">
                      Note maintenance : {pdf.maintenanceMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Center Toggles */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {/* Premium Toggle Button */}
                <button
                  onClick={() => handleTogglePremium(pdf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    pdf.isPremium
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                  }`}
                  title="Basculer le statut Premium"
                >
                  <Sparkles size={12} />
                  <span>{pdf.isPremium ? '👑 Premium ON' : 'Gratuit'}</span>
                </button>

                {/* Maintenance Toggle Button */}
                <button
                  onClick={() => handleToggleMaintenance(pdf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    pdf.isMaintenance
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                  }`}
                  title="Mettre en maintenance ou réactiver"
                >
                  <AlertTriangle size={12} />
                  <span>{pdf.isMaintenance ? '🛠️ En Maintenance' : '🟢 Actif'}</span>
                </button>
              </div>

              {/* Right Action Tools */}
              <div className="flex items-center gap-1.5 self-end lg:self-auto shrink-0">
                <button
                  onClick={() => setPreviewPdf(pdf)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                  title="Aperçu / Tester lecteur"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => handleOpenEdit(pdf)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Modifier le document"
                >
                  <Edit size={15} />
                </button>
                <button
                  onClick={() => handleDelete(pdf)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit PDF Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      {editingPdf ? 'Modifier le Document PDF' : 'Publier un Nouveau Document PDF'}
                    </h3>
                    <p className="text-xs text-gray-400">Remplissez les détails et le fichier source pour la diffusion</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Title FR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Titre Principal (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Shams al-Ma'arif al-Kubra (Tome 1)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Multilingual Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Titre en Anglais (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.title_en || ''}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="Title in English"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Titre en Haoussa (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.title_ha || ''}
                      onChange={(e) => setFormData({ ...formData, title_ha: e.target.value })}
                      placeholder="Sunan littafi da Hausa"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                </div>

                {/* Author & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Auteur / Source
                    </label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Ex: Cheikh Ahmad al-Buni"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={formData.category || 'asrar'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    >
                      <option value="asrar">Asrar & Théurgie</option>
                      <option value="invocations">Invocations & Dua</option>
                      <option value="manuscrits">Manuscrits Anciens</option>
                      <option value="sciences_lettres">Sciences des Lettres</option>
                      <option value="spiritualite">Spiritualité & Tasawwuf</option>
                      <option value="tafsir">Tafsir & Coran</option>
                      <option value="divers">Divers</option>
                    </select>
                  </div>
                </div>

                {/* PDF File Source / URL */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                    Fichier PDF (URL directe ou Téléversement) *
                  </label>
                  
                  <input
                    type="url"
                    value={formData.pdfUrl || ''}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://... / fichier.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                  />

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">ou importer un fichier local :</span>
                    <label className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-xs font-bold cursor-pointer flex items-center gap-1.5">
                      <Upload size={13} />
                      <span>Parcourir PDF</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Cover URL, Pages Count, File Size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Image Couverture (URL)
                    </label>
                    <input
                      type="url"
                      value={formData.coverUrl || ''}
                      onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Nombre de Pages
                    </label>
                    <input
                      type="number"
                      value={formData.pagesCount || 1}
                      onChange={(e) => setFormData({ ...formData, pagesCount: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Taille du fichier
                    </label>
                    <input
                      type="text"
                      value={formData.fileSize || '5.0 Mo'}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                      placeholder="Ex: 8.5 Mo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Description / Sommaire
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brève description de l'ouvrage ou résumé théurgique..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                  />
                </div>

                {/* Toggles (Premium & Maintenance) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">Accès Premium Uniquement</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">Verrouille le document pour les membres VIP</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isPremium}
                      onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">Mode Maintenance</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">Affiche une bannière temporaire de révision</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData.isMaintenance}
                      onChange={(e) => setFormData({ ...formData, isMaintenance: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {formData.isMaintenance && (
                  <div>
                    <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                      Message de Maintenance pour les utilisateurs
                    </label>
                    <input
                      type="text"
                      value={formData.maintenanceMessage || ''}
                      onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                      placeholder="Ex: Ce document est en cours de révision calligraphique."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    <span>{editingPdf ? 'Mettre à jour' : 'Publier le PDF'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Viewer Modal */}
      <PdfViewerModal
        pdf={previewPdf}
        isOpen={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
      />
    </div>
  );
};
