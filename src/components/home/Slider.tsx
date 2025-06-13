import React, { useState, useEffect, useCallback } from 'react';

interface SliderProps {
  showOnPages?: string[];
}

const slides = [
  {
    id: 1,
    image: "/slider/slider2.png",
    alt: "Matériaux de construction",
    title: "Matériaux haut de gamme",
    description: "Des solutions professionnelles pour tous vos projets de construction en neuf et rénovation.",
    cta: { text: "Nous connaitre", link: "/qui-sommes-nous" }
  },
  {
    id: 2,
    image: "/slider/slider4.png",
    alt: "Isolation performante",
    title: "Isolation & Performance",
    description: "Optimisez l'efficacité énergétique de vos bâtiments avec nos produits innovants.",
    cta: { text: "Decouvrir notre gamme", link: "/gamme" }
  }
];

const Slider: React.FC<SliderProps> = ({ showOnPages = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning && !isPaused) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  }, [isTransitioning, isPaused]);

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
    }
  }, [isTransitioning, currentSlide]);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(nextSlide, 6000);
      return () => clearInterval(timer);
    }
  }, [nextSlide, isPaused]);

  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(transitionTimer);
  }, [currentSlide]);

  // Vérifier si le slider doit être affiché sur la page actuelle
  const currentPath = window.location.pathname;
  if (showOnPages.length > 0 && !showOnPages.includes(currentPath)) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-[80vh] min-h-[700px] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Parallax Effect */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-all duration-[800ms] ease-out transform ${
            index === currentSlide
              ? 'translate-x-0 opacity-100 scale-100'
              : index < currentSlide
              ? '-translate-x-full opacity-0 scale-105'
              : 'translate-x-full opacity-0 scale-105'
          }`}
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-110"
            />
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
          </div>
        </div>
      ))}

      {/* Content Container with Glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`text-center transition-all duration-1000 ease-out ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                display: index === currentSlide ? 'block' : 'none'
              }}
            >
            

              {/* Main Title with Modern Typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-black mb-8 text-white leading-tight">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  {slide.title}
                </span>
              </h1>

              {/* Animated Separator */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full opacity-80"></div>
              </div>

              {/* Description with Enhanced Styling */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light mb-10 opacity-95">
                {slide.description}
              </p>

              {/* Modern CTA Button */}
              <div className="flex justify-center">
                <a
                  href={slide.cta.link}
                  className="group/btn relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 mr-2">{slide.cta.text}</span>
                  <svg
                    className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl group/nav opacity-0 group-hover:opacity-100"
        aria-label="Diapositive précédente"
      >
        <svg 
          className="w-6 h-6 mx-auto text-white transition-transform duration-300 group-hover/nav:-translate-x-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl group/nav opacity-0 group-hover:opacity-100"
        aria-label="Diapositive suivante"
      >
        <svg 
          className="w-6 h-6 mx-auto text-white transition-transform duration-300 group-hover/nav:translate-x-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-8 h-3' 
                  : 'w-3 h-3 hover:scale-125'
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            >
              <div
                className={`w-full h-full rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              ></div>
              {index === currentSlide && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
          style={{
            width: isPaused ? '100%' : `${((currentSlide + 1) / slides.length) * 100}%`,
            opacity: isPaused ? 0.5 : 1
          }}
        ></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default Slider; 