import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronDown, FaTimes } from 'react-icons/fa';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
            className={`fixed top-0 pt-[var(--navbar-height,80px)] left-0 w-full h-[calc(100vh-var(--navbar-height,80px))] sm:h-auto sm:w-auto z-50 bg-transparent flex outline-none ${
              isMobileView ? 'overflow-y-auto' : ''
            }`}
            key="vertical-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className={`flex ${isMobileView ? 'flex-col' : 'flex-row'} max-w-7xl mx-auto w-full h-full sm:h-auto sm:max-h-[80vh] relative rounded-xl overflow-hidden shadow-xl`}>
              {/* Menu des catégories - Colonne 1 */}
              <div className={`bg-white border-r ${isMobileView ? 'w-full' : 'w-64'} ${
                isMobileView && currentCategory ? 'hidden' : 'block'
              } h-full overflow-y-auto`}>
                <div className="p-4 border-b font-medium text-gray-900 flex justify-between items-center">
                  <span>Nos Catégories</span>
                  {isMobileView && (
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Fermer le menu"
                    >
                      <FaTimes size={20} />
                    </button>
                  )}
                </div>
                <div className="py-2">
                  {menuItems.map((item) => (
                    <div key={item.slug} className="flex flex-col">
                      <button
                        className={`flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors w-full ${
                          currentCategory === item.slug ? 'bg-gray-100 font-medium text-[#007FFF]' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          handleCategoryClick(item.slug);
                          if (isMobileView && !item.subItems?.length) {
                            onClose();
                            navigate(`/nos-produits/${item.slug}`);
                          }
                        }}
                        onMouseEnter={() => !isMobileView && handleMouseEnter(item.slug)}
                        onMouseLeave={() => !isMobileView && handleMouseLeave()}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.title}</span>
                        </div>
                        {item.subItems?.length > 0 && (
                          <FaChevronRight className={`transition-transform ${
                            currentCategory === item.slug ? 'transform rotate-90 text-[#007FFF]' : ''
                          }`} />
                        )}
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
                    className={`bg-gray-50 ${isMobileView ? 'w-full' : 'w-64'} ${
                      isMobileView && !currentCategory ? 'hidden' : 'block'
                    } h-full overflow-y-auto`}
                  >
                    <div className="p-4 border-b font-medium text-gray-900 flex justify-between items-center">
                      {isMobileView && (
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="text-gray-500 hover:text-gray-700 mr-2"
                          aria-label="Retour"
                        >
                          <FaChevronRight className="transform rotate-180" />
                        </button>
                      )}
                      <span>{currentCategoryData.title}</span>
                      {isMobileView && (
                        <button
                          onClick={onClose}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Fermer le menu"
                        >
                          <FaTimes size={20} />
                        </button>
                      )}
                    </div>
                    <div className="py-2">
                      {currentCategoryData.subItems.map((subItem) => (
                        <div key={subItem.slug} className="flex flex-col">
                          <button
                            className={`flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors w-full ${
                              currentSubCategory === subItem.slug ? 'bg-gray-100 font-medium text-[#007FFF]' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              handleSubCategoryClick(subItem.slug);
                              if (isMobileView && !subItem.level3Items?.length) {
                                onClose();
                                navigate(`/nos-produits/${currentCategoryData.slug}/${subItem.slug}`);
                              }
                            }}
                            onMouseEnter={() => !isMobileView && handleSubCategoryMouseEnter(subItem.slug)}
                            onMouseLeave={() => !isMobileView && handleSubCategoryMouseLeave()}
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
                    className={`bg-white ${isMobileView ? 'w-full' : 'w-64'} ${
                      isMobileView && !currentSubCategory ? 'hidden' : 'block'
                    } h-full overflow-y-auto`}
                  >
                    <div className="p-4 border-b font-medium text-gray-900 flex justify-between items-center">
                      {isMobileView && (
                        <button
                          onClick={() => setSelectedSubCategory(null)}
                          className="text-gray-500 hover:text-gray-700 mr-2"
                          aria-label="Retour"
                        >
                          <FaChevronRight className="transform rotate-180" />
                        </button>
                      )}
                      <span>{currentSubCategoryData.title}</span>
                      {isMobileView && (
                        <button
                          onClick={onClose}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Fermer le menu"
                        >
                          <FaTimes size={20} />
                        </button>
                      )}
                    </div>
                    <div className="py-2">
                      {currentSubCategoryData.level3Items.map((level3Item) => {
                        const hasSubItems = 'level3Items' in level3Item && 
                                         (level3Item as Level3Container).level3Items &&
                                         (level3Item as Level3Container).level3Items.length > 0;
                        
                        if (hasSubItems) {
                          const container = level3Item as Level3Container;
                          return (
                            <div key={level3Item.slug} className="flex flex-col">
                              <button
                                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#007FFF] transition-colors w-full"
                                onClick={() => {
                                  onClose();
                                  navigate(`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}`);
                                }}
                              >
                                <span>{level3Item.title}</span>
                              </button>
                              <div className="pl-4">
                                {container.level3Items.map((subItem) => (
                                  <button
                                    key={subItem.slug}
                                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#007FFF] transition-colors w-full"
                                    onClick={() => {
                                      onClose();
                                      navigate(`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}/${subItem.slug}`);
                                    }}
                                  >
                                    <span>{subItem.title}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <button
                            key={level3Item.slug}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#007FFF] transition-colors w-full"
                            onClick={() => {
                              onClose();
                              navigate(`/nos-produits/${currentCategoryData?.slug}/${currentSubCategoryData.slug}/${level3Item.slug}`);
                            }}
                          >
                            <span>{level3Item.title}</span>
                          </button>
                        );
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