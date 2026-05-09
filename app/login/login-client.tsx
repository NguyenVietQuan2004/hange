"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/auth-provider";
import { ERROR_CODE } from "@/const/error-code";
import FooterLayout from "@/components/layout/footer-layout";
import { authService } from "@/services/auth.service";
import { AppuleIcon, GoogleIcon } from "@/public/icons";

export default function LoginClientPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found to resend verification");
      return;
    }
    await authService.resendVerification(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      setUser(data.userDTO);
      await authService.loginNextServer({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      router.push("/");
    } catch (err: any) {
      if ([ERROR_CODE.INVALID_CREDENTIALS, ERROR_CODE.USER_NOT_FOUND].includes(err.message)) {
        toast.error("Account information is incorrect");
      } else if (ERROR_CODE.USER_NOT_ACTIVE === err.message) {
        try {
          await handleResend();
          toast.error("Your account is not activated. Please check your email to activate it.");
        } catch {
          toast.error("Failed to resend verification email");
        }
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FooterLayout>
      <div className=" flex p-4 justify-center bg-background text-foreground">
        <div className="w-full max-w-sm mt-20">
          <div className="flex justify-center mb-6">
            <Image alt="" src={"/image/logo.png"} width={48} height={48} className="w-12 h-12 rounded-full bg-card" />
          </div>
          <h1 className="text-center text-xl font-bold mb-6">Sign in to your Hange</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Email address</label>
              <input
                className="mt-1 w-full px-3 py-2  border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                type="password"
                className="mt-1 w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:opacity-90 transition py-2 rounded-md font-medium"
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
