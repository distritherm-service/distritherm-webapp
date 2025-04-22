import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FavoriteItem } from '../../types/favorites';

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item, className = '' }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorite(item.id)
          ? 'text-red-500 hover:bg-red-50'
          : 'text-gray-400 hover:bg-gray-50'
      } ${className}`}
      aria-label={isFavorite(item.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isFavorite(item.id) ? (
        <FaHeart className="w-6 h-6" />
      ) : (
        <FaRegHeart className="w-6 h-6" />
      )}
    </button>
  );
};

export default FavoriteButton; 