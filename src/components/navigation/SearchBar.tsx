import React, { useRef, useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaArrowRight, FaHeart, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { AnimatePresence, motion } from 'framer-motion';

const SearchBar: React.FC = () => {
  const { 
    searchQuery, 
    searchResults, 
    isSearchOpen, 
    isSearching,
    setSearchQuery, 
    closeSearch, 
    clearSearch 
  } = useSearch();
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  // Mettre le focus sur l'input lorsque la recherche s'ouvre
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Fermer le panneau de recherche lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearch]);

  // Gérer la touche Escape pour fermer la recherche
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      // Rediriger vers la page du premier résultat
      navigate(`/nos-produits/${searchResults[0].id}`);
      closeSearch();
    }
  };

  // Ajouter un produit au panier
  const handleAddToCart = (productId: string) => {
    const product = searchResults.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
  };

  // Ajouter/supprimer un produit des favoris
  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const product = searchResults.find(p => p.id === productId);
    if (product) {
      if (isFavorite(productId)) {
        removeFromFavorites(productId);
      } else {
        addToFavorites(product, 'product');
      }
    }
  };

  // Afficher tous les résultats ou limiter à 6
  const displayResults = showAll ? searchResults : searchResults.slice(0, 6);
  const hasMoreResults = searchResults.length > 6;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 pt-20 flex justify-center"
        >
          <div 
            ref={searchRef}
            className="bg-white w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Barre de recherche */}
            <form onSubmit={handleSubmit} className="border-b">
              <div className="relative flex items-center p-4">
                <FaSearch className="text-gray-400 w-5 h-5 absolute left-6" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits par nom, catégorie, marque..."
                  className="w-full pl-12 pr-12 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-6 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded-full p-2 text-gray-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Résultats de recherche */}
            <div className="overflow-y-auto flex-1 p-4">
              {isSearching ? (
                <div className="flex justify-center items-center h-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                </div>
              ) : searchQuery.trim() !== '' ? (
                displayResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">Aucun résultat trouvé pour "{searchQuery}"</p>
                    <p className="text-gray-400 text-sm">Essayez d'autres mots-clés ou parcourez nos catégories</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">
                      {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayResults.map((product) => (
                        <div 
                          key={product.id}
                          className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Link
                            to={`/nos-produits/${product.id}`}
                            onClick={closeSearch}
                            className="flex items-start p-4 group"
                          >
                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {product.category} • {product.brand}
                              </p>
                              <p className="text-sm font-bold text-teal-600 mt-1">
                                {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                              </p>
                            </div>
                          </Link>
                          <div className="flex border-t border-gray-100">
                            <button
                              onClick={(e) => handleToggleFavorite(e, product.id)}
                              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm font-medium transition-colors ${
                                isFavorite(product.id) 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {isFavorite(product.id) ? (
                                <>
                                  <FaHeart className="mr-2 w-4 h-4" />
                                  <span>Favori</span>
                                </>
                              ) : (
                                <>
                                  <FaRegHeart className="mr-2 w-4 h-4" />
                                  <span>Ajouter</span>
                                </>
                              )}
                            </button>
                            <div className="w-px bg-gray-100"></div>
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={!product.stock || isInCart(product.id)}
                              className={`flex-1 py-2 px-3 flex items-center justify-center text-sm font-medium transition-colors ${
                                !product.stock
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : isInCart(product.id)
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-teal-600 hover:bg-teal-50'
                              }`}
                            >
                              <FaShoppingCart className="mr-2 w-4 h-4" />
                              <span>
                                {!product.stock
                                  ? 'Indisponible'
                                  : isInCart(product.id)
                                  ? 'Dans le panier'
                                  : 'Ajouter'}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bouton "Voir plus" si nécessaire */}
                    {hasMoreResults && !showAll && (
                      <div className="text-center mt-6">
                        <button
                          type="button"
                          onClick={() => setShowAll(true)}
                          className="inline-flex items-center px-4 py-2 border border-teal-600 text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 transition-colors"
                        >
                          Voir tous les résultats ({searchResults.length})
                        </button>
                      </div>
                    )}
                  </>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Commencez à taper pour rechercher des produits</p>
                </div>
              )}
            </div>

            {/* Footer avec catégories populaires */}
            {!isSearching && searchResults.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                <Link
                  to="/nos-products"
                  onClick={closeSearch}
                  className="flex justify-between items-center px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  <span className="font-medium">Voir tous les produits</span>
                  <FaArrowRight />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar; 