"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { ERROR_CODE } from "@/const/error-code";
import FooterLayout from "@/components/layout/footer-layout";
import { authService } from "@/services/auth.service";
import { useSearchParams, useRouter, notFound } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      notFound();
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.resetPassword({
        token,
        newPassword: password,
      });

      setSuccess(true);
    } catch (err: any) {
      if ([ERROR_CODE.INVALID_TOKEN, ERROR_CODE.TOKEN_EXPIRED, ERROR_CODE.TOKEN_REVOKED].includes(err.message)) {
        setError("This reset link is no longer valid. Please request a new one.");
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const goForgotPassword = () => router.push("/forgot-password");
  const goLogin = () => router.push("/login");

  if (!token) {
    notFound();
  }

  return (
    <FooterLayout>
      <div className=" flex justify-center p-2 mt-20 bg-background text-foreground">
        <div className="w-full max-w-md ">
          <div className="flex justify-center mb-6">
            <Image alt="" src={"/image/logo.png"} width={48} height={48} className="w-12 h-12 rounded-full bg-card" />
          </div>
          <h1 className="text-center text-xl font-bold mb-6">Reset your password</h1>
          <div className="border border-border rounded-md p-4">
            {success ? (
              <div className="text-center space-y-4">
                <p className="text-green-500 font-semibold">Password reset successfully</p>

                <button
                  onClick={goLogin}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 transition py-2 rounded-md font-medium"
                >
                  Go to login
                </button>
              </div>
            ) : error ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">{error}</p>

                <button
                  onClick={goForgotPassword}
                  className="w-full bg-accent text-accent-foreground hover:opacity-90 transition py-2 rounded-md font-medium"
                >
                  Forgot password
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm">New password</label>
                  <input
                    type="password"
                    className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">Confirm password</label>
                  <input
                    type="password"
                    className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 transition py-2 rounded-md font-medium"
                >
                  {loading ? "Processing..." : "Reset password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </FooterLayout>
  );
}
