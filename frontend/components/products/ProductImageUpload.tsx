"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import ProductImage from "@/components/ui/ProductImage";

interface Props {
  currentImageUrl: string | null | undefined;
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function ProductImageUpload({ currentImageUrl, onFileSelect, isUploading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFileSelect(file);
  };

  return (
    <div>
      <div
        className={`sa-upload-zone${dragOver ? " drag-over" : ""}`}
        style={{ marginBottom: 10, cursor: "pointer" }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
          {currentImageUrl ? (
          <div style={{ width: "100%", aspectRatio: "1" }}>
              <ProductImage
              src={currentImageUrl}
              alt="product"
              size={300}
              />
          </div>
          ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "16px 0",
            }}
          >
            <Upload size={28} color="var(--sa-text-muted)" />
            <p style={{ fontSize: "0.8125rem", color: "var(--sa-text-secondary)", margin: 0 }}>
              Click or drag an image here
            </p>
            <p style={{ fontSize: "0.72rem", color: "var(--sa-text-muted)", margin: 0 }}>
              JPG, PNG, WEBP up to 5 MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileInput}
      />
      {isUploading && (
        <p style={{ fontSize: "0.75rem", color: "var(--sa-indigo)", margin: "6px 0 0" }}>
          Uploading…
        </p>
      )}
    </div>
  );
}