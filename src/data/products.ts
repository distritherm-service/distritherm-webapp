export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    title: "POMPE À CHALEUR SPLIT 5 À 17 KW HAUTE TEMPÉRATURE ALFEA EXCELLIA HP (50°C)",
    description: "Pompe à chaleur monobloc ATLANTIC pour une haute efficacité énergétique",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "POMPE À CHALEUR",
    subcategory: "Split",
    brand: "ATLANTIC",
    price: 3999.99,
    inStock: true,
    featured: true
  },
  {
    id: "2",
    title: "POMPE À CHALEUR MONOPHASÉE MOYENNE TEMPÉRATURE ALFEA EXCELLIA DUO AI",
    description: "Système hybride ATLANTIC combinant pompe à chaleur et chaudière",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "POMPE À CHALEUR",
    subcategory: "Monobloc",
    brand: "ATLANTIC",
    price: 4599.99,
    inStock: true
  },
  {
    id: "3",
    title: "POMPE À CHALEUR SPLIT 5 À 17 KW HAUTE TEMPÉRATURE ALFEA EXCELLIA DUO AI",
    description: "Solution de chauffage ATLANTIC haute performance",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "POMPE À CHALEUR",
    subcategory: "Split",
    brand: "ATLANTIC",
    price: 4199.99,
    inStock: true
  },
  {
    id: "4",
    title: "POMPE À CHALEUR SPLIT 5 À 17 KW MOYENNE TEMPÉRATURE ALFEA EXCELLIA DUO AI THERMOR",
    description: "Système complet avec thermostat intelligent ATLANTIC",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "POMPE À CHALEUR",
    subcategory: "Split",
    brand: "THERMOR",
    price: 3899.99,
    inStock: true,
    featured: true
  },
  {
    id: "5",
    title: "SPLIT MURAL UNITÉ EXTÉRIEURE AEROMAX SPLIT 2 (PAC) THERMOR",
    description: "Unité extérieure performante pour système split THERMOR",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CLIMATISATION",
    subcategory: "Unité extérieure",
    brand: "THERMOR",
    price: 1899.99,
    inStock: true
  },
  {
    id: "6",
    title: "CHAUFFE-EAU THERMODYNAMIQUE AEROMAX 5 200L / 250L THERMOR",
    description: "Chauffe-eau nouvelle génération à haute efficacité THERMOR",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "EAU CHAUDE SANITAIRE",
    subcategory: "Thermodynamique",
    brand: "THERMOR",
    price: 2499.99,
    inStock: true,
    featured: true
  },
  {
    id: "7",
    title: "SPLIT MURAL UNITÉ EXTÉRIEURE AEROMAX SPLIT 2 (PAC) THERMOR",
    description: "Solution de climatisation split murale THERMOR",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CLIMATISATION",
    subcategory: "Unité extérieure",
    brand: "THERMOR",
    price: 1999.99,
    inStock: false
  },
  {
    id: "8",
    title: "CHAUFFE-EAU THERMODYNAMIQUE 200 / 270L PERFORMER+ THERMOR",
    description: "Chauffe-eau performant avec technologie avancée THERMOR",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "EAU CHAUDE SANITAIRE",
    subcategory: "Thermodynamique",
    brand: "THERMOR",
    price: 2299.99,
    inStock: true
  },
  {
    id: "9",
    title: "ONDULEUR PHOTOVOLTAÏQUE MONOPHASÉ SOLAREDGE HD WAVE SOLAREDGE",
    description: "Solution photovoltaïque innovante SOLAREDGE",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "ONDULEUR",
    subcategory: "Monophasé",
    brand: "SOLAREDGE",
    price: 1299.99,
    inStock: true
  },
  {
    id: "10",
    title: "OPTIMISEUR DE PUISSANCE SÉRIE P400 SOLAREDGE",
    description: "Optimiseur de performance pour installation solaire SOLAREDGE",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "ONDULEUR",
    subcategory: "Accessoires",
    brand: "SOLAREDGE",
    price: 129.99,
    inStock: true
  },
  {
    id: "11",
    title: "ONDULEUR PHOTOVOLTAÏQUE MONOPHASÉ SOLAREDGE HD WAVE SOLAREDGE",
    description: "Onduleur haute performance pour système solaire SOLAREDGE",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "ONDULEUR",
    subcategory: "Monophasé",
    brand: "SOLAREDGE",
    price: 1499.99,
    inStock: true,
    featured: true
  },
  {
    id: "12",
    title: "CHAUDIÈRE À CONDENSATION MURALE GAZ NAEMA DUO ATLANTIC",
    description: "Chaudière gaz à condensation à très haut rendement",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Chaudière",
    brand: "ATLANTIC",
    price: 2199.99,
    inStock: true
  },
  {
    id: "13",
    title: "RADIATEUR ÉLECTRIQUE CONNECTÉ IRISIUM ATLANTIC",
    description: "Radiateur intelligent avec pilotage à distance",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Radiateur",
    brand: "ATLANTIC",
    price: 799.99,
    inStock: true
  },
  {
    id: "14",
    title: "VENTILATION DOUBLE FLUX DUOCOSY HR ATLANTIC",
    description: "Système de ventilation avec récupération de chaleur",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "VENTILATION",
    subcategory: "Double flux",
    brand: "ATLANTIC",
    price: 1899.99,
    inStock: true
  },
  {
    id: "15",
    title: "VMC SIMPLE FLUX HYGRORÉGLABLE AUTOCOSY IH FLEX ATLANTIC",
    description: "Ventilation mécanique contrôlée simple et efficace",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "VENTILATION",
    subcategory: "Simple flux",
    brand: "ATLANTIC",
    price: 599.99,
    inStock: true
  },
  {
    id: "16",
    title: "PANNEAU RAYONNANT CONNECTÉ DIVALI PREMIUM ATLANTIC",
    description: "Panneau rayonnant avec détection d'occupation",
    image: "/src/assets/image-produit-defaut.jpeg",
    category: "CHAUFFAGE",
    subcategory: "Panneau rayonnant",
    brand: "ATLANTIC",
    price: 549.99,
    inStock: true
  }
];

// Fonctions utilitaires pour les filtres
export const getAllCategories = (): string[] => {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
};

export const getSubcategoriesByCategory = (category: string): string[] => {
  const subcategories = new Set(
    products
      .filter(product => product.category === category)
      .map(product => product.subcategory)
  );
  return Array.from(subcategories);
};

export const getAllBrands = (): string[] => {
  const brands = new Set(products.map(product => product.brand));
  return Array.from(brands);
};

export const getPriceRange = (): { min: number; max: number } => {
  const prices = products.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}; 