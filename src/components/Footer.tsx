import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '/logo-Transparent.png';
import androidImg from '/footer-android.jpeg';
import iosImg from '/footer-ios.jpeg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et réseaux sociaux */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logoImg} alt="Distritherm Services" className="h-32 mb-20" />
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nous Contacter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nous Contacter</h3>
            <div className="space-y-2">
              <h4 className="font-medium">Siège social & Magasin Taverny</h4>
              <p>16 Rue du condrocel 95000 Taverny</p>
              
              <h4 className="font-medium mt-4">Magasin Drancy</h4>
              <p>151 rue Diderot 93700 Drancy</p>
            </div>
          </div>

          {/* Nos produits */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos produits</h3>
            <ul className="space-y-2">
              <li><Link to="/nos-produits" className="hover:text-blue-600">Notre catalogue produits</Link></li>
              <li><Link to="nos-produits" className="hover:text-blue-600">Platerie</Link></li>
              <li><Link to="/nos-produits" className="hover:text-blue-600">Plomberie</Link></li>
              <li><Link to="/nos-produits" className="hover:text-blue-600">Chauffage</Link></li>
              <li><Link to="/nos-produits" className="hover:text-blue-600">climatisation</Link></li>
              <li><Link to="/nos-produits" className="hover:text-blue-600">Isolation</Link></li>
              <li><Link to="/nos-produits" className="hover:text-blue-600">Electricité</Link></li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li><Link to="/a-propos" className="hover:text-blue-600">À propos de Distritherm Service</Link></li>
              <li><Link to="/connexion" className="hover:text-blue-600">Connexion</Link></li>
              <li><Link to="/conditions-vente" className="hover:text-blue-600">Conditions générales de vente</Link></li>
              <li><Link to="/conditions-utilisation" className="hover:text-blue-600">Conditions générales d'utilisation du site</Link></li>
              <li><Link to="/sav" className="hover:text-blue-600">SAV</Link></li>
              <li><Link to="/nous-contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Section téléchargement application */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Télécharger notre application</h3>
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
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>© 2025 Distritherm Services</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 