import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import { Product } from '../data/products';
import { Promotion } from '../data/promotions';

interface FavoriteButtonProps {
  item: Product | Promotion;
  type: 'product' | 'promotion';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item, type, className = '' }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isItemFavorite = isFavorite(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isItemFavorite) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item, type);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group ${className}`}
      aria-label={isItemFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <FaHeart
        className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${
          isItemFavorite
            ? 'text-red-500 group-hover:text-red-600'
            : 'text-gray-400 group-hover:text-red-500'
        }`}
      />
    </button>
  );
};

export default FavoriteButton; 