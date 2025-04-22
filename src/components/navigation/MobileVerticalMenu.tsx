import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MenuItem, SubItem, Level3Item, Level4Item, menuItems } from '../../data/menuData';

interface MobileVerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuLevel = {
  type: 'main' | 'sub' | 'level3' | 'level4';
  data: MenuItem | SubItem | Level3Item | Level4Item;
  parent?: MenuItem | SubItem | Level3Item;
};

const MobileVerticalMenu: React.FC<MobileVerticalMenuProps> = ({ isOpen, onClose }) => {
  const [menuHistory, setMenuHistory] = useState<MenuLevel[]>([]);

  const handleItemClick = (item: MenuItem | SubItem | Level3Item | Level4Item, type: MenuLevel['type'], parent?: MenuItem | SubItem | Level3Item) => {
    setMenuHistory(prev => [...prev, { type, data: item, parent }]);
  };

  const handleBackClick = () => {
    setMenuHistory(prev => prev.slice(0, -1));
  };

  const getCurrentTitle = () => {
    if (menuHistory.length === 0) return 'Categories';
    return menuHistory[menuHistory.length - 1].data.title;
  };

  const renderMenuContent = () => {
    if (menuHistory.length === 0) {
      return (
        <div className="space-y-2">
          {menuItems.map((item: MenuItem) => (
            <motion.button
              key={item.slug}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item, 'main')}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="flex items-center space-x-3">
                {item.icon && <span className="text-xl">{item.icon}</span>}
                <span className="font-medium">{item.title}</span>
              </span>
              <span className="text-gray-400">›</span>
            </motion.button>
          ))}
        </div>
      );
    }

    const currentLevel = menuHistory[menuHistory.length - 1];

    if (currentLevel.type === 'main') {
      const item = currentLevel.data as MenuItem;
      return (
        <div className="space-y-2">
          {item.subItems.map((subItem) => (
            <motion.button
              key={subItem.slug}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(subItem, 'sub', item)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{subItem.title}</span>
              {subItem.level3Items && <span className="text-gray-400">›</span>}
            </motion.button>
          ))}
        </div>
      );
    }

    if (currentLevel.type === 'sub') {
      const item = currentLevel.data as SubItem;
      if (!item.level3Items) return null;
      
      return (
        <div className="space-y-2">
          {item.level3Items.map((level3Item) => (
            <motion.button
              key={level3Item.slug}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(level3Item, 'level3', item)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{level3Item.title}</span>
              {level3Item.level4Items && <span className="text-gray-400">›</span>}
            </motion.button>
          ))}
        </div>
      );
    }

    if (currentLevel.type === 'level3') {
      const item = currentLevel.data as Level3Item;
      if (!item.level4Items) return null;
      
      return (
        <div className="space-y-2">
          {item.level4Items.map((level4Item) => (
            <Link
              key={level4Item.slug}
              to={`/products/${currentLevel.parent?.slug}/${item.slug}/${level4Item.slug}`}
              onClick={onClose}
              className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {level4Item.title}
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