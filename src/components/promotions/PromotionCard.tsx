import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion } from '../../services/promotionService';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FaHeart, FaShoppingCart, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { formatPrice } from '../../utils/format';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  // Vérifier que promotion est défini pour éviter des erreurs
  if (!promotion) {
    return <div className="bg-white rounded-xl shadow-md p-4">Chargement...</div>;
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
  
  const handleAddToCart = () => {
    if (!promotion.inStock) return;
    
    addToCart({
      id: promotion.id,
      name: promotion.title,
      price: promotion.discountPrice,
      image: promotion.image,
      quantity: 1
    });
    
    showToast("Produit ajouté au panier");
  };
  
  const handleToggleFavorite = () => {
    if (isFavorite(promotion.id)) {
      removeFromFavorites(promotion.id);
      showToast("Retiré des favoris");
    } else {
      const favoriteItem = {
        id: promotion.id,
        name: promotion.title,
        price: promotion.discountPrice,
        image: promotion.image,
        description: promotion.description,
        category: promotion.category,
        brand: promotion.brand
      };
      addToFavorites(favoriteItem);
      showToast("Ajouté aux favoris");
    }
  };
  
  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 2000);
  };

  // Prix sécurisés pour éviter les NaN
  const safeOriginalPrice = promotion.originalPrice || 0;
  const safeDiscountPrice = promotion.discountPrice || 0;
  const saveDiscountPercentage = promotion.discountPercentage || 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
      {/* Notification Toast */}
      {showNotification && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-down">
          {showNotification}
        </div>
      )}
      
      {/* Badge promotion */}
      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg z-10">
        -{saveDiscountPercentage}%
      </div>
      
      {/* Image avec overlay au hover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={promotion.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/produit/${promotion.id}`}
            className="bg-white/90 text-[#007FFF] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-colors"
          >
            <FaInfoCircle />
            Voir les détails
          </Link>
        </div>
        
        {/* Bouton favoris */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <FaHeart className={`w-5 h-5 ${isFavorite(promotion.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom du produit */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {promotion.title}
        </h3>

        {/* Description courte */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {promotion.description}
        </p>

        {/* Disponibilité */}
        <div className="mb-3">
          {promotion.inStock ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sur commande
            </span>
          )}
          
          {daysRemaining > 0 && (
            <span className="inline-flex items-center ml-2 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Prix normal:</span>
            <span className="text-lg line-through text-gray-500">
              {formatPrice(safeOriginalPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Prix promo:</span>
            <span className="text-lg font-bold text-red-600">
              {formatPrice(safeDiscountPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Économie:</span>
            <span className="text-md font-semibold text-green-600">
              {formatPrice(safeOriginalPrice - safeDiscountPrice)}
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!promotion.inStock || productInCart}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              !promotion.inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : productInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white hover:shadow-lg hover:from-[#7CB9E8]/90 hover:to-[#007FFF]/90'
            }`}
          >
            {productInCart ? (
              <>
                <FaCheck />
                Ajouté
              </>
            ) : (
              <>
                <FaShoppingCart />
                Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Badge stock */}
      {promotion.inStock && promotion.quantity && promotion.quantity <= 5 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Plus que {promotion.quantity} en stock
        </div>
      )}
    </div>
  );
};

export default PromotionCard; 