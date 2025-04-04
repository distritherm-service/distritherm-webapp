import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const EmailVerification: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'sending' | 'sent' | 'verified' | 'error'>('idle');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Vérifier le token automatiquement si présent dans l'URL
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true);
      setStatus('verifying');
      setError('');
      setMessage('');
      
      console.log('Vérification du token...');
      const response = await authService.verifyEmail(verificationToken);
      
      setStatus('verified');
      setMessage(response.message || 'Votre email a été vérifié avec succès !');
      
      // Mettre à jour le statut de vérification de l'utilisateur
      if (user) {
        updateUser({ ...user, emailVerified: true });
      }
      
      // Rediriger vers le profil après 3 secondes
      setTimeout(() => {
        navigate('/mon-profil', { 
          state: { message: 'Email vérifié avec succès !' }
        });
      }, 3000);
      
    } catch (err: any) {
      console.error('Erreur lors de la vérification:', err);
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

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      setStatus('sending');
      setError('');
      setMessage('');
      
      console.log('Envoi de l\'email de vérification...');
      const response = await authService.resendVerificationEmail();
      
      setStatus('sent');
      setMessage(response.message || 'Un nouvel email de vérification vous a été envoyé !');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error ||
                         err.message ||
                         'Une erreur est survenue lors de l\'envoi de l\'email.';
      setError(errorMessage);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Rediriger si non authentifié
  useEffect(() => {
    if (!user) {
      navigate('/connexion');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
              Vérification de l'email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {status === 'verifying' ? 'Vérification en cours...' : 'Veuillez vérifier votre email'}
            </p>
            <p className="mt-1 text-md font-medium text-gray-800">
              {user.email}
            </p>
          </div>

          {(status === 'sent' || status === 'verified') && message && (
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

          {!token && !user.emailVerified && (
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Action requise
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Pour vérifier votre email :</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Vérifiez votre boîte de réception</li>
                      <li>Cliquez sur le lien dans l'email</li>
                      <li>Vérifiez aussi vos spams si nécessaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            {!token && !user.emailVerified && (
              <button
                onClick={handleResendVerification}
                disabled={isLoading || status === 'sent' || status === 'verified'}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isLoading || status === 'sent' || status === 'verified'
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
                  }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    {status === 'verifying' ? 'Vérification...' : 'Envoi en cours...'}
                  </>
                ) : status === 'sent' ? (
                  <>
                    <FaCheckCircle className="h-5 w-5 mr-2" />
                    Email envoyé !
                  </>
                ) : (
                  <>
                    <FaEnvelope className="h-5 w-5 mr-2" />
                    Renvoyer l'email de vérification
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => navigate('/mon-profil')}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Retour au profil
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification; 