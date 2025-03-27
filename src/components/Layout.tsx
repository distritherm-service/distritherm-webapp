import React from 'react';
import { useLocation } from 'react-router-dom';
import Slider from './Slider';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';

const PAGES_WITH_SLIDER = ['/', '/nos-produits', '/promotions', '/espace-recrutement', '/nous-contact'];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSlider = PAGES_WITH_SLIDER.includes(location.pathname);
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {showSlider && <Slider />}
      {!isHomePage && <Breadcrumb />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 