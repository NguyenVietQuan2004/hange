"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ERROR_CODE } from "@/const/error-code";
import FooterLayout from "@/components/layout/footer-layout";
import { authService } from "@/services/auth.service";
import { useSearchParams, useRouter, notFound } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      notFound();
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);

        setStatus("success");
        setMessage("Your email has been successfully verified");
      } catch (err: any) {
        setStatus("error");

        if ([ERROR_CODE.USED_TOKEN, ERROR_CODE.TOKEN_EXPIRED, ERROR_CODE.INVALID_TOKEN].includes(err.message)) {
          setMessage("The verification link has expired. Please try again.");
        } else {
          setMessage("Something went wrong...");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <FooterLayout>
      {/* ROOT THEME */}
      <div className=" flex justify-center mt-20 bg-background text-foreground px-4">
        <div className="w-full max-w-sm ">
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <Image alt="" src={"/image/logo.png"} width={48} height={48} className="w-12 h-12 rounded-full" />
          </div>

          <h1 className="text-center text-xl font-bold mb-6">Verify your email</h1>

          {/* CARD */}
          <div className="border border-border rounded-md p-6 text-center">
            {/* LOADING */}
            {status === "loading" && (
              <div className="space-y-3">
                <div className="w-6 h-6 border-2 border-muted-foreground border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Verifying your email...</p>
              </div>
            )}

            {/* SUCCESS */}
            {status === "success" && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Email verified</h2>

                <p className="text-sm text-muted-foreground">{message}</p>

                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 transition py-2 rounded-md font-medium mt-4"
                >
                  Continue to sign in
                </button>
              </div>
            )}

            {/* ERROR */}
            {status === "error" && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Verification failed</h2>

                <p className="text-sm text-muted-foreground">{message}</p>

                <Link
                  href="/forgot-password"
                  className="block w-full border border-border py-2 rounded-md text-sm font-medium hover:bg-accent mt-4"
                >
                  Back to forgot password
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </FooterLayout>
  );
}
