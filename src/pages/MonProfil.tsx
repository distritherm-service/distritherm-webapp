import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { FaUserEdit, FaKey, FaSignOutAlt, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import PasswordChangeForm from '../components/profile/PasswordChangeForm';
import AddressForm from '../components/profile/AddressForm';
import Toast from '../components/notifications/Toast';

type ProfileTab = 'informations' | 'motDePasse' | 'adresses';

const MonProfil: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('informations');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setShowToast(true);
    setTimeout(() => {
      logout();
      navigate('/');
    }, 2000);
  };

  const switchTab = (tab: ProfileTab) => {
    setActiveTab(tab);
  };

  const formatUserName = () => {
    if (user?.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.lastName) {
      return user.lastName;
    } else {
      return user?.email || 'Utilisateur';
    }
  };

  return (
    <Layout>
      {showToast && (
        <Toast
          message="Vous avez été déconnecté avec succès"
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* En-tête du profil */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] px-6 py-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-[#007FFF]">
                    {user?.firstName ? user.firstName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">{formatUserName()}</h1>
                  <p className="text-[#FFFFFF]/90">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Raccourcis */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">


              <Link
                to="/mes-devis"
                state={{ from: 'profile' }}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#007FFF] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#7CB9E8]/20 rounded-lg flex items-center justify-center group-hover:bg-[#007FFF] transition-colors">
                  <svg className="w-6 h-6 text-[#007FFF] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Mes devis</h3>
                  <p className="text-sm text-gray-500">Gérer mes devis</p>
                </div>
              </Link>

              <Link
                to="/favoris"
                state={{ from: 'profile' }}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#007FFF] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#7CB9E8]/20 rounded-lg flex items-center justify-center group-hover:bg-[#007FFF] transition-colors">
                  <FaHeart className="w-6 h-6 text-[#007FFF] group-hover:text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Mes favoris</h3>
                  <p className="text-sm text-gray-500">Voir mes favoris</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-red-500 transition-colors group"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <FaSignOutAlt className="w-6 h-6 text-red-600 group-hover:text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Déconnexion</h3>
                  <p className="text-sm text-gray-500">Se déconnecter</p>
                </div>
              </button>
            </div>
          </div>

          {/* Contenu du profil */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] px-6 py-4">
              <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
            </div>
            
            {/* Tabs de navigation */}
            <div className="flex border-b">
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'informations'
                    ? 'border-b-2 border-[#007FFF] text-[#007FFF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => switchTab('informations')}
              >
                <FaUserEdit className="mr-2" />
                Informations personnelles
              </button>
              {user && user.type !== 'PROVIDER' && (
                <button
                  className={`flex items-center px-6 py-4 text-sm font-medium ${
                    activeTab === 'motDePasse'
                      ? 'border-b-2 border-[#007FFF] text-[#007FFF]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => switchTab('motDePasse')}
                >
                  <FaKey className="mr-2" />
                  Changer de mot de passe
                </button>
              )}
              <button
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === 'adresses'
                    ? 'border-b-2 border-[#007FFF] text-[#007FFF]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => switchTab('adresses')}
              >
                <FaMapMarkerAlt className="mr-2" />
                Mes adresses
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'informations' && (
                <PersonalInfoForm 
                  user={user} 
                  onUpdateSuccess={() => {}} 
                />
              )}
              
              {activeTab === 'motDePasse' && (
                <PasswordChangeForm />
              )}

              {activeTab === 'adresses' && (
                <AddressForm 
                  user={user}
                  onUpdateSuccess={() => {}}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MonProfil; 