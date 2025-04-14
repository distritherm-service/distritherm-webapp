import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { MenuItem, SubItem, Level3Item, Level4Item, menuItems } from '../data/menuData';

interface VerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activeLevel3, setActiveLevel3] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveMenu(null);
      setActiveSubMenu(null);
      setActiveLevel3(null);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isOpen) {
      onClose();
    }
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

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setActiveSubMenu(null);
    setActiveLevel3(null);
  };

  const handleSubMenuClick = (subMenuId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveSubMenu(subMenuId);
    setActiveLevel3(null);
  };

  const handleLevel3Click = (level3Id: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveLevel3(level3Id);
  };

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
            onMouseEnter={handleMouseEnter}
            className="fixed top-0 left-0 h-screen w-auto bg-white overflow-hidden flex flex-row shadow-xl"
            style={{ zIndex: 9999 }}
          >
            {/* Menu principal (Niveau 1) */}
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
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {menuItems.map((item: MenuItem) => (
                  <motion.button
                    key={item.slug}
                    variants={itemVariants}
                    whileHover={{ 
                      backgroundColor: 'rgba(243, 244, 246, 1)',
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleMenuClick(item.slug)}
                    className={`w-full flex items-center justify-between p-4 transition-all ${
                      activeMenu === item.slug ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    <span className="flex items-center">
                      {item.icon && (
                        <motion.span className="mr-3 text-gray-500" whileHover={{ scale: 1.2 }}>
                          {item.icon}
                        </motion.span>
                      )}
                      <span className="font-medium">{item.title}</span>
                    </span>
                    <motion.span
                      animate={activeMenu === item.slug ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Niveau 2 */}
            {activeMenu && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full border-r border-gray-100"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {menuItems.find((item: MenuItem) => item.slug === activeMenu)?.title}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {menuItems
                    .find((item: MenuItem) => item.slug === activeMenu)
                    ?.subItems.map((subItem: SubItem) => (
                      <button
                        key={subItem.slug}
                        onClick={(e) => handleSubMenuClick(subItem.slug, e)}
                        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                          activeSubMenu === subItem.slug ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span>{subItem.title}</span>
                        {subItem.level3Items && (
                          <FaChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Niveau 3 */}
            {activeSubMenu && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {menuItems
                      .find((item: MenuItem) => item.slug === activeMenu)
                      ?.subItems.find((sub: SubItem) => sub.slug === activeSubMenu)?.title}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {menuItems
                    .find((item: MenuItem) => item.slug === activeMenu)
                    ?.subItems.find((sub: SubItem) => sub.slug === activeSubMenu)
                    ?.level3Items?.map((level3Item: Level3Item) => (
                      level3Item.level4Items ? (
                        <button
                          key={level3Item.slug}
                          onClick={(e) => handleLevel3Click(level3Item.slug, e)}
                          className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                            activeLevel3 === level3Item.slug ? 'bg-gray-50' : ''
                          }`}
                        >
                          <span>{level3Item.title}</span>
                          <FaChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ) : (
                        <Link
                          key={level3Item.slug}
                          to={`/categorie/${activeMenu}/${activeSubMenu}/${level3Item.slug}`}
                          onClick={onClose}
                          className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          {level3Item.title}
                        </Link>
                      )
                    ))}
                </div>
              </motion.div>
            )}

            {/* Niveau 4 */}
            {activeLevel3 && (
              <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-80 flex flex-col h-full"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {menuItems
                      .find((item: MenuItem) => item.slug === activeMenu)
                      ?.subItems.find((sub: SubItem) => sub.slug === activeSubMenu)
                      ?.level3Items?.find((level3: Level3Item) => level3.slug === activeLevel3)?.title}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {menuItems
                    .find((item: MenuItem) => item.slug === activeMenu)
                    ?.subItems.find((sub: SubItem) => sub.slug === activeSubMenu)
                    ?.level3Items?.find((level3: Level3Item) => level3.slug === activeLevel3)
                    ?.level4Items?.map((level4Item: Level4Item) => (
                      <Link
                        key={level4Item.slug}
                        to={`/categorie/${activeMenu}/${activeSubMenu}/${activeLevel3}/${level4Item.slug}`}
                        onClick={onClose}
                        className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        {level4Item.title}
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