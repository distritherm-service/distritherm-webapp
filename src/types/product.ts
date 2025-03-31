export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: string; // 'fiche_technique' | 'manuel' | 'certification'
  url: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  reference: string;
  inStock: boolean;
  specifications: ProductSpecification[];
  documents: ProductDocument[];
  features: string[];
  relatedProducts: string[]; // IDs des produits connexes
  warranty: string;
  dimensions: {
    height: number;
    width: number;
    depth: number;
    weight: number;
  };
  energyClass?: string;
  installationRequirements?: string;
} 