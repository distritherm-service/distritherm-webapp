import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Category } from '../../types/category';
import { categoryService } from '../../services/categoryService';

interface MobileVerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuLevel = {
  type: 'main' | 'sub' | 'level3' | 'level4';
  data: Category;
  parent?: Category;
};

const MobileVerticalMenu: React.FC<MobileVerticalMenuProps> = ({ isOpen, onClose }) => {
  const [menuHistory, setMenuHistory] = useState<MenuLevel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      try {
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  // Réinitialiser l'historique quand le menu se ferme
  useEffect(() => {
    if (!isOpen) {
      setMenuHistory([]);
    }
  }, [isOpen]);

  const handleItemClick = (item: Category, type: MenuLevel['type'], parent?: Category) => {
    setMenuHistory(prev => [...prev, { type, data: item, parent }]);
  };

  const handleBackClick = () => {
    setMenuHistory(prev => prev.slice(0, -1));
  };

  const getCurrentTitle = () => {
    if (menuHistory.length === 0) return 'Catégories';
    return menuHistory[menuHistory.length - 1].data.name;
  };

  // Organiser les catégories par niveau
  const getLevel1Categories = () => {
    return categories.filter(cat => cat.level === 1);
  };

  const getChildCategories = (parentId: number) => {
    return categories.filter(cat => cat.parentCategoryId === parentId);
  };

  const renderMenuContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    if (menuHistory.length === 0) {
      const level1Categories = getLevel1Categories();
      return (
        <div className="space-y-2">
          {level1Categories.map((item: Category) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item, 'main')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="flex items-center space-x-3">
                <span className="text-xl">📦</span>
                <span className="font-medium">{item.name}</span>
              </span>
              {item.haveChildren && <span className="text-gray-400">›</span>}
            </motion.button>
          ))}
        </div>
      );
    }

    const currentLevel = menuHistory[menuHistory.length - 1];

    if (currentLevel.type === 'main') {
      const item = currentLevel.data as Category;
      const childCategories = getChildCategories(item.id);
      
      if (childCategories.length === 0) {
        // Si pas d'enfants, créer un lien vers la page de catégorie
        return (
          <div className="p-4">
            <Link
              to={`/categorie/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onClose}
              className="block w-full text-center bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Voir les produits de {item.name}
            </Link>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {childCategories.map((subItem) => (
            <motion.button
              key={subItem.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(subItem, 'sub', item)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{subItem.name}</span>
              {subItem.haveChildren && <span className="text-gray-400">›</span>}
            </motion.button>
          ))}
        </div>
      );
    }

    if (currentLevel.type === 'sub') {
      const item = currentLevel.data as Category;
      const childCategories = getChildCategories(item.id);
      
      if (childCategories.length === 0) {
        // Si pas d'enfants, créer un lien vers la page de catégorie
        return (
          <div className="p-4">
            <Link
              to={`/categorie/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onClose}
              className="block w-full text-center bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Voir les produits de {item.name}
            </Link>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {childCategories.map((level3Item) => (
            <motion.button
              key={level3Item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(level3Item, 'level3', item)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{level3Item.name}</span>
              {level3Item.haveChildren && <span className="text-gray-400">›</span>}
            </motion.button>
          ))}
        </div>
      );
    }

    if (currentLevel.type === 'level3') {
      const item = currentLevel.data as Category;
      const childCategories = getChildCategories(item.id);
      
      if (childCategories.length === 0) {
        // Si pas d'enfants, créer un lien vers la page de catégorie
        return (
          <div className="p-4">
            <Link
              to={`/categorie/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onClose}
              className="block w-full text-center bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Voir les produits de {item.name}
            </Link>
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {childCategories.map((level4Item) => (
            <Link
              key={level4Item.id}
              to={`/categorie/${level4Item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={onClose}
              className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {level4Item.name}
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay avec effet de flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 w-full h-full z-[100]"
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              touchAction: 'none'
            }}
          />

          {/* Menu modal */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[101] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                {menuHistory.length > 0 && (
                  <button
                    onClick={handleBackClick}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <h2 className="text-xl font-semibold">
                  {getCurrentTitle()}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)" }}>
              <div className="p-4">
                {renderMenuContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileVerticalMenu; 