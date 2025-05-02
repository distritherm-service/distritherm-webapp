import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaTrash, FaImage, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import { FavoriteItem } from '../../types/favorites';

interface FavoritesPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesPreview: React.FC<FavoritesPreviewProps> = ({ isOpen, onClose }) => {
  const { favorites, removeFromFavorites, isLoading } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleViewFavorites = () => {
    navigate('/favoris');
    onClose();
  };

  const handleAddToCart = (item: FavoriteItem) => {
    // Créer un objet compatible avec CartItem
    const cartItem = {
      id: item.id.toString(),
      name: item.name,
      price: item.priceTtc,
      image: item.image || (item.imagesUrl && item.imagesUrl.length > 0 ? item.imagesUrl[0] : ''),
      quantity: 1
    };

    addToCart(cartItem);
  };

  const renderProductImage = (item: FavoriteItem) => {
    const imageUrl = item.image || (item.imagesUrl && item.imagesUrl.length > 0 ? item.imagesUrl[0] : '');
    
    if (!imageUrl) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <img 
            src="/image-produit-defaut.jpeg" 
            alt="Image par défaut" 
            className="h-full w-full object-cover object-center"
          />
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={item.name || 'Produit'}
        className="h-full w-full object-cover object-center"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/image-produit-defaut.jpeg';
        }}
      />
    );
  };

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} €`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50"
          onMouseLeave={onClose}
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mes Favoris</h3>
              <span className="text-sm text-gray-500">
                {favorites.length} {favorites.length > 1 ? 'articles' : 'article'}
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <FaSpinner className="mx-auto h-8 w-8 text-teal-600 animate-spin mb-2" />
                <p className="text-gray-500">Chargement de vos favoris...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="p-4 text-center">
                <FaHeart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">Votre liste de favoris est vide</p>
              </div>
            ) : (
              <div className="py-2">
                {favorites.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {renderProductImage(item)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name || 'Produit sans nom'}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.isInPromotion && item.promotionPrice ? (
                              <span className="flex flex-col">
                                <span className="line-through text-xs text-gray-400">{formatPrice(item.priceTtc)}</span>
                                <span className="text-red-600">{formatPrice(item.promotionPrice)}</span>
                              </span>
                            ) : (
                              formatPrice(item.priceTtc)
                            )}
                          </p>
                          {item.category && (
                            <p className="text-xs text-gray-400 line-clamp-1">
                              {item.category.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="p-1 text-teal-600 hover:text-teal-800 transition-colors"
                            title="Ajouter au panier"
                          >
                            <FaShoppingCart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromFavorites(item.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Retirer des favoris"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {favorites.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleViewFavorites}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaHeart className="h-5 w-5" />
                <span>Voir tous mes favoris</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesPreview; 