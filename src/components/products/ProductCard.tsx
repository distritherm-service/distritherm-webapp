import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCheck, FaInfoCircle, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '@contexts/CartContext';
import { useFavorites } from '@contexts/FavoritesContext';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [showAdded, setShowAdded] = useState(false);
  const TVA = 0.20; // TVA à 20%
  const prixTTC = product.price * (1 + TVA);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      ...product,
      quantity: 1
    });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        ...product,
        addedAt: new Date().toISOString()
      });
    }
  };
 
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
      {/* Image avec overlay au hover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/produit/${product.id}`}
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
          {isFavorite(product.id) ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom du produit */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Description courte */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Disponibilité */}
        <div className="mb-3">
          {product.stock > 0 ? (
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
        </div>

        {/* Prix */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Prix HT:</span>
            <span className="text-lg font-semibold text-gray-800">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Prix TTC:</span>
            <span className="text-lg font-bold text-[#007FFF]">
              {prixTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              showAdded
                ? 'bg-green-500 text-white'
                : product.stock > 0 
                  ? 'bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white hover:shadow-lg hover:from-[#7CB9E8]/90 hover:to-[#007FFF]/90'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {showAdded ? (
              <>
                <FaCheck />
                Ajouté
              </>
            ) : (
              <>
                <FaShoppingCart />
                {product.stock > 0 ? 'Ajouter au panier' : 'Commander'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Badge stock */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Plus que {product.stock} en stock
        </div>
      )}
    </div>
  );
};

export default ProductCard; 