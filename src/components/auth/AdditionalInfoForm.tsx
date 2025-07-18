import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaPhone, FaIdCard } from 'react-icons/fa';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

// Interface pour les informations supplémentaires d'inscription
interface AdditionalInfo {
  phoneNumber: string;
  companyName: string;
  siretNumber: string;
}

interface AdditionalInfoFormProps {
  googleCredential: string;
  onCancel: () => void;
  inCart?: boolean;
}

const AdditionalInfoForm: React.FC<AdditionalInfoFormProps> = ({ 
  googleCredential, 
  onCancel, 
  inCart = false 
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    phoneNumber: '',
    companyName: '',
    siretNumber: ''
  });

  const handleAdditionalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      if (!googleCredential) {
        throw new Error('Session Google expirée. Veuillez réessayer.');
      }
      
      const responseData = await authService.registerWithGoogle(googleCredential, additionalInfo);
      
      // Mettre à jour l'état d'authentification globale
      login(responseData);
      
      // Redirection après inscription réussie
      if (!inCart) {
        setTimeout(() => {
          navigate('/inscription-reussie');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription Google:', error);
      
      if (error.response?.data?.message?.includes('téléphone')) {
        setError('Le format du numéro de téléphone n\'est pas valide. Utilisez le format +33XXXXXXXXX.');
      } else {
        setError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 w-full">
        <h2 className="text-xl font-bold mb-4 text-teal-600">Informations supplémentaires requises</h2>
        <p className="text-gray-700 mb-4">
          Pour finaliser votre inscription, veuillez fournir les informations suivantes :
        </p>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-md text-red-600 text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAdditionalInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="06 12 34 56 78"
                value={additionalInfo.phoneNumber}
                onChange={(e) => setAdditionalInfo({...additionalInfo, phoneNumber: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Distritherm Services"
                value={additionalInfo.companyName}
                onChange={(e) => setAdditionalInfo({...additionalInfo, companyName: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro SIRET
              <span className="text-red-500">*</span> 
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="123 456 789 00012"
                value={additionalInfo.siretNumber}
                onChange={(e) => setAdditionalInfo({...additionalInfo, siretNumber: e.target.value})}
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] text-white rounded-lg hover:from-[#6BA8D7] hover:to-[#0066CC]"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdditionalInfoForm; 