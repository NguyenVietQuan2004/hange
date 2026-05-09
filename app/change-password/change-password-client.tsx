"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ERROR_CODE } from "@/const/error-code";
import { authService } from "@/services/auth.service";

export default function ChangePasswordClientPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [option, setOption] = useState<"KEEP_ALL" | "KEEP_CURRENT">("KEEP_ALL");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-2 md:px-4 md:py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Image alt="Logo" src="/image/logo.png" width={56} height={56} className="w-14 h-14 rounded-2xl " />
        </div>

        <h1 className="text-center text-2xl font-bold mb-2">Change Password</h1>
        <p className="text-center text-muted-foreground mb-8">Please enter your new password</p>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Old Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="border border-border bg-muted/30 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">After changing password:</p>

              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="KEEP_ALL"
                  checked={option === "KEEP_ALL"}
                  onChange={() => setOption("KEEP_ALL")}
                  className="accent-primary"
                />
                <span>Keep all other sessions active</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm">
                <input
                  type="radio"
                  value="KEEP_CURRENT"
                  checked={option === "KEEP_CURRENT"}
                  onChange={() => setOption("KEEP_CURRENT")}
                  className="accent-primary"
                />
                <span>Keep only current device (logout others)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-70"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          After successful change, you will be redirected to login page
        </p>
      </div>
    </div>
  );
}
