import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  subItems: string[];
  slug: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Platerie',
    slug: 'platerie',
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
    subItems: [
      'Isolation inerieure',
      'Isolation exterieure'
    ]
  },
  {
    title: 'Chauffage',
    slug: 'chauffage',
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
    subItems: [
      'Electroportatif',
      'À main',
      'Accesoires'
    ]
  },
  {
    title: 'EPI',
    slug: 'epi',
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

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const handleCategoryClick = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(slug);
      setHoveredCategory(null);
    }
  };

  const handleMouseEnter = (slug: string) => {
    if (!isMobileView) {
      setHoveredCategory(slug);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobileView) {
      setHoveredCategory(null);
    }
  };

  const currentCategory = hoveredCategory || selectedCategory;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      <div 
        className="absolute left-0 top-0 h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu principal */}
        <div className="w-[300px] h-full bg-white shadow-lg">
          <div className="sticky top-0 py-4 px-6 bg-white border-b border-gray-200 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Nos Catégories</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.slug}
                className={`w-full flex items-center justify-between px-6 py-4 text-left group transition-all duration-200 ease-in-out hover:bg-gray-50 ${
                  currentCategory === item.slug 
                    ? 'bg-blue-50 border-l-4 border-blue-600 pl-5' 
                    : 'border-l-4 border-transparent'
                }`}
                onClick={() => handleCategoryClick(item.slug)}
                onMouseEnter={() => handleMouseEnter(item.slug)}
              >
                <span className={`text-base font-medium ${
                  currentCategory === item.slug 
                    ? 'text-blue-600' 
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {item.title}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    currentCategory === item.slug 
                      ? 'rotate-90 text-blue-600' 
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Sous-menu avec animation */}
        <div 
          className={`w-[600px] h-full bg-gray-50 shadow-lg transition-all duration-300 ease-in-out transform ${
            currentCategory 
              ? 'translate-x-0 opacity-100' 
              : '-translate-x-full opacity-0 pointer-events-none'
          }`}
          onMouseLeave={handleMouseLeave}
        >
          {currentCategory && (
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {menuItems
                  .find((item) => item.slug === currentCategory)
                  ?.subItems.map((subItem, index) => (
                    <Link
                      key={index}
                      to={`/categorie/${currentCategory}/${subItem.toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-blue-600 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <span className="flex-1">{subItem}</span>
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalMenu; 