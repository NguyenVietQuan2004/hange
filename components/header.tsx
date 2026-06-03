"use client";

import { useState } from "react";
import { useAuth } from "@/hook/auth-provider";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { User, User2Icon } from "lucide-react";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // ================== CONFIG ==================
  const appName = "Hange";
  const logoSrc = "/image/logo.png";
  const defaultAvatar = "/image/default.png";

  const dropdownItems = [
    {
      label: "Personal information",
      href: "/me",
      show: true,
    },
    {
      label: "My bookings",
      href: "/me/my-bookings",
      show: true,
    },
    {
      label: "RBAC Management",
      href: "/admin/rbac/roles",
      show: user?.role?.includes("ADMIN"),
    },
    {
      label: "Service Management",
      href: "/admin/categories",
      show: user?.role?.includes("ADMIN"),
    },
  ];

  return (
    <header className="w-full px-6 py-4 border-b border-border bg-background text-foreground flex justify-between items-center">
      {/* LOGO */}
      <div className="flex items-center gap-1.5">
        <Image src={logoSrc} alt="logo" width={100} height={100} className="rounded-full w-8 h-8 select-none" />
        <Link href="/" className="font-bold text-2xl text-foreground">
          {appName}
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {loading ? (
          <Image
            src={defaultAvatar}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full w-8 h-8 select-none border border-border"
          />
        ) : user ? (
          <div className="relative">
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
              <Image
                src={user.avatarUrl || defaultAvatar}
                alt="avatar"
                width={100}
                height={100}
                className="rounded-full w-8 h-8 hover:brightness-95 duration-500"
              />
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground border border-border rounded-lg shadow-md z-50 overflow-hidden py-1">
                {dropdownItems.map(
                  (item) =>
                    item.show && (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ),
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-destructive hover:bg-muted transition-colors"
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
