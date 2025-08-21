import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';  // Pour la redirection
import { PromotionBanner, getPromotionBanners } from '../../services/promotionBannerService';

interface PromotionBannersProps {
  className?: string;
}

const PromotionBanners: React.FC<PromotionBannersProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<PromotionBanner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Charger les bannières
  const loadBanners = useCallback(async () => {
    const data = await getPromotionBanners();
    setBanners(data);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  // Carrousel automatique
  useEffect(() => {
    if (banners.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners, isPaused]);

  if (banners.length === 0) {
    return null; // Pas de bannière à afficher
  }

  return (
    <div
      className={`relative w-full h-56 md:h-64 lg:h-72 overflow-hidden rounded-3xl shadow-lg border border-gray-100 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h1>Bannières promotionnelles</h1>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out transform ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Image */}
          <img
            src={banner.imageUrl}
            alt={`Bannière promotion ${banner.id}`}
            className="w-full h-56 md:h-64 lg:h-72 object-cover object-center"
          />
          {/* Gradient overlay pour améliorer la lisibilité potentielle du texte sur la bannière */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Bouton "Voir toutes les promotions" */}
      <button
        onClick={() => navigate('/promotions')}
        className="absolute z-20 top-3 right-3 bg-primary-600 hover:bg-primary-700 text-white text-sm md:text-base font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        Voir les promotions
      </button>

      {/* Indicateurs de pagination */}
      <div className="absolute z-20 bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ring-1 ring-white transition-colors duration-300 ${
              index === current ? 'bg-white shadow' : 'bg-white/70 hover:bg-white'
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Aller à la bannière ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionBanners;
