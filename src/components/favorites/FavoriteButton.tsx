import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FavoriteItem } from '../../types/favorites';
import { useAuth } from '../../contexts/AuthContext';

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
  onLoginRequired?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  item, 
  className = '',
  onLoginRequired
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si l'utilisateur n'est pas connecté et qu'un callback est fourni,
    // exécuter le callback au lieu d'ajouter aux favoris
    if (!isAuthenticated && onLoginRequired) {
      onLoginRequired();
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite(item.id)) {
        await removeFromFavorites(item.id);
      } else {
        await addToFavorites(item);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorite(item.id)
          ? 'text-red-500 hover:bg-red-50'
          : 'text-gray-400 hover:bg-gray-50'
      } ${isLoading ? 'opacity-70 cursor-wait' : ''} ${className}`}
      aria-label={isFavorite(item.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isLoading ? (
        <FaSpinner className="w-6 h-6 animate-spin" />
      ) : isFavorite(item.id) ? (
        <FaHeart className="w-6 h-6" />
      ) : (
        <FaRegHeart className="w-6 h-6" />
      )}
    </button>
  );
};

export default FavoriteButton; 