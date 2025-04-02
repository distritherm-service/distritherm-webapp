import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { authService } from '../../services/authService';

// Interface pour le formulaire de mot de passe oublié
interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });

  // Gestion du changement dans le formulaire de mot de passe oublié
  const handleForgotPasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordFormData({
      ...forgotPasswordFormData,
      [name]: value
    });
  };

  // Fonction pour gérer la demande de réinitialisation de mot de passe
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Vérifier que l'email est renseigné
      if (!forgotPasswordFormData.email) {
        setError('Veuillez renseigner votre adresse email.');
        return;
      }
      
      const response = await authService.forgotPassword(forgotPasswordFormData);
      
      setSuccess('Un email de réinitialisation a été envoyé à votre adresse.');
      // Réinitialiser le formulaire
      setForgotPasswordFormData({ email: '' });
    } catch (error: any) {
      console.error('Erreur de récupération mot de passe:', error);
      
      if (error.response?.status === 404) {
        setError('Aucun compte n\'est associé à cette adresse email.');
      } else if (error.response?.status === 400) {
        setError('Veuillez vérifier votre adresse email.');
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
        <h2 className="text-xl font-bold mb-4 text-teal-600">Mot de passe oublié</h2>
        <p className="text-gray-700 mb-4">
          Veuillez saisir votre adresse email. Vous recevrez un lien pour créer un nouveau mot de passe.
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
        
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="votreemail@exemple.com"
                value={forgotPasswordFormData.email}
                onChange={handleForgotPasswordFormChange}
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
              {loading ? 'Chargement...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 