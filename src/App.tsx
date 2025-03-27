import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NosProducts from './pages/NosProducts';
import Promotions from './pages/Promotions';
import EspaceRecrutement from './pages/EspaceRecrutement';
import Contact from './pages/Contact';
import ConditionsVente from './pages/ConditionsVente';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import SAV from './pages/SAV';
import APropos from './pages/APropos';
import Connexion from './pages/Connexion';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="201480575290-94hn7fi3lqt72v3fpi4am2s2c3gr8qar.apps.googleusercontent.com">
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="navbar-spacer"></div>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nos-produits" element={<NosProducts />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/espace-recrutement" element={<EspaceRecrutement />} />
              <Route path="/nous-contact" element={<Contact />} />
              <Route path="/conditions-vente" element={<ConditionsVente />} />
              <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
              <Route path="/sav" element={<SAV />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/panier" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Votre Panier</h1></div>} />
              <Route path="/connexion" element={<Connexion />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
