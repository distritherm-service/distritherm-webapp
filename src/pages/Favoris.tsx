import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { 
  FaSpinner, 
  FaHeart, 
  FaShoppingBag, 
  FaSearch, 
  FaFilter, 
  FaTrash, 
  FaTh, 
  FaList, 
  FaTimes,
  FaSort
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../components/ui/pagination';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Footer from '../components/layout/Footer';
import BrandsSection from '../components/home/BrandsSection';
import ProductCard from '../components/products/ProductCard';
import PromotionCard from '../components/promotions/PromotionCard';
import { categoryService } from '../services/categoryService';
import { getAllMarks } from '../services/markService';
import { Product } from '../types/product';
import { Promotion } from '../services/promotionService';

const Favoris: React.FC = () => {
  const { favorites, isLoading, favoritesCount, paginationMeta, fetchFavoritesPage, removeFromFavorites } = useFavorites();
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filterOption, setFilterOption] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [markFilter, setMarkFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [marks, setMarks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Charger catégories et marques pour les filtres
  React.useEffect(() => {
    (async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats.map(cat => cat.name));
      } catch {
        setCategories([]);
      }
      try {
        const mks = await getAllMarks();
        setMarks(mks);
      } catch {
        setMarks([]);
      }
    })();
  }, []);

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

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category?.name === categoryFilter);
    }

    // Filtre par marque
    if (markFilter !== 'all') {
      result = result.filter(item => item.mark?.name === markFilter);
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
        result.sort((a, b) => {
          const dateA = a.favoriteCreatedAt ? new Date(a.favoriteCreatedAt).getTime() : 0;
          const dateB = b.favoriteCreatedAt ? new Date(b.favoriteCreatedAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [favorites, searchQuery, sortOption, filterOption, categoryFilter, markFilter]);

  const handleRemoveAllFavorites = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer tous vos favoris ?")) return;
    
    setIsDeletingAll(true);
    try {
      const promises = favorites.map(favorite => removeFromFavorites(favorite.id));
      await Promise.all(promises);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    fetchFavoritesPage(page, paginationMeta.limit);
  }, [fetchFavoritesPage, paginationMeta.limit]);

  const calculateDiscount = (originalPrice: number, promotionPrice: number) => {
    return Math.round(((originalPrice - promotionPrice) / originalPrice) * 100);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSortOption('default');
    setFilterOption('all');
    setCategoryFilter('all');
    setMarkFilter('all');
  };

  const hasActiveFilters = searchQuery || sortOption !== 'default' || filterOption !== 'all' || categoryFilter !== 'all' || markFilter !== 'all';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec image d'arrière-plan */}
      <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-lg">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0">
          <img
            src="/icone/image-panier.png"
            alt="Mes Favoris Distritherm Services"
            className="w-full h-full object-cover object-center"
          />
          {/* Voile sombre en dégradé pour une meilleure lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent backdrop-blur-sm" />
        </div>

        {/* Contenu : Titre + Breadcrumb */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl mb-4 tracking-tight"
          >
            Mes Favoris
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>

        {/* Ombre courbée en bas */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
          <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
            <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Main Content - Proper spacing from hero */}
      <div className="relative bg-gray-50 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mt-8"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                {/* Stats */}
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-md">
                    <FaHeart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Ma sélection</h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      {favoritesCount || favorites.length || 0} produit{(favoritesCount || favorites.length || 0) !== 1 ? 's' : ''} sauvegardé{(favoritesCount || favorites.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 md:space-x-3">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === 'grid' 
                          ? 'bg-white text-red-500 shadow-sm transform scale-105' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Vue grille"
                    >
                      <FaTh className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'bg-white text-red-500 shadow-sm transform scale-105' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      title="Vue liste"
                    >
                      <FaList className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      showFilters 
                        ? 'bg-red-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Filtres"
                  >
                    <FaFilter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>

                  {/* Delete All */}
                  {favorites.length > 0 && (
                    <button
                      onClick={handleRemoveAllFavorites}
                      disabled={isDeletingAll}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:shadow-md disabled:opacity-50"
                      title="Supprimer tous les favoris"
                    >
                      {isDeletingAll ? (
                        <FaSpinner className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                      ) : (
                        <FaTrash className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                      <span className="font-medium text-sm hidden sm:inline">Tout supprimer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans vos favoris..."
                  className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white shadow-sm transition-all duration-300 text-sm md:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters Section */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                      {/* Sort */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 flex items-center">
                          <FaSort className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                          Trier par
                        </label>
                        <select
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="w-full px-3 py-2 md:py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-300 text-sm"
                        >
                          <option value="default">Ordre par défaut</option>
                          <option value="name-asc">Nom A-Z</option>
                          <option value="name-desc">Nom Z-A</option>
                          <option value="price-asc">Prix croissant</option>
                          <option value="price-desc">Prix décroissant</option>
                          <option value="date-added">Plus récent</option>
                        </select>
                      </div>

                      {/* Filter Type */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Type</label>
                        <select
                          value={filterOption}
                          onChange={(e) => setFilterOption(e.target.value)}
                          className="w-full px-3 py-2 md:py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-300 text-sm"
                        >
                          <option value="all">Tous les produits</option>
                          <option value="promotion">En promotion</option>
                          <option value="normal">Prix normal</option>
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Catégorie</label>
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full px-3 py-2 md:py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-300 text-sm"
                        >
                          <option value="all">Toutes les catégories</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Brand Filter */}
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Marque</label>
                        <select
                          value={markFilter}
                          onChange={(e) => setMarkFilter(e.target.value)}
                          className="w-full px-3 py-2 md:py-3 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-300 text-sm"
                        >
                          <option value="all">Toutes les marques</option>
                          {marks.map(mark => (
                            <option key={mark} value={mark}>{mark}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={resetFilters}
                          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 text-sm"
                        >
                          <FaTimes className="w-3 h-3" />
                          <span>Réinitialiser les filtres</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 md:py-20"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg font-medium mt-4 md:mt-6">Chargement de vos favoris...</p>
                  </motion.div>
                ) : favorites.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16 md:py-20"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative mx-auto mb-6 md:mb-8"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-50 to-pink-50 rounded-full flex items-center justify-center shadow-lg border border-red-100">
                        <motion.div
                          animate={{ 
                            rotate: [0, -10, 10, -5, 5, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut"
                          }}
                        >
                          <FaHeart className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
                        </motion.div>
                      </div>
                    </motion.div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                      Votre liste de favoris est vide
                    </h2>
                    <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                      Explorez notre catalogue et découvrez des produits 
                      <span className="font-medium text-red-600"> exceptionnels</span> qui vous attendent
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                      <Link 
                        to="/nos-produits" 
                        className="group relative inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl md:rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg text-sm md:text-base"
                      >
                        <FaShoppingBag className="mr-2 md:mr-3 transition-transform group-hover:-translate-x-1" />
                        <span>Découvrir nos produits</span>
                      </Link>

                      <Link 
                        to="/promotions" 
                        className="group relative inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl md:rounded-2xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg text-sm md:text-base"
                      >
                        <span className="mr-2 md:mr-3">🔥</span>
                        <span>Voir les promotions</span>
                      </Link>
                    </div>
                  </motion.div>
                ) : filteredFavorites.length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16 md:py-20"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <FaSearch className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                      Aucun résultat trouvé
                    </h2>
                    <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                      Essayez d'autres mots-clés ou modifiez vos filtres.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gray-600 text-white rounded-xl md:rounded-2xl hover:bg-gray-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      Réinitialiser les filtres
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                      <p className="text-gray-600 text-sm md:text-base">
                        {filteredFavorites.length} produit{filteredFavorites.length !== 1 ? 's' : ''} trouvé{filteredFavorites.length !== 1 ? 's' : ''}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 self-start sm:self-auto"
                        >
                          <FaTimes className="w-3 h-3" />
                          <span>Effacer les filtres</span>
                        </button>
                      )}
                    </div>

                    {/* Products Grid */}
                    <motion.div
                      key="results"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className={
                        viewMode === 'grid'
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                          : "space-y-3 md:space-y-4"
                      }
                    >
                      {filteredFavorites.map((favorite, idx) => {
                        if (favorite.isInPromotion && favorite.promotionPrice) {
                          const promotion: Promotion = {
                            id: favorite.id.toString(),
                            title: favorite.name,
                            description: favorite.description || '',
                            image: favorite.imagesUrl?.[0] || '/image-produit-defaut.jpeg',
                            category: favorite.category?.name || '',
                            subcategory: '',
                            originalPrice: favorite.priceTtc,
                            discountPrice: favorite.promotionPrice,
                            discountPercentage: favorite.promotionPercentage || calculateDiscount(favorite.priceTtc, favorite.promotionPrice),
                            validUntil: favorite.promotionEndDate || '',
                            code: '',
                            inStock: favorite.quantity ? favorite.quantity > 0 : true,
                            quantity: favorite.quantity || 0,
                          };
                          return (
                            <motion.div key={favorite.id} variants={itemVariants}>
                              <PromotionCard promotion={promotion} />
                            </motion.div>
                          );
                        }

                        const product: Product = {
                          id: favorite.id,
                          name: favorite.name,
                          description: favorite.description || '',
                          priceHt: favorite.priceHt || favorite.priceTtc,
                          priceTtc: favorite.priceTtc,
                          quantity: favorite.quantity || 0,
                          imagesUrl: favorite.imagesUrl && favorite.imagesUrl.length > 0 ? favorite.imagesUrl : ['/image-produit-defaut.jpeg'],
                          categoryId: favorite.categoryId || 0,
                          markId: favorite.markId || 0,
                          category: favorite.category,
                          mark: favorite.mark,
                          isInPromotion: favorite.isInPromotion,
                          promotionPrice: favorite.promotionPrice,
                          promotionEndDate: favorite.promotionEndDate,
                          promotionPercentage: favorite.promotionPercentage,
                          createdAt: favorite.createdAt || '',
                          updatedAt: favorite.updatedAt || '',
                        } as Product;

                        return (
                          <motion.div key={favorite.id} variants={itemVariants}>
                            <ProductCard product={product} index={idx} />
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Pagination */}
                    {paginationMeta.lastPage > 1 && (
                      <div className="mt-8 md:mt-12 flex justify-center">
                        <Pagination 
                          currentPage={paginationMeta.page} 
                          totalPages={paginationMeta.lastPage} 
                          onPageChange={handlePageChange}
                          className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-2"
                          siblingCount={1}
                        />
                      </div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Brands Section */}
      <BrandsSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Favoris; 