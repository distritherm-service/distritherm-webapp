import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { FaHeart, FaTrash, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Layout from '../components/layout/Layout';
import { FavoriteItem } from '../types/favorites';
import FavoritesSearch from '../components/search/FavoritesSearch';
import Pagination from '../components/ui/pagination';
import axiosInstance from '../services/axiosConfig';

const Favoris: React.FC = () => {
  const { favorites, removeFromFavorites, isLoading, favoritesCount, paginationMeta, fetchFavoritesPage } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filterOption, setFilterOption] = useState('all');

  // Appliquer la recherche, le tri et les filtres
  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    // Filtre par texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Filtre par type de produit
    if (filterOption === 'promotion') {
      result = result.filter(item => item.isInPromotion);
    } else if (filterOption === 'normal') {
      result = result.filter(item => !item.isInPromotion);
    }

    // Tri
    switch(sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => {
          const priceA = a.isInPromotion && a.promotionPrice ? a.promotionPrice : a.priceTtc;
          const priceB = b.isInPromotion && b.promotionPrice ? b.promotionPrice : b.priceTtc;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const priceA = a.isInPromotion && a.promotionPrice ? a.promotionPrice : a.priceTtc;
          const priceB = b.isInPromotion && b.promotionPrice ? b.promotionPrice : b.priceTtc;
          return priceB - priceA;
        });
        break;
      case 'date-added':
        // Tri par date d'ajout (le plus récent d'abord)
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [favorites, searchQuery, sortOption, filterOption]);

  // Animations améliorées
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const handleAddToCart = (item: FavoriteItem) => {
    addToCart({
      id: item.id.toString(),
      name: item.name,
      price: item.priceTtc,
      image: item.image || (item.imagesUrl && item.imagesUrl.length > 0 ? item.imagesUrl[0] : ''),
      quantity: 1
    });
  };

  const handleRemoveFromFavorites = async (id: string | number) => {
    const itemId = id.toString();
    setIsRemoving(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeFromFavorites(id);
    } finally {
      setIsRemoving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortBy: string) => {
    setSortOption(sortBy);
  };

  const handleFilter = (filterBy: string) => {
    setFilterOption(filterBy);
  };

  const handleRemoveAllFavorites = async () => {
    // Demande de confirmation
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer tous vos favoris ? Cette action est irréversible.")) {
      return;
    }
    
    setIsDeletingAll(true);
    
    try {
      // Appel API pour supprimer tous les favoris
      await axiosInstance.delete('/favorites/all');
      
      // Mise à jour de l'interface utilisateur
      // Nous forçons la mise à jour de la page pour afficher l'état vide
      await fetchFavoritesPage(1, paginationMeta.limit);
      
      // Afficher une confirmation
      alert("Tous vos produits favoris ont été supprimés avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de tous les favoris:", error);
      alert("Une erreur s'est produite lors de la suppression de vos favoris");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    console.log("Changement de page:", page);
    fetchFavoritesPage(page, paginationMeta.limit);
  }, [fetchFavoritesPage, paginationMeta.limit]);

  // Log des métadonnées de pagination pour le débogage
  console.log("Métadonnées de pagination:", paginationMeta);

  return (
    <Layout>
      <motion.div 
        className="min-h-screen bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Utilisation du composant FavoritesSearch qui contient déjà le titre */}
          <FavoritesSearch 
            favorites={filteredFavorites}
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            favoritesCount={favoritesCount}
          />

          {/* Bouton pour supprimer tous les favoris */}
          {favorites.length > 0 && (
            <div className="flex justify-end -mt-2 mb-4">
              <button
                onClick={handleRemoveAllFavorites}
                disabled={isDeletingAll}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Supprimer tous les favoris"
              >
                {isDeletingAll ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Suppression en cours...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Supprimer tous les favoris</span>
                  </>
                )}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={fadeIn}
                className="flex justify-center items-center py-16"
              >
                <FaSpinner className="w-10 h-10 text-teal-600 animate-spin" />
                <span className="ml-3 text-gray-600">Chargement de vos favoris...</span>
              </motion.div>
            ) : favorites.length === 0 ? (
              <motion.div 
                key="empty"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={fadeIn}
                className="text-center py-16"
              >
                <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                  Vous n'avez pas encore de favoris
                </h2>
                <p className="text-gray-500 mb-6">
                  Explorez nos produits et promotions pour en ajouter !
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/nos-produits"
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    Voir les produits
                  </Link>
                  <Link
                    to="/promotions"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Voir les promotions
                  </Link>
                </div>
              </motion.div>
            ) : filteredFavorites.length === 0 ? (
              <motion.div 
                key="no-results"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={fadeIn}
                className="text-center py-16"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                  Aucun résultat trouvé
                </h2>
                <p className="text-gray-500 mb-6">
                  Essayez d'autres mots-clés ou modifiez vos filtres
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSortOption('default');
                    setFilterOption('all');
                  }}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key="results"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  layout
                >
                  {filteredFavorites.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      variants={item}
                      layout
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="relative">
                        <img
                          src={favorite.image || (favorite.imagesUrl && favorite.imagesUrl.length > 0 ? favorite.imagesUrl[0] : '/image-produit-defaut.jpeg')}
                          alt={favorite.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/image-produit-defaut.jpeg';
                          }}
                        />
                        <button
                          onClick={() => handleRemoveFromFavorites(favorite.id)}
                          disabled={isRemoving[favorite.id.toString()]}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-all duration-200 group"
                          aria-label="Retirer des favoris"
                        >
                          {isRemoving[favorite.id.toString()] ? (
                            <FaSpinner className="w-5 h-5 text-red-500 animate-spin" />
                          ) : (
                            <FaTrash className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                          )}
                        </button>
                        {favorite.isInPromotion && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            PROMO
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 text-xs rounded-full bg-teal-100 text-teal-800 font-medium">
                            {favorite.isInPromotion ? 'Promotion' : 'Produit'}
                          </span>
                          <span className="font-medium text-gray-900 text-lg">
                            {favorite.isInPromotion && favorite.promotionPrice ? (
                              <div className="flex flex-col items-end">
                                <span className="text-sm line-through text-gray-500">{favorite.priceTtc.toFixed(2)} €</span>
                                <span className="text-red-600 font-semibold">{favorite.promotionPrice.toFixed(2)} €</span>
                              </div>
                            ) : (
                              `${favorite.priceTtc.toFixed(2)} €`
                            )}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-lg">
                          {favorite.name}
                        </h3>
                        {favorite.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {favorite.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Link
                            to={`/produit/${favorite.id}`}
                            className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium"
                          >
                            Voir les détails
                          </Link>
                          <button
                            onClick={() => handleAddToCart(favorite)}
                            disabled={isInCart(favorite.id.toString())}
                            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium ${
                              isInCart(favorite.id.toString())
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow'
                            }`}
                          >
                            <FaShoppingCart className="w-4 h-4" />
                            {isInCart(favorite.id.toString()) ? 'Dans le panier' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Information sur la pagination et résultats */}
                {paginationMeta.lastPage > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-8 mb-4 text-sm text-gray-600 bg-gray-50 py-3 px-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">Page</span>
                      <span className="font-medium mx-1 text-teal-700">{paginationMeta.page}</span>
                      <span className="mx-1">sur</span>
                      <span className="font-medium mx-1 text-teal-700">{paginationMeta.lastPage}</span>
                      <span className="mx-2">•</span>
                      <span>Affichage</span>
                      <span className="font-medium mx-1 text-teal-700">
                        {paginationMeta.total > 0 ? (paginationMeta.page - 1) * paginationMeta.limit + 1 : 0}-
                        {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)}
                      </span>
                      <span className="mx-1">sur</span>
                      <span className="font-medium mx-1 text-teal-700">{paginationMeta.total}</span>
                      <span className="mx-1">produits</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-teal-700">{paginationMeta.limit}</span>
                      <span className="ml-1">par page</span>
                    </div>
                  </motion.div>
                )}

                {/* Composant de pagination */}
                {paginationMeta.lastPage > 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 mb-8"
                  >
                    <Pagination 
                      currentPage={paginationMeta.page} 
                      totalPages={paginationMeta.lastPage} 
                      onPageChange={handlePageChange}
                      className="shadow-sm"
                      siblingCount={1}
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Favoris; 