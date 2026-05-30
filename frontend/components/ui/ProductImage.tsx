"use client";
import { useState } from "react";
import { Package } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export default function ProductImage({
  src,
  alt,
  size = 40,
  className = "rounded-2",
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div
        className={`d-flex align-items-center justify-content-center ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: "var(--sa-slate-100)",
        }}
      >
        <Package size={size * 0.5} style={{ color: "var(--sa-text-muted)" }} />
      </div>
    );
  }

  return (
    <div
      className={`position-relative ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--sa-slate-100)",
      }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <Package size={size * 0.5} style={{ color: "var(--sa-text-muted)" }} />
      </div>

      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{
          position: "relative",
          zIndex: 1,
          objectFit: "cover",
          display: loaded && !error ? "block" : "none",
        }}
        onLoad={() => {
          setLoaded(true);
          setError(false);
        }}
        onError={() => {
          setError(true);
          setLoaded(false);
        }}
      />
    </div>
  );
}