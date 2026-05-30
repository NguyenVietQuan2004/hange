"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/auth-provider";
import { AppuleIcon, GoogleIcon } from "@/public/icons";
import { authService } from "@/services/auth/auth.service";
import FooterLayout from "@/components/layout/footer-layout";
import { RESEND_VERIFICATION_ERROR_MESSAGE } from "@/const/auth/resend-verification-error";
import { LOGIN_ERROR_MESSAGE, LOGIN_RESEND_VERIFICATION_ERRORS } from "@/const/auth/login-error";

export default function LoginClientPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleResendVerification = async () => {
    try {
      await authService.resendVerification(email);

      toast.success("Verification email has been sent. Please check your inbox.");
    } catch (err: any) {
      const errorCode = err?.response?.data?.code || err?.code || err?.message;

      const message = RESEND_VERIFICATION_ERROR_MESSAGE[errorCode] || "Failed to resend verification email.";

      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await authService.login({
        email,
        password,
      });

      setUser(data.userDTO);

      await authService.loginNextServer({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      router.push("/");
    } catch (err: any) {
      /**
       * Backend response example:
       * {
       *   code: "AUTH_INVALID_CREDENTIALS",
       *   message: "Invalid credentials"
       * }
       */

      const errorCode = err?.message || err?.response?.data?.code || err?.code;

      const message = LOGIN_ERROR_MESSAGE[errorCode] || "Something went wrong.";

      // resend verification flow
      if (LOGIN_RESEND_VERIFICATION_ERRORS.includes(errorCode)) {
        toast.error(message);
        await handleResendVerification();
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FooterLayout>
      <div className="flex p-4 justify-center bg-background text-foreground">
        <div className="w-full max-w-sm mt-20">
          <div className="flex justify-center mb-6">
            <Image alt="" src="/image/logo.png" width={48} height={48} className="w-12 h-12 rounded-full bg-card" />
          </div>

          <h1 className="text-center text-xl font-bold mb-6">Sign in to your Hange</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Email address</label>

              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <label>Password</label>

                <Link href="/forgot-password" className="text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 transition py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-border" />

            <span className="px-3 text-muted-foreground text-sm">or</span>

            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-md hover:bg-accent transition">
              <GoogleIcon width={16} height={16} />
              Continue with Google
            </button>

            <button className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-md hover:bg-accent transition">
              <AppuleIcon width={16} height={16} />
              Continue with Apple
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to system?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </FooterLayout>
  );
}
