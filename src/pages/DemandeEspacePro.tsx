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
import Breadcrumb from '../components/navigation/Breadcrumb';

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

      {/* Section héro avec image, titre et breadcrumb */}
      <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0">
          <img
            src="/image-section-expert.png"
            alt="Image accès professionnel"
            className="w-full h-full object-cover object-center"
          />
          {/* Dégradé */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">
            Demande d'accès professionnel
          </h1>
          <Breadcrumb />
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
          <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
            <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff" />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Carte explicative */}
        <div className="mb-12 mx-auto max-w-5xl bg-white/70 backdrop-blur-lg shadow-xl ring-1 ring-gray-100 rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 text-center">Accès professionnel : remises & offers privées</h2>
          <p className="text-gray-600 leading-relaxed text-center">
            Sélectionnez la catégorie pour laquelle vous souhaitez profiter de tarifs professionnels. Dès validation par notre
            équipe, votre compte affichera automatiquement les prix remisés, les opérations privées et un support dédié.
            Vous pourrez suivre l’avancement de chaque demande directement ci-dessous.
          </p>
        </div>

        {/* Formulaire de demande */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-100 rounded-2xl p-8 md:p-10 space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie professionnelle souhaitée
            </label>
            <select
              id="mainCategory"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#007FFF] bg-white/90 backdrop-blur"
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
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#007FFF] to-[#005fcc] text-white font-semibold shadow hover:shadow-lg transition disabled:opacity-50"
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
