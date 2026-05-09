"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto  border-t border-border bg-background text-muted-foreground text-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <Link href="#" className="hover:text-foreground transition">
          Terms
        </Link>

        <Link href="#" className="hover:text-foreground transition">
          Privacy
        </Link>

        <Link href="#" className="hover:text-foreground transition">
          Docs
        </Link>

        <Link href="#" className="hover:text-foreground transition">
          Contact Support
        </Link>

        <Link href="#" className="hover:text-foreground transition">
          Manage cookies
        </Link>

        <Link href="#" className="hover:text-foreground transition">
          Do not share my personal information
        </Link>
      </div>
    </footer>
  );
}
