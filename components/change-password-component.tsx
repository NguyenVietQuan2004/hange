"use client";

import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE } from "@/const/error-code";
import { authService } from "@/services/auth.service";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

export default function ChangePasswordComponent() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [option, setOption] = useState<"KEEP_ALL" | "KEEP_CURRENT">("KEEP_ALL");

  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    }),
    [newPassword],
  );

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password does not match");
      return;
    }

    setLoading(true);

    try {
      const tokenRes = await authService.getTokens();

      const { accessToken, refreshToken } = tokenRes;

      await authService.changePassword(accessToken, {
        oldPassword,
        refreshToken,
        newPassword,
        option,
      });

      toast.success("Password changed successfully");

      router.push("/login");
    } catch (err: any) {
      if (err.message === ERROR_CODE.WRONG_PASSWORD) {
        toast.error("Current password is incorrect");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center pb-10 px-2px-4 bg-background text-foreground">
      <div className="w-full max-w-130 bg-card rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-border p-8 md:p-10">
        {/* HEADER */}
        <div>
          <h1 className="font-bold tracking-tight">Change your password</h1>

          <p className="mt-4 text-muted-foreground">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-10">
          {/* OLD PASSWORD */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">Current Password</label>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full h-10 rounded-xl border border-border bg-background pl-12 pr-14 outline-none focus:border-ring"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="mb-6">
            <label className="block font-semibold mb-3">New Password</label>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-10 rounded-xl border border-border bg-background pl-12 pr-14 outline-none focus:border-ring"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM */}
          <div>
            <label className="block font-semibold mb-3">Confirm New Password</label>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-10 rounded-xl border border-border bg-background pl-12 pr-14 outline-none focus:border-ring"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* STRENGTH BAR */}
          <div className="mt-6 flex gap-0.5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full transition-all
                ${passwordStrength >= item ? "bg-green-500" : "bg-border"}`}
              />
            ))}
          </div>

          {/* REQUIREMENTS */}
          <div className="mt-6">
            <p className="text-muted-foreground mb-4">Password should contain:</p>

            <div className="space-y-4">
              <Requirement valid={passwordChecks.length} text="8 or more characters" />

              <Requirement valid={passwordChecks.uppercase} text="At least 1 uppercase letter" />

              <Requirement valid={passwordChecks.lowercase} text="At least 1 lowercase letter" />

              <Requirement valid={passwordChecks.number} text="At least 1 number" />

              <Requirement valid={passwordChecks.special} text="At least 1 special character" />
            </div>
          </div>

          {/* SESSION OPTION */}
          <div className="mt-8 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                value="KEEP_ALL"
                checked={option === "KEEP_ALL"}
                onChange={() => setOption("KEEP_ALL")}
                className="mt-1 accent-primary"
              />

              <span className="text-muted-foreground">Keep all other sessions active</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                value="KEEP_CURRENT"
                checked={option === "KEEP_CURRENT"}
                onChange={() => setOption("KEEP_CURRENT")}
                className="mt-1 accent-primary"
              />

              <span className="text-muted-foreground">Keep only current device (logout others)</span>
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold mt-10 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Requirement({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2
        size={22}
        className={valid ? "text-green-500" : "text-border"}
        fill={valid ? "currentColor" : "transparent"}
      />

      <span className={valid ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </div>
  );
}
