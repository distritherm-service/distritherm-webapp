import React from 'react';
import { useLocation } from 'react-router-dom';
import Slider from '../home/Slider';
import Footer from './Footer';
import Breadcrumb from '../navigation/Breadcrumb';

const PAGES_WITH_SLIDER = ['/', '/nos-produits', '/promotions', '/espace-recrutement', '/nous-contact'];
const PAGES_WITHOUT_TOP_BREADCRUMB = ['/', '/demande-espace-pro'];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showSlider = PAGES_WITH_SLIDER.includes(location.pathname);
  const showTopBreadcrumb = !PAGES_WITHOUT_TOP_BREADCRUMB.includes(location.pathname);

  return (
    <>
      {showSlider && <Slider />}
      <div className="min-h-screen flex flex-col p-8">
        {showTopBreadcrumb && <Breadcrumb />}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout; 