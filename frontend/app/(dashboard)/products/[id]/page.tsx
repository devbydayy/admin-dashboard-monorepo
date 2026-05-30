"use client";

import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, Edit2, Save, X, CheckCircle2, Package } from "lucide-react";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useOrders } from "@/hooks/useOrders";
import { useUploadFile } from "@/hooks/useUpload";
import type { Product } from "@/types/product.types";

import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductSidebar } from "@/components/products/ProductSidebar";
import { ProductOverviewTab } from "@/components/products/ProductOverviewTab";
import { ProductInventoryTab } from "@/components/products/ProductInventoryTab";
import { ProductPricingTab } from "@/components/products/ProductPricingTab";
import { ProductImagesTab } from "@/components/products/ProductImagesTab";
import { ProductPerformance } from "@/components/products/ProductPerformance";
import { ProductRecentOrders } from "@/components/products/ProductRecentOrders";

const TABS = ["Overview", "Inventory", "Pricing", "Variants", "Images", "SEO", "Activity"];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const { data: product, isLoading } = useProduct(id);
  const { data: categories } = useCategories();
  const { data: allOrders } = useOrders();
  const updateMutation = useUpdateProduct(id);
  const uploadMutation = useUploadFile("/api/upload/product-image", "image");

  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) setForm({ ...product });
  }, [product]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const parseFeatures = (raw?: string | null): string[] => {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  };

  const parseImages = (raw?: string | null): string[] => {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  };

  const mainImages = product
    ? [...(product.imageUrl ? [product.imageUrl] : []), ...parseImages(product.images)]
    : [];

  const handleFileChange = useCallback(
    async (file: File) => {
      const url = await uploadMutation.mutateAsync(file);
      setField("imageUrl", url);
    },
    [uploadMutation, setField]
  );

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      salePrice: form.salePrice,
      stock: form.stock,
      status: form.status,
      categoryId: form.categoryId,
      imageUrl: form.imageUrl,
      sku: form.sku,
      brand: form.brand,
      weight: form.weight,
      productType: form.productType,
      features: form.features,
      taxClass: form.taxClass,
      taxRate: form.taxRate,
      lowStockThreshold: form.lowStockThreshold,
      warehouse: form.warehouse,
      warehouseLocation: form.warehouseLocation,
      lowStockAlertEnabled: form.lowStockAlertEnabled,
    } as Partial<Product>;

    await updateMutation.mutateAsync(payload);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const p = isEditing ? form : product;
  const discountPct =
    p?.price && p?.salePrice
      ? Math.round(((p.price - p.salePrice) / p.price) * 100)
      : p?.discount ?? 0;
  const stockMax = Math.max((p?.stock ?? 0) + 55, 200);
  const stockPct = Math.min(100, Math.round(((p?.stock ?? 0) / stockMax) * 100));

  if (isLoading || !product) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="sa-skeleton" style={{ height: 22, width: 160 }} />
        <div className="sa-skeleton" style={{ height: 36, width: 240 }} />
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="sa-card">
              <div className="sa-skeleton" style={{ height: 280, borderRadius: 8 }} />
            </div>
          </div>
          <div className="col-12 col-xl-5">
            <div className="sa-card">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="sa-skeleton" style={{ height: 14, marginBottom: 14 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Link href="/products" className="sa-back-link">
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--sa-text-primary)", margin: 0 }}>
          Product Details
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveSuccess && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8125rem", color: "var(--sa-green)", fontWeight: 500 }}>
              <CheckCircle2 size={15} /> Saved
            </span>
          )}
          {isEditing ? (
            <>
              <button className="sa-btn-outline" onClick={() => { setIsEditing(false); setForm({ ...product }); }}>
                <X size={14} /> Cancel
              </button>
              <button className="sa-btn-primary" onClick={handleSave} disabled={updateMutation.isPending}>
                <Save size={14} /> {updateMutation.isPending ? "Saving…" : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button className="sa-btn-outline"><Copy size={14} /> Duplicate</button>
              <button className="sa-btn-outline"><ExternalLink size={14} /> View Product</button>
              <button className="sa-btn-primary" onClick={() => setIsEditing(true)}>
                <Edit2 size={14} /> Edit Product
              </button>
            </>
          )}
        </div>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-7">
          <ProductInfo
            product={product}
            isEditing={isEditing}
            form={form}
            setField={setField}
            categories={categories}
            handleFileChange={handleFileChange}
            isUploading={uploadMutation.isPending}
            mainImages={mainImages}
            activeThumb={activeThumb}
            setActiveThumb={setActiveThumb}
            onEditClick={() => setIsEditing(true)}
            onSaveClick={handleSave}
            onCancelEdit={() => { setIsEditing(false); setForm({ ...product }); }}
            saveSuccess={saveSuccess}
            updatePending={updateMutation.isPending}
          />
        </div>
        <div className="col-12 col-xl-5">
          <ProductSidebar
            product={product}
            isEditing={isEditing}
            form={form}
            setField={setField}
          />
        </div>
      </div>

      <div className="sa-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`sa-tab-btn${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <ProductOverviewTab
          product={product}
          isEditing={isEditing}
          form={form}
          setField={setField}
          parseFeatures={parseFeatures}
          discountPct={discountPct}
          stockPct={stockPct}
          stockMax={stockMax}
        />
      )}
      {activeTab === "Inventory" && <ProductInventoryTab product={product} isEditing={isEditing} />}
      {activeTab === "Pricing" && <ProductPricingTab product={product} isEditing={isEditing} />}
      {activeTab === "Images" && (
        <ProductImagesTab
          currentImageUrl={form.imageUrl ?? product.imageUrl}
          onFileSelect={handleFileChange}
          isUploading={uploadMutation.isPending}
          mainImages={mainImages}
        />
      )}
      {["Variants", "SEO", "Activity"].includes(activeTab) && (
        <div className="sa-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 8 }}>
          <Package size={36} color="var(--sa-text-muted)" />
          <p style={{ color: "var(--sa-text-muted)", fontSize: "0.875rem", margin: 0 }}>
            {activeTab} management coming soon.
          </p>
        </div>
      )}

      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-7">
          <ProductRecentOrders />
        </div>
        <div className="col-12 col-xl-5">
          <ProductPerformance product={product} />
        </div>
      </div>
    </div>
  );
}