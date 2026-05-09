"use client";

import { useState } from "react";
import { useAuth } from "@/hook/auth-provider";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full px-6 py-4 border-b border-border bg-background text-foreground flex justify-between items-center">
      {/* LOGO */}
      <Link href="/" className="font-bold text-foreground">
        My App
      </Link>

      <div className="flex items-center gap-3">
        {loading ? (
          // <p className="text-muted-foreground">Loading...</p>

          <Image
            src={"/image/default.png"}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full  w-8 h-8 border border-border"
          />
        ) : user ? (
          <div className="relative">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
              <Image
                src={user.avatarUrl || "/image/default.png"}
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full w-8 h-8 hover:brightness-95 duration-500"
              />
            </div>
            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-popover text-popover-foreground border border-border rounded-lg shadow-md z-50 overflow-hidden">
                <Link
                  href={"/me"}
                  className="px-3 w-full block hover:bg-muted py-2 text-sm border-b border-border text-muted-foreground"
                >
                  Personal information
                </Link>
                {user.role?.includes("ADMIN") && (
                  <Link
                    href={"/role"}
                    className="px-3 w-full block hover:bg-muted py-2 text-sm border-b border-border text-muted-foreground"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-destructive hover:bg-muted transition"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-primary border-b border-transparent hover:border-primary transition-all duration-200"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="text-primary border border-border py-1 px-3 rounded-sm hover:border-primary hover:bg-accent transition-all duration-200"
            >
              Sign up
            </Link>
          </div>
        )}

        <ModeToggle />
      </div>
    </header>
  );
}
