import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NosProducts from './pages/NosProducts';
import Promotions from './pages/Promotions';
import EspaceRecrutement from './pages/EspaceRecrutement';
import NousContact from './pages/NousContact';
import ConditionsVente from './pages/ConditionsVente';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import SAV from './pages/SAV';
import APropos from './pages/APropos';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nos-produits" element={<NosProducts />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/espace-recrutement" element={<EspaceRecrutement />} />
            <Route path="/nous-contact" element={<NousContact />} />
            <Route path="/conditions-vente" element={<ConditionsVente />} />
            <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
            <Route path="/sav" element={<SAV />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/trouver-magasin" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Trouver un Magasin</h1></div>} />
            <Route path="/panier" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Votre Panier</h1></div>} />
            <Route path="/connexion" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Connexion</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
