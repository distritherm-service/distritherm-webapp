import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navigation/Navbar';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/layout/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './contexts/AuthContext';
import EmailVerification from './pages/EmailVerification';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ValidateEmail from './pages/ValidateEmail';
import CategoryProducts from './pages/CategoryProducts';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Composant de chargement simple en attendant de créer le composant LoadingSpinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
  </div>
);

// Composant pour protéger la page de connexion
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Sinon, afficher la page de connexion
  return <Connexion />;
};

// Lazy loading des pages pour améliorer les performances
const Home = lazy(() => import('./pages/Home'));
const NosProducts = lazy(() => import('./pages/NosProducts'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Contact = lazy(() => import('./pages/Contact'));
const ConditionsVente = lazy(() => import('./pages/ConditionsVente'));
const ConditionsUtilisation = lazy(() => import('./pages/ConditionsUtilisation'));
const SAV = lazy(() => import('./pages/SAV'));
const Connexion = lazy(() => import('./pages/Connexion'));
const Favoris = lazy(() => import('./pages/Favoris'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart/index'));
const MonProfil = lazy(() => import('./pages/MonProfil'));
const MesCommandes = lazy(() => import('./pages/MesCommandes'));
const MesDevis = lazy(() => import('./pages/MesDevis'));
const RegisterSuccess = lazy(() => import('./pages/RegisterSuccess'));

// Page 404 simple
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen py-12">
    <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 mb-8">Page non trouvée</p>
    <a href="/" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
      Retour à l'accueil
    </a>
  </div>
);

// Routes de l'application
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques accessibles à tous */}
      <Route path="/" element={<Home />} />
      <Route path="/nos-produits" element={<NosProducts />} />
      <Route path="/categorie" element={<Navigate to="/" replace />} />
      <Route path="/categorie/:category/:subCategory?/:level3?/:level4?" element={<CategoryProducts />} />
      <Route path="/produit/:id" element={<ProductDetail />} />
      <Route path="/promotions" element={<Promotions />} />
      {/* <Route path="/espace-recrutement" element={<EspaceRecrutement />} /> */}
      <Route path="/nous-contact" element={<Contact />} />
      <Route path="/conditions-vente" element={<ConditionsVente />} />
      <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
      <Route path="/sav" element={<SAV />} /> 
      {/* <Route path="/a-propos" element={<APropos />} /> */}
      <Route path="/panier" element={<Cart />} />
      
      {/* Routes protégées nécessitant une authentification */}
      <Route 
        path="/favoris" 
        element={
          <ProtectedRoute>
            <Favoris />
          </ProtectedRoute>
        } 
      />
      <Route path="/Mon-profil" element={<MonProfil />} />
      <Route path="/Mes-commandes" element={<MesCommandes />} />
      <Route path="/Mes-devis" element={<MesDevis />} />
      <Route path="/panier/payment" element={<div>Page de paiement</div>} />
      <Route 
        path="/inscription-reussie" 
        element={
          <ProtectedRoute>
            <RegisterSuccess />
          </ProtectedRoute>
        } 
      />
      <Route path="/verification-email" element={<EmailVerification />} />
      <Route path="/validate-email" element={<ValidateEmail />} />
      <Route path="/password-forgot" element={<ResetPasswordForm />} />
      
      {/* Page de connexion - inaccessible si déjà connecté */}
      <Route path="/connexion" element={<LoginPage />} />
      
      {/* Page 404 pour les routes non trouvées */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="592794634648-38n0hj2dhk0frc5tm2o7c3gol5d06clc.apps.googleusercontent.com">
      <AuthProvider>
        <CartProvider>
          <Router>
            <SearchProvider>
              <FavoritesProvider>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <div className="navbar-spacer"></div>
                  <ScrollToTop />
                  <Toaster position="top-right" toastOptions={{
                    duration: 4000,
                    style: {
                      borderRadius: '8px',
                      background: '#333',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#10B981',
                      },
                    },
                    error: {
                      style: {
                        background: '#EF4444',
                      },
                    }
                  }} />
                  <main>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AppRoutes />
                    </Suspense>
                  </main>
                </div>
              </FavoritesProvider>
            </SearchProvider>
          </Router>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
