import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  onLoginRequired?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'floating' | 'minimal';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  className = '',
  onLoginRequired,
  size = 'md',
  variant = 'default'
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
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
      await toggleFavorite(productId);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration des tailles
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      padding: 'p-2'
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      padding: 'p-2.5'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 'w-6 h-6',
      padding: 'p-3'
    }
  };

  // Configuration des variants
  const variantConfig = {
    default: {
      base: 'bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50',
      favorite: 'text-red-500 hover:bg-red-50 hover:border-red-200',
      notFavorite: 'text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
    },
    floating: {
      base: 'bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/50',
      favorite: 'text-red-500 hover:bg-red-50/80',
      notFavorite: 'text-gray-500 hover:text-red-500 hover:bg-red-50/80'
    },
    minimal: {
      base: 'bg-transparent',
      favorite: 'text-red-500 hover:bg-red-50/50',
      notFavorite: 'text-gray-400 hover:text-red-500 hover:bg-red-50/50'
    }
  };

  const config = sizeConfig[size];
  const variantStyle = variantConfig[variant];
  const isFavorited = isFavorite(productId);

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        ${config.button} ${config.padding} rounded-full transition-all duration-300 
        ${variantStyle.base}
        ${isFavorited ? variantStyle.favorite : variantStyle.notFavorite}
        ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-110 active:scale-95'} 
        ${className}
      `}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      whileHover={{ scale: isLoading ? 1 : 1.1 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <FaSpinner className={`${config.icon} animate-spin`} />
          </motion.div>
        ) : isFavorited ? (
          <motion.div
            key="favorite"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              duration: 0.3 
            }}
          >
            <FaHeart className={config.icon} />
          </motion.div>
        ) : (
          <motion.div
            key="not-favorite"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30,
              duration: 0.3 
            }}
          >
            <FaRegHeart className={config.icon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FavoriteButton; 