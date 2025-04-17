import React, { useState, useRef } from 'react';
import { FaUser, FaPhone, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { remindService } from '../../services/remindService';

interface CallbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallbackForm: React.FC<CallbackFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Validation du numéro de téléphone
  const validatePhone = (phone: string) => {
    // Accepter les formats: 06XXXXXXXX, 06 XX XX XX XX, +33XXXXXXXXX, +33 X XX XX XX XX
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:\d{8}|\d{2}\d{2}\d{2}\d{2})$/;
    return phoneRegex.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string) => {
    // Nettoyer le numéro de tout ce qui n'est pas un chiffre ou +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Si le numéro commence par 00, le convertir en +
    if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2);
    }
    
    // Si c'est un numéro français sans indicatif, ajouter +33
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '+33' + cleaned.substring(1);
    }
    
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation des champs
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setError('Le numéro de téléphone est requis');
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      setError('Le format du numéro de téléphone est invalide. Utilisez un format valide (ex: 06 XX XX XX XX ou +33 6 XX XX XX XX)');
      return;
    }
    
    try {
      setLoading(true);
      
      // Formater le numéro de téléphone
      const formattedPhone = formatPhoneNumber(trimmedPhone);
      
      await remindService.requestCallback({
        fullName: name.trim(),
        phoneNumber: formattedPhone
      });
      
      setSuccess(true);
      setName('');
      setPhone('');
      
      // Fermer automatiquement après 3 secondes
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      //console.error('Erreur lors de l\'envoi de la demande de rappel', error);
      setError(error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Formater le numéro de téléphone pendant la saisie
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Permettre uniquement les chiffres, +, espaces et tirets
    value = value.replace(/[^\d\s+.-]/g, '');
    
    // Limiter la longueur
    if (value.length > 15) {
      value = value.slice(0, 15);
    }
    
    setPhone(value);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOutsideClick}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative" ref={formRef}>
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Demande de rappel</h2>
          <p className="text-gray-600 text-sm mt-1">
            Laissez-nous vos coordonnées et nous vous rappellerons rapidement
          </p>
        </div>
        
        {success ? (
          <div className="text-center py-6">
            <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600">Demande envoyée avec succès</p>
            <p className="text-gray-600 mt-2">Nous vous rappellerons dans les plus brefs délais</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Nom et prénom"
                  required
                  maxLength={50}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Ex: 06 12 34 56 78"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: 06 12 34 56 78 ou +33 6 12 34 56 78</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Envoi en cours...
                </>
              ) : (
                'Demander un rappel'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CallbackForm; 