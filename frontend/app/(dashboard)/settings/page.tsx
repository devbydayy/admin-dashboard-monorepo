"use client";

import { useState, useEffect } from "react";
import { Save, Bell, Shield, Globe } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    siteName: "",
    supportEmail: "",
    currency: "USD",
    timezone: "UTC",
    notifications: {
      newOrder: true,
      lowStock: true,
      newCustomer: false,
      paymentReceived: true,
    },
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName,
        supportEmail: settings.supportEmail,
        currency: settings.currency,
        timezone: settings.timezone,
        notifications: {
          newOrder: settings.notifications.newOrder ?? true,
          lowStock: settings.notifications.lowStock ?? true,
          newCustomer: settings.notifications.newCustomer ?? false,
          paymentReceived: settings.notifications.paymentReceived ?? true,
        },
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(formData, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="d-flex justify-content-start" style={{ padding: "1.5rem", paddingLeft: "2.5rem" }}>
      <div style={{ maxWidth: "42rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="d-flex justify-content-end">
          <button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="btn btn-indigo d-inline-flex align-items-center gap-2"
          >
            <Save size={16} />
            {saved ? "Saved!" : updateSettings.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "var(--sa-card-bg)",
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body" style={{ padding: "1.5rem" }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Globe size={20} style={{ color: "var(--sa-indigo)" }} />
              <h5 className="fw-semibold mb-0" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                General
              </h5>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Support Email
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="form-select"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="form-select"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "var(--sa-card-bg)",
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body" style={{ padding: "1.5rem" }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Bell size={20} style={{ color: "var(--sa-indigo)" }} />
              <h5 className="fw-semibold mb-0" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                Notifications
              </h5>
            </div>

            {[
              { key: "newOrder", label: "New order placed", desc: "Get notified when a new order is created" },
              { key: "lowStock", label: "Low stock alert", desc: "Alert when product stock falls below threshold" },
              { key: "newCustomer", label: "New customer signup", desc: "Notify when a new customer registers" },
              { key: "paymentReceived", label: "Payment received", desc: "Confirm when payment is successfully processed" },
            ].map((item) => (
              <div key={item.key} className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <p className="mb-0 small fw-medium" style={{ color: "var(--sa-text-primary)" }}>
                    {item.label}
                  </p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                    {item.desc}
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={(formData.notifications as any)[item.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          [item.key]: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: "var(--sa-card-bg)",
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body" style={{ padding: "1.5rem" }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Shield size={20} style={{ color: "var(--sa-indigo)" }} />
              <h5 className="fw-semibold mb-0" style={{ fontSize: "1.125rem", color: "var(--sa-text-primary)" }}>
                Security
              </h5>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-control"
                style={{
                  borderColor: "var(--sa-slate-200)",
                  backgroundColor: "var(--sa-card-bg)",
                  color: "var(--sa-text-primary)",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              />
            </div>
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-card-bg)",
                    color: "var(--sa-text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}