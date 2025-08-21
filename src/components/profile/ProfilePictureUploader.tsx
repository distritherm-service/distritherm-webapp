import React, { useRef, useState } from 'react';
import { FaCamera, FaSpinner, FaTimes, FaExpand } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

/**
 * Composant permettant l’affichage et la mise à jour de la photo de profil utilisateur.
 * – Si l’utilisateur a déjà une photo (urlPicture), elle est affichée.
 * – Sinon, on affiche l’initiale.
 * – Au survol/clic, un input file est déclenché pour envoyer la nouvelle image
 *   (POST /users/{id}/change-picture, cf. Swagger).
 */
const ProfilePictureUploader: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  const displayInitial = () => {
    const char = user.firstName?.[0] || user.email?.[0] || '?';
    return char.toUpperCase();
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setIsUploading(true);
      const response = await authService.changeProfilePicture(user.id, file);

      if (response?.user) {
        updateUser(response.user);
      } else if (response?.urlPicture) {
        updateUser({ urlPicture: response.urlPicture });
      }
    } catch (err) {
      console.error('Erreur upload photo de profil:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="relative" title="Cliquer pour voir ou changer la photo de profil">
        {/* Avatar cliquable */}
        {user.urlPicture ? (
          <img
            src={user.urlPicture}
            alt="Photo de profil"
            className="w-16 h-16 rounded-full object-cover shadow-md cursor-pointer hover:ring-2 hover:ring-[#007FFF] transition-all"
            onClick={() => setShowModal(true)}
          />
        ) : (
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-[#007FFF]">{displayInitial()}</span>
          </div>
        )}

        {/* Bouton caméra */}
        <button
          type="button"
          onClick={triggerFileSelect}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-[#007FFF] hover:text-white transition-colors"
          title="Changer la photo de profil"
        >
          {isUploading ? (
            <FaSpinner className="animate-spin w-4 h-4" />
          ) : (
            <FaCamera className="w-4 h-4" />
          )}
        </button>

        {/* Input fichier */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Modal de visualisation */}
      {showModal && user.urlPicture && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          style={{ animation: 'fadeIn 0.2s ease-in-out' }}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Fermer"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            <img
              src={user.urlPicture}
              alt="Photo de profil"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Infos utilisateur */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-white/70">{user.email}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileSelect();
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-[#007FFF] text-white rounded-lg hover:bg-[#0066CC] transition-colors flex items-center gap-2"
              >
                <FaCamera className="w-4 h-4" />
                Changer la photo
              </button>
              <a
                href={user.urlPicture}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExpand className="w-4 h-4" />
                Ouvrir en grand
              </a>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default ProfilePictureUploader;
