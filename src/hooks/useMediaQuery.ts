import { useState, useEffect } from 'react';

// Breakpoints correspondant à TailwindCSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook personnalisé pour gérer les media queries
 * @param query - La media query à surveiller
 * @returns true si la media query correspond, false sinon
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

/**
 * Hook pour vérifier si l'écran est mobile
 * @returns true si l'écran est de taille mobile, false sinon
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
};

/**
 * Hook pour vérifier si l'écran est une tablette
 * @returns true si l'écran est de taille tablette, false sinon
 */
export const useIsTablet = (): boolean => {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
};

/**
 * Hook pour vérifier si l'écran est un ordinateur
 * @returns true si l'écran est de taille ordinateur, false sinon
 */
export const useIsDesktop = (): boolean => {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
};

/**
 * Hook pour obtenir le breakpoint actuel
 * @returns La clé du breakpoint actuel ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export const useBreakpoint = (): 'xs' | BreakpointKey => {
  const [breakpoint, setBreakpoint] = useState<'xs' | BreakpointKey>('xs');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.sm) {
        setBreakpoint('xs');
      } else if (width < breakpoints.md) {
        setBreakpoint('sm');
      } else if (width < breakpoints.lg) {
        setBreakpoint('md');
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg');
      } else if (width < breakpoints['2xl']) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => {
      window.removeEventListener('resize', checkBreakpoint);
    };
  }, []);

  return breakpoint;
};

/**
 * Hook pour détecter si l'utilisateur est sur un appareil tactile
 * @returns true si l'appareil est tactile, false sinon
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
    
    setIsTouch(isTouchDevice);
  }, []);

  return isTouch;
}; 