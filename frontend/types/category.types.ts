export interface Category {
  id:        string;
  name:      string;
  slug:      string;
  type:      string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}