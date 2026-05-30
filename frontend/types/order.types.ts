export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string; 
  customer?: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface CreateOrderData {
  customerId: string;
  items: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  total?: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  customerId?: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}