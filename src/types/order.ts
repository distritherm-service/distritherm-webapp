export interface Order {
  id: number;
  status: OrderStatus;
  factureFileUrl: string;
  createdAt: string;
  updatedAt: string;
  cart: CartReference;
  deliveryAddress: AddressReference;
  facturationAddress: AddressReference;
  devis: DevisReference[];
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface CartReference {
  id: number;
}

export interface AddressReference {
  id: number;
}

export interface DevisReference {
  id: number;
}

export interface CreateOrderRequest {
  cartId: number;
  deliveryAddressId: number;
  facturationAddressId: number;
  status?: OrderStatus;
  devisId?: number;
  factureFileUrl?: string;
}

export interface UpdateOrderRequest {
  deliveryAddressId?: number;
  facturationAddressId?: number;
  status?: OrderStatus;
  devisId?: number;
  factureFileUrl?: string;
}

export interface OrderResponse {
  message: string;
  order: Order;
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface ErrorResponse {
  message: string;
} 