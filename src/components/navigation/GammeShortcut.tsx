'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTools, FaThermometerHalf, FaSnowflake, FaShower, FaBolt, FaHardHat, FaMountain, FaTree } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

// Définition des catégories, icônes et couleurs associées
const categories: Category[] = [
  { id: 'platerie', name: 'Plâtrerie', icon: FaMountain, color: '#007FFF' },
  { id: 'isolation', name: 'Isolation', icon: FaTree, color: '#22c55e' },
  { id: 'chauffage', name: 'Chauffage', icon: FaThermometerHalf, color: '#f59e42' },
  { id: 'climatisation', name: 'Climatisation', icon: FaSnowflake, color: '#38bdf8' },
  { id: 'sanitaire', name: 'Sanitaire', icon: FaShower, color: '#6366f1' },
  { id: 'plomberie', name: 'Plomberie', icon: FaTools, color: '#f43f5e' },
  { id: 'electricite', name: 'Électricité', icon: FaBolt, color: '#facc15' },
  { id: 'outillage', name: 'Outillage', icon: FaTools, color: '#a3a3a3' },
  { id: 'epi', name: 'EPI', icon: FaHardHat, color: '#fbbf24' },
];

const GammeShortcut: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      aria-label="Navigation des gammes"
      className="relative bg-white/70 backdrop-blur-md shadow-md ring-1 ring-white/40 z-20"
    >
      {/* Voile pour la lisibilité sur fonds d'images */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none" />
      <div className="container relative mx-auto px-4">
        <ul className="flex justify-center items-center overflow-x-auto gap-5 py-4 scrollbar-hide" role="list">
          {categories.map((cat) => {
            const isActive = pathname?.startsWith(`/gamme/${cat.id}`);
            const Icon = cat.icon;
            return (
              <li key={cat.id} className="flex-shrink-0" role="listitem">
                <Link
                  to={`/gamme/${cat.id}`}
                  className={`inline-flex flex-col items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-[#007FFF] text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:text-[#007FFF] hover:bg-[#007FFF]/10'
                    }
                  `}
                  style={{ minWidth: 90 }}
                >
                  <span className="mb-1 flex items-center justify-center">
                    <Icon size={22} color={cat.color} style={{ filter: isActive ? 'brightness(1.2)' : 'none', transition: 'filter 0.2s' }} />
                  </span>
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

    </nav>
  );
};

export default GammeShortcut; 