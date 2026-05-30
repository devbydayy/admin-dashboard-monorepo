import type { Category } from "./category.types";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export interface Product {
  id:          string;
  name:        string;
  description?: string;
  price:       number;
  salePrice?:  number | null;
  discount?:   number;
  stock:       number;
  imageUrl?:   string | null;
  images?:     string | null;
  status:      ProductStatus;
  categoryId?: string | null;
  createdAt:   string;
  updatedAt:   string;
  category?:   Category;

  sku?:                  string | null;
  brand?:                string | null;
  weight?:               number | null;
  productType?:          string | null;
  features?:             string | null;
  taxClass?:             string | null;
  taxRate?:              number | null;
  lowStockThreshold?:    number | null;
  warehouse?:            string | null;
  warehouseLocation?:    string | null;
  lowStockAlertEnabled?: boolean | null;
  views?:                number | null;
  avgRating?:            number | null;
  reviewCount?:          number | null;
}

export type CreateProductData = Omit<Product, "id" | "createdAt" | "updatedAt" | "category">;

export type UpdateProductData = Partial<CreateProductData>;

export interface ProductFilters {
  categoryId?: string;
  status?:     ProductStatus;
  minPrice?:   number;
  maxPrice?:   number;
  search?:     string;
}