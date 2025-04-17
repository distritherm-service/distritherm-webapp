import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { Category, categoryService } from '../../services/categoryService';

interface VerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<Category | null>(null);
  const [activeLevel3Category, setActiveLevel3Category] = useState<Category | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Charger toutes les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedCategories = await categoryService.getAllCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        setError("Erreur lors du chargement des catégories");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Réinitialiser les états lors de la fermeture
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
      setActiveSubCategory(null);
      setActiveLevel3Category(null);
    }
  }, [isOpen]);

  // Organiser les catégories par niveau et parent
  const {
    level1Categories,
    getChildCategories,
  } = useMemo(() => {
    const level1 = categories.filter(cat => cat.level === 1);
    
    const getChildren = (parentId: number) => {
      return categories.filter(cat => cat.parentCategoryId === parentId);
    };

    return {
      level1Categories: level1,
      getChildCategories: getChildren,
    };
  }, [categories]);

  const handleLevel1Click = (category: Category) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
    setActiveLevel3Category(null);
  };

  const handleLevel2Click = (category: Category) => {
    setActiveSubCategory(category);
    setActiveLevel3Category(null);
  };

  const handleLevel3Click = (category: Category) => {
    setActiveLevel3Category(category);
  };

  const menuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
      <p className="text-red-500 mb-2">Une erreur est survenue</p>
      <p className="text-sm text-gray-600">{error}</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
      <p className="text-gray-500">Aucune catégorie disponible</p>
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 w-screen h-screen bg-black/60"
            style={{ zIndex: 9998 }}
          />

          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-screen w-auto bg-white overflow-hidden flex flex-row shadow-xl"
            style={{ zIndex: 9999 }}
          >
            {/* Niveau 1 */}
            <motion.div 
              variants={menuVariants}
              className="w-80 flex flex-col h-full border-r border-gray-100"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                <motion.h2 variants={itemVariants} className="text-xl font-semibold text-gray-800">
                  Catégories
                </motion.h2>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading && renderLoadingState()}
                {error && renderErrorState()}
                {!isLoading && !error && level1Categories.length === 0 && renderEmptyState()}
                {level1Categories.map((category) => (
                  <motion.button
                    key={category.id}
                    variants={itemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgba(243, 244, 246, 1)',
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleLevel1Click(category)}
                    className={`w-full flex items-center justify-between p-4 border-b border-gray-100 transition-all ${
                      activeCategory?.id === category.id ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    {category.haveChildren && (
                      <motion.span
                        animate={activeCategory?.id === category.id ? { rotate: 90 } : { rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Niveau 2 */}
            {activeCategory && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full border-r border-gray-100"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeCategory.name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoading && renderLoadingState()}
                  {error && renderErrorState()}
                  {!isLoading && !error && getChildCategories(activeCategory.id).length === 0 && renderEmptyState()}
                  {getChildCategories(activeCategory.id).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleLevel2Click(category)}
                      className={`w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        activeSubCategory?.id === category.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <span>{category.name}</span>
                      {category.haveChildren && (
                        <FaChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Niveau 3 */}
            {activeSubCategory && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full border-r border-gray-100"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeSubCategory.name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoading && renderLoadingState()}
                  {error && renderErrorState()}
                  {!isLoading && !error && getChildCategories(activeSubCategory.id).length === 0 && renderEmptyState()}
                  {getChildCategories(activeSubCategory.id).map((category) => (
                    category.haveChildren ? (
                      <button
                        key={category.id}
                        onClick={() => handleLevel3Click(category)}
                        className={`w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          activeLevel3Category?.id === category.id ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span>{category.name}</span>
                        <FaChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ) : (
                      <Link
                        key={category.id}
                        to={`/categorie/${activeCategory!.id}/${activeSubCategory.id}/${category.id}`}
                        onClick={onClose}
                        className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {category.name}
                      </Link>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* Niveau 4 */}
            {activeLevel3Category && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeLevel3Category.name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoading && renderLoadingState()}
                  {error && renderErrorState()}
                  {!isLoading && !error && getChildCategories(activeLevel3Category.id).length === 0 && renderEmptyState()}
                  {getChildCategories(activeLevel3Category.id).map((category) => (
                    <Link
                      key={category.id}
                      to={`/categorie/${activeCategory!.id}/${activeSubCategory!.id}/${activeLevel3Category.id}/${category.id}`}
                      onClick={onClose}
                      className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VerticalMenu; 