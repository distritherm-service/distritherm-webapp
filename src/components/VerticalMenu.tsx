import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

interface MenuItem {
  title: string;
  slug: string;
  icon?: string;
  subItems: string[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Platerie',
    slug: 'platerie',
    icon: '🧱',
    subItems: [
      'Plaque standard',
      'Plaque hydro',
      'Plaque technique',
      'Carreau de platre',
      'Faux plafond',
      'Enduit',
      'Mortier',
      'Peinture',
      'Osature',
      'Outil et assesoire',
      'Colle'
    ]
  },
  {
    title: 'Isolation',
    slug: 'isolation',
    icon: '🔥',
    subItems: [
      'Isolation inerieure',
      'Isolation exterieure'
    ]
  },
  {
    title: 'Chauffage',
    slug: 'chauffage',
    icon: '♨️',
    subItems: [
      'Pompe à chaleur',
      'Chaudières',
      'Radiateurs',
      'Plancher chauffant',
      'Poêles & inserts',
      'Accessoires'
    ]
  },
  {
    title: 'Climatisation',
    slug: 'climatisation',
    icon: '❄️',
    subItems: [
      'Pompe à chaleur AIR/AIR',
      'Climatiseur',
      'VRV VRF',
      'Ventilation',
      'Accesoires'
    ]
  },
  {
    title: 'Sanitaire',
    slug: 'sanitaire',
    icon: '🚿',
    subItems: [
      'Chauffe-eaux et ballons',
      'Mobilier',
      'Robinnetterie',
      'Seche serviette',
      'Espace douche'
    ]
  },
  {
    title: 'Plomberie',
    slug: 'plomberie',
    icon: '🔧',
    subItems: [
      'Tuyaux',
      'Raccords',
      'Felexibles',
      'Vannes',
      'Accesoires'
    ]
  },
  {
    title: 'Electricité',
    slug: 'electricite',
    icon: '⚡',
    subItems: [
      'Thermostats',
      'Cables',
      'Gaines',
      'Disjoncteurs',
      'Panneaux solaire'
    ]
  },
  {
    title: 'Outillages',
    slug: 'outillages',
    icon: '🔨',
    subItems: [
      'Electroportatif',
      'À main',
      'Accesoires'
    ]
  },
  {
    title: 'EPI',
    slug: 'epi',
    icon: '⛑️',
    subItems: [
      'Casques',
      'Chaussures de sécurité',
      'Bottes',
      'Gants',
      'Lunettes de protection',
      'Bouchons anti-bruits',
      'Masque de chantier',
      'Vetements'
    ]
  }
];

interface VerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const menuRef = useRef<HTMLDivElement>(null);

  // Log pour le débogage
  useEffect(() => {
    console.log("VerticalMenu isOpen:", isOpen);
  }, [isOpen]);

  // Gérer la détection du mode mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Exécuter immédiatement pour définir la vue correcte
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      // Ajout d'un petit délai pour éviter les conflits avec d'autres gestionnaires d'événements
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Ajouter un gestionnaire pour fermer le menu avec la touche Escape
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Si le menu est fermé, ne rien afficher
  // if (!isOpen) return null;

  const handleCategoryClick = (slug: string) => {
    // Sur mobile, on bascule l'état de la catégorie sélectionnée
    if (isMobileView) {
      if (selectedCategory === slug) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(slug);
      }
    } else {
      // Sur desktop, on définit simplement la catégorie sélectionnée
      setSelectedCategory(slug);
    }
  };

  const handleMouseEnter = (slug: string) => {
    if (!isMobileView) {
      setHoveredCategory(slug);
      setSelectedCategory(slug);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileView) {
      setHoveredCategory(null);
    }
  };

  const currentCategory = hoveredCategory || selectedCategory;
  const currentCategoryData = menuItems.find(item => item.slug === currentCategory);

  // Animations pour le menu
  const menuVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animations pour les sous-menus
  const submenuVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-start"
          id="vertical-menu-container"
        >
          <div 
            ref={menuRef}
            className="flex h-[90vh] max-h-[700px] mt-20 sm:mt-20 ml-0 sm:ml-4 md:ml-10 w-full sm:w-auto rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Catégories */}
            <div className="w-[280px] md:w-[320px] bg-white rounded-l-2xl flex flex-col border-r border-gray-100">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-semibold text-gray-800">Nos Catégories</h2>
                <button 
                  onClick={() => {
                    console.log("Fermeture du menu");
                    onClose();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer le menu"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto flex-1 py-2">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.slug}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: menuItems.findIndex(i => i.slug === item.slug) * 0.05 }}
                  >
                    <button
                      className={`w-full flex items-center px-5 py-3 text-left transition-all rounded-lg mx-2 my-1
                        ${currentCategory === item.slug 
                          ? 'bg-teal-50 text-teal-700' 
                          : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => handleCategoryClick(item.slug)}
                      onMouseEnter={() => handleMouseEnter(item.slug)}
                    >
                      {item.icon && (
                        <span className="mr-3 text-xl">{item.icon}</span>
                      )}
                      <span className="flex-1 font-medium">{item.title}</span>
                      <FaChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ${
                          currentCategory === item.slug ? 'text-teal-600 rotate-90' : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sous-catégories */}
            <AnimatePresence mode="wait">
              {currentCategoryData && (
                <motion.div 
                  key={currentCategoryData.slug}
                  variants={submenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-[300px] md:w-[400px] h-full bg-white rounded-r-2xl border-l border-gray-100 shadow-lg overflow-auto sm:overflow-visible"
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">{currentCategoryData.title}</h3>
                  </div>

                  <div className="p-4 grid grid-cols-1 gap-2 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {currentCategoryData.subItems.map((subItem, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <Link
                          to={`/categorie/${currentCategoryData.slug}/${subItem.toLowerCase().replace(/ /g, '-')}`}
                          className="block p-3 rounded-lg bg-white hover:bg-teal-50 text-gray-700 hover:text-teal-700 shadow-sm hover:shadow transition-all duration-200"
                          onClick={onClose}
                        >
                          {subItem}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerticalMenu; 