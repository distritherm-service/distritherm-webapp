import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaUser, FaHome, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate('/connexion', { replace: true });
    }
  }, [user, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Section principale avec espacement amélioré */}
        <div className="flex-grow flex justify-center items-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* En-tête avec gradient amélioré */}
            <div className="bg-gradient-to-br from-[#7CB9E8] via-[#007FFF] to-[#0056b3] px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
              {/* Effet de fond décoratif */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <motion.div 
                className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-full flex items-center justify-center shadow-lg"
                variants={itemVariants}
              >
                <FaCheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-[#007FFF]" />
              </motion.div>
              <motion.h1 
                className="relative mt-6 text-xl sm:text-2xl lg:text-3xl font-bold text-white"
                variants={itemVariants}
              >
                Inscription réussie !
              </motion.h1>
              <motion.p 
                className="relative mt-2 text-white/90 text-sm sm:text-base"
                variants={itemVariants}
              >
                Bienvenue chez Distritherm, {user.firstName} !
              </motion.p>
            </div>

            {/* Contenu principal avec espacement amélioré */}
            <div className="px-6 sm:px-8 py-8 sm:py-10">
              <motion.p 
                className="text-gray-700 mb-6 sm:mb-8 text-center text-sm sm:text-base leading-relaxed"
                variants={itemVariants}
              >
                Votre compte a été créé avec succès. Vous pouvez maintenant profiter de tous nos services et avantages.
              </motion.p>

              {/* Boutons d'action avec design amélioré */}
              <motion.div 
                className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8"
                variants={itemVariants}
              >
                <Link 
                  to="/" 
                  className="group flex flex-col items-center justify-center p-4 sm:p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
                >
                  <FaHome className="h-6 w-6 sm:h-8 sm:w-8 text-[#007FFF] mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Accueil</span>
                </Link>
                <Link 
                  to="/mon-profil" 
                  className="group flex flex-col items-center justify-center p-4 sm:p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
                >
                  <FaUser className="h-6 w-6 sm:h-8 sm:w-8 text-[#007FFF] mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">Mon profil</span>
                </Link>
              </motion.div>

              {/* Bouton principal avec design amélioré */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <Link 
                  to="/nos-produits"
                  className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#6ba9d8] hover:to-[#0065cc] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FaShoppingCart className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Explorer nos produits
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterSuccess; 