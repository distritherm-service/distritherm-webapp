import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import ScrollToTop from './components/ScrollToTop';
// Composant de chargement simple en attendant de créer le composant LoadingSpinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
  </div>
);

// Lazy loading des pages pour améliorer les performances
const Home = lazy(() => import('./pages/Home'));
const NosProducts = lazy(() => import('./pages/NosProducts'));
const Promotions = lazy(() => import('./pages/Promotions'));
const EspaceRecrutement = lazy(() => import('./pages/EspaceRecrutement'));
const Contact = lazy(() => import('./pages/Contact'));
const ConditionsVente = lazy(() => import('./pages/ConditionsVente'));
const ConditionsUtilisation = lazy(() => import('./pages/ConditionsUtilisation'));
const SAV = lazy(() => import('./pages/SAV'));
const APropos = lazy(() => import('./pages/APropos'));
const Connexion = lazy(() => import('./pages/Connexion'));
const Favoris = lazy(() => import('./pages/Favoris'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/index'));

const App: React.FC = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="navbar-spacer"></div>
            <ScrollToTop />
            <main>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/nos-produits" element={<NosProducts />} />
                  <Route path="/nos-produits/:id" element={<ProductDetail />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/espace-recrutement" element={<EspaceRecrutement />} />
                  <Route path="/nous-contact" element={<Contact />} />
                  <Route path="/conditions-vente" element={<ConditionsVente />} />
                  <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
                  <Route path="/sav" element={<SAV />} />
                  <Route path="/a-propos" element={<APropos />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/connexion" element={<Connexion />} />
                  <Route path="/favoris" element={<Favoris />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default App;
