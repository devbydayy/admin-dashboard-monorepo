export interface OverviewData {
  revenue: number;
  orders: number;
  customers: number;
  conversionRate: number;
  topProducts: TopProductItem[];
}

export interface TopProductItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantitySold: number;
}

export interface SalesReportItem {
  id: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface SalesReport {
  periodSales: number;
  orderCount: number;
  topProducts: {
    product: string;
    quantity: number;
  }[];
}

export interface AnalyticsSnapshot {
  createdAt: string;
  data: {
    stats: {
      totalRevenue: number;
      totalOrders: number;
      newCustomers?: number;
    };
  };
}

export interface RevenueDataPoint {
  name: string;
  value: number;
}

export interface OrderDataPoint {
  name: string;
  value: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface CategorySalesItem {
  name: string;
  value: number;
  color: string;
}

export interface RealtimeAnalyticsUpdate {
  period: string;
  timestamp: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    newCustomers: number;
  };
}

export interface RealtimeStats {
  activeUsers: number;
  currentOrders: number;
  recentSales: number;
}

export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer?: {
    name: string;
  };
}

export type DashboardStats = OverviewData;
export type RecentOrder = SalesReportItem;
export type LowStockProduct = {
  id: string;
  name: string;
  stock: number;
  category: { name: string };
};
export type CategorySales = { name: string; productCount: number };
export type TopProduct = { product: string; quantity: number };