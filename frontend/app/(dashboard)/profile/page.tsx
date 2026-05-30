"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth.api";
import { useUploadFile } from "@/hooks/useUpload";

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const uploadAvatar = useUploadFile("/api/auth/avatar", "avatar");

  const updateProfile = useMutation({
    mutationFn: async (data: { name: string; email: string; avatar?: string }) => {
      return authApi.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setSelectedFile(null);
      alert("Profile updated successfully");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    let avatarUrl = avatarPreview;

    if (selectedFile) {
      try {
        avatarUrl = await uploadAvatar.mutateAsync(selectedFile);
      } catch (error) {
        alert("Failed to upload avatar");
        return;
      }
    }

    updateProfile.mutate({ name, email, avatar: avatarUrl || undefined });
  };

  if (isLoading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="d-flex justify-content-center" style={{ padding: "1.5rem" }}>
      <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div
          className="card"
          style={{
            backgroundColor: "var(--sa-card-bg)",
            border: "1px solid var(--sa-slate-200)",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body text-center" style={{ padding: "2rem 1.5rem" }}>
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center overflow-hidden"
                style={{
                  width: 96,
                  height: 96,
                  backgroundColor: "var(--sa-indigo)", 
                  color: "#fff",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  user?.name?.charAt(0) || "A"
                )}
              </div>
              <button
                className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm"
                style={{ width: 32, height: 32 }}
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                <Camera size={16} className="text-muted" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <h5 className="fw-semibold mb-1" style={{ color: "var(--sa-text-primary)" }}>
              {user?.name || "Alex Johnson"}
            </h5>
            <p className="text-muted small mb-0">{user?.role || "Super Admin"}</p>
            {selectedFile && (
              <p className="text-muted small mt-2 mb-0">
                New photo selected – click Save to apply.
              </p>
            )}
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
            <h5 className="fw-semibold mb-4" style={{ color: "var(--sa-text-primary)" }}>
              Personal Information
            </h5>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || "Super Admin"}
                  disabled
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-slate-100)",
                    color: "var(--sa-text-secondary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label small fw-medium" style={{ color: "var(--sa-text-secondary)" }}>
                  Status
                </label>
                <input
                  type="text"
                  value="Active"
                  disabled
                  className="form-control"
                  style={{
                    borderColor: "var(--sa-slate-200)",
                    backgroundColor: "var(--sa-slate-100)",
                    color: "var(--sa-text-secondary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending || uploadAvatar.isPending}
                className="btn btn-indigo d-inline-flex align-items-center gap-2"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}