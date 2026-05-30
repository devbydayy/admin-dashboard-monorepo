"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "modal-sm",
  md: "",
  lg: "modal-lg",
  xl: "modal-xl",
  full: "modal-fullscreen",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1055 }}
        onClick={onClose}
      />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1056 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className={cn("modal-dialog modal-dialog-centered", sizeClasses[size])}>
          <div
            className="modal-content"
            style={{
              backgroundColor: "var(--sa-card-bg)",
              border: "1px solid var(--sa-slate-200)",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {(title || showCloseButton) && (
              <div
                className="modal-header"
                style={{
                  borderBottom: "1px solid var(--sa-slate-200)",
                  padding: "1rem 1.5rem",
                }}
              >
                <div>
                  {title && (
                    <h5 className="modal-title fw-semibold" style={{ color: "var(--sa-text-primary)" }}>
                      {title}
                    </h5>
                  )}
                  {description && (
                    <p className="text-muted small mb-0">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button type="button" className="btn-close" onClick={onClose} />
                )}
              </div>
            )}
            <div className="modal-body" style={{ padding: "1rem" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("d-flex justify-content-end gap-2 mt-4 pt-3", className)}
      style={{ borderTop: "1px solid var(--sa-slate-200)" }}
    >
      {children}
    </div>
  );
}