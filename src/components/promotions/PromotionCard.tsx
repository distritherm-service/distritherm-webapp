import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion, getDaysRemaining } from '../../data/promotions';
import FavoriteButton from '../../components/favorites/FavoriteButton';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FaHeart } from 'react-icons/fa';
import type { FavoriteItem } from '@/types';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const handleAddToCart = () => {
    if (!promotion.inStock) return;
    
    addToCart({
      id: promotion.id,
      name: promotion.title,
      price: promotion.discountPrice,
      image: promotion.image,
      quantity: 1
    });
    
    showToast("Promotion ajoutée au panier");
  };
  
  const handleToggleFavorite = () => {
    if (isFavorite(promotion.id)) {
      removeFromFavorites(promotion.id);
      showToast("Retiré des favoris");
    } else {
      const favoriteItem: FavoriteItem = {
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

  const promotionInCart = isInCart(promotion.id);
  const daysRemaining = getDaysRemaining(promotion.validUntil);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col group relative">
      {/* Toast notification */}
      {showNotification && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-fade-in-down">
          {showNotification}
        </div>
      )}
      
      {/* Badge de réduction */}
      <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-1.5 px-3 rounded-bl-xl z-10 transform translate-y-0 group-hover:-translate-y-0.5 transition-transform">
        -{promotion.discountPercentage}%
      </div>
      
      <div className="relative aspect-[4/3]">
        <img 
          src={promotion.image} 
          alt={promotion.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://via.placeholder.com/400x300?text=Distritherm';
          }}
        />
        
        {promotion.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
              Offre vedette
            </span>
          </div>
        )}
        
        {!promotion.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12 shadow-lg">
              Rupture de stock
            </span>
          </div>
        )}
        
        <FavoriteButton
          item={{
            id: promotion.id,
            name: promotion.title,
            price: promotion.discountPrice,
            image: promotion.image,
            description: promotion.description,
            category: promotion.category,
            brand: promotion.brand
          }}
          type="promotion"
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
        />
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded mb-1">
                {promotion.category}
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-1">{promotion.title}</h3>
            </div>
            <div className="text-right">
              <span className="line-through text-gray-300 text-sm">
                {promotion.originalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
              <div className="text-white font-bold text-xl">
                {promotion.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-indigo-600">{promotion.brand}</span>
          <span className="text-xs text-gray-500">{promotion.subcategory}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{promotion.description}</p>
        
        <div className="mt-auto space-y-4">
          {/* Prix et économies */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Prix original</span>
                <div className="flex gap-2 items-center">
                  <span className="line-through text-gray-500 text-sm">
                    {promotion.originalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <span className="text-xs text-gray-400">(TTC)</span>
                </div>
                <span className="text-xs text-gray-400">
                  HT: {(promotion.originalPrice / 1.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Prix promo</span>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-teal-600">
                    {promotion.discountPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <span className="text-xs text-gray-400">(TTC)</span>
                </div>
                <span className="text-xs text-gray-400">
                  HT: {(promotion.discountPrice / 1.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Code promo et économie réalisée */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Code promo:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{promotion.code}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Économie:</span>
              <div className="font-bold text-red-500">
                {(promotion.originalPrice - promotion.discountPrice).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!promotion.inStock || promotionInCart}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                !promotion.inStock || promotionInCart
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {promotionInCart ? 'Dans le panier' : 'Ajouter au panier'}
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaHeart className={`w-5 h-5 ${isFavorite(promotion.id) ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          
          {/* Jours restants */}
          {daysRemaining > 0 && (
            <div className="text-center text-sm text-gray-500">
              {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionCard; 