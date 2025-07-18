import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteProductButtonProps {
  productId: number;
  className?: string;
  onLoginRequired?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const FavoriteProductButton: React.FC<FavoriteProductButtonProps> = ({ 
  productId, 
  className = '',
  onLoginRequired,
  size = 'lg'
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
      button: 'w-12 h-12',
      icon: 'w-5 h-5',
      padding: 'p-3'
    },
    md: {
      button: 'w-14 h-14',
      icon: 'w-6 h-6',
      padding: 'p-4'
    },
    lg: {
      button: 'w-16 h-16',
      icon: 'w-7 h-7',
      padding: 'p-4'
    },
    xl: {
      button: 'w-20 h-20',
      icon: 'w-9 h-9',
      padding: 'p-5'
    }
  };

  const config = sizeConfig[size];
  const isFavorited = isFavorite(productId);

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`
        ${config.button} ${config.padding} rounded-2xl transition-all duration-300 
        bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl border border-gray-200/50
        ${isFavorited 
          ? 'text-red-500 hover:bg-red-50 hover:border-red-200 hover:shadow-red-200/50' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 hover:shadow-red-200/50'
        }
        ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-110 active:scale-95'} 
        ${className}
      `}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.95 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
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
              duration: 0.4 
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
              duration: 0.4 
            }}
          >
            <FaRegHeart className={config.icon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default FavoriteProductButton; 