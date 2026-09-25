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
  Layers,
  Coins,
  Tag,
  DollarSign,
  ShoppingBag,
  Image as ImageIcon,
  Globe,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle2,
  HelpCircle
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
import { compressImageFileToDataUrl, getPdfCoverUrl } from '../../utils/pdfCoverHelper';
import { PdfBookCover3D } from '../pdf/PdfBookCover3D';
import { savePdfDownloadLink, deletePdfDownloadLink } from '../../utils/pdfSecurity';
import { useFeatures } from '../../contexts/FeatureContext';
import { detectPdfMetadata, formatPdfFileSize } from '../../utils/pdfMetadataHelper';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { set as setIdb } from 'idb-keyval';

export interface ActionNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const AdminPdfDocumentsManager: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'premium' | 'maintenance' | 'for_sale'>('all');
  const [isSyncingRules, setIsSyncingRules] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  // Global & In-Modal Notifications
  const [notification, setNotification] = useState<ActionNotification | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [saveProgressMessage, setSaveProgressMessage] = useState<string | null>(null);

  // Play Store & Paystack Compliance Settings
  const { featureToggles } = useFeatures();
  const [showPlayStoreSettings, setShowPlayStoreSettings] = useState(false);
  const [isSavingFeature, setIsSavingFeature] = useState(false);
  const [isSimulatingPlayStore, setIsSimulatingPlayStore] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('asrarhub_simulate_playstore') === 'true'
  );

  const handleUpdateFeature = async (key: string, value: any) => {
    try {
      setIsSavingFeature(true);
      await setDoc(doc(db, 'settings', 'features'), { [key]: value }, { merge: true });
      try {
        const stored = localStorage.getItem('asrar_font_toggles');
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[key] = value;
        localStorage.setItem('asrar_font_toggles', JSON.stringify(parsed));
        window.dispatchEvent(new Event('asrar_font_updated'));
      } catch (_) {}
    } catch (err) {
      console.error('Failed to update feature setting:', err);
    } finally {
      setIsSavingFeature(false);
    }
  };

  const handleTogglePlayStoreSimulation = () => {
    const nextVal = !isSimulatingPlayStore;
    if (nextVal) {
      sessionStorage.setItem('asrarhub_simulate_playstore', 'true');
    } else {
      sessionStorage.removeItem('asrarhub_simulate_playstore');
    }
    setIsSimulatingPlayStore(nextVal);
    window.dispatchEvent(new Event('storage'));
  };

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
    fileSize: '',
    pagesCount: '' as any,
    isPremium: false,
    isMaintenance: false,
    maintenanceMessage: '',
    isForSale: false,
    price: '' as any,
    originalPrice: '' as any,
    currency: 'FCFA',
    freeForVip: true,
    vipDiscountPercent: '' as any,
    tags: [],
    featured: false,
  });

  const [coverLangTab, setCoverLangTab] = useState<'fr' | 'en' | 'ha'>('fr');
  const [isCompressingCover, setIsCompressingCover] = useState(false);
  const [isDetectingMetadata, setIsDetectingMetadata] = useState(false);
  const [metadataDetectedInfo, setMetadataDetectedInfo] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Handle Local Thumbnail Upload (Direct File Import without link)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, lang: 'fr' | 'en' | 'ha') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingCover(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 800, 1200, 0.85);
      if (lang === 'fr') {
        setFormData((prev) => ({ ...prev, coverUrl: dataUrl }));
      } else if (lang === 'en') {
        setFormData((prev) => ({ ...prev, coverUrl_en: dataUrl }));
      } else if (lang === 'ha') {
        setFormData((prev) => ({ ...prev, coverUrl_ha: dataUrl }));
      }
    } catch (err: any) {
      alert(err?.message || "Erreur lors de l'importation de l'image de couverture.");
    } finally {
      setIsCompressingCover(false);
      e.target.value = '';
    }
  };

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
      await deletePdfDownloadLink(pdf.id);
      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
      setNotification({
        type: 'info',
        message: `Le document "${pdf.title}" a été supprimé du catalogue.`,
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.error('Error deleting pdf:', err);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la suppression : ' + (err?.message || 'Erreur inconnue'),
      });
      setPdfs((prev) => prev.filter((p) => p.id !== pdf.id));
    }
  };

  // Sync and Secure all existing PDF download links into Firestore Rules protected collection
  const handleSyncDownloadSecurityRules = async () => {
    if (isSyncingRules) return;
    setIsSyncingRules(true);
    setSyncStatusMessage('Synchronisation des règles de sécurité Firestore...');
    try {
      let securedCount = 0;
      for (const pdf of pdfs) {
        if (pdf.pdfUrl) {
          await savePdfDownloadLink(pdf.id, pdf.pdfUrl, {
            title: pdf.title,
            isPremium: pdf.isPremium,
            isForSale: pdf.isForSale,
            freeForVip: pdf.freeForVip,
            price: pdf.price,
          });
          securedCount++;
        }
      }
      setSyncStatusMessage(`Succès : ${securedCount} document(s) synchronisés avec les Firestore Security Rules.`);
      setTimeout(() => setSyncStatusMessage(null), 5000);
    } catch (err: any) {
      console.error('Error syncing security rules:', err);
      setSyncStatusMessage('Erreur lors de la synchronisation : ' + (err?.message || 'Erreur'));
      setTimeout(() => setSyncStatusMessage(null), 6000);
    } finally {
      setIsSyncingRules(false);
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
      author: 'Jibril SBI',
      category: 'asrar',
      language: 'mixed',
      pdfUrl: '',
      coverUrl: '',
      coverUrl_en: '',
      coverUrl_ha: '',
      coverFit: 'contain',
      coverScale: 100,
      coverAspectRatio: 'book',
      fileSize: '',
      pagesCount: '' as any,
      isPremium: false,
      isMaintenance: false,
      maintenanceMessage: 'Document en cours de révision calligraphique par les administrateurs.',
      isForSale: false,
      price: '' as any,
      originalPrice: '' as any,
      currency: 'FCFA',
      freeForVip: true,
      vipDiscountPercent: '' as any,
      tags: ['Asrar', 'PDF'],
      featured: false,
    });
    setCoverLangTab('fr');
    setTagInput('');
    setMetadataDetectedInfo(null);
    setIsDetectingMetadata(false);
    setSelectedPdfFile(null);
    setModalError(null);
    setSaveProgressMessage(null);
    setIsModalOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (pdf: PdfDocument) => {
    setEditingPdf(pdf);
    setFormData({
      ...pdf,
      coverUrl: pdf.coverUrl || '',
      coverUrl_en: pdf.coverUrl_en || '',
      coverUrl_ha: pdf.coverUrl_ha || '',
      coverFit: pdf.coverFit || 'contain',
      coverScale: pdf.coverScale ?? 100,
      coverAspectRatio: pdf.coverAspectRatio || 'book',
      fileSize: pdf.fileSize || '',
      pagesCount: pdf.pagesCount !== undefined && pdf.pagesCount !== null ? pdf.pagesCount : ('' as any),
      isForSale: !!pdf.isForSale,
      price: pdf.price !== undefined && pdf.price !== null ? pdf.price : ('' as any),
      originalPrice: pdf.originalPrice !== undefined && pdf.originalPrice !== null ? pdf.originalPrice : ('' as any),
      currency: pdf.currency || 'FCFA',
      freeForVip: pdf.freeForVip ?? true,
      vipDiscountPercent: pdf.vipDiscountPercent !== undefined && pdf.vipDiscountPercent !== null ? pdf.vipDiscountPercent : ('' as any),
    });
    setCoverLangTab('fr');
    setTagInput('');
    setMetadataDetectedInfo(null);
    setIsDetectingMetadata(false);
    setSelectedPdfFile(null);
    setModalError(null);
    setSaveProgressMessage(null);
    setIsModalOpen(true);
  };

  // Quick Toggle Sale Status
  const handleToggleForSale = async (pdf: PdfDocument) => {
    const newState = !pdf.isForSale;
    const defaultPrice = pdf.price && pdf.price > 0 ? pdf.price : 2500;
    try {
      const docRef = doc(db, 'pdf_documents', pdf.id);
      await setDoc(docRef, { ...pdf, isForSale: newState, price: defaultPrice }, { merge: true });
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isForSale: newState, price: defaultPrice } : p));
      setNotification({
        type: 'info',
        message: newState
          ? `Le document "${pdf.title}" est maintenant mis en vente (${defaultPrice} ${pdf.currency || 'FCFA'}).`
          : `Le document "${pdf.title}" a été retiré de la vente.`,
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error('Error toggling sale:', err);
      setPdfs((prev) => prev.map((p) => p.id === pdf.id ? { ...p, isForSale: newState, price: defaultPrice } : p));
    }
  };

  // Handle Local File Upload (Convert to Data URI & Auto-Detect Pages and File Size)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPdfFile(file);
    setIsDetectingMetadata(true);
    setMetadataDetectedInfo(null);
    setModalError(null);

    // Immediate estimated file size
    const initialSizeFormatted = formatPdfFileSize(file.size);
    setFormData((prev) => ({
      ...prev,
      fileSize: initialSizeFormatted,
      title: prev.title ? prev.title : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    }));

    // Create a local blob URL for instant preview and validation without blocking the browser
    const localUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      pdfUrl: localUrl,
    }));

    // Auto-detect page count & exact file size
    try {
      const meta = await detectPdfMetadata(file);
      setFormData((prev) => ({
        ...prev,
        fileSize: meta.formattedFileSize || initialSizeFormatted,
        ...(meta.pagesCount ? { pagesCount: meta.pagesCount } : {}),
      }));

      const detectedParts = [];
      if (meta.pagesCount) detectedParts.push(`${meta.pagesCount} pages`);
      if (meta.formattedFileSize || initialSizeFormatted) detectedParts.push(meta.formattedFileSize || initialSizeFormatted);
      if (detectedParts.length > 0) {
        setMetadataDetectedInfo(detectedParts.join(' • '));
      }
    } catch (err) {
      console.warn('Erreur détection métadonnées PDF:', err);
    } finally {
      setIsDetectingMetadata(false);
      e.target.value = '';
    }
  };

  // Auto-detect metadata from current pdfUrl (e.g. pasted URL or link)
  const handleDetectMetadataFromUrl = async () => {
    if (!formData.pdfUrl) {
      setModalError("Veuillez d'abord saisir ou importer une URL de fichier PDF.");
      return;
    }
    setIsDetectingMetadata(true);
    setMetadataDetectedInfo(null);
    setModalError(null);
    try {
      const meta = await detectPdfMetadata(formData.pdfUrl);
      setFormData((prev) => ({
        ...prev,
        ...(meta.formattedFileSize ? { fileSize: meta.formattedFileSize } : {}),
        ...(meta.pagesCount ? { pagesCount: meta.pagesCount } : {}),
      }));
      const detectedParts = [];
      if (meta.pagesCount) detectedParts.push(`${meta.pagesCount} pages`);
      if (meta.formattedFileSize) detectedParts.push(meta.formattedFileSize);
      if (detectedParts.length > 0) {
        setMetadataDetectedInfo(detectedParts.join(' • '));
      } else {
        setModalError("Impossible d'extraire automatiquement les informations pour ce lien (CORS ou format non lisible). Vous pouvez renseigner les champs manuellement.");
      }
    } catch (err) {
      console.warn('Erreur détection métadonnées URL:', err);
      setModalError('Erreur lors de la détection automatique du document.');
    } finally {
      setIsDetectingMetadata(false);
    }
  };

  // Save PDF (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const titleClean = (formData.title || '').trim();
    if (!titleClean) {
      setModalError('Veuillez renseigner le Titre Principal (Français) du document.');
      return;
    }

    const hasFile = !!selectedPdfFile;
    const hasUrl = !!(formData.pdfUrl && formData.pdfUrl.trim());

    if (!hasFile && !hasUrl) {
      setModalError('Veuillez fournir un fichier PDF via le bouton "Parcourir PDF" ou saisir une URL directe.');
      return;
    }

    if (formData.isForSale) {
      const priceNum = Number(formData.price);
      if (formData.price === undefined || formData.price === '' || isNaN(priceNum) || priceNum < 0) {
        setModalError('Veuillez définir un montant de vente valide (ou 0 si gratuit) pour ce document mis en vente.');
        return;
      }
    }

    setSaving(true);
    setSaveProgressMessage('Préparation du document PDF...');

    try {
      const id = editingPdf ? editingPdf.id : `pdf_${Date.now()}`;
      let resolvedPdfUrl = (formData.pdfUrl || '').trim();

      // If a local file was selected, upload or store robustly
      if (selectedPdfFile) {
        setSaveProgressMessage('Téléversement sécurisé du fichier PDF...');
        const safeFileName = selectedPdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `pdf_documents/${id}_${safeFileName}`;

        let cloudUrl = '';
        // 1. Attempt upload to Firebase Storage
        try {
          const fileRef = ref(storage, storagePath);
          await uploadBytes(fileRef, selectedPdfFile);
          cloudUrl = await getDownloadURL(fileRef);
        } catch (storageErr) {
          console.warn('[Firebase Storage] Upload failed or unconfigured, proceeding with local vault:', storageErr);
        }

        if (cloudUrl) {
          resolvedPdfUrl = cloudUrl;
        } else {
          // 2. Storage fallback: Save to local IndexedDB vault to bypass Firestore's 1MB limit
          setSaveProgressMessage('Sauvegarde sécurisée dans le stockage local...');
          try {
            await setIdb(`asrar_pdf_blob_${id}`, selectedPdfFile);
            // If file size is under 600 KB, base64 data URL is also safe in Firestore
            if (selectedPdfFile.size < 600000) {
              const base64Data = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve((ev.target?.result as string) || '');
                reader.onerror = () => resolve('');
                reader.readAsDataURL(selectedPdfFile);
              });
              if (base64Data) {
                resolvedPdfUrl = base64Data;
              } else {
                resolvedPdfUrl = `idb:asrar_pdf_blob_${id}`;
              }
            } else {
              resolvedPdfUrl = `idb:asrar_pdf_blob_${id}`;
            }
          } catch (idbErr) {
            console.warn('IDB storage error:', idbErr);
          }
        }
      }

      setSaveProgressMessage('Enregistrement dans le catalogue...');

      const newRecord: PdfDocument = {
        id,
        title: titleClean,
        title_en: (formData.title_en || '').trim(),
        title_ha: (formData.title_ha || '').trim(),
        description: (formData.description || '').trim(),
        description_en: (formData.description_en || '').trim(),
        description_ha: (formData.description_ha || '').trim(),
        author: (formData.author || '').trim() || "Cheikh de l'Ordre",
        category: (formData.category as any) || 'asrar',
        language: (formData.language as any) || 'mixed',
        pdfUrl: resolvedPdfUrl,
        coverUrl: formData.coverUrl || '',
        coverUrl_en: formData.coverUrl_en || '',
        coverUrl_ha: formData.coverUrl_ha || '',
        coverFit: (formData.coverFit || 'contain') as 'cover' | 'contain' | 'fill',
        coverScale: Number(formData.coverScale) || 100,
        coverAspectRatio: (formData.coverAspectRatio || 'book') as 'book' | 'portrait' | 'square' | 'auto',
        fileSize: formData.fileSize || '3.5 Mo',
        pagesCount: formData.pagesCount !== undefined && formData.pagesCount !== '' ? Number(formData.pagesCount) : 1,
        isPremium: !!formData.isPremium,
        isMaintenance: !!formData.isMaintenance,
        maintenanceMessage: formData.maintenanceMessage || '',
        isForSale: !!formData.isForSale,
        price: formData.price !== undefined && formData.price !== '' ? Number(formData.price) : 0,
        originalPrice: formData.originalPrice !== undefined && formData.originalPrice !== '' ? Number(formData.originalPrice) : undefined,
        currency: formData.currency || 'FCFA',
        freeForVip: formData.freeForVip ?? true,
        vipDiscountPercent: formData.vipDiscountPercent !== undefined && formData.vipDiscountPercent !== '' ? Number(formData.vipDiscountPercent) : 0,
        salesCount: editingPdf?.salesCount || 0,
        downloadCount: editingPdf?.downloadCount || 0,
        viewCount: editingPdf?.viewCount || 0,
        publishedAt: editingPdf?.publishedAt || new Date().toISOString(),
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : ['PDF'],
        featured: !!formData.featured,
      };

      // Firestore save
      const docRef = doc(db, 'pdf_documents', id);
      await setDoc(docRef, newRecord, { merge: true });

      // Save secured download link in protected collection enforced by Firestore Security Rules
      if (resolvedPdfUrl) {
        await savePdfDownloadLink(id, resolvedPdfUrl, {
          title: newRecord.title,
          isPremium: newRecord.isPremium,
          isForSale: newRecord.isForSale,
          freeForVip: newRecord.freeForVip,
          price: newRecord.price,
        });
      }

      setPdfs((prev) => {
        const exists = prev.some((p) => p.id === id);
        if (exists) {
          return prev.map((p) => (p.id === id ? newRecord : p));
        }
        return [newRecord, ...prev];
      });

      setIsModalOpen(false);
      setSelectedPdfFile(null);
      setModalError(null);

      // Show prominent success notification
      setNotification({
        type: 'success',
        message: editingPdf
          ? `Le document "${newRecord.title}" a été mis à jour avec succès !`
          : `Le livre PDF "${newRecord.title}" a été publié avec succès dans la bibliothèque !`,
      });
      setTimeout(() => setNotification(null), 6000);
    } catch (err: any) {
      console.error('Error saving PDF:', err);
      const errMsg = err?.message || 'Erreur inconnue lors de la sauvegarde';
      setModalError(`Échec de la publication : ${errMsg}`);
      setNotification({
        type: 'error',
        message: `Erreur lors de la publication : ${errMsg}`,
      });
    } finally {
      setSaving(false);
      setSaveProgressMessage(null);
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
    if (statusFilter === 'for_sale' && !p.isForSale) return false;
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

  const totalForSale = pdfs.filter((p) => p.isForSale).length;
  const totalSalesCount = pdfs.reduce((acc, p) => acc + (p.salesCount || 0), 0);
  const totalPremium = pdfs.filter((p) => p.isPremium).length;

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
              Vente unitaire des livres, tarification par PDF, mode maintenance et téléchargement hors-ligne sécurisé.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowPlayStoreSettings(!showPlayStoreSettings)}
            className={`px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              showPlayStoreSettings
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
            }`}
            title="Configurer la conformité Google Play Store & Paystack pour les PDF"
          >
            <Shield size={15} />
            <span>Play Store & Paystack</span>
            <span className={`w-2 h-2 rounded-full ${
              featureToggles.play_store_mode === 'android_only' || featureToggles.play_store_mode === true
                ? 'bg-emerald-500'
                : 'bg-amber-400'
            }`} />
          </button>

          <button
            onClick={handleSyncDownloadSecurityRules}
            disabled={isSyncingRules}
            title="Appliquer la protection Firestore Security Rules sur tous les fichiers PDF"
            className="px-3.5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200/80 dark:border-indigo-800/80 disabled:opacity-50"
          >
            <ShieldCheck size={16} className={isSyncingRules ? 'animate-spin' : ''} />
            <span>{isSyncingRules ? 'Sécurisation...' : 'Sécuriser Liens Firestore'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer justify-center"
          >
            <Plus size={16} />
            <span>Publier un nouveau PDF</span>
          </button>
        </div>
      </div>

      {/* Collapsible Play Store & Paystack Compliance Panel */}
      <AnimatePresence>
        {showPlayStoreSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/40 dark:from-gray-800/90 dark:via-gray-800 dark:to-emerald-950/20 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
              {/* Header Info & Google Play Rejection FAQ */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                      <Shield size={16} />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">
                      Réglages Vente Paystack & Conformité Google Play Store
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      featureToggles.play_store_mode === 'android_only' || featureToggles.play_store_mode === true
                        ? 'bg-emerald-600 text-white'
                        : featureToggles.play_store_mode === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {featureToggles.play_store_mode === 'android_only' || featureToggles.play_store_mode === true
                        ? 'Protégé : Mode Anti-Rejet Android Actif'
                        : featureToggles.play_store_mode === 'all'
                        ? 'Paystack Masqué Partout'
                        : 'Attention : Paystack Actif Partout'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-xs space-y-2 text-gray-800 dark:text-gray-200">
                    <p className="font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Règle Google Play sur la vente de PDF :</span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                      <strong>Google Play refuse systématiquement</strong> toute application Android qui propose des paiements tiers directs (comme Paystack, Wave ou Mobile Money) pour acheter des <strong>biens numériques consommés dans l'application</strong> (livres PDF, secrets spirituels, abonnements).
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300 font-medium">
                      💡 <strong>La solution AsrarHub :</strong> En choisissant le mode <strong>« Android Uniquement (Recommandé) »</strong>, l'application masque automatiquement le bouton Paystack sur l'application Android Play Store (garantissant 100% d'approbation par Google), tout en le laissant <strong>100% fonctionnel sur votre site Web / PWA</strong> où vous encaissez sans aucune commission de Google.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPlayStoreSettings(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer self-start"
                  title="Fermer ce panneau"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 3 Play Store Modes */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                  Mode Anti-Rejet Google Play Store :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateFeature('play_store_mode', 'android_only')}
                    disabled={isSavingFeature}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col gap-1 border cursor-pointer ${
                      featureToggles.play_store_mode === 'android_only' || featureToggles.play_store_mode === true
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-black text-xs">
                      <Smartphone size={14} /> Android Uniquement (Recommandé)
                    </span>
                    <span className={`text-[10px] leading-snug ${
                      featureToggles.play_store_mode === 'android_only' || featureToggles.play_store_mode === true
                        ? 'text-emerald-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Masque Paystack uniquement dans l'application Google Play (APK). Reste 100% ouvert sur le Web / PC / PWA.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateFeature('play_store_mode', false)}
                    disabled={isSavingFeature}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col gap-1 border cursor-pointer ${
                      featureToggles.play_store_mode === false || !featureToggles.play_store_mode
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-black text-xs">
                      <CreditCard size={14} /> Actif Partout (Attention Play Store)
                    </span>
                    <span className={`text-[10px] leading-snug ${
                      featureToggles.play_store_mode === false || !featureToggles.play_store_mode
                        ? 'text-amber-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Affiche Paystack partout (Web et Android). À utiliser uniquement si l'application n'est pas encore sur le Play Store.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateFeature('play_store_mode', 'all')}
                    disabled={isSavingFeature}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col gap-1 border cursor-pointer ${
                      featureToggles.play_store_mode === 'all'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-black text-xs">
                      <Globe size={14} /> Masquer Partout
                    </span>
                    <span className={`text-[10px] leading-snug ${
                      featureToggles.play_store_mode === 'all'
                        ? 'text-purple-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Coupe totalement la vente Paystack (Web et Android). Seuls les points spirituels permettent d'acquérir les PDF.
                    </span>
                  </button>
                </div>
              </div>

              {/* Toggles for PDF Paystack & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 dark:border-gray-700">
                {/* PDF Paystack Toggle */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Vente Paystack pour les Livres PDF
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {featureToggles.pdf_paystack_enabled !== false && featureToggles.paystack_enabled !== false
                        ? 'Activé : Les livres monétisés peuvent être payés par Mobile Money / Carte.'
                        : 'Désactivé : La vente directe par carte / Mobile Money est coupée pour les PDF.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateFeature('pdf_paystack_enabled', featureToggles.pdf_paystack_enabled === false)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      featureToggles.pdf_paystack_enabled !== false ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      featureToggles.pdf_paystack_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* PDF Spiritual Points Toggle */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Achat par Points Spirituels (100% Conforme Play Store)
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {featureToggles.pdf_points_enabled !== false
                        ? 'Autorisé : Les fidèles peuvent échanger leurs points gagnés pour obtenir le PDF.'
                        : 'Interdit : Seuls les achats en argent réel sont possibles.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateFeature('pdf_points_enabled', featureToggles.pdf_points_enabled === false)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                      featureToggles.pdf_points_enabled !== false ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      featureToggles.pdf_points_enabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* In-Session Play Store Auditor Simulator */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                    <Smartphone size={14} className="text-indigo-600" />
                    <span>Simulateur de vue Google Play Store (Test en direct)</span>
                  </span>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                    Activez ce simulateur pour tester immédiatement l'application comme si vous étiez le vérificateur de Google Play afin de voir le comportement de la modale d'achat.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePlayStoreSimulation}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isSimulatingPlayStore
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs animate-pulse'
                      : 'bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {isSimulatingPlayStore ? 'Désactiver Simulation Play Store' : 'Simuler Vue Play Store'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
              : notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100'
              : 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {notification.type === 'success' && <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />}
            {notification.type === 'info' && <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/10 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}

      {syncStatusMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {/* Commercial & Catalog Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-1">
            <span className="text-xs font-medium">Total Livres</span>
            <BookOpen size={16} className="text-blue-500" />
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white">{pdfs.length}</div>
          <span className="text-[10px] text-gray-400">Catalogue complet</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-xs font-medium">En Vente</span>
            <Tag size={16} />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{totalForSale}</div>
          <span className="text-[10px] text-gray-400">Livres monétisés</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80">
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <span className="text-xs font-medium">Ventes Réalisées</span>
            <ShoppingBag size={16} />
          </div>
          <div className="text-xl font-black text-amber-500">{totalSalesCount}</div>
          <span className="text-[10px] text-gray-400">Exemplaires achetés</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80">
          <div className="flex items-center justify-between text-purple-500 mb-1">
            <span className="text-xs font-medium">Membres VIP</span>
            <Sparkles size={16} />
          </div>
          <div className="text-xl font-black text-purple-500">{totalPremium}</div>
          <span className="text-[10px] text-gray-400">Livres exclusifs VIP</span>
        </div>
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
            <option value="for_sale">💰 En Vente (Payants)</option>
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
          {filteredList.map((pdf, pIdx) => (
            <div
              key={pdf.id ? `pdf-doc-${pdf.id}-${pIdx}` : `pdf-doc-${pIdx}`}
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
                <div 
                  onClick={() => setPreviewPdf(pdf)}
                  className="shrink-0 cursor-pointer transform hover:scale-105 transition-transform flex items-center justify-center pt-0.5"
                  title="Aperçu du livre"
                >
                  <PdfBookCover3D size="xs" pdf={pdf} language="fr" showShadow={false} />
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
                    {pdf.isForSale ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <Tag size={9} />
                        <span>{pdf.price || 0} {pdf.currency || 'FCFA'}</span>
                        {pdf.salesCount ? <span className="opacity-80">({pdf.salesCount} ventes)</span> : null}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        Accès Gratuit
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
                {/* For Sale Toggle Button */}
                <button
                  onClick={() => handleToggleForSale(pdf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    pdf.isForSale
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-200'
                  }`}
                  title="Activer ou désactiver la vente unitaire"
                >
                  <Tag size={12} />
                  <span>{pdf.isForSale ? `💰 Vente : ${pdf.price || 0} ${pdf.currency || 'FCFA'}` : 'Vente OFF'}</span>
                </button>

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
                  <span>{pdf.isPremium ? '👑 Premium ON' : 'VIP OFF'}</span>
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
                  <span>{pdf.isMaintenance ? '🛠️ Maintenance' : '🟢 Actif'}</span>
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
              <form onSubmit={handleSave} noValidate className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Modal Error Alert Banner */}
                {modalError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold">Attention</div>
                      <div className="font-normal text-[11px] mt-0.5">{modalError}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalError(null)}
                      className="text-rose-500 hover:text-rose-800 dark:hover:text-rose-200 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Title FR */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Titre Principal (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (modalError) setModalError(null);
                    }}
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
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                      Fichier PDF (URL directe ou Téléversement) *
                    </label>
                    {isDetectingMetadata && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                        <RefreshCw size={11} className="animate-spin" /> Analyse automatique du PDF...
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.pdfUrl || ''}
                      onChange={(e) => {
                        setSelectedPdfFile(null);
                        setFormData({ ...formData, pdfUrl: e.target.value });
                        if (modalError) setModalError(null);
                      }}
                      onBlur={() => {
                        if (formData.pdfUrl && (!formData.pagesCount || !formData.fileSize)) {
                          handleDetectMetadataFromUrl();
                        }
                      }}
                      placeholder="https://... / fichier.pdf ou lien cloud"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                    {formData.pdfUrl && (
                      <button
                        type="button"
                        onClick={handleDetectMetadataFromUrl}
                        disabled={isDetectingMetadata}
                        className="px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                        title="Analyser le PDF pour détecter automatiquement le nombre de pages et la taille"
                      >
                        <Sparkles size={13} className="text-emerald-500" />
                        <span>Détecter</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] text-gray-400">ou importer un fichier local :</span>
                    <label className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                      <Upload size={13} />
                      <span>Parcourir PDF</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {isDetectingMetadata && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                        <RefreshCw size={11} className="animate-spin" /> Détection en cours...
                      </span>
                    )}
                  </div>

                  {/* Selected File Indicator */}
                  {selectedPdfFile && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-2 truncate">
                        <FileText size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate font-bold">{selectedPdfFile.name}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-medium">({formatPdfFileSize(selectedPdfFile.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPdfFile(null);
                          setFormData((prev) => ({ ...prev, pdfUrl: '' }));
                        }}
                        className="text-gray-400 hover:text-rose-600 ml-2 cursor-pointer p-0.5"
                        title="Retirer ce fichier"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Section Couvertures & Thumbnails 2D Adaptatifs (Sans 3D, Taille Réductible par l'Admin) */}
                <div className="bg-gray-50/70 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-emerald-500" />
                        <span>Couverture & Thumbnail du Livre</span>
                      </label>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Chaque langue peut avoir son propre thumbnail. Vous pouvez importer directement une image et ajuster sa taille pour un rendu optimal.
                      </p>
                    </div>

                    {/* Language Selector Tabs */}
                    <div className="flex items-center gap-1 bg-gray-200/80 dark:bg-gray-800 p-0.5 rounded-xl border border-gray-300 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setCoverLangTab('fr')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          coverLangTab === 'fr'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                        }`}
                      >
                        🇫🇷 Français
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverLangTab('en')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          coverLangTab === 'en'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverLangTab('ha')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          coverLangTab === 'ha'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                        }`}
                      >
                        🇳🇬 Hausa
                      </button>
                    </div>
                  </div>

                  {/* Active Language Cover Controls & Live 2D Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start pt-1">
                    {/* Controls & Sizing Sliders (7 cols) */}
                    <div className="sm:col-span-7 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Direct File Picker (No link needed!) */}
                        <label className={`px-3 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                          isCompressingCover
                            ? 'bg-emerald-700 opacity-70 pointer-events-none'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}>
                          <Upload size={14} />
                          <span>{isCompressingCover ? 'Traitement image...' : `Importer l'image (${coverLangTab.toUpperCase()})`}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isCompressingCover}
                            onChange={(e) => handleCoverUpload(e, coverLangTab)}
                            className="hidden"
                          />
                        </label>

                        {/* Clear button if cover exists */}
                        {((coverLangTab === 'fr' && formData.coverUrl) ||
                          (coverLangTab === 'en' && formData.coverUrl_en) ||
                          (coverLangTab === 'ha' && formData.coverUrl_ha)) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (coverLangTab === 'fr') setFormData((p) => ({ ...p, coverUrl: '' }));
                              else if (coverLangTab === 'en') setFormData((p) => ({ ...p, coverUrl_en: '' }));
                              else if (coverLangTab === 'ha') setFormData((p) => ({ ...p, coverUrl_ha: '' }));
                            }}
                            className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:text-rose-500 text-xs font-semibold cursor-pointer"
                          >
                            Effacer
                          </button>
                        )}
                      </div>

                      {/* Optional URL input */}
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">
                          Ou coller une URL d'image web (optionnel) :
                        </span>
                        <input
                          type="url"
                          value={
                            coverLangTab === 'fr' 
                              ? (formData.coverUrl || '') 
                              : coverLangTab === 'en' 
                              ? (formData.coverUrl_en || '') 
                              : (formData.coverUrl_ha || '')
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (coverLangTab === 'fr') setFormData((p) => ({ ...p, coverUrl: val }));
                            else if (coverLangTab === 'en') setFormData((p) => ({ ...p, coverUrl_en: val }));
                            else if (coverLangTab === 'ha') setFormData((p) => ({ ...p, coverUrl_ha: val }));
                          }}
                          placeholder="https://... (ou importez directement ci-dessus)"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                        />
                      </div>

                      {/* Thumbnail Size & Adaptation Controls (Admin Slider) */}
                      <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                            <Sliders size={13} className="text-emerald-500" />
                            <span>Réduire / Adapter la Taille du Thumbnail</span>
                          </label>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px]">
                            {formData.coverScale ?? 100}%
                          </span>
                        </div>

                        {/* Slider */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, coverScale: Math.max(40, (p.coverScale ?? 100) - 5) }))}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
                            title="Réduire de 5%"
                          >
                            <ZoomOut size={13} />
                          </button>
                          
                          <input
                            type="range"
                            min="40"
                            max="100"
                            step="5"
                            value={formData.coverScale ?? 100}
                            onChange={(e) => setFormData({ ...formData, coverScale: parseInt(e.target.value, 10) })}
                            className="w-full accent-emerald-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                          />

                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, coverScale: Math.min(100, (p.coverScale ?? 100) + 5) }))}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
                            title="Agrandir de 5%"
                          >
                            <ZoomIn size={13} />
                          </button>
                        </div>

                        {/* Quick Presets for Thumbnails */}
                        <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5">
                          <span className="text-[10px] text-gray-400">Préréglages :</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverScale: 60 }))}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer border ${
                                (formData.coverScale ?? 100) === 60
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              60% (Compact)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverScale: 75 }))}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer border ${
                                (formData.coverScale ?? 100) === 75
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              75% (Réduit)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverScale: 85 }))}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer border ${
                                (formData.coverScale ?? 100) === 85
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              85% (Adapté)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverScale: 100 }))}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer border ${
                                (formData.coverScale ?? 100) === 100
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              100% (Plein)
                            </button>
                          </div>
                        </div>

                        {/* Fit Mode Selection (Contain vs Cover) */}
                        <div className="pt-1 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                            Cadrage de l'image :
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverFit: 'contain' }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                                (formData.coverFit || 'contain') === 'contain'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                              }`}
                              title="Affiche toute la couverture sans rien couper"
                            >
                              Ajuster entier (Contain)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, coverFit: 'cover' }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                                formData.coverFit === 'cover'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                              }`}
                              title="Remplit tout le cadre"
                            >
                              Remplir (Cover)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live 2D Thumbnail Preview (5 cols) */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-center shadow-xs">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                          Aperçu Thumbnail ({coverLangTab.toUpperCase()})
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, coverScale: Math.max(40, (p.coverScale ?? 100) - 5) }))}
                            className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                            title="Réduire"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, coverScale: Math.min(100, (p.coverScale ?? 100) + 5) }))}
                            className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                            title="Agrandir"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Clean 2D Flat Book Cover */}
                      <div className="py-2 flex items-center justify-center min-h-[140px]">
                        <PdfBookCover3D
                          size="md"
                          pdf={{
                            ...formData,
                            coverUrl: coverLangTab === 'fr' ? formData.coverUrl : coverLangTab === 'en' ? formData.coverUrl_en : formData.coverUrl_ha,
                            coverScale: formData.coverScale ?? 100,
                            coverFit: formData.coverFit || 'contain',
                          }}
                          language={coverLangTab}
                          customScale={formData.coverScale ?? 100}
                          customFit={formData.coverFit || 'contain'}
                          showShadow={true}
                        />
                      </div>

                      {/* Visual specs tag */}
                      <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                        Format 2D • Échelle : {formData.coverScale ?? 100}% • {formData.coverFit === 'cover' ? 'Rempli' : 'Ajusté entier'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pages Count and File Size in 2 columns (Auto-detected from PDF) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Nombre de Pages
                      </label>
                      {formData.pagesCount ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Auto-détecté
                        </span>
                      ) : isDetectingMetadata ? (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
                          <RefreshCw size={10} className="animate-spin" /> Détection...
                        </span>
                      ) : null}
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.pagesCount !== undefined && formData.pagesCount !== null ? formData.pagesCount : ''}
                      onChange={(e) => setFormData({ ...formData, pagesCount: e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10) })}
                      placeholder="Détecté auto ou ex: 45"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                        Taille du fichier
                      </label>
                      {formData.fileSize ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={11} /> Auto-détecté
                        </span>
                      ) : isDetectingMetadata ? (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 animate-pulse">
                          <RefreshCw size={10} className="animate-spin" /> Détection...
                        </span>
                      ) : null}
                    </div>
                    <input
                      type="text"
                      value={formData.fileSize !== undefined && formData.fileSize !== null ? formData.fileSize : ''}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                      placeholder="Détecté auto ou ex: 2.5 Mo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                </div>

                {metadataDetectedInfo && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Propriétés détectées automatiquement : <strong>{metadataDetectedInfo}</strong></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setMetadataDetectedInfo(null)}
                      className="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-200 text-xs font-bold px-1"
                    >
                      ×
                    </button>
                  </div>
                )}

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

                {/* Section Commerciale & Monétisation (Tarif par PDF) */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Coins size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                          Vendre ce livre PDF (Paiement à l'unité)
                        </h4>
                        <p className="text-[10px] text-emerald-700/80 dark:text-emerald-300/70">
                          Fixez un montant que chaque utilisateur devra régler pour débloquer la lecture et le téléchargement.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formData.isForSale}
                        onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {formData.isForSale && (
                    <div className="pt-3 border-t border-emerald-500/20 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Prix de vente */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Prix de vente *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? ('' as any) : parseFloat(e.target.value) })}
                              placeholder="Ex: 60 ou 2500"
                              className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold text-emerald-600 dark:text-emerald-400 outline-none"
                              required={!!formData.isForSale}
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                              {formData.currency || 'FCFA'}
                            </span>
                          </div>
                        </div>

                        {/* Prix d'origine (barré) */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Prix barré (Optionnel)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={formData.originalPrice !== undefined && formData.originalPrice !== null ? formData.originalPrice : ''}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                            placeholder="Ex: 90 ou 5000"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 outline-none"
                          />
                        </div>

                        {/* Devise */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Devise
                          </label>
                          <select
                            value={formData.currency || 'FCFA'}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                          >
                            <option value="FCFA">FCFA / XOF (Afrique de l'Ouest & Centrale)</option>
                            <option value="NGN">NGN ₦ (Naira)</option>
                            <option value="GHS">GHS GH₵ (Cedi)</option>
                            <option value="USD">USD $ (Dollar US)</option>
                            <option value="EUR">EUR € (Euro)</option>
                          </select>
                        </div>
                      </div>

                      {/* VIP Access Policy for this Book */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-emerald-500/20 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!formData.freeForVip}
                            onChange={(e) => setFormData({ ...formData, freeForVip: e.target.checked })}
                            className="w-4 h-4 accent-emerald-600 rounded"
                          />
                          <div>
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                              Inclus gratuitement pour VIP
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Les abonnés VIP accèdent sans repayer
                            </span>
                          </div>
                        </label>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                            Réduction VIP (%) si payant pour tous
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="any"
                            value={formData.vipDiscountPercent !== undefined && formData.vipDiscountPercent !== null ? formData.vipDiscountPercent : ''}
                            onChange={(e) => setFormData({ ...formData, vipDiscountPercent: e.target.value === '' ? ('' as any) : parseInt(e.target.value, 10) })}
                            placeholder="Ex: 50"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{saveProgressMessage || 'Publication en cours...'}</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>{editingPdf ? 'Mettre à jour' : 'Publier le PDF'}</span>
                      </>
                    )}
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
