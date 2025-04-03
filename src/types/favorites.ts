export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  reference?: string;
  category?: string;
  brand?: string;
}

export interface FavoriteItem extends Product {
  quantity?: number;
  priceHT?: number;
  priceTTC?: number;
} 