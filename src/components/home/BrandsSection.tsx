import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// Props du composant
interface PartnersCarouselProps {
  title?: string;
  titleHighlight?: string;
  description?: string;
  logos?: string[];
  animationDuration?: number;
  className?: string;
}

// Logos par défaut
const defaultLogos = [
  '/fournisseurs/deville-logo.jpg',
  '/fournisseurs/edma-logo.jpg',
  '/fournisseurs/invicta-logo.png',
  '/fournisseurs/spp-h-logo.jpg',
  '/fournisseurs/talia-logo.jpg',
  '/fournisseurs/fhe_logo.webp',
  '/fournisseurs/dewalt_logo.jpg',
  '/fournisseurs/clivet_logo19.png',
  '/fournisseurs/logo_multitubo.jpg',
  '/fournisseurs/logo_ursa_hd.jpg',
  '/fournisseurs/logo_teddington_1934_cmjn_vecto_bd.jpg',
  '/fournisseurs/makita_logo.png',
  '/fournisseurs/logo_stanley_utilisation_digitale.jpg',
  '/fournisseurs/watts_logo_dernier.jpg',
  '/fournisseurs/rockwool_logo_primary_colour_rgb.png',
  '/fournisseurs/knauf-logo.png',
  '/fournisseurs/airsolar-logo.png',
  '/fournisseurs/airwell-logo.png',
  '/fournisseurs/logo-adrien.png',
  '/fournisseurs/logo-izar.jpg',
  '/fournisseurs/wavin-logo.png',
];

const BrandsSection: React.FC<PartnersCarouselProps> = ({
  title = "Nos",
  titleHighlight = "marques",
  description = "Nous travaillons avec les meilleures marques du marché pour vous garantir des produits de qualité, durables et performants",
  logos = defaultLogos,
  animationDuration = 18,
  className = ''
}) => {
  const logosContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLogos = (direction: 'left' | 'right') => {
    const container = logosContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="relative inline-block">
              {title} <span className="font-bold text-[#1E90FF]">{titleHighlight}</span> partenaires
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto py-4">
            {description}
          </p>
        </div>
        
        <div className="relative">
          {/* Boutons de scroll manuel */}
          <button
            aria-label="Défiler vers la gauche"
            onClick={() => scrollLogos('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-[#159b8a] hover:text-white text-[#159b8a] rounded-full shadow-lg w-10 h-10 flex items-center justify-center transition-all border border-[#159b8a]"
            style={{ boxShadow: '0 2px 8px #159b8a22' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            aria-label="Défiler vers la droite"
            onClick={() => scrollLogos('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-[#159b8a] hover:text-white text-[#159b8a] rounded-full shadow-lg w-10 h-10 flex items-center justify-center transition-all border border-[#159b8a]"
            style={{ boxShadow: '0 2px 8px #159b8a22' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <motion.div
            className="overflow-x-auto scrollbar-hide w-full"
            ref={logosContainerRef}
            initial={{}}
            animate={{}}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <motion.div
              className="flex gap-10 items-center w-full"
              animate={{ x: [0, -600] }}
              transition={{ 
                repeat: Infinity, 
                duration: animationDuration, 
                ease: 'linear' 
              }}
            >
              {/* Première série de logos */}
              {logos.map((logo, index) => (
                <div 
                  key={index} 
                  className="w-32 h-16 md:w-40 md:h-20 relative transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#159b8a]/20 flex-shrink-0"
                >
                  <img 
                    src={logo} 
                    alt="Marque partenaire" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
              
              {/* Duplication pour effet de boucle continue */}
              {logos.map((logo, index) => (
                <div 
                  key={index + 100} 
                  className="w-32 h-16 md:w-40 md:h-20 relative transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#159b8a]/20 flex-shrink-0"
                >
                  <img 
                    src={logo} 
                    alt="Marque partenaire" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection; 