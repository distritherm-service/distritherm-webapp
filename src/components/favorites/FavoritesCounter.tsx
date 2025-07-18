import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';

interface FavoritesCounterProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FavoritesCounter: React.FC<FavoritesCounterProps> = ({ 
  className = '',
  showIcon = true,
  size = 'md'
}) => {
  const { favoritesCount, favorites, isLoading } = useFavorites();
  const { isAuthenticated } = useAuth();

  const sizeConfig = {
    sm: {
      container: 'w-5 h-5',
      text: 'text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'w-6 h-6',
      text: 'text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      container: 'w-8 h-8',
      text: 'text-base',
      icon: 'w-5 h-5'
    }
  };

  const config = sizeConfig[size];

  // Utiliser favoritesCount ou la longueur du tableau favorites comme fallback
  const actualCount = favoritesCount || favorites.length;

  // Ne pas afficher si :
  // 1. L'utilisateur n'est pas connecté
  // 2. Il n'y a pas de favoris (count <= 0)
  // 3. Le chargement est en cours
  if (!isAuthenticated || actualCount <= 0 || isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3 
        }}
        className={`
          absolute -top-2 -right-2 
          ${config.container}
          bg-gradient-to-r from-red-500 to-pink-500 
          text-white font-bold rounded-full 
          flex items-center justify-center 
          shadow-lg animate-pulse
          ${className}
        `}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={actualCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${config.text} font-bold`}
          >
            {actualCount > 99 ? '99+' : actualCount}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default FavoritesCounter; 