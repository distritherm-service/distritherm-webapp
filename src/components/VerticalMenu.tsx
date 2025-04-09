import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

// Interface pour le niveau 3 (sous-sous-catégories)
interface Level3Item {
  title: string;
  slug: string;
}

// Interface pour le niveau 2 (sous-catégories)
interface SubItem {
  title: string;
  slug: string;
  level3Items?: Level3Item[];
}

// Interface spéciale pour les conteneurs de niveau 3 (utilisée pour les cas comme "En sac" et "En seau")
interface Level3Container extends Level3Item {
  level3Items: Level3Item[];
}

// Interface pour le niveau 4 (sous-sous-sous-catégories)
interface Level4Item {
  title: string;
  slug: string;
}

// Interface pour les conteneurs de niveau 4
interface Level4Container extends Level3Item {
  level4Items: Level4Item[];
}

// Interface pour le niveau 1 (catégories principales)
interface MenuItem {
  title: string;
  slug: string;
  icon?: string;
  subItems: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Platerie',
    slug: 'platerie',
    icon: '🧱',
    subItems: [
      {
        title: 'Plaque standard',
        slug: 'plaque-standard',
        level3Items: [
          { title: 'BA13', slug: 'ba13' },
          { title: 'BA18', slug: 'ba18' },
          { title: 'BA25', slug: 'ba25' }
        ]
      },
      {
        title: 'Plaque hydro',
        slug: 'plaque-hydro',
        level3Items: [
          { title: 'BA13', slug: 'ba13-hydro' },
          { title: 'BA18', slug: 'ba18-hydro' },
          { title: 'BA25', slug: 'ba25-hydro' }
        ]
      },
      {
        title: 'Plaque technique',
        slug: 'plaque-technique',
        level3Items: [
          { title: 'Feu', slug: 'feu' },
          { title: 'HD', slug: 'hd' },
          { title: 'Phonique', slug: 'phonique' },
          { title: 'Multifonctions', slug: 'multifonctions' },
          { title: 'Fermacell', slug: 'fermacell' }
        ]
      },
      {
        title: 'Carreau de platre',
        slug: 'carreau-de-platre',
        level3Items: [
          { title: 'Standard', slug: 'standard' },
          { title: 'Hydro', slug: 'hydro' },
          { title: 'Alvéolaire', slug: 'alveolaire' }
        ]
      },
      {
        title: 'Faux plafonds',
        slug: 'faux-plafonds',
        level3Items: [
          { title: 'Standard', slug: 'standard-plafond' },
          { title: 'Hydro', slug: 'hydro-plafond' }
        ]
      },
      {
        title: 'Colle',
        slug: 'colle'
      },
      {
        title: 'Enduit',
        slug: 'enduit',
        level3Items: [
          { 
            title: 'En sac', 
            slug: 'en-sac',
            level3Items: [
              { title: 'Fin', slug: 'fin' },
              { title: 'Gros', slug: 'gros' },
              { title: 'Rapide', slug: 'rapide' },
              { title: 'Universel', slug: 'universel' },
              { title: '2en1', slug: '2en1' }
            ] 
          } as Level3Container,
          { 
            title: 'En seau', 
            slug: 'en-seau',
            level3Items: [
              { title: 'Fin', slug: 'fin-seau' },
              { title: 'Gros', slug: 'gros-seau' },
              { title: 'Rapide', slug: 'rapide-seau' },
              { title: 'Universel', slug: 'universel-seau' },
              { title: '2en1', slug: '2en1-seau' }
            ] 
          } as Level3Container
        ]
      },
      {
        title: 'Mortier',
        slug: 'mortier'
      },
      {
        title: 'Peinture',
        slug: 'peinture',
        level3Items: [
          { title: 'Impression', slug: 'impression' },
          { title: 'Finition', slug: 'finition' }
        ]
      },
      {
        title: 'Ossature',
        slug: 'ossature',
        level3Items: [
          { title: 'Rails', slug: 'rails' },
          { title: 'Montants', slug: 'montants' },
          { title: 'Fourrures', slug: 'fourrures' },
          { title: 'Cornières', slug: 'cornieres' },
          { title: 'Entretoise', slug: 'entretoise' },
          { title: 'Porteur', slug: 'porteur' },
          { title: 'Profilés', slug: 'profiles' },
          { title: 'Coulisseau', slug: 'coulisseau' }
        ]
      },
      {
        title: 'Outil et accessoires du plaquiste',
        slug: 'outil-accessoires',
        level3Items: [
          { title: 'Vis', slug: 'vis' },
          { title: 'Suspentes', slug: 'suspentes' },
          { 
            title: 'Bandes', 
            slug: 'bandes',
            level3Items: [
              { title: 'Papier', slug: 'bande-papier' },
              { title: 'Armée', slug: 'bande-armee' },
              { title: 'Fermacell', slug: 'bande-fermacell' }
            ]
          } as Level3Container,
          { title: 'Chevilles', slug: 'chevilles' },
          { 
            title: 'Adhésif', 
            slug: 'adhesif',
            level3Items: [
              { title: 'Pare-vapeur', slug: 'adhesif-pare-vapeur' },
              { title: 'Aluminium', slug: 'adhesif-aluminium' },
              { title: 'Papier', slug: 'adhesif-papier' },
              { title: 'Double face', slug: 'adhesif-double-face' }
            ]
          } as Level3Container
        ]
      }
    ]
  },
  {
    title: 'Isolation',
    slug: 'isolation',
    icon: '🔥',
    subItems: [
      { 
        title: 'Isolation intérieure', 
        slug: 'isolation-interieure',
        level3Items: [
          { title: 'Bio sourcé', slug: 'bio-source' },
          { title: 'À projeter', slug: 'a-projeter' },
          { title: 'Rouleau', slug: 'rouleau' },
          { title: 'Panneau', slug: 'panneau' },
          { title: 'Minérale', slug: 'minerale' },
          { title: 'Polystyrène', slug: 'polystyrene' },
          { title: 'Pare-vapeur', slug: 'pare-vapeur' },
          { title: 'Calorifuge', slug: 'calorifuge' },
          { title: 'Manchon isolant', slug: 'manchon-isolant' },
          { title: 'Coquille', slug: 'coquille' },
          { title: 'Matelas isolant', slug: 'matelas-isolant' },
          { title: 'Accessoires', slug: 'accessoires-isolation-interieure' }
        ]
      },
      { 
        title: 'Isolation extérieure', 
        slug: 'isolation-exterieure',
        level3Items: [
          { title: 'Polystyrène', slug: 'polystyrene-ext' },
          { title: 'Panneaux', slug: 'panneaux-ext' },
          { title: 'Laine de roche', slug: 'laine-de-roche' },
          { title: 'Rouleaux', slug: 'rouleaux-ext' },
          { title: 'Laine de bois', slug: 'laine-de-bois' },
          { title: 'Enduit', slug: 'enduit-ext' },
          { title: 'En sac', slug: 'en-sac-ext' },
          { title: 'En seau', slug: 'en-seau-ext' },
          { title: 'Pare-pluie', slug: 'pare-pluie' },
          { title: 'Accessoires', slug: 'accessoires-isolation-exterieure' },
          { title: 'Fixations', slug: 'fixations' },
          { title: 'Colle', slug: 'colle-ext' },
          { title: 'Mousse PU', slug: 'mousse-pu' }
        ]
      }
    ]
  },
  {
    title: 'Chauffage',
    slug: 'chauffage',
    icon: '♨️',
    subItems: [
      { 
        title: 'Pompe à chaleur AIR/EAU', 
        slug: 'pompe-a-chaleur-air-eau',
        level3Items: [
          { 
            title: 'Bi-split', 
            slug: 'bi-split',
            level3Items: [
              { title: 'Monophasé', slug: 'monophase' },
              { title: 'Triphasé', slug: 'triphase' }
            ]
          } as Level3Container,
          { 
            title: 'Monobloc', 
            slug: 'monobloc',
            level3Items: [
              { title: 'Monophasé', slug: 'monophase-monobloc' },
              { title: 'Triphasé', slug: 'triphase-monobloc' }
            ]
          } as Level3Container
        ]
      },
      { 
        title: 'Chaudières', 
        slug: 'chaudieres',
        level3Items: [
          { title: 'Gaz', slug: 'gaz' },
          { title: 'Électrique', slug: 'electrique-chaudiere' }
        ]
      },
      { 
        title: 'Radiateurs', 
        slug: 'radiateurs',
        level3Items: [
          { title: 'Électrique', slug: 'electrique-radiateur' },
          { title: 'À eau', slug: 'a-eau' }
        ]
      },
      { 
        title: 'Plancher chauffant', 
        slug: 'plancher-chauffant' 
      },
      { 
        title: 'Poêles', 
        slug: 'poeles',
        level3Items: [
          { title: 'À granulés', slug: 'a-granules' },
          { title: 'À bois', slug: 'a-bois' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-chauffage',
        level3Items: [
          { title: 'Vase expansion', slug: 'vase-expansion' },
          { title: 'Module hydraulique', slug: 'module-hydraulique' },
          { title: 'Collecteurs', slug: 'collecteurs' },
          { title: 'Tube multicouches', slug: 'tube-multicouches' }
        ]
      }
    ]
  },
  {
    title: 'Climatisation',
    slug: 'climatisation',
    icon: '❄️',
    subItems: [
      { title: 'Pompe à chaleur AIR/AIR', slug: 'pompe-air-air' },
      { title: 'Climatiseur', slug: 'climatiseur' },
      { title: 'VRV VRF', slug: 'vrv-vrf' },
      { title: 'Ventilation', slug: 'ventilation' },
      { title: 'Accessoires', slug: 'accessoires-clim' }
    ]
  },
  {
    title: 'Sanitaire',
    slug: 'sanitaire',
    icon: '🚿',
    subItems: [
      { title: 'Chauffe-eaux et ballons', slug: 'chauffe-eaux' },
      { title: 'Mobilier', slug: 'mobilier' },
      { title: 'Robinetterie', slug: 'robinetterie' },
      { title: 'Sèche serviette', slug: 'seche-serviette' },
      { title: 'Espace douche', slug: 'espace-douche' }
    ]
  },
  {
    title: 'Plomberie',
    slug: 'plomberie',
    icon: '🔧',
    subItems: [
      { title: 'Tuyaux', slug: 'tuyaux' },
      { title: 'Raccords', slug: 'raccords' },
      { title: 'Flexibles', slug: 'flexibles' },
      { title: 'Vannes', slug: 'vannes' },
      { title: 'Accessoires', slug: 'accessoires-plomberie' }
    ]
  },
  {
    title: 'Électricité',
    slug: 'electricite',
    icon: '⚡',
    subItems: [
      { title: 'Thermostats', slug: 'thermostats' },
      { title: 'Câbles', slug: 'cables' },
      { title: 'Gaines', slug: 'gaines' },
      { title: 'Disjoncteurs', slug: 'disjoncteurs' },
      { title: 'Panneaux solaire', slug: 'panneaux-solaire' }
    ]
  },
  {
    title: 'Outillages',
    slug: 'outillages',
    icon: '🔨',
    subItems: [
      { title: 'Électroportatif', slug: 'electroportatif' },
      { title: 'À main', slug: 'a-main' },
      { title: 'Accessoires', slug: 'accessoires-outillage' }
    ]
  },
  {
    title: 'EPI',
    slug: 'epi',
    icon: '⛑️',
    subItems: [
      { title: 'Casques', slug: 'casques' },
      { title: 'Chaussures de sécurité', slug: 'chaussures-securite' },
      { title: 'Bottes', slug: 'bottes' },
      { title: 'Gants', slug: 'gants' },
      { title: 'Lunettes de protection', slug: 'lunettes-protection' },
      { title: 'Bouchons anti-bruits', slug: 'bouchons-anti-bruit' },
      { title: 'Masque de chantier', slug: 'masque-chantier' },
      { title: 'Vêtements', slug: 'vetements' }
    ]
  }
];

interface VerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);
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

  const handleCategoryClick = (slug: string) => {
    // Sur mobile, on bascule l'état de la catégorie sélectionnée
    if (isMobileView) {
      if (selectedCategory === slug) {
        setSelectedCategory(null);
        setSelectedSubCategory(null);
      } else {
        setSelectedCategory(slug);
        setSelectedSubCategory(null);
      }
    } else {
      // Sur desktop, on définit simplement la catégorie sélectionnée
      setSelectedCategory(slug);
      setSelectedSubCategory(null);
    }
  };

  const handleSubCategoryClick = (slug: string) => {
    if (isMobileView) {
      if (selectedSubCategory === slug) {
        setSelectedSubCategory(null);
      } else {
        setSelectedSubCategory(slug);
      }
    }
  };

  const handleMouseEnter = (slug: string) => {
    if (!isMobileView) {
      setHoveredCategory(slug);
      setSelectedCategory(slug);
    }
  };

  const handleSubCategoryMouseEnter = (slug: string) => {
    if (!isMobileView) {
      setHoveredSubCategory(slug);
      setSelectedSubCategory(slug);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileView) {
      setHoveredCategory(null);
      setHoveredSubCategory(null);
    }
  };

  const handleSubCategoryMouseLeave = () => {
    if (!isMobileView) {
      setHoveredSubCategory(null);
    }
  };

  const currentCategory = hoveredCategory || selectedCategory;
  const currentSubCategory = hoveredSubCategory || selectedSubCategory;
  const currentCategoryData = menuItems.find(item => item.slug === currentCategory);
  const currentSubCategoryData = currentCategoryData?.subItems.find(
    item => item.slug === currentSubCategory
  );

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
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animations pour les sous-sous-menus
  const subSubmenuVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      {/* Fond semi-transparent pour fermer en cliquant en dehors */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Menu principal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="fixed top-0 pt-[var(--navbar-height,80px)] left-0 w-full h-full sm:h-auto sm:w-auto z-50 bg-transparent flex outline-none"
            key="vertical-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="flex flex-col sm:flex-row max-w-7xl mx-auto w-full h-full sm:h-auto sm:max-h-[80vh] relative rounded-xl overflow-hidden shadow-xl">
              {/* Menu des catégories - Colonne 1 */}
              <div className="bg-white border-r w-full sm:w-64 h-full overflow-y-auto">
                <div className="p-4 border-b font-medium text-gray-900">
                  Nos Catégories
                </div>
                <div className="py-2">
                  {menuItems.map((item) => (
                    <div key={item.slug} className="flex flex-col">
                      <button
                        className={`flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                          currentCategory === item.slug ? 'bg-gray-100 font-medium text-[#007FFF]' : 'text-gray-700'
                        }`}
                        onClick={() => handleCategoryClick(item.slug)}
                        onMouseEnter={() => handleMouseEnter(item.slug)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                        <FaChevronRight className={`transition-transform ${
                          currentCategory === item.slug ? 'transform rotate-90 text-[#007FFF]' : ''
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sous-catégories - Colonne 2 */}
              <AnimatePresence>
                {currentCategoryData && (
                  <motion.div
                    key={`subcategory-${currentCategoryData.slug}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={submenuVariants}
                    className="bg-gray-50 w-full sm:w-64 h-full overflow-y-auto"
                  >
                    <div className="p-4 border-b font-medium text-gray-900">
                      {currentCategoryData.title}
                    </div>
                    <div className="py-2">
                      {currentCategoryData.subItems.map((subItem) => (
                        <div key={subItem.slug} className="flex flex-col">
                          <button
                            className={`flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                              currentSubCategory === subItem.slug ? 'bg-gray-100 font-medium text-[#007FFF]' : 'text-gray-700'
                            }`}
                            onClick={() => handleSubCategoryClick(subItem.slug)}
                            onMouseEnter={() => handleSubCategoryMouseEnter(subItem.slug)}
                            onMouseLeave={handleSubCategoryMouseLeave}
                          >
                            <span>{subItem.title}</span>
                            {subItem.level3Items && (
                              <FaChevronRight className={`transition-transform ${
                                currentSubCategory === subItem.slug ? 'transform rotate-90 text-[#007FFF]' : ''
                              }`} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sous-sous-catégories - Colonne 3 */}
              <AnimatePresence>
                {currentSubCategoryData?.level3Items && (
                  <motion.div
                    key={`level3-${currentSubCategoryData.slug}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={subSubmenuVariants}
                    className="bg-white w-full sm:w-64 h-full overflow-y-auto"
                  >
                    <div className="p-4 border-b font-medium text-gray-900">
                      {currentSubCategoryData.title}
                    </div>
                    <div className="py-2">
                      {currentSubCategoryData.level3Items.map((level3Item) => {
                        // Vérifier si l'élément est un conteneur de niveau 3 avec sous-éléments
                        const hasSubItems = 'level3Items' in level3Item && 
                                           (level3Item as Level3Container).level3Items &&
                                           (level3Item as Level3Container).level3Items.length > 0;
                        
                        if (hasSubItems) {
                          const container = level3Item as Level3Container;
                          return (
                            <div key={level3Item.slug} className="flex flex-col">
                              <Link
                                to={`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}`}
                                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#007FFF] transition-colors"
                                onClick={onClose}
                              >
                                <span>{level3Item.title}</span>
                              </Link>
                              <div className="pl-4">
                                {container.level3Items.map((subItem) => (
                                  <Link
                                    key={subItem.slug}
                                    to={`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}/${subItem.slug}`}
                                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#007FFF] transition-colors"
                                    onClick={onClose}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <Link
                              key={level3Item.slug}
                              to={`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}`}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#007FFF] transition-colors"
                              onClick={onClose}
                            >
                              <span>{level3Item.title}</span>
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerticalMenu; 