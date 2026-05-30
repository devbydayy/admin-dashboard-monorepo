"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const { mutate: login, isPending: isLoading, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "password123",
    rememberMe: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.removeItem("manual_login_required");
    document.cookie = "prevent_auto_login=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    login({ email: formData.email, password: formData.password });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "var(--sa-body-bg)" }}
    >
      <div
        className="card shadow-sm"
        style={{
          maxWidth: 400,
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
              <LogIn size={32} className="text-white" />
            </div>
            <h4 className="fw-bold" style={{ color: "var(--sa-text-primary)" }}>
              Welcome Back
            </h4>
            <p className="text-muted small">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger py-2 small">
                {error instanceof Error ? error.message : "Login failed"}
              </div>
            )}

            <div className="mb-3">
              <label
                className="form-label small fw-medium"
                style={{ color: "var(--sa-text-secondary)" }}
              >
                Email Address
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                  }}
                >
                  <Mail size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
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
              <label
                className="form-label small fw-medium"
                style={{ color: "var(--sa-text-secondary)" }}
              >
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    backgroundColor: "var(--sa-card-bg)",
                    borderColor: "var(--sa-slate-200)",
                  }}
                >
                  <Lock size={18} style={{ color: "var(--sa-text-muted)" }} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  id="rememberMe"
                />
                <label
                  className="form-check-label small"
                  htmlFor="rememberMe"
                  style={{ color: "var(--sa-text-secondary)" }}
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="small"
                style={{
                  color: "var(--sa-link-color)",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-indigo w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center small text-muted mt-4 mb-0">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              style={{
                color: "var(--sa-link-color)",
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}