import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nos-produits" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Nos Produits</h1></div>} />
            <Route path="/promotions" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Promotions</h1></div>} />
            <Route path="/espace-recrutement" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Espace Recrutement</h1></div>} />
            <Route path="/nous-contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Nous Contacter</h1></div>} />
            <Route path="/trouver-magasin" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Trouver un Magasin</h1></div>} />
            <Route path="/panier" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Votre Panier</h1></div>} />
            <Route path="/connexion" element={<div className="container mx-auto px-4 py-8"><h1 className="text-4xl font-bold">Connexion</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
