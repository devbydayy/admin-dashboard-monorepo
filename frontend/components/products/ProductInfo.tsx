"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Package, Tag, ShoppingBag, Calendar, Clock, Truck, Edit2, Save, X, Copy, ExternalLink, ChevronDown, CheckCircle2
} from "lucide-react";
import { Stars } from "./Stars";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductImageUpload } from "./ProductImageUpload";
import type { Product } from "@/types/product.types";
import ProductImage from "@/components/ui/ProductImage";

interface Props {
  product: Product;
  isEditing: boolean;
  form: Partial<Product>;
  setField: <K extends keyof Product>(key: K, value: Product[K]) => void;
  categories?: any[] | undefined;
  handleFileChange: (file: File) => void;
  isUploading: boolean;
  mainImages: string[];
  activeThumb: number;
  setActiveThumb: (idx: number) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelEdit: () => void;
  saveSuccess: boolean;
  updatePending: boolean;
}

export function ProductInfo({
  product,
  isEditing,
  form,
  setField,
  categories,
  handleFileChange,
  isUploading,
  mainImages,
  activeThumb,
  setActiveThumb,
  onEditClick,
  onSaveClick,
  onCancelEdit,
  saveSuccess,
  updatePending,
}: Props) {
  const parseFeatures = (raw?: string | null): string[] => {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  };

  return (
    <div className="sa-card">
      <div className="row g-4">
        <div className="col-12 col-sm-5">
          {isEditing ? (
            <div>
              <ProductImageUpload
                currentImageUrl={form.imageUrl ?? null}
                onFileSelect={handleFileChange}
                isUploading={isUploading}
              />
              <div style={{ marginTop: 10 }}>
                <label className="sa-form-label">Or paste image URL</label>
                <input
                  type="text"
                  className="sa-form-control"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => setField("imageUrl", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 10,
                  border: "1px solid var(--sa-card-border)",
                  backgroundColor: "var(--sa-slate-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: 10,
                }}
              >
                {mainImages[activeThumb] ? (
                <ProductImage
                    src={mainImages[activeThumb]}
                    alt={product.name}
                    size={220}
                />
                ) : (
                  <Package size={64} color="var(--sa-text-muted)" />
                )}
              </div>

              <div className="sa-product-thumb-row">
                {mainImages.length > 0 ? (
                  mainImages.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`sa-product-thumb-item${mainImages.length > 1 && activeThumb === idx ? " active" : ""}`}
                    >
                      <ProductImage
                        src={src}
                        alt={`thumb-${idx}`}
                        size={54}
                      />
                    </button>
                  ))
                ) : (
                  <div className="sa-product-thumb-item" style={{ cursor: "default" }}>
                    <ProductImage src={null} alt="placeholder" size={64} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-12 col-sm-7">
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="sa-form-label">Product Name</label>
                <input
                  type="text"
                  className="sa-form-control"
                  value={form.name ?? ""}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="sa-form-label">SKU</label>
                  <input
                    type="text"
                    className="sa-form-control"
                    value={form.sku ?? ""}
                    onChange={(e) => setField("sku", e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Brand</label>
                  <input
                    type="text"
                    className="sa-form-control"
                    value={form.brand ?? ""}
                    onChange={(e) => setField("brand", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="sa-form-label">Description</label>
                <textarea
                  className="sa-form-control"
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="sa-form-label">Regular Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="sa-form-control"
                    value={form.price ?? ""}
                    onChange={(e) => setField("price", parseFloat(e.target.value))}
                  />
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Sale Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="sa-form-control"
                    value={form.salePrice ?? ""}
                    onChange={(e) => setField("salePrice", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="sa-form-label">Category</label>
                  <select
                    className="sa-form-control"
                    value={form.categoryId ?? ""}
                    onChange={(e) => setField("categoryId", e.target.value)}
                  >
                    <option value="">None</option>
                    {(categories ?? []).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Product Type</label>
                  <select
                    className="sa-form-control"
                    value={form.productType ?? "Simple Product"}
                    onChange={(e) => setField("productType", e.target.value)}
                  >
                    <option>Simple Product</option>
                    <option>Variable Product</option>
                    <option>Digital Product</option>
                    <option>Bundle</option>
                  </select>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="sa-form-label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="sa-form-control"
                    value={form.weight ?? ""}
                    onChange={(e) => setField("weight", e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className="col-6">
                  <label className="sa-form-label">Status</label>
                  <select
                    className="sa-form-control"
                    value={form.status ?? "ACTIVE"}
                    onChange={(e) => setField("status", e.target.value as Product["status"])}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="sa-form-label">Features (one per line)</label>
                <textarea
                  className="sa-form-control"
                  rows={4}
                  value={parseFeatures(form.features).join("\n")}
                  onChange={(e) =>
                    setField(
                      "features",
                      JSON.stringify(e.target.value.split("\n").filter((l) => l.trim()))
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--sa-text-primary)", margin: "0 0 8px" }}>
                {product.name}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {product.sku && (
                  <span style={{ fontSize: "0.8125rem", color: "var(--sa-text-muted)" }}>
                    SKU: {product.sku}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="sa-badge sa-badge-delivered" style={{ fontSize: "0.7rem" }}>
                    In Stock
                  </span>
                ) : (
                  <span className="sa-badge sa-badge-cancelled">Out of Stock</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Stars rating={product.avgRating ?? 4.5} />
                <span style={{ fontSize: "0.8125rem", color: "var(--sa-indigo)", fontWeight: 500 }}>
                  ({(product.reviewCount ?? 128).toLocaleString()} reviews)
                </span>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--sa-text-primary)", marginBottom: 10 }}>
                ${(product.salePrice ?? product.price).toFixed(2)}
              </div>
              {product.description && (
                <p style={{ fontSize: "0.875rem", color: "var(--sa-text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
                  {product.description}
                </p>
              )}
              <div className="sa-meta-grid">
                <div>
                  <div className="sa-meta-item-label"><Tag size={12} /> Category</div>
                  <div className="sa-meta-item-value accent">{product.category?.name ?? "—"}</div>
                </div>
                <div>
                  <div className="sa-meta-item-label"><Package size={12} /> Type</div>
                  <div className="sa-meta-item-value">{product.productType ?? "Simple Product"}</div>
                </div>
                <div>
                  <div className="sa-meta-item-label"><ShoppingBag size={12} /> Brand</div>
                  <div className="sa-meta-item-value">{product.brand ?? "—"}</div>
                </div>
                <div>
                  <div className="sa-meta-item-label"><Calendar size={12} /> Created On</div>
                  <div className="sa-meta-item-value">
                    {new Date(product.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div>
                  <div className="sa-meta-item-label"><Truck size={12} /> Weight</div>
                  <div className="sa-meta-item-value">{product.weight != null ? `${product.weight} kg` : "—"}</div>
                </div>
                <div>
                  <div className="sa-meta-item-label"><Clock size={12} /> Last Updated</div>
                  <div className="sa-meta-item-value">
                    {new Date(product.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}