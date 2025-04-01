import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion, getDaysRemaining } from '../data/promotions';
import FavoriteButton from './FavoriteButton';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [inFavorites, setInFavorites] = useState(() => isFavorite(promotion.id));
  
  const { 
    id, 
    title, 
    description, 
    image, 
    category, 
    subcategory, 
    brand, 
    originalPrice, 
    discountPrice, 
    discountPercentage, 
    validUntil, 
    code, 
    inStock, 
    featured 
  } = promotion;
  
  const daysRemaining = getDaysRemaining(validUntil);
  
  // Calculer les prix HT (en supposant que les prix sont TTC)
  const originalPriceHT = originalPrice / 1.2; // TVA à 20%
  const discountPriceHT = discountPrice / 1.2; // TVA à 20%
  
  const formattedOriginalPriceHT = originalPriceHT.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedDiscountPriceHT = discountPriceHT.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedOriginalPriceTTC = originalPrice.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedDiscountPriceTTC = discountPrice.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  // Calcule l'économie en valeur absolue
  const saving = originalPrice - discountPrice;
  const formattedSaving = saving.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addToCart({
      id: promotion.id,
      name: promotion.title,
      price: discountPrice,
      image: promotion.image,
      quantity: 1
    });
    
    showToast("Promotion ajoutée au panier");
  };
  
  const handleToggleFavorite = () => {
    const newState = !inFavorites;
    setInFavorites(newState);
    
    if (newState) {
      addToFavorites(promotion, 'promotion');
      showToast("Ajouté aux favoris");
    } else {
      removeFromFavorites(promotion.id);
      showToast("Retiré des favoris");
    }
  };
  
  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 2000);
  };

  const promotionInCart = isInCart(promotion.id);

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
        -{discountPercentage}%
      </div>
      
      <div className="relative aspect-[4/3]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://via.placeholder.com/400x300?text=Distritherm';
          }}
        />
        
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
              Offre vedette
            </span>
          </div>
        )}
        
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold transform -rotate-12 shadow-lg">
              Rupture de stock
            </span>
          </div>
        )}
        
        <FavoriteButton
          item={promotion}
          type="promotion"
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
        />
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded mb-1">
                {category}
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-1">{title}</h3>
            </div>
            <div className="text-right">
              <span className="line-through text-gray-300 text-sm">{formattedOriginalPriceTTC}</span>
              <div className="text-white font-bold text-xl">{formattedDiscountPriceTTC}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-semibold text-indigo-600">{brand}</span>
          <span className="text-xs text-gray-500">{subcategory}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
        
        <div className="mt-auto space-y-4">
          {/* Prix et économies */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Prix original</span>
                <div className="flex gap-2 items-center">
                  <span className="line-through text-gray-500 text-sm">{formattedOriginalPriceTTC}</span>
                  <span className="text-xs text-gray-400">(TTC)</span>
                </div>
                <span className="text-xs text-gray-400">HT: {formattedOriginalPriceHT}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Prix promo</span>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-teal-600">{formattedDiscountPriceTTC}</span>
                  <span className="text-xs text-gray-400">(TTC)</span>
                </div>
                <span className="text-xs text-gray-400">HT: {formattedDiscountPriceHT}</span>
              </div>
            </div>
          </div>
          
          {/* Code promo et économie réalisée */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500">Code promo</span>
              <span className="text-xs text-gray-500">Économisez {formattedSaving}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-gradient-to-r from-gray-800 to-gray-700 text-white font-mono font-bold px-3 py-1 rounded text-sm">
                {code}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium" 
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        showToast("Code copié !");
                      }}>
                Copier
              </button>
            </div>
          </div>
          
          {/* Délai et CTA */}
          <div className="flex justify-between items-center">
            {daysRemaining > 0 ? (
              <div className="text-xs text-orange-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
              </div>
            ) : (
              <div className="text-xs text-red-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Offre expirée
              </div>
            )}
            
            <Link 
              to={`/produit/${id}`}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1 group"
            >
              Détails
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            {/* Bouton Favoris */}
            <button
              onClick={handleToggleFavorite}
              className={`flex-1 py-2.5 px-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5 ${
                inFavorites 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              }`}
            >
              <svg className="w-4 h-4" fill={inFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={inFavorites ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {inFavorites ? 'Sauvegardé' : 'Favoris'}
            </button>
            
            {/* Bouton Panier */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || promotionInCart}
              className={`flex-[2] py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-all ${
                !inStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : promotionInCart 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {!inStock ? (
                "Indisponible"
              ) : promotionInCart ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ajouté au panier
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard; 