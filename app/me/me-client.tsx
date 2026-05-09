"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hook/auth-provider";
import FooterLayout from "@/components/layout/footer-layout";
import ChangePasswordPage from "../change-password/page";
import { systemService } from "@/services/system.service";
import { userService } from "@/services/user.service";

const userFields = [
  { key: "email", label: "Email" },
  { key: "fullName", label: "Full name" },
  { key: "phone", label: "Phone" },
  { key: "avatarUrl", label: "Avatar URL", disable: true },
  { key: "address", label: "Address" },
];

export default function MeClientPage() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState<"profile" | "password">("profile");

  if (!user) return null;

  return (
    <FooterLayout>
      <div className="min-h-screen bg-background text-foreground px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Center</h1>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="min-w-72">
              <div className="bg-card border border-border rounded-2xl p-2 sticky top-6">
                <button
                  onClick={() => setTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3
                    ${
                      tab === "profile" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                    }`}
                >
                  Personal Information
                </button>

                <button
                  onClick={() => setTab("password")}
                  className={`w-full text-left px-4 py-3 mt-1 rounded-xl text-sm font-medium transition-all flex items-center gap-3
                    ${
                      tab === "password" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                    }`}
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="flex-1 bg-card border border-border rounded-2xl p-2 md:p-8">
              {tab === "profile" ? <ProfileTab user={user} setUser={setUser} /> : <ChangePasswordPage />}
            </div>
          </div>
        </div>
      </div>
    </FooterLayout>
  );
}

function ProfileTab({ user, setUser }: { user: any; setUser: any }) {
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    address: user.address || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let avatarUrl = form.avatarUrl;

      if (avatarFile) {
        const res = await systemService.uploadFile({
          file: avatarFile,
          folder: "avatar",
        });
        avatarUrl = res.filename;
      }

      const userUpdated = await userService.updateProfile({
        ...form,
        avatarUrl,
      });

      setUser(userUpdated);
      setForm((prev) => ({ ...prev, avatarUrl }));

      setEditMode(false);
      setAvatarFile(null);
      setPreviewUrl(null);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <Image
            src={previewUrl || form.avatarUrl || "/image/default.png"}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full object-cover "
          />
        </div>

        {editMode && (
          <div>
            <label className="cursor-pointer bg-muted hover:bg-accent transition px-5 py-2.5 rounded-xl text-sm font-medium inline-block">
              Choose New Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 border-b border-border">
          <span className="text-muted-foreground w-32 shrink-0">Email</span>
          <span className="font-medium text-foreground">{user.email}</span>
        </div>

        {userFields
          .filter((f) => f.key !== "email")
          .map((field) => (
            <div
              key={field.key}
              className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 border-b border-border last:border-none"
            >
              <span className="text-muted-foreground w-32 shrink-0 ">{field.label}</span>

              {editMode && !field.disable ? (
                <input
                  value={(form as any)[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <span className="font-medium line-clamp-1 text-foreground flex-1">
                  {(form as any)[field.key] || "-"}
                </span>
              )}
            </div>
          ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-6">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => {
                setEditMode(false);
                setAvatarFile(null);
                setPreviewUrl(null);
              }}
              className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
