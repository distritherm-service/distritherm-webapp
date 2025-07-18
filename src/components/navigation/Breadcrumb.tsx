import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Fonction pour générer les éléments du fil d'Ariane
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter((path: string) => path);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Ajouter l'accueil
    breadcrumbs.push({ label: 'Accueil', href: '/' });
    
    // Construire les chemins pour chaque niveau
    let currentPath = '';
    paths.forEach((path: string) => {
      currentPath += `/${path}`;
      // Formater le label pour l'affichage
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, href: currentPath });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="relative bg-white/40 backdrop-blur-sm rounded-xl"
    >
      {/* Voile de soutien pour une meilleure lisibilité */}
      <div className="absolute inset-0 bg-white/30 rounded-xl pointer-events-none"></div>
      <div className="container relative mx-auto px-4">
        <ol className="flex items-center py-2 overflow-x-auto scrollbar-hide gap-1" role="list">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center min-w-0" role="listitem">
              {index > 0 && (
                <FaChevronRight className="w-2.5 h-2.5 mx-2 text-gray-300 opacity-70 flex-shrink-0" aria-hidden="true" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className={`font-semibold whitespace-nowrap bg-[#007FFF]/10 px-3 py-1.5 rounded-full inline-flex items-center text-sm shadow-sm cursor-default select-none ${index === 0 ? 'text-black' : 'text-[#007FFF]'}`}
                  aria-current="page"
                >
                  {index === 0 ? <FaHome className="w-4 h-4 mr-1.5 opacity-70 text-black" aria-hidden="true" /> : null}
                  {item.label}
                </span>
              ) : (
                                 <Link
                   to={item.href}
                  className={`hover:text-[#007FFF] transition-colors duration-200 whitespace-nowrap inline-flex items-center text-sm px-2 py-1 rounded-full hover:bg-[#007FFF]/10 focus:outline-none focus:ring-2 focus:ring-[#007FFF]/30 focus:bg-[#007FFF]/10 group ${index === 0 ? 'text-black' : 'text-gray-500'}`}
                  tabIndex={0}
                >
                  {index === 0 ? <FaHome className="w-4 h-4 mr-1.5 opacity-70 text-black group-hover:opacity-100 transition-opacity" aria-hidden="true" /> : null}
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
      
    </nav>
  );
};

export default Breadcrumb; 