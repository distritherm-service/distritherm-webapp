interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  level3Category?: string;
  level4Category?: string;
  image: string;
  brand: string;
  stock: number;
  reference: string;
  isNew?: boolean;
  isPromo?: boolean;
  promoPrice?: number;
}

export const products: Product[] = [
  // Platerie - BA13
  {
    id: "p1",
    name: "Plaque BA13 Standard",
    description: "Plaque de plâtre standard pour cloisons et plafonds",
    price: 12.99,
    category: "Platerie",
    subCategory: "BA13",
    image: "/images/products/ba13-standard.jpg",
    brand: "Placo",
    stock: 150,
    reference: "BA13-STD-01"
  },
  {
    id: "p2",
    name: "BA13 Hydrofuge",
    description: "Plaque hydrofuge pour pièces humides",
    price: 18.99,
    category: "Platerie",
    subCategory: "BA13",
    image: "/images/products/ba13-hydro.jpg",
    brand: "Knauf",
    stock: 75,
    reference: "BA13-HYD-02",
    isNew: true
  },
  {
    id: "p3",
    name: "BA13 Phonique",
    description: "Plaque acoustique pour isolation sonore",
    price: 24.99,
    category: "Platerie",
    subCategory: "BA13",
    image: "/images/products/ba13-phonique.jpg",
    brand: "Placo",
    stock: 60,
    reference: "BA13-PHO-03"
  },

  // Isolation - Intérieure
  {
    id: "i1",
    name: "Laine de verre 100mm",
    description: "Isolation thermique et acoustique pour murs et combles",
    price: 29.99,
    category: "Isolation",
    subCategory: "Isolation Intérieure",
    image: "/images/products/laine-verre.jpg",
    brand: "Isover",
    stock: 200,
    reference: "ISO-LV-01"
  },
  {
    id: "i2",
    name: "Polystyrène expansé 60mm",
    description: "Panneau isolant pour murs intérieurs",
    price: 15.99,
    category: "Isolation",
    subCategory: "Isolation Intérieure",
    image: "/images/products/polystyrene.jpg",
    brand: "Knauf",
    stock: 120,
    reference: "ISO-PS-02",
    isPromo: true,
    promoPrice: 12.99
  },
  {
    id: "i3",
    name: "Laine de roche 45mm",
    description: "Isolation coupe-feu haute performance",
    price: 34.99,
    category: "Isolation",
    subCategory: "Isolation Intérieure",
    image: "/images/products/laine-roche.jpg",
    brand: "Rockwool",
    stock: 85,
    reference: "ISO-LR-03"
  },

  // Chauffage - Pompes à chaleur
  {
    id: "c1",
    name: "PAC Air/Air 3.5kW",
    description: "Pompe à chaleur réversible pour appartement",
    price: 1299.99,
    category: "Chauffage",
    subCategory: "Pompes à chaleur",
    image: "/images/products/pac-air.jpg",
    brand: "Daikin",
    stock: 10,
    reference: "PAC-AA-01",
    isNew: true
  },
  {
    id: "c2",
    name: "PAC Air/Eau 8kW",
    description: "Pompe à chaleur pour chauffage central",
    price: 3499.99,
    category: "Chauffage",
    subCategory: "Pompes à chaleur",
    image: "/images/products/pac-eau.jpg",
    brand: "Atlantic",
    stock: 5,
    reference: "PAC-AE-02"
  },
  {
    id: "c3",
    name: "PAC Géothermique 12kW",
    description: "Pompe à chaleur géothermique haute efficacité",
    price: 5999.99,
    category: "Chauffage",
    subCategory: "Pompes à chaleur",
    image: "/images/products/pac-geo.jpg",
    brand: "Viessmann",
    stock: 3,
    reference: "PAC-GEO-03",
    isPromo: true,
    promoPrice: 4999.99
  }
];

export type { Product }; 