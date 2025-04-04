import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { authService } from '../../services/authService';

// Interface pour le formulaire de réinitialisation de mot de passe
interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const MAX_ATTEMPTS = 3; // Nombre maximum de tentatives autorisées

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  const [resetPasswordFormData, setResetPasswordFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  });

  // Gestion du changement dans le formulaire
  const handleResetPasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordFormData({
      ...resetPasswordFormData,
      [name]: value
    });
  };

  // Fonction pour gérer la réinitialisation du mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Vérifier le nombre de tentatives
    if (attempts >= MAX_ATTEMPTS) {
      setError('Trop de tentatives. Veuillez réessayer plus tard.');
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);
      return;
    }
    
    try {
      setLoading(true);
      setAttempts(prev => prev + 1);
      
      // Vérifications de base
      if (!token) {
        setError('Token de réinitialisation invalide ou manquant.');
        return;
      }

      if (!resetPasswordFormData.password || !resetPasswordFormData.confirmPassword) {
        setError('Veuillez remplir tous les champs.');
        return;
      }

      if (resetPasswordFormData.password !== resetPasswordFormData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }

      // Validation du mot de passe
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(resetPasswordFormData.password)) {
        setError(
          'Le mot de passe doit contenir au moins 8 caractères, ' +
          'une majuscule, une minuscule, un chiffre et un caractère spécial.'
        );
        return;
      }
      
      await authService.updatePasswordForgot(token, resetPasswordFormData.password);
      
      setSuccess('Votre mot de passe a été mis à jour avec succès.');
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/connexion');
      }, 3000);
      
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('Le lien de réinitialisation est invalide ou a expiré.');
        if (attempts >= MAX_ATTEMPTS - 1) {
          setTimeout(() => {
            navigate('/connexion');
          }, 2000);
        }
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-teal-600">
            Réinitialisation du mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez saisir votre nouveau mot de passe
          </p>
          {attempts > 0 && (
            <p className="mt-2 text-center text-sm text-orange-600">
              Tentative {attempts}/{MAX_ATTEMPTS}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-md text-green-600 text-sm">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">Nouveau mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Nouveau mot de passe"
                  value={resetPasswordFormData.password}
                  onChange={handleResetPasswordFormChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                  value={resetPasswordFormData.confirmPassword}
                  onChange={handleResetPasswordFormChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || attempts >= MAX_ATTEMPTS}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                attempts >= MAX_ATTEMPTS
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              }`}
            >
              {loading ? 'Chargement...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm; 