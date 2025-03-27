import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  path: string;
  label: string;
}

const routeLabels: { [key: string]: string } = {
  '/': 'Accueil',
  '/nos-produits': 'Nos Produits',
  '/promotions': 'Promotions',
  '/espace-recrutement': 'Espace Recrutement',
  '/nous-contact': 'Contactez-nous',
  '/conditions-vente': 'Conditions de Vente',
  '/conditions-utilisation': 'Conditions d\'Utilisation',
  '/sav': 'SAV',
  '/a-propos': 'À Propos',
  '/choisir-magasin': 'Choisir votre magasin',
  '/panier': 'Panier',
  '/connexion': 'Connexion'
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { path: '/', label: 'Accueil' },
    ...pathnames.map((value, index) => {
      const path = '/' + pathnames.slice(0, index + 1).join('/');
      return {
        path,
        label: routeLabels[path] || value
      };
    })
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-2 py-4">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index === 0 ? (
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-teal-600 transition-colors duration-200 group"
                >
                  <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Link>
              ) : (
                <>
                  <FaChevronRight className="w-3 h-3 text-gray-400" />
                  <Link
                    to={item.path}
                    className={`
                      text-sm font-medium transition-all duration-200
                      ${index === breadcrumbItems.length - 1
                        ? 'text-teal-600 cursor-default pointer-events-none'
                        : 'text-gray-600 hover:text-teal-600'
                      }
                      hover:scale-105 transform
                    `}
                  >
                    {item.label}
                  </Link>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb; 