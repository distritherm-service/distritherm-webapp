import React, { useState, useEffect, useCallback } from 'react';

interface SliderProps {
  showOnPages?: string[];
}

const slides = [
  {
    id: 1,
    image: '/slider-1.jpeg',
    title: 'Solutions de Chauffage',
    description: 'Des solutions innovantes pour votre confort'
  },
  {
    id: 2,
    image: '/slider-2.jpeg',
    title: 'Climatisation',
    description: 'Un air pur et une température idéale'
  },
  {
    id: 3,
    image: '/slider-3.jpg',
    title: 'Services Professionnels',
    description: "Une équipe d'experts à votre service",
  },
  {
    id: 4,
    image: '/slider-4.jpeg',
    title: 'Rénovation énergetique',
    description: 'Nous vous accompagnons dans la renovation'
  }
];

const Slider: React.FC<SliderProps> = ({ showOnPages = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(transitionTimer);
  }, [currentSlide]);

  // Vérifier si le slider doit être affiché sur la page actuelle
  const currentPath = window.location.pathname;
  if (showOnPages.length > 0 && !showOnPages.includes(currentPath)) {
    return null;
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? 'translate-x-0'
              : index < currentSlide
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-center text-white">
            <div className="max-w-4xl mx-auto text-center px-4">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 transform transition-all duration-700 translate-y-0 opacity-100 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                {slide.title}
              </h2>
              <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transform transition-all duration-700"></div>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
                {slide.description}
              </p>
             
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
        aria-label="Diapositive précédente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
        aria-label="Diapositive suivante"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider; 