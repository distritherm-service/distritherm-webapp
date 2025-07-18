import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion } from '../../services/promotionService';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FaHeart, FaRegHeart, FaShoppingCart, FaCheck, FaInfoCircle, FaTag, FaClock } from 'react-icons/fa';
import { formatPrice } from '../../utils/format';
import FavoriteButton from '../favorites/FavoriteButton';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const [showAdded, setShowAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Vérifier que promotion est défini pour éviter des erreurs
  if (!promotion) {
    return <div className="bg-white rounded-2xl shadow-lg p-6">Chargement...</div>;
  }
  
  // Vérifier si le produit est dans le panier
  const productInCart = isInCart(promotion.id);
  
  // Image à afficher (première image ou image par défaut en cas d'erreur)
  const imageUrl = imageError || !promotion.image 
    ? '/image-produit-defaut.jpeg' 
    : promotion.image;
  
  // Calculer le nombre de jours restant avant la fin de la promotion
  const getDaysRemaining = (): number => {
    if (!promotion.validUntil) return 0;
    
    const today = new Date();
    const endDate = new Date(promotion.validUntil);
    const timeDiff = endDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  };
  
  const daysRemaining = getDaysRemaining();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!promotion.inStock) return;
    
    addToCart({
      id: promotion.id,
      name: promotion.title,
      price: promotion.discountPrice,
      image: promotion.image,
      quantity: 1
    });
    
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      // Convertir l'ID de la promotion en nombre si nécessaire
      const productId = typeof promotion.id === 'string' ? parseInt(promotion.id) : promotion.id;
      await toggleFavorite(productId);
    } finally {
      setIsToggling(false);
    }
  };

  // Prix sécurisés pour éviter les NaN
  const safeOriginalPrice = promotion.originalPrice || 0;
  const safeDiscountPrice = promotion.discountPrice || 0;
  const safeDiscountPercentage = promotion.discountPercentage || 0;
  const savings = safeOriginalPrice - safeDiscountPrice;
  
  // Convertir l'ID en nombre pour la vérification des favoris
  const promotionIdAsNumber = typeof promotion.id === 'string' ? parseInt(promotion.id) : promotion.id;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden border border-orange-100/50 hover:border-orange-300/70 transform hover:-translate-y-2">
      {/* Image container with modern aspect ratio */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
        {/* Badge de promotion en haut à gauche */}
        <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
          <FaTag className="w-3 h-3" />
          -{safeDiscountPercentage}%
        </div>
        
        {/* Badge stock limité si applicable */}
        {promotion.quantity && promotion.quantity <= 5 && (
          <div className="absolute top-16 left-4 z-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            Plus que {promotion.quantity} en stock
          </div>
        )}

        {/* Product Image */}
        <img
          src={imageUrl}
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          {/* Favorite Button */}
          <FavoriteButton
            productId={promotionIdAsNumber}
            variant="floating"
            size="md"
            className="z-10"
          />
          
          {/* View Details Button */}
          <Link
            to={`/produit/${promotion.id}?from=promotions`}
            className="bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-orange-600 hover:text-orange-700"
          >
            <FaInfoCircle className="w-4 h-4" />
          </Link>
        </div>

        {/* Status et temps restant */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          {/* Badge stock */}
          {promotion.inStock ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/90 text-white backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-400/90 text-white backdrop-blur-sm shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Sur commande
            </span>
          )}
          
          {/* Badge temps restant */}
          {daysRemaining > 0 && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/90 text-white backdrop-blur-sm shadow-lg">
              <FaClock className="w-3 h-3" />
              {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Product Title */}
        <div>
          <Link to={`/produit/${promotion.id}?from=promotions`}>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight mb-2 group-hover:text-red-700 transition-colors duration-300 cursor-pointer hover:underline">
              {promotion.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {promotion.description}
          </p>
        </div>

        {/* Pricing Section modernisée */}
        <div className="space-y-3">
          {/* Prix original barré */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 line-through">
              Prix normal: {formatPrice(safeOriginalPrice)}
            </span>
          </div>
          
          {/* Prix promotionnel en évidence */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-red-600">Prix promotion</span>
            <span className="text-1xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {formatPrice(safeDiscountPrice)}
            </span>
          </div>
          
          {/* Économies */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-600">Vous économisez</span>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(savings)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={!promotion.inStock || productInCart}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg ${
            !promotion.inStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : showAdded || productInCart
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-200 hover:shadow-red-300'
          }`}
        >
          {showAdded || productInCart ? (
            <>
              <FaCheck className="w-4 h-4" />
              <span>Ajouté au panier !</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="w-4 h-4" />
              <span>Ajouter au panier</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default PromotionCard; 