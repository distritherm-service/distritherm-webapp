import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { authService } from '../../services/authService';

// Interface pour le formulaire de réinitialisation de mot de passe
interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

interface ResetPasswordFormProps {
  token: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [resetPasswordFormData, setResetPasswordFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
    token: token
  });

  // Gestion du changement dans le formulaire de réinitialisation de mot de passe
  const handleResetPasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetPasswordFormData({
      ...resetPasswordFormData,
      [name]: value
    });
  };

  // Fonction pour gérer la réinitialisation de mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Vérifier que les mots de passe correspondent
      if (resetPasswordFormData.password !== resetPasswordFormData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
      
      // Vérifier que le mot de passe est assez complexe
      if (resetPasswordFormData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }
      
      await authService.resetPassword({
        password: resetPasswordFormData.password,
        token: resetPasswordFormData.token
      });
      
      setSuccess('Votre mot de passe a été réinitialisé avec succès.');
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Erreur de réinitialisation mot de passe:', error);
      
      if (error.response?.status === 400) {
        setError('Le lien de réinitialisation est invalide ou a expiré.');
      } else if (error.response?.status === 401) {
        setError('Le lien de réinitialisation a expiré.');
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 w-full">
        <h2 className="text-xl font-bold mb-4 text-teal-600">Réinitialisation du mot de passe</h2>
        <p className="text-gray-700 mb-4">
          Veuillez saisir votre nouveau mot de passe.
        </p>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-md text-green-600 text-sm mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="********"
                value={resetPasswordFormData.password}
                onChange={handleResetPasswordFormChange}
                required
                minLength={8}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="********"
                value={resetPasswordFormData.confirmPassword}
                onChange={handleResetPasswordFormChange}
                required
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Réinitialiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm; 