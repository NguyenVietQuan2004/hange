"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import FooterLayout from "@/components/layout/footer-layout";

export default function ForgotPasswordClientPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter email");
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FooterLayout>
      <div className=" flex flex-col mt-20 items-center justify-center px-4 bg-background text-foreground transition-colors">
        <div className="mb-6">
          <Image src="/image/logo.png" alt="logo" width={48} height={48} className="w-12 h-12 rounded-full bg-card" />
        </div>

        <h1 className="text-xl font-semibold mb-2">Reset your password</h1>

        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          Enter your account&apos;s verified email address and we will send you a password reset link.
        </p>

        {!success ? (
          <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>

              <input
                type="email"
                placeholder="Enter your email address"
                className="
                  mt-2 w-full px-3 py-2
                  bg-background text-foreground
                  border border-border
                  rounded-md
                  focus:outline-none focus:border-primary
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-6 py-2 rounded-md font-medium
                bg-primary text-primary-foreground
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {loading ? "Sending..." : "Send password reset email"}
            </button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Remember password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center max-w-sm space-y-3">
            <p className="text-green-500 font-medium">Password reset email has been sent!</p>

            <p className="text-sm text-muted-foreground">Please check your email and follow instructions.</p>

            <Link href="/login" className="inline-block mt-3 text-primary hover:underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </FooterLayout>
  );
}
