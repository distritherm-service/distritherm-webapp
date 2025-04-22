import React from 'react';
import { FaWrench, FaTemperatureHigh, FaSnowflake, FaToilet, FaWater, FaPlug, FaTools, FaHardHat } from 'react-icons/fa';

export interface Category {
  title: string;
  image: string;
  icon: string;
  slug: string;
}

// Les catégories pour l'affichage dans la grille
export const categories: Category[] = [
  {
    title: 'Plâtrerie',
    image: '/image-categorie-defaut.jpeg',
    icon: 'wrench',
    slug: 'platrerie'
  },
  {
    title: 'Chauffage',
    image: '/image-categorie-defaut.jpeg',
    icon: 'temperature-high',
    slug: 'chauffage'
  },
  {
    title: 'Climatisation',
    image: '/image-categorie-defaut.jpeg',
    icon: 'snowflake',
    slug: 'climatisation'
  },
  {
    title: 'Sanitaire',
    image: '/image-categorie-defaut.jpeg',
    icon: 'toilet',
    slug: 'sanitaire'
  },
  {
    title: 'Plomberie',
    image: '/image-categorie-defaut.jpeg',
    icon: 'water',
    slug: 'plomberie'
  },
  {
    title: 'Électricité',
    image: '/image-categorie-defaut.jpeg',
    icon: 'plug',
    slug: 'electricite'
  },
  {
    title: 'Outillage',
    image: '/image-categorie-defaut.jpeg',
    icon: 'tools',
    slug: 'outillage'
  },
  {
    title: 'EPI',
    image: '/image-categorie-defaut.jpeg',
    icon: 'hard-hat',
    slug: 'epi'
  }
]; 