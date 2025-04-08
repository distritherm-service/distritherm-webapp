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
  inStock: boolean;
  model?: string;
  reference?: string;
  features: string[];
  specifications: Array<{
    key: string;
    value: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
    logo: string;
  };
  warranty?: string;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
    weight: number;
  };
  energyClass?: string;
  installationRequirements?: string;
  relatedProducts?: string[];
} 