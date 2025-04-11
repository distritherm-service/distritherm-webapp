import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronDown, FaTimes, FaChevronLeft } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

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
        slug: 'colle',
        level3Items: [
          { title: 'Colle à joint', slug: 'colle-joint' },
          { title: 'Colle à carreaux', slug: 'colle-carreaux' }
        ]
      },
      {
        title: 'Enduit',
        slug: 'enduit',
        level3Items: [
          { title: 'Fin', slug: 'fin' },
          { title: 'Gros', slug: 'gros' },
          { title: 'Rapide', slug: 'rapide' },
          { title: 'Universel', slug: 'universel' },
          { title: '2en1', slug: '2en1' }
        ]
      },
      {
        title: 'Mortier',
        slug: 'mortier',
        level3Items: [
          { title: 'Prêt à l\'emploi', slug: 'pret-emploi' },
          { title: 'À projeter', slug: 'a-projeter' }
        ]
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
          { title: 'Bandes', slug: 'bandes' },
          { title: 'Chevilles', slug: 'chevilles' },
          { title: 'Adhésif', slug: 'adhesif' }
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
          { title: 'Monophasé', slug: 'monophase' },
          { title: 'Triphasé', slug: 'triphase' }
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
      { 
        title: 'Pompe à chaleur AIR/AIR', 
        slug: 'pompe-a-chaleur-air-air',
        level3Items: [
          { title: 'Monobloc', slug: 'monobloc-air-air' },
          { title: 'Monosplit', slug: 'monosplit' },
          { title: 'Multisplit', slug: 'multisplit' }
        ]
      },
      { 
        title: 'Climatiseur', 
        slug: 'climatiseur',
        level3Items: [
          { title: 'Gainable', slug: 'gainable' },
          { title: 'Zoning', slug: 'zoning' },
          { title: 'Mobile', slug: 'mobile' }
        ]
      },
      { 
        title: 'VRV VRF', 
        slug: 'vrv-vrf' 
      },
      { 
        title: 'Ventilation', 
        slug: 'ventilation',
        level3Items: [
          { title: 'Système VMC', slug: 'systeme-vmc' },
          { title: 'Aérateur', slug: 'aerateur' },
          { title: 'Extracteur', slug: 'extracteur' },
          { title: 'Grilles', slug: 'grilles' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-clim',
        level3Items: [
          { title: 'Cuivre frigorifique', slug: 'cuivre-frigorifique' },
          { title: 'Supports et chaises', slug: 'supports-chaises' },
          { title: 'Rubber foot', slug: 'rubber-foot' },
          { title: 'Tube à condensats', slug: 'tube-condensats' },
          { title: 'Pompes à condensats', slug: 'pompes-condensats' },
          { title: 'Goulotte', slug: 'goulotte' }
        ]
      }
    ]
  },
  {
    title: 'Sanitaire',
    slug: 'sanitaire',
    icon: '🚿',
    subItems: [
      { 
        title: 'Chauffe-eaux et ballons', 
        slug: 'chauffe-eaux-ballons',
        level3Items: [
          { title: 'Ballon thermodynamique', slug: 'ballon-thermodynamique' },
          { title: 'Ballon électrique', slug: 'ballon-electrique' },
          { title: 'Ballon ECS', slug: 'ballon-ecs' },
          { title: 'Chauffe-eau thermodynamique', slug: 'chauffe-eau-thermodynamique' },
          { title: 'Chauffe-eau électrique', slug: 'chauffe-eau-electrique' },
          { title: 'Chauffe-eau solaire', slug: 'chauffe-eau-solaire' },
          { title: 'Système solaire combiné', slug: 'systeme-solaire-combine' }
        ]
      },
      { 
        title: 'Mobilier', 
        slug: 'mobilier',
        level3Items: [
          { title: 'Meuble casque', slug: 'meuble-casque' },
          { title: 'Lave-mains', slug: 'lave-mains' }
        ]
      },
      { 
        title: 'Robinetterie', 
        slug: 'robinetterie',
        level3Items: [
          { title: 'Colonne de douche', slug: 'colonne-douche' },
          { title: 'Robinet', slug: 'robinet' },
          { title: 'Mitigeur', slug: 'mitigeur' }
        ]
      },
      { 
        title: 'Sèche serviette', 
        slug: 'seche-serviette',
        level3Items: [
          { title: 'Électrique', slug: 'electrique-seche-serviette' },
          { title: 'À eau', slug: 'a-eau-seche-serviette' }
        ]
      },
      { 
        title: 'Espace douche', 
        slug: 'espace-douche',
        level3Items: [
          { title: 'Receveurs', slug: 'receveurs' },
          { title: 'Parois', slug: 'parois' }
        ]
      },
      { 
        title: 'Espace WC', 
        slug: 'espace-wc',
        level3Items: [
          { title: 'Bati-support', slug: 'bati-support' },
          { title: 'Pack WC', slug: 'pack-wc' }
        ]
      },
      { 
        title: 'Traitement de l\'eau', 
        slug: 'traitement-eau' 
      }
    ]
  },
  {
    title: 'Plomberie',
    slug: 'plomberie',
    icon: '🔧',
    subItems: [
      { 
        title: 'Alimentation', 
        slug: 'alimentation',
        level3Items: [
          { title: 'Cuivre à sertir', slug: 'cuivre-a-sertir' },
          { title: 'Multicouche', slug: 'multicouche' },
          { title: 'PER', slug: 'per' },
          { title: 'Laiton', slug: 'laiton' }
        ]
      },
      { 
        title: 'Fixations', 
        slug: 'fixations',
        level3Items: [
          { title: 'Tubes', slug: 'tubes' },
          { title: 'Flexibles', slug: 'flexibles' },
          { title: 'Vannes', slug: 'vannes' },
          { title: 'Raccords', slug: 'raccords' }
        ]
      },
      { 
        title: 'Évacuation', 
        slug: 'evacuation',
        level3Items: [
          { title: 'Tuyaux PVC', slug: 'tuyaux-pvc' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-plomberie',
        level3Items: [
          { title: 'Pince à sertir', slug: 'pince-a-sertir' },
          { title: 'Cintreuse', slug: 'cintreuse' },
          { title: 'Ébavurer', slug: 'ebavurer' },
          { title: 'Coupe-tube', slug: 'coupe-tube' }
        ]
      },
      { 
        title: 'Raccords', 
        slug: 'raccords',
        level3Items: [
          { title: 'Té', slug: 'te' },
          { title: 'Bouchons', slug: 'bouchons' },
          { title: 'Manchons', slug: 'manchons' },
          { title: 'Réductions', slug: 'reductions' },
          { title: 'Coudes', slug: 'coudes' }
        ]
      }
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
      { 
        title: 'Panneaux solaires', 
        slug: 'panneaux-solaires',
        level3Items: [
          { title: '3 kW', slug: '3kw' },
          { title: '6 kW', slug: '6kw' },
          { title: '9 kW', slug: '9kw' }
        ]
      }
    ]
  },
  {
    title: 'Outillage',
    slug: 'outillage',
    icon: '🔨',
    subItems: [
      { 
        title: 'Électroportatif', 
        slug: 'electroportatif',
        level3Items: [
          { title: 'Marteau-piqueur', slug: 'marteau-piqueur' },
          { title: 'Visseuse', slug: 'visseuse' },
          { title: 'Perceuse', slug: 'perceuse' },
          { title: 'Perforateur', slug: 'perforateur' },
          { title: 'Cloueur', slug: 'cloueur' },
          { title: 'Scie circulaire', slug: 'scie-circulaire' }
        ]
      },
      { 
        title: 'À main', 
        slug: 'a-main',
        level3Items: [
          { title: 'Scies', slug: 'scies' },
          { title: 'Niveaux', slug: 'niveaux' },
          { title: 'Pinceaux', slug: 'pinceaux' },
          { title: 'Balai', slug: 'balai' },
          { title: 'Mélangeurs', slug: 'melangeurs' }
        ]
      },
      { 
        title: 'Accessoires', 
        slug: 'accessoires-outillage',
        level3Items: [
          { title: 'Forêt', slug: 'foret' },
          { title: 'Trépan', slug: 'trepan' },
          { title: 'Disques', slug: 'disques' },
          { title: 'Lame', slug: 'lame' },
          { title: 'Batterie', slug: 'batterie' },
          { title: 'Lampe', slug: 'lampe' },
          { title: 'Niveau laser', slug: 'niveau-laser' },
          { title: 'Aspirateur', slug: 'aspirateur' }
        ]
      }
    ]
  },
  {
    title: 'EPI',
    slug: 'epi',
    icon: '⛑️',
    subItems: [
      { title: 'Casques et protections auditives', slug: 'casques-protections-auditives' },
      { title: 'Lunettes et masques de protection', slug: 'lunettes-masques' },
      { title: 'Gants', slug: 'gants' },
      { 
        title: 'Chaussures et vêtements', 
        slug: 'chaussures-vetements',
        level3Items: [
          { title: 'T-shirts', slug: 't-shirts' },
          { title: 'Sweat', slug: 'sweat' },
          { title: 'Pantalons', slug: 'pantalons' },
          { title: 'Doudounes', slug: 'doudounes' },
          { title: 'Combinaisons jetables', slug: 'combinaisons-jetables' }
        ]
      }
    ]
  }
];

interface VerticalMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({ isOpen, onClose }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [menuHistory, setMenuHistory] = useState<string[]>([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setActiveSubMenu(null);
    setMenuHistory([menuId]);
  };

  const handleSubMenuClick = (subMenuId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveSubMenu(subMenuId);
    setMenuHistory([...menuHistory, subMenuId]);
  };

  const handleBackClick = () => {
    const newHistory = [...menuHistory];
    newHistory.pop();
    setMenuHistory(newHistory);
    if (newHistory.length === 1) {
      setActiveSubMenu(null);
      setActiveMenu(newHistory[0]);
    } else if (newHistory.length === 0) {
      setActiveMenu(null);
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(newHistory[newHistory.length - 1]);
    }
  };

  const getCurrentTitle = () => {
    if (activeSubMenu) {
      const mainMenu = menuItems.find(item => item.slug === activeMenu);
      const subMenu = mainMenu?.subItems.find(sub => sub.slug === activeSubMenu);
      return subMenu?.title || mainMenu?.title || 'Menu';
    }
    return activeMenu ? menuItems.find(item => item.slug === activeMenu)?.title || 'Menu' : 'Catégories';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Menu principal */}
          <motion.div
            initial={isMobile ? { x: "-100%" } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: "-100%" } : { opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-[100dvh] bg-white z-50 overflow-hidden
              ${isMobile ? 'w-full' : 'w-80'} flex flex-col shadow-xl`}
          >
            {/* En-tête du menu */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {getCurrentTitle()}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Zone de défilement du menu */}
            <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeMenu}-${activeSubMenu}`}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="h-full"
                >
                  {activeSubMenu ? (
                    // Niveau 3
                    <div className="h-full">
                      <button
                        onClick={handleBackClick}
                        className="w-full flex items-center p-4 text-gray-600 hover:bg-gray-50 transition-colors sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100"
                      >
                        <FaChevronLeft className="w-4 h-4 mr-2" />
                        <span>Retour</span>
                      </button>
                      <div className="divide-y divide-gray-100">
                        {menuItems
                          .find(item => item.slug === activeMenu)
                          ?.subItems.find(sub => sub.slug === activeSubMenu)
                          ?.level3Items?.map((level3Item) => (
                            <Link
                              key={level3Item.slug}
                              to={`/nos-produits/${activeMenu}/${activeSubMenu}/${level3Item.slug}`}
                              onClick={onClose}
                              className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100"
                            >
                              {level3Item.title}
                            </Link>
                          ))}
                      </div>
                    </div>
                  ) : activeMenu ? (
                    // Niveau 2
                    <div className="h-full">
                      <button
                        onClick={handleBackClick}
                        className="w-full flex items-center p-4 text-gray-600 hover:bg-gray-50 transition-colors sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100"
                      >
                        <FaChevronLeft className="w-4 h-4 mr-2" />
                        <span>Retour</span>
                      </button>
                      <div className="divide-y divide-gray-100">
                        {menuItems
                          .find(item => item.slug === activeMenu)
                          ?.subItems.map((subItem) => (
                            subItem.level3Items ? (
                              <button
                                key={subItem.slug}
                                onClick={(e) => handleSubMenuClick(subItem.slug, e)}
                                className="w-full flex items-center justify-between p-4 text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100"
                              >
                                <span>{subItem.title}</span>
                                <FaChevronRight className="w-4 h-4 text-gray-400" />
                              </button>
                            ) : (
                              <Link
                                key={subItem.slug}
                                to={`/nos-produits/${activeMenu}/${subItem.slug}`}
                                onClick={onClose}
                                className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100"
                              >
                                {subItem.title}
                              </Link>
                            )
                          ))}
                      </div>
                    </div>
                  ) : (
                    // Menu principal (Niveau 1)
                    <div className="divide-y divide-gray-100">
                      {menuItems.map((item) => (
                        <button
                          key={item.slug}
                          onClick={() => handleMenuClick(item.slug)}
                          className="w-full flex items-center justify-between p-4 text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100"
                        >
                          <span className="flex items-center">
                            {item.icon && <span className="mr-3 text-gray-500">{item.icon}</span>}
                            <span className="font-medium">{item.title}</span>
                          </span>
                          <FaChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VerticalMenu; 