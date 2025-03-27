import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Promotion, getDaysRemaining } from '../data/promotions';

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const [inFavorites, setInFavorites] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  
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
  
  const formattedOriginalPrice = originalPrice.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  });
  
  const formattedDiscountPrice = discountPrice.toLocaleString('fr-FR', {
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
    
    setInCart(true);
    showToast("Ajouté au panier");
    
    // Dans une application réelle, ici on ajouterait la promotion au panier dans un état global ou via une API
  };
  
  const handleToggleFavorite = () => {
    setInFavorites(!inFavorites);
    showToast(inFavorites ? "Retiré des favoris" : "Ajouté aux favoris");
    
    // Dans une application réelle, ici on ajouterait/supprimerait la promotion des favoris dans un état global ou via une API
  };
  
  const showToast = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 2000);
  };

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
        
        {/* Boutons Favoris et Panier Rapide */}
        {/* <div className="absolute top-4 right-16 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110 ${
              inFavorites 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label={inFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <svg className="w-5 h-5" fill={inFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={inFavorites ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button 
            onClick={handleAddToCart}
            disabled={!inStock || inCart}
            className={`p-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-110 ${
              !inStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : inCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500'
            }`}
            aria-label={inCart ? "Déjà dans le panier" : "Ajouter au panier rapidement"}
          >
            {inCart ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            )}
          </button>
        </div> */}
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-10 pb-4 px-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded mb-1">
                {category}
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-1">{title}</h3>
            </div>
            <div className="text-right">
              <span className="line-through text-gray-300 text-sm">{formattedOriginalPrice}</span>
              <div className="text-white font-bold text-xl">{formattedDiscountPrice}</div>
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
              to={`/promotion/${id}`}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
            >
              Détails
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
              disabled={!inStock || inCart}
              className={`flex-[3] py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1.5 transition-all ${
                !inStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : inCart 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {!inStock ? (
                "Indisponible"
              ) : inCart ? (
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