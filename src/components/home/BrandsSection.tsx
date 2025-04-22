import React, { useEffect, useRef } from 'react';

const BrandsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const timer = setInterval(scroll, 30);

    return () => clearInterval(timer);
  }, []);

  const brands = [
    { name: 'FHE', src: '/fournisseur1.png' },
    { name: 'FHE', src: '/fournisseur2.jpg' },
    { name: 'DeWalt', src: '/fournisseur3.png' },
    { name: 'Knauf', src: '/fournisseur4.png' },
    { name: 'Rockwool', src: '/fournisseur5.jpg' },
    { name: 'Teddington', src: '/fournisseur6.jpg' },
    { name: 'Watts', src: '/fournisseur7.jpg' },
    { name: 'Multitubo', src: '/fournisseur8.png' },
    { name: 'Stanley', src: '/fournisseur9.png' },
    { name: 'Makita', src: '/fournisseur10.png' },
    { name: 'Ursa', src: '/fournisseur11.jpg' },
    { name: 'Ursa', src: '/fournisseur12.jpg' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] bg-clip-text text-transparent">
              Nos Marques Partenaires
            </span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#7CB9E8] to-[#007FFF] rounded-full"></div>
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex space-x-12 overflow-x-hidden py-8 px-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-none w-48 h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center p-4"
              >
                <img
                  src={brand.src}
                  alt={`Logo ${brand.name}`}
                  className="max-w-full max-h-full object-contain transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default BrandsSection; 