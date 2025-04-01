import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  priceHT: number;
  priceTTC: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'priceHT' | 'priceTTC'> & { price: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'priceHT' | 'priceTTC'> & { price: number }) => {
    // On suppose que le prix passé est TTC
    const priceTTC = item.price;
    const priceHT = item.price / 1.2; // TVA à 20%
    
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, priceHT, priceTTC }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const isInCart = (id: string) => cart.some(item => item.id === id);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 