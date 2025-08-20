import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/notifications/Toast';
import { proAccountService } from '../services/proAccountService';
import { categoryService } from '@services/categoryService';
import type { Category } from '@/types/category';
import type { Postulation } from '@/services/proAccountService';
import { Spinner } from '../components/common/Spinner';
import { HiOutlineTrash } from 'react-icons/hi';

const DemandeEspacePro: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // État lié aux catégories
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | ''>('');
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [postulations, setPostulations] = useState<Postulation[]>([]);
  const [loadingPostulations, setLoadingPostulations] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Rediriger vers la connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    navigate('/connexion');
    return null;
  }

  // Chargement des catégories principales au montage
  useEffect(() => {
    (async () => {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    })();

    fetchPostulations();
  }, []);

  const fetchPostulations = async () => {
    try {
      setLoadingPostulations(true);
      const { postulations } = await proAccountService.getMyPostulations();
      setPostulations(postulations);
    } catch (error) {
      console.error('Erreur récupération postulations', error);
    } finally {
      setLoadingPostulations(false);
    }
  };

  const handleCancel = async (id: number) => {
    const confirmCancel = window.confirm('Voulez-vous annuler cette demande ?');
    if (!confirmCancel) return;

    try {
      setCancellingId(id);
      await proAccountService.cancelPostulation(id);
      // Rafraîchir la liste après annulation
      await fetchPostulations();
      setToast({ message: 'Demande annulée avec succès.', type: 'success' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Erreur lors de l’annulation.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? Number(e.target.value) : '';
    setSelectedCategoryId(id);
    setSelectedSubCategoryId('');

    if (id === '') {
      setSubCategories([]);
      setCategoryName('');
      return;
    }

    const selectedCat = categories.find((c) => c.id === id);
    setCategoryName(selectedCat?.name || '');

    // Charger les sous-catégories
    const children = await categoryService.getCategoryChildren(id);
    setSubCategories(children);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? Number(e.target.value) : '';
    setSelectedSubCategoryId(id);

    if (id === '') {
      const cat = categories.find((c) => c.id === selectedCategoryId);
      setCategoryName(cat?.name || '');
      return;
    }

    const sub = subCategories.find((s) => s.id === id);
    setCategoryName(sub?.name || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      await proAccountService.createPostulation({
        userId: Number(user.id),
        categoryName,
      });
      setToast({ message: 'Votre demande a été envoyée avec succès.', type: 'success' });
      setCategoryName('');
      setSelectedCategoryId('');
      setSelectedSubCategoryId('');
      setSubCategories([]);

      // Recharger la liste des postulations
      fetchPostulations();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Une erreur est survenue.';
      setToast({ message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="text-3xl font-bold text-center text-[#007FFF] mb-8">Demande d'accès professionnel</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie professionnelle souhaitée
            </label>
            <select
              id="mainCategory"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007FFF]"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <select
                id="subCategory"
                value={selectedSubCategoryId}
                onChange={handleSubCategoryChange}
                className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007FFF]"
              >
                <option value="">Sélectionnez une sous-catégorie (facultatif)</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#007FFF] text-white py-2 px-4 rounded-lg hover:bg-[#0066cc] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi…' : 'Envoyer ma demande'}
          </button>
        </form>
        {/* Liste des postulations */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes demandes</h2>
          {loadingPostulations ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : postulations.length === 0 ? (
            <p className="text-gray-500">Aucune demande pour le moment.</p>
          ) : (
            <ul className="space-y-4">
              {postulations.map((p) => {
                const isPending = p.status === 'PENDING';
                const badgeColor = p.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : p.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600';
                return (
                  <li key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{p.categoryName}</p>
                        <p className="text-sm text-gray-500">Déposée le {new Date(p.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {p.status && (
                          <span className={`px-3 py-1 text-sm rounded-full capitalize ${badgeColor}`}>{p.status.toLowerCase()}</span>
                        )}
                        {isPending && (
                          <button
                            onClick={() => handleCancel(p.id)}
                            disabled={cancellingId === p.id}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {cancellingId === p.id ? (
                              <Spinner />
                            ) : (
                              <HiOutlineTrash className="w-5 h-5" />
                            )}
                            <span className="text-sm">Annuler</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DemandeEspacePro;
