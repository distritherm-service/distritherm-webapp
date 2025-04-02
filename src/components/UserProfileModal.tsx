import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaShoppingBag, FaUser, FaBuilding, FaPhone, FaIdCard, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Fermer le modal au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/');
  };

  const handleNavigateToOrders = () => {
    navigate('/mes-commandes');
    onClose();
  };

  const handleNavigateToProfile = () => {
    navigate('/mon-profil');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4" id="modal-title">
                  Profil utilisateur
                </h3>
                
                <div className="mt-2 space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <FaUser className="text-teal-600 h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName || ''} {user.lastName || ''}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-1 h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  {user.companyName && (
                    <div className="flex items-center pt-2">
                      <FaBuilding className="text-gray-400 h-5 w-5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Entreprise</p>
                        <p className="text-sm font-medium text-gray-900">{user.companyName}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.siretNumber && (
                    <div className="flex items-center pt-2">
                      <FaIdCard className="text-gray-400 h-5 w-5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">SIRET</p>
                        <p className="text-sm font-medium text-gray-900">{user.siretNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.phoneNumber && (
                    <div className="flex items-center pt-2">
                      <FaPhone className="text-gray-400 h-5 w-5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Déconnexion
            </button>
            <button
              type="button"
              onClick={handleNavigateToOrders}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FaShoppingBag className="mr-2 h-4 w-4" />
              Mes commandes
            </button>
            <button
              type="button"
              onClick={handleNavigateToProfile}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FaUser className="mr-2 h-4 w-4" />
              Modifier mon profil
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal; 