import React from 'react';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ConditionsUtilisation: React.FC = () => {
  const navigate = useNavigate();

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow relative">
        {/* Section En-tête */}
        <section className="relative h-64 md:h-80 lg:h-[420px] w-full overflow-hidden shadow-md">
          {/* Image d'arrière-plan */}
          <div className="absolute inset-0">
            <img
              src="/conditions-utilisation.png"
              alt="Conditions Générales d'Utilisation"
              className="w-full h-full object-cover object-center"
            />
            {/* Voile sombre en dégradé */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-sm" />
          </div>
          {/* Contenu : Titre + Date + Breadcrumb */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
              Conditions d'Utilisation
            </h1>
            <p className="text-white mb-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            <Breadcrumb />
          </div>
          {/* Ombre courbée en bas */}
          <div className="absolute bottom-0 left-1/2 w-full max-w-none -translate-x-1/2">
            <svg viewBox="0 0 1600 100" className="w-full h-6 md:h-8" preserveAspectRatio="none">
              <path d="M0,0 C600,100 1000,100 1600,0 L1600,100 L0,100 Z" fill="#f8f9ff"/>
            </svg>
          </div>
        </section>


        <div className="container mx-auto px-4 py-8 relative">

          {/* Contenu principal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">1. Présentation du site</h2>
              <p className="text-gray-600 mb-6">
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site DistriTherm Services l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">2. Conditions générales d'utilisation du site et des services proposés</h2>
              <p className="text-gray-600 mb-6">
                L'utilisation du site DistriTherm Services implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site sont donc invités à les consulter de manière régulière.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">3. Description des services fournis</h2>
              <p className="text-gray-600 mb-6">
                Le site DistriTherm Services a pour objet de fournir une information concernant l'ensemble des activités de la société. DistriTherm Services s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">4. Limitations contractuelles sur les données techniques</h2>
              <p className="text-gray-600 mb-6">
                Le site utilise la technologie JavaScript. Le site Internet ne pourra être tenu responsable de dommages matériels liés à l'utilisation du site. De plus, l'utilisateur du site s'engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis à jour.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">5. Propriété intellectuelle et contrefaçons</h2>
              <p className="text-gray-600 mb-6">
                DistriTherm Services est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">6. Gestion des données personnelles</h2>
              <p className="text-gray-600 mb-6">
                En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995. DistriTherm Services s'engage à respecter le Règlement Général sur la Protection des Données (RGPD).
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">7. Liens hypertextes et cookies</h2>
              <p className="text-gray-600 mb-6">
                Le site DistriTherm Services contient un certain nombre de liens hypertextes vers d'autres sites. Cependant, DistriTherm Services n'a pas la possibilité de vérifier le contenu des sites ainsi visités, et n'assumera en conséquence aucune responsabilité de ce fait.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">8. Droit applicable et attribution de juridiction</h2>
              <p className="text-gray-600 mb-6">
                Tout litige en relation avec l'utilisation du site DistriTherm Services est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Navigation rapide - Bouton retour */}
      <div className="fixed bottom-8 left-8 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="bg-[#1E90FF] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Retour à la page précédente"
        >
          <FaArrowLeft />
        </motion.button>
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default ConditionsUtilisation; 