"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { ERROR_CODE } from "@/const/error-code";
import { authService } from "@/services/auth.service";
import { AppuleIcon, GoogleIcon } from "@/public/icons";

const listService = [
  { title: "Access to GitHub Copilot", desc: "Increase productivity and accelerate development." },
  { title: "Unlimited repositories", desc: "Collaborate securely on projects." },
  { title: "Integrated code reviews", desc: "Improve code quality with reviews." },
  { title: "Automated workflows", desc: "CI/CD with GitHub Actions." },
  { title: "Community support", desc: "Connect with developers worldwide." },
];

export default function RegisterClientPage() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      await authService.register({
        email: form.email,
        password: form.password,
      });

      setSuccess(true);
      toast.success("Register success! Please check your email.");
    } catch (err: any) {
      if (err.message === ERROR_CODE.EMAIL_ALREADY_EXISTS) {
        toast.error("Email already exists");
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 bg-background text-foreground">
      {/* left */}
      <div
        className="hidden min-h-screen md:flex flex-col justify-between p-20 relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/image/bg.webp')",
        }}
      >
        <div className="relative z-20">
          <h1 className="text-3xl font-bold mb-4">Create your free account</h1>

          <p className="text-muted-foreground mb-4">Explore system features for developers.</p>

          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            See what’s included {showFeatures ? "↑" : "↓"}
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${showFeatures ? "opacity-100 mt-6" : "opacity-0"}`}
          >
            <div className="space-y-5 text-sm">
              {listService.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span>✔</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <img
          src="/image/subbg.webp"
          alt="animals"
          className="absolute bottom-0  w-150 z-10 pointer-events-none select-none"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-0" />
      </div>

      {/* RIGHT */}
      <div className="bg-background text-foreground">
        <div className="flex justify-end py-4 px-10 text-sm">
          <span className="mr-2 text-muted-foreground">Already have an account?</span>

          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in →
          </Link>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6">Sign up</h2>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-md hover:bg-accent">
                <GoogleIcon width={16} height={16} />
                Continue with Google
              </button>

              <button className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-md hover:bg-accent">
                <AppuleIcon width={16} height={16} />
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="px-3 text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {success ? (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Check your email</h2>

                <p className="text-muted-foreground text-sm">
                  We sent a verification link to <b>{form.email}</b>
                </p>

                <Link
                  href="/login"
                  className="w-full block bg-primary text-primary-foreground py-2 rounded-md text-center"
                >
                  Go to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-sm">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background focus:ring-1 focus:ring-ring"
                  />

                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters with number + letter
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                >
                  {loading ? "Creating account..." : "Create account →"}
                </button>

                <p className="text-xs text-center md:text-start text-muted-foreground">
                  By creating an account, you agree to the Terms & Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
