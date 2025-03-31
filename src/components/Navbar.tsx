import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/logo-Transparent.png';
import VerticalMenu from './VerticalMenu';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('Choisir votre magasin');
  const [scrolled, setScrolled] = useState(false);
  const storeMenuRef = useRef<HTMLDivElement>(null);
  const navbarHeight = useRef<number>(0);
  const { favorites } = useFavorites();

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
    setIsStoreMenuOpen(false);
  };

  // Détecter le défilement pour appliquer des effets visuels
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fermer le menu au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (storeMenuRef.current && !storeMenuRef.current.contains(event.target as Node)) {
        setIsStoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mettre à jour la hauteur de la navbar pour l'espacement
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById('main-navbar');
      if (navbar) {
        const height = navbar.offsetHeight;
        navbarHeight.current = height;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
    };
  }, [scrolled]);

  return (
    <div id="main-navbar" className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full">
      <style>{`
        .navbar-spacer {
          height: var(--navbar-height, 0px);
        }
      `}</style>

      {/* Barre supérieure avec informations de contact */}
      <div className={`bg-gray-900 text-white py-2 hidden md:block transition-all duration-300 ${scrolled ? 'py-1 opacity-90' : 'py-2'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+33123456789" className="flex items-center hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01 23 45 67 89
              </a>
              <a href="mailto:contact@distritherm.fr" className="flex items-center hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@distritherm.fr
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/connexion" className="hover:text-blue-400 transition-colors">Mon compte</Link>
              <span className="text-gray-500">|</span>
              <Link to="/aide" className="hover:text-blue-400 transition-colors">Aide</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barre principale avec logo, recherche et boutons */}
      <div className={`bg-white border-b transition-all duration-300 ${
        scrolled ? 'shadow-xl' : 'shadow-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-20' : 'h-24'
          }`}>
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="block py-4">
                <img 
                  src={logo} 
                  alt="DistriTherm Services" 
                  className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-14'} w-auto`} 
                />
              </Link>
            </div>

            {/* Barre de recherche */}
            <div className="flex-1 max-w-3xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className={`w-full px-6 pr-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    scrolled ? 'py-2.5' : 'py-3'
                  }`}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Boutons de droite */}
            <div className="flex items-center space-x-6">
              {/* Menu déroulant des magasins */}
              <div className="relative" ref={storeMenuRef}>
                <button
                  onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                  className="hidden md:flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                >
                  <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="ml-3 font-medium">{selectedStore}</span>
                  <svg className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${isStoreMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Menu déroulant */}
                {isStoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <button
                      onClick={() => handleStoreSelect('Tous les magasins')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Tous les magasins</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStoreSelect('Magasin Taverny')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Magasin Taverny</span>
                        <span className="text-sm text-gray-500">95150 Taverny</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStoreSelect('Magasin Drancy')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Magasin Drancy</span>
                        <span className="text-sm text-gray-500">93700 Drancy</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/favoris"
                className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                <FaHeart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                to="/panier"
                className="p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200"
              >
                <FaShoppingCart className="w-6 h-6" />
              </Link>
              {/* Menu mobile */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de navigation secondaire */}
      <div className={`bg-white border-b hidden md:block transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-12' : 'h-14'
          }`}>
            {/* Bouton Tous nos produits */}
            <button
              className="flex items-center px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Tous nos produits</span>
            </button>

            {/* Menu principal */}
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">Accueil</Link>
              <Link to="/nos-produits" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">Nos Produits</Link>
              <Link to="/promotions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">Promotions</Link>
              <Link to="/espace-recrutement" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">Espace Recrutement</Link>
              <Link to="/nous-contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-4 border-b-2 border-transparent hover:border-blue-600">Nous Contact</Link>
            </nav>

            {/* Bouton Connexion */}
            <Link
              to="/connexion"
              className={`px-6 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 ${
                scrolled ? 'py-1.5' : 'py-2'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connexion</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Menu vertical */}
      <VerticalMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Navbar;
