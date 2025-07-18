import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCheck, FaInfoCircle, FaHeart, FaRegHeart, FaTag } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';
import FavoriteButton from '../favorites/FavoriteButton';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAdded, setShowAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  // Image à afficher (première image ou image par défaut en cas d'erreur)
  const imageUrl = imageError || !product.imagesUrl || product.imagesUrl.length === 0 
    ? '/image-produit-defaut.jpeg' 
    : product.imagesUrl[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Appeler directement addToCart avec le produit original
    addToCart(product, 1);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await toggleFavorite(product.id);
    } finally {
      setIsToggling(false);
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const formatProductPrice = (price: number | undefined): string => {
    if (price === undefined || isNaN(price)) {
      return "0,00";
    }
    return formatPrice(price, { showCurrency: false });
  };
 
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden border border-blue-100/50 hover:border-blue-300/70 transform hover:-translate-y-2">
      {/* Image container with modern aspect ratio */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Badges */}
        {product.isInPromotion && product.promotionPercentage && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <FaTag className="w-3 h-3" />
            -{product.promotionPercentage}%
          </div>
        )}
        
        {product.quantity > 0 && product.quantity <= 5 && (
          <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            Stock limité: {product.quantity}
          </div>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          {/* Favorite Button */}
          <FavoriteButton
            productId={product.id}
            variant="floating"
            size="md"
            className="z-10"
          />
          
          {/* View Details Button */}
          <Link
            to={`/produit/${product.id}`}
            className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-blue-600 hover:text-blue-700"
          >
            <FaInfoCircle className="w-4 h-4" />
          </Link>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          {product.quantity > 0 ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/90 text-white backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-400/90 text-white backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Sur commande
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Product Title */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing Section */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-blue-600">Prix HT</span>
            <span className="text-lg font-semibold text-blue-700">
              {formatProductPrice(product.priceHt)} €
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-blue-600">Prix TTC</span>
            <span className="text-1xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {formatProductPrice(product.priceTtc)} €
            </span>
          </div>
          
          {/* Affichage de l'unité de mesure */}
          {product.unity && (
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-gray-500">Unité</span>
              <span className="text-sm font-medium text-gray-700">
                {product.unity}
              </span>
            </div>
          )}
          
          {/* Affichage des informations pro si disponibles */}
          {product.proInfo && product.proInfo.isPro && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  Prix Pro {product.proInfo.categoryProName}
                </span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  -{product.proInfo.percentage}%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-blue-600">Prix Pro HT</span>
                <span className="text-lg font-bold text-blue-800">
                  {formatProductPrice(product.proInfo.proPriceHt)} €
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-blue-600">Prix Pro TTC</span>
                <span className="text-lg font-bold text-blue-800">
                  {formatProductPrice(product.proInfo.proPriceTtc)} €
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg ${
            showAdded
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
              : product.quantity > 0 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-200 hover:shadow-blue-300'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200'
          }`}
        >
          {showAdded ? (
            <>
              <FaCheck className="w-4 h-4" />
              <span>Ajouté au panier !</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="w-4 h-4" />
              <span>{product.quantity > 0 ? 'Ajouter au panier' : 'Commander'}</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default ProductCard; 