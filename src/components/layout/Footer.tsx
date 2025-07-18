import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '/logo-Transparent.png';
import androidImg from '/footer-android.jpeg';
import iosImg from '/footer-ios.jpeg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[url('/footer.png')] bg-cover bg-center bg-no-repeat py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et réseaux sociaux */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logoImg} alt="Distritherm Services" className="h-32 mb-20" />
            <h3 className="text-lg font-semibold mb-4 text-black">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
            
              <a href="https://www.linkedin.com/company/distritherm-services/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nous Contacter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nous Contacter</h3>
            <div className="space-y-2">
              <h4 className="font-medium text-white">Siège social & Magasin Taverny</h4>
              <p className="text-gray-200">16 Rue du condrocel 95000 Taverny</p>
              
              <h4 className="font-medium mt-4 text-white">Magasin Drancy</h4>
              <p className="text-gray-200">151 rue Diderot 93700 Drancy</p>
            </div>
          </div>

          {/* Nos produits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nos produits</h3>
            <ul className="space-y-2">
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">Notre catalogue produits</Link></li>
              <li><Link to="nos-produits" className="text-gray-200 hover:text-blue-400">Platerie</Link></li>
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">Plomberie</Link></li>
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">Chauffage</Link></li>
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">climatisation</Link></li>
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">Isolation</Link></li>
              <li><Link to="/nos-produits" className="text-gray-200 hover:text-blue-400">Electricité</Link></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Informations</h3>
            <ul className="space-y-2">
              <li><a href="https://distritcherm-site-vitrine.vercel.app/qui-sommes-nous" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-400">À propos de Distritherm Services</a></li>
              <li><a href="https://distritcherm-site-vitrine.vercel.app/recrutement" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-blue-400">Nous rejoindre</a></li>

              <li><Link to="/connexion" className="text-gray-200 hover:text-blue-400">Connexion</Link></li>
              <li><Link to="/conditions-utilisation" className="text-gray-200 hover:text-blue-400">Conditions générales de vente</Link></li>
              <li><Link to="/conditions-utilisation" className="text-gray-200 hover:text-blue-400">Conditions générales d'utilisation du site</Link></li>

              <li><Link to="/nous-contact" className="text-gray-200 hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Section téléchargement application */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4 text-white">Télécharger notre application</h3>
          <div className="flex justify-center space-x-4">
            <a href="#" className="inline-block">
              <img src={androidImg} alt="Google Play" className="h-10" />
            </a>
            <a href="#" className="inline-block">
              <img src={iosImg} alt="App Store" className="h-10" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8  text-center text-sm text-gray-200">
          <p>© 2025 Distritherm Services</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 