import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products.api";
import type { CreateProductData, UpdateProductData } from "@/types/product.types";

const PRODUCTS_KEY = ["products"] as const;

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: productsApi.getAll });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, id],
    queryFn:  () => productsApi.getById(id),
    enabled:  !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductData) => productsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductData) => productsApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      qc.setQueryData([...PRODUCTS_KEY, id], updated);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}