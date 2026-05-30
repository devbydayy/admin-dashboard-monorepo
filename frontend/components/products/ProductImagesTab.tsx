import { ProductImageUpload } from "./ProductImageUpload";
import ProductImage from "@/components/ui/ProductImage";

interface Props {
  currentImageUrl: string | null | undefined;
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  mainImages: string[];
}

export function ProductImagesTab({ currentImageUrl, onFileSelect, isUploading, mainImages }: Props) {
  return (
    <div className="sa-card">
      <h3 style={{ fontWeight: 600, color: "var(--sa-text-primary)", marginBottom: 14 }}>Product Images</h3>
      <ProductImageUpload currentImageUrl={currentImageUrl} onFileSelect={onFileSelect} isUploading={isUploading} />
        {mainImages.length > 0 && (
        <div className="sa-product-thumb-row" style={{ marginTop: 16 }}>
          {mainImages.map((src, idx) => (
          <div key={idx} className="sa-product-thumb-item active" style={{ width: 80, height: 80 }}>
              <ProductImage
              src={src}
              alt={`img-${idx}`}
              size={72}
              />
          </div>
          ))}
      </div>
      )}
    </div>
  );
}