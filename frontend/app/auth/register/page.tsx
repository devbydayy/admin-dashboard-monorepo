"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { mutate: register, isPending: isLoading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    register({ name: formData.name, email: formData.email, password: formData.password });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "var(--sa-body-bg)" }}
    >
      <div
        className="card shadow-sm"
        style={{
          maxWidth: 450,
          width: "100%",
          backgroundColor: "var(--sa-card-bg)",
          border: "1px solid var(--sa-card-border)",
          borderRadius: "var(--sa-card-radius)",
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: 64,
                height: 64,
                backgroundColor: "var(--sa-indigo)",
              }}
            >
              <UserPlus size={32} className="text-white" />
            </div>
            <h4 className="fw-bold" style={{ color: "var(--sa-text-primary)" }}>
              Create Account
            </h4>
            <p className="text-muted small">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {(error || validationError) && (
              <div className="alert alert-danger py-2 small">
                {validationError || (error instanceof Error ? error.message : "Registration failed")}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: "var(--sa-card-bg)", borderColor: "var(--sa-slate-200)" }}>
                  <User size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                    color: "var(--sa-text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: "var(--sa-card-bg)", borderColor: "var(--sa-slate-200)" }}>
                  <Mail size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                    color: "var(--sa-text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: "var(--sa-card-bg)", borderColor: "var(--sa-slate-200)" }}>
                  <Lock size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                    color: "var(--sa-text-primary)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ borderColor: "var(--sa-slate-200)", backgroundColor: "var(--sa-card-bg)" }}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: "var(--sa-card-bg)", borderColor: "var(--sa-slate-200)" }}>
                  <Lock size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                    color: "var(--sa-text-primary)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ borderColor: "var(--sa-slate-200)", backgroundColor: "var(--sa-card-bg)" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-indigo w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center small text-muted mt-4 mb-0">
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--sa-link-color)", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}