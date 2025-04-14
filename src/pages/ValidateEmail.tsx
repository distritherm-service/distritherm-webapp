import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { authService } from '../services/authService';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const ValidateEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'verifying' | 'verified' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setError('Aucun token de validation trouvé dans l\'URL.');
      setIsLoading(false);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true);
      setStatus('verifying');
      setError('');
      setMessage('');
      
      // console.log('Vérification du token...');
      const response = await authService.verifyEmail(verificationToken);
      
      setStatus('verified');
      setMessage(response.message || 'Votre email a été vérifié avec succès !');
      
      // Rediriger vers la page de connexion après 5 secondes
      setTimeout(() => {
        navigate('/', { 
          state: { message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' }
        });
      }, 5000);
      
    } catch (err: any) {
      // console.error('Erreur lors de la vérification:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error ||
                         err.message ||
                         'Une erreur est survenue lors de la vérification.';
      setError(errorMessage);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Breadcrumb />
      <div className="flex-grow bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          >
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center">
                <FaEnvelope className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Validation de l'email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {status === 'verifying' ? 'Vérification en cours...' : 
                 status === 'verified' ? 'Email validé' : 'Échec de la validation'}
              </p>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin h-10 w-10 text-teal-600" />
              </div>
            )}

            {status === 'verified' && message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md bg-green-50 p-4 mb-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {message}
                    </p>
                    <p className="mt-2 text-sm text-green-700">
                      Vous allez être redirigé vers la page d'accueil dans quelques secondes...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md bg-red-50 p-4 mb-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Aller à la page d'accueil
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ValidateEmail; 