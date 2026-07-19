import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Edit2, Trash2, Plus, X, ShoppingBag, Grid, List } from 'lucide-react';

export const AdminStoreManager = ({
  featureToggles,
  handleToggleFeature
}: {
  featureToggles?: any;
  handleToggleFeature?: (featureId: string, value: any) => Promise<void>;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productsLayoutMode, setProductsLayoutMode] = useState<'grid' | 'list'>('grid');
  
  // Product Form State
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    description: { fr: '', en: '', ar: '' },
    category: 'Livres',
    price: '',
    pointsCost: '',
    image: '',
    affiliateLink: '',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    iconName: 'Book'
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'store_products'), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.warn("AdminStoreManager products onSnapshot error (operating offline):", error);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        pointsCost: formData.pointsCost ? parseInt(formData.pointsCost) : null,
        date: new Date().toISOString(),
        popularity: 0
      };

      if (editingId) {
        await updateDoc(doc(db, 'store_products', editingId), data);
      } else {
        await setDoc(doc(db, 'store_products', Date.now().toString()), data);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Erreur de sauvegarde');
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      await deleteDoc(doc(db, 'store_products', id));
    }
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || { fr: '', en: '', ar: '' },
      description: product.description || { fr: '', en: '', ar: '' },
      category: product.category,
      price: product.price,
      pointsCost: product.pointsCost ? product.pointsCost.toString() : '',
      image: product.image,
      affiliateLink: product.affiliateLink || '',
      color: product.color || 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      iconName: product.iconName || 'Book'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: { fr: '', en: '', ar: '' },
      description: { fr: '', en: '', ar: '' },
      category: 'Livres',
      price: '',
      pointsCost: '',
      image: '',
      affiliateLink: '',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      iconName: 'Book'
    });
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Controls */}
      {featureToggles && handleToggleFeature && (
        <div className="bg-amber-50/55 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Mode d'accès de la Boutique
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mettez la boutique en maintenance, réservez-la aux abonnés premium, ou laissez-la ouverte à tous.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={featureToggles['tool_store'] || 'active'}
              onChange={(e) => handleToggleFeature('tool_store', e.target.value)}
              className="text-xs font-bold px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer text-gray-900 dark:text-white"
            >
              <option value="active">🟢 Active (Ouverte à tous)</option>
              <option value="premium">⭐ Premium (Membres uniquement)</option>
              <option value="maintenance">🛠️ En maintenance (Bloquée)</option>
              <option value="inactive">🔴 Inactive (Désactivée)</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-emerald-500" /> Gestion Boutique</h2>
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button
              onClick={() => setProductsLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                productsLayoutMode === 'grid' 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Affichage Grille"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setProductsLayoutMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                productsLayoutMode === 'list' 
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Affichage Liste"
            >
              <List size={16} />
            </button>
          </div>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 cursor-pointer">
          <Plus size={18} /> Ajouter Produit
        </button>
      </div>

      <div className={`grid gap-4 ${
        productsLayoutMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      }`}>
        {products.map(p => (
          <div key={p.id} className={`border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex ${
            productsLayoutMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row gap-4 items-center'
          }`}>
            <img src={p.image} className={`object-cover rounded-lg ${
              productsLayoutMode === 'grid' ? 'w-full h-32 mb-4' : 'w-24 h-24 shrink-0'
            }`} />
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <h3 className="font-bold">{p.name?.fr || p.name}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{p.category}</span>
                </div>
                <p className="text-sm text-gray-500 flex-1">{p.price} • {p.pointsCost ? `${p.pointsCost} pts` : 'Pas de pts'}</p>
                {p.affiliateLink && <p className="text-xs text-blue-500 mt-1">🔗 Produit affilié</p>}
              </div>
              <div className={`flex gap-2 mt-4 ${productsLayoutMode === 'grid' ? 'w-full' : 'max-w-[200px]'}`}>
                <button onClick={() => openEdit(p)} className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-center hover:bg-gray-200 cursor-pointer"><Edit2 size={16} className="mx-auto" /></button>
                <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg text-center hover:bg-red-100 cursor-pointer"><Trash2 size={16} className="mx-auto" /></button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">Aucun produit configuré. Ajoutez-en un pour remplacer ceux par défaut.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500"><X size={24} /></button>
            <h3 className="text-xl font-bold mb-6">{editingId ? 'Modifier' : 'Ajouter'} un Produit</h3>
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-sm">Nom du produit (3 langues)</h4>
                <input required placeholder="Nom (Français)" value={typeof formData.name === 'string' ? formData.name : formData.name.fr} onChange={e => setFormData({...formData, name: { ...formData.name, fr: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <input placeholder="Nom (Anglais)" value={typeof formData.name === 'string' ? '' : formData.name.en} onChange={e => setFormData({...formData, name: { ...formData.name, en: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <input placeholder="Nom (Hausa)" value={typeof formData.name === 'string' ? '' : formData.name.ha} onChange={e => setFormData({...formData, name: { ...formData.name, ha: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-sm">Description (3 langues)</h4>
                <textarea required placeholder="Description (Français)" value={typeof formData.description === 'string' ? formData.description : formData.description.fr} onChange={e => setFormData({...formData, description: { ...formData.description, fr: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <textarea placeholder="Description (Anglais)" value={typeof formData.description === 'string' ? '' : formData.description.en} onChange={e => setFormData({...formData, description: { ...formData.description, en: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                <textarea placeholder="Description (Hausa)" value={typeof formData.description === 'string' ? '' : formData.description.ha} onChange={e => setFormData({...formData, description: { ...formData.description, ha: e.target.value }})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Prix (texte, ex: 15€, 20 USD)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Points requis (Optionnel)</label>
                  <input type="number" value={formData.pointsCost} onChange={e => setFormData({...formData, pointsCost: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  {['Bagues', 'Encens', 'Livres', 'Talismans', 'Numérique', 'Abonnements', 'Autre'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">URL de l'image</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
              </div>

              <div>
                <label className="block text-sm mb-1 text-blue-600 font-semibold">Lien d'affiliation externe (Optionnel)</label>
                <input type="url" placeholder="https://..." value={formData.affiliateLink} onChange={e => setFormData({...formData, affiliateLink: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 border-blue-200" />
                <p className="text-xs text-gray-500 mt-1">Si renseigné, l'achat redirigera vers ce lien.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Icône (Nom Lucide)</label>
                  <input value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} placeholder="Book, Shield, Zap..." className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 mt-4">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
