"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/hook/auth-provider";
import { systemService } from "@/services/system.service";
import { userService } from "@/services/user.service";
import { User, LockKeyhole, Mail, Phone, MapPin, Pencil, Upload } from "lucide-react";
import ChangePasswordComponent from "@/components/change-password-component";

const userFields = [
  { key: "email", label: "Email", icon: Mail },
  { key: "fullName", label: "Full name", icon: User },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "avatarUrl", label: "Avatar URL", disable: true },
  { key: "address", label: "Address", icon: MapPin },
];

export default function MeClientPage() {
  const { user, setUser } = useAuth();

  const [tab, setTab] = useState<"profile" | "password">("profile");

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* LEFT NAV */}
        <aside className="hidden lg:flex w-1/3 min-h-screen border-r border-border shrink-0 bg-background">
          <div className="w-full px-10 py-8 flex flex-col items-end">
            <div className="w-full max-w-70">
              {/* USER */}
              <div className="flex items-center gap-4 mb-10">
                <Image
                  src={user.avatarUrl || "/image/default.png"}
                  alt="avatar"
                  width={56}
                  height={56}
                  className="rounded-full aspect-square object-cover border border-border"
                />

                <div className="min-w-0">
                  <h2 className="font-semibold truncate">{user.fullName || "Unnamed User"}</h2>

                  <p className="text-muted-foreground select-none cursor-pointer hover:text-foreground transition">
                    View profile
                  </p>
                </div>
              </div>

              {/* MENU */}
              <div className="space-y-1">
                <button
                  onClick={() => setTab("profile")}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition
                  ${
                    tab === "profile"
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User size={20} strokeWidth={1.8} />
                  <span className="font-medium">Personal Info</span>
                </button>

                <button
                  onClick={() => setTab("password")}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition
                  ${
                    tab === "password"
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LockKeyhole size={20} strokeWidth={1.8} />
                  <span className="font-medium">Login & Security</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 flex justify-start">
          <div className="w-full max-w-225 px-2 md:px-14 py-10">
            {/* HEADER */}
            <div>
              <h1 className="font-bold tracking-[-1px] text-xl select-none">Settings</h1>

              {/* TABS */}
              <div className="flex items-center gap-10 mt-5 border-b border-border">
                <button
                  onClick={() => setTab("profile")}
                  className={`pb-4 font-medium border-b-2 transition-all
                  ${
                    tab === "profile"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Personal Info
                </button>

                <button
                  onClick={() => setTab("password")}
                  className={`pb-4 font-medium border-b-2 transition-all
                  ${
                    tab === "password"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Login & Security
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="pt-3">
              {tab === "profile" ? <ProfileTab user={user} setUser={setUser} /> : <ChangePasswordComponent />}
            </div>
          </div>
        </main>
      </div>
    </div>
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

      setForm((prev) => ({
        ...prev,
        avatarUrl,
      }));

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
    <div>
      {/* AVATAR */}
      <div className="flex flex-col items-center md:flex-row  gap-6 pb-4 border-b border-border">
        <div className="relative">
          <Image
            src={previewUrl || form.avatarUrl || "/image/default.png"}
            alt="avatar"
            width={110}
            height={110}
            className="rounded-full object-cover aspect-square border-4 border-background shadow-md"
          />
        </div>

        <div className="flex-1">
          <h2 className="font-bold">{form.fullName || "Unnamed User"}</h2>

          <p className="text-muted-foreground mt-1">{user.email}</p>

          {editMode && (
            <div className="mt-5">
              <label className="inline-flex items-center gap-2 cursor-pointer bg-accent hover:opacity-90 transition px-5 py-3 rounded-xl font-medium">
                <Upload size={16} />
                Upload New Avatar
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

              <p className="text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>

        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-background text-foreground border border-border font-medium hover:opacity-90 transition"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* INFO LIST */}
      <div className="divide-y divide-border">
        {userFields
          .filter((f) => f.key !== "avatarUrl")
          .map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.key} className="py-3 flex flex-col lg:flex-row lg:items-center gap-5">
                <div className="w-full lg:w-55 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    {Icon && <Icon size={18} className="text-muted-foreground" />}
                  </div>

                  <span className="font-medium text-muted-foreground">{field.label}</span>
                </div>

                <div className="flex-1">
                  {field.key === "email" ? (
                    <p className="font-semibold break-all">{user.email}</p>
                  ) : editMode && !field.disable ? (
                    <input
                      value={(form as any)[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <p className="font-semibold">{(form as any)[field.key] || "_"}</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* ACTIONS */}
      {editMode && (
        <div className="flex flex-wrap items-center gap-4 pt-10">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 h-10 rounded-lg bg-background text-foreground border border-border font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => {
              setEditMode(false);

              setAvatarFile(null);

              setPreviewUrl(null);
            }}
            className="px-6 h-10 rounded-lg border border-border bg-background hover:bg-accent font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
