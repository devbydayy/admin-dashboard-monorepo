"use client";

import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";

const DEMO_PRODUCTS = [
  { productId: "1", name: "Wireless Headphones", price: 10.03, image: null, quantitySold: 1245 },
  { productId: "2", name: "Smart Watch Series 8", price: 22.28, image: null, quantitySold: 842  },
  { productId: "3", name: "Gaming Keyboard",       price: 12.00, image: null, quantitySold: 621  },
  { productId: "4", name: "4K Action Camera",      price: 12.50, image: null, quantitySold: 512  },
  { productId: "5", name: "Laptop Backpack",        price: 5.00,  image: null, quantitySold: 487  },
];

interface TopProductItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantitySold: number;
}

interface TopProductsProps {
  data?: TopProductItem[];
  loading?: boolean;
}

export default function TopProducts({ data, loading }: TopProductsProps) {
  const products = data && data.length > 0 ? data : DEMO_PRODUCTS;

  if (loading) {
    return (
      <div className="sa-card" style={{ flex: 1, minHeight: 320 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <span className="sa-chart-title">Top Products</span>
          <span className="sa-view-all">View all</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="sa-skeleton" style={{ width: 40, height: 40, borderRadius: 8 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                <div className="sa-skeleton" style={{ height: 13, width: "75%" }} />
                <div className="sa-skeleton" style={{ height: 11, width: "45%" }} />
              </div>
              <div className="sa-skeleton" style={{ height: 13, width: 60 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sa-card" style={{ flex: 1, minHeight: 320 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <span className="sa-chart-title">Top Products</span>
        <Link href="/products" className="sa-view-all">View all</Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {products.map((product) => (
          <div
            key={product.productId}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <ProductImage src={product.image} alt={product.name} size={40} />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: "var(--sa-text-primary)",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--sa-text-muted)",
                    margin: "3px 0 0",
                  }}
                >
                  {product.quantitySold.toLocaleString()} sold
                </p>
              </div>
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "var(--sa-green)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              ${(product.price * product.quantitySold).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}