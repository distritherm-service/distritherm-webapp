import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaUser, FaHome, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';

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
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <div className="flex-grow flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] px-6 py-8 text-center">
            <motion.div 
              className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center"
              variants={itemVariants}
            >
              <FaCheckCircle className="h-16 w-16 text-[#007FFF]" />
            </motion.div>
            <motion.h1 
              className="mt-6 text-2xl font-bold text-white"
              variants={itemVariants}
            >
              Inscription réussie !
            </motion.h1>
            <motion.p 
              className="mt-2 text-white"
              variants={itemVariants}
            >
              Bienvenue chez Distritherm, {user.firstName} !
            </motion.p>
          </div>

          <div className="px-6 py-8">
            <motion.p 
              className="text-gray-700 mb-6 text-center"
              variants={itemVariants}
            >
              Votre compte a été créé avec succès. Vous pouvez maintenant profiter de tous nos services et avantages.
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-4 mb-6"
              variants={itemVariants}
            >
              <Link 
                to="/" 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaHome className="h-8 w-8 text-[#007FFF] mb-2" />
                <span className="text-sm text-gray-700">Accueil</span>
              </Link>
              <Link 
                to="/mon-profil" 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaUser className="h-8 w-8 text-[#007FFF] mb-2" />
                <span className="text-sm text-gray-700">Mon profil</span>
              </Link>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <Link 
                to="/nos-produits"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] hover:from-[#6ba9d8] hover:to-[#0065cc] shadow-sm"
              >
                <FaShoppingCart className="mr-2" />
                Explorer nos produits
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterSuccess; 